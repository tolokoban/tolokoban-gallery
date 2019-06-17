import React from "react"
import { connect } from 'react-redux'
import Stack from "./tfw/layout/stack"
import PagePacks from "./guide/page/packs/container"
import PageTraces from "./guide/page/traces/container"
import PageTrace from "./guide/page/trace/container"
import PageMap from "./guide/page/map/container"
import PageMarker from "./guide/page/marker/container"

import { IAppState } from "./types"

import "./tfw/font/josefin.css"
import "./App.css";


class App extends React.Component<IAppState, {}> {
    componentDidMount() {
    }

    componentDidUpdate() {
    }

    render() {
        return (
            <Stack value={this.props.current.page} fullscreen={true}>
                <PagePacks key="packs"/>
                <PageTraces key="traces"/>
                <PageTrace key="trace"/>
                <PageMap key="map"/>
                <PageMarker key="marker"/>
            </Stack>
        )
    }
}


function mapStateToProps(state: IAppState) {
    return {...state};
}

function mapDispatchToProps(dispatch) {
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
