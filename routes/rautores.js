module.exports = function(app, swig) {
    app.get("/autores", function(req, res) {

        let autores = [{
            "nombre": "Mark Knopfler",
            "grupo": "Dire Straits",
            "rol": "guitarrista"
        }, {
            "nombre": "John Lennon",
            "grupo": "The Beatles",
            "rol": "bajista"
        }, {
            "nombre": "Ryan Tedder",
            "grupo": "OneRepublic",
            "rol": "cantante"
        }];

        let respuesta = swig.renderFile('views/autores.html', {
            vendedor: 'Tienda de canciones',
            autores: autores
        });

        res.send(respuesta);
    });

    app.get('/autores/agregar', function (req, res) {

        let roles = [{
            "value": "cantante",
            "rol": "Cantante"
        }, {
            "value": "batería",
            "rol": "Batería"
        }, {
            "value": "guitarrista",
            "rol": "Guitarrista"
        }, {
            "value": "bajista",
            "rol": "Bajista"
        }, {
            "value": "teclista",
            "rol": "Teclista"
        }];

        let respuesta = swig.renderFile('views/autores-agregar.html', {
            roles : roles
        });
        res.send(respuesta);
    });

    app.post("/autor", function(req, res) {
        let respuesta = "";
        let undefined = " no enviado en la petición." + "<br>";

        if(typeof(req.body.nombre) === "undefined" || req.body.nombre === null || req.body.nombre === "")
            respuesta += "Nombre del autor" + undefined;
        else
            respuesta += "Autor agregado: " + req.body.nombre + "<br>";

        if(typeof(req.body.grupo) === "undefined" || req.body.grupo === null || req.body.grupo === "")
            respuesta += "Grupo del autor" + undefined;
        else
            respuesta += "Grupo: " + req.body.grupo + "<br>";

        if(typeof(req.body.rol) == "undefined" || req.body.rol === null || req.body.rol === "")
            respuesta += "Rol del autor" + undefined;
        else
            respuesta += "Rol: " + req.body.rol;

        res.send(respuesta);
    });

    app.get('/autores/filtrar/:rol', function (req, res) {
        let rol = req.params.rol;

        let autores = [{
            "nombre": "Mark Knopfler",
            "grupo": "Dire Straits",
            "rol": "guitarrista"
        }, {
            "nombre": "John Lennon",
            "grupo": "The Beatles",
            "rol": "bajista"
        }, {
            "nombre": "Ryan Tedder",
            "grupo": "OneRepublic",
            "rol": "cantante"
        }];

        let newAutores = autores.filter(auth => auth.rol === rol);

        let respuesta = swig.renderFile('views/autores.html', {
            vendedor: 'Tienda de canciones',
            autores: newAutores
        });

        res.send(respuesta);
    });

    app.get('/autores/*', function (req, res) {
        res.redirect("/autores");
    });
};
