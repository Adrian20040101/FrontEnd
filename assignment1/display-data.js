import getOlympicData from './olympic_data.js';

const table = document.getElementById('table-layout').getElementsByTagName('tbody')[0];
const data = getOlympicData();
const thead = document.createElement('thead');
const headerRow = document.createElement('tr');

// store the headers (keys) from the first object since they are the same everywhere
const headers = Object.keys(data[0]);
headers.forEach(header => {
    const th = document.createElement('th');
    th.textContent = header;
    headerRow.appendChild(th);
});

thead.appendChild(headerRow);
table.appendChild(thead);

const tbody = document.createElement('tbody');

data.forEach(item => {
    const row = document.createElement('tr');

    headers.forEach(header => {
        const cell = document.createElement('td');
        cell.textContent = item[header];
        row.appendChild(cell);
    });

    tbody.appendChild(row);
});

table.appendChild(tbody);