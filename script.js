// script.js

const emojis = ["❤️", "🔥", "😄", "💩", "👻", "✨", "🌚", "👽", "🦅"];
let numberOfTubes = 5;
const tubeCapacity = 4;

let tubes;

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function generateInitialTubes() {
    const totalEmojis = emojis.slice(0, numberOfTubes - 1).flatMap(emoji => Array(tubeCapacity).fill(emoji));
    const shuffledEmojis = shuffle(totalEmojis);

    let newTubes = [];
    for (let i = 0; i < numberOfTubes - 1; i++) {
        newTubes.push(shuffledEmojis.slice(i * tubeCapacity, (i + 1) * tubeCapacity));
    }
    newTubes.push([]); // Add the empty tube

    return newTubes;
}

function createTube(emojiArray, tubeIndex) {
    const tubeDiv = document.createElement('div');
    tubeDiv.classList.add('tube');
    tubeDiv.dataset.index = tubeIndex;

    emojiArray.slice().reverse().forEach(emoji => {
        const emojiDiv = document.createElement('div');
        emojiDiv.classList.add('emoji');
        emojiDiv.innerText = emoji;
        tubeDiv.appendChild(emojiDiv);
    });

    gameContainer.appendChild(tubeDiv);
}

function setupGame() {
    const tubeInput = document.getElementById('tube-count');
    numberOfTubes = parseInt(tubeInput.value) || 5; // Default to 5 if input is invalid
    gameContainer.innerHTML = '';
    tubes = generateInitialTubes();
    tubes.forEach((tube, index) => createTube(tube, index));
    updateDraggableState();
    addDragAndDropHandlers();
}

function updateDraggableState() {
    document.querySelectorAll('.emoji').forEach(emoji => {
        emoji.draggable = false; // Disable all emojis
    });

    document.querySelectorAll('.tube').forEach(tube => {
        const topEmoji = tube.lastElementChild;
        if (topEmoji) {
            topEmoji.draggable = true; // Enable only the top emoji in each tube
        }
    });
}

function addDragAndDropHandlers() {
    const emojiElements = document.querySelectorAll('.emoji');
    let draggedItem = null;

    emojiElements.forEach(emoji => {
        emoji.addEventListener('dragstart', () => {
            draggedItem = emoji;
            setTimeout(() => emoji.style.display = 'none', 0);
        });

        emoji.addEventListener('dragend', () => {
            setTimeout(() => {
                draggedItem.style.display = 'block';
                draggedItem = null;
                updateDraggableState();
            }, 0);
        });

        emoji.addEventListener('dragover', e => {
            e.preventDefault();
        });

        emoji.addEventListener('drop', e => {
            e.preventDefault();
            if (e.target.classList.contains('emoji')) {
                const parentTube = e.target.parentElement;
                if (parentTube.children.length < 4) {
                    parentTube.insertBefore(draggedItem, e.target.nextSibling);
                    updateTubes();
                }
            }
        });
    });

    const tubeElements = document.querySelectorAll('.tube');
    tubeElements.forEach(tube => {
        tube.addEventListener('dragover', e => {
            e.preventDefault();
        });

        tube.addEventListener('drop', e => {
            e.preventDefault();
            if (draggedItem && tube.children.length < 4) {
                tube.appendChild(draggedItem);
                updateTubes();
            }
        });
    });
}

function updateTubes() {
    tubes.forEach((tube, index) => {
        const tubeDiv = document.querySelector(`.tube[data-index="${index}"]`);
        const emojis = Array.from(tubeDiv.children).map(child => child.innerText).reverse();
        tubes[index] = emojis;
    });

    if (checkWinCondition()) {
        setTimeout(() => {
            alert("Congratulations! You've won the game!");
        }, 100);
    }

    console.log(tubes); // Log the current state of tubes for debugging
}
function checkWinCondition() {
    return tubes.every(tube => {
        if (tube.length === 0) return true; // Ignore empty tube
        return tube.length === tubeCapacity && tube.every(emoji => emoji === tube[0]);
    });
}

function resetGame() {
    setupGame();
}

const gameContainer = document.querySelector('.game-container');
setupGame();