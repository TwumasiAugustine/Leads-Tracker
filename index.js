let myLeads = [];
const inputEl = document.getElementById('input-el');
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
  let listItems = '';
  for (let i = 0; i < leads.length; i++) {
    // Making a list item clickable
    listItems += `
            <li>
                <a target='_blank' href='${leads[i]}'>
                    ${leads[i]}
                </a>
                <i class="remove-btn fa fa-trash" data-index="${i}" style="color: red; float: right; margin-right: 40px; cursor: pointer"; ></i>
            </li>
        `;
    }
    ulEl.innerHTML = listItems;
    
    // Add event listeners for each remove button
    const removeButtons = document.querySelectorAll('.remove-btn');
    removeButtons.forEach(function(btn) {
        btn.addEventListener('click', function() {
            const index = btn.getAttribute('data-index');
            myLeads.splice(index, 1);
            localStorage.setItem('myLeads', JSON.stringify(myLeads));
            render(myLeads);
        });
    });
}

// Tab button
saveTabBtn.addEventListener('click', function() {
  // Grab the url of the current tab
    chrome.tabs.query({ active: true, currentWindow: true }, 
    function(tabs) {
    myLeads.push(tabs[0].url);
    localStorage.setItem('myLeads', JSON.stringify(myLeads));
    render(myLeads);
    });
});

// Save Input Button Function
inputBtn.addEventListener('click', function() {
    myLeads.push(inputEl.value);
    inputEl.value = '';
    localStorage.setItem('myLeads', JSON.stringify(myLeads));
    render();
});

// Delete All Buttons Function
deleteBtn.addEventListener('dblclick', function() {
  localStorage.clear();
  myLeads = [];
  render(myLeads);
});
