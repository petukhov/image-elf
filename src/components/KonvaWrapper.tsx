import { Stage, Layer, Rect, Circle, Text } from 'react-konva';

const KonvaWrapper = () => {
	return (
		<Stage width={window.innerWidth} height={window.innerHeight}>
			<Layer>
				{/* Basic Konva Canvas with Sample Items */}
				<Rect width={50} height={50} fill="red" />
				<Circle x={200} y={200} stroke="black" radius={50} />
				<Text text="click & drag to create an image" />
			</Layer>
		</Stage>
	);
};

export default KonvaWrapper;
