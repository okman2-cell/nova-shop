
"use strict";

// NOVA SHOP — CART & DISCORD
const DISCORD_INVITE_URL = "https://discord.gg/tvzbHAbYd";

const prices = {
  "Custom Logo": 5,
  "Banner Pack": 4,
  "Discord Server Setup": 8,
  "Bot Configuration": 6,
  "Gaming Pack": 3,
  "Custom Request": 0
};


const CART_STORAGE_KEY = "nova-shop-cart-v1";

function loadSavedCart() {
  try {
    const saved = JSON.parse(
      localStorage.getItem(CART_STORAGE_KEY) || "{}"
    );

    if (!saved || typeof saved !== "object" || Array.isArray(saved)) {
      return {};
    }

    return Object.fromEntries(
      Object.entries(saved).filter(([name, quantity]) =>
        Object.prototype.hasOwnProperty.call(prices, name) &&
        Number.isInteger(quantity) &&
        quantity > 0 &&
        quantity < 1000
      )
    );
  } catch {
    return {};
  }
}

function saveCart() {
  try {
    localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify(cart)
    );
  } catch {
    // The cart still works if browser storage is unavailable.
  }
}

const cart = new Proxy(loadSavedCart(), {
  set(target, property, value) {
    Reflect.set(target, property, value);
    saveCart();
    return true;
  },

  deleteProperty(target, property) {
    Reflect.deleteProperty(target, property);
    saveCart();
    return true;
  }
});


document.getElementById("discord-link").href = DISCORD_INVITE_URL;
document.getElementById("year").textContent = new Date().getFullYear();

// Cart styles
const style = document.createElement("style");
style.textContent = `
.cart-panel {
  margin-top: 35px;
  padding: 28px;
  border: 1px solid #6536a8;
  border-radius: 20px;
  background: #100c1b;
}
.cart-panel h2 { margin-top: 0; }
.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 14px 0;
  border-bottom: 1px solid #30223f;
}
.cart-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 20px;
}
.cart-actions button, .cart-item button {
  cursor: pointer;
  border: 1px solid #8b5cf6;
  border-radius: 10px;
  background: #211532;
  color: white;
  padding: 10px 14px;
}
.cart-total { color: #c4a2ff; font-size: 1.25rem; }
.cart-empty { color: #aaa0b8; }
.cart-message { color: #c4a2ff; margin-top: 14px; }
.product-card.hidden { display: none !important; }
`;
document.head.appendChild(style);

// Create cart
const cartPanel = document.createElement("section");
cartPanel.className = "cart-panel";
cartPanel.id = "shopping-cart";
cartPanel.innerHTML = `
  <h2>Your shopping cart</h2>
  <div id="cart-items" class="cart-empty">Your cart is empty.</div>
  <p class="cart-total">Total: <strong id="cart-total">€0.00</strong></p>
  <p>Custom requests may require a separate quote.</p>
  <div class="cart-actions">
    <button type="button" id="copy-order">Copy order details</button>
    <button type="button" id="join-discord">Join Discord for Pay ↗</button>
    <button type="button" id="open-ticket">Open a Ticket ↗</button>
  </div>
  <p id="cart-message" class="cart-message" aria-live="polite"></p>
`;

const notice = document.querySelector("#products .demo-notice");
if (notice) notice.before(cartPanel);
else document.getElementById("products").appendChild(cartPanel);

function renderCart() {
  const container = document.getElementById("cart-items");
  container.replaceChildren();

  const entries = Object.entries(cart).filter(([, qty]) => qty > 0);

  if (entries.length === 0) {
    container.textContent = "Your cart is empty.";
    container.className = "cart-empty";
  } else {
    container.className = "";

    entries.forEach(([name, qty]) => {
      const row = document.createElement("div");
      row.className = "cart-item";

      const label = document.createElement("span");
      label.textContent = `${name} × ${qty}`;

      const controls = document.createElement("span");

      const minus = document.createElement("button");
      minus.type = "button";
      minus.textContent = "−";
      minus.setAttribute("aria-label", `Remove one ${name}`);
      minus.addEventListener("click", () => {
        cart[name]--;
        if (cart[name] <= 0) delete cart[name];
        renderCart();
      });

      const plus = document.createElement("button");
      plus.type = "button";
      plus.textContent = "+";
      plus.setAttribute("aria-label", `Add one ${name}`);
      plus.addEventListener("click", () => {
        cart[name]++;
        renderCart();
      });

      controls.append(minus, " ", plus);
      row.append(label, controls);
      container.appendChild(row);
    });
  }

  const total = entries.reduce(
    (sum, [name, qty]) => sum + prices[name] * qty, 0
  );

  document.getElementById("cart-total").textContent =
    `€${total.toFixed(2)}`;

  return entries;
}

function orderSummary() {
  const entries = renderCart();
  const message = document.getElementById("cart-message");

  if (entries.length === 0) {
    message.textContent = "Add a product to your cart first.";
    return "";
  }

  const lines = entries.map(([name, qty]) => {
    const price = prices[name];
    return `${name} × ${qty} — ${
      price === 0 ? "Price to be confirmed" : `€${(price * qty).toFixed(2)}`
    }`;
  });

  const total = entries.reduce(
    (sum, [name, qty]) => sum + prices[name] * qty, 0
  );

  return [
    "NOVA SHOP ORDER",
    ...lines,
    `Estimated total: €${total.toFixed(2)}`,
    "Custom requests may cost extra."
cards.forEach(card => {
}

// Add-to-cart buttons
document.querySelectorAll(".order-button").forEach(button => {
  button.textContent = "Add to cart +";
  button.type = "button";

  button.addEventListener("click", () => {
    const name = button.dataset.product;
    if (!name || !(name in prices)) return;

    cart[name] = (cart[name] || 0) + 1;
    renderCart();

    document.getElementById("cart-message").textContent =
      `${name} added to your cart.`;

    document.getElementById("shopping-cart").scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });
  });
});

// Category filters
const filters = document.querySelectorAll(".filter");
const cards = document.querySelectorAll(".product-card");

filters.forEach(button => {
  button.addEventListener("click", () => {
    filters.forEach(item => item.classList.remove("active"));
    button.classList.add("active");

    const selected = button.dataset.filter;

    cards.forEach(card => {
      card.classList.toggle(
        "hidden",
        selected !== "all" && card.dataset.category !== selected
      );
    });
  });
});

// Copy order summary
document.getElementById("copy-order").addEventListener("click", async () => {
  const summary = orderSummary();
  if (!summary) return;

  try {
    await navigator.clipboard.writeText(summary);
    document.getElementById("cart-message").textContent =
      "Order copied! Paste it into your Discord ticket.";
  } catch {
    window.prompt("Copy your order details:", summary);
  }
});

// Open Discord for payment discussion
document.getElementById("join-discord").addEventListener("click", () => {
  if (!orderSummary()) return;
  window.open(DISCORD_INVITE_URL, "_blank", "noopener,noreferrer");
});

// Open Discord for ticket support
document.getElementById("open-ticket").addEventListener("click", () => {
  const summary = orderSummary();
  if (!summary) return;

  window.open(DISCORD_INVITE_URL, "_blank", "noopener,noreferrer");
  document.getElementById("cart-message").textContent =
    "In Discord, open a ticket and send your order details. Use Copy order details first.";
});

renderCart();
