require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { CORS_ORIGIN } = require("./constants");
const app = express();
const { PORT, DB_URL } = process.env;
const authRoutes = require("./routes/auth")
const { Router: ctxtVocRoutes } = require("./routes/ctxtVoc")
const { Router: communityRoutes } = require("./routes/community.js")
const { Router: postRoutes } = require("./routes/post.js")
const profileRoutes = require("./routes/profile");
const genRoutes = require("./routes/generate");
const { connectSocket } = require("./socketAction.js");

const startApp = async () => {
  try {
    const dbStatus = await mongoose.connect(DB_URL);
    if (dbStatus) { 
      let CORS_ORIGINS = CORS_ORIGIN.split(' ');
      app.use(cors({ origin: CORS_ORIGINS, credentials: true }));

      app.use(cookieParser());
      app.use(express.json());
      app.use(express.urlencoded({ extended: true }));

      app.use("/api/auth", authRoutes);
      app.use("/api/project", ctxtVocRoutes);
      app.use("/api/community", communityRoutes);
      app.use("/api/post", postRoutes);
      app.use("/api/ai", genRoutes);
      app.use("/api/profile", profileRoutes);

      const server = app.listen(PORT, () => console.log(`Server is listening at http://localhost:${PORT}`));
      connectSocket(server);      
    } else {
      throw new Error(`Unable to connect to db ${DB_URL}`);
    }
  } catch (Err) {
    console.log(Err);
  }
}

startApp();

