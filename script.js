(function(){
  var re = /https?:\/\/fast\.eager\.io\/([a-zA-Z0-9\-_]{10,12})\.js/;

  var head = document.getElementsByTagName('head')[0];
  if (!head) {
    return;
  }

  var scripts = head.getElementsByTagName('script');

  var siteId;
  for (var i in scripts) {
    if (scripts[i].src && scripts[i].src.match) {
      var match = scripts[i].src.match(re);

      if (match && match.length === 2) {
        siteId = match[1];
      }
    }
  }

  if (siteId) {
    chrome.runtime.sendMessage({
      msg: 'setSiteId',
      siteId: siteId
    });
  }

  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = chrome.extension.getURL('page.js');

  var meta = document.createElement('meta');
  meta.id = 'eager-chrome-extension-site-meta';
  head.appendChild(meta);
  head.appendChild(script);

  meta.addEventListener('ready', function () {
    var site = JSON.parse(meta.content);

    if (site.id && Object.keys(site.installs).length > 0) {
      chrome.extension.sendMessage({
        msg: 'setSite',
        site: site
      });
    }
  });
})();
