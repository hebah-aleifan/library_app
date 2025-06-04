import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";

import {
  Box,
    Header,
  Button,
  SpaceBetween,
   Container,
  Grid,
  Alert 
} from "@cloudscape-design/components";


const API_BASE = "https://hgh0wo65c1.execute-api.eu-west-1.amazonaws.com";

const BookList = () => {
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();
const location = useLocation();
const { alertMessage, alertType } = location.state || {};
  useEffect(() => {
    // Extract token from URL hash if it exists
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get("id_token");

    if (accessToken) {
      localStorage.setItem("token", accessToken);
      console.log("Token saved to localStorage");
      window.location.hash = ""; 
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in first.");
      navigate("/");
      return;
    }

    axios
      .get(`${API_BASE}/books`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setBooks(res.data))
      .catch((err) => {
        console.error("Error fetching books:", err);
        alert("Failed to fetch books");
      });
  }, [navigate]);

  useEffect(() => {
  if (alertMessage) {
    const timer = setTimeout(() => {
      navigate(location.pathname, { replace: true }); 
    }, 15000);

    return () => clearTimeout(timer);
  }
}, [alertMessage, navigate, location.pathname]);


  const handleDelete = async (bookId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${API_BASE}/books/${bookId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBooks(books.filter((b) => b.book_id !== bookId));
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete book");
    }
  };

  return (
   
    <Box padding="l">
      <SpaceBetween size="l">

        <Header
          variant="h1"
  actions={
    <SpaceBetween size="xs" direction="horizontal">
      <Link to="/add-book">
        <Button variant="primary">+ Add New Book</Button>
      </Link>
      <Button
        onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/";
        }}
      >
        Logout
      </Button>
    </SpaceBetween>
  }
        >
         

          Your Book List
        </Header>
{alertMessage && (
  <Alert type={alertType || "success"} statusIconAriaLabel={alertType}>
    {alertMessage}
  </Alert>
)}

        {books.length === 0 ? (
          <Box>No books found.</Box>
        ) : (
          <Grid gridDefinition={[{ colspan: 3 }, { colspan: 3 }, { colspan: 3 }, { colspan: 3 }]}>
            {books.map((book) => (
              <Container  key={book.book_id} header={book.title}>
                <SpaceBetween size="xs">
                  {book.cover_image_url ? (
                    <img
                      src={book.cover_image_url}
                      alt="cover"
                      style={{ width: "100%", height: "500px", objectFit: "cover", borderRadius: "4px" }}
                    />
                  ) : (
                    <Box>No image</Box>
                  )}
                  <Box variant="awsui-key-label">Author: {book.author}</Box>
                  <SpaceBetween direction="horizontal" size="xs">
                    <Button variant="" onClick={() => handleDelete(book.book_id)}>
                      Delete
                    </Button>
                    <Link to={`/edit-book/${book.book_id}`}>
                      <Button variant="">Edit</Button>
                    </Link>
                  </SpaceBetween>
                </SpaceBetween>
              </Container>
            ))}
          </Grid>
        )}
      </SpaceBetween>
    </Box>
  );
};
export default BookList;
