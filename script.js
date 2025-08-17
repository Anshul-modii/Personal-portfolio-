// Main Portfolio Script
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    // Scroll reveal animation
    function reveal() {
        var reveals = document.querySelectorAll(".reveal");
        for (var i = 0; i < reveals.length; i++) {
            var windowHeight = window.innerHeight;
            var elementTop = reveals[i].getBoundingClientRect().top;
            var elementVisible = 150;
            if (elementTop < windowHeight - elementVisible) {
                reveals[i].classList.add("active");
            } else {
                reveals[i].classList.remove("active");
            }
        }
    }
    window.addEventListener("scroll", reveal);
    reveal();

    // Background animation
    const canvas = document.getElementById('background-animation');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particlesArray;

    let mouse = {
        x: null,
        y: null,
        radius: (canvas.height/80) * (canvas.width/80)
    }

    window.addEventListener('mousemove', function(event) {
        mouse.x = event.x;
        mouse.y = event.y;
    });

    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = '#112240';
            ctx.fill();
        }
        update() {
            if (this.x > canvas.width || this.x < 0) {
                this.directionX = -this.directionX;
            }
            if (this.y > canvas.height || this.y < 0) {
                this.directionY = -this.directionY;
            }
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx*dx + dy*dy);
            if (distance < mouse.radius + this.size) {
                if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
                    this.x += 10;
                }
                if (mouse.x > this.x && this.x > this.size * 10) {
                    this.x -= 10;
                }
                if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
                    this.y += 10;
                }
                if (mouse.y > this.y && this.y > this.size * 10) {
                    this.y -= 10;
                }
            }
            this.x += this.directionX;
            this.y += this.directionY;
            this.draw();
        }
    }

    function init() {
        particlesArray = [];
        let numberOfParticles = (canvas.height * canvas.width) / 9000;
        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 5) + 1;
            let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
            let directionX = (Math.random() * 5) - 2.5;
            let directionY = (Math.random() * 5) - 2.5;
            let color = '#ccd6f6';
            particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0,0,innerWidth, innerHeight);

        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connect();
    }

    function connect() {
        let opacityValue = 1;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))
                + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                if (distance < (canvas.width/7) * (canvas.height/7)) {
                    opacityValue = 1 - (distance/20000);
                    ctx.strokeStyle = 'rgba(100, 255, 218,' + opacityValue + ')';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    window.addEventListener('resize', function() {
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        mouse.radius = ((canvas.height/80) * (canvas.height/80));
        init();
    });

    window.addEventListener('mouseout', function() {
        mouse.x = undefined;
        mouse.y = undefined;
    });

    init();
    animate();
});

// Modal handling
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
    if (modalId === 'wordQuestModal') {
        initWordQuest();
    }
    if (modalId === 'towerDefenseModal') {
        initTowerDefense();
    }
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Expense Tracker Script
const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('expense-list');
const form = document.getElementById('expense-form');
const text = document.getElementById('expense-text');
const amount = document.getElementById('expense-amount');

const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));
let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

function addTransaction(e) {
    e.preventDefault();
    if (text.value.trim() === '' || amount.value.trim() === '') {
        // Using a custom message box instead of alert
        showMessage('Please add a text and amount');
    } else {
        const transaction = {
            id: generateID(),
            text: text.value,
            amount: +amount.value
        };
        transactions.push(transaction);
        addTransactionDOM(transaction);
        updateValues();
        updateLocalStorage();
        text.value = '';
        amount.value = '';
    }
}

function generateID() {
    return Math.floor(Math.random() * 100000000);
}

function addTransactionDOM(transaction) {
    const sign = transaction.amount < 0 ? '-' : '+';
    const item = document.createElement('li');
    item.classList.add(transaction.amount < 0 ? 'text-red-400' : 'text-green-400', 'flex', 'justify-between', 'p-2', 'border-b', 'border-gray-700');
    item.innerHTML = `
        ${transaction.text} <span>${sign}${Math.abs(transaction.amount)}</span> 
        <button class="text-red-600" onclick="removeTransaction(${transaction.id})">x</button>
    `;
    list.appendChild(item);
}

function updateValues() {
    const amounts = transactions.map(transaction => transaction.amount);
    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
    const income = amounts.filter(item => item > 0).reduce((acc, item) => (acc += item), 0).toFixed(2);
    const expense = (amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1).toFixed(2);
    balance.innerText = `$${total}`;
    money_plus.innerText = `$${income}`;
    money_minus.innerText = `$${expense}`;
}

function removeTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    updateLocalStorage();
    initExpenseTracker();
}

function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function initExpenseTracker() {
    list.innerHTML = '';
    transactions.forEach(addTransactionDOM);
    updateValues();
}

if(form) {
    form.addEventListener('submit', addTransaction);
}
initExpenseTracker();

// Hospital Management Script
const patientForm = document.getElementById('patient-form');
const patientName = document.getElementById('patient-name');
const patientAge = document.getElementById('patient-age');
const patientIllness = document.getElementById('patient-illness');
const patientList = document.getElementById('patient-list');

let patients = JSON.parse(localStorage.getItem('patients')) || [];

function addPatient(e) {
    e.preventDefault();
    const patient = {
        id: Date.now(),
        name: patientName.value,
        age: patientAge.value,
        illness: patientIllness.value
    };
    patients.push(patient);
    localStorage.setItem('patients', JSON.stringify(patients));
    patientForm.reset();
    renderPatients();
}

function renderPatients() {
    if(!patientList) return;
    patientList.innerHTML = '';
    patients.forEach(patient => {
        const patientDiv = document.createElement('div');
        patientDiv.className = 'bg-[#0a192f] p-3 rounded mb-2 flex justify-between items-center';
        patientDiv.innerHTML = `
            <div>
                <p class="font-bold text-white">${patient.name}, ${patient.age}</p>
                <p class="text-gray-400">${patient.illness}</p>
            </div>
            <button class="text-red-500" onclick="dischargePatient(${patient.id})">Discharge</button>
        `;
        patientList.appendChild(patientDiv);
    });
}

function dischargePatient(id) {
    patients = patients.filter(p => p.id !== id);
    localStorage.setItem('patients', JSON.stringify(patients));
    renderPatients();
}

if(patientForm) {
    patientForm.addEventListener('submit', addPatient);
}
renderPatients();

// Word Quest Script
const words = ['HTML', 'CSS', 'WEB', 'CODE', 'MODI'];
const gridSize = 10;
const grid = [];
let selectedCells = [];
let foundWords = [];

function initWordQuest() {
    const wordGrid = document.getElementById('word-grid');
    const wordList = document.getElementById('word-list');
    if(!wordGrid || !wordList) return;
    
    wordGrid.innerHTML = '';
    wordList.innerHTML = '';
    grid.length = 0;
    selectedCells = [];
    foundWords = [];
    document.getElementById('word-quest-message').textContent = '';

    for (let i = 0; i < gridSize; i++) {
        grid[i] = [];
        for (let j = 0; j < gridSize; j++) {
            grid[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        }
    }

    words.forEach(word => {
        placeWord(word);
        const li = document.createElement('li');
        li.id = `word-${word}`;
        li.textContent = word;
        wordList.appendChild(li);
    });

    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const cell = document.createElement('div');
            cell.textContent = grid[i][j];
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.className = 'w-8 h-8 flex items-center justify-center bg-[#112240] text-white cursor-pointer rounded';
            cell.addEventListener('mousedown', () => startSelection(cell));
            cell.addEventListener('mouseover', () => continueSelection(cell));
            wordGrid.appendChild(cell);
        }
    }
    document.addEventListener('mouseup', endSelection);
}

function placeWord(word) {
    const direction = Math.random() > 0.5 ? 'horizontal' : 'vertical';
    let row, col;
    if (direction === 'horizontal') {
        row = Math.floor(Math.random() * gridSize);
        col = Math.floor(Math.random() * (gridSize - word.length));
        for (let i = 0; i < word.length; i++) {
            grid[row][col + i] = word[i];
        }
    } else {
        row = Math.floor(Math.random() * (gridSize - word.length));
        col = Math.floor(Math.random() * gridSize);
        for (let i = 0; i < word.length; i++) {
            grid[row + i][col] = word[i];
        }
    }
}

let isSelecting = false;
function startSelection(cell) {
    isSelecting = true;
    selectedCells = [cell];
    cell.style.backgroundColor = '#64ffda';
    cell.style.color = '#0a192f';
}

function continueSelection(cell) {
    if(isSelecting && !selectedCells.includes(cell)) {
        selectedCells.push(cell);
        cell.style.backgroundColor = '#64ffda';
        cell.style.color = '#0a192f';
    }
}

function endSelection() {
    isSelecting = false;
    let selectedWord = selectedCells.map(cell => cell.textContent).join('');
    checkWord(selectedWord);
    if (!isWordFound(selectedWord)) {
        selectedCells.forEach(cell => {
            cell.style.backgroundColor = '#112240';
            cell.style.color = 'white';
        });
    }
    selectedCells = [];
}

function isWordFound(word) {
    return foundWords.includes(word) || foundWords.includes(word.split('').reverse().join(''));
}

function checkWord(word) {
    const reversedWord = word.split('').reverse().join('');
    if ((words.includes(word) && !foundWords.includes(word)) || (words.includes(reversedWord) && !foundWords.includes(reversedWord))) {
        const correctWord = words.includes(word) ? word : reversedWord;
        foundWords.push(correctWord);
        document.getElementById(`word-${correctWord}`).style.textDecoration = 'line-through';
        selectedCells.forEach(cell => {
            cell.style.backgroundColor = '#22c55e'; // Green for found
            cell.style.color = 'white';
        });
        if (foundWords.length === words.length) {
            document.getElementById('word-quest-message').textContent = 'You found all the words!';
        }
    }
}


// Tower Defense Script
function initTowerDefense() {
    const canvas = document.getElementById('game-canvas');
    if(!canvas) return;

    const ctx = canvas.getContext('2d');
    const startWaveBtn = document.getElementById('start-wave-btn');
    const waveCountSpan = document.getElementById('wave-count');
    const healthSpan = document.getElementById('base-health');
    const moneySpan = document.getElementById('player-money');

    // Game state
    let wave = 0;
    let health = 10;
    let money = 100;
    let enemies = [];
    let towers = [];
    let projectiles = [];
    let gameRunning = false;

    // Game path
    const path = [
        { x: 0, y: 250 },
        { x: 150, y: 250 },
        { x: 150, y: 100 },
        { x: 550, y: 100 },
        { x: 550, y: 400 },
        { x: 700, y: 400 }
    ];

    function drawPath() {
        ctx.strokeStyle = '#64ffda';
        ctx.lineWidth = 40;
        ctx.beginPath();
        ctx.moveTo(path[0].x, path[0].y);
        for (let i = 1; i < path.length; i++) {
            ctx.lineTo(path[i].x, path[i].y);
        }
        ctx.stroke();
    }

    function updateUI() {
        waveCountSpan.textContent = wave;
        healthSpan.textContent = health;
        moneySpan.textContent = money;
    }

    startWaveBtn.addEventListener('click', () => {
        if (!gameRunning) {
            wave++;
            spawnEnemies();
            gameRunning = true;
            startWaveBtn.disabled = true;
        }
    });

    function spawnEnemies() {
        for (let i = 0; i < wave * 5; i++) {
            enemies.push({
                x: -i * 30,
                y: 250,
                pathIndex: 0,
                speed: 1 + wave * 0.1,
                health: 10 + wave * 5,
                maxHealth: 10 + wave * 5
            });
        }
    }
    
    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        placeTower(x, y);
    });

    function placeTower(x, y) {
        if (money >= 50) {
            money -= 50;
            towers.push({ x, y, range: 100, damage: 5, fireRate: 60, fireCooldown: 0 });
            updateUI();
        }
    }

    function gameLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawPath();

        // Update and draw towers
        towers.forEach(tower => {
            ctx.fillStyle = '#64ffda';
            ctx.beginPath();
            ctx.arc(tower.x, tower.y, 15, 0, Math.PI * 2);
            ctx.fill();
            
            // Tower logic
            tower.fireCooldown--;
            if(tower.fireCooldown <= 0) {
                let target = null;
                let minDistance = Infinity;
                enemies.forEach(enemy => {
                    const dx = tower.x - enemy.x;
                    const dy = tower.y - enemy.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < tower.range && distance < minDistance) {
                        minDistance = distance;
                        target = enemy;
                    }
                });

                if(target) {
                    projectiles.push({x: tower.x, y: tower.y, target: target, speed: 5});
                    tower.fireCooldown = tower.fireRate;
                }
            }
        });

        // Update and draw projectiles
        projectiles.forEach((p, index) => {
            const dx = p.target.x - p.x;
            const dy = p.target.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            p.x += (dx / dist) * p.speed;
            p.y += (dy / dist) * p.speed;

            ctx.fillStyle = 'yellow';
            ctx.beginPath();
            ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
            ctx.fill();
            
            // Collision detection
            const hitDx = p.x - p.target.x;
            const hitDy = p.y - p.target.y;
            if (Math.sqrt(hitDx * hitDx + hitDy * hitDy) < 10) {
                p.target.health -= 5;
                projectiles.splice(index, 1);
            }
        });
        
        // Update and draw enemies
        enemies.forEach((enemy, index) => {
            if (enemy.health <= 0) {
                money += 5;
                enemies.splice(index, 1);
                updateUI();
                return;
            }

            let target = path[enemy.pathIndex + 1];
            if (target) {
                const dx = target.x - enemy.x;
                const dy = target.y - enemy.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < enemy.speed) {
                    enemy.pathIndex++;
                } else {
                    enemy.x += (dx / distance) * enemy.speed;
                    enemy.y += (dy / distance) * enemy.speed;
                }
            } else {
                health--;
                enemies.splice(index, 1);
                updateUI();
            }
            
            ctx.fillStyle = 'red';
            ctx.fillRect(enemy.x - 10, enemy.y - 10, 20, 20);

            // Health bar
            ctx.fillStyle = 'grey';
            ctx.fillRect(enemy.x - 10, enemy.y - 20, 20, 5);
            ctx.fillStyle = 'green';
            ctx.fillRect(enemy.x - 10, enemy.y - 20, 20 * (enemy.health / enemy.maxHealth), 5);
        });

        if (enemies.length === 0 && gameRunning) {
            gameRunning = false;
            startWaveBtn.disabled = false;
        }
        
        if (health <= 0) {
            ctx.fillStyle = 'white';
            ctx.font = '40px Inter';
            ctx.fillText('Game Over', canvas.width / 2 - 100, canvas.height / 2);
            return;
        }

        requestAnimationFrame(gameLoop);
    }
    
    updateUI();
    gameLoop();
}
