import express from 'express';
import mysql from 'mysql';
import publicRoutes from './controller/public.js'

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs')

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "node_sup"
});

con.connect(function (err) {
  console.log("Conectado!");
});

app.use('/', publicRoutes);

app.get('/home', function (req, res) {
  var sql = "select tb_post.text, tb_post.tag, tb_post.data, tb_post.arquivo, tb_user.prof_pic, tb_user.nickname, tb_user.nm_user from tb_post ,tb_user where tb_post.id_user = tb_user.id_user";
  con.query(sql, function(err, result, fields){
    if(err){
      console.log('deu ruim aqui em')
    };
    res.render('./post/content-home.ejs', {dadosPost:result});
  })
});

app.get('/cadastro', function (req, res) {
  res.render('./user/content-cadastro.ejs');
})

app.use('/views', express.static('views'));
app.get('/views/style.css', (req, res) => {
  res.setHeader('Content-Type', 'text/css');
  res.sendFile(__dirname + '/views/style.css');
});

app.listen(2000, () => console.log("Servidor onlaine"));