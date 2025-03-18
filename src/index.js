

const registrationForm = document.getElementById("registration");
    const loginForm = document.getElementById("login");
    const errorDisplay = document.getElementById("errorDisplay");

    function showError(message) {
        errorDisplay.innerText = message;
        errorDisplay.style.display = "block";
    }

    function clearError() {
        errorDisplay.style.display = "none";
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && !email.endsWith("@example.com");
    }

    function isValidPassword(password, username) {
        return (
            password.length >= 12 &&
            /[A-Z]/.test(password) &&
            /[a-z]/.test(password) &&
            /\d/.test(password) &&
            /[\W_]/.test(password) &&
            !password.toLowerCase().includes("password") &&
            !password.toLowerCase().includes(username.toLowerCase())
        );
    }

    function isValidUsername(username) {
        const uniqueChars = new Set(username).size;
        return /^[a-zA-Z0-9]+$/.test(username) && username.length >= 4 && uniqueChars >= 2;
    }

    function isUsernameTaken(username) {
        const users = JSON.parse(localStorage.getItem("users") || "{}");
        return users.hasOwnProperty(username.toLowerCase());
    }

    registrationForm.addEventListener("submit", (event) => {
        event.preventDefault();
        clearError();

        const username = registrationForm.username.value.trim();
        const email = registrationForm.email.value.trim();
        const password = registrationForm.password.value;
        const passwordCheck = registrationForm.passwordCheck.value;
        const termsAccepted = registrationForm.terms.checked;

        if (!isValidUsername(username)) {
            showError("Username must be at least 4 characters with two unique characters and no special characters.");
            registrationForm.username.focus();
            return;
        }
        if (isUsernameTaken(username)) {
            showError("That username is already taken.");
            registrationForm.username.focus();
            return;
        }
        if (!isValidEmail(email)) {
            showError("Please enter a valid email address (like example.com).");
            registrationForm.email.focus();
            return;
        }
        if (!isValidPassword(password, username)) {
            showError("Password must be at least 12 characters long, contain uppercase, lowercase, a number, a special character, and not include 'password' or your username.");
            registrationForm.password.focus();
            return;
        }
        if (password !== passwordCheck) {
            showError("Passwords do not match.");
            registrationForm.passwordCheck.focus();
            return;
        }
        if (!termsAccepted) {
            showError("You must agree to the Terms and conditions.");
            return;
        }

        // Store user data
        const users = JSON.parse(localStorage.getItem("users") || "{}");
        users[username.toLowerCase()] = { email: email.toLowerCase(), password };
        localStorage.setItem("users", JSON.stringify(users));

        // Clear form & show success
        registrationForm.reset();
        alert("Registration successful!");
    });

    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();
        clearError();

        const username = loginForm.username.value.trim().toLowerCase();
        const password = loginForm.password.value;
        const users = JSON.parse(localStorage.getItem("users") || "{}");

        if (!username) {
            showError("Username cannot be blank.");
            loginForm.username.focus();
            return;
        }
        if (!users[username]) {
            showError("Username does not exist.");
            loginForm.username.focus();
            return;
        }
        if (!password) {
            showError("Password cannot be blank.");
            loginForm.password.focus();
            return;
        }
        if (users[username].password !== password) {
            showError("Incorrect password.");
            loginForm.password.focus();
            return;
        }

        loginForm.reset();
        alert(`Login successful! ${loginForm.persist.checked ? "You will remain logged in." : ""}`);
    });
