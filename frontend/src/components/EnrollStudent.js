import React, { useState, useEffect } from "react";
import axios from "axios";

const EnrollStudent = () => {
  const [students, setStudents] = useState([]); // State for all students
  const [courses, setCourses] = useState([]); // State for all courses
  const [studentId, setStudentId] = useState(null); // State for selected student ID
  const [courseId, setCourseId] = useState(null); // State for selected course ID
  const [selectedStudent, setSelectedStudent] = useState(null); // State to hold selected student
  const [selectedCourse, setSelectedCourse] = useState(null); // State to hold selected course
  const [searchStudentName, setSearchStudentName] = useState(""); // Search query for students
  const [searchCourseName, setSearchCourseName] = useState(""); // Search query for courses
  const [error, setError] = useState(null); // State to hold error message
  const [success, setSuccess] = useState(null); // State to hold success message

  // Fetch students and courses
  useEffect(() => {
    const fetchStudentsAndCourses = async () => {
      try {
        const studentResponse = await axios.get(
          "http://localhost:8081/students"
        );
        setStudents(studentResponse.data);
        const courseResponse = await axios.get("http://localhost:8082/courses");
        setCourses(courseResponse.data);
      } catch (error) {
        setError("Error fetching students or courses.");
      }
    };

    fetchStudentsAndCourses();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (!studentId || !courseId) {
      setError("Both Student and Course must be selected.");
      return;
    }

    setError(null); // Clear error on submit
    setSuccess(null); // Clear previous success message

    try {
      // Check if the student is already enrolled in the selected course
      const enrollmentCheck = await axios.get(
        `http://localhost:8083/enrollments/student/${studentId}`
      );

      // If student is already enrolled in the course, show an error
      const alreadyEnrolled = enrollmentCheck.data.enrollments.some(
        (enrollment) => enrollment.courseId === courseId
      );

      if (alreadyEnrolled) {
        setError("Student is already enrolled in this course.");
        return;
      }

      // Proceed to enroll the student if not already enrolled
      await axios.post(
        `http://localhost:8083/enrollments/student/${studentId}/course/${courseId}`
      );

      // Reset form and display success message
      setStudentId(null);
      setCourseId(null);
      setSelectedStudent(null);
      setSelectedCourse(null);
      setSuccess("Student successfully enrolled in the course!");
    } catch (err) {
      setError("Failed to enroll the student. Please try again.");
    }
  };

  // Filter students by name
  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchStudentName.toLowerCase())
  );

  // Filter courses by name
  const filteredCourses = courses.filter((course) =>
    course.name.toLowerCase().includes(searchCourseName.toLowerCase())
  );

  return (
    <div className="enroll-student-container">
      <h2>Enroll Student in Course</h2>

      {/* Display error or success messages */}
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {/* Enrollment form */}
      <form onSubmit={handleSubmit} className="enroll-student-form">
        <div className="search-container">
          {/* Search student by name */}
          <div className="search-group">
            <input
              type="text"
              placeholder="Search Student by Name"
              value={searchStudentName}
              onChange={(e) => setSearchStudentName(e.target.value)}
              className="search-input"
            />
            <div className="list-container">
              <h3>Select Student</h3>
              <div className="list">
                {filteredStudents.map((student) => (
                  <div
                    key={student.id}
                    className={`item ${
                      selectedStudent === student.id ? "selected" : ""
                    }`}
                    onClick={() => {
                      setSelectedStudent(student.id);
                      setStudentId(student.id);
                    }}
                  >
                    {student.name}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Search course by name */}
          <div className="search-group">
            <input
              type="text"
              placeholder="Search Course by Name"
              value={searchCourseName}
              onChange={(e) => setSearchCourseName(e.target.value)}
              className="search-input"
            />
            <div className="list-container">
              <h3>Select Course</h3>
              <div className="list">
                {filteredCourses.map((course) => (
                  <div
                    key={course.id}
                    className={`item ${
                      selectedCourse === course.id ? "selected" : ""
                    }`}
                    onClick={() => {
                      setSelectedCourse(course.id);
                      setCourseId(course.id);
                    }}
                  >
                    {course.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="submit-button"
          disabled={!studentId || !courseId} // Disable button if no student or course selected
        >
          Enroll Student
        </button>
      </form>

      {/* CSS Styles */}
      <style>
        {`
          .enroll-student-container {
            width: 100%;
            max-width: 800px;
            margin: 30px auto;
            padding: 20px;
            background-color: #f9f9f9;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          }

          h2 {
            text-align: center;
            margin-bottom: 20px;
          }

          .enroll-student-form {
            display: flex;
            flex-direction: column;
          }

          .search-container {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
          }

          .search-group {
            width: 45%;
          }

          .search-input {
            width: 100%;
            padding: 10px;
            margin-bottom: 15px;
            font-size: 16px;
            border-radius: 5px;
            border: 1px solid #ccc;
          }

          .list-container {
            padding: 10px;
            background-color: #f9f9f9;
            border-radius: 5px;
            border: 1px solid #ccc;
            max-height: 200px;
            overflow-y: auto;
          }

          .list {
            max-height: 200px;
            overflow-y: auto;
          }

          .item {
            padding: 10px;
            cursor: pointer;
            margin: 5px 0;
            background-color: #fff;
            border-radius: 5px;
            border: 1px solid #ddd;
          }

          .item:hover {
            background-color: #f1f1f1;
          }

          .item.selected {
            background-color: #007bff;
            color: white;
          }

          .submit-button {
            padding: 10px;
            background-color: #007bff;
            color: white;
            font-size: 16px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
          }

          .submit-button:hover {
            background-color: #0056b3;
          }

          .submit-button:disabled {
            background-color: #ccc;
            cursor: not-allowed;
          }

          .error-message {
            background-color: #f8d7da;
            color: #721c24;
            padding: 10px;
            border-radius: 5px;
            margin-bottom: 15px;
          }

          .success-message {
            background-color: #d4edda;
            color: #155724;
            padding: 10px;
            border-radius: 5px;
            margin-bottom: 15px;
          }
        `}
      </style>
    </div>
  );
};

export default EnrollStudent;
