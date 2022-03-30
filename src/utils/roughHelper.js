import { CURSOR, CURSOR_POSITION, ELEMENT_TYPES, NEAR_POINT_DISTANCE } from "../constants";

import wifiSvg from "../assets/wifi.svg";
import wifiActiveSvg from "../assets/wifiActive.svg";
import track from "../assets/track.svg";

let wifiImage;
const wifiImageElement = new Image();
// // When the image has loaded, draw it to the canvas
wifiImageElement.onload = function () {
  wifiImage = wifiImageElement;
};

wifiImageElement.src = wifiSvg;

let wifiActiveImage;
const wifiActiveImagelement = new Image();
// // When the image has loaded, draw it to the canvas
wifiActiveImagelement.onload = function () {
  wifiActiveImage = wifiActiveImagelement;
};

wifiActiveImagelement.src = wifiActiveSvg;

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

    case ELEMENT_TYPES.CIRCLE:
      context.beginPath();
      context.arc(element.x, element.y, element.radius, 0, Math.PI * 2, true);
      context.stroke();
      break;

    case ELEMENT_TYPES.GATEWAY:
      context.beginPath();
      context.drawImage(
        element.id === selectedElement?.id ? wifiActiveImage : wifiImage,
        element.point.x,
        element.point.y,
        18,
        18
      );

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

    case ELEMENT_TYPES.CIRCLE:
      const radius = getRadius(x1, y1, x2, y2);
      return { id, x: x1, y: y1, radius, type };

    case ELEMENT_TYPES.GATEWAY:
      return { id, type, point: { x: x1, y: y1 } };

    default:
      throw Error(`Type not recognised: ${type}`);
  }
};

export const getRadius = (x1, y1, x2, y2) =>
  Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));

export const nearPoint = (x, y, x1, y1, name) => {
  return Math.abs(x - x1) < NEAR_POINT_DISTANCE && Math.abs(y - y1) < NEAR_POINT_DISTANCE
    ? name
    : null;
};

const onLine = (x1, y1, x2, y2, x, y, maxDistance = 1) => {
  const a = { x: x1, y: y1 };
  const b = { x: x2, y: y2 };
  const c = { x, y };
  const offset = distance(a, b) - (distance(a, c) + distance(b, c));
  return Math.abs(offset) < maxDistance ? CURSOR_POSITION.INSIDE : null;
};

const PositionWithinElement = (x, y, element) => {
  const { type, x1, y1, x2, y2 } = element;
  switch (type) {
    case ELEMENT_TYPES.LINE:
      const lineInside = onLine(x1, y1, x2, y2, x, y);
      const start = nearPoint(x, y, x1, y1, CURSOR_POSITION.START);
      const end = nearPoint(x, y, x2, y2, CURSOR_POSITION.END);
      return start || end || lineInside;

    case ELEMENT_TYPES.RECTANGLE:
      const topLeft = nearPoint(x, y, x1, y1, CURSOR_POSITION.TOP_LEFT);
      const topRight = nearPoint(x, y, x2, y1, CURSOR_POSITION.TOP_RIGHT);
      const bottomLeft = nearPoint(x, y, x1, y2, CURSOR_POSITION.BOTTOM_LEFT);
      const bottomRight = nearPoint(x, y, x2, y2, CURSOR_POSITION.BOTTOM_RIGHT);
      const rectInside = x >= x1 && x < x2 && y >= y1 && y < y2 ? CURSOR_POSITION.INSIDE : null;
      return topLeft || topRight || bottomLeft || bottomRight || rectInside;

    case ELEMENT_TYPES.PENCIL:
      const betweenAnyPoint = element.points.some((point, index) => {
        const nextPoint = element.points[index + 1];
        if (!nextPoint) return false;
        return onLine(point.x, point.y, nextPoint.x, nextPoint.y, x, y) !== null;
      });
      return betweenAnyPoint ? CURSOR_POSITION.INSIDE : null;

    case ELEMENT_TYPES.POLYGON:
      const isInBetweenAnyPoint = element.points.some((point, index) => {
        let nextIndex = index + 1;
        nextIndex = element.points.length === nextIndex ? 0 : nextIndex;
        const nextPoint = element.points[nextIndex];
        if (!nextPoint) return false;
        return onLine(point.x, point.y, nextPoint.x, nextPoint.y, x, y) !== null;
      });

      const hasPointOver = element.points.some((point, index) => {
        return nearPoint(x, y, point.x, point.y, CURSOR_POSITION.START);
      });

      return hasPointOver
        ? CURSOR_POSITION.START
        : isInBetweenAnyPoint
        ? CURSOR_POSITION.INSIDE
        : null;

    case ELEMENT_TYPES.POLYLINE:
      const isBetweenAnyPointPolyline = element.points.some((point, index) => {
        const nextPoint = element.points[index + 1];
        if (!nextPoint) return false;
        return onLine(point.x, point.y, nextPoint.x, nextPoint.y, x, y) !== null;
      });
      const hasPointOverPolyline = element.points.some((point, index) => {
        return nearPoint(x, y, point.x, point.y, CURSOR_POSITION.START);
      });
      return hasPointOverPolyline
        ? CURSOR_POSITION.START
        : isBetweenAnyPointPolyline
        ? CURSOR_POSITION.INSIDE
        : null;

    case ELEMENT_TYPES.TEXT:
      const textInside = x >= x1 && x < x2 && y >= y1 && y < y2 ? CURSOR_POSITION.INSIDE : null;
      return textInside;

    case ELEMENT_TYPES.CIRCLE:
      const a = { x, y };
      const b = { x: element.x, y: element.y };
      const inside = distance(a, b) <= element.radius ? CURSOR_POSITION.INSIDE : null;
      const resizeCircle =
        distance(a, b) - element.radius <= NEAR_POINT_DISTANCE && distance(a, b) >= element.radius
          ? CURSOR_POSITION.BOTTOM_LEFT
          : null;
      return resizeCircle || inside;

    case ELEMENT_TYPES.GATEWAY:
      const xEnd = element.point.x + 24;
      const yEnd = element.point.y + 24;
      const isInside =
        x >= element.point.x && x <= xEnd && y >= element.point.y && y < yEnd
          ? CURSOR_POSITION.INSIDE
          : null;

      return isInside;

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
    case CURSOR_POSITION.TOP_LEFT:
    case CURSOR_POSITION.BOTTOM_RIGHT:
    case CURSOR_POSITION.START:
    case CURSOR_POSITION.END:
      return CURSOR.NWSE_RESIZE;

    case CURSOR_POSITION.TOP_RIGHT:
    case CURSOR_POSITION.BOTTOM_LEFT:
      return CURSOR.NESW_RESIZE;

    default:
      return CURSOR.MOVE;
  }
};

export const resizedCoordinates = (clientX, clientY, position, coordinates) => {
  const { x1, y1, x2, y2 } = coordinates;
  switch (position) {
    case CURSOR_POSITION.TOP_LEFT:
    case CURSOR_POSITION.START:
      return { x1: clientX, y1: clientY, x2, y2 };
    case CURSOR_POSITION.TOP_RIGHT:
      return { x1, y1: clientY, x2: clientX, y2 };
    case CURSOR_POSITION.BOTTOM_LEFT:
      return { x1: clientX, y1, x2, y2: clientY };
    case CURSOR_POSITION.BOTTOM_RIGHT:
    case CURSOR_POSITION.END:
      return { x1, y1, x2: clientX, y2: clientY };
    default:
      return null;
  }
};

export const adjustmentRequired = type =>
  [ELEMENT_TYPES.LINE, ELEMENT_TYPES.RECTANGLE].includes(type);
