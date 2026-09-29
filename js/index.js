let username = sessionStorage.getItem("username");
let isLoggedIn = sessionStorage.getItem("isLoggedIn");

if (username && isLoggedIn === "true") {
    document.getElementById("registerButton").innerText = "Hi, " + username;
}



function goToAbout() {

    const aboutSection = document.getElementById("about");

    if (aboutSection) {
        aboutSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}



function goToContact() {

    const contactSection = document.getElementById("contact");

    if (contactSection) {
        contactSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}