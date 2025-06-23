    // codigo para la conexión a la base de datos
    const { Sequelize } = require('sequelize');

    const sequelize =new Sequelize (process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
        ssl: {
            require: true, // Esto es necesario para render 
            rejectUnauthorized: false // Esto es necesario para render
        }
    },
     logging: false, // Desactivar los logs de SQL
     timezone:'-06:00' // Ajustar la zona horaria 
    });


module.exports = sequelize;

