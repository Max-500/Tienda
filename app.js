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

app.get('/facturar', async (req, res) => {
    res.render(__dirname + '/vistas/facturar')
})

app.get('/factura2', async (req, res) => {
    res.render(__dirname + '/vistas/factura2')
})

app.get('/nosotros', async (req, res) => {
    res.render(__dirname + '/vistas/nosotros')
})
/*
app.get('/menuP', async (req, res) => {
    res.render(__dirname + '/vistas/menuPrincipal')
})
*/
app.get('/menuEjemplo', async (req, res) => {
    res.render(__dirname + '/vistas/menuP')
})

app.get('/tablas', async (req, res) => {
    res.render(__dirname + '/vistas/tablas')
})

app.get('/visualizar', async (req, res) => {
    res.render(__dirname + '/vistas/visualizar')
})

// Rutas para VISTAS FIN ----------------------------------------------------------------


class Tree {
    constructor() {
        this.value = null;
        this.left = null;
        this.right = null;
    }
    set(value) {
        if (this.value) {
            if (value.id_almacen < this.value.id_almacen) {
                this.setLeft(value);
            } else {
                this.setRight(value);
            }
        }
        else {
            this.value = value;
        }
    }
    setLeft(value) {
        if (this.left) {
            this.left.set(value);
        } else {
            this.left = new Tree();
            this.left.set(value);
        }
    }
    setRight(value) {
        if (this.right) {
            this.right.set(value);
        } else {
            this.right = new Tree();
            this.right.set(value);
        }
    }
}

function Inorder(tree) { //raiz, luego izquierdo y al ultimo derecho
    if (tree.left) {
        Inorder(tree.left);
    }
    console.log(tree.value.nombre);
    if (tree.right) {
        Inorder(tree.right);
    }
}

function Busqueda(tree, value) {

    if (value < tree.value.nombre) {
        Busqueda(tree.left, value)
    }
    else if (value > tree.value.nombre) {
        Busqueda(tree.right, value)
    }
    else if (value == tree.value.nombre) {
        console.log(tree.value.almacen);
    }
}

// Rutas para APIS INICIO ----------------------------------------------------------------
/*
*/
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
    // && matricula = ${matricula} && contrasena = ${password}"
    connection.query(`SELECT * FROM usuarios WHERE nombre = "${nombre}" && matricula = ${matricula} && contrasena = ${password};`, async (error, results) => {
        
        //console.log(results[0])
        if (results.length > 0) {
            console.log('verdadero')
            //res.send({ redirect: results })
            res.send({"status": true})
            
        } else {
            console.log('falso')
            res.send({"status": false})
            
            //res.send({ redirect: { "results": "" } });
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
            //res.send({ redirect: { "results": "" } });
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

/*app.post('/visualizar_api', (req, res)=>{
    console.log('Consumo el servicio')
    let arreglo = new Array;
    let peso;
    connection.query(`SELECT * FROM almacen;`, async (error, results)=>{
        arreglo = results
        peso = arreglo.length
        console.log(peso)
        for(let i = 0; i < peso; i++){
            //arbol.insert(arreglo[i].cantidad);
            let cantidad = arreglo[i].cantidad
            arbol.insert(cantidad)
        }
        console.log(arbol.root)
        res.send({"arreglo": arreglo, "peso": peso, "arbol": arbol});
    })
})
*/

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

app.post('/busqueda', (req, res) => {
    console.log('Usando el metodo 2')
    const busqueda =  connection.query.buscar;
    const tree = new Tree ();

    connection.query('SELECT * FROM almacen ORDER BY almacen.nombre ASC;', (err, results) => {

        for (i = 0; i < results.length; i++) {
            tree.set(results[i]);
        }

    })

    connection.query('SELECT * FROM almacen WHERE id_almacen = ?;', [busqueda_id], (err, results) => {
        res.render('ver', {
            login: true,
            almacen: results,
            insession: req.session.usuario
        });

    })
})

// Rutas para APIS FINAL ----------------------------------------------------------------

app.listen(3000, (req, res) => {
    console.log('SERVER RUNNING IN http://localhost:3000');
})