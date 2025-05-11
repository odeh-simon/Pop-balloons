const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const messageDiv = document.getElementById('message');
const bgMusic = document.getElementById('bgMusic');
const popSound = document.getElementById('popSound');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Set volumes
bgMusic.volume = 0.1;
popSound.volume = 0.1;

// Attempt to play background music on page load
function tryPlayBackgroundMusic() {
    bgMusic.play().catch(e => {
        console.log('Initial audio playback failed:', e);
        messageDiv.textContent = 'Tap anywhere to enable background music';
        messageDiv.style.display = 'block';
        setTimeout(() => messageDiv.style.display = 'none', 3000);
    });
}

// Retry playing background music on first user interaction
let hasInteracted = false;
function handleFirstInteraction() {
    if (!hasInteracted) {
        hasInteracted = true;
        bgMusic.play().catch(e => console.log('Retry audio playback failed:', e));
        // Remove listeners to prevent multiple triggers
        document.removeEventListener('click', handleFirstInteraction);
        document.removeEventListener('touchstart', handleFirstInteraction);
    }
}

document.addEventListener('click', handleFirstInteraction);
document.addEventListener('touchstart', handleFirstInteraction);

// Initial attempt to play music
tryPlayBackgroundMusic();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

const balloons = [];
const quotes = [
    "The Lord is my strength and my shield; my heart trusts in him, and he helps me. - Psalm 28:7",
    "Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go. - Joshua 1:9",
    "I can do all this through Christ who gives me strength. - Philippians 4:13",
    "The Lord is close to the brokenhearted and saves those who are crushed in spirit. - Psalm 34:18",
    "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future. - Jeremiah 29:11",
    "Come to me, all you who are weary and burdened, and I will give you rest. - Matthew 11:28",
    "The Lord is my light and my salvation—whom shall I fear? - Psalm 27:1",
    "Peace I leave with you; my peace I give you. - John 14:27",
    "Cast all your anxiety on him because he cares for you. - 1 Peter 5:7",
    "The Lord is good, a refuge in times of trouble. He cares for those who trust in him. - Nahum 1:7",
    "Trust in the Lord with all your heart and lean not on your own understanding. - Proverbs 3:5",
    "Do not fear, for I am with you; do not be dismayed, for I am your God. - Isaiah 41:10",
    "The Lord is my shepherd; I shall not want. - Psalm 23:1",
    "You are my hiding place; you will protect me from trouble and surround me with songs of deliverance. - Psalm 32:7",
    "God is our refuge and strength, an ever-present help in trouble. - Psalm 46:1",
    "The Lord will fight for you; you need only to be still. - Exodus 14:14",
    "Let us hold unswervingly to the hope we profess, for he who promised is faithful. - Hebrews 10:23",
    "The joy of the Lord is your strength. - Nehemiah 8:10",
    "You are never alone; God’s presence is your comfort.",
    "Your faith will lead you to a future filled with hope."
];

// Fisher-Yates shuffle for random quotes
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

let shuffledQuotes = shuffle([...quotes]);
let quoteIndex = 0;

const vibrantColors = [
    '#FF0000', // Red
    '#00FF00', // Green
    '#0000FF', // Blue
    '#FFFF00', // Yellow
    '#FF69B4', // Pink
    '#FFA500', // Orange
    '#800080', // Purple
    '#00FFFF', // Cyan
    '#FF4500', // OrangeRed
    '#32CD32'  // LimeGreen
];

class Balloon {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 50;
        this.radius = Math.random() * 30 + 20;
        this.speed = Math.random() * 2 + 1;
        this.color = vibrantColors[Math.floor(Math.random() * vibrantColors.length)];
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();

        // Draw string
        ctx.beginPath();
        ctx.moveTo(this.x, this.y + this.radius);
        ctx.lineTo(this.x, this.y + this.radius + 20);
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.closePath();
    }

    update() {
        this.y -= this.speed;
        if (this.y < -this.radius) {
            this.y = canvas.height + 50;
            this.x = Math.random() * canvas.width;
        }
    }
}

function spawnBalloon() {
    if (balloons.length < 10) {
        balloons.push(new Balloon());
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    balloons.forEach(balloon => {
        balloon.draw();
        balloon.update();
    });
    requestAnimationFrame(animate);
}

setInterval(spawnBalloon, 1000);
animate();

function handlePop(e, clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = clientX - rect.left;
    const mouseY = clientY - rect.top;
    let popped = false;

    for (let i = balloons.length - 1; i >= 0; i--) {
        const balloon = balloons[i];
        const dist = Math.sqrt((mouseX - balloon.x) ** 2 + (mouseY - balloon.y) ** 2);
        if (dist < balloon.radius) {
            balloons.splice(i, 1);
            popped = true;

            // Play pop sound
            popSound.currentTime = 0;
            popSound.play().catch(e => console.log('Pop sound failed:', e));

            // Show confetti
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { x: mouseX / canvas.width, y: mouseY / canvas.height }
            });

            // Show random quote
            if (quoteIndex >= shuffledQuotes.length) {
                shuffledQuotes = shuffle([...quotes]);
                quoteIndex = 0;
            }
            messageDiv.textContent = shuffledQuotes[quoteIndex++];
            messageDiv.style.display = 'block';

            // Control how long the quote stays on screen (in milliseconds)
            setTimeout(() => {
                messageDiv.style.display = 'none';
            }, 7000); // Change this value to adjust quote display duration
            break;
        }
    }

    return popped;
}

// Click support
canvas.addEventListener('click', (e) => {
    handlePop(e, e.clientX, e.clientY);
});

// Touch support with conditional preventDefault
canvas.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    const popped = handlePop(e, touch.clientX, touch.clientY);
    if (popped) {
        e.preventDefault(); // Only prevent default if a balloon was popped
    }
});