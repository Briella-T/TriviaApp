const storedData = localStorage.getItem('selectedCategory');
let categoryTitle = 'Unselected Category';

if (storedData) {
    try {
        const categoryObject = JSON.parse(storedData);
        categoryTitle =categoryObject.name;
    } catch (e) {
        console.error("Error parsing stored category data:", e);
    }
}

document.getElementById('selected-cat').textContent = categoryTitle; 

const selectElement = document.getElementById('number-select');
        const outputElement = document.getElementById('output');
        const maxNumber = 20;
        function generateNumberOptions() {
            for (let i = 1; i <= maxNumber; i++) {
                const option = document.createElement('option');
                option.value = i;
                option.textContent = i;
                if (i === 1) {
                    option.selected = true;
                }
                selectElement.appendChild(option);
            }
        }
        generateNumberOptions();
        selectElement.addEventListener('change', handleSelectionChange);