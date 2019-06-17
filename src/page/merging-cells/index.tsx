import React from "react"
import Painter from "./painter"

import "./merging-cells.css"

interface IMargingCellsProps {

}

export default class MargingCells extends React.Component<IMargingCellsProps, {}> {
    private readonly ref: React.RefObject<HTMLCanvasElement> = React.createRef();

    constructor( props: IMargingCellsProps ) {
        super( props );
    }

    private getContext() {
        const canvas = this.ref.current;
        if( !canvas ) return null;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        return canvas.getContext("2d");
    }

    private paint() {
        const ctx = this.getContext();
        if( !ctx ) return;
        const W = ctx.canvas.clientWidth;
        const H = ctx.canvas.clientHeight;
        Painter.paint(ctx, W, H);
    }

    componentDidMount() {
        this.paint();
        window.addEventListener("resize", () => this.paint());
    }

    render() {
        return (<div className="page-MergingCells">
            <canvas ref={this.ref} className="canvas"></canvas>
        </div>)
    }
}
