function formatTime(seconds) {
    if (seconds === Infinity) return '--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
}
function deleteGame(gameIndex) {
    if (!confirm('Are you sure you want to delete this game from your history?')) {
        return;
    }

    const historyString = localStorage.getItem('quizHistory');
    let history = historyString ? JSON.parse(historyString) : [];

    history.splice(gameIndex, 1);

    localStorage.setItem('quizHistory', JSON.stringify(history));

    loadHistoryStats();
}

function loadHistoryStats() {
    const historyString = localStorage.getItem('quizHistory');
    const historyTableBody = document.getElementById('historyTableBody');
    const noDataMsg = document.getElementById('no-data-msg');

    if (!historyString || historyString === '[]') {
        noDataMsg.classList.remove('hidden');
        document.getElementById('stat-total-games').textContent = 0;
        document.getElementById('stat-avg-score').textContent = '0%';
        document.getElementById('stat-fastest-time').textContent = '--';
        return;
    }

    const history = JSON.parse(historyString);
    
    let totalGames = history.length;
    let totalScoreSum = 0;
    let totalPossibleScoreSum = 0;
    let fastestTime = Infinity;

    historyTableBody.innerHTML = ''; 

    for (let i = 0; i < history.length; i++) {
        const game = history[i];

        totalScoreSum += game.score;
        totalPossibleScoreSum += (game.totalQuestions * 10);
        
        if (game.timeTaken > 0 && game.timeTaken < fastestTime) {
            fastestTime = game.timeTaken;
        }
        
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50';
        
        const scorePercentage = Math.round((game.score / (game.totalQuestions * 10)) * 100);
        
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${game.date}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${game.category}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${game.difficulty}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-700">
                ${game.score}/${game.totalQuestions * 10} (${scorePercentage}%)
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                ${formatTime(game.timeTaken)}
            </td>
            `;

            const deleteCell = document.createElement('td');
            deleteCell.className = 'px-6 py-4 whitespace-nowrap text-sm';
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.className = 'text-white hover:bg-red-500 transition bg-red-700 rounded-xl p-2';
            deleteButton.onclick = () => deleteGame(i);
            deleteCell.appendChild(deleteButton);
            row.appendChild(deleteCell);

        historyTableBody.appendChild(row);
    }

    const overallAverageScore = totalPossibleScoreSum > 0 
        ? Math.round((totalScoreSum / totalPossibleScoreSum) * 100) 
        : 0;

    document.getElementById('stat-total-games').textContent = totalGames;
    document.getElementById('stat-avg-score').textContent = `${overallAverageScore}%`;
    document.getElementById('stat-fastest-time').textContent = formatTime(fastestTime);

    noDataMsg.classList.add('hidden'); 
}

document.addEventListener('DOMContentLoaded', loadHistoryStats);