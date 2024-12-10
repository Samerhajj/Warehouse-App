const apiBase = '/api/items';

// Fetch and display items
async function fetchItems() {
    try {
        const response = await fetch(`${apiBase}/all`); // Use /all for GET request
        if (!response.ok) throw new Error('Failed to fetch items');

        const items = await response.json();
        const tableBody = document.querySelector('#itemsTable tbody');
        tableBody.innerHTML = ''; // Clear existing rows
        items.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>${item.category}</td>
                <td class="actions">
                    <button onclick="updateItem('${item._id}')">Update</button>
                    <button onclick="deleteItem('${item.name}')">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching items:', error);
    }
}

// Add new item
document.querySelector('#addItemForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = document.querySelector('#itemName').value;
    const quantity = document.querySelector('#itemQuantity').value;
    const category= document.querySelector('#itemCategory').value

    try {
        const response = await fetch(`${apiBase}/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, quantity ,category}),
        });
        console.log(response.body);

        if (!response.ok) throw new Error('Failed to add item');
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

// Update item
async function updateItem(id) {
    const quantity = prompt('Enter new quantity:');
    if (quantity) {
        try {
            const response = await fetch(`${apiBase}/update/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ quantity }),
            });
            if (!response.ok) throw new Error('Failed to update item');
            fetchItems(); // Refresh the list after update
        } catch (error) {
            console.error('Error updating item:', error);
        }
    }
}

// Initial fetch of items
document.addEventListener('DOMContentLoaded', fetchItems);
