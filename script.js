// --- بيانات المنتجات ---
const products = {
    hot: [
        { name: "فلات وايت", price: 75, img: "images/hot1.jpg" },
        { name: "فانيلا لاتيه ساخن", price: 80, img: "images/hot2.jpg" },
        { name: "موكا ساخن", price: 80, img: "images/hot3.png" },
        { name: "لاتيه ساخن" , price: 70, img: "images/hot4.png" },
        { name: "كابتشينو", price: 75, img: "images/hot5.png" },
        { name: "سبانيش لاتيه ساخن", price: 85, img: "images/hot6.jpg" },
        { name: "لاتيه بندق", price: 85, img: "images/hot7.jpg" },
        { name: "امريكانو", price: 55, img: "images/hot8.png" },
        { name: "إسبريسو", price: 45, img: "images/hot9.png" },
        { name: "قهوة تركي", price: 50, img: "images/hot10.png" }
    ],
    cold: [
        { name: "آيس توفي لاتيه", price: 95, img: "images/cold1.jpg" },
        { name: "بندق فراييه", price: 100, img: "images/cold2.jpg" },
        { name: "آيس كراميل ماكياتو", price: 90, img: "images/cold3.png" },
        { name: "آيس أمريكانو", price: 60, img: "images/cold4.jpg" },
        { name: "سولتد كراميل فرابيه", price: 95, img: "images/cold5.jpg" },
        { name: "إسبريسو تونيك", price: 70, img: "images/cold6.png" },
        { name: "آيس فانيلا لاتيه", price: 80, img: "images/cold7.jpg" },
        { name: "آيس لاتيه", price: 75, img: "images/cold8.jpg" },
        { name: "آيس سبانيش لاتيه", price: 80, img: "images/cold9.jpg" },
        { name: "كراميل فرابتشينو", price: 95, img: "images/cold10.jpg" }
    ],
    juices: [
        { name: "عصير فراولة", price: 70, img: "images/juice1.jpg" },
        { name: "عصير مشمش", price: 75, img: "images/juice2.png" },
        { name: "عصير توت", price: 110, img: "images/juice3.png" }, 
        { name: "عصير بطيخ", price: 70, img: "images/juice4.png" },
        { name: "عصير موز", price: 65, img: "images/juice5.png" },
        { name: "عصير جوافة", price: 60, img: "images/juice6.png" },
        { name: "عصير رومان", price: 90, img: "images/juice7.png" },
        { name: "عصير مانجو", price: 65, img: "images/juice8.png" },
        { name: "عصير تفاح", price: 75, img: "images/juice9.png" },
        { name: "عصير خوخ", price: 80, img: "images/juice10.png" }
    ],
    drinks: [
        { name: "موهيتو فراولة", price: 80, img: "images/drink1.jpg" },
        { name: "باشن فروت موهيتو", price: 90, img: "images/drink2.jpg" },
        { name: "ليمونادة فراولة", price: 80, img: "images/drink3.jpg" },
        { name: "موهيتو خوخ", price: 90, img: "images/drink4.jpg" },
        { name: "آيس تي ليمون", price: 75, img: "images/drink5.jpg" },
        { name: "موهيتو بطيخ", price: 85, img: "images/drink6.jpg" },
        { name:"آيس ماتشا لاتيه", price: 120, img: "images/drink7.png" },
        { name: "هوت شوكليت", price: 90, img: "images/drink8.jpg" },
        { name: "شاي أحمر", price: 45, img: "images/drink9.jpg" },
        { name: "شاي بالنعناع", price: 50, img: "images/drink10.jpg" }
    ]
};

// --- الحالة ---
let cart = [];
let favorites = JSON.parse(localStorage.getItem('coffeeFavs')) || [];

document.addEventListener('DOMContentLoaded', () => {
    renderSection('hot-grid', products.hot);
    renderSection('cold-grid', products.cold);
    renderSection('juice-grid', products.juices);
    renderSection('drink-grid', products.drinks);
    updateFavHeader();
});

// --- عرض المنتجات ---
function renderSection(id, items) {
    const container = document.getElementById(id);
    items.forEach(item => {
        container.appendChild(createProductCard(item));
    });
}

// دالة مساعدة لإنشاء كارت المنتج (عشان نستخدمها في البحث كمان)
function createProductCard(item) {
    const isFav = favorites.includes(item.name);
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <button class="card-fav-btn ${isFav ? 'active' : ''}" onclick="toggleFav(this, '${item.name}')">
            <i class="${isFav ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
        </button>
        <img src="${item.img}" alt="${item.name}">
        <div class="card-info">
            <h3>${item.name}</h3>
            <div class="price">${item.price} ج.م</div>
            <button class="add-to-cart" onclick="addToCart('${item.name}', ${item.price}, '${item.img}')">
                إضافة للسلة <i class="fa-solid fa-plus"></i>
            </button>
        </div>
    `;
    return card;
}

// --- البحث (Search Logic) ---
function toggleSearch() {
    const overlay = document.getElementById('search-overlay');
    overlay.classList.toggle('active');
    
    if(overlay.classList.contains('active')) {
        document.getElementById('search-input').focus();
    } else {
        // تفريغ البحث عند الإغلاق
        document.getElementById('search-input').value = '';
        document.getElementById('search-results').innerHTML = '';
    }
}

// تفعيل البحث عند الكتابة
document.getElementById('search-input').addEventListener('input', function(e) {
    const term = e.target.value.toLowerCase().trim();
    const resultsContainer = document.getElementById('search-results');
    resultsContainer.innerHTML = ''; // مسح النتائج القديمة

    if(term.length < 2) return; // ابدأ البحث بعد حرفين

    // تجميع كل المنتجات في مصفوفة واحدة
    const allProducts = [...products.hot, ...products.cold, ...products.juices, ...products.drinks];
    
    // فلترة المنتجات حسب الاسم
    const filteredProducts = allProducts.filter(product => product.name.includes(term));

    if(filteredProducts.length === 0) {
        resultsContainer.innerHTML = '<p style="text-align:center;width:100%;color:#666;">لا توجد نتائج مطابقة</p>';
    } else {
        filteredProducts.forEach(item => {
            resultsContainer.appendChild(createProductCard(item));
        });
    }
});

// --- باقي الدوال (المفضلة والسلة والقوائم) ---
function toggleFav(btn, name) {
    const icon = btn.querySelector('i');
    if (favorites.includes(name)) {
        favorites = favorites.filter(n => n !== name);
        btn.classList.remove('active');
        icon.classList.replace('fa-solid', 'fa-regular');
    } else {
        favorites.push(name);
        btn.classList.add('active');
        icon.classList.replace('fa-regular', 'fa-solid');
    }
    localStorage.setItem('coffeeFavs', JSON.stringify(favorites));
    updateFavHeader();
    renderFavDrawer();
}

function updateFavHeader() {
    document.getElementById('fav-count').textContent = favorites.length;
}

function renderFavDrawer() {
    const container = document.getElementById('fav-items-container');
    container.innerHTML = '';
    
    if (favorites.length === 0) {
        container.innerHTML = '<div class="empty-msg">لم تختر مفضلات بعد 💔</div>';
        return;
    }

    const all = [...products.hot, ...products.cold, ...products.juices, ...products.drinks];
    
    favorites.forEach(name => {
        const item = all.find(p => p.name === name);
        if(item) {
            container.innerHTML += `
                <div class="drawer-item">
                    <img src="${item.img}">
                    <div style="flex:1">
                        <h4>${item.name}</h4>
                        <p>${item.price} ج.م</p>
                    </div>
                    <button onclick="addToCart('${item.name}', ${item.price}, '${item.img}')" style="border:none;background:none;cursor:pointer;color:#4E342E;margin-left:10px;">
                        <i class="fa-solid fa-cart-plus fa-lg"></i>
                    </button>
                </div>
            `;
        }
    });
}

function addToCart(name, price, img) {
    cart.push({ name, price, img });
    updateCartDrawer();
    toggleCart(); 
}

function updateCartDrawer() {
    const container = document.getElementById('cart-items-container');
    const totalSpan = document.getElementById('cart-total');
    const countSpan = document.getElementById('cart-count');
    
    container.innerHTML = '';
    let total = 0;
    
    if (cart.length === 0) {
        container.innerHTML = '<div class="empty-msg">السلة فارغة حالياً</div>';
    } else {
        cart.forEach((item, index) => {
            total += item.price;
            container.innerHTML += `
                <div class="drawer-item">
                    <img src="${item.img}">
                    <div style="flex:1">
                        <h4>${item.name}</h4>
                        <p>${item.price} ج.م</p>
                    </div>
                    <div class="remove-item" onclick="removeFromCart(${index})">
                        <i class="fa-solid fa-trash"></i>
                    </div>
                </div>
            `;
        });
    }
    
    countSpan.textContent = cart.length;
    totalSpan.textContent = total + ' ج.م';
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartDrawer();
}

function toggleCart() {
    document.getElementById('cart-drawer').classList.toggle('open');
    document.querySelector('.cart-overlay').classList.toggle('open');
    document.getElementById('fav-drawer').classList.remove('open');
    document.querySelector('nav').classList.remove('active');
}

function toggleFavDrawer() {
    renderFavDrawer();
    document.getElementById('fav-drawer').classList.toggle('open');
    document.querySelector('.cart-overlay').classList.toggle('open');
    document.getElementById('cart-drawer').classList.remove('open');
    document.querySelector('nav').classList.remove('active');
}

function closeAllDrawers() {
    document.getElementById('cart-drawer').classList.remove('open');
    document.getElementById('fav-drawer').classList.remove('open');
    document.querySelector('.cart-overlay').classList.remove('open');
    document.querySelector('nav').classList.remove('active');
    document.getElementById('search-overlay').classList.remove('active'); // إغلاق البحث أيضاً
}

function toggleMenu() {
    const nav = document.querySelector('nav');
    nav.classList.toggle('active');
    document.getElementById('cart-drawer').classList.remove('open');
    document.getElementById('fav-drawer').classList.remove('open');
    document.querySelector('.cart-overlay').classList.remove('open');
}