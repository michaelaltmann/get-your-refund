// ==UserScript==
// @name         Show Image Gallery on GetYourRefund Hub
// @namespace    http://getyourrefund.org/
// @version      0.4
// @description  Show images on document pages.
// @match        https://*.getyourrefund.org/en/hub/clients/*/documents
// @grant        none
// ==/UserScript==
javascript: (function () {
  function createEditor(editUrl) {
    return () => {
      window.location.href = editUrl
    };
  }
  // Use the fact that transform are cumulative.  Prepend a rotation or flip
  function createRotater(img) {
    return () => {
      img.style.transform = 'rotate(90deg) ' + img.style.transform;
    };
  }
  // Use the fact that transform are cumulative.  Prepend a rotation or flip
  function createFlipper(img) {
    return () => {
      img.style.transform = 'scaleX(-1) ' + img.style.transform;
    };
  }

  var pdfjslib;
  function loadPdf(url, canvas) {
    console.log("Loading " + url);
    var loadingTask = pdfjsLib.getDocument(url);
    loadingTask.promise.then(
      function (pdf) {
        console.log("PDF loaded");
        // Fetch the first page
        var pageNumber = 1;
        pdf.getPage(pageNumber).then(function (page) {
          console.log("Page " + pageNumber + " loaded");

          var scale = 1.5;
          var viewport = page.getViewport({ scale: scale });

          // Prepare canvas using PDF page dimensions
          var context = canvas.getContext("2d");
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          // Render PDF page into canvas context
          var renderContext = {
            canvasContext: context,
            viewport: viewport
          };
          var renderTask = page.render(renderContext);
          renderTask.promise.then(function () {
            //                    alert("Page " + pageNumber + " rendered");
          });
        });
      },
      function (reason) {
        // PDF loading error
        console.error("ERROR " + JSON.stringify(reason));
      }
    );
  }
  /*var link = document.createElement('link');
  link.setAttribute('rel', 'stylesheet');
  link.setAttribute('type', 'text/css');
  link.setAttribute('href', 'https://michaelaltmann.github.io/get-your-refund/hub-client-images.css');
  document.getElementsByTagName('head')[0].appendChild(link);
*/
  var st = document.createElement('style');
  st.innerHTML = `
  .gyr-card-container {
    width: 100%;
  }
  .gyr-card {
    border: 1px solid;
    border-color: darkgray;
    display: inline-block;
    position: relative;
    vertical-align: bottom;
    width: 30%;
    padding: 2px;
    margin: 2px;
}
.gyr-document-labels {
  display: inline-block
}
.gyr-document-type {
  font-weight: 700;
  display: block
}
.gyr-document-link {
  display: block
}
.gyr-tool {
  display: inline-block;
  float: right;
  height: 2em;
  margin: 1px;
}
.gyr-tool-container {
  height: 2.5em;
  width:100%;
  clear: both;
}

`
  document.getElementsByTagName('head')[0].appendChild(st);

  // Dynamically add PDF.js to the page
  // This should create a global var pdfjsLib
  var head = document.getElementsByTagName("head");
  var fileref = head[0].appendChild(document.createElement("script"));
  fileref.setAttribute("type", "text/javascript");
  fileref.src = "https://mozilla.github.io/pdf.js/build/pdf.js";
  fileref.onload = function () {
    // The workerSrc property shall be specified.
    pdfjsLib = window["pdfjs-dist/build/pdf"];
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      "https://mozilla.github.io/pdf.js/build/pdf.worker.js";
  };

  var existing_container = document.getElementById("linked_images");
  if (existing_container) {
    if (existing_container.style.display !== "none") {
      existing_container.style.display = "none";
    } else {
      existing_container.style.display = "block";
    }
  } else {
    var container = document.createElement("div");
    container.id = "linked_images";
    container.className = "gyr-card-container";
    // Loop through all the rows in the table of Hub documents
    var formTableDataRows = document.querySelectorAll("table.data-table > tbody > tr")
    formTableDataRows.forEach((row, index) => {
      var tds = row.querySelectorAll("td");
      // Assume 0th column has docType and 1st has link to file
      var docTypeTd = tds[0];
      var fileTd = tds[1];
      var docType = docTypeTd.innerText;
      var link = fileTd.querySelector("a");

      var link_txt = link.innerText;
      if (true // Don't try to filter based on URLs
        //    /\.pdf$/i.test(link_txt) ||
        //    /\.jpg$/i.test(link_txt) ||
        //    /\.jpeg$/i.test(link_txt)
      ) {
        var sub_container = document.createElement("div");
        sub_container.className = 'gyr-card';
        var tool_container = document.createElement("div");
        tool_container.className = 'gyr-tool-container';
        var visible = null;
        if (/\.pdf$/i.test(link_txt)) {
          visible = document.createElement("canvas");
          sub_container.appendChild(visible);
          setTimeout(() => loadPdf(href, visible), 1500);
        } else {
          visible = document.createElement("img");
          visible.style.width = "100%";
          visible.src = link.href;
          sub_container.appendChild(visible);
          visible.onerror = function () {
            sub_container.parentNode.removeChild(sub_container);
          };
        }

        visible.style.transform = "";

        var docTypeLabel = document.createElement("span");
        docTypeLabel.className = 'gyr-document-type'
        docTypeLabel.innerText = docType;

        var fileLink = document.createElement("a");
        fileLink.className = 'gyr-document-link'
        fileLink.innerHTML = link_txt;
        fileLink.href = link.href;
        fileLink.target = "_blank";
        fileLink.rel = "noppener noreferrer";

        var labels = document.createElement("span");
        labels.className = "gyr-document-labels";
        labels.appendChild(docTypeLabel)
        labels.appendChild(fileLink)
        tool_container.appendChild(labels);

        var editButton = document.createElement("button");
        editButton.className = 'gyr-tool';
        editButton.title = "Edit";
        editButton.innerHTML = "Edit";
        editButton.onclick = createEditor(link.href + "/edit");

        var rotateButton = document.createElement("button");
        rotateButton.className = 'gyr-tool';
        rotateButton.style.width = "2em";
        rotateButton.title = "Rotate";
        rotateButton.innerHTML = "&#8635;";
        rotateButton.onclick = createRotater(visible);

        var flipButton = document.createElement("button");
        flipButton.className = 'gyr-tool';
        flipButton.style.width = "2em";
        flipButton.title = "Flip";
        flipButton.innerHTML = "&#8646;";
        flipButton.onclick = createFlipper(visible);

        tool_container.appendChild(flipButton);
        tool_container.appendChild(rotateButton);
        tool_container.appendChild(editButton);

        container.appendChild(sub_container);
        sub_container.appendChild(tool_container);

      }
    })

    var insert_in = document.getElementsByClassName("client-navigation ")[0];
    insert_in.appendChild(container);
  }
})();
