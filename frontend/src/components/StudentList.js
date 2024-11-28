import React, { useState, useEffect } from "react";
import axios from "axios";

const StudentList = () => {
  const [students, setStudents] = useState([]); // All students
  const [searchName, setSearchName] = useState(""); // Search by name state
  const [filteredStudents, setFilteredStudents] = useState([]); // Filtered students based on search
  const [error, setError] = useState(null); // Error message state

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get("http://localhost:8081/students");
        setStudents(response.data);
        setFilteredStudents(response.data);
      } catch (error) {
        setError("Error fetching student data");
      }
    };

    fetchStudents();
  }, []);

  useEffect(() => {
    if (searchName === "") {
      setFilteredStudents(students);
    } else {
      const filtered = students.filter((student) =>
        student.name.toLowerCase().includes(searchName.toLowerCase())
      );
      setFilteredStudents(filtered);
    }
  }, [searchName, students]);

  return (
    <div style={{ margin: "20px" }}>
      <h1>Liste des étudiants</h1>

      {error && <div style={{ color: "red" }}>{error}</div>}

      {/* Search input */}
      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="searchName">Recherche par nom: </label>
        <input
          type="text"
          id="searchName"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          placeholder="Search by name"
          style={{
            padding: "8px",
            fontSize: "16px",
            width: "300px",
            marginLeft: "10px",
          }}
        />
      </div>

      {/* Table structure for students */}
      <table
        style={{
          width: "60%", // Set table width to 60%
          margin: "0 auto", // Center the table
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>ID</th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Name</th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Email</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.length === 0 ? (
            <tr>
              <td colSpan="3" style={{ padding: "10px", textAlign: "center" }}>
                No students found.
              </td>
            </tr>
          ) : (
            filteredStudents.map((student) => (
              <tr
                key={student.id}
                style={{
                  cursor: "pointer",
                  backgroundColor: "#f9f9f9",
                  transition: "background-color 0.3s",
                }}
                onClick={() =>
                  (window.location.href = `/students/${student.id}`)
                }
              >
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {student.id}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {student.name}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {student.email}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StudentList;
