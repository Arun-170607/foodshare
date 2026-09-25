function goToAbout() {

    const about = document.getElementById("about");

    window.scrollTo({
        top: about.offsetTop - 60,
        behavior: "smooth"
    });

}