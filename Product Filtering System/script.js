let products = [];
let selectedCategory = "all";
let selectedSort = "none";

fetch("products.json")
    .then((response) => response.json())
    .then((data) => {
        products = data;
        renderCategoryOptions(products);
        applyFilters();
    });


function getStartingPrice(product) {
    const prices = product.variants.map(v => v.price);
    return Math.min(...prices);
}


const searchInput = document.getElementById("searchInput");
const categoryFilterTrigger = document.getElementById("categoryFilterTrigger");
const categoryFilterOptions = document.getElementById("categoryFilterOptions");
const categoryFilterWrapper = document.getElementById("categoryFilterWrapper");
const sortFilterTrigger = document.getElementById("sortFilterTrigger");
const sortFilterOptions = document.getElementById("sortFilterOptions");
const sortFilterWrapper = document.getElementById("sortFilterWrapper");
const resultsCount = document.getElementById("resultsCount");
const productGrid = document.getElementById("productGrid");


function renderProducts(productList) {
    productGrid.innerHTML = "";

    productList.forEach((product) => {

        const card = document.createElement("div");
        card.className = "product-card";

        const img = document.createElement("img");
        img.src = product.image;
        img.alt = product.name;

        const nameE1 = document.createElement("h3");
        nameE1.textContent = product.name;

        const priceE1 = document.createElement("p");
        priceE1.className = "product-price";
        priceE1.textContent = "Starting at Rs. " + getStartingPrice(product);

        card.appendChild(img);
        card.appendChild(nameE1);
        card.appendChild(priceE1);

        productGrid.appendChild(card);
    });
}


function filterBySearch(productList, searchTerm) {
    const term = searchTerm.trim().toLowerCase();

    if (!term) {
        return productList;
    }

    return productList.filter((product) =>
        product.name.toLowerCase().includes(term)
    );
}


function getAllCategories(productList) {
    const allCategories = [];

    productList.forEach((product) => {
        product.category.forEach((cat) => {
            if (!allCategories.includes(cat)) {
                allCategories.push(cat);
            }
        });
    });

    return allCategories;
}

/* ---------- CUSTOM DROPDOWN: shared open/close behavior ---------- */

// A small reusable helper — sets up click-to-open and click-outside-to-close
// for any trigger/options/wrapper trio. Both dropdowns use this same logic.
function setupCustomDropdown(wrapper, trigger, optionsContainer, onSelect) {
    
    trigger.addEventListener("click", (e) => {
        e.stopPropagation();
        // close the OTHER dropdown if it's open, so only one is open at a time
        document.querySelectorAll(".custom-select.open").forEach((el) => {
            if (el !== wrapper) el.classList.remove("open");
        });
        wrapper.classList.toggle("open");
    });

    optionsContainer.addEventListener("click", (e) => {
        if (!e.target.classList.contains("custom-select-option")) return;

        trigger.textContent = e.target.textContent;
        wrapper.classList.remove("open");
        onSelect(e.target.dataset.value, e.target.textContent);
    });
    
}

document.addEventListener("click", (e) => {
    document.querySelectorAll(".custom-select.open").forEach((wrapper) => {
        if (!wrapper.contains(e.target)) {
            wrapper.classList.remove("open");
        }
    });
});

/* ---------- CATEGORY DROPDOWN ---------- */

function renderCategoryOptions(productList) {
    const categories = getAllCategories(productList);

    categoryFilterOptions.innerHTML = "";

    const allOption = document.createElement("div");
    allOption.className = "custom-select-option";
    allOption.textContent = "All Categories";
    allOption.dataset.value = "all";
    categoryFilterOptions.appendChild(allOption);

    categories.forEach((cat) => {
        const option = document.createElement("div");
        option.className = "custom-select-option";
        option.textContent = cat;
        option.dataset.value = cat;
        categoryFilterOptions.appendChild(option);
    });
}

setupCustomDropdown(categoryFilterWrapper, categoryFilterTrigger, categoryFilterOptions, (value) => {
    selectedCategory = value;
    applyFilters();
});

/* ---------- SORT DROPDOWN ---------- */

setupCustomDropdown(sortFilterWrapper, sortFilterTrigger, sortFilterOptions, (value) => {
    selectedSort = value;
    applyFilters();
});

/* ------------------------------------------- */


function filterByCategory(productList, selected) {
    if (selected === "all") {
        return productList;
    }

    return productList.filter((product) =>
        product.category.includes(selected)
    );
}


function sortByPrice(productList, sortOrder) {
    const sorted = [...productList];

    if (sortOrder === "lowToHigh") {
        sorted.sort((a, b) => getStartingPrice(a) - getStartingPrice(b));
    } else if (sortOrder === "highToLow") {
        sorted.sort((a, b) => getStartingPrice(b) - getStartingPrice(a));
    }

    return sorted;
}


function applyFilters() {
    let result = products;

    result = filterBySearch(result, searchInput.value);
    result = filterByCategory(result, selectedCategory);
    result = sortByPrice(result, selectedSort);

    resultsCount.textContent = `Showing ${result.length} of ${products.length} products`;

    renderProducts(result);
}

let searchTimeout;

searchInput.addEventListener("input", () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(applyFilters, 300);
});