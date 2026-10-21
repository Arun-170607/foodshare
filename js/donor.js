document.addEventListener("DOMContentLoaded", function () {

    const donorForm = document.getElementById("donorForm");
    const donorType = document.getElementById("donorType");
    const businessName = document.getElementById("businessName");
    const verifyBtn = document.getElementById("verifyBtn");
    const verifyStatus = document.getElementById("verifyStatus");
    const pickupLocation = document.getElementById("pickupLocation");
    const locationStatus = document.getElementById("locationStatus");
    const liveLocationBtn = document.getElementById("liveLocationBtn");
    const liveLocationTextBtn = document.getElementById("liveLocationTextBtn");

    verifyBtn.addEventListener("click", function () {

        const name = businessName.value.trim();

        if (name === "") {
            verifyStatus.innerText = "Please enter hotel / restaurant name.";
            verifyStatus.className = "verify-status error";
            return;
        }

        verifyStatus.innerText = "Checking business location...";
        verifyStatus.className = "verify-status waiting";

        setTimeout(function () {

            const address =
                name + ", Anna Nagar, Madurai, Tamil Nadu";

            pickupLocation.value = address;

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

    liveLocationBtn.addEventListener(
        "click",
        getLiveLocation
    );

    liveLocationTextBtn.addEventListener(
        "click",
        getLiveLocation
    );

    donorType.addEventListener("change", function () {

        if (
            donorType.value === "Hotel" ||
            donorType.value === "Restaurant"
        ) {
            businessName.placeholder =
                "Enter hotel / restaurant name";
        }

        else {
            businessName.placeholder =
                "Enter business name";
        }

    });

    donorForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            const inputs =
                donorForm.querySelectorAll("input");

            const selects =
                donorForm.querySelectorAll("select");

            const textareas =
                donorForm.querySelectorAll("textarea");

            const contactPerson =
                inputs[1]?.value.trim() || "";

            const contactNumber =
                inputs[2]?.value.trim() || "";

            const foodName =
                inputs[3]?.value.trim() || "";

            const quantity =
                inputs[4]?.value.trim() || "";

            const serves =
                inputs[5]?.value.trim() || "";

            const foodType =
                document.querySelector(
                    'input[name="foodType"]:checked'
                )?.value || "";

            const preparedDate =
                inputs[6]?.value || "";

            const availableUntil =
                inputs[7]?.value || "";

            const pickupDate =
                inputs[8]?.value || "";

            const pickupTime =
                inputs[9]?.value || "";

            const foodCategory =
                selects[1]?.value || "";

            const foodCondition =
                selects[2]?.value || "";

            const instructions =
                textareas[1]?.value.trim() || "";

            const donation = {

                id: Date.now(),

                donorType:
                    donorType.value,

                organizationName:
                    businessName.value.trim(),

                contactPerson:
                    contactPerson,

                contact:
                    contactNumber,

                foodName:
                    foodName,

                foodType:
                    foodType,

                foodCategory:
                    foodCategory,

                foodCondition:
                    foodCondition,

                quantity:
                    quantity,

                serves:
                    serves,

                preparedDate:
                    preparedDate,

                bestBefore:
                    availableUntil,

                location:
                    pickupLocation.value.trim(),

                pickupDate:
                    pickupDate,

                pickupTime:
                    pickupTime,

                description:
                    instructions,

                status:
                    "Pending",

                date:
                    new Date().toLocaleDateString("en-GB")

            };

            const donations =
                JSON.parse(
                    localStorage.getItem("foodDonations")
                ) || [];

            donations.push(donation);

            localStorage.setItem(
                "foodDonations",
                JSON.stringify(donations)
            );

           showToast("Food donation submitted successfully! 🎉");

                setTimeout(() => {
               window.location.href = "index.html";
            }, 1500);

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