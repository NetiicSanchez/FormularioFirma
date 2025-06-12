const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./configuracion/db');
const respuestasRouter = require('./rutas/rutasform');
// const { path } = require('pdfkit');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use(express.static('public'));

app.use('/',respuestasRouter)

app.use('/registros',respuestasRouter)


app.use('/modelos/respuestasformulario', respuestasRouter);
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname, 'views'));


// puerta de conexión a la base de datos
sequelize.sync().then(() => {
  app.listen(3001, () => {
    console.log('Servidor en puerto 3001');
    console.log('Acceso: http://localhost:3001/');
  });
});