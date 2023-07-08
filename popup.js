document.addEventListener('DOMContentLoaded', function () {
    const notifySelect = document.getElementById('notify-select');

    chrome.storage.sync.get(['notificationSetting'], function (result) {
        if (result.notificationSetting) {
            notifySelect.value = result.notificationSetting;
        }
    });

    notifySelect.addEventListener('change', function () {
        chrome.storage.sync.set({ notificationSetting: notifySelect.value }, function () {
            console.log('Notification setting is ' + notifySelect.value);
        });
    });
});