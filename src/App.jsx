import React from 'react';
import CanvasDrawing from 'components/canvasDrawing';

const App = () => {
	const width = 800 || window.innerWidth;
	const height = 500 || window.innerHeight;

	return <CanvasDrawing canvasWidth={width} canvasHeight={height} />;
};

export default App;
