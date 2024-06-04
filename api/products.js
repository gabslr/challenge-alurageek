let products = require('../db.json');

export default function handler(req, res) {
    if (req.method === 'GET') {
        res.status(200).json(products);
    } else if (req.method === 'POST') {
        const newProduct = req.body;
        newProduct.id = products.length + 1;
        products.push(newProduct);
        res.status(201).json(newProduct);
    } else if (req.method === 'DELETE') {
        const { id } = req.query;
        products = products.filter(product => product.id !== parseInt(id, 10));
        res.status(204).end();
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
