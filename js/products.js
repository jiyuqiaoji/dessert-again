// 页面加载完成后执行
 document.addEventListener('DOMContentLoaded', function() {
    // 确定当前页面类型（西点或中点）
    const isWesternPage = window.location.pathname.includes('western-desserts');
    
    // 从导入的模块中获取对应的数据
    const productsData = isWesternPage ? window.westernDesserts : window.easternDesserts;
    
    // 存储原始数据
    window.productsData = productsData;
    
    // 初始化筛选和排序
    initializeFilters();
    
    // 初始显示商品
    displayProducts(productsData);

});

// 初始化筛选和排序功能
function initializeFilters() {
    const priceFilter = document.getElementById('price-filter');
    const sortFilter = document.getElementById('sort-filter');
    
    // 添加价格筛选事件监听
    if (priceFilter) {
        priceFilter.addEventListener('change', function() {
            applyFilters();
        });
    }
    
    // 添加排序事件监听
    if (sortFilter) {
        sortFilter.addEventListener('change', function() {
            applyFilters();
        });
    }
}

// 应用筛选和排序
function applyFilters() {
    const priceFilter = document.getElementById('price-filter');
    const sortFilter = document.getElementById('sort-filter');
    
    if (!window.productsData) return;
    
    // 获取筛选和排序值
    const priceValue = priceFilter ? priceFilter.value : 'all';
    const sortValue = sortFilter ? sortFilter.value : 'name';
    
    // 复制数据以避免修改原始数据
    let filteredData = [...window.productsData];
    
    // 应用价格筛选
    if (priceValue !== 'all') {
        filteredData = filteredData.filter(product => product.price_category === priceValue);
    }
    
    // 应用排序
    switch (sortValue) {
        case 'name':
            filteredData.sort((a, b) => a.name.localeCompare(b.name, 'ru'));
            break;
        case 'price-asc':
            filteredData.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            filteredData.sort((a, b) => b.price - a.price);
            break;
    }
    
    // 显示筛选后的结果
    displayProducts(filteredData);
}

// 显示商品列表
function displayProducts(products) {
    const container = document.getElementById('products-container');
    
    if (!container) return;
    
    // 清空容器
    container.innerHTML = '';
    
    // 如果没有商品，显示提示信息
    if (products.length === 0) {
        container.innerHTML = '<p class="no-products">По вашему запросу не найдено ни одного товара.</p>';
        return;
    }
    
    // 创建并添加商品卡片
    products.forEach(product => {
        const card = createProductCard(product);
        container.appendChild(card);
    });
}

// 创建商品卡片元素
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    // 根据商品类型设置不同的背景颜色
    const isWestern = window.location.pathname.includes('western-desserts');
    const bgColors = isWestern 
        ? ['#FFDAC1', '#E2F0CB', '#B5EAD7', '#C7CEEA', '#FFB7B2']
        : ['#FFB7B2', '#FFDAC1', '#E2F0CB', '#B5EAD7', '#C7CEEA'];
    
    const randomColor = bgColors[Math.floor(Math.random() * bgColors.length)];
    
    // 构建卡片HTML内容
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}"/>
        </div>
        <div class="product-content">
            <h3 class="product-title">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-price">${formatPrice(product.price)}</div>
            <div class="product-actions">
                <button class="add-to-cart-btn add-to-cart" data-id="${product.id || product.name}" 
                    data-name="${product.name}" data-price="${product.price}" 
                    data-image="${product.image || '../images/placeholder.jpg'}">
                    Добавить в корзину
                </button>
                <a href="product.html?id=${product.id || product.name}" class="view-details">Подробнее</a>
            </div>
        </div>
    `;
    
    // 添加促销标签
    if (product.is_promotion && product.promotion_tag) {
        const promoTag = document.createElement('div');
        promoTag.className = 'promotion-tag';
        promoTag.textContent = product.promotion_tag;
        card.appendChild(promoTag);
    }
    
    // 添加新品标签
    if (product.is_new) {
        const newTag = document.createElement('div');
        newTag.className = 'new-tag';
        newTag.textContent = 'Новинка';
        card.appendChild(newTag);
    }
    
    return card;
}

// 显示模拟商品数据（当JSON加载失败时使用）
function displayMockProducts() {
    const container = document.getElementById('products-container');
    
    if (!container) return;
    
    const isWestern = window.location.pathname.includes('western-desserts');
    
    // 模拟数据
    const mockProducts = isWestern 
        ? [
            { name: 'Тiramisu', description: 'Классическое итальянское десерт', price: 850 },
            { name: 'Чизкейк Нью-Йорк', description: 'Традиционный американский чизкейк', price: 950 },
            { name: 'Макаронс', description: 'Французские мини-пирожные', price: 150 },
            { name: 'Брауни', description: 'Классический американский шоколадный десерт', price: 450 },
            { name: 'Овсяная пудинг', description: 'Лёгкий десерт из овсяной муки', price: 350 },
            { name: 'Кrëmlézes flódni', description: 'Венгерский торт с четырьмя слоями', price: 890 }
          ]
        : [
            { name: 'Манты с творогом', description: 'Традиционные восточные пельмени', price: 550 },
            { name: 'Хачапури с вишней', description: 'Восточное пирожное с вишней', price: 480 },
            { name: 'Печеницы с корицей', description: 'Мягкие печенья с корицей', price: 350 },
            { name: 'Чибау', description: 'Традиционный восточный десерт из слоёного теста', price: 650 },
            { name: 'Пирог с творогом и яблоками', description: 'Восточный пирог с творожной начинкой', price: 720 },
            { name: 'Халва с миндалем', description: 'Традиционное восточное сладкое изделие', price: 420 }
          ];
    
    // 显示模拟数据
    container.innerHTML = '';
    mockProducts.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        
        const bgColors = isWestern 
            ? ['#FFDAC1', '#E2F0CB', '#B5EAD7', '#C7CEEA', '#FFB7B2']
            : ['#FFB7B2', '#FFDAC1', '#E2F0CB', '#B5EAD7', '#C7CEEA'];
        
        const randomColor = bgColors[Math.floor(Math.random() * bgColors.length)];
        
        card.innerHTML = `
            <div class="product-image" style="background-color: ${randomColor};">
                ${product.name}
            </div>
            <div class="product-content">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">${formatPrice(product.price)}</div>
                <div class="product-actions">
                    <button class="add-to-cart-btn add-to-cart" data-id="${product.name}" 
                        data-name="${product.name}" data-price="${product.price}" 
                        data-image="../images/placeholder.jpg">
                        Добавить в корзину
                    </button>
                    <a href="product.html?id=${product.name}" class="view-details">Подробнее</a>
                </div>
            </div>
        `;
        
        container.appendChild(card);
    });
}