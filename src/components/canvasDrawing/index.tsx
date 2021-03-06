import './index.scss';
import React, { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react';
import useHistory from 'hooks/useHistory';

import { adjustmentRequired, drawElement, drawZone } from 'utils/roughHelper';
import {
	adjustElementCoordinates,
	createElement,
	cursorForPosition,
	getElementAtPosition,
	nearPoint,
	getRadius,
	resizedCoordinates,
	diffPoints,
	addPoints,
	scalePoint,
	updatedPoints
} from 'utils/mouseHelper';
import {
	ACTIONS,
	CURSOR,
	CURSOR_POSITION,
	ELEMENT_TYPES,
	INITIAL_SCALE,
	KEYBOARD_KEYS,
	ORIGIN,
	ZOOM_SENSITIVITY
} from '../../constants';

import cloneDeep from 'utils/cloneDeep';
import drawGrid from 'utils/drawGrid';
import Layout from 'components/layout';
import { ElementType } from 'types';

interface CanvasDrawingProps {
	canvasWidth: number;
	canvasHeight: number;
	zone: {};
}

type SelectedElementType = {
	id?: number;
	x1?: number;
	y1?: number;
	x2?: number;
	y2?: number;
	type?: string;
	position?: string;
	options?: { text?: string };
	xOffsets?: number[];
	yOffsets?: number[];
	offsetX?: number;
	offsetY?: number;
	text?: string;
	points?: { x: number; y: number }[];
	x?: number;
	y?: number;
};

const CanvasDrawing = ({
	canvasWidth,
	canvasHeight,
	zone = {
		width: 300,
		height: 200,
		name: 'Small Factory'
	}
}: CanvasDrawingProps) => {
	const canvasRef = useRef<HTMLCanvasElement>(null!);
	const textAreaRef = useRef<HTMLTextAreaElement>(null!);
	const [elements, setElements, undo, redo] = useHistory([]);
	const [action, setAction] = useState<string | boolean>(false);
	const [tool, setTool] = useState(ELEMENT_TYPES.SELECTION);
	const [selectedElement, setSelectedElement] = useState<SelectedElementType | null>(null);
	const [gridObj, setGridObj] = useState<{ isEnable: boolean; snapSize: number }>({
		isEnable: false,
		snapSize: 10
	});
	const [context, setContext] = useState<CanvasRenderingContext2D | null>(null!);
	const [scale, setScale] = useState(INITIAL_SCALE);
	const [offset, setOffset] = useState(ORIGIN);
	const [mousePos, setMousePos] = useState(ORIGIN);
	const [viewportTopLeft, setViewportTopLeft] = useState(ORIGIN);
	const [visibleDimensions, setVisibleDimensions] = useState({
		width: canvasWidth,
		height: canvasHeight
	});
	const [editElement, setEditElement] = useState<ElementType | null>(null);
	const isResetRef = useRef(false);
	const lastMousePosRef = useRef(ORIGIN);
	const lastOffsetRef = useRef(ORIGIN);

	useLayoutEffect(() => {
		if (!context) return;

		// clear canvas but maintain transform
		const storedTransform = context.getTransform();
		context.canvas.width = +context.canvas.width;
		context.canvas.height = +context.canvas.height;
		context.setTransform(storedTransform);

		context.clearRect(0, 0, visibleDimensions.width, visibleDimensions.height);

		// draw Zone
		zone && drawZone(context, zone);

		drawGrid({ context, viewportTopLeft, visibleDimensions, ...gridObj });
		elements.forEach((element: SelectedElementType) => {
			if (action === ACTIONS.WRITING && selectedElement?.id === element.id) {
				return;
			}
			drawElement(context, element, selectedElement);
		});
	}, [
		zone,
		context,
		elements,
		action,
		selectedElement,
		gridObj,
		scale,
		viewportTopLeft,
		visibleDimensions
	]);

	useEffect(() => {
		const undoRedoFunction = (event: KeyboardEvent) => {
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
		document.addEventListener('keydown', undoRedoFunction);
		return () => {
			document.removeEventListener('keydown', undoRedoFunction);
		};
	}, [undo, redo]);

	useEffect(() => {
		if (action === ACTIONS.WRITING) {
			textAreaRef.current.focus();
			textAreaRef.current.value = selectedElement?.text!;
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
				context.canvas.width = canvasWidth;
				context.canvas.height = canvasHeight;
				context.scale(INITIAL_SCALE, INITIAL_SCALE);
				setScale(INITIAL_SCALE);

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
		[canvasWidth, canvasHeight]
	);

	// setup canvas and set context
	useLayoutEffect(() => {
		if (canvasRef.current) {
			// get new drawing context
			const renderCtx = canvasRef.current.getContext('2d');
			if (renderCtx) {
				reset(renderCtx);
			}
		}
	}, [reset, canvasHeight, canvasWidth]);

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

		const handleUpdateMouse = (event: MouseEvent) => {
			event.preventDefault();
			if (canvasRef.current) {
				const viewportMousePos = { x: event.clientX, y: event.clientY };
				const topLeftCanvasPos = {
					x: canvasRef.current.offsetLeft,
					y: canvasRef.current.offsetTop
				};
				setMousePos(diffPoints(viewportMousePos, topLeftCanvasPos));
			}
		};

		canvasElem.addEventListener('mousemove', handleUpdateMouse);
		canvasElem.addEventListener('wheel', handleUpdateMouse);
		return () => {
			canvasElem.removeEventListener('mousemove', handleUpdateMouse);
			canvasElem.removeEventListener('wheel', handleUpdateMouse);
		};
	}, []);

	// this is tricky. Update the viewport's "origin" such that
	// the mouse doesn't move during scale - the 'zoom point' of the mouse
	// before and after zoom is relatively the same position on the viewport
	const handleZoom = useCallback(
		(event, zoomValue, mouseWheel = true) => {
			event.preventDefault();
			if (context) {
				const zoom = 1 - zoomValue / ZOOM_SENSITIVITY;
				let viewportTopLeftDelta;
				if (mouseWheel) {
					viewportTopLeftDelta = {
						x: (mousePos.x / scale) * (1 - 1 / zoom),
						y: (mousePos.y / scale) * (1 - 1 / zoom)
					};
				} else {
					viewportTopLeftDelta = {
						x: (canvasWidth / 2 / scale) * (1 - 1 / zoom),
						y: (canvasHeight / 2 / scale) * (1 - 1 / zoom)
					};
				}

				const newViewportTopLeft = addPoints(viewportTopLeft, viewportTopLeftDelta);

				const newScale = scale * zoom;

				if (newScale > 0.1 && newScale < 30) {
					context.translate(viewportTopLeft.x, viewportTopLeft.y);
					context.scale(zoom, zoom);
					context.translate(-newViewportTopLeft.x, -newViewportTopLeft.y);

					const newVisibleWidth = visibleDimensions.width / newScale;
					const newVisibleHeight = visibleDimensions.height / newScale;

					setViewportTopLeft(newViewportTopLeft);
					setScale(newScale);
					setVisibleDimensions({ width: newVisibleWidth, height: newVisibleHeight });
					isResetRef.current = false;
				}
			}
		},
		[
			context,
			mousePos.x,
			mousePos.y,
			viewportTopLeft,
			scale,
			canvasHeight,
			canvasWidth,
			visibleDimensions
		]
	);

	// add event listener on canvas for zoom
	useEffect(() => {
		const canvasElem = canvasRef.current;
		if (canvasElem === null) {
			return;
		}

		const handleWheel = (event: WheelEvent) => {
			handleZoom(event, event.deltaY);
		};

		canvasElem.addEventListener('wheel', handleWheel);
		return () => canvasElem.removeEventListener('wheel', handleWheel);
	}, [handleZoom]);

	const updateElement = (
		id: number,
		x1: number,
		y1: number,
		x2: number | null,
		y2: number | null,
		type: string,
		options?: { text?: string }
	) => {
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

			case ELEMENT_TYPES.TEXT: {
				const textWidth = canvasRef.current.getContext('2d')!.measureText(options?.text!).width;
				const textHeight = 24;
				elementsCopy[id] = {
					...createElement(id, x1, y1, x1 + textWidth, y1 + textHeight, type),
					text: options?.text
				};
				break;
			}
			case ELEMENT_TYPES.CIRCLE:
				elementsCopy[id] = createElement(id, x1, y1, x2, y2, type);
				break;

			case ELEMENT_TYPES.GATEWAY:
				elementsCopy[id] = createElement(id, x1, y1, x2, y2, type);
				break;

			default:
				throw Error(`Type not recognized: ${type}`);
		}

		setElements(elementsCopy, true);
	};

	const handleMouseDown = (event: React.MouseEvent) => {
		if (action === ACTIONS.WRITING) return;

		const { clientX, clientY } = event;
		const { updatedX, updatedY } = updatedPoints(scale, { x: clientX, y: clientY }, viewportTopLeft, {
			offsetLeft: canvasRef.current.offsetLeft,
			offsetTop: canvasRef.current.offsetTop
		});
		setEditElement(null);
		if (tool === ELEMENT_TYPES.SELECTION) {
			const element = getElementAtPosition(updatedX, updatedY, elements);
			if (element) {
				if (
					[ELEMENT_TYPES.PENCIL, ELEMENT_TYPES.POLYGON, ELEMENT_TYPES.POLYLINE].includes(element.type)
				) {
					const xOffsets = element.points.map((point: { x: number }) => updatedX - point.x);
					const yOffsets = element.points.map((point: { y: number }) => updatedY - point.y);
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
				setElements((prevState: {}[]) => prevState);

				if (element.position === CURSOR_POSITION.INSIDE) {
					setAction(ACTIONS.MOVING);
				} else {
					setAction(ACTIONS.RESIZING);
				}
			} else {
				setAction(ACTIONS.PANNING);
				lastMousePosRef.current = { x: event.pageX, y: event.pageY };
			}
		} else {
			if ([ELEMENT_TYPES.POLYGON, ELEMENT_TYPES.POLYLINE].includes(selectedElement?.type!)) {
				const index = elements.length - 1;
				const { x1, y1 } = elements[index];
				updateElement(index, x1, y1, updatedX, updatedY, tool);
			} else {
				const id = elements.length;
				const element = createElement(id, updatedX, updatedY, updatedX, updatedY, tool);
				setElements((p: {}[]) => [...p, element]);
				setSelectedElement(element as object);

				setAction(tool === ELEMENT_TYPES.TEXT ? ACTIONS.WRITING : ACTIONS.DRAWING);
			}
		}
	};

	const handleMouseMove = (event: React.MouseEvent) => {
		const { clientX, clientY } = event;
		const { updatedX, updatedY } = updatedPoints(scale, { x: clientX, y: clientY }, viewportTopLeft, {
			offsetLeft: canvasRef.current.offsetLeft,
			offsetTop: canvasRef.current.offsetTop
		});
		if (tool === ELEMENT_TYPES.SELECTION) {
			const element = getElementAtPosition(updatedX, updatedY, elements);
			(event.target as any).style.cursor = element
				? cursorForPosition(element.position)
				: CURSOR.DEFAULT;
		}

		if (action === ACTIONS.DRAWING) {
			if ([ELEMENT_TYPES.POLYGON, ELEMENT_TYPES.POLYLINE].includes(selectedElement?.type!)) {
				const index = elements.length - 1;
				const { x1, y1 } = elements[index];
				if (selectedElement?.points?.length! > 1) {
					selectedElement!.points = selectedElement?.points?.splice(
						0,
						selectedElement?.points?.length! - 1
					);
				}
				updateElement(index, x1, y1, updatedX, updatedY, tool);
			} else if (ELEMENT_TYPES.CIRCLE === selectedElement?.type) {
				const { id, x, y } = selectedElement;
				const elementsCopy = [...elements];
				const radius = getRadius(x, y, updatedX, updatedY);
				elementsCopy[id!] = { ...elementsCopy[id!], radius: radius };
				setElements(elementsCopy, true);
			} else if ([ELEMENT_TYPES.GATEWAY].includes(selectedElement?.type!)) {
				const { id } = selectedElement as SelectedElementType;
				const elementsCopy = [...elements];
				elementsCopy[id!] = {
					...elementsCopy[id!],
					point: { x: updatedX, y: updatedY }
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
					selectedElement?.type!
				)
			) {
				const newPoints = selectedElement?.points?.map((_, index) => ({
					x: updatedX - selectedElement?.xOffsets![index],
					y: updatedY - selectedElement?.yOffsets![index]
				}));

				const elementsCopy = [...elements];
				elementsCopy[selectedElement?.id!] = {
					...elementsCopy[selectedElement?.id!],
					points: newPoints
				};
				setElements(elementsCopy, true);
			} else if ([ELEMENT_TYPES.CIRCLE].includes(selectedElement?.type!)) {
				const { id, offsetX, offsetY } = selectedElement as SelectedElementType;
				const elementsCopy = [...elements];
				elementsCopy[id!] = { ...elementsCopy[id!], x: updatedX - offsetX!, y: updatedY - offsetY! };
				setElements(elementsCopy, true);
			} else if ([ELEMENT_TYPES.GATEWAY].includes(selectedElement?.type!)) {
				const { id, offsetX, offsetY } = selectedElement as SelectedElementType;
				const elementsCopy = [...elements];
				elementsCopy[id!] = {
					...elementsCopy[id!],
					point: { x: updatedX - offsetX!, y: updatedY - offsetY! }
				};
				setElements(elementsCopy, true);
			} else {
				const { id, x1, y1, x2, y2, type, offsetX, offsetY } = selectedElement as SelectedElementType;
				const width = x2! - x1!;
				const height = y2! - y1!;
				const newX = updatedX - offsetX!;
				const newY = updatedY - offsetY!;
				const options = type === ELEMENT_TYPES.TEXT ? { text: selectedElement?.text } : {};

				updateElement(id!, newX, newY, newX + width, newY + height, type!, options);
			}
		} else if (action === ACTIONS.RESIZING) {
			if ([ELEMENT_TYPES.POLYGON, ELEMENT_TYPES.POLYLINE].includes(selectedElement?.type!)) {
				const hasPointOver = selectedElement?.points?.map((point: { x: number; y: number }) => {
					return nearPoint(updatedX, updatedY, point?.x, point?.y, 'start');
				});

				const index = hasPointOver?.indexOf('start')!;
				if (index > -1) {
					const selectedElementCopy = cloneDeep(selectedElement);
					const newPoints = selectedElementCopy.points;
					newPoints[index] = { x: updatedX, y: updatedY };
					const elementsCopy = cloneDeep(elements);
					elementsCopy[selectedElement?.id!] = {
						...elementsCopy[selectedElement?.id as number],
						points: newPoints
					};
					setSelectedElement(selectedElementCopy);
					setElements(elementsCopy, true);
				}
			} else if (ELEMENT_TYPES.CIRCLE === selectedElement?.type) {
				const { id, x, y } = selectedElement;
				const elementsCopy = [...elements];
				const radius = getRadius(x, y, updatedX, updatedY);
				elementsCopy[id!] = { ...elementsCopy[id!], radius: radius };
				setElements(elementsCopy, true);
			} else {
				const { id, type, position, ...coordinates } = selectedElement as SelectedElementType;
				const { x1, y1, x2, y2 } = resizedCoordinates(
					updatedX,
					updatedY,
					position,
					coordinates
				) as SelectedElementType;
				updateElement(id!, x1!, y1!, x2!, y2!, type!);
			}
		}
	};

	const handleMouseUp = (event: React.MouseEvent) => {
		const { clientX, clientY } = event;
		const { updatedX, updatedY } = updatedPoints(scale, { x: clientX, y: clientY }, viewportTopLeft, {
			offsetLeft: canvasRef.current.offsetLeft,
			offsetTop: canvasRef.current.offsetTop
		});
		if (selectedElement) {
			if (
				selectedElement.type === ELEMENT_TYPES.TEXT &&
				updatedX - selectedElement.offsetX! === selectedElement.x1 &&
				updatedY - selectedElement?.offsetY! === selectedElement.y1
			) {
				setAction(ACTIONS.WRITING);
				return;
			}

			const index = selectedElement.id;
			const { id, type } = elements[index!];

			if ((action === ACTIONS.DRAWING || action === ACTIONS.RESIZING) && adjustmentRequired(type)) {
				const { x1, y1, x2, y2 } = adjustElementCoordinates(elements[index!]) as SelectedElementType;
				updateElement(id, x1!, y1!, x2!, y2!, type!);
			}
		}

		if (action === ACTIONS.WRITING) return;
		if (
			action === ACTIONS.DRAWING &&
			[ELEMENT_TYPES.POLYGON, ELEMENT_TYPES.POLYLINE].includes(selectedElement?.type!)
		) {
			return;
		}
		setAction(ACTIONS.NONE);
		if (tool === ELEMENT_TYPES.SELECTION) {
			const element = getElementAtPosition(updatedX, updatedY, elements);
			if (!element) {
				setSelectedElement(null);
				setEditElement(null);
			}
		}
	};

	const handleTextBlur = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		const { id, x1, y1, type } = selectedElement as SelectedElementType;

		setAction(ACTIONS.NONE);
		setSelectedElement(null);
		updateElement(id!, x1!, y1!, null, null, type!, {
			text: event.target.value
		});
	};

	const onElementSelect = (element: ElementType) => {
		setEditElement(element);
		setSelectedElement(null);
	};

	const onGridChange = (newGridObj: { isEnable: boolean; snapSize: number }) => {
		setGridObj(newGridObj);
	};

	return (
		<div className="canvasDrawing">
			<Layout
				// leftPanel
				tool={tool}
				setTool={setTool}
				onElementSelect={onElementSelect}
				// bottomPanel - zoom tool
				currentScale={`${Math.round(scale * 10) * 10}%`}
				onZoomReset={() => reset(context)}
				onZoomUpdate={handleZoom}
				// bottomPanel - history tools
				undo={undo}
				redo={redo}
				// bottomPanel - grid tool
				gridObj={gridObj}
				// onGridChange={setGridObj}
				onGridChange={onGridChange}
				// rightPanel - selected item
				element={editElement}
			>
				{action === ACTIONS.WRITING && (
					<textarea
						ref={textAreaRef}
						onBlur={handleTextBlur}
						style={{
							top: selectedElement?.y1! - 3,
							left: selectedElement?.x1,
							font: '24px sans-serif',
							margin: 0,
							border: 0,
							outline: 0,
							padding: 0,
							resize: 'both',
							position: 'fixed',
							overflow: 'hidden',
							whiteSpace: 'pre',
							background: 'transparent'
						}}
					/>
				)}

				<canvas
					ref={canvasRef}
					style={{ backgroundColor: 'var(--grey-3)' }}
					width={canvasWidth}
					height={canvasHeight}
					onMouseDown={handleMouseDown}
					onMouseUp={handleMouseUp}
					onMouseMove={handleMouseMove}
				/>
			</Layout>
		</div>
	);
};

export default CanvasDrawing;
