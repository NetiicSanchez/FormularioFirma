const {DataTypes} = require('sequelize');
const sequelize = require('../configuracion/db');

const respuestasformulario = sequelize.define('formulario', {
    idformulario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'fecha'
    },

    herramientasEstadoOK: {
  type: DataTypes.SMALLINT,
  allowNull: false
},

    uniformeAdecuado: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        field: 'uniformeAdecuado'
    },
    vestimentaAdecuada: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        field: 'vestimentaAdecuada'
    },
    equiposBateriasok: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        field: 'equiposBateriasok'
    },
    herramientascompletas: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        field: 'herramientascompletas'
    },
    herramientaselectricasok: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        field: 'herramientaselectricasok'
    },
    transporteherramientas: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        field: 'transporteherramientas'
    },
    usaalcohol: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        field: 'usaalcohol'
    },
    usaplantilla: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        field: 'usaplantilla'
    },
    equiposCalibrados: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        field: 'equiposcalibrados'
    },
    proteccionBuenEstado: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        field: 'proteccionbuenestado'
    },
    trabajoEnEquipo: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        field: 'trabajoenequipo'
    },
    herramientaAdecuadaTrabajo: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        field: 'herramientaadecuadatrabajo'
    },
    herramientaDañadoPropio: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        field: 'herramientadañadopropio'
    },
    sistemaOrganizacion: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        field: 'sistemaorganizacion'
    },
    usaCasco: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        field: 'usacasco'
    },
    usaBotas: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        field: 'usabotas'
    },
    usaEquipoAltura: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        field: 'usaequipoaltura'
    },
    usaConos: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        field: 'usaconos'
    },
    fotos: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'fotos'
    },
    observaciones: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'observaciones'
    },
    firma: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'firma'
    }
}, {
    tableName: 'formulario',
    timestamps: false,
});
module.exports = respuestasformulario;