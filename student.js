document.addEventListener('DOMContentLoaded', () => {
    // --- Mock Student Database ---
    // A more detailed database to simulate a real backend.
    const studentsDB = {
        'user1': {
            name: 'Priya Sharma', email: 'priya.sharma@example.com', password: 'password123', studentId: '100001',
            results: { 'Semester 1': 'A', 'Semester 2': 'A+' },
            fees: { total: 50000, paid: 50000, due: 0 },
            registration: { status: 'Completed', courses: ['BBA101', 'BBA102'] },
            library: { issued: ['The Lean Startup'], fines: 0 },
        },
        'user2': {
            name: 'Amit Kumar', email: 'amit.kumar@example.com', password: 'password123', studentId: '100002',
            results: { 'Semester 1': 'B+', 'Semester 2': 'A' },
            fees: { total: 60000, paid: 30000, due: 30000 },
            registration: { status: 'Pending', courses: [] },
            library: { issued: [], fines: 50 },
        },
        'user3': {
            name: 'Rahul Verma', email: 'rahul.verma@example.com', password: 'password123', studentId: '100003',
            results: { 'Semester 1': 'A', 'Semester 2': 'B' },
            fees: { total: 55000, paid: 55000, due: 0 },
            registration: { status: 'Completed', courses: ['MBA201', 'MBA202'] },
            library: { issued: ['Zero to One', 'Good to Great'], fines: 0 },
        }
    };

    // --- Element References ---
    const authSection = document.getElementById('auth-section');
    const dashboardSection = document.getElementById('student-dashboard');
    const loginContainer = document.getElementById('login-container');
    const registerContainer = document.getElementById('register-container');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const logoutButton = document.getElementById('logout-button');
    const showRegister = document.getElementById('show-register');
    const showLogin = document.getElementById('show-login');
    const loginError = document.getElementById('login-error');
    const registerError = document.getElementById('register-error');

    let currentStudent = null;

    // --- Helper function to toggle loading state on buttons ---
    const toggleLoading = (form, isLoading) => {
        const button = form.querySelector('button[type="submit"]');
        const buttonText = button.querySelector('.button-text');
        const spinner = button.querySelector('.spinner');
        if (isLoading) {
            buttonText.classList.add('hidden');
            spinner.classList.remove('hidden');
            button.disabled = true;
        } else {
            buttonText.classList.remove('hidden');
            spinner.classList.add('hidden');
            button.disabled = false;
        }
    };

    // --- Check for an active session on page load ---
    const loggedInStudentId = sessionStorage.getItem('loggedInStudentId');
    if (loggedInStudentId && studentsDB[loggedInStudentId]) {
        currentStudent = studentsDB[loggedInStudentId];
        displayDashboard(currentStudent);
    }

    // --- Show/Hide Auth Forms ---
    showRegister.addEventListener('click', (e) => { e.preventDefault(); loginContainer.classList.add('hidden'); registerContainer.classList.remove('hidden'); });
    showLogin.addEventListener('click', (e) => { e.preventDefault(); registerContainer.classList.add('hidden'); loginContainer.classList.remove('hidden'); });

    // --- Registration Logic ---
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        toggleLoading(registerForm, true);
        registerError.textContent = '';
        
        setTimeout(() => { // Simulate network delay
            const name = document.getElementById('register-name').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;

            if (Object.values(studentsDB).some(s => s.email === email)) {
                registerError.textContent = 'A student with this email already exists.';
                toggleLoading(registerForm, false);
                return;
            }

            const newId = 'user' + (Object.keys(studentsDB).length + 1);
            const newStudent = {
                name, email, password, studentId: String(Math.floor(100000 + Math.random() * 900000)),
                results: {}, fees: { total: 50000, paid: 0, due: 50000 }, registration: { status: 'Not Started', courses: [] }, library: { issued: [], fines: 0 },
            };
            studentsDB[newId] = newStudent;
            currentStudent = newStudent;
            
            sessionStorage.setItem('loggedInStudentId', newId);
            displayDashboard(currentStudent);
            toggleLoading(registerForm, false);
        }, 1000);
    });

    // --- Login Logic ---
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        toggleLoading(loginForm, true);
        loginError.textContent = '';

        setTimeout(() => { // Simulate network delay
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            const studentId = Object.keys(studentsDB).find(id => studentsDB[id].email === email && studentsDB[id].password === password);

            if (studentId) {
                currentStudent = studentsDB[studentId];
                sessionStorage.setItem('loggedInStudentId', studentId);
                displayDashboard(currentStudent);
            } else {
                loginError.textContent = 'Invalid email or password.';
            }
            toggleLoading(loginForm, false);
        }, 1000);
    });

    // --- Logout Logic ---
    logoutButton.addEventListener('click', () => {
        sessionStorage.removeItem('loggedInStudentId');
        currentStudent = null;
        authSection.classList.remove('hidden');
        dashboardSection.classList.add('hidden');
    });

    // --- Display Dashboard Function ---
    function displayDashboard(student) {
        authSection.classList.add('hidden');
        dashboardSection.classList.remove('hidden');
        document.getElementById('student-name').textContent = student.name;
        document.getElementById('student-id-display').textContent = student.studentId;
    }
    
    // --- Modal Logic ---
    const modals = document.querySelectorAll('.modal');
    document.querySelectorAll('.dashboard-card').forEach(card => {
        card.addEventListener('click', () => {
            const modalId = card.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            populateModalContent(modalId);
            modal.classList.add('show');
        });
    });

    modals.forEach(modal => {
        modal.querySelector('.close-button').addEventListener('click', () => {
            modal.classList.remove('show');
        });
    });

    window.addEventListener('click', (e) => {
        modals.forEach(modal => {
            if (e.target == modal) {
                modal.classList.remove('show');
            }
        });
    });

    // --- Populate Modal Content ---
    function populateModalContent(modalId) {
        if (!currentStudent) return;
        
        switch (modalId) {
            case 'results-modal':
                const resultsContent = document.getElementById('results-content');
                let resultsHtml = Object.keys(currentStudent.results).length > 0 ? '' : '<p>No results published yet.</p>';
                for (const [semester, grade] of Object.entries(currentStudent.results)) {
                    resultsHtml += `<p class="mb-2"><strong>${semester}:</strong> Grade ${grade}</p>`;
                }
                resultsContent.innerHTML = resultsHtml;
                break;
            case 'fees-modal':
                const fees = currentStudent.fees;
                document.getElementById('fees-content').innerHTML = `
                    <p><strong>Total Fees:</strong> ₹${fees.total}</p>
                    <p><strong>Paid:</strong> ₹${fees.paid}</p>
                    <p class="font-bold ${fees.due > 0 ? 'text-red-500' : 'text-green-500'}"><strong>Due:</strong> ₹${fees.due}</p>
                    ${fees.due > 0 ? '<button class="mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">Pay Now</button>' : ''}
                `;
                break;
            case 'registration-modal':
                 document.getElementById('registration-content').innerHTML = `<p><strong>Status:</strong> ${currentStudent.registration.status}</p>`;
                break;
            case 'library-modal':
                const library = currentStudent.library;
                document.getElementById('library-content').innerHTML = `
                    <p><strong>Books Issued:</strong> ${library.issued.length > 0 ? library.issued.join(', ') : 'None'}</p>
                    <p><strong>Pending Fines:</strong> ₹${library.fines}</p>
                `;
                break;
            case 'profile-modal':
                document.getElementById('profile-content').innerHTML = `
                    <p><strong>Name:</strong> ${currentStudent.name}</p>
                    <p><strong>Email:</strong> ${currentStudent.email}</p>
                    <p><strong>Student ID:</strong> ${currentStudent.studentId}</p>
                `;
                break;
        }
    }

    // --- System Theme Sync ---
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const updateTheme = (e) => document.documentElement.classList.toggle('dark', e.matches);
    darkModeMediaQuery.addEventListener('change', updateTheme);
    updateTheme(darkModeMediaQuery); // Initial check
});
