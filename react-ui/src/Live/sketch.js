
export default function sketch(p) {
    let speedX = 0, speedY = 0, x, y, prevTime,
        radius = 50, stroke = radius / 10, width = radius + stroke;
    let blobs = [];
    let socket, id;

    p.setup = () => {
        p.createCanvas(window.innerWidth, window.innerHeight, p.P2D);
        x = p.width / 2;
        y = p.height / 2;
        prevTime = p.millis();
    }

    p.myCustomRedrawAccordingToNewPropsHandler = props => {
        socket = props.socket
        speedX = props.speedX
        speedY = props.speedY
        blobs = props.blobs
        id = props.id
    }

    p.update = () => {
        const currentTime = p.millis(), deltaTime = currentTime - prevTime;
        x += p.map(speedX, -40, 40, -0.2, 0.2) * deltaTime
        y += p.map(speedY, -40, 40, -0.2, 0.2) * deltaTime
        x = p.constrain(x, 0 + width / 2, p.width - width / 2)
        y = p.constrain(y, 0 + width / 2, p.height - width * 2);
        prevTime = currentTime;
        if(!socket) return
        socket.emit('updateBlobPos', {
            x, y, radius
        })
    }

    p.draw = () => {
        p.update();

        p.background(50, 200, 220);
        p.strokeWeight(stroke)
        p.stroke(70, 120, 120);
        p.fill(60, 230, 200)

        p.ellipse(x, y, radius, radius);

        blobs.forEach((item, index) => {
            if(item.id === id) return
            p.ellipse(item.x, item.y, item.radius, item.radius);
        })
    }
};