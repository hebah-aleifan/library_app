import React from "react";
import {
  Box,
  Button,
  Header,
  Container,
  SpaceBetween
} from "@cloudscape-design/components";


const LoginButton = () => {
  const clientId = "ca7762l5p5hjql0f6oj42mt4d";
  const domain = "hebalibrary.auth.eu-west-1.amazoncognito.com"; 
  const redirectUri = "http://localhost:3000/booklist";

  const handleLogin = () => {
    const loginUrl = `https://${domain}/login?client_id=${clientId}&response_type=token&scope=email+openid+profile&redirect_uri=${redirectUri}`;
    window.location.href = loginUrl;
  };
  return (
    <Box padding="xxl">
      <Container>
        <SpaceBetween size="l">
          <Header variant="h1"> Welcome to Heba Library</Header>
          <Button variant="primary" onClick={handleLogin}>
            Login 
          </Button>
        </SpaceBetween>
      </Container>
    </Box>
  );
};

export default LoginButton;
