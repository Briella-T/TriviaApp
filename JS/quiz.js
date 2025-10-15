
let quizQuestions = [];
let currentQuestionIndex = 0;
let currentScore = 0;

const questionDisplay = document.getElementById('question-display');
const answerButtonsContainer = document.getElementById('answer-buttons-container');
const scoreDisplay = document.getElementById('score-display');
const qNumDisplay = document.getElementById('q-num');
const qTotalDisplay = document.getElementById('q-total');
const categoryDisplay = document.getElementById('current-category');

const decodeHTML = (html) => {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
};


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
    Array.from(answerButtonsContainer.children).forEach(btn => btn.disabled = true);

    if (isCorrect) {
        currentScore += 10;
        clickedButton.classList.remove('bg-amber-50', 'hover:bg-[#E49732]', 'text-gray-700');
        clickedButton.classList.add('bg-green-500', 'text-white');
    } else {
        clickedButton.classList.remove('bg-amber-50', 'hover:bg-[#E49732]', 'text-gray-700');
        clickedButton.classList.add('bg-red-500', 'text-white');

        Array.from(answerButtonsContainer.children).forEach(btn => {
            if (btn.innerHTML === correctAnswerText) {
                btn.classList.remove('bg-amber-50', 'text-gray-700');
                btn.classList.add('bg-green-500', 'text-white', 'border-4', 'border-green-700'); 
            }
        });
    }
    setTimeout(() => {
        currentQuestionIndex++;
        displayQuestion();
    }, 2000);
}
function endQuiz() {
    questionDisplay.querySelector('p').innerHTML = `
        <span class="text-4xl font-extrabold text-[#E49732]">Quiz Complete!</span>
    `;
    
    answerButtonsContainer.innerHTML = `
        <p class="text-xl text-white font-bold mt-4">
            Final Score: ${currentScore} / ${quizQuestions.length * 10}
        </p>
    `;
    
    const restartBtn = document.createElement('button');
    restartBtn.textContent = "Start New Quiz";
    restartBtn.className = "mt-6 bg-[#E49732] text-white py-3 px-6 rounded-full hover:bg-orange-500 transition";
    restartBtn.onclick = () => window.location.href = 'main.html';
    answerButtonsContainer.appendChild(restartBtn);
}

document.addEventListener('DOMContentLoaded', startQuizFromStorage);