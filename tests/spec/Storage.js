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
});
