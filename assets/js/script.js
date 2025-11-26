// ========================================
// MELHORIAS MOBILE
// ========================================

// Detectar se é mobile
const isMobile = window.innerWidth <= 768;

if (isMobile) {
    // Permitir scroll horizontal no banner com toque
    const bannerFigure = document.querySelector('.banner figure');
    
    if (bannerFigure) {
        let isDown = false;
        let startX;
        let scrollLeft;
        
        bannerFigure.addEventListener('mousedown', (e) => {
            isDown = true;
            startX = e.pageX - bannerFigure.offsetLeft;
            scrollLeft = bannerFigure.scrollLeft;
        });
        
        bannerFigure.addEventListener('mouseleave', () => {
            isDown = false;
        });
        
        bannerFigure.addEventListener('mouseup', () => {
            isDown = false;
        });
        
        bannerFigure.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - bannerFigure.offsetLeft;
            const walk = (x - startX) * 2;
            bannerFigure.scrollLeft = scrollLeft - walk;
        });
    }
}

//Função para filtrar conforme texto na barra de pesquisa

document.addEventListener('DOMContentLoaded', function() {

    // selecionar os elementos necessários
    const campoBusca = document.querySelector('.search-input');
    const produtos = document.querySelectorAll('.product-item');

    // verificação de existencia
    if (!campoBusca || !produtos.length) {
        return;
    }

    // Filtrando
    function filtrarProdutos () {
        // transforma texto digitado para minusculo
        const termo = campoBusca.value.toLowerCase().trim();

        //percorrendo cada produto
        produtos.forEach(function(produto) {
            //pegando titulo do produto
            const titulo = produto.querySelector('.product-title')
            const textoTitulo = titulo ? titulo.textContent.toLowerCase() : '';

            // vendo se contém o termo
            if (textoTitulo.includes(termo) || termo === '') {
                //mostrar e esconder produto
                produto.style.display = 'block';
            } else {
                produto.style.display = 'none';
            }
        });
    }

    // Filtrar enquanto digita
    campoBusca.addEventListener('input', filtrarProdutos);

    const formulario = document.querySelector('.search-bar');
    if(formulario) {
        formulario.addEventListener('submit', function(e) {
            e.preventDefault();
        });
    }
});
$(document).ready(function() {
    console.log("Script carregado e jQuery pronto!"); // Teste no console

    // ---. FUNÇÕES DO CARRINHO ---

    // Ler o carrinho salvo
    function getCart() {
        try {
            return JSON.parse(localStorage.getItem('cart')) || [];
        } catch(e) {
            return [];
        }
    }

    // Salvar o carrinho
    function saveCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Formatar preço (R$)
    function formatPrice(num) {
        return Number(num || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    // --- . RENDERIZAÇÃO (Desenhar a tabela) ---
    
    function renderCart() {
        var $tbody = $('.cart-table tbody');
        
        // Se não achou a tabela (estamos na home), para por aqui.
        if ($tbody.length === 0) return;

        var cart = getCart();
        $tbody.empty(); // Limpa a tabela visualmente

        if (cart.length === 0) {
            $tbody.html('<tr><td colspan="5" style="text-align:center; padding:30px;">Ainda não há nada no seu carrinho 😥. <a href="index.html">Voltar às compras</a></td></tr>');
            updateTotals();
            return;
        }

        // Cria as linhas da tabela
        cart.forEach(function(item) {
            var totalItem = item.price * item.qty;
            var html = `
                <tr data-id="${item.id}">
                    <td>
                        <div class="cart-item-details">
                            <img src="${item.img}" class="item-image" style="width:60px">
                            <span class="item-title">${item.title}</span>
                        </div>
                    </td>
                    <td>${formatPrice(item.price)}</td>
                    <td>
                        <div class="quantity-control">
                            <input type="number" class="quantity-input" value="${item.qty}" min="1" style="width:50px; text-align:center;">
                        </div>
                    </td>
                    <td class="item-subtotal">${formatPrice(totalItem)}</td>
                    <td><button class="remove-btn" style="border:none; background:none; color:red; cursor:pointer; font-weight:bold;">X</button></td>
                </tr>
            `;
            $tbody.append(html);
        });

        updateTotals();
    }

    function updateTotals() {
        var cart = getCart();
        var subtotal = 0;
        
        cart.forEach(function(item) {
            subtotal += (item.price * item.qty);
        });

        var frete = subtotal > 0 ? 35.00 : 0;
        var total = subtotal + frete;

        // Atualiza os textos na tela
        $('#subtotal-value').text(formatPrice(subtotal));
        $('#shipping-value').text(formatPrice(frete));
        $('#total-value').text(formatPrice(total));
    }

    // --- . EVENTOS (Cliques) ---

    // Botão "Adicionar ao Carrinho" (Home)
    $(document).on('click', '.add-to-cart', function(e) {
        e.preventDefault();
        var $btn = $(this);
        
        // Pega dados dos atributos data- (mais seguro)
        var id = $btn.attr('data-product');
        var price = parseFloat($btn.attr('data-price'));
        
        // Pega dados visuais
        var $card = $btn.closest('.product-item');
        var title = $card.find('.product-title').text().trim();
        var img = $card.find('img').attr('src');

        var cart = getCart();
        var existing = cart.find(x => x.id == id);

        if (existing) {
            existing.qty++;
        } else {
            cart.push({ id: id, title: title, price: price, img: img, qty: 1 });
        }

        saveCart(cart);
        // Redireciona para o carrinho
        window.location.href = 'carrinho.html';
    });

    // Mudar quantidade (Carrinho)
    $(document).on('change', '.quantity-input', function() {
        var newQty = parseInt($(this).val());
        var id = $(this).closest('tr').data('id');
        var cart = getCart();
        var item = cart.find(x => x.id == id);
        
        if(item && newQty > 0) {
            item.qty = newQty;
            saveCart(cart);
            renderCart();
        }
    });

    // Remover item (Carrinho)
    $(document).on('click', '.remove-btn', function() {
        if(confirm('Remover este item?')) {
            var id = $(this).closest('tr').data('id');
            var cart = getCart();
            var newCart = cart.filter(x => x.id != id);
            saveCart(newCart);
            renderCart();
        }
    });

    // --- INICIALIZAÇÃO ---
    renderCart(); // Roda ao carregar a página
});