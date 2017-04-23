// tests to verify that the html view of the checklist UI can be converted into json that is stored
describe('HtmlToJSON Renderer', function() {

  describe('simple checklists', function() {

    beforeEach(function() {
      const fixture = '<div id="fixture">'
      + '<div id="checklist">'
      +   '<div id="item 1" class="checklistItem">'
      +     '<input type="checkbox" class="checkbox"><div title="helpful text" class="checklistItemText">item 1</div>'
      +   '</div>'
      +   '<div id="item 2" class="checklistItem">'
      +     '<input type="checkbox" class="checkbox" checked="checked"><div title="more helpful text" class="checklistItemText">item 2</div>'
      +   '</div>'
      +   '<div class="subheading" />'
      +  '</div>'
      + '</div>';

      document.body.insertAdjacentHTML('afterbegin', fixture);
    });

    afterEach(function() {document.body.removeChild(document.getElementById('fixture'))});

    // this mostly just tests that the fixture is being loaded
    it ('should find the checklist element', () => {
      const checklistElement = document.getElementById('checklist');
      expect(checklistElement).toBeDefined();
    });

    it ('should have two checklist items', () => {
      const checklistElement = document.getElementById('checklist');
      expect(checklistElement.getElementsByClassName('checklistItem').length).toEqual(2);
    });

    it ('should create a proper object from a simple checklist', () => {
      const checklistElement = document.getElementById('checklist');
      const storageObject = loader.renderJsonFromHtml(checklistElement);

      expect(storageObject.checklist).toBeDefined();
      expect(storageObject.checklist.length).toEqual(1);

      expect(storageObject.checklist[0].name).toEqual('item 2');
      expect(storageObject.checklist[0].description).toBeUndefined();
      expect(storageObject.checklist[0].checked).toBe(true);

    });

    describe('getFirstElementOfClass', () => {
      it ('should return the first element of a given class if it exists', () => {
        const checklistElement = document.getElementById('checklist');

        // note that there is only one item with subheading
        expect(loader.getFirstElementOfClass(checklistElement, 'subheading')).toBeDefined();
      });

      it ('should return undefined when looking for an invalid class', () => {
        const checklistElement = document.getElementById('checklist');
        expect(loader.getFirstElementOfClass(checklistElement, 'invalidClassName')).not.toBeDefined();

      });

    });
  });
});
