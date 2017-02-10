function message(msg) {
	document.getElementById('alert-box').innerHTML = msg;
}

function load() {
	// Retrieve the currently selected title.
	var title = document.getElementById("wgtmsr").value;

	// Retrieve the links associated with that title from Storage API.
	chrome.storage.sync.get(title, function(obj) {
		linksList = (obj[title]).split(",");
		chrome.windows.create({url:linksList});
    });
}

function remove() {
	// Retrieve the currently selected title.
	var title = document.getElementById("wgtmsr").value;

	var selectObject = document.querySelector("#wgtmsr");

	for (i = 1; i < selectObject.length; i++) {
		if (selectObject[i].innerHTML == title) {
			selectObject.remove(i);
			break;
		}
	}

	// Also remove the title from chrome.storage so it won't load next time.
}

function view() {
	// Retrieve the currently selected title.
	var title = document.getElementById("wgtmsr").value;
	document.getElementById("link-display").value = ""; // Clear the textarea.

	// Retrieve the links associated with that title from Storage API.
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

	// Retrieve all existing titles and check if entered title matches any of them.
	chrome.storage.sync.get('savedTitles', function(obj) {
		savedTitlesList = obj['savedTitles'].split(",");
		for (i = 0; i < savedTitlesList.length; i++) {
			if (title == savedTitlesList[i]) {
				message("This title is already in use.");
				return;
			}
		}
    });

	// Make sure a proper title was entered (non empty and not already existing).
	if (title == "") {
		message("Please enter a title.");
		return;
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


			// Store the title-link pair, as well as the title itself
			chrome.storage.sync.set(keyValuePair, function() {
		        // First save the title-link pair...
		        message("Saved browser config", title, "successfully.");

		        // ...then we add the the title to the saved title list by getting the current
		        // and then updating it by appending the new title
		        chrome.storage.sync.get('savedTitles', function(obj) {
					savedTitlesList = obj['savedTitles'];
					savedTitlesList = savedTitlesList + "," + title;

				    keyValuePair = {};
				    keyValuePair['savedTitles'] = savedTitlesList;
				    chrome.storage.sync.set(keyValuePair, function() {
				    	console.log("New title", title, "added.");
				    	main();
				    });
			    });
	        });
		});
    }
}

function main() {
	// Check to see if we have already have some saved titles
	chrome.storage.sync.get('savedTitles', function(obj) {

		if (Object.keys(obj).length == 0) {
			console.log("No titles found! Initializing savedTitles...");
			// No titles were found, so set the value of savedTitles to an empty string...
			// ...so create the object
		    keyValuePair = {};
		    keyValuePair['savedTitles'] = " ";

			chrome.storage.sync.set(keyValuePair, function() {
		        // Add title to dropdown list.
		        console.log("Initialized savedTitles.");
	        });
		}

        // If we already have them saved, we can start populating the dropdowns with the links
		else {
			console.log("savedTitles found.");
			savedTitles = obj['savedTitles'];
			savedTitlesList = savedTitles.split(",");
			
			// Populate the dropdowns with the links.
			for (i = 1; i < savedTitlesList.length; i++) {
				var option = document.createElement('option');
			    option.text = savedTitlesList[i];
			    document.querySelector("#wgtmsr").add(option);
			}
		}
    });
}

// Add event listeners once the DOM has fully loaded by listening for the
// `DOMContentLoaded` event on the document, and adding your listeners to
// specific elements when it triggers.
document.addEventListener('DOMContentLoaded', function () {
  document.querySelector('#load-button').addEventListener('click', load);
  document.querySelector('#remove-button').addEventListener('click', remove);
  document.querySelector('#view-button').addEventListener('click', view);
  document.querySelector('#save-button').addEventListener('click', save);
  main();
});