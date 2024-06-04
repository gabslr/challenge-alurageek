const { MongoClient, ObjectId } = require('mongodb');

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

export default async function handler(req, res) {
    console.log(`Received ${req.method} request`);

    try {
        await client.connect();
        const database = client.db(dbName);
        const collection = database.collection('products');

        if (req.method === 'GET') {
            const products = await collection.find({}).toArray();
            console.log('GET products:', products);
            res.status(200).json(products);
        } else if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString(); // convertir Buffer a string
                console.log('Received chunk:', chunk.toString());
            });
            req.on('end', async () => {
                try {
                    const newProduct = JSON.parse(body);
                    console.log('Parsed new product:', newProduct);
                    const result = await collection.insertOne(newProduct);
                    console.log('Inserted product:', result.ops[0]);
                    res.status(201).json(result.ops[0]); // Asegurarse de enviar el producto creado
                } catch (error) {
                    console.error('Error al procesar la solicitud POST:', error.message);
                    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
                }
            });
        } else if (req.method === 'DELETE') {
            const { id } = req.query;
            console.log('DELETE product id:', id);
            try {
                const result = await collection.deleteOne({ _id: new ObjectId(id) });
                console.log('Deleted count:', result.deletedCount);
                res.status(204).end();
            } catch (error) {
                console.error('Error al procesar la solicitud DELETE:', error.message);
                res.status(500).json({ message: 'Error interno del servidor', error: error.message });
            }
        } else {
            console.log('Method not allowed');
            res.status(405).json({ message: 'Method not allowed' });
        }
    } catch (error) {
        console.error('Error handling request:', error.message);
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
}
