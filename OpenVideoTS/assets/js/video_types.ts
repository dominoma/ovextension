namespace VideoTypes {
    export interface VideoSource {
        src: string;
        type: string;
        label: string;
        res?: number;
        default?: boolean;
        dlsrc?: { src: string; type: string; filename: string; }
    }
    export interface SubtitleSource {
        src: string;
        label: string;
        kind: string;
        language?: string;
        default?: boolean;
        cues?: Cue[]
    }
    export interface Cue {
        startTime: number;
        endTime: number;
        text: string;
    }
    export interface VideoData {
        poster: string;
        title: string;
        tracks: Array<SubtitleSource>;
        src: Array<VideoSource>;
        origin?: string;
        host?: string;
    }
}