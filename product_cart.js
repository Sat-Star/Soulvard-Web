
        // Product Data with Color Variants
        const product = {
            id: 1,
            name: "Duo Moqueen x Sally Tees",
            price: 3599,
            mrp: 4999,
            category: "couple-tshirts",
            colors: [
                {
                    name: "Black",
                    value: "black",
                    hex: "#1a1a1a",
                    images: [
                        "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
                        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
                        "https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
                        "https://images.unsplash.com/photo-1513531926349-466f15ec8cc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80"
                    ]
                },
                {
                    name: "White",
                    value: "white",
                    hex: "#ffffff",
                    images: [
                        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
                        "https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
                        "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
                        "https://images.unsplash.com/photo-1513531926349-466f15ec8cc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80"
                    ]
                },
                {
                    name: "Navy Blue",
                    value: "navy",
                    hex: "#003366",
                    images: [
                        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
                        "https://images.unsplash.com/photo-1544441893-675973e31985?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
                        "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
                        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80"
                    ]
                },
                {
                    name: "Grey",
                    value: "grey",
                    hex: "#808080",
                    images: [
                        "https://images.unsplash.com/photo-1544441893-675973e31985?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
                        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
                        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
                        "https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80"
                    ]
                }
            ],
            sizes: [
                { size: "S", inStock: true },
                { size: "M", inStock: true },
                { size: "L", inStock: true },
                { size: "XL", inStock: true },
                { size: "XXL", inStock: false }
            ]
        };

        // State variables
        let selectedColor = product.colors[0]; // Default to first color
        let selectedSize = "S";
        let quantity = 1;
        let cartCount = parseInt(localStorage.getItem('cartCount')) || 0;
        let wishlistCount = parseInt(localStorage.getItem('wishlistCount')) || 0;
        let isProductInWishlist = localStorage.getItem('productInWishlist') === 'true';

        // Initialize the page
        document.addEventListener('DOMContentLoaded', function() {
            updateCartCount();
            updateWishlistCount();
            setupEventListeners();
            setupNavScroll();
            updateProductWishlistButton();
            
            // Generate color options
            generateColorOptions();
            
            // Generate size options
            generateSizeOptions();
            
            // Initialize thumbnails with first color's images
            updateThumbnails();
        });

        // Generate color options
        function generateColorOptions() {
            const colorOptionsContainer = document.getElementById('colorOptions');
            colorOptionsContainer.innerHTML = '';
            
            product.colors.forEach(color => {
                const colorItem = document.createElement('div');
                colorItem.className = 'color-item';
                
                const colorOption = document.createElement('div');
                colorOption.className = `color-option ${color.value === selectedColor.value ? 'selected' : ''}`;
                colorOption.style.backgroundColor = color.hex;
                colorOption.setAttribute('data-color', color.value);
                
                // Add border for white color to make it visible
                if (color.value === 'white') {
                    colorOption.style.border = '1px solid #e0e0e0';
                }
                
                colorOption.addEventListener('click', () => selectColor(color));
                
                const colorName = document.createElement('div');
                colorName.className = 'color-name';
                colorName.textContent = color.name;
                
                colorItem.appendChild(colorOption);
                colorItem.appendChild(colorName);
                colorOptionsContainer.appendChild(colorItem);
            });
        }

        // Generate size options
        function generateSizeOptions() {
            const sizeOptionsContainer = document.getElementById('sizeOptions');
            sizeOptionsContainer.innerHTML = '';
            
            product.sizes.forEach(size => {
                const sizeOption = document.createElement('div');
                sizeOption.className = `size-option ${size.size === selectedSize ? 'selected' : ''} ${!size.inStock ? 'out-of-stock' : ''}`;
                sizeOption.textContent = size.size;
                sizeOption.setAttribute('data-size', size.size);
                
                if (size.inStock) {
                    sizeOption.addEventListener('click', () => selectSize(size.size));
                }
                
                sizeOptionsContainer.appendChild(sizeOption);
            });
        }

        // Select color
        function selectColor(color) {
            selectedColor = color;
            
            // Update UI
            document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('selected'));
            event.currentTarget.classList.add('selected');
            
            // Update product images
            updateProductImages();
            
            // Show notification
            showNotification(`Color changed to ${color.name}`);
        }

        // Select size
        function selectSize(size) {
            selectedSize = size;
            
            // Update UI
            document.querySelectorAll('.size-option:not(.out-of-stock)').forEach(opt => opt.classList.remove('selected'));
            event.currentTarget.classList.add('selected');
        }

        // Update product images based on selected color
        function updateProductImages() {
            // Update main image
            const mainImage = document.getElementById('mainImage');
            mainImage.style.backgroundImage = `url('${selectedColor.images[0]}')`;
            
            // Update thumbnails
            updateThumbnails();
            
            // Update zoom image if modal is open
            const zoomedImage = document.getElementById('zoomedImage');
            if (zoomedImage.src) {
                zoomedImage.src = selectedColor.images[0];
            }
        }

        // Update thumbnails
        function updateThumbnails() {
            const thumbnailContainer = document.getElementById('thumbnailContainer');
            thumbnailContainer.innerHTML = '';
            
            selectedColor.images.forEach((image, index) => {
                const thumbnail = document.createElement('div');
                thumbnail.className = `thumbnail ${index === 0 ? 'active' : ''}`;
                thumbnail.style.backgroundImage = `url('${image}')`;
                thumbnail.setAttribute('data-image', image);
                
                thumbnail.addEventListener('click', function() {
                    const imageUrl = this.getAttribute('data-image');
                    document.getElementById('mainImage').style.backgroundImage = `url('${imageUrl}')`;
                    
                    // Update active thumbnail
                    document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
                    this.classList.add('active');
                });
                
                thumbnailContainer.appendChild(thumbnail);
            });
        }

        // Set up event listeners
        function setupEventListeners() {
            // Tab switching
            document.querySelectorAll('.detail-tab').forEach(tab => {
                tab.addEventListener('click', function() {
                    const tabId = this.getAttribute('data-tab');
                    
                    // Update active tab
                    document.querySelectorAll('.detail-tab').forEach(t => t.classList.remove('active'));
                    this.classList.add('active');
                    
                    // Show corresponding content
                    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
                    document.getElementById(tabId + 'Tab').classList.add('active');
                });
            });

            // Image zoom
            document.getElementById('mainImage').addEventListener('click', function() {
                const currentImage = this.style.backgroundImage
                    .replace('url("', '')
                    .replace('")', '');
                document.getElementById('zoomedImage').src = currentImage;
                document.getElementById('imageZoomModal').classList.add('active');
                document.body.style.overflow = 'hidden';
            });

            // Quantity input
            document.getElementById('quantityInput').addEventListener('change', function() {
                quantity = parseInt(this.value) || 1;
                if (quantity < 1) quantity = 1;
                if (quantity > 10) quantity = 10;
                this.value = quantity;
            });
        }

        // Quantity controls
        function decreaseQuantity() {
            if (quantity > 1) {
                quantity--;
                document.getElementById('quantityInput').value = quantity;
            }
        }

        function increaseQuantity() {
            if (quantity < 10) {
                quantity++;
                document.getElementById('quantityInput').value = quantity;
            }
        }

        // Add to cart functionality
        function addToCart() {
            if (!selectedSize) {
                showNotification('Please select a size first');
                return;
            }

            // Check if selected size is in stock
            const sizeData = product.sizes.find(s => s.size === selectedSize);
            if (!sizeData || !sizeData.inStock) {
                showNotification('Selected size is out of stock');
                return;
            }

            // Create cart item
            const cartItem = {
                productId: product.id,
                name: product.name,
                price: product.price,
                size: selectedSize,
                color: selectedColor.name,
                colorValue: selectedColor.value,
                quantity: quantity,
                image: selectedColor.images[0],
                total: product.price * quantity
            };

            // Get existing cart from localStorage
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            
            // Check if item already exists in cart
            const existingItemIndex = cart.findIndex(item => 
                item.productId === cartItem.productId && 
                item.size === cartItem.size && 
                item.colorValue === cartItem.colorValue);
            
            if (existingItemIndex !== -1) {
                // Update quantity if item exists
                cart[existingItemIndex].quantity += quantity;
                cart[existingItemIndex].total = cart[existingItemIndex].price * cart[existingItemIndex].quantity;
            } else {
                // Add new item
                cart.push(cartItem);
            }
            
            // Save to localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Update cart count
            cartCount = cart.reduce((total, item) => total + item.quantity, 0);
            localStorage.setItem('cartCount', cartCount);
            updateCartCount();
            
            // Show success message
            showNotification(`${product.name} (${selectedColor.name}, Size: ${selectedSize}) added to cart!`);
        }

        // Buy now functionality
        function buyNow() {
            if (!selectedSize) {
                showNotification('Please select a size first');
                return;
            }

            const sizeData = product.sizes.find(s => s.size === selectedSize);
            if (!sizeData || !sizeData.inStock) {
                showNotification('Selected size is out of stock');
                return;
            }

            // Create order item
            const orderItem = {
                productId: product.id,
                name: product.name,
                price: product.price,
                size: selectedSize,
                color: selectedColor.name,
                colorValue: selectedColor.value,
                quantity: quantity,
                image: selectedColor.images[0],
                total: product.price * quantity
            };

            // Store order for checkout
            localStorage.setItem('checkoutItem', JSON.stringify(orderItem));
            
            // Redirect to checkout page
            showNotification('Redirecting to checkout...');
            setTimeout(() => {
                window.location.href = 'checkout.html';
            }, 1000);
        }

        // Toggle product wishlist
        function toggleProductWishlist() {
            const wishlistBtn = document.getElementById('wishlistBtn');
            const icon = wishlistBtn.querySelector('i');
            
            if (isProductInWishlist) {
                // Remove from wishlist
                isProductInWishlist = false;
                icon.className = 'far fa-heart';
                wishlistBtn.classList.remove('active');
                wishlistCount--;
                
                // Remove from localStorage
                let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
                wishlist = wishlist.filter(item => item.productId !== product.id);
                localStorage.setItem('wishlist', JSON.stringify(wishlist));
                
                showNotification('Removed from wishlist');
            } else {
                // Add to wishlist
                isProductInWishlist = true;
                icon.className = 'fas fa-heart';
                wishlistBtn.classList.add('active');
                wishlistCount++;
                
                // Add to localStorage
                let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
                const wishlistItem = {
                    productId: product.id,
                    name: product.name,
                    price: product.price,
                    color: selectedColor.name,
                    image: selectedColor.images[0]
                };
                wishlist.push(wishlistItem);
                localStorage.setItem('wishlist', JSON.stringify(wishlist));
                
                showNotification('Added to wishlist!');
            }
            
            localStorage.setItem('productInWishlist', isProductInWishlist);
            localStorage.setItem('wishlistCount', wishlistCount);
            updateWishlistCount();
        }

        // Update product wishlist button state
        function updateProductWishlistButton() {
            const wishlistBtn = document.getElementById('wishlistBtn');
            const icon = wishlistBtn.querySelector('i');
            
            if (isProductInWishlist) {
                icon.className = 'fas fa-heart';
                wishlistBtn.classList.add('active');
            } else {
                icon.className = 'far fa-heart';
                wishlistBtn.classList.remove('active');
            }
        }

        // Toggle wishlist (for header)
        function toggleWishlist() {
            // This would toggle the main wishlist
            showNotification('Viewing wishlist...');
            setTimeout(() => {
                window.location.href = 'wishlist.html';
            }, 500);
        }

        // Show notification
        function showNotification(message) {
            const notification = document.createElement('div');
            notification.className = 'notification';
            notification.textContent = message;
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.style.opacity = '0';
                notification.style.transform = 'translateY(-20px)';
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }

        // Update cart count display
        function updateCartCount() {
            document.querySelector('.cart-count').textContent = cartCount;
        }

        // Update wishlist count display
        function updateWishlistCount() {
            document.querySelector('.wishlist-count').textContent = wishlistCount;
        }

        // Subscribe to newsletter
        function subscribeNewsletter() {
            const emailInput = document.getElementById('newsletterEmail');
            const email = emailInput.value;
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (email && emailRegex.test(email)) {
                showNotification('Thank you for subscribing to our newsletter!');
                emailInput.value = '';
            } else {
                showNotification('Please enter a valid email address.');
            }
        }

        // Close image zoom
        function closeZoom() {
            document.getElementById('imageZoomModal').classList.remove('active');
            document.body.style.overflow = 'auto';
        }

        // Toggle mobile menu
        function toggleMobileMenu() {
            const menu = document.getElementById('mobileMenu');
            menu.classList.toggle('active');
            document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : 'auto';
        }

        // Navbar scroll effect
        function setupNavScroll() {
            window.addEventListener('scroll', function() {
                const navbar = document.getElementById('navbar');
                if (window.scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            });
        }

        // Close zoom modal with ESC key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeZoom();
            }
        });

        // Close zoom modal when clicking outside image
        document.getElementById('imageZoomModal').addEventListener('click', function(e) {
            if (e.target === this) {
                closeZoom();
            }
        });
