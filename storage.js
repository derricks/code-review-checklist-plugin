/** Class to manage storage information
 *
 */

 // data structure
 // index -> metadata
 //    checklists = array of checklist states
 // checklist url
 //    current checklist state
 // ...
const storage = {

  EMPTY_CHECKLISTS: {checklists:[]},

  /** Load the data for the given URL using the following sequence.
   *
   *    1. Check to see if the given URL is already in the keys.
   *    2. If yes, load that.
   *    3. If no, copy master_template.json, create an entry, and pass that the client
   *
   * @param {String} url URL to load
   * @param {Function} checklistCallback callback function that takes the loaded json
   */
   loadChecklistForURL: function(url, checklistCallback) {

     chrome.storage.local.get(url, checklistData => {
       if (checklistData && checklistData[url] && checklistData[url].checklist) {
         checklistCallback(checklistData[url]);
       } else {
         fetch(chrome.extension.getURL('master_template.json')).then(
            response => response.json().then(json => checklistCallback(json)));
       }
     })
   },

   /** Saves the specified json into the specified key.
    *
    * @param {Object} json data to save
    * @param {String} storageKey the key in which to save the json
    */
    saveJsonInKey: function(json, storageKey) {
      const storageObject = {};
      storageObject[storageKey] = json;
      chrome.storage.local.set( storageObject);
    }
}
