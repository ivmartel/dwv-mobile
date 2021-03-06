// namespaces
var dwvjq = dwvjq || {};
dwvjq.gui = dwvjq.gui || {};

/**
 * Dropbox loader.
 * Listens to drag events on the layer container and
 * uses a drop box element as first display.
 * @constructor
 * @param {Object} app The associated application.
 */
dwvjq.gui.DropboxLoader = function (app) {

  // drop box class name
  var dropboxDivId = 'dropBox';
  var dropboxClassName = 'dropBox';
  var borderClassName = 'dropBoxBorder';
  var hoverClassName = 'hover';

  /**
   * Initialise the drop box.
   */
  this.init = function () {
    this.showDropbox(true);
  };

  /**
  * Basic handle drag event.
  * @private
  * @param {Object} event The event to handle.
   */
  function defaultHandleDragEvent(event) {
    // prevent default handling
    event.stopPropagation();
    event.preventDefault();
  }

  /**
   * Handle a drag over.
   * @private
   * @param {Object} event The event to handle.
   */
  function onBoxDragOver(event) {
    defaultHandleDragEvent(event);
    // update box border
    var box = document.getElementById(dropboxDivId);
    if (box && box.className.indexOf(hoverClassName) === -1) {
      box.className += ' ' + hoverClassName;
    }
  }

  /**
   * Handle a drag leave.
   * @private
   * @param {Object} event The event to handle.
   */
  function onBoxDragLeave(event) {
    defaultHandleDragEvent(event);
    // update box border
    var box = document.getElementById(dropboxDivId);
    if (box && box.className.indexOf(hoverClassName) !== -1) {
      box.className = box.className.replace(' ' + hoverClassName, '');
    }
  }

  /**
   * Handle a drop event.
   * @private
   * @param {Object} event The event to handle.
   */
  function onDrop(event) {
    defaultHandleDragEvent(event);
    // load files
    app.loadFiles(event.dataTransfer.files);
  }

  /**
   * Show or hide the data load drop box.
   * @param {boolean} show Flag to show or hide.
   */
  this.showDropbox = function (show) {
    var box = document.getElementById(dropboxDivId);
    var isBoxShown = box && box.offsetHeight !== 0;
    var layerDiv = app.getElement('layerContainer');

    if (box) {
      if (show && !isBoxShown) {
        // reset css class
        box.className = dropboxClassName + ' ' + borderClassName;
        // add content if empty
        if (box.innerHTML === '') {
          var p = document.createElement('p');
          p.appendChild(document.createTextNode('Drag and drop data here'));
          box.appendChild(p);
        }
        // show box
        box.setAttribute('style', 'visible:true;width:50%;height:75%');
        // stop layer listening
        if (layerDiv) {
          layerDiv.removeEventListener('dragover', defaultHandleDragEvent);
          layerDiv.removeEventListener('dragleave', defaultHandleDragEvent);
          layerDiv.removeEventListener('drop', onDrop);
        }
        // listen to box events
        box.addEventListener('dragover', onBoxDragOver);
        box.addEventListener('dragleave', onBoxDragLeave);
        box.addEventListener('drop', onDrop);
      } else {
        // remove border css class
        box.className = dropboxClassName;
        // remove content
        box.innerHTML = '';
        // hide box
        box.setAttribute('style', 'visible:false;width:0;height:0');
        // stop box listening
        box.removeEventListener('dragover', onBoxDragOver);
        box.removeEventListener('dragleave', onBoxDragLeave);
        box.removeEventListener('drop', onDrop);
        // listen to layer events
        if (layerDiv) {
          layerDiv.addEventListener('dragover', defaultHandleDragEvent);
          layerDiv.addEventListener('dragleave', defaultHandleDragEvent);
          layerDiv.addEventListener('drop', onDrop);
        }
      }
    }
  };
}; // dwvjq.gui.dropboxLoader
