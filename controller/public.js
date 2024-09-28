import express from 'express';
import mysql from 'mysql';
import fs from 'fs';
import * as formidable from 'formidable';
import bcrypt from 'bcrypt';
const saltRounds = 10;

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

router.get('/login', (req, res) => {
    fs.readFile('./views/login.html', function (err, data) {
        res.write(data);
        return res.end();
    })
})

router.post('/insert-user', (req, res) => {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
            var sql = "INSERT INTO tb_user (nm_user, email, nickname, pwd_user, prof_pic) VALUES ?";
            var values = [[fields.name, fields.email,fields.nickname, fields.pwd.toString(), files.arquivo[0]]];
            con.query(sql, [values], function (err, result) {
                if (err) throw err;
                console.log("Numero de registros inseridos: " + result.affectedRows);
        });
        res.write("Dados inseridos no Banco com Sucesso");
        res.end();
    });
})

router.post('/insert-post', (req, res) => {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
            var sql = "INSERT INTO tb_post (id_user, text, tag, arquivo) VALUES ?";
            var values = [[1, fields.text.toString(), fields.tag, files.arquivo[0]]];
            con.query(sql, [values], function (err, result) {
                if (err) throw err;
                console.log("Numero de registros inseridos: " + result.affectedRows);
        });
        res.write("Dados inseridos no Banco com Sucesso");
        res.end();
    });

})

router.post('/verifica-login', (req, res) => {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var senha = fields.pwd.toString();
        var sql = "select pwd_user from tb_user where email = '" + fields.email + "'";
        con.query(sql, function (err, result) {
            if (err) throw err;
            var hash = result[0]['pwd_user'].toString();
            if (result.length) {
                bcrypt.compare(senha, hash, function (err, resultado) {
                    if (err) throw err;
                    if (resultado) {
                        res.write("Login bem feito");
                        res.end();
                    } else {
                        res.write("Não bateu zé");
                        res.end();
                    }
                })
            }
        })
    });
})

export default router