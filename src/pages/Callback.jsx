import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const token = params.get("access_token");

    console.log("Hash:", hash); // Debug
    console.log("Token:", token); // Debug

    if (token) {
      localStorage.setItem("token", token);
      console.log("Token saved to localStorage");
      navigate("/booklist");
    } else {
      alert("Authentication failed: no token");
      navigate("/");
    }
  }, [navigate]);

  return <p>Logging in...</p>;
};

export default Callback;
