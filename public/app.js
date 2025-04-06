document.addEventListener('DOMContentLoaded', () => {
    // Age Verification
    const ageVerificationModal = document.getElementById('ageVerificationModal');
    const ageConfirmBtn = document.getElementById('ageConfirmBtn');
    const ageDenyBtn = document.getElementById('ageDenyBtn');

    // Check if user has already verified their age
    if (!localStorage.getItem('ageVerified')) {
        ageVerificationModal.style.display = 'flex';
        document.body.classList.add('modal-open');
    }

    // Handle age confirmation
    ageConfirmBtn.addEventListener('click', () => {
        localStorage.setItem('ageVerified', 'true');
        ageVerificationModal.style.display = 'none';
        document.body.classList.remove('modal-open');
    });

    // Handle age denial
    ageDenyBtn.addEventListener('click', () => {
        // Redirect to a safe website
        window.location.href = 'https://www.google.com';
    });

    // Initialize game cards
    const gameCards = document.querySelectorAll('.game-card');
    gameCards.forEach(card => {
        card.addEventListener('click', () => {
            const gameType = card.dataset.game;
            // Handle game selection
            console.log(`Selected game: ${gameType}`);
        });
    });

    // Handle contact form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalBtnText = submitBtn.textContent;
            
            try {
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;
                
                // Create FormData object
                const formData = new FormData(contactForm);
                
                // Submit to Netlify
                const response = await fetch('/', {
                    method: 'POST',
                    body: formData
                });
                
                if (response.ok) {
                    // Show success message
                    showModal(`
                        <div class="success-modal">
                            <h2><i class="fas fa-check-circle"></i> Message Sent!</h2>
                            <p>Thank you for contacting us. We'll get back to you soon.</p>
                            <button class="modal-btn" onclick="closeModal()">Close</button>
                        </div>
                    `);
                    
                    // Reset form
                    contactForm.reset();
                } else {
                    throw new Error('Failed to send message');
                }
                
            } catch (error) {
                console.error('Contact form error:', error);
                showModal(`
                    <div class="error-modal">
                        <h2><i class="fas fa-exclamation-circle"></i> Error</h2>
                        <p>Sorry, there was an error sending your message. Please try again later.</p>
                        <button class="modal-btn" onclick="closeModal()">Close</button>
                    </div>
                `);
            } finally {
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }
});

function startGame(gameType) {
    // Show game-specific modal
    const modal = document.createElement('div');
    modal.className = 'game-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>${gameType.charAt(0).toUpperCase() + gameType.slice(1)}</h2>
            <div class="game-container" id="game-container">
                <!-- Game content will be loaded here -->
            </div>
            <button class="close-btn">Close</button>
        </div>
    `;

    document.body.appendChild(modal);

    // Initialize specific game
    switch(gameType) {
        case 'slots':
            initSlotsGame();
            break;
        case 'blackjack':
            initBlackjackGame();
            break;
        case 'poker':
            initPokerGame();
            break;
    }

    // Close button functionality
    const closeBtn = modal.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
}

function initSlotsGame() {
    const container = document.getElementById('game-container');
    container.innerHTML = `
        <div class="slots-machine">
            <div class="slots-reel" id="reel1">🍒</div>
            <div class="slots-reel" id="reel2">🍒</div>
            <div class="slots-reel" id="reel3">🍒</div>
        </div>
        <button class="spin-btn">Spin</button>
    `;

    const spinBtn = container.querySelector('.spin-btn');
    spinBtn.addEventListener('click', () => {
        spinSlots();
    });
}

function spinSlots() {
    const symbols = ['🍒', '🍊', '🍋', '🍇', '7️⃣', '💎'];
    const reels = [
        document.getElementById('reel1'),
        document.getElementById('reel2'),
        document.getElementById('reel3')
    ];

    reels.forEach(reel => {
        reel.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    });

    // Check for win
    if (reels[0].textContent === reels[1].textContent && 
        reels[1].textContent === reels[2].textContent) {
        showWinMessage('Congratulations! You won!');
    }
}

function initBlackjackGame() {
    const container = document.getElementById('game-container');
    container.innerHTML = `
        <div class="blackjack-table">
            <div class="dealer-hand">
                <h3>Dealer's Hand</h3>
                <div id="dealer-cards"></div>
            </div>
            <div class="player-hand">
                <h3>Your Hand</h3>
                <div id="player-cards"></div>
            </div>
            <div class="actions">
                <button class="hit-btn">Hit</button>
                <button class="stand-btn">Stand</button>
            </div>
        </div>
    `;

    // Initialize game logic
    startBlackjack();
}

function startBlackjack() {
    // Basic blackjack implementation
    const dealerCards = document.getElementById('dealer-cards');
    const playerCards = document.getElementById('player-cards');
    
    // Deal initial cards
    dealerCards.innerHTML = '<div class="card">🂠</div>';
    playerCards.innerHTML = '<div class="card">🂠</div><div class="card">🂠</div>';
}

function initPokerGame() {
    const container = document.getElementById('game-container');
    container.innerHTML = `
        <div class="poker-table">
            <div class="community-cards">
                <h3>Community Cards</h3>
                <div id="community-cards"></div>
            </div>
            <div class="player-cards">
                <h3>Your Cards</h3>
                <div id="player-hand"></div>
            </div>
            <div class="actions">
                <button class="deal-btn">Deal</button>
                <button class="fold-btn">Fold</button>
            </div>
        </div>
    `;

    // Initialize game logic
    startPoker();
}

function startPoker() {
    // Basic poker implementation
    const communityCards = document.getElementById('community-cards');
    const playerHand = document.getElementById('player-hand');
    
    // Deal initial cards
    communityCards.innerHTML = '<div class="card">🂠</div><div class="card">🂠</div><div class="card">🂠</div>';
    playerHand.innerHTML = '<div class="card">🂠</div><div class="card">🂠</div>';
}

function showWinMessage(message) {
    const winModal = document.createElement('div');
    winModal.className = 'win-modal';
    winModal.innerHTML = `
        <div class="win-content">
            <h2>${message}</h2>
            <button class="close-win-btn">Close</button>
        </div>
    `;

    document.body.appendChild(winModal);

    const closeBtn = winModal.querySelector('.close-win-btn');
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(winModal);
    });
}

function showAuthModal(type) {
    const modal = document.createElement('div');
    modal.className = 'auth-modal';
    modal.innerHTML = `
        <div class="auth-content">
            <h2>${type === 'login' ? 'Login' : 'Register'}</h2>
            <form id="auth-form">
                <input type="email" placeholder="Email" required>
                <input type="password" placeholder="Password" required>
                <button type="submit">${type === 'login' ? 'Login' : 'Register'}</button>
            </form>
            <button class="close-auth-btn">Close</button>
        </div>
    `;

    document.body.appendChild(modal);

    const closeBtn = modal.querySelector('.close-auth-btn');
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
    });

    const form = modal.querySelector('#auth-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        // Handle authentication
        document.body.removeChild(modal);
    });
}

// Game Modal
const gameModal = document.createElement('div');
gameModal.className = 'game-modal';
gameModal.innerHTML = `
    <div class="game-modal-content">
        <button class="close-game-modal"><i class="fas fa-times"></i></button>
        <div class="game-iframe-container">
            <iframe id="gameIframe" allowfullscreen></iframe>
        </div>
    </div>
`;
document.body.appendChild(gameModal);

// Game URLs
const gameUrls = {
    'cat-wilde': 'https://asccw.playngonetwork.com/casino/ContainerLauncher?pid=2&gid=catwildeeclipse&lang=en_GB&practice=1&channel=desktop&demo=2',
    'thunder-screech': 'https://asccw.playngonetwork.com/casino/ContainerLauncher?pid=2&gid=thunderscreech&lang=en_GB&practice=1&channel=desktop&demo=2',
    'lord-merlin': 'https://asccw.playngonetwork.com/casino/ContainerLauncher?pid=2&gid=ladyofthelake&lang=en_GB&practice=1&channel=desktop&demo=2',
    'alice-cooper': 'https://asccw.playngonetwork.com/casino/ContainerLauncher?pid=2&gid=alicecooper&lang=en_GB&practice=1&channel=desktop&demo=2',
    'charlie-chance': 'https://asccw.playngonetwork.com/casino/ContainerLauncher?pid=2&gid=charliechance&lang=en_GB&practice=1&channel=desktop&demo=2',
    'wild-class': 'https://asccw.playngonetwork.com/casino/ContainerLauncher?pid=2&gid=thewildclass&lang=en_GB&practice=1&channel=desktop&demo=2',
    'slots': 'https://asccw.playngonetwork.com/casino/ContainerLauncher?pid=2&gid=slots&lang=en_GB&practice=1&channel=desktop&demo=2'
};

// Play button click handler
document.querySelectorAll('.play-btn').forEach(button => {
    button.addEventListener('click', () => {
        const gameId = button.getAttribute('data-game');
        launchGame(gameId);
    });
});

// Close game modal
document.querySelector('.close-game-modal').addEventListener('click', () => {
    const iframe = document.getElementById('gameIframe');
    iframe.src = '';
    gameModal.style.display = 'none';
    document.body.classList.remove('modal-open');
});

// Close modal when clicking outside
gameModal.addEventListener('click', (e) => {
    if (e.target === gameModal) {
        const iframe = document.getElementById('gameIframe');
        iframe.src = '';
        gameModal.style.display = 'none';
        document.body.classList.remove('modal-open');
    }
});

function launchGame(gameId) {
    // Check if hardware acceleration is enabled
    const isHardwareAccelerated = () => {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) return false;
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        return debugInfo && gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) !== 'Google SwiftShader';
    };

    if (!isHardwareAccelerated()) {
        showModal(`
            <div class="hardware-acceleration-modal">
                <h2><i class="fas fa-exclamation-triangle"></i> Hardware Acceleration Required</h2>
                <p>To play our games, you need to enable hardware acceleration in your browser. Here's how:</p>
                <div class="browser-instructions">
                    <h3>Chrome/Edge:</h3>
                    <ol>
                        <li>Click the three dots (⋮) in the top right</li>
                        <li>Go to Settings > System</li>
                        <li>Enable "Use hardware acceleration when available"</li>
                        <li>Restart your browser</li>
                    </ol>
                    <h3>Firefox:</h3>
                    <ol>
                        <li>Type about:config in the address bar</li>
                        <li>Search for "layers.acceleration.force-enabled"</li>
                        <li>Set it to "true"</li>
                        <li>Restart your browser</li>
                    </ol>
                </div>
                <button class="modal-btn" onclick="closeModal()">Got it!</button>
            </div>
        `);
        return;
    }

    const gameUrl = gameUrls[gameId];
    if (gameUrl) {
        window.open(gameUrl, '_blank');
    }
}

function showModal(content) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = content;
    document.body.appendChild(modal);

    const closeBtn = modal.querySelector('.modal-btn');
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
}

function closeModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        document.body.removeChild(modal);
    }
} 