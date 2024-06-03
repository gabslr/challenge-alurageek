<<<<<<< HEAD
const baseUrl= './products';

const fetchProducts = async () => {
    try {
        const response = await fetch(baseUrl);
=======
const vercelUrl = 'https://challenge-alurageek-sable.vercel.app/';
const fetchProducts = async () => {
    try {
        const response = await fetch('https://challenge-alurageek-sable.vercel.app/products');
>>>>>>> 70db13313614a92f5f127f04db2b0608f5966546
        if (!response.ok) {
            throw new Error('Error en la respuesta de la API');
        }
        const products = await response.json();
        return products;
    } catch (error) {
        console.error('Error al obtener productos:', error);
        return [];
    }
};

// Función para mostrar los productos en el DOM
const displayProducts = (products) => {
    const productList = document.querySelector('.product-list');
    productList.innerHTML = '';
    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('product');
        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <p>${product.name}</p>
            <p>$${product.price}</p>
        `;
        productList.appendChild(productElement);
    });
};

document.addEventListener('DOMContentLoaded', async () => {
    const form = document.querySelector('form');

    // Función para cargar productos y mostrarlos
    const loadAndDisplayProducts = async () => {
        const products = await fetchProducts();
        displayProducts(products);
    };

    // Función para agregar un nuevo producto
    const addProduct = async (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const newProduct = {
            name: formData.get('nombre'),
            price: formData.get('precio'),
            image: formData.get('imagen')
        };

        try {
<<<<<<< HEAD
            const response = await fetch(baseUrl, {
=======
            const response = await fetch('https://challenge-alurageek-sable.vercel.app/products', {
>>>>>>> 70db13313614a92f5f127f04db2b0608f5966546
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newProduct)
            });
            if (response.ok) {
                loadAndDisplayProducts();
                form.reset();
            }
        } catch (error) {
            console.error('Error al agregar producto:', error);
        }
    };

    form.addEventListener('submit', addProduct);

    // Cargar y mostrar productos al cargar la página
    await loadAndDisplayProducts();
});