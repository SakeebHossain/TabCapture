//TO-DO : save() saves all tabs from all open windows. We want it to only save from the current tab.
//TO-DO : add option to open new window or new browser. 
//TO-DO : use JSON to store the titlelinks pairs, and use .keys() on that JSON to get titles.
//TO-DO : after removing a title, it doesn't immediately refresh the dropdown; only after a reopen.
//TO-DO : testing weird stuff with remove(), like doubling randomly, not deleting immediately, etc.
//TO-DO : some "title"'s don't show up in messages()

function message(msg) {
	document.getElementById('alert-box').innerHTML = msg;
}

function load() {
	// Retrieve the currently selected title.
	var title = document.getElementById("wgtmsr").value;
	var loadOption = document.getElementById("load_options").value;
	
	if (loadOption == "new_tab") {
		// Retrieve the links associated with that title from Storage API.
		chrome.storage.sync.get(title, function(obj) {
			linksList = (obj[title]).split(",");
			for (i = 0; i < linksList.length; i++) {
				chrome.tabs.create({url:linksList[i]});
			}
	    });
	} else if (loadOption == "new_window") {
		// Retrieve the links associated with that title from Storage API.
		chrome.storage.sync.get(title, function(obj) {
			linksList = (obj[title]).split(",");
            chrome.windows.create({url:linksList});
	    });
    } else if (loadOption == "new_incognito_window") {
		// Retrieve the links associated with that title from Storage API.
		chrome.storage.sync.get(title, function(obj) {
			linksList = (obj[title]).split(",");
            chrome.windows.create({url:linksList, "incognito": true});
	    });
    }
}

function remove() {
	// Retrieve the currently selected title.
	var title = document.getElementById("wgtmsr").value;

	if (title != "") {

		var selectObject = document.querySelector("#wgtmsr");

	    // Remove the title from chrome.storage so it won't load next time; both title and title:link pair
	    // First remove the title...
	    chrome.storage.sync.get('savedTitles', function(obj) {
	    	savedTitles = obj['savedTitles'].split(",");
	    	index = savedTitles.indexOf(title);
	    	if (index > -1) {
	    	    savedTitles.splice(index, 1);
	    	}

	    	// And reset it. Start by converting list to string and making key:value pair
		    keyValuePair = {};
		    strLinks = savedTitles.toString();
		    keyValuePair['savedTitles'] = strLinks;


			// Store the title:link pair, as well as the title itself
			chrome.storage.sync.set(keyValuePair, function() {
		        // First save the title:link pair...
		        console.log("Deleting title", title, "....");
	        });
	    });

	    // Next remove the title:link pair by setting
	    chrome.storage.sync.remove(title, function(obj) {
	    	console.log("Title", title, "successfully removed.");
	    	message("Title", title, "successfully removed.");
	    	main();
	    });

	    // Finally, reset the dropdown using main to reload everything from storage
	    
	}
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
		console.log("Viewing", title, ".");
		message("Viewing", title, ".");
    });
}

function isValidTitle(title) {
	// Check if entered title matches any of them.
	chrome.storage.sync.get('savedTitles', function(obj) {
		savedTitlesList = (obj['savedTitles']).split(",");
		for (i = 0; i < savedTitlesList.length; i++) {
			if (title == savedTitlesList[i]) {
				message("This title is already in use.");
				return false;
			}
		} 
    });

	// Make sure a proper title was entered (non empty and not already existing).
	if (title == "") {
		message("Please enter a title.");
		return false;
	} 

	//Make sure there are no special character in the title.
    var iChars = "~`!#$%^&*+=-[]\\\';,/{}|\":<>?";
    for (var i = 0; i < title.length; i++) {
       if (iChars.indexOf(title.charAt(i)) != -1) {
           message("Characters ~`!#$%^&*+=-[]\\\';,/{}|\":<>? are not allowed in title.");
           return false;
       }
    }
    // If it passes all tests, return true!
    return true
}

function save() {
	// Retrieve title from input box.
	var title = document.getElementById('name-input').value;

	if (isValidTitle(title)) {
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


			// Store the title:link pair, as well as the title itself
			chrome.storage.sync.set(keyValuePair, function() {
		        // First save the title:link pair...
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
	// chrome.storage.sync.clear();
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
			
			// Clear and then populate the dropdowns with the links.
			for (i = 1; i < savedTitlesList.length; i++) {
			    document.querySelector("#wgtmsr").remove(i);
			    console.log("removed", document.querySelector("#wgtmsr").value);
			}

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