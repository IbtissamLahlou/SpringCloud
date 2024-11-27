import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const CreateCourse = () => {
  const { id } = useParams(); // Extract course ID from the URL params
  const [name, setName] = useState(""); // State to hold course name
  const [description, setDescription] = useState(""); // State to hold course description
  const [error, setError] = useState(null); // State to hold any errors
  const [success, setSuccess] = useState(null); // State to hold success messages

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate input
    if (!name || !description) {
      setError("Both fields are required");
      return;
    }

    try {
      // Send POST request to create a new course
      const response = await axios.post("http://localhost:8082/courses", {
        name,
        description,
      });

      // Reset form and show success message
      setName("");
      setDescription("");
      setSuccess("Course created successfully!");
      setError(null);
    } catch (err) {
      setError("Error creating course. Please try again.");
      setSuccess(null);
    }
  };

  return (
    <div className="create-course-container">
      <h2>Create a New Course</h2>

      {/* Show error or success messages */}
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {/* Course creation form */}
      <form onSubmit={handleSubmit} className="create-course-form">
        <div className="form-group">
          <label htmlFor="name">Course Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter course name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter course description"
            required
          />
        </div>

        <button type="submit" className="submit-button">
          Create Course
        </button>
      </form>

      {/* Adding the dynamic CSS styles */}
      <style>
        {`
          .create-course-container {
            width: 100%;
            max-width: 500px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          }

          h2 {
            text-align: center;
            margin-bottom: 20px;
          }

          .create-course-form {
            display: flex;
            flex-direction: column;
          }

          .form-group {
            margin-bottom: 15px;
          }

          .form-group label {
            font-weight: bold;
            display: block;
            margin-bottom: 5px;
          }

          .form-group input,
          .form-group textarea {
            width: 100%;
            padding: 10px;
            font-size: 16px;
            border: 1px solid #ccc;
            border-radius: 5px;
          }

          .form-group textarea {
            resize: vertical;
            height: 100px;
          }

          .submit-button {
            padding: 10px;
            background-color: #007bff;
            color: white;
            font-size: 16px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
          }

          .submit-button:hover {
            background-color: #0056b3;
          }

          .error-message {
            background-color: #f8d7da;
            color: #721c24;
            padding: 10px;
            border-radius: 5px;
            margin-bottom: 15px;
          }

          .success-message {
            background-color: #d4edda;
            color: #155724;
            padding: 10px;
            border-radius: 5px;
            margin-bottom: 15px;
          }
        `}
      </style>
    </div>
  );
};

export default CreateCourse;
