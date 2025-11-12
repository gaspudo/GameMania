

document.addEventListener('DOMContentLoaded', () => {
    // 1. Alterna o estado de foco visual do banner
    

    // 2. Navegação dos links do topo (se necessário)
    const loginLink = document.querySelector('a[href="login.html"]');
    const registerLink = document.querySelector('a[href="cadastro.html"]');
    
    if (loginLink) {
        loginLink.addEventListener('click', (e) => {
            // e.preventDefault(); // Descomente para testar/simular antes de ir para a página real
            console.log('Navegando para Login...');
        });
    }

    // =========================================================
    // FUNÇÕES ESPECÍFICAS DA PÁGINA DO CARRINHO (carrinho.html)
    // =========================================================

    if (document.querySelector('.cart-page')) {
        handleCartInteractions();
    }
});


function handleCartInteractions() {
    const cartItems = document.querySelectorAll('.cart-item');
    const subtotalValue = document.getElementById('subtotal-value');
    const totalValue = document.getElementById('total-value');
    const shipping = 35.00; // Frete fixo R$ 35,00

    function formatCurrency(value) {
        return `R$ ${value.toFixed(2).replace('.', ',')}`;
    }

    function updateCartTotal() {
        let currentSubtotal = 0;

        cartItems.forEach(item => {
            const priceText = item.querySelector('.item-price').textContent;
            // Extrai o valor do texto (ex: "R$ 419,99" -> 419.99)
            const price = parseFloat(priceText.replace('R$', '').replace(',', '.').trim());
            const quantityInput = item.querySelector('.quantity-control input');
            const quantity = parseInt(quantityInput.value);
            const itemSubtotalElement = item.querySelector('.item-subtotal');
            
            const itemTotal = price * quantity;
            currentSubtotal += itemTotal;

            // Atualiza o total do item na coluna
            itemSubtotalElement.textContent = formatCurrency(itemTotal);
        });

        const finalTotal = currentSubtotal + shipping;

        // Atualiza os valores no resumo
        subtotalValue.textContent = formatCurrency(currentSubtotal);
        totalValue.textContent = formatCurrency(finalTotal);
    }

    // Adicionar listeners para botões de quantidade e remoção
    cartItems.forEach(item => {
        const quantityInput = item.querySelector('.quantity-control input');
        const removeButton = item.querySelector('.remove-button');

        // Listener para mudança de quantidade
        quantityInput.addEventListener('change', updateCartTotal);
        
        // Listener para remoção do item
        removeButton.addEventListener('click', () => {
            // Remove a linha (tr) do item do DOM
            item.remove();
            
            // Re-calcula o total (já que a lista de itens mudou)
            updateCartTotal(); 
            
            // *Opcional: Você precisaria remover o item de um array de estado real
            // ou atualizar o backend aqui.*
        });
    });

    // Inicia o cálculo do total ao carregar a página
    updateCartTotal();
}
