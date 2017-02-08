function load() {
	console.log("load");
}

function remove() {
	console.log("remove");
}

function save() {
	console.log("save");
}

// Add event listeners once the DOM has fully loaded by listening for the
// `DOMContentLoaded` event on the document, and adding your listeners to
// specific elements when it triggers.
document.addEventListener('DOMContentLoaded', function () {
  document.querySelector('#load-button').addEventListener('click', load);
  document.querySelector('#remove-button').addEventListener('click', remove);
  document.querySelector('#save-button').addEventListener('click', save);
});