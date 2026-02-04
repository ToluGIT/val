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
const messages = [
    "Are you sure?",
    "Really sure??",
    "Are you positive?",
    "Pookie please...",
    "Just think about it!",
    "If you say no, I will be really sad...",
    "I will be very sad...",
    "I will be very very very sad...",
    "Ok fine, I will stop asking...",
    "Just kidding, say yes please! ❤️"
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
    window.location.href = "yes_page.html";
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
// Enhancement 4: No Button Escape
// ==========================================
(function setupNoButtonEscape() {
    const noButton = document.querySelector('.no-button');
    if (!noButton) return;

    let escapeEnabled = true;
    const escapeDistance = 100; // Distance at which button starts running
    const moveDistance = 150;   // How far button jumps

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

    // Check distance and escape if needed
    function checkDistance(e) {
        if (!escapeEnabled) return;

        const rect = noButton.getBoundingClientRect();
        const buttonCenterX = rect.left + rect.width / 2;
        const buttonCenterY = rect.top + rect.height / 2;

        const distance = Math.sqrt(
            Math.pow(e.clientX - buttonCenterX, 2) +
            Math.pow(e.clientY - buttonCenterY, 2)
        );

        if (distance < escapeDistance) {
            escapeFrom(e.clientX, e.clientY);
        }
    }

    // Track mouse movement
    document.addEventListener('mousemove', checkDistance);

    // Also escape on hover (backup)
    noButton.addEventListener('mouseenter', (e) => {
        if (escapeEnabled) {
            escapeFrom(e.clientX, e.clientY);
        }
    });

    // Disable escape briefly after click so click can register
    noButton.addEventListener('mousedown', () => {
        escapeEnabled = false;
        setTimeout(() => { escapeEnabled = true; }, 300);
    });
})();