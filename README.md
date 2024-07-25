
# Project URL Tracker

## HTML

* `input-el`: Input field for URL
* `input-btn`: Button to save URL
* `ul-el`: List element to display saved URLs
* `delete-btn`: Button to delete all URLs
* `tab-btn`: Button to save current tab's URL

## JavaScript

### Variables

* `myLeads`: Array to store saved URLs
* `inputEl`: Input field element
* `inputSaveBtn`: Button to save URL element
* `listEl`: List element to display saved URLs
* `deleteAllBtn`: Button to delete all URLs element
* `saveTabBtn`: Button to save current tab's URL element
* `leadsFromLocalStorage`: Array of saved URLs from local storage

### Functions

* `render(leads)`: Renders the list of saved URLs
* `displayEditForm(index, url, title)`: Displays the edit form for a URL
* `saveURL(url, title)`: Saves a new URL to the list
* `deleteAllURLs()`: Deletes all saved URLs

### Event Listeners

* `inputEl`: Listens for input and enables/disables the save button
* `inputSaveBtn`: Listens for click and saves the URL
* `deleteAllBtn`: Listens for double click and deletes all URLs
* `saveTabBtn`: Listens for click and saves the current tab's URL
* `document.body`: Listens for clicks and handles edit and delete actions

### Local Storage

* `myLeads`: Array of saved URLs stored in local storage

