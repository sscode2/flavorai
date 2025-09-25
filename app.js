// AI Recipe & Cooking Assistant - Frontend JavaScript
class RecipeAssistant {
    constructor() {
        this.savedRecipes = JSON.parse(localStorage.getItem('savedRecipes')) || [];
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateSavedCount();
        this.renderSavedRecipes();
    }

    bindEvents() {
        // Form submission
        document.getElementById('recipeForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit();
        });

        // Saved recipes panel
        document.getElementById('toggleSaved').addEventListener('click', () => {
            this.toggleSavedPanel();
        });

        document.getElementById('closeSaved').addEventListener('click', () => {
            this.closeSavedPanel();
        });

        // Error modal
        document.getElementById('closeModal').addEventListener('click', () => {
            this.hideErrorModal();
        });

        document.getElementById('retryButton').addEventListener('click', () => {
            this.hideErrorModal();
            this.handleFormSubmit();
        });

        // Close modal on backdrop click
        document.getElementById('errorModal').addEventListener('click', (e) => {
            if (e.target.id === 'errorModal') {
                this.hideErrorModal();
            }
        });
    }

    async handleFormSubmit() {
        const ingredients = document.getElementById('ingredients').value.trim();
        const tone = document.getElementById('tone').value;
        const pdfFile = document.getElementById('pdfUpload').files[0];

        if (!ingredients && !pdfFile) {
            this.showError('Please enter ingredients or upload a PDF file');
            return;
        }

        this.showLoader();

        try {
            let prompt = '';
            
            if (pdfFile) {
                // Extract text from PDF (simulated - in production, use a PDF parsing library)
                const pdfText = await this.extractTextFromPDF(pdfFile);
                prompt = `Summarize and create recipes from this PDF content: ${pdfText}`;
            } else {
                prompt = `Create 3 recipe suggestions using these ingredients: ${ingredients}. Tone: ${tone}.`;
            }

            const recipes = await this.callAIApi(prompt, tone);
            this.displayRecipes(recipes);
            
        } catch (error) {
            console.error('Error:', error);
            this.showError('Failed to generate recipes. Please try again.');
        } finally {
            this.hideLoader();
        }
    }

    async extractTextFromPDF(pdfFile) {
        // In a real implementation, you would use a library like pdf.js or pdf-parse
        // This is a simulation for the prototype
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(`PDF content extracted from ${pdfFile.name}. This would contain actual text in production.`);
            }, 1000);
        });
    }

    async callAIApi(prompt, tone) {
        // Replace with your actual serverless endpoint
        const API_ENDPOINT = 'https://your-serverless-function.com/api/generate';
        
        // For demo purposes, we'll use mock data if the endpoint is not configured
        if (API_ENDPOINT.includes('your-serverless-function')) {
            return this.generateMockRecipes();
        }

        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: prompt,
                tone: tone,
                max_tokens: 1500
            })
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        return data.recipes;
    }

    generateMockRecipes() {
        // Mock data for demonstration
        return [
            {
                id: 1,
                title: "Spanish Rice with Eggs",
                description: "A delicious and easy one-pan meal that combines fluffy rice with perfectly cooked eggs and fresh tomatoes.",
                cookTime: "25 min",
                difficulty: "Easy",
                calories: "320",
                ingredients: [
                    "2 cups cooked rice",
                    "4 large eggs",
                    "2 tomatoes, diced",
                    "1 onion, chopped",
                    "2 cloves garlic, minced",
                    "2 tbsp olive oil",
                    "Salt and pepper to taste",
                    "Fresh parsley for garnish"
                ],
                instructions: [
                    "Heat olive oil in a large pan over medium heat.",
                    "Add onions and garlic, cook until softened (3-4 minutes).",
                    "Add diced tomatoes and cook for another 5 minutes.",
                    "Stir in cooked rice and season with salt and pepper.",
                    "Create 4 wells in the rice mixture and crack an egg into each well.",
                    "Cover and cook for 6-8 minutes until eggs are set.",
                    "Garnish with fresh parsley and serve hot."
                ]
            },
            {
                id: 2,
                title: "Tomato Egg Drop Soup",
                description: "A comforting and light soup that's perfect for a quick lunch or light dinner.",
                cookTime: "15 min",
                difficulty: "Very Easy",
                calories: "180",
                ingredients: [
                    "4 cups vegetable broth",
                    "3 eggs, beaten",
                    "2 tomatoes, chopped",
                    "2 green onions, sliced",
                    "1 tsp ginger, grated",
                    "1 tbsp soy sauce",
                    "1 tsp sesame oil"
                ],
                instructions: [
                    "Bring vegetable broth to a boil in a medium pot.",
                    "Add chopped tomatoes and grated ginger, simmer for 5 minutes.",
                    "Slowly drizzle in beaten eggs while stirring the soup.",
                    "Add soy sauce and sesame oil.",
                    "Garnish with green onions and serve immediately."
                ]
            },
            {
                id: 3,
                title: "Rice Frittata with Fresh Herbs",
                description: "A versatile frittata that turns leftover rice into a protein-packed meal.",
                cookTime: "30 min",
                difficulty: "Medium",
                calories: "280",
                ingredients: [
                    "6 large eggs",
                    "2 cups cooked rice",
                    "1 tomato, diced",
                    "1/2 onion, finely chopped",
                    "1/4 cup milk",
                    "1/2 cup shredded cheese",
                    "2 tbsp fresh herbs (parsley, chives)",
                    "Salt and pepper to taste"
                ],
                instructions: [
                    "Preheat oven to 375°F (190°C).",
                    "Whisk eggs with milk, salt, and pepper.",
                    "Mix in cooked rice, tomatoes, onions, and herbs.",
                    "Pour mixture into a greased oven-safe skillet.",
                    "Sprinkle cheese on top.",
                    "Bake for 20-25 minutes until set and golden.",
                    "Let cool for 5 minutes before serving."
                ]
            }
        ];
    }

    displayRecipes(recipes) {
        const resultsSection = document.getElementById('resultsSection');
        const recipesGrid = document.getElementById('recipesGrid');
        
        recipesGrid.innerHTML = '';
        
        recipes.forEach(recipe => {
            const recipeCard = this.createRecipeCard(recipe);
            recipesGrid.appendChild(recipeCard);
        });
        
        resultsSection.style.display = 'block';
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }

    createRecipeCard(recipe) {
        const card = document.createElement('div');
        card.className = 'recipe-card';
        card.innerHTML = `
            <div class="recipe-header">
                <h3 class="recipe-title">${recipe.title}</h3>
                <div class="recipe-meta">
                    <span class="meta-tag time">⏱ ${recipe.cookTime}</span>
                    <span class="meta-tag difficulty">📊 ${recipe.difficulty}</span>
                    <span class="meta-tag calories">🔥 ${recipe.calories} cal</span>
                </div>
            </div>
            <div class="recipe-body">
                <p class="recipe-description">${recipe.description}</p>
                
                <div class="recipe-details">
                    <div class="detail-section">
                        <h4>Ingredients</h4>
                        <ul class="ingredients-list">
                            ${recipe.ingredients.map(ing => `<li>${ing}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="detail-section">
                        <h4>Instructions</h4>
                        <ol class="instructions-list">
                            ${recipe.instructions.map(step => `<li>${step}</li>`).join('')}
                        </ol>
                    </div>
                </div>
                
                <div class="recipe-actions">
                    <button class="secondary-btn save" onclick="recipeApp.saveRecipe(${recipe.id})">
                        💾 Save Recipe
                    </button>
                    <button class="secondary-btn" onclick="recipeApp.downloadPDF(${recipe.id})">
                        📄 Download PDF
                    </button>
                </div>
            </div>
        `;
        
        return card;
    }

    saveRecipe(recipeId) {
        const recipes = this.getCurrentRecipes();
        const recipe = recipes.find(r => r.id === recipeId);
        
        if (recipe && !this.savedRecipes.find(r => r.id === recipeId)) {
            this.savedRecipes.push(recipe);
            localStorage.setItem('savedRecipes', JSON.stringify(this.savedRecipes));
            this.updateSavedCount();
            this.renderSavedRecipes();
            this.showSaveFeedback(recipeId);
        }
    }

    showSaveFeedback(recipeId) {
        const saveBtn = document.querySelector(`button[onclick="recipeApp.saveRecipe(${recipeId})"]`);
        if (saveBtn) {
            saveBtn.textContent = '✓ Saved!';
            saveBtn.className = 'secondary-btn saved';
            saveBtn.disabled = true;
        }
    }

    removeSavedRecipe(recipeId) {
        this.savedRecipes = this.savedRecipes.filter(recipe => recipe.id !== recipeId);
        localStorage.setItem('savedRecipes', JSON.stringify(this.savedRecipes));
        this.updateSavedCount();
        this.renderSavedRecipes();
    }

    downloadPDF(recipeId) {
        const recipes = this.getCurrentRecipes();
        const recipe = recipes.find(r => r.id === recipeId);
        
        if (recipe) {
            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
                <html>
                    <head>
                        <title>${recipe.title}</title>
                        <style>
                            body { font-family: Arial, sans-serif; padding: 20px; }
                            h1 { color: #333; }
                            .meta { margin: 20px 0; }
                            .section { margin: 15px 0; }
                        </style>
                    </head>
                    <body>
                        <h1>${recipe.title}</h1>
                        <div class="meta">
                            <strong>Cook Time:</strong> ${recipe.cookTime} | 
                            <strong>Difficulty:</strong> ${recipe.difficulty} | 
                            <strong>Calories:</strong> ${recipe.calories}
                        </div>
                        <p>${recipe.description}</p>
                        
                        <div class="section">
                            <h3>Ingredients</h3>
                            <ul>${recipe.ingredients.map(ing => `<li>${ing}</li>`).join('')}</ul>
                        </div>
                        
                        <div class="section">
                            <h3>Instructions</h3>
                            <ol>${recipe.instructions.map(step => `<li>${step}</li>`).join('')}</ol>
                        </div>
                    </body>
                </html>
            `);
            
            printWindow.document.close();
            printWindow.print();
        }
    }

    getCurrentRecipes() {
        // In a real app, this would come from the API response
        // For demo, we use mock data
        return this.generateMockRecipes();
    }

    updateSavedCount() {
        const toggleBtn = document.getElementById('toggleSaved');
        toggleBtn.textContent = `View Saved Recipes (${this.savedRecipes.length})`;
    }

    renderSavedRecipes() {
        const savedList = document.getElementById('savedList');
        savedList.innerHTML = '';
        
        if (this.savedRecipes.length === 0) {
            savedList.innerHTML = '<p style="text-align: center; color: #636e72; padding: 2rem;">No saved recipes yet</p>';
            return;
        }
        
        this.savedRecipes.forEach(recipe => {
            const item = document.createElement('div');
            item.className = 'saved-recipe-item';
            item.innerHTML = `
                <h4 class="saved-recipe-title">${recipe.title}</h4>
                <div class="saved-recipe-meta">
                    <span class="meta-tag time">${recipe.cookTime}</span>
                    <span class="meta-tag difficulty">${recipe.difficulty}</span>
                </div>
                <div class="saved-recipe-actions">
                    <button class="secondary-btn" onclick="recipeApp.downloadPDF(${recipe.id})">📄 PDF</button>
                    <button class="secondary-btn" onclick="recipeApp.removeSavedRecipe(${recipe.id})">🗑 Remove</button>
                </div>
            `;
            savedList.appendChild(item);
        });
    }

    toggleSavedPanel() {
        document.getElementById('savedPanel').classList.add('open');
    }

    closeSavedPanel() {
        document.getElementById('savedPanel').classList.remove('open');
    }

    showLoader() {
        const btn = document.getElementById('findRecipes');
        const btnText = btn.querySelector('.btn-text');
        const btnLoader = btn.querySelector('.btn-loader');
        
        btn.disabled = true;
        btnText.style.display = 'none';
        btnLoader.style.display = 'flex';
    }

    hideLoader() {
        const btn = document.getElementById('findRecipes');
        const btnText = btn.querySelector('.btn-text');
        const btnLoader = btn.querySelector('.btn-loader');
        
        btn.disabled = false;
        btnText.style.display = 'block';
        btnLoader.style.display = 'none';
    }

    showError(message) {
        document.getElementById('errorMessage').textContent = message;
        document.getElementById('errorModal').classList.add('show');
    }

    hideErrorModal() {
        document.getElementById('errorModal').classList.remove('show');
    }
}

// Initialize the app
const recipeApp = new RecipeAssistant();