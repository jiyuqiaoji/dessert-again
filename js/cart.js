/**
 * 购物车功能相关JavaScript
 */

// 初始化购物车
function initCart() {
    // 加载购物车数据
    const cartItems = getCartItems();
    updateCartDisplay(cartItems);
    updateCartCount();
    updateSummary();
    
    // 加载推荐商品
    loadRecommendedProducts();
}

// 从本地存储获取购物车数据
function getCartItems() {
    const cart = localStorage.getItem('dessertCart');
    return cart ? JSON.parse(cart) : [];
}

// 保存购物车数据到本地存储
function saveCartItems(cartItems) {
    localStorage.setItem('dessertCart', JSON.stringify(cartItems));
}

// 更新购物车数量显示
function updateCartCount() {
    const cartItems = getCartItems();
    const count = cartItems.reduce((total, item) => total + item.quantity, 0);
    
    // 更新导航栏中的购物车数量
    const cartCountNav = document.getElementById('cartCount');
    if (cartCountNav) {
        cartCountNav.textContent = count;
        // 根据购物车是否为空显示或隐藏数量标记
        if (count > 0) {
            cartCountNav.style.display = 'inline-flex';
        } else {
            cartCountNav.style.display = 'none';
        }
    }
    
    // 兼容旧的选择器
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = count;
    }
}

// 更新购物车显示
function updateCartDisplay(cartItems) {
    const emptyCart = document.getElementById('emptyCart');
    const cartItemsContainer = document.getElementById('cartItems');
    const cartItemsList = document.getElementById('cartItemsList');
    
    if (cartItems.length === 0) {
        // 显示空购物车
        if (emptyCart) emptyCart.style.display = 'block';
        if (cartItemsContainer) cartItemsContainer.style.display = 'none';
    } else {
        // 隐藏空购物车，显示购物车内容
        if (emptyCart) emptyCart.style.display = 'none';
        if (cartItemsContainer) cartItemsContainer.style.display = 'block';
        
        // 清空列表
        if (cartItemsList) cartItemsList.innerHTML = '';
        
        // 生成购物车项
        cartItems.forEach((item, index) => {
            const cartItemRow = createCartItemRow(item, index);
            if (cartItemsList) cartItemsList.appendChild(cartItemRow);
        });
        
        // 添加事件监听器
        addCartItemEventListeners();
    }
}

// 创建购物车商品行
function createCartItemRow(item, index) {
    const row = document.createElement('div');
    row.className = 'cart-item-row';
    row.dataset.index = index;
    row.dataset.id = item.id;
    
    // 计算小计
    const subtotal = (item.price * item.quantity).toFixed(2);
    
    row.innerHTML = `
        <div class="cart-item cart-product">
            <img src="${item.image || 'https://via.placeholder.com/80'}" alt="${item.name}">
            <div class="product-info">
                <h4>${item.name}</h4>
            </div>
        </div>
        <div class="cart-item cart-price">¥${item.price.toFixed(2)}</div>
        <div class="cart-item cart-quantity">
            <div class="quantity-control">
                <button class="quantity-btn decrease">-</button>
                <input type="number" class="quantity-input" value="${item.quantity}" min="1" readonly>
                <button class="quantity-btn increase">+</button>
            </div>
        </div>
        <div class="cart-item cart-subtotal">¥${subtotal}</div>
        <div class="cart-item cart-action">
            <button class="delete-btn">Удалить</button>
        </div>
    `;
    
    return row;
}

// 添加购物车项事件监听器
function addCartItemEventListeners() {
    // 增加按钮事件
    document.querySelectorAll('.quantity-btn.increase').forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('.cart-item-row');
            const index = parseInt(row.dataset.index);
            updateQuantityByIndex(index, 'increase');
        });
    });
    
    // 减少按钮事件
    document.querySelectorAll('.quantity-btn.decrease').forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('.cart-item-row');
            const index = parseInt(row.dataset.index);
            updateQuantityByIndex(index, 'decrease');
        });
    });
    
    // 删除按钮事件
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('.cart-item-row');
            const index = parseInt(row.dataset.index);
            deleteCartItemByIndex(index);
        });
    });
}

// 根据索引更新商品数量
function updateQuantityByIndex(index, action) {
    let cartItems = getCartItems();
    
    if (index >= 0 && index < cartItems.length) {
        if (action === 'increase') {
            cartItems[index].quantity += 1;
        } else if (action === 'decrease') {
            if (cartItems[index].quantity > 1) {
                cartItems[index].quantity -= 1;
            } else {
                return; // 数量不能小于1
            }
        }
        
        saveCartItems(cartItems);
        updateCartDisplay(cartItems);
        updateCartCount();
        updateSummary();
        
        // 显示通知（俄文）
        showNotification('Количество обновлено');
    }
}

// 根据索引删除购物车项
function deleteCartItemByIndex(index) {
    let cartItems = getCartItems();
    
    if (index >= 0 && index < cartItems.length) {
        cartItems.splice(index, 1);
        saveCartItems(cartItems);
        updateCartDisplay(cartItems);
        updateCartCount();
        updateSummary();
        
        // 显示通知（俄文）
        showNotification('Товар удален');
    }
}

// 更新购物车摘要
function updateSummary() {
    const cartItems = getCartItems();
    const subtotalElement = document.getElementById('subtotal');
    const shippingElement = document.getElementById('shipping');
    const discountElement = document.getElementById('discount');
    const totalElement = document.getElementById('total');
    
    if (!subtotalElement || !shippingElement || !discountElement || !totalElement) return;
    
    // 计算小计
    const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    // 计算运费（满200免运费，否则20元）
    const shipping = subtotal >= 200 ? 0 : 20;
    
    // 获取优惠码折扣
    let discount = 0;
    const promoCode = localStorage.getItem('appliedPromoCode');
    
    if (promoCode) {
        // 根据优惠码计算折扣
        if (promoCode === 'SWEET20') {
            discount = subtotal * 0.2; // 20%折扣
        } else if (promoCode === 'FIRSTORDER') {
            discount = 30; // 30元优惠
        }
    }
    
    // 确保折扣不超过商品总价
    discount = Math.min(discount, subtotal);
    
    // 计算合计
    let total = subtotal + shipping - discount;
    total = Math.max(total, 0); // 确保合计不小于0
    
    // 更新显示
    subtotalElement.textContent = `¥${subtotal.toFixed(2)}`;
    shippingElement.textContent = shipping > 0 ? `¥${shipping.toFixed(2)}` : 'Бесплатно';
    discountElement.textContent = `-¥${discount.toFixed(2)}`;
    totalElement.textContent = `¥${total.toFixed(2)}`;
    
    // 如果有优惠码，显示应用的优惠码信息
    const promoMessage = document.getElementById('promoMessage');
    if (promoCode && promoMessage) {
        promoMessage.textContent = `已应用优惠码: ${promoCode}`;
        promoMessage.className = 'promo-message success';
    }
}

// 显示通知
function showNotification(message) {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 3秒后移除
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        notification.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// 应用优惠码
function applyPromoCode() {
    const promoInput = document.getElementById('promoInput');
    if (promoInput) {
        const code = promoInput.value.trim();
        const promoMessage = document.getElementById('promoMessage');
        
        // 有效的优惠码列表
        const validPromoCodes = ['SWEET20', 'FIRSTORDER', 'DISCOUNT10'];
        
        if (!code) {
            if (promoMessage) {
                promoMessage.textContent = 'Введите промокод';
                promoMessage.className = 'promo-message error';
            }
        } else if (validPromoCodes.includes(code.toUpperCase())) {
            // 保存优惠码
            localStorage.setItem('appliedPromoCode', code.toUpperCase());
            
            // 更新购物车摘要
            updateSummary();
            
            if (promoMessage) {
                promoMessage.textContent = 'Промокод применен успешно！';
                promoMessage.className = 'promo-message success';
            }
            
            showNotification('Промокод применен');
        } else {
            if (promoMessage) {
                promoMessage.textContent = 'Неверный промокод';
                promoMessage.className = 'promo-message error';
            }
        }
    }
}

// 加载推荐商品
function loadRecommendedProducts() {
    // 确保数据已加载
    if (typeof window.easternDesserts === 'undefined' || typeof window.westernDesserts === 'undefined') {
        setTimeout(loadRecommendedProducts, 100);
        return;
    }
    
    // 获取所有商品数据
    const allProducts = [...(window.easternDesserts || []), ...(window.westernDesserts || [])];
    
    // 随机选择4个商品作为推荐
    const recommendedProducts = allProducts
        .sort(() => Math.random() - 0.5)
        .slice(0, 4);
    
    const recommendedProductsContainer = document.getElementById('recommendedProducts');
    if (!recommendedProductsContainer) return;
    
    recommendedProductsContainer.innerHTML = '';
    
    // 生成推荐商品HTML
    recommendedProducts.forEach(product => {
        const item = document.createElement('div');
        item.className = 'recommended-item';
        
        item.innerHTML = `
            <img src="${product.image || 'https://via.placeholder.com/80'}" alt="${product.name}">
            <div class="recommended-item-info">
                <h4>${product.name}</h4>
                <div class="recommended-item-price">¥${product.price.toFixed(2)}</div>
                <button class="add-to-cart-mini-btn" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}" data-image="${product.image || 'https://via.placeholder.com/80'}">Добавить в корзину</button>
            </div>
        `;
        
        recommendedProductsContainer.appendChild(item);
    });
    
    // 设置推荐商品的加入购物车按钮事件
    setupRecommendedProductsEvents();
}

// 设置推荐商品的加入购物车按钮事件
function setupRecommendedProductsEvents() {
    document.querySelectorAll('.add-to-cart-mini-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.dataset.id;
            const productName = this.dataset.name;
            const productPrice = parseFloat(this.dataset.price);
            const productImage = this.dataset.image;
            
            quickAddToCart(productId, productName, productPrice, productImage);
        });
    });
}

// 翻译函数已移除，直接使用原始俄文文本

// 快速添加到购物车
function quickAddToCart(productId, productName, productPrice, productImage) {
    let cartItems = getCartItems();
    
    // 检查商品是否已在购物车中
    const existingItemIndex = cartItems.findIndex(item => item.id === productId);
    
    if (existingItemIndex !== -1) {
        // 增加数量
        cartItems[existingItemIndex].quantity += 1;
    } else {
        // 添加新商品
        cartItems.push({
            id: productId,
            name: productName,
            price: productPrice,
            quantity: 1,
            image: productImage
        });
    }
    
    saveCartItems(cartItems);
    updateCartCount();
    
    // 如果在购物车页面，还需要更新显示和摘要
    if (window.location.pathname.includes('cart.html')) {
        updateCartDisplay(cartItems);
        updateSummary();
    }
    
    showNotification('Добавлено в корзину');
}

// 绑定事件监听器
function bindEventListeners() {
    // 应用优惠码按钮
    const applyPromoBtn = document.getElementById('applyPromoBtn');
    if (applyPromoBtn) {
        applyPromoBtn.addEventListener('click', applyPromoCode);
    }
    
    // 结算按钮
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            const cartItems = getCartItems();
            if (cartItems.length > 0) {
                window.location.href = 'checkout.html';
            } else {
                showNotification('Корзина пуста');
            }
        });
    }
    
    // 快速添加到购物车按钮
    document.querySelectorAll('.quick-add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.dataset.id;
            const productName = this.dataset.name;
            const productPrice = parseFloat(this.dataset.price);
            const productImage = this.dataset.image;
            quickAddToCart(productId, productName, productPrice, productImage);
        });
    });
}

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', function() {
    initCart();
    bindEventListeners();
});
