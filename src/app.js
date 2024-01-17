const express = require('express');
const bodyParser = require('body-parser');
const ProductManager = require('./ProductManager');

const app = express();
const PORT = 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const productManager = new ProductManager('productos.json');

// Ruta para obtener productos con límite opcional (usando query param ?limit)
app.get('/products', async (req, res) => {
    const limit = parseInt(req.query.limit);

    let productsToReturn = productManager.products;

    if (!isNaN(limit) && limit > 0) {
        // Si se proporciona un límite válido, solo devolver el número de productos solicitados
        productsToReturn = productsToReturn.slice(0, limit);
    }

    res.json({ products: productsToReturn });
});

// Ruta para obtener un producto por ID (usando req.params)
app.get('/products/:pid', async (req, res) => {
    const productId = parseInt(req.params.pid);
    const product = productManager.products.find(product => product.id === productId);

    if (product) {
        res.json({ product });
    } else {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});

// Ruta para agregar un nuevo producto (usando POST)
app.post('/productos', async (req, res) => {
    const { title, description, price, thumbnail, code, stock } = req.body;
    await productManager.addProduct(title, description, price, thumbnail, code, stock);
    res.send('Producto agregado correctamente.');
});

// Ruta para eliminar un producto por ID (usando DELETE)
app.delete('/productos/:id', async (req, res) => {
    const productId = parseInt(req.params.id);
    await productManager.deleteProduct(productId);
    res.send(`Producto con ID ${productId} eliminado correctamente.`);
});

// Ruta para actualizar un producto por ID (usando PUT)
app.put('/productos/:id', async (req, res) => {
    const productId = parseInt(req.params.id);
    const updatedFields = req.body;
    await productManager.updateProduct(productId, updatedFields);
    res.send(`Producto con ID ${productId} actualizado correctamente.`);
});

// Inicia el servidor
app.listen(PORT, () => {
    console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});