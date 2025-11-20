// data.js - Ye file database ka kaam karegi

// 50 Indian Names List
const studentNames = [
    "Aarav Sharma", "Vihaan Verma", "Arjun Singh", "Reyansh Gupta", "Muhammad Ali", "Sai Kumar", "Arnav Mehta", "Ayan Khan", "Krishna Das", "Ishan Malhotra", 
    "Shaurya Jain", "Atharv Reddy", "Advik Joshi", "Pranav Mishra", "Adhrit Saxena", "Aamir Hussain", "Kabir Chauhan", "Ritvik Bhatia", "Darsh Agarwal", "Rudra Pandey",
    "Sara Kaur", "Saanvi Nair", "Aadhya Patel", "Kiara Rawat", "Diya Yadav", "Pihu Srivastava", "Myra Kapoor", "Ananya Iyer", "Aadya Hegde", "Amayra Choudhury",
    "Saira Sheikh", "Pari Deshmukh", "Kashvi Joshi", "Aayat Siddiqui", "Sneha Rao", "Riya Roy", "Pooja Tiwari", "Neha Rani", "Anjali Dubey", "Priya Singh", 
    "Rahul Verma", "Amit Kumar", "Sumit Singh", "Rohini Saxena", "Vikas Malhotra", "Sanjay Gupta", "Deepak Sharma", "Manish Pandey", "Ravi Kishan", "Nisha Yadav"
];

const courses = ["B.Tech CSE", "BBA", "BCA"];

// Function to generate 50 students automatically
function getStudentsData() {
    return studentNames.map((name, index) => {
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
            attendance: 65 + (index % 35), // Random attendance between 65% and 100%
            totalFees: totalFees,
            amountPaid: paid,
            balance: totalFees - paid,
            enrolledCourses: [course.split(' ')[0] + '101']
        };
    });
}

// Data ko global variable mein store kar diya taaki baaki pages use kar sakein
const GLOBAL_STUDENTS = getStudentsData();