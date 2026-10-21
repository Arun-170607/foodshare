
document.addEventListener("DOMContentLoaded", function () {

    const homeBtn = document.getElementById("homeBtn");
    const aboutBtn = document.getElementById("aboutBtn");

    if (homeBtn) {
        homeBtn.addEventListener("click", function () {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    if (aboutBtn) {
        aboutBtn.addEventListener("click", function () {
            const aboutSection = document.getElementById("about");

            if (aboutSection) {
                aboutSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    }

    const registerButton = document.getElementById("registerButton");
    const logoutButton = document.getElementById("logoutButton");

    const loggedInUser = JSON.parse(
        localStorage.getItem("loggedInUser") || "null"
    );

    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (registerButton && logoutButton) {

        if (loggedInUser && isLoggedIn === "true") {

            registerButton.innerText = "👤 Hi, " + loggedInUser.name;
            registerButton.onclick = null;
            registerButton.removeAttribute("href");

            logoutButton.style.display = "inline-block";

            logoutButton.onclick = function () {
                localStorage.removeItem("isLoggedIn");
                localStorage.removeItem("loggedInUser");
                localStorage.removeItem("username");
                localStorage.removeItem("registeredEmail");

                window.location.reload();
            };

        } else {

            registerButton.innerText = "👤 Register Now";
            logoutButton.style.display = "none";

            registerButton.onclick = function () {
                window.location.href = "register.html";
            };
        }
    }

});
