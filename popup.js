function message(msg) {
	document.getElementById('alert-box').innerHTML = msg;
}

function load() {
	// Retrieve the currently selected title.
	var title = document.getElementById("wgtmsr").value;

	// Retrieve the links associated with that title from Storage API.
	chrome.storage.sync.get(title, function(obj) {
		linksList = (obj[title]).split(",");

		// Open all links as new tabs in the new window.
		// TO-DO

    });
}

function remove() {
	// Retrieve the currently selected title.
	console.log("remove");
}

function view() {
	// Retrieve the currently selected title.
	var title = document.getElementById("wgtmsr").value;

	// Retrieve the links associated with that title from Storage API
	chrome.storage.sync.get(title, function(obj) {
		linksList = (obj[title]).split(",");
		for (i = 0; i < linksList.length; i++) {
			document.getElementById("link-display").value += linksList[i] +"\n\n";
		}
    });
}

function save() {
	// Retrieve title from input box.
	var title = document.getElementById('name-input').value;

	// Retrieve all existing titles and check if entered title matches any of them
	// TO-DO

	// Make sure a proper title was entered (non empty and not already existing).
	if (title == "") {
		message("The title is empty or already exists.");
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

		    // Convert list to string and make key value pair
		    keyValuePair = {};
		    strLinks = links.toString();
		    keyValuePair[title] = strLinks;


			// Store the title with Storage API.
			chrome.storage.sync.set(keyValuePair, function() {
		        // Notify that we saved.
		        message("Saved browser config", title, "successfully.");

		        // Add title to dropdown list.
		        var option = document.createElement('option');
		        option.text = title;
		        document.querySelector("#wgtmsr").add(option);

		        // Add the title to storage of titles so that on load, it appears next time.
		        // TO-DO
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