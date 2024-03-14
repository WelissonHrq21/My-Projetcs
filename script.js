const menu = document.getElementById('menu');
const cartBtn = document.getElementById('cart-btn');
const cartModal = document.getElementById('cart-modal');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');
const closeModalBtn = document.getElementById('close-modal-btn');
const cartCounter = document.getElementById('cart-count');
const addressInput = document.getElementById('address');
const addressWarn = document.getElementById('address-warn');
const troco = document.getElementById('troco');
const trocoWarn = document.getElementById('troco-warn');


let cart = [];

//abrir modal do carrinho
cartBtn.addEventListener('click', function () {
    cartModal.style.display = 'flex';

    updateCartModal();
});

cartModal.addEventListener('click', function (event) {
    if (event.target === cartModal) {
        cartModal.style.display = 'none';
    }
});

closeModalBtn.addEventListener('click', function () {
    cartModal.style.display = 'none';
});

menu.addEventListener('click', function (event) {
    let parentButton = event.target.closest(".add-to-cart-btn");

    if (parentButton) {
        const name = parentButton.getAttribute('data-name');
        const price = parseFloat(parentButton.getAttribute('data-price'));

        addToCart(name, price);

    }
});

function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);



    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name,
            price,
            quantity: 1
        })
    }

    updateCartModal();
}

function updateCartModal() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement('div');

        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        cartItemElement.innerHTML = `
        <div class="flex items-center justify-between">
            <div>
                <p class="font-medium">${item.name}</p>
                <p>Qtd: ${item.quantity}</p>
                <p class="font-medium mt-12">R$ ${item.price.toFixed(2)}</p>
            </div>

            <button class="remove-from-cart-btn" data-name="${item.name}">
                Remover
            </button>
            



        </div>
        `

        total += item.price * item.quantity;

        cartItemsContainer.appendChild(cartItemElement);
    })

    cartTotal.textContent = `Total: ${total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    })}`

    cartCounter.innerHTML = cart.length;
}



cartItemsContainer.addEventListener('click', function (event) {
    if (event.target.classList.contains("remove-from-cart-btn")) {
        const name = event.target.getAttribute('data-name');

        removeItemCart(name);
    }
})


function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name);

    if (index !== -1) {
        const item = cart[index];

        if (item.quantity > 1) {
            item.quantity -= 1;
            updateCartModal();
            return
        }
    }
    cart.splice(index, 1);
    updateCartModal();
}

addressInput.addEventListener('input', function (event) {
    let inputValue = event.target.value;


    if (inputValue !== '') {
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add('hidden');
    }
});

const totalCart = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);







checkoutBtn.addEventListener('click', function () {

    const isOpen = checkReastaurantOpen();
    if (!isOpen) {
        Toastify({
            text: "Ops, o restaurante está fechado!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "#EF4444)",
            },
        }).showToast();
        return;
    }

    const cartItems = cart.map((item) => {
        return (
            `${item.name} - Quantidade: (${item.quantity}) - Preço: R$${item.price} |  `
        )
    }).join("");


    const message = encodeURIComponent(cartItems);
    const phone = '82982376228';

    const darTroco = () => {
        if(troco.value){
            window.open(`https://wa.me/${phone}?text=${message} Total: R$${cart.reduce((acc, item) => acc + (item.price * item.quantity), 0).toFixed(2)} Troco: R$${troco.value}. Endereço: ${addressInput.value}`, "_blank");
        }else{
            window.open(`https://wa.me/${phone}?text=${message} Total: R$${cart.reduce((acc, item) => acc + (item.price * item.quantity), 0).toFixed(2)} Endereço: ${addressInput.value}`, "_blank");
        }
            
        
    }

    
    const totalCart = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    // Agora, totalCart tem o valor atualizado e pode ser usado para comparação
    if (parseFloat(troco.value) < totalCart) {
        trocoWarn.classList.remove('hidden');
        return; // Impede a execução do restante do código se o troco for menor que o total
    }
    
    


    if (cart.length === 0) return;
    if (addressInput.value === '') {
        addressWarn.classList.remove('hidden');
        addressInput.classList.add("border-red-500");
        return;
    }

    darTroco();
    cart = [];
    addressInput.value = '';
    troco.value = '';
    trocoWarn.classList = 'text-red-500 hidden';
    updateCartModal();
});



function checkReastaurantOpen() {
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 22;
}

const spanItem = document.getElementById('date-span');
const isOpen = checkReastaurantOpen();

if (isOpen) {
    spanItem.classList.remove('bg-red-500');
    spanItem.classList.add('bg-green-600');
} else {
    spanItem.classList.remove('bg-green-600');
    spanItem.classList.add('bg-red-500');
}