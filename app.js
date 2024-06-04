document.addEventListener('DOMContentLoaded', async () => {
    const productList = document.querySelector('.product-list');
    const form = document.querySelector('#add-product-form');

    const apiUrl = '/api/products';

    const fetchProducts = async () => {
        try {
            const response = await fetch(apiUrl);
            console.log('Fetch products response:', response);
            if (!response.ok) {
                throw new Error('Error en la respuesta de la API');
            }
            const products = await response.json();
            console.log('Fetched products:', products);
            return Array.isArray(products) ? products : [];
        } catch (error) {
            console.error('Error al obtener productos:', error);
            return [];
        }
    };

    const displayProducts = (products) => {
        console.log('Displaying products:', products);
        productList.innerHTML = '';
        products.forEach(product => {
            const productElement = document.createElement('div');
            productElement.classList.add('product');
            productElement.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <p>${product.name}</p>
                <p>$${product.price}</p>
                <button class="delete-btn" data-id="${product._id}"><i class="fas fa-trash-alt"></i></button>
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
        console.log('Add product event triggered');
        const formData = new FormData(form);
        const file = formData.get('imagen');

        if (file && file.type.startsWith('image/')) {
            console.log('File selected:', file);
            const reader = new FileReader();
            reader.onloadend = async () => {
                const newProduct = {
                    name: formData.get('nombre'),
                    price: formData.get('precio'),
                    image: reader.result // base64 encoded image
                };
                console.log('New product to add:', newProduct);

                try {
                    const response = await fetch(apiUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(newProduct)
                    });
                    console.log('Add product response:', response);
                    if (response.ok) {
                        const addedProduct = await response.json();
                        console.log('Added product:', addedProduct);
                        // Actualizar la lista de productos sin recargar
                        const products = await fetchProducts();
                        displayProducts(products);
                        form.reset();
                    } else {
                        const errorResponse = await response.json();
                        console.error('Error al agregar producto:', response.statusText, errorResponse);
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
        console.log('Delete product id:', productId);

        try {
            const response = await fetch(`${apiUrl}?id=${productId}`, {
                method: 'DELETE'
            });
            console.log('Delete product response:', response);
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
