const express = require('express');
const app = express();
const arbol = require('./arbol');
const producto = require('./arbol')

//
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const dotenv = require('dotenv');
dotenv.config({ path: './Variables_Entorno/.env' });

app.use('/publico', express.static('publico'));
app.use('/publico', express.static(__dirname + '/publico'));

//

app.set('view engine', 'ejs');

const bcryptjs = require('bcryptjs');

const session = require('express-session');
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

const connection = require('./BDD/bdd');
const { name } = require('ejs');

// Rutas para VISTAS INICIO ----------------------------------------------------------------
app.get('/', async (req, res) => {
    res.render(__dirname + '/vistas/inicio')
})

app.get('/registro', async (req, res) => {
    res.render(__dirname + '/vistas/registro')
})


app.get('/login', async (req, res) => {
    res.render(__dirname + '/vistas/login')
})

app.get('/menu', async (req, res) => {
    res.render(__dirname + '/vistas/menuPrincipal')
})

app.get('/anadir', async (req, res) => {
    res.render(__dirname + '/vistas/anadir')
})

app.get('/eliminar', async (req, res) => {
    res.render(__dirname + '/vistas/eliminar')
})
/*
app.get('/facturar', async (req, res) => {
    res.render(__dirname + '/vistas/facturar')
})
*/

app.get('/facturar', async (req, res) => {
    res.render(__dirname + '/vistas/facturar')
})

app.get('/nosotros', async (req, res) => {
    res.render(__dirname + '/vistas/nosotros')
})

app.get('/menuEjemplo', async (req, res) => {
    res.render(__dirname + '/vistas/menuP')
})

app.get('/visualizar', async (req, res) => {
    res.render(__dirname + '/vistas/visualizar')
})

// Rutas para VISTAS FIN ----------------------------------------------------------------

// Rutas para APIS INICIO ----------------------------------------------------------------

app.get('/menuP_api', (req, res) => {
    const nombre = req.query.nombre
    const matricula = req.query.matricula

    connection.query(`SELECT * FROM usuarios WHERE matricula = ${matricula} `, async (error, results) => {
        console.log()
        if (results.length > 0) {
            res.send({ redirect: results })
        } else {
            res.send({ redirect: { "results": "" } });
        }
    })
});
/*

*/
app.get('/login_api', (req, res) => {
    console.log('Soy el metodo login')
    const nombre = req.query.nombre
    const matricula = req.query.matricula
    const password = req.query.contrasena
    console.log(nombre)
    console.log(matricula)
    console.log(password)
    connection.query(`SELECT * FROM usuarios WHERE nombre = "${nombre}" && matricula = ${matricula} && contrasena = ${password};`, async (error, results) => {

        if (results.length > 0) {
            console.log('verdadero')
            res.send({"status": true})
            
        } else {
            console.log('falso')
            res.send({"status": false})
        }
    })
});

app.post('/registro_api', (req, res) => {

    const nombre = req.query.nombre
    const matricula = req.query.matricula
    const pass = req.query.contrasena

    connection.query(`INSERT INTO usuarios(nombre, matricula, contrasena) VALUES ("${nombre}", ${matricula}, ${pass});`, async (error, results) => {
        
        if (error == null) {
            console.log('verdadero')
            res.send({ "status": true })
        } else {
            console.log('falso')
            res.send({"status": false})
        }
    })
});

app.post('/anadir_api', (req, res)=>{
    const nombre = req.query.nombre
    const cantidad = req.query.cantidad
    const precio = req.query.precio
    const marca = req.query.marca
    connection.query(`SELECT * FROM almacen wHERE nombre = "${nombre}" && cantidad = ${cantidad};`, async (error, results)=>{
        if(results.length > 0){
            res.send({"status": false})
        }else{
            console.log('Entro')
            connection.query(`INSERT INTO almacen(nombre, cantidad, precio, marca) VALUES ("${nombre}", ${cantidad}, ${precio}, "${marca}");`, async (err, resultados)=>{
                res.send({"status": true})
            })
        }
    })
})

app.delete('/eliminar_api', (req, res)=>{
    console.log('Soy el metodo eliminar')
    const nombre = req.query.nombre
    const cantidad = req.query.cantidad
    console.log(nombre)
    console.log(cantidad)
    connection.query(`DELETE FROM almacen WHERE nombre = "${nombre}" && cantidad = ${cantidad};`, async (error, results)=>{
        console.log(results.affectedRows)
        if(results.affectedRows > 0){
            res.send({"status": true})
        }else{
            res.send({"status": false})
        }
    })
})

app.post('/visualizar_api', (req, res)=>{
    console.log('Consumo el servicio')
    let arreglo = new Array;
    let peso;
    connection.query(`SELECT * FROM almacen;`, async (error, results)=>{
        arreglo = results
        peso = arreglo.length
        console.log(peso)
        //res.send({"arreglo": arreglo, "peso": peso, "resultados":results});
        res.send({"peso": peso, "resultados":results});
    })
})

// Rutas para APIS FINAL ----------------------------------------------------------------

app.listen(3000, (req, res) => {
    console.log('SERVER RUNNING IN http://localhost:3000');
})