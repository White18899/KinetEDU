/**
 * KinetEdu - Main Application Logic
 * Implements interactive navigation, dual modals, dynamic form options, 
 * password/email validation restrictions, and simulated dashboard views.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // DOM Elements Queries
    // ==========================================================================
    
    // Nav Navigation Toggle
    const mobileToggle = document.getElementById('mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navAuth = document.querySelector('.nav-auth');
    
    // Auth Modal Elements
    const authModal = document.getElementById('auth-modal');
    const authCard = document.getElementById('auth-card');
    const authCloseBtn = document.getElementById('auth-modal-close');
    const navLoginBtn = document.getElementById('nav-login-btn');
    const navSignupBtn = document.getElementById('nav-signup-btn');
    const heroGetStartedBtn = document.getElementById('hero-get-started');
    const planBtns = document.querySelectorAll('.plan-btn');
    
    // Auth Form Tabs Switcher
    const tabLoginBtn = document.getElementById('tab-login-btn');
    const tabSignupBtn = document.getElementById('tab-signup-btn');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    
    // Sign Up Fields
    const signupFirstname = document.getElementById('signup-firstname');
    const signupLastname = document.getElementById('signup-lastname');
    const signupEmail = document.getElementById('signup-email');
    const signupEmailError = document.getElementById('signup-email-error');
    const signupPassword = document.getElementById('signup-password');
    const signupPasswordError = document.getElementById('signup-password-error');
    const signupPursuing = document.getElementById('signup-pursuing');
    const signupStream = document.getElementById('signup-stream');
    const signupSubmitBtn = document.getElementById('signup-submit-btn');
    
    // Login Fields
    const loginEmail = document.getElementById('login-email');
    const loginEmailError = document.getElementById('login-email-error');
    const loginPassword = document.getElementById('login-password');
    const loginPasswordError = document.getElementById('login-password-error');
    
    // Student Dashboard Modal
    const dashboardModal = document.getElementById('dashboard-modal');
    const dashboardCloseBtn = document.getElementById('dashboard-modal-close');
    const dbUserName = document.getElementById('db-user-name');
    const dbUserFirstname = document.getElementById('db-user-firstname');
    const dbAvatar = document.getElementById('db-avatar');
    const dbUserStream = document.getElementById('db-user-stream');
    const dbSyllabusTitle = document.getElementById('db-syllabus-title');
    const dbSyllabusList = document.getElementById('db-syllabus-list');    // ==========================================================================
    // Custom Select Dropdown UI logic
    // ==========================================================================
    const setupCustomSelects = () => {
        const nativeSelects = [signupPursuing, signupStream];
        
        nativeSelects.forEach(selectElement => {
            if (!selectElement) return;
            
            // Hide native select element
            selectElement.style.display = 'none';
            
            // Create custom dropdown HTML markup wrappers
            const wrapper = document.createElement('div');
            wrapper.className = 'custom-select-wrapper';
            if (selectElement.disabled) {
                wrapper.classList.add('disabled');
            }
            
            const customSelect = document.createElement('div');
            customSelect.className = 'custom-select';
            customSelect.id = 'custom-' + selectElement.id;
            
            const trigger = document.createElement('div');
            trigger.className = 'custom-select-trigger';
            
            const triggerText = document.createElement('span');
            const selectedOption = selectElement.options[selectElement.selectedIndex];
            triggerText.textContent = selectedOption ? selectedOption.textContent : 'Select...';
            trigger.appendChild(triggerText);
            
            const arrow = document.createElement('div');
            arrow.className = 'custom-select-arrow';
            trigger.appendChild(arrow);
            customSelect.appendChild(trigger);
            
            const optionsContainer = document.createElement('div');
            optionsContainer.className = 'custom-options-container';
            
            // Populate option items dynamically
            const populateOptions = () => {
                optionsContainer.innerHTML = '';
                Array.from(selectElement.options).forEach(option => {
                    if (option.disabled && option.value === '') return; // Skip placeholder
                    
                    const opt = document.createElement('div');
                    opt.className = 'custom-option';
                    opt.textContent = option.textContent;
                    opt.setAttribute('data-value', option.value);
                    
                    if (option.value === selectElement.value && option.value !== '') {
                        opt.classList.add('selected');
                    }
                    
                    opt.addEventListener('click', (e) => {
                        e.stopPropagation();
                        selectElement.value = option.value;
                        selectElement.dispatchEvent(new Event('change'));
                        customSelect.classList.remove('open');
                    });
                    
                    optionsContainer.appendChild(opt);
                });
            };
            
            populateOptions();
            customSelect.appendChild(optionsContainer);
            wrapper.appendChild(customSelect);
            
            // Place the custom selector directly after the native dropdown
            selectElement.parentNode.insertBefore(wrapper, selectElement.nextSibling);
            
            // Click to toggle dropdown popup
            trigger.addEventListener('click', (e) => {
                e.stopPropagation();
                if (selectElement.disabled) return;
                
                document.querySelectorAll('.custom-select').forEach(cs => {
                    if (cs !== customSelect) cs.classList.remove('open');
                });
                
                customSelect.classList.toggle('open');
            });
            
            // Watch native select element attribute changes (e.g. disabled and child options list)
            const observer = new MutationObserver(() => {
                if (selectElement.disabled) {
                    wrapper.classList.add('disabled');
                    customSelect.classList.remove('open');
                } else {
                    wrapper.classList.remove('disabled');
                }
                populateOptions();
                const active = selectElement.options[selectElement.selectedIndex];
                triggerText.textContent = active ? active.textContent : 'Select...';
            });
            
            observer.observe(selectElement, { attributes: true, childList: true, subtree: true });
            
            // Sync selection state visuals on change event
            selectElement.addEventListener('change', () => {
                const active = selectElement.options[selectElement.selectedIndex];
                triggerText.textContent = active ? active.textContent : 'Select...';
                
                optionsContainer.querySelectorAll('.custom-option').forEach(opt => {
                    if (opt.getAttribute('data-value') === selectElement.value) {
                        opt.classList.add('selected');
                    } else {
                        opt.classList.remove('selected');
                    }
                });
            });
        });
        
        // Close custom select dropdowns when clicking anywhere outside
        document.addEventListener('click', () => {
            document.querySelectorAll('.custom-select').forEach(cs => {
                cs.classList.remove('open');
            });
        });
    };
    
    // Initialize custom selects
    setupCustomSelects();

    // ======================================================================
    // Scroll Reveal Animations
    // ======================================================================
    const revealTargets = document.querySelectorAll(
        '.hero-content, .hero-visual, .section-header, .feature-card, .plan-card, .about-content, .about-visual, .footer-container'
    );

    revealTargets.forEach(el => el.classList.add('reveal'));

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -10% 0px'
        });

        revealTargets.forEach(el => revealObserver.observe(el));
    } else {
        revealTargets.forEach(el => el.classList.add('is-visible'));
    }

    // ==========================================================================
    // Mobile Navigation Hamburger Toggle
    // ==========================================================================
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
            if (navAuth) navAuth.classList.toggle('active');
        });
    }

    // Close mobile nav when clicking a link
    const navLinksList = document.querySelectorAll('.nav-link');
    navLinksList.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileToggle && mobileToggle.classList.contains('active')) {
                mobileToggle.classList.remove('active');
                navLinks.classList.remove('active');
                if (navAuth) navAuth.classList.remove('active');
            }
        });
    });

    // ==========================================================================
    // Auth Modal Toggle & Switch Tabs
    // ==========================================================================
    
    const openAuthModal = (tab = 'login') => {
        authModal.classList.add('active');
        switchTab(tab);
    };

    const closeAuthModal = () => {
        authModal.classList.remove('active');
    };

    const switchTab = (tab) => {
        if (tab === 'login') {
            tabLoginBtn.classList.add('active');
            tabSignupBtn.classList.remove('active');
            loginForm.classList.add('active');
            signupForm.classList.remove('active');
        } else {
            tabSignupBtn.classList.add('active');
            tabLoginBtn.classList.remove('active');
            signupForm.classList.add('active');
            loginForm.classList.remove('active');
        }
    };

    if (navLoginBtn) navLoginBtn.addEventListener('click', () => openAuthModal('login'));
    if (navSignupBtn) navSignupBtn.addEventListener('click', () => openAuthModal('signup'));
    if (heroGetStartedBtn) heroGetStartedBtn.addEventListener('click', () => openAuthModal('signup'));
    
    planBtns.forEach(btn => {
        btn.addEventListener('click', () => openAuthModal('signup'));
    });

    if (authCloseBtn) authCloseBtn.addEventListener('click', closeAuthModal);
    
    // Close modal on background click
    authModal.addEventListener('click', (e) => {
        if (e.target === authModal) {
            closeAuthModal();
        }
    });

    if (tabLoginBtn) tabLoginBtn.addEventListener('click', () => switchTab('login'));
    if (tabSignupBtn) tabSignupBtn.addEventListener('click', () => switchTab('signup'));

    // ==========================================================================
    // Dynamic Select Fields Mapping (Pursuing -> Stream)
    // ==========================================================================
    
    const streamsData = {
        '10th': [
            { value: 'cbse', text: 'CBSE (Central Board)' },
            { value: 'ssc', text: 'SSC (State Board)' },
            { value: 'icse', text: 'ICSE (Indian Certificate)' }
        ],
        'inter': [
            { value: 'mpc', text: 'MPC (Maths, Physics, Chem)' },
            { value: 'bpc', text: 'BPC (Biology, Physics, Chem)' },
            { value: 'mec', text: 'MEC (Maths, Econ, Commerce)' },
            { value: 'cec', text: 'CEC (Civics, Econ, Commerce)' },
            { value: 'hec', text: 'HEC (History, Econ, Civics)' }
        ],
        'diploma': [
            { value: 'computer', text: 'Computer Engineering (CSE)' },
            { value: 'electronics', text: 'Electronics & Comm (ECE)' },
            { value: 'electrical', text: 'Electrical Engineering (EEE)' },
            { value: 'mechanical', text: 'Mechanical Engineering (ME)' },
            { value: 'civil', text: 'Civil Engineering (CE)' }
        ],
        'btech': [
            { value: 'cse', text: 'Computer Science (CSE)' },
            { value: 'it', text: 'Information Technology (IT)' },
            { value: 'ece', text: 'Electronics & Comm (ECE)' },
            { value: 'eee', text: 'Electrical & Electronics (EEE)' },
            { value: 'mech', text: 'Mechanical Engineering (ME)' },
            { value: 'civil', text: 'Civil Engineering (CE)' },
            { value: 'aiml', text: 'Artificial Intelligence & ML' },
            { value: 'data-science', text: 'Data Science & Analytics' }
        ]
    };

    if (signupPursuing) {
        signupPursuing.addEventListener('change', () => {
            const selectedLevel = signupPursuing.value;
            
            // Clear current streams options
            signupStream.innerHTML = '<option value="" disabled selected>Select stream/branch...</option>';
            
            if (streamsData[selectedLevel]) {
                // Populate options
                streamsData[selectedLevel].forEach(stream => {
                    const option = document.createElement('option');
                    option.value = stream.value;
                    option.textContent = stream.text;
                    signupStream.appendChild(option);
                });
                
                // Enable select field
                signupStream.removeAttribute('disabled');
            } else {
                signupStream.setAttribute('disabled', 'true');
            }
            
            validateSignupForm();
        });
    }

    if (signupStream) {
        signupStream.addEventListener('change', () => {
            validateSignupForm();
        });
    }

    // ==========================================================================
    // Inputs Form Validation Rules (Email / Password Restrictions)
    // ==========================================================================
    
    // Regular expression for validating an email address
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // Password restrictions flags (checked in real-time)
    let passwordChecksState = {
        length: false,
        uppercase: false,
        lowercase: false,
        digit: false,
        special: false
    };

    // Helper functions for class toggle
    const toggleFieldUI = (element, isValid) => {
        if (isValid) {
            element.classList.add('valid');
            element.classList.remove('invalid');
        } else {
            element.classList.add('invalid');
            element.classList.remove('valid');
        }
    };

    // Live Email Validation Checks (Sign Up)
    if (signupEmail) {
        signupEmail.addEventListener('input', () => {
            const emailValue = signupEmail.value.trim();
            const isValid = emailRegex.test(emailValue);
            
            if (emailValue === '') {
                signupEmail.classList.remove('valid', 'invalid');
                signupEmailError.style.display = 'none';
            } else {
                toggleFieldUI(signupEmail, isValid);
                if (isValid) {
                    signupEmailError.style.display = 'none';
                } else {
                    signupEmailError.textContent = 'Please enter a valid email (e.g. name@domain.com)';
                    signupEmailError.style.display = 'block';
                }
            }
            validateSignupForm();
        });
    }

    // Live Email Validation Checks (Login)
    if (loginEmail) {
        loginEmail.addEventListener('input', () => {
            const emailValue = loginEmail.value.trim();
            const isValid = emailRegex.test(emailValue);
            
            if (emailValue === '') {
                loginEmail.classList.remove('valid', 'invalid');
                loginEmailError.style.display = 'none';
            } else {
                toggleFieldUI(loginEmail, isValid);
                if (isValid) {
                    loginEmailError.style.display = 'none';
                } else {
                    loginEmailError.textContent = 'Invalid email address format.';
                    loginEmailError.style.display = 'block';
                }
            }
        });
    }

    // Live Password Strength Checklist Checks
    if (signupPassword) {
        signupPassword.addEventListener('input', () => {
            const passwordValue = signupPassword.value;
            
            // Check length (>= 8 characters)
            passwordChecksState.length = passwordValue.length >= 8;
            
            // Check uppercase
            passwordChecksState.uppercase = /[A-Z]/.test(passwordValue);
            
            // Check lowercase
            passwordChecksState.lowercase = /[a-z]/.test(passwordValue);
            
            // Check digit
            passwordChecksState.digit = /[0-9]/.test(passwordValue);
            
            // Check special character
            passwordChecksState.special = /[@$!%*?&#^]/.test(passwordValue);
            
            // Update checklist DOM elements
            Object.keys(passwordChecksState).forEach(rule => {
                const checkElement = document.querySelector(`.check-item[data-rule="${rule}"]`);
                if (checkElement) {
                    const checkIcon = checkElement.querySelector('span');
                    if (passwordChecksState[rule]) {
                        checkElement.classList.add('valid');
                        checkElement.classList.remove('invalid');
                        checkIcon.textContent = '✔';
                    } else {
                        checkElement.classList.add('invalid');
                        checkElement.classList.remove('valid');
                        checkIcon.textContent = '✖';
                    }
                }
            });
            
            // Trigger feedback colors on input box itself
            const allChecksPassed = Object.values(passwordChecksState).every(val => val === true);
            if (passwordValue === '') {
                signupPassword.classList.remove('valid', 'invalid');
            } else {
                toggleFieldUI(signupPassword, allChecksPassed);
            }
            
            validateSignupForm();
        });
    }

    // Validate inputs to enable/disable Signup Submit Button
    const validateSignupForm = () => {
        const firstnameValue = signupFirstname.value.trim();
        const lastnameValue = signupLastname.value.trim();
        const emailValue = signupEmail.value.trim();
        const pursuingValue = signupPursuing.value;
        const streamValue = signupStream.value;
        
        const isEmailValid = emailRegex.test(emailValue);
        const isPasswordValid = Object.values(passwordChecksState).every(val => val === true);
        
        const isFormValid = firstnameValue !== '' && 
                            lastnameValue !== '' && 
                            isEmailValid && 
                            isPasswordValid && 
                            pursuingValue !== '' && 
                            streamValue !== '';
        
        if (isFormValid) {
            signupSubmitBtn.removeAttribute('disabled');
        } else {
            signupSubmitBtn.setAttribute('disabled', 'true');
        }
    };

    // Input listeners for other form fields to validate submission state
    if (signupFirstname) signupFirstname.addEventListener('input', validateSignupForm);
    if (signupLastname) signupLastname.addEventListener('input', validateSignupForm);

    // ==========================================================================
    // Form Submission Actions (Transitions to Student Dashboard)
    // ==========================================================================
    
    // Dynamic Syllabus Items Database based on chosen streams
    const syllabusDatabase = {
        '10th': {
            'cbse': ['Maths: Algebra & Statistics', 'Science: Physics, Chemistry & Life Processes', 'Social Science: Democratic Politics & Geography', 'English Communicative: Prose & Poetry'],
            'ssc': ['Mathematics: Functions & Geometry', 'Physical Sciences: Chemistry Elements', 'Biological Sciences: Human Physiology', 'Social Studies: Regional Economics & History'],
            'icse': ['Maths: Pure Mathematics & Matrices', 'Physics: Light & Sound Waves', 'Chemistry: Metallurgy & Organic Chem', 'Commercial Studies & Computer Apps']
        },
        'inter': {
            'mpc': ['Mathematics I & II: Calculus & Vectors', 'Physics: Kinematics & Modern Physics', 'Chemistry: Stoichiometry & Organic Chemistry'],
            'bpc': ['Botany: Taxonomy & Plant Kingdom', 'Zoology: Human Physiology & Anatomy', 'Chemistry: Solutions & Elements Processes'],
            'mec': ['Mathematics: Business Statistics', 'Economics: Macro/Micro Concepts', 'Commerce: Accounting Principles'],
            'cec': ['Civics: Indian Political System', 'Economics: Indian Economics Dynamics', 'Commerce: Financial Accounting'],
            'hec': ['History: Ancient & Modern Indian History', 'Economics: Public Finance', 'Civics: Local Governance Systems']
        },
        'diploma': {
            'computer': ['Applied Mathematics & Logic Design', 'C Programming & Structures', 'Digital Systems & Architecture', 'Data Structures & Algorithms Lab'],
            'electronics': ['Electronic Devices & Solid Circuits', 'Network Analysis & Signals', 'Linear Integrated Circuits', 'Microprocessors & Controllers'],
            'electrical': ['Basic Electrical Principles', 'AC & DC Machines', 'Power Generation Systems', 'Electrical Instruments & Measurements'],
            'mechanical': ['Engineering Mechanics & Strengths', 'Thermodynamics & Heat Cycles', 'Fluid Mechanics & Turbines', 'Manufacturing Workshop Practice'],
            'civil': ['Surveying & Leveling Methods', 'Strength of Materials', 'Concrete Tech & Hydraulics', 'Building Construction & Drawing']
        },
        'btech': {
            'cse': ['Data Structures & Algorithmic Analysis', 'Database Management Systems (DBMS)', 'Operating Systems (OS)', 'Theory of Computation (FLAT)', 'Object-Oriented Programming (Java/C++)'],
            'it': ['Web Technologies & Full Stack', 'Computer Networks & TCP/IP', 'Cloud Computing Architecture', 'Information Security & Cryptography'],
            'ece': ['Analog & Digital Communications', 'Microprocessors & Interfacing', 'VLSI Design & Fabrication', 'Digital Signal Processing (DSP)'],
            'eee': ['Power Systems Analysis', 'Control Systems Theory', 'Power Electronics & Converters', 'Electrical Machines Design'],
            'mech': ['Dynamics of Machinery', 'Heat & Mass Transfer', 'Finite Element Analysis (FEA)', 'CAD/CAM & Computer Integrated Mfg'],
            'civil': ['Structural Analysis & Steel Design', 'Geotechnical Engineering & Soils', 'Water Resource Management', 'Transportation & Highways Engineering'],
            'aiml': ['Artificial Intelligence Principles', 'Machine Learning Foundations', 'Deep Learning & Neural Networks', 'Natural Language Processing (NLP)'],
            'data-science': ['Probability & Statistics for DS', 'Data Mining & Warehousing', 'Data Visualization & Tableau', 'Big Data Technologies (Hadoop/Spark)']
        }
    };

    // Render Student Dashboard Modal with dynamic personalized data
    const loadDashboard = (firstname, lastname, email, pursuing, streamCode) => {
        // Name and Initial Avatar
        const fullname = `${firstname} ${lastname}`;
        dbUserName.textContent = fullname;
        dbUserFirstname.textContent = firstname;
        dbAvatar.textContent = `${firstname.charAt(0).toUpperCase()}${lastname.charAt(0).toUpperCase()}`;
        
        // Course Level Label Conversion
        let pursuingLabel = '';
        switch(pursuing) {
            case '10th': pursuingLabel = "10's Class"; break;
            case 'inter': pursuingLabel = 'Intermediate'; break;
            case 'diploma': pursuingLabel = 'Diploma'; break;
            case 'btech': pursuingLabel = 'B.Tech'; break;
            default: pursuingLabel = pursuing;
        }

        // Stream Label Lookup
        let streamLabel = 'General Stream';
        const streamArray = streamsData[pursuing] || [];
        const matchingStream = streamArray.find(s => s.value === streamCode);
        if (matchingStream) {
            streamLabel = matchingStream.text;
        }

        dbUserStream.textContent = `${pursuingLabel} - ${streamLabel}`;
        dbSyllabusTitle.textContent = streamLabel;

        // Render dynamic syllabus listing
        dbSyllabusList.innerHTML = '';
        const streamSyllabus = (syllabusDatabase[pursuing] && syllabusDatabase[pursuing][streamCode]) || ['General Physics', 'General Chemistry', 'Basic Mathematics'];
        
        streamSyllabus.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            dbSyllabusList.appendChild(li);
        });

        // Toggle Modals
        closeAuthModal();
        dashboardModal.classList.add('active');
    };

    // Sign Up Submission
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const firstname = signupFirstname.value.trim();
            const lastname = signupLastname.value.trim();
            const email = signupEmail.value.trim();
            const pursuing = signupPursuing.value;
            const stream = signupStream.value;
            
            loadDashboard(firstname, lastname, email, pursuing, stream);
        });
    }

    // Login Submission
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = loginEmail.value.trim();
            const password = loginPassword.value;
            
            if (emailRegex.test(email) && password.length > 0) {
                // Simulate dashboard login with sample dummy data matching email user
                const splitEmail = email.split('@')[0];
                const firstname = splitEmail.charAt(0).toUpperCase() + splitEmail.slice(1) || 'Student';
                loadDashboard(firstname, 'Member', email, 'btech', 'cse');
            } else {
                loginEmail.classList.add('invalid');
                loginPassword.classList.add('invalid');
            }
        });
    }

    // Close Dashboard Modal
    if (dashboardCloseBtn) {
        dashboardCloseBtn.addEventListener('click', () => {
            dashboardModal.classList.remove('active');
        });
    }

    dashboardModal.addEventListener('click', (e) => {
        if (e.target === dashboardModal) {
            dashboardModal.classList.remove('active');
        }
    });

});
