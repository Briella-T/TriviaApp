const startButton = document.getElementById('start-quiz-btn');
const difficultySelect = document.getElementById('difficulty-select');
const numberSelect = document.getElementById('number-select');
const typeSelect = document.getElementById('type-select');
const selectedCatDisplay = document.getElementById('category-select'); 

let categoryId = null;

function initializePage() {
    const params = new URLSearchParams(window.location.search);
    const storedId = params.get('category_id');
    const storedName = params.get('category_name');
    
    if (storedId && storedName) {
        categoryId = storedId;
        selectedCatDisplay.textContent = decodeURIComponent(storedName);
    } else {
        selectedCatDisplay.textContent = "General Knowledge";
        categoryId = 9; 
    }
    generateNumberOptions(50);
    
    correctSelectOptions();
}

function generateNumberOptions(max) {
    for (let i = 1; i <= max; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        numberSelect.appendChild(option);
    }
    numberSelect.value = 5;
}

function correctSelectOptions() {
    difficultySelect.options[1].value = 'easy';
    difficultySelect.options[2].value = 'medium';
    difficultySelect.options[3].value = 'hard';

    typeSelect.options[1].value = 'multiple';
    typeSelect.options[2].value = 'boolean'; 
}


async function fetchAndStoreQuiz(event) {
    event.preventDefault(); 
    
    if (!categoryId || !difficultySelect.value || !numberSelect.value || !typeSelect.value) {
        alert("Please ensure all selections (difficulty, amount, type) are chosen.");
        return;
    }

    const amount = numberSelect.value;
    const difficulty = difficultySelect.value;
    const type = typeSelect.value;
    
    const apiUrl = `https://opentdb.com/api.php?amount=${amount}&category=${categoryId}&difficulty=${difficulty}&type=${type}`;

    startButton.textContent = "Fetching Questions...";
    startButton.disabled = true;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.response_code !== 0 || data.results.length === 0) {
            alert("Error: Could not retrieve questions. Try selecting fewer questions or an easier difficulty.");
            startButton.textContent = "Start Quiz";
            startButton.disabled = false;
            return;
        }

        localStorage.setItem('currentQuizData', JSON.stringify(data.results));
        localStorage.setItem('currentCategoryName', selectedCatDisplay.textContent);
        
        window.location.href = 'mainQuiz.html'; 

    } catch (error) {
        console.error("Network or API Fetch Error:", error);
        alert("An error occurred while connecting to the trivia server.");
        startButton.textContent = "Start Quiz";
        startButton.disabled = false;
    }
}

document.addEventListener('DOMContentLoaded', initializePage);

document.querySelector('#start-quiz-btn').parentNode.addEventListener('click', fetchAndStoreQuiz);
