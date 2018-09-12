const DEV = false,
	WIDTH = 1920,
	HEIGHT = 1080;

module.exports = {
	generateCode: () => {
		if (DEV) return "DEVCODE";
		return Math.random()
			.toString(36)
			.substring(2, 7)
			.toUpperCase();
	},
	random: (max, min) => {
		return Math.random() * (max - min) + min;
	}
};

module.exports.WIDTH = WIDTH;
module.exports.HEIGHT = HEIGHT;
module.exports.DEV = DEV;
