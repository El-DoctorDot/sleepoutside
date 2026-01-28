import { loadHeaderFooter } from './utils.mjs';
import { getLocalStorage } from './utils.mjs';

loadHeaderFooter();

// Form elements
const checkoutForm = document.getElementById('checkout-form');
const checkoutBtn = document.getElementById('checkout-btn');
const firstNameInput = document.getElementById('firstName');
const lastNameInput = document.getElementById('lastName');
const streetAddressInput = document.getElementById('streetAddress');
const cityInput = document.getElementById('city');
const stateInput = document.getElementById('state');
const zipCodeInput = document.getElementById('zipCode');
const creditCardInput = document.getElementById('creditCard');
const expirationDateInput = document.getElementById('expirationDate');
const securityCodeInput = document.getElementById('securityCode');

// Order summary elements
const subtotalElement = document.getElementById('subtotal');
const taxElement = document.getElementById('tax');
const shippingElement = document.getElementById('shipping');
const totalElement = document.getElementById('total');

// All required form fields
const allInputs = [
  firstNameInput,
  lastNameInput,
  streetAddressInput,
  cityInput,
  stateInput,
  zipCodeInput,
  creditCardInput,
  expirationDateInput,
  securityCodeInput
];

// Initialize order summary
function initializeOrderSummary() {
  updateOrderSummary();
}

// Update order summary with cart data
function updateOrderSummary() {
  const cart = getLocalStorage('so-cart') || [];
  
  // Calculate subtotal from cart
  let subtotal = 0;
  if (Array.isArray(cart)) {
    cart.forEach(item => {
      if (item.FinalPrice && item.quantity) {
        subtotal += parseFloat(item.FinalPrice) * item.quantity;
      }
    });
  }
  
  const taxRate = 0.06; // 6% tax
  const tax = subtotal * taxRate;
  const shipping = subtotal > 0 ? 10 : 0; // $10 flat rate shipping
  const total = subtotal + tax + shipping;
  
  // Update the display
  subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
  taxElement.textContent = `$${tax.toFixed(2)}`;
  shippingElement.textContent = `$${shipping.toFixed(2)}`;
  totalElement.textContent = `$${total.toFixed(2)}`;
}

// Check if all required fields are filled
function validateForm() {
  const allFilled = allInputs.every(input => {
    const value = input.value.trim();
    return value.length > 0;
  });
  
  checkoutBtn.disabled = !allFilled;
}

// Add event listeners to all inputs
allInputs.forEach(input => {
  input.addEventListener('input', validateForm);
  input.addEventListener('change', validateForm);
});

// Handle form submission
checkoutForm.addEventListener('submit', function(e) {
  e.preventDefault();
  
  // Validate all fields are filled
  if (!validateFormFields()) {
    alert('Please fill in all required fields.');
    return;
  }
  
  // Validate input formats
  if (!validateInputFormats()) {
    return;
  }
  
  // Display success message (in a real app, this would process payment)
  alert('Order placed successfully! Thank you for your purchase.');
  
  // Clear the cart
  localStorage.removeItem('so-cart');
  
  // Reset form
  checkoutForm.reset();
  validateForm();
  
  // Redirect to home page after a short delay
  setTimeout(() => {
    window.location.href = '/';
  }, 1500);
});

// Validate all form fields are filled
function validateFormFields() {
  return allInputs.every(input => input.value.trim().length > 0);
}

// Validate input formats
function validateInputFormats() {
  // Validate zip code (5 digits)
  const zipCode = zipCodeInput.value.trim();
  if (!/^\d{5}$/.test(zipCode)) {
    alert('Please enter a valid 5-digit zip code.');
    zipCodeInput.focus();
    return false;
  }
  
  // Validate state (2 characters)
  const state = stateInput.value.trim();
  if (!/^[A-Za-z]{2}$/.test(state)) {
    alert('Please enter a valid 2-letter state code.');
    stateInput.focus();
    return false;
  }
  
  // Validate credit card (basic check - 13-19 digits)
  const creditCard = creditCardInput.value.trim().replace(/\s/g, '');
  if (!/^\d{13,19}$/.test(creditCard)) {
    alert('Please enter a valid credit card number.');
    creditCardInput.focus();
    return false;
  }
  
  // Validate expiration date (MM/YY format)
  const expirationDate = expirationDateInput.value.trim();
  if (!/^\d{2}\/\d{2}$/.test(expirationDate)) {
    alert('Please enter expiration date in MM/YY format.');
    expirationDateInput.focus();
    return false;
  }
  
  // Validate security code (3-4 digits)
  const securityCode = securityCodeInput.value.trim();
  if (!/^\d{3,4}$/.test(securityCode)) {
    alert('Please enter a valid security code (3-4 digits).');
    securityCodeInput.focus();
    return false;
  }
  
  return true;
}

// Format credit card input
creditCardInput.addEventListener('input', function(e) {
  let value = e.target.value.replace(/\s/g, '');
  let formattedValue = value.replace(/(\d{4})/g, '$1 ').trim();
  e.target.value = formattedValue;
});

// Format expiration date input
expirationDateInput.addEventListener('input', function(e) {
  let value = e.target.value.replace(/\D/g, '');
  if (value.length >= 2) {
    value = value.slice(0, 2) + '/' + value.slice(2, 4);
  }
  e.target.value = value;
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  initializeOrderSummary();
  validateForm();
});