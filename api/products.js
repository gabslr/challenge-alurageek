// api/products.js

const products = [];

export default function handler(req, res) {
  if (req.method === 'GET') {
    // Obtiene todos los productos
    res.status(200).json(products);
  } else if (req.method === 'POST') {
    // Agrega un nuevo producto
    const newProduct = req.body;
    newProduct.id = products.length + 1;
    products.push(newProduct);
    res.status(201).json(newProduct);
  } else if (req.method === 'DELETE') {
    // Elimina un producto
    const { id } = req.query;
    const index = products.findIndex(p => p.id === parseInt(id, 10));
    if (index !== -1) {
      products.splice(index, 1);
      res.status(204).end();
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
