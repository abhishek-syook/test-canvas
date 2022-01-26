import { CURSOR, ELEMENT_TYPES } from "../constants";

export const drawElement = (context, element, selectedElement) => {
  context.strokeStyle = element.id === selectedElement?.id ? "blue" : "black";

  switch (element.type) {
    case ELEMENT_TYPES.RECTANGLE:
      context.strokeRect(element.x1, element.y1, element.x2 - element.x1, element.y2 - element.y1);
      break;

    case ELEMENT_TYPES.LINE:
      context.beginPath();
      context.moveTo(element.x1, element.y1);
      context.lineTo(element.x2, element.y2);
      context.stroke();
      break;

    case ELEMENT_TYPES.PENCIL:
      context.beginPath();
      context.moveTo(element.points[0].x, element.points[0].y);
      element.points.forEach(({ x, y }) => {
        context.lineTo(x, y);
      });
      context.stroke();
      break;

    case ELEMENT_TYPES.TEXT:
      context.textBaseline = "top";
      context.textAlign = "start";
      context.font = "24px sans-serif";
      context.fillText(element.text, element.x1, element.y1);
      break;

    case ELEMENT_TYPES.POLYGON:
      context.beginPath();
      context.moveTo(element.points[0].x, element.points[0].y);
      element.points.forEach(({ x, y }) => {
        context.lineTo(x, y);
      });
      context.closePath();
      context.stroke();
      break;

    case ELEMENT_TYPES.POLYLINE:
      context.beginPath();
      context.moveTo(element.points[0].x, element.points[0].y);
      element.points.forEach(({ x, y }) => {
        context.lineTo(x, y);
      });
      context.stroke();
      break;

    default:
      throw Error(`Type not recognised: ${element.type}`);
  }
};

export const createElement = (id, x1, y1, x2, y2, type) => {
  switch (type) {
    case ELEMENT_TYPES.LINE:
      return { id, x1, y1, x2, y2, type };

    case ELEMENT_TYPES.RECTANGLE:
      return { id, x1, y1, x2, y2, type };

    case ELEMENT_TYPES.PENCIL:
    case ELEMENT_TYPES.POLYGON:
    case ELEMENT_TYPES.POLYLINE:
      return { id, type, points: [{ x: x1, y: y1 }] };

    case ELEMENT_TYPES.TEXT:
      return { id, type, x1, y1, x2, y2, text: "Hello" };

    default:
      throw Error(`Type not recognised: ${type}`);
  }
};

const nearPoint = (x, y, x1, y1, name) => {
  return Math.abs(x - x1) < 5 && Math.abs(y - y1) < 5 ? name : null;
};

const onLine = (x1, y1, x2, y2, x, y, maxDistance = 1) => {
  const a = { x: x1, y: y1 };
  const b = { x: x2, y: y2 };
  const c = { x, y };
  const offset = distance(a, b) - (distance(a, c) + distance(b, c));
  return Math.abs(offset) < maxDistance ? "inside" : null;
};

const PositionWithinElement = (x, y, element) => {
  const { type, x1, y1, x2, y2 } = element;
  switch (type) {
    case ELEMENT_TYPES.LINE:
      const lineInside = onLine(x1, y1, x2, y2, x, y);
      const start = nearPoint(x, y, x1, y1, "start");
      const end = nearPoint(x, y, x2, y2, "end");
      return start || end || lineInside;

    case ELEMENT_TYPES.RECTANGLE:
      const topLeft = nearPoint(x, y, x1, y1, "tl");
      const topRight = nearPoint(x, y, x2, y1, "tr");
      const bottomLeft = nearPoint(x, y, x1, y2, "bl");
      const bottomRight = nearPoint(x, y, x2, y2, "br");
      const rectInside = x >= x1 && x < x2 && y >= y1 && y < y2 ? "inside" : null;
      return topLeft || topRight || bottomLeft || bottomRight || rectInside;

    case ELEMENT_TYPES.PENCIL:
      const betweenAnyPoint = element.points.some((point, index) => {
        const nextPoint = element.points[index + 1];
        if (!nextPoint) return false;
        return onLine(point.x, point.y, nextPoint.x, nextPoint.y, x, y, 5) !== null;
      });
      return betweenAnyPoint ? "inside" : null;

    case ELEMENT_TYPES.POLYGON:
    case ELEMENT_TYPES.POLYLINE:
      const isBetweenAnyPoint = element.points.some((point, index) => {
        const nextPoint = element.points[index + 1];
        if (!nextPoint) return false;
        return onLine(point.x, point.y, nextPoint.x, nextPoint.y, x, y, 5) !== null;
      });
      return isBetweenAnyPoint ? "inside" : null;

    case ELEMENT_TYPES.TEXT:
      const textInside = x >= x1 && x < x2 && y >= y1 && y < y2 ? "inside" : null;
      return textInside;
    default:
      throw Error(`Type not recognised: ${element.type}`);
  }
};

const distance = (a, b) => Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));

export const getElementAtPosition = (x, y, elements) => {
  const eles = elements.map(element => ({
    ...element,
    position: PositionWithinElement(x, y, element),
  }));
  return eles.find(element => element.position !== null);
};

export const adjustElementCoordinates = element => {
  const { type, x1, y1, x2, y2 } = element;
  const minX = Math.min(x1, x2);
  const maxX = Math.max(x1, x2);
  const minY = Math.min(y1, y2);
  const maxY = Math.max(y1, y2);

  if (type === ELEMENT_TYPES.RECTANGLE) {
    return { x1: minX, y1: minY, x2: maxX, y2: maxY };
  } else if (type === ELEMENT_TYPES.LINE) {
    if (x1 < x2 || (x1 === x2 && y1 < y2)) {
      return { x1, y1, x2, y2 };
    } else {
      return { x1: x2, y1: y2, x2: x1, y2: y1 };
    }
  }
};

export const cursorForPosition = position => {
  switch (position) {
    case "tl":
    case "br":
    case "start":
    case "end":
      return CURSOR.NWSE_RESIZE;

    case "tr":
    case "bl":
      return CURSOR.NESW_RESIZE;

    default:
      return CURSOR.MOVE;
  }
};

export const resizedCoordinates = (clientX, clientY, position, coordinates) => {
  const { x1, y1, x2, y2 } = coordinates;
  switch (position) {
    case "tl":
    case "start":
      return { x1: clientX, y1: clientY, x2, y2 };
    case "tr":
      return { x1, y1: clientY, x2: clientX, y2 };
    case "bl":
      return { x1: clientX, y1, x2, y2: clientY };
    case "br":
    case "end":
      return { x1, y1, x2: clientX, y2: clientY };
    default:
      return null;
  }
};

export const adjustmentRequired = type =>
  [ELEMENT_TYPES.LINE, ELEMENT_TYPES.RECTANGLE].includes(type);
