import React from 'react';
import SelectIcon from 'assets/toolIcons/select';
import LineIcon from 'assets/toolIcons/line';
import RectangleIcon from 'assets/toolIcons/rectangle';
import PencilIcon from 'assets/toolIcons/pencil';
import TextIcon from 'assets/toolIcons/text';
import PolylineIcon from 'assets/toolIcons/polyline';
import PolygonIcon from 'assets/toolIcons/polygon';
import CircleIcon from 'assets/toolIcons/circle';

export const NEAR_POINT_DISTANCE = 5;

export const ELEMENT_TYPES = Object.freeze({
	SELECTION: 'selection',
	LINE: 'line',
	RECTANGLE: 'rectangle',
	PENCIL: 'pencil',
	TEXT: 'text',
	POLYGON: 'polygon',
	POLYLINE: 'polyline',
	CIRCLE: 'circle',
	// ARC: 'arc',

	// shapes
	GATEWAY: 'gateway'
});

export const ELEMENT_TYPES_DATA = [
	{
		type: ELEMENT_TYPES.SELECTION,
		label: 'Selection',
		icon: <SelectIcon />
	},
	{
		type: ELEMENT_TYPES.LINE,
		label: 'Line',
		icon: <LineIcon />
	},
	{
		type: ELEMENT_TYPES.RECTANGLE,
		label: 'Rectangle',
		icon: <RectangleIcon />
	},
	{
		type: ELEMENT_TYPES.PENCIL,
		label: 'Pencil',
		icon: <PencilIcon />
	},
	{
		type: ELEMENT_TYPES.TEXT,
		label: 'Text box',
		icon: <TextIcon />
	},
	{
		type: ELEMENT_TYPES.POLYLINE,
		label: 'Polyline',
		icon: <PolylineIcon />
	},
	{
		type: ELEMENT_TYPES.POLYGON,
		label: 'Polygon',
		icon: <PolygonIcon />
	},
	{
		type: ELEMENT_TYPES.CIRCLE,
		label: 'Circle',
		icon: <CircleIcon />
	}
];

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
