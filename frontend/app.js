const loginTextBox = document.getElementById("txt_username");
const passwordTextBox = document.getElementById("txt_password");
const foodsContainer = document.getElementById("foodsContainer");

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
        if (data.token) window.localStorage.setItem("token", data.token);
    });
}

async function getStats() {
    if (!window.localStorage.getItem("token")) alert("Prima devi autenticarti!");

    await fetch("http://localhost:5000/api/orders/stats", {
        method: 'GET',
        headers: {
            "token": window.localStorage.getItem("token")
        }
    }).then(response => response.json())
    .then(data => {
        console.log(data);
    });
}