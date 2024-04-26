const express = require('express');
const mongoose = require('mongoose')

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware for parsing JSON body
app.use(express.json());

app.use(express.urlencoded());

// initializing the DB
// const db = require('./config/mongoose');
mongoose.connect("mongodb+srv://prathikshetty1411:takeaguess@cluster0.8gmuyqp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
// wkQUwBFD5SaXAulT

// app.use('/', require('./routes'));
const User = require('./models/user')

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
