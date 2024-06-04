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
    if (req.method === 'GET') {
        products = readProductsFromFile(); // Leer productos en cada petición GET
        res.status(200).json(products);
    } else if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString(); // convertir Buffer a string
        });
        req.on('end', () => {
            try {
                const newProduct = JSON.parse(body);
                newProduct.id = products.length + 1;
                products.push(newProduct);
                fs.writeFileSync(dbFilePath, JSON.stringify({ products }, null, 2));
                res.status(201).json(newProduct);
            } catch (error) {
                console.error('Error al procesar la solicitud POST:', error);
                res.status(500).json({ message: 'Error interno del servidor' });
            }
        });
    } else if (req.method === 'DELETE') {
        const { id } = req.query;
        products = products.filter(product => product.id !== parseInt(id, 10));
        fs.writeFileSync(dbFilePath, JSON.stringify({ products }, null, 2));
        res.status(204).end();
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
