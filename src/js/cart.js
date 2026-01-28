import { getLocalStorage } from './utils.mjs';

function renderCartContents() {
  const cartItems = getLocalStorage('so-cart') || [];
  const productList = document.querySelector('.product-list');

  if (cartItems.length === 0) {
    productList.innerHTML = '<p>Your cart is empty.</p>';
    return;
  }

  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  productList.innerHTML = htmlItems.join('');

  renderCartTotal(cartItems);
  addQuantityListeners();
}

function renderCartTotal(cartItems) {
  const cartFooter = document.querySelector('.cart-footer');
  const cartTotalElement = document.querySelector('.cart-total');

  const total = cartItems.reduce(
    (sum, item) => sum + item.FinalPrice * (item.quantity || 1));

  cartTotalElement.innerHTML = `Total: $${total.toFixed(2)}`;
  cartFooter.classList.remove('hide');
}


function cartItemTemplate(item) {
  return `
  <li class="cart-card divider">
    <a href="#" class="cart-card__image">
      <img src="${item.Image}" alt="${item.Name}" />
    </a>

    <h2 class="card__name">${item.Name}</h2>
    <p class="cart-card__color">${item.Colors[0].ColorName}</p>

    <label>
      Qty:
      <input 
        type="number"
        min="1"
        value="${item.quantity || 1}"
        data-id="${item.Id}"
        class="cart-qty"
      />
    </label>

    <p class="cart-card__price">$${item.FinalPrice}</p>
  </li>`;
}

function addQuantityListeners() {
  document.querySelectorAll('.cart-qty').forEach((input) => {
    input.addEventListener('change', (e) => {
      const id = e.target.dataset.id;
      const quantity = parseInt(e.target.value);
      updateCartQuantity(id, quantity);
    });
  });
}

function updateCartQuantity(id, quantity) {
  const cartItems = getLocalStorage('so-cart') || [];

  const item = cartItems.find((i) => i.Id === id);
  if (item && quantity > 0) {
    item.quantity = quantity;
  }

  localStorage.setItem('so-cart', JSON.stringify(cartItems));
  renderCartContents();
}

renderCartContents();
