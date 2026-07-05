document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. THEME TOGGLER (DARK / LIGHT MODE)
    // ==========================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn.querySelector('i');
    
    // Check local storage or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'light') {
        setTheme('light');
    } else if (savedTheme === 'dark') {
        setTheme('dark');
    } else {
        // Fallback to system preference (default is dark-theme as coded in HTML)
        setTheme(systemPrefersDark ? 'dark' : 'light');
    }

    themeToggleBtn.addEventListener('click', () => {
        if (document.body.classList.contains('dark-theme')) {
            setTheme('light');
        } else {
            setTheme('dark');
        }
    });

    function setTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.remove('light-theme');
            document.body.classList.add('dark-theme');
            themeIcon.className = 'fa-solid fa-sun'; // Sun icon for light mode toggle
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark-theme');
            document.body.classList.add('light-theme');
            themeIcon.className = 'fa-solid fa-moon'; // Moon icon for dark mode toggle
            localStorage.setItem('theme', 'light');
        }
    }

    // ==========================================
    // 2. MOBILE MENU DRAWER
    // ==========================================
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenuIcon = mobileMenuBtn.querySelector('i');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    mobileMenuBtn.addEventListener('click', () => {
        const isOpen = mobileNav.classList.contains('open');
        if (isOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });

    // Close menu when clicking a link
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });

    function openMobileMenu() {
        mobileNav.classList.add('open');
        mobileMenuIcon.className = 'fa-solid fa-xmark';
    }

    function closeMobileMenu() {
        mobileNav.classList.remove('open');
        mobileMenuIcon.className = 'fa-solid fa-bars';
    }

    // ==========================================
    // 3. SCROLL ACTIVE LINK HIGHLIGHTING
    // ==========================================
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPosition = window.scrollY + 120; // Offset for navbar

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });

    // ==========================================
    // 4. REVEAL ON SCROLL ANIMATION
    // ==========================================
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // ==========================================
    // 5. CUSTOM MOUSE CURSOR (MAGNETIC & TRAILING)
    // ==========================================
    const cursor = document.querySelector('.custom-cursor');
    const cursorDot = document.querySelector('.custom-cursor-dot');
    
    let mouseX = -100, mouseY = -100; // Khởi tạo ngoài vùng nhìn thấy ban đầu
    let cursorX = -100, cursorY = -100;
    let dotX = -100, dotY = -100;
    let hasMoved = false;
    
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Hiện cursor khi bắt đầu di chuyển chuột lần đầu
        if (!hasMoved) {
            hasMoved = true;
            if (cursor) cursor.classList.remove('hidden');
            if (cursorDot) cursorDot.classList.remove('hidden');
        }
    });
    
    function animateCursor() {
        // Nội suy Lerp tạo độ trễ bám theo mượt mà
        cursorX += (mouseX - cursorX) * 0.16;
        cursorY += (mouseY - cursorY) * 0.16;
        
        dotX += (mouseX - dotX) * 0.35;
        dotY += (mouseY - dotY) * 0.35;
        
        if (cursor) {
            cursor.style.left = `${cursorX}px`;
            cursor.style.top = `${cursorY}px`;
        }
        if (cursorDot) {
            cursorDot.style.left = `${dotX}px`;
            cursorDot.style.top = `${dotY}px`;
        }
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();
    
    // Ẩn con trỏ tùy biến khi chuột di chuyển ra khỏi cửa sổ trình duyệt (iframe/webpage)
    document.addEventListener('mouseleave', () => {
        if (cursor) cursor.classList.add('hidden');
        if (cursorDot) cursorDot.classList.add('hidden');
    });
    
    // Hiện lại khi chuột quay trở lại trang web
    document.addEventListener('mouseenter', () => {
        if (hasMoved) {
            if (cursor) cursor.classList.remove('hidden');
            if (cursorDot) cursorDot.classList.remove('hidden');
        }
    });
    
    // Hiệu ứng phồng to khi di chuột vào các link/nút bấm (Magnetic)
    const hoverTargets = document.querySelectorAll('a, button, .skills-card, .project-card, .education-card, #theme-toggle');
    hoverTargets.forEach(target => {
        target.addEventListener('mouseenter', () => {
            if (cursor) cursor.classList.add('hovered');
            if (cursorDot) cursorDot.classList.add('hovered');
        });
        target.addEventListener('mouseleave', () => {
            if (cursor) cursor.classList.remove('hovered');
            if (cursorDot) cursorDot.classList.remove('hovered');
        });
    });

    // ==========================================
    // 6. 3D PARALLAX TILT FOR PROFILE CARD
    // ==========================================
    const profileCardWrapper = document.querySelector('.profile-card-wrapper');
    if (profileCardWrapper) {
        const card = profileCardWrapper.querySelector('.profile-card');
        
        profileCardWrapper.addEventListener('mousemove', (e) => {
            const rect = profileCardWrapper.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Calculate rotation angles (max 10 degrees to keep it elegant and subtle)
            const rotateX = ((centerY - y) / centerY) * 10;
            const rotateY = ((x - centerX) / centerX) * 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        profileCardWrapper.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
        });
    }

    // ==========================================
    // 7. VERCEL-STYLE HOVER SPOTLIGHT FOR CARDS
    // ==========================================
    const spotlightCards = document.querySelectorAll('.skills-card, .project-card, .education-card');
    
    spotlightCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // ==========================================
    // 8. CONTACT FORM MAILTO REDIRECT (CÁCH 2)
    // ==========================================
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const nameInput = document.getElementById('name');
            const messageInput = document.getElementById('message');
            
            if (nameInput && messageInput) {
                const name = nameInput.value;
                const message = messageInput.value;
                
                const subject = encodeURIComponent('Liên hệ công việc từ Portfolio - ' + name);
                const body = encodeURIComponent(
                    `Kính gửi bạn Nguyễn Minh Thiện,\n\n` +
                    `Tôi tên là: ${name}\n\n` +
                    `Nội dung liên hệ:\n${message}\n\n` +
                    `Trân trọng.`
                );
                
                // Mở ứng dụng Mail mặc định trên thiết bị của người dùng
                window.location.href = `mailto:nmthien.dev@gmail.com?subject=${subject}&body=${body}`;
                
                // Xóa dữ liệu trong form sau khi bấm gửi
                contactForm.reset();
            }
        });
    }

    // ==========================================
    // 9. INTERACTIVE PARTICLES BACKGROUND
    // ==========================================
    const particlesCanvas = document.getElementById('particles-canvas');
    if (particlesCanvas) {
        const pCtx = particlesCanvas.getContext('2d');
        let particlesArray = [];
        const mouse = {
            x: null,
            y: null,
            radius: 120 // Vùng ảnh hưởng khi rê chuột gần
        };

        // Lấy tọa độ chuột thực tế
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        // Ẩn chuột khi ra ngoài màn hình
        window.addEventListener('mouseout', () => {
            mouse.x = null;
            mouse.y = null;
        });

        // Resize Canvas để khớp màn hình
        function resizeParticlesCanvas() {
            particlesCanvas.width = window.innerWidth;
            particlesCanvas.height = window.innerHeight;
            initParticles();
        }
        window.addEventListener('resize', resizeParticlesCanvas);
        particlesCanvas.width = window.innerWidth;
        particlesCanvas.height = window.innerHeight;

        // Định nghĩa lớp Particle
        class Particle {
            constructor(x, y, vx, vy, radius) {
                this.x = x;
                this.y = y;
                this.vx = vx;
                this.vy = vy;
                this.baseVx = vx;
                this.baseVy = vy;
                this.radius = radius;
            }

            draw() {
                pCtx.beginPath();
                pCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
                pCtx.fillStyle = 'rgba(6, 182, 212, 0.4)'; // Xanh ngọc mờ làm chấm hạt
                pCtx.fill();
            }

            update() {
                // Kiểm tra va chạm với biên màn hình
                if (this.x + this.radius > particlesCanvas.width || this.x - this.radius < 0) {
                    this.vx = -this.vx;
                    this.baseVx = -this.baseVx;
                }
                if (this.y + this.radius > particlesCanvas.height || this.y - this.radius < 0) {
                    this.vy = -this.vy;
                    this.baseVy = -this.baseVy;
                }

                // Tương tác đẩy hạt khi rê chuột đến gần (Repulsion)
                if (mouse.x !== null && mouse.y !== null) {
                    const dx = this.x - mouse.x;
                    const dy = this.y - mouse.y;
                    const distance = Math.hypot(dx, dy);
                    
                    if (distance < mouse.radius) {
                        const force = (mouse.radius - distance) / mouse.radius;
                        const angle = Math.atan2(dy, dx);
                        
                        // Gia tốc đẩy hạt ra xa chuột
                        this.vx += Math.cos(angle) * force * 0.4;
                        this.vy += Math.sin(angle) * force * 0.4;
                    }
                }

                // Lực cản ma sát nhẹ giúp hạt không bị bay quá đà
                this.vx *= 0.94;
                this.vy *= 0.94;

                // Dần trả hạt về vận tốc cơ bản ban đầu
                this.vx += this.baseVx * 0.06;
                this.vy += this.baseVy * 0.06;

                // Di chuyển hạt
                this.x += this.vx;
                this.y += this.vy;

                this.draw();
            }
        }

        // Tạo mảng hạt ngẫu nhiên
        function initParticles() {
            particlesArray = [];
            // Điều chỉnh mật độ hạt dựa vào kích thước màn hình
            const numberOfParticles = Math.floor((particlesCanvas.width * particlesCanvas.height) / 11000);
            
            for (let i = 0; i < numberOfParticles; i++) {
                const radius = Math.random() * 1.5 + 1.2; // Hạt nhỏ tinh tế (1.2px - 2.7px)
                const x = Math.random() * (particlesCanvas.width - radius * 2) + radius;
                const y = Math.random() * (particlesCanvas.height - radius * 2) + radius;
                
                // Vận tốc chuyển động nền chậm rãi (0.1 - 0.4px/frame)
                const vx = (Math.random() - 0.5) * 0.35;
                const vy = (Math.random() - 0.5) * 0.35;

                particlesArray.push(new Particle(x, y, vx, vy, radius));
            }
        }

        // Vẽ đường liên kết các hạt ở gần nhau (Constellation)
        function connectParticles() {
            let opacityValue = 1;
            const maxDistance = 115; // Khoảng cách tối đa để vẽ đường nối
            
            for (let a = 0; a < particlesArray.length; a++) {
                for (let b = a; b < particlesArray.length; b++) {
                    const dx = particlesArray[a].x - particlesArray[b].x;
                    const dy = particlesArray[a].y - particlesArray[b].y;
                    const distance = Math.hypot(dx, dy);

                    if (distance < maxDistance) {
                        opacityValue = 1 - (distance / maxDistance);
                        pCtx.strokeStyle = `rgba(6, 182, 212, ${opacityValue * 0.16})`; // Đường liên kết xanh ngọc mờ
                        pCtx.lineWidth = 1.0;
                        pCtx.beginPath();
                        pCtx.moveTo(particlesArray[a].x, particlesArray[a].y);
                        pCtx.lineTo(particlesArray[b].x, particlesArray[b].y);
                        pCtx.stroke();
                    }
                }
            }
        }

        // Vòng lặp Render chính
        function animateParticles() {
            pCtx.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);
            
            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
            }
            connectParticles();
            requestAnimationFrame(animateParticles);
        }

        initParticles();
        animateParticles();
    }
});
