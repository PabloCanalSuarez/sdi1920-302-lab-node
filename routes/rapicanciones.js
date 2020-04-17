module.exports = function(app, gestorBD) {

    app.get("/api/cancion", function(req, res) {
        gestorBD.obtenerCanciones( {} , function(canciones) {
            if (canciones == null) {
                res.status(500);
                res.json({
                    error : "se ha producido un error"
                })
            } else {
                res.status(200);
                res.send( JSON.stringify(canciones) );
            }
        });
    });

    app.get("/api/cancion/:id", function(req, res) {
        var criterio = { "_id" : gestorBD.mongo.ObjectID(req.params.id)}

        gestorBD.obtenerCanciones(criterio,function(canciones){
            if ( canciones == null ){
                res.status(500);
                res.json({
                    error : "se ha producido un error"
                })
            } else {
                res.status(200);
                res.send( JSON.stringify(canciones[0]) );
            }
        });
    });

    app.delete("/api/cancion/:id", function(req, res) {
        var criterio = { "_id" : gestorBD.mongo.ObjectID(req.params.id)};

        let idCancion = gestorBD.mongo.ObjectID( req.params.id );
        let user = res.usuario;
        canOperateWithCancion(user, idCancion, function(isDeletable) {
           if(isDeletable) {
               gestorBD.eliminarCancion(criterio, function(canciones) {
                   if (canciones == null) {
                       res.status(500);
                       res.json({
                           error: "se ha producido un error"
                       })
                   } else {
                       res.status(200);
                       res.send(JSON.stringify(canciones));
                   }
               });
           } else {
               res.status(400);
               res.json({
                   error: "el usuario debe ser el autor de la canción"
               })
           }
        });
    });

    app.post("/api/cancion", function(req, res) {
        var cancion = {
            nombre: req.body.nombre,
            genero: req.body.genero,
            precio: req.body.precio,
            autor: res.usuario,
        };
        // ¿Validar nombre, genero, precio?

        if( cancion.nombre == null || cancion.nombre == "" ) {
            res.status(400);
            res.json({
                error: "nombre incorrecto"
            });
        } else if( cancion.genero == null || cancion.genero == "" ) {
            res.status(400);
            res.json({
                error: "género incorrecto"
            });
        } else if( cancion.precio == null || cancion.precio == "" ) {
            res.status(400);
            res.json({
                error: "precio incorrecto"
            });
        } else {
            gestorBD.insertarCancion(cancion, function (id) {
                if (id == null) {
                    res.status(500);
                    res.json({
                        error: "se ha producido un error"
                    })
                } else {
                    res.status(201);
                    res.json({
                        mensaje: "canción insertarda",
                        _id: id
                    });
                }
            });
        }

    });

    app.put("/api/cancion/:id", function(req, res) {

        let criterio = { "_id" : gestorBD.mongo.ObjectID(req.params.id) };

        let cancion = {}; // Solo los atributos a modificar
        if (req.body.nombre != null) {
            cancion.nombre = req.body.nombre;
        } else {
            res.status(400);
            return res.json({
                error : "nombre incorrecto"
            });
        }
        if (req.body.genero != null) {
            cancion.genero = req.body.genero;
        } else {
            res.status(400);
            return res.json({
                error : "precio incorrecto"
            });
        }
        if (req.body.precio != null) {
            cancion.precio = req.body.precio;
        } else {
            res.status(400);
            return res.json({
                error : "datos incorrectos"
            });
        }
        let idCancion = gestorBD.mongo.ObjectID( req.params.id );
        let user = res.usuario;
        canOperateWithCancion(user, idCancion, function(isUpdatable) {
            if(isUpdatable) {
                gestorBD.modificarCancion(criterio, cancion, function (result) {
                    if (result == null) {
                        res.status(500);
                        res.json({
                            error: "se ha producido un error"
                        })
                    } else {
                        res.status(200);
                        res.json({
                            mensaje: "canción modificada",
                            _id: req.params.id
                        })
                    }
                });
            } else {
                res.status(400);
                res.json({
                    error: "el usuario debe ser el autor de la canción"
                });
            }
        });
    });

    app.post("/api/autenticar/", function(req,res) {
        let seguro = app.get("crypto").createHmac('sha256', app.get('clave'))
            .update(req.body.password).digest('hex');
        let criterio = {
            email : req.body.email,
            password : seguro
        }

        gestorBD.obtenerUsuarios(criterio, function(usuarios) {
            if(usuarios==null || usuarios.length == 0){
                res.status(401);
                res.json({autenticado:false})
            }
            else {
                var token = app.get('jwt').sign({
                    usuario: criterio.email,
                    tiempo: Date.now()/1000
                }, "secreto");
                res.status(200);
                res.json(
                    {
                        autenticado: true,
                        token: token
                    })
            }
        })
    });
};

function canOperateWithCancion(usuario, cancionId, callback) {
    let criterio_cancion_autor = { $and: [
            { "_id": cancionId },
            { "autor": usuario }
        ] };
    gestorBD.obtenerCanciones(criterio_cancion_autor, function(canciones) {
        if (canciones == null || canciones.length <= 0) {
            callback(false);
        } else {
            callback(true);
        }
    });
}