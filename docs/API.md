# ChadCam Backend API Documentation

This document outlines all available REST API endpoints for the **ChadCam Backend**, including their methods, request formats, and authentication requirements.

---

##  Authentication Routes (`/api/user`)

### POST `/register`

Registers a new user.

* **Body (FormData)**:

  * `username` (string)
  * `email` (string)
  * `password` (string)
  * `avatar` (file)

### POST `/login`

Logs in the user.

* **Body (JSON)**:

  * `email` (string)
  * `password` (string)

### POST `/logout` *(Protected)*

Logs out the current user.

### POST `/refresh`

Refreshes the access token.

### PATCH `/changepassword` *(Protected)*

Changes the user's password.

* **Body**:

  * `oldPassword` (string)
  * `newPassword` (string)

### PATCH `/updatedetails` *(Protected)*

Updates user details.

* **Body**: user fields to update

### GET `/me` *(Protected)*

Returns the current authenticated user.

### GET `/all` *(Protected)*

Returns a list of all users.

### POST `/verify`

Verifies a code sent to email.

* **Body**:

  * `email` (string)
  * `code` (string)

### POST `/verifyforgotcode`

Verifies code during forgot password flow.

* **Body**:

  * `email` (string)
  * `code` (string)

### POST `/resendcode`

Resends verification code to email.

* **Body**:

  * `email` (string)

### POST `/forgotpassword`

Sends verification code for password reset.

* **Body**:

  * `email` (string)

### PATCH `/forgotpasswordchange`

Changes password after verification.

* **Body**:

  * `email` (string)
  * `newPassword` (string)

### GET `/trendingtopics`

Fetches trending topics using SerpAPI.

---

## 📡 Room Routes (`/api/room`)

### POST `/joinroom` *(Protected)*

Joins a user to a room.

* **Body**:

  * `roomName` (string)

### POST `/leaveroom` *(Protected)*

Removes a user from a room.

### POST `/getusernumber` *(Protected)*

Returns the number of users in a room.

* **Body**:

  * `roomName` (string)

---

## 💬 Message Routes (`/api/message`)

### GET `/getmessage` *(Protected)*

Returns current live messages (stateless).

### POST `/sendmessage` *(Protected)*

Sends a message with optional image.

* **FormData**:

  * `text` (string)
  * `image` (file, optional)
  * `roomName` (string)

---

## 🚨 Report Routes (`/api/report`)

### POST `/action` *(Protected)*

Submits a report against a user in a room.

* **Body**:

  * `reportedUserId` (string)
  * `roomName` (string)

---

## 📝 Feedback Routes (`/api/feedback`)

### POST `/submitfeedback` *(Protected)*

Submits feedback for the platform.

* **Body**:

  * `message` (string)
  * `rating` (number)

---

## 🛡️ Middleware

Most routes are protected using JWT (`verifyjwt`) and require `Authorization` via HTTP-only cookies. Image uploads handled via `multer`. Responses follow a consistent API format using custom response and error wrappers.

---

## 🧪 Testing

Test with Postman or ThunderClient with proper headers:

* Enable **cookie support**.
* Content-Type: `application/json` or `multipart/form-data`
* Use `http://localhost:5000` as base URL in local dev.

---

For any questions, open an issue or contact [ankitspandey36@gmail.com](mailto:ankit.pandey99p@gmail.com). 