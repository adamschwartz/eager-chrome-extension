var tabSites = {};

var updatePageAction = function (tabId) {
  var site = tabSites[tabId];

  if (site && site.id) {
    chrome.pageAction.show(tabId);
  } else {
    chrome.pageAction.hide(tabId);
  }
};

chrome.pageAction.onClicked.addListener(function (tab) {
  var site = tabSites[tab.id];

  if (site && site.id) {
    chrome.tabs.create({
      url: 'https://eager.io/site/' + site.id
    });
  }
});

chrome.tabs.onRemoved.addListener(function (tabId) {
  delete tabSites[tabId];
});

chrome.tabs.onSelectionChanged.addListener(function (tabId) {
  updatePageAction(tabId);
});

chrome.tabs.onUpdated.addListener(function (tabId) {
  updatePageAction(tabId);
});

chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
  updatePageAction(tabs[0].id);
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.msg === 'setSiteId' && request.siteId) {
    if (!tabSites[sender.tab.id] || !tabSites[sender.tab.id].id) {
      tabSites[sender.tab.id] = {
        id: request.siteId
      }
    }
    updatePageAction(sender.tab.id);
  }

  if (request.msg === 'setSite' && request.site) {
    if (!tabSites[sender.tab.id] || !tabSites[sender.tab.id].id || !tabSites[sender.tab.id].installs) {
      tabSites[sender.tab.id] = request.site;
    }
    updatePageAction(sender.tab.id);
  }
});
