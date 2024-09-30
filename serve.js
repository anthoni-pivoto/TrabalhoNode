import express from 'express';
import mysql from 'mysql';
import session from 'express-session';
import publicRoutes from './controller/public.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
app.use(express.static("public"));
app.use(session({
  secret: '2C44-4D44-WppQ38S',
  resave: false,
  saveUninitialized: true
}));

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
  var sql = "select tb_post.text, tb_post.tag, DAYOFYEAR(tb_post.data) as data, DAYOFYEAR(CURRENT_TIMESTAMP()) as data_dif, tb_post.arquivo, tb_user.prof_pic, tb_user.nickname, tb_user.nm_user from tb_post ,tb_user where tb_post.id_user = tb_user.id_user";
  con.query(sql, function (err, result, fields) {
    if (err) {
      console.log('deu ruim aqui em')
    };
    if(req.session.loggedin = false){
      if(err) throw err;
      res.render('./post/content-home.ejs', { dadosPost: result, session: null, dadosProf: null});
    }else{
      if(err) throw err;
      nome = req.body['name'];
      if(err) throw err;
      online = true;
      var lqs = "select * from tb_user where nm_user= ?";
      con.query(lqs, [nome], function (err, profResult, fields) {
        if(err) throw err;
        res.render('./post/content-home.ejs', { dadosPost: result, session: req.session, dadosProf: profResult });
      })
    }
  })
});

app.get('/cadastro', function (req, res) {
  res.render('./user/content-cadastro.ejs', { session: req.session});
})

app.get('/login', (req, res) => {
  res.render('./user/login.ejs', { session: req.session});
})

app.get('/disc',(req, res) => {
  req.session.destroy(function(err) {
    if (err) throw err;
  })
  console.log(req.sessionID)
  res.end()
})

app.post('/verifica-login', (req, res) => {
  var senha = req.body['pwd'];
  var email = req.body['email'];
  var sql = "select * from tb_user where email= ?"
  con.query(sql, [email], function (err, result) {
    if (err) throw err;
    if (result.length) {
      if (err) throw err;
      if (senha = result[0]['pwd_user']) {
        req.session.loggedin = true;
        if (err) throw err;
        req.session.username = result[0]['nm_user'];
        if (err) throw err;
        req.sessionID = result[0]['id_user'];
        if (err) throw err;
        res.redirect('/home');
        if (err) throw err;
      }
      else { alert('Username already taken!'); }
    }
  })
})

app.use('/views', express.static('views'));
app.get('/views/style.css', (req, res) => {
  res.setHeader('Content-Type', 'text/css');
  res.sendFile(__dirname + '/views/style.css');
});

app.listen(2000, () => console.log("Servidor onlaine"));