let myLeads = [];
const inputEl = document.getElementById('input-el');
const inputSaveBtn = document.getElementById('input-btn');
const selectEl = document.getElementById('select');
const listEl = document.getElementById('ul-el');
const listEl2 = document.getElementById('ul-el2');
const usefulH = document.getElementById('usefulH');
const useful = document.getElementById('useful');
const project = document.getElementById('project');
const projectH = document.getElementById('projectH');
const deleteAllBtn = document.getElementById('delete-btn');
const saveTabBtn = document.getElementById('tab-btn');
const leadsFromLocalStorage = JSON.parse(localStorage.getItem('myLeads'));
const error = document.getElementById('error-message');

// Initialize leads from localStorage
if (leadsFromLocalStorage) {
	myLeads = leadsFromLocalStorage;
	render(myLeads);
}

inputEl.addEventListener('input', () => {
	inputSaveBtn.disabled = inputEl.value.trim() === '';
});

function render(leads) {
	const usefulLeads = leads.filter((lead) => lead.category === 'Useful');
	const projectLeads = leads.filter((lead) => lead.category === 'Project');
	console.log(leads);
	const renderList = (leads) =>
		leads
			.map((lead) => {
				const title =
					lead.title.length > 43
						? lead.title.substring(0, 43) + '...'
						: lead.title;
				const url =
					lead.url.length > 50
						? lead.url.substring(0, 50) + '...'
						: lead.url;
				return `
            <li>
                <a style='overflow-x: auto; width: 300px' target='_blank' href='${lead.url}' title="${url}">
                    ${title}
                </a>
                <i title='Delete URL' class="remove-btn fa fa-trash" data-id="${lead.id}" style="color: red; float: right; cursor: pointer;"></i>
                <i title='Edit URL' class="edit-btn fa fa-pencil" data-id="${lead.id}" style="color: gold; margin-right: 20px; float: right; cursor: pointer;"></i>
            </li>
        `;
			})
			.join('');

	const countUseful = usefulLeads.length;
	const countProject = projectLeads.length;

	usefulH.innerHTML = `Useful <span class='count'>(${countUseful})</span>`;
	projectH.innerHTML = `Project <span class='count'>(${countProject})</span>`;

	listEl.innerHTML = renderList(usefulLeads);
	listEl2.innerHTML = renderList(projectLeads);

	useful.style.display = countUseful === 0 ? 'none' : 'block';
	project.style.display = countProject === 0 ? 'none' : 'block';
}

let editForm;
let isEditFormDisplayed = false;

function displayEditForm(id, url, title, category) {
	if (isEditFormDisplayed) {
		error.innerHTML =
			'*' + ' Please complete or cancel the current edit first.';
		return;
	}
	isEditFormDisplayed = true;
	editForm = document.createElement('div');
	editForm.classList.add('modal');
	editForm.innerHTML = `
        <div class='input-container'>
            <input type='url' placeholder='Enter new URL' value='${url}' id='edit-url-${id}' readonly>
            <input type='text' placeholder='Enter new title' value='${title}' autofocus id='edit-title-${id}'>
            <select id="edit-category-${id}" name="category" aria-label="category">
        <option value="" ${category === '' ? 'selected' : ''}>Select</option>
        <option value="Useful" ${
			category === 'Useful' ? 'selected' : ''
		}>Useful</option>
        <option value="Project" ${
			category === 'Project' ? 'selected' : ''
		}>Project</option>
        </select>
        </div>
        <div class='btn-container'>
            <button type='button' id='save-edit-btn-${id}'>Update</button>
            <button type='button' class='cancel' id='cancel-edit-btn-${id}'>Cancel</button>
        </div>
    `;
	document.body.appendChild(editForm);
}

document.body.addEventListener('click', (e) => {
	const { target } = e;

	if (target.id.startsWith('save-edit-btn-')) {
		const id = target.id.split('-')[3];
		const urlEl = document.getElementById(`edit-url-${id}`);
		const titleEl = document.getElementById(`edit-title-${id}`);
		const selectEl = document.getElementById(`edit-category-${id}`);
		if (urlEl && titleEl && selectEl) {
			const url = urlEl.value;
			const title = titleEl.value;
			const category = selectEl.value;
			if (category === '') {
				error.innerHTML = '*' + ' Please select a category';
				return;
			}
			const leadIndex = myLeads.findIndex((lead) => lead.id == id);
			myLeads[leadIndex] = { id, url, title, category };
			localStorage.setItem('myLeads', JSON.stringify(myLeads));
			document.body.removeChild(editForm);
			isEditFormDisplayed = false;
			render(myLeads);
		}
	} else if (target.id.startsWith('cancel-edit-btn-')) {
		if (editForm) {
			document.body.removeChild(editForm);
			isEditFormDisplayed = false;
		}
	} else if (target.classList.contains('remove-btn')) {
		const id = target.getAttribute('data-id');
		if (confirm('Are you sure you want to delete this URL?')) {
			myLeads = myLeads.filter((lead) => lead.id != id);
			localStorage.setItem('myLeads', JSON.stringify(myLeads));
			if (isEditFormDisplayed) {
				document.body.removeChild(editForm);
				isEditFormDisplayed = false;
			}
			render(myLeads);
		}
	} else if (target.classList.contains('edit-btn')) {
		const id = target.getAttribute('data-id');
		const lead = myLeads.find((lead) => lead.id == id);
		if (lead) {
			displayEditForm(lead.id, lead.url, lead.title, lead.category);
		}
	}
});

function saveURL(url, title, category) {
	const existingUrl = myLeads.find((lead) => lead.url === url);
	if (existingUrl) {
		error.innerHTML = '*' + ' URL already exists in the list';
		return;
	} else {
		error.innerHTML = '';
	}
	const newLead = { id: Date.now(), url, title, category };
	myLeads.push(newLead);
	localStorage.setItem('myLeads', JSON.stringify(myLeads));
}

saveTabBtn.addEventListener('click', function () {
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		const currentTab = tabs[0];
		const url = currentTab.url;
		const title = currentTab.title || url;
		const category = selectEl.value;

		if (category === '') {
			error.innerHTML = '*' + ' Please, select category';
			return;
		}
		saveURL(url, title, category);
		selectEl.value = '';
		render(myLeads);
	});
});

inputSaveBtn.addEventListener('click', function () {
	const url = inputEl.value;
	const title = inputEl.value;
	const category = selectEl.value;

	if (category === '') {
		error.innerHTML = '*' + ' Please, select a category';
		return;
	}
	if (url && title && category) {
		saveURL(url, title, category);
		inputEl.value = '';
		selectEl.value = '';
		render(myLeads);
	}
});

deleteAllBtn.addEventListener('dblclick', function () {
	if (
		myLeads.length > 0 &&
		confirm('Are you sure you want to delete all URLs?')
	) {
		localStorage.removeItem('myLeads');
		myLeads = [];
		render(myLeads);
	}
});
