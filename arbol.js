class Producto {
    constructor(nombre, cantidad, precio, marca) {
        this.nombre = nombre
        this.cantidad = cantidad
        this.precio = precio
        this.marca = marca
    }
}

class Node {
    constructor(data) {
        this.root = data;
        this.left = null;
        this.right = null;
    }
}

class BynarySearchTree {

    constructor(data) {
        this.root = null;
    }

    getRootNode(){
        return this.root;
    }

    insert(data) {
        let newNode = new Node(data);
        if (this.root == null) {
            this.root = newNode;
            //console.log(this.root)
        } else {
            this.insertNode(this.root, newNode);
        }
    }

    insertNode(node, newNode) {
        if (newNode.root < node.root) {
            if (node.left == null) {
                node.left = newNode
                //console.log(node.left);
            } else {
                this.insertNode(node.left, newNode);
            }
        } else {
            if (newNode.root > node.root) {
                if (node.right == null) {
                    node.right = newNode
                    //console.log(node.right)
                } else {
                    this.insertNode(node.right, newNode);
                }
            }
        }
    }

    inOrder(node) {
        if (node != null) {
            this.inOrder(node.left);
            console.log(" | " + node.root + " | ")
            this.inOrder(node.right);
        }
    }

    preOrder(node) {
        if (node != null) {
            console.log(" | " + node.root + " | ")
            this.inOrder(node.left);
            this.inOrder(node.right);
        }
    }

    postOrder(node) {
        if (node != null) {
            this.inOrder(node.left);
            this.inOrder(node.right);
            console.log(" | " + node.root + " | ")
        }
    }

    search(node, data) {
        if (node == null) {
            return ('No tiene nodos a buscar')
        } else if (data < node.root) {
            return this.search(node.left, data);
        } else if (data > node.root) {
            return this.search(node.right, data);
        } else {
            return node
        }
    }

    delete(node, data) {
        if (node === null) {
            return null;
        }

        if (node.root === data) {
            // eliminamos
            node = this.deleteNode(node); // -> devuelve la misma estructura con el nodo eliminado
        } else if (data < node.root) {
            // nos movemos a la izquierda
            node.left = this.delete(node.left, data);
        } else if (data > node.root) {
            // derecha
            node.right = this.delete(node.right, data);
        }
        return node;
    }

    deleteNode(node) {
        if (node.left === null && node.right === null) {
            // es hoja
            return null;
        } else if (node.left !== null && node.right !== null) {
            // tiene dos hijos
            const successorNode = this.getSuccessor(node.left);
            const successorValue = successorNode.root;

            node = this.delete(node, successorValue);
            node.root = successorValue;

            return node;
        } else if (node.left !== null) {
            // tiene izquierdo
            return node.left;
        } else if (node.right !== null) {
            // derecho
            return node.right;
        }
    }

    getSuccessor(node) {
        let actualNode = node;

        while (actualNode) {
            if (actualNode.right === null) {
                break;
            }

            actualNode = actualNode.right;
        }

        return actualNode;
    }

    getRoot() {
        return this.root
    }

}

let arbol = new BynarySearchTree;
console.log('Insertando datos dentro del arbol')
arbol.insert(10);
arbol.insert(15);
arbol.insert(5);
console.log('Imprimiendo el arobl antes de eliminar')
console.log(arbol)
let root = arbol.getRoot();
console.log('Metodo de Busqueda del Arbol')
console.log(arbol.search(root, 10));
console.log('Metodo de Eliminar del arbol')
arbol.delete(root, 15);
console.log('Imprimedo el arbol despues de eliminar')
console.log(arbol);