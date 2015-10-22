CODEFORCES_URL_REGEX = /http:\/\/codeforces\.com\/contest\/[0-9]*\/standings/i;

chrome.tabs.onUpdated.addListener(
    function callback(tabId, changeInfo, tab) {
	if(changeInfo.status === "complete") {
	    chrome.tabs.query({currentWindow: true, active: true}, function(activeTabs) {
		for(var i = 0; i < activeTabs.length; ++i) {
		    var currentTab = activeTabs[i];
		    if(currentTab.url.match(CODEFORCES_URL_REGEX)) {

			// code goes here

		    }
		}
	    });
	}
    }
);
