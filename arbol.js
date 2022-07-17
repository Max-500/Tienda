class Producto {
    constructor() {
        this.nombre = null
        this.caducidad = null
        this.cantidad = null
        this.precio = null
        this.marca = null
    }
}

class Node {
    producto = new Producto()
    constructor(producto) {
        this.root = producto;
        this.left = null;
        this.right = null;
    }
}

class BynarySearchTree {

    constructor(data) {
        this.root = null;
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
            console.log('Antes de eliminar: ' + node);
            node = this.deleteNode(node); // -> devuelve la misma estructura con el nodo eliminado
        } else if (data < node.root) {
            // nos movemos a la izquierda
            console.log('Nodo izquierdo: ' + node)
            node.left = this.delete(node.left, data);
        } else if (data > node.root) {
            // derecha
            console.log('Node derecho: ' + node)
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
arbol = module.exports;