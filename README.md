
# 📚   HebaLibrary

## 🔗 [Live Demo on AWS Amplify](https://main.d1llsbuu5xubt1.amplifyapp.com/)

A full-stack serverless web application to manage a books.  

 ##  ✨ Features

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
## 1. AWS Amplify
🔧 Used for:
Hosting the React frontend.

Enabling CI/CD with GitHub.

⭐ Benefits:
Easy deployment with GitHub integration.

Free SSL and custom domain support.

Global content delivery via built-in CloudFront.

Fully managed, no need to configure servers.

## 2. Amazon S3
🔧 Used for:
Storing book cover images uploaded by users.

⭐ Benefits:
Durable and scalable object storage.

Supports large file uploads and various formats.

Presigned URLs allow secure uploads without exposing credentials.

Can serve images via CloudFront for fast loading.

## 3. Amazon API Gateway
🔧 Used for:
Creating secure HTTP endpoints for the frontend to interact with Lambda functions (backend).

⭐ Benefits:
Instant RESTful APIs for Lambda functions.

Built-in support for CORS, throttling, authorization.

Pay-as-you-go model (no charge if unused).

Works well with JWT and Cognito authentication.

## 4. AWS Lambda
🔧 Used for:
Running FastAPI backend functions for CRUD operations and image upload URL generation.

⭐ Benefits:
Serverless execution – no need to manage or scale servers.

Automatic scaling on demand.

Low cost especially for low/medium traffic apps.

Integrates directly with S3, DynamoDB, and API Gateway.

## 5. Amazon DynamoDB
🔧 Used for:
Storing book records (title, author, description, user ID, image URL, etc.)

⭐ Benefits:
NoSQL database with fast reads/writes.

Serverless and highly scalable.

Pay only for what you use.

Ideal for key-value or document-based storage.

## 6. Amazon Cognito
🔧 Used for:
Handling user authentication (signup, login).

Issuing JWT tokens for secure API access.

⭐ Benefits:
No need to build login system manually.

JWT-based authentication integrated with API Gateway and Lambda.

Supports email/password or social logins (Google, Facebook, etc.).

Seamlessly integrates with Amplify.

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

