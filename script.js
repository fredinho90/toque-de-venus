// script.js - Toque de Vênus

let cart = [];

// Carregar carrinho
function carregarCarrinho() {
    const cartSaved = localStorage.getItem('cart');
    if (cartSaved) {
        cart = JSON.parse(cartSaved);
    }
}

// Salvar carrinho
function salvarCarrinho() {
    localStorage.setItem('cart', JSON.stringify(cart));
    atualizarIconeCarrinho();
}

// Adicionar ao carrinho (sem redirecionar)
function adicionarAoCarrinho(id, nome, preco, imagem) {
    const itemExistente = cart.find(item => item.id === id);

    if (itemExistente) {
        itemExistente.quantidade += 1;
    } else {
        cart.push({
            id: id,
            nome: nome,
            preco: parseFloat(preco),
            imagem: imagem,
            quantidade: 1
        });
    }

    salvarCarrinho();

    // Mensagem bonita sem sair da página
    const notificacao = document.createElement('div');
    notificacao.style.cssText = `
        position: fixed; top: 100px; right: 20px; background: #d3ad7f; color: black;
        padding: 15px 25px; border-radius: 8px; font-size: 1.6rem; z-index: 1000;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    `;
    notificacao.textContent = `${nome} adicionado ao carrinho!`;
    document.body.appendChild(notificacao);

    setTimeout(() => {
        notificacao.style.opacity = '0';
        setTimeout(() => notificacao.remove(), 500);
    }, 2000);
}

// Atualizar o número no ícone do carrinho
function atualizarIconeCarrinho() {
    const quantidadeTotal = cart.reduce((total, item) => total + item.quantidade, 0);

    // Procura o ícone do carrinho em todas as páginas
    const cartIcons = document.querySelectorAll('.icons img[alt="carrinho"], .icons img[alt="shopping-cart--v1"]');

    cartIcons.forEach(icon => {
        // Remove badge antigo se existir
        let badge = icon.parentElement.querySelector('.cart-badge');
        if (!badge) {
            badge = document.createElement('div');
            badge.className = 'cart-badge';
            badge.style.cssText = `
                position: absolute; top: -8px; right: -8px; background: #e74c3c; color: white;
                font-size: 1.4rem; width: 22px; height: 22px; border-radius: 50%;
                display: flex; align-items: center; justify-content: center; font-weight: bold;
                border: 2px solid #010103;
            `;
            icon.parentElement.style.position = 'relative';
            icon.parentElement.appendChild(badge);
        }

        badge.textContent = quantidadeTotal;
        badge.style.display = quantidadeTotal > 0 ? 'flex' : 'none';
    });
}

// ==================== FUNÇÕES DO CARRINHO ====================

function removerDoCarrinho(index) {
    if (confirm('Tem certeza que deseja remover este item?')) {
        cart.splice(index, 1);
        salvarCarrinho();
        renderizarCarrinho();
    }
}

function alterarQuantidade(index, novaQuantidade) {
    if (novaQuantidade < 1) return;
    cart[index].quantidade = novaQuantidade;
    salvarCarrinho();
    renderizarCarrinho();
}

function calcularTotal() {
    return cart.reduce((total, item) => total + (item.preco * item.quantidade), 0);
}

function renderizarCarrinho() {
    const container = document.getElementById('cart-items');
    const totalElement = document.getElementById('total-price');
    const cartTotalSection = document.getElementById('cart-total');
    const emptyCartSection = document.getElementById('empty-cart');

    if (!container) return;

    container.innerHTML = '';

    if (cart.length === 0) {
        if (emptyCartSection) emptyCartSection.style.display = 'block';
        if (cartTotalSection) cartTotalSection.style.display = 'none';
        return;
    }

    if (emptyCartSection) emptyCartSection.style.display = 'none';
    if (cartTotalSection) cartTotalSection.style.display = 'block';

    cart.forEach((item, index) => {
        const subtotal = item.preco * item.quantidade;

        const itemHTML = `
            <div class="cart-item">
                <img src="${item.imagem}" alt="${item.nome}">
                <div class="cart-item-info">
                    <h3>${item.nome}</h3>
                    <p>R$ ${item.preco.toFixed(2)}</p>
                    <div class="quantity-control">
                        <button onclick="alterarQuantidade(${index}, ${item.quantidade - 1})">-</button>
                        <span style="font-size: 2rem; color: white; min-width: 40px; text-align: center;">${item.quantidade}</span>
                        <button onclick="alterarQuantidade(${index}, ${item.quantidade + 1})">+</button>
                    </div>
                </div>
                <div class="cart-item-price">
                    <div class="price">R$ ${subtotal.toFixed(2)}</div>
                    <button class="remover" onclick="removerDoCarrinho(${index})">Remover</button>
                </div>
            </div>
        `;
        container.innerHTML += itemHTML;
    });

    if (totalElement) {
        totalElement.textContent = `R$ ${calcularTotal().toFixed(2)}`;
    }
}

function limparCarrinho() {
    if (confirm('Tem certeza que deseja limpar todo o carrinho?')) {
        cart = [];
        salvarCarrinho();
        renderizarCarrinho();
    }
}

// ==================== INICIALIZAÇÃO ====================
document.addEventListener('DOMContentLoaded', () => {
    carregarCarrinho();
    atualizarIconeCarrinho();

    if (document.getElementById('cart-items')) {
        renderizarCarrinho();
    }
});
function carregarCheckout() {
    const container = document.getElementById("resumo-itens");
    const subtotalEl = document.getElementById("subtotal");
    const totalEl = document.getElementById("total-final");

    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

    container.innerHTML = "";

    if (carrinho.length === 0) {
        container.innerHTML = "<p>Seu carrinho está vazio.</p>";
        subtotalEl.innerText = "R$ 0,00";
        totalEl.innerText = "R$ 0,00";
        return;
    }

    let subtotal = 0;

    carrinho.forEach(produto => {
        const quantidade = produto.quantidade || 1;
        const preco = produto.preco || produto.price || 0;

        const totalProduto = preco * quantidade;
        subtotal += totalProduto;

        container.innerHTML += `
            <div style="display: flex; gap: 1rem; margin-bottom: 1.5rem; align-items: center;">
                
                <img src="${produto.imagem}" 
                     style="width: 60px; height: 60px; border-radius: 8px; object-fit: cover;">

                <div style="flex: 1;">
                    <p style="font-weight: bold;">${produto.nome}</p>
                    <p>Qtd: ${quantidade}</p>
                </div>

                <div style="font-weight: bold;">
                    R$ ${totalProduto.toFixed(2)}
                </div>
            </div>
        `;
    });

    subtotalEl.innerText = `R$ ${subtotal.toFixed(2)}`;
    totalEl.innerText = `R$ ${subtotal.toFixed(2)}`;
}
// ==================== MOSTRAR ITENS NO CHECKOUT ====================

// ==================== MOSTRAR ITENS NO CHECKOUT ====================
function carregarResumoCarrinho() {
    const resumoItens = document.getElementById('resumo-itens');
    const subtotalEl = document.getElementById('subtotal');
    const totalFinalEl = document.getElementById('total-final');

    if (!resumoItens || !subtotalEl || !totalFinalEl) {
        console.log("Elementos do resumo não encontrados");
        return;
    }

    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

    if (carrinho.length === 0) {
        resumoItens.innerHTML = '<p style="color: #aaa; text-align: center; padding: 3rem 0;">Seu carrinho está vazio.</p>';
        subtotalEl.textContent = 'R$ 0,00';
        totalFinalEl.textContent = 'R$ 0,00';
        return;
    }

    let html = '';
    let subtotal = 0;

    carrinho.forEach(item => {
        const preco = parseFloat(item.preco) || 0;
        const quantidade = parseInt(item.quantidade) || 1;
        const totalItem = preco * quantidade;
        subtotal += totalItem;

        html += `
            <div style="display: flex; justify-content: space-between; margin-bottom: 1.5rem; padding-bottom: 1.5rem; border-bottom: 1px solid #333;">
                <div style="flex: 1;">
                    <strong style="color: #fff;">${item.nome || 'Produto'}</strong><br>
                    <small style="color: #ccc;">Qtde: ${quantidade} × R$ ${preco.toFixed(2).replace('.', ',')}</small>
                </div>
                <div style="text-align: right; font-weight: 600; color: #fff;">
                    R$ ${totalItem.toFixed(2).replace('.', ',')}
                </div>
            </div>
        `;
    });

    resumoItens.innerHTML = html;
    subtotalEl.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
    totalFinalEl.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
}

// ====================== INICIALIZAÇÃO ======================
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('checkout.html') ||
        window.location.href.includes('checkout.html')) {
        console.log('Página de checkout detectada - carregando resumo...');
        carregarResumoCarrinho();
    }
});
function carregarResumoCarrinho() {
    const resumoItens = document.getElementById('resumo-itens');
    const subtotalEl = document.getElementById('subtotal');
    const totalFinalEl = document.getElementById('total-final');

    if (!resumoItens) return;

    // Tenta pegar com a chave mais comum
    let carrinhoJSON = localStorage.getItem('carrinho');

    // Se não encontrar, tenta outras chaves comuns que as pessoas usam
    if (!carrinhoJSON) carrinhoJSON = localStorage.getItem('cart');
    if (!carrinhoJSON) carrinhoJSON = localStorage.getItem('carrinhoItens');
    if (!carrinhoJSON) carrinhoJSON = localStorage.getItem('shoppingCart');

    console.log("🔍 Chave encontrada no localStorage:", carrinhoJSON ? "SIM" : "NENHUMA");

    let carrinho = [];
    if (carrinhoJSON) {
        try {
            carrinho = JSON.parse(carrinhoJSON);
        } catch (e) {
            console.error("Erro ao parsear carrinho:", e);
        }
    }

    console.log("📦 Itens carregados:", carrinho.length, carrinho);

    if (carrinho.length === 0) {
        resumoItens.innerHTML = `
            <p style="color: #aaa; text-align: center; padding: 4rem 0; font-size: 1.8rem;">
                Seu carrinho está vazio 😕
            </p>`;
        if (subtotalEl) subtotalEl.textContent = 'R$ 0,00';
        if (totalFinalEl) totalFinalEl.textContent = 'R$ 0,00';
        return;
    }

    // Monta os itens
    let html = '';
    let subtotal = 0;

    carrinho.forEach(item => {
        const preco = parseFloat(item.preco) || 0;
        const qtd = parseInt(item.quantidade) || 1;
        const totalItem = preco * qtd;
        subtotal += totalItem;

        html += `
            <div style="display: flex; justify-content: space-between; margin: 15px 0; padding-bottom: 15px; border-bottom: 1px solid #444;">
                <div>
                    <strong>${item.nome || 'Produto'}</strong><br>
                    <small style="color:#aaa">Qtde: ${qtd} × R$ ${preco.toFixed(2).replace('.', ',')}</small>
                </div>
                <div style="font-weight: 600; color: #fff;">
                    R$ ${totalItem.toFixed(2).replace('.', ',')}
                </div>
            </div>
        `;
    });

    resumoItens.innerHTML = html;
    const totalFormatado = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
    
    if (subtotalEl) subtotalEl.textContent = totalFormatado;
    if (totalFinalEl) totalFinalEl.textContent = totalFormatado;

    console.log("✅ Resumo carregado com sucesso!");
}