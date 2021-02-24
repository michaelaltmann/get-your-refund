# Image Gallery Bookmarklet

<style>
a.button-link {
  background-color: darkgray;
  color: white;
  padding: 14px 25px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
}

</style>

To show images of documents uploaded to the hub, drag the gray button below into your bookmarks bar. When on the Documents page, then click that bookmark to render the images. You need to repeat this on every page.

<a class='button-link'  href="javascript: (function() {
    var js = document.createElement('script');
    js.setAttribute('src', 'https://michaelaltmann.github.io/get-your-refund/hub-client-images.js');
    document.body.appendChild(js);
})();">Images Gallery on GYR Hub</a>

<img src="gyr-hub-client-images-bookmarklet.gif"/>

(Above GIF by Diana Laster)

For reference, this bookmarklet contains the code:

```
javascript: (function() {
    var js = document.createElement('script');
    js.setAttribute('src', 'https://michaelaltmann.github.io/get-your-refund/hub-client-images.js');
    document.body.appendChild(js);
})();
```

[See the code behind it on Github](https://github.com/michaelaltmann/get-your-refund).

# Image Edit Preview Bookmarklet

This bookmarklet modified the document edit page to add an image preview.

Drag the gray button below to your bookmarks bar. Then when you are on the
Document Edit screen, clck the bookmark provide a preview of the image.

<a class='button-link' href="javascript: (function() {
      var js = document.createElement('script');
      js.setAttribute('src', 'https://michaelaltmann.github.io/get-your-refund/hub-doc-edit.user.js');
      document.body.appendChild(js);
  })();">Image Preview on Edit</a>

You can also set up TamperMonkey to run this whenever you visit the document edit page.
Install TamperMonkey in your browser and then visit
https://raw.githubusercontent.com/michaelaltmann/get-your-refund/gh-pages/hub-doc-edit.user.js

# Client Flagger Bookmarklet

This bookmarklet flags in blue, those clients that most greeters will want to avoid because they fall into one of the following categories

- Spanish speaking
- Dropoff VITA (the inbox icon)
- Associated with a partner org that is handling their own greeting.

Drag the gray button below to your bookmarks bar. Then when you are on the
list of clients, clck the bookmarks to flag those clients in blue.

<a class='button-link' href="javascript: (function() {
      var js = document.createElement('script');
      js.setAttribute('src', 'https://michaelaltmann.github.io/get-your-refund/hub-greeter-clients.user.js');
      document.body.appendChild(js);
  })();">Flag Clients on GYR Hub</a>

You can also set up TamperMonkey to run this whenever you visit the client page.
Install TamperMonkey in your browser and then visit
https://raw.githubusercontent.com/michaelaltmann/get-your-refund/gh-pages/hub-greeter-clients.user.js

# Spanish Client Bookmarklet

This bookmarklet shows only those clients that list Spanish as their language of choice.
It also hides clients that are

- dropoff VITA or
- associated with a partner org that is handling their own greeting.

Drag the gray button below to your bookmarks bar. Then when you are on the
list of clients, clck the bookmarks to flag those clients in blue.

<a class='button-link' href="javascript: (function() {
      var js = document.createElement('script');
      js.setAttribute('src', 'https://michaelaltmann.github.io/get-your-refund/hub-spanish-clients.user.js');
      document.body.appendChild(js);
  })();">Spanish Clients on GYR Hub</a>

You can also set up TamperMonkey to run this whenever you visit the client page.
Install TamperMonkey in your browser and then visit
https://raw.githubusercontent.com/michaelaltmann/get-your-refund/gh-pages/hub-spanish-clients.user.js

---

## Testing locally

If you make modifications to the javascript code and want to test them locally,
start an http server in this directory that will server up the javascript file
with the right content-type. For example, with python run

```
python3 -m http.server 9000
```

Once you have a local server running, create a bookmarklet whose content is

```
javascript: (function() {
    var js = document.createElement('script');
    js.setAttribute('src', 'http://localhost:9000/hub-client-images.js');
    document.body.appendChild(js);
})();
```
