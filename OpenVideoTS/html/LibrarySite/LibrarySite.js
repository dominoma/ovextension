OV.messages.setupMiddleware();
function createLibraryElem(href, heading, iconUrl, picUrl, canDelete, closeEvent) {
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
    LibMovieTitle.innerText = heading;
    LibMovie.appendChild(LibMovieTitle);
    var LibMoviePic = document.createElement("div");
    LibMoviePic.className = "lib-movie-pic";
    LibMovie.appendChild(LibMoviePic);
    var LibMoviePicImg = document.createElement("img");
    LibMoviePicImg.alt = OV.languages.getMsg("library_site_no_thumbnail_lbl");
    LibMoviePicImg.src = picUrl;
    LibMoviePicImg.onerror = function () {
        LibMoviePicImg.src = 'no-thumbnail.jpg';
    };
    LibMoviePic.appendChild(LibMoviePicImg);
    if (canDelete) {
        var LibMovieX = document.createElement("div");
        LibMovieX.className = "lib-movie-x";
        LibMovieX.addEventListener("click", function (event) {
            LibMovie.href = "javascript:void(0)";
            closeEvent(LibMovie);
            event.stopPropagation();
        });
        LibMovie.appendChild(LibMovieX);
    }
    return LibMovie;
}
function createFolder(title, storageName) {
    return createLibraryElem(location.href + OV.tools.objToHash({ directory: storageName }), title, "folder.png", "folder.png", false);
}
function createVideoLink(videoData) {
    return createLibraryElem(videoData.origin, videoData.title, "https://favicons.githubusercontent.com/" + OV.tools.parseUrl(videoData.origin).host, videoData.poster, true, function (VideoLink) {
        OV.storage.local.get(OV.page.getUrlObj().directory).then(function (VideoHashArr) {
            var itemIndex = VideoHashArr.indexOf(OV.array.search(videoData.origin, VideoHashArr, function (src, arrElem) {
                return arrElem.origin == src;
            }));
            if (itemIndex == -1) {
                VideoHashArr.splice(itemIndex, 1);
            }
            else {
                throw Error("Something went wrong!");
            }
            OV.storage.local.set(OV.page.getUrlObj().directory, VideoHashArr);
        });
        VideoLink.parentElement.removeChild(VideoLink);
    });
}
document.addEventListener("DOMContentLoaded", function () {
    OV.analytics.fireEvent("Library", "PlayerEvent", "");
    document.title = OV.languages.getMsg("library_site_library_lbl") + " - OpenVideo";
    document.getElementById("title").innerText = OV.languages.getMsg("library_site_library_lbl");
    document.getElementById("returnBtn").innerText = OV.languages.getMsg("library_site_return_btn");
    document.getElementById("searchButton").innerText = OV.languages.getMsg("library_site_search_btn");
    document.getElementById("empty_lbl").innerText = OV.languages.getMsg("library_site_empty_lbl");
    document.getElementById("searchText").placeholder = OV.languages.getMsg("library_site_search_input_lbl");
    var Hash = OV.page.getUrlObj();
    var EmptyMsg = document.getElementById("empty");
    if (!Hash) {
        var FolderContainer = document.getElementById("folders");
        FolderContainer.style.display = "block";
        EmptyMsg.style.display = "none";
        FolderContainer.appendChild(createFolder(OV.languages.getMsg("library_site_history_lbl"), "OpenVideoHistory"));
        FolderContainer.appendChild(createFolder(OV.languages.getMsg("library_site_favorites_lbl"), "OpenVideoFavorites"));
    }
    else {
        var VideoLinkContainer = document.getElementById("movies");
        OV.storage.local.get(Hash.directory).then(function (VideoHashArr) {
            VideoHashArr.forEach(function (VideoHash) {
                if (!Hash.searchStr || !VideoHash.title || VideoHash.title.toUpperCase().indexOf(Hash.searchStr.toUpperCase()) != -1) {
                    VideoLinkContainer.appendChild(createVideoLink(VideoHash));
                    VideoLinkContainer.style.display = "block";
                    EmptyMsg.style.display = "none";
                }
            });
        });
        if (Hash.searchStr) {
            document.getElementById("searchText").value = Hash.searchStr;
        }
        document.getElementById("searchButton").addEventListener("click", function () {
            Hash.searchStr = document.getElementById("searchText").value;
            document.location.href = OV.tools.objToHash(Hash);
        });
        document.getElementById("clearSearch").addEventListener("click", function () {
            Hash.searchStr = "";
            document.location.href = OV.tools.objToHash(Hash);
        });
    }
});
//# sourceMappingURL=LibrarySite.js.map