const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'index.html');
const productsPath = path.join(__dirname, 'products.json');

const indexContent = fs.readFileSync(indexPath, 'utf8');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

// Build HTML for each product
const productHtml = products.map(p => `    <div class="product-card">
      <span class="product-emoji">🛒</span>
      <h3>${p.name}</h3>
      <p>Prix : €${p.price.toFixed(2)}</p>
      <img src="${p.image}" alt="${p.name}" style="width:100%;max-width:150px;margin-top:8px;"/>
      <div class="product-line" style="background:#94A3B8"></div>
    </div>`).join('\n');

// Replace content between markers
const startMarker = '<!-- PRODUCTS_GRID_START -->';
const endMarker = '<!-- PRODUCTS_GRID_END -->';
const startIdx = indexContent.indexOf(startMarker);
const endIdx = indexContent.indexOf(endMarker);
if (startIdx === -1 || endIdx === -1) {
  console.error('Markers not found');
  process.exit(1);
}
const before = indexContent.slice(0, startIdx + startMarker.length);
const after = indexContent.slice(endIdx);
const newContent = `${before}\n${productHtml}\n${after}`;

fs.writeFileSync(indexPath, newContent, 'utf8');
console.log('Generated product grid with', products.length, 'items.');
