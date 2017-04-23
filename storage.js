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

  INDEX_KEY: 'index',
  CHECKLIST_KEY: 'checklists',
  EMPTY_CHECKLISTS: {checklists:{}},

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

     // load template and then overlay any checked items from storage
     fetch(chrome.runtime.getURL('master_template.json')).then(response =>
       response.json().then(json => {
          // once json is loaded, overlay storage item
          storage.getStorageArea().get(url, checklistData => {
            const mergedJson = storage.mergeChecklistOntoMaster(checklistData[url], json);
            checklistCallback({checklist: mergedJson});
          });
       }));
   },

   /** Merges checklist information on top of main template json.
    *  For any given item in template, see if the corresponding key in checklist
    *  is checked.
    *  This mutates mergeTarget
    *
    * @param {Object} checklistData the data for the saved checklist
    * @param {Object} mergeTarget the jso to merge into.
    */
    mergeChecklistOntoMaster: function(checklistData, mergeTarget) {
       if (!checklistData) {
         return mergeTarget.checklist;
       }

       // convert the checklistData to a hash for quick lookup
       const nameToChecked = storage.convertChecklistToHash(checklistData.checklist);

       // for every name in mergerTarget, find the equivalent value in checklistData
       // and set the mergeTarget's json to include a checked flag
       const mergedChecklist = mergeTarget.checklist.map( storedData => {

         const returnItem = {name: storedData.name, description: storedData.description};
         returnItem.checked = nameToChecked[storedData.name] ? nameToChecked[storedData.name] : false
         return returnItem;
       });
       return mergedChecklist;
    },

    /** Convert a checklist array to a hash where the key is the item name
     *  and the value is its checked status.
     *  @param {Array} checklistItems the items to inspect
     *  @return {Ojbect} hash where each key is the checklist item name and each value is its checked state
     */
     convertChecklistToHash: function(checklistItems) {
       if (!checklistItems) {
         return {};
       }

       const hash = checklistItems.reduce( (accumulator, currentItem, _index, _array) => {
         if (storage.isObjectValid(currentItem, 'name') && currentItem.checked) {
           accumulator[currentItem.name] = currentItem.checked;
         }
         return accumulator;
       }, {});
       return hash;
     },

   /** Determine if the passed in data is valid and has the given key
    *
    * @param {Object} data the data blob to inspect
    * @param {String} key the key to check
    * @return {Boolean} whether the rest of the code can make assumptions about it
    */
    isObjectValid: function(objectToCheck, key) {
      return objectToCheck != undefined && objectToCheck[key] != undefined
    },

    /** Determine if the given object is a valid stored checklist object.
     *  In order to be considered valid, it needs to have the given url as a field
     *  and that field must have a checklist property within it.
     *
     * @param {Object} objectToCheck to evaluate
     * @param {String} url to use for evaluation
     * @return {Boolean} if this is a valid checklist item
     */
    isValidChecklistObject: function(objectToCheck, url) {
      return storage.isObjectValid(objectToCheck, url) && storage.isObjectValid(objectToCheck[url], 'checklist');
    },

    /** Determine if the passed-in object is a valid index object
     *  There needs to be an index element with a checklists subelement
     *  @param {Object} objectToCheck
     *  @return {Boolean} if the object was a valid index
     */
    isValidIndexObject: function(objectToCheck) {
      return storage.isObjectValid(objectToCheck,storage.INDEX_KEY) && storage.isObjectValid(objectToCheck[storage.INDEX_KEY], storage.CHECKLIST_KEY);
    },

   /** Saves the specified checklist into the specified key.
    *
    * @param {Object} checklist data to save
    * @param {String} storageKey the key in which to save the json
    */
    saveChecklist: function(checklist, storageKey) {
      if (!(checklist || storageKey)) {
        return;
      }
      const storageObject = {};
      storageObject[storageKey] = checklist;
      storage.getStorageArea().set(storageObject, () => {

        if (storage.errorOccurred()) {
          storage.purgeAndRetry(checklist, storageKey);
        } else {
          storage.updateIndex(storageKey);
        }

      });
    },

    /** Updates the index for the given checklist. The index is maintained as a way
     * to contain information about the storage as a whole.
     *
     * @param {String} storageKey the storageKey to update
     */
     updateIndex: function(storageKey) {
       if (!storageKey) {
         return
       }
       const indexEntry = {last_updated_timestamp: Date.now()};

       storage.getStorageArea().get(storage.INDEX_KEY, index => {

         if (storage.isValidIndexObject(index)) {
           // update the existing list and re-save
           index[storage.INDEX_KEY].checklists[storageKey] = indexEntry;
           storage.getStorageArea().set(index);
         } else {
           // the index doesn't exist, so create it with this as the first entry
           newIndex = {};
           newIndex[storage.INDEX_KEY] = storage.EMPTY_CHECKLISTS;

           newIndex[storage.INDEX_KEY].checklists[storageKey] = indexEntry;
           storage.getStorageArea().set(newIndex);

         }
       });
     },

     /** Some error happened  when saving the checklist, so we need to purge
      *  old checklists and try again.
      *
      * @param {Object} objectToSave the object to save
      * @param {String} storageKey the key to store the data under
      */
      purgeAndRetry: function(objectToSave, storageKey) {

        // get the index and work off of that
        storage.getStorageArea().get(storage.INDEX_KEY, index => {

          // figure out the item with the oldest timestamp
          const indexItems = storage.convertIndexObjectToArray(index[storage.INDEX_KEY].checklists);
          const oldestKey = storage.getOldestKeyInChecklists(indexItems);
          storage.getStorageArea().remove(oldestKey, () => {
             // only remove the checklist index entry if there were no errors
             // otherwise, if you removed the index item but not the actual checklist
             // you could orphan checklists
             if (!storage.errorOccurred()) {
                delete index[storage.INDEX_KEY].checklists[storageKey];
                storage.getStorageArea().set(index);
             }

             // and now retry
             storage.saveChecklist(objectToSave, storageKey);

          });
        });
      },

    /** Convert an index object's keys into an array of items where checklistKey is the object key and last_updated_timestamp is the teimstamp field.
     *  @param {Object} checklistItems object containing checklist keys and timestamps
     *  @return {Array} collated data where each element has a checklistKey field and a timestamp field
     */
     convertIndexObjectToArray: function(checklistItems) {
       if (!checklistItems) {
         return [];
       }
       return Object.keys(checklistItems).map( (key, _index) => ({checklistKey: key, timestamp: checklistItems[key].last_updated_timestamp}));
     },

    /** Find the oldest key in the array of checklists.
     *  @param {Array} checklistIndexItems the index of checklist items
     *  @return {String} the oldest item in the array; the one with the lowest timestamp
     */
     getOldestKeyInChecklists: function(checklistIndexItems) {
       if (!checklistIndexItems) {
         return undefined;
       }
       checklistIndexItems.sort( (left, right) => left.timestamp <= right.timestamp ? -1 : 1);
       return checklistIndexItems[0].checklistKey;
      },

      /** Return whether there was an error or not in the last chrome operation.
       *  @return {Boolean} whether chrome.runtime.lasterror is set
       */
       errorOccurred: function() {
         return chrome.runtime.lastError != undefined;
       },

     /** Returns the storage engine used by the extension.
      *
      * @return {Object} Chrome StorageArea
      */
      getStorageArea: function() {
        return chrome.storage.local;
      }
}
