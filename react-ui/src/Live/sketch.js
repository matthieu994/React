import Blob from "./blob";

export default function sketch(p) {
	let speedX = 0,
		speedY = 0,
		x,
		y,
		prevTime,
		radius = 50,
		stroke = radius / 10,
		width = radius + stroke,
		blob,
		socket;
	let blobs = [],
		foods = [];

	p.setup = () => {
		p.createCanvas(window.innerWidth, window.innerHeight, p.P2D);
		x = p.width / 2;
		y = p.height / 2;
		prevTime = p.millis();
		blob = new Blob(x, y, p);
	};

	p.myCustomRedrawAccordingToNewPropsHandler = props => {
		socket = props.socket;
		speedX = props.speedX;
		speedY = props.speedY;
		blobs = props.blobs;
		blob.radius = props.radius;
		foods = props.foods;

		if (!blob || !socket) return;
		socket.emit("updateBlobPos", {
			x: blob.x,
			y: blob.y
		});
	};

	p.update = () => {
		if (!speedX || !speedY || !socket) return;

		const currentTime = p.millis(),
			deltaTime = currentTime - prevTime;
		x += p.map(speedX, -40, 40, -0.2, 0.2) * deltaTime;
		y += p.map(speedY, -40, 40, -0.2, 0.2) * deltaTime;
		x = p.constrain(x, 0 + width / 2, p.width - width / 2);
		y = p.constrain(y, 0 + width / 2, p.height - width * 2);
		prevTime = currentTime;

		blob.update(x, y);
	};

	p.draw = () => {
		p.update();

		p.background(50, 200, 220);
		p.strokeWeight(stroke);

		p.stroke(50, 220, 190);
		p.fill(60, 230, 200);
		blob.draw(p);

		p.stroke(220, 90, 90);
		p.fill(230, 100, 100);
		blobs.forEach(item => {
			if (item.id === socket.id) return;
			p.ellipse(item.x, item.y, item.radius, item.radius);
		});

		p.noStroke();
		foods.forEach(food => {
			p.stroke(food.color.r-10, food.color.g-10, food.color.b-10);
			p.fill(food.color.r, food.color.g, food.color.b);
			p.ellipse(food.x, food.y, 10, 10);
		});
	};
}
