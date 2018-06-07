// this does the init work, as chrome doesn't allow much inline javascript in an extension UI
function isNormalChromeEnvironment() {
  return chrome && chrome.tabs && chrome.storage;
};

//loader.clearChecklistDiv();
const checklistElem = document.getElementById('checklist');
var timer = null;

// callback to ensure that checklist notes are saved when there's a sufficient pause
// taken from here: https://stackoverflow.com/questions/1620602/how-to-trigger-an-onkeyup-event-thats-delayed-until-a-user-pauses-their-typing
function saveOnTextAreaPause() {
  console.log("kepress");
  if (timer) {
    window.clearTimeout(timer);
  }
  timer = window.setTimeout( _unused => {
    timer = null;
    saveChecklist();
  }, 750);
}

function toggleSubheading(event) {
  const checklistDiv = event.target.nextElementSibling;
  const elementDisplay = window.getComputedStyle(checklistDiv, null)['display'];
  checklistDiv.style.display = elementDisplay == 'block' ? 'none': 'block';
}

function getNotesElem() {
  return document.getElementById('notes');
}

function saveChecklist(_event) {
  const json = loader.renderJsonFromHtml(checklistElem);
  
  // capture notes for the checklist
  json['notes'] = getNotesElem().value;

  // when impleminting purging, check that element is not in list
  // before setting
  chrome.tabs.query({active: true, currentWindow: true},
    tabArray => {
      const tabUrl = tabArray[0].url;
      storage.saveChecklist(json, tabUrl);
    }
  );
}

// make sure environment is there (which it's not under test)
if (isNormalChromeEnvironment()) {
  chrome.tabs.query({active: true, currentWindow: true},
    tabArray => {
      const tabUrl = tabArray[0].url;
      storage.loadChecklistForURL(tabUrl, data => {
        getNotesElem().onkeypress = saveOnTextAreaPause;
        getNotesElem().value = data['notes'] ? data['notes'] : '';
        loader.loadChecklistFromJSON(data, checklistElem);
      });
    });
}
