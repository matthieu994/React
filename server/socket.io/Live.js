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
		if (dist < other.radius && this.radius > other.radius) {
			this.radius += other.radius;
			return true;
		}
		return false;
	}
}

class Food {
	constructor() {
		this.x = Util.random(0, Util.WIDTH);
		this.y = Util.random(0, Util.HEIGHT);
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
		// Sent by PC
		client.on("createCode", () => {
			const code = Util.generateCode();
			if (usersCount(io, code) != 0) return noRoom(client, code);
			client.emit("getCode", code);
			client.join(code);
		});

		// Sent by phone
		client.on("link", code => {
			if (usersCount(io, code) != 1) return noRoom(client, code);
			client.join(code);
			lio.in(code).emit("linkDone", "Link réussi !");
		});

		// Sent by PC after link to init game communication
		client.on("createBlob", () => {
			var blob = new Blob(client.id);
			blobs.push(blob);
			client.emit("createBlob", { x: blob.x, y: blob.y });
			generateFood(20);
		});

		// Phone => PC
		client.on("updatePos", data => {
			client.broadcast
				.to(data.code)
				.emit("updatePos", { degX: data.gamma, degY: data.beta });
		});

		// PC => Server
		client.on("updateBlobPos", data => {
			let blob = blobs.find(blob => blob.id === client.id);
			if (!blob) return;
			blob.update(data);

			blobs.forEach(item => {
				if (item.id !== client.id && blob.eats(item)) {
					deleteBlob(item.id);
				}
			});
		});

		client.on("leave", code => {
			lio.in(code).emit("leave");
			client.leave(code);
		});

		client.on("disconnect", () => {
			deleteBlob(client.id);
		});

		const beat = () => {
			lio.emit("beat", { blobs, foods });
		};

		setInterval(beat, 33);
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
