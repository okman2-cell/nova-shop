// Nova Shop starter settings
// Replace this with your real Discord server invite URL after creating your server.
const DISCORD_INVITE_URL = "https://discord.com/";

document.getElementById("discord-link").href = DISCORD_INVITE_URL;
document.getElementById("year").textContent = new Date().getFullYear();

const filters = document.querySelectorAll(".filter");
const cards = document.querySelectorAll(".product-card");

filters.forEach((button) => {
  button.addEventListener("click", () => {
    filters.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    const selected = button.dataset.filter;
    cards.forEach((card) => {
      card.classList.toggle(
        "hidden",
        selected !== "all" && card.dataset.category !== selected
      );
    });
  });
});

document.querySelectorAll(".order-button").forEach((button) => {
  button.addEventListener("click", () => {
    const product = button.dataset.product;
    const message = `Hi Nova Shop! I'd like to order: ${product}.`;
    const discordUrl = DISCORD_INVITE_URL;
    // The Discord invite is a placeholder until you add your own invite link.
    alert(`${message}\n\nNext step: join our Discord server to place the order.`);
    window.open(discordUrl, "_blank", "noopener,noreferrer");
  });
});
