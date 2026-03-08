"use strict";

const ASTON_EMAIL = "159095524@aston.ac.uk";

function validateForm(form) {
  // Ensure all form fields are completed
  const requiredInputs = form.querySelectorAll("input[required]");
  for (let i = 0; i < requiredInputs.length; i++) {
    const input = requiredInputs[i];

    // For checkboxes, check at least one preferred contact checkbox is selected
    const contactCheckboxes = form.querySelectorAll(
    'input[name="preferredContact"]'
    );

    let minOneChecked = false;

    for (let i = 0; i < contactCheckboxes.length; i++) {
      if (contactCheckboxes[i].checked) {
        minOneChecked = true;
        break;
      }
    }
    
    if (!minOneChecked) return false;

    // For everything else
    if (String(input.value).trim() === "") return false;
  }


  return true;
}

function checkEmails(emailValue, confirmEmailValue) {
  const email = String(emailValue).trim().toLowerCase();
  const confirmEmail = String(confirmEmailValue).trim().toLowerCase();
  return email !== "" && email === confirmEmail;
}

function checkDate(dateValue) {
  // Ensure project date is at least one day in the future
  if (!dateValue) return false;

  const selected = new Date(dateValue);
  selected.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  return selected >= tomorrow;
}

function buildSummary(form) {
  const firstName = form.querySelector("#firstName").value.trim();
  const phoneNumber = form.querySelector("#phoneNumber").value.trim();
  const email = form.querySelector("#email").value.trim();
  const projectDescription = form.querySelector("#projectDescription").value.trim();

  const contactCheckboxes = form.querySelectorAll(
  'input[name="preferredContact"]:checked'
  );

  let preferredMethods = [];

  for (let i = 0; i < contactCheckboxes.length; i++) {
    preferredMethods.push(contactCheckboxes[i].value);
  }

  const preferred = preferredMethods.join(", ");


  const projectDate = form.querySelector("#projectDate").value;
  const projectDuration = form.querySelector("#projectDuration").value;

  return (
    `To: ${ASTON_EMAIL}\n\n` +
    `First Name: ${firstName}\n` +
    `Project Description: ${projectDescription}\n` +
    `Confirmed Email: ${email}\n` +
    `Phone Number: ${phoneNumber}\n` +
    `Preferred Contact Method: ${preferred}\n` +
    `Project Date: ${projectDate}\n` +
    `Project Duration (days): ${projectDuration}\n\n` +
    `--- End of Summary ---`
  );
}

function attachContactFormHandler() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!validateForm(form)) {
      alert("Please complete all required form fields before submitting.");
      return;
    }

    const email = form.querySelector("#email").value;
    const confirmEmail = form.querySelector("#confirmEmail").value;

    if (!checkEmails(email, confirmEmail)) {
      alert("Email and Confirm Email must match.");
      return;
    }

    const dateValue = form.querySelector("#projectDate").value;
    if (!checkDate(dateValue)) {
      alert("Project Date must be at least 1 day in the future.");
      return;
    }

    const summary = buildSummary(form);
    alert(summary);

    form.reset();
  });
}

function setYear() {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
}

// Initialise
setYear();
attachContactFormHandler();
