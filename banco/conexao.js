var mysql = require('mysql');
function criarConexao(){

  return mysql.createConnection({
    host:'db4free.net',
    user: 'amago_tcc',
    password: '12345678',
    database: 'amago_tcc',
    insecureAuth: 'true',
    multipleStatements: 'true'

  })
}

module.exports = function(){

  return criarConexao;
}
