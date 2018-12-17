namespace VideoTypes {
    export interface VideoSource {
        src: string;
        type: string;
        label: string;
        res?: number;
        default?: boolean;
    }
    export interface SubtitleSource {
        src: string;
        label: string;
        kind: string;
        language?: string;
        default?: string;
    }
    export interface VideoData {
        poster: string;
        title: string;
        tracks: Array<SubtitleSource>;
        src: VideoSource | Array<VideoSource>;
        origin?: string;
        host?: string;
    }
}