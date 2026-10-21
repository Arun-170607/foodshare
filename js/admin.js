
document.addEventListener("DOMContentLoaded", () => {
    const $ = id => document.getElementById(id);

    const readData = key => {
        try {
            const data = JSON.parse(localStorage.getItem(key) || "[]");
            return Array.isArray(data) ? data : [];
        } catch {
            return [];
        }
    };

    const saveData = (key, data) => {
        localStorage.setItem(key, JSON.stringify(data));
    };

    const donations = () => readData("foodDonations");
    const requests = () => readData("foodRequests");

    const esc = value => String(value ?? "N/A").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);

    const normalStatus = value =>
        String(value || "Pending").trim().toLowerCase();

    const badge = status => {
        const s = normalStatus(status);
        const cls = ["approved", "completed", "distributed"].includes(s)
            ? "approved"
            : s === "rejected"
                ? "rejected"
                : "pending";

        return `<span class="status-badge ${cls}">${esc(status || "Pending")}</span>`;
    };

    function message(text) {
        const toast = $("toast");
        const toastMessage = $("toastMessage");

        if (toast && toastMessage) {
            toastMessage.textContent = text;
            toast.classList.add("show");
            setTimeout(() => toast.classList.remove("show"), 3000);
        } else {
            alert(text);
        }
    }

    function parseDate(value) {
        if (!value) return null;

        if (typeof value === "string") {
            const match = value.trim().match(
                /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/
            );

            if (match) {
                const d = new Date(+match[3], +match[2] - 1, +match[1]);
                return isNaN(d.getTime()) ? null : d;
            }
        }

        const d = new Date(value);
        return isNaN(d.getTime()) ? null : d;
    }

    function dateOf(item) {
        return parseDate(
            item.createdAt || item.date || item.donationDate || item.requestDate
        );
    }

    function dateText(item) {
        const d = dateOf(item);
        return d ? d.toLocaleDateString("en-IN") : esc(item.date || "N/A");
    }

    function quantityNumber(item) {
        const n = parseFloat(
            String(item.quantity ?? "0").replace(/,/g, "").match(/-?\d+(\.\d+)?/)?.[0] || "0"
        );
        return Number.isFinite(n) ? n : 0;
    }

    function showSection(name) {
        document.querySelectorAll(".admin-section").forEach(section => {
            section.classList.remove("active-section");
            section.style.display = "none";
        });

        const target = $(name + "-section");

        if (target) {
            target.style.display = "block";
            target.classList.add("active-section");
        }

        document.querySelectorAll(".menu-item[data-section]").forEach(button => {
            button.classList.toggle("active", button.dataset.section === name);
        });

        if (name === "dashboard") updateDashboard();
        if (name === "donations") loadDonations();
        if (name === "requests") loadRequests();
        if (name === "donors") loadDonors();
        if (name === "ngos") loadNGOs();
        if (name === "users") loadUsers();
        if (name === "reports") updateReports();
    }

    document.querySelectorAll("[data-section]").forEach(button => {
        button.addEventListener("click", event => {
            event.preventDefault();
            showSection(button.dataset.section);
        });
    });

    if ($("currentDate")) {
        $("currentDate").textContent = new Date().toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric"
        });
    }

    $("sidebarToggle")?.addEventListener("click", () => {
        document.querySelector(".sidebar")?.classList.toggle("collapsed");
        document.querySelector(".main-area")?.classList.toggle("expanded");
    });

    $("logoutBtn")?.addEventListener("click", () => {
        sessionStorage.removeItem("isAdminLoggedIn");
        window.location.href = "login.html";
    });

    function loadDonations() {
        const tbody = $("donationsTableBody");
        if (!tbody) return;

        const list = donations();

        if (!list.length) {
            tbody.innerHTML = `<tr><td colspan="8">No food donations available</td></tr>`;
            return;
        }

        tbody.innerHTML = list.map((item, index) => {
            const status = item.status || "Pending";
            const s = normalStatus(status);

            let buttons = `
                <button type="button" data-action="view-donation" data-index="${index}">View</button>`;

            if (s === "pending") {
                buttons += `
                    <button type="button" data-action="approve-donation" data-index="${index}">Approve</button>
                    <button type="button" data-action="reject-donation" data-index="${index}">Reject</button>`;
            } else if (s === "approved") {
                buttons += `
                    <button type="button" data-action="distribute-donation" data-index="${index}">Mark as Distributed</button>
                    <button type="button" data-action="reject-donation" data-index="${index}">Reject</button>`;
            } else if (["completed", "distributed"].includes(s)) {
                buttons += `<span>Food Distributed</span>`;
            }

            return `
                <tr>
                    <td>${index + 1}</td>
                    <td>${esc(item.donorName || item.organizationName || item.hotelName || item.name)}</td>
                    <td>${esc(item.foodName || item.foodType || item.foodCategory)}</td>
                    <td>${esc(item.quantity)}</td>
                    <td>${esc(item.location)}</td>
                    <td>${dateText(item)}</td>
                    <td>${badge(status)}</td>
                    <td>${buttons}</td>
                </tr>`;
        }).join("");
    }

    function changeDonation(index, status) {
        const list = donations();

        if (!list[index]) {
            message("Donation not found. Refresh the page and try again.");
            return;
        }

        const current = normalStatus(list[index].status);

        if (
            status === "Distributed" &&
            current !== "approved" &&
            current !== "distributed" &&
            current !== "completed"
        ) {
            message("Please approve the donation first.");
            return;
        }

        list[index].status = status;

        if (status === "Distributed") {
            list[index].distributed = true;
            list[index].distributedAt = new Date().toISOString();
        } else {
            list[index].distributed = false;
            delete list[index].distributedAt;
        }

        saveData("foodDonations", list);
        closeModal();
        refreshAll();

        message(
            status === "Approved" ? "Donation approved successfully!" :
            status === "Rejected" ? "Donation rejected!" :
            "Food marked as distributed!"
        );
    }

    function openModal(index) {
        const item = donations()[index];

        if (!item) {
            message("Donation not found.");
            return;
        }

        const modal = $("donationModal");
        const details = $("donationDetails");

        if (!modal || !details) return;

        modal.dataset.index = index;

        details.innerHTML = `
            <p><strong>Food Name:</strong> ${esc(item.foodName || item.foodType)}</p>
            <p><strong>Donor:</strong> ${esc(item.donorName || item.organizationName || item.hotelName)}</p>
            <p><strong>Food Type:</strong> ${esc(item.foodType || item.foodCategory)}</p>
            <p><strong>Quantity:</strong> ${esc(item.quantity)}</p>
            <p><strong>People Served:</strong> ${esc(item.serves)}</p>
            <p><strong>Location:</strong> ${esc(item.location)}</p>
            <p><strong>Best Before:</strong> ${esc(item.bestBefore)}</p>
            <p><strong>Date:</strong> ${dateText(item)}</p>
            <p><strong>Status:</strong> ${badge(item.status)}</p>
        `;

        modal.style.display = "flex";
        modal.classList.add("show");
    }

    function closeModal() {
        const modal = $("donationModal");
        if (!modal) return;

        modal.style.display = "none";
        modal.classList.remove("show");
    }

    $("closeDonationModal")?.addEventListener("click", closeModal);

    $("donationModal")?.addEventListener("click", event => {
        if (event.target === $("donationModal")) closeModal();
    });

    $("approveDonation")?.addEventListener("click", () => {
        const index = Number($("donationModal")?.dataset.index);
        if (Number.isInteger(index)) changeDonation(index, "Approved");
    });

    $("rejectDonation")?.addEventListener("click", () => {
        const index = Number($("donationModal")?.dataset.index);
        if (Number.isInteger(index)) changeDonation(index, "Rejected");
    });

    $("donationsTableBody")?.addEventListener("click", event => {
        const button = event.target.closest("button[data-action]");
        if (!button) return;

        const index = Number(button.dataset.index);
        if (!Number.isInteger(index)) return;

        switch (button.dataset.action) {
            case "view-donation":
                openModal(index);
                break;
            case "approve-donation":
                changeDonation(index, "Approved");
                break;
            case "reject-donation":
                changeDonation(index, "Rejected");
                break;
            case "distribute-donation":
                changeDonation(index, "Distributed");
                break;
        }
    });

    function loadRequests() {
        const tbody = $("requestsTableBody");
        if (!tbody) return;

        const list = requests();

        if (!list.length) {
            tbody.innerHTML = `<tr><td colspan="9">No food requests available</td></tr>`;
            loadRecentRequests();
            return;
        }

        tbody.innerHTML = list.map((item, index) => {
            const status = item.status || "Pending";
            const s = normalStatus(status);

            let buttons = "";

            if (s === "pending") {
                buttons = `
                    <button type="button" data-action="approve-request" data-index="${index}">Approve</button>
                    <button type="button" data-action="reject-request" data-index="${index}">Reject</button>`;
            }

            return `
                <tr>
                    <td>${index + 1}</td>
                    <td>${esc(item.organizationName || item.requesterName || item.receiverName)}</td>
                    <td>${esc(item.foodName)}</td>
                    <td>${esc(item.foodType || item.foodCategory)}</td>
                    <td>${esc(item.quantity)}</td>
                    <td>${esc(item.location)}</td>
                    <td>${dateText(item)}</td>
                    <td>${badge(status)}</td>
                    <td>${buttons}</td>
                </tr>`;
        }).join("");

        loadRecentRequests();
    }

    function changeRequest(index, status) {
        const list = requests();

        if (!list[index]) {
            message("Request not found. Refresh and try again.");
            return;
        }

        list[index].status = status;
        list[index].reviewedAt = new Date().toISOString();

        saveData("foodRequests", list);
        refreshAll();

        message(`Request ${status.toLowerCase()} successfully!`);
    }

    $("requestsTableBody")?.addEventListener("click", event => {
        const button = event.target.closest("button[data-action]");
        if (!button) return;

        const index = Number(button.dataset.index);

        if (!Number.isInteger(index)) return;

        if (button.dataset.action === "approve-request") {
            changeRequest(index, "Approved");
        }

        if (button.dataset.action === "reject-request") {
            changeRequest(index, "Rejected");
        }
    });

    function loadRecentRequests() {
        const container = $("recentRequestsBody");
        if (!container) return;

        const list = requests().slice(-5).reverse();

        container.innerHTML = list.length
            ? list.map(item => `
                <div class="request-item">
                    <div class="request-icon"><i class="bi bi-clipboard-check-fill"></i></div>
                    <div>
                        <strong>${esc(item.organizationName || item.requesterName || item.receiverName || "Receiver")}</strong>
                        <span>${esc(item.foodName || "Food request")} · ${esc(item.quantity || "")}</span>
                        ${badge(item.status)}
                    </div>
                </div>
            `).join("")
            : `<div class="request-item"><div><strong>No requests available</strong><span>Waiting for receiver requests</span></div></div>`;
    }

    function uniqueCount(items, fields) {
        const values = items.map(item => {
            for (const field of fields) {
                if (item[field]) return String(item[field]).trim().toLowerCase();
            }
            return null;
        }).filter(Boolean);

        return new Set(values).size;
    }

    function loadDonors() {
        const section = $("donors-section");
        const tbody = section?.querySelector("tbody");
        if (!tbody) return;

        const map = new Map();

        donations().forEach(item => {
            const name = item.donorName || item.organizationName || item.hotelName || item.name;
            const email = item.donorEmail || item.email;
            const key = email || name;
            if (!key) return;

            if (!map.has(key)) {
                map.set(key, {
                    name: name || "N/A",
                    email: email || "N/A",
                    phone: item.donorPhone || item.phone || "N/A",
                    location: item.location || "N/A",
                    status: item.donorStatus || "Registered"
                });
            }
        });

        const list = [...map.values()];

        tbody.innerHTML = list.length
            ? list.map((item, index) => `
                <tr>
                    <td>${index + 1}</td>
                    <td>${esc(item.name)}</td>
                    <td>${esc(item.email)}</td>
                    <td>${esc(item.phone)}</td>
                    <td>${esc(item.location)}</td>
                    <td>${esc(item.status)}</td>
                </tr>`).join("")
            : `<tr><td colspan="6">No donors registered yet</td></tr>`;
    }

    function loadNGOs() {
        const section = $("ngos-section");
        const tbody = section?.querySelector("tbody");
        if (!tbody) return;

        const map = new Map();

        requests().forEach(item => {
            const name = item.organizationName || item.requesterName || item.receiverName;
            const email = item.requesterEmail || item.receiverEmail || item.email;
            const key = email || name;
            if (!key) return;

            if (!map.has(key)) {
                map.set(key, {
                    name: name || "N/A",
                    email: email || "N/A",
                    phone: item.receiverPhone || item.phone || "N/A",
                    location: item.location || "N/A",
                    status: item.receiverStatus || "Registered"
                });
            }
        });

        const list = [...map.values()];

        tbody.innerHTML = list.length
            ? list.map((item, index) => `
                <tr>
                    <td>${index + 1}</td>
                    <td>${esc(item.name)}</td>
                    <td>${esc(item.email)}</td>
                    <td>${esc(item.phone)}</td>
                    <td>${esc(item.location)}</td>
                    <td>${esc(item.status)}</td>
                </tr>`).join("")
            : `<tr><td colspan="6">No NGOs or receivers registered yet</td></tr>`;
    }

    function loadUsers() {
        const section = $("users-section");
        const tbody = section?.querySelector("tbody");
        if (!tbody) return;

        const map = new Map();

        donations().forEach(item => {
            const name = item.donorName || item.organizationName || item.hotelName || item.name;
            const email = item.donorEmail || item.email;
            const key = email || name;

            if (key) {
                map.set(key, {
                    name: name || "N/A",
                    email: email || "N/A",
                    phone: item.donorPhone || item.phone || "N/A",
                    role: "Donor",
                    status: item.donorStatus || "Registered"
                });
            }
        });

        requests().forEach(item => {
            const name = item.organizationName || item.requesterName || item.receiverName;
            const email = item.requesterEmail || item.receiverEmail;
            const key = email || name;

            if (key) {
                map.set(key, {
                    name: name || "N/A",
                    email: email || "N/A",
                    phone: item.receiverPhone || item.phone || "N/A",
                    role: "Receiver",
                    status: item.receiverStatus || "Registered"
                });
            }
        });

        const list = [...map.values()];

        tbody.innerHTML = list.length
            ? list.map((item, index) => `
                <tr>
                    <td>${index + 1}</td>
                    <td>${esc(item.name)}</td>
                    <td>${esc(item.email)}</td>
                    <td>${esc(item.phone)}</td>
                    <td>${esc(item.role)}</td>
                    <td>${esc(item.status)}</td>
                </tr>`).join("")
            : `<tr><td colspan="6">No users available</td></tr>`;
    }

    function updateReports() {
        const d = donations();
        const r = requests();

        if ($("reportDonations")) $("reportDonations").textContent = d.length;

        if ($("reportDonors")) {
            $("reportDonors").textContent = uniqueCount(
                d,
                ["donorEmail", "donorName", "organizationName", "hotelName", "name"]
            );
        }

        if ($("reportReceivers")) {
            $("reportReceivers").textContent = uniqueCount(
                r,
                ["requesterEmail", "receiverEmail", "organizationName", "requesterName", "receiverName"]
            );
        }
    }

    let donationChart = null;
    let categoryChart = null;

    function updateCharts() {
        if (typeof Chart === "undefined") return;

        const filterText = $("chartFilter")?.selectedOptions?.[0]?.textContent || "Last 7 Days";
        const isYear = filterText.toLowerCase().includes("year");
        const days = filterText.includes("30") ? 30 : 7;
        const now = new Date();

        let start;

        if (isYear) {
            start = new Date(now.getFullYear(), 0, 1);
        } else {
            start = new Date(now);
            start.setHours(0, 0, 0, 0);
            start.setDate(start.getDate() - days + 1);
        }

        const filtered = donations().filter(item => {
            const d = dateOf(item);
            return d && d >= start && d <= now;
        });

        let labels = [];
        let values = [];

        if (isYear) {
            for (let month = 0; month <= now.getMonth(); month++) {
                labels.push(new Date(now.getFullYear(), month, 1)
                    .toLocaleString("en-IN", { month: "short" }));

                values.push(filtered.filter(item => {
                    const d = dateOf(item);
                    return d &&
                        d.getFullYear() === now.getFullYear() &&
                        d.getMonth() === month;
                }).length);
            }
        } else {
            for (let i = days - 1; i >= 0; i--) {
                const d = new Date(now);
                d.setHours(0, 0, 0, 0);
                d.setDate(d.getDate() - i);

                labels.push(d.toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short"
                }));

                values.push(filtered.filter(item => {
                    const itemDate = dateOf(item);
                    return itemDate && itemDate.toDateString() === d.toDateString();
                }).length);
            }
        }

        if ($("donationChart")) {
            donationChart?.destroy();

            donationChart = new Chart($("donationChart"), {
                type: "line",
                data: {
                    labels,
                    datasets: [{
                        label: "Donations",
                        data: values,
                        borderColor: "#15803d",
                        backgroundColor: "rgba(21,128,61,0.15)",
                        fill: true,
                        tension: 0.3
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: { precision: 0 }
                        }
                    }
                }
            });
        }

        if ($("categoryChart")) {
            const counts = {};

            filtered.forEach(item => {
                const category = item.foodCategory || item.foodType || "Other";
                counts[category] = (counts[category] || 0) + 1;
            });

            categoryChart?.destroy();

            categoryChart = new Chart($("categoryChart"), {
                type: "doughnut",
                data: {
                    labels: Object.keys(counts).length ? Object.keys(counts) : ["No data"],
                    datasets: [{
                        data: Object.values(counts).length ? Object.values(counts) : [1],
                        backgroundColor: [
                            "#15803d", "#65a30d", "#f59e0b",
                            "#0ea5e9", "#8b5cf6", "#f97316"
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        }
    }

    $("chartFilter")?.addEventListener("change", updateCharts);

    function updateDashboard() {
        const d = donations();
        const r = requests();

        const distributed = d.filter(item =>
            ["distributed", "completed"].includes(normalStatus(item.status)) ||
            item.distributed === true
        );

        const totalQuantity = distributed.reduce(
            (sum, item) => sum + quantityNumber(item),
            0
        );

        const people = distributed.reduce(
            (sum, item) => sum + (Number(item.serves || item.peopleBenefited) || 0),
            0
        );

        if ($("totalDonations")) $("totalDonations").textContent = d.length;

        if ($("totalDonors")) {
            $("totalDonors").textContent = uniqueCount(
                d,
                ["donorEmail", "donorName", "organizationName", "hotelName", "name"]
            );
        }

        if ($("totalNGOs")) {
            $("totalNGOs").textContent = uniqueCount(
                r,
                ["requesterEmail", "receiverEmail", "organizationName", "requesterName", "receiverName"]
            );
        }

        if ($("foodDistributed")) {
            $("foodDistributed").textContent = `${totalQuantity} kg`;
        }

        if ($("peopleBenefited")) {
            $("peopleBenefited").textContent = people;
        }

        const recent = $("recentDonationsBody");

        if (recent) {
            const list = d.slice().reverse().slice(0, 5);

            recent.innerHTML = list.length
                ? list.map((item, index) => `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${esc(item.donorName || item.organizationName || item.hotelName || item.name)}</td>
                        <td>${esc(item.foodType || item.foodCategory || item.foodName)}</td>
                        <td>${esc(item.quantity)}</td>
                        <td>${esc(item.location)}</td>
                        <td>${dateText(item)}</td>
                        <td>${badge(item.status)}</td>
                    </tr>`).join("")
                : `<tr><td colspan="7">No donations available</td></tr>`;
        }

        loadRecentRequests();
        updateReports();
        updateCharts();
    }

    function refreshAll() {
        updateDashboard();
        loadDonations();
        loadRequests();
        loadDonors();
        loadNGOs();
        loadUsers();
        updateReports();
    }

    showSection("dashboard");
    refreshAll();
});

function showAdminToast(message, type = "success") {
    let toast = document.getElementById("adminToast");

    if (!toast) {
        toast = document.createElement("div");
        toast.id = "adminToast";
        toast.className = "admin-toast";
        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.className = `admin-toast ${type} show`;

    clearTimeout(window.adminToastTimer);

    window.adminToastTimer = setTimeout(function () {
        toast.classList.remove("show");
    }, 3000);
}

