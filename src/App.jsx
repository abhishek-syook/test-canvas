import React from 'react';
import CanvasDrawing from 'components/canvasDrawing';

const App = () => {
	return <CanvasDrawing canvasWidth={window.innerWidth} canvasHeight={window.innerHeight} />;
};

export default App;
