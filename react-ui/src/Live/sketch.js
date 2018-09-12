import Blob from "./blob";

export default function sketch(p) {
	let prevTime,
		stroke = 5,
		blob,
		zoom = 1,
		width = 0,
		height = 0,
		resized = false,
		socket;
	let blobs = [],
		foods = [];

	p.setup = () => {
		p.createCanvas(p.windowWidth, p.windowHeight, p.P2D);
		prevTime = p.millis();
	};

	p.windowResized = () => {
		p.resizeCanvas(p.windowWidth, p.windowHeight);
	};

	p.myCustomRedrawAccordingToNewPropsHandler = props => {
		if (!resized && props.width) {
			width = props.width;
			height = props.height;
			resized = true;
		}
		if (!blob && !props.initX) return;
		if (!blob) {
			blob = new Blob(props.initX, props.initY, p);
		}
		socket = props.socket;
		blobs = props.blobs;
		foods = props.foods;
		blob.radius = props.radius;

		socket.emit("updateBlobPos", {
			x: blob.pos.x,
			y: blob.pos.y
		});
	};

	p.update = () => {
		if (!blob) return;

		const currentTime = p.millis(),
			deltaTime = currentTime - prevTime;
		blob.update(deltaTime);
		blob.constrain(width, height);
		prevTime = currentTime;
	};

	p.draw = () => {
		if (!blobs || !blob) return;
		p.update();

		p.translate(p.width / 2, p.height / 2);
		var newzoom = p.map(64/blob.radius, 0, 2, 0.7, 1.2);
		console.log(newzoom)
		zoom = p.lerp(zoom, newzoom, 0.2);
		p.scale(zoom);
		p.translate(-blob.pos.x, -blob.pos.y);
		p.background(50, 200, 220);
		p.strokeWeight(stroke);

		p.stroke(220, 90, 90);
		p.fill(230, 100, 100);
		blobs.forEach(item => {
			if (item.id === socket.id) return;
			p.ellipse(item.x, item.y, item.radius, item.radius);
			p.text(item.id, item.x - item.id.length * 3, item.y);
		});

		p.noStroke();
		foods.forEach(food => {
			p.stroke(food.color.r - 10, food.color.g - 10, food.color.b - 10);
			p.fill(food.color.r, food.color.g, food.color.b);
			p.ellipse(food.x, food.y, food.radius, food.radius);
		});

		p.noFill();
		p.stroke(30, 170, 200);
		p.rect(0, 0, width, height);

		p.stroke(50, 220, 190);
		p.fill(60, 230, 200);
		blob.draw(p);
	};
}
