import Blob from './blob'

export default function sketch(p) {
    let speedX = 0, speedY = 0, x, y, prevTime,
        radius = 50, stroke = radius / 10, width = radius + stroke;
    let blobs = [];
    let blob;
    let socket;

    p.setup = () => {
        p.createCanvas(window.innerWidth, window.innerHeight, p.P2D);
        x = p.width / 2;
        y = p.height / 2;
        prevTime = p.millis();
        blob = new Blob(x, y, p)
    }

    p.myCustomRedrawAccordingToNewPropsHandler = props => {
        socket = props.socket
        speedX = props.speedX
        speedY = props.speedY
        blobs = props.blobs
        if (!blob || !socket) return
        socket.emit('updateBlobPos', {
            x: blob.x, y: blob.y, radius: blob.radius
        })
    }

    p.update = () => {
        if (!speedX || !speedY || !socket) return
        const currentTime = p.millis(), deltaTime = currentTime - prevTime;
        x += p.map(speedX, -40, 40, -0.2, 0.2) * deltaTime
        y += p.map(speedY, -40, 40, -0.2, 0.2) * deltaTime
        x = p.constrain(x, 0 + width / 2, p.width - width / 2)
        y = p.constrain(y, 0 + width / 2, p.height - width * 2);
        prevTime = currentTime;

        blob.update(x, y)
    }

    p.draw = () => {
        p.update();

        p.background(50, 200, 220);
        p.strokeWeight(stroke)
        p.stroke(70, 120, 120);
        p.fill(60, 230, 200)

        blob.draw(p)

        var toDelete = -1;
        blobs.forEach(item => {
            if (item.id === socket.id) return
            if (blob.eats(item)) {
                toDelete = blobs.indexOf(item)
            }
        })
        blobs.splice(toDelete, 1)

        blobs.forEach((item) => {
            if (item.id === socket.id) {
                if (item.radius === 0)
                    blob.radius = 0
                return
            }
            p.ellipse(item.x, item.y, item.radius, item.radius);
        })
    }
};