document.addEventListener("DOMContentLoaded", function () {

    // Contact button scroll
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


function sendMessage(event) {

    event.preventDefault();

    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let subject = document.getElementById("subject").value.trim();
    let message = document.getElementById("message").value.trim();


    // WhatsApp message
    let whatsappMessage =
        "Hello FoodShare,%0A%0A" +
        "Name: " + encodeURIComponent(name) + "%0A" +
        "Email: " + encodeURIComponent(email) + "%0A" +
        "Subject: " + encodeURIComponent(subject) + "%0A" +
        "Message: " + encodeURIComponent(message);


    let whatsappNumber = "917010348745";

    let whatsappURL =
        "https://wa.me/" +
        whatsappNumber +
        "?text=" +
        whatsappMessage;


    // Email message
    let emailBody =
        "Name: " + name + "\n" +
        "Email: " + email + "\n\n" +
        "Message:\n" + message;

    let emailURL =
        "mailto:foodshare@gmail.com" +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(emailBody);


    // Open WhatsApp
    window.open(whatsappURL, "_blank");

    // Open Email
    window.location.href = emailURL;
    event.target.reset();
}