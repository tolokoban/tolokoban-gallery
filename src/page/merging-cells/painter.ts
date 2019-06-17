import Color from "../../tfw/color"

const NB_MIN_CELLS = 11;
const NB_MAX_CELLS = 29;
const RING_SIZE = 25;

class Cell {
    private odd: boolean = false;
    private readonly color2: string;
    private readonly maxRadius: number;

    constructor(private x: number, private y: number,
        private radius: number, private color: string) {
        this.maxRadius = radius;
        // The second color is 10% darker.
        const c1 = new Color(color);
        c1.rgb2hsl();
        c1.L = Math.max(0, c1.L - 0.025);
        c1.hsl2rgb();
        this.color2 = c1.stringify();
    }

    paint(ctx: CanvasRenderingContext2D, ringSize: number) {
        const radius = this.radius;
        if (radius < ringSize) return false;
        this.radius -= ringSize * rnd(0.99, 1.001) * (this.odd ? 0.5 : 1);
        this.odd = !this.odd;

        const nbSections = radius;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.strokeStyle = "#00000055";
        const color = new Color(this.odd ? this.color : this.color2);
        const light = 1.0 - 0.9 * radius / this.maxRadius;
        color.R *= light;
        color.G *= light;
        color.B *= light;
        ctx.fillStyle = color.stringify();

        ctx.beginPath();
        ctx.moveTo(radius, 0);
        for (let k = 1; k < nbSections; k++) {
            const r = radius + ringSize * (rnd(0.1) - 0.05);
            const ang = 2 * Math.PI * k / nbSections;
            ctx.lineTo(
                Math.cos(ang) * r,
                Math.sin(ang) * r
            );
        }

        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
        return true;
    }
}

export default {
    paint: (ctx: CanvasRenderingContext2D, W: number, H: number) => {
        ctx.clearRect(0, 0, W, H);
        const cells = createCells(W, H);
        const ringSize = RING_SIZE * Math.min(W, H) * .001;
        while (cells.length > 0) {
            const index = Math.floor(rnd(cells.length));
            const cell = cells[index];
            if (!cell.paint(ctx, ringSize)) {
                cells.splice(index, 1);
            }
        }
    }
}


function createCells(W: number, H: number): Cell[] {
    const cells = [];
    const radius = Math.min(W, H);
    const count = Math.floor(rnd(NB_MIN_CELLS, NB_MAX_CELLS));
    const hue = rnd(1);
    const color = new Color();
    for (let k = 0; k < count; k++) {
        const ang = Math.PI * 2 * k / count;
        const rad = rnd(0.3, 1);
        color.H = hue + k / count;
        while (color.H > 1) color.H -= 1;
        color.S = 0.6;
        color.L = 0.8;
        color.hsl2rgb();
        cells.push(new Cell(
            rad * W * Math.cos(ang) + W / 2,
            rad * H * Math.sin(ang) + H / 2,
            radius, color.stringify()
        ));
    }

    return cells;
}


function rnd(a: number, b: number | null = null): number {
    const min = b === null ? 0 : a;
    const max = b === null ? a : b;
    return min + Math.random() * (max - min);
}
