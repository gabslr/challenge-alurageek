const fs = require('fs');
const path = require('path');

const dbFilePath = path.join(__dirname, '..', 'db.json');

let products = JSON.parse(fs.readFileSync(dbFilePath, 'utf-8'));

export default function handler(req, res) {
    if (req.method === 'GET') {
        res.status(200).json(products);
    } else if (req.method === 'POST') {
        const newProduct = req.body;
        newProduct.id = products.length + 1;
        products.push(newProduct);
        fs.writeFileSync(dbFilePath, JSON.stringify(products, null, 2));
        res.status(201).json(newProduct);
    } else if (req.method === 'DELETE') {
        const { id } = req.query;
        products = products.filter(product => product.id !== parseInt(id, 10));
        fs.writeFileSync(dbFilePath, JSON.stringify(products, null, 2));
        res.status(204).end();
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
