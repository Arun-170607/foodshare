function loginUser(event) {


event.preventDefault();

let email = document.getElementById("email").value.trim();
let password = document.getElementById("password").value;

let registeredEmail = sessionStorage.getItem("registeredEmail");
let registeredPassword = sessionStorage.getItem("registeredPassword");

if (email === registeredEmail && password === registeredPassword) {

    sessionStorage.setItem("isLoggedIn", "true");

    // Show success toast
    showToast("Login successful! Welcome to FoodShare 🌱");

    
    setTimeout(() => {
        window.location.href = "index.html";
    }, 1500);

} else {

    showToast("Invalid email or password! ❌");

}


}


function showToast(message) {


const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toastMessage");

toastMessage.innerText = message;

toast.classList.add("show");

setTimeout(() => {
    toast.classList.remove("show");
}, 3000);


}
