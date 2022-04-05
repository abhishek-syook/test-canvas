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

export const drawZone = (context, zone) => {
	const name = `${zone.name} (${zone.width}m * ${zone.height}m)`;
	context.strokeStyle = 'grey';
	context.fillStyle = 'grey';
	context.textAlign = 'start';
	context.font = '14px sans-serif';
	// context.textBaseline = 'top';

	/**
	 * draw main rectangle for zone and zone name
	 */
	context.strokeRect(0, 0, zone.width, zone.height);
	const xPos = (zone.width - context.measureText(name).width) / 2;
	context.fillText(name, xPos, -20);

	// draw outline
	// x axis
	const xText = `${zone.width} m`;
	const yText = `${zone.height} m`;

	const textWidth = context.measureText(xText).width;
	const afterTextWidth = zone.width - textWidth;

	const bottomMargin = -8;

	// draw line and keep text space
	context.beginPath();
	context.moveTo(0, bottomMargin);
	context.lineTo(afterTextWidth / 2 - 5, bottomMargin);
	context.moveTo(afterTextWidth / 2 + textWidth + 5, bottomMargin);
	context.lineTo(afterTextWidth / 2 + textWidth + 5, bottomMargin);
	context.lineTo(zone.width, bottomMargin);
	context.stroke();

	// draw text between lines
	context.fillText(xText, afterTextWidth / 2, -4);

	// y axis
	const rightMargin = -8;

	const rotateAngle = (1 * Math.PI) / 2;
	const afterTextHeight = zone.height - textWidth;

	// draw line and keep text space
	context.moveTo(rightMargin, 0);
	context.lineTo(rightMargin, afterTextHeight / 2 - 5);
	context.moveTo(rightMargin, afterTextHeight / 2 + textWidth + 5);
	context.lineTo(rightMargin, afterTextHeight / 2 + textWidth + 5);
	context.lineTo(rightMargin, zone.height);
	context.stroke();

	/**
	 * draw text between lines
	 * to draw in between vertical rotate text,
	 * transform and rotate the canvas, print text and reverse transform and rotate
	 * Ref - https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/rotate#rotating_a_shape_around_its_center
	 */
	const xTranslate = rightMargin + textWidth / 2;
	const yTranslate = afterTextHeight / 2 + textWidth / 2;

	context.translate(xTranslate, yTranslate);
	context.rotate(-rotateAngle);
	context.translate(-xTranslate, -yTranslate);

	context.fillText(yText, rightMargin, afterTextHeight / 2 + 4);

	context.translate(xTranslate, yTranslate);
	context.rotate(rotateAngle);
	context.translate(-xTranslate, -yTranslate);
};

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
