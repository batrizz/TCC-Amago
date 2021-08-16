//ficarão as SQLs que cadastram, buscam, editam e excluem dados da tabela usuario.
function usuarioBanco(conexao){
  this._conexao=conexao;
}
//-------------------------------------- O N G ------------------------------------------------------

usuarioBanco.prototype.salvar = function(dados, callback){
  this._conexao.query('INSERT INTO ongs SET ?',dados,callback);
}

usuarioBanco.prototype.verificaLoginOng = function(dados,callback){
  this._conexao.query('SELECT * FROM ongs WHERE usuario = ? AND senha = ?', [dados.usuario,dados.senha], callback);
}

usuarioBanco.prototype.salvarFotoOng = function(sess,callback){
  this._conexao.query('INSERT INTO foto_perfil_Ongs (foto, id_ong) VALUES (?,?)',[sess.foto,sess.id_usuario],callback);
}

usuarioBanco.prototype.buscarFotoOng = function(sess,callback){
  this._conexao.query('SELECT foto FROM foto_perfil_Ongs WHERE id_ong = ?', [sess.foto, sess.id_usuario], callback);
}

usuarioBanco.prototype.exibeInformacoesOng = function(id,callback){
  this._conexao.query('SELECT * FROM ongs WHERE id=?',id,callback);
}

usuarioBanco.prototype.editantoInformacoesOng = function(dados, callback){
  this._conexao.query('UPDATE ongs SET ? WHERE id = ?',[dados,dados.id],callback);
}

usuarioBanco.prototype.verificaCadastroOng = function(dados,callback){
  this._conexao.query('SELECT * FROM ongs WHERE usuario = ?',[dados.usuario],callback);
}

usuarioBanco.prototype.deletarContaOng = function(id,callback){
  this._conexao.query('DELETE FROM ongs WHERE id = ?',id,callback);
}

usuarioBanco.prototype.registrarInformacoesPagamento = function(dados,callback){
  this._conexao.query('INSERT into informaçoes_pagamento SET ?',dados,callback);
}

usuarioBanco.prototype.exibirInformacoesPagamento = function(sess,callback){
  this._conexao.query('SELECT * FROM informaçoes_pagamento WHERE id_ong = ?',[sess.id_usuario],callback);
}

usuarioBanco.prototype.deletarInformacoesPagamento = function(id,callback){
  this._conexao.query('DELETE FROM informaçoes_pagamento WHERE id = ?',id,callback);
}

usuarioBanco.prototype.editarFotoOng = function(sess,callback){
  this._conexao.query('UPDATE ongs SET foto = ? WHERE id=?',[sess.foto,sess.id_usuario],callback);
}

//-------------------------------------- CLIENTE ------------------------------------------------------

usuarioBanco.prototype.salvarCliente = function(dados, callback){
  this._conexao.query('insert into clientes set ?',dados,callback);
}

usuarioBanco.prototype.verificaLoginCliente = function(dados,callback){
  this._conexao.query('SELECT * FROM clientes WHERE usuario = ? AND senha = ?', [dados.usuario,dados.senha], callback);
}

usuarioBanco.prototype.salvarFotoCliente = function(sess,callback){

  this._conexao.query('INSERT INTO foto_perfil_clientes (foto, id_cliente) VALUES (?,?)',[sess.foto,sess.id_usuario],callback);
}

usuarioBanco.prototype.exibeFotoCliente = function(sess,callback){
  this._conexao.query('SELECT * FROM foto_perfil_clientes WHERE id_cliente = ?',[sess.foto,sess.id_cliente],callback);
}


usuarioBanco.prototype.exibeInformacoesCliente = function(id,callback){
  this._conexao.query('SELECT * FROM clientes WHERE id = ?',id,callback);
}

usuarioBanco.prototype.editantoInformacoesCliente = function(dados, callback){
  this._conexao.query('UPDATE clientes SET ? WHERE id = ?',[dados,dados.id],callback);
}

usuarioBanco.prototype.verificaCadastroCliente = function(dados,callback){
  this._conexao.query('SELECT * FROM clientes WHERE usuario = ?',[dados.usuario],callback);
}

usuarioBanco.prototype.deletarContaCliente = function(id,callback){
  this._conexao.query('DELETE FROM clientes WHERE id = ?',id,callback);
}

usuarioBanco.prototype.editarFotoCliente = function(sess,callback){
  this._conexao.query('UPDATE clientes SET foto = ? WHERE id=?',[sess.foto,sess.id_usuario],callback);
}
//-------------------------------------- PRODUTOS ------------------------------------------------------

usuarioBanco.prototype.registrarProdutos = function(dados,callback){
  this._conexao.query('INSERT INTO produtos SET ?',dados,callback);
}

usuarioBanco.prototype.buscarTodosProdutos = function(sess,callback){
  this._conexao.query('SELECT * FROM produtos WHERE id_ong = ?',[sess.id_usuario],callback);
}

usuarioBanco.prototype.editantoProduto = function(dados, callback){
  this._conexao.query('UPDATE produtos SET ? WHERE id = ?',[dados,dados.id],callback);
}

usuarioBanco.prototype.editarProdutos = function(id,callback){
  this._conexao.query('SELECT * FROM produtos WHERE id = ?',id,callback);
}

usuarioBanco.prototype.deletarProdutos = function(id,callback){
  this._conexao.query('DELETE FROM produtos WHERE id = ?',id,callback);
}

usuarioBanco.prototype.buscarNomeProduto = function(nome, callback){
  var nome = nome.nomeBusca;
  this._conexao.query('SELECT * FROM produtos WHERE nome = ?', nome,callback);
}

usuarioBanco.prototype.editarFotoProduto = function(dados,callback){
  this._conexao.query('UPDATE produtos SET foto_produto = ? WHERE id=?',[dados,dados.id],callback);
}

usuarioBanco.prototype.buscarFotoProduto = function(id,callback){
  this._conexao.query('SELECT foto_produto FROM produtos WHERE id=?',id,callback);
}
//---------------------- PROJETOS SOCIAIS -------------------------//
usuarioBanco.prototype.adicionarProjetos = function(dados,callback){
  this._conexao.query('INSERT INTO projetos_sociais SET ?',dados,callback)
}

usuarioBanco.prototype.exibirProjetos = function(id,callback){
  this._conexao.query('SELECT * FROM projetos_sociais WHERE id = ?',id,callback)
}

usuarioBanco.prototype.exibirTodosProjetos = function(callback){
  this._conexao.query('SELECT * FROM projetos_sociais',callback)
}

//---------------- COMENTÁRIOS --------------//
usuarioBanco.prototype.registrarComentarios = function(dados,callback){
  this._conexao.query('INSERT INTO comentarios SET ?',dados,callback)
}

usuarioBanco.prototype.exibirComentarios = function(callback){
  this._conexao.query('SELECT * FROM comentarios',callback)
}



module.exports = function(){
  return usuarioBanco;
}
