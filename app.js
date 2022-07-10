const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const dotenv = require('dotenv');
dotenv.config({ path: './Variables_Entorno/.env' });

app.use('/publico', express.static('publico'));
app.use('/publico', express.static(__dirname + '/publico'));

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
    res.render(__dirname + '/vistas/menu')
})

app.post('/login', async (req, res) => {
    const name = req.body.user
    const matricula = req.body.matricula
    const password = req.body.password
    connection.query('INSERT INTO usuarios SET ?', { nombre: name, matricula: matricula, contrasena: password }, async (error, results) => {
        if (error)
            res.render(__dirname + '/vistas/inicio')
        else
            res.render(__dirname + '/vistas/login')
    })
})

app.post('/menu', (req, res) => {
    let arreglo = new Array;
    const nombre = req.body.nombre
    const matricula = req.body.matricula
    const password = req.body.password
    //const queryUpdate = "UPDATE `usuario` SET dinero=" + dineroF + ' WHERE name= "' + name + '"';
    connection.query('SELECT * FROM usuarios WHERE matricula = ?', matricula, async (error, results) => {
        arreglo = results
        console.log(arreglo)
        if(arreglo.length == []){
            res.render(__dirname + '/vistas/login')
        }else if(arreglo.length == 1 && arreglo[0].nombre == nombre && arreglo[0].contrasena == password){
            res.render(__dirname + '/vistas/menu')
        }else{
            res.render(__dirname + '/vistas/login')
        }
    })
})

app.listen(3000, (req, res) => {
    console.log('SERVER RUNNING IN http://localhost:3000');
})