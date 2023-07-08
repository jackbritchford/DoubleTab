let tabInfo = {};
let notificationSetting = 'all'; // 'all', 'samewindow', or 'off'

chrome.storage.sync.get(['notificationSetting'], function(result) {
  if (result.notificationSetting) {
    notificationSetting = result.notificationSetting;
  }
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete' && tab.url !== undefined) {
    const existingTabInfo = tabInfo[tab.url];
    if (existingTabInfo) {
      if (
        notificationSetting === 'all' || 
        (notificationSetting === 'samewindow' && existingTabInfo.windowId === tab.windowId)
      ) {
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'icon.png',
          title: 'Duplicate Tab Detected',
          message: 'You have already opened this link in another tab or window.',
        });
      }
    } else {
      tabInfo[tab.url] = {
        windowId: tab.windowId,
        tabId: tab.id,
      };
    }
  }
});

chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
  for (let url in tabInfo) {
    if (tabInfo[url].tabId === tabId) {
      delete tabInfo[url];
    }
  }
});

chrome.storage.onChanged.addListener(function(changes, namespace) {
  for (let key in changes) {
    if (key === 'notificationSetting') {
      notificationSetting = changes[key].newValue;
    }
  }
});
