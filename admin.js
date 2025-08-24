document.addEventListener('DOMContentLoaded', () => {
    if (sessionStorage.getItem('authRole') !== 'admin') { window.location.href = 'login.html'; return; }

    let students = [];
    let courses = [];
    let currentStudentId = null;
    let currentCourseId = null;

    const studentModal = document.getElementById('student-modal');
    const courseModal = document.getElementById('course-modal');

    const showToast = (message) => {
        const toast = document.getElementById('toast');
        toast.textContent = message; toast.className = "show";
        setTimeout(() => { toast.className = toast.className.replace("show", ""); }, 3000);
    };
    const show = (el) => el.classList.remove('hidden');
    const hide = (el) => el.classList.add('hidden');

    const loadData = async () => {
        try {
            const studentsRes = await fetch('students.json');
            const coursesRes = await fetch('courses.json');
            const defaultStudents = await studentsRes.json();
            const defaultCourses = await coursesRes.json();
            students = JSON.parse(localStorage.getItem('studentsData')) || defaultStudents;
            courses = JSON.parse(localStorage.getItem('coursesData')) || defaultCourses;
            updateDashboard();
        } catch (error) { console.error("Failed to load initial data:", error); }
    };

    const saveData = () => {
        localStorage.setItem('studentsData', JSON.stringify(students));
        localStorage.setItem('coursesData', JSON.stringify(courses));
        updateDashboard();
    };

    const updateDashboard = () => {
        renderStudents();
        renderCourses();
        updateAnalytics();
    };

    const updateAnalytics = () => {
        document.getElementById('total-students').textContent = students.length;
        document.getElementById('total-courses').textContent = courses.length;
        const totalCollected = students.reduce((sum, s) => sum + (s.fees.paid || 0), 0);
        const totalDues = students.reduce((sum, s) => sum + (s.fees.due || 0), 0);
        document.getElementById('fees-collected').textContent = `₹${totalCollected.toLocaleString('en-IN')}`;
        document.getElementById('outstanding-dues').textContent = `₹${totalDues.toLocaleString('en-IN')}`;
    };

    const renderStudents = () => {
        const filter = document.getElementById('search-input').value.toLowerCase();
        const filteredStudents = students.filter(s => s.name.toLowerCase().includes(filter) || s.email.toLowerCase().includes(filter));
        document.getElementById('students-table-body').innerHTML = filteredStudents.map(student => `
            <tr class="border-b dark:border-gray-700">
                <td class="p-3">${student.studentId}</td>
                <td class="p-3">${student.name}</td>
                <td class="p-3">${student.email}</td>
                <td class="p-3 text-center">
                    <button class="view-btn btn btn-success text-sm" data-id="${student.id}"><i class="fas fa-eye mr-1"></i>View</button>
                    <button class="delete-btn btn btn-danger text-sm ml-2" data-id="${student.id}"><i class="fas fa-trash mr-1"></i>Delete</button>
                </td>
            </tr>
        `).join('');
    };
    
    const renderCourses = () => {
        document.getElementById('courses-list').innerHTML = courses.map(course => `
            <div class="flex justify-between items-center p-2 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 rounded">
                <span>${course.name} (${course.courseCode})</span>
                <div>
                    <button class="edit-course-btn icon-btn" data-id="${course.id}"><i class="fas fa-pen"></i></button>
                    <button class="delete-course-btn icon-btn text-red-500 ml-2" data-id="${course.id}"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `).join('');
    };

    const openStudentModal = (studentId) => {
        currentStudentId = studentId;
        const student = students.find(s => s.id === studentId);
        document.getElementById('modal-title').textContent = student ? `Details for ${student.name}` : 'Add New Student';

        ['profile-form', 'fees-form', 'results-form', 'library-form'].forEach(id => document.getElementById(id).reset());

        if (student) {
            document.getElementById('student-name-input').value = student.name;
            document.getElementById('student-email-input').value = student.email;
            document.getElementById('total-fees-input').value = student.fees.total;
            document.getElementById('paid-fees-input').value = student.fees.paid;
            document.getElementById('due-fees-input').value = student.fees.due;
            renderStudentCourses(student);
            renderStudentResults(student);
            renderStudentLibrary(student);
        } else {
             document.getElementById('total-fees-input').value = 50000;
             document.getElementById('paid-fees-input').value = 0;
             document.getElementById('due-fees-input').value = 50000;
             renderStudentCourses({ registration: { courses: [] } });
             renderStudentResults({ results: {} });
             renderStudentLibrary({ library: { issued: [], fines: 0 } });
        }
        switchTab('profile');
        show(studentModal);
    };

    const saveStudentChanges = () => {
        const nameInput = document.getElementById('student-name-input');
        const emailInput = document.getElementById('student-email-input');
        if (!nameInput.value || !emailInput.value) {
            showToast("Student Name and Email are required.");
            return;
        }

        const password = document.getElementById('student-password-input').value;
        const paidFees = parseInt(document.getElementById('paid-fees-input').value, 10);
        const fines = parseInt(document.getElementById('fines-input').value, 10);
        
        if (currentStudentId) {
            const student = students.find(s => s.id === currentStudentId);
            student.name = nameInput.value;
            student.email = emailInput.value;
            if (password) student.password = password;
            student.fees.paid = paidFees;
            student.fees.due = student.fees.total - paidFees;
            student.library.fines = fines;
        } else {
            const totalFees = parseInt(document.getElementById('total-fees-input').value, 10);
            students.push({
                id: `user${Date.now()}`, name: nameInput.value, email: emailInput.value, password: password || "password123",
                studentId: String(Math.floor(100000 + Math.random() * 900000)),
                fees: { total: totalFees, paid: paidFees, due: totalFees - paidFees },
                registration: { status: 'Completed', courses: [] },
                results: {}, library: { issued: [], fines: 0 },
            });
        }
        saveData();
        hide(studentModal);
        showToast(`Student ${currentStudentId ? 'updated' : 'added'} successfully!`);
    };

    const switchTab = (tabId) => {
        document.querySelectorAll('#modal-tabs .tab-button').forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tabId));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.toggle('active', content.id === `${tabId}-tab`));
    };

    const renderStudentCourses = (student) => {
        const enrolledIds = student.registration.courses;
        document.getElementById('enrolled-courses-list').innerHTML = courses.filter(c => enrolledIds.includes(c.id)).map(c => `<div class="flex justify-between items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">${c.name} <button class="unenroll-btn icon-btn text-red-500" data-course-id="${c.id}"><i class="fas fa-minus-circle"></i></button></div>`).join('') || '<p class="text-gray-400">No courses enrolled.</p>';
        document.getElementById('available-courses-list').innerHTML = courses.filter(c => !enrolledIds.includes(c.id)).map(c => `<div class="flex justify-between items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">${c.name} <button class="enroll-btn icon-btn text-green-500" data-course-id="${c.id}"><i class="fas fa-plus-circle"></i></button></div>`).join('') || '<p class="text-gray-400">No more courses available.</p>';
    };
    
    const renderStudentResults = (student) => {
        document.getElementById('results-list').innerHTML = Object.entries(student.results).map(([semester, grade]) => `<div class="flex justify-between items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">${semester}: <strong>${grade}</strong> <button class="delete-result-btn icon-btn text-red-500" data-semester="${semester}"><i class="fas fa-trash"></i></button></div>`).join('') || '<p class="text-gray-400">No results added.</p>';
    };
    
    const renderStudentLibrary = (student) => {
        document.getElementById('issued-books-list').innerHTML = student.library.issued.map(book => `<div class="flex justify-between items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">${book} <button class="return-book-btn icon-btn text-red-500" data-book="${book}"><i class="fas fa-undo"></i></button></div>`).join('') || '<p class="text-gray-400">No books issued.</p>';
        document.getElementById('fines-input').value = student.library.fines;
    };
    
    const openCourseModal = (courseId) => {
        currentCourseId = courseId;
        const course = courses.find(c => c.id === courseId);
        document.getElementById('course-modal-title').textContent = course ? 'Edit Course' : 'Add New Course';
        document.getElementById('course-form').reset();
        if(course) {
            document.getElementById('course-name-input').value = course.name;
            document.getElementById('course-code-input').value = course.courseCode;
            document.getElementById('course-credits-input').value = course.credits;
        }
        show(courseModal);
    };

    const saveCourseChanges = (e) => {
        e.preventDefault();
        const name = document.getElementById('course-name-input').value;
        const courseCode = document.getElementById('course-code-input').value;
        const credits = parseInt(document.getElementById('course-credits-input').value, 10);
        if (currentCourseId) {
            const course = courses.find(c => c.id === currentCourseId);
            course.name = name; course.courseCode = courseCode; course.credits = credits;
        } else {
            courses.push({ id: `course${Date.now()}`, name, courseCode, credits });
        }
        saveData();
        hide(courseModal);
        showToast(`Course ${currentCourseId ? 'updated' : 'added'}!`);
    };
    
    document.body.addEventListener('click', e => {
        if (e.target.closest('.view-btn')) openStudentModal(e.target.closest('.view-btn').dataset.id);
        if (e.target.closest('.delete-btn')) {
            if (confirm('Are you sure you want to delete this student?')) {
                students = students.filter(s => s.id !== e.target.closest('.delete-btn').dataset.id);
                saveData(); showToast('Student deleted.');
            }
        }
        if (e.target.closest('.edit-course-btn')) openCourseModal(e.target.closest('.edit-course-btn').dataset.id);
        if (e.target.closest('.delete-course-btn')) {
             if (confirm('Are you sure you want to delete this course?')) {
                courses = courses.filter(c => c.id !== e.target.closest('.delete-course-btn').dataset.id);
                saveData(); showToast('Course deleted.');
            }
        }
        if (e.target.matches('.tab-button')) switchTab(e.target.dataset.tab);
        if (e.target.matches('.enroll-btn, .enroll-btn *')) {
            const courseId = e.target.closest('.enroll-btn').dataset.courseId;
            students.find(s=>s.id === currentStudentId).registration.courses.push(courseId);
            renderStudentCourses(students.find(s=>s.id === currentStudentId));
        }
         if (e.target.matches('.unenroll-btn, .unenroll-btn *')) {
            if(confirm('Unenroll student from this course?')){
                const courseId = e.target.closest('.unenroll-btn').dataset.courseId;
                let student = students.find(s=>s.id === currentStudentId);
                student.registration.courses = student.registration.courses.filter(cId => cId !== courseId);
                renderStudentCourses(student);
            }
        }
        if (e.target.matches('.return-book-btn, .return-book-btn *')) {
             const bookTitle = e.target.closest('.return-book-btn').dataset.book;
             let student = students.find(s=>s.id === currentStudentId);
             student.library.issued = student.library.issued.filter(b => b !== bookTitle);
             renderStudentLibrary(student);
        }
    });

    document.getElementById('course-form').addEventListener('submit', saveCourseChanges);
    document.getElementById('results-form').addEventListener('submit', e => {
        e.preventDefault();
        const semester = document.getElementById('semester-input').value;
        const grade = document.getElementById('grade-input').value;
        if(semester && grade) {
            students.find(s=>s.id === currentStudentId).results[semester] = grade;
            renderStudentResults(students.find(s=>s.id === currentStudentId));
            e.target.reset();
        }
    });
    document.getElementById('library-form').addEventListener('submit', e => {
        e.preventDefault();
        const book = document.getElementById('book-input').value;
        if(book) {
            students.find(s=>s.id === currentStudentId).library.issued.push(book);
            renderStudentLibrary(students.find(s=>s.id === currentStudentId));
            e.target.reset();
        }
    });

    document.getElementById('add-student-btn').addEventListener('click', () => openStudentModal(null));
    document.getElementById('add-course-btn').addEventListener('click', () => openCourseModal(null));
    document.getElementById('save-all-changes-btn').addEventListener('click', saveStudentChanges);
    document.getElementById('close-modal-btn').addEventListener('click', () => hide(studentModal));
    document.getElementById('cancel-btn').addEventListener('click', () => hide(studentModal));
    document.getElementById('cancel-course-btn').addEventListener('click', () => hide(courseModal));
    document.getElementById('search-input').addEventListener('input', renderStudents);
    document.getElementById('reset-data-btn').addEventListener('click', () => {
        if (confirm('Are you sure you want to reset all data to default? This cannot be undone.')) {
            localStorage.removeItem('studentsData'); localStorage.removeItem('coursesData');
            loadData(); showToast('Data has been reset.');
        }
    });
    document.getElementById('export-csv-btn').addEventListener('click', () => {
        const headers = ["StudentID", "Name", "Email", "TotalFees", "PaidFees", "DueFees", "Courses", "Fines"];
        const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n"
            + students.map(s => `"${s.studentId}","${s.name}","${s.email}",${s.fees.total},${s.fees.paid},${s.fees.due},"${s.registration.courses.join('; ')}",${s.library.fines}`).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "students_export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast('CSV export started.');
    });

    loadData();
});