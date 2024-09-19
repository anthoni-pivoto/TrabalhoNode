const { error } = require('console');
const express = require('express');
const app = express();
const port = 3000;
const { Router } = require("express");
const router = require('./feiceRoute');

router(app);

app.listen(port, (error)=>{
    if(error){
        console.log("ERROU");
        return;
    }
    console.log("Bombou");
} );