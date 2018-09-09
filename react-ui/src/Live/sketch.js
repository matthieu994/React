
export default function sketch(p) {
    let speedX = 0, speedY = 0, x, y,
        radius = 50, stroke = radius / 10, width = radius + stroke;
    let prevTime;

    p.setup = () => {
        p.createCanvas(800, 400, p.P2D);
        x = p.width/2;
        y = p.height/2;
        prevTime = p.millis();
    }

    p.myCustomRedrawAccordingToNewPropsHandler = props => {
        speedX = props.speedX
        speedY = props.speedY
    }

    p.update = () => {
        const currentTime = p.millis(), deltaTime = currentTime - prevTime;
        x += p.map(speedX, -10, 50, 0, 0.2) * deltaTime
        y += p.map(speedY, -10, 50, 0, 0.2) * deltaTime
        x = p.constrain(x, 0 + width / 2, p.width - width / 2)
        y = p.constrain(y, 0 + width / 2, p.height - width / 2);
        prevTime = currentTime;
    }

    p.draw = () => {
        p.update();

        p.background(50, 200, 220);
        p.strokeWeight(stroke)
        p.stroke(70, 120, 120);
        p.fill(60, 230, 200)

        p.ellipse(x, y, radius, radius);
    }
};