document.addEventListener("DOMContentLoaded", function () {

    const aboutBtn = document.getElementById("aboutBtn");
    const contactBtn = document.getElementById("contactBtn");

    const aboutSection = document.getElementById("about");
    const contactSection = document.getElementById("contact");


    if (aboutBtn && aboutSection) {
        aboutBtn.addEventListener("click", function () {

            aboutSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        });
    }


    if (contactBtn && contactSection) {
        contactBtn.addEventListener("click", function () {

            contactSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        });
    }
    document.getElementById("donateBtn").addEventListener("click", function () {
    window.location.href = "donor.html";
});

});