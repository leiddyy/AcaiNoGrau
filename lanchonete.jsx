import { useState, useEffect } from "react";
import { supabase } from "./src/supabaseClient";

// ─────────────────────── DATA ───────────────────────
const MENU = [
  {
    id: 1, category: "Açaí", emoji: "🫐",
    name: "Açaí Tradicional", price: 18.90,
    description: "Açaí puro com granola, banana e leite condensado",
    options: ["300ml", "500ml", "700ml"],
    optionPrices: [0, 4, 8],
    complements: ["Granola", "Banana", "Morango", "Mel", "Leite condensado", "Paçoca"],
  },
  {
    id: 2, category: "Açaí", emoji: "🫐",
    name: "Açaí Premium", price: 24.90,
    description: "Açaí com frutas vermelhas, castanha e calda especial",
    options: ["300ml", "500ml", "700ml"],
    optionPrices: [0, 5, 10],
    complements: ["Granola", "Morango", "Uva", "Nutella", "Kiwi"],
  },
  {
    id: 3, category: "Barca", emoji: "🚢",
    name: "Barca de Açaí", price: 59.90,
    description: "Barca gigante para 3-4 pessoas com mix de acompanhamentos",
    options: ["Pequena", "Média", "Grande"],
    optionPrices: [0, 20, 40],
    complements: ["Granola", "Frutas da estação", "Paçoca", "Mel"],
  },
  {
    id: 4, category: "Pastel", emoji: "🥐",
    name: "Pastel de Queijo", price: 8.50,
    description: "Pastel crocante com queijo derretido por dentro",
    options: ["Normal", "Grande"],
    optionPrices: [0, 3],
    complements: ["Caldo de cana", "Suco"],
  },
  {
    id: 5, category: "Pastel", emoji: "🥐",
    name: "Pastel de Frango", price: 9.50,
    description: "Frango temperado com catupiry e tomate",
    options: ["Normal", "Grande"],
    optionPrices: [0, 3],
    complements: ["Caldo de cana", "Molho especial"],
  },
  {
    id: 6, category: "Salgados", emoji: "🍗",
    name: "Coxinha", price: 7.00,
    description: "Massa crocante recheada com frango e cream cheese",
    options: ["Tradicional", "Catupiry"],
    optionPrices: [0, 1.5],
    complements: ["Molho barbecue", "Molho apimentado"],
  },
  {
    id: 7, category: "Salgados", emoji: "🟡",
    name: "Batatinha Frita", price: 14.90,
    description: "Porção de batatas fritas crocantes com molho especial",
    options: ["P", "M", "G"],
    optionPrices: [0, 5, 9],
    complements: ["Ketchup", "Mostarda", "Cheddar", "Bacon"],
  },
  {
    id: 8, category: "Tapioca", emoji: "🫓",
    name: "Tapioca Doce", price: 11.90,
    description: "Tapioca com coco, leite condensado e manteiga",
    options: ["Simples", "Recheada"],
    optionPrices: [0, 4],
    complements: ["Queijo coalho", "Chocolate", "Morango"],
  },
  {
    id: 9, category: "Tapioca", emoji: "🫓",
    name: "Tapioca Salgada", price: 12.90,
    description: "Tapioca com frango, queijo e legumes frescos",
    options: ["Simples", "Especial"],
    optionPrices: [0, 4],
    complements: ["Tomate seco", "Cream cheese", "Ervas"],
  },
  {
    id: 10, category: "Churros", emoji: "🍩",
    name: "Churros Recheado", price: 9.90,
    description: "Churros quentinho com recheio cremoso e açúcar canela",
    options: ["Doce de leite", "Nutella", "Brigadeiro"],
    optionPrices: [0, 2, 2],
    complements: ["Calda de chocolate", "Sorvete de bola"],
  },
  {
    id: 11, category: "Sorvete", emoji: "🍦",
    name: "Sorvete de Massa", price: 12.90,
    description: "Sorvete cremoso artesanal em cone ou copinho",
    options: ["1 bola", "2 bolas", "3 bolas"],
    optionPrices: [0, 4, 8],
    complements: ["Calda de morango", "Calda de chocolate", "Granulado", "Chantilly"],
  },
  {
    id: 12, category: "Milk Shake", emoji: "🥤",
    name: "Milk Shake Cremoso", price: 19.90,
    description: "Milk shake denso e cremoso com sorvete premium",
    options: ["400ml", "600ml"],
    optionPrices: [0, 5],
    complements: ["Chantilly", "Granulado", "Calda especial"],
  },
  {
    id: 13, category: "Sucos", emoji: "🧃",
    name: "Suco Natural", price: 10.90,
    description: "Suco feito na hora com frutas frescas da estação",
    options: ["300ml", "500ml"],
    optionPrices: [0, 3],
    complements: ["Adoçado", "Com leite", "Com gelo"],
  },
  {
    id: 14, category: "Cremes", emoji: "🍮",
    name: "Creme de Açaí", price: 21.90,
    description: "Açaí batido com creme de leite, engrossado e delicioso",
    options: ["300ml", "500ml"],
    optionPrices: [0, 6],
    complements: ["Granola", "Morango", "Paçoca", "Nutella"],
  },
];

const CATEGORIES = [...new Set(MENU.map(m => m.category))];

const generateOrders = () => {
  const items = [];
  const now = Date.now();
  for (let i = 0; i < 45; i++) {
    const product = MENU[Math.floor(Math.random() * MENU.length)];
    const qty = Math.floor(Math.random() * 3) + 1;
    items.push({
      id: i,
      product,
      qty,
      total: product.price * qty,
      type: Math.random() > 0.5 ? "delivery" : "presencial",
      date: new Date(now - Math.random() * 30 * 24 * 3600000),
      status: ["entregue", "em preparo", "saiu para entrega"][Math.floor(Math.random() * 3)],
      customer: ["Ana Silva", "João Pedro", "Maria Santos", "Carlos Lima", "Fernanda Costa"][Math.floor(Math.random() * 5)],
    });
  }
  return items;
};

// ─────────────────────── STYLES ───────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;600;700;800&family=Nunito:wght@400;600;700&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --brand: #ff6b2b;
    --brand2: #ff9a3c;
    --dark: #1a1008;
    --card-bg: #fff8f2;
    --surface: #fff3e8;
    --muted: #c4a882;
    --text: #3d2008;
    --green: #22c55e;
    --red: #ef4444;
    --blue: #3b82f6;
    --shadow: 0 4px 24px rgba(255,107,43,0.13);
  }

  body { font-family: 'Nunito', sans-serif; background: #fff3e8; color: var(--text); }

  .app { min-height: 100vh; }

  /* NAV */
  .nav {
    background: var(--dark);
    padding: 0 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 64px;
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: 0 2px 20px rgba(0,0,0,0.3);
  }
  .nav-logo {
    font-family: 'Baloo 2', cursive;
    font-size: 1.5rem;
    font-weight: 800;
    color: var(--brand);
    letter-spacing: -0.5px;
    display: flex; align-items: center; gap: 8px;
  }
  .nav-tabs { display: flex; gap: 4px; }
  .nav-tab {
    background: transparent;
    border: none;
    color: #bbb;
    padding: 8px 16px;
    border-radius: 8px;
    font-family: 'Nunito', sans-serif;
    font-weight: 700;
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.2s;
  }
  .nav-tab:hover { background: rgba(255,255,255,0.08); color: white; }
  .nav-tab.active { background: var(--brand); color: white; }
  .nav-cart {
    position: relative;
    background: var(--brand);
    border: none;
    color: white;
    width: 42px;
    height: 42px;
    border-radius: 12px;
    font-size: 1.2rem;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: transform 0.2s;
  }
  .nav-cart:hover { transform: scale(1.08); }
  .cart-badge {
    position: absolute;
    top: -6px; right: -6px;
    background: var(--dark);
    color: var(--brand);
    border-radius: 999px;
    width: 20px; height: 20px;
    font-size: 0.7rem;
    font-weight: 800;
    display: flex; align-items: center; justify-content: center;
  }

  /* HERO */
  .hero {
    background: linear-gradient(135deg, #1a1008 0%, #3d1a00 50%, #ff6b2b22 100%);
    padding: 48px 24px 32px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 70% 50%, rgba(255,107,43,0.15) 0%, transparent 60%);
  }
  .hero h1 {
    font-family: 'Baloo 2', cursive;
    font-size: clamp(1.8rem, 5vw, 3rem);
    font-weight: 800;
    color: white;
    position: relative;
  }
  .hero h1 span { color: var(--brand); }
  .hero p { color: #c4a882; margin-top: 8px; font-size: 1rem; position: relative; }
  .mode-toggle {
    display: flex;
    gap: 12px;
    justify-content: center;
    margin-top: 20px;
    position: relative;
  }
  .mode-btn {
    padding: 10px 24px;
    border-radius: 999px;
    border: 2px solid transparent;
    font-family: 'Baloo 2', cursive;
    font-weight: 700;
    font-size: 0.95rem;
    cursor: pointer;
    transition: all 0.25s;
  }
  .mode-btn.active { background: var(--brand); color: white; border-color: var(--brand); }
  .mode-btn:not(.active) { background: transparent; color: #c4a882; border-color: #555; }
  .mode-btn:not(.active):hover { border-color: var(--brand); color: var(--brand); }

  /* CATEGORY FILTER */
  .cat-filter {
    display: flex; gap: 8px; overflow-x: auto;
    padding: 16px 24px;
    scrollbar-width: none;
    background: white;
    border-bottom: 1px solid #ffe0cc;
  }
  .cat-filter::-webkit-scrollbar { display: none; }
  .cat-btn {
    white-space: nowrap;
    padding: 7px 16px;
    border-radius: 999px;
    border: 2px solid #ffe0cc;
    background: white;
    color: var(--muted);
    font-family: 'Nunito', sans-serif;
    font-weight: 700;
    font-size: 0.82rem;
    cursor: pointer;
    transition: all 0.2s;
  }
  .cat-btn.active { background: var(--brand); border-color: var(--brand); color: white; }
  .cat-btn:not(.active):hover { border-color: var(--brand); color: var(--brand); }

  /* PRODUCT GRID */
  .products-section { padding: 20px 24px 100px; }
  .cat-section { margin-bottom: 32px; }
  .cat-title {
    font-family: 'Baloo 2', cursive;
    font-size: 1.3rem;
    font-weight: 800;
    color: var(--text);
    margin-bottom: 14px;
    display: flex; align-items: center; gap: 8px;
  }
  .cat-title::after { content: ''; flex: 1; height: 2px; background: linear-gradient(to right, #ff6b2b33, transparent); }

  .product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;
  }

  .product-card {
    background: white;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: var(--shadow);
    transition: transform 0.2s, box-shadow 0.2s;
    border: 2px solid transparent;
  }
  .product-card:hover { transform: translateY(-3px); box-shadow: 0 8px 32px rgba(255,107,43,0.2); border-color: #ffe0cc; }

  .product-emoji {
    background: linear-gradient(135deg, #fff3e8, #ffe0cc);
    height: 110px;
    display: flex; align-items: center; justify-content: center;
    font-size: 3.5rem;
  }
  .product-info { padding: 14px 16px 16px; }
  .product-name {
    font-family: 'Baloo 2', cursive;
    font-weight: 800;
    font-size: 1.05rem;
    color: var(--text);
  }
  .product-desc { font-size: 0.8rem; color: #888; margin-top: 4px; line-height: 1.4; }
  .product-price {
    font-family: 'Baloo 2', cursive;
    font-size: 1.2rem;
    font-weight: 800;
    color: var(--brand);
    margin-top: 8px;
  }

  .product-option-row {
    display: flex; gap: 6px; flex-wrap: wrap; margin-top: 10px;
  }
  .opt-chip {
    padding: 4px 10px;
    border-radius: 999px;
    border: 1.5px solid #ffe0cc;
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--muted);
    cursor: pointer;
    transition: all 0.15s;
    background: white;
  }
  .opt-chip.selected { background: var(--brand); border-color: var(--brand); color: white; }

  .qty-row {
    display: flex; align-items: center; justify-content: space-between; margin-top: 12px;
  }
  .qty-ctrl { display: flex; align-items: center; gap: 10px; }
  .qty-btn {
    width: 32px; height: 32px;
    border-radius: 10px;
    border: 2px solid #ffe0cc;
    background: white;
    font-size: 1.1rem;
    font-weight: 800;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    color: var(--brand);
    transition: all 0.15s;
  }
  .qty-btn:hover { background: var(--brand); border-color: var(--brand); color: white; }
  .qty-num { font-weight: 800; font-size: 1rem; min-width: 20px; text-align: center; }

  .add-btn {
    background: var(--brand);
    color: white;
    border: none;
    padding: 8px 18px;
    border-radius: 12px;
    font-family: 'Nunito', sans-serif;
    font-weight: 800;
    font-size: 0.88rem;
    cursor: pointer;
    transition: all 0.2s;
  }
  .add-btn:hover { background: #e85e20; transform: scale(1.04); }
  .add-btn.added { background: var(--green); }

  /* CART DRAWER */
  .cart-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.5);
    z-index: 200;
    animation: fadeIn 0.2s;
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

  .cart-drawer {
    position: fixed;
    right: 0; top: 0; bottom: 0;
    width: min(420px, 100vw);
    background: white;
    z-index: 201;
    display: flex; flex-direction: column;
    animation: slideIn 0.3s cubic-bezier(0.32, 0.72, 0, 1);
    box-shadow: -8px 0 40px rgba(0,0,0,0.2);
  }
  @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }

  .cart-header {
    padding: 20px 24px 16px;
    border-bottom: 1px solid #ffe0cc;
    display: flex; justify-content: space-between; align-items: center;
  }
  .cart-title {
    font-family: 'Baloo 2', cursive;
    font-size: 1.3rem;
    font-weight: 800;
    color: var(--text);
  }
  .cart-close {
    background: #fff3e8;
    border: none;
    width: 36px; height: 36px;
    border-radius: 10px;
    font-size: 1rem;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    color: var(--muted);
    transition: all 0.15s;
  }
  .cart-close:hover { background: #ffe0cc; color: var(--text); }

  .cart-items { flex: 1; overflow-y: auto; padding: 16px 24px; }
  .cart-empty { text-align: center; padding: 48px 0; color: var(--muted); }
  .cart-empty-emoji { font-size: 3rem; display: block; margin-bottom: 12px; }

  .cart-item {
    display: flex; align-items: center; gap: 12px;
    padding: 12px 0;
    border-bottom: 1px solid #fff3e8;
  }
  .cart-item-emoji { font-size: 2rem; width: 44px; text-align: center; }
  .cart-item-info { flex: 1; }
  .cart-item-name { font-weight: 700; font-size: 0.9rem; }
  .cart-item-meta { font-size: 0.75rem; color: var(--muted); margin-top: 2px; }
  .cart-item-price { font-family: 'Baloo 2', cursive; font-weight: 800; color: var(--brand); font-size: 0.95rem; }
  .cart-item-qty { display: flex; align-items: center; gap: 6px; margin-top: 6px; }
  .cart-qty-btn {
    width: 26px; height: 26px;
    border-radius: 8px;
    border: 1.5px solid #ffe0cc;
    background: white;
    font-weight: 800;
    cursor: pointer;
    font-size: 0.9rem;
    display: flex; align-items: center; justify-content: center;
    color: var(--brand);
    transition: all 0.15s;
  }
  .cart-qty-btn:hover { background: var(--brand); border-color: var(--brand); color: white; }

  .cart-footer {
    padding: 16px 24px 24px;
    border-top: 1px solid #ffe0cc;
    background: #fff8f2;
  }
  .cart-total-row {
    display: flex; justify-content: space-between;
    font-family: 'Baloo 2', cursive;
    font-size: 1.2rem;
    font-weight: 800;
    margin-bottom: 14px;
  }
  .checkout-btn {
    width: 100%;
    background: linear-gradient(135deg, var(--brand), var(--brand2));
    color: white;
    border: none;
    padding: 16px;
    border-radius: 16px;
    font-family: 'Baloo 2', cursive;
    font-size: 1.1rem;
    font-weight: 800;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 4px 16px rgba(255,107,43,0.35);
  }
  .checkout-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 24px rgba(255,107,43,0.45); }

  /* DELIVERY FORM */
  .delivery-form {
    background: white;
    border-radius: 20px;
    padding: 24px;
    margin: 0 24px 24px;
    box-shadow: var(--shadow);
  }
  .delivery-form h3 {
    font-family: 'Baloo 2', cursive;
    font-weight: 800;
    font-size: 1.1rem;
    margin-bottom: 16px;
    color: var(--text);
  }
  .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .form-grid.full { grid-template-columns: 1fr; }
  .form-input {
    padding: 10px 14px;
    border-radius: 12px;
    border: 2px solid #ffe0cc;
    font-family: 'Nunito', sans-serif;
    font-size: 0.9rem;
    color: var(--text);
    outline: none;
    transition: border-color 0.2s;
    width: 100%;
  }
  .form-input:focus { border-color: var(--brand); }
  .payment-methods { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 4px; }
  .payment-option {
    flex: 1;
    padding: 12px 14px;
    border-radius: 14px;
    border: 2px solid #ffe0cc;
    background: #fff8f2;
    color: var(--text);
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
  }
  .payment-option.selected {
    border-color: var(--brand);
    background: linear-gradient(135deg, rgba(255,107,43,0.12), rgba(255,154,60,0.18));
    color: var(--brand);
  }
  .payment-option:hover { transform: translateY(-1px); }
  label { font-size: 0.8rem; font-weight: 700; color: var(--muted); display: block; margin-bottom: 4px; }

  /* SUCCESS */
  .success-screen {
    min-height: 60vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 40px 24px;
  }
  .success-emoji { font-size: 5rem; animation: bounce 0.6s; }
  @keyframes bounce { 0%,100%{transform:scale(1)} 50%{transform:scale(1.2)} }
  .success-title {
    font-family: 'Baloo 2', cursive;
    font-size: 1.8rem;
    font-weight: 800;
    color: var(--text);
    margin: 16px 0 8px;
  }
  .success-sub { color: var(--muted); margin-bottom: 24px; }
  .order-code {
    background: #fff3e8;
    border: 2px dashed var(--brand);
    padding: 16px 32px;
    border-radius: 16px;
    font-family: 'Baloo 2', cursive;
    font-size: 1.5rem;
    font-weight: 800;
    color: var(--brand);
    letter-spacing: 4px;
    margin-bottom: 24px;
  }
  .back-btn {
    background: var(--brand);
    color: white;
    border: none;
    padding: 14px 32px;
    border-radius: 14px;
    font-family: 'Baloo 2', cursive;
    font-weight: 800;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s;
  }
  .back-btn:hover { background: #e85e20; }

  /* ATENDENTE */
  .atendente-layout {
    display: grid;
    grid-template-columns: 1fr 360px;
    min-height: calc(100vh - 64px);
  }
  @media(max-width:768px){
    .atendente-layout { grid-template-columns: 1fr; }
  }
  .atendente-menu { overflow-y: auto; padding-bottom: 40px; }
  .atendente-cart {
    background: white;
    border-left: 2px solid #ffe0cc;
    display: flex; flex-direction: column;
    height: calc(100vh - 64px);
    position: sticky;
    top: 64px;
  }
  .atendente-cart-header {
    padding: 20px;
    border-bottom: 1px solid #ffe0cc;
    background: linear-gradient(135deg, #1a1008, #3d2008);
    color: white;
  }
  .atendente-cart-title {
    font-family: 'Baloo 2', cursive;
    font-weight: 800;
    font-size: 1.1rem;
  }
  .atendente-cart-items { flex: 1; overflow-y: auto; padding: 12px 16px; }
  .atendente-cart-footer {
    padding: 16px;
    border-top: 1px solid #ffe0cc;
  }

  /* TICKET */
  .ticket-item {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 0;
    border-bottom: 1px dashed #ffe0cc;
  }
  .ticket-emoji { font-size: 1.5rem; width: 36px; text-align: center; }
  .ticket-info { flex: 1; }
  .ticket-name { font-size: 0.85rem; font-weight: 700; }
  .ticket-meta { font-size: 0.72rem; color: var(--muted); }
  .ticket-price { font-weight: 800; color: var(--brand); font-size: 0.9rem; }
  .ticket-del {
    background: none; border: none;
    color: #ddd; cursor: pointer; font-size: 1rem;
    transition: color 0.15s;
  }
  .ticket-del:hover { color: var(--red); }

  /* DASHBOARD */
  .dashboard { padding: 24px; max-width: 1200px; margin: 0 auto; }
  .dashboard-title {
    font-family: 'Baloo 2', cursive;
    font-size: 1.8rem;
    font-weight: 800;
    color: var(--text);
    margin-bottom: 24px;
    display: flex; align-items: center; gap: 10px;
  }
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 16px;
    margin-bottom: 32px;
  }
  .stat-card {
    background: white;
    border-radius: 20px;
    padding: 22px;
    box-shadow: var(--shadow);
    border-left: 5px solid transparent;
    transition: transform 0.2s;
  }
  .stat-card:hover { transform: translateY(-2px); }
  .stat-card.total { border-color: var(--brand); }
  .stat-card.delivery { border-color: var(--blue); }
  .stat-card.presencial { border-color: var(--green); }
  .stat-card.orders { border-color: #f59e0b; }
  .stat-label { font-size: 0.8rem; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: 0.5px; }
  .stat-value {
    font-family: 'Baloo 2', cursive;
    font-size: 1.9rem;
    font-weight: 800;
    margin-top: 6px;
  }
  .stat-card.total .stat-value { color: var(--brand); }
  .stat-card.delivery .stat-value { color: var(--blue); }
  .stat-card.presencial .stat-value { color: var(--green); }
  .stat-card.orders .stat-value { color: #f59e0b; }
  .stat-sub { font-size: 0.78rem; color: var(--muted); margin-top: 4px; }

  .charts-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 32px;
  }
  @media(max-width:768px){ .charts-row { grid-template-columns: 1fr; } }

  .chart-card {
    background: white;
    border-radius: 20px;
    padding: 22px;
    box-shadow: var(--shadow);
  }
  .chart-title {
    font-family: 'Baloo 2', cursive;
    font-weight: 800;
    font-size: 1rem;
    color: var(--text);
    margin-bottom: 16px;
    display: flex; align-items: center; gap: 8px;
  }

  .bar-row {
    display: flex; align-items: center; gap: 10px; margin-bottom: 10px;
  }
  .bar-label { font-size: 0.82rem; font-weight: 700; width: 130px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .bar-track {
    flex: 1; height: 10px;
    background: #fff3e8;
    border-radius: 999px;
    overflow: hidden;
  }
  .bar-fill {
    height: 100%;
    border-radius: 999px;
    transition: width 0.6s;
  }
  .bar-count { font-size: 0.8rem; font-weight: 700; color: var(--muted); width: 30px; text-align: right; }

  .rank-badge {
    display: inline-flex;
    width: 22px; height: 22px;
    border-radius: 50%;
    align-items: center;
    justify-content: center;
    font-size: 0.7rem;
    font-weight: 800;
    margin-right: 6px;
  }
  .rank-1 { background: #ffd700; color: #5a4500; }
  .rank-2 { background: #c0c0c0; color: #333; }
  .rank-3 { background: #cd7f32; color: white; }
  .rank-low { background: #fee2e2; color: var(--red); }

  .table-section {
    background: white;
    border-radius: 20px;
    padding: 22px;
    box-shadow: var(--shadow);
    margin-bottom: 24px;
  }
  .table-title {
    font-family: 'Baloo 2', cursive;
    font-weight: 800;
    font-size: 1rem;
    color: var(--text);
    margin-bottom: 16px;
  }
  table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
  th { text-align: left; padding: 8px 12px; color: var(--muted); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #fff3e8; }
  td { padding: 10px 12px; border-bottom: 1px solid #fff3e8; }
  tr:last-child td { border-bottom: none; }
  tr:hover td { background: #fff8f2; }

  .badge {
    display: inline-block;
    padding: 3px 10px;
    border-radius: 999px;
    font-size: 0.72rem;
    font-weight: 700;
  }
  .badge-delivery { background: #dbeafe; color: var(--blue); }
  .badge-presencial { background: #dcfce7; color: var(--green); }
  .badge-entregue { background: #dcfce7; color: var(--green); }
  .badge-preparo { background: #fef3c7; color: #d97706; }
  .badge-saiu { background: #dbeafe; color: var(--blue); }

  .donut-chart {
    position: relative;
    width: 140px; height: 140px;
    margin: 0 auto 16px;
  }
  .donut-chart svg { transform: rotate(-90deg); }
  .donut-center {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-family: 'Baloo 2', cursive;
  }
  .donut-pct { font-size: 1.4rem; font-weight: 800; color: var(--text); }
  .donut-label { font-size: 0.65rem; color: var(--muted); }
  .legend { display: flex; flex-direction: column; gap: 8px; }
  .legend-item { display: flex; align-items: center; gap: 8px; font-size: 0.83rem; }
  .legend-dot { width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0; }
`;

// ─────────────────────── COMPONENTS ───────────────────────

function ProductCard({ product, onAdd, mode }) {
  const [qty, setQty] = useState(1);
  const [selOpt, setSelOpt] = useState(0);
  const [added, setAdded] = useState(false);

  const finalPrice = product.price + (product.optionPrices?.[selOpt] ?? 0);

  const handleAdd = () => {
    onAdd({ ...product, qty, selectedOption: product.options?.[selOpt], selOpt, finalPrice });
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
    setQty(1);
  };

  return (
    <div className="product-card">
      <div className="product-emoji">{product.emoji}</div>
      <div className="product-info">
        <div className="product-name">{product.name}</div>
        <div className="product-desc">{product.description}</div>
        {product.complements?.length > 0 && (
          <div style={{ fontSize: "0.72rem", color: "#aaa", marginTop: 4 }}>
            + {product.complements.slice(0, 3).join(", ")}{product.complements.length > 3 ? "..." : ""}
          </div>
        )}
        {product.options && (
          <div className="product-option-row">
            {product.options.map((opt, i) => (
              <button key={opt} className={`opt-chip ${selOpt === i ? "selected" : ""}`} onClick={() => setSelOpt(i)}>
                {opt}{product.optionPrices?.[i] ? ` +R$${product.optionPrices[i].toFixed(2)}` : ""}
              </button>
            ))}
          </div>
        )}
        <div className="qty-row">
          <div>
            <div className="product-price">R$ {finalPrice.toFixed(2)}</div>
            <div className="qty-ctrl" style={{ marginTop: 6 }}>
              <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
              <span className="qty-num">{qty}</span>
              <button className="qty-btn" onClick={() => setQty(q => q + 1)}>+</button>
            </div>
          </div>
          <button className={`add-btn ${added ? "added" : ""}`} onClick={handleAdd}>
            {added ? "✓ Adicionado" : "🛒 Adicionar"}
          </button>
        </div>
      </div>
    </div>
  );
}

function CartDrawer({ cart, onClose, onUpdateQty, onRemove, mode, onCheckout }) {
  const [step, setStep] = useState("cart");
  const [form, setForm] = useState({
    nome: "",
    telefone: "",
    endereco: "",
    numero: "",
    complemento: "",
    bairro: "",
    paymentMethod: "pix",
    cardName: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvv: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const total = cart.reduce((s, i) => s + i.finalPrice * i.qty, 0);
  const pixKey = "pix@acainograu.com";
  const pixMessage = `PIX | Chave: ${pixKey} | Valor: R$ ${total.toFixed(2)} | Cliente: ${form.nome || "Seu pedido"}`;
  const qrImage = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(pixMessage)}`;

  const resetAndClose = () => {
    setStep("cart");
    setError("");
    setSubmitting(false);
    onClose();
  };

  const validateExpiry = (value) => {
    const cleaned = value.replace(/\s+/g, "");
    const match = cleaned.match(/^(0[1-9]|1[0-2])\/?([0-9]{2}|[0-9]{4})$/);
    if (!match) return false;
    const month = Number(match[1]);
    const year = Number(match[2].length === 2 ? `20${match[2]}` : match[2]);
    const expires = new Date(year, month - 1, 1);
    const now = new Date();
    return expires >= new Date(now.getFullYear(), now.getMonth(), 1);
  };

  const validateForm = () => {
    if (!form.nome.trim()) {
      setError("Informe o nome do cliente.");
      return false;
    }
    if (!form.telefone.trim()) {
      setError("Informe o telefone ou WhatsApp.");
      return false;
    }
    if (mode === "delivery") {
      if (!form.endereco.trim()) {
        setError("Informe a rua ou avenida.");
        return false;
      }
      if (!form.numero.trim()) {
        setError("Informe o número do endereço.");
        return false;
      }
      if (!form.bairro.trim()) {
        setError("Informe o bairro.");
        return false;
      }
    }
    if (form.paymentMethod === "cartao") {
      const digits = form.cardNumber.replace(/\D/g, "");
      if (!form.cardName.trim()) {
        setError("Informe o nome do titular do cartão.");
        return false;
      }
      if (!/^\d{13,19}$/.test(digits)) {
        setError("Número do cartão inválido.");
        return false;
      }
      if (!validateExpiry(form.cardExpiry)) {
        setError("Validade do cartão inválida.");
        return false;
      }
      if (!/^\d{3,4}$/.test(form.cardCvv)) {
        setError("CVV inválido.");
        return false;
      }
    }
    setError("");
    return true;
  };

  const handleCheckout = async () => {
    if (step === "cart") {
      setStep("form");
      setError("");
      return;
    }

    if (!validateForm()) {
      return;
    }

    const delivery_address = mode === "delivery"
      ? [form.endereco, form.numero, form.complemento, form.bairro].filter(Boolean).join(", ")
      : null;

    const paymentDetails = form.paymentMethod === "cartao"
      ? {
          cardholder: form.cardName,
          last4: form.cardNumber.replace(/\D/g, "").slice(-4),
          expiry: form.cardExpiry,
        }
      : {
          pix_key: pixKey,
          qr_data: pixMessage,
        };

    const orderPayload = {
      customer_name: form.nome,
      phone: form.telefone,
      delivery_address,
      items: cart.map(item => ({
        id: item.id,
        name: item.name,
        qty: item.qty,
        selectedOption: item.selectedOption,
        unitPrice: item.finalPrice,
        totalPrice: item.finalPrice * item.qty,
      })),
      total,
      type: mode,
      status: "novo",
      payment_method: form.paymentMethod,
      payment_details: paymentDetails,
    };

    try {
      setSubmitting(true);
      const result = onCheckout(orderPayload);
      if (result?.then) {
        await result;
      }
    } catch (err) {
      setError(err?.message || "Erro ao enviar pedido. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="cart-overlay" onClick={resetAndClose} />
      <div className="cart-drawer">
        <div className="cart-header">
          <span className="cart-title">🛒 Meu Pedido</span>
          <button className="cart-close" onClick={resetAndClose}>✕</button>
        </div>

        {step === "cart" ? (
          <>
            <div className="cart-items">
              {cart.length === 0 ? (
                <div className="cart-empty">
                  <span className="cart-empty-emoji">🛒</span>
                  <p>Carrinho vazio</p>
                  <p style={{ fontSize: "0.8rem", marginTop: 6 }}>Adicione produtos do cardápio!</p>
                </div>
              ) : cart.map(item => (
                <div key={item.cartId} className="cart-item">
                  <span className="cart-item-emoji">{item.emoji}</span>
                  <div className="cart-item-info">
                    <div className="cart-item-name">{item.name}</div>
                    <div className="cart-item-meta">{item.selectedOption}</div>
                    <div className="cart-item-price">R$ {(item.finalPrice * item.qty).toFixed(2)}</div>
                    <div className="cart-item-qty">
                      <button className="cart-qty-btn" onClick={() => onUpdateQty(item.cartId, -1)}>−</button>
                      <span style={{ fontWeight: 800, fontSize: "0.9rem", minWidth: 20, textAlign: "center" }}>{item.qty}</span>
                      <button className="cart-qty-btn" onClick={() => onUpdateQty(item.cartId, 1)}>+</button>
                      <button className="cart-qty-btn" style={{ marginLeft: 4, color: "#ef4444" }} onClick={() => onRemove(item.cartId)}>🗑</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding: "0 24px", marginTop: 16 }}>
              <div style={{ fontWeight: 800, marginBottom: 10 }}>Forma de pagamento</div>
              <div className="payment-methods">
                {[
                  { id: "pix", label: "PIX" },
                  { id: "cartao", label: "Cartão de Crédito" },
                ].map(option => (
                  <button
                    key={option.id}
                    className={`payment-option ${form.paymentMethod === option.id ? "selected" : ""}`}
                    onClick={() => setForm(prev => ({ ...prev, paymentMethod: option.id }))}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="cart-footer">
              <div className="cart-total-row">
                <span>Total</span>
                <span style={{ color: "var(--brand)" }}>R$ {total.toFixed(2)}</span>
              </div>
              <button className="checkout-btn" onClick={handleCheckout} disabled={cart.length === 0}>
                {mode === "delivery" ? "📍 Informar Endereço →" : "📝 Confirmar Dados"}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="cart-items" style={{ padding: "16px" }}>
              <h3 style={{ fontFamily: "'Baloo 2',cursive", fontWeight: 800, marginBottom: 16 }}>{mode === "delivery" ? "📍 Endereço de Entrega" : "🏪 Retirada na Lanchonete"}</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {(mode === "delivery" ? [
                  { key: "nome", label: "Nome completo" },
                  { key: "telefone", label: "Telefone / WhatsApp" },
                  { key: "endereco", label: "Rua / Avenida" },
                  { key: "numero", label: "Número" },
                  { key: "complemento", label: "Complemento" },
                  { key: "bairro", label: "Bairro" },
                ] : [
                  { key: "nome", label: "Nome completo" },
                  { key: "telefone", label: "Telefone / WhatsApp" },
                ]).map(field => (
                  <div key={field.key}>
                    <label>{field.label}</label>
                    <input
                      className="form-input"
                      value={form[field.key]}
                      onChange={e => setForm(p => ({ ...p, [field.key]: e.target.value }))}
                    />
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 18 }}>
                <div style={{ fontWeight: 800, marginBottom: 10 }}>Forma de pagamento</div>
                <div className="payment-methods">
                  {[
                    { id: "pix", label: "PIX" },
                    { id: "cartao", label: "Cartão de Crédito" },
                  ].map(option => (
                    <button
                      key={option.id}
                      className={`payment-option ${form.paymentMethod === option.id ? "selected" : ""}`}
                      onClick={() => setForm(prev => ({ ...prev, paymentMethod: option.id }))}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {form.paymentMethod === "cartao" ? (
                <div style={{ marginTop: 18, display: "grid", gap: 12 }}>
                  <div>
                    <label>Nome no cartão</label>
                    <input
                      className="form-input"
                      value={form.cardName}
                      onChange={e => setForm(p => ({ ...p, cardName: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label>Número do cartão</label>
                    <input
                      className="form-input"
                      value={form.cardNumber}
                      onChange={e => setForm(p => ({ ...p, cardNumber: e.target.value }))}
                      placeholder="0000 0000 0000 0000"
                    />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                      <label>Validade</label>
                      <input
                        className="form-input"
                        value={form.cardExpiry}
                        onChange={e => setForm(p => ({ ...p, cardExpiry: e.target.value }))}
                        placeholder="MM/AA"
                      />
                    </div>
                    <div>
                      <label>CVV</label>
                      <input
                        className="form-input"
                        value={form.cardCvv}
                        onChange={e => setForm(p => ({ ...p, cardCvv: e.target.value }))}
                        placeholder="123"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ marginTop: 18, display: "grid", gap: 12 }}>
                  <div style={{ fontWeight: 700 }}>Escaneie o QR code para pagar</div>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <img src={qrImage} alt="PIX QR Code" style={{ width: 240, height: 240, borderRadius: 18, border: "1px solid #ffe0cc" }} />
                  </div>
                  <div style={{ fontSize: "0.9rem", color: "var(--muted)", lineHeight: 1.5 }}>
                    Chave PIX: <strong>{pixKey}</strong>
                    <br />Valor: <strong>R$ {total.toFixed(2)}</strong>
                    <br />Após o pagamento, o pedido será registrado no sistema.
                  </div>
                </div>
              )}

              {error && (
                <div style={{ marginTop: 16, color: "#b91c1c", fontWeight: 700 }}>{error}</div>
              )}
            </div>
            <div className="cart-footer">
              <div className="cart-total-row">
                <span>Total do Pedido</span>
                <span style={{ color: "var(--brand)" }}>R$ {total.toFixed(2)}</span>
              </div>
              <button className="checkout-btn" onClick={handleCheckout} disabled={submitting}>
                {submitting ? "Enviando pedido..." : "🚀 Confirmar Pedido"}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

function MenuView({ mode }) {
  const [activeCat, setActiveCat] = useState("Todos");
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [ordered, setOrdered] = useState(false);
  const [orderCode, setOrderCode] = useState("");
  const [orderMeta, setOrderMeta] = useState({ paymentMethod: "pix", serviceType: mode === "delivery" ? "Delivery" : "Retirar na lanchonete" });

  const filtered = activeCat === "Todos" ? MENU : MENU.filter(p => p.category === activeCat);
  const byCategory = CATEGORIES.reduce((acc, cat) => {
    const items = filtered.filter(p => p.category === cat);
    if (items.length) acc[cat] = items;
    return acc;
  }, {});

  const totalItems = cart.reduce((s, i) => s + i.qty, 0);

  const addToCart = (product) => {
    const cartId = `${product.id}-${product.selOpt}-${Date.now()}`;
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id && i.selOpt === product.selOpt);
      if (existing) return prev.map(i => i.id === product.id && i.selOpt === product.selOpt ? { ...i, qty: i.qty + product.qty } : i);
      return [...prev, { ...product, cartId }];
    });
  };

  const updateQty = (cartId, delta) => {
    setCart(prev => prev.map(i => i.cartId === cartId ? { ...i, qty: Math.max(1, i.qty + delta) } : i));
  };

  const removeItem = (cartId) => setCart(prev => prev.filter(i => i.cartId !== cartId));

  const handleCheckout = async (orderPayload) => {
    try {
      const response = await fetch("http://localhost:3000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Erro ao salvar pedido");
      }

      const code = data.id ? `PED${data.id}` : `PED${Math.floor(1000 + Math.random() * 9000)}`;
      setOrderCode(code);
      setOrderMeta({
        paymentMethod: orderPayload.payment_method || "pix",
        serviceType: mode === "delivery" ? "Delivery" : "Retirar na lanchonete",
      });
      setOrdered(true);
      setCart([]);
      setShowCart(false);
      return data;
    } catch (error) {
      console.error("Order submit error:", error);
      throw error;
    }
  };

  if (ordered) {
    return (
      <div className="success-screen">
        <span className="success-emoji">{mode === "delivery" ? "🛵" : "✅"}</span>
        <div className="success-title">Pedido Confirmado!</div>
        <div className="success-sub">{mode === "delivery" ? "Seu pedido está sendo preparado e sairá em breve!" : "Aguarde, seu pedido será preparado em instantes!"}</div>
        <div style={{ display: "grid", gap: 10, marginTop: 16, textAlign: "left", width: "100%", maxWidth: 420 }}>
          <div style={{ fontWeight: 700 }}>Serviço:</div>
          <div style={{ background: "#fff7ed", padding: 12, borderRadius: 14, border: "1px solid #ffe0cc" }}>{orderMeta.serviceType}</div>
          <div style={{ fontWeight: 700 }}>Pagamento:</div>
          <div style={{ background: "#fff7ed", padding: 12, borderRadius: 14, border: "1px solid #ffe0cc" }}>{orderMeta.paymentMethod === "pix" ? "PIX" : "Cartão de Crédito"}</div>
        </div>
        <div className="order-code">{orderCode}</div>
        <p style={{ color: "var(--muted)", marginBottom: 24, fontSize: "0.9rem" }}>
          {mode === "delivery" ? "⏱ Tempo estimado: 30-45 min" : "⏱ Retire no balcão em ~15 min"}
        </p>
        <button className="back-btn" onClick={() => setOrdered(false)}>← Fazer Novo Pedido</button>
      </div>
    );
  }

  return (
    <>
      <div className="hero">
        <h1>🍦 <span>Gelado</span> & <span>Gostoso</span></h1>
        <p>{mode === "delivery" ? "🛵 Peça agora e receba em casa!" : "🏪 Bem-vindo ao nosso balcão!"}</p>
        <div className="mode-toggle" style={{ display: "none" }} />
      </div>
      <div className="cat-filter">
        {["Todos", ...CATEGORIES].map(cat => (
          <button key={cat} className={`cat-btn ${activeCat === cat ? "active" : ""}`} onClick={() => setActiveCat(cat)}>
            {cat}
          </button>
        ))}
      </div>
      <div className="products-section">
        {Object.entries(byCategory).map(([cat, items]) => (
          <div key={cat} className="cat-section">
            <div className="cat-title">{MENU.find(m => m.category === cat)?.emoji} {cat}</div>
            <div className="product-grid">
              {items.map(p => <ProductCard key={p.id} product={p} onAdd={addToCart} mode={mode} />)}
            </div>
          </div>
        ))}
      </div>

      {/* FLOATING CART */}
      <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 150 }}>
        {totalItems > 0 && (
          <button
            onClick={() => setShowCart(true)}
            style={{
              background: "linear-gradient(135deg, var(--brand), var(--brand2))",
              color: "white",
              border: "none",
              padding: "14px 22px",
              borderRadius: 999,
              fontFamily: "'Baloo 2', cursive",
              fontWeight: 800,
              fontSize: "1rem",
              cursor: "pointer",
              boxShadow: "0 4px 24px rgba(255,107,43,0.45)",
              display: "flex",
              alignItems: "center",
              gap: 10,
              animation: "bounce 0.4s"
            }}
          >
            🛒 Ver Carrinho ({totalItems}) · R$ {cart.reduce((s, i) => s + i.finalPrice * i.qty, 0).toFixed(2)}
          </button>
        )}
      </div>

      {showCart && (
        <CartDrawer
          cart={cart}
          onClose={() => setShowCart(false)}
          onUpdateQty={updateQty}
          onRemove={removeItem}
          mode={mode}
          onCheckout={handleCheckout}
        />
      )}
    </>
  );
}

function AtendenteView() {
  const [cart, setCart] = useState([]);
  const [activeCat, setActiveCat] = useState("Todos");
  const [success, setSuccess] = useState(false);

  const filtered = activeCat === "Todos" ? MENU : MENU.filter(p => p.category === activeCat);

  const addToCart = (product) => {
    const cartId = `${product.id}-${product.selOpt}-${Date.now()}`;
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id && i.selOpt === product.selOpt);
      if (existing) return prev.map(i => i.id === product.id && i.selOpt === product.selOpt ? { ...i, qty: i.qty + product.qty } : i);
      return [...prev, { ...product, cartId }];
    });
  };

  const removeItem = (cartId) => setCart(prev => prev.filter(i => i.cartId !== cartId));

  const total = cart.reduce((s, i) => s + i.finalPrice * i.qty, 0);

  const finalize = () => {
    setSuccess(true);
    setCart([]);
    setTimeout(() => setSuccess(false), 2500);
  };

  return (
    <div className="atendente-layout">
      <div className="atendente-menu">
        <div style={{ padding: "16px 24px 0" }}>
          <div style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: "1.1rem", color: "var(--text)", marginBottom: 4 }}>
            👨‍💼 Painel do Atendente
          </div>
          <div style={{ fontSize: "0.82rem", color: "var(--muted)" }}>Adicione os itens ao pedido do cliente</div>
        </div>
        <div className="cat-filter" style={{ marginTop: 12 }}>
          {["Todos", ...CATEGORIES].map(cat => (
            <button key={cat} className={`cat-btn ${activeCat === cat ? "active" : ""}`} onClick={() => setActiveCat(cat)}>{cat}</button>
          ))}
        </div>
        <div style={{ padding: "16px 24px" }}>
          <div className="product-grid">
            {filtered.map(p => <ProductCard key={p.id} product={p} onAdd={addToCart} />)}
          </div>
        </div>
      </div>

      <div className="atendente-cart">
        <div className="atendente-cart-header">
          <div className="atendente-cart-title">📋 Pedido Atual</div>
          <div style={{ fontSize: "0.78rem", color: "#aaa", marginTop: 4 }}>{cart.length} item(s)</div>
        </div>

        {success && (
          <div style={{ background: "var(--green)", color: "white", textAlign: "center", padding: "12px", fontWeight: 800, fontFamily: "'Baloo 2', cursive" }}>
            ✅ Pedido enviado para a cozinha!
          </div>
        )}

        <div className="atendente-cart-items">
          {cart.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 16px", color: "var(--muted)" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: 10 }}>📋</div>
              <p>Nenhum item adicionado</p>
            </div>
          ) : cart.map(item => (
            <div key={item.cartId} className="ticket-item">
              <span className="ticket-emoji">{item.emoji}</span>
              <div className="ticket-info">
                <div className="ticket-name">{item.name}</div>
                <div className="ticket-meta">{item.selectedOption} · {item.qty}x</div>
                <div className="ticket-price">R$ {(item.finalPrice * item.qty).toFixed(2)}</div>
              </div>
              <button className="ticket-del" onClick={() => removeItem(item.cartId)}>✕</button>
            </div>
          ))}
        </div>

        <div className="atendente-cart-footer">
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: "1.1rem", marginBottom: 12 }}>
            <span>Total:</span>
            <span style={{ color: "var(--brand)" }}>R$ {total.toFixed(2)}</span>
          </div>
          <button
            onClick={finalize}
            disabled={cart.length === 0}
            style={{
              width: "100%",
              background: cart.length > 0 ? "linear-gradient(135deg, var(--brand), var(--brand2))" : "#ddd",
              color: "white",
              border: "none",
              padding: "14px",
              borderRadius: 14,
              fontFamily: "'Baloo 2', cursive",
              fontWeight: 800,
              fontSize: "1rem",
              cursor: cart.length > 0 ? "pointer" : "default",
              transition: "all 0.2s"
            }}
          >
            ✅ Finalizar e Enviar
          </button>
          <button
            onClick={() => setCart([])}
            style={{
              width: "100%",
              background: "none",
              color: "var(--muted)",
              border: "1.5px solid #ffe0cc",
              padding: "10px",
              borderRadius: 12,
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 700,
              fontSize: "0.85rem",
              cursor: "pointer",
              marginTop: 8
            }}
          >
            🗑 Limpar Pedido
          </button>
        </div>
      </div>
    </div>
  );
}

function DonutChart({ deliveryPct }) {
  const r = 58, cx = 70, cy = 70;
  const circ = 2 * Math.PI * r;
  const delivDash = (deliveryPct / 100) * circ;

  return (
    <div className="donut-chart">
      <svg width={140} height={140} viewBox="0 0 140 140">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#dcfce7" strokeWidth={18} />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--blue)" strokeWidth={18}
          strokeDasharray={`${delivDash} ${circ}`} strokeLinecap="round" />
      </svg>
      <div className="donut-center">
        <span className="donut-pct">{deliveryPct}%</span>
        <span className="donut-label">Delivery</span>
      </div>
    </div>
  );
}

function DashboardView() {
  const [orders, setOrders] = useState([]);
  const [period, setPeriod] = useState("mes");
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const loadOrders = async () => {
      setLoadingOrders(true);
      if (!supabase) {
        setFetchError("Supabase não está configurado corretamente.");
        setOrders(generateOrders());
        setLoadingOrders(false);
        return;
      }

      const { data, error } = await supabase
        .from("orders")
        .select("id, qty, type, status, customer, date, product_name, product_emoji, product_price")
        .order("date", { ascending: false })
        .limit(100);

      if (error) {
        console.error("Supabase fetch error:", error);
        setFetchError(error.message);
        setOrders(generateOrders());
      } else if (data) {
        setOrders(data.map(order => ({
          id: order.id,
          product: {
            name: order.product_name,
            emoji: order.product_emoji,
            price: Number(order.product_price),
          },
          qty: order.qty,
          total: Number(order.product_price) * order.qty,
          type: order.type,
          date: new Date(order.date),
          status: order.status,
          customer: order.customer,
        })));
      }

      setLoadingOrders(false);
    };

    loadOrders();
  }, []);

  if (loadingOrders) {
    return (
      <div className="dashboard" style={{ padding: 32, fontFamily: "'Nunito', sans-serif" }}>
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Conectando ao Supabase...</div>
        <div style={{ color: "var(--muted)" }}>
          {fetchError ? `Erro ao carregar pedidos: ${fetchError}` : "Aguarde enquanto buscamos os pedidos."}
        </div>
      </div>
    );
  }

  const filtered = period === "hoje"
    ? orders.filter(o => new Date().toDateString() === o.date.toDateString())
    : period === "semana"
    ? orders.filter(o => (Date.now() - o.date.getTime()) < 7 * 24 * 3600000)
    : orders;

  const totalRev = filtered.reduce((s, o) => s + o.total, 0);
  const deliveryRev = filtered.filter(o => o.type === "delivery").reduce((s, o) => s + o.total, 0);
  const presencialRev = filtered.filter(o => o.type === "presencial").reduce((s, o) => s + o.total, 0);

  const productSales = {};
  filtered.forEach(o => {
    const k = o.product.name;
    if (!productSales[k]) productSales[k] = { name: k, emoji: o.product.emoji, qty: 0, rev: 0 };
    productSales[k].qty += o.qty;
    productSales[k].rev += o.total;
  });

  const ranked = Object.values(productSales).sort((a, b) => b.qty - a.qty);
  const maxQty = ranked[0]?.qty || 1;
  const deliveryPct = totalRev > 0 ? Math.round((deliveryRev / totalRev) * 100) : 0;
  const recent = [...filtered].sort((a, b) => b.date - a.date).slice(0, 8);

  return (
    <div className="dashboard">
      <div className="dashboard-title">
        📊 Painel do Dono
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          {["hoje", "semana", "mes"].map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              style={{
                padding: "6px 16px", borderRadius: 999,
                border: "2px solid " + (period === p ? "var(--brand)" : "#ffe0cc"),
                background: period === p ? "var(--brand)" : "white",
                color: period === p ? "white" : "var(--muted)",
                fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: "0.82rem",
                cursor: "pointer", transition: "all 0.2s"
              }}
            >
              {p === "hoje" ? "Hoje" : p === "semana" ? "7 dias" : "30 dias"}
            </button>
          ))}
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-label">💰 Faturamento Total</div>
          <div className="stat-value">R$ {totalRev.toFixed(2).replace(".", ",")}</div>
          <div className="stat-sub">{filtered.length} pedido(s)</div>
        </div>
        <div className="stat-card delivery">
          <div className="stat-label">🛵 Faturamento Delivery</div>
          <div className="stat-value">R$ {deliveryRev.toFixed(2).replace(".", ",")}</div>
          <div className="stat-sub">{filtered.filter(o => o.type === "delivery").length} pedidos</div>
        </div>
        <div className="stat-card presencial">
          <div className="stat-label">🏪 Faturamento Presencial</div>
          <div className="stat-value">R$ {presencialRev.toFixed(2).replace(".", ",")}</div>
          <div className="stat-sub">{filtered.filter(o => o.type === "presencial").length} pedidos</div>
        </div>
        <div className="stat-card orders">
          <div className="stat-label">🧾 Ticket Médio</div>
          <div className="stat-value">R$ {filtered.length ? (totalRev / filtered.length).toFixed(2).replace(".", ",") : "0,00"}</div>
          <div className="stat-sub">por pedido</div>
        </div>
      </div>

      <div className="charts-row">
        <div className="chart-card">
          <div className="chart-title">🏆 Mais Vendidos</div>
          {ranked.slice(0, 6).map((p, i) => (
            <div key={p.name} className="bar-row">
              <div className="bar-label">
                <span className={`rank-badge rank-${i < 3 ? i + 1 : "low"}`} style={i >= 3 ? { display: "none" } : {}}>
                  {i + 1}
                </span>
                {p.emoji} {p.name}
              </div>
              <div className="bar-track">
                <div className="bar-fill" style={{
                  width: `${(p.qty / maxQty) * 100}%`,
                  background: i === 0 ? "linear-gradient(90deg,#ffd700,#ff9a3c)" : i === 1 ? "linear-gradient(90deg,#c0c0c0,#9ca3af)" : "linear-gradient(90deg,var(--brand),var(--brand2))"
                }} />
              </div>
              <span className="bar-count">{p.qty}</span>
            </div>
          ))}
          {ranked.length > 0 && (
            <div style={{ marginTop: 12, padding: "10px 12px", background: "#fee2e2", borderRadius: 12, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: "1rem" }}>📉</span>
              <div>
                <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--red)" }}>Menos vendido:</div>
                <div style={{ fontSize: "0.82rem" }}>{ranked[ranked.length - 1]?.emoji} {ranked[ranked.length - 1]?.name} ({ranked[ranked.length - 1]?.qty} un.)</div>
              </div>
            </div>
          )}
        </div>

        <div className="chart-card" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div className="chart-title" style={{ alignSelf: "flex-start" }}>📡 Distribuição de Canais</div>
          <DonutChart deliveryPct={deliveryPct} />
          <div className="legend" style={{ width: "100%" }}>
            <div className="legend-item">
              <div className="legend-dot" style={{ background: "var(--blue)" }} />
              <span>Delivery — {deliveryPct}% · R$ {deliveryRev.toFixed(2)}</span>
            </div>
            <div className="legend-item">
              <div className="legend-dot" style={{ background: "var(--green)" }} />
              <span>Presencial — {100 - deliveryPct}% · R$ {presencialRev.toFixed(2)}</span>
            </div>
          </div>
          {ranked.length > 0 && (
            <div style={{ marginTop: 16, width: "100%", padding: "12px", background: "#fff3e8", borderRadius: 14, border: "1.5px solid #ffe0cc" }}>
              <div style={{ fontSize: "0.75rem", color: "var(--muted)", fontWeight: 700, marginBottom: 6 }}>⭐ CAMPEÃO DE VENDAS</div>
              <div style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: "1rem" }}>
                {ranked[0]?.emoji} {ranked[0]?.name}
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: 2 }}>{ranked[0]?.qty} unidades · R$ {ranked[0]?.rev.toFixed(2)}</div>
            </div>
          )}
        </div>
      </div>

      <div className="table-section">
        <div className="table-title">📋 Últimos Pedidos</div>
        <div style={{ overflowX: "auto" }}>
          <table>
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Produto</th>
                <th>Canal</th>
                <th>Valor</th>
                <th>Status</th>
                <th>Data</th>
              </tr>
            </thead>
            <tbody>
              {recent.map(o => (
                <tr key={o.id}>
                  <td style={{ fontWeight: 700 }}>{o.customer}</td>
                  <td>{o.product.emoji} {o.product.name}</td>
                  <td><span className={`badge badge-${o.type}`}>{o.type}</span></td>
                  <td style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, color: "var(--brand)" }}>R$ {o.total.toFixed(2)}</td>
                  <td><span className={`badge badge-${o.status === "em preparo" ? "preparo" : o.status === "saiu para entrega" ? "saiu" : "entregue"}`}>{o.status}</span></td>
                  <td style={{ color: "var(--muted)", fontSize: "0.8rem" }}>{o.date.toLocaleDateString("pt-BR")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────── APP ───────────────────────
export default function App() {
  const [tab, setTab] = useState("delivery");
  const [menuMode, setMenuMode] = useState("delivery");

  const handleTab = (t) => {
    setTab(t);
    if (t === "delivery" || t === "presencial") setMenuMode(t);
  };

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <nav className="nav">
          <div className="nav-logo">🍦 Gelado & Gostoso</div>
          <div className="nav-tabs">
            <button className={`nav-tab ${tab === "delivery" ? "active" : ""}`} onClick={() => handleTab("delivery")}>🛵 Delivery</button>
            <button className={`nav-tab ${tab === "presencial" ? "active" : ""}`} onClick={() => handleTab("presencial")}>🏪 Presencial</button>
            <button className={`nav-tab ${tab === "atendente" ? "active" : ""}`} onClick={() => handleTab("atendente")}>👨‍💼 Atendente</button>
            <button className={`nav-tab ${tab === "dashboard" ? "active" : ""}`} onClick={() => handleTab("dashboard")}>📊 Painel</button>
          </div>
        </nav>

        {(tab === "delivery" || tab === "presencial") && <MenuView mode={tab} key={tab} />}
        {tab === "atendente" && <AtendenteView />}
        {tab === "dashboard" && <DashboardView />}
      </div>
    </>
  );
}
