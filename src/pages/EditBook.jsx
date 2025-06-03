import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Button,
  Container,
  FormField,
  Input,
  Textarea,
  Header,
  SpaceBetween
} from "@cloudscape-design/components";
    const API_BASE ="https://hgh0wo65c1.execute-api.eu-west-1.amazonaws.com";

const EditBook = () => {

  const { book_id } = useParams();
  const [book, setBook] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
  const navigate = useNavigate();
  const [titleError, setTitleError] = useState("");
const [authorError, setAuthorError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get(`${API_BASE}/books`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then((res) => {
      const target = res.data.find((b) => b.book_id === book_id);
      setBook(target);
    });
  }, [book_id]);

  const handleUpdate = async () => {
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
  
   if (!file) return;

  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (!allowedTypes.includes(file.type)) {
    alert("Only JPG, JPEG, and PNG files are allowed.");
    return;
  }
    const token = localStorage.getItem("token");
    try {
      await axios.put(`${API_BASE}/books/${book_id}`, book, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
   
       navigate("/booklist", {
  state: { alertMessage: "Book updated successfully!", alertType: "success" }
}); 
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };
 const handleImageUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const token = localStorage.getItem("token");
  const ext = file.name.split('.').pop().toLowerCase();

  try {
    const { data } = await axios.get(`${API_BASE}/upload-url`, {
      params: { ext },
      headers: { Authorization: `Bearer ${token}` },
    });

    const { upload_url, file_url } = data;

    await axios.put(upload_url, file, {
      headers: { "Content-Type": file.type },
    });

    setBook({ ...book, cover_image_url: file_url });
    setPreviewUrl(file_url);
  } catch (err) {
    console.error("Image upload failed:", err);
    alert("Failed to upload image");
  }
};



  if (!book) return <p>Loading book...</p>;

   return (
    <Box padding="xl">
      <Container header={<Header variant="h2">Edit Book</Header>}>
        <SpaceBetween size="l">
          <FormField label="Title" errorText={titleError} >
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
              onChange={(e) =>{
                 setBook({ ...book, author: e.detail.value });
                       setAuthorError(""); 

                }}
              required
            />
          </FormField>
<FormField label="Cover Image">
  {previewUrl || book.cover_image_url ? (
    <img
      src={previewUrl || book.cover_image_url}
      alt="Cover Preview"
      style={{ width: "150px", marginBottom: "1rem", borderRadius: "8px" }}
    />
  ) : (
    <Box>No image</Box>
  )}
<input
    type="file"
    accept="image/*"
    onChange={handleImageUpload}
  />
</FormField>

          <FormField label="Description">
            <Textarea
              value={book.description}
              onChange={(e) => setBook({ ...book, description: e.detail.value })}
            />
          </FormField>

          <Button variant="primary" onClick={handleUpdate}>
            Save Changes
          </Button>
        </SpaceBetween>
      </Container>
    </Box>
  );
};
export default EditBook;
