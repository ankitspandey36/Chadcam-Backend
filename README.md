 Chadcam-Backend
================


**GitHub Repository:** [Chadcam-Backend](https://github.com/ankitspandey36/Chadcam-Backend)
**Api Documents:** [Chadcam-Backend](https://github.com/ankitspandey36/Chadcam-Backend/blob/main/docs/API.md)

**Project:** A robust Node.js + Express backend for the ChadCam real-time communication platform, featuring secure authentication, live chat, email notifications, and video session handling with structured error management and API design.

**Description:**

This project includes a comprehensive backend solution for a real-time communication platform called ChadCam. Implemented using Node.js, Express, JWT, Mongoose, MongoDB, Nodemailer, Socket.IO, 100ms Video, SerpAPI, Multer, Cloudinary, and other popular libraries, this backend serves as a powerful foundation for the ChadCam platform. Features include:

- User Auth with JWT-based login and signup, password hashing, and cookie-based sessions
- Email integration for verification and forgot-password functionality via Nodemailer
- Real-time chat with live updates and moderation support using Socket.IO
- Topic-based Room System for dynamic room creation, user mapping, and removal logic
- Image and file uploads with Multer and Cloudinary
- Video sessions using integrated 100ms SFU technology
- Trending Topics fetched using SerpAPI
- Clean and well-documented codebase with asyncHandler, custom API response/error middleware, and Prettier for formatting

**Key Features:**

- 🔠 User Auth with refresh/access tokens and cookie support
- 🔒 Password Hashing using bcrypt
- 📧 Email Verification & Reset
- 🧠 Topic-based Room System with real-time updates
- 💬 Live Chat powered by Socket.IO (with report & feedback)
- 📤 Image/File Uploads using Multer + Cloudinary
- 📡 100ms Video Integration
- 🔍 Trending Topics fetched using SerpAPI
- ⚙️ Async Handler + Custom API Response/Error Middlewares
- 🛡️ Secure API with CORS, cookie-parser, and structured model definitions
- 🧼 Prettier used for consistent formatting and clean code

**Installation:**

1. Clone the Repository:

```bash
git clone https://github.com/ankitspandey36/Chadcam-Backend.git
cd Chadcam-Backend
```

2. Install Dependencies:

```bash
npm install
```

3. Setup Environment Variables:

Create a `.env` file in the root directory with the following contents:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

EMAIL_HOST=smtp.your_email_provider.com
EMAIL_PORT=587
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password

SERPAPI_KEY=your_serpapi_key

CLIENT_ORIGIN=http://localhost:5173
```

4. Run the Server:

```bash
npm run dev
Server will start at http://localhost:5000
```

**Usage:**

Once running, the backend will expose a REST API and handle:

- Auth Routes: `/api/user/signup`, `/api/user/login`, `/api/user/refresh`, `/api/user/verify`, `/api/user/forgot-password`
- Room Management: `/api/room/create`, `/api/room/join`, etc.
- Message Handling: via Socket.IO events (`newMessage`, `reportUser`, `feedbackSubmit`)
- Image Uploads: handled through Multer, auto-uploaded to Cloudinary
- Token Refresh: uses secure cookies to manage session flow
- Video Room Token: `/api/100ms/token` returns a token for 100ms room access
- Trends: `/api/trending` returns data from SerpAPI



**License:**

Free to use under the MIT License

**Contributing:**

Pull requests are welcome! Please focus on backend logic or new features rather than frontend changes. Feature ideas or bug reports are appreciated.

**Contact Us:**

For any questions or suggestions, feel free to reach out at [ankit.pandey99p@gmail.com](mailto:ankit.pandey99p@gmail.com).

