module.exports = function(app, swig, gestorBD) {

    app.post('/comentarios/:cancion_id', function(req, res) {
        if(req.session.usuario == null) {
            res.send("Error al enviar el comentario: No existe usuario en sesión");
            return;
        }

        let comentario = {
            autor: req.session.usuario,
            texto: req.body.texto,
            cancion_id: gestorBD.mongo.ObjectID(req.params.cancion_id),
        };

        gestorBD.insertarComentario(comentario, function(id) {
            if (id == null){
                res.send("Error al enviar el comentario");
            } else {
                res.send('Comentario Enviado: ' + id);
            }
        });
    });
};