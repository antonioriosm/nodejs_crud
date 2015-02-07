var express = require('express'),
    bodyParser = require('body-parser'),
    MongoClient = require('mongodb').MongoClient,
    ObjectID = require('mongodb').ObjectID,
    app = express();

MongoClient.connect('mongodb://localhost:27017/mongodbperu', function(err, db) {

    if (err) throw err;
    console.log('MondoDB iniciado correctamente');

    var usuarios = db.collection('usuarios');

    app.set('view engine', 'jade');
    app.use(express.static(__dirname + '/public'));
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.get('/', function(req, res) {

        /* SELECT * FROM usuarios ORDER BY usuario */
        usuarios.find().sort({usuario: 1}).toArray(function(err, regs) {
            if (err) throw err;
            
            res.render('index', {
                titulo: 'CRUD con NodeJS, Express y MongoDB',
                usuarios: regs
            });
        });

    });

    app.get('/agregar', function(req, res) {
        res.render('usuario/agregar');
    });

    app.post('/agregar', function(req, res) {

        usuarios.insert(req.body, function(err, reg) {
            if (err) throw err;

            res.redirect('/');
        });

    });

    app.get('/editar/:id', function(req, res) {
        var id = req.params.id;

        usuarios.findOne({_id: ObjectID(id)}, function(err, reg) {
            if (err) throw err;

            res.render('usuario/editar', {
                titulo: 'Editando usuario',
                usuario: reg
            });
        });
    });

    app.post('/editar', function(req, res) {

        /* UPDATE usuarios SET usuario=req.body.usuario,correo=req.body WHERE _id = req.body.id */
        usuarios.update({_id: ObjectID(req.body.id)}, req.body, function(err, resp) {
            if (err) throw err;

            res.redirect('/');
        });

    });

    app.get('/eliminar/:id', function(req, res) {

        usuarios.remove({_id: ObjectID(req.params.id)}, function(err, resp) {
            if (err) throw err;

            res.redirect('/');
        });
    });

    app.listen(4000, function() {
        console.log('App iniciada en 4000');
    });

});
