import React from "react";
import ReactDOM from 'react-dom'
import Theme from "./tfw/theme"
import MergingCells from "./page/merging-cells"

import "./tfw/font/josefin.css"
import "./index.css"

Theme.apply("default");

    ReactDOM.render(
        <MergingCells/>,
        document.getElementById("root"));

/*
if (location.hash !== "#packs") {
    location.hash = "#packs";
}

window.addEventListener("hashchange", () => {
    const hash = location.hash;
    console.info("hash=", hash);
    const page = hash.length < 2 ? "packs" : hash.substr(1);
    State.dispatch(State.Current.setPage(page));
}, false);
*/
