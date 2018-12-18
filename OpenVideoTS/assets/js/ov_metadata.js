var OVMetadata;
(function (OVMetadata) {
    function toDataURL(url) {
        return OV.tools.createRequest({
            url: url, beforeSend: function (xhr) {
                xhr.responseType = 'blob';
            }
        }).then(function (xhr) {
            return new Promise(function (resolve, reject) {
                var reader = new FileReader();
                reader.onloadend = function () {
                    resolve("url(" + reader.result + ")");
                };
                reader.readAsDataURL(xhr.response);
            });
        });
    }
    document.addEventListener("DOMContentLoaded", function (event) {
        let ovtags = document.getElementsByTagName("openvideo");
        if (ovtags.length > 0) {
            let ovtag = ovtags[0];
            ovtag.innerText = OV.environment.getManifest().version;
            var playimage = "";
            if (ovtag.hasAttribute("playimage")) {
                toDataURL(ovtag.getAttribute("playimage")).then(function (dataurl) {
                    playimage = dataurl;
                });
            }
            var playhoverimage = "";
            if (ovtag.hasAttribute("playhoverimage")) {
                toDataURL(ovtag.getAttribute("playhoverimage")).then(function (dataurl) {
                    playhoverimage = dataurl;
                });
            }
            /*var reloadimage = null;
        if(ovtag.attributes.reloadimage) {
            reloadimage = "url(data:image/png;base64,"+btoa(OV.tools.ajax({url: ovtag.attributes.reloadimage.value, async: false}).response)+")";
        }
        var reloadhoverimage = null;
        if(ovtag.attributes.reloadhoverimage) {
            reloadhoverimage = "url(data:image/png;base64,"+btoa(OV.tools.ajax({url: ovtag.attributes.reloadhoverimage.value, async: false}).response)+")";
        }*/
            //alert("W")
            OV.messages.addListener({
                requestPlayerCSS: function (data, sender, sendResponse) {
                    sendResponse({ doChange: true, color: ovtag.getAttribute("color"), playimage: playimage, playhoverimage: playhoverimage });
                }
            });
            //alert("W2")
            ovtag.dispatchEvent(new Event("ov-metadata-received"));
        }
    });
})(OVMetadata || (OVMetadata = {}));
//# sourceMappingURL=ov_metadata.js.map