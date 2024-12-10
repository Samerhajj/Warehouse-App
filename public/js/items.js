const apiBase = '/api/items';

// Fetch and display items
async function fetchItems() {
  try {
    const response = await fetch(`${apiBase}/all`);
    if (!response.ok) throw new Error('Failed to fetch items');

    const items = await response.json();
    const tableBody = document.querySelector('#itemsTable tbody');
    tableBody.innerHTML = ''; // Clear existing rows

    items.forEach(item => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><input type="checkbox" class="itemCheckbox" data-id="${item._id}" /></td>
        <td>${item.name}</td>
        <td>${item.size}</td>
        <td>${item.quantity}</td>
        <td><input type="number" class="quantityChange" data-id="${item._id}" /></td>
      `;
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error('Error fetching items:', error);
  }
}


// Example of using Toastify for a success message
function showToast(message, type = 'success') {
    Toastify({
        text: message,
        duration: 3000, // Duration in milliseconds
        close: true,
        gravity: "top", // Position of the toast
        position: "right", // Right or left side
        backgroundColor: type === 'success' ? "green" : "red", // Color based on success or error
        stopOnFocus: true // Stop the toast when focused
    }).showToast();
}

// Search function to filter items based on the search query
function searchItems() {
  const searchInput = document.getElementById('searchInput').value.toLowerCase();
  const itemsTable = document.getElementById('itemsTable').getElementsByTagName('tbody')[0];
  const rows = itemsTable.getElementsByTagName('tr');

  Array.from(rows).forEach(row => {
    const nameCell = row.cells[1].textContent.toLowerCase();
    const sizeCell = row.cells[2].textContent.toLowerCase();
    const quantityCell = row.cells[3].textContent.toLowerCase();

    if (nameCell.includes(searchInput) || sizeCell.includes(searchInput) || quantityCell.includes(searchInput)) {
      row.style.display = ''; // Show row
    } else {
      row.style.display = 'none'; // Hide row
    }
  });
}

// Add new item
document.querySelector('#addItemForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const name = document.querySelector('#itemName').value;
  const size = document.querySelector('#itemSize').value;
  const quantity = document.querySelector('#itemQuantity').value;
  const category = document.querySelector('#itemCategory').value;

  try {
    const response = await fetch(`${apiBase}/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, size, quantity, category }),
    });

    if (!response.ok) throw new Error('Failed to add item');
    const data = await response.json();
    console.log('Add response:', data);
    showToast("Added new item",'success');
    fetchItems(); // Refresh the list
    document.querySelector('#addItemForm').reset(); // Clear form inputs
  } catch (error) {
    console.error('Error adding item:', error);
  }
});

// Delete item
async function deleteItem(name) {
  try {
    const response = await fetch(`${apiBase}/remove/${name}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Failed to delete item');
    fetchItems(); // Refresh the list after deletion
  } catch (error) {
    console.error('Error deleting item:', error);
  }
}

// Update item quantity
async function updateItem(id) {
  const change = parseInt(prompt('Enter the change in quantity (e.g., -10 to withdraw, 20 to add):'), 10);
  if (isNaN(change)) {
    showToast('Invalid input. Please enter a numeric value.','error');
    return;
  }

  try {
    const response = await fetch(`${apiBase}/update/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ change }),
    });

    if (!response.ok) throw new Error('Failed to update item');
    fetchItems(); // Refresh the list after update
    showToast('Item updated successfully!','success');
  } catch (error) {
    console.error('Error updating item:', error);
    showToast('Failed to update item.','error');
  }
}

// Bulk update form submission handler
document.querySelector('#bulkUpdateForm').addEventListener('submit', async (event) => {
  event.preventDefault();

//   const change = parseInt(document.querySelector('#bulkQuantityChange').value, 10);
//   if (isNaN(change)) {
//     alert('Please enter a valid quantity change.');
//     return;
//   }

  const selectedItems = []; 
  const checkboxes = document.querySelectorAll('.itemCheckbox:checked');

  checkboxes.forEach(checkbox => {
    const itemId = checkbox.getAttribute('data-id');
    const quantityChangeInput = document.querySelector(`.quantityChange[data-id="${itemId}"]`);
    const itemChange = parseInt(quantityChangeInput.value, 10);

    if (!isNaN(itemChange)) {
      selectedItems.push({
        id: itemId,
        change: itemChange
      });
    }
  });

  if (selectedItems.length === 0) {
    showToast('Please select at least one item to update.', 'error');
    return;
  }

  try {
    const response = await fetch(`${apiBase}/bulk-update`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(selectedItems),
    });

    if (!response.ok) throw new Error('Bulk update failed');
    showToast('Bulk update successful!');
    fetchItems(); // Refresh the list of items
  } catch (error) {
    console.error('Error during bulk update:', error);
    showToast('Failed to update items.', 'error');
  }
});

// Initial fetch of items
document.addEventListener('DOMContentLoaded', fetchItems);
