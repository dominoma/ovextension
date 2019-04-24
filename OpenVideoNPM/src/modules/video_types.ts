import * as Page from "OV/page";

export interface PageRefData {
    url: string;
    icon: string;
    name: string;
}

export interface VideoRefData {
    poster: string;
    watched: number;
    duration: number;
    title: string;
    origin: PageRefData;
    parent: PageRefData | null;
}

export interface HistoryEntry {
    poster: string;
    title: string;
    origin: string;
    stoppedTime: number;
}
export interface VideoSource {
    src: string;
    type: string;
    label: string;
    res?: number;
    default?: boolean;
    dlsrc?: DownloadSource
}
export interface DownloadSource {
    src: string;
    type: string;
    filename?: string;
}
export interface SubtitleSource {
    src: string;
    label: string;
    kind: string;
    language?: string;
    default?: boolean;
    cues?: VTTCue[]
}
export interface VTTCue {
    startTime: number;
    endTime: number;
    text: string;
    id: string;
    pauseOnExit: boolean;
}
export interface RawVideoData {
    poster: string;
    title: string;
    tracks: Array<SubtitleSource>;
    src: Array<VideoSource>;
}
export interface VideoData extends RawVideoData {
    origin: PageRefData;
    parent: PageRefData | null;
}
export function makeURLsSave(videoData: VideoData) : VideoData;
export function makeURLsSave(videoData: RawVideoData) : RawVideoData;
export function makeURLsSave(videoData: RawVideoData | VideoData) {
    for (let track of videoData.tracks) {
        track.src = Page.getSafeURL(track.src);
    }
    for (let src of videoData.src) {
        src.src = Page.getSafeURL(src.src);
        if (src.dlsrc) {
            src.dlsrc.src = Page.getSafeURL(src.dlsrc.src);
        }
    }
    videoData.poster = Page.getSafeURL(videoData.poster);
    if('origin' in videoData) {
        videoData.origin.icon = Page.getSafeURL(videoData.origin.icon);
        if(videoData.parent) {
            videoData.parent.icon = Page.getSafeURL(videoData.parent.icon);
        }
    }
    return videoData;
}
