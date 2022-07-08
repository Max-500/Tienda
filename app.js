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

app.get('/', (req, res) => {
    res.render(__dirname + '/vistas/registro')
})

app.post('/login', (req, res) => {
    req.session.name = req.body.user
    req.session.password = req.body.password
    connection.query('SELECT * FROM usuarios WHERE nombre = ?', req.session.name, async (error, resultados) => {
        for (i = 0; i < resultados.lenght; i++) {
            let booleano = (req.session.password == resultados[0].contrasena);
            if (booleano == true) {
                i = resultados.lenght
                let repetido = true
            }
        }
    })
})

app.listen(3000, (req, res) => {
    console.log('SERVER RUNNING IN http://localhost:3000');
})