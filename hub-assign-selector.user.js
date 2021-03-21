// ==UserScript==
// @name         Better Assign on the Hub
// @namespace    http://getyourrefund.org/
// @version      0.3
// @description  Easy to assign self on the Hub.
// @match        https://*.getyourrefund.org/*/hub/clients*
// @match        https://*.getyourrefund.org/*/hub
// @match        https://*.getyourrefund.org/*/hub?*
// @grant        none
// ==/UserScript==

var currentUser = $('strong.user__name').text()

$('div.tax-return-list__assignee').each(function (_, assignDiv) {
    var currentlyAssigned = $(assignDiv).find('a').text().trim() != "Assign";
    if (currentlyAssigned) {
        var assignedTo = $(assignDiv).find('a').text().trim();
        if (assignedTo === currentUser) {
            var unassignButton = $("<a>").css('display', 'block').text('Unassign').addClass('button button--small');
            unassignButton.click(function () {
                $(this).siblings('a')[0].click();
                setTimeout(function () {
                    var select = $(assignDiv).find('select');
                    select.val(select.find('option:eq(0)').val());
                    $(assignDiv).find('button[type="submit"]')[0].click();
                }, 200);
            });
            $(assignDiv).append(unassignButton);
            return
        }
    } else {
        var newButton = $("<a>").css('display', 'block').text('Assign to Me').addClass('button button--small')
        newButton.click(function () {
            $(this).siblings('a')[0].click();
            setTimeout(function () {
                var select = $(assignDiv).find('select');
                select.val(select.find(`option:contains("${currentUser}")`).val());
                $(assignDiv).find('button[type="submit"]')[0].click();
            }, 200);
        });
        $(assignDiv).append(newButton);
    }
})


