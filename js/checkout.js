// 结账页面JavaScript

// 初始化函数
function initCheckout() {
    // 从localStorage获取购物车数据
    const cartItems = getCartItems();
    
    // 显示订单商品
    displayOrderItems(cartItems);
    
    // 计算并显示订单摘要
    calculateOrderSummary(cartItems);
    
    // 更新导航栏购物车计数
    updateCartCount();
    
    // 绑定事件监听器
    bindEventListeners();
    
    // 初始化表单验证
    initFormValidation();
}

// 获取购物车数据
function getCartItems() {
    try {
        const cartData = localStorage.getItem('dessertCart');
        return cartData ? JSON.parse(cartData) : [];
    } catch (error) {
        console.error('获取购物车数据失败:', error);
        return [];
    }
}

// 不需要翻译，直接使用原始俄文名称

// 显示订单商品
function displayOrderItems(cartItems) {
    const orderItemsList = document.getElementById('orderItemsList');
    if (!orderItemsList) return;
    
    orderItemsList.innerHTML = '';
    
    if (cartItems.length === 0) {
        orderItemsList.innerHTML = `
            <div class="empty-order">
                <p>Ваша корзина пуста</p>
                <a href="cart.html" class="back-to-cart">Вернуться в корзину</a>
            </div>
        `;
        document.getElementById('placeOrderBtn').disabled = true;
        return;
    }
    
    // 获取所有商品数据
    const allProducts = [...(window.easternDesserts || []), ...(window.westernDesserts || [])];
    
    cartItems.forEach(item => {
        const product = allProducts.find(p => p.id === item.id);
        if (!product) return;
        
        const itemElement = document.createElement('div');
        itemElement.className = 'order-item';
        
        // 生成商品图片URL（如果没有真实图片，使用占位图）
        const imageUrl = product.image || `https://via.placeholder.com/80`;
        
        itemElement.innerHTML = `
            <img src="${imageUrl}" alt="${product.name}" class="order-item-image">
            <div class="order-item-info">
                <div class="order-item-name">${product.name}</div>
                <div class="order-item-quantity">x${item.quantity}</div>
            </div>
            <div class="order-item-price">¥${(product.price * item.quantity).toFixed(2)}</div>
        `;
        
        orderItemsList.appendChild(itemElement);
    });
}

// 计算订单摘要
function calculateOrderSummary(cartItems) {
    // 获取所有商品数据
    const allProducts = [...(window.easternDesserts || []), ...(window.westernDesserts || [])];
    
    let subtotal = 0;
    cartItems.forEach(item => {
        const product = allProducts.find(p => p.id === item.id);
        if (product) {
            subtotal += product.price * item.quantity;
        }
    });
    
    // 计算配送费（满200免运费）
    const deliveryOption = document.querySelector('input[name="delivery"]:checked').value;
    let shipping = 0;
    
    if (deliveryOption === 'express') {
        shipping = 30;
    } else if (deliveryOption === 'same-day') {
        shipping = 50;
    } else if (subtotal < 200) {
        shipping = 20;
    }
    
    // 获取优惠折扣（如果有）
    const discountElement = document.getElementById('checkoutPromoInput');
    const appliedDiscount = discountElement.getAttribute('data-discount') || 0;
    const discount = parseFloat(appliedDiscount) || 0;
    
    // 计算总计
    const total = Math.max(0, subtotal + shipping - discount);
    
    // 更新显示
    document.getElementById('orderSubtotal').textContent = `¥${subtotal.toFixed(2)}`;
    document.getElementById('orderShipping').textContent = `¥${shipping.toFixed(2)}`;
    document.getElementById('orderDiscount').textContent = `-¥${discount.toFixed(2)}`;
    document.getElementById('orderTotal').textContent = `¥${total.toFixed(2)}`;
    
    return { subtotal, shipping, discount, total };
}

// 绑定事件监听器
function bindEventListeners() {
    // 支付方式切换
    const paymentOptions = document.querySelectorAll('input[name="payment"]');
    paymentOptions.forEach(option => {
        option.addEventListener('change', handlePaymentMethodChange);
    });
    
    // 配送方式切换
    const deliveryOptions = document.querySelectorAll('input[name="delivery"]');
    deliveryOptions.forEach(option => {
        option.addEventListener('change', () => {
            const cartItems = getCartItems();
            calculateOrderSummary(cartItems);
        });
    });
    
    // 优惠码应用
    const applyPromoBtn = document.getElementById('checkoutApplyPromoBtn');
    if (applyPromoBtn) {
        applyPromoBtn.addEventListener('click', applyCheckoutPromoCode);
    }
    
    // 提交订单
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', handlePlaceOrder);
    }
    
    // 省份选择
    const provinceSelect = document.getElementById('province');
    if (provinceSelect) {
        provinceSelect.addEventListener('change', handleProvinceChange);
    }
}

// 处理支付方式切换
function handlePaymentMethodChange(event) {
    const creditCardForm = document.getElementById('credit-card-form');
    if (event.target.value === 'credit-card') {
        creditCardForm.classList.remove('hidden');
    } else {
        creditCardForm.classList.add('hidden');
    }
}

// 处理省份选择变化
function handleProvinceChange() {
    const province = document.getElementById('province').value;
    const citySelect = document.getElementById('city');
    
    // 清空城市选项
    citySelect.innerHTML = '<option value="">请选择城市</option>';
    
    // 根据省份动态生成城市选项
    const cityMap = {
        '北京市': ['东城区', '西城区', '朝阳区', '海淀区', '丰台区', '石景山区'],
        '上海市': ['黄浦区', '徐汇区', '长宁区', '静安区', '普陀区', '虹口区'],
        '广东省': ['广州市', '深圳市', '东莞市', '佛山市', '珠海市', '汕头市'],
        '江苏省': ['南京市', '苏州市', '无锡市', '常州市', '徐州市', '南通市'],
        '浙江省': ['杭州市', '宁波市', '温州市', '嘉兴市', '湖州市', '绍兴市']
    };
    
    const cities = cityMap[province];
    if (cities) {
        cities.forEach(city => {
            const option = document.createElement('option');
            option.value = city;
            option.textContent = city;
            citySelect.appendChild(option);
        });
    }
}

// 应用优惠码
function applyCheckoutPromoCode() {
    const promoInput = document.getElementById('checkoutPromoInput');
    const promoMessage = document.getElementById('checkoutPromoMessage');
    const promoCode = promoInput.value.trim().toUpperCase();
    
    // 优惠码验证
    let discount = 0;
    let message = '';
    let messageClass = '';
    
    const validPromoCodes = {
        'SWEET20': 20,  // 立减20元
        'FIRSTORDER': 50  // 首单立减50元
    };
    
    if (!promoCode) {
        message = 'Введите промокод';
        messageClass = 'error';
    } else if (validPromoCodes[promoCode]) {
        discount = validPromoCodes[promoCode];
        message = `Промокод применен, скидка ${discount}¥`;
        messageClass = 'success';
        promoInput.setAttribute('data-discount', discount);
    } else {
        message = 'Неверный промокод';
        messageClass = 'error';
        promoInput.setAttribute('data-discount', 0);
    }
    
    // 显示消息
    promoMessage.textContent = message;
    promoMessage.className = `promo-message ${messageClass}`;
    
    // 重新计算订单摘要
    const cartItems = getCartItems();
    calculateOrderSummary(cartItems);
}

// 初始化表单验证
function initFormValidation() {
    const formFields = document.querySelectorAll('input[required], select[required], textarea[required]');
    formFields.forEach(field => {
        field.addEventListener('blur', validateField);
    });
}

// 验证单个字段
function validateField(event) {
    const field = event.target;
    const value = field.value.trim();
    const isRequired = field.hasAttribute('required');
    
    // 清除之前的错误信息
    const existingError = field.parentElement.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    let isValid = true;
    let errorMessage = '';
    
    // 必填字段验证
    if (isRequired && !value) {
        isValid = false;
        errorMessage = 'Это поле обязательно для заполнения';
    }
    
    // 邮箱验证
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Введите действительный адрес электронной почты';
        }
    }
    
    // 手机号验证
    if (field.id === 'phone' && value) {
        const phoneRegex = /^1[3-9]\d{9}$/;
        if (!phoneRegex.test(value)) {
            isValid = false;
            errorMessage = 'Введите действительный номер телефона';
        }
    }
    
    // 显示错误信息
    if (!isValid) {
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = errorMessage;
        errorElement.style.color = '#ff6b6b';
        errorElement.style.fontSize = '12px';
        errorElement.style.marginTop = '5px';
        field.parentElement.appendChild(errorElement);
    }
    
    return isValid;
}

// 验证整个表单
function validateForm() {
    const formFields = document.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    formFields.forEach(field => {
        // 触发blur事件进行验证
        field.dispatchEvent(new Event('blur'));
        
        // 检查是否有错误信息
        const hasError = field.parentElement.querySelector('.error-message') !== null;
        if (hasError) {
            isValid = false;
        }
    });
    
    return isValid;
}

// 处理提交订单
function handlePlaceOrder() {
    // 验证表单
    if (!validateForm()) {
        showNotification('Пожалуйста, заполните все поля формы', 'error');
        return;
    }
    
    // 获取订单信息
    const orderInfo = collectOrderInfo();
    
    // 模拟提交订单（在实际项目中，这里会发送AJAX请求到服务器）
    simulatePlaceOrder(orderInfo);
}

// 收集订单信息
function collectOrderInfo() {
    const cartItems = getCartItems();
    const { subtotal, shipping, discount, total } = calculateOrderSummary(cartItems);
    
    return {
        personalInfo: {
            fullName: document.getElementById('fullName').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            email: document.getElementById('email').value.trim()
        },
        address: {
            province: document.getElementById('province').value,
            city: document.getElementById('city').value,
            address: document.getElementById('address').value.trim(),
            postalCode: document.getElementById('postalCode').value.trim(),
            addressType: document.getElementById('addressType').value
        },
        delivery: {
            method: document.querySelector('input[name="delivery"]:checked').value,
            notes: document.getElementById('deliveryNotes').value.trim()
        },
        payment: {
            method: document.querySelector('input[name="payment"]:checked').value
        },
        orderDetails: {
            items: cartItems,
            subtotal,
            shipping,
            discount,
            total,
            promoCode: document.getElementById('checkoutPromoInput').value.trim()
        },
        timestamp: new Date().toISOString()
    };
}

// 模拟提交订单
function simulatePlaceOrder(orderInfo) {
    // 显示加载状态
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    const originalText = placeOrderBtn.textContent;
    placeOrderBtn.disabled = true;
    placeOrderBtn.textContent = 'Отправка...';
    
    // 模拟API请求延迟
    setTimeout(() => {
        // 保存订单信息（在实际项目中会发送到服务器）
        localStorage.setItem('lastOrder', JSON.stringify(orderInfo));
        
        // 清空购物车
        localStorage.removeItem('dessertCart');
        
        // 显示成功通知
        showNotification('Заказ успешно оформлен! Вы будете перенаправлены на страницу подтверждения', 'success');
        
        // 延迟跳转到确认页面
        setTimeout(() => {
            // 在实际项目中，这里会跳转到订单确认页面
            alert('Заказ успешно оформлен! Номер заказа: ' + generateOrderNumber());
            // 跳转到首页
            window.location.href = 'index.html';
        }, 2000);
    }, 1500);
}

// 生成订单号
function generateOrderNumber() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${year}${month}${day}${random}`;
}

// 显示通知
function showNotification(message, type = 'info') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // 设置样式
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.padding = '15px 20px';
    notification.style.borderRadius = '4px';
    notification.style.color = 'white';
    notification.style.fontWeight = '500';
    notification.style.zIndex = '10000';
    notification.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    notification.style.animation = 'slideIn 0.3s ease-out';
    
    // 根据类型设置背景色
    if (type === 'success') {
        notification.style.backgroundColor = '#4caf50';
    } else if (type === 'error') {
        notification.style.backgroundColor = '#ff6b6b';
    } else {
        notification.style.backgroundColor = '#2196f3';
    }
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 自动移除
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// 更新导航栏购物车计数
function updateCartCount() {
    const cartCountElement = document.getElementById('cartCount');
    if (!cartCountElement) return;
    
    const cartItems = getCartItems();
    const totalCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    
    cartCountElement.textContent = totalCount;
    
    // 根据数量显示或隐藏计数
    if (totalCount === 0) {
        cartCountElement.style.display = 'none';
    } else {
        cartCountElement.style.display = 'block';
    }
}

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', initCheckout);