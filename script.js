
"use strict";

const DISCORD = "https://discord.gg/tvzbHAbYd";

const prices = {
  "Custom Logo": 5,
  "Banner Pack": 4,
  "Discord Server Setup": 8,
  "Bot Configuration": 6,
  "Gaming Pack": 3,
  "Custom Request": 0
};

const cart = {};

const discordLink = document.getElementById("discord-link");
if (discordLink) discordLink.href = DISCORD;

const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

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

const panel = document.createElement("section");
panel.id = "shopping-cart";
panel.style.cssText =
  "margin:25px 0;padding:22px;border:1px solid #8b5cf6;border-radius:16px;color:white;background:#100c1b";

panel.innerHTML = `
  <h2>Your shopping cart</h2>
  <div id="cart-items">Your cart is empty.</div>
  <p>Total: <strong id="cart-total">€0.00</strong></p>
  <button id="copy-order" type="button">Copy order</button>
  <button id="join-discord" type="button">Join Discord ↗</button>
  <p id="cart-message"></p>
`;

const products = document.getElementById("products");
if (products) products.appendChild(panel);

function renderCart() {
  const items = document.getElementById("cart-items");
  const totalElement = document.getElementById("cart-total");
  if (!items || !totalElement) return;

  items.replaceChildren();
  let total = 0;

  for (const [name, quantity] of Object.entries(cart)) {
    if (quantity <= 0) continue;
    total += prices[name] * quantity;

    const row = document.createElement("p");
    row.textContent = `${name} × ${quantity} `;

    const minus = document.createElement("button");
    minus.textContent = "−";
    minus.type = "button";
    minus.onclick = () => {
      cart[name]--;
      if (cart[name] <= 0) delete cart[name];
      renderCart();
    };

    const plus = document.createElement("button");
    plus.textContent = "+";
    plus.type = "button";
    plus.onclick = () => {
      cart[name]++;
      renderCart();
    };

    const remove = document.createElement("button");
    remove.textContent = "Remove";
    remove.type = "button";
    remove.onclick = () => {
      delete cart[name];
      renderCart();
    };

    row.append(minus, plus, remove);
    items.appendChild(row);
  }

  if (items.children.length === 0) items.textContent = "Your cart is empty.";
  totalElement.textContent = `€${total.toFixed(2)}`;
}

document.querySelectorAll(".order-button").forEach(button => {
  const name = button.dataset.product;
  button.type = "button";
  button.textContent = name === "Custom Request" ? "Request a quote ↗" : "Add to cart +";

  button.addEventListener("click", () => {
    if (name === "Custom Request") {
      window.open(DISCORD, "_blank", "noopener,noreferrer");
      return;
    }
    if (!Object.prototype.hasOwnProperty.call(prices, name)) return;

    cart[name] = (cart[name] || 0) + 1;
    renderCart();
    document.getElementById("cart-message").textContent = `${name} added to cart.`;
  });
});

document.getElementById("copy-order").addEventListener("click", async () => {
  const lines = Object.entries(cart).map(([name, qty]) =>
    `${name} × ${qty} — ${prices[name] ? "€" + (prices[name] * qty).toFixed(2) : "quote required"}`
  );

  if (!lines.length) {
    document.getElementById("cart-message").textContent = "Add a product first.";
    return;
  }

  const total = Object.entries(cart).reduce(
    (sum, [name, qty]) => sum + prices[name] * qty, 0
  );

  const summary = "NOVA SHOP ORDER\n" + lines.join("\n") +
    `\nEstimated total: €${total.toFixed(2)}\nCustom requests may cost extra.`;

  try {
    await navigator.clipboard.writeText(summary);
    document.getElementById("cart-message").textContent = "Order copied!";
  } catch {
    window.prompt("Copy your order:", summary);
  }
});

document.getElementById("join-discord").addEventListener("click", () => {
  window.open(DISCORD, "_blank", "noopener,noreferrer");
});

renderCart();
