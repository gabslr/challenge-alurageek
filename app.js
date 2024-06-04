document.addEventListener('DOMContentLoaded', async () => {
    const productList = document.querySelector('.product-list');
    const form = document.querySelector('#add-product-form');

    const apiUrl = '/api/products';

    const fetchProducts = async () => {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Error en la respuesta de la API');
            }
            const products = await response.json();
            return Array.isArray(products) ? products : [];
        } catch (error) {
            console.error('Error al obtener productos:', error);
            return [];
        }
    };

    const displayProducts = (products) => {
        productList.innerHTML = '';
        products.forEach(product => {
            const productElement = document.createElement('div');
            productElement.classList.add('product');
            productElement.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <p>${product.name}</p>
                <p>$${product.price}</p>
                <button class="delete-btn" data-id="${product.id}"><i class="fas fa-trash-alt"></i></button>
            `;
            productList.appendChild(productElement);
        });

        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', handleDelete);
        });
    };

    const loadAndDisplayProducts = async () => {
        const products = await fetchProducts();
        displayProducts(products);
    };

    const addProduct = async (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const file = formData.get('imagen');

        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const newProduct = {
                    name: formData.get('nombre'),
                    price: formData.get('precio'),
                    image: reader.result // base64 encoded image
                };

                try {
                    const response = await fetch(apiUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(newProduct)
                    });
                    if (response.ok) {
                        loadAndDisplayProducts();
                        form.reset();
                    } else {
                        console.error('Error al agregar producto:', response.statusText);
                    }
                } catch (error) {
                    console.error('Error al agregar producto:', error);
                }
            };
            reader.readAsDataURL(file);
        } else {
            console.error('No file selected or file is not an image');
        }
    };

    const handleDelete = async (event) => {
        const productId = event.target.closest('button').dataset.id;

        try {
            const response = await fetch(`${apiUrl}?id=${productId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                loadAndDisplayProducts();
            } else {
                console.error('Error al eliminar producto:', response.statusText);
            }
        } catch (error) {
            console.error('Error al eliminar producto:', error);
        }
    };

    form.addEventListener('submit', addProduct);
    await loadAndDisplayProducts();
});
