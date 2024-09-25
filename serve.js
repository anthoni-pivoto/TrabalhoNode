import express from 'express';
import publicRoutes from './routes/public.js'

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.set('view engine', 'ejs')

app.use('/post', publicRoutes);

app.use('user', publicRoutes)

app.listen(3000, () => console.log("Servidor onlaine"));