var ratings = [];
var loaded = false;

$.getJSON("http://codeforces.com/api/user.ratedList?activeOnly=false",
    function(data)
    {
        for (var i = 0; i < data.result.length; ++i)
            ratings[data.result[i].handle] = data.result[i].rating;
        loaded = true;
    }
);

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    var result = [];
    if (!loaded)
    {
        sendResponse(result);
        return;
    }
    for (var i = 0; i < request.handles.length; ++i)
        result.push(ratings[request.handles[i]]);
    sendResponse(result);
});
