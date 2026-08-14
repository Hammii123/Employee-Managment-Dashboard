# Product Filtering System

An oils/grocery product catalog built with vanilla HTML, CSS, and JavaScript — no frameworks, no build tools. Products are loaded from a local JSON file and can be searched, filtered by category, and sorted by price, all updating instantly without a page reload.

## Features

- Products loaded dynamically from a local `products.json` file via `fetch()`
- Live search — matches against both product **name** and **category**
- Debounced search input (300ms) to avoid unnecessary re-renders on every keystroke
- Category filter, dynamically generated from the actual product data (no hardcoded category list)
- Sort by price (low to high / high to low), based on each product's cheapest available variant
- Custom-built dropdown components for category and sort — avoids native `<select>` popup width limitations on mobile
- Live results count ("Showing X of Y products")
- Products support multiple sizes/variants (e.g. 500ml, 1L, 5L) with independent pricing per size
- Products can belong to multiple categories at once
- Fully responsive layout — tablet and mobile breakpoints, sticky footer, consistent card sizing regardless of product name length

## Getting Started

`fetch()` requires the page to be served over HTTP — opening `index.html` directly (`file://`) will not work correctly.

1. Clone or download this repository
2. Serve the folder with a local server, e.g. the VS Code "Live Server" extension (right-click `index.html` → "Open with Live Server")

```bash
git clone https://github.com/your-username/product-filtering-system.git
cd product-filtering-system
```

## Project Structure

```
product-filtering-system/
├── index.html      # Page structure and layout
├── style.css        # Styling, responsive design, custom dropdown styles
├── script.js         # App logic: data loading, filtering, sorting, rendering
├── products.json    # Product dataset
├── images/           # Product images
└── README.md
```

## How It Works

- **Data loading:** `fetch("products.json")` retrieves the product data asynchronously; results are parsed with `response.json()` before rendering begins.
- **Filtering pipeline:** search, category, and sort are each separate, pure functions (`filterBySearch`, `filterByCategory`, `sortByPrice`) that take an array in and return a new array out — none of them touch the DOM directly. A single `applyFilters()` function chains them together and calls the one function responsible for rendering (`renderProducts()`), keeping business logic and UI logic separate.
- **Custom dropdowns:** category and sort selectors are built from plain `<div>`s rather than native `<select>` elements, giving full control over popup width and appearance — solving a common mobile overflow issue with native dropdowns. A shared `setupCustomDropdown()` function handles the open/close/select behavior for both.
- **Pricing:** each product has a `variants` array (different sizes with independent prices). `getStartingPrice()` calculates the lowest available price across a product's variants for display, sorting, and comparison purposes.

## Built With

- HTML5
- CSS3 (Flexbox, CSS Grid, media queries)
- Vanilla JavaScript (ES6+, `fetch`/Promises)

## Author

Hammad ur Rehman

## License

Free to use for learning purposes.
