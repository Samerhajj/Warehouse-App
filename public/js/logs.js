
const apiBase = '/api/logs';

async function fetchLogs() {
    try {
        const response = await fetch(`${apiBase}/all`);
        if (!response.ok) throw new Error('Failed to fetch logs');

        const logs = await response.json();
        const tableBody = document.querySelector('#logsTable tbody');
        tableBody.innerHTML = ''; // Clear existing rows

        logs.forEach(log => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${new Date(log.timestamp).toLocaleString()}</td>
                <td>${log.action}</td>
                <td>${log.message}</td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching logs:', error);
    }
}

// Fetch logs when the page loads
document.addEventListener('DOMContentLoaded', fetchLogs);
