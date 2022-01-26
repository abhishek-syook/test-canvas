<!-- perfect freehand library -->
```js
// lib - perfect-freehand

import { getStroke } from "perfect-freehand";

const getSvgPathFromStroke = stroke => {
  if (!stroke.length) return "";

  const d = stroke.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ["M", ...stroke[0], "Q"]
  );

  d.push("Z");
  return d.join(" ");
};

const stroke = getSvgPathFromStroke(getStroke(element.points));
context.fill(new Path2D(stroke));
```