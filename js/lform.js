
function loginUser(event) {
    if (event) {
        event.preventDefault();
    }

    let email = document.getElementById("email").value.trim().toLowerCase();
    let password = document.getElementById("password").value;

    let selectedRole = document.querySelector('input[name="role"]:checked');

    if (!selectedRole) {
        showToast("Please select your role.");
        return;
    }

    let role = selectedRole.value;

    if (role === "user") {
        let users = JSON.parse(localStorage.getItem("users") || "[]");

        let user = users.find(
            u => u.email.toLowerCase() === email && u.password === password
        );

        if (user) {
            localStorage.setItem("isLoggedIn", "true");

            localStorage.setItem("loggedInUser", JSON.stringify({
                name: user.name,
                email: user.email,
                phone: user.phone
            }));

            localStorage.setItem("username", user.name);
            localStorage.setItem("registeredEmail", user.email);
            localStorage.removeItem("isAdminLoggedIn");

            showToast("Login successful! Welcome to FoodShare 🌱");

            setTimeout(() => {
                window.location.href = "index.html";
            }, 1000);
        } else {
            showToast("Invalid user email or password! ❌");
        }
    }

    if (role === "admin") {
        const adminEmail = "admin@foodshare.com";
        const adminPassword = "admin12345";

        if (email !== adminEmail || password !== adminPassword) {
            showToast("Invalid admin credentials!");
            return;
        }

        localStorage.setItem("isAdminLoggedIn", "true");
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("loggedInUser");

        showToast("Admin login successful! 🛡️");

        setTimeout(() => {
            window.location.href = "admin.html";
        }, 800);
    }
}

function showToast(message) {
    const toast = document.getElementById("toast");
    const toastMessage = document.getElementById("toastMessage");

    if (!toast || !toastMessage) {
        alert(message);
        return;
    }

    toastMessage.innerText = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

document.addEventListener("DOMContentLoaded", function () {
    const roleInputs = document.querySelectorAll('input[name="role"]');

    roleInputs.forEach(function (input) {
        input.addEventListener("change", function () {
            if (this.value === "admin") {
                document.getElementById("email").value = "admin@foodshare.com";
                document.getElementById("password").value = "admin12345";

                loginUser({
                    preventDefault: function () {}
                });
            }
        });
    });
});
