const loginTextBox = document.getElementById("txt_username");
const passwordTextBox = document.getElementById("txt_password");
const foodsContainer = document.getElementById("foodsContainer");
const ordersTable = document.getElementById("orders");

async function login () {
    await fetch("http://localhost:5000/api/auth/login", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: loginTextBox.value,
            password: passwordTextBox.value
        })
    }).then(response => response.json())
    .then(data => {
        if (data.token) {
            window.localStorage.setItem("token", data.token);
            alert("OK");
        } else alert("Invalid credential!");
    });
}

function logout() {
    if (window.localStorage.getItem("token")) {
        window.localStorage.removeItem("token");
        alert("Disconnesso");
    } else {
        alert("Non sei autenticato!");
    }
}

async function getStats() {
    if (!window.localStorage.getItem("token")) alert("Prima devi autenticarti!");

    await fetch("http://localhost:5000/api/orders/stats", {
        method: 'GET',
        headers: {
            "token": "Bearer " + window.localStorage.getItem("token")
        }
    }).then(response => response.json())
    .then(data => {
        var stats = [];

        for (let i = 0; i < data[0].length; i++) {
            stats.push([data[0][i][0], [0, 0, 0, 0, 0, 0]]);
        }
        
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < data[i].length; j++)
            stats[j][1][i] += data[i][j][1];
        }
        
        for (let i = 0; i < stats.length; i++) {
            const row = document.createElement("tr");

            const cellFood = document.createElement("td");
            cellFood.innerHTML = stats[i][0];
            row.appendChild(cellFood);

            for (let j = 0; j < stats[i][1].length; j++) {
                const cell = document.createElement("td");
                cell.innerHTML = stats[i][1][j];
                row.appendChild(cell);
            }

            ordersTable.appendChild(row);
        }
    });
}