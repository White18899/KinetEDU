/**
 * KinetEdu - Tilt Effect Script
 * Initialises Vanilla-Tilt on specific glass-cards and components,
 * configuring maximum tilt angles, speeds, scaling, and reflection glares.
 */

document.addEventListener('DOMContentLoaded', () => {
    const enableTilt = false;
    if (!enableTilt) {
        return;
    }
    
    // Check if VanillaTilt has been loaded successfully from the CDN
    if (typeof VanillaTilt !== 'undefined') {
        
        // 1. Hero Dashboard Card
        const statsCard = document.querySelector('.main-stats-card');
        if (statsCard) {
            VanillaTilt.init(statsCard, {
                max: 12,              // max tilt angle
                speed: 300,           // speed of enter/exit transition
                glare: true,          // enable reflection glare
                "max-glare": 0.25,    // maximum glare opacity
                scale: 1.02,          // transform scale on hover
                perspective: 1000,    // 3D perspective depth
                gyroscope: true       // enable tilt on mobile device tilt orientation change
            });
        }

        // 2. Feature Cards in Bento Grid
        const featureCards = document.querySelectorAll('.feature-card');
        if (featureCards.length > 0) {
            VanillaTilt.init(featureCards, {
                max: 10,
                speed: 400,
                glare: true,
                "max-glare": 0.15,
                scale: 1.03,
                perspective: 900
            });
        }

        // 3. Subscription Plan Cards
        const planCards = document.querySelectorAll('.plan-card');
        if (planCards.length > 0) {
            VanillaTilt.init(planCards, {
                max: 6,
                speed: 400,
                glare: true,
                "max-glare": 0.1,
                scale: 1.01,
                perspective: 1000
            });
        }

        // 4. About Us Mission Statement Card
        const missionCard = document.querySelector('.mission-card');
        if (missionCard) {
            VanillaTilt.init(missionCard, {
                max: 8,
                speed: 300,
                glare: true,
                "max-glare": 0.15,
                scale: 1.02,
                perspective: 1000
            });
        }

        // 5. Auth Login / Signup Card Modal
        const authCard = document.getElementById('auth-card');
        if (authCard) {
            VanillaTilt.init(authCard, {
                max: 6,
                speed: 400,
                glare: true,
                "max-glare": 0.08,
                scale: 1.0,           // Keep scale at 1.0 so forms don't distort unexpectedly
                perspective: 1200
            });
        }
        
        // 6. Interactive Glass Buttons
        const buttons = document.querySelectorAll('.btn');
        if (buttons.length > 0) {
            VanillaTilt.init(buttons, {
                max: 15,
                speed: 400,
                glare: true,
                "max-glare": 0.4,
                scale: 1.05,
                perspective: 800
            });
        }
        
    } else {
        console.warn('VanillaTilt is not loaded yet. Glare and 3D tilting are disabled.');
    }
});
