const fs = require('fs');
const path = require('path');

const dbFilePath = path.join(__dirname, '..', 'db.json');

// Asegurémonos de leer los productos correctamente desde el archivo JSON
const readProductsFromFile = () => {
    const data = fs.readFileSync(dbFilePath, 'utf-8');
    const jsonData = JSON.parse(data);
    return jsonData.products || [];
};

let products = readProductsFromFile();

export default function handler(req, res) {
    console.log(`Received ${req.method} request`);

    if (req.method === 'GET') {
        products = readProductsFromFile(); // Leer productos en cada petición GET
        console.log('GET products:', products);
        res.status(200).json(products);
    } else if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString(); // convertir Buffer a string
            console.log('Received chunk:', chunk.toString());
        });
        req.on('end', () => {
            try {
                const newProduct = JSON.parse(body);
                console.log('Parsed new product:', newProduct);
                newProduct.id = products.length + 1;
                products.push(newProduct);
                fs.writeFileSync(dbFilePath, JSON.stringify({ products }, null, 2));
                console.log('Updated products:', products);
                res.status(201).json(newProduct);
            } catch (error) {
                console.error('Error al procesar la solicitud POST:', error.message);
                res.status(500).json({ message: 'Error interno del servidor', error: error.message });
            }
        });
    } else if (req.method === 'DELETE') {
        const { id } = req.query;
        console.log('DELETE product id:', id);
        products = products.filter(product => product.id !== parseInt(id, 10));
        fs.writeFileSync(dbFilePath, JSON.stringify({ products }, null, 2));
        console.log('Updated products after delete:', products);
        res.status(204).end();
    } else {
        console.log('Method not allowed');
        res.status(405).json({ message: 'Method not allowed' });
    }
}
