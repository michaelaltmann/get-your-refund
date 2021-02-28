// ==UserScript==
// @name         Flag client list on GetYourRefund
// @updateURL    https://raw.githubusercontent.com/michaelaltmann/get-your-refund/gh-pages/hub-greeter-clients.user.js
// @namespace    http://getyourrefund.org/
// @version      0.10
// @description  Flag clients not of interest to English-only greeters
// @match        https://*.getyourrefund.org/en/hub
// @match        https://*.getyourrefund.org/en/hub/clients
// @match        https://*.getyourrefund.org/en/hub/clients?*
// @grant        none
// ==/UserScript==
javascript: (function () {
    var st = document.createElement('style');
    st.innerHTML = `
    .gyr-client-ignore {
        color: #52a0bf !important;
    }
    `
    document.getElementsByTagName('head')[0].appendChild(st);
    function markClientsToIgnore() {
        var orgsToSkip = [
            /* org */ 'United Way of King County',
            'United Way King County Site',
            /* org */ 'SimplifyCT',
            'Darien Library', 'Fairfield Library', 'Greenwich', 'New Canaan Library',
            'Norwalk Library', 'Norwalk Senior Center', 'South Norwalk Library', 'Stamford',
            'Virtual VITA, Inc. Site', 'Westport Senior Center', 'Westport Town Hall',
            /* org */ 'Connecticut Association for Human Services',
            'Alliance for Community Empowerment', 'Beacon Falls and Stamford Ferguson Library',
            'Bethlehem Public Library (AdHoc Site, Silas)', 'Boys & Girls Club @ Yerwood Center',
            'Bridgeport Hospital and the Yale New Haven Hospital (Staff Only)', 'Brookside Estates',
            'Burroughs Community Center', 'Career Resources', 'Children\'s Community School',
            'Columbus Family Academy', 'Community Action Agency of New Haven',
            'Community Action Agency of Western Connecticut', 'Danbury VITA', 'Duggan School',
            'Elm City Communities-Quinnipiac Terrace (closed to the public)', 'Evergreen AAA VITA',
            'Family and Children\'s Agency', 'Gateway Community College', 'Hamden High School',
            'Havenly Treats', 'Hispanic Coalition of Greater Waterbury', 'Housatonic Community College',
            'Medical Financial Partnership New Haven Primary Care Consortium', 'M.L. Keefe Community Center',
            'Mount Aery Baptist Church', 'Naugatuck Valley Community College',
            'New Haven Free Public Library - Main Library', 'New Haven Opportunity Center',
            'New Haven Public Library ---Wilson Branch', 'New Opportunities, Waterbury',
            'Norwalk Community College', 'Post University', 'Silas Bronson Public Library',
            'Southbury Senior Center - ADHOC Waterbury Youth Services', 'Southern Connecticut State Univ',
            'St. Marks Episcopal - Mystic', 'Thames Valley Council', 'Thomaston Public Library',
            'Town of Stratford South End Community Center', 'Triangle Community Center',
            'United Way of Middlesex', 'United Way of Northwest Connecticut - Torrington',
            'University of Bridgeport', 'Waterbury Youth Services', 'Woodbridge Senior Center',
            /* org */ 'Northland Free Tax Assistance',
            'Northland Free Tax Assistance - Site',
            /* org */ 'United Way of Lancaster County (PA)',
            'UWL - Brightside', 'UWL - CASA', 'UWL - Ephrata', 'UWL - Etown College',
            'UWL - Etown CPOW', 'UWL - Factory', 'UWL - GYR virtual site', 'UWL - Hempfield',
            'UWL - VITA Central',
            /* org */ 'United Way of the Capital Region',
            'Alex\'s Volunteers',
            'Amador Tuolumne Community Action Agency (ATCAA)', 'Brent\'s Volunteers',
            'Bryan\'s Volunteers', 'Building Skills Partnership (BSP)',
            'California State University Sacramento (CSUS)', 'Folsom Cordova Community Partnership (FCCP)',
            'Grant Union High School', 'Katherine\'s Volunteers',
            'Northern Santa Barbara County United Way (NSBCUW)',
            'Placer County Health and Human Services (Placer)', 'Sierra College',
            'University of California Davis Students in VITA (UC Davis)',
            'Yolo County Children\'s Alliance (YCCA)',
            /* org */ 'United Way of Greater Cincinnati Free Tax Prep Coalition',
            'Avondale Library', 'Community Action Agency', 'Harrison Library', 'United Way of Greater Cincinnati',
            'United Way Roving Site',
            /* org */ 'United Way of Kenosha County',
            'United Way of Kenosha County Site'
        ].map((s) => s.toLowerCase())
        var formTableDataRows = document.querySelectorAll("table.client-table > tbody > tr")
        formTableDataRows.forEach((row, index) => {
            var tds = row.querySelectorAll("td");
            var clientId = tds[1].innerText;
            var org = tds[2].innerText;
            var language = tds[3].innerText;
            var returnListTd = tds[tds.length - 1];
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
