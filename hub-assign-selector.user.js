// ==UserScript==
// @name         Better Assign on the Hub
// @namespace    http://getyourrefund.org/
// @version      0.1
// @description  Easy to assign self on the Hub.
// @match        https://*.getyourrefund.org/en/hub/clients*
// @grant        none
// ==/UserScript==

var currentUser = $('strong.user__name').text()

$('span.tax-return-list__assignee').each(function(_,assignDiv) {
    var currentlyAssigned = $(assignDiv).find('a').text().trim() != "Assign";
    if (currentlyAssigned) {
        var assignedTo = $(assignDiv).find('a').text().trim();
        if (assignedTo === currentUser) {
            var unassignButton = $('<a>').text('Unassign').addClass('button button--small');
            unassignButton.click(function() {
                $(this).siblings('a').trigger("click")
                setTimeout(function() {
                    var select = $(assignDiv).find('select');
                    select.val(select.find('option:eq(0)').val());
                    $(assignDiv).find('form').submit();
                }, 200);
            });
            $(assignDiv).append(unassignButton);
            return
        }
    }

    var newButton = $('<a>').text('Assign to Me').addClass('button button--small')
    newButton.click(function() {
        $(this).siblings('a').trigger("click")
        setTimeout(function() {
            var select = $(assignDiv).find('select');
            select.val(select.find(`option:contains("${currentUser}")`).val());
            $(assignDiv).find('form').submit();
        }, 200);
    });
    $(assignDiv).append(newButton);
})

$(document).on('mousedown', 'select[name="assigned_user_id"]', function(){
    $(this).find(`option:contains("${currentUser}")`).insertBefore($(this).find('option:eq(1)'))
});
