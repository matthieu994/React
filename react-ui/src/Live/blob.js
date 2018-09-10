const radius = 50;

export default class Blob {
    constructor(x, y, p) {
        this.p = p;
        this.x = x;
        this.y = y;
        this.radius = radius;
    }

    constrain() {

    }

    eats(other) {
        let dist = Math.hypot(this.x - other.x, this.y - other.y)
        if (dist < other.radius) {
            this.radius += other.radius
            return true
        }
        return false
    }

    update(x, y) {
        this.x = x;
        this.y = y;
    }

    draw() {
        this.p.ellipse(this.x, this.y, this.radius, this.radius);
    }
}