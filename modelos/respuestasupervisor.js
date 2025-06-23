const {DataTypes} = require('sequelize');
const sequelize = require('../configuracion/db');

const respuestaSupervisor = sequelize.define('formsupervisor', {
    idformsupervisor: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field:'idformsupervisor'
    },  
    nombresupervisor: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tiposupervision:{
        type: DataTypes.STRING,
        allowNull: false,
        field: 'tiposupervision'
    },
    nombretecnico: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'nombretecnico'
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'fecha'
    },
    codigonet: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'codigonet'
    },
    nombrecliente: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'nombrecliente'
    },
    limpiezaont:{
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'limpiezaont'
    },
    fotoont:{
        type: DataTypes.STRING,
        allowNull: false,
        field: 'fotoont'
    },
    anclajeont:{
        type: DataTypes.SMALLINT,
        allowNull: false,
        field: 'anclajeont'
    },
    punteoubicacionont:{ 
        type: DataTypes.SMALLINT,
        allowNull: false,
        field: 'punteoubicacionont'
    },
    fotoubicacionont:{
        type: DataTypes.STRING,
        allowNull: false,
        field: 'fotoubicacionont'
    },
    grapeadofibra:{
        type: DataTypes.SMALLINT,
        allowNull: false,
        field: 'grapeadofibra'
    },
    fotopotenciaont:{
        type: DataTypes.STRING,
        allowNull: false,
        field: 'fotopotenciaont'
    },
    ordenamientoreserva:{
        type: DataTypes.SMALLINT,
        allowNull: false,
        field: 'ordenamientoreserva'
    },
    fotoordenamientoreserva:{
        type: DataTypes.STRING,
        allowNull: false,
        field: 'fotoordenamientoreserva'
    },
    instalacionarmella:{
        type: DataTypes.SMALLINT,
        allowNull: false,
        field: 'instalacionarmella'
    },
    bajadadenap:{
        type: DataTypes.SMALLINT,
        allowNull: false,
        field: 'bajadadenap'
    },
    fotoetiquetanap:{
        type: DataTypes.STRING,
        allowNull: false,
        field: 'fotoetiquetanap'
    },
    fotopotencianap:{
        type: DataTypes.STRING,
        allowNull: false,
        field: 'fotopotencianap'
    },
    punteoacometidaextra:{
        type: DataTypes.SMALLINT,
        allowNull: false,
        field: 'punteoacometidaextra'
    },
    observaciones: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'observaciones'
    },
    numeroticket: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'numeroticket'
    },
    tipoaveria: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'tipoaveria'
    },
    fotoetiquetaont: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'fotoetiquetaont'
    },
    razonfalla: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'razonfalla'
    },

}, 

{
    tableName: 'formsupervisor',
    timestamps: false,

});
module.exports = respuestaSupervisor;