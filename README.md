
📚   HebaLibrary

🔗 [Live Demo on AWS Amplify](https://main.d1llsbuu5xubt1.amplifyapp.com/)

A full-stack serverless web application to manage a books.  

  ✨ Features

- 📥 Add new books with:
  - Title
  - Author
  - Description
  - Cover image (uploaded to S3)
- ✏️ Edit existing book details
- 🗑️ Delete books
- 👤 User authentication (Sign up / Login) using **Amazon Cognito**
- 🔒 Secured API calls using JWT tokens


## 🧰 Services Used and Their Advantages

✅ AWS Amplify:
Hosts the React frontend and enables continuous deployment directly from GitHub.

✅ Amazon S3:
Stores static media files such as book cover images.


✅ Amazon API Gateway:
Exposes secure RESTful APIs and routes HTTP requests to backend Lambda functions.

✅ AWS Lambda:
Runs the backend logic using FastAPI in a fully serverless and scalable environment.

✅ Amazon DynamoDB:
NoSQL serverless database used for storing book data (title, author, description...).

✅ Amazon Cognito:
Provides user sign-up, login, authentication, and token-based authorization with OpenID Connect (OIDC) to authenticate users. Upon login, users receive a JWT token (access_token, id_token), which is stored client-side and sent with each request. The backend (FastAPI running in AWS Lambda) verifies the token using Cognito's JWKS endpoint and authorizes or denies access accordingly.

✅ GitHub:
Used for version control, source code management, and CI/CD integration with Amplify.



## ⚙️ Installation (For Local Development)
```bash
# Frontend
cd frontend
npm install
npm start

# Backend
cd backend
uvicorn main:app --reload


[ React + Cloudscape UI ]
     |
     V
[ Cognito Login Page (Hosted UI) ]
     |
     V
[ API Gateway ]
     |
     V
[ Lambda (FastAPI using Mangum) ]
     |          |
     |          |-- verify_token.py
     |          |-- s3_utils.py
     |
     V
[ DynamoDB (Books Table) ]      [ S3 (book images) ]
