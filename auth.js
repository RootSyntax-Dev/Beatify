// auth.js - Local Storage Simulation

// 1. Get all necessary HTML elements
const signupModal = document.getElementById("signupModal");
const loginModal = document.getElementById("loginModal");

const signupBtn = document.querySelector(".signupbtn");
const loginBtn = document.querySelector(".loginbtn");

const closeButtons = document.querySelectorAll(".close-button");

const signupForm = document.getElementById("signupForm");
const loginForm = document.getElementById("loginForm");

// 2. Functions to open and close modals
function openModal(modal) {
  modal.style.display = "flex"; // This makes the modal visible
}

function closeModal(modal) {
  modal.style.display = "none"; // This hides the modal
  // Reset form fields when closing
  if (modal.id === "signupModal") signupForm.reset();
  if (modal.id === "loginModal") loginForm.reset();
}

// 3. Event Listeners for opening modals (when "Sign up" or "Log in" buttons are clicked)
if (signupBtn) {
  signupBtn.addEventListener("click", () => {
    openModal(signupModal);
  });
}

if (loginBtn) {
  loginBtn.addEventListener("click", () => {
    openModal(loginModal);
  });
}

// 4. Event Listeners for closing modals (when the 'x' button is clicked)
closeButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    const modalId = event.target.dataset.modal; // Gets the ID from data-modal attribute
    const modalToClose = document.getElementById(modalId);
    if (modalToClose) {
      closeModal(modalToClose);
    }
  });
});

// 5. Close modal when clicking outside the modal content area
window.addEventListener("click", (event) => {
  if (event.target === signupModal) {
    closeModal(signupModal);
  }
  if (event.target === loginModal) {
    closeModal(loginModal);
  }
});

// --- Sign Up Form Submission Handler ---
if (signupForm) {
  signupForm.addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent default form submission (page reload)

    const username = signupForm.elements.signupUsername.value.trim();
    const email = signupForm.elements.signupEmail.value.trim();
    const password = signupForm.elements.signupPassword.value;
    const confirmPassword = signupForm.elements.signupConfirmPassword.value;

    // Basic validation
    if (!username || !email || !password || !confirmPassword) {
      alert("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Get existing users from localStorage or initialize an empty array
    // JSON.parse() converts the string back to a JavaScript object/array
    let users = JSON.parse(localStorage.getItem("registeredUsers")) || [];

    // Check if username or email already exists in our "database" (localStorage)
    const userExists = users.some(
      (user) => user.username === username || user.email === email
    );
    if (userExists) {
      alert("Username or Email already registered!");
      return;
    }

    // Create a new user object
    // IMPORTANT: btoa() is a simple base64 encoder. It's NOT for secure password hashing.
    // Use it only for this front-end only simulation.
    const newUser = {
      username: username,
      email: email,
      password: btoa(password), // Simulating "saving" a password by encoding it
    };

    // Add the new user to our array of users
    users.push(newUser);
    // Save the updated users array back to localStorage as a JSON string
    localStorage.setItem("registeredUsers", JSON.stringify(users));

    console.log("Registered Users in Local Storage:", users); // For debugging in console
    alert(
      "Sign up successful! Your data is saved in your browser's local storage. (Email verification simulated)"
    );

    closeModal(signupModal); // Close the signup modal
  });
}

// --- Log In Form Submission Handler ---
if (loginForm) {
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent default form submission (page reload)

    const identifier = loginForm.elements.loginUsername.value.trim(); // Can be username or email
    const password = loginForm.elements.loginPassword.value;

    // Basic validation
    if (!identifier || !password) {
      alert("Please enter both username/email and password.");
      return;
    }

    // Get registered users from localStorage
    let users = JSON.parse(localStorage.getItem("registeredUsers")) || [];

    // Find a user that matches the identifier (username or email) and the encoded password
    const foundUser = users.find(
      (user) =>
        (user.username === identifier || user.email === identifier) &&
        user.password === btoa(password) // Compare with the encoded password
    );

    if (foundUser) {
      alert(
        "Login successful! Welcome, " +
          foundUser.username +
          "! (This is a simulation)"
      );
      console.log("Logged in user:", foundUser.username);
      // Here, you would typically update your UI to reflect that the user is logged in.
      // For example, hide signup/login buttons and show a "Welcome [username]" message.
      closeModal(loginModal); // Close the login modal
    } else {
      alert("Invalid Username/Email or Password.");
    }
  });
}
