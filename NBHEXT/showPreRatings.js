var partyNum = 0;
var ratings = [];
var places = [];
var deltas = [];
var numbers = [];

function modifyPartyHtml(index, elem)
{
    var delta = 0;
    if (partyNum > 0)
    {
        var handle = $(elem).find("td:eq(1)").find("a").first().html();
        if (handle in numbers && numbers[handle] in deltas)
            delta = Math.round(deltas[numbers[handle]]);
    }
    var text;
    if (partyNum == 0)
    {
        text = "<th class='top right' style='width: 4em;'><span title='Rating change''>&Delta;</span></th>";
    }
    else
    {
        var darkClass = "";
        if (partyNum % 2 == 1)
            darkClass = "dark ";
        if (delta > 0)
            text = "<td class='" + darkClass + "'><span style='color:green;font-weight:bold;'>+" + delta + "</span></td>";
        else
            text = "<td class='" + darkClass + "right'><span style='color:gray;font-weight:bold;'>" + (delta > 0 ? "-" : "") + delta + "</span></td>";        
    }
    ++partyNum;
    $(elem).append(text);
}

function showPreRatings()
{
    var contestId = document.location.href.replace(/\D+/ig, ',').substr(1).split(',')[0];
    $.getJSON("http://codeforces.com/api/contest.standings?contestId=" + contestId,
        function(data)
        {
            var handles = [];
            for (var i = 0; i < data.result.rows.length; ++i)
            {
                places[i] = data.result.rows[i].rank;
                numbers[data.result.rows[i].party.members[0].handle] = i;
                handles.push(data.result.rows[i].party.members[0].handle);
            }
            chrome.extension.sendRequest({"handles" : handles}, function(storedRatings) {
                if (storedRatings.length == handles.length)
                {
                    for (var i = 0; i < storedRatings.length; ++i)
                        ratings[i] = storedRatings[i];
                    deltas = CalculateRatingChanges(ratings, places, []);
                }
                $(".standings").find("tr").first().find("th").last().removeClass("right");
                $(".standings").find("tr").find("td").removeClass("right");
                $(".standings").find("tr").each(modifyPartyHtml);
                $(".standings").find("tr").last().find("td").last().html("<td class='smaller bottom dark right'> </td>");
            });
        }
    );
}

showPreRatings();