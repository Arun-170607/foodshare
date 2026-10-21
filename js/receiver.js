
document.addEventListener("DOMContentLoaded", function () {
    const foodList = document.getElementById("foodList");
    const emptyMessage = document.getElementById("emptyMessage");
    const homeBtn = document.getElementById("homeBtn");

    if (homeBtn) {
        homeBtn.addEventListener("click", function () {
            window.location.href = "index.html";
        });
    }

    if (!foodList) return;

    const requestSection = document.createElement("section");
    requestSection.id = "myRequestsSection";
    requestSection.className = "my-requests-section";
    requestSection.innerHTML = `
        <h2>My Food Requests</h2>
        <p>Track the status of your food requests here.</p>
        <div id="myRequestsList"></div>
    `;

    foodList.insertAdjacentElement("afterend", requestSection);

    loadApprovedFood();
    loadMyRequests();

    function loadApprovedFood() {
        const donations = JSON.parse(
            localStorage.getItem("foodDonations") || "[]"
        );

        const approvedDonations = donations.filter(
            donation => donation.status === "Approved"
        );

        foodList.innerHTML = "";

        if (approvedDonations.length === 0) {
            if (emptyMessage) {
                emptyMessage.style.display = "block";
            }
            return;
        }

        if (emptyMessage) {
            emptyMessage.style.display = "none";
        }

        approvedDonations.forEach(function (donation) {
            const donationIndex = donations.indexOf(donation);
            const card = document.createElement("div");

            card.className = "food-card";

            card.innerHTML = `
                <h3>${donation.foodName || "Food Donation"}</h3>
                <div class="food-detail">
                    <span>Food Type</span>
                    <span>${donation.foodType || "-"}</span>
                </div>
                <div class="food-detail">
                    <span>Category</span>
                    <span>${donation.foodCategory || "-"}</span>
                </div>
                <div class="food-detail">
                    <span>Quantity</span>
                    <span>${donation.quantity || "-"}</span>
                </div>
                <div class="food-detail">
                    <span>Serves</span>
                    <span>${donation.serves || "-"}</span>
                </div>
                <div class="food-detail">
                    <span>Location</span>
                    <span>${donation.location || "-"}</span>
                </div>
                <div class="food-detail">
                    <span>Best Before</span>
                    <span>${donation.bestBefore || "-"}</span>
                </div>
                <button class="request-btn" data-index="${donationIndex}">
                    <i class="bi bi-hand-index-thumb"></i>
                    Request Food
                </button>
            `;

            card.querySelector(".request-btn").addEventListener(
                "click",
                function () {
                    requestFood(Number(this.dataset.index));
                }
            );

            foodList.appendChild(card);
        });
    }

    function loadMyRequests() {
        const requestsList = document.getElementById("myRequestsList");
        if (!requestsList) return;

        const requests = JSON.parse(
            localStorage.getItem("foodRequests") || "[]"
        );

        const currentUser = getCurrentUser();

        requestsList.innerHTML = "";

        if (!currentUser) {
            requestsList.innerHTML = `
                <p class="no-requests">
                    Please log in to view your food requests.
                </p>
            `;
            return;
        }

        const myRequests = requests.filter(function (request) {
            if (
                currentUser.email &&
                request.requesterEmail
            ) {
                return (
                    request.requesterEmail.toLowerCase() ===
                    currentUser.email.toLowerCase()
                );
            }

            return (
                !request.requesterEmail &&
                currentUser.name &&
                request.requesterName &&
                request.requesterName.toLowerCase() ===
                currentUser.name.toLowerCase()
            );
        });

        if (myRequests.length === 0) {
            requestsList.innerHTML = `
                <p class="no-requests">
                    You have not submitted any food requests yet.
                </p>
            `;
            return;
        }

        myRequests.slice().reverse().forEach(function (request) {
            const card = document.createElement("div");
            const status = request.status || "Pending";

            card.className = "my-request-card";

            card.innerHTML = `
                <h3>${request.foodName || "Food Request"}</h3>
                <p><strong>Food Type:</strong> ${request.foodType || "-"}</p>
                <p><strong>Quantity:</strong> ${request.quantity || "-"}</p>
                <p><strong>Location:</strong> ${request.location || "-"}</p>
                <p><strong>Request Date:</strong> ${request.date || "-"}</p>
                <p>
                    <strong>Status:</strong>
                    <span class="request-status">
                        ${status}
                    </span>
                </p>
            `;

            requestsList.appendChild(card);
        });
    }

    window.addEventListener("storage", function (event) {
        if (
            event.key === "foodRequests" ||
            event.key === "foodDonations" ||
            event.key === "isLoggedIn" ||
            event.key === "loggedInUser"
        ) {
            loadApprovedFood();
            loadMyRequests();
        }
    });

    window.addEventListener("focus", function () {
        loadApprovedFood();
        loadMyRequests();
    });

    window.refreshMyFoodRequests = loadMyRequests;
});

function getCurrentUser() {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    if (!isLoggedIn) {
        return null;
    }

    let loggedInUser = null;

    try {
        loggedInUser = JSON.parse(
            localStorage.getItem("loggedInUser") || "null"
        );
    } catch (error) {
        loggedInUser = null;
    }

    const email =
        loggedInUser?.email ||
        localStorage.getItem("registeredEmail") ||
        "";

    const name =
        loggedInUser?.name ||
        localStorage.getItem("username") ||
        "";

    if (!email && !name) {
        return null;
    }

    return { name, email };
}

function requestFood(index) {
    const donations = JSON.parse(
        localStorage.getItem("foodDonations") || "[]"
    );

    if (!donations[index]) {
        showToast("Food donation not found.");
        return;
    }

    const currentUser = getCurrentUser();

    if (!currentUser) {
        showToast("Please log in before requesting food.");
        return;
    }

    const donation = donations[index];

    if (donation.status !== "Approved") {
        showToast("This food is not available for requests.");
        return;
    }

    const requests = JSON.parse(
        localStorage.getItem("foodRequests") || "[]"
    );

    const requesterEmail = currentUser.email;
    const requesterName = currentUser.name;

    const donationKey = String(
        donation.id || index
    );

    const alreadyRequested = requests.some(function (request) {
        const existingDonationKey = String(
            request.donationId || ""
        );

        const sameUser = requesterEmail
            ? (request.requesterEmail || "").toLowerCase() ===
              requesterEmail.toLowerCase()
            : (request.requesterName || "").toLowerCase() ===
              requesterName.toLowerCase();

        return existingDonationKey === donationKey && sameUser;
    });

    if (alreadyRequested) {
        showToast("You have already requested this food.");
        return;
    }

    const request = {
        id: Date.now(),
        donationId: donationKey,
        foodName: donation.foodName || "Food Donation",
        foodType: donation.foodType || "-",
        quantity: donation.quantity || "-",
        location: donation.location || "-",
        donorName: donation.organizationName || donation.donorName || "-",
        requesterName: requesterName,
        requesterEmail: requesterEmail,
        status: "Pending",
        date: new Date().toLocaleDateString("en-GB")
    };

    requests.push(request);

    localStorage.setItem(
        "foodRequests",
        JSON.stringify(requests)
    );

    showToast("Food request submitted successfully!");

    if (window.refreshMyFoodRequests) {
        window.refreshMyFoodRequests();
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

    setTimeout(function () {
        toast.classList.remove("show");
    }, 3000);
}

document.addEventListener("DOMContentLoaded", function () {
    const foodList = document.getElementById("foodList");
    const emptyMessage = document.getElementById("emptyMessage");
    const homeBtn = document.getElementById("homeBtn");

    if (homeBtn) {
        homeBtn.addEventListener("click", function () {
            window.location.href = "index.html";
        });
    }

    if (!foodList) return;

    const requestSection = document.createElement("section");
    requestSection.id = "myRequestsSection";
    requestSection.className = "my-requests-section";
    requestSection.innerHTML = `
        <h2>My Food Requests</h2>
        <p>Track the status of your food requests here.</p>
        <div id="myRequestsList"></div>
    `;

    foodList.insertAdjacentElement("afterend", requestSection);

    loadApprovedFood();
    loadMyRequests();

    function loadApprovedFood() {
        const donations = JSON.parse(
            localStorage.getItem("foodDonations") || "[]"
        );

        const approvedDonations = donations.filter(
            donation => donation.status === "Approved"
        );

        foodList.innerHTML = "";

        if (approvedDonations.length === 0) {
            if (emptyMessage) {
                emptyMessage.style.display = "block";
            }
            return;
        }

        if (emptyMessage) {
            emptyMessage.style.display = "none";
        }

        approvedDonations.forEach(function (donation) {
            const donationIndex = donations.indexOf(donation);
            const card = document.createElement("div");

            card.className = "food-card";

            card.innerHTML = `
                <h3>${donation.foodName || "Food Donation"}</h3>
                <div class="food-detail">
                    <span>Food Type</span>
                    <span>${donation.foodType || "-"}</span>
                </div>
                <div class="food-detail">
                    <span>Category</span>
                    <span>${donation.foodCategory || "-"}</span>
                </div>
                <div class="food-detail">
                    <span>Quantity</span>
                    <span>${donation.quantity || "-"}</span>
                </div>
                <div class="food-detail">
                    <span>Serves</span>
                    <span>${donation.serves || "-"}</span>
                </div>
                <div class="food-detail">
                    <span>Location</span>
                    <span>${donation.location || "-"}</span>
                </div>
                <div class="food-detail">
                    <span>Best Before</span>
                    <span>${donation.bestBefore || "-"}</span>
                </div>
                <button class="request-btn" data-index="${donationIndex}">
                    <i class="bi bi-hand-index-thumb"></i>
                    Request Food
                </button>
            `;

            card.querySelector(".request-btn").addEventListener(
                "click",
                function () {
                    requestFood(Number(this.dataset.index));
                }
            );

            foodList.appendChild(card);
        });
    }

    function loadMyRequests() {
        const requestsList = document.getElementById("myRequestsList");
        if (!requestsList) return;

        const requests = JSON.parse(
            localStorage.getItem("foodRequests") || "[]"
        );

        const currentUser = getCurrentUser();

        requestsList.innerHTML = "";

        if (!currentUser) {
            requestsList.innerHTML = `
                <p class="no-requests">
                    Please log in to view your food requests.
                </p>
            `;
            return;
        }

        const myRequests = requests.filter(function (request) {
            if (
                currentUser.email &&
                request.requesterEmail
            ) {
                return (
                    request.requesterEmail.toLowerCase() ===
                    currentUser.email.toLowerCase()
                );
            }

            return (
                !request.requesterEmail &&
                currentUser.name &&
                request.requesterName &&
                request.requesterName.toLowerCase() ===
                currentUser.name.toLowerCase()
            );
        });

        if (myRequests.length === 0) {
            requestsList.innerHTML = `
                <p class="no-requests">
                    You have not submitted any food requests yet.
                </p>
            `;
            return;
        }

        myRequests.slice().reverse().forEach(function (request) {
            const card = document.createElement("div");
            const status = request.status || "Pending";

            card.className = "my-request-card";

            card.innerHTML = `
                <h3>${request.foodName || "Food Request"}</h3>
                <p><strong>Food Type:</strong> ${request.foodType || "-"}</p>
                <p><strong>Quantity:</strong> ${request.quantity || "-"}</p>
                <p><strong>Location:</strong> ${request.location || "-"}</p>
                <p><strong>Request Date:</strong> ${request.date || "-"}</p>
                <p>
                    <strong>Status:</strong>
                    <span class="request-status">
                        ${status}
                    </span>
                </p>
            `;

            requestsList.appendChild(card);
        });
    }

    window.addEventListener("storage", function (event) {
        if (
            event.key === "foodRequests" ||
            event.key === "foodDonations" ||
            event.key === "isLoggedIn" ||
            event.key === "loggedInUser"
        ) {
            loadApprovedFood();
            loadMyRequests();
        }
    });

    window.addEventListener("focus", function () {
        loadApprovedFood();
        loadMyRequests();
    });

    window.refreshMyFoodRequests = loadMyRequests;
});

function getCurrentUser() {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    if (!isLoggedIn) {
        return null;
    }

    let loggedInUser = null;

    try {
        loggedInUser = JSON.parse(
            localStorage.getItem("loggedInUser") || "null"
        );
    } catch (error) {
        loggedInUser = null;
    }

    const email =
        loggedInUser?.email ||
        localStorage.getItem("registeredEmail") ||
        "";

    const name =
        loggedInUser?.name ||
        localStorage.getItem("username") ||
        "";

    if (!email && !name) {
        return null;
    }

    return { name, email };
}

function requestFood(index) {
    const donations = JSON.parse(
        localStorage.getItem("foodDonations") || "[]"
    );

    if (!donations[index]) {
        showToast("Food donation not found.");
        return;
    }

    const currentUser = getCurrentUser();

    if (!currentUser) {
        showToast("Please log in before requesting food.");
        return;
    }

    const donation = donations[index];

    if (donation.status !== "Approved") {
        showToast("This food is not available for requests.");
        return;
    }

    const requests = JSON.parse(
        localStorage.getItem("foodRequests") || "[]"
    );

    const requesterEmail = currentUser.email;
    const requesterName = currentUser.name;

    const donationKey = String(
        donation.id || index
    );

    const alreadyRequested = requests.some(function (request) {
        const existingDonationKey = String(
            request.donationId || ""
        );

        const sameUser = requesterEmail
            ? (request.requesterEmail || "").toLowerCase() ===
              requesterEmail.toLowerCase()
            : (request.requesterName || "").toLowerCase() ===
              requesterName.toLowerCase();

        return existingDonationKey === donationKey && sameUser;
    });

    if (alreadyRequested) {
        showToast("You have already requested this food.");
        return;
    }

    const request = {
        id: Date.now(),
        donationId: donationKey,
        foodName: donation.foodName || "Food Donation",
        foodType: donation.foodType || "-",
        quantity: donation.quantity || "-",
        location: donation.location || "-",
        donorName: donation.organizationName || donation.donorName || "-",
        requesterName: requesterName,
        requesterEmail: requesterEmail,
        status: "Pending",
        date: new Date().toLocaleDateString("en-GB")
    };

    requests.push(request);

    localStorage.setItem(
        "foodRequests",
        JSON.stringify(requests)
    );

    showToast("Food request submitted successfully!");

    if (window.refreshMyFoodRequests) {
        window.refreshMyFoodRequests();
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

    setTimeout(function () {
        toast.classList.remove("show");
    }, 3000);
}
