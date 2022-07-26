CREATE DATABASE IF NOT EXISTS abarrotes_ideal;

USE abarrotes_ideal;

CREATE TABLE IF NOT EXISTS usuarios(
	id_usuario INT AUTO_INCREMENT,
    PRIMARY KEY (id_usuario),
    nombre VARCHAR(45) NOT NULL,
    matricula INT UNIQUE,
    contrasena INT NOT NULL
)ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS almacen(
	id_almacen INT AUTO_INCREMENT,
    PRIMARY KEY(id_almacen),
    nombre VARCHAR(45),
    cantidad INT NOT NULL,
    precio INT NOT NULL,
    marca VARCHAR(45) NOT NULL
)ENGINE=INNODB;