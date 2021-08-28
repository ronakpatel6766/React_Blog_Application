const express = require('express');
const cors = require('cors');
const app = express();
const authenticationRoutes = require("./routes/authentication");
const userRoute = require("./routes/user");
const postRoute = require("./routes/post");
const categoryRoute = require("./routes/category");
const uploadRoute = require("./routes/upload");
require("./model/db");


app.use(express.json());
app.use(cors());



//Routes for user Signup & Signin process with url http://localhost:5000/api/authenticate
app.use("/api/authenticate", authenticationRoutes);

// Routes for user account CRUD operations with url http://localhost:5000/api/user
app.use("/api/user", userRoute);

// Routes for Posts with url http://localhost:5000/api/post
app.use("/api/post", postRoute);

// Routes for Categories with url http"//localhost:5000/api/categories
app.use("/api/categories", categoryRoute);

// Route for uploading with url http://localhost:5000/api/file
app.use("/api/file", uploadRoute);


app.listen(process.env.PORT || "5000", ()=>{

    console.log("Server Running! Open http://localhost:5000 on Browser");
});