import "./videopopup.scss";

import * as Page from "OV/page";

import * as VideoPopup from "Messages/videopopup";

import * as VideoTypes from "video_types";
import {OVPlayer} from "../assets/ts/ov_player";
import * as Background from "Messages/background";

import * as React from "react";
import * as ReactDOM from "react-dom";

interface PopupData {
    videos: VideoTypes.VideoData[];
    autoplay: boolean;
}
type PopupContentProps = {
    data : PopupData
}
type PopupContentState = {
    currentVideo: number;
    videos: VideoTypes.VideoData[];
}

class PopupContent extends React.Component<PopupContentProps,PopupContentState> {

    constructor(props : PopupContentProps) {
        super(props);
        this.state = { videos: this.props.data.videos, currentVideo: 0 };
    }

    render() {
        let buttonStr = "Video "+(this.state.currentVideo+1)+" of "+this.state.videos.length;
        Background.setIconText((this.state.videos.length || "").toString());
        if(this.state.videos.length == 0) {
            VideoPopup.closePopup();
            setTimeout(()=>{VideoPopup.setIconOpensPopup(false);}, 500);
            return null;
        }
        else {
            return (
                <div className="ov-videopopup-content">
                    <div className="ov-videopopup-header">
                        <h2>OpenVideo found videos!</h2>
                        <div className="ov-videopopup-close" onClick={this.popupClose.bind(this)}>&times;</div>
                    </div>
                    <div className="ov-videopopup-player">
                        <OVPlayer
                            videoData={this.state.videos[this.state.currentVideo]}
                            isPopup={true}
                            onError={this.playerError.bind(this)}
                        />
                    </div>
                    <div className="ov-videopopup-footer">
                        <button className="ov-videopopup-button" onClick={this.prevClick.bind(this)}>&lt;</button>
                        <button className="ov-videopopup-button-disabled">{buttonStr}</button>
                        <button className="ov-videopopup-button" onClick={this.nextClick.bind(this)}>&gt;</button>
                    </div>
                </div>
            );
        }
    }
    playerError() {
        let videos = this.state.videos.concat();
        videos.splice(this.state.currentVideo, 1);
        let currentVideo = this.state.currentVideo;
        if(currentVideo >= videos.length) {
            currentVideo = videos.length - 1;
        }
        this.setState({ videos: videos, currentVideo: currentVideo })
    }
    prevClick() {
        if(this.state.currentVideo > 0) {
            this.setState({ currentVideo: this.state.currentVideo-1 });
        }
    }
    nextClick() {
        if(this.state.currentVideo < this.state.videos.length-1) {
            this.setState({ currentVideo: this.state.currentVideo+1 });
        }
    }
    popupClose() {
        VideoPopup.closePopup();
        VideoPopup.setIconOpensPopup(true);
    }

}
ReactDOM.render(<PopupContent data={Page.getUrlObj()} />, document.body);
