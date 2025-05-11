const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const messageDiv = document.getElementById('message');
const bgMusic = document.getElementById('bgMusic');
const popSound = document.getElementById('popSound');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

bgMusic.volume = 0.1;
popSound.volume = 0.05;

// Attempt to play background music on page load
function tryPlayBackgroundMusic() {
    bgMusic.play().catch(e => {
        console.log('Initial audio playback failed:', e);
        messageDiv.textContent = '';
        messageDiv.style.display = 'none';
        setTimeout(() => messageDiv.style.display = 'none', 3000);
    });
}

// Retry playing background music on first user interaction
let hasInteracted = false;
function handleFirstInteraction() {
    if (!hasInteracted) {
        hasInteracted = true;
        bgMusic.play().catch(e => console.log('Retry audio playback failed:', e));
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
    "The LORD is my strength and my shield; my heart trusted in him, and I am helped: therefore my heart greatly rejoiceth; and with my song will I praise him. - Psalm 28:7",
    "Have not I commanded thee? Be strong and of a good courage; be not afraid, neither be thou dismayed: for the LORD thy God is with thee whithersoever thou goest. - Joshua 1:9",
    "I can do all things through Christ which strengtheneth me. - Philippians 4:13",
    "The LORD is nigh unto them that are of a broken heart; and saveth such as be of a contrite spirit. - Psalm 34:18",
    "For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil, to give you an expected end. - Jeremiah 29:11",
    "Come unto me, all ye that labour and are heavy laden, and I will give you rest. - Matthew 11:28",
    "The LORD is my light and my salvation; whom shall I fear? the LORD is the strength of my life; of whom shall I be afraid? - Psalm 27:1",
    "Peace I leave with you, my peace I give unto you: not as the world giveth, give I unto you. Let not your heart be troubled, neither let it be afraid. - John 14:27",
    "Casting all your care upon him; for he careth for you. - 1 Peter 5:7",
    "The LORD is good, a strong hold in the day of trouble; and he knoweth them that trust in him. - Nahum 1:7",
    "Trust in the LORD with all thine heart; and lean not unto thine own understanding. - Proverbs 3:5",
    "Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee; yea, I will uphold thee with the right hand of my righteousness. - Isaiah 41:10",
    "The LORD is my shepherd; I shall not want. - Psalm 23:1",
    "Thou art my hiding place; thou shalt preserve me from trouble; thou shalt compass me about with songs of deliverance. Selah. - Psalm 32:7",
    "God is our refuge and strength, a very present help in trouble. - Psalm 46:1",
    "The LORD shall fight for you, and ye shall hold your peace. - Exodus 14:14",
    "Let us hold fast the profession of our faith without wavering; (for he is faithful that promised;) - Hebrews 10:23",
    "Then he said unto them, Go your way, eat the fat, and drink the sweet, and send portions unto them for whom nothing is prepared: for this day is holy unto our Lord: neither be ye sorry; for the joy of the LORD is your strength. - Nehemiah 8:10",
    "You are never alone; God’s presence is your comfort.",
    "Your faith will lead you to a future filled with hope.",
    "Arise, shine; for thy light is come, and the glory of the LORD is risen upon thee. For, behold, the darkness shall cover the earth, and gross darkness the people: but the LORD shall arise upon thee, and his glory shall be seen upon thee. And the Gentiles shall come to thy light, and kings to the brightness of thy rising. - Isaiah 60:1-3"
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