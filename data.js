// data.js - Persistent Database using LocalStorage

const STORAGE_KEY = 'disha_bharti_db_v1';

// Initial Data (Used only if storage is empty)
const INITIAL_DATA = {
    students: [
        "Aarav Sharma", "Ankush", "Arjun Singh", "Reyansh Gupta", "Muhammad Ali",
        "Priya Singh", "Neha Rani", "Rahul Verma", "Amit Kumar", "Sumit Singh"
    ].map((name, index) => {
        const courses = ["B.Tech CSE", "BBA", "BCA"];
        const course = courses[index % 3];
        const totalFees = course === "B.Tech CSE" ? 75000 : 55000;
        const paid = [10000, 25000, 40000, 55000][index % 4];
        return {
            id: `DBC25${(index + 1).toString().padStart(4, '0')}`,
            name: name,
            course: course,
            email: `${name.split(' ')[0].toLowerCase()}@example.com`,
            phone: `+91 98${Math.floor(10000000 + Math.random() * 90000000)}`,
            dob: `200${index % 5}-0${(index % 9) + 1}-15`,
            address: "Saharanpur, UP",
            gpa: (7 + (index % 30) / 10).toFixed(1),
            attendance: 65 + (index % 35),
            totalFees: totalFees,
            amountPaid: paid,
            enrolledCourses: [] // Will be populated by ID
        };
    }),
    courses: [
        { id: 'CS-301', title: 'Data Structures & Algorithms', faculty: 'Prof. Anjali Sharma', credits: 4, students: 120, capacity: 150, syllabus: ['Intro to Complexity', 'Arrays & Lists', 'Stacks & Queues', 'Trees & Graphs'] },
        { id: 'MA-205', title: 'Advanced Calculus', faculty: 'Prof. Rajesh Kumar', credits: 3, students: 85, capacity: 100, syllabus: ['Limits & Continuity', 'Derivatives', 'Integrals'] },
        { id: 'PHY-210', title: 'Quantum Physics', faculty: 'Dr. S. Verma', credits: 4, students: 45, capacity: 60, syllabus: ['Wave-Particle Duality', 'Schrödinger Equation'] },
        { id: 'HU-101', title: 'Professional Communication', faculty: 'Dr. Meenakshi Gupta', credits: 2, students: 150, capacity: 150, syllabus: ['Verbal & Non-Verbal', 'Presentation Skills'] },
    ],
    faculty: [
        { id: 'FAC001', name: 'Dr. Anjali Sharma', department: 'Computer Science', email: 'asharma@dishabharti.ac.in' },
        { id: 'FAC002', name: 'Prof. Rajesh Kumar', department: 'Business Admin', email: 'rkumar@dishabharti.ac.in' },
        { id: 'FAC003', name: 'Dr. S. Verma', department: 'Physics', email: 'sverma@dishabharti.ac.in' },
    ]
};

// --- DATABASE MANAGER ---
const DB = {
    init: () => {
        if (!localStorage.getItem(STORAGE_KEY)) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DATA));
        }
    },
    getData: () => {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : INITIAL_DATA;
    },
    saveData: (data) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    },
    // Helpers to get specific lists
    getStudents: () => DB.getData().students,
    getCourses: () => DB.getData().courses,
    getFaculty: () => DB.getData().faculty
};

// Initialize on load
DB.init();

// Global Variable for compatibility with your existing scripts
// Note: Pages should use DB.getData() to get fresh data, but this provides a snapshot
const GLOBAL_STUDENTS = DB.getStudents();