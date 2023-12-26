import React, { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./PostQuestion.css";
const BackendURL = "http://localhost:3000";

const PostQuestionForm = () => {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [files, setFiles] = useState(null);

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("id", id);
    formData.append("name", name);
    formData.append("questionText", questionText);

    if (files) {
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }
    }

    try {
      const response = await fetch(`${BackendURL}/new`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Files uploaded successfully:", data.savedQuery);
        // Handle success, e.g., show a success message or redirect
      } else {
        console.error("Error uploading files");
        // Handle error, e.g., show an error message
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Card>
      <Card.Body>
        <Form onSubmit={handleFormSubmit}>
          <Form.Group className="mb-3" controlId="formId">
            <Form.Label>ID</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your ID"
              onChange={(e) => setId(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your name"
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formQuestionText">
            <Form.Label style={{ marginTop: "10%" }}>Question Text</Form.Label>
            <ReactQuill
              theme="snow"
              value={questionText}
              onChange={setQuestionText}
              style={{
                height: "200px",
                width: "60%",
                marginBottom: "10px",
                marginLeft: "20%",
                marginTop: "10%",
              }}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formFileMultiple">
            <Form.Label>Upload Files</Form.Label>
            <Form.Control type="file" multiple onChange={handleFileChange} />
          </Form.Group>

          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default PostQuestionForm;
