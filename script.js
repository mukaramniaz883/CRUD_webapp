// DOM Elements
const addForm = document.getElementById('addForm');
const itemsList = document.getElementById('itemsList');
const editModal = document.getElementById('editModal');
const editForm = document.getElementById('editForm');
const closeBtn = document.getElementById('closeBtn');

// API Endpoints
const API_BASE_URL = 'api/';
const CREATE_URL = API_BASE_URL + 'create.php';
const READ_URL = API_BASE_URL + 'read.php';
const UPDATE_URL = API_BASE_URL + 'update.php';
const DELETE_URL = API_BASE_URL + 'delete.php';

// Helpers
function showError(msg) {
    alert(msg);
}

// Fetch and render items
async function loadItems() {
    try {
        const res = await fetch(READ_URL);
        const data = await res.json();
        if (!Array.isArray(data)) {
            itemsList.innerHTML = '<li>No items found</li>';
            return;
        }
        itemsList.innerHTML = '';
        data.forEach(item => {
            const li = document.createElement('li');
            li.className = 'item';
            li.innerHTML = `
                <div class="item-main">
                    <strong>${escapeHtml(item.name)}</strong>
                    <p>${escapeHtml(item.description)}</p>
                </div>
                <div class="item-actions">
                    <button class="btn edit" data-id="${item.id}">Edit</button>
                    <button class="btn delete" data-id="${item.id}">Delete</button>
                </div>
            `;
            itemsList.appendChild(li);
        });
    } catch (err) {
        console.error(err);
        showError('Failed to load items.');
    }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    if (text === null || text === undefined) return '';
    return text
      .toString()
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
}

// Add item
addForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const description = document.getElementById('description').value.trim();
    if (!name || !description) {
        showError('Please provide name and description.');
        return;
    }
    try {
        const res = await fetch(CREATE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, description })
        });
        const data = await res.json();
        if (data.success) {
            addForm.reset();
            loadItems();
        } else {
            showError(data.message || 'Failed to add item.');
        }
    } catch (err) {
        console.error(err);
        showError('Failed to add item.');
    }
});

// Open edit modal
itemsList.addEventListener('click', (e) => {
    if (e.target.classList.contains('edit')) {
        const id = e.target.getAttribute('data-id');
        openEditModal(id);
    } else if (e.target.classList.contains('delete')) {
        const id = e.target.getAttribute('data-id');
        if (confirm('Are you sure you want to delete this item?')) {
            deleteItem(id);
        }
    }
});

function openEditModal(id) {
    // fetch item details from current list (simple approach: request all items and find)
    fetch(READ_URL).then(r => r.json()).then(items => {
        const item = items.find(it => String(it.id) === String(id));
        if (!item) { showError('Item not found'); return; }
        document.getElementById('editId').value = item.id;
        document.getElementById('editName').value = item.name;
        document.getElementById('editDescription').value = item.description;
        editModal.style.display = 'block';
    }).catch(err => {
        console.error(err);
        showError('Failed to open edit modal');
    });
}

// Close modal
closeBtn.addEventListener('click', () => {
    editModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === editModal) {
        editModal.style.display = 'none';
    }
});

// Update item
editForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('editId').value;
    const name = document.getElementById('editName').value.trim();
    const description = document.getElementById('editDescription').value.trim();
    if (!name || !description) { showError('Please provide name and description.'); return; }

    try {
        const res = await fetch(UPDATE_URL, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, name, description })
        });
        const data = await res.json();
        if (data.success) {
            editModal.style.display = 'none';
            loadItems();
        } else {
            showError(data.message || 'Failed to update item.');
        }
    } catch (err) {
        console.error(err);
        showError('Failed to update item.');
    }
});

// Delete
async function deleteItem(id) {
    try {
        const res = await fetch(DELETE_URL, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });
        const data = await res.json();
        if (data.success) {
            loadItems();
        } else {
            showError(data.message || 'Failed to delete item.');
        }
    } catch (err) {
        console.error(err);
        showError('Failed to delete item.');
    }
}

// Initial load
document.addEventListener('DOMContentLoaded', loadItems);
