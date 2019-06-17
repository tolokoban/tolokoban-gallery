import Color from "../../tfw/color"

const NB_MIN_CELLS = 7;
const NB_MAX_CELLS = 9;
const RING_SIZE = 16;

class Cell {
    private odd: boolean = false;
    private readonly color2: string;

    constructor(private x: number, private y: number,
        private radius: number, private color: string) {
        // The second color is 10% darker.
        const c1 = new Color(color);
        c1.rgb2hsl();
        c1.L = Math.max(0, c1.L - 0.1);
        c1.hsl2rgb();
        this.color2 = c1.stringify();
    }

    paint(ctx: CanvasRenderingContext2D, ringSize: number) {
        const radius = this.radius;
        if (radius < ringSize) return false;
        this.radius -= ringSize;
        const nbSections = radius * 6;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.fillStyle = this.odd ? this.color : this.color2;
        ctx.strokeStyle = "#00000077";

        ctx.moveTo(radius, 0);
        for( let k=1; k<nbSections; k++) {
            ctx.lineTo(
                Math.cos(2 * Math.PI * k / nbSections) * radius,
                Math.sin(2 * Math.PI * k / nbSections) * radius
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
        let cells = createCells(W, H);
        while (cells.length > 0) {
            const cellsToRemove: Cell[] = [];
            for (const cell of cells) {
                if (!cell.paint(ctx, 16)) {
                    cellsToRemove.push(cell);
                }
            }
            cells = cells.filter(c => cellsToRemove.indexOf(c) === -1);
        }
    }
}


function createCells(W: number, H: number): Cell[] {
    const cells = [];
    const radius = Math.min(W, H) / 2;
    const count = Math.floor(rnd(NB_MIN_CELLS, NB_MAX_CELLS));
    const hue = rnd(1);
    const color = new Color();
    for (let k = 0; k < count; k++) {
        color.H = hue + k / count;
        color.S = 0.5;
        color.L = 1;
        color.hsl2rgb();
        cells.push(new Cell(
            rnd(W), rnd(H), radius, color.stringify()
        ));
    }

    return cells;
}


function rnd(a: number, b: number | null = null): number {
    const min = b === null ? 0 : a;
    const max = b === null ? a : b;
    return min + Math.random() * (max - min);
}
