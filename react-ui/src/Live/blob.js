export default class Blob {
	constructor(x, y, p) {
		this.p = p;
		this.pos = p.createVector(x, y);
		this.vel = p.createVector(0, 0);
	}

	update(x, y) {
		// this.x = x;
		// this.y = y;
		var newvel = this.p.createVector(
			this.p.mouseX - this.p.width / 2,
			this.p.mouseY - this.p.height / 2
		);
		newvel.div(50);
		//newvel.setMag(3);
		newvel.limit(3);
		this.vel.lerp(newvel, 0.2);
		this.pos.add(this.vel);
	}

	draw() {
		this.p.ellipse(this.pos.x, this.pos.y, this.radius, this.radius);
	}
}
