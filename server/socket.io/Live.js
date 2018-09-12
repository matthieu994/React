const Util = require("./Util.js");
let blobs = [];
let foods = [];

class Blob {
	constructor(id) {
		this.id = id;
		this.x = Util.random(0, Util.WIDTH);
		this.y = Util.random(0, Util.HEIGHT);
		this.radius = 50 + Util.random(0, 1);
	}
	update(data) {
		this.x = data.x;
		this.y = data.y;
	}
	eats(other) {
		let dist = Math.hypot(this.x - other.x, this.y - other.y);
		if (dist < this.radius / 2 + other.radius / 2 && this.radius > other.radius) {
			var sum =
				Math.PI * this.radius * this.radius + Math.PI * other.radius * other.radius;
			this.radius = Math.sqrt(sum / Math.PI);
			return true;
		}
		return false;
	}
	eatsFood() {
		foods.forEach(food => {
			if (this.eats(food)) {
				foods.splice(foods.indexOf(food), 1);
				generateFood(1)
			}
		});
	}
}

class Food {
	constructor() {
		this.x = Util.random(0, Util.WIDTH);
		this.y = Util.random(0, Util.HEIGHT);
		this.radius = 15;
		this.color = {
			r: Util.random(0, 255),
			g: Util.random(0, 255),
			b: Util.random(0, 255)
		};
	}
}

module.exports = function(io) {
	var lio = io.of("/Live");

	lio.on("connection", function(client) {
		// Sent by PC after link to init game communication
		client.on("createBlob", () => {
			var blob = new Blob(client.id);
			blobs.push(blob);
			client.emit("createBlob", {
				x: blob.x,
				y: blob.y,
				width: Util.WIDTH,
				height: Util.HEIGHT
			});
			generateFood(20);
		});

		// PC => Server
		client.on("updateBlobPos", data => {
			let blob = blobs.find(blob => blob.id === client.id);
			if (!blob) return;
			blob.update(data);
			blob.eatsFood();

			blobs.forEach(item => {
				if (item.id !== client.id && blob.eats(item)) {
					deleteBlob(item.id);
				}
			});
		});

		client.on("leave", () => {
			deleteBlob(client.id);
		});

		client.once("disconnect", () => {
			deleteBlob(client.id);
		});

		const beat = () => {
			lio.emit("beat", { blobs, foods });
		};

		setInterval(beat, 100);
	});
};

const deleteBlob = id => {
	if (!blobs) return;
	var index = blobs.findIndex(blob => blob.id === id);
	if (index !== -1) {
		blobs.splice(index, 1);
		removeFood(20);
	}
};

const usersCount = (io, room) => {
	if (!io.nsps["/Live"].adapter.rooms[room]) return 0;
	return io.nsps["/Live"].adapter.rooms[room].length;
};

const noRoom = client => {
	client.emit("noRoom", "Ce code n'est pas valide");
};

const generateFood = x => {
	for (var i = 0; i < x; i++) {
		foods.push(new Food());
	}
};

const removeFood = x => {
	for (var i = 0; i < x; i++) {
		foods.pop();
	}
};
