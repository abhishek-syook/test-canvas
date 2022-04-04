import { ELEMENT_TYPES } from '../constants';

import wifiSvg from '../assets/wifi.svg';
import wifiActiveSvg from '../assets/wifiActive.svg';
// import track from '../assets/track.svg';

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
	context.strokeStyle = element.id === selectedElement?.id ? 'blue' : 'black';

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
			context.textBaseline = 'top';
			context.textAlign = 'start';
			context.font = '24px sans-serif';
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

export const adjustmentRequired = type =>
	[ELEMENT_TYPES.LINE, ELEMENT_TYPES.RECTANGLE].includes(type);
