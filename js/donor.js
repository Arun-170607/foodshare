document.addEventListener("DOMContentLoaded", function () {


    const donorForm =
        document.getElementById("donorForm");


    const donorType =
        document.getElementById("donorType");


    const businessName =
        document.getElementById("businessName");


    const verifyBtn =
        document.getElementById("verifyBtn");


    const verifyStatus =
        document.getElementById("verifyStatus");


    const pickupLocation =
        document.getElementById("pickupLocation");


    const locationStatus =
        document.getElementById("locationStatus");


    const liveLocationBtn =
        document.getElementById("liveLocationBtn");


    const liveLocationTextBtn =
        document.getElementById("liveLocationTextBtn");



    /* =================================
       VERIFY BUSINESS
    ================================= */

    verifyBtn.addEventListener("click", function () {

        const name =
            businessName.value.trim();


        if (name === "") {

            verifyStatus.innerText =
                "Please enter hotel / restaurant name.";

            verifyStatus.className =
                "verify-status error";

            return;
        }


        verifyStatus.innerText =
            "Checking business location...";

        verifyStatus.className =
            "verify-status waiting";


        /*
            Temporary demo verification.

            Later this part can be replaced
            with Google Places API + Flask backend.
        */

        setTimeout(function () {


            /*
                Demo Tamil Nadu address.
            */

            const address =
                name +
                ", Anna Nagar, Madurai, Tamil Nadu";


            pickupLocation.value =
                address;


            verifyStatus.innerText =
                "✓ Business verified - Tamil Nadu location found.";

            verifyStatus.className =
                "verify-status success";


            locationStatus.innerText =
                "✓ Pickup location added automatically.";

            locationStatus.className =
                "location-status success";


        }, 800);

    });



    /* =================================
       LIVE LOCATION
    ================================= */

    function getLiveLocation() {


        if (!navigator.geolocation) {

            locationStatus.innerText =
                "Location is not supported by this browser.";

            locationStatus.className =
                "location-status error";

            return;
        }


        locationStatus.innerText =
            "Getting your live location...";

        locationStatus.className =
            "location-status";



        navigator.geolocation.getCurrentPosition(

            function (position) {


                const latitude =
                    position.coords.latitude;


                const longitude =
                    position.coords.longitude;



                /*
                    Demo address.

                    Browser gives coordinates.
                    For a real address, reverse geocoding
                    API is required.
                */

                pickupLocation.value =
                    "Current location - Tamil Nadu";


                locationStatus.innerText =
                    "✓ Live location captured successfully.";

                locationStatus.className =
                    "location-status success";


                console.log("Latitude:", latitude);

                console.log("Longitude:", longitude);


            },


            function () {


                locationStatus.innerText =
                    "Please allow location access.";

                locationStatus.className =
                    "location-status error";

            }

        );

    }



    /* =================================
       LIVE LOCATION BUTTONS
    ================================= */

    liveLocationBtn.addEventListener(
        "click",
        getLiveLocation
    );


    liveLocationTextBtn.addEventListener(
        "click",
        getLiveLocation
    );



    /* =================================
       DONOR TYPE CHANGE
    ================================= */

    donorType.addEventListener("change", function () {


        if (
            donorType.value === "Hotel" ||
            donorType.value === "Restaurant"
        ) {

            businessName.placeholder =
                "Enter hotel / restaurant name";

        }


        else if (donorType.value === "Bakery") {

            businessName.placeholder =
                "Enter bakery name";

        }


        else if (donorType.value === "Event Organizer") {

            businessName.placeholder =
                "Enter organization name";

        }


        else if (donorType.value === "Individual") {

            businessName.placeholder =
                "Enter your name";

        }


        else {

            businessName.placeholder =
                "Enter business name";

        }

    });



    /* =================================
       FORM SUBMIT
    ================================= */

    donorForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

        showToast(
                        "Surplus food donation submitted successfully!",
                    "success"
                );


            donorForm.reset();


            pickupLocation.value = "";

            verifyStatus.innerText = "";

            locationStatus.innerText = "";

        }
    );

});
function showToast(message, type = "success") {

    const toast =
        document.getElementById("toast");

    const toastMessage =
        document.getElementById("toastMessage");

    const toastIcon =
        document.getElementById("toastIcon");


    toastMessage.innerText = message;


    if (type === "success") {

        toast.style.background = "#198754";

        toastIcon.className =
            "bi bi-check-circle-fill";

    }

    else if (type === "error") {

        toast.style.background = "#dc3545";

        toastIcon.className =
            "bi bi-x-circle-fill";

    }

    else if (type === "warning") {

        toast.style.background = "#e08b00";

        toastIcon.className =
            "bi bi-exclamation-circle-fill";

    }


    toast.classList.add("show");


    setTimeout(function () {

        toast.classList.remove("show");

    }, 3000);
}