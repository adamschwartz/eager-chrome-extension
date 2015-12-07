(function(){
  var site = {};

  var find = function(arr, query) {
    var i, k, len, obj, v;
    if (arr == null) {
      arr = [];
    }
    for (i = 0, len = arr.length; i < len; i++) {
      obj = arr[i];
      for (k in query) {
        v = query[k];
        if (obj[k] === v) {
          return obj;
        }
      }
    }
    return null;
  };

  var getJSON = function(url, cb) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);

    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        var data = JSON.parse(request.responseText);
        cb(data);
      } else {
        console.log('Eager Chrome Extension: There was a server error.');
      }
    };

    request.onerror = function() {
      console.log('Eager Chrome Extension: There was a connection error of some sort.');
    };

    request.send();
  };

  var menuEl = document.createElement('eager-chrome-extension-menu');
  var toggleMenu = function() {
    if (menuEl.parentNode) {
      if (menuEl.getAttribute('closed') === 'true') {
        menuEl.setAttribute('closed', 'false');
      } else {
        menuEl.setAttribute('closed', 'true');
      }
      return;
    }

    menuEl.setAttribute('loading', true);
    menuEl.innerHTML = '<eager-chrome-extension-menu-loading><eager-chrome-extension-menu-loading-dot></eager-chrome-extension-menu-loading-dot><eager-chrome-extension-menu-loading-dot></eager-chrome-extension-menu-loading-dot><eager-chrome-extension-menu-loading-dot></eager-chrome-extension-menu-loading-dot><eager-chrome-extension-menu-loading-dot></eager-chrome-extension-menu-loading-dot></eager-chrome-extension-menu-loading>'

    getJSON('https://api.eager.io/apps', function (apps) {
      menuEl.setAttribute('loading', false);
      menuEl.innerHTML = '';

      var installsEl = document.createElement('eager-chrome-extension-menu-installs');
      menuEl.appendChild(installsEl);

      for (var installId in site.installs) {
        var installEl = document.createElement('eager-chrome-extension-menu-install');
        var app = find(apps, { id: site.installs[installId].appId });
        if (app) {
          installsEl.appendChild(installEl);
          installEl.innerHTML = '<a target="_blank" href="https://eager.io/install/' + installId + '/edit">' + app.title + '</a>';
        }
      }
    });

    var style = document.createElement('style');
    style.innerHTML = (
      'eager-chrome-extension-menu {' +
        'z-index: 999999999999999999999;' +
        'position: fixed;' +
        'display: block;' +
        'top: 0;' +
        'right: 0;' +
        'background: #f3f3f3;' +
        'box-shadow: 0 0 0 1px rgba(0, 0, 0, .2);' +
        'border-bottom-left-radius: 5px;' +
      '}' +

      'eager-chrome-extension-menu[closed="true"] {' +
        'display: none !important;' +
      '}' +

      'eager-chrome-extension-menu, eager-chrome-extension-menu * {' +
        'box-sizing: border-box;' +
        'font-family: sans-serif;' +
        'font-size: 14px;' +
        'line-height: normal;' +
      '}' +

      'eager-chrome-extension-menu-install {' +
        'display: block;' +
      '}' +

      'eager-chrome-extension-menu-install > a {' +
        'display: block;' +
        'text-decoration: none;' +
        'transition: none;' +
        'outline: none;' +
        'box-shadow: none;' +
        'border: 0;' +
        'color: #333;' +
        'padding: 4px 14px 4px 11px;' +
      '}' +

      'eager-chrome-extension-menu-install:last-child > a {' +
        'border-bottom-left-radius: 5px;' +
        'padding-bottom: 6px;' +
      '}' +

      'eager-chrome-extension-menu-install > a:hover {' +
        'background: #e90f92 !important;' +
        'color: #fff !important;' +
        '-webkit-font-smoothing: antialiased;' +
      '}' +

      'eager-chrome-extension-menu[loading="true"] {' +
        'height: 41px;' +
        'width: 140px;' +
        'padding: 10px 0 0 40px;' +
        'box-sizing: border-box;' +
      '}' +

      'eager-chrome-extension-menu eager-chrome-extension-menu-loading, eager-chrome-extension-menu eager-chrome-extension-menu-loading-dot {' +
        'font-size: 12px !important;' +
      '}' +

      'eager-chrome-extension-menu-loading {' +
        'opacity: 0;' +
        'animation: eager-chrome-extension-loading-dots-fadein 0.5s linear forwards;' +
      '}' +

      'eager-chrome-extension-menu-loading eager-chrome-extension-menu-loading-dot {' +
        'width: 0.5em;' +
        'height: 0.5em;' +
        'display: inline-block;' +
        'vertical-align: middle;' +
        'background: #808080;' +
        'border-radius: 50%;' +
        'margin: 0 .25em;' +
        'animation: eager-chrome-extension-loading-dots-middle-dots 0.5s linear infinite;' +
      '}' +

      'eager-chrome-extension-menu-loading eager-chrome-extension-menu-loading-dot:first-child {' +
        'animation: eager-chrome-extension-loading-dots-first-dot 0.5s linear infinite;' +
        'opacity: 0;' +
        'transform: translate(-1em);' +
      '}' +

      'eager-chrome-extension-menu-loading eager-chrome-extension-menu-loading-dot:last-child {' +
        'animation: eager-chrome-extension-loading-dots-last-dot 0.5s linear infinite;' +
      '}' +

      '@-webkit-keyframes eager-chrome-extension-loading-dots-fadein {' +
        '100% {' +
          'opacity: 1;' +
        '}' +
      '}' +
      '@keyframes eager-chrome-extension-loading-dots-fadein {' +
        '100% {' +
          'opacity: 1;' +
        '}' +
      '}' +
      '@-webkit-keyframes eager-chrome-extension-loading-dots-first-dot {' +
        '100% {' +
          'transform: translate(1em);' +
          'opacity: 1;' +
        '}' +
      '}' +
      '@keyframes eager-chrome-extension-loading-dots-first-dot {' +
        '100% {' +
          'transform: translate(1em);' +
          'opacity: 1;' +
        '}' +
      '}' +
      '@-webkit-keyframes eager-chrome-extension-loading-dots-middle-dots {' +
        '100% {' +
          'transform: translate(1em);' +
        '}' +
      '}' +
      '@keyframes eager-chrome-extension-loading-dots-middle-dots {' +
        '100% {' +
          'transform: translate(1em);' +
        '}' +
      '}' +
      '@-webkit-keyframes eager-chrome-extension-loading-dots-last-dot {' +
        '100% {' +
          'transform: translate(2em);' +
          'opacity: 0;' +
        '}' +
      '}' +
      '@keyframes eager-chrome-extension-loading-dots-last-dot {' +
        '100% {' +
          'transform: translate(2em);' +
          'opacity: 0;' +
        '}' +
      '}'
    );

    document.body.appendChild(style);
    document.body.appendChild(menuEl);
  };

  var detectEager = function() {
    var Eager = window.Eager;
    if (Eager) {
      site.id = window.Eager.siteId;
      site.installs = window.Eager.installs;

      var jsonString = JSON.stringify(site);
      var meta = document.getElementById('eager-chrome-extension-site-meta');
      meta.content = jsonString;

      var done = document.createEvent('Event');
      done.initEvent('ready', true, true);
      meta.dispatchEvent(done);

      if (Object.keys(site.installs).length) {
        document.addEventListener('keydown', function (e) {
          if (e.metaKey && e.shiftKey && e.keyCode === 69) {
            toggleMenu();
          }
        });
      }
    }
  }

  detectEager();
})();
