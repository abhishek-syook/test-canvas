import HistoryToolbar from "components/toolbar/historyToolbar";
import useHistory from "hooks/useHistory";
import { useEffect, useLayoutEffect, useRef, useState, useCallback } from "react";

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
  diffPoints,
  addPoints,
  scalePoint,
  updatedPoints
} from "utils/roughHelper";
import { ACTIONS, CURSOR, CURSOR_POSITION, ELEMENT_TYPES, KEYBOARD_KEYS, ORIGIN, ZOOM_SENSITIVITY } from "../../constants";

import Toolbar from "../toolbar";
import cloneDeep from "utils/cloneDeep";
import drawGrid from "utils/drawGrid";
import GridToolbar from "components/toolbar/gridToolbar";
import ZoomToolbar from "components/toolbar/zoomToolbar";

const CanvasDrawing = (props) => {  
  const canvasRef = useRef();
  const textAreaRef = useRef();
  const [elements, setElements, undo, redo] = useHistory([]);
  const [action, setAction] = useState(false);
  const [tool, setTool] = useState(ELEMENT_TYPES.SELECTION);
  const [selectedElement, setSelectedElement] = useState(null);
  const [gridObj, setGridObj] = useState({ isEnable: false, snapSize: 10 });
  const [context, setContext] = useState(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState(ORIGIN);
  const [mousePos, setMousePos] = useState(ORIGIN);
  const [viewportTopLeft, setViewportTopLeft] = useState(ORIGIN);
  const isResetRef = useRef(false);
  const lastMousePosRef = useRef(ORIGIN);
  const lastOffsetRef = useRef(ORIGIN);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);

    drawGrid({ context, ...gridObj });
    elements.forEach(element => {
      if (action === ACTIONS.WRITING && selectedElement.id === element.id) {
        return;
      }
      drawElement(context, element, selectedElement);
    });
  }, [elements, action, selectedElement, gridObj, scale, viewportTopLeft]);

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

  // update last offset
  useEffect(() => {
    lastOffsetRef.current = offset;
  }, [offset]);

  // reset
  const reset = useCallback(
    context => {
      if (context && !isResetRef.current) {
        // adjust for device pixel density
        context.canvas.width = props.canvasWidth;
        context.canvas.height = props.canvasHeight;
        context.scale(1, 1);
        setScale(1);

        // reset state and refs
        setContext(context);
        setOffset(ORIGIN);
        setMousePos(ORIGIN);
        setViewportTopLeft(ORIGIN);
        lastOffsetRef.current = ORIGIN;
        lastMousePosRef.current = ORIGIN;

        // this thing is so multiple resets in a row don't clear canvas
        isResetRef.current = true;
      }
    },
    [props.canvasWidth, props.canvasHeight]
  );

  // setup canvas and set context
  useLayoutEffect(() => {
    if (canvasRef.current) {
      // get new drawing context
      const renderCtx = canvasRef.current.getContext("2d");

      if (renderCtx) {
        reset(renderCtx);
      }
    }
  }, [reset, props.canvasHeight, props.canvasWidth]);

  // pan when offset or scale changes
  useLayoutEffect(() => {
    if (context && lastOffsetRef.current) {
      const offsetDiff = scalePoint(diffPoints(offset, lastOffsetRef.current), scale);
      context.translate(offsetDiff.x, offsetDiff.y);
      setViewportTopLeft(prevVal => diffPoints(prevVal, offsetDiff));
      isResetRef.current = false;
    }
  }, [context, offset, scale]);

  // add event listener on canvas for mouse position
  useEffect(() => {
    const canvasElem = canvasRef.current;
    if (canvasElem === null) {
      return;
    }

    function handleUpdateMouse(event) {
      event.preventDefault();
      if (canvasRef.current) {
        const viewportMousePos = { x: event.clientX, y: event.clientY };
        const topLeftCanvasPos = {
          x: canvasRef.current.offsetLeft,
          y: canvasRef.current.offsetTop,
        };
        setMousePos(diffPoints(viewportMousePos, topLeftCanvasPos));
      }
    }

    canvasElem.addEventListener("mousemove", handleUpdateMouse);
    canvasElem.addEventListener("wheel", handleUpdateMouse);
    return () => {
      canvasElem.removeEventListener("mousemove", handleUpdateMouse);
      canvasElem.removeEventListener("wheel", handleUpdateMouse);
    };
  }, []);

  // this is tricky. Update the viewport's "origin" such that
  // the mouse doesn't move during scale - the 'zoom point' of the mouse
  // before and after zoom is relatively the same position on the viewport
  const handleZoom = useCallback((event, zoomValue, mouseWheel = true) => {
    event.preventDefault();
    if (context) {
      const zoom = 1 - zoomValue / ZOOM_SENSITIVITY;
      let viewportTopLeftDelta
      if(mouseWheel){
        viewportTopLeftDelta = {
          x: (mousePos.x / scale) * (1 - 1 / zoom),
          y: (mousePos.y / scale) * (1 - 1 / zoom),
        };
      } else {
        viewportTopLeftDelta = {
          x: ((props.canvasWidth / 2) / scale) * (1 - 1 / zoom),
          y: ((props.canvasHeight / 2) / scale) * (1 - 1 / zoom),
        };
      }
      
      const newViewportTopLeft = addPoints(viewportTopLeft, viewportTopLeftDelta);

      const newScale = scale * zoom

      if (newScale > 0.1 && newScale < 30) {
        context.translate(viewportTopLeft.x, viewportTopLeft.y);
        context.scale(zoom, zoom);
        context.translate(-newViewportTopLeft.x, -newViewportTopLeft.y);

        setViewportTopLeft(newViewportTopLeft);
        setScale(scale * zoom);
        isResetRef.current = false;
      }
    } 
  }, [context, mousePos.x, mousePos.y, viewportTopLeft, scale, props.canvasHeight, props.canvasWidth])

  // add event listener on canvas for zoom
  useEffect(() => {
    const canvasElem = canvasRef.current;
    if (canvasElem === null) {
      return;
    }

    const handleWheel = (event) => {
      handleZoom(event, event.deltaY)
    }
      
    canvasElem.addEventListener("wheel", handleWheel);
    return () => canvasElem.removeEventListener("wheel", handleWheel);
  }, [handleZoom]);

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

      case ELEMENT_TYPES.GATEWAY:
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
    const { updatedX, updatedY } = updatedPoints(scale, { x: clientX, y: clientY }, viewportTopLeft)
    if (tool === ELEMENT_TYPES.SELECTION) {
      const element = getElementAtPosition(updatedX, updatedY, elements);
      if (element) {
        if (
          [ELEMENT_TYPES.PENCIL, ELEMENT_TYPES.POLYGON, ELEMENT_TYPES.POLYLINE].includes(
            element.type
          )
        ) {
          const xOffsets = element.points.map(point => updatedX - point.x);
          const yOffsets = element.points.map(point => updatedY - point.y);
          setSelectedElement({ ...element, xOffsets, yOffsets });
        } else if (ELEMENT_TYPES.CIRCLE === element.type) {
          const offsetX = updatedX - element.x;
          const offsetY = updatedY - element.y;
          setSelectedElement({ ...element, offsetX, offsetY });
        } else if (ELEMENT_TYPES.GATEWAY === element.type) {
          const offsetX = updatedX - element.point.x;
          const offsetY = updatedY - element.point.y;
          setSelectedElement({ ...element, offsetX, offsetY });
        } else {
          const offsetX = updatedX - element.x1;
          const offsetY = updatedY - element.y1;
          setSelectedElement({ ...element, offsetX, offsetY });
        }
        setElements(prevState => prevState);

        if (element.position === CURSOR_POSITION.INSIDE) {
          setAction(ACTIONS.MOVING);
        } else {
          setAction(ACTIONS.RESIZING);
        }
      } else {
        setAction(ACTIONS.PANNING)
        lastMousePosRef.current = { x: event.pageX, y: event.pageY };
      }
    } else {
      if ([ELEMENT_TYPES.POLYGON, ELEMENT_TYPES.POLYLINE].includes(selectedElement?.type)) {
        const index = elements.length - 1;
        const { x1, y1 } = elements[index];
        updateElement(index, x1, y1, updatedX, updatedY, tool);
      } else {
        const id = elements.length;
        const element = createElement(id, updatedX, updatedY, updatedX, updatedY, tool);
        setElements(p => [...p, element]);
        setSelectedElement(element);

        setAction(tool === ELEMENT_TYPES.TEXT ? ACTIONS.WRITING : ACTIONS.DRAWING);
      }
    }
  };

  const handleMouseMove = event => {
    const { clientX, clientY } = event;
    const { updatedX, updatedY } = updatedPoints(scale, { x: clientX, y: clientY }, viewportTopLeft)
    if (tool === ELEMENT_TYPES.SELECTION) {
      const element = getElementAtPosition(updatedX, updatedY, elements);
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
        updateElement(index, x1, y1, updatedX, updatedY, tool);
      } else if (ELEMENT_TYPES.CIRCLE === selectedElement.type) {
        const { id, x, y } = selectedElement;
        const elementsCopy = [...elements];
        const radius = getRadius(x, y, updatedX, updatedY);
        elementsCopy[id] = { ...elementsCopy[id], radius: radius };
        setElements(elementsCopy, true);
      } else if ([ELEMENT_TYPES.GATEWAY].includes(selectedElement.type)) {
        const { id } = selectedElement;
        const elementsCopy = [...elements];
        elementsCopy[id] = {
          ...elementsCopy[id],
          point: { x: updatedX, y: updatedY },
        };
        setElements(elementsCopy, true);
      } else {
        const index = elements.length - 1;
        const { x1, y1 } = elements[index];
        updateElement(index, x1, y1, updatedX, updatedY, tool);
      }
    } else if (action === ACTIONS.PANNING) {
      if (context) {
        const lastMousePos = lastMousePosRef.current;
        const currentMousePos = { x: event.pageX, y: event.pageY }; // use document so can pan off element
        lastMousePosRef.current = currentMousePos;

        const mouseDiff = diffPoints(currentMousePos, lastMousePos);
        setOffset(prevOffset => addPoints(prevOffset, mouseDiff));
      }
    } else if (action === ACTIONS.MOVING) {
      if (
        [ELEMENT_TYPES.PENCIL, ELEMENT_TYPES.POLYGON, ELEMENT_TYPES.POLYLINE].includes(
          selectedElement.type
        )
      ) {
        const newPoints = selectedElement.points.map((_, index) => ({
          x: updatedX - selectedElement.xOffsets[index],
          y: updatedY - selectedElement.yOffsets[index],
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
        elementsCopy[id] = { ...elementsCopy[id], x: updatedX - offsetX, y: updatedY - offsetY };
        setElements(elementsCopy, true);
      } else if ([ELEMENT_TYPES.GATEWAY].includes(selectedElement.type)) {
        const { id, offsetX, offsetY } = selectedElement;
        const elementsCopy = [...elements];
        elementsCopy[id] = {
          ...elementsCopy[id],
          point: { x: updatedX - offsetX, y: updatedY - offsetY },
        };
        setElements(elementsCopy, true);
      } else {
        const { id, x1, y1, x2, y2, type, offsetX, offsetY } = selectedElement;
        const width = x2 - x1;
        const height = y2 - y1;
        const newX = updatedX - offsetX;
        const newY = updatedY - offsetY;
        const options = type === ELEMENT_TYPES.TEXT ? { text: selectedElement.text } : {};

        updateElement(id, newX, newY, newX + width, newY + height, type, options);
      }
    } else if (action === ACTIONS.RESIZING) {
      if ([ELEMENT_TYPES.POLYGON, ELEMENT_TYPES.POLYLINE].includes(selectedElement.type)) {
        const hasPointOver = selectedElement.points.map((point, index) => {
          return nearPoint(updatedX, updatedY, point.x, point.y, "start");
        });

        const index = hasPointOver.indexOf("start");
        if (index > -1) {
          const selectedElementCopy = cloneDeep(selectedElement);
          const newPoints = selectedElementCopy.points;
          newPoints[index] = { x: updatedX, y: updatedY };
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
        const radius = getRadius(x, y, updatedX, updatedY);
        elementsCopy[id] = { ...elementsCopy[id], radius: radius };
        setElements(elementsCopy, true);
      } else {
        const { id, type, position, ...coordinates } = selectedElement;
        const { x1, y1, x2, y2 } = resizedCoordinates(updatedX, updatedY, position, coordinates);
        updateElement(id, x1, y1, x2, y2, type);
      }
    }
  };

  const handleMouseUp = event => {
    const { clientX, clientY } = event;
    const { updatedX, updatedY } = updatedPoints(scale, { x: clientX, y: clientY }, viewportTopLeft)
    if (selectedElement) {
      if (
        selectedElement.type === ELEMENT_TYPES.TEXT &&
        updatedX - selectedElement.offsetX === selectedElement.x1 &&
        updatedY - selectedElement.offsetY === selectedElement.y1
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
        width={props.canvasWidth}
        height={props.canvasHeight}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      />
      <ZoomToolbar context={context} reset={reset} scale={scale} handleZoom={handleZoom}/>
      <HistoryToolbar undo={undo} redo={redo} />
      <GridToolbar {...gridObj} onChange={setGridObj} />
    </>
  );
};

export default CanvasDrawing;
