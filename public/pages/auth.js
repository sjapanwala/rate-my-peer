// Function to load the user data from a local JSON file
async function loadUserData() {
    try {
        const response = await fetch('../data/user_accounts.json'); // Adjust path as necessary
        return await response.json();
    } catch (error) {
        console.error('Error loading user data:', error);
    }
}

// Event listener for login form submission
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Load user data from the JSON file
    const data = await loadUserData();

    // Check if the email and password match any entry in the JSON data
    const user = data.users.find(u => u.username === email && u.password === password);

    if (user) {
        // Set a cookie if login is successful
        document.cookie = `user=${user.username}; expires=${new Date(new Date().getTime() + 60 * 60 * 1000).toUTCString()}; path=/`;
        alert('Login successful!');
        // Redirect or perform further actions after successful login
        window.location.href = "../index.html"; // Change this to redirect to the desired page
    } else {
        alert('Invalid credentials');
    }
});