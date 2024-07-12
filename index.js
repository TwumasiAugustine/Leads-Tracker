let myLeads = [];
const inputEl = document.getElementById('input-el');
// const preview = document.getElementById('previewer');
const inputBtn = document.getElementById('input-btn');
const ulEl = document.getElementById('ul-el');
const deleteBtn = document.getElementById('delete-btn');
const saveTabBtn = document.getElementById('tab-btn');
const leadsFromLocalStorage = JSON.parse(localStorage.getItem('myLeads'));

if (leadsFromLocalStorage) {
    myLeads = leadsFromLocalStorage;
    render(myLeads);
}

function render(leads) {
    const listItems = leads.map((lead, index) => `
        <li>
            <a target='_blank' href='${lead}'>
                ${lead}
            </a>
            <i class="remove-btn fa fa-trash" data-index="${index}" style="color: red; float: right; margin-right: 10px; cursor: pointer"; ></i>
        </li>
    `).join('');
    ulEl.innerHTML = listItems;
}

// Event delegation for remove buttons
ulEl.addEventListener('click', function(event) {
    if (event.target.classList.contains('remove-btn')) {
        const index = event.target.getAttribute('data-index');
        myLeads.splice(index, 1);
        localStorage.setItem('myLeads', JSON.stringify(myLeads));
        render(myLeads);
    }
});

// Tab button
saveTabBtn.addEventListener('click', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        myLeads.push(tabs[0].url);
        localStorage.setItem('myLeads', JSON.stringify(myLeads));
        render(myLeads);

        // Check if notifications are permitted
        if (Notification.permission === 'granted') {
            // Display a notification
            new Notification('Link Saved', {
                body: `You've successfully saved the link: ${tabs[0].url}`,
                icon: 'link_icon.png' // Optional: add a link icon or any relevant icon
            });
        }
    });
});

// Link preview
// inputEl.addEventListener('input', () => {
//   preview.innerHTML = ': ' + inputEl.value
//   console.log('typing:', inputEl.value);
// });

// Save Input Button Function
inputBtn.addEventListener('click', function() {
    myLeads.push(inputEl.value);
    inputEl.value = '';
    localStorage.setItem('myLeads', JSON.stringify(myLeads));
    render(myLeads);
});

// Delete All Buttons Function
deleteBtn.addEventListener('dblclick', function() {
    localStorage.clear();
    myLeads = [];
    render(myLeads);
});