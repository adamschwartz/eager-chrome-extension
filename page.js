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

  var findz = function(arr, query) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].id === query.id) {
        return arr[i];
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

  var initMenu = function() {
    var menuEl = document.createElement('eager-chrome-extension-menu');
    menuEl.setAttribute('loading', true);
    menuEl.innerHTML = '<eager-chrome-extension-menu-loading><eager-chrome-extension-menu-loading-dot></eager-chrome-extension-menu-loading-dot><eager-chrome-extension-menu-loading-dot></eager-chrome-extension-menu-loading-dot><eager-chrome-extension-menu-loading-dot></eager-chrome-extension-menu-loading-dot><eager-chrome-extension-menu-loading-dot></eager-chrome-extension-menu-loading-dot></<eager-chrome-extension-menu-loading>'

    getJSON('https://api.eager.io/apps', function(apps){
      menuEl.setAttribute('loading', false);
      menuEl.innerHTML = '';

      var installsEl = document.createElement('eager-chrome-extension-menu-installs');
      menuEl.appendChild(installsEl);

      for (var installId in site.installs) {
        var installEl = document.createElement('eager-chrome-extension-menu-install');
        console.log(site.installs[installId].appId);
        var app = findz(apps, { id: site.installs[installId].appId });
        console.log('app', app);
        if (app) {
          installsEl.appendChild(installEl);
          installEl.innerHTML = '<a href="https://eager.io/install/' + installId + '/edit">' + app.title + '</a>';
        }
      }
    });

    var style = document.createElement('style');
    style.innerHTML = (
      'eager-chrome-extension-menu { z-index: 999999999999999999999; position: fixed; display: block; top: 20px; right: 20px; background: white; border: 1px solid rgba(0, 0, 0, .2); }' +
      'eager-chrome-extension-menu-install { display: block }' +
      'eager-chrome-extension-menu-install:not(:last-child) { border-bottom: 1px solid #eee }' +
      'eager-chrome-extension-menu-install > a { display: block; background: white; text-decoration: none; transition: none; outline: none; box-shadow: none; border: 0; color: #333; padding: 2px 7px 0px; font-size: 14px }' +
      'eager-chrome-extension-menu-install > a:hover { background: #e90f92; box-shadow: 0 0 0 1px #e90f92; color: #fff; -webkit-font-smoothing: antialiased }' +

      'eager-chrome-extension-menu[loading="true"] { height: 40px; width: 120px; padding-left: 28px }' +
      'eager-chrome-extension-menu eager-chrome-extension-menu-loading { font-size: 12px }' +

      // Loading dots
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
        'margin: 0 0.25em;' +
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
        document.addEventListener('keydown', function(e){
          if (e.metaKey && e.shiftKey && e.keyCode === 69) {
            initMenu();
          }
        });
      }
    }
  }

  detectEager();
})();
