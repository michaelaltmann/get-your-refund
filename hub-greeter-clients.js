// ==UserScript==
// @name         Filter Client list on GetYourRefund
// @namespace    http://getyourrefund.org/
// @version      0.2
// @description  Flag clients not of interest to English-only greeters
// @match        https://*.getyourrefund.org/en/hub/clients/
// @grant        none
// ==/UserScript==
javascript: (function () {
    var st = document.createElement('style');
    st.innerHTML = `
    .gyr-client-ignore {
        color: pink !important;
    }
    `
    document.getElementsByTagName('head')[0].appendChild(st);
    function markClientsToIgnore() {
        var orgsToSkip = ['Connecticut Association for Human Services',
            'United Way of the Capital Region',
            'United Way of Greater Cincinnati',
            'United Way of Lancaster County',
            'United Way of King County',
            'Virtual VITA Inc'].map((s) => s.toLowerCase())
        var formTableDataRows = document.querySelectorAll("table.client-table > tbody > tr")
        formTableDataRows.forEach((row, index) => {
            var tds = row.querySelectorAll("td");
            var clientId = tds[1].innerText;
            var org = tds[2].innerText;
            var language = tds[3].innerText;
            var returnListTd = tds[7];
            var isVirtual = returnListTd.querySelectorAll('span.icon-move_to_inbox').length > 0;
            // console.log(`${clientId} ${org} ${language} ${isVirtual}`)
            if (language.toLowerCase().trim() === 'spanish' || isVirtual || orgsToSkip.includes(org.toLowerCase())) {
                row.classList.add('gyr-client-ignore')
            }
        }
        )
    }
    markClientsToIgnore();

}())
