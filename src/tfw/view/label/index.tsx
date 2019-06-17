import React from "react"

import "./label.css"

interface ILabelProps {
    label?: string;
}

export default class Label extends React.Component<ILabelProps, {}> {
    constructor( props: ILabelProps ) {
        super( props );
    }

    render() {
        const label = this.props.label;
        if( typeof label !== 'string' || label.trim().length === 0 ) return null;
        return (<div className="tfw-view-Label">{
            this.props.label
        }</div>)
    }
}
