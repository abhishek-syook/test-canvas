import HistoryToolbar from "components/toolbar/historyToolbar";
import useHistory from "hooks/useHistory";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import {
  adjustElementCoordinates,
  adjustmentRequired,
  createElement,
  cursorForPosition,
  drawElement,
  getElementAtPosition,
  getRadius,
  nearPoint,
  resizedCoordinates,
} from "utils/roughHelper";
import { ACTIONS, CURSOR, CURSOR_POSITION, ELEMENT_TYPES, KEYBOARD_KEYS } from "../../constants";

import Toolbar from "../toolbar";
import cloneDeep from "utils/cloneDeep";

const CanvasDrawing = () => {
  const canvasRef = useRef();
  const textAreaRef = useRef();
  const [elements, setElements, undo, redo] = useHistory([]);
  const [action, setAction] = useState(false);
  const [tool, setTool] = useState(ELEMENT_TYPES.CIRCLE);
  const [selectedElement, setSelectedElement] = useState(null);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);

    elements.forEach(element => {
      if (action === ACTIONS.WRITING && selectedElement.id === element.id) {
        return;
      }
      drawElement(context, element, selectedElement);
    });
  }, [elements, action, selectedElement]);

  useEffect(() => {
    const undoRedoFunction = event => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === KEYBOARD_KEYS.Z) {
        if (event.shiftKey) {
          redo();
        } else {
          undo();
        }
      }

      if ([KEYBOARD_KEYS.ESCAPE, KEYBOARD_KEYS.ENTER].includes(event.key.toLowerCase())) {
        setAction(ACTIONS.NONE);
        setSelectedElement(null);
      }
    };
    document.addEventListener("keydown", undoRedoFunction);
    return () => {
      document.removeEventListener("keydown", undoRedoFunction);
    };
  }, [undo, redo]);

  useEffect(() => {
    if (action === ACTIONS.WRITING) {
      textAreaRef.current.focus();
      textAreaRef.current.value = selectedElement.text;
    }
  }, [action, selectedElement]);

  const updateElement = (id, x1, y1, x2, y2, type, options) => {
    const elementsCopy = [...elements];

    switch (type) {
      case ELEMENT_TYPES.RECTANGLE:
      case ELEMENT_TYPES.LINE:
        elementsCopy[id] = createElement(id, x1, y1, x2, y2, type);
        break;

      case ELEMENT_TYPES.PENCIL:
      case ELEMENT_TYPES.POLYGON:
      case ELEMENT_TYPES.POLYLINE:
        elementsCopy[id].points = [...elementsCopy[id].points, { x: x2, y: y2 }];
        break;

      case ELEMENT_TYPES.TEXT:
        const textWidth = canvasRef.current.getContext("2d").measureText(options.text).width;
        const textHeight = 24;
        elementsCopy[id] = {
          ...createElement(id, x1, y1, x1 + textWidth, y1 + textHeight, type),
          text: options.text,
        };
        break;

      case ELEMENT_TYPES.CIRCLE:
        elementsCopy[id] = createElement(id, x1, y1, x2, y2, type);
        break;

      default:
        throw Error(`Type not recognised: ${type}`);
    }

    setElements(elementsCopy, true);
  };

  const handleMouseDown = event => {
    if (action === ACTIONS.WRITING) return;

    const { clientX, clientY } = event;
    if (tool === ELEMENT_TYPES.SELECTION) {
      const element = getElementAtPosition(clientX, clientY, elements);
      if (element) {
        if (
          [ELEMENT_TYPES.PENCIL, ELEMENT_TYPES.POLYGON, ELEMENT_TYPES.POLYLINE].includes(
            element.type
          )
        ) {
          const xOffsets = element.points.map(point => clientX - point.x);
          const yOffsets = element.points.map(point => clientY - point.y);
          setSelectedElement({ ...element, xOffsets, yOffsets });
        } else if (ELEMENT_TYPES.CIRCLE === element.type) {
          const offsetX = clientX - element.x;
          const offsetY = clientY - element.y;
          setSelectedElement({ ...element, offsetX, offsetY });
        } else {
          const offsetX = clientX - element.x1;
          const offsetY = clientY - element.y1;
          setSelectedElement({ ...element, offsetX, offsetY });
        }
        setElements(prevState => prevState);

        if (element.position === CURSOR_POSITION.INSIDE) {
          setAction(ACTIONS.MOVING);
        } else {
          setAction(ACTIONS.RESIZING);
        }
      }
    } else {
      if ([ELEMENT_TYPES.POLYGON, ELEMENT_TYPES.POLYLINE].includes(selectedElement?.type)) {
        const index = elements.length - 1;
        const { x1, y1 } = elements[index];
        updateElement(index, x1, y1, clientX, clientY, tool);
      } else {
        const id = elements.length;
        const element = createElement(id, clientX, clientY, clientX, clientY, tool);
        setElements(p => [...p, element]);
        setSelectedElement(element);

        setAction(tool === ELEMENT_TYPES.TEXT ? ACTIONS.WRITING : ACTIONS.DRAWING);
      }
    }
  };

  const handleMouseMove = event => {
    const { clientX, clientY } = event;

    if (tool === ELEMENT_TYPES.SELECTION) {
      const element = getElementAtPosition(clientX, clientY, elements);
      event.target.style.cursor = element ? cursorForPosition(element.position) : CURSOR.DEFAULT;
    }

    if (action === ACTIONS.DRAWING) {
      if ([ELEMENT_TYPES.POLYGON, ELEMENT_TYPES.POLYLINE].includes(selectedElement.type)) {
        const index = elements.length - 1;
        const { x1, y1 } = elements[index];
        if (selectedElement.points.length > 1) {
          selectedElement.points = selectedElement.points.splice(
            0,
            selectedElement.points.length - 1
          );
        }
        updateElement(index, x1, y1, clientX, clientY, tool);
      } else if (ELEMENT_TYPES.CIRCLE === selectedElement.type) {
        const { id, x, y } = selectedElement;
        const elementsCopy = [...elements];
        const radius = getRadius(x, y, clientX, clientY);
        elementsCopy[id] = { ...elementsCopy[id], radius: radius };
        setElements(elementsCopy, true);
      } else {
        const index = elements.length - 1;
        const { x1, y1 } = elements[index];
        updateElement(index, x1, y1, clientX, clientY, tool);
      }
    } else if (action === ACTIONS.MOVING) {
      if (
        [ELEMENT_TYPES.PENCIL, ELEMENT_TYPES.POLYGON, ELEMENT_TYPES.POLYLINE].includes(
          selectedElement.type
        )
      ) {
        const newPoints = selectedElement.points.map((_, index) => ({
          x: clientX - selectedElement.xOffsets[index],
          y: clientY - selectedElement.yOffsets[index],
        }));

        const elementsCopy = [...elements];
        elementsCopy[selectedElement.id] = {
          ...elementsCopy[selectedElement.id],
          points: newPoints,
        };
        setElements(elementsCopy, true);
      } else if ([ELEMENT_TYPES.CIRCLE].includes(selectedElement.type)) {
        const { id, offsetX, offsetY } = selectedElement;
        const elementsCopy = [...elements];
        elementsCopy[id] = { ...elementsCopy[id], x: clientX - offsetX, y: clientY - offsetY };
        setElements(elementsCopy, true);
      } else {
        const { id, x1, y1, x2, y2, type, offsetX, offsetY } = selectedElement;
        const width = x2 - x1;
        const height = y2 - y1;
        const newX = clientX - offsetX;
        const newY = clientY - offsetY;
        const options = type === ELEMENT_TYPES.TEXT ? { text: selectedElement.text } : {};

        updateElement(id, newX, newY, newX + width, newY + height, type, options);
      }
    } else if (action === ACTIONS.RESIZING) {
      if ([ELEMENT_TYPES.POLYGON, ELEMENT_TYPES.POLYLINE].includes(selectedElement.type)) {
        const hasPointOver = selectedElement.points.map((point, index) => {
          return nearPoint(clientX, clientY, point.x, point.y, "start");
        });

        const index = hasPointOver.indexOf("start");
        if (index > -1) {
          const selectedElementCopy = cloneDeep(selectedElement);
          const newPoints = selectedElementCopy.points;
          newPoints[index] = { x: clientX, y: clientY };
          const elementsCopy = cloneDeep(elements);
          elementsCopy[selectedElement.id] = {
            ...elementsCopy[selectedElement.id],
            points: newPoints,
          };
          setSelectedElement(selectedElementCopy);
          setElements(elementsCopy, true);
        }
      } else if (ELEMENT_TYPES.CIRCLE === selectedElement.type) {
        const { id, x, y } = selectedElement;
        const elementsCopy = [...elements];
        const radius = getRadius(x, y, clientX, clientY);
        elementsCopy[id] = { ...elementsCopy[id], radius: radius };
        setElements(elementsCopy, true);
      } else {
        const { id, type, position, ...coordinates } = selectedElement;
        console.log(
          ">>>>>>>>>",
          clientX,
          clientY,
          position,
          coordinates,
          resizedCoordinates(clientX, clientY, position, coordinates)
        );
        const { x1, y1, x2, y2 } = resizedCoordinates(clientX, clientY, position, coordinates);
        updateElement(id, x1, y1, x2, y2, type);
      }
    }
  };

  const handleMouseUp = event => {
    const { clientX, clientY } = event;
    if (selectedElement) {
      if (
        selectedElement.type === ELEMENT_TYPES.TEXT &&
        clientX - selectedElement.offsetX === selectedElement.x1 &&
        clientY - selectedElement.offsetY === selectedElement.y1
      ) {
        setAction(ACTIONS.WRITING);
        return;
      }

      const index = selectedElement.id;
      const { id, type } = elements[index];

      if ((action === ACTIONS.DRAWING || action === ACTIONS.RESIZING) && adjustmentRequired(type)) {
        const { x1, y1, x2, y2 } = adjustElementCoordinates(elements[index]);
        updateElement(id, x1, y1, x2, y2, type);
      }
    }

    if (action === ACTIONS.WRITING) return;
    if (
      action === ACTIONS.DRAWING &&
      [ELEMENT_TYPES.POLYGON, ELEMENT_TYPES.POLYLINE].includes(selectedElement.type)
    )
      return;

    setAction(ACTIONS.NONE);
    setSelectedElement(null);
  };

  const handleTextBlur = event => {
    const { id, x1, y1, type } = selectedElement;

    setAction(ACTIONS.NONE);
    setSelectedElement(null);
    updateElement(id, x1, y1, null, null, type, {
      text: event.target.value,
    });
  };

  return (
    <>
      <Toolbar selectedTool={tool} onChange={value => setTool(value)} />
      {action === ACTIONS.WRITING ? (
        <textarea
          ref={textAreaRef}
          onBlur={handleTextBlur}
          style={{
            top: selectedElement.y1 - 3,
            left: selectedElement.x1,
            font: "24px sans-serif",
            margin: 0,
            border: 0,
            outline: 0,
            padding: 0,
            resize: "auto",
            position: "fixed",
            overflow: "hidden",
            whiteSpace: "pre",
            background: "transparent",
          }}
        />
      ) : null}
      <canvas
        ref={canvasRef}
        style={{ background: "cyan" }}
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      />
      <HistoryToolbar undo={undo} redo={redo} />
    </>
  );
};

export default CanvasDrawing;
