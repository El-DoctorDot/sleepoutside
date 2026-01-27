const baseURL = import.meta.env.VITE_SERVER_URL;

import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
    return `
    <li class="product-card">
      <a href="../product_pages/index.html?id=${product.Id}">
        <img src="${product.Images.PrimaryMedium}" alt="${product.NameWithoutBrand}">
        <h2>${product.Brand.Name}</h2>
        <h3>${product.Name}</h3>
        <p class="product-card__price">$${product.FinalPrice}</p>
      </a>
    </li>
    `;
}

export default class ProductList {
    constructor(category, dataSource, listElement) {
        this.category = category;
        this.dataSource = dataSource;
        this.listElement = listElement;
        this.allProducts = [];
        this.filteredProducts = [];
    }

    async init() {
        this.allProducts = await this.dataSource.getData(this.category);
        this.filteredProducts = [...this.allProducts];
        this.renderList(this.filteredProducts);
        document.querySelector(".title").textContent = this.category;
        
        // Setup search and sort event listeners
        this.setupSearch();
        this.setupSort();
    }

    setupSearch() {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterAndRender(e.target.value);
            });
        }
    }

    setupSort() {
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.sortAndRender(e.target.value);
            });
        }
    }

    filterAndRender(searchTerm) {
        const term = searchTerm.toLowerCase();
        this.filteredProducts = this.allProducts.filter(product => {
            const name = product.Name.toLowerCase();
            const brand = product.Brand.Name.toLowerCase();
            return name.includes(term) || brand.includes(term);
        });
        this.renderList(this.filteredProducts);
    }

    sortAndRender(sortOption) {
        const sorted = [...this.filteredProducts];
        
        switch(sortOption) {
            case 'name-asc':
                sorted.sort((a, b) => a.Name.localeCompare(b.Name));
                break;
            case 'name-desc':
                sorted.sort((a, b) => b.Name.localeCompare(a.Name));
                break;
            case 'price-asc':
                sorted.sort((a, b) => a.FinalPrice - b.FinalPrice);
                break;
            case 'price-desc':
                sorted.sort((a, b) => b.FinalPrice - a.FinalPrice);
                break;
        }
        
        this.filteredProducts = sorted;
        this.renderList(this.filteredProducts);
    }

    renderList(list) {
        renderListWithTemplate(productCardTemplate, this.listElement, list);
    }

}