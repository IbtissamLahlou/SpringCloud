import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function StudentDetails() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [courses, setCourses] = useState([]); // Store course details
  const [error, setError] = useState(null);

  // Fetch student details
  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8081/students/${id}`
        );
        setStudent(response.data); // Adjust for the API response structure
      } catch (error) {
        setError("Unable to fetch student details. Please try again.");
      }
    };

    fetchStudentDetails();
  }, [id]);

  // Fetch course details for the student
  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        if (student && student.courseIds && student.courseIds.length > 0) {
          const courseDetails = await Promise.all(
            student.courseIds.map((courseId) =>
              axios.get(`http://localhost:8082/courses/${courseId}`)
            )
          );
          setCourses(courseDetails.map((response) => response.data)); // Extract the data for each course
        }
      } catch (error) {
        console.error("Error fetching course details:", error);
      }
    };

    fetchCourseDetails();
  }, [student]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!student) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Student Details</h1>
      <p>
        <strong>ID:</strong> {student.id}
      </p>
      <p>
        <strong>Name:</strong> {student.name}
      </p>
      <p>
        <strong>Email:</strong> {student.email}
      </p>
      <h3>Courses</h3>
      <ul>
        {/* Display the course ID and course name */}
        {courses && courses.length > 0 ? (
          courses.map((course) => (
            <li key={course.id}>
              <strong>Course ID:</strong> {course.id},{" "}
              <strong>Course Name:</strong> {course.name}
            </li>
          ))
        ) : (
          <li>No courses enrolled</li>
        )}
      </ul>
    </div>
  );
}

export default StudentDetails;
