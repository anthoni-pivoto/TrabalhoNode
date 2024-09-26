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

router.get('/home', (req, res) => {
    // if(req.url == '/post/cadastro'){
    // fs.readFile()
    // }
    fs.readFile('./views/home.html', function (err, data) {
        res.write(data);
        return res.end();
    })
})

router.get('/show',(req,res) =>{
        var sql ="select pwd_user from tb_user where email = 'teste@gmail.com'"
        con.query(sql, function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        res.status(201).json(result);
        });
        con.end();
})
router.get('/cadastro', (req, res) => {
    // if(req.url == '/post/cadastro'){
    // fs.readFile()
    // }
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

router.post('/verifica-login', (req, res) => {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var senha = fields.pwd.toString();
        var sql = "select pwd_user from tb_user where email = '" + fields.email +"'";
        con.query(sql,function(err, result){
            if(err) throw err;
            var hash = result[0]['pwd_user'].toString();
            if(result.length){
                bcrypt.compare(senha, hash, function(err, resultado){
                    if(err) throw err;
                    if(resultado){
                        res.write("Login bem feito");
                        res.end();
                    }else{
                        res.write("Não bateu zé");
                        res.end;
                    }
                })
            }
        }) 
    });
})

export default router