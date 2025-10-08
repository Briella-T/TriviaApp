const loginForm = document.getElementById('loginForm');
const messageDiv = document.getElementById('message');

const MOCK_USER = {
    username: 'testuser@email',
    password: 'password123'
};

function sendLogin(event) {
    event.preventDefault();

    const usernameInput = document.getElementById('username').value;
    const passwordInput = document.getElementById('password').value;

    messageDiv.textContent = '';
    messageDiv.className = 'text-center font-medium h-6'; 

    if (usernameInput === MOCK_USER.username && passwordInput === MOCK_USER.password) {
        messageDiv.textContent = 'Login successful!';
        messageDiv.classList.add('text-green-600');

        setTimeout(() => {
            window.location.href = 'main.html'; 
        }, 1000);
    } else if (usernameInput === MOCK_USER.username && passwordInput !== MOCK_USER.password) {
        messageDiv.textContent = 'Incorrect password';
        messageDiv.classList.add('text-red-600');
    } else {
        messageDiv.textContent = 'Incorrect Username';
        messageDiv.classList.add('text-red-600');
    }

}

loginForm.addEventListener('submit', sendLogin);