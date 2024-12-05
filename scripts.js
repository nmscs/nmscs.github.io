document.addEventListener('DOMContentLoaded', function() {
    const checkboxes = document.querySelectorAll('.filter-checkbox');
    const products = document.querySelectorAll('.product');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');

    function filterProducts() {
        const selectedFilters = Array.from(checkboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);

        products.forEach(product => {
            const productClasses = Array.from(product.classList);
            const shouldDisplay = selectedFilters.length === 0 || productClasses.some(className => selectedFilters.includes(className));
            product.style.display = shouldDisplay ? 'block' : 'none';
        });
    }

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', filterProducts);
    });

    // Initial filtering based on default checked state
    filterProducts();

    // Add click event listener to products for navigation
    products.forEach(product => {
        product.addEventListener('click', function() {
            const link = product.getAttribute('data-link');
            if (link) {
                window.location.href = link;
            }
        });
    });

    // Function to add item to cart
    function addToCart(event) {
        const button = event.target;
        const name = button.getAttribute('data-name');
        const price = button.getAttribute('data-price');
        const image = button.getAttribute('data-image');

        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItem = cart.find(item => item.name === name);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ name, price, image, quantity: 1 });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        alert('Товар добавлен в корзину!');
    }

    addToCartButtons.forEach(button => {
        button.addEventListener('click', addToCart);
    });

    // Function to load cart items on the cart page
    function loadCartItems() {
        const cartItemsContainer = document.getElementById('cart-items');
        const totalPriceElement = document.getElementById('total-price');
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        let totalPrice = 0;

        cartItemsContainer.innerHTML = '';

        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="details">
                    <p>${item.name}</p>
                    <p>${item.price} руб. x ${item.quantity}</p>
                </div>
                <button class="remove-from-cart" data-index="${index}">Удалить</button>
            `;
            cartItemsContainer.appendChild(cartItem);
            totalPrice += parseFloat(item.price) * item.quantity;
        });

        totalPriceElement.textContent = `${totalPrice} руб.`;

        // Add event listeners to remove buttons
        const removeButtons = document.querySelectorAll('.remove-from-cart');
        removeButtons.forEach(button => {
            button.addEventListener('click', removeFromCart);
        });
    }

    // Function to remove item from cart
    function removeFromCart(event) {
        const button = event.target;
        const index = button.getAttribute('data-index');
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCartItems(); // Reload cart items to update the display
    }

    // Load cart items if on the cart page
    if (window.location.pathname.includes('cart.html')) {
        loadCartItems();
    }
});
