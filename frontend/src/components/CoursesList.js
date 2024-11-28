import React, { useState, useEffect } from "react";
import axios from "axios";

const CoursesList = () => {
  const [courses, setCourses] = useState([]);
  const [searchName, setSearchName] = useState(""); // Search by course name
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://localhost:8082/courses");
        setCourses(response.data);
        setFilteredCourses(response.data);
      } catch (error) {
        setError("Error fetching courses data");
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    if (searchName === "") {
      setFilteredCourses(courses); // No search, show all courses
    } else {
      const filtered = courses.filter(
        (course) => course.name.toLowerCase().includes(searchName.toLowerCase()) // Filter by course name
      );
      setFilteredCourses(filtered);
    }
  }, [searchName, courses]);

  return (
    <div style={{ margin: "20px" }}>
      <h1>Liste des cours</h1>

      {error && <div style={{ color: "red" }}>{error}</div>}

      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="searchName">Recherche par nom: </label>
        <input
          type="text"
          id="searchName"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)} // Update search by name
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
      {filteredCourses.length === 0 ? (
        <p>No courses found.</p>
      ) : (
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
                Description
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredCourses.map((course) => (
              <tr
                key={course.id}
                style={{
                  cursor: "pointer",
                  backgroundColor: "#f9f9f9",
                  transition: "background-color 0.3s",
                }}
                onClick={() => (window.location.href = `/courses/${course.id}`)}
              >
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {course.id}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {course.name}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {course.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CoursesList;
