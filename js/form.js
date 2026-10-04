function registerUser(event) {


event.preventDefault();

let name = document.getElementById("name").value.trim();
let email = document.getElementById("email").value.trim();
let phone = document.getElementById("phone").value.trim();
let password = document.getElementById("password").value;

if (name === "" || email === "" || phone === "" || password === "") {
    alert("Please fill all the details.");
    return;
}

if (!/^[A-Za-z ]{3,30}$/.test(name)) {
    alert("Please enter a valid name.");
    return;
}

if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    alert("Please enter a valid email.");
    return;
}

if (!/^[6-9][0-9]{9}$/.test(phone)) {
    alert("Please enter a valid 10 digit phone number.");
    return;
}

if (password.length < 8) {
    alert("Password must contain at least 8 characters.");
    return;
}


sessionStorage.setItem("username", name);
sessionStorage.setItem("registeredEmail", email);
sessionStorage.setItem("registeredPassword", password);


showToast("Registration successful! 🎉");


setTimeout(() => {
    window.location.href = "login.html";
}, 1500);


}
document.addEventListener("DOMContentLoaded", function () {

    const username = sessionStorage.getItem("username");
    const isLoggedIn = sessionStorage.getItem("isLoggedIn");

    const registerButton =
        document.getElementById("registerButton");


    if (username && isLoggedIn === "true") {

        registerButton.innerText =
            "Hi, " + username;

    }

});


function showToast(message) {


const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toastMessage");

toastMessage.innerText = message;

toast.classList.add("show");

setTimeout(() => {
    toast.classList.remove("show");
}, 3000);


}
