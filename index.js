var express = require('express'); //jogando o conteúdo da biblioteca na variavel express
var app = express(); //executando um código dentro de uma váriavel
var multer = require("multer");
var load = require('express-load');
var md5 = require('md5');
load('banco')
.into(app);
var bodyParser = require('body-parser');
var session = require('express-session');
app.set('view engine', 'ejs'); //criando um servidor http
app.use(express.static('public'));
app.use("/uploads", express.static('uploads'));// isto libera a pasta uploads/ para exibir imagens no layout
const upload = multer({dest:'uploads/'}); //para upload de foto
app.use(bodyParser.urlencoded({extended:true}));
app.use(session({
	secret: 'exemplo1',
	resave: false,
	saveUninitialized: true,
	cookie: { masAge: 60000000 }
}));



//------------- GETs-----------




app.get('/',function(req,res){
	res.render('index.ejs');
});

app.get('/index.ejs', function(req,res){
		res.render('index.ejs');
});

 app.get('/projetos.ejs', function(req,res){
 	res.render('projetos.ejs');
 });

app.get('/cadastro_ong.ejs', function(req,res){
	res.render('cadastro_ong.ejs');
});

app.get('/cadastro_cliente.ejs', function(req,res){
	res.render('cadastro_cliente.ejs');
});

app.get('/login_ong.ejs', function(req,res){
	res.render('login_ong.ejs');
});

app.get('/login_cliente.ejs', function(req,res){
	res.render('login_cliente.ejs');
});



app.get('/index_cliente.ejs', function(req,res){
	var sess = req.session;
	if(sess.logado == 1){
	res.render('index_cliente.ejs', {'usuario':sess});
	}else{
		res.render('index.ejs');
	}
});

app.get('/index_ong.ejs', function(req,res){
	var sess = req.session;
	if(sess.logado == 1){
	res.render('index_ong.ejs', {'usuario':sess, 'image':sess.foto});
	}else{
		res.render('index.ejs');
	}
});

app.get('/perfil_cliente.ejs', function(req,res){
	var sess = req.session;
	if(sess.logado == 1){
	res.render('perfil_cliente.ejs', {'usuario':sess, 'image':sess.foto});
	}else{
		res.render('index.ejs');
	}
});

app.get('/perfil_ong.ejs', function(req,res){
	var sess = req.session;
	if(sess.logado == 1){
	res.render('perfil_ong.ejs', {'usuario':sess, 'image':sess.foto});
	}else{
		res.render('index.ejs');
	}
});

app.get('/registrar_produtos.ejs',function(req,res){
	var sess = req.session;
	if(sess.logado == 1){
	res.render('registrar_produtos.ejs');
}else{
	res.render('index.ejs');
}

});

app.get('/EditarProdutos',function(req,res){
	var sess = req.session;
	if(sess.logado == 1){
	res.render('editar_produtos.ejs');
}else{
	res.render('index.ejs');
}

});

app.get('/criar_projetos_sociais.ejs',function(req,res){
	var sess = req.session;
	if(sess.logado == 1){
	res.render('criar_projetos_sociais.ejs');
}else{
	res.render('index.ejs');
}

});



app.get('/buscar_produtos_cadastrados.ejs',function(req,res){
	var sess = req.session;
	if(sess.logado == 1){
	res.render('buscar_produtos_cadastrados.ejs');
}else{
	res.render('index.ejs');
}

});

app.get('/deletarProdutos/:id',function(req,res){
	var id = req.params.id;
	var conexao = app.banco.conexao();
	var usuarioBanco = new app.banco.usuarioBanco(conexao);
	usuarioBanco.deletarProdutos(id,function(erro,sucesso){
		if(erro){
			console.log(erro);
		}else{
			res.redirect('/buscarProdutos');
		}
	});
});


//--------------------------------- POSTs-----------------------------

app.post('/cadastro_ong',function(req,res){
	var dados  = req.body;
	var id_ong = dados.id;
	var conexao = app.banco.conexao();
	var usuarioBanco = new app.banco.usuarioBanco(conexao);
	var imagem = `uploads/img_perfil.png`;
	dados.foto = imagem;
	var cripto = md5(dados.senha);
	dados.senha = cripto;
	usuarioBanco.verificaCadastroOng(dados,function(erro,sucesso){
		if(sucesso.length){
			var mensagem = "Usuário já cadastrado. Tente novamente.";
			res.render('cadastro_ong.ejs',{'mensagem':mensagem});
		}else{
			usuarioBanco.salvar(dados,function(erro,sucesso){
				if(erro){
					console.log(erro);
				}else{
						res.redirect('login_ong.ejs');
				}
			});

		}

	});
	});

app.post('/cadastro_cliente',function(req,res){
	var dados  = req.body;
	var id_cliente = dados.id;
	var conexao = app.banco.conexao();
	var usuarioBanco = new app.banco.usuarioBanco(conexao);
	var imagem = `uploads/img_perfil.png`;
	dados.foto = imagem;
	var cripto = md5(dados.senha);
	dados.senha = cripto;
	usuarioBanco.verificaCadastroCliente(dados,function(erro,sucesso){
		if(sucesso.length){
			var mensagem = "Usuário já cadastrado. Tente novamente.";
			res.render('cadastro_cliente.ejs',{'mensagem':mensagem});
		}else{
			usuarioBanco.salvarCliente(dados,function(erro,sucesso){
				if(erro){
					console.log(erro);
				}else{
						res.redirect('login_cliente.ejs');
				}
			});

		}

	});
});



app.post('/loginOng',function(req,res){
	var sess = req.session;
	var dados = req.body;
	var conexao = app.banco.conexao();
	var usuarioBanco = new app.banco.usuarioBanco(conexao);
	var cripto = md5(dados.senha);
	dados.senha = cripto;
	usuarioBanco.verificaLoginOng(dados,function(erro,sucesso){
		if(sucesso.length){

			sess.id_usuario = sucesso[0].id;
			sess.usuario = sucesso[0].usuario;
			sess.nome = sucesso[0].nome;
			sess.email = sucesso[0].email;
			sess.estado = sucesso[0].estado;
			sess.cidade = sucesso[0].cidade;
			sess.bairro = sucesso[0].bairro;
			sess.rua = sucesso[0].rua;
			sess.numero = sucesso[0].numero;
			sess.foto = sucesso[0].foto;
			sess.logado = 1;

					res.redirect('/index_ong.ejs');
		}else{
			var mensagem = "Usuário ou senha inválidos. Tente novamente.";
			res.render('login_ong.ejs', {'mensagem':mensagem});
		}
	});
});

app.post('/loginCliente',function(req,res){
	var sess = req.session;
	var dados = req.body;
	var conexao = app.banco.conexao();
	var usuarioBanco = new app.banco.usuarioBanco(conexao);
	var cripto = md5(dados.senha);
	dados.senha = cripto;
	usuarioBanco.verificaLoginCliente(dados,function(erro,sucesso){
		if(sucesso.length){
			sess.id_usuario = sucesso[0].id;
			sess.usuario = sucesso[0].usuario;
			sess.nome = sucesso[0].nome;
			sess.foto = sucesso[0].foto;
			sess.logado = 1;

				res.redirect('/index_cliente.ejs');
		}else{
			var mensagem = "Usuário ou senha inválidos. Tente novamente.";
			res.render('login_cliente.ejs', {'mensagem':mensagem});
		}
	});
});

app.get('/logout',function(req,res){
  var sess = req.session;
  sess.logado=0;
  sess.destroy();
  res.redirect('/index.ejs');
});

app.post('/registrarProdutos',function(req,res){
	var sess = req.session;
	var dados  = req.body;
	var id_ong = dados.id_ong;
	dados.id_ong = sess.id_usuario;
	var conexao = app.banco.conexao();
	var usuarioBanco = new app.banco.usuarioBanco(conexao);
	usuarioBanco.registrarProdutos(dados,function(erro,sucesso){
		if(erro){
			console.log(erro);
		}else{
			res.render('visualizar_produtos_registrados.ejs', {'info':dados});
		}
	});

});

app.get('/buscarProdutos',function(req,res){
	var sess = req.session;
	var dados = req.body;
	var conexao = app.banco.conexao();
	var usuarioBanco = new app.banco.usuarioBanco(conexao);
	usuarioBanco.buscarTodosProdutos(sess,function(erro,sucesso){
		if(erro){
			console.log(erro);
		}
		else {
			console.log(dados);
			res.render('buscar_produtos_cadastrados.ejs', {'resultado':sucesso});
		}
	});
});

app.post('/buscarNomeProduto', function(req,res){
	var nome = req.body;
	var conexao = app.banco.conexao();
	var usuarioBanco = new app.banco.usuarioBanco(conexao);

	usuarioBanco.buscarNomeProduto(nome, function(erro,sucesso){
		if(erro)
		{
			console.log(erro);
		}
		else {
			res.render('buscar_produtos_cadastrados.ejs', {'resultado':sucesso});
		}
	});
});

app.get('/editarProdutos/:id',function(req,res){
	var id = req.params.id;
	var conexao = app.banco.conexao();
	var usuarioBanco = new app.banco.usuarioBanco(conexao);
	usuarioBanco.editarProdutos(id,function(erro,sucesso){
		if(erro){
			console.log(erro);
		}else{

			res.render('editar_produtos.ejs',{'resultado':sucesso});
		}
	});

});

app.get('/visualizar_produtos_registrados',function(req,res){
	var conexao = app.banco.conexao();
	var usuarioBanco = new app.banco.usuarioBanco(conexao);
	usuarioBanco.buscarTodosProdutos(function(erro,sucesso){
		if(erro){
			console.log(erro);
		}else{
			res.render('visualizar_produtos_registrados.ejs', {'info':dados});
		}
	});

});

app.post('/editandoProduto',function(req,res){
	var dados = req.body;
	var conexao = app.banco.conexao();
	var usuarioBanco = new app.banco.usuarioBanco(conexao);
	usuarioBanco.editantoProduto(dados,function(erro,sucesso){
		if(erro){
			console.log(erro);
		}else{

			res.render('visualizar_produtos_registrados.ejs',{'info':dados});
		}
	});

});

app.get('/verInformacoesOng',function(req,res){
	var sess = req.session;
	var id = sess.id_usuario;
	var conexao = app.banco.conexao();
	var usuarioBanco = new app.banco.usuarioBanco(conexao);
	console.log("chegou id valendo",id);
	usuarioBanco.exibeInformacoesOng(id,function(erro,sucesso){
		if(erro){
			console.log("deu erro",erro);
		}else{
			console.log("deu sucesso",sucesso);
			res.render('verInformacoesOng.ejs',{'resultado':sucesso});
		}

	});
});

app.get('/editarInformacoesOng/:id',function(req,res){
	var id = req.params.id;
	var conexao = app.banco.conexao();
	var usuarioBanco = new app.banco.usuarioBanco(conexao);
	usuarioBanco.exibeInformacoesOng(id,function(erro,sucesso){
		if(erro){
			console.log(erro);
		}else{
			res.render('editar_informacoes_ong.ejs',{'resultado':sucesso});
		}
	});
});

app.post('/editandoInformacoesOng',function(req,res){
	var dados = req.body;
	var conexao = app.banco.conexao();
	var usuarioBanco = new app.banco.usuarioBanco(conexao);
	usuarioBanco.editantoInformacoesOng(dados,function(erro,sucesso){
		if(erro){
			console.log(erro);
		}else{
			res.redirect('/verInformacoesOng');
		}
	});

});


app.get('/verInformacoesCliente',function(req,res){
	var sess = req.session;
	var id = sess.id_usuario;
	var conexao = app.banco.conexao();
	var usuarioBanco = new app.banco.usuarioBanco(conexao);
	console.log("chegou id valendo",id);
	usuarioBanco.exibeInformacoesCliente(id,function(erro,sucesso){
		if(erro){
			console.log("deu erro",erro);
		}else{
			console.log("deu sucesso",sucesso);
			res.render('verInformacoesCliente.ejs',{'resultado':sucesso});
		}

	});
});

app.get('/editarInformacoesCliente/:id',function(req,res){
	var id = req.params.id;
	var conexao = app.banco.conexao();
	var usuarioBanco = new app.banco.usuarioBanco(conexao);
	usuarioBanco.exibeInformacoesCliente(id,function(erro,sucesso){
		if(erro){
			console.log(erro);
		}else{
			res.render('editar_informacoes_cliente.ejs',{'resultado':sucesso});
		}
	});
});

app.post('/editandoInformacoesCliente',function(req,res){
	var dados = req.body;
	var conexao = app.banco.conexao();
	var usuarioBanco = new app.banco.usuarioBanco(conexao);
	usuarioBanco.editantoInformacoesCliente(dados,function(erro,sucesso){
		if(erro){
			console.log(erro);
		}else{
			res.redirect('/verInformacoesCliente');
		}
	});

});



app.post('/adicionarProjetos',function(req,res){
	var dados = req.body;
	var conexao = app.banco.conexao();
	var usuarioBanco = new app.banco.usuarioBanco(conexao);
	usuarioBanco.adicionarProjetos(dados,function(erro,sucesso){
		if(erro){
			console.log(erro);
		}else{
			res.redirect('/projetos_sociais_ong');
		}
	});

});

app.get('/projetos_sociais',function(req,res){
	var conexao = app.banco.conexao();
	var usuarioBanco = new app.banco.usuarioBanco(conexao);
	usuarioBanco.exibirTodosProjetos(function(erro,sucesso){
		if(erro){
			console.log(erro);
		}else{
			res.render('projetos_sociais.ejs',{'resultado':sucesso});
		}
	});
});

app.get('/projetos_sociais_cliente',function(req,res){
	var conexao = app.banco.conexao();
	var usuarioBanco = new app.banco.usuarioBanco(conexao);
	usuarioBanco.exibirTodosProjetos(function(erro,sucesso){
		if(erro){
			console.log(erro);
		}else{
			res.render('projetos_sociais_cliente.ejs',{'resultado':sucesso});
		}
	});
});

app.get('/projetos_sociais_ong',function(req,res){
	var conexao = app.banco.conexao();
	var usuarioBanco = new app.banco.usuarioBanco(conexao);
	usuarioBanco.exibirTodosProjetos(function(erro,sucesso){
		if(erro){
			console.log(erro);
		}else{
			res.render('projetos_sociais_ong.ejs',{'resultado':sucesso});
		}
	});
});


app.post('/registrarComentarios',function(req,res){
	var dados = req.body;
	var conexao = app.banco.conexao();
	var usuarioBanco = new app.banco.usuarioBanco(conexao);
	usuarioBanco.registrarComentarios(dados,function(erro,sucesso){
		if(erro){
			console.log(erro);
		}else{
			res.render('index.ejs', {'resultado':sucesso});
		}
	});
});

app.get('/comentarios',function(req,res){
	var conexao = app.banco.conexao();
	var usuarioBanco = new app.banco.usuarioBanco(conexao);
	usuarioBanco.exibirComentarios(function(erro,sucesso){
		if(erro){
			console.log(erro);
		}else{
			res.render('comentarios.ejs',{'resultado':sucesso});
		}
	});
});

app.get('/deletarContaOng/:id',function(req,res){
	var id = req.params.id;
	console.log(id);
	var conexao = app.banco.conexao();
	var usuarioBanco = new app.banco.usuarioBanco(conexao);
	usuarioBanco.deletarContaOng(id,function(erro,sucesso){
		if(erro){
			console.log(erro);
		}else{
			res.redirect('/index.ejs');
		}
	});
});

app.get('/deletarContaCliente/:id',function(req,res){
	var id = req.params.id;
	console.log(id);
	var conexao = app.banco.conexao();
	var usuarioBanco = new app.banco.usuarioBanco(conexao);
	usuarioBanco.deletarContaCliente(id,function(erro,sucesso){
		if(erro){
			console.log(erro);
		}else{
			res.redirect('/index.ejs');
		}
	});
});

app.get('/registrarInformacoesPagamento',function(req,res){
	res.render('registrarInformacoesPagamento.ejs');
});

app.post('/registrarInformacoesPagamento',function(req,res){
	var sess = req.session;
	var dados  = req.body;
	var id_ong = dados.id_ong;
	dados.id_ong = sess.id_usuario;
	var conexao = app.banco.conexao();
	var usuarioBanco = new app.banco.usuarioBanco(conexao);
	usuarioBanco.registrarInformacoesPagamento(dados,function(erro,sucesso){
		if(erro){
			console.log(erro);
		}else{
			usuarioBanco.exibirInformacoesPagamento(sess,function(erro,sucesso){
				if(erro){
					console.log(erro);
				}else{
					res.render('exibirInformacoesPagamento.ejs',{'resultado':sucesso});
				}
			});		}
	});

});

app.get('/exibirInformacoesPagamento',function(req,res){

	var sess = req.session;
	var dados = req.body;
	var conexao = app.banco.conexao();
	var usuarioBanco = new app.banco.usuarioBanco(conexao);
	usuarioBanco.exibirInformacoesPagamento(sess,function(erro,sucesso){
		if(erro){
			console.log(erro);
		}else{
			res.render('exibirInformacoesPagamento.ejs',{'resultado':sucesso});
		}
	});
});

app.get('/deletarInformacoesPagamento/:id',function(req,res){
	var id = req.params.id;
	var conexao = app.banco.conexao();
	var usuarioBanco = new app.banco.usuarioBanco(conexao);
	usuarioBanco.deletarInformacoesPagamento(id,function(erro,sucesso){
		if(erro){
			console.log(erro);
		}else{
			res.redirect('/exibirInformacoesPagamento');
		}
	});
});

app.post('/editarFotoOng', upload.single("foto"), function(req,res){
	const {filename,size} = req.file;
	var sess = req.session;
	sess.foto = `/uploads/${filename}`;
	var id = sess.id_usuario;
	var dados = req.body;
	var conexao = app.banco.conexao();
	var usuarioBanco = new app.banco.usuarioBanco(conexao);
	usuarioBanco.editarFotoOng(sess,function(erro,sucesso){
		if(erro){
			console.log(erro);
		}else{

			res.redirect('/perfil_ong.ejs');
		}
	});
});


app.post('/editarFotoCliente', upload.single("foto"), function(req,res){
	const {filename,size} = req.file;
	var sess = req.session;
	sess.foto = `/uploads/${filename}`;
	var id = sess.id_usuario;
	var dados = req.body;
	var conexao = app.banco.conexao();
	var usuarioBanco = new app.banco.usuarioBanco(conexao);
	usuarioBanco.editarFotoCliente(sess,function(erro,sucesso){
		if(erro){
			console.log(erro);
		}else{

			res.redirect('/perfil_cliente.ejs');
		}
	});
});






var porta = 3000;
app.listen(porta,function(){
	console.log('Servidor Rodando');
});
