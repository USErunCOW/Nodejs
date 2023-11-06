const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');
const logoutButton = document.getElementById('logout-button');

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;

    try {
        const response = await fetch('/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (response.status === 201) {
            alert('Registration successful. You can now log in.');
        } else {
            const data = await response.json();
            alert(`Registration failed: ${data.error}`);
        }
    } catch (error) {
        console.error(error);
        alert('An error occurred during registration.');
    }
});

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (response.status === 200) {
            const data = await response.json();
            alert(`Login successful. Welcome, ${data.user.username}!`);
            // Show the "Logout" button and hide the login and registration forms
            loginForm.style.display = 'none';
            registerForm.style.display = 'none';
            logoutButton.style.display = 'block';
        } else {
            const data = await response.json();
            alert(`Login failed: ${data.error}`);
        }
    } catch (error) {
        console.error(error);
        alert('An error occurred during login.');
    }
});

logoutButton.addEventListener('click', async () => {
    try {
        const response = await fetch('/auth/logout', {
            method: 'GET',
        });

        if (response.status === 200) {
            alert('Logout successful.');
            // Show the login and registration forms and hide the "Logout" button
            loginForm.style.display = 'block';
            registerForm.style.display = 'block';
            logoutButton.style.display = 'none';
        } else {
            const data = await response.json();
            alert(`Logout failed: ${data.error}`);
        }
    } catch (error) {
        console.error(error);
        alert('An error occurred during logout.');
    }
});
