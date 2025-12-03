// 页面加载完成后执行
 document.addEventListener('DOMContentLoaded', function() {
    // 为所有导航链接添加悬停效果
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });

    // 为所有按钮添加点击效果
    const buttons = document.querySelectorAll('button, .category-button');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
        });
    });

    // 添加页面滚动动画
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // 为页面元素添加动画类
    const animatedElements = document.querySelectorAll('.category-card, .usp-item, .product-card, .promotion-item');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });

    // 促销横幅动画效果
    const promoBanner = document.querySelector('.promo-banner');
    if (promoBanner) {
        promoBanner.classList.add('pulse-effect');
    }

    // 处理促销按钮点击
    const promoButton = document.querySelector('.promo-button');
    if (promoButton) {
        promoButton.addEventListener('click', function() {
            window.location.href = 'promotions.html';
        });
    }

    // 处理订单按钮点击
    const orderButtons = document.querySelectorAll('.order-button');
    orderButtons.forEach(button => {
        button.addEventListener('click', function() {
            alert('Спасибо за ваш интерес! В данный момент функция заказа в разработке.');
        });
    });
});

// 商品价格格式化函数
function formatPrice(price) {
    return price.toLocaleString('ru-RU') + ' ₽';
}

// 添加到购物车功能
function addToCart(productName) {
    alert(`Вы добавили ${productName} в корзину!`);
    // 这里可以实现实际的购物车功能
}