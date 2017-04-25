/** The class to contain all the checklist loader functionality. Invoked
 *  below
 */

 // TODOS:
 //   check object data in all places

const loader = {

   /** Populate the given checklist div from a JSON blob
    *  @param {Object} json structure to use when populating the data
    *  @param {Element} checklistElem element to hold the checklist items
    */
    loadChecklistFromJSON: function(json, checklistElem) {
      if (!json.checklist) {
        return;
      }
      json.checklist.forEach( item => checklistElem.append(loader.renderChecklistItem(item)));
    },

    /** For a given checklist item, generate the appropriate view in the Element.
     *  @param {Object} checklistItem JSON representing the checklist item to render
     *  @return {Element} containerElem element that can be appended
     */
     renderChecklistItem: function(checklistItem) {
       // validate data
       if (checklistItem.subheading) {
         return loader.renderSubheadItem(checklistItem);
       }

       if (checklistItem == undefined || checklistItem.name == undefined) {
         return document.createElement('div');
       }

       const itemElem = document.createElement('div');
       itemElem.setAttribute('class', loader.constants.CHECKLIST_ITEM_CLASS);
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

     /** Render a div from a JSON block with a subheading
      *
      *  @param {Object} checklistItem the JSON holding the subheading and the checklist
      *  @return {Element} the element to append to the container
      */
      renderSubheadItem: function(checklistItem, containerElem) {
        if (!checklistItem.subheading) {
          return document.createElement('div');
        }

        const subheadDiv = document.createElement('div');
        const titleDiv = document.createElement('div');
        titleDiv.id = checklistItem.subheading;
        titleDiv.append(document.createTextNode(checklistItem.subheading));
        titleDiv.addEventListener('click', toggleSubheading);
        subheadDiv.append(titleDiv);

        const checklistDiv = document.createElement('div');
        checklistDiv.setAttribute('style', 'padding-left:15px;')
        if (checklistItem.checklist) {
          checklistItem.checklist.forEach(item => checklistDiv.append(loader.renderChecklistItem(item)));
        }
        subheadDiv.append(checklistDiv);

        return subheadDiv;
      },

     /** Create the checkbox Element for the given checklistItem.
      *  @param {Object} checklistItem json representing the checklist item's data
      *  @return {Element} element representing the checkbox
      */
      createCheckboxForChecklistItem: function(checklistItem) {
        const checkboxElem = document.createElement('input');
        checkboxElem.id = checklistItem.name;
        checkboxElem.setAttribute('type', 'checkbox');
        checkboxElem.setAttribute('class', 'checkbox');
        checkboxElem.addEventListener('change', saveChecklist);

        if (checklistItem.checked) {
          checkboxElem.setAttribute('checked', 'checked');
        }

        return checkboxElem;;
      },

    /** Create the text for the given checklist item.
     *  @param {Object} checklistItem the json representing the checklist item
     *  @return {Element} a DOM element containing the text for the checklist item
     */
     createTextForChecklistItem: function(checklistItem) {
       const labelElem = document.createElement('label')
       labelElem.setAttribute('for', checklistItem.name);

       const textDivElem = document.createElement('div');
       textDivElem.setAttribute('class', loader.constants.CHECKLIST_ITEM_TEXT_CLASS);

       const itemText = document.createTextNode(checklistItem.name);
       if (checklistItem.description != undefined) {
         textDivElem.setAttribute('title', checklistItem.description);
       }
       textDivElem.append(itemText);
       labelElem.append(textDivElem);
       return labelElem;
     },

   /** Wrap the given element in a td element.
    * @param {Element} elementToWrap the element to wrap in a td
    * @return {Element} a td element containing the passed element
    */
    getTdWrappedElement: function(elementToWrap) {
      td = document.createElement('td');
      td.append(elementToWrap);
      return td;
    },

    /** Given a container of rendered html, construct a javascript object from it.
     *
     * @param {Element} containingElement he container element of checklists to convert into json
     * @return {Object} a Javascript object that represents the full state of the checklist
     */
     renderJsonFromHtml: function(containingElement) {
       const returnObject = {};
       const allChecklistItems = Array.from(document.getElementsByClassName(loader.constants.CHECKLIST_ITEM_CLASS),
          element => loader.renderJsonFromChecklistItem(element)
       );
       const checkedItems = allChecklistItems.filter( checklistItem => checklistItem.checked);
       returnObject.checklist = checkedItems;
       return returnObject;
     },

   /** Given a container of a single checkbox div, return a JSON version of it.
    *
    *  @param {Element} checklistItemElem the html element to extract from
    *  @return {Object} a JSON view of the data in the element
    */
    renderJsonFromChecklistItem: function(checklistItemElem) {
       // checklist item name
       const checklistItemTextElem = loader.getFirstElementOfClass(checklistItemElem, loader.constants.CHECKLIST_ITEM_TEXT_CLASS);
       const itemName = checklistItemTextElem.textContent;
       const checkboxElem = loader.getFirstElementOfClass(checklistItemElem, 'checkbox');

       const returnObject = {};
       if (itemName) {
         returnObject.name = itemName;
       }

       if (checkboxElem) {
         returnObject.checked = checkboxElem.checked;
       }
       return returnObject;

    },

  /** Return the first element within a container that has the given class.
   *
   * @param {Eleemnt} containingElement the element to look within
   * @param {String} className the css class name to search for
   * @return {Element} the first element within containingElement that has the specified class, or undefined if one not found
   */
   getFirstElementOfClass: function(containingElement, className) {
     const subElements = containingElement.getElementsByClassName(className);
     return subElements.length > 0 ? subElements[0] : undefined;
   },

   constants: {
     CHECKLIST_ITEM_CLASS: 'checklistItem',
     CHECKLIST_ITEM_TEXT_CLASS: 'checklistItemText'
   }
}
