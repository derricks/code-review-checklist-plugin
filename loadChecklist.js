/** The class to contain all the checklist loader functionality. Invoked
 *  below
 */

const loader = {

  /** Loads the checklist for the URL.
   *  @param {String} the URL to load for
   *  @param {Element} the div that will contain the checklist items
   */
   loadChecklistForURL: function(url, checklistElem) {

     // determine if the URL is a key in the storage

     // determine if the URL is a prefix of a key in storage

     // configure a copy of the master template for this URL
     console.log('loadChecklistForURL');
     fetch(chrome.extension.getURL('master_template.json')).then( response =>
       response.json().then(
         json => loader.loadChecklistFromJSON(json, checklistElem)));
   },

   /** Populate the given checklist div from a JSON blob
    *  @param {Object} json structure to use when populating the data
    *  @param {Element}  div element to hold the checklist items
    */
    loadChecklistFromJSON: function(json, checklistElem) {
      for (checklistItem in json.checklist) {
        console.log(json.checklist[checklistItem]);
      }
    }
}

console.log('plugin')

//loader.clearChecklistDiv();
loader.loadChecklistForURL() // todo: add URL
