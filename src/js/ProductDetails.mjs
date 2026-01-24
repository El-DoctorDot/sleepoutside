const baseURL = import.meta.env.VITE_SERVER_URL;

import { getLocalStorage, setLocalStorage } from "./utils.mjs";

export default class ProductDetails {

    constructor(productId, dataSource) {
        this.productId = productId;
        this.product = {};
        this.dataSource = dataSource;
    }

    async init() {
        this.product = await this.dataSource.findProductById(this.productId);

        this.renderProductDetails();

        document
            .getElementById("addToCart")
            .addEventListener("click", this.addProductToCart.bind(this));
    }

    addProductToCart() {
        const cartItems = getLocalStorage("so-cart") || [];
        cartItems.push(this.product);
        setLocalStorage("so-cart", cartItems);
    }

    renderProductDetails() {
        productDetailsTemplate(this.product);
    }
}

// Template function to render product details

function productDetailsTemplate(product) {
    document.querySelector("h3").textContent = product.Brand.Name;
    document.querySelector("h2").textContent = product.NameWithoutBrand;

    const productImage = document.getElementById("productImage");
    productImage.src = product.Images.PrimaryLarge;
    productImage.alt = product.NameWithoutBrand;


    document.getElementById("productColor").textContent =
        product.Colors[0].ColorName;

    document.getElementById("productDesc").innerHTML =
        product.DescriptionHtmlSimple;

    document.getElementById("addToCart").dataset.id = product.Id;

    const originalPriceEl = document.getElementById("originalPrice"); 
    const priceEl = document.getElementById("productPrice");
    const discountBadgeEl = document.getElementById("discountBadge");

    priceEl.textContent = `$${product.FinalPrice.toFixed(2)}`; // Set final price

    // Check for discount and update original price and badge

    if (product.SuggestedRetailPrice > product.FinalPrice) {
        originalPriceEl.textContent = `$${product.SuggestedRetailPrice.toFixed(2)}`;

        const discountPercent = Math.round(
            ((product.SuggestedRetailPrice - product.FinalPrice) /
                product.SuggestedRetailPrice) *
            100
        );

        discountBadgeEl.textContent = `${discountPercent}% OFF`;
    }
}
