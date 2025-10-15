//Category information
window.categories = [
    {   id: 9, name: "General", icon: "fas fa-lightbulb" }, 
    { id: 10, name: "Books", icon: "fas fa-book" },
    { id: 11, name: "Film", icon: "fas fa-film" },
    { id: 12, name: "Music", icon: "fas fa-music" },
    { id: 15, name: "Video Games", icon: "fas fa-gamepad" },
    { id: 23, name: "History", icon: "fas fa-landmark" },
    { id: 25, name: "Art", icon: "fa-solid fa-palette" },
    { id: 20, name: "Mythology", icon: "fas fa-chess-knight" },
    { id: 27, name: "Animals", icon: "fa-solid fa-paw" },
    { id: 22, name: "Geography", icon: "fas fa-futbol" },
    { id: 13, name: "Musicals", icon: "fa-solid fa-masks-theater" },
    { id: 16, name: "Board Games", icon: "fa-solid fa-dice" },
    { id: 18, name: "Computers", icon: "fa-solid fa-computer" },
    { id: 21, name: "Sports", icon: "fas fa-futbol" },
    { id: 28, name: "Vehicles", icon: "fas fa-car" },
];

const categoryEl = document.getElementById('categoryContainer');

function renderCategories() {
    categories.forEach(category => {
        categoryEl.innerHTML += `
        <div class="category-card bg-stone-700 p-6 rounded-xl border-b-4 border-orange-500 cursor-pointer text-orange-500 hover:text-stone-700 hover:bg-orange-500 text-center"
             data-category-id="${category.id}" 
             data-category-name="${category.name}">
            <i class="${category.icon} text-4xl mb-3 block"></i>
            <h3 class="text-xl font-bold">${category.name}</h3>
        </div>`;
    });
}

function handleCategoryClick(event) {
    const card = event.target.closest('.category-card'); 
    
    if (!card) return;
    const categoryId = card.getAttribute('data-category-id');
    const categoryName = card.getAttribute('data-category-name');

    if (categoryId && categoryName) {
        const url = `quizOptions.html?category_id=${categoryId}&category_name=${encodeURIComponent(categoryName)}`;
        
        localStorage.setItem('selectedCategory', JSON.stringify({id: categoryId, name: categoryName}));
        
        window.location.href = url;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderCategories();

    document.getElementById('categoryContainer').addEventListener('click', handleCategoryClick);
});
