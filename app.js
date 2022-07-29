const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const dotenv = require('dotenv');
dotenv.config({ path: './Variables_Entorno/.env' });

app.use('/publico', express.static('publico'));
app.use('/publico', express.static(__dirname + '/publico'));

app.set('view engine', 'ejs');

const session = require('express-session');
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

const connection = require('./BDD/bdd');
const { name } = require('ejs');

const PDF = require('pdfkit');
const fs = require('fs');

// Rutas para VISTAS INICIO ----------------------------------------------------------------
app.get('/', async (req, res) => {
    res.render(__dirname + '/vistas/inicio')
})

app.get('/registro', async (req, res) => {
    res.render(__dirname + '/vistas/registroEmpleado')
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

app.get('/nosotros', async (req, res) => {
    res.render(__dirname + '/vistas/nosotros')
})

app.get('/visualizar', async (req, res) => {
    res.render(__dirname + '/vistas/visualizar')
})
//
app.get('/eliminarempleado', async (req, res) => {
    res.render(__dirname + '/vistas/eliminarEmpleado')
})

app.get('/agregarempleado', async (req, res) => {
    res.render(__dirname + '/vistas/agregarEmpleado')
})

app.get('/historial', async (req, res) => {
    res.render(__dirname + '/vistas/historial')
})

// Rutas para Administrador

app.get('/menuAdministrador', async (req, res) => {
    res.render(__dirname + '/vistas/menuAdmin')
})

app.get('/anadirAdmin', async (req, res) => {
    res.render(__dirname + '/vistas/anadirAdmin')
})

app.get('/eliminarAdmin', async (req, res) => {
    res.render(__dirname + '/vistas/eliminarAdmin')
})

app.get('/salir', async (req, res) => {
    res.render(__dirname + '/vistas/inicio')
})

app.get('/visualizarAdmin', async (req, res) => {
    res.render(__dirname + '/vistas/visualizarAdmin')
})

app.get('/facturarAdmin', async (req, res) => {
    res.render(__dirname + '/vistas/facturar')
})

// Rutas para VISTAS FIN ----------------------------------------------------------------

// Rutas para APIS INICIO ----------------------------------------------------------------

app.get('/login_api', (req, res) => {
    const nombre = req.query.nombre
    const matricula = req.query.matricula
    const password = req.query.contrasena
    const tipo = req.query.tipo
    req.session.trabajador = nombre
    req.session.matricula = matricula
    req.session.tipoTrabajador = tipo
    connection.query(`SELECT * FROM usuarios WHERE nombre = "${nombre}" && matricula = ${matricula} && contrasena = ${password} && tipo = "${tipo}";`, async (error, results) => {
        if (results.length > 0) {
            res.send({"status": true, "tipo": tipo})   
        } else {
            res.send({"status": false})
        }
    })
});

app.get('/registro_api', (req, res) => {
    const nombre = req.query.nombre
    const matricula = req.query.matricula
    const pass = req.query.contrasena
    connection.query(`INSERT INTO usuarios(nombre, tipo, matricula, contrasena) VALUES ("${nombre}", "Empleado",${matricula}, ${pass});`, async (error, results) => {
        if (error == null) {
            res.send({ "status": true })
        } else {
            res.send({"status": false})
        }
    })
});

app.post('/anadir_api', (req, res)=>{
    const nombre = req.query.nombre
    const cantidad = req.query.cantidad
    const precio = req.query.precio
    const marca = req.query.marca

    const trabajador = req.session.trabajador
    const matricula = req.session.matricula
    const tipo = req.session.tipoTrabajador

    const accion = "Agregar"
    console.log(accion)
    connection.query(`SELECT * FROM almacen wHERE nombre = "${nombre}" && cantidad = ${cantidad};`, async (error, results)=>{
        if(results.length > 0){
            res.send({"status": false})
        }else{
            connection.query(`INSERT INTO almacen(nombre, cantidad, precio, marca) VALUES ("${nombre}", ${cantidad}, ${precio}, "${marca}");`, async (err, resultados)=>{
                connection.query(`INSERT INTO historial(nombre, matricula, tipo, accion, nombre_producto, cantidad, precio, marca) VALUES ("${trabajador}", ${matricula}, "${tipo}", "${accion}" ,"${nombre}", ${cantidad}, ${precio}, "${marca}");`, async (error, resultados)=>{
                    res.send({"status": true})
                })
            })
        }
    })
})

app.delete('/eliminar_api', (req, res)=>{
    const nombre = req.query.nombre
    const cantidad = req.query.cantidad
    const precio = req.query.precio
    const marca = req.query.marca

    const trabajador = req.session.trabajador
    const matricula = req.session.matricula
    const tipo = req.session.tipoTrabajador

    const accion = "Eliminar"

    connection.query(`DELETE FROM almacen WHERE nombre = "${nombre}" && cantidad = ${cantidad} && precio = ${precio} && marca = "${marca}";`, async (error, results)=>{
        if(results.affectedRows > 0){
            connection.query(`INSERT INTO historial(nombre, matricula, tipo, accion, nombre_producto, cantidad, precio, marca) VALUES ("${trabajador}", ${matricula}, "${tipo}", "${accion}" ,"${nombre}", ${cantidad}, ${precio}, "${marca}");`, async (error, resultados)=>{
                res.send({"status": true})
            })
        }else{
            res.send({"status": false})
        }
    })
})

app.post('/visualizar_api', (req, res)=>{
    let arreglo = new Array;
    let peso;
    connection.query(`SELECT * FROM almacen;`, async (error, results)=>{
        arreglo = results
        peso = arreglo.length
        res.send({"peso": peso, "resultados":results});
    })
})

app.delete('/eliminar_empleado_api', (req, res)=>{
    console.log('Consumo el servicio eliminar')
    const nombre = req.query.nombre;
    const matricula = req.query.matricula
    const pass = req.query.password
    connection.query(`SELECT * FROM usuarios WHERE tipo = "Administrador";`, async(error, results)=>{
        let superPassword = results[0].contrasena;
        if(pass == superPassword){
        connection.query(`DELETE FROM usuarios WHERE nombre = "${nombre}" && matricula = ${matricula};`, async(error, results)=>{
            if(results.affectedRows > 0){
                res.send({"status": true})
            }else{
                res.send({"status": false})
            }
        })
        }else{
            res.send({"status": false})
        }
    })
})

app.post('/facturar_api', (req, res)=>{
    let turno = req.query.turno;
    let nombre = req.query.nombre;
    let apellido = req.query.apellido
    let email = req.query.email
    let direccion = req.query.direccion
    let telefono = req.query.telefono
    let producto1 = req.query.producto1
    let producto2 = req.query.producto2
    let producto3 = req.query.producto3
    let producto4 = req.query.producto4
    let cantidad1 = req.query.cantidad1
    let cantidad2 = req.query.cantidad2
    let cantidad3 = req.query.cantidad3
    let cantidad4 = req.query.cantidad4

    let espacio = '\n'

    var doc = new PDF();
    doc.pipe(fs.createWriteStream(__dirname + '/factura.pdf'))
    doc.text('Nombre del Comprador: ' + nombre + ' ' + apellido + espacio + 'Turno: ' + turno + espacio + 'Email: ' + email + espacio + 'Direccion: ' + direccion + espacio 
    + 'Telefono: ' + telefono + espacio + producto1 + ': ' + cantidad1 + espacio + producto2 + ': ' + cantidad2 + espacio + producto3 + ': ' + cantidad3 + espacio
    + producto4 + ': ' + cantidad4, {
        align: 'justify'
    })
    
    res.send({'status':true})
    doc.end();
})

// Rutas para APIS FINAL ----------------------------------------------------------------

app.listen(3000, (req, res) => {
    console.log('SERVER RUNNING IN http://localhost:3000');
})