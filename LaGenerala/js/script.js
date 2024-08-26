document.addEventListener('DOMContentLoaded', () => {
    const diceButtons = document.querySelectorAll('.dice');
    const rollButton = document.getElementById('roll');
    const endTurnButton = document.getElementById('end-turn');
    const statusDiv = document.getElementById('status');
    const scoreList = document.getElementById('score-list');

    let dice = [0, 0, 0, 0, 0];
    let selectedDice = [false, false, false, false, false];
    let turnCount = 0;
    let playerScores = [0, 0];
    let currentPlayer = 0;
    let scoreCategories = [
        { name: '1', score: [0, 0], closed: [false, false] },
        { name: '2', score: [0, 0], closed: [false, false] },
        { name: '3', score: [0, 0], closed: [false, false] },
        { name: '4', score: [0, 0], closed: [false, false] },
        { name: '5', score: [0, 0], closed: [false, false] },
        { name: '6', score: [0, 0], closed: [false, false] },
        { name: 'Escalera', score: [0, 0], closed: [false, false] },
        { name: 'Full', score: [0, 0], closed: [false, false] },
        { name: 'Poker', score: [0, 0], closed: [false, false] },
        { name: 'Generala', score: [0, 0], closed: [false, false] }
    ];

    function rollDice() {
        for (let i = 0; i < dice.length; i++) {
            if (!selectedDice[i]) {
                dice[i] = Math.floor(Math.random() * 6) + 1;
            }
        }
        updateDiceDisplay();
        updateStatus(`Jugador ${currentPlayer + 1}, tira los dados.`);
    }

    function updateDiceDisplay() {
        diceButtons.forEach((button, index) => {
            button.src = `./img/dice${dice[index]}.png`;  
            button.classList.toggle('selected', selectedDice[index]);
        });
    }

    function updateStatus(message) {
        statusDiv.textContent = message;
    }

    function endTurn() {
        const selectedCategory = prompt('Elige una categoría para puntuar (1-6, Escalera, Full, Poker, Generala):');
        const category = scoreCategories.find(cat => cat.name.toLowerCase() === selectedCategory.toLowerCase());

        if (!category || category.closed[currentPlayer]) {
            alert('Categoría inválida o ya cerrada.');
            return;
        }

        const score = calculateScore();
        category.score[currentPlayer] = score;
        category.closed[currentPlayer] = true; 
        
        playerScores[currentPlayer] += score;
        updateScoreboard();
        currentPlayer = (currentPlayer + 1) % 2;
        turnCount++;
        if (turnCount >= 10) {
            endGame();
        } else {
            resetTurn();
        }
    }

    function resetTurn() {
        dice = [0, 0, 0, 0, 0];
        selectedDice = [false, false, false, false, false];
        updateDiceDisplay();
        updateStatus(`Turno del Jugador ${currentPlayer + 1}`);
    }

    function calculateScore() {
        const diceCount = dice.reduce((counts, die) => {
            counts[die - 1]++;
            return counts;
        }, [0, 0, 0, 0, 0, 0]);

        const isEscalera = 
            (dice.includes(1) && dice.includes(2) && dice.includes(3) && dice.includes(4) && dice.includes(5)) ||
            (dice.includes(2) && dice.includes(3) && dice.includes(4) && dice.includes(5) && dice.includes(6));
        
        const isFull = diceCount.includes(3) && diceCount.includes(2);
        const isPoker = diceCount.includes(4);
        const isGenerala = diceCount.includes(5);

        let totalScore = 0;

        if (isGenerala) {
            totalScore = 50;
            updateStatus("¡Generala!");
        } else if (isPoker) {
            totalScore = 40;
            updateStatus("¡Poker!");
        } else if (isFull) {
            totalScore = 30;
            updateStatus("¡Full!");
        } else if (isEscalera) {
            totalScore = 20;
            updateStatus("¡Escalera!");
        } else {
            totalScore = dice.reduce((sum, die) => sum + die, 0);
            updateStatus(`Suma de dados: ${totalScore}`);
        }

        return totalScore;
    }

    function updateScoreboard() {
        scoreList.innerHTML = scoreCategories.map(cat => 
            `<tr>
                <td>${cat.name}</td>
                <td>${cat.score[0]}</td>
                <td>${cat.score[1]}</td>
            </tr>`
        ).join('');
    }

    function endGame() {
        const winner = playerScores[0] > playerScores[1] ? 'Jugador 1' : 'Jugador 2';
        const message = playerScores[0] === playerScores[1] ? 'Empate' : `${winner} gana el juego`;
        updateStatus(`Juego terminado. Puntajes finales - Jugador 1: ${playerScores[0]}, Jugador 2: ${playerScores[1]}. ${message}`);
        rollButton.disabled = true;
        endTurnButton.disabled = true;
    }

    diceButtons.forEach(button => {
        button.addEventListener('click', () => {
            const index = button.getAttribute('data-index');
            selectedDice[index] = !selectedDice[index];
            updateDiceDisplay();
        });
    });

    rollButton.addEventListener('click', rollDice);
    endTurnButton.addEventListener('click', endTurn);
});
