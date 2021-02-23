// ==UserScript==
// @name         Flag client list on GetYourRefund
// @updateURL    https://raw.githubusercontent.com/michaelaltmann/get-your-refund/gh-pages/hub-doc-edit.user.js
// @namespace    http://getyourrefund.org/
// @version      0.1
// @description  Adds an image preview to the edit document page. Does not work for PDFs
// @match        https://*.getyourrefund.org/en/hub/clients/*/documents/*/edit
// @grant        none
// ==/UserScript==
javascript: (function () {
    var st = document.createElement('style');
    st.innerHTML = `
    .gyr-preview {
        width: 30%;
        margin-left:20px;
        display: inline-block
    }
    `
    document.getElementsByTagName('head')[0].appendChild(st);
    function addPreview() {

        var slabs = document.querySelectorAll("section.slab")
        slabs.forEach((slab, index) => {
            var grid = slab.querySelector("div.grid")
            if (grid) grid.style.display = 'inline-block';
            var preview = document.createElement('img')
            preview.className = 'gyr-preview'
            var url = window.location.href.replace("/edit", "")
            preview.src = url
            slab.appendChild(preview)
        })
    }
    addPreview();

}())
