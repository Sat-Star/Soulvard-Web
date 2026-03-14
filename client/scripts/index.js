
      // ===== FIXED HERO SLIDER FUNCTIONS =====
      let currentSlideIndex = 0;
      let totalSlides = 4;
      let slideInterval;
      
      // Initialize hero slider
      function initializeHeroSlider() {
        updateSlideCounter();
        updateDots();
        startAutoplay();
      }
      
      // Update slide position - FIXED: No more gap
      function updateSlidePosition() {
        const slidesContainer = document.getElementById('heroSlides');
        // Use percentage-based transform instead of vw to prevent gaps
        slidesContainer.style.transform = `translateX(-${currentSlideIndex * 25}%)`;
        
        updateSlideCounter();
        updateDots();
      }
      
      // Update slide counter
      function updateSlideCounter() {
        const currentSlideElement = document.getElementById('currentSlide');
        if (currentSlideElement) {
          currentSlideElement.textContent = (currentSlideIndex + 1).toString().padStart(2, '0');
        }
      }
      
      // Update navigation dots
      function updateDots() {
        const dots = document.querySelectorAll('.slider-dot');
        dots.forEach((dot, index) => {
          if (index === currentSlideIndex) {
            dot.classList.add('active');
          } else {
            dot.classList.remove('active');
          }
        });
      }
      
      // Go to specific slide
      function goToSlide(index) {
        currentSlideIndex = index;
        updateSlidePosition();
        resetAutoplay();
      }
      
      // Next slide
      function nextSlide() {
        currentSlideIndex = (currentSlideIndex + 1) % totalSlides;
        updateSlidePosition();
        resetAutoplay();
      }
      
      // Previous slide
      function prevSlide() {
        currentSlideIndex = (currentSlideIndex - 1 + totalSlides) % totalSlides;
        updateSlidePosition();
        resetAutoplay();
      }
      
      // Autoplay functions
      function startAutoplay() {
        slideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
      }
      
      function stopAutoplay() {
        clearInterval(slideInterval);
      }
      
      function resetAutoplay() {
        stopAutoplay();
        startAutoplay();
      }
      
      // ===== TRUST BADGES SCROLLING =====
      let currentBadgeIndex = 0;
      const totalBadges = 4;
      
      function scrollBadges(direction) {
        const badgesContainer = document.getElementById('badgesContainer');
        const badgeWidth = badgesContainer.offsetWidth;
        
        if (direction === 'left') {
          currentBadgeIndex = Math.max(0, currentBadgeIndex - 1);
        } else {
          currentBadgeIndex = Math.min(totalBadges - 1, currentBadgeIndex + 1);
        }
        
        badgesContainer.scrollTo({
          left: currentBadgeIndex * (badgeWidth + 20),
          behavior: 'smooth'
        });
        
        updateBadgeDots();
      }
      
      function goToBadge(index) {
        currentBadgeIndex = index;
        const badgesContainer = document.getElementById('badgesContainer');
        const badgeWidth = badgesContainer.offsetWidth;
        
        badgesContainer.scrollTo({
          left: index * (badgeWidth + 20),
          behavior: 'smooth'
        });
        
        updateBadgeDots();
      }
      
      function updateBadgeDots() {
        const dots = document.querySelectorAll('.badge-dot');
        dots.forEach((dot, index) => {
          if (index === currentBadgeIndex) {
            dot.classList.add('active');
          } else {
            dot.classList.remove('active');
          }
        });
      }
      
      // ===== TESTIMONIALS SCROLLING =====
      let currentTestimonialIndex = 0;
      const totalTestimonials = 3;
      
      function scrollTestimonials(direction) {
        const testimonialContainer = document.getElementById('testimonialContainer');
        const testimonialWidth = testimonialContainer.offsetWidth;
        
        if (direction === 'left') {
          currentTestimonialIndex = Math.max(0, currentTestimonialIndex - 1);
        } else {
          currentTestimonialIndex = Math.min(totalTestimonials - 1, currentTestimonialIndex + 1);
        }
        
        testimonialContainer.scrollTo({
          left: currentTestimonialIndex * (testimonialWidth + 20),
          behavior: 'smooth'
        });
        
        updateTestimonialDots();
      }
      
      function goToTestimonial(index) {
        currentTestimonialIndex = index;
        const testimonialContainer = document.getElementById('testimonialContainer');
        const testimonialWidth = testimonialContainer.offsetWidth;
        
        testimonialContainer.scrollTo({
          left: index * (testimonialWidth + 20),
          behavior: 'smooth'
        });
        
        updateTestimonialDots();
      }
      
      function updateTestimonialDots() {
        const dots = document.querySelectorAll('.testimonial-dot');
        dots.forEach((dot, index) => {
          if (index === currentTestimonialIndex) {
            dot.classList.add('active');
          } else {
            dot.classList.remove('active');
          }
        });
      }
      
      // Initialize scrolling for mobile
      function initializeMobileScrolling() {
        // Update scroll indicators visibility based on screen size
        const updateScrollIndicators = () => {
          const isMobile = window.innerWidth <= 768;
          const indicators = document.querySelectorAll('.scroll-indicator');
          indicators.forEach(indicator => {
            indicator.style.display = isMobile ? 'flex' : 'none';
          });
          
          const badgeDots = document.getElementById('badgeNavDots');
          const testimonialDots = document.getElementById('testimonialNavDots');
          
          if (badgeDots) badgeDots.style.display = isMobile ? 'flex' : 'none';
          if (testimonialDots) testimonialDots.style.display = isMobile ? 'flex' : 'none';
        };
        
        updateScrollIndicators();
        window.addEventListener('resize', updateScrollIndicators);
      }
      
      // ===== DATA =====
      const products = [
        // Top Picks (6 products)
        { id: 1, name: "Classic Wool Blazer", price: 8999, mrp: 12999, badge: "Bestseller", image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
        { id: 2, name: "Silk Evening Dress", price: 12999, mrp: 15999, badge: "Premium", image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
        { id: 3, name: "Linen Summer Set", price: 7499, mrp: 9999, badge: "Summer", image: "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
        { id: 4, name: "Cashmere Sweater", price: 6999, mrp: 8999, badge: "Luxury", image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
        { id: 5, name: "Tailored Trousers", price: 4999, mrp: 6999, badge: "Essential", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
        { id: 6, name: "Leather Moto Jacket", price: 15999, mrp: 19999, badge: "Iconic", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
        
        // New Arrivals (6 products)
        { id: 7, name: "Embroidered Kimono", price: 8999, mrp: 11999, badge: "New", image: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
        { id: 8, name: "Wide-Leg Jumpsuit", price: 8499, mrp: 10999, badge: "Trending", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
        { id: 9, name: "Suede Midi Skirt", price: 5999, mrp: 7999, badge: "New", image: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
        { id: 10, name: "Velvet Blazer Set", price: 12999, mrp: 15999, badge: "Luxury", image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
        { id: 11, name: "Cropped Cardigan", price: 4499, mrp: 5999, badge: "New", image: "https://images.unsplash.com/photo-1576871337622-98d48d1cf53a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
        { id: 12, name: "Silk Slip Dress", price: 7999, mrp: 9999, badge: "Evening", image: "https://images.unsplash.com/photo-1566174053879-31528523f9ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
        
        // Matching Products (6 products)
        { id: 13, name: "Linen Two-Piece Set", price: 9999, mrp: 12999, badge: "Set", image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
        { id: 14, name: "Silk Palazzo Set", price: 13999, mrp: 17999, badge: "Set", image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
        { id: 15, name: "Cotton Lounge Set", price: 5999, mrp: 7999, badge: "Set", image: "https://images.unsplash.com/photo-1582418702059-97ebafb35d09?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
        { id: 16, name: "Wool Co-Ord Set", price: 11999, mrp: 14999, badge: "Set", image: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
        { id: 17, name: "Knit Two-Piece", price: 8499, mrp: 10999, badge: "Set", image: "https://images.unsplash.com/photo-1549576490-b0b4831ef60a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
        { id: 18, name: "Satin Evening Set", price: 14999, mrp: 18999, badge: "Set", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" }
      ];

      // ===== STATE =====
      let cart = JSON.parse(localStorage.getItem('soulvardCart')) || [];
      let wishlist = JSON.parse(localStorage.getItem('soulvardWishlist')) || [];

      // ===== INITIALIZATION =====
      document.addEventListener('DOMContentLoaded', function() {
        initializeHeroSlider();
        renderProducts();
        updateCartCount();
        updateWishlistCount();
        setupNavScroll();
        setupSmoothScroll();
        initializeMobileScrolling();
        
        // Newsletter form submission
        document.querySelector('.newsletter-btn').addEventListener('click', function() {
          const email = document.querySelector('.newsletter-input').value;
          if (email) {
            showNotification('Thank you for subscribing!', 'success');
            document.querySelector('.newsletter-input').value = '';
          }
        });
        
        // Pause autoplay on hover
        document.querySelector('.hero-slider-container').addEventListener('mouseenter', stopAutoplay);
        document.querySelector('.hero-slider-container').addEventListener('mouseleave', startAutoplay);
        
        // Add scroll event listeners for badges and testimonials
        const badgesContainer = document.getElementById('badgesContainer');
        const testimonialContainer = document.getElementById('testimonialContainer');
        
        if (badgesContainer) {
          badgesContainer.addEventListener('scroll', () => {
            const scrollLeft = badgesContainer.scrollLeft;
            const badgeWidth = badgesContainer.offsetWidth;
            currentBadgeIndex = Math.round(scrollLeft / (badgeWidth + 20));
            updateBadgeDots();
          });
        }
        
        if (testimonialContainer) {
          testimonialContainer.addEventListener('scroll', () => {
            const scrollLeft = testimonialContainer.scrollLeft;
            const testimonialWidth = testimonialContainer.offsetWidth;
            currentTestimonialIndex = Math.round(scrollLeft / (testimonialWidth + 20));
            updateTestimonialDots();
          });
        }
      });

      // ===== PRODUCT RENDERING - UPDATED TO MATCH MATCHING_PRODUCT.HTML =====
      function renderProducts() {
        renderProductGrid('topPicksGrid', products.slice(0, 6));
        renderProductGrid('newArrivalsGrid', products.slice(6, 12));
        renderProductGrid('matchingProductsGrid', products.slice(12, 18));
      }

      function renderProductGrid(gridId, productList) {
        const grid = document.getElementById(gridId);
        if (!grid) return;

        grid.innerHTML = productList.map(product => {
          const discount = product.mrp ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;
          
          return `
          <a href="product.html?id=${product.id}" class="product-card">
            ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
            <div class="product-image-container">
              <div class="product-image" style="background-image: url('${product.image}')"></div>
            </div>
            <div class="product-info">
              <div class="product-name">${product.name}</div>
              <div class="product-price">
                ₹${product.price.toLocaleString()}
                ${product.mrp ? `<span class="mrp-price">₹${product.mrp.toLocaleString()}</span>` : ''}
                ${discount > 0 ? `<span class="discount-percent">(${discount}% OFF)</span>` : ''}
              </div>
              <div class="view-product">View Product <i class="fas fa-arrow-right"></i></div>
            </div>
          </a>
        `}).join('');
      }

      // ===== CART FUNCTIONS =====
      function addToCart(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          cart.push({ ...product, quantity: 1 });
        }

        localStorage.setItem('soulvardCart', JSON.stringify(cart));
        updateCartCount();
        showNotification(`${product.name} added to cart!`, 'success');
      }

      function updateCartCount() {
        const count = cart.reduce((total, item) => total + item.quantity, 0);
        document.querySelector('.cart-count').textContent = count;
      }

      // ===== WISHLIST FUNCTIONS =====
      function toggleWishlist(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        const index = wishlist.findIndex(item => item.id === productId);
        if (index > -1) {
          wishlist.splice(index, 1);
          showNotification(`${product.name} removed from wishlist`, 'info');
        } else {
          wishlist.push(product);
          showNotification(`${product.name} added to wishlist`, 'success');
        }

        localStorage.setItem('soulvardWishlist', JSON.stringify(wishlist));
        updateWishlistCount();
      }

      function updateWishlistCount() {
        document.querySelector('.wishlist-count').textContent = wishlist.length;
      }

      // ===== UI FUNCTIONS =====
      function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.background = type === 'success' ? 'var(--charcoal)' : 'var(--text-light)';
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
          notification.style.opacity = '0';
          notification.style.transform = 'translateY(-20px)';
          setTimeout(() => notification.remove(), 300);
        }, 3000);
      }

      function toggleMobileMenu() {
        const menu = document.getElementById('mobileMenu');
        menu.classList.toggle('active');
        document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : 'auto';
      }

      // ===== SCROLL FUNCTIONS =====
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

      function setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
          anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
              window.scrollTo({
                top: target.offsetTop - 100,
                behavior: 'smooth'
              });
            }
            
            // Close mobile menu if open
            const menu = document.getElementById('mobileMenu');
            if (menu.classList.contains('active')) {
              toggleMobileMenu();
            }
          });
        });
      }

      function scrollToCollections() {
        document.getElementById('collections').scrollIntoView({ behavior: 'smooth' });
      }

      // ===== UTILITY FUNCTIONS =====
      function formatPrice(price) {
        return '₹' + price.toLocaleString();
      }
