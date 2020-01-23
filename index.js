let express = require('express');
let morgan = require('morgan');
let bodyParser = require('body-parser');
let uuid = require('uuid');

let jsonParser = bodyParser.json();
let app = express();

comentarios = [{
	id: 123123,
	titulo: "no me gusta",
	contenido: "muy malo",
	autor: "Pepito",
	fecha: "hoy"
},
{
	id: 123142,
	titulo: "me gusta",
	contenido: "no esta mal",
	autor: "Fulanito",
	fecha: "ayer"
}];

app.use(express.static('public'));
app.use(morgan('dev'));

app.get('/blog-api/comentarios', (req, res) =>{
	return res.status(200).json(comentarios);
});

app.get('/blog-api/comentarios-por-autor', (req, res) =>{
	if(req.query.autor == ""){
		res.statusMessage = "No se recibió el parámetro autor.";
		return res.status(406).send();
	}
	let result = comentarios.filter((elemento) =>{
		if(elemento.autor == req.query.autor){
			return elemento;
		}
	});
	if(result){
		return res.status(200).json(result);
	}
	res.statusMessage = "No se encontraron comentarios del autor proporcionado."
	return res.status(404).send();
});

app.post('/blog-api/nuevo-comentario', jsonParser, (req, res) =>{
	if(req.body.titulo == "" || req.body.contenido == "" || req.body.autor == ""){
		res.statusMessage = "Faltan parámetros.";
		return res.status(406).send();
	}
	let newComment = req.body;
	newComment.fecha = new Date();
	newComment.id = uuid.v4();
	comentarios.push(newComment);
	return res.status(201).json(newComment);
});

app.put('/blog-api/actualizar-comentario/:id', jsonParser, (req, res) =>{
	if(req.body.id == ""){
		res.statusMessage = "No se proporciona el id del comentario."
		return res.status(406).send();
	}
	if(req.body.id != req.params.id){
		res.statusMessage = "Los id enviados no coinciden."
		return res.status(409).send();
	}
	if(req.body.titulo == "" && req.body.contenido == "" && req.body.autor == ""){
		res.statusMessage = "No hay parámetros para actualizar.";
		return res.status(406).send();
	}
	let result = comentarios.find((elemento) =>{
		if(req.body.id == elemento.id){
			if(req.body.titulo != ""){
				elemento.titulo = req.body.titulo;
			}
			if(req.body.contenido != ""){
				elemento.contenido = req.body.contenido;
			}
			if(req.body.autor != ""){
				elemento.autor = req.body.autor;
			}
		}
	});
	return res.status(202).json(result);
});

app.delete('/blog-api/remover-comentario/:id', jsonParser, (req, res) =>{
	let result = comentarios.find((elemento) =>{
		if(req.params.id == elemento.id){
			return elemento;
		}
	});
	if(result){
		comentarios = comentarios.filter((elemento) =>{
		if(elemento.id != result.id){
			return elemento;
		}
	});
		return res.status(200).json({});
	} else {
		res.statusMessage = "Comentario no encontrado.";
		return res.status(404).send();
	}
});

app.listen(8080, () =>{
	console.log("Servidor corriendo en puerto 8080.");
});