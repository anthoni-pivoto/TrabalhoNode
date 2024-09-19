const express = require('express')
const router = express.Router()

const timeLog = (req, res, next) => {
    console.log('Time: ', Date.now());
    next();
}
router.use(timeLog)

// get post put delete

router.get("home/", (req, res) => {
    res.send("Chegou aqui, lista de todos posts...");
});

router.post("/post/create", (req, res) => {
    res.send("Chegou aqui, criando um post");
});

router.get("/post/edit/:id", (req, res) => {
    const {id} = req.params
    res.send("Chegou aqui, atualizando post " + id + ".");
});

router.delete("/post/delete/:id", (req, res) => {
    const{id} = req.params
    res.send("Chegou aqui, deletar post " + id + "?");
});

module.exports = router;