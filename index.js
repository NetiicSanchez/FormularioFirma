// ...otros requires...
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./configuracion/db');
const respuestasRouter = require('./rutas/rutasform');
const path = require('path');
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/login', (req, res) => {
  const { usuario, contrasena } = req.body;
  if (usuario === 'admin' && contrasena === 'admin123') {
    return res.redirect('/index.html');
  } else if (usuario === 'supervisor' && contrasena === 'super123') {
    return res.redirect('/formsupervisorinst.html');
  } else {
    return res.send('Usuario o contraseña incorrectos');
  }
});

// *** Redirección antes de archivos estáticos ***
app.get('/', (req, res) => {
  res.redirect('/login.html');
});

// *** Solo una línea para archivos estáticos ***
app.use(express.static(path.join(__dirname, 'public')));

app.use('/uploads', express.static('uploads'));
app.use('/', respuestasRouter);
app.use('/registros', respuestasRouter);
app.use('/rutas', require('./rutas/rutasform'));
app.use('/modelos/respuestasformulario', respuestasRouter);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

sequelize.sync().then(() => {
  app.listen(3001, () => {
    console.log('Servidor en puerto 3001');
    console.log('Acceso: http://localhost:3001/');
  });
});