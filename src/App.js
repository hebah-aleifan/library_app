import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginButton from "./pages/LoginButton";
import Callback from "./pages/Callback";
import BookList from "./pages/BookList";
import AddBook from "./pages/AddBook";
import EditBook from "./pages/EditBook";
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginButton />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/booklist" element={<BookList />} />
        <Route path="/add-book" element={<AddBook />} />
        <Route path="/edit-book/:book_id" element={<EditBook />} />
      </Routes>
    </Router>
  );
}

export default App;
