document.addEventListener('DOMContentLoaded', () => {
    // --- Navigation & Scrolling ---
    const navLinks = document.querySelectorAll('nav ul li .nav-link');
    const sections = document.querySelectorAll('main section');
    const navbar = document.querySelector('.navbar');
    const headerHeight = navbar.offsetHeight;

    // Smooth scrolling for navigation links
    navLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            // Close mobile menu if open
            if (document.querySelector('.main-nav').classList.contains('active')) {
                document.querySelector('.main-nav').classList.remove('active');
                document.querySelector('.hamburger-menu').classList.remove('active');
            }

            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // Intersection Observer for scroll-based active link highlighting
    const observerOptions = {
        root: null,
        rootMargin: `-${headerHeight + 10}px 0px -50% 0px`, // Adjust margin to activate link slightly before section top
        threshold: 0.1
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // Mobile Hamburger Menu Toggle
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const mainNav = document.querySelector('.main-nav');

    hamburgerMenu.addEventListener('click', () => {
        mainNav.classList.toggle('active');
        hamburgerMenu.classList.toggle('active'); // Optional: change icon
    });

    // --- Back to Top Button ---
    const backToTopBtn = document.getElementById('backToTopBtn');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) { // Show button after scrolling 300px
            backToTopBtn.style.display = 'block';
            backToTopBtn.style.opacity = '1';
        } else {
            backToTopBtn.style.opacity = '0';
            setTimeout(() => { // Delay display:none to allow fade out
                if (window.scrollY <= 300) {
                    backToTopBtn.style.display = 'none';
                }
            }, 300);
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // --- Tab Functionality for Sermons & Events ---
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.dataset.tab;

            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            button.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Set initial active tab (Recent Sermons)
    if (tabButtons.length > 0) {
        tabButtons[0].click();
    }

    // --- Modals ---
    const loginModal = document.getElementById('loginModal');
    const sermonVideoModal = document.getElementById('sermonVideoModal');
    const loginButton = document.querySelector('.login-button');
    const closeButtons = document.querySelectorAll('.modal .close-button');
    const watchSermonButtons = document.querySelectorAll('.watch-sermon-btn');
    const videoIframe = sermonVideoModal.querySelector('iframe');

    // Open Login Modal
    loginButton.addEventListener('click', () => {
        loginModal.classList.add('active');
    });

    // Open Sermon Video Modal
    watchSermonButtons.forEach(button => {
        button.addEventListener('click', function() {
            const videoUrl = this.closest('.sermon-card').dataset.videoUrl;
            if (videoUrl) {
                videoIframe.src = videoUrl + "?autoplay=1"; // Autoplay video
                sermonVideoModal.classList.add('active');
            } else {
                alert('No video URL provided for this sermon.');
            }
        });
    });

    // Close Modals
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            button.closest('.modal').classList.remove('active');
            // Stop video if closing video modal
            if (button.closest('.modal').id === 'sermonVideoModal') {
                videoIframe.src = ""; // Stop video playback
            }
        });
    });

    // Close modal if clicked outside modal-content
    window.addEventListener('click', (event) => {
        if (event.target.classList.contains('modal')) {
            event.target.classList.remove('active');
            // Stop video if clicking outside video modal
            if (event.target.id === 'sermonVideoModal') {
                videoIframe.src = "";
            }
        }
    });

    // --- Form Submissions and Validation ---

    // Login Form (Frontend Only)
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            // Basic validation
            if (email && password) {
                alert(`Attempting to log in with Email: ${email}`);
                // In a real application, you'd send this to a backend for authentication
                loginModal.classList.remove('active'); // Close modal on "submission"
                loginForm.reset();
            } else {
                alert('Please enter both email and password.');
            }
        });
    }

    // Membership Form with enhanced validation
    const membershipForm = document.querySelector('.membership-form');
    if (membershipForm) {
        membershipForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent default form submission

            let isValid = true;

            // Full Name validation
            const fullName = document.getElementById('fullName');
            if (fullName.value.trim() === '') {
                displayError(fullName, 'Full Name is required.');
                isValid = false;
            } else {
                clearError(fullName);
            }

            // Email validation
            const emailAddress = document.getElementById('emailAddress');
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailAddress.value.trim() === '') {
                displayError(emailAddress, 'Email Address is required.');
                isValid = false;
            } else if (!emailPattern.test(emailAddress.value.trim())) {
                displayError(emailAddress, 'Please enter a valid email address.');
                isValid = false;
            } else {
                clearError(emailAddress);
            }

            // Phone Number validation (basic example for Zimbabwe)
            const phoneNumber = document.getElementById('phoneNumber');
            // A more robust pattern for Zimbabwean numbers could be: /^\+2637[1-9]\d{7}$/
            const phonePattern = /^\+263\d{9}$/; // Starts with +263 and 9 more digits
            if (phoneNumber.value.trim() !== '' && !phonePattern.test(phoneNumber.value.trim())) {
                displayError(phoneNumber, 'Please enter a valid Zimbabwean phone number (e.g., +263771234567).');
                isValid = false;
            } else {
                clearError(phoneNumber);
            }

            // Ministry Interests validation
            const ministryInterests = document.getElementById('ministryInterests');
            if (ministryInterests.value === '') {
                displayError(ministryInterests, 'Please select a ministry interest.');
                isValid = false;
            } else {
                clearError(ministryInterests);
            }

            // Privacy Terms checkbox validation
            const privacyTerms = document.getElementById('privacyTerms');
            if (!privacyTerms.checked) {
                displayError(privacyTerms, 'You must agree to the privacy policy.');
                isValid = false;
            } else {
                clearError(privacyTerms);
            }

            if (isValid) {
                alert('Membership application submitted! (This is a demo, no data sent)');
                membershipForm.reset();
            }
        });
    }

    // Helper functions for displaying/clearing form errors
    function displayError(inputElement, message) {
        inputElement.classList.add('invalid');
        let errorElement = document.getElementById(inputElement.id + 'Error');
        if (!errorElement) {
            errorElement = document.createElement('span');
            errorElement.className = 'error-message';
            errorElement.id = inputElement.id + 'Error';
            inputElement.parentNode.insertBefore(errorElement, inputElement.nextSibling);
        }
        errorElement.textContent = message;
    }

    function clearError(inputElement) {
        inputElement.classList.remove('invalid');
        const errorElement = document.getElementById(inputElement.id + 'Error');
        if (errorElement) {
            errorElement.textContent = '';
        }
    }

    // Prayer Request Form validation (basic)
    const prayerRequestForm = document.querySelector('.prayer-request-form');
    if (prayerRequestForm) {
        prayerRequestForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const prayerMessage = document.getElementById('prayerMessage');
            if (prayerMessage.value.trim() === '') {
                displayError(prayerMessage, 'Your prayer message cannot be empty.');
                return;
            } else {
                clearError(prayerMessage);
            }

            alert('Your prayer request has been submitted. Our team will be praying for you! (Demo)');
            prayerRequestForm.reset();
        });
    }

    // --- Dummy functionality for other buttons ---

    document.querySelectorAll('.pastor-buttons .btn').forEach(btn => {
        btn.addEventListener('click', () => {
            alert(`${btn.textContent.trim()} functionality not implemented in this front-end demo.`);
        });
    });

    document.querySelector('.get-directions-btn').addEventListener('click', () => {
        // Replace with your actual church address for Google Maps
        const churchAddress = encodeURIComponent('123 Church Street, Kuwadzana, Harare, Zimbabwe');
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${churchAddress}`, '_blank');
    });

    document.querySelector('.share-location-btn').addEventListener('click', () => {
        if (navigator.share) {
            navigator.share({
                title: document.title,
                url: window.location.href,
                text: 'Check out the Kuwadzana Apostolic Church website!'
            }).catch(error => console.log('Error sharing:', error));
        } else {
            alert('Share functionality not supported on this browser. You can manually copy the URL from your address bar.');
            console.log('Share URL:', window.location.href);
        }
    });

    document.querySelector('.make-donation-btn').addEventListener('click', () => {
        alert('Make a Donation functionality not implemented in this front-end demo. This would typically link to a secure payment gateway.');
    });

    // Basic bookmark icon toggle
    document.querySelectorAll('.bookmark-icon').forEach(icon => {
        icon.addEventListener('click', function() {
            this.querySelector('i').classList.toggle('far'); // regular (unfilled)
            this.querySelector('i').classList.toggle('fas'); // solid (filled)
            alert('Sermon bookmarked/unbookmarked! (Demo feature)');
        });
    });

    // Ensure initial active link is set when page loads
    // This is important if a user lands directly on a section via a URL hash
    const initialHash = window.location.hash;
    if (initialHash) {
        const initialNavLink = document.querySelector(`nav ul li a[href="${initialHash}"]`);
        if (initialNavLink) {
            navLinks.forEach(link => link.classList.remove('active'));
            initialNavLink.classList.add('active');
            // Scroll to the section after active class is set
            const targetSection = document.getElementById(initialHash.substring(1));
            if (targetSection) {
                 // Slight delay to ensure content is loaded and height is correct
                 setTimeout(() => {
                    const elementPosition = targetSection.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth"
                    });
                 }, 100);
            }
        }
    } else {
        // If no hash, ensure home is active by default
        document.querySelector('nav ul li a[href="#home"]').classList.add('active');
    }
});