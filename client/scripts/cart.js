
        // Cart Data
        let cartItems = [
            {
                id: 1,
                name: "Silk Shirt",
                image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
                size: "M",
                color: "Ivory",
                code: "SV-SS01",
                quantity: 1,
                price: 22499,
                originalPrice: 24999,
                badge: "BESTSELLER",
                available: true
            },
            {
                id: 2,
                name: "Tailored Trousers",
                image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
                size: "32",
                color: "Charcoal",
                code: "SV-TT02",
                quantity: 1,
                price: 29699,
                originalPrice: 32999,
                badge: "NEW",
                available: true
            },
            {
                id: 3,
                name: "Cashmere Sweater",
                image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
                size: "L",
                color: "Camel",
                code: "SV-CS03",
                quantity: 1,
                price: 34199,
                originalPrice: 37999,
                badge: "LIMITED",
                available: true
            }
        ];

        // Delivery Information Storage
        let deliveryInfo = {
            name: "John Doe",
            phone: "+91 98765 43210",
            email: "john@example.com",
            address: "123, Main Street, Mumbai",
            pincode: "400001",
            city: "Mumbai",
            state: "Maharashtra"
        };

        // Initialize cart
        function initializeCart() {
            renderCartItems();
            updateDeliveryDisplay();
            updateDeliveryDisplayMobile();
            updateCartCount();
            updateOrderSummary();
            updateMobileShippingNote();
        }

        // Render cart items with improved UI
        function renderCartItems() {
            const cartItemsContainer = document.getElementById('cartItems');
            const itemCount = document.getElementById('itemCount');
            const summaryItemCount = document.getElementById('summaryItemCount');
            
            if (cartItems.length === 0) {
                cartItemsContainer.innerHTML = `
                    <div class="empty-cart">
                        <div class="empty-icon">
                            <i class="fas fa-shopping-bag"></i>
                        </div>
                        <h3 class="empty-title">Your cart is empty</h3>
                        <p class="empty-text">Browse our premium collection to find timeless pieces that elevate your style</p>
                        <button class="continue-btn" onclick="window.location.href='collection.html'">BROWSE COLLECTION</button>
                    </div>
                `;
                itemCount.textContent = '0';
                summaryItemCount.textContent = '0 ITEMS';
                document.getElementById('checkoutBtn').disabled = true;
                return;
            }

            itemCount.textContent = cartItems.length;
            summaryItemCount.textContent = `${cartItems.length} ITEMS`;
            document.getElementById('checkoutBtn').disabled = false;

            cartItemsContainer.innerHTML = cartItems.map(item => `
                <div class="cart-item" data-id="${item.id}">
                    <div class="item-image" style="background-image: url('${item.image}')">
                        ${item.badge ? `<span class="item-badge">${item.badge}</span>` : ''}
                    </div>
                    <div class="item-details">
                        <h3 class="item-title">${item.name}</h3>
                        <p class="item-meta">Size: ${item.size} • Color: ${item.color}</p>
                        <p class="item-meta">Product Code: ${item.code}</p>
                        ${item.available ? 
                            `<div class="item-availability">
                                <span class="availability-dot"></span>
                                <span>In Stock • Ready to Ship</span>
                            </div>` :
                            `<div class="item-availability" style="color: var(--error);">
                                <span class="availability-dot" style="background: var(--error);"></span>
                                <span>Out of Stock</span>
                            </div>`
                        }
                    </div>
                    <div class="item-controls-container">
                        <div class="quantity-control">
                            <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">−</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                        </div>
                        <div class="item-price-section">
                            <div class="price-row">
                                <span class="current-price">₹${formatCurrency(item.price * item.quantity)}</span>
                                ${item.originalPrice > item.price ? 
                                    `<span class="original-price">₹${formatCurrency(item.originalPrice * item.quantity)}</span>` : 
                                    ''
                                }
                            </div>
                        </div>
                        <button class="remove-btn" onclick="removeItem(${item.id})">
                            <i class="fas fa-trash-alt"></i> REMOVE
                        </button>
                    </div>
                </div>
            `).join('');
        }

        // Update quantity
        function updateQuantity(itemId, change) {
            const item = cartItems.find(item => item.id === itemId);
            if (!item) return;

            const newQuantity = item.quantity + change;
            if (newQuantity < 1) {
                removeItem(itemId);
                return;
            }
            if (newQuantity > 10) {
                showToast('Maximum quantity is 10', 'error');
                return;
            }

            item.quantity = newQuantity;
            renderCartItems();
            updateOrderSummary();
            updateMobileShippingNote();
            showToast('Quantity updated', 'success');
        }

        // Remove item from cart
        function removeItem(itemId) {
            cartItems = cartItems.filter(item => item.id !== itemId);
            renderCartItems();
            updateOrderSummary();
            updateCartCount();
            updateMobileShippingNote();
            showToast('Item removed from cart', 'success');
        }

        // Save for later
        function saveForLater() {
            if (cartItems.length === 0) {
                showToast('Your cart is empty', 'error');
                return;
            }
            showToast('Items saved for later', 'success');
        }

        // Clear cart
        function clearCart() {
            if (cartItems.length === 0) {
                showToast('Your cart is already empty', 'error');
                return;
            }

            if (confirm('Are you sure you want to clear your cart?')) {
                cartItems = [];
                renderCartItems();
                updateOrderSummary();
                updateCartCount();
                updateMobileShippingNote();
                localStorage.removeItem('appliedCoupon');
                document.getElementById('couponMessage').style.display = 'none';
                document.getElementById('couponMessageMobile').style.display = 'none';
                document.getElementById('couponCode').value = '';
                document.getElementById('couponCodeMobile').value = '';
                showToast('Cart cleared', 'success');
            }
        }

        // Update cart count in navigation
        function updateCartCount() {
            const cartCount = document.querySelector('.cart-count');
            const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
        }

        // Update order summary
        function updateOrderSummary() {
            let subtotal = 0;
            cartItems.forEach(item => {
                subtotal += item.price * item.quantity;
            });
            
            let discount = 0;
            const appliedCoupon = localStorage.getItem('appliedCoupon');
            if (appliedCoupon) {
                discount = calculateDiscount(subtotal, appliedCoupon);
            }
            
            const shipping = subtotal > 5000 ? 0 : 499;
            const tax = (subtotal - discount) * 0.18;
            const total = subtotal - discount + shipping + tax;
            
            document.getElementById('subtotal').textContent = '₹' + formatCurrency(subtotal);
            document.getElementById('shipping').textContent = shipping === 0 ? 'FREE' : '₹' + formatCurrency(shipping);
            document.getElementById('tax').textContent = '₹' + formatCurrency(tax);
            
            const discountRow = document.getElementById('discount-row');
            const discountValue = document.getElementById('discount-value');
            
            if (discount > 0) {
                discountRow.style.display = 'flex';
                discountValue.textContent = '−₹' + formatCurrency(discount);
            } else {
                discountRow.style.display = 'none';
            }
            
            document.getElementById('total').textContent = '₹' + formatCurrency(total);
        }

        // Update mobile shipping note visibility
        function updateMobileShippingNote() {
            const subtotal = calculateSubtotal();
            const mobileShippingNote = document.querySelector('.shipping-note-mobile');
            if (mobileShippingNote) {
                if (subtotal > 5000) {
                    mobileShippingNote.style.display = 'flex';
                } else {
                    mobileShippingNote.style.display = 'none';
                }
            }
        }

        // Calculate subtotal
        function calculateSubtotal() {
            return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        }

        function formatCurrency(amount) {
            return amount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }

        // Coupon system - Desktop
        function applyCoupon() {
            const couponCode = document.getElementById('couponCode').value.trim().toUpperCase();
            const couponMessage = document.getElementById('couponMessage');
            const applyBtn = document.getElementById('applyCouponBtn');
            
            processCouponApplication(couponCode, couponMessage, applyBtn);
        }

        // Coupon system - Mobile
        function applyCouponMobile() {
            const couponCode = document.getElementById('couponCodeMobile').value.trim().toUpperCase();
            const couponMessage = document.getElementById('couponMessageMobile');
            const applyBtn = document.getElementById('applyCouponBtnMobile');
            
            processCouponApplication(couponCode, couponMessage, applyBtn);
        }

        // Common coupon processing function
        function processCouponApplication(couponCode, couponMessage, applyBtn) {
            // Show loading state
            const originalText = applyBtn.textContent;
            applyBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            applyBtn.disabled = true;
            
            setTimeout(() => {
                if (!couponCode) {
                    couponMessage.textContent = 'Please enter a coupon code';
                    couponMessage.className = 'coupon-message error';
                    applyBtn.textContent = originalText;
                    applyBtn.disabled = false;
                    return;
                }
                
                if (cartItems.length === 0) {
                    couponMessage.textContent = 'Your cart is empty';
                    couponMessage.className = 'coupon-message error';
                    applyBtn.textContent = originalText;
                    applyBtn.disabled = false;
                    return;
                }
                
                // Calculate subtotal
                let subtotal = 0;
                cartItems.forEach(item => {
                    subtotal += item.price * item.quantity;
                });
                
                // Validate coupon
                const validation = validateCoupon(couponCode, subtotal);
                
                if (validation.valid) {
                    // Save coupon to localStorage
                    localStorage.setItem('appliedCoupon', couponCode);
                    
                    // Update both desktop and mobile messages
                    document.getElementById('couponMessage').textContent = validation.message;
                    document.getElementById('couponMessage').className = 'coupon-message success';
                    document.getElementById('couponMessageMobile').textContent = validation.message;
                    document.getElementById('couponMessageMobile').className = 'coupon-message success';
                    
                    // Sync coupon code in both inputs
                    document.getElementById('couponCode').value = couponCode;
                    document.getElementById('couponCodeMobile').value = couponCode;
                    
                    // Update order summary
                    updateOrderSummary();
                    
                    // Show success toast
                    showToast('Coupon applied successfully!', 'success');
                } else {
                    couponMessage.textContent = validation.message;
                    couponMessage.className = 'coupon-message error';
                    
                    // Clear invalid coupon from localStorage
                    localStorage.removeItem('appliedCoupon');
                    updateOrderSummary();
                }
                
                // Restore button
                applyBtn.textContent = originalText;
                applyBtn.disabled = false;
            }, 500);
        }

        function validateCoupon(code, subtotal) {
            const validCoupons = {
                'SOULVARD10': {
                    minAmount: 10000,
                    discount: 0.10,
                    message: '10% discount applied!'
                },
                'SOULVARD15': {
                    minAmount: 50000,
                    discount: 0.15,
                    message: '15% discount applied!'
                },
                'WELCOME': {
                    minAmount: 0,
                    discount: 0.20,
                    message: '20% welcome discount applied!'
                },
                'FREESHIP': {
                    minAmount: 0,
                    discount: 0,
                    shippingFree: true,
                    message: 'Free shipping applied!'
                },
                'SUMMER25': {
                    minAmount: 30000,
                    discount: 0.25,
                    message: '25% summer discount applied!'
                }
            };
            
            if (!validCoupons[code]) {
                return { 
                    valid: false, 
                    message: 'Invalid coupon code. Try SOULVARD10, WELCOME, or SUMMER25' 
                };
            }
            
            const coupon = validCoupons[code];
            
            if (subtotal < coupon.minAmount) {
                return { 
                    valid: false, 
                    message: `Minimum order of ₹${formatCurrency(coupon.minAmount)} required for this coupon` 
                };
            }
            
            return { 
                valid: true, 
                message: coupon.message,
                coupon: coupon 
            };
        }

        function calculateDiscount(subtotal, couponCode) {
            const validCoupons = {
                'SOULVARD10': { discount: 0.10 },
                'SOULVARD15': { discount: 0.15 },
                'WELCOME': { discount: 0.20 },
                'FREESHIP': { discount: 0, shippingFree: true },
                'SUMMER25': { discount: 0.25 }
            };
            
            if (validCoupons[couponCode] && validCoupons[couponCode].discount > 0) {
                return subtotal * validCoupons[couponCode].discount;
            }
            
            return 0;
        }

        // Delivery Information Modal Functions
        function openDeliveryModal() {
            const modal = document.getElementById('deliveryModal');
            
            // Fill form with current data
            document.getElementById('editName').value = deliveryInfo.name;
            document.getElementById('editPhone').value = deliveryInfo.phone;
            document.getElementById('editEmail').value = deliveryInfo.email;
            document.getElementById('editAddress').value = deliveryInfo.address;
            document.getElementById('editPincode').value = deliveryInfo.pincode;
            document.getElementById('editCity').value = deliveryInfo.city;
            document.getElementById('editState').value = deliveryInfo.state;
            
            // Show modal
            modal.classList.add('active');
            document.body.classList.add('modal-open');
        }

        function closeDeliveryModal() {
            const modal = document.getElementById('deliveryModal');
            modal.classList.remove('active');
            document.body.classList.remove('modal-open');
        }

        function saveDeliveryInfo(event) {
            event.preventDefault();
            
            // Get form values
            deliveryInfo = {
                name: document.getElementById('editName').value.trim(),
                phone: document.getElementById('editPhone').value.trim(),
                email: document.getElementById('editEmail').value.trim(),
                address: document.getElementById('editAddress').value.trim(),
                pincode: document.getElementById('editPincode').value.trim(),
                city: document.getElementById('editCity').value.trim(),
                state: document.getElementById('editState').value.trim()
            };
            
            // Update both desktop and mobile displays
            updateDeliveryDisplay();
            updateDeliveryDisplayMobile();
            
            // Close modal
            closeDeliveryModal();
            
            // Show success message
            showToast('Delivery information updated successfully!', 'success');
        }

        function updateDeliveryDisplay() {
            const deliveryInfoElement = document.getElementById('deliveryInfo');
            
            deliveryInfoElement.innerHTML = `
                <div class="info-row">
                    <span class="info-label">Name:</span>
                    <span class="info-value">${deliveryInfo.name}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Phone:</span>
                    <span class="info-value">${deliveryInfo.phone}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Email:</span>
                    <span class="info-value">${deliveryInfo.email}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Address:</span>
                    <span class="info-value">${deliveryInfo.address}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Pincode:</span>
                    <span class="info-value">${deliveryInfo.pincode}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">City, State:</span>
                    <span class="info-value">${deliveryInfo.city}, ${deliveryInfo.state}</span>
                </div>
            `;
        }

        function updateDeliveryDisplayMobile() {
            const deliveryInfoElement = document.getElementById('deliveryInfoMobile');
            
            deliveryInfoElement.innerHTML = `
                <div class="info-row">
                    <span class="info-label">Name:</span>
                    <span class="info-value">${deliveryInfo.name}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Phone:</span>
                    <span class="info-value">${deliveryInfo.phone}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Email:</span>
                    <span class="info-value">${deliveryInfo.email}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Address:</span>
                    <span class="info-value">${deliveryInfo.address}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Pincode:</span>
                    <span class="info-value">${deliveryInfo.pincode}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">City, State:</span>
                    <span class="info-value">${deliveryInfo.city}, ${deliveryInfo.state}</span>
                </div>
            `;
        }

        // Proceed to checkout
        function proceedToCheckout() {
            if (cartItems.length === 0) {
                showToast('Your cart is empty', 'error');
                return;
            }

            // Check if delivery info is complete
            if (!deliveryInfo.email.includes('@')) {
                showToast('Please update delivery information before checkout', 'error');
                openDeliveryModal();
                return;
            }

            // Simulate checkout process
            const checkoutBtn = document.getElementById('checkoutBtn');
            checkoutBtn.disabled = true;
            checkoutBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> PROCESSING...';

            setTimeout(() => {
                showToast('Redirecting to payment gateway...', 'success');
                // In real app, this would redirect to payment page
                setTimeout(() => {
                    // Reset button state (in real app, this would redirect)
                    checkoutBtn.disabled = false;
                    checkoutBtn.innerHTML = '<i class="fas fa-lock"></i> PROCEED TO CHECKOUT';
                    // For demo purposes, we'll just show a message
                    showToast('Checkout functionality would redirect to payment page in a real application', 'success');
                }, 1000);
            }, 1500);
        }

        // Show toast notification
        function showToast(message, type = 'success') {
            const toast = document.getElementById('toast');
            toast.textContent = message;
            toast.className = 'toast';
            toast.classList.add(type);
            toast.classList.add('show');
            
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }

        // Initialize
        document.addEventListener('DOMContentLoaded', function() {
            initializeCart();
            
            // Load saved coupon if exists
            const savedCoupon = localStorage.getItem('appliedCoupon');
            if (savedCoupon) {
                document.getElementById('couponCode').value = savedCoupon;
                document.getElementById('couponCodeMobile').value = savedCoupon;
                // Trigger coupon validation
                setTimeout(() => applyCoupon(), 100);
            }
            
            // Add enter key support for coupon inputs
            document.getElementById('couponCode').addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    applyCoupon();
                }
            });
            
            document.getElementById('couponCodeMobile').addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    applyCouponMobile();
                }
            });
            
            // Navbar scroll effect
            window.addEventListener('scroll', function() {
                const navbar = document.querySelector('nav');
                if (window.scrollY > 50) {
                    navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.08)';
                } else {
                    navbar.style.boxShadow = 'none';
                }
            });

            // Close modal when clicking outside
            document.getElementById('deliveryModal').addEventListener('click', function(e) {
                if (e.target === this) {
                    closeDeliveryModal();
                }
            });

            // Close modal with Escape key
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    closeDeliveryModal();
                }
            });

            // Window resize handler to update mobile elements
            window.addEventListener('resize', function() {
                updateMobileShippingNote();
            });
        });
