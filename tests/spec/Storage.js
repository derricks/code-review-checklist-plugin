describe('object validity tests', () => {

  describe('isObjectValid', () => {
    const testKey = 'test';

    it ('considers undefined to be invalid', () => {
      expect(storage.isObjectValid(undefined, testKey)).toBe(false);
    });

    it ('considers an object without the given key invalid', () => {
      const testObject = {}
      expect(storage.isObjectValid(testObject, testKey)).toBe(false);
    });

    it ('considers an object with the given key to be valid', () => {
      const testObject = {};
      testObject[testKey] = 'response';
      expect(storage.isObjectValid(testObject, testKey)).toBe(true);
    });
  });
});

describe('utility functions', () => {

  it ('should find the oldest checklist', () => {
    const testArray = [
      {checklistKey: "abcd", timestamp: 1000},
      {checklistKey: "defg", timestamp: 100},
      {checklistKey: "zywx", timestamp: 1}
    ];

    const oldestKey = storage.getOldestKeyInChecklists(testArray);
    expect(oldestKey).toBe('zywx');
  });

  it ('should collate an index of checklist items properly', () => {
    const testObject = { checklists:{
      abc: {last_updated_timestamp: 123},
      def: {last_updated_timestamp: 456}
    }};

    const coalescedItems = storage.convertIndexObjectToArray(testObject.checklists);
    expect(coalescedItems[0].checklistKey).toBe('abc');
    expect(coalescedItems[0].timestamp).toBe(123);;
  });

  it ('should convert an array of checklist items to a hash', () => {
    const testArray = [
      {name: 'checkedItem1', checked:true, description: 'should be ignored'},
      {name: 'checkedItem2', checked:true, description: 'should be ignored'},
      {name: 'uncheckedItem1', checked: false},
      {name: 'uncheckedItem2'},
      {description: 'invalidItem1'}
    ];

    const lookupHash = storage.convertChecklistToHash(testArray);
    expect(lookupHash['checkedItem1']).toBe(true);
    expect(lookupHash['checkedItem2']).toBe(true);
    expect(lookupHash['uncheckedItem1']).toBeUndefined();
    expect(lookupHash['uncheckedItem2']).toBeUndefined();
    expect(Object.keys(lookupHash).length).toBe(2);
  });

  it ('should merge checklist data onto json', () => {
    const storedData = {checklist:
    [
      {name: 'checkedItem1', checked: true}
    ]};

    const jsonTemplate = { checklist:
    [
      {name: 'checkedItem1', description: 'This should get set to true'},
      {name: 'uncheckedItem1'}
    ]};

    const mergedChecklist = {checklist: storage.mergeChecklistOntoMaster(storedData, jsonTemplate)};
    expect(mergedChecklist.checklist[0].checked).toBe(true);
    expect(mergedChecklist.checklist[1].checked).toBe(false);
  });

  describe('constructing checklist items from storage', () => {
    const lookupHash = {
      item1: true,
    };

    const mergeTarget = [
      {name: 'item1'},
      {name: 'item2'}
    ];

    it ('should set checked to true if the name is in the hash', () => {
      const mergedCheckedItem = storage.setCheckedFlagFromLookup(lookupHash, mergeTarget[0]);
      expect(mergedCheckedItem.checked).toBe(true);
    });

    it ('should set checked to false if the name is in the hash', () => {
      const mergedCheckedItem = storage.setCheckedFlagFromLookup(lookupHash, mergeTarget[1]);
      expect(mergedCheckedItem.checked).toBe(false);
    });

  });


});
