import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [error, setError] = useState(null);

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
    if (searchId === "") {
      setFilteredStudents(students);
    } else {
      const filtered = students.filter((student) =>
        student.id.toString().includes(searchId)
      );
      setFilteredStudents(filtered);
    }
  }, [searchId, students]);

  return (
    <div>
      <h1>Liste des etudiants</h1>

      {error && <div style={{ color: "red" }}>{error}</div>}

      <div>
        <label htmlFor="searchId">Recherche par ID: </label>
        <input
          type="text"
          id="searchId"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
      </div>

      <ul>
        {filteredStudents.length === 0 ? (
          <li>No students found.</li>
        ) : (
          filteredStudents.map((student) => (
            <li key={student.id}>
              <Link to={`/students/${student.id}`}>
                <strong>
                  ID : {student.id}, {student.name}
                </strong>
              </Link>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default StudentList;

const styles = `
  li {
    list-style-type: none;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  a:visited {
    color: inherit;
  }
  a:visited {
    color: inherit;
  }

  a:hover,
  a:focus {
    color: inherit;
  }
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
