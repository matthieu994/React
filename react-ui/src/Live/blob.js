export default class Blob {
	constructor(x, y, p) {
		this.p = p;
		this.pos = p.createVector(x, y);
		this.vel = p.createVector(0, 0);
	}

	update(deltaTime) {
		var newvel = this.p.createVector(
			this.p.mouseX - this.p.width / 2,
			this.p.mouseY - this.p.height / 2
		);
		newvel.div(120 / deltaTime);
		// newvel.setMag(deltaTime/10);
		newvel.limit(5);
		this.vel.lerp(newvel, 0.2);
		this.pos.add(this.vel);
	}

	constrain(width, height) {
		this.pos.x = this.p.constrain(this.pos.x, 0+this.radius/2, width-this.radius/2);
		this.pos.y = this.p.constrain(this.pos.y, 0+this.radius/2, height-this.radius/2);
	}

	draw() {
		this.p.ellipse(this.pos.x, this.pos.y, this.radius, this.radius);
	}
}
