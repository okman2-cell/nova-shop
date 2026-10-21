// NOVA SHOP — CART & DISCORD
const DISCORD_INVITE_URL = "https://discord.gg/tvzbHAbYd";

document.getElementById("discord-link").href = DISCORD_INVITE_URL;
document.getElementById("year").textContent = new Date().getFullYear();

// Product prices in EUR
const prices = {
  "Custom Logo": 5,
  "Banner Pack": 4,
  "Discord Server Setup": 8,
  "Bot Configuration": 6,
  "Gaming Pack": 3,
  "Custom Request": 0
};

const cart = {};

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
`;
document.head.appendChild(style);

// Add the cart below the products
const cartPanel = document.createElement("section");
cartPanel.className = "cart-panel";
cartPanel.id = "shopping-cart";
cartPanel.innerHTML = `
  <h2>Your shopping cart</h2>
  <div id="cart-items" class="cart-empty">Your cart is empty.</div>
  <p class="cart-total">Total: <strong id="cart-total">€0.00</strong></p>
  <p>Custom requests may require a separate quote.</p>
  <div class="cart-actions">
    <button id="copy-order">Copy order details</button>
    <button id="join-discord">Join Discord for Pay ↗</button>
    <button id="open-ticket">Open a Ticket ↗</button>
  </div>
  <p id="cart-message" class="cart-message" aria-live="polite"></p>
`;

document.querySelector("#products .demo-notice")
  .before(cartPanel);

function renderCart() {
  const container = document.getElementById("cart-items");
  container.replaceChildren();

  const entries = Object.entries(cart)
    .filter(([, quantity]) => quantity > 0);

  if (!entries.length) {
    container.textContent = "Your cart is empty.";
    container.className = "cart-empty";
  } else {
    container.className = "";

    entries.forEach(([name, quantity]) => {
      const row = document.createElement("div");
      row.className = "cart-item";

      const info = document.createElement("span");
      info.textContent = `${name} × ${quantity}`;

      const controls = document.createElement("span");
      const minus = document.createElement("button");
      minus.textContent = "−";
      minus.setAttribute("aria-label", `Remove one ${name}`);
      minus.onclick = () => {
        cart[name]--;
        if (cart[name] <= 0) delete cart[name];
        renderCart();
      };

      const plus = document.createElement("button");
      plus.textContent = "+";
      plus.setAttribute("aria-label", `Add one ${name}`);
      plus.onclick = () => {
        cart[name]++;
        renderCart();
      };

      controls.append(minus, " ", plus);
      row.append(info, controls);
      container.appendChild(row);
    });
  }

  const total = entries.reduce(
    (sum, [name, quantity]) => sum + prices[name] * quantity,
    0
  );

  document.getElementById("cart-total").textContent =
    "€" + total.toFixed(2);

  return entries;
}

function orderSummary() {
  const entries = renderCart();

  if (!entries.length) {
    document.getElementById("cart-message").textContent =
      "Add a product to your cart first.";
    return "";
  }

  const lines = entries.map(([name, quantity]) =>
    `${name} x ${quantity} — ${
      prices[name] === 0
        ? "Price to be confirmed"
        : "€" + (prices[name] * quantity).toFixed(2)
    }`
  );

  const total = entries.reduce(
    (sum, [name, quantity]) => sum + prices[name] * quantity,
    0
  );

  return `NOVA SHOP ORDER\n${lines.join("\n")}\nEstimated total: €${total.toFixed(2)}\nCustom requests may cost extra.`;
}

// Product buttons now add items to the cart
document.querySelectorAll(".order-button").forEach(button => {
  button.textContent = "Add to cart +";

  button.addEventListener("click", () => {
    const name = button.dataset.product;
 
    cards.forEach(card => {
      card.classList.toggle(
        "hidden",
        selected !== "all" && card.dataset.category !== selected
      );
    });
  });
});

// Copy order details to send in Discord
document.getElementById("copy-order").addEventListener("click", async () => {
  const summary = orderSummary();
  if (!summary) return;

  try {
    await navigator.clipboard.writeText(summary);
    document.getElementById("cart-message").textContent =
      "Order copied! Paste it into your Discord ticket.";
  } catch {
    document.getElementById("cart-message").textContent =
      "Copy unavailable. Please copy your order details manually.";
  }
});

// Discord checkout buttons
document.getElementById("join-discord").addEventListener("click", () => {
  if (!orderSummary()) return;
  window.open(DISCORD_INVITE_URL, "_blank", "noopener,noreferrer");
});

document.getElementById("open-ticket").addEventListener("click", () => {
  if (!orderSummary()) return;
  window.open(DISCORD_INVITE_URL, "_blank", "noopener,noreferrer");

  document.getElementById("cart-message").textContent =
    "In Discord, open a ticket and paste your order details.";
});

renderCart();
