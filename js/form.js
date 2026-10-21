
function registerUser(event) {
    event.preventDefault();

    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim().toLowerCase();
    let phone = document.getElementById("phone").value.trim();
    let password = document.getElementById("password").value;

    if (name === "" || email === "" || phone === "" || password === "") {
        showToast("Please fill all the details.");
        return;
    }

    if (!/^[A-Za-z ]{3,30}$/.test(name)) {
        showToast("Please enter a valid name.");
        return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showToast("Please enter a valid email.");
        return;
    }

    if (!/^[6-9][0-9]{9}$/.test(phone)) {
        showToast("Please enter a valid 10 digit phone number.");
        return;
    }

    if (password.length < 8) {
        showToast("Password must contain at least 8 characters.");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users") || "[]");

    let existingUser = users.find(user => user.email === email);

    if (existingUser) {
        showToast("This email is already registered. Please login.");
        return;
    }

    let newUser = {
        name: name,
        email: email,
        phone: phone,
        password: password
    };

    users.push(newUser);

    localStorage.setItem("users", JSON.stringify(users));

    localStorage.setItem("username", name);
    localStorage.setItem("registeredEmail", email);
    localStorage.setItem("registeredPassword", password);

    showToast("Registration successful!");

    setTimeout(() => {
        window.location.href = "login.html";
    }, 1500);
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
