const game = {
  level: 1,
  maxLevel: 100,
  password: '',
  requirements: [],

  // Initialize the game
  init() {
    this.passwordInput = document.querySelector('.password-input');
    this.requirementsContainer = document.querySelector('.requirements');
    this.levelDisplay = document.querySelector('.level-display');
    this.statusDisplay = document.querySelector('.status');
    this.hintDisplay = document.querySelector('.hint');

    this.passwordInput.addEventListener('input', (e) => {
      this.password = e.target.value;
      this.checkRequirements();
    });

    this.loadLevel();
  },

  // Load requirements for current level
  loadLevel() {
    this.requirements = [];
    this.levelDisplay.textContent = `Level ${this.level}`;
    this.passwordInput.value = '';
    this.password = '';
    
    // Add requirements based on level
    switch(this.level) {
      case 1:
        this.addRequirement('Must be at least 5 characters', (p) => p.length >= 5);
        break;
      case 2:
        this.addRequirement('Must contain at least one number', (p) => /\d/.test(p));
        this.addRequirement('Must be at least 5 characters', (p) => p.length >= 5);
        break;
      case 3:
        this.addRequirement('Must contain at least one uppercase letter', (p) => /[A-Z]/.test(p));
        this.addRequirement('Must contain at least one number', (p) => /\d/.test(p));
        this.addRequirement('Must be at least 6 characters', (p) => p.length >= 6);
        break;
      case 4:
        this.addRequirement('Must contain at least one special character (!@#$%^&*)', (p) => /[!@#$%^&*]/.test(p));
        this.addRequirement('Must contain at least one uppercase letter', (p) => /[A-Z]/.test(p));
        this.addRequirement('Must contain at least one number', (p) => /\d/.test(p));
        this.addRequirement('Must be at least 7 characters', (p) => p.length >= 7);
        break;
      case 5:
        this.addRequirement('Must contain exactly two numbers', (p) => (p.match(/\d/g) || []).length === 2);
        this.addRequirement('Must start with an uppercase letter', (p) => /^[A-Z]/.test(p));
        this.addRequirement('Must contain a special character (!@#$%^&*)', (p) => /[!@#$%^&*]/.test(p));
        this.addRequirement('Must be at least 8 characters', (p) => p.length >= 8);
        break;
      // Add more levels here with increasingly difficult requirements
      default:
        // Generate procedural requirements for higher levels
        this.generateHigherLevelRequirements();
    }

    this.renderRequirements();
    setTimeout(() => {
      document.querySelectorAll('.requirement').forEach(req => req.classList.add('active'));
    }, 100);
  },

  // Generate requirements for higher levels
  generateHigherLevelRequirements() {
    const minLength = Math.min(8 + Math.floor(this.level / 2), 20);
    this.addRequirement(`Must be at least ${minLength} characters`, (p) => p.length >= minLength);

    const numCount = Math.min(2 + Math.floor(this.level / 10), 5);
    this.addRequirement(`Must contain exactly ${numCount} numbers`, (p) => (p.match(/\d/g) || []).length === numCount);

    if (this.level % 3 === 0) {
      this.addRequirement('Must contain a palindrome of at least 3 characters', (p) => this.containsPalindrome(p));
    }

    if (this.level % 4 === 0) {
      this.addRequirement('Must contain ascending numbers', (p) => this.hasAscendingNumbers(p));
    }

    if (this.level % 5 === 0) {
      const sum = this.level * 2;
      this.addRequirement(`Numbers must sum to ${sum}`, (p) => this.sumOfNumbers(p) === sum);
    }

    if (this.level % 7 === 0) {
      this.addRequirement('Must contain your current level number', (p) => p.includes(this.level.toString()));
    }
  },

  // Helper functions for checking complex requirements
  containsPalindrome(str) {
    for (let i = 0; i < str.length - 2; i++) {
      for (let j = i + 2; j < str.length; j++) {
        const sub = str.slice(i, j + 1);
        if (sub === sub.split('').reverse().join('')) return true;
      }
    }
    return false;
  },

  hasAscendingNumbers(str) {
    const numbers = str.match(/\d+/g) || [];
    for (const num of numbers) {
      for (let i = 0; i < num.length - 1; i++) {
        if (parseInt(num[i]) < parseInt(num[i + 1])) return true;
      }
    }
    return false;
  },

  sumOfNumbers(str) {
    const numbers = str.match(/\d/g) || [];
    return numbers.reduce((sum, num) => sum + parseInt(num), 0);
  },

  // Add a new requirement
  addRequirement(description, checkFn) {
    this.requirements.push({ description, checkFn, met: false });
  },

  // Render requirements in the UI
  renderRequirements() {
    this.requirementsContainer.innerHTML = this.requirements
      .map((req, i) => `
        <div class="requirement" style="animation-delay: ${i * 100}ms">
          ${req.description}
        </div>
      `).join('');
  },

  // Check if all requirements are met
  checkRequirements() {
    let allMet = true;
    this.requirements.forEach((req, i) => {
      const element = this.requirementsContainer.children[i];
      const isMet = req.checkFn(this.password);
      req.met = isMet;
      element.classList.toggle('met', isMet);
      element.classList.toggle('unmet', !isMet);
      if (!isMet) allMet = false;
    });

    if (allMet && this.password.length > 0) {
      this.levelComplete();
    }
  },

  // Handle level completion
  levelComplete() {
    if (this.level >= this.maxLevel) {
      this.statusDisplay.innerHTML = `
        <div class="success">🎉 Congratulations! You've completed all ${this.maxLevel} levels!</div>
      `;
      this.passwordInput.disabled = true;
      return;
    }

    this.level++;
    this.statusDisplay.innerHTML = `
      <div class="success">✨ Level ${this.level - 1} complete!</div>
    `;
    setTimeout(() => {
      this.loadLevel();
      this.statusDisplay.innerHTML = '';
    }, 1500);
  }
};

// Start the game when the page loads
document.addEventListener('DOMContentLoaded', () => game.init()); 