// 商品详情页JavaScript

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 获取URL参数，获取商品ID和类别
    function getUrlParams() {
        const params = {};
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        
        for (const [key, value] of urlParams.entries()) {
            params[key] = value;
        }
        return params;
    }

    const params = getUrlParams();
    const productId = params.id;
    const productType = params.type || 'eastern'; // 默认为东方甜品

    // 获取所有商品数据
    const allProducts = [...(window.easternDesserts || []), ...(window.westernDesserts || [])];
    
    // 根据ID查找商品
    const product = allProducts.find(p => p.id === productId);

    // 如果找到商品，更新页面内容
    if (product) {
        updateProductDetails(product);
        setupQuantityControls();
        setupAddToCartButton(product);
        setupBuyNowButton(product);

        loadRecommendedProducts1(product);
    } else {
        // 商品不存在时显示错误信息
        document.getElementById('productName').textContent = '商品不存在';
        document.getElementById('productDescription').textContent = '抱歉，您请求的商品不存在或已下架。';
    }

    // 更新购物车数量显示
    updateCartCount();
});

// 更新商品详情
function updateProductDetails(product) {
    // 格式化价格，添加人民币符号
    const formattedPrice = `¥${product.price.toFixed(2)}`;
    
    // 更新页面元素（使用原始俄文）
    document.getElementById('productImage').src = product.image || 'https://via.placeholder.com/400';
    document.getElementById('productImage').alt = product.name;
    document.getElementById('productName').textContent = product.name;
    document.getElementById('productPrice').textContent = formattedPrice;
    document.getElementById('productDescription').textContent = product.description;

    // 显示促销标签或新品标签（使用俄文）
    const promotionTag = document.getElementById('productPromotionTag');
    const newTag = document.getElementById('productNewTag');
    
    if (product.is_promotion && product.promotion_tag) {
        promotionTag.textContent = product.promotion_tag;
        promotionTag.style.display = 'inline-block';
    } else {
        promotionTag.style.display = 'none';
    }
    
    if (product.is_new) {
        newTag.textContent = 'Новинка';
        newTag.style.display = 'inline-block';
    } else {
        newTag.style.display = 'none';
    }
    
    // 生成并显示丰富的商品详情（如果有）
    const productDetailsContainer = document.getElementById('productDetails');
    
    if (product.details) {
        // 创建详细信息的HTML结构，包括多巴胺风格的视觉元素
        let detailsHTML = `
            <div class="details-content">
                <!-- 配料信息 -->
                ${product.details.ingredients ? `
                <div class="detail-section ingredients-section">
                    <h4 class="detail-title">📋 Основные ингредиенты</h4>
                    <div class="ingredients-list">
                        ${product.details.ingredients.map(ingredient => 
                            `<span class="ingredient-tag">${ingredient}</span>`
                        ).join(' ')}
                    </div>
                </div>` : ''}
                
                <!-- 口感特点 -->
                ${product.details.taste ? `
                <div class="detail-section taste-section">
                    <h4 class="detail-title">👅 Вкусовые характеристики</h4>
                    <p class="detail-content-text">${product.details.taste}</p>
                </div>` : ''}
                
                <!-- 质地描述 -->
                ${product.details.texture ? `
                <div class="detail-section texture-section">
                    <h4 class="detail-title">🎯 Текстура</h4>
                    <p class="detail-content-text">${product.details.texture}</p>
                </div>` : ''}
                
                <!-- 场合建议 -->
                ${product.details.occasion ? `
                <div class="detail-section occasion-section">
                    <h4 class="detail-title">🎉 Рекомендуемое场合</h4>
                    <p class="detail-content-text">${product.details.occasion}</p>
                </div>` : ''}
                
                <!-- 储存建议 -->
                ${product.details.storage ? `
                <div class="detail-section storage-section">
                    <h4 class="detail-title">❄️ Условия хранения</h4>
                    <p class="detail-content-text">${product.details.storage}</p>
                </div>` : ''}
                
                <!-- 颜色描述 -->
                ${product.details.color ? `
                <div class="detail-section color-section">
                    <h4 class="detail-title">🌈 Внешний вид</h4>
                    <p class="detail-content-text">${product.details.color}</p>
                </div>` : ''}
                
                <!-- 营养信息 -->
                ${product.details.nutrition ? `
                <div class="detail-section nutrition-section">
                    <h4 class="detail-title">✨ Польза для вас</h4>
                    <p class="detail-content-text">${product.details.nutrition}</p>
                </div>` : ''}
            </div>
        `;
        
        productDetailsContainer.innerHTML = detailsHTML;
    } else {
        // 如果没有详细信息，生成一些基于价格类别的通用描述
        let defaultDetails = '\n';
        
        if (product.price_category === 'high') {
            defaultDetails += 'Это наш премиум-продукт, приготовленный из самых качественных ингредиентов, чтобы подарить вам превосходный вкусовой опыт.';
        } else if (product.price_category === 'medium') {
            defaultDetails += 'Выбор с отличным соотношением цены и качества, идеальный баланс качества и стоимости.';
        } else {
            defaultDetails += 'Доступный вкусный выбор, чтобы вы могли наслаждаться сладкими моментами в любое время.';
        }
        
        productDetailsContainer.textContent = defaultDetails;
    }
}

// 设置数量控制功能
function setupQuantityControls() {
    const quantityInput = document.getElementById('quantity');
    const decreaseBtn = document.getElementById('decreaseQuantity');
    const increaseBtn = document.getElementById('increaseQuantity');

    decreaseBtn.addEventListener('click', function() {
        let currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
        }
    });

    increaseBtn.addEventListener('click', function() {
        let currentValue = parseInt(quantityInput.value);
        quantityInput.value = currentValue + 1;
    });
}

// 设置加入购物车按钮
function setupAddToCartButton(product) {
    const addToCartBtn = document.getElementById('addToCart');
    const quantityInput = document.getElementById('quantity');

    addToCartBtn.addEventListener('click', function() {
        const quantity = parseInt(quantityInput.value);
        addProductToCart(product, quantity);
        updateCartCount();
        
        // 显示成功提示
        showAddToCartSuccess();
    });
}

// 设置立即购买按钮
function setupBuyNowButton(product) {
    const buyNowBtn = document.getElementById('buyNow');
    const quantityInput = document.getElementById('quantity');

    buyNowBtn.addEventListener('click', function() {
        const quantity = parseInt(quantityInput.value);
        
        // 先清空购物车，然后添加当前商品
        clearCart();
        addProductToCart(product, quantity);
        updateCartCount();
        
        // 跳转到购物车页面
        window.location.href = 'cart.html';
    });
}

// 加载推荐商品
function loadRecommendedProducts1(currentProduct) {
    console.log('--',currentProduct)
    // 获取所有商品数据
    const allProducts = [...(window.easternDesserts || []), ...(window.westernDesserts || [])];
    
    // 过滤掉当前商品，随机选择4个作为推荐
    // 添加空值检查，避免处理无效商品ID
    const recommendedProducts = allProducts
        .filter(p => currentProduct && currentProduct.id && p.id !== currentProduct.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 4);
    
    const recommendedList = document.getElementById('recommendedProductsList');
    recommendedList.innerHTML = '';
    
    // 判断当前商品是东方还是西方甜品
    const isEastern = window.easternDesserts.some(p => p.id === currentProduct?.id);
    
    // 生成推荐商品HTML
    recommendedProducts.forEach(product => {
        const productType = window.easternDesserts.some(p => p.id === product.id) ? 'eastern' : 'western';
        const item = document.createElement('div');
        item.className = 'recommended-item';
        
        item.innerHTML = `
            <img src="${product.image || 'https://via.placeholder.com/120'}" alt="${product.name}">
            <h4>${product.name}</h4>
            <div class="rec-price">¥${product.price.toFixed(2)}</div>
            <button class="view-details-btn" onclick="window.location.href='product.html?id=${product.id}&type=${productType}'">Смотреть детали</button>
        `;
        
        recommendedList.appendChild(item);
    });
}

// 购物车功能相关函数

// 添加商品到购物车
function addProductToCart(product, quantity) {
    // 从localStorage获取购物车数据
    let cart = JSON.parse(localStorage.getItem('dessertCart')) || [];
    
    // 检查商品是否已在购物车中
    const existingProductIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingProductIndex !== -1) {
        // 如果已存在，增加数量
        cart[existingProductIndex].quantity += quantity;
    } else {
        // 如果不存在，添加新商品
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image || 'https://via.placeholder.com/80',
            quantity: quantity
        });
    }
    
    // 保存到localStorage
    localStorage.setItem('dessertCart', JSON.stringify(cart));
}

// 清空购物车
function clearCart() {
    localStorage.removeItem('dessertCart');
}

// 更新购物车数量显示
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('dessertCart')) || [];
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    const cartCountElement = document.getElementById('cartCount');
    if (!cartCountElement) return; // 确保元素存在
    
    cartCountElement.textContent = totalCount;
    
    // 根据购物车是否为空显示或隐藏数量标记
    if (totalCount > 0) {
        cartCountElement.style.display = 'inline-flex';
    } else {
        cartCountElement.style.display = 'none';
    }
}

// 显示加入购物车成功提示（使用俄文）
function showAddToCartSuccess() {
    // 创建提示元素
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = 'Успешно добавлено в корзину！';
    
    // 设置样式
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#4CAF50',
        color: 'white',
        padding: '15px 30px',
        borderRadius: '30px',
        fontSize: '1.1rem',
        fontWeight: 'bold',
        zIndex: '1000',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
        opacity: '0',
        transition: 'opacity 0.3s ease, transform 0.3s ease'
    });
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 显示提示
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translate(-50%, 0)';
    }, 100);
    
    // 3秒后隐藏并移除
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translate(-50%, -50%)';
        
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// 翻译函数已移除，直接使用原始俄文文本