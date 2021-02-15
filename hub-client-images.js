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

  // Add new column header for image previews if one doesn't already exist
  var preExistingPreviewHeader = document.getElementsByClassName('image_preview');
  if (preExistingPreviewHeader.length === 0) {
    var formTableHeaderRows = document.querySelectorAll("table > thead > tr");
    var additionalColumn = document.createElement('th');
    additionalColumn.innerText = "Image Preview";
    additionalColumn.className = "image_preview";
    formTableHeaderRows[0].appendChild(additionalColumn);
  } else {
    if (preExistingPreviewHeader[0].style.display !== "none") {
      preExistingPreviewHeader[0].style.display = "none";
    } else {
      preExistingPreviewHeader[0].style.display = "block";
    }
  }

  // loop through table rows to create image previews (currently only available)
  // for jpg and png
  var formTableDataRows = document.querySelectorAll("table > tbody > tr")
  formTableDataRows.forEach((row, index) => {
    // create unique ID per preview row -- preview_td_<row index>
    var previewTdId = `preview_td_${index}`
    // check if previewTd already exists
    var preExistingPreviewTd = document.getElementById(previewTdId);
    if (!preExistingPreviewTd) {
      // the 2nd column of the data files table is the file links
      // grab the href file urls
      var imageLinkTd = row.getElementsByTagName('td')[1];
      var imageLinkTdATag = imageLinkTd.getElementsByTagName('a')[0];
      var imageLinkHref = imageLinkTdATag.href;
      // create an additional column per row to hold the preview images
      var previewTd = document.createElement('td');
      // set column ID to prevew_td_<row index>
      previewTd.id = previewTdId;
      previewTd.style.width = "30%";
      row.appendChild(previewTd);
  
      // create separate image tag to hold the previewable images
      // TODO: figure out how to work with PDF files -- pdf files are the majority
      var imageTag = document.createElement("img");
      imageTag.style.width = "100%";
      imageTag.src = imageLinkHref;
      previewTd.appendChild(imageTag);
      imageTag.onerror = function() {
        previewTd.parentNode.removeChild(previewTd)
      }
    } else {
      if (preExistingPreviewTd.style.display !== "none") {
        preExistingPreviewTd.style.display = "none";
      } else {
        preExistingPreviewTd.style.display = null;
      }
    }
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
          visible.onerror=function(msg, url, lineNo, columnNo, error){
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
