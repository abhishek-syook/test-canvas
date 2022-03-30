import { CURSOR, CURSOR_POSITION, ELEMENT_TYPES, NEAR_POINT_DISTANCE } from "../constants";

import image from "../assets/wifi.jpeg";
import wifiSvg from "../assets/wifi.svg";
const imageUrl =
  "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.stellarnet.us%2Fwp-content%2Fuploads%2Fwifi-icon.png&f=1&nofb=1";
const imageData =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAARCAYAAADHeGwwAAAAAXNSR0IArs4c6QAAAjJJREFUOE9tVctuUzEQPePbJFLUWxqQ2LOq+CUQrLqDDf+CKAKxQP2jLuhHkE0TUKty7UHzsD33gheJY4/ncebMCTEzgwEmgNpGjgjEgHxsNiMe/5AZiQ2Alxcv8OP2Rh7BrfVclj/TOyrMbI7avW6IRjsLTs2EoA8sjtsAzMfg3t8Rg7QCX6UUDCdP9HHPdR44Op3v7UUpB5AnpqjUACmdqeNldqVYZrXAWqx8P9zfY7t93pNRhwANhDwdNKAGoDQqFNIDK6eA+bcH9N54iIh3RHY4OUcp2frmCHE5SjWnipG4txKPs8bJXaJTaQqIewrr1QYPj/uWvVbIBZTOrc0OExHG1uVS7swJMT5dfcP7dx8WTe4BYpcKH60+L4nozOBRErLwSBNs1FTIGkO8NmVEp2EgUKMT86HGcLpqD0rgDEGcRxbKo8jhznHrRqJx1mQu3d5snabyY73aYcqTwvT9+jPevH71L33CMHqzQMMW4EF/Xl6+xdcvH1tSNmhekLaaxj40DEzThNV654jFHgA53yGlZMxjIA0jhDl1aY0Voki5SkUp30i6GNueH2jIyNOvdrIUhSYVpkVzIZFqKn2zYKsjCuSSsRp2LbTi7nch/aBFy1OHTOgm72T8ZRCbIPrQVb2KsDSuVsrGJnc17frTwPmPIHas+7SbWZVndjVtIqwi3Tlspk5DRkqD7kUU42pOg32PMZuDKrPLChgDGQ1l7X/u8fTZLvxnuL0n7iOr5PgLf6hO8brzWoIAAAAASUVORK5CYII=";

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
      context.strokeRect(element.point.x, element.point.y, 24, 24);
      // TODO: use svg/png image instead of reactangle
      // context.arc(element.point.x, element.point.y, 10, 0, Math.PI * 2, true);
      // context.stroke();

      // context.moveTo(element.point.x, element.point.y);
      //   const path = new Path2D(
      //     // "m1 9 2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8 3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4 2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"
      // "M60 38.98C20.93 5.9 16.69 4 12 4S3.07 5.9 0 8.98L12 21 24 8.98zm-21.08.09C5.51 7.08 8.67 6 12 6s6.49 1.08 9.08 3.07l-1.43 1.43C17.5 8.94 14.86 8 12 8s-5.5.94-7.65 2.51L2.92 9.07z"
      //     );
      // context.stroke(path);

      // context.drawImage(image, element.point.x, element.point.y, 12, 12);
      // context.drawImage(imageUrl, 0, 0);

      // const imageElement = new Image();

      // // When the image has loaded, draw it to the canvas
      // imageElement.onload = function (data) {
      //   // draw image...
      //   console.log(">>> data", data, context);
      //   context.drawImage(data, element.point.x, element.point.y);
      // };
      // imageElement.src = imageUrl;
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

export const diffPoints = (p1, p2) => {
  return { x: p1.x - p2.x, y: p1.y - p2.y };
}
  
export const addPoints = (p1, p2) => {
  return { x: p1.x + p2.x, y: p1.y + p2.y };
}

export const scalePoint = (p1, scale) => {
  return { x: p1.x / scale, y: p1.y / scale };
}

export const updatedPoints = (scale, client, viewPort) => {
  if(scale === 1 && !(viewPort.x && viewPort.y)){
    return { updatedX: client.x, updatedY: client.y }
  } else {
    const x = (client.x / scale) + viewPort.x 
    const y = (client.y / scale) + viewPort.y
    return { updatedX: x, updatedY: y }
  }
}
