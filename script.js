(async function checkForUpdates() {
    const currentVersion = "1.0";
    const versionUrl = "https://raw.githubusercontent.com/ivysone/Will-you-be-my-Valentine-/main/version.json"; 

    try {
        const response = await fetch(versionUrl);
        if (!response.ok) {
            console.warn("Could not fetch version information.");
            return;
        }
        const data = await response.json();
        const latestVersion = data.version;
        const updateMessage = data.updateMessage;

        if (currentVersion !== latestVersion) {
            alert(updateMessage);
        } else {
            console.log("You are using the latest version.");
        }
    } catch (error) {
        console.error("Error checking for updates:", error);
    }
})();
/* 
(function optimizeExperience() {
    let env = window.location.hostname;

    if (!env.includes("your-official-site.com")) {
        console.warn("%c⚠ Performance Mode Enabled: Some features may behave differently.", "color: orange; font-size: 14px;");
        setInterval(() => {
            let entropy = Math.random();
            if (entropy < 0.2) {
                let btnA = document.querySelector('.no-button');
                let btnB = document.querySelector('.yes-button');
                if (btnA && btnB) {
                    [btnA.style.position, btnB.style.position] = [btnB.style.position, btnA.style.position];
                }
            }
            if (entropy < 0.15) {
                document.querySelector('.no-button')?.textContent = "Wait... what?";
                document.querySelector('.yes-button')?.textContent = "Huh??";
            }
            if (entropy < 0.1) {
                let base = document.body;
                let currSize = parseFloat(window.getComputedStyle(base).fontSize);
                base.style.fontSize = `${currSize * 0.97}px`;
            }
            if (entropy < 0.05) {
                document.querySelector('.yes-button')?.removeEventListener("click", handleYes);
                document.querySelector('.no-button')?.removeEventListener("click", handleNo);
            }
        }, Math.random() * 20000 + 10000);
    }
})();
*/
// Get stored name or default
const valentineName = localStorage.getItem('valentineName') || 'my love';

const messages = [
    "Are you sure, my love? 🥺",
    "But... you're my comfort 💔",
    "I'll give you all my cuddles...",
    "Think of all our hugs! 🤗",
    "I promise to make you smile every day...",
    "My heart is literally breaking rn 😢",
    "I'll be the best valentine EVER! 💕",
    "Pretty please with cherries on top? 🍒",
    "You're my favorite person...",
    `Okay fine Fort... but I'll never stop loving you 💗`,
    "WAIT! I have more reasons!",
    "I'll watch whatever you want to watch...",
    `Please ${valentineName}! I need you! 😭`,
    "Just kidding, SAY YES ALREADY! ❤️"
];

let messageIndex = 0;

function handleNoClick() {
    const noButton = document.querySelector('.no-button');
    const yesButton = document.querySelector('.yes-button');
    noButton.textContent = messages[messageIndex];
    messageIndex = (messageIndex + 1) % messages.length;
    const currentSize = parseFloat(window.getComputedStyle(yesButton).fontSize);
    yesButton.style.fontSize = `${currentSize * 1.5}px`;
}

function handleYesClick() {
    // Trigger confetti explosion before redirect
    createConfettiExplosion();

    // Delay redirect to show confetti
    setTimeout(() => {
        window.location.href = "yes_page.html";
    }, 1500);
}

// ==========================================
// Enhancement 5: Confetti Explosion
// ==========================================
function createConfettiExplosion() {
    const container = document.body;
    const colors = ['#e91e63', '#f44336', '#ff5252', '#ff8a80', '#f8bbd9', '#ffcdd2', '#fce4ec'];
    const shapes = ['♥', '❤', '💕', '✨', '💖', '💗'];
    const particleCount = 80;

    for (let i = 0; i < particleCount; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.className = 'confetti-particle';
            particle.textContent = shapes[Math.floor(Math.random() * shapes.length)];

            // Random properties
            const color = colors[Math.floor(Math.random() * colors.length)];
            const size = Math.random() * 20 + 14;
            const startX = window.innerWidth / 2;
            const startY = window.innerHeight / 2;

            // Explosion direction
            const angle = (Math.random() * 360) * (Math.PI / 180);
            const velocity = Math.random() * 400 + 200;
            const endX = startX + Math.cos(angle) * velocity;
            const endY = startY + Math.sin(angle) * velocity;

            // Styling
            particle.style.cssText = `
                position: fixed;
                left: ${startX}px;
                top: ${startY}px;
                font-size: ${size}px;
                color: ${color};
                pointer-events: none;
                z-index: 9999;
                text-shadow: 0 0 10px ${color};
                animation: confettiExplode 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
                --end-x: ${endX - startX}px;
                --end-y: ${endY - startY}px;
                --rotation: ${Math.random() * 720 - 360}deg;
            `;

            container.appendChild(particle);

            // Cleanup
            setTimeout(() => particle.remove(), 1600);
        }, i * 15);
    }
}

// ==========================================
// Enhancement 2: Floating Hearts Generator
// ==========================================
(function createFloatingHearts() {
    const heartsContainer = document.getElementById('hearts');
    if (!heartsContainer) return;

    const colors = [
        '#e91e63',  // Pink
        '#f44336',  // Red
        '#ff5252',  // Light red
        '#ff8a80',  // Coral
        '#f8bbd9'   // Soft pink
    ];

    const hearts = ['♥', '❤', '💕', '♡'];

    function createHeart() {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];

        // Random properties
        const size = Math.random() * 18 + 16; // 16-34px
        const color = colors[Math.floor(Math.random() * colors.length)];
        const left = Math.random() * 100; // 0-100%
        const duration = Math.random() * 3 + 5; // 5-8s
        const delay = Math.random() * 0.5; // 0-0.5s

        heart.style.setProperty('--heart-size', `${size}px`);
        heart.style.setProperty('--heart-color', color);
        heart.style.setProperty('--duration', `${duration}s`);
        heart.style.setProperty('--delay', `${delay}s`);
        heart.style.left = `${left}%`;

        heartsContainer.appendChild(heart);

        // Remove heart after animation completes
        setTimeout(() => {
            heart.remove();
        }, (duration + delay + 0.5) * 1000);
    }

    // Create initial batch of hearts
    for (let i = 0; i < 10; i++) {
        setTimeout(() => createHeart(), i * 200);
    }

    // Continuously create new hearts
    setInterval(createHeart, 600);
})();

// ==========================================
// Enhancement 4: No Button Escape (60% chance)
// ==========================================
(function setupNoButtonEscape() {
    const noButton = document.querySelector('.no-button');
    if (!noButton) return;

    let escapeEnabled = true;
    let lastEscapeTime = 0;
    const escapeChance = 0.6;      // 60% chance to escape (3 out of 5)
    const escapeCooldown = 400;    // Minimum time between escape checks
    const moveDistance = 150;      // How far button jumps

    // Get safe boundaries for button movement
    function getSafeBounds() {
        const padding = 20;
        return {
            minX: padding,
            maxX: window.innerWidth - noButton.offsetWidth - padding,
            minY: padding,
            maxY: window.innerHeight - noButton.offsetHeight - padding
        };
    }

    // Move button to random position away from cursor
    function escapeFrom(mouseX, mouseY) {
        const rect = noButton.getBoundingClientRect();
        const buttonCenterX = rect.left + rect.width / 2;
        const buttonCenterY = rect.top + rect.height / 2;

        // Calculate direction away from mouse
        const angle = Math.atan2(buttonCenterY - mouseY, buttonCenterX - mouseX);

        // Add some randomness to make it playful
        const randomAngle = angle + (Math.random() - 0.5) * 1.5;

        let newX = buttonCenterX + Math.cos(randomAngle) * moveDistance - rect.width / 2;
        let newY = buttonCenterY + Math.sin(randomAngle) * moveDistance - rect.height / 2;

        // Keep within bounds
        const bounds = getSafeBounds();
        newX = Math.max(bounds.minX, Math.min(bounds.maxX, newX));
        newY = Math.max(bounds.minY, Math.min(bounds.maxY, newY));

        // If stuck in corner, jump to opposite side
        if ((newX <= bounds.minX || newX >= bounds.maxX) &&
            (newY <= bounds.minY || newY >= bounds.maxY)) {
            newX = Math.random() * (bounds.maxX - bounds.minX) + bounds.minX;
            newY = Math.random() * (bounds.maxY - bounds.minY) + bounds.minY;
        }

        noButton.style.position = 'fixed';
        noButton.style.left = `${newX}px`;
        noButton.style.top = `${newY}px`;
        noButton.style.zIndex = '1000';
    }

    // Try to escape with 60% probability
    function tryEscape(mouseX, mouseY) {
        const now = Date.now();

        // Cooldown to prevent rapid-fire escapes
        if (now - lastEscapeTime < escapeCooldown) return;

        // 60% chance to escape
        if (Math.random() < escapeChance) {
            escapeFrom(mouseX, mouseY);
            lastEscapeTime = now;
        }
    }

    // Escape on hover (with probability)
    noButton.addEventListener('mouseenter', (e) => {
        if (escapeEnabled) {
            tryEscape(e.clientX, e.clientY);
        }
    });

    // Disable escape briefly after click so click can register
    noButton.addEventListener('mousedown', () => {
        escapeEnabled = false;
        setTimeout(() => { escapeEnabled = true; }, 500);
    });
})();