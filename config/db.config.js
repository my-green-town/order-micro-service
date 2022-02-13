let config = require('./config.json');
const env = process.env.NODE_ENV || 'development';
exports.configSetter = ()=>{
    config.development.username = process.env.DB_USER;
    config.development.password = process.env.DB_PASS;
    config.development.database = process.env.DB_NAME;
    config.development.host = process.env.DB_HOST;
    config.development.dialect = process.env.DB_dialect;

    config.production.username = process.env.DB_USER;
    config.production.password = process.env.DB_PASS;
    config.production.database = process.env.DB_NAME;
    config.production.host = process.env.DB_HOST;
    config.production.dialect = process.env.DB_dialect;
    return config
}