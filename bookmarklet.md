# GetYourRefund Bookmarklet

To show images of documents uploaded to the hub, drag the link below into your bookmarks bar. When on the Documents page, then click that bookmark to render the images. You need to repeat this on every page.

<a href="javascript: (function() {
    var js = document.createElement('script');
    js.setAttribute('src', 'https://michaelaltmann.github.io/get-your-refund/hub-client-images.js');
    document.body.appendChild(js);
})();">Show Images on GYR Hub</a>

For reference, this bookmarklet contains the code:

```
javascript: (function() {
    var js = document.createElement('script');
    js.setAttribute('src', 'https://michaelaltmann.github.io/get-your-refund/hub-client-images.js');
    document.body.appendChild(js);
})();
```
and the [linked code is available on Github](https://michaelaltmann.github.io/get-your-refund/hub-client-images.js).
