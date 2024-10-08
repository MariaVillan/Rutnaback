const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); 

class Log extends Model {}

Log.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    accion: DataTypes.STRING,
    detalle: DataTypes.STRING,
    fecha: DataTypes.DATE,
    usuario: DataTypes.STRING
}, {
    sequelize,
    modelName: 'Log',
    tableName: 'logs',
    timestamps: false
});

module.exports = Log;
