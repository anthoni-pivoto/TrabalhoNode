import express from 'express';
import publicRoutes from './routes/public.js'

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.set('view engine', 'ejs')

app.get('/home',function(req,res){
  res.render('content-home.ejs');
});

app.use('/post', publicRoutes);

app.use('/user', publicRoutes)

app.use('/views', express.static('views'));
      app.get('/views/style.css', (req, res) => {
        res.setHeader('Content-Type', 'text/css');
        res.sendFile(__dirname + '/views/style.css');
      });
      
app.listen(3000, () => console.log("Servidor onlaine"));