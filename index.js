require('dotenv').config();

const express = require('express');
const app = express();
const mongoose =require('mongoose');

const userRoute = require('./route/user');
const homeRoute = require('./route/home');

const PORT = process.env.PORT || 5000
const { MONGO_URI } = process.env;



app.use(express.json());
app.use('/user', userRoute);
app.use('/homepage', homeRoute);


// Conneting to the database
mongoose
.connect(MONGO_URI)
.then(() => {
  console.log("Successfully connected to database");
})
.catch((error) => {
  console.log("database connection failed. exiting now...");
  console.error(error);
  process.exit(1);
});

app.listen(PORT, () => {
    console.log(`Server started on Port ${PORT}`)
})
