// this does the init work, as chrome doesn't allow much inline javascript in an extension UI
function isNormalChromeEnvironment() {
  return chrome && chrome.tabs && chrome.storage;
};

//loader.clearChecklistDiv();
const checklistElem = document.getElementById('checklist');

function saveChecklist(event) {
  const json = loader.renderJsonFromHtml(checklistElem);

  // when impleminting purging, check that element is not in list
  // before setting
  chrome.tabs.query({active: true, currentWindow: true},
    tabArray => {
      const tabUrl = tabArray[0].url;

      storage.saveJsonInKey(json, tabUrl);
      chrome.storage.local.het(storageObject);
    }
  );
}

// make sure environment is there (which it's not under test)
if (isNormalChromeEnvironment()) {
  chrome.tabs.query({active: true, currentWindow: true},
    tabArray => {
      const tabUrl = tabArray[0].url;
      storage.loadChecklistForURL(tabUrl, data => loader.loadChecklistFromJSON(data, checklistElem));
    });
}
