import React, { useState, useEffect } from "react";
import axios from "axios";

const EnrollmentsTable = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data from the API
    axios
      .get("http://localhost:8083/enrollments/flat")
      .then((response) => {
        setEnrollments(response.data); // Save the data in state
      })
      .catch((err) => {
        setError("Failed to load data. Please try again."); // Handle errors
      });
  }, []); // Run this effect once on mount

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  if (!enrollments.length) {
    return <div>Loading enrollments...</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Student Course Enrollments</h1>

      {/* Table to display enrollments */}
      <table
        style={{
          width: "80%",
          margin: "0 auto",
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
                backgroundColor: "#f4f4f4",
              }}
            >
              Enrollment ID
            </th>
            <th
              style={{
                padding: "10px",
                border: "1px solid #ddd",
                textAlign: "center",
                backgroundColor: "#f4f4f4",
              }}
            >
              Student Name
            </th>
            <th
              style={{
                padding: "10px",
                border: "1px solid #ddd",
                textAlign: "center",
                backgroundColor: "#f4f4f4",
              }}
            >
              Course Name
            </th>
            <th
              style={{
                padding: "10px",
                border: "1px solid #ddd",
                textAlign: "center",
                backgroundColor: "#f4f4f4",
              }}
            >
              Student Email
            </th>
            <th
              style={{
                padding: "10px",
                border: "1px solid #ddd",
                textAlign: "center",
                backgroundColor: "#f4f4f4",
              }}
            >
              Course Description
            </th>
          </tr>
        </thead>
        <tbody>
          {enrollments.map((enrollment) => (
            <tr
              key={enrollment.enrollmentId}
              style={{
                backgroundColor: "#fff",
                cursor: "pointer",
                transition: "background-color 0.3s ease",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#f1f1f1")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#fff")}
            >
              <td
                style={{
                  padding: "10px",
                  border: "1px solid #ddd",
                  textAlign: "center",
                }}
              >
                {enrollment.enrollmentId}
              </td>
              <td
                style={{
                  padding: "10px",
                  border: "1px solid #ddd",
                  textAlign: "center",
                }}
              >
                {enrollment.studentName}
              </td>
              <td
                style={{
                  padding: "10px",
                  border: "1px solid #ddd",
                  textAlign: "center",
                }}
              >
                {enrollment.courseName}
              </td>
              <td
                style={{
                  padding: "10px",
                  border: "1px solid #ddd",
                  textAlign: "center",
                }}
              >
                {enrollment.studentEmail}
              </td>
              <td
                style={{
                  padding: "10px",
                  border: "1px solid #ddd",
                  textAlign: "center",
                }}
              >
                {enrollment.courseDescription}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EnrollmentsTable;
