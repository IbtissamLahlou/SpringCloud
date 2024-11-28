import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function StudentDetails() {
  const { id } = useParams(); // Get student ID from URL params
  const [student, setStudent] = useState(null); // State to store student details
  const [courses, setCourses] = useState([]); // State to store course details (only if the student is enrolled)
  const [searchCourseName, setSearchCourseName] = useState(""); // State for course name search
  const [filteredCourses, setFilteredCourses] = useState([]); // State for filtered courses
  const [error, setError] = useState(null); // State to store error messages

  // Fetch student details from /students/{id}
  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        // Fetch student basic details from the student service
        const studentResponse = await axios.get(
          `http://localhost:8081/students/${id}`
        );
        setStudent(studentResponse.data); // Store the student data
      } catch (error) {
        setError("Unable to fetch student details. Please try again.");
      }
    };

    fetchStudentDetails();
  }, [id]); // Run the effect when the component mounts or when id changes

  // Fetch course details for the student if they are enrolled in any course
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        if (student) {
          // Fetch courses from the enrollment service
          const enrollmentResponse = await axios.get(
            `http://localhost:8083/enrollments/student/${id}`
          );

          // If the student is enrolled in any courses, set the courses state
          if (enrollmentResponse.data.enrollments.length > 0) {
            setCourses(enrollmentResponse.data.enrollments);
            setFilteredCourses(enrollmentResponse.data.enrollments); // Initialize filteredCourses
          }
        }
      } catch (error) {
        console.error("Error fetching course details:", error);
      }
    };

    fetchCourses();
  }, [student, id]); // Run this effect when student data is available

  // Filter courses by name
  useEffect(() => {
    if (searchCourseName === "") {
      setFilteredCourses(courses); // Show all courses if search is empty
    } else {
      const filtered = courses.filter((course) =>
        course.courseName.toLowerCase().includes(searchCourseName.toLowerCase())
      );
      setFilteredCourses(filtered); // Filter courses by name
    }
  }, [searchCourseName, courses]);

  if (error) {
    return <div>{error}</div>; // Display error message if there is one
  }

  if (!student) {
    return <div>Loading student details...</div>; // Show loading message while fetching data
  }

  return (
    <div style={{ margin: "20px" }}>
      <h1>Student Details</h1>
      <p>
        <strong>Student ID:</strong> {student.studentId}
      </p>
      <p>
        <strong>Name:</strong> {student.name}
      </p>
      <p>
        <strong>Email:</strong> {student.email}
      </p>

      <h3>Enrolled Courses</h3>

      {/* Search for courses */}
      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="searchCourseName">Search by Course Name: </label>
        <input
          type="text"
          id="searchCourseName"
          value={searchCourseName}
          onChange={(e) => setSearchCourseName(e.target.value)}
          placeholder="Search course name"
          style={{
            padding: "8px",
            fontSize: "16px",
            width: "300px",
            marginLeft: "10px",
          }}
        />
      </div>

      {/* Table for courses */}
      {courses.length > 0 ? (
        <table
          style={{
            width: "60%", // Set table width to 60%
            margin: "0 auto", // Center the table
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  padding: "10px",
                  border: "1px solid #ddd",
                  textAlign: "center",
                }}
              >
                Course ID
              </th>
              <th
                style={{
                  padding: "10px",
                  border: "1px solid #ddd",
                  textAlign: "center",
                }}
              >
                Course Name
              </th>
              <th
                style={{
                  padding: "10px",
                  border: "1px solid #ddd",
                  textAlign: "center",
                }}
              >
                Course Description
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredCourses.length === 0 ? (
              <tr>
                <td
                  colSpan="3"
                  style={{ textAlign: "center", padding: "10px" }}
                >
                  No courses found.
                </td>
              </tr>
            ) : (
              filteredCourses.map((course) => (
                <tr
                  key={course.courseId}
                  style={{
                    cursor: "pointer",
                    backgroundColor: "#f9f9f9",
                    transition: "background-color 0.3s",
                  }}
                  onClick={() =>
                    (window.location.href = `/courses/${course.courseId}`)
                  }
                >
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {course.courseId}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {course.courseName}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {course.courseDescription}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      ) : (
        <p>This student is not enrolled in any courses.</p>
      )}
    </div>
  );
}

export default StudentDetails;
