import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const CourseDetails = () => {
  const { id } = useParams(); // Extract course ID from the URL params
  const [course, setCourse] = useState(null); // State to hold course details
  const [students, setStudents] = useState([]); // State to hold students enrolling the course
  const [error, setError] = useState(null); // State to hold any errors

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        // Fetch course details
        const courseResponse = await axios.get(
          `http://localhost:8082/courses/${id}`
        );
        setCourse(courseResponse.data); // Save course details in state

        // Fetch students enrolled in the course (only IDs)
        const studentsResponse = await axios.get(
          `http://localhost:8081/students/courses/${id}`
        );

        // Now, fetch the full details for each student using their ID
        const studentDetails = await Promise.all(
          studentsResponse.data.map(async (studentId) => {
            const studentResponse = await axios.get(
              `http://localhost:8081/students/${studentId}`
            );
            return studentResponse.data; // Return full student details (id and name)
          })
        );

        setStudents(studentDetails); // Save enrolled students with full details in state
      } catch (error) {
        setError(
          "Unable to fetch course details or students. Please try again."
        );
      }
    };

    fetchCourseDetails();
  }, [id]);

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  if (!course) {
    return <div>Loading course details...</div>;
  }

  return (
    <div>
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
      {students.length > 0 ? (
        <ul>
          {students.map((student) => (
            <li key={student.id}>
              <strong>Student ID:</strong> {student.id},{" "}
              <strong>Student Name:</strong> {student.name}
            </li>
          ))}
        </ul>
      ) : (
        <p>No students are enrolled in this course yet.</p>
      )}
    </div>
  );
};

export default CourseDetails;
