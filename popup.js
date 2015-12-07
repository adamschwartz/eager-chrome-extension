chrome.tabs.getSelected(null, function(tab){
  chrome.extension.sendMessage({ msg: 'getSiteId', tab: tab.id }, function (siteId) {
    var result = document.getElementById('result');

    if (siteId) {
      var url = 'https://eager.io/site/' + siteId + '.js';
      result.innerHTML = '<a target="_blank" href="' + url + '">' + url + '</a>';
    }
  });
});


//chrome.pageaction.onclicked.addlistener
