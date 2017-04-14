/** The class to contain all the checklist loader functionality. Invoked
 *  below
 */

 // TODOS:
 //   check object data in all places

const loader = {

  /** Loads the checklist for the URL.
   *  @param {String} the URL to load for
   *  @param {Element} the div that will contain the checklist items
   */
   loadChecklistForURL: function(url, checklistElem) {
     // determine if the URL is a key in the storage

     // determine if the URL is a prefix of a key in storage

     // configure a copy of the master template for this URL

     fetch(chrome.extension.getURL('master_template.json')).then( response =>
       response.json().then(
         json => loader.loadChecklistFromJSON(json, checklistElem)));
   },

   /** Populate the given checklist div from a JSON blob
    *  @param {Object} json structure to use when populating the data
    *  @param {Element}  div element to hold the checklist items
    */
    loadChecklistFromJSON: function(json, checklistElem) {
      if (json.checklist == undefined) {
        return;
      }

      json.checklist.forEach( item => checklistElem.append(loader.renderChecklistItem(item)));
    },

    /** For a given checklist item, generate the appropriate view in the Element.
     *  @param {Object} json representing the checklist item to render
     *  @return {Element} DOM element that can be appended
     */
     renderChecklistItem: function(checklistItem, containerElem) {
       // validate data
       if (checklistItem == undefined || checklistItem.name == undefined) {
         return document.createElement('div');
       }

       const itemElem = document.createElement('div');
       const tableElem = document.createElement('table');
       const tableRowElem = document.createElement('tr');

       const checkboxElem = loader.getTdWrappedElement(loader.createCheckboxForChecklistItem(checklistItem));
       const textElem = loader.getTdWrappedElement(loader.createTextForChecklistItem(checklistItem));

       tableRowElem.append(checkboxElem);
       tableRowElem.append(textElem);
       tableElem.append(tableRowElem);
       itemElem.append(tableElem);

       return itemElem;
     },

     /** Create the checkbox Element for the given checklistItem.
      *  @ param {Object} json representing the checklistItem
      *  @ return Element representing the checkbox
      */
      createCheckboxForChecklistItem: function(checklistItem) {
        const checkboxElem = document.createElement('input');
        checkboxElem.id = checklistItem.name;
        checkboxElem.setAttribute('type', 'checkbox');
        if (checklistItem.checked) {
          checkboxElem.setAttribute('checked', 'checked');
        }

        return checkboxElem;;
      },

      /** Create the text for the given checklist item.
       *  @param {Object} the json representing the checklist item
       *  @return {Element} a DOM element containing the text for the checklist item
       */
       createTextForChecklistItem: function(checklistItem) {
         const labelElem = document.createElement('label')
         labelElem.setAttribute('for', checklistItem.name);

         const textDivElem = document.createElement('div');
         const itemText = document.createTextNode(checklistItem.name);
         if (checklistItem.description != undefined) {
           textDivElem.setAttribute('title', checklistItem.description);
         }
         textDivElem.append(itemText);
         labelElem.append(textDivElem);
         return labelElem;
       },

       /** Wrap the given element in a td element.
        * @param {Element} the element to wrap in a td
        * @return {Element} a td element containing the passed element
        */
        getTdWrappedElement: function(elementToWrap) {
          td = document.createElement('td');
          td.append(elementToWrap);
          return td;
        }
}

//loader.clearChecklistDiv();
const checklistElem = document.getElementById('checklist');
loader.loadChecklistForURL('nourl', checklistElem); // todo: add URL
