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
            alert("Login effettuato con successo");
        } else alert("Credenziali non valide!");
    });
}

function logout() {
    if (window.localStorage.getItem("token")) {
        window.localStorage.removeItem("token");
        deleteChilds(ordersTable.children[1]);
        alert("Disconnesso");
    } else {
        alert("Non sei autenticato!");
    }
}

function deleteChilds(parent) {
    first = parent.firstChild;
    while (first) {
        parent.removeChild(first);
        first = parent.firstChild;
    }
}

async function getStats() {
    if (!window.localStorage.getItem("token")) return alert("Prima devi autenticarti!");

    
    let d = await fetch("http://localhost:5000/api/orders/stats", {
        method: 'GET',
        headers: {
            "token": "Bearer " + window.localStorage.getItem("token")
        }
    }).then(response => response.json())
    .then(data => {
        let dataFormatted = [];
        for (let j = 0; j < 6; j++) {
            dataFormatted.push(0);
        }
        
        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < 6; j++) {
                dataFormatted[j] += data[i][1][j][1];
            }
        }
        
        return dataFormatted;
    });

    return d;
}