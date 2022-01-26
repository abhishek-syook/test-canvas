export const ELEMENT_TYPES = Object.freeze({
  LINE: "line",
  RECTANGLE: "rectangle",
  SELECTION: "selection",
  PENCIL: "pencil",
  TEXT: "text",
  POLYLINE: "polyline"
});

export const ACTIONS = Object.freeze({
  NONE: "none",
  MOVING: "moving",
  RESIZING: "resizing",
  DRAWING: "drawing",
  WRITING: "writing",
});

export const CURSOR = Object.freeze({
  DEFAULT: "default",
  MOVE: "move",
  NWSE_RESIZE: "nwse-resize",
  NESW_RESIZE: "nesw-resize",
});
