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
} from "@cloudscape-design/components";

const API_BASE = "https://hgh0wo65c1.execute-api.eu-west-1.amazonaws.com";

const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

const AddBook = () => {
  const [alertMessage, setAlertMessage] = useState("");
const [alertType, setAlertType] = useState("info");
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

      setBook((prev) => ({ ...prev, cover_image_url: data.file_url }));
      alert("Image uploaded!");
       console.log("Uploaded file URL:", data.file_url);
    } catch (err) {
      console.error("Upload failed", err);
      alert("Failed to upload image");
    }
   
  };

const handleFileSelect = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (!allowedTypes.includes(file.type)) {
    setAlertMessage(" Only JPG, JPEG, and PNG files are allowed.");
    setAlertType("error");
    return;
  }

  setAlertMessage(""); 
  handleImageUpload(file);
};


  const handleSubmit = async () => {
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
      <Container header={<Header variant="h2">Add New Book</Header>}>
      
        <SpaceBetween size="l">
          <FormField label="Title">
            <Input
              value={book.title}
              onChange={(e) => setBook({ ...book, title: e.detail.value })}
            />
          </FormField>

          <FormField label="Author">
            <Input
              value={book.author}
              onChange={(e) => setBook({ ...book, author: e.detail.value })}
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
            {book.cover_image_url && (
              <img
                src={book.cover_image_url}
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
