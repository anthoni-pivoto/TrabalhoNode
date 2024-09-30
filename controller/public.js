import express from 'express';
import mysql from 'mysql';
import fs from 'fs';
import * as formidable from 'formidable';
import bcrypt from 'bcrypt';
import { fileURLToPath } from 'url';
import * as path from 'path';
import { isBuffer } from 'util';
import session from 'express-session';

const saltRounds = 10;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "node_sup"
});

con.connect(function (err) {
    console.log("Conectado!");
});

// con.connect(function (err) {
//     if (err) throw err;
//     console.log("Conectado!");
//     var sql = "CREATE TABLE tb_post (id_post INT AUTO_INCREMENT PRIMARY KEY,id_user int, text VARCHAR(500), tag VARCHAR(30), arquivo varchar(255), data DATETIME DEFAULT CURRENT_TIMESTAMP)";
//     con.query(sql, function (err, result) {
//         if (err) throw err;
//         console.log("Tabela post criada");
//     });
//     if (err) throw err;
//     console.log("Conectado!");
//     var sql = "CREATE TABLE tb_user (id_user INT AUTO_INCREMENT PRIMARY KEY, nm_user varchar(255), email VARCHAR(255), nickname VARCHAR(255), pwd_user VARCHAR(255), prof_pic varchar(255))";
//     con.query(sql, function (err, result) {
//         if (err) throw err;
//         console.log("Tabela user criada");
//     });
//     con.end();
// });



router.post('/insert-user', (req, res) => {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var oldpath = files.arquivo[0].filepath;
        var ext = path.extname(files.arquivo[0].originalFilename);
        var nameimg = files.arquivo[0].newFilename + ext;
        var newpath = path.join(__dirname, '../public/imagens/', nameimg);
        fs.rename(oldpath, newpath, function (err) {
            if (err) console.log('nao deu pra renomear');
        })
        var sql = "INSERT INTO tb_user (nm_user, email, nickname, pwd_user, prof_pic) VALUES ?";
        var values = [[fields.name, fields.email, fields.nickname, fields.pwd.toString(), nameimg]];
        con.query(sql, [values], function (err, result) {
            if (err) throw err;
            console.log("Numero de registros inseridos: " + result.affectedRows);
            res.redirect('/home');
        });
    });
})

router.post('/insert-post', (req, res) => {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var oldpath = files.arquivo[0].filepath;
        var ext = path.extname(files.arquivo[0].originalFilename);
        var nameimg = files.arquivo[0].newFilename + ext;
        var newpath = path.join(__dirname, '../public/imagens/', nameimg);
        fs.rename(oldpath, newpath, function (err) {
            if (err) console.log('nao deu pra renomear');
        })
        var sql = "INSERT INTO tb_post (id_user, text, tag, arquivo) VALUES ?";
        var values = [[req.sessionID, fields.text.toString(), fields.tag, nameimg]];
        con.query(sql, [values], function (err, result) {
            if (err) throw err;
            console.log("Numero de registros inseridos: " + result.affectedRows);
            res.redirect('/home');
        });
    });
})

export default router