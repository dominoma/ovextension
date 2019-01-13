import * as Page from "OV/page";
import * as Languages from "OV/languages";
import * as Messages from "OV/messages";
import * as Storage from "OV/storage";
import * as Tools from "OV/tools";
import * as Analytics from "OV/analytics";

import * as VideoPopup from "Messages/videopopup";

import * as VideoTypes from "video_types";

import { ComboBox, ComboBoxEntry } from "./combobox";

Messages.setupMiddleware();
function getWebsiteIcon(host: string) {
    return Tools.createRequest({ url: host }).then(function(xhr) {
        let matches = xhr.response.match(/(<link[^>]+rel=["|']shortcut icon["|'][^>]*)/);
        if (matches) {
            let favicon = matches[1].match(/href[ ]*=[ ]*["|']([^"|^']*)["|']/);
            if (favicon) {
                let url = favicon[1];
                if (!url.match(/https?:/)) {
                    url = host + url;
                }
                return url;
            }
            else {
                return null;
            }
        }
        else {
            return null;
        }
    });
}

Page.isReady().then(function() {
    Analytics.fireEvent("VideoSearch", "PlayerEvent", "");
    interface Website {
        name: string;
        host: string;
        favicon: string;
    }
    class WebsiteEntry extends ComboBoxEntry<Website> {

        private deleteBtn_: HTMLElement = null;

        get icon() {
            return (this.el.style.backgroundImage.match(/url\('([^']*)'\)/) || ["", ""])[1];
        }
        set icon(url: string) {
            this.el.style.backgroundImage = "url('" + url + "')";
        }

        get isWebsite() {
            return this.data.host.indexOf("$$") != 0;
        }

        repaint() {
            this.text = this.data.name;
            this.icon = this.data.favicon;
            if (!this.isDisplay && this.isWebsite && !this.deleteBtn_) {
                let this_ = this;
                this.deleteBtn_ = document.createElement("span");
                this.deleteBtn_.addEventListener("click", function(e: MouseEvent) {
                    this_.remove();
                    (this_.comboBox as WebsiteBox).saveWebsites();
                    e.preventDefault();
                    e.stopPropagation();
                });
                this.el.appendChild(this.deleteBtn_);
            }
        }
    }
    class WebsiteBox extends ComboBox<Website> {

        constructor(id: string, defaultEntry: Website) {
            super(id, defaultEntry);
            this.display.el.appendChild(document.createElement("span"));
        }

        protected createEntry(data: Website) {
            let entry: WebsiteEntry = new WebsiteEntry(this);
            entry.data = data;
            return entry;
        }

        get websiteEntries() {
            return this.entries.filter((el) => { return el.host.indexOf("$$") != 0 });
        }
        loadWebsites() {
            let this_ = this;
            return Storage.sync.get("VideoSearchWebsites").then(function(sites: Website[]) {
                if (sites == null) {
                    return resolveFavicons([
                        { name: "9Anime", host: "9anime.to" },
                        { name: "StreamCR", host: "scr.cr" },
                        { name: "KimCartoon", host: "kimcartoon.to" }
                    ]);

                }
                else {
                    return sites;
                }
            }).then(function(sites) {
                this_.entries = [
                    { name: "Add Site to search", host: "$$AddSite", favicon: "" },
                    { name: "All listed Sites", host: "$$AllSites", favicon: "" }
                ].concat(sites);
                this_.select(1);
            });
        }
        saveWebsites() {
            Storage.sync.set("VideoSearchWebsites", this.websiteEntries);
        }

        onSelected() {
            console.log(this.selected.data)
            if (this.selected.data.host == "$$AddSite") {
                let value = prompt("Please enter name and host of the website seperated by a comma. (eg. 'YouTube,youtube.com')", "name,host");
                if (value) {
                    let this_ = this;
                    let args = value.split(",").map((e) => { return e.trim() });
                    Analytics.fireEvent(args[0], "VideoSearchSiteAdded", args[1]);

                    getWebsiteIcon("https://" + args[1]).then(function(favicon) {
                        let newentry = { name: args[0], host: args[1], favicon: favicon };
                        this_.addItem(newentry);
                        this_.select(this_.items.length);
                        this_.saveWebsites();
                    });
                }
                else {
                    this.select(1);
                }


            }
            else {
                let search = document.getElementById("search") as HTMLInputElement;
                if (search.value) {
                    location.href = Page.getObjUrl({ q: search.value, site: this.selected.data });
                }
            }

        }
    }


    function resolveFavicons(sites: { name: string, host: string }[]) {
        return Promise.all(sites.map(function(site) {
            return getWebsiteIcon("https://" + site.host);
        })).then(function(favicons) {
            return favicons.map(function(icon, index) {
                return { name: sites[index].name, host: sites[index].host, favicon: icon };
            });
        });
    }


    function setup() {

        let searchBar = document.getElementById("searchBar");
        let search = document.getElementById("search") as HTMLInputElement;
        let websites = new WebsiteBox("websites", { name: "All Sites", host: "$$AllSites", favicon: "" });

        let searchresults = document.getElementById("searchresults");
        searchBar.insertBefore(websites.el, searchresults);

        search.addEventListener("keypress", function(e: KeyboardEvent) {
            if (e.keyCode == 13) {
                location.href = Page.getObjUrl({ q: search.value, site: websites.selected.data });
                return false;
            }
            return true;
        });

        return websites.loadWebsites().then(function() {
            return { websites: websites };
        });

    }

    interface SearchResult {
        url: string;
        title: string;
        description: string;
    }
    setup().then(function(vars) {
        let websites = vars.websites;
        function startSearch(input: string, selected: Website) {
            let hosts = [] as string[];
            if (selected.host == "$$AllSites") {
                hosts = websites.websiteEntries.map(function(el) {
                    return el.host;
                });
            }
            else {
                hosts.push(selected.host);
            }
            let searchq = (input + " " + hosts.map(function(el) {
                return "site:" + el;
            }).join(" OR ")).split(" ").map(function(el) {
                return encodeURIComponent(el.trim());
            }).filter(function(el) {
                return el != "";
            }).join("+");
            let url = "https://www.google.com/search?q=" + searchq;
            console.log(url);
            Tools.createRequest({ url: url }).then(function(xhr) {
                let html = (new DOMParser()).parseFromString(xhr.response, "text/html");
                let results = html.querySelectorAll(".g");
                let data: SearchResult[] = [];
                for (let result of results) {
                    if (result.querySelector("h3") && result.querySelector("span.st")) {
                        let title = result.querySelector("h3").innerText;
                        let url = result.querySelector("a").href;
                        let description = result.querySelector("span.st").innerHTML;
                        data.push({ title: title, url: url, description: description });
                    }
                }
                displayResults(data);
            });
        }
        function createSearchEntry(data: SearchResult) {
            let wrapper = document.createElement("div");
            let title = document.createElement("div");
            let description = document.createElement("div");
            let websiteEntry = websites.websiteEntries.find(function(entry) {
                return data.url.indexOf(entry.host) != -1;
            });
            wrapper.className = "search-entry";
            title.className = "title";
            description.className = "description";
            title.innerHTML = data.title;
            if (websiteEntry) {
                title.style.backgroundImage = "url('" + websiteEntry.favicon + "')";
            }
            description.innerHTML = data.description;
            wrapper.appendChild(title);
            wrapper.appendChild(description);
            wrapper.addEventListener("click", function() {
                location.href = data.url;
            });
            return wrapper;
        }
        function createNoResults() {
            let noresults = document.createElement("div");
            noresults.className = "no-results";
            noresults.innerText = "No Results";
            return noresults;
        }
        function displayResults(data: SearchResult[]) {
            let searchresults = document.getElementById("searchresults");
            searchresults.innerHTML = "";
            let container = document.getElementById("container");
            container.style.verticalAlign = "top";
            searchresults.style.removeProperty("display");
            console.log(data);
            for (let result of data) {
                searchresults.appendChild(createSearchEntry(result));
            }
            if (data.length == 0) {
                searchresults.appendChild(createNoResults());
            }
        }
        let urlobj = Page.getUrlObj();
        if (urlobj) {
            let search = document.getElementById("search") as HTMLInputElement;
            websites.select(websites.items.findIndex(function(item) {
                return item.data.host == urlobj["site"].host;
            }));
            search.value = urlobj["q"];

            startSearch(urlobj["q"], urlobj["site"]);
        }
    });

});