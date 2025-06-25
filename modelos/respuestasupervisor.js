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
        allowNull: true,
    },
    tiposupervision:{
        type: DataTypes.STRING,
        allowNull: true,
        field: 'tiposupervision'
    },
    nombretecnico: {
        type: DataTypes.STRING,
        allowNull:true,
        field: 'nombretecnico'
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
        field: 'fecha'
    },
    codigonet: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'codigonet'
    },
    nombrecliente: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'nombrecliente'
    },
    limpiezaont:{
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'limpiezaont'
    },
    fotoont:{
        type: DataTypes.STRING,
        allowNull: true,
        field: 'fotoont'
    },
    anclajeont:{
        type: DataTypes.SMALLINT,
        allowNull: true,
        field: 'anclajeont'
    },
    punteoubicacionont:{ 
        type: DataTypes.SMALLINT,
        allowNull:true,
        field: 'punteoubicacionont'
    },
    fotoubicacionont:{
        type: DataTypes.STRING,
        allowNull: true,
        field: 'fotoubicacionont'
    },
    grapeadofibra:{
        type: DataTypes.SMALLINT,
        allowNull: true,
        field: 'grapeadofibra'
    },
    fotopotenciaont:{
        type: DataTypes.STRING,
        allowNull: true,
        field: 'fotopotenciaont'
    },
    ordenamientoreserva:{
        type: DataTypes.SMALLINT,
        allowNull: true,
        field: 'ordenamientoreserva'
    },
    fotoordenamientoreserva:{
        type: DataTypes.STRING,
        allowNull: true,
        field: 'fotoordenamientoreserva'
    },
    instalacionarmella:{
        type: DataTypes.SMALLINT,
        allowNull:true,
        field: 'instalacionarmella'
    },
    bajadadenap:{
        type: DataTypes.SMALLINT,
        allowNull: true,
        field: 'bajadadenap'
    },
    fotoetiquetanap:{
        type: DataTypes.STRING,
        allowNull: true,
        field: 'fotoetiquetanap'
    },
    fotopotencianap:{
        type: DataTypes.STRING,
        allowNull: true,
        field: 'fotopotencianap'
    },
    punteoacometidaextra:{
        type: DataTypes.SMALLINT,
        allowNull: true,
        field: 'punteoacometidaextra'
    },
    observaciones: {
        type: DataTypes.STRING,
        allowNull:true,
        field: 'observaciones'
    },
    numeroticket: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'numeroticket'
    },
    tipoaveria: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'tipoaveria'
    },
    fotoetiquetaont: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'fotoetiquetaont'
    },
    razonfalla: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'razonfalla'
    },
    firma: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'firma'
    }

}, 

{
    tableName: 'formsupervisor',
    timestamps: false,

});
module.exports = respuestaSupervisor;