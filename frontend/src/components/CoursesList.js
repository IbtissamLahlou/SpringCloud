import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const CoursesList = () => {
  const [courses, setCourses] = useState([]);
  const [searchId, setSearchId] = useState("");
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
    if (searchId === "") {
      setFilteredCourses(courses);
    } else {
      const filtered = courses.filter((course) =>
        course.id.toString().includes(searchId)
      );
      setFilteredCourses(filtered);
    }
  }, [searchId, courses]);

  return (
    <div>
      <h1>Liste des cours</h1>

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
        {filteredCourses.length === 0 ? (
          <li>No courses found.</li>
        ) : (
          filteredCourses.map((course) => (
            <li key={course.id}>
              <Link to={`/courses/${course.id}`}>
                <strong>
                  ID : {course.id}, {course.name}
                </strong>
              </Link>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default CoursesList;

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

  a:hover,
  a:focus {
    color: inherit;
  }
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
