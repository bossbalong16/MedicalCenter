// GET ELEMENTS
const form       = document.getElementById("App-Form");
const modal      = document.getElementById("modalBG");
const modalBox   = document.querySelector(".modal-box");
const modalText  = document.getElementById("modalText");
const btnNo      = document.getElementById("confirmNo");
const btnYes     = document.getElementById("confirmYes");
const doctorSelect = document.getElementById("doctorSelect");
const timeSelect = document.getElementById("timeSelect");

// DOCTOR SCHEDULES
const doctorSchedules = {
    "Dr. John Sins": ["09:00 AM","10:00 AM","11:00 AM","12:00 PM","01:00 PM","02:00 PM","03:00 PM","04:00 PM"],
    "Dr. Ella Smith": ["10:00 AM","11:00 AM","12:00 PM","01:00 PM","02:00 PM","03:00 PM","04:00 PM","05:00 PM"],
    "Dr. Angela Dizon": ["08:00 AM","09:00 AM","10:00 AM","11:00 AM","12:00 PM","01:00 PM","02:00 PM"],
    "Dr. Michael Torres": ["01:00 PM","02:00 PM","03:00 PM","04:00 PM","05:00 PM","06:00 PM","07:00 PM"]
};

// UPDATE TIME DROPDOWN BASED ON SELECTED DOCTOR
doctorSelect.addEventListener("change", () => {
    const selectedDoctor = doctorSelect.value;
    timeSelect.innerHTML = '<option value="">--Select Time--</option>'; // reset

    if (selectedDoctor && doctorSchedules[selectedDoctor]) {
        doctorSchedules[selectedDoctor].forEach(time => {
            const option = document.createElement("option");
            option.value = time;
            option.textContent = time;
            timeSelect.appendChild(option);
        });
    }
});

// SHOW MODAL FUNCTION
function showModal() {
    modal.style.display = "flex";
    modal.style.opacity = "0";
    setTimeout(() => (modal.style.opacity = "1"), 10);
}

// HIDE MODAL FUNCTION
function hideModal() {
    modal.style.opacity = "0";
    setTimeout(() => (modal.style.display = "none"), 250);
}

// FORM SUBMIT
form.addEventListener("submit", (e) => {
    e.preventDefault();

    const fd = new FormData(form);
    let output = "";
    const appointmentData = {};

    fd.forEach((value, key) => {
        if (value.trim() === "") value = "[Empty]";
        output += `${key}: ${value}\n`;
        appointmentData[key] = value;
    });

    // TEMPORARY STORE FOR MODAL CONFIRMATION
    sessionStorage.setItem("pendingAppointment", JSON.stringify(appointmentData));

    modalText.textContent = output;
    showModal();
});

// CANCEL BUTTON
btnNo.onclick = () => hideModal();

// CONFIRM BUTTON
btnYes.onclick = () => {
    const appointmentData = JSON.parse(sessionStorage.getItem("pendingAppointment"));

    // SAVE TO LOCALSTORAGE
    const appointments = JSON.parse(localStorage.getItem("appointments")) || [];
    appointments.push(appointmentData);
    localStorage.setItem("appointments", JSON.stringify(appointments));

    sessionStorage.removeItem("pendingAppointment");

    // SHOW SPINNER
    modalBox.innerHTML = `
        <h2 style="color:white;text-align:center;margin-bottom:10px;">Processing...</h2>
        <div class="spinner"></div>
        <p style="color:#dcdcdc;text-align:center;font-size:14px;margin-top:8px;">Please wait</p>
    `;

    if (!document.getElementById("spinner-style")) {
        const style = document.createElement("style");
        style.id = "spinner-style";
        style.innerHTML = `
            .spinner {
                border: 6px solid rgba(255,255,255,0.3);
                border-top-color: #4c8dff;
                width: 50px;
                height: 50px;
                margin: 15px auto;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
            @keyframes spin { 
                0% { transform: rotate(0deg); } 
                100% { transform: rotate(360deg); } 
            }
        `;
        document.head.appendChild(style);
    }

    // SIMULATED SUBMISSION CONFIRMATION
    setTimeout(() => {
        modalBox.innerHTML = `
            <h2 style="color:black;text-align:center;">Appointment Submitted!</h2>
            <p style="color:black;text-align:center;font-size:16px;margin-top:8px;">
                Thank you for scheduling.
            </p>
            <a href="home.html" 
                style="
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 10px;
                    width: 100%;
                    padding: 12px 0;
                    border-radius: 6px;
                    background-color: #4c8dff; 
                    color: white; 
                    text-decoration: none;
                    font-family: Arial, sans-serif;
                    font-size: 16px;
                    font-weight: 600;
                    transition: background-color 0.25s ease;
                "
                onmouseover="this.style.backgroundColor='#3a79e6'"
                onmouseout="this.style.backgroundColor='#4c8dff'"
                >
                    <img src="https://static.vecteezy.com/system/resources/previews/023/629/495/original/web-button-icon-back-button-free-png.png"
                        alt="Back"
                        style="width: 24px; height: auto;"
                    >
                    Back
                </a>
        `;
        form.reset();
        timeSelect.innerHTML = '<option value="">--Select Time--</option>'; // reset time dropdown
    }, 2000);
};
