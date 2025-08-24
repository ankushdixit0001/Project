document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        loginError.textContent = '';
        
        const role = document.getElementById('login-role').value;
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        if (role === 'admin') {
            if (email === 'admin@example.com' && password === 'admin123') {
                sessionStorage.setItem('authRole', 'admin');
                window.location.href = 'admin.html';
            } else {
                loginError.textContent = 'Invalid admin credentials.';
            }
            return;
        }

        // Student Login
        try {
            const response = await fetch('students.json');
            const students = await response.json();
            const student = students.find(s => s.email === email && s.password === password);

            if (student) {
                sessionStorage.setItem('authRole', 'student');
                sessionStorage.setItem('loggedInStudentId', student.id);
                window.location.href = 'student.html';
            } else {
                loginError.textContent = 'Invalid student email or password.';
            }
        } catch (error) {
            loginError.textContent = 'Error logging in. Please try again.';
            console.error('Login error:', error);
        }
    });
});