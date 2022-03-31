const drawGrid = ({ context, viewportTopLeft, visibleDimensions, isEnable, snapSize }) => {
  if (!context || !isEnable || snapSize === 0) return;

  //grid width and height
  const bw = snapSize;
  const bh = snapSize;

  //padding around grid
  // const p = 10;

  //size of canvas
  // let cw = context.canvas.clientWidth;
  // let ch = context.canvas.clientHeight;

  // context.beginPath();
  // for (let x = 0; x <= cw; x += bw) {
  //   context.moveTo(x, 0);
  //   context.lineTo(x, ch);
  // }

  // for (let y = 0; y <= ch; y += bh) {
  //   context.moveTo(0, y);
  //   context.lineTo(cw, y);
  // }

  let cw = visibleDimensions.width;
  let ch = visibleDimensions.height;

  context.beginPath();
  for (let x = viewportTopLeft.x; x <= cw; x += bw) {
    context.moveTo(x, viewportTopLeft.y);
    context.lineTo(x, ch);
  }

  for (let y = viewportTopLeft.y; y <= ch; y += bh) {
    context.moveTo(viewportTopLeft.x, y);
    context.lineTo(cw, y);
  }


  context.strokeStyle = "black";
  context.stroke();
  context.closePath();
};

export default drawGrid;
