const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./configuracion/db');
const respuestasRouter = require('./rutas/rutasform');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use(express.static('public'));

app.use('/modelos/respuestasformulario', respuestasRouter);


// puerta de conexión a la base de datos
sequelize.sync().then(() => {
  app.listen(3001, () => {
    console.log('Servidor en puerto 3001');
    console.log('Acceso: http://localhost:3001/');
  });
});