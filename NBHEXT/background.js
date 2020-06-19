/* Created in autumn 2015
   by
   Roman Rubanenko    (@Rubanenko at codeforces.com),
   Maxim Molchanov    (@MaximM at codeforces.com),
   Aleksey Kholovchuk (@meh at codeforces.com)

   This extension comes with absolutely NO WARRANTY,
   use it on your own risk.

   No rights reserved.
*/

var ratings = [];
var loaded = false;

function loadUserData()
{
    $.getJSON("http://codeforces.com/api/user.ratedList?activeOnly=false",
        function(data)
        {
            for (var i = 0; i < data.result.length; ++i)
                ratings[data.result[i].handle] = data.result[i].rating;
            loaded = true;
        }
    );
}

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    var result = [];
    if (!loaded)
    {
        sendResponse(result);
        return;
    }
    for (var i = 0; i < request.handles.length; ++i)
        result.push(request.handles[i] in ratings ? ratings[request.handles[i]] : 0);
    sendResponse(result);
});

loadUserData();
setInterval(loadUserData, 12 * 60 * 60 * 1000);  // reload every 12 hours.
