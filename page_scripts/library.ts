import * as Storage from "OV/storage";
import * as Analytics from "OV/analytics";
import * as Page from "OV/page";
import * as Environment from "OV/environment";
import * as Languages from "OV/languages";
import * as Tools from "OV/tools";
import * as Messages from "OV/messages";
import * as Background from "Messages/background";
import * as VideoTypes from "video_types";
Messages.setupMiddleware();
function createLibraryElem(href: string, heading: string, iconUrl: string, picUrl: string, canDelete: boolean, closeEvent?: (a: HTMLAnchorElement) => void) {


    var LibMovie = document.createElement("a");
    LibMovie.className = "lib-movie";
    LibMovie.href = href;
    //LibMovie.ariaLabel = heading;
    LibMovie.title = heading;
    var LibMovieIcon = document.createElement("div");
    LibMovieIcon.className = "lib-movie-icon";
    LibMovie.appendChild(LibMovieIcon);
    var LibMovieIconImg = document.createElement("img");
    LibMovieIconImg.src = iconUrl;
    LibMovieIcon.appendChild(LibMovieIconImg);
    var LibMovieTitle = document.createElement("div");
    LibMovieTitle.className = "lib-movie-title";
    LibMovieTitle.innerHTML = heading;
    LibMovie.appendChild(LibMovieTitle);
    var LibMoviePic = document.createElement("div");
    LibMoviePic.className = "lib-movie-pic";
    LibMovie.appendChild(LibMoviePic);
    var LibMoviePicImg = document.createElement("img");
    LibMoviePicImg.alt = Languages.getMsg("library_site_no_thumbnail_lbl");
    LibMoviePicImg.src = picUrl;
    LibMoviePicImg.onerror = function() {
        LibMoviePicImg.src = 'no-thumbnail.jpg'
    }
    LibMoviePic.appendChild(LibMoviePicImg);
    if (canDelete) {
        var LibMovieX = document.createElement("div");
        LibMovieX.className = "lib-movie-x";
        LibMovieX.addEventListener("click", function(event) {
            if(closeEvent) {
                closeEvent(LibMovie);
            }
            event.stopPropagation();
            event.preventDefault();
        });
        LibMovie.appendChild(LibMovieX);
    }
    return LibMovie;
}
function createFolder(title: string, storageName: string) {
    return createLibraryElem(location.href + Tools.objToHash({ directory: storageName }), title, "folder.png", "folder.png", false);
}
function createVideoLink(videoData: VideoTypes.HistoryEntry) {
    return createLibraryElem(videoData.origin, videoData.title, "https://favicons.githubusercontent.com/" + Tools.parseURL(videoData.origin).host, videoData.poster, true, async function(VideoLink) {
        let VideoHashArr: VideoTypes.HistoryEntry[] = await Storage.local.get(Page.getUrlObj().directory);
        var itemIndex = VideoHashArr.findIndex(function(arrElem) {
            return arrElem.origin == videoData.origin;
        });
        if (itemIndex != -1) {
            VideoHashArr.splice(itemIndex, 1);
            Storage.local.set(Page.getUrlObj().directory, VideoHashArr);
        }
        else {
            throw Error("Something went wrong!");
        }
        VideoLink.parentElement!.removeChild(VideoLink);
    });
}
Page.isReady().then(async function() {

    Analytics.fireEvent("Library", "PlayerEvent", "");

    document.title = Languages.getMsg("library_site_library_lbl") + " - OpenVideo";
    document.getElementById("title")!.innerText = Languages.getMsg("library_site_library_lbl");
    document.getElementById("returnBtn")!.innerText = Languages.getMsg("library_site_return_btn");
    document.getElementById("searchButton")!.innerText = Languages.getMsg("library_site_search_btn");
    document.getElementById("empty_lbl")!.innerText = Languages.getMsg("library_site_empty_lbl");
    (document.getElementById("searchText") as HTMLInputElement).placeholder = Languages.getMsg("library_site_search_input_lbl");

    document.getElementById("clearBtn")!.addEventListener("click", async function() {
        let doDelete = await Background.confirm("Are you sure you want to clear the video history?\n Your favorites won't be affected.");
        if (doDelete) {
            Storage.local.set("OpenVideoHistory", []);
            location.reload();
        }
    });

    var Hash = Page.getUrlObj();
    var EmptyMsg = document.getElementById("empty");
    if (!Hash) {
        var FolderContainer = document.getElementById("folders");
        FolderContainer!.style.display = "block";
        EmptyMsg!.style.display = "none";
        FolderContainer!.appendChild(createFolder(Languages.getMsg("library_site_history_lbl"), "OpenVideoHistory"));
        FolderContainer!.appendChild(createFolder(Languages.getMsg("library_site_favorites_lbl"), "OpenVideoFavorites"));
        FolderContainer!.appendChild(createLibraryElem(Environment.getVideoSearchUrl(), '<span style="font-weight: bold;color: gold;">NEW</span> Search Videos', "http://www.clker.com/cliparts/z/1/T/u/9/2/search-icon-hi.png", "http://www.clker.com/cliparts/z/1/T/u/9/2/search-icon-hi.png", false));
    }
    else {
        var VideoLinkContainer = document.getElementById("movies");
        let VideoHashArr: VideoTypes.HistoryEntry[] = await Storage.local.get(Hash.directory);
        VideoHashArr.forEach(function(VideoHash) {
            if (!Hash.searchStr || !VideoHash.title || VideoHash.title.toUpperCase().indexOf(Hash.searchStr.toUpperCase()) != -1) {
                VideoLinkContainer!.appendChild(createVideoLink(VideoHash));
                VideoLinkContainer!.style.display = "block";
                EmptyMsg!.style.display = "none";
            }
        });
        if (Hash.searchStr) {
            (document.getElementById("searchText") as HTMLInputElement).value = Hash.searchStr;
        }
        document.getElementById("searchButton")!.addEventListener("click", function() {
            Hash.searchStr = (document.getElementById("searchText") as HTMLInputElement).value;
            document.location.href = Page.getObjUrl(Hash);
        });
        document.getElementById("clearSearch")!.addEventListener("click", function() {
            Hash.searchStr = "";
            document.location.href = Page.getObjUrl(Hash);
        });
    }
});
