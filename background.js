/*  
	DelugeMagnetDownloader,
*/

browser.contextMenus.create({
    id: browser.i18n.getMessage("contextId"),
    title: browser.i18n.getMessage("contextTitle"),
    contexts: ["link"]
});

browser.contextMenus.onClicked.addListener((info, tab) => {
    // Only act if this is our Deluge menu item
    if (info.menuItemId !== browser.i18n.getMessage("contextId")) return;

    // Get Deluge Web URL from options
    browser.storage.local.get("dUrl", function(result){
        if (!result.dUrl) {
            notification(browser.i18n.getMessage("errorUrlOptions"));
            console.error(browser.i18n.getMessage("errorUrlOptions"));
            browser.runtime.openOptionsPage();
            return false;
        }

        if (!info.linkUrl.startsWith('magnet')) {
            console.error(browser.i18n.getMessage("errorNotMagnet",[info.linkUrl]));
            return false;
        }

        var magnetLink = info.linkUrl;
        var url = result.dUrl;
        var queryUrl = result.dUrl;

        if(url.endsWith("/")){
            url = url+"json";
        } else {
            url = url + "/json";
        }

        var jsonObj = {"magnetLink": magnetLink, "url": url};

        if(queryUrl.match("http?.://")){
            queryUrl = queryUrl.replace(queryUrl.match("http?.://"),"");
        }
        if(queryUrl.match(":[0-9]+")){
            queryUrl = queryUrl.replace(queryUrl.match(":[0-9]+"),"");
        }
        if(queryUrl.endsWith("/")){
            queryUrl = queryUrl.slice(0,queryUrl.length -1);
        }

        queryUrl = "*://"+queryUrl+"/";

        function logTabs(tabs) {
            if (tabs.length===0) {
                console.error(browser.i18n.getMessage("errorQueryURL",[url,queryUrl]));
                return false;
            }
            for (let tab1 of tabs) {
                browser.tabs.executeScript(tab1.id,{file: 'content_scripts/content.js'}, function() {
                    browser.tabs.sendMessage(tab1.id,jsonObj).then( response => {
                        notification(browser.i18n.getMessage("sucessTorrent",[response.torrentName]));
                    }, error => {
                        var error_message = JSON.parse(error.message);
                        console.error(browser.i18n.getMessage("failTorrent",[error_message.torrentName, error_message.errorMessage]));
                        notification(browser.i18n.getMessage("failTorrent",[error_message.torrentName, error_message.errorMessage]));
                    });
                });
            }
        }

        function notification(message){
            browser.notifications.create({
                type: 'basic',
                iconUrl: browser.runtime.getURL('icons/deluge-48.png'),
                title: browser.i18n.getMessage("extensionName"),
                message: message
            }).then((id) =>{
                setTimeout(() => browser.notifications.clear(id), 5000);
            });
        }

        function onError(error) {
            console.error(browser.i18n.getMessage("errorQueryURL",[url,queryUrl]));
            return false;
        }

        var querying = browser.tabs.query({url: queryUrl});
        querying.then(logTabs, onError);
    });
});
