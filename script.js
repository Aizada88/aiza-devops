document.addEventListener('DOMContentLoaded', () => {
    // Navbar scroll effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    const menuBtn = document.querySelector('.menu-btn');
    const navLinks = document.querySelector('.nav-links');

    menuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = menuBtn.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });

    // Close mobile menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = menuBtn.querySelector('i');
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
        });
    });

    // Active link highlighting on scroll
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 150) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href').slice(1) === current) {
                item.classList.add('active');
            }
        });
    });

    // Reveal on scroll animation
    const revealElements = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
        for (let i = 0; i < revealElements.length; i++) {
            const windowHeight = window.innerHeight;
            const elementTop = revealElements[i].getBoundingClientRect().top;
            const elementVisible = 150;

            if (elementTop < windowHeight - elementVisible) {
                revealElements[i].classList.add('active');
            }
        }
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Initial check

    // Menu Filtering
    const tabBtns = document.querySelectorAll('.tab-btn');
    const menuGrid = document.querySelector('.menu-grid');

    const menuData = {
        coffee: [
            { name: 'Caramel Macchiato', desc: 'Espresso with steamed milk and caramel drizzle.', price: '$4.50' },
            { name: 'Flat White', desc: 'Double shot of espresso with microfoam.', price: '$3.75' },
            { name: 'Vanilla Latte', desc: 'Rich espresso and silky steamed milk with vanilla.', price: '$4.25' },
            { name: 'Cold Brew', desc: 'Slow-steeped for 18 hours for a smooth finish.', price: '$4.00' }
        ],
        pastries: [
            { name: 'Butter Croissant', desc: 'Flaky, buttery French-style pastry.', price: '$3.50' },
            { name: 'Blueberry Muffin', desc: 'Freshly baked with local berries.', price: '$3.25' },
            { name: 'Chocolate Eclair', desc: 'Filled with cream and topped with ganache.', price: '$4.50' },
            { name: 'Cinnamon Roll', desc: 'Warm, gooey, and topped with cream cheese frosting.', price: '$4.00' }
        ],
        tea: [
            { name: 'Chai Latte', desc: 'Spiced tea with steamed milk.', price: '$4.25' },
            { name: 'Matcha Latte', desc: 'Ceremonial grade matcha with creamy milk.', price: '$4.75' },
            { name: 'Earl Grey', desc: 'Black tea infused with bergamot.', price: '$3.00' },
            { name: 'Peppermint Herbal', desc: 'Refreshing and caffeine-free.', price: '$3.00' }
        ]
    };

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            tabBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const category = btn.getAttribute('data-target');

            // Fade out
            menuGrid.style.opacity = '0';

            setTimeout(() => {
                // Clear grid
                menuGrid.innerHTML = '';

                // Populate with new items
                menuData[category].forEach(item => {
                    const menuItem = document.createElement('div');
                    menuItem.className = 'menu-item';
                    menuItem.innerHTML = `
                        <div class="item-info">
                            <h3>${item.name}</h3>
                            <p>${item.desc}</p>
                        </div>
                        <span class="price">${item.price}</span>
                    `;
                    menuGrid.appendChild(menuItem);
                });

                // Fade in
                menuGrid.style.opacity = '1';
            }, 300);
        });
    });

    // Contact form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        });
    }
});
