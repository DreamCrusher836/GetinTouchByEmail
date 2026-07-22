/* ============================================================
   EmailJS configuration
   Replace these three placeholder values with the real IDs
   from your EmailJS dashboard (https://dashboard.emailjs.com):
     - PUBLIC_KEY  -> Account > General > Public Key
     - SERVICE_ID  -> Email Services (the service you connected)
     - TEMPLATE_ID -> Email Templates (the template you created)
   ============================================================ */
const EMAILJS_PUBLIC_KEY = 'qFQh_wPWqvflGuXSM';
const EMAILJS_SERVICE_ID = 'service_20yi6dr';
const EMAILJS_TEMPLATE_ID = 'template_wu3pgjt';

// Start up EmailJS with your public key.
emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

const form = document.querySelector('#contact-form');
const nameInput = document.querySelector('#name');
const emailInput = document.querySelector('#email');
const messageInput = document.querySelector('#message');

const nameError = document.querySelector('#name-error');
const emailError = document.querySelector('#email-error');
const messageError = document.querySelector('#message-error');

// Basic email check: something@something.something
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Validate one field. Returns true if valid, and updates its
// error message + .invalid class as a side effect.
function validateField(input, errorEl, isValid, message) {
  if (isValid) {
    input.classList.remove('invalid');
    errorEl.textContent = '';
    return true;
  }
  input.classList.add('invalid');
  errorEl.textContent = message;
  return false;
}

function validateName() {
  return validateField(
    nameInput,
    nameError,
    nameInput.value.trim() !== '',
    'Please enter your name.'
  );
}

function validateEmail() {
  const email = emailInput.value.trim();
  return validateField(
    emailInput,
    emailError,
    emailPattern.test(email),
    'Enter a valid email address.'
  );
}

function validateMessage() {
  return validateField(
    messageInput,
    messageError,
    messageInput.value.trim() !== '',
    'Please enter a message.'
  );
}

form.addEventListener('submit', event => {
  // Always handle the submit ourselves so the page never reloads
  // (there's no backend for the browser to post to).
  event.preventDefault();

  const validName = validateName();
  const validEmail = validateEmail();
  const validMessage = validateMessage();

  if (!validName || !validEmail || !validMessage) {
    // Focus the first field that failed.
    if (!validName) nameInput.focus();
    else if (!validEmail) emailInput.focus();
    else messageInput.focus();
    return;
  }

  // All fields valid: gather the values. These keys must match
  // the {{variables}} used in your EmailJS template.
  const data = {
    name: nameInput.value.trim(),
    email: emailInput.value.trim(),
    message: messageInput.value.trim(),
  };

  // Disable the button while sending so it can't be double-clicked.
  const button = form.querySelector('.submit-btn');
  button.disabled = true;
  button.textContent = 'Sending...';

  // Hand the data to EmailJS, which sends the email for us.
  emailjs
    .send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, data)
    .then(() => {
      alert(`Thanks, ${data.name}! A confirmation email is on its way to ${data.email}.`);
      console.log('Email sent successfully:', data);
      form.reset();
      nameInput.focus();
    })
    .catch(err => {
      console.error('Email failed to send:', err);
      alert('Sorry, something went wrong sending your message. Please try again.');
    })
    .finally(() => {
      // Re-enable the button whether it succeeded or failed.
      button.disabled = false;
      button.textContent = 'Submit';
    });
});

// Clear each field's error as soon as the user fixes it.
nameInput.addEventListener('input', () => {
  if (nameInput.classList.contains('invalid')) validateName();
});
emailInput.addEventListener('input', () => {
  if (emailInput.classList.contains('invalid')) validateEmail();
});
messageInput.addEventListener('input', () => {
  if (messageInput.classList.contains('invalid')) validateMessage();
});
