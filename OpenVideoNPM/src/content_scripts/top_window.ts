import * as TheatreMode from "Messages/theatremode";
import * as Metadata from "Messages/metadata";
import * as VideoPopup from "Messages/videopopup";
import * as Messages from "OV/messages";
import * as VideoHistory from "Messages/videohistory";

Messages.setupMiddleware();
TheatreMode.setup();
Metadata.setup();
VideoPopup.setup();
VideoHistory.setup();
