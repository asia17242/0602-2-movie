// 90s Vintage Anime Landing Page Logic

document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initRemotePanel();
    initScouter();
    initAudioSynth();
    initNavigation();
    initTrailerVideo();
    initStoryboard();
});

/* --- Canvas Aura Particles Background --- */
function initParticles() {
    const canvas = document.getElementById('energy-particles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let particles = [];
    let mouse = { x: null, y: null };

    // Resize canvas
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Track mouse
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Particle Class
    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + Math.random() * 100;
            this.size = Math.random() * 4 + 1;
            this.speedY = -(Math.random() * 2 + 1);
            this.speedX = (Math.random() - 0.5) * 1.5;
            
            // Choose random aura color: Gold, Cyan, Purple
            const colors = [
                'rgba(255, 183, 3, 0.45)',  // Gold
                'rgba(0, 245, 212, 0.45)',  // Cyan
                'rgba(157, 78, 221, 0.45)'  // Purple
            ];
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.alpha = Math.random() * 0.5 + 0.3;
            this.decay = Math.random() * 0.005 + 0.002;
        }

        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            this.alpha -= this.decay;

            // Mouse interaction (repel particles slightly)
            if (mouse.x && mouse.y) {
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 120) {
                    const force = (120 - distance) / 120;
                    this.x += (dx / distance) * force * 3;
                }
            }

            if (this.alpha <= 0 || this.y < -20) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.shadowBlur = this.size * 2;
            ctx.shadowColor = this.color;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    // Initialize particle array
    const maxParticles = 120;
    for (let i = 0; i < maxParticles; i++) {
        particles.push(new Particle());
    }

    // Animation Loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw some rising aura waves
        ctx.fillStyle = 'rgba(6, 5, 11, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        requestAnimationFrame(animate);
    }
    animate();
}

/* --- System Control Panel (VHS/CRT Remote UI) --- */
function initRemotePanel() {
    const remotePanel = document.getElementById('remotePanel');
    const openPanelBtn = document.getElementById('openPanelBtn');
    const togglePanelBtn = document.getElementById('togglePanelBtn');
    const toggleCrtBtn = document.getElementById('toggleCrtBtn');
    const scanlineSpeed = document.getElementById('scanlineSpeed');

    // Default classes
    document.body.classList.add('crt-enabled');

    // Open/Close
    openPanelBtn.addEventListener('click', () => {
        remotePanel.classList.add('open');
        openPanelBtn.style.display = 'none';
    });

    togglePanelBtn.addEventListener('click', () => {
        remotePanel.classList.remove('open');
        openPanelBtn.style.display = 'flex';
    });

    // Toggle CRT Overlay
    toggleCrtBtn.addEventListener('click', () => {
        const isActive = document.body.classList.toggle('crt-enabled');
        toggleCrtBtn.textContent = isActive ? 'ON' : 'OFF';
        toggleCrtBtn.classList.toggle('active', isActive);
    });

    // Adjust scanline animation speed
    scanlineSpeed.addEventListener('input', (e) => {
        const val = e.target.value;
        // Map 5 - 30 to animation duration seconds (faster is lower duration)
        const duration = 40 - val;
        const scanlineElement = document.getElementById('scanlines');
        if (scanlineElement) {
            scanlineElement.style.setProperty('--vhs-duration', `${duration}s`);
            // Dynamic inline keyframe timing replacement
            scanlineElement.style.animation = `none`;
            void scanlineElement.offsetHeight; // Trigger reflow
            scanlineElement.style.animation = null;
        }
    });
}

/* --- Retro Audio Synthesizer (Web Audio API) --- */
let audioCtx = null;
let auraHumOsc1 = null;
let auraHumOsc2 = null;
let auraHumGain = null;
let soundEnabled = false;

function initAudioSynth() {
    const toggleSoundBtn = document.getElementById('toggleSoundBtn');
    const synthVolume = document.getElementById('synthVolume');

    toggleSoundBtn.addEventListener('click', () => {
        if (!audioCtx) {
            // Lazy load audio context on user interaction
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }

        soundEnabled = !soundEnabled;
        toggleSoundBtn.textContent = soundEnabled ? 'ON' : 'OFF';
        toggleSoundBtn.classList.toggle('active', soundEnabled);

        if (soundEnabled) {
            startAuraHum();
        } else {
            stopAuraHum();
        }
    });

    synthVolume.addEventListener('input', (e) => {
        const volumeVal = e.target.value / 100;
        if (auraHumGain && audioCtx) {
            auraHumGain.gain.setValueAtTime(volumeVal * 0.15, audioCtx.currentTime);
        }
    });

    // Synthesize mouse-movement responsive frequency sweep
    window.addEventListener('mousemove', (e) => {
        if (!soundEnabled || !audioCtx || !auraHumOsc1) return;
        
        // Map mouse position to pitch sweep (resonance)
        const ratio = e.clientY / window.innerHeight;
        const targetFreq = 50 + (ratio * 40); // sweeps from 50Hz to 90Hz
        
        auraHumOsc1.frequency.setTargetAtTime(targetFreq, audioCtx.currentTime, 0.2);
        auraHumOsc2.frequency.setTargetAtTime(targetFreq * 2, audioCtx.currentTime, 0.2);
    });
}

function startAuraHum() {
    if (!audioCtx) return;
    
    // Resume context if suspended (browser safety)
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    // Create Oscillators for a rich retro synthetic hum
    auraHumOsc1 = audioCtx.createOscillator();
    auraHumOsc2 = audioCtx.createOscillator();
    auraHumGain = audioCtx.createGain();
    
    // Low frequency sub hum
    auraHumOsc1.type = 'sine';
    auraHumOsc1.frequency.setValueAtTime(55, audioCtx.currentTime); // A1 note
    
    // Harmonics hum
    auraHumOsc2.type = 'triangle';
    auraHumOsc2.frequency.setValueAtTime(110, audioCtx.currentTime);

    // Master volume slider value
    const volumeSlider = document.getElementById('synthVolume');
    const initialVol = volumeSlider ? volumeSlider.value / 100 : 0.3;

    auraHumGain.gain.setValueAtTime(initialVol * 0.15, audioCtx.currentTime);

    // Bandpass filter to create that retro sweeping energy field vibe
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(120, audioCtx.currentTime);
    filter.Q.setValueAtTime(1.0, audioCtx.currentTime);

    // Modulator for filter frequency
    const filterModulator = audioCtx.createOscillator();
    const modulatorGain = audioCtx.createGain();
    filterModulator.frequency.setValueAtTime(0.5, audioCtx.currentTime); // 0.5Hz modulation sweep
    modulatorGain.gain.setValueAtTime(40, audioCtx.currentTime); // sweeps filter range by +/-40Hz

    filterModulator.connect(modulatorGain);
    modulatorGain.connect(filter.frequency);

    // Connections
    auraHumOsc1.connect(filter);
    auraHumOsc2.connect(filter);
    filter.connect(auraHumGain);
    auraHumGain.connect(audioCtx.destination);

    // Start Oscillators
    auraHumOsc1.start();
    auraHumOsc2.start();
    filterModulator.start();
}

function stopAuraHum() {
    if (auraHumOsc1) {
        try { auraHumOsc1.stop(); } catch(e) {}
        auraHumOsc1 = null;
    }
    if (auraHumOsc2) {
        try { auraHumOsc2.stop(); } catch(e) {}
        auraHumOsc2 = null;
    }
}

// Scouter radar blips & scanner power scale sound synthesis
function playScouterBeep(pitch, duration, type = 'square') {
    if (!soundEnabled || !audioCtx) return;
    
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(pitch, audioCtx.currentTime);
    
    // Quick ramp down to simulate retro sound hardware
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
}

/* --- DBZ-style Energy Scouter Scanner --- */
function initScouter() {
    const scouterForm = document.getElementById('scouterForm');
    const scanBtn = document.getElementById('scanBtn');
    const scouterReadout = document.getElementById('scouterReadout');
    const powerTicker = document.getElementById('powerTicker');
    const scannerHud = document.querySelector('.scanner-hud');
    const verticalBarFill = document.querySelector('.hud-bar-fill');

    if (!scouterForm) return;

    scouterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const nameInput = document.getElementById('userName').value.trim();
        const emotionSelect = document.getElementById('userEmotion').value;

        if (!nameInput) return;

        // Reset HUD danger state
        scannerHud.classList.remove('hud-danger');
        
        // 1. Scanning State
        scanBtn.disabled = true;
        scanBtn.querySelector('span').textContent = 'SCANNING...';
        scouterReadout.innerHTML = `<div class="scanning-active">SCANNING AURA SIGNATURE...</div>`;
        powerTicker.textContent = '000000';

        // Custom seeded random number generator based on name
        let seed = 0;
        for (let i = 0; i < nameInput.length; i++) {
            seed += nameInput.charCodeAt(i);
        }

        // Apply emotion multiplier
        let multiplier = 1.0;
        switch (emotionSelect) {
            case 'calm': multiplier = 0.85; break;
            case 'raging': multiplier = 1.6; break;
            case 'desperate': multiplier = 2.1; break;
            case 'focused': multiplier = 1.25; break;
        }

        // Calculate custom power levels & descriptions
        let powerLevel = Math.floor(((seed * 37) % 85000) * multiplier) + 1200;
        let auraColor = 'Green';
        let auraDescr = 'Faint, calm spiritual particles detected.';

        // Easter eggs
        const lowerName = nameInput.toLowerCase();
        if (lowerName === 'goku' || lowerName === 'kakarot') {
            powerLevel = 90001;
            auraColor = 'Blazing Golden Dragon';
            auraDescr = 'EXTREME DANGER. Subject has broken limit parameters. Super Saiyan readings!';
        } else if (lowerName === 'vegeta') {
            powerLevel = 89999;
            auraColor = 'Violent Royal Blue';
            auraDescr = 'Unbelievable destructive energy. Target claims to be the Prince of all Saiyans.';
        } else if (lowerName === 'yusuke' || lowerName === 'yusuke urameshi') {
            powerLevel = 120000;
            auraColor = 'Mazoku Demon-Spirit Cyan';
            auraDescr = 'Mazoku ancestry trace detected. Wields incredible spirit wave capabilities.';
        } else if (lowerName === 'hiei') {
            powerLevel = 95000;
            auraColor = 'Dark Black Flame';
            auraDescr = 'Tears in spacetime detected. Target summons the Dragon of the Darkness Flame.';
        } else if (lowerName === 'antigravity') {
            powerLevel = 999999;
            auraColor = 'Hyper-Agentic Cosmic White';
            auraDescr = 'System overflow. Target has transcended human combat capabilities.';
        } else {
            // General categories for other names
            if (powerLevel > 130000) {
                auraColor = 'Chaos Violet';
                auraDescr = 'Colossal energy detected. Highly unstable combat profile.';
            } else if (powerLevel > 90000) {
                auraColor = 'Supernatural Crimson';
                auraDescr = 'Critical spirit compression. Fighter is ready to explode.';
            } else if (powerLevel > 45000) {
                auraColor = 'Electric Cyan';
                auraDescr = 'Highly concentrated lightning particles. Swift and deadly.';
            } else if (powerLevel > 20000) {
                auraColor = 'Jade Dragon';
                auraDescr = 'Sturdy earth energy. Reliable guard and deep reserves.';
            }
        }

        // 2. Play scouter sound loops during calculation
        let beepInterval = setInterval(() => {
            playScouterBeep(800 + Math.random() * 400, 0.05, 'square');
        }, 100);

        // 3. Animate Ticker numbers
        let currentTick = 0;
        const tickDuration = 2000; // 2 seconds scan
        const tickStep = 20;
        const totalSteps = tickDuration / tickStep;
        const increment = powerLevel / totalSteps;

        let tickerInterval = setInterval(() => {
            currentTick += increment;
            if (currentTick >= powerLevel) {
                currentTick = powerLevel;
                clearInterval(tickerInterval);
            }
            
            // Format number to 6 digits with leading zeros
            const displayNum = Math.floor(currentTick).toString().padStart(6, '0');
            powerTicker.textContent = displayNum;
            
            // Dynamic bar height
            if (verticalBarFill) {
                verticalBarFill.style.height = `${(currentTick / Math.max(powerLevel, 100000)) * 100}%`;
            }
        }, tickStep);

        // 4. Conclude scan after 2 seconds
        setTimeout(() => {
            clearInterval(beepInterval);
            
            // Final beep effect
            if (powerLevel > 90000) {
                // Warning alarm sound!
                playScouterBeep(440, 0.3, 'sine');
                setTimeout(() => playScouterBeep(440, 0.3, 'sine'), 400);
                scannerHud.classList.add('hud-danger');
            } else {
                playScouterBeep(1200, 0.15, 'triangle');
            }

            // Update UI with result
            scouterReadout.innerHTML = `
                <div class="scan-result-title">TARGET: ${nameInput.toUpperCase()}</div>
                <div class="scan-result-power">POWER: ${powerLevel.toLocaleString()}</div>
                <div style="font-size:0.7rem; color:var(--cyan); margin-top:2px;">AURA: ${auraColor.toUpperCase()}</div>
                <div style="font-size:0.6rem; color:#8c89a0; margin-top:4px; line-height:1.2;">${auraDescr}</div>
            `;

            // Reset scan button
            scanBtn.disabled = false;
            scanBtn.querySelector('span').textContent = 'SCAN AGAIN';
        }, tickDuration);
    });
}

/* --- Navigation Active Link Tracking --- */
function initNavigation() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let currentSectionId = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // Trigger 150px before screen center
            if (pageYOffset >= (sectionTop - 150)) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });
}

/* --- VHS Trailer Video Player --- */
function initTrailerVideo() {
    const playOverlay = document.getElementById('videoPlayOverlay');
    const playBtnLarge = document.getElementById('playBtnLarge');
    const vhsCabinet = document.querySelector('.vhs-cabinet');
    const vhsPlayBtn = document.getElementById('vhsPlayBtn');
    const vhsPauseBtn = document.getElementById('vhsPauseBtn');
    const vhsMuteBtn = document.getElementById('vhsMuteBtn');
    const osdStatus = document.getElementById('osdStatus');
    const osdTime = document.getElementById('osdTime');
    
    // Canvas & Video Elements
    const canvas = document.getElementById('fightCanvas');
    const video = document.getElementById('teaserVideo');
    const vhsFile = document.getElementById('vhsFile');

    if (!canvas || !video) return;
    const ctx = canvas.getContext('2d');

    let isPlaying = false;
    let isMuted = true;
    let customVideoLoaded = false;
    let elapsedSeconds = 0;
    
    let animFrameId = null;
    let osdInterval = null;

    // Set initial mute button state
    vhsMuteBtn.classList.add('active');
    vhsMuteBtn.textContent = 'UNMUTE';
    video.muted = true;

    // Format OSD Time
    function formatVhsTime(seconds) {
        const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
        const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
        const s = Math.floor(seconds % 60).toString().padStart(2, '0');
        const ms = Math.floor((seconds * 10) % 10).toString();
        return `SP  ${h}:${m}:${s}.${ms}`;
    }

    // --- 2D Fight Engine Simulation ---
    const game = {
        width: 640,
        height: 360,
        gravity: 0.5,
        groundY: 300,
        cameraShake: 0,
        speedlines: false,
        flash: 0,
        clashTimer: 0
    };

    class Fighter {
        constructor(name, x, color, side) {
            this.name = name;
            this.x = x;
            this.y = game.groundY;
            this.width = 40;
            this.height = 70;
            this.color = color;
            this.side = side; // 1 = facing right, -1 = facing left
            this.vx = 0;
            this.vy = 0;
            this.state = 'idle'; // idle, run, attack, charge, special, hit, jump
            this.stateTimer = 0;
            this.hp = 100;
            this.maxHp = 100;
            this.power = 0; // for specials
            this.isSuperSaiyan = false;
            this.punchFrame = 0;
        }

        update(opponent) {
            this.stateTimer++;

            // Handle Gravity
            if (this.y < game.groundY) {
                this.vy += game.gravity;
                this.y += this.vy;
                if (this.y >= game.groundY) {
                    this.y = game.groundY;
                    this.vy = 0;
                    this.state = 'idle';
                }
            }

            // Simple state machine AI
            const dist = Math.abs(opponent.x - this.x);

            if (this.state === 'idle') {
                this.vx = 0;
                if (dist > 80) {
                    this.state = 'run';
                } else {
                    if (Math.random() < 0.2) {
                        this.state = 'attack';
                        this.stateTimer = 0;
                        this.punchFrame = 0;
                    }
                }
            } else if (this.state === 'run') {
                const targetX = opponent.x + (opponent.x > this.x ? -60 : 60);
                this.vx = (targetX > this.x ? 3 : -3);
                
                // Animate running wobble
                this.y = game.groundY - Math.abs(Math.sin(this.stateTimer * 0.3) * 6);

                if (dist <= 70) {
                    this.state = 'attack';
                    this.stateTimer = 0;
                    this.punchFrame = 0;
                }
            } else if (this.state === 'attack') {
                this.vx = 0;
                if (this.stateTimer % 12 === 0) {
                    this.punchFrame = (this.punchFrame + 1) % 2;
                    // Check collision
                    if (dist <= 75 && opponent.state !== 'hit') {
                        opponent.state = 'hit';
                        opponent.stateTimer = 0;
                        opponent.vx = this.side * 4;
                        opponent.hp -= Math.floor(Math.random() * 5) + 3;
                        if (opponent.hp < 10) opponent.hp = 100; // prevent KO, keep loop endless

                        // Shake camera slightly
                        game.cameraShake = 5;

                        // Spark effect
                        createHitSpark(opponent.x, opponent.y - 35);

                        // Synthesize impact sound
                        if (!isMuted) playScouterBeep(120 + Math.random() * 80, 0.08, 'sawtooth');
                    }
                }

                if (this.stateTimer > 40) {
                    this.state = 'idle';
                    if (Math.random() < 0.3) {
                        // Back away to charge energy
                        this.state = 'charge';
                        this.stateTimer = 0;
                    }
                }
            } else if (this.state === 'charge') {
                // Back up slightly
                const targetX = opponent.x > this.x ? this.x - 3 : this.x + 3;
                this.x = Math.max(50, Math.min(game.width - 50, targetX));
                
                this.vx = 0;
                this.power += 1.5;

                // Play charge hum pitch
                if (!isMuted && this.stateTimer % 20 === 0) {
                    playScouterBeep(this.name === 'Goku' ? 300 : 450, 0.15, 'triangle');
                }

                if (this.power >= 100) {
                    this.state = 'special';
                    this.stateTimer = 0;
                    this.power = 0;
                    opponent.state = 'charge'; // Opponent also charges to clash!
                    opponent.stateTimer = 0;
                }
            } else if (this.state === 'special') {
                this.vx = 0;
                if (this.stateTimer === 1) {
                    if (this.name === 'Goku') {
                        this.isSuperSaiyan = true;
                        if (!isMuted) playStomachGrowl(); // rumble
                    } else {
                        if (!isMuted) playReiganCharge(); // charge beep
                    }
                }

                if (this.stateTimer === 60) {
                    // Release projectile!
                    if (this.name === 'Goku') {
                        projectiles.push(new Projectile(this.x + 30 * this.side, this.y - 35, 12 * this.side, 'gold', 'kamehameha'));
                    } else {
                        projectiles.push(new Projectile(this.x + 30 * this.side, this.y - 35, 10 * this.side, 'cyan', 'reigan'));
                    }
                }

                if (this.stateTimer > 110) {
                    this.state = 'idle';
                    this.isSuperSaiyan = false;
                }
            } else if (this.state === 'hit') {
                this.vx = opponent.x > this.x ? -1.5 : 1.5;
                if (this.stateTimer > 15) {
                    this.state = 'idle';
                }
            }

            // Move
            this.x += this.vx;
            this.x = Math.max(40, Math.min(game.width - 40, this.x));

            // Set Direction
            this.side = opponent.x > this.x ? 1 : -1;
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.scale(this.side, 1);

            // Draw Energy Aura
            if (this.state === 'charge') {
                drawAura(0, -35, this.name === 'Goku' ? 'orange' : 'cyan', Math.sin(Date.now() * 0.05) * 5 + 45);
            }
            if (this.state === 'special' && this.isSuperSaiyan) {
                drawAura(0, -35, '#ffb703', Math.sin(Date.now() * 0.1) * 8 + 55);
            }

            // --- Draw Retro Character Vector Shapes ---
            if (this.name === 'Goku') {
                // Orange Gi Body
                ctx.fillStyle = '#f85800'; // Orange
                ctx.fillRect(-15, -60, 30, 45);
                
                // Belt/Sash
                ctx.fillStyle = '#0000bc'; // Blue
                ctx.fillRect(-16, -28, 32, 6);
                
                // Blue Undershirt
                ctx.fillStyle = '#0000bc';
                ctx.fillRect(-10, -60, 20, 10);

                // Pants
                ctx.fillStyle = '#f85800';
                ctx.fillRect(-15, -22, 12, 22);
                ctx.fillRect(3, -22, 12, 22);
                
                // Boots
                ctx.fillStyle = '#000';
                ctx.fillRect(-14, 0, 10, 6);
                ctx.fillRect(4, 0, 10, 6);

                // Face / Head
                ctx.fillStyle = '#f8b878'; // Skin
                ctx.fillRect(-10, -78, 20, 20);

                // Spiky Hair
                ctx.fillStyle = this.isSuperSaiyan ? '#ffd700' : '#000'; // Gold or Black
                ctx.beginPath();
                ctx.moveTo(-12, -78);
                ctx.lineTo(-25, -92);
                ctx.lineTo(-5, -84);
                ctx.lineTo(0, -105); // Top spike
                ctx.lineTo(5, -84);
                ctx.lineTo(25, -92);
                ctx.lineTo(12, -78);
                ctx.lineTo(-12, -78);
                ctx.fill();

                // Punch Arm Pose
                if (this.state === 'attack' && this.punchFrame === 1) {
                    ctx.fillStyle = '#f8b878';
                    ctx.fillRect(10, -50, 25, 8); // Arm extended
                    ctx.fillStyle = '#0000bc'; // Wristband
                    ctx.fillRect(28, -50, 5, 8);
                }
            } else {
                // Yusuke Urameshi
                // Green School Uniform
                ctx.fillStyle = '#008000'; // Green
                ctx.fillRect(-14, -60, 28, 43);
                
                // Yellow Uniform Buttons / Trims
                ctx.fillStyle = '#ffd700';
                ctx.fillRect(8, -60, 4, 43);

                // Pants
                ctx.fillStyle = '#008000';
                ctx.fillRect(-14, -18, 11, 18);
                ctx.fillRect(3, -18, 11, 18);
                
                // Shoes
                ctx.fillStyle = '#7a7a7a';
                ctx.fillRect(-13, 0, 9, 5);
                ctx.fillRect(4, 0, 9, 5);

                // Face / Head
                ctx.fillStyle = '#f8b878';
                ctx.fillRect(-10, -75, 20, 18);

                // Slicked-back Black Hair
                ctx.fillStyle = '#000';
                ctx.beginPath();
                ctx.moveTo(-11, -75);
                ctx.lineTo(-15, -88);
                ctx.lineTo(-5, -80);
                ctx.lineTo(0, -90);
                ctx.lineTo(5, -80);
                ctx.lineTo(15, -88);
                ctx.lineTo(11, -75);
                ctx.fill();

                // Reigan charging spark at fingertip
                if (this.state === 'special' && this.stateTimer < 60) {
                    ctx.fillStyle = '#00f5d4';
                    ctx.beginPath();
                    ctx.arc(22, -45, Math.sin(Date.now() * 0.05) * 6 + 8, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            // Draw Face expressions in Hit state
            if (this.state === 'hit') {
                ctx.fillStyle = 'red';
                ctx.fillRect(-6, -70, 12, 4); // Red cross eyes
            }

            ctx.restore();
        }
    }

    class Projectile {
        constructor(x, y, vx, color, type) {
            this.x = x;
            this.y = y;
            this.vx = vx;
            this.color = color;
            this.type = type;
            this.size = type === 'reigan' ? 12 : 18;
            this.active = true;
        }

        update() {
            this.x += this.vx;
            // Bound check
            if (this.x < -100 || this.x > game.width + 100) {
                this.active = false;
            }
        }

        draw() {
            ctx.save();
            ctx.shadowBlur = 20;
            ctx.shadowColor = this.color;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            
            // Core highlight
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 0.5, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
        }
    }

    // Spark particles for hits and clashes
    class Spark {
        constructor(x, y, color) {
            this.x = x;
            this.y = y;
            this.vx = (Math.random() - 0.5) * 8;
            this.vy = (Math.random() - 0.5) * 8;
            this.size = Math.random() * 4 + 2;
            this.color = color || '#ffd700';
            this.life = 1.0;
            this.decay = Math.random() * 0.08 + 0.04;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.life -= this.decay;
        }
        draw() {
            ctx.save();
            ctx.globalAlpha = this.life;
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.size, this.size);
            ctx.restore();
        }
    }

    // Helpers
    function drawAura(x, y, color, size) {
        ctx.save();
        ctx.shadowBlur = 25;
        ctx.shadowColor = color;
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.25;
        
        ctx.beginPath();
        ctx.moveTo(x - size, y + 30);
        ctx.quadraticCurveTo(x - size * 0.8, y - size, x, y - size * 1.3);
        ctx.quadraticCurveTo(x + size * 0.8, y - size, x + size, y + 30);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    let projectiles = [];
    let sparks = [];

    function createHitSpark(x, y, color) {
        for (let i = 0; i < 8; i++) {
            sparks.push(new Spark(x, y, color));
        }
    }

    const goku = new Fighter('Goku', 150, 'orange', 1);
    const yusuke = new Fighter('Yusuke', 490, 'green', -1);

    // Main Draw Stage background
    function drawStage() {
        // Red sunset sky gradient
        const skyGrad = ctx.createLinearGradient(0, 0, 0, game.groundY);
        skyGrad.addColorStop(0, '#3a0007');
        skyGrad.addColorStop(0.5, '#7a1f0d');
        skyGrad.addColorStop(1, '#d05813');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, game.width, game.height);

        // Huge sun
        ctx.fillStyle = '#ffeed0';
        ctx.shadowBlur = 40;
        ctx.shadowColor = '#d05813';
        ctx.beginPath();
        ctx.arc(game.width / 2, game.groundY - 10, 80, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Rocky mountains in back
        ctx.fillStyle = '#42161b';
        ctx.beginPath();
        ctx.moveTo(0, game.groundY);
        ctx.lineTo(80, 180);
        ctx.lineTo(170, 250);
        ctx.lineTo(260, 160);
        ctx.lineTo(390, 240);
        ctx.lineTo(480, 140);
        ctx.lineTo(580, 220);
        ctx.lineTo(game.width, game.groundY);
        ctx.fill();

        // Floor / Ground
        ctx.fillStyle = '#1c0c0e';
        ctx.fillRect(0, game.groundY, game.width, game.height - game.groundY);
        
        // Ground highlight border
        ctx.fillStyle = '#561a15';
        ctx.fillRect(0, game.groundY, game.width, 4);
    }

    // Healthbars UI
    function drawUI() {
        // Healthbar 1 - Goku
        ctx.fillStyle = '#221c33';
        ctx.fillRect(20, 20, 220, 14);
        
        ctx.fillStyle = '#ffb703'; // Goku color
        ctx.fillRect(22, 22, (goku.hp / goku.maxHp) * 216, 10);
        
        ctx.font = 'bold 10px Orbitron';
        ctx.fillStyle = '#fff';
        ctx.fillText('GOKU (SAIYAN)', 20, 48);

        // Healthbar 2 - Yusuke
        ctx.fillStyle = '#221c33';
        ctx.fillRect(game.width - 240, 20, 220, 14);
        
        ctx.fillStyle = '#00f5d4'; // Yusuke color
        ctx.fillRect(game.width - 238, 22, (yusuke.hp / yusuke.maxHp) * 216, 10);
        
        ctx.fillText('YUSUKE (MAZOKU)', game.width - 240, 48);
    }

    // Render Clash speedlines
    function drawSpeedlines() {
        ctx.save();
        ctx.strokeStyle = 'rgba(255,255,255,0.08)';
        ctx.lineWidth = 2;
        for (let i = 0; i < 20; i++) {
            const rx = Math.random() * game.width;
            ctx.beginPath();
            ctx.moveTo(rx, 0);
            ctx.lineTo(rx, game.height);
            ctx.stroke();
        }
        ctx.restore();
    }

    // Render loop
    function updateGameLoop() {
        if (!isPlaying) return;

        // Apply screen shake
        ctx.save();
        if (game.cameraShake > 0) {
            const shakeX = (Math.random() - 0.5) * game.cameraShake;
            const shakeY = (Math.random() - 0.5) * game.cameraShake;
            ctx.translate(shakeX, shakeY);
            game.cameraShake *= 0.9; // decay
            if (game.cameraShake < 0.5) game.cameraShake = 0;
        }

        // Draw Stage
        drawStage();

        // Speedlines
        if (game.speedlines) drawSpeedlines();

        // Update & Draw Fighters
        goku.update(yusuke);
        yusuke.update(goku);

        goku.draw();
        yusuke.draw();

        // Update & Draw Projectiles
        projectiles.forEach((p, pIndex) => {
            p.update();
            p.draw();

            // Collision with opponent
            const opponent = p.vx > 0 ? yusuke : goku;
            const pDist = Math.abs(p.x - opponent.x);
            if (pDist < 30 && opponent.state !== 'hit') {
                opponent.state = 'hit';
                opponent.stateTimer = 0;
                opponent.vx = p.vx > 0 ? 5 : -5;
                opponent.hp -= 20;
                if (opponent.hp < 10) opponent.hp = 100;

                game.cameraShake = 15;
                game.flash = 1; // trigger white screen flash
                createHitSpark(p.x, p.y, p.color);
                
                // Explode sound
                if (!isMuted) playEnergyCatch();

                p.active = false;
            }

            // Projectile clash!
            projectiles.forEach((otherP, otherIndex) => {
                if (pIndex !== otherIndex && p.active && otherP.active) {
                    const clashDist = Math.abs(p.x - otherP.x);
                    if (clashDist < 25) {
                        p.active = false;
                        otherP.active = false;
                        
                        game.cameraShake = 22;
                        game.flash = 1;
                        createHitSpark(p.x, p.y, '#fff');
                        
                        // Blast sound
                        if (!isMuted) {
                            playEnergyCatch();
                        }
                    }
                }
            });
        });

        // Filter out inactive projectiles
        projectiles = projectiles.filter(p => p.active);

        // Update & Draw Sparks
        sparks.forEach(s => {
            s.update();
            s.draw();
        });
        sparks = sparks.filter(s => s.life > 0);

        // Draw HUD UI
        drawUI();

        // Apply white screen flash overlay
        if (game.flash > 0) {
            ctx.fillStyle = `rgba(255,255,255,${game.flash})`;
            ctx.fillRect(0, 0, game.width, game.height);
            game.flash -= 0.1; // fade out flash
        }

        ctx.restore();

        // Schedule next update frame
        animFrameId = requestAnimationFrame(updateGameLoop);
    }

    // Playback state toggle handlers
    function playVideo() {
        if (isPlaying) return;
        isPlaying = true;

        playOverlay.classList.add('hidden');
        vhsCabinet.classList.add('playing');
        vhsPlayBtn.classList.add('active');
        vhsPauseBtn.classList.remove('active');
        osdStatus.textContent = 'PLAY ▶';

        playScouterBeep(600, 0.1, 'triangle');

        if (customVideoLoaded) {
            canvas.style.display = 'none';
            video.style.display = 'block';
            video.play().catch(err => console.warn(err));

            osdInterval = setInterval(() => {
                osdTime.textContent = formatVhsTime(video.currentTime);
            }, 100);
        } else {
            video.style.display = 'none';
            canvas.style.display = 'block';
            
            // Start Canvas rendering loop
            updateGameLoop();
            
            // Start OSD timer
            osdInterval = setInterval(() => {
                elapsedSeconds += 0.1;
                osdTime.textContent = formatVhsTime(elapsedSeconds);
            }, 100);
        }
    }

    function pauseVideo() {
        if (!isPlaying) return;
        isPlaying = false;

        clearInterval(osdInterval);
        cancelAnimationFrame(animFrameId);

        if (customVideoLoaded) {
            video.pause();
        } else {
            vhsCabinet.classList.remove('shake-mild', 'shake-heavy', 'speedlines-active');
        }

        playOverlay.classList.remove('hidden');
        vhsCabinet.classList.remove('playing');
        vhsPlayBtn.classList.remove('active');
        vhsPauseBtn.classList.add('active');
        osdStatus.textContent = 'PAUSE ‖';
        playScouterBeep(400, 0.1, 'triangle');
    }

    // Load Local Custom Video file
    vhsFile.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        pauseVideo();

        const fileUrl = URL.createObjectURL(file);
        video.src = fileUrl;
        customVideoLoaded = true;

        // Reset tracking
        elapsedSeconds = 0;
        playVideo();
    });

    // Connections
    playOverlay.addEventListener('click', playVideo);
    playBtnLarge.addEventListener('click', (e) => {
        e.stopPropagation();
        playVideo();
    });

    vhsPlayBtn.addEventListener('click', playVideo);
    vhsPauseBtn.addEventListener('click', pauseVideo);

    vhsMuteBtn.addEventListener('click', () => {
        isMuted = !isMuted;
        vhsMuteBtn.textContent = isMuted ? 'UNMUTE' : 'MUTE';
        vhsMuteBtn.classList.toggle('active', isMuted);
        
        if (customVideoLoaded) {
            video.muted = isMuted;
        }
        playScouterBeep(800, 0.05, 'triangle');
    });

    // Reset when custom video ends
    video.addEventListener('ended', () => {
        pauseVideo();
        video.currentTime = 0;
    });
}

/* --- Storyboard Audio Effects Synthesizer --- */
function initStoryboard() {
    const soundBtns = document.querySelectorAll('.panel-sound-btn');
    soundBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // Lazy load audioCtx if not started
            if (!audioCtx) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }

            const soundType = btn.getAttribute('data-sound');
            
            // Temporary change active button styling
            btn.classList.add('active');
            setTimeout(() => btn.classList.remove('active'), 1500);

            // Play synthesized FX
            if (soundType === 'growl') {
                playStomachGrowl();
            } else if (soundType === 'reigan') {
                playReiganCharge();
            } else if (soundType === 'catch') {
                playEnergyCatch();
            }
        });
    });
}

function playStomachGrowl() {
    if (!audioCtx) return;
    const duration = 1.5;
    
    // Low rumble oscillator
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(65, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(35, audioCtx.currentTime + duration);

    // Rumble amplitude modulation (tremolo)
    const modulator = audioCtx.createOscillator();
    const modGain = audioCtx.createGain();
    modulator.type = 'sine';
    modulator.frequency.setValueAtTime(10, audioCtx.currentTime); // 10Hz wobble

    modGain.gain.setValueAtTime(0.08, audioCtx.currentTime);

    // Connections
    modulator.connect(modGain);
    modGain.connect(gainNode.gain);

    // Initial master gain setup
    gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 0.3);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc.start();
    modulator.start();
    osc.stop(audioCtx.currentTime + duration);
    modulator.stop(audioCtx.currentTime + duration);
}

function playReiganCharge() {
    if (!audioCtx) return;
    const duration = 2.0;

    // 1. Sparkly pitch rising sweep
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(220, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + duration - 0.4);

    gainNode.gain.setValueAtTime(0.03, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + duration);

    // 2. Rising rapid blips
    for (let i = 0; i < 15; i++) {
        const timeOffset = (i * (duration - 0.4)) / 15;
        const pitch = 300 + (i * 60);
        setTimeout(() => {
            playScouterBeep(pitch, 0.05, 'square');
        }, timeOffset * 1000);
    }

    // 3. Blast release explosion sound
    setTimeout(() => {
        // Synthesizing a laser blast sound
        const blastOsc = audioCtx.createOscillator();
        const blastGain = audioCtx.createGain();
        blastOsc.type = 'sawtooth';
        blastOsc.frequency.setValueAtTime(440, audioCtx.currentTime);
        blastOsc.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.6);

        blastGain.gain.setValueAtTime(0.12, audioCtx.currentTime);
        blastGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);

        blastOsc.connect(blastGain);
        blastGain.connect(audioCtx.destination);

        blastOsc.start();
        blastOsc.stop(audioCtx.currentTime + 0.6);
    }, (duration - 0.3) * 1000);
}

function playEnergyCatch() {
    if (!audioCtx) return;

    // 1. Cartoon "Ding"
    const bellOsc = audioCtx.createOscillator();
    const bellGain = audioCtx.createGain();
    
    bellOsc.type = 'sine';
    bellOsc.frequency.setValueAtTime(1400, audioCtx.currentTime);
    bellOsc.frequency.setValueAtTime(1200, audioCtx.currentTime + 0.1);
    
    bellGain.gain.setValueAtTime(0.15, audioCtx.currentTime);
    bellGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);

    bellOsc.connect(bellGain);
    bellGain.connect(audioCtx.destination);
    
    bellOsc.start();
    bellOsc.stop(audioCtx.currentTime + 0.6);

    // 2. Pop candy crackle sound loops (random pop sounds)
    for (let i = 0; i < 20; i++) {
        const timeOffset = 0.1 + Math.random() * 1.3; // spread pops over 1.3 seconds
        const pitch = 2000 + Math.random() * 3000; // high frequency click pitch
        const popDuration = 0.005 + Math.random() * 0.01;
        
        setTimeout(() => {
            if (!audioCtx) return;
            const popOsc = audioCtx.createOscillator();
            const popGain = audioCtx.createGain();
            
            popOsc.type = 'triangle';
            popOsc.frequency.setValueAtTime(pitch, audioCtx.currentTime);
            
            popGain.gain.setValueAtTime(0.04, audioCtx.currentTime);
            popGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + popDuration);
            
            popOsc.connect(popGain);
            popGain.connect(audioCtx.destination);
            
            popOsc.start();
            popOsc.stop(audioCtx.currentTime + popDuration);
        }, timeOffset * 1000);
    }
}

