import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom"; // Import Navigate

import Header from "./components/Header";
import StudentList from "./components/StudentList"; // Import the StudentList component
import StudentDetails from "./components/StudentDetails"; // Import the StudentDetails component
import CoursesList from "./components/CoursesList";
import CourseDetails from "./CourseDetails";
import CreateCourse from "./components/CreateCourse";
import CreateStudent from "./components/CreateStudent";
import EnrollStudent from "./components/EnrollStudent";
import EnrollmentsTable from "./components/EnrollmentsTable";

function App() {
  return (
    <Router>
      <div>
        <Header />
        <Routes>
          {/* Add this route to automatically redirect from root to /students */}
          <Route path="/" element={<Navigate to="/students" />} />

          <Route path="/students" element={<StudentList />} />
          <Route path="/students/:id" element={<StudentDetails />} />
          <Route path="/courses" element={<CoursesList />} />
          <Route path="/courses/:id" element={<CourseDetails />} />
          <Route path="/create-course" element={<CreateCourse />} />
          <Route path="/create-student" element={<CreateStudent />} />
          <Route path="/enroll" element={<EnrollStudent />} />
          <Route path="/enroll-list" element={<EnrollmentsTable />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
