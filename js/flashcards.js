// Math Flashcards - Personal Study Tool
// Simple flashcard system for math tutoring practice

class FlashcardApp {
    constructor() {
        this.flashcards = this.loadFlashcards();
        this.currentSession = [];
        this.currentIndex = 0;
        this.isFlipped = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.displayCards();
    }

    setupEventListeners() {
        document.getElementById('flashcardForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addFlashcard();
        });
    }

    addFlashcard() {
        const category = document.getElementById('category').value;
        const difficulty = document.getElementById('difficulty').value;
        const question = document.getElementById('question').value.trim();
        const answer = document.getElementById('answer').value.trim();

        if (!question || !answer) {
            alert('Please fill in both question and answer');
            return;
        }

        const flashcard = {
            id: Date.now(),
            category,
            difficulty,
            question,
            answer,
            created: new Date().toLocaleDateString(),
            timesStudied: 0
        };

        this.flashcards.push(flashcard);
        this.saveFlashcards();
        this.displayCards();

        // Clear form
        document.getElementById('question').value = '';
        document.getElementById('answer').value = '';

        alert('Flashcard added successfully!');
    }

    startStudySession() {
        if (this.flashcards.length === 0) {
            alert('Add some flashcards first!');
            return;
        }

        this.currentSession = [...this.flashcards];
        this.currentIndex = 0;
        this.isFlipped = false;

        document.getElementById('studyContainer').style.display = 'block';
        document.getElementById('cardList').style.display = 'none';
        document.querySelector('.study-controls').style.display = 'block';

        this.showCurrentCard();
        this.updateProgress();
    }

    studyByCategory() {
        if (this.flashcards.length === 0) {
            alert('Add some flashcards first!');
            return;
        }

        const categories = [...new Set(this.flashcards.map(card => card.category))];
        const selectedCategory = prompt(`Choose category:\n${categories.join('\n')}`);

        if (!selectedCategory || !categories.includes(selectedCategory)) {
            return;
        }

        this.currentSession = this.flashcards.filter(card => card.category === selectedCategory);
        this.currentIndex = 0;
        this.isFlipped = false;

        if (this.currentSession.length === 0) {
            alert('No cards found for this category');
            return;
        }

        document.getElementById('studyContainer').style.display = 'block';
        document.getElementById('cardList').style.display = 'none';
        document.querySelector('.study-controls').style.display = 'block';

        this.showCurrentCard();
        this.updateProgress();
    }

    showCurrentCard() {
        if (this.currentSession.length === 0) return;

        const card = this.currentSession[this.currentIndex];
        const cardElement = document.getElementById('flashcard');
        const contentElement = document.getElementById('cardContent');

        cardElement.classList.remove('flipped');
        contentElement.innerHTML = card.question;
        this.isFlipped = false;

        // Update study count
        card.timesStudied++;
        this.saveFlashcards();
    }

    flipCard() {
        if (this.currentSession.length === 0) return;

        const card = this.currentSession[this.currentIndex];
        const cardElement = document.getElementById('flashcard');
        const contentElement = document.getElementById('cardContent');

        if (this.isFlipped) {
            cardElement.classList.remove('flipped');
            contentElement.innerHTML = card.question;
        } else {
            cardElement.classList.add('flipped');
            contentElement.innerHTML = card.answer;
        }

        this.isFlipped = !this.isFlipped;
    }

    nextCard() {
        if (this.currentIndex < this.currentSession.length - 1) {
            this.currentIndex++;
            this.showCurrentCard();
            this.updateProgress();
        } else {
            alert('Session complete! Great job studying!');
            this.endSession();
        }
    }

    prevCard() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.showCurrentCard();
            this.updateProgress();
        }
    }

    shuffleCards() {
        this.currentSession = this.shuffleArray([...this.currentSession]);
        this.currentIndex = 0;
        this.showCurrentCard();
        this.updateProgress();
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    updateProgress() {
        document.getElementById('currentCard').textContent = this.currentIndex + 1;
        document.getElementById('totalCards').textContent = this.currentSession.length;
        
        const progressPercent = ((this.currentIndex + 1) / this.currentSession.length) * 100;
        document.getElementById('progressFill').style.width = progressPercent + '%';
    }

    endSession() {
        document.getElementById('studyContainer').style.display = 'none';
        document.getElementById('cardList').style.display = 'block';
        document.querySelector('.study-controls').style.display = 'none';
    }

    showAllCards() {
        document.getElementById('studyContainer').style.display = 'none';
        document.getElementById('cardList').style.display = 'block';
    }

    displayCards() {
        const container = document.getElementById('cardItems');
        
        if (this.flashcards.length === 0) {
            container.innerHTML = '<div class="no-cards">No flashcards yet. Add some above to get started!</div>';
            return;
        }

        container.innerHTML = this.flashcards.map(card => `
            <div class="flashcard-item">
                <div class="flashcard-preview">
                    <strong>${card.category} - ${card.difficulty}</strong>
                    <span>${card.question.substring(0, 80)}${card.question.length > 80 ? '...' : ''}</span>
                </div>
                <div class="flashcard-actions">
                    <button class="btn btn-small btn-secondary" onclick="app.editCard(${card.id})">Edit</button>
                    <button class="btn btn-small btn-danger" onclick="app.deleteCard(${card.id})">Delete</button>
                </div>
            </div>
        `).join('');
    }

    editCard(id) {
        const card = this.flashcards.find(c => c.id === id);
        if (!card) return;

        const newQuestion = prompt('Edit question:', card.question);
        const newAnswer = prompt('Edit answer:', card.answer);

        if (newQuestion !== null && newAnswer !== null) {
            card.question = newQuestion.trim();
            card.answer = newAnswer.trim();
            this.saveFlashcards();
            this.displayCards();
        }
    }

    deleteCard(id) {
        if (confirm('Are you sure you want to delete this flashcard?')) {
            this.flashcards = this.flashcards.filter(c => c.id !== id);
            this.saveFlashcards();
            this.displayCards();
        }
    }

    clearAllCards() {
        if (confirm('Are you sure you want to delete ALL flashcards? This cannot be undone.')) {
            this.flashcards = [];
            this.saveFlashcards();
            this.displayCards();
            alert('All flashcards deleted.');
        }
    }

    exportCards() {
        if (this.flashcards.length === 0) {
            alert('No flashcards to export');
            return;
        }

        const dataStr = JSON.stringify(this.flashcards, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `math-flashcards-${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    }

    importCards() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const imported = JSON.parse(e.target.result);
                        if (Array.isArray(imported)) {
                            if (confirm(`Import ${imported.length} flashcards? This will add to existing cards.`)) {
                                this.flashcards.push(...imported);
                                this.saveFlashcards();
                                this.displayCards();
                                alert('Flashcards imported successfully!');
                            }
                        } else {
                            alert('Invalid file format');
                        }
                    } catch (error) {
                        alert('Error reading file');
                    }
                };
                reader.readAsText(file);
            }
        };
        
        input.click();
    }

    loadFlashcards() {
        const stored = localStorage.getItem('mathFlashcards');
        return stored ? JSON.parse(stored) : [];
    }

    saveFlashcards() {
        localStorage.setItem('mathFlashcards', JSON.stringify(this.flashcards));
    }
}

// Global functions for button clicks
function flipCard() {
    app.flipCard();
}

function nextCard() {
    app.nextCard();
}

function prevCard() {
    app.prevCard();
}

function shuffleCards() {
    app.shuffleCards();
}

function endSession() {
    app.endSession();
}

function startStudySession() {
    app.startStudySession();
}

function studyByCategory() {
    app.studyByCategory();
}

function showAllCards() {
    app.showAllCards();
}

function exportCards() {
    app.exportCards();
}

function importCards() {
    app.importCards();
}

function clearAllCards() {
    app.clearAllCards();
}

// Hamburger menu functionality for consistent navigation
function initializeHamburgerMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    
    if (!hamburger || !navMenu) return;

    // Toggle mobile menu
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking on nav links
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Initialize the app and navigation
document.addEventListener('DOMContentLoaded', () => {
    initializeHamburgerMenu();
});

const app = new FlashcardApp();