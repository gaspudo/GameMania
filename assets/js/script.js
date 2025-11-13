

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

//bloco do jquery-------
$(function() {
    function getCart(){
        try { return JSON.parse(localStorage.getItem('cart') || '[]' );}
        catch(e) { return []; }
    }
    function saveCart(cart) {localStorage.setItem('cart', JSON.stringify(cart)); }

    function formatPrice(num) {
        return Number(num || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }
    const showToast = (msg) => {
        const $toast = $('#toast-msg');
        if ($toast.length ===0) {
            console.warn('Elemento #toast-msg não encontrado. O alert() foi removido.');
            return;
        }
        $toast.text(msg).fadeIn(400);
        setTimeout(() => { $toast.fadeOut(400); 

        }, 3000);
    };
    function renderCart() {
        var $container = $('#cart-items');
        if ($container.length ===0) return;
        var cart = getCart();
        $container.empty();
        if (!cart || cart.length ===0) {
            $('empty-cart-msg').removeClass('d-none');
            $('subtotal-value').text(formatPrice(0));
            $('#total-value').text(formatPrice(0));
        }
        $('#empty-cart-message').addClass('d-none');
        cart.forEach(function(item) {
            var line = item.price * item.qty;
            var $art = $('<article class="cart-item card mb-3" data-id="'+item.id+'">' +
                '<section class="card-body"><section class="d-flex justify-content-between">' +
                '<section class="d-flex flex-row align-items-center">' +
                '<figure class="me-3 mb-0"><img src="'+item.img+'" class="img-fluid rounded-3" alt="'+item.title+'" style="width:65px"></figure>' +
                '<section><h3 class="h6 mb-0">'+item.title+'</h3></section>' +
                '</section>' +
                '<section class="d-flex flex-row align-items-center">' +
                '<section style="width:120px" class="d-flex align-items-center">' +
                '<button class="btn btn-link px-2 btn-minus">-</button>' +
                '<input type="number" min="1" value="'+item.qty+'" class="form-control form-control-sm text-center qty-input" style="width:60px">' +
                '<button class="btn btn-link px-2 btn-plus">+</button>' +
                '</section>' +
                '<section style="width:120px; text-align:right"><p class="mb-0 fw-bold line-total">'+formatPrice(line)+'</p></section>' +
                '<a href="#" class="text-danger ms-3 remove-item">Remover</a>' +
                '</section></section></section></article>');
            $container.append($art);
        });
        bindCartEvents();
        updateTotals();
    }

    function updateTotals() {
        var cart = getCart();
        var subtotal = 0;
        cart.forEach(function(i){ subtotal += i.price * i.qty; });
        $('#subtotal-value').text(formatPrice(subtotal));
        $('#total-value').text(formatPrice(subtotal));
    }

    function bindCartEvents() {
        $('.remove-item').off('click').on('click', function(e){
            e.preventDefault();
            var id = $(this).closest('.cart-item').data('id');
            var cart = getCart().filter(function(it){ return it.id !== id; });
            saveCart(cart);
            renderCart();
        });
        $('.qty-input').off('change').on('change', function(){
            var $inp = $(this);
            var qty = parseInt($inp.val(),10) || 1;
            if (qty < 1) qty = 1; $inp.val(qty);
            var id = $inp.closest('.cart-item').data('id');
            var cart = getCart().map(function(it){ if (it.id === id) it.qty = qty; return it; });
            saveCart(cart);
            // atualizar linha
            var item = cart.find(function(it){ return it.id === id; });
            if (item) $inp.closest('.cart-item').find('.line-total').text(formatPrice(item.price * item.qty));
            updateTotals();
        });
        $('.btn-plus').off('click').on('click', function(){
            var $inp = $(this).siblings('.qty-input');
            $inp.val( (parseInt($inp.val(),10)||0) + 1 ).trigger('change');
        });
        $('.btn-minus').off('click').on('click', function(){
            var $inp = $(this).siblings('.qty-input');
            var cur = parseInt($inp.val(),10) || 1; if (cur>1) $inp.val(cur-1).trigger('change');
        });
    }

    // Adicionar ao carrinho (qualquer página)
    $(document).on('click', '.add-to-cart', function(e){
        e.preventDefault();
        var $prod = $(this).closest('.product-item');
        var title = $prod.find('.product-title').text().trim();
        var priceText = $prod.find('.product-price').text().trim();
        // parse simples: remove tudo que não seja digito ou vírgula/ponto
        var cleaned = (priceText||'').replace(/[^0-9,.-]+/g,'').replace('.', '').replace(',', '.');
        var price = parseFloat(cleaned) || 0;
        var img = $prod.find('img').attr('src') || '';
        var id = $prod.data('id') || title.replace(/\s+/g,'-').toLowerCase();
        var cart = getCart();
        var found = cart.find(function(it){ return it.id === id; });
        if (found) found.qty = (found.qty||1) + 1; else cart.push({ id:id, title:title, price:price, img:img, qty:1 });
        saveCart(cart);
        // Se estivermos na página do carrinho, re-renderiza
        renderCart();
        // Substituímos o alert()
        showToast('Produto adicionado ao carrinho!');
    });

    // Adiciona o elemento do "toast" ao body (para substituir o alert)
    $('body').append('<div id="toast-message"></div>');

    // renderiza ao carregar a página (aplica somente se existir o #cart-items)
    renderCart();
    });
