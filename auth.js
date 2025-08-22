document.addEventListener("DOMContentLoaded", () => {
  // DOM elements
  const signupModal = document.getElementById("signupModal");
  const loginModal = document.getElementById("loginModal");
  const signupBtn = document.querySelector(".signupbtn");
  const loginBtn = document.querySelector(".loginbtn");
  const closeButtons = document.querySelectorAll(".close-button");
  const signupForm = document.getElementById("signupForm");
  const loginForm = document.getElementById("loginForm");
  const authButtons = document.getElementById("authButtons");
  const userProfile = document.getElementById("userProfile");
  const welcomeMsg = document.getElementById("welcomeMsg");
  const logoutBtn = document.getElementById("logoutBtn");

  // Functions to open and close modals
  const openModal = (modal) => (modal.style.display = "flex");
  const closeModal = (modal) => {
    modal.style.display = "none";
    if (modal.id === "signupModal") signupForm.reset();
    if (modal.id === "loginModal") loginForm.reset();
  };

  // Update UI based on login state
  const updateUIForLogin = (username) => {
    authButtons.classList.add("hidden");
    userProfile.classList.remove("hidden");
    welcomeMsg.textContent = `Welcome, ${username}`;
  };

  const updateUIForLogout = () => {
    authButtons.classList.remove("hidden");
    userProfile.classList.add("hidden");
    welcomeMsg.textContent = "";
  };

  // Check for logged-in user on page load
  const checkLoginStatus = () => {
    const loggedInUser = sessionStorage.getItem("loggedInUser");
    if (loggedInUser) {
      updateUIForLogin(loggedInUser);
    } else {
      updateUIForLogout();
    }
  };

  // Event Listeners
  signupBtn?.addEventListener("click", () => openModal(signupModal));
  loginBtn?.addEventListener("click", () => openModal(loginModal));

  closeButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const modal = document.getElementById(event.target.dataset.modal);
      if (modal) closeModal(modal);
    });
  });

  window.addEventListener("click", (event) => {
    if (event.target === signupModal) closeModal(signupModal);
    if (event.target === loginModal) closeModal(loginModal);
  });

  signupForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const username = signupForm.elements.signupUsername.value.trim();
    const email = signupForm.elements.signupEmail.value.trim();
    const password = signupForm.elements.signupPassword.value;

    if (!username || !email || !password) {
      alert("Please fill in all fields.");
      return;
    }

    let users = JSON.parse(localStorage.getItem("registeredUsers")) || [];
    const userExists = users.some(
      (user) => user.username === username || user.email === email
    );

    if (userExists) {
      alert("Username or Email already registered!");
      return;
    }

    const newUser = { username, email, password: btoa(password) };
    users.push(newUser);
    localStorage.setItem("registeredUsers", JSON.stringify(users));

    alert("Sign up successful! Please log in.");
    closeModal(signupModal);
  });

  loginForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const identifier = loginForm.elements.loginUsername.value.trim();
    const password = loginForm.elements.loginPassword.value;

    if (!identifier || !password) {
      alert("Please enter both username/email and password.");
      return;
    }

    let users = JSON.parse(localStorage.getItem("registeredUsers")) || [];
    const foundUser = users.find(
      (user) =>
        (user.username === identifier || user.email === identifier) &&
        user.password === btoa(password)
    );

    if (foundUser) {
      alert(`Login successful! Welcome, ${foundUser.username}!`);
      sessionStorage.setItem("loggedInUser", foundUser.username); // Use sessionStorage for session-only login
      updateUIForLogin(foundUser.username);
      closeModal(loginModal);
    } else {
      alert("Invalid Username/Email or Password.");
    }
  });

  logoutBtn?.addEventListener("click", () => {
    sessionStorage.removeItem("loggedInUser");
    alert("You have been logged out.");
    checkLoginStatus();
  });

  // Initial check
  checkLoginStatus();
});
