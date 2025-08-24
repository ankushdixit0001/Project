document.addEventListener('DOMContentLoaded', async () => {
    // Authentication Guard
    if (sessionStorage.getItem('authRole') !== 'student' || !sessionStorage.getItem('loggedInStudentId')) {
        window.location.href = 'login.html';
        return;
    }

    const dashboardSection = document.getElementById('student-dashboard');
    const loadingSpinner = document.getElementById('loading-spinner');
    const logoutButton = document.getElementById('logout-button');
    let currentStudent = null;

    try {
        const response = await fetch('students.json');
        const studentsDB = await response.json();
        const loggedInStudentId = sessionStorage.getItem('loggedInStudentId');
        currentStudent = studentsDB.find(s => s.id === loggedInStudentId);
        
        if (currentStudent) {
            displayDashboard(currentStudent);
        } else {
            // If student ID from session is not found in DB, logout
            sessionStorage.clear();
            window.location.href = 'login.html';
        }
    } catch (error) {
        console.error('Failed to load student data:', error);
        alert('Could not load student data. Please try again.');
        window.location.href = 'login.html';
    }
    
    // --- Logout Logic ---
    logoutButton.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default link behavior
        sessionStorage.clear(); // Clear all session data
        window.location.href = 'login.html';
    });

    // --- Display Dashboard Function ---
    function displayDashboard(student) {
        document.getElementById('student-name').textContent = student.name;
        document.getElementById('student-id-display').textContent = student.studentId;
        loadingSpinner.style.display = 'none';
        dashboardSection.classList.remove('hidden');
    }
    
    // --- Modal Logic (unchanged from previous version) ---
    // ... (keep the existing modal logic here)
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
});