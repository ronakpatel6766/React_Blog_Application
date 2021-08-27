const mongoose = require("mongoose");
require('dotenv').config();
const mongoDBUrl = process.env.MONGO_URL;

mongoose.connect(mongoDBUrl, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: true});

mongoose.connection.on('connected', ()=>{

    console.log("Connected to Database successfully!");
});

mongoose.connection.on('error', (error)=>{

    console.log("Error was found: "+error);
});

require("./User");
require("./Post");
require("./Category");