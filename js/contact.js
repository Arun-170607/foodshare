document.addEventListener("DOMContentLoaded", function () {

    const contactBtn = document.getElementById("contactBtn");
    const contactSection = document.getElementById("contact");

    if (contactBtn && contactSection) {

        contactBtn.addEventListener("click", function () {

            contactSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        });

    }

});