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
export interface VideoData {
    poster: string;
    title: string;
    tracks: Array<SubtitleSource>;
    src: Array<VideoSource>;
    origin?: string;
    host?: string;
}
