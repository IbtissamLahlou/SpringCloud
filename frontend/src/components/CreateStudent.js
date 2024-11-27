import React, { useState } from "react";
import axios from "axios";

const CreateStudent = () => {
  const [name, setName] = useState(""); // State to hold student name
  const [email, setEmail] = useState(""); // State to hold student email
  const [error, setError] = useState(null); // State to hold any errors
  const [success, setSuccess] = useState(null); // State to hold success messages

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate input
    if (!name || !email) {
      setError("Both fields are required");
      return;
    }

    try {
      // Send POST request to create a new student
      const response = await axios.post("http://localhost:8081/students", {
        name,
        email,
      });

      // Reset form and show success message
      setName("");
      setEmail("");
      setSuccess("Student created successfully!");
      setError(null);
    } catch (err) {
      setError("Error creating student. Please try again.");
      setSuccess(null);
    }
  };

  return (
    <div className="create-student-container">
      <h2>Create a New Student</h2>

      {/* Show error or success messages */}
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {/* Student creation form */}
      <form onSubmit={handleSubmit} className="create-student-form">
        <div className="form-group">
          <label htmlFor="name">Student Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter student name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter student email"
            required
          />
        </div>

        <button type="submit" className="submit-button">
          Create Student
        </button>
      </form>

      {/* Adding the dynamic CSS styles */}
      <style>
        {`
          .create-student-container {
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

          .create-student-form {
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

          .form-group input {
            width: 100%;
            padding: 10px;
            font-size: 16px;
            border: 1px solid #ccc;
            border-radius: 5px;
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

export default CreateStudent;
