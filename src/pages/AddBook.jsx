import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  FormField,
  Input,
  Textarea,
  Button,
  Container,
  SpaceBetween,
  Header,
  Alert
} from "@cloudscape-design/components";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

const AddBook = () => {
  const [titleError, setTitleError] = useState("");
  const [authorError, setAuthorError] = useState("");
  const [imageValid, setImageValid] = useState(true);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("error");
  const [previewUrl, setPreviewUrl] = useState("");
  const [book, setBook] = useState({
    title: "",
    author: "",
    description: "",
    user_id: "",
    cover_image_url: ""
  });
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    const payload = parseJwt(token);
    console.log("JWT PAYLOAD:", payload);
    const userEmail = payload?.email || "anonymous";
    setBook((prev) => ({ ...prev, user_id: userEmail }));
  }, []);

  const handleImageUpload = async (file) => {
    const token = localStorage.getItem("token");


    if (!file) return;

    try {
      const ext = file.name.split(".").pop();

      const { data } = await axios.get(`${API_BASE}/upload-url`, {
        params: { ext },
        headers: { Authorization: `Bearer ${token}` },

      });

      await axios.put(data.upload_url, file, {
        headers: { "Content-Type": file.type }
      });

      setBook((prev) => ({ ...prev, cover_image_url: data.file_key }));
      const res = await axios.get(`${API_BASE}/image-url`, {
        params: { key: data.file_key },
        headers: { Authorization: `Bearer ${token}` }
      });
      setPreviewUrl(res.data.url);

      setAlertMessage("Image uploaded successfully.");
      setAlertType("success");
      console.log("Uploaded file URL:", data.file_key);
    } catch (err) {
  console.error("Upload failed", err.response?.data || err.message || err);
      setAlertMessage("Failed to upload image");
      setAlertType("error");

      setImageValid(false);
    }

  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      setAlertMessage(" Only JPG, JPEG, and PNG files are allowed.");
      setAlertType("error");
      setImageValid(false);

      return;
    }
    setImageValid(true);
    setAlertMessage("");
    handleImageUpload(file);
  };


  const handleSubmit = async () => {
    if (!imageValid) {
      setAlertMessage("Please upload a valid image file (JPG, JPEG, PNG).");
      setAlertType("error");
      return;
    }


    let hasError = false;

    if (!book.title) {
      setTitleError("Title is required");
      hasError = true;
    } else {
      setTitleError("");
    }

    if (!book.author) {
      setAuthorError("Author is required");
      hasError = true;
    } else {
      setAuthorError("");
    }

    if (hasError) return;

    const token = localStorage.getItem("token");

    try {
      await axios.post(`${API_BASE}/books`, book, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      navigate("/booklist", {
        state: { alertMessage: "Book added successfully!", alertType: "success" }
      });

    } catch (err) {
      console.error("Add failed", err);
      setAlertMessage("Failed to add book");
      setAlertType("error");

    }
  };

  return (
    <Box padding="xl">
      {alertMessage && (
        <Box margin={{ bottom: "s" }}>
          <Alert
            style={{
              padding: "12px",
              backgroundColor: alertType === "success" ? "#d1e7dd" : "",
              color: alertType === "success" ? "#0f5132" : "#842029",
              borderRadius: "6px"
            }}
          >
            {alertMessage}
          </Alert>
        </Box>
      )}

      <Container header={<Header variant="h2">Add New Book</Header>}>

        <SpaceBetween size="l">
          <FormField label="Title" errorText={titleError}>
            <Input
              value={book.title}
              onChange={(e) => {
                setBook({ ...book, title: e.detail.value });
                setTitleError("");
              }}
              required
            />
          </FormField>

          <FormField label="Author" errorText={authorError}>
            <Input
              value={book.author}
              onChange={(e) => {
                setBook({ ...book, author: e.detail.value });
                setAuthorError("");
              }}
              required
            />
          </FormField>

          <FormField label="Description">
            <Textarea
              value={book.description}
              onChange={(e) => setBook({ ...book, description: e.detail.value })}
            />
          </FormField>

          <FormField label="Cover Image">
            <input type="file" accept="image/*" onChange={handleFileSelect} />
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Cover"
                style={{ width: "100px", marginTop: "1rem", borderRadius: "6px" }}
              />
            )}
          </FormField>

          <Button variant="primary" onClick={handleSubmit}>
            Submit Book
          </Button>
        </SpaceBetween>
      </Container>
    </Box>
  );
};

export default AddBook;
