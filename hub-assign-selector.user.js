// ==UserScript==
// @name         Better Assign on the Hub
// @namespace    http://getyourrefund.org/
// @version      0.1
// @description  Easy to assign self on the Hub.
// @match        https://*.getyourrefund.org/en/hub/clients*
// @grant        none
// ==/UserScript==

var currentUser = $('strong.user__name').text()

// $('div.tax-return-list__assignment').each(function(_,assignDiv) {
//     var newButton = $('<a>').text('Assign to Me').addClass('button button--small')
//     $(assignDiv).append(newButton)
// })

$(document).on('mousedown', 'select[name="assigned_user_id"]', function(){
    $(this).find(`option:contains("${currentUser}")`).insertBefore($(this).find('option:eq(1)'))
});
