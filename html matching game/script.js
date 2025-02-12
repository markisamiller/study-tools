class MatchingGame {
    constructor() {
        // Start with empty terms
        this.allTerms = {};

        // Replace the sample terms with mathematical terms
        this.allTerms = {
            "Linear Equation": "An equation where the variables are only to the first power, representing a straight line",
            "Coefficient": "The number multiplied by a variable in an equation (e.g., in 3x + 2y = 5, 3 is the coefficient of x)",
            "Constant Term": "A number in an equation that's not attached to any variable (e.g., in 3x + 2y = 5, 5 is the constant term)",
            "Line": "A straight set of points extending infinitely in both directions, represented by a linear equation in two variables",
            "Plane": "A flat surface extending infinitely in all directions, represented by a linear equation in three variables",
            "Cartesian Plane": "A coordinate system with two perpendicular axes (x and y) that intersect at the origin",
            "Real Coordinate Space": "A space where points are located using coordinates that are real numbers (e.g., R2, R3)",
            "Tuples": "An ordered list of numbers used to represent points in coordinate space (e.g., (1, 2, 3))",
            "Real Numbers": "All numbers on the number line, including integers, fractions, decimals, and irrational numbers",
            "Vectors": "Arrows with magnitude and direction, used to represent quantities like force or velocity",
            "Matrices": "Rectangular arrays of numbers arranged in rows and columns, used to manipulate data and equations",
            "Systems of Linear Equations": "A set of two or more linear equations with the same variables solved simultaneously",
            "Non-Linear Equations": "Equations where variables appear with powers other than 1 (e.g., squared or cubed terms)",
            "Variables": "Symbols (like x, y, z) that represent unknown quantities in an equation",
            "Solution": "A set of values for variables that make an equation or system of equations true",
            "Solution Set": "The collection of all possible solutions to an equation or system of equations",
            "System": "A set of two or more linear equations that are considered together"
        };

        this.score = 0;
        this.completedTerms = new Set();
        this.currentSet = [];
        this.selectedTerm = null;
        this.selectedDefinition = null;

        this.initializeElements();
        this.initializeEventListeners();
        this.updateStats();
        this.generateNewSet();

        // Add new event listener for loading terms
        document.getElementById('loadTerms').addEventListener('click', () => this.loadTermsFromInput());
    }

    initializeElements() {
        this.termsContainer = document.getElementById('terms');
        this.definitionsContainer = document.getElementById('definitions');
        this.scoreElement = document.getElementById('score');
        this.completedElement = document.getElementById('completed');
        this.totalElement = document.getElementById('total');
        this.nextSetButton = document.getElementById('nextSet');
        this.resetButton = document.getElementById('reset');

        this.totalElement.textContent = Object.keys(this.allTerms).length;
    }

    initializeEventListeners() {
        this.nextSetButton.addEventListener('click', () => this.generateNewSet());
        this.resetButton.addEventListener('click', () => this.resetGame());
    }

    updateStats() {
        this.scoreElement.textContent = this.score;
        this.completedElement.textContent = this.completedTerms.size;
    }

    generateNewSet() {
        this.termsContainer.innerHTML = '';
        this.definitionsContainer.innerHTML = '';
        this.selectedTerm = null;
        this.selectedDefinition = null;

        // Get available terms (excluding completed ones if possible)
        let availableTerms = Object.keys(this.allTerms).filter(term => 
            this.currentSet.length < 10 && !this.currentSet.includes(term)
        );

        // If we need more terms, include completed ones
        if (availableTerms.length < 10) {
            availableTerms = Object.keys(this.allTerms);
        }

        // Randomly select 10 terms
        this.currentSet = [];
        while (this.currentSet.length < 10 && availableTerms.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableTerms.length);
            this.currentSet.push(availableTerms.splice(randomIndex, 1)[0]);
        }

        // Create and shuffle the terms and definitions
        const shuffledDefinitions = [...this.currentSet]
            .map(term => this.allTerms[term])
            .sort(() => Math.random() - 0.5);

        this.currentSet.forEach(term => {
            const termDiv = this.createClickableElement(term, 'term');
            this.termsContainer.appendChild(termDiv);
        });

        shuffledDefinitions.forEach(definition => {
            const definitionDiv = this.createClickableElement(definition, 'definition');
            this.definitionsContainer.appendChild(definitionDiv);
        });
    }

    createClickableElement(text, className) {
        const element = document.createElement('div');
        element.className = className;
        element.textContent = text;
        element.addEventListener('click', () => this.handleSelection(element, className));
        return element;
    }

    handleSelection(element, type) {
        if (element.classList.contains('matched')) return;

        if (type === 'term') {
            if (this.selectedTerm) {
                this.selectedTerm.classList.remove('selected');
            }
            this.selectedTerm = element;
            element.classList.add('selected');
        } else {
            if (this.selectedDefinition) {
                this.selectedDefinition.classList.remove('selected');
            }
            this.selectedDefinition = element;
            element.classList.add('selected');
        }

        if (this.selectedTerm && this.selectedDefinition) {
            this.checkMatch();
        }
    }

    checkMatch() {
        const term = this.selectedTerm.textContent;
        const definition = this.selectedDefinition.textContent;

        if (this.allTerms[term] === definition) {
            this.selectedTerm.classList.remove('selected');
            this.selectedDefinition.classList.remove('selected');
            this.selectedTerm.classList.add('matched');
            this.selectedDefinition.classList.add('matched');
            this.completedTerms.add(term);
            this.score += 10;
        } else {
            this.score = Math.max(0, this.score - 5);
        }

        this.updateStats();
        this.selectedTerm = null;
        this.selectedDefinition = null;

        // Check if all pairs in current set are matched
        const allMatched = Array.from(this.termsContainer.children)
            .every(term => term.classList.contains('matched'));
        
        if (allMatched) {
            setTimeout(() => {
                alert('Great job! Click "Next Set" to continue.');
            }, 500);
        }
    }

    resetGame() {
        this.score = 0;
        this.completedTerms.clear();
        this.currentSet = [];
        this.updateStats();
        this.generateNewSet();
    }

    loadTermsFromInput() {
        const input = document.getElementById('termsInput').value;
        const lines = input.trim().split('\n');
        
        // Clear existing terms
        this.allTerms = {};
        
        // Process each line
        lines.forEach(line => {
            // Split on first colon only
            const [term, definition] = line.split(/:(.*)/s).map(str => str?.trim()).filter(Boolean);
            if (term && definition) {
                this.allTerms[term] = definition;
            }
        });

        // Update total count
        this.totalElement.textContent = Object.keys(this.allTerms).length;
        
        // Reset game with new terms
        this.resetGame();
        
        // Clear input
        document.getElementById('termsInput').value = '';
    }
}

// Initialize the game when the page loads
window.addEventListener('load', () => {
    new MatchingGame();
}); 