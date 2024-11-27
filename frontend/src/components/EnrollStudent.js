import React, { useState, useEffect } from "react";
import axios from "axios";

const EnrollStudent = () => {
  const [studentId, setStudentId] = useState(""); // State for student ID
  const [courseId, setCourseId] = useState(""); // State for course ID
  const [studentName, setStudentName] = useState(""); // State for student name
  const [courseName, setCourseName] = useState(""); // State for course name
  const [error, setError] = useState(null); // State to hold error message
  const [success, setSuccess] = useState(null); // State to hold success message

  // Fetch student name based on studentId
  useEffect(() => {
    if (studentId) {
      axios
        .get(`http://localhost:8081/students/${studentId}`)
        .then((response) => {
          setStudentName(response.data.name); // Save student name in state
          setError(null); // Reset error if student found
        })
        .catch(() => {
          setStudentName(""); // Reset name if there's an error
          setError("No student found with this ID.");
        });
    } else {
      setStudentName(""); // Clear student name if studentId is cleared
      setError(null); // Clear error if studentId is cleared
    }
  }, [studentId]);

  // Fetch course name based on courseId
  useEffect(() => {
    if (courseId) {
      axios
        .get(`http://localhost:8082/courses/${courseId}`)
        .then((response) => {
          setCourseName(response.data.name); // Save course name in state
          setError(null); // Reset error if course found
        })
        .catch(() => {
          setCourseName(""); // Reset name if there's an error
          setError("No course found with this ID.");
        });
    } else {
      setCourseName(""); // Clear course name if courseId is cleared
      setError(null); // Clear error if courseId is cleared
    }
  }, [courseId]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (!studentId || !courseId) {
      setError("Both Student ID and Course ID are required.");
      return;
    }

    // Reset previous success and error messages
    setSuccess(null);
    setError(null);

    try {
      // Send a POST request to enroll the student in the course
      const response = await axios.post(
        `http://localhost:8083/enrollments/student/${studentId}/course/${courseId}`
      );

      // Reset form and display success message
      setStudentId("");
      setCourseId("");
      setStudentName("");
      setCourseName("");
      setSuccess("Student enrolled in the course successfully!");
    } catch (err) {
      setError("Failed to enroll the student. Please try again.");
    }
  };

  // Check if both student and course are valid
  const isFormValid = studentName && courseName && studentId && courseId;

  return (
    <div className="enroll-student-container">
      <h2>Enroll Student in Course</h2>

      {/* Display error or success messages */}
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {/* Enrollment form */}
      <form onSubmit={handleSubmit} className="enroll-student-form">
        <div className="form-group">
          <label htmlFor="studentId">Student ID:</label>
          <input
            type="number"
            id="studentId"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="Enter student ID"
            required
          />
          {studentName && (
            <p>
              <strong>Student Name:</strong> {studentName}
            </p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="courseId">Course ID:</label>
          <input
            type="number"
            id="courseId"
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            placeholder="Enter course ID"
            required
          />
          {courseName && (
            <p>
              <strong>Course Name:</strong> {courseName}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="submit-button"
          disabled={!isFormValid} // Disable button if form is not valid
        >
          Enroll Student
        </button>
      </form>

      {/* CSS Styles */}
      <style>
        {`
          .enroll-student-container {
            width: 100%;
            max-width: 500px;
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

          .form-group {
            margin-bottom: 15px;
          }

          .form-group label {
            font-weight: bold;
            display: block;
            margin-bottom: 5px;
          }

          .form-group input {
            width: 100%;
            padding: 5px;
            height:30px;
            font-size: 16px;
            border: 1px solid #ccc;
            border-radius: 5px;
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
