// Modules
let express = require('express');
let app = express();
let swig = require('swig');
let bodyParser = require('body-parser');
let mongo = require('mongodb');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));


let gestorBD = require("./modules/gestorBD.js");
gestorBD.init(app,mongo);


// Variables
app.set('port', 8081);
app.set('db','mongodb://admin:TiendaMusicaSDI@tiendamusica-shard-00-00-bf4e4.mongodb.net:27017,tiendamusica-shard-00-01-bf4e4.mongodb.net:27017,tiendamusica-shard-00-02-bf4e4.mongodb.net:27017/test?ssl=true&replicaSet=tiendamusica-shard-0&authSource=admin&retryWrites=true&w=majority');

//Rutas/controladores por lógica
require("./routes/rusuarios.js")(app, swig, gestorBD); // (app, param1, param2, etc.)
require("./routes/rcanciones.js")(app, swig, gestorBD); // (app, param1, param2, etc.)
require("./routes/rautores.js")(app, swig);

// deploy server
app.listen(app.get('port'), function(){
    console.log("Servidor activo en: http://localhost:"+app.get('port'));
});