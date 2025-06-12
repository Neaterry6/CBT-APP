// client/js/quiz.js
import { showElement, hideElement } from './ui.js';
import { saveQuizResult } from './api.js';

export default class QuizApp {
    constructor() {
        // DOM Elements
        this.explanationText = document.getElementById('explanationText');
        this.explanationContainer = document.getElementById('explanationContainer');
        this.wikiSearchInput = document.getElementById('wikiSearchInput');
        this.wikiSearchBtn = document.getElementById('wikiSearchBtn');
        this.wikiResults = document.getElementById('wikiResults');
        this.wikiContent = document.getElementById('wikiContent');
        this.currentSubject = null;
        this.currentQuestion = null;
        this.selectedAnswer = null;
        this.sessionData = [];
        this.currentQuestionIndex = 0;
        this.totalQuestions = 10;
        this.timeRemaining = 30;
        this.timer = null;
        // Other DOM elements (omitted for brevity, e.g., submitBtn, nextBtn)
        this.bindEventListeners();
        this.init();
    }

    bindEventListeners() {
        // Quiz-related listeners
        // this.submitBtn.addEventListener('click', () => this.submitAnswer());
        // this.nextBtn.addEventListener('click', () => this.nextQuestion());
        // Add Wikipedia search listeners
        this.wikiSearchBtn.addEventListener('click', () => this.searchWikipedia());
        this.wikiSearchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.searchWikipedia();
        });
        // Other listeners (e.g., subject buttons, study plan buttons) as in original code
    }

    init() {
        console.log('Initializing QuizApp...');
        // Initialization logic (as in original code)
        // Example: Check localStorage for profile, show dashboard or auth modal
    }

    async submitAnswer() {
        clearInterval(this.timer);
        const isCorrect = this.selectedAnswer === this.currentQuestion.answer;
        this.sessionData.push({
            question: this.currentQuestion,
            userAnswer: this.selectedAnswer,
            correct: isCorrect,
            timeSpent: 30 - this.timeRemaining
        });
        this.showCorrectAnswer();
        await this.showExplanation();
        showElement('nextBtn');
        hideElement('submitBtn');
        try {
            await saveQuizResult(this.sessionData[this.currentQuestionIndex]);
        } catch (error) {
            console.error('Failed to save quiz result:', error);
        }
    }

    showCorrectAnswer() {
        document.querySelectorAll('.option-button').forEach(btn => {
            if (btn.dataset.option === this.currentQuestion.answer) {
                btn.classList.add('bg-green-600');
            } else if (btn.dataset.option === this.selectedAnswer && !this.sessionData[this.currentQuestionIndex].correct) {
                btn.classList.add('bg-red-600');
            }
        });
        if (this.sessionData[this.currentQuestionIndex].correct) {
            this.showConfetti();
        }
    }

    showConfetti() {
        const confettiContainer = document.getElementById('confettiContainer');
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = `${Math.random() * 100}vw`;
            confetti.style.background = ['#f00', '#0f0', '#00f', '#ff0'][Math.floor(Math.random() * 4)];
            confetti.style.animationDelay = `${Math.random() * 2}s`;
            confettiContainer.appendChild(confetti);
            setTimeout(() => confetti.remove(), 3000);
        }
    }

    cleanAIResponse(text) {
        return text
            .replace(/\*\*|\*|_|\#\#/g, '')
            .replace(/\n\s*\n/g, '\n')
            .replace(/^\s+|\s+$/g, '')
            .replace(/```/g, '');
    }

    async showExplanation() {
        try {
            this.explanationText.textContent = 'Generating explanation...';
            showElement('explanationContainer');
            const prompt = `You are an expert tutor for the University of Ibadan POST UTME CBT. Provide a detailed, educational explanation for the following ${this.currentSubject} question, suitable for a student preparing for the exam. Include why the correct answer is right, why other options are incorrect, and address common misconceptions. Keep the tone clear, concise, and engaging. Do not use markdown formatting.

Question: "${this.currentQuestion.question}"
Options:
A) ${this.currentQuestion.option.a || 'N/A'}
B) ${this.currentQuestion.option.b || 'N/A'}
C) ${this.currentQuestion.option.c || 'N/A'}
D) ${this.currentQuestion.option.d || 'N/A'}
Correct Answer: ${this.currentQuestion.answer}
Student's Answer: ${this.selectedAnswer || 'No answer selected'}

Explanation should be 150-300 words, structured with an introduction, explanation of the correct answer, analysis of incorrect options, and a summary of key takeaways. After the explanation, explicitly state: "Correct Answer: [answer]".`;

            const response = await fetch(`https://kaiz-apis.gleeze.com/api/gpt-4.1?ask=${encodeURIComponent(prompt)}&uid=1268&apikey=a0ebe80e-bf1a-4dbf-8d36-6935b1bfa5ea`);
            if (!response.ok) throw new Error('API failed');
            const data = await response.json();
            this.explanationText.textContent = this.cleanAIResponse(data.response) + `\n\nCorrect Answer: ${this.currentQuestion.answer}`;
        } catch (error) {
            console.error('Error getting explanation:', error);
            this.explanationText.textContent = `Explanation: The correct answer is ${this.currentQuestion.answer}. Review key ${this.currentSubject} concepts in your textbook to understand this question better.\n\nCorrect Answer: ${this.currentQuestion.answer}`;
        }
    }

    async searchWikipedia() {
        const query = this.wikiSearchInput.value.trim();
        if (!query) {
            alert('Please enter a search term');
            return;
        }
        this.wikiContent.innerHTML = '<div class="flex items-center justify-center py-4"><div class="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div><span class="ml-2">Searching...</span></div>';
        showElement('wikiResults');
        try {
            const searchResponse = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*`);
            if (!searchResponse.ok) throw new Error('Search failed');
            const searchData = await searchResponse.json();
            const topResult = searchData.query.search[0]?.title;
            if (!topResult) throw new Error('No results found');
            const parseResponse = await fetch(`https://en.wikipedia.org/w/api.php?action=parse&page=${encodeURIComponent(topResult)}&prop=text&format=json&origin=*`);
            if (!parseResponse.ok) throw new Error('Parse failed');
            const parseData = await parseResponse.json();
            const imageResponse = await fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(topResult)}&prop=images&format=json&origin=*`);
            const imageData = imageResponse.ok ? await imageResponse.json() : {};
            const imageTitle = Object.values(imageData.query.pages)[0]?.images[0]?.title;
            let imageUrl = '';
            if (imageTitle) {
                const imageInfoResponse = await fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(imageTitle)}&prop=imageinfo&iiprop=url&format=json&origin=*`);
                const imageInfoData = await imageInfoResponse.json();
                imageUrl = Object.values(imageInfoData.query.pages)[0]?.imageinfo[0]?.url || '';
            }
            const content = parseData.parse.text['*'];
            this.wikiContent.innerHTML = `
                <h3 class="text-xl font-bold mb-2">${topResult}</h3>
                ${imageUrl ? `<img src="${imageUrl}" alt="${topResult}" class="max-w-full h-auto mb-4 rounded">` : ''}
                <div class="wiki-extract">${content.slice(0, 1000)}...</div>
                <a href="https://en.wikipedia.org/wiki/${encodeURIComponent(topResult)}" target="_blank" class="text-blue-400 hover:underline">Read more on Wikipedia</a>
            `;
        } catch (error) {
            console.error('Wikipedia search error:', error);
            this.wikiContent.innerHTML = '<p class="text-red-400">Failed to load Wikipedia content. Please try again.</p>';
        }
    }

    // Other methods (e.g., loadQuestion, startQuiz, etc.) as in original code
}