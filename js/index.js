let username = sessionStorage.getItem("username");
let isLoggedIn = sessionStorage.getItem("isLoggedIn");

if (username && isLoggedIn === "true") {
    document.getElementById("registerButton").innerText = "Hi, " + username;
}

function goToAbout() {
    const aboutSection = document.getElementById("about");

function goToContact() {
    document.getElementById("contact").scrollIntoView({
        behavior: "smooth"
    });
}


    if (aboutSection) {
        window.scrollTo({
            top: aboutSection.offsetTop - 0,
            behavior: "smooth"
        });
    }
}