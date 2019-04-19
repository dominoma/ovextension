import "./videobody.scss";

import * as VideoTypes from "video_types";
import * as React from "react";

import * as Storage from "OV/storage";

function secondsToTime(seconds : number) {
    let date = new Date(0);
    date.setSeconds(seconds);
    let string = date.toISOString().substr(11, 8);
    while(string[0] == "0" || string[0] == ":") {
        string = string.substring(1, string.length);
    }
    return string;
}
type VideoLinkProps = {
    videoData: VideoTypes.VideoRefData;
    onRemove: (data: VideoTypes.VideoRefData) => any;
    playing: boolean;
    onWatchDirect: (videoData: VideoTypes.VideoRefData) => any;
}
export class VideoLink extends React.Component<VideoLinkProps,{}> {

    render() {

        let className = "ov-lib-videoref";
        if(this.props.playing) {
            className += " ov-lib-videoref-playing";
        }
        let hasParent = this.props.videoData.parent &&
                        this.props.videoData.parent.url != "CONVERTED_FROM_OLD" &&
                        this.props.videoData.parent.url != "POPUP";
        let subtitle = this.props.videoData.origin.name;
        if(hasParent) {
            subtitle += " • "+this.props.videoData.parent!.name;
        }
        let links = hasParent ? (
            <div className="ov-lib-videoref-links">
                <div
                    className="ov-lib-videoref-origin-link"
                    onClick={this.originClick.bind(this)}
                    title={"Watch on "+this.props.videoData.origin.name}
                >
                    <p style={
                        { backgroundImage: "url('"+this.props.videoData.origin.icon+"')"}
                    }>{this.props.videoData.origin.name}</p>
                </div>
                <div
                    className="ov-lib-videoref-parent-link"
                    onClick={this.parentClick.bind(this)}
                    title={"Watch on "+this.props.videoData.parent!.name}
                >
                    <p style={
                        { backgroundImage: "url('"+this.props.videoData.parent!.icon+"')"}
                    }>{this.props.videoData.parent!.name}</p>
                </div>
            </div>
        ) : null;
        return (
            <div className={className}>
                <div
                    onClick={hasParent ? undefined : this.originClick.bind(this)}
                    className="ov-lib-videoref-thumbnail"
                    style={{backgroundImage: "url('"+this.props.videoData.poster+"')"}}
                >
                    <div className="ov-lib-videoref-watched" style={
                        {
                            marginRight: (1 - this.props.videoData.watched/this.props.videoData.duration) * 100 + "%"
                        }
                    }></div>
                    <div className="ov-lib-videoref-duration">{secondsToTime(this.props.videoData.duration)}</div>
                    {links}
                </div>
                <div className="ov-lib-videoref-title">{this.props.videoData.title}</div>
                <div className="ov-lib-videoref-subtitle">{subtitle}</div>
                <div className="ov-lib-videoref-x" onClick={this.closeClick.bind(this)}></div>
            </div>
        );
    }
    closeClick() {
        this.props.onRemove(this.props.videoData);
    }
    originClick() {
        if(this.props.videoData.parent && this.props.videoData.parent!.url == "POPUP") {
            location.href = this.props.videoData.origin.url;
        }
        else {
            this.props.onWatchDirect(this.props.videoData);
        }
    }
    parentClick() {
        location.href = this.props.videoData.parent!.url;
    }

}
type VideoListProps = {
    playlist: string,
    onVideoRemoved: (el: VideoTypes.VideoRefData) => void,
    filter: RegExp | null;
};
type VideoListState = {
    videos: VideoTypes.VideoRefData[],
    playing: VideoTypes.VideoRefData | null;
}
export class VideoList extends React.Component<VideoListProps, VideoListState> {

    constructor(props: VideoListProps) {
        super(props);
        this.state = { videos: [], playing: null };
    }
    componentDidUpdate(prevProps : VideoListProps) {
        if(this.props.playlist != prevProps.playlist) {
            Storage.getPlaylistByID(this.props.playlist).then((videos)=>{
                console.log(videos);
                this.setState({ videos: videos, playing: null });
            });
        }
    }
    componentDidMount() {
        Storage.getPlaylistByID(this.props.playlist).then((videos)=>{
            console.log(videos);
            this.setState({ videos: videos });
        });
    }
    render() {
        console.log(this.state.videos);
        let className = "ov-lib-videolist";
        let iframe = null;
        if(this.state.playing) {
            className += " ov-lib-videolist-playing";
            iframe = <iframe src={this.state.playing.origin.url}></iframe>
        }
        return (
            <div className="ov-lib-video">
                {iframe}
                <div className={className}>
                {
                    this.state.videos.filter((el)=>{
                        return !this.props.filter || this.props.filter.test(el.title);
                    }).map((el)=>{
                        return (
                            <VideoLink
                                playing={!!this.state.playing && el.origin.url == this.state.playing.origin.url}
                                key={el.origin.url}
                                videoData={el}
                                onRemove={this.linkRemoved.bind(this)}
                                onWatchDirect={this.watchDirectClick.bind(this)}
                            />
                        );
                    })
                }
                </div>
            </div>
        );
    }
    watchDirectClick(videoData : VideoTypes.VideoRefData) {
        this.setState({ playing: videoData });
    }
    linkRemoved(data: VideoTypes.VideoRefData) {
        let index = this.state.videos.findIndex((el)=>{
            return el.origin.url == data.origin.url;
        });
        let newPlaylist = this.state.videos.slice();
        newPlaylist.splice(index, 1);
        this.setState({ videos: newPlaylist });
        Storage.setPlaylistByID(this.props.playlist, newPlaylist);
        this.props.onVideoRemoved(data);
    }
}
