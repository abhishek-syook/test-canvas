export const NEAR_POINT_DISTANCE = 5;

export const ELEMENT_TYPES = Object.freeze({
	LINE: 'line',
	RECTANGLE: 'rectangle',
	SELECTION: 'selection',
	PENCIL: 'pencil',
	TEXT: 'text',
	POLYGON: 'polygon',
	POLYLINE: 'polyline',
	CIRCLE: 'circle',
	ARC: 'arc',

	// shapes
	GATEWAY: 'gateway'
});

export const ACTIONS = Object.freeze({
	NONE: 'none',
	MOVING: 'moving',
	RESIZING: 'resizing',
	DRAWING: 'drawing',
	WRITING: 'writing',
	PANNING: 'panning'
});

export const CURSOR = Object.freeze({
	DEFAULT: 'default',
	MOVE: 'move',
	NWSE_RESIZE: 'nwse-resize',
	NESW_RESIZE: 'nesw-resize'
});

export const KEYBOARD_KEYS = Object.freeze({
	ENTER: 'enter',
	ESCAPE: 'escape',
	Z: 'z'
});

export const CURSOR_POSITION = Object.freeze({
	END: 'END',
	START: 'START',
	INSIDE: 'INSIDE',
	TOP_LEFT: 'TOP_LEFT',
	TOP_RIGHT: 'TOP_RIGHT',
	BOTTOM_LEFT: 'BOTTOM_LEFT',
	BOTTOM_RIGHT: 'BOTTOM_RIGHT'
});

export const INITIAL_SCALE = 1;

export const ORIGIN = Object.freeze({ x: 0, y: 0 });

export const ZOOM_SENSITIVITY = 500; // bigger for lower zoom per scroll
