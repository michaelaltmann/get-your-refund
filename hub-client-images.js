// ==UserScript==
// @name         Show Images on GetYourRefund
// @namespace    http://getyourrefund.org/
// @version      0.2
// @description  Show images on document pages.
// @match        https://*.getyourrefund.org/en/hub/clients/*/documents
// @grant        none
// ==/UserScript==
javascript: (function () {
  // Use the fact that transform are cumulative.  Prepend a rotation or flip
  function createRotater(img) {
    return () => {
      img.style.transform = 'rotate(90deg) ' +img.style.transform;
    };
  }
  function createFlipper(img) {
    return () => {
            img.style.transform = 'scaleX(-1) ' +img.style.transform;
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

  // Add new column for image previews 
  var formTableHeaderRows = document.querySelectorAll("table > thead > tr");
  var additionalColumn = document.createElement('th');
  additionalColumn.innerText = "Image Preview";
  additionalColumn.id = "image_preview";
  formTableHeaderRows[0].appendChild(additionalColumn);

  // loop through table to get insert previews
  var formTableDataRows = document.querySelectorAll("table > tbody > tr")
  formTableDataRows.forEach((row) => {
    var previewTd = document.createElement('td');
    previewTd.innerText = 'Hello Preview';
    row.appendChild(previewTd);
  });
  

  // Loop through all the links to Hub documents
  var existing_container = document.getElementById("linked_images");
  if (existing_container) {
    if (existing_container.style.display !== "none") {
      existing_container.style.display = "none";
    } else {
      existing_container.style.display = "block";
    }
  } else {
    var links = document.getElementsByTagName("a");
    var container = document.createElement("div");
    container.id = "linked_images";
    container.className = "link_to_mage";
    container.width = "500px";
    for (var link_i = 0; link_i < links.length; link_i++) {
      var link = links[link_i];
      var href = link.href;
      var link_txt = link.innerText;
      if (
        /\.pdf$/i.test(link_txt) ||
        /\.jpg$/i.test(link_txt) ||
        /\.jpeg$/i.test(link_txt)
      ) {
        var sub_container = document.createElement("div");
        sub_container.style.display = "inline-block";
        sub_container.style.position = "relative";
        sub_container.style.width = "30%";
        sub_container.style.padding = "3px";
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
          visible.onerror=function(){
            sub_container.parentNode.removeChild(sub_container);
          };
        }
        
        visible.style.transform = "rotate(0deg) scaleX(1) scaleY(1)";
        
        var label = document.createElement("a");
        label.style.display = "block";
        label.innerHTML = link_txt;
        label.href = link.href;
        sub_container.appendChild(label);

        var rotateButton = document.createElement("button");
        rotateButton.style.position = "absolute";
        rotateButton.style.bottom = "2.5em";
        rotateButton.style.right = "3em";
        rotateButton.style.height = "2em";
        rotateButton.style.height = "2em";
        rotateButton.innerHTML = "&#8635;";
        rotateButton.onclick = createRotater(visible);
        sub_container.appendChild(rotateButton);

        var flipButton = document.createElement("button");
        flipButton.style.position = "absolute";
        flipButton.style.bottom = "2.5em";
        flipButton.style.right = ".5em";
        flipButton.style.height = "2em";
        flipButton.style.width = "2em";
        flipButton.innerHTML = "F";
        flipButton.onclick = createFlipper(visible);
        sub_container.appendChild(flipButton);

        container.appendChild(sub_container);
      }
    }
    var insert_in = document.getElementsByClassName("client-navigation ")[0];
    insert_in.appendChild(container);
  }
})();
