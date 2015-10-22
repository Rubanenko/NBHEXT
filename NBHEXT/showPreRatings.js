var partyNum = 0;

function partyRatingHtml()
{
    var delta = 1;
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
    return text;
}

function showPreRatings()
{
    $(".standings").find("tr").first().find("th").last().removeClass("right");
    $(".standings").find("tr").find("td").removeClass("right");
    $(".standings").find("tr").append(partyRatingHtml);
    $(".standings").find("tr").last().find("td").last().html("<td class='smaller bottom dark right'> </td>");
}

showPreRatings();