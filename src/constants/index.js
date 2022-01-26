export const ELEMENT_TYPES = Object.freeze({
  LINE: "line",
  RECTANGLE: "rectangle",
  SELECTION: "selection",
  PENCIL: "pencil",
  TEXT: "text",
  POLYGON: "polygon",
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

export const KEYBOARD_KEYS = Object.freeze({
  ENTER: "enter",
  ESCAPE: "escape",
  Z: "z",
});
