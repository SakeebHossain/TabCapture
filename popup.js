function message(msg) {
	document.getElementById('alert-box').innerHTML = msg;
}

function load() {
	// Retrieve the currently selected title.
	var title = document.getElementById("wgtmsr").value;
	chrome.storage.sync.get(title, function(obj) {
        console.log(obj);
    });
}

function remove() {
	// Retrieve the currently selected title.
	console.log("remove");
}

function view() {
	// Retrieve the currently selected title.
	console.log(document.getElementById("wgtmsr").value);
}

function save() {
	// Retrieve title from input box.
	var title = document.getElementById('name-input').value;

	// Make sure a proper title was entered.
	if (title == "") {
		message("Please enter a title.");
	} else {
		// Get url of all open tabs.
		links = [];

		chrome.windows.getAll({populate: true}, function(windows) {
			// Collect all of the urls here.
		    windows.forEach(function(window) {
		        window.tabs.forEach(function(tab) {
		            links.push(tab.url);
		        });
		    });

			// Store the title with Storage API.
			chrome.storage.sync.set({title: links}, function() {
		        // Notify that we saved.
		        message("Saved.");
	        });
		});
    }
}

// Add event listeners once the DOM has fully loaded by listening for the
// `DOMContentLoaded` event on the document, and adding your listeners to
// specific elements when it triggers.
document.addEventListener('DOMContentLoaded', function () {
  document.querySelector('#load-button').addEventListener('click', load);
  document.querySelector('#remove-button').addEventListener('click', remove);
  document.querySelector('#view-button').addEventListener('click', view);
  document.querySelector('#save-button').addEventListener('click', save);
});