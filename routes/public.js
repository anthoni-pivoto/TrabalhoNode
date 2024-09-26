import express, { response } from 'express';
import mysql from 'mysql';
import fs from 'fs';
import * as formidable from 'formidable';
import * as bcrypt from 'bcrypt';
var saltRounds = 10;

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
//     var sql = "CREATE TABLE tb_post (id_post INT AUTO_INCREMENT PRIMARY KEY,id_user int, text VARCHAR(500), tag VARCHAR(30))";
//     con.query(sql, function (err, result) {
//         if (err) throw err;
//         console.log("Tabela post criada");
//     });
//     if (err) throw err;
//     console.log("Conectado!");
//     var sql = "CREATE TABLE tb_user (id_user INT AUTO_INCREMENT PRIMARY KEY, nm_user varchar(255), email VARCHAR(255), pwd_user VARCHAR(255))";
//     con.query(sql, function (err, result) {
//         if (err) throw err;
//         console.log("Tabela user criada");
//     });
//     if (err) throw err;
//     console.log("Conectado!");
//     var sql = "ALTER TABLE tb_post ADD CONSTRAINT FK_post_user FOREIGN KEY (id_user) REFERENCES tb_user(id_user)";
//     con.query(sql, function (err, result) {
//         if (err) throw err;
//         console.log("Constraint Criada");
//     });

//     con.end();
// });

router.get('/show', (req, res) => {
    var sql = "select pwd_user from tb_user where email = 'teste@gmail.com'"
    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        res.status(201).json(result);
    });
    con.end();
})
router.get('/cadastro', (req, res) => {
    fs.readFile('./views/cadastro_login.html', function (err, data) {
        res.write(data);
        return res.end();
    })
})

router.get('/login', (req, res) => {
    fs.readFile('./views/login.html', function (err, data) {
        res.write(data);
        return res.end();
    })
})

router.post('/insert-user', (req, res) => {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        let newPassword = fields.pwd.toString();
        bcrypt.hash(newPassword, saltRounds, function (err, hash) {
            var sql = "INSERT INTO tb_user (nm_user, email, pwd_user) VALUES ?";
            var values = [[fields.name, fields.email, hash]];
            con.query(sql, [values], function (err, result) {
                if (err) throw err;
                console.log("Numero de registros inseridos: " + result.affectedRows);
            });
        });
        res.write("Dados inseridos no Banco com Sucesso");
        res.end();
    });

})

router.post('/insert-post', (req, res) => {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
            var sql = "INSERT INTO tb_post (id_user, text, tag) VALUES ?";
            var values = [[1, fields.text, fields.tag]];
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
                        res.end;
                    }
                })
            }
        })
    });
})

export default router