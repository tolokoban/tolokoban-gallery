import { IIntlText } from "./tp/types"
export * from "./tp/types"
import TraceMarker from "./tp/trace-marker"

export interface IGeoLocation {
    status: "off" | "denied" | "unavailable" | "on";
    lat: number;
    lng: number;
    alt: number;
    speed: number;
    accuracy: number;
    altitudeAccuracy: number;
    timestamp: number;
}


export interface IPack {
    id: number;
    title: IIntlText;
    shortDescription: IIntlText;
    longDescription: IIntlText;
    background: string;
    traces: number[];
}

export interface IMarker {
    lat: number;
    lng: number;
    idx?: number;
    num?: IIntlText;
    txt?: IIntlText;
    com?: IIntlText;
    pic?: string;
    rad?: number;
    aud?: IIntlText;
    ico?: number[]
}

export interface ITrace {
    id: number;
    zip: number;
    title: IIntlText;
    com: IIntlText;
    logo: string;
    icons: string[];
    markers: IMarker[];
    lat: number[];
    lng: number[];
    alt: number[];
    tourism: {
        [key: string]: {
            lbl: IIntlText;
            val: IIntlText;
        }
    }
}

export interface IAppInfo {
    version: number;
    title: IIntlText;
    logo: string;
    theme: {
        bg0: string;
        bg1: string;
        bg2: string;
        bg3: string;
        bgP: string;
        bgPL: string;
        bgPD: string;
        bgS: string;
        bgSL: string;
        bgSD: string;
    };
    maps: {
        [key: string]: {
            // Some map sources need a key.
            key: string;
            // User friendly name.
            name: string;
            // Ex.: [
            //   "https://a.tile.thunderforest.com/landscape/{zoom}/{col}/{row}.png?apikey={key}",
            //   "https://b.tile.thunderforest.com/landscape/{zoom}/{col}/{row}.png?apikey={key}",
            //   ...
            // ]
            urls: string[];
            // If `true`, we are allowed to store the tiles for offline usage.
            offline: boolean;
            // Most of the map sources are free. But they ask us to display the
            // attribution URLs.
            attributions: string[];
        }
    }
    packs: IPack[];
    traces: ITrace[];
}

export interface IAction {
    type: string;
    [key: string]: any;
}

export interface IRefreshing {
    packs: boolean;
}

export interface ICurrent {
    page: "packs" | "traces" | "trace" | "map" | "marker";
    lang: string;
    pack?: IPack;
    trace?: ITrace;
    marker?: TraceMarker;
    speaking?: boolean;
    tracking?: boolean;
}

export interface IAppState {
    app: IAppInfo;
    current: ICurrent;
    packs: IPack[];
    refreshing: IRefreshing;
    traces: ITrace[];
}
