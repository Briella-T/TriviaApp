
let quizQuestions = [];
let currentQuestionIndex = 0;
let currentScore = 0;
let timerInterval = null;
let quizStartTime = Date.now();

const questionDisplay = document.getElementById('question-display');
const answerButtonsContainer = document.getElementById('answer-buttons-container');
const scoreDisplay = document.getElementById('score-display');
const qNumDisplay = document.getElementById('q-num');
const qTotalDisplay = document.getElementById('q-total');
const categoryDisplay = document.getElementById('current-category');
const timerDisplay = document.getElementById('timer-display');

const decodeHTML = (html) => {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
};

function startTimer(durationSeconds) {
    let timeRemaining = durationSeconds;

    if (timerInterval) {
        clearInterval(timerInterval);
    }

    timerDisplay.textContent = `Time: ${timeRemaining}s`;

    timerInterval = setInterval(() => {
        timeRemaining--;
        timerDisplay.textContent = `Time: ${timeRemaining}s`;

        if (timeRemaining <= 5) {
            timerDisplay.classList.add('text-red-500', 'font-bold');
        } else {
            timerDisplay.classList.remove('text-red-500', 'font-bold');
        }

        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            timerDisplay.textContent = `Time Up!`;

            checkAnswer(false, null, decodeHTML(quizQuestions[currentQuestionIndex].correct_answer));
        }
    }, 1000);

}

function startQuizFromStorage() {
    const quizDataString = localStorage.getItem('currentQuizData');
    const categoryName = localStorage.getItem('currentCategoryName');
    
    if (!quizDataString) {
        alert("Error: No quiz was selected. Please choose a category and difficulty first.");
        window.location.href = 'main.html';
        return;
    }

    quizQuestions = JSON.parse(quizDataString);
    categoryDisplay.textContent = categoryName.toUpperCase();

    displayQuestion();
}


function displayQuestion() {
    if (currentQuestionIndex >= quizQuestions.length) {
        endQuiz();
        return;
    }

    timerDisplay.classList.remove('text-red-500', 'font-bold');

    startTimer(10);

    const questionData = quizQuestions[currentQuestionIndex];
    
    qNumDisplay.textContent = currentQuestionIndex + 1;
    qTotalDisplay.textContent = quizQuestions.length;
    scoreDisplay.textContent = `Score: ${currentScore}`;

    questionDisplay.querySelector('p').innerHTML = decodeHTML(questionData.question);

    let answers = [questionData.correct_answer, ...questionData.incorrect_answers];
    answers = answers.map(decodeHTML); 
    answers.sort(() => Math.random() - 0.5); 

    answerButtonsContainer.innerHTML = '';

    answers.forEach(answer => {
        const isCorrect = (answer === decodeHTML(questionData.correct_answer));
        
        const button = document.createElement('button');
        button.innerHTML = answer;
        button.className = 'answer-btn py-3 rounded-xl bg-amber-50 text-gray-700 hover:bg-[#E49732] hover:text-white transition-all text-center';
        button.onclick = () => checkAnswer(isCorrect, button, decodeHTML(questionData.correct_answer));
        
        answerButtonsContainer.appendChild(button);
    });
}

function checkAnswer(isCorrect, clickedButton, correctAnswerText) {
    clearInterval(timerInterval);
    timerDisplay.classList.remove('text-red-500', 'font-bold');

    Array.from(answerButtonsContainer.children).forEach(btn => btn.disabled = true);

    const questionParagraph = questionDisplay.querySelector('p');

    const feedbackSpan = document.createElement('span');
    feedbackSpan.classList.add('mt-4', 'block', 'font-bold');

    if (isCorrect) {
        currentScore += 10;
        clickedButton.classList.remove('bg-amber-50', 'hover:bg-[#E49732]', 'text-gray-700');
        clickedButton.classList.add('bg-green-500', 'text-white');
    } else {

        if (clickedButton) {
            clickedButton.classList.remove('bg-amber-50', 'hover:bg-[#E49732]', 'text-gray-700');
            clickedButton.classList.add('bg-red-500', 'text-white');
        }

        feedbackSpan.classList.add('text-red-600');

        Array.from(answerButtonsContainer.children).forEach(btn => {
            if (btn.innerHTML === correctAnswerText) {
                btn.classList.remove('bg-amber-50', 'text-gray-700');
                btn.classList.add('bg-green-500', 'text-white'); 
            }
        });
    }

    questionDisplay.appendChild(feedbackSpan);

    setTimeout(() => {
        questionDisplay.querySelector('p').innerHTML = '';
        currentQuestionIndex++;
        displayQuestion();
    }, 2000);
}

function endQuiz() {
    clearInterval(timerInterval);
    timerDisplay.textContent = 'Quiz Over';

    const endMessageP = questionDisplay.querySelector('p');

    const quizEndTime = Date.now();
    const totalTimeSeconds = Math.round((quizEndTime - quizStartTime) / 1000);
    const totalQuestions = quizQuestions.length;
    const correctCount = currentScore / 10;
    const totalPossibleScore = totalQuestions * 10;
    const percentageScore = Math.round((currentScore / totalPossibleScore) * 100);
    const categoryName = localStorage.getItem('currentCategoryName') || 'Unknown';

    const finalStats = {
        date: new Date().toLocaleString(),
        category: categoryName,
        score: currentScore,
        totalQuestions : totalQuestions,
        correctCount: correctCount,
        percentage: percentageScore,
        timeTaken: totalTimeSeconds
    };

    localStorage.setItem('tempFinalStats', JSON.stringify(finalStats));

    questionDisplay.querySelector('p').innerHTML = `
        <span class="text-4xl font-extrabold text-[#E49732]">Quiz Complete!</span>
    `;
    
    answerButtonsContainer.innerHTML = `
        <p class="text-xl text-white font-bold mt-4">
            Final Score: ${currentScore} / ${totalPossibleScore} (${percentageScore}%)<br>
            Time Taken: ${totalTimeSeconds} seconds<br>
        </p>
    `;

    const saveBtn = document.createElement('button');
    saveBtn.textContent = "Save Results";
    saveBtn.className = "mt-6 bg-green-600 text-white py-3 px-6 rounded-full hover:bg-green-700 transition";
    saveBtn.onclick = saveAndRedirect;

    const restartBtn = document.createElement('button');
    restartBtn.textContent = "Start New Quiz (Don't Save)";
    restartBtn.className = "mt-6 bg-[#E49732] text-white py-3 px-6 rounded-full hover:bg-orange-500 transition";
    restartBtn.onclick = () => window.location.href = 'main.html';
    answerButtonsContainer.appendChild(saveBtn);
    answerButtonsContainer.appendChild(restartBtn);
}

function saveAndRedirect() {
    const finalStatsString = localStorage.getItem('tempFinalStats');
    if (!finalStatsString) {
        alert("Error: No quiz results to save.");
        return;
    }

    const newStats = JSON.parse(finalStatsString);

    const historyString = localStorage.getItem('quizHistory');
    let history = historyString ? JSON.parse(historyString) : [];

    history.unshift(newStats);

    localStorage.setItem('quizHistory', JSON.stringify(history));

    localStorage.removeItem('tempFinalStats');

    window.location.href = 'stats.html';
}

document.addEventListener('DOMContentLoaded', startQuizFromStorage);