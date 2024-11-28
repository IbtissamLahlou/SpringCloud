import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const CourseDetails = () => {
  const { id } = useParams(); // Extract course ID from the URL params
  const [course, setCourse] = useState(null); // State to hold course details
  const [students, setStudents] = useState([]); // State to hold students enrolling the course
  const [filteredStudents, setFilteredStudents] = useState([]); // State to filter students by name
  const [searchName, setSearchName] = useState(""); // Search by name
  const [error, setError] = useState(null); // State to hold any errors

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        // Fetch course details from the course service
        const courseResponse = await axios.get(
          `http://localhost:8082/courses/${id}`
        );
        setCourse(courseResponse.data); // Save course details in state

        // Fetch students enrolled in the course from the enrollment service
        const studentsResponse = await axios.get(
          `http://localhost:8083/enrollments/course/${id}`
        );

        // Check if there are enrolled students, if not set an empty array
        if (
          studentsResponse.data.enrolledStudents &&
          studentsResponse.data.enrolledStudents.length > 0
        ) {
          setStudents(studentsResponse.data.enrolledStudents); // Save students' details in state
          setFilteredStudents(studentsResponse.data.enrolledStudents); // Set filtered students for search
        } else {
          setStudents([]); // No students enrolled, so set to empty array
          setFilteredStudents([]); // No students, so no filter
        }
      } catch (error) {
        setError(
          "Unable to fetch course details or students. Please try again."
        );
      }
    };

    fetchCourseDetails();
  }, [id]);

  // Filter students based on the search input
  useEffect(() => {
    if (searchName === "") {
      setFilteredStudents(students); // Show all students if no search term
    } else {
      const filtered = students.filter(
        (student) =>
          student.studentName.toLowerCase().includes(searchName.toLowerCase()) // Filter by student name
      );
      setFilteredStudents(filtered);
    }
  }, [searchName, students]);

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  if (!course) {
    return <div>Loading course details...</div>;
  }

  return (
    <div style={{ margin: "20px" }}>
      <h1>Course Details</h1>
      <p>
        <strong>ID:</strong> {course.id}
      </p>
      <p>
        <strong>Name:</strong> {course.name}
      </p>
      <p>
        <strong>Description:</strong> {course.description}
      </p>

      <h3>Students Enrolled in This Course:</h3>
      <div>
        <label htmlFor="searchName">Search by name: </label>
        <input
          type="text"
          id="searchName"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)} // Update search by name
          placeholder="Search by name"
          style={{
            padding: "8px",
            fontSize: "16px",
            width: "300px",
            marginBottom: "20px",
          }}
        />
      </div>

      {/* Table for enrolled students */}
      {filteredStudents.length === 0 ? (
        <p>No students are enrolled in this course yet.</p>
      ) : (
        <table
          style={{
            width: "80%", // Table takes 80% of the container width
            margin: "0 auto", // Center the table
            borderCollapse: "collapse",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
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
                Student ID
              </th>
              <th
                style={{
                  padding: "10px",
                  border: "1px solid #ddd",
                  textAlign: "center",
                }}
              >
                Student Name
              </th>
              <th
                style={{
                  padding: "10px",
                  border: "1px solid #ddd",
                  textAlign: "center",
                }}
              >
                Student Email
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr
                key={student.studentId}
                style={{
                  cursor: "pointer",
                  backgroundColor: "#f9f9f9",
                  transition: "background-color 0.3s",
                }}
                onClick={() =>
                  (window.location.href = `/students/${student.studentId}`)
                }
              >
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {student.studentId}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {student.studentName}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {student.studentEmail}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CourseDetails;
