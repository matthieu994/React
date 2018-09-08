
export default function sketch(p) {
    let x = 0, y = 0;

    p.setup = () => {
        p.createCanvas(800, 400, p.P2D);
    }

    p.myCustomRedrawAccordingToNewPropsHandler = props => {
        x = props.x
        y = props.y
    }

    p.draw = () => {
        p.background(50, 200, 220);
        p.stroke(70, 120, 120);
        p.fill(60, 230, 200)
        p.ellipse(x, y, 55, 55);
    }
};