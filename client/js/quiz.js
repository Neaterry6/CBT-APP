// client/js/quiz.js
import { showElement, hideElement } from './ui.js';
import { saveUserProfile, saveQuizResult, saveStudiedTopic, fetchLeaderboard } from './api.js';

export default class QuizApp {
    constructor() {
        // DOM Elements
        this.loadingPage = document.getElementById('loadingPage');
        this.appContainer = document.getElementById('appContainer');
        this.authModal = document.getElementById('authModal');
        this.profileAvatar = document.getElementById('profileAvatar');
        this.profileName = document.getElementById('profileName');
        this.nicknameInput = document.getElementById('nicknameInput');
        this.avatarInput = document.getElementById('avatarInput');
        this.avatarPreview = document.getElementById('avatarPreview');
        this.authBtn = document.getElementById('authBtn');
        this.logoutBtn = document.getElementById('logoutBtn');
        this.dashboard = document.getElementById('dashboard');
        this.welcomeName = document.getElementById('welcomeName');
        this.quizSettingsModal = document.getElementById('quizSettingsModal');
        this.questionCount = document.getElementById('questionCount');
        this.timePerQuestion = document.getElementById('timePerQuestion');
        this.startQuizBtn = document.getElementById('startQuizBtn');
        this.quizSection = document.getElementById('quizSection');
        this.questionCounter = document.getElementById('questionCounter');
        this.timerDisplay = document.getElementById('timerDisplay');
        this.progressFill = document.getElementById('progressFill');
        this.questionImage = document.getElementById('questionImage');
        this.questionText = document.getElementById('questionText');
        this.optionsContainer = document.getElementById('optionsContainer');
        this.prevBtn = document.getElementById('prevBtn');
        this.submitBtn = document.getElementById('submitBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.explanationContainer = document.getElementById('explanationContainer');
        this.explanationText = document.getElementById('explanationText');
        this.toggleAI = document.getElementById('toggleAI');
        this.reviewSection = document.getElementById('reviewSection');
        this.reviewContent = document.getElementById('reviewContent');
        this.backToDashboard = document.getElementById('backToDashboard');
        this.retryQuiz = document.getElementById('retryQuiz');
        this.studyPlanSection = document.getElementById('studyPlanSection');
        this.studySubjectTitle = document.getElementById('studySubjectTitle');
        this.topicSelection = document.getElementById('topicSelection');
        this.topicsContainer = document.getElementById('topicsContainer');
        this.studyContent = document.getElementById('studyContent');
        this.currentTopicTitle = document.getElementById('currentTopicTitle');
        this.studyPlanContent = document.getElementById('studyPlanContent');
        this.studyProgress = document.getElementById('studyProgress');
        this.studyProgressBar = document.getElementById('studyProgressBar');
        this.backToDashboardStudy = document.getElementById('backToDashboardStudy');
        this.backToTopics = document.getElementById('backToTopics');
        this.regenerateStudyPlan = document.getElementById('regenerateStudyPlan');
        this.startTopicQuiz = document.getElementById('startTopicQuiz');
        this.markAsStudied = document.getElementById('markAsStudied');
        this.wikiSearchInput = document.getElementById('wikiSearchInput');
        this.wikiSearchBtn = document.getElementById('wikiSearchBtn');
        this.wikiResults = document.getElementById('wikiResults');
        this.wikiContent = document.getElementById('wikiContent');
        this.leaderboardSection = document.getElementById('leaderboardSection');
        this.leaderboardContent = document.getElementById('leaderboardContent');
        this.backToDashboardLeaderboard = document.getElementById('backToDashboardLeaderboard');
        this.showLeaderboard = document.getElementById('showLeaderboard');
        this.calculatorBtn = document.getElementById('calculatorBtn');
        this.calculatorModal = document.getElementById('calculatorModal');
        this.calculatorTitle = document.getElementById('calculatorTitle');
        this.calculatorContent = document.getElementById('calculatorContent');
        this.closeCalculator = document.getElementById('closeCalculator');

        // State
        this.currentSubject = null;
        this.currentQuestion = null;
        this.currentQuestionIndex = 0;
        this.totalQuestions = 10;
        this.timePerQuestion = 30;
        this.timeRemaining = 30;
        this.selectedAnswer = null;
        this.sessionData = [];
        this.score = 0;
        this.timer = null;
        this.currentStudySubject = null;
        this.currentTopic = null;
        this.studiedTopics = JSON.parse(localStorage.getItem('studiedTopics')) || {};
        this.isTopicBasedQuiz = false;
        this.currentTopicContext = null;
        this.useGemini = false;

        this.bindEventListeners();
        this.init();
    }

    bindEventListeners() {
        this.authBtn.addEventListener('click', () => this.handleAuth());
        this.avatarInput.addEventListener('change', () => this.previewAvatar());
        this.logoutBtn.addEventListener('click', () => this.logout());
        this.prevBtn.addEventListener('click', () => this.prevQuestion());
        this.submitBtn.addEventListener('click', () => this.submitAnswer());
        this.nextBtn.addEventListener('click', () => this.nextQuestion());
        this.toggleAI.addEventListener('click', () => this.toggleAIExplanation());
        this.backToDashboard.addEventListener('click', () => this.showDashboard());
        this.retryQuiz.addEventListener('click', () => this.startQuiz(this.currentSubject));
        this.showLeaderboard.addEventListener('click', () => this.showLeaderboardSection());
        this.backToDashboardLeaderboard.addEventListener('click', () => this.showDashboard());
        this.backToDashboardStudy.addEventListener('click', () => this.showDashboard());
        this.backToTopics.addEventListener('click', () => this.showTopicSelection());
        this.regenerateStudyPlan.addEventListener('click', () => this.generateStudyPlan(this.currentTopic));
        this.startTopicQuiz.addEventListener('click', () => this.startTopicBasedQuiz());
        this.markAsStudied.addEventListener('click', () => this.markTopicAsStudied());
        this.wikiSearchBtn.addEventListener('click', () => this.searchWikipedia());
        this.wikiSearchInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') this.searchWikipedia(); });
        this.calculatorBtn.addEventListener('click', () => this.openCalculator());
        this.closeCalculator.addEventListener('click', () => this.closeCalculatorModal());
        document.querySelectorAll('.subject-btn').forEach(btn => {
            btn.addEventListener('click', () => this.showQuizSettings(btn.dataset.subject));
        });
        document.querySelectorAll('.study-plan-btn').forEach(btn => {
            btn.addEventListener('click', () => this.showStudyPlan(btn.dataset.subject));
        }
    async init() {
        console.log('Initializing QuizApp...');
        try {
            hideElement('loadingPage');
            showElementById('appContainer'));
            let profile = JSON.parse(localStorage.getItem('profile') || {};
            if (profile.nickname) {
                this.profileName.textContent = profile.nickname;
                this.welcomeName.textContent = profile.nickname;
                this.profileAvatar.src = profile.avatar || '/assets/placeholder.jpg';
                showElement('dashboard');
            } else {
                showElement('authModal');
            }
        } catch (error) {
            console.error('Initialization failed:', error);
            showElementById('authModal');
            alert('Failed to initialize app. Please refresh.');
        }
    }

    async handleAuth() {
        const nickname = this.nicknameInput.value.trim();
        if (!nickname) {
            alert('Please enter a nickname');
            return;
        }
        const avatar = this.avatarPreview.src;
        const profile = { nickname, avatar };
        try {
            await saveUserProfile(profile);
            localStorage.setItem('profile', JSON.stringify(profile));
            this.profileName.textContent = nickname;
            this.welcomeName.textContent = nickname;
            this.profileAvatar.src = avatar;
            hideElement('authModal');
            showElement('dashboard');
        } catch (error) {
            console.error('Failed to save profile:', error);
            alert('Failed to save profile. Please try again.');
        }
    }

    previewAvatar() {
        const file = this.avatarInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                this.avatarPreview.src = reader.result;
            };
            reader.readAsDataURL(file);
        }
    }

    logout() {
        localStorage.removeItem('profile');
        localStorage.removeItem('studiedTopics');
        showElement('authModal');
        hideElement('dashboard');
        hideElement('quizSection');
        hideElement('studyPlanSection');
        hideElement('leaderboardSection');
        this.nicknameInput.value = '';
        this.avatarPreview.src = '/assets/placeholder.jpg';
    }

    showDashboard() {
        showElement('dashboard');
        hideElement('quizSection');
        hideElement('reviewSection');
        hideElement('studyPlanSection');
        hideElement('leaderboardSection');
        hideElement('calculatorModal');
    }

    showQuizSettings(subject) {
        this.currentSubject = subject;
        showElement('quizSettingsModal');
        this.startQuizBtn.onclick = () => {
            this.totalQuestions = parseInt(this.questionCount.value);
            this.timePerQuestion = parseInt(this.timePerQuestion.value);
            hideElement('quizSettingsModal');
            this.startQuiz(subject);
        };
    }

    async startQuiz(subject) {
        this.currentSubject = subject;
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.sessionData = [];
        this.isTopicBasedQuiz = false;
        this.currentTopicContext = null;
        hideElement('dashboard');
        showElement('quizSection');
        showElement('loadingPage');
        this.calculatorBtn.classList.toggle('hidden', !['Mathematics', 'Physics', 'Chemistry'].includes(subject));
        await this.loadQuestion();
        hideElement('loadingPage');
    }

    async loadQuestion() {
        try {
            let url = `https://questions.aloc.com.ng/api/v2/q?subject=${this.currentSubject}`;
            if (this.isTopicBasedQuiz && this.currentTopicContext) {
                url += `&topic=${encodeURIComponent(this.currentTopicContext)}`;
            }
            const response = await fetch(url, {
                headers: {
                    'Accept': 'application/json',
                    'AccessToken': 'QB-139d5195a490b3c12794'
                }
            });
            if (!response.ok) throw new Error('Failed to fetch question');
            const data = await response.json();
            this.currentQuestion = data.data;
            this.displayQuestion();
            this.startTimer();
        } catch (error) {
            console.error('Error loading question:', error);
            alert('Failed to load question. Please try again.');
            this.showDashboard();
        }
    }

    displayQuestion() {
        this.questionCounter.textContent = `Question ${this.currentQuestionIndex + 1} of ${this.totalQuestions}`;
        this.questionText.textContent = this.currentQuestion.question || 'Question text not available';
        const progress = ((this.currentQuestionIndex + 1) / this.totalQuestions) * 100;
        this.progressFill.style.width = `${progress}%`;
        if (this.currentQuestion.image) {
            this.questionImage.src = this.currentQuestion.image;
            showElement('questionImage');
        } else {
            hideElement('questionImage');
        }
        this.selectedAnswer = null;
        this.submitBtn.disabled = true;
        showElement('submitBtn');
        hideElement('nextBtn');
        hideElement('explanationContainer');
        this.optionsContainer.innerHTML = '';
        this.displayOptions();
    }

    displayOptions() {
        const options = ['a', 'b', 'c', 'd'];
        options.forEach(option => {
            const button = document.createElement('button');
            button.className = 'option-button bg-gray-700 p-4 rounded hover:bg-gray-600 w-full text-left text-sm md:text-base';
            button.dataset.option = option.toUpperCase();
            button.innerHTML = `
                <span class="font-bold">${option.toUpperCase()}</span>
                ${this.currentQuestion.option[option] || 'Option not available'}
            `;
            button.addEventListener('click', () => this.selectOption(option.toUpperCase(), button));
            this.optionsContainer.appendChild(button);
        });
    }

    selectOption(option, buttonElement) {
        document.querySelectorAll('.option-button').forEach(btn => {
            btn.classList.remove('bg-blue-600');
        });
        buttonElement.classList.add('bg-blue-600');
        this.selectedAnswer = option;
        this.submitBtn.disabled = false;
    }

    startTimer() {
        this.timeRemaining = this.timePerQuestion;
        this.updateTimerDisplay();
        this.timer = setInterval(() => {
            this.timeRemaining--;
            this.updateTimerDisplay();
            if (this.timeRemaining <= 0) {
                this.timeUp();
            }
        }, 1000);
    }

    updateTimerDisplay() {
        const minutes = Math.floor(this.timeRemaining / 60);
        const seconds = this.timeRemaining % 60;
        this.timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        this.timerDisplay.style.background = this.timeRemaining <= 10 ? '#e74c3c' : '#ff6b6b';
    }

    timeUp() {
        clearInterval(this.timer);
        if (this.selectedAnswer) {
            this.submitAnswer();
        } else {
            this.showCorrectAnswer();
            this.nextQuestion();
        }
    }

    async submitAnswer() {
        clearInterval(this.timer);
        const isCorrect = this.selectedAnswer === this.currentQuestion.answer;
        if (isCorrect) this.score++;
        this.sessionData.push({
            nickname: this.profileName.textContent,
            subject: this.currentSubject,
            question: this.currentQuestion,
            userAnswer: this.selectedAnswer,
            correct: isCorrect,
            timeSpent: this.timePerQuestion - this.timeRemaining
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

    cleanAIResponse() {
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

    toggleAIExplanation() {
        this.useGemini = !this.useGemini;
        this.toggleAI.textContent = `Switch to ${this.useGemini ? 'Static' : 'GPT'}`;
        this.showExplanation();
    }

    prevQuestion() {
        if (this.currentQuestionIndex > 0) {
            clearInterval(this.timer);
            this.currentQuestionIndex--;
            this.loadQuestion();
        }
    }

    nextQuestion() {
        this.currentQuestionIndex++;
        if (this.currentQuestionIndex < this.totalQuestions) {
            clearInterval(this.timer);
            showElement('submitBtn');
            hideElement('nextBtn');
            this.loadQuestion();
        } else {
            this.endQuiz();
        }
    }

    endQuiz() {
        hideElement('quizSection');
        showElement('reviewSection');
        this.showReview();
        localStorage.setItem('quizResults', JSON.stringify(this.sessionData));
        this.showConfetti();
    }

    showReview() {
        this.reviewContent.innerHTML = '';
        this.sessionData.forEach((data, index) => {
            const div = document.createElement('div');
            div.className = 'bg-gray-800 p-3 rounded mb-2';
            div.innerHTML = `
                <p class="font-bold">Question ${index + 1}: ${data.question.question}</p>
                <p>Your Answer: ${data.userAnswer || 'No answer'}</p>
                <p>Correct Answer: ${data.question.answer}</p>
                <p>Status: ${data.correct ? 'Correct' : 'Incorrect'}</p>
                <p>Time Spent: ${data.timeSpent}s</p>
            `;
            this.reviewContent.appendChild(div);
        });
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
                imageUrl = Object.values(imageData.query.pages)[0]?.imageinfo[0]?.url || '';
            }
            const content = parseData.parse.text['*'];
            this.wikiContent.innerHTML = `
                <h3 class="text-lg md:text-xl font-bold mb-2">${topResult}</h3>
                ${imageUrl ? `<img src="${imageUrl}" alt="${topResult}" class="max-w-full h-auto mb-4 rounded">` : ''}
                <div class="wiki-extract">${content.slice(0, 1000)}...</div>
                <a href="https://en.wikipedia.org/wiki/${encodeURIComponent(topResult)}" target="_blank" class="text-blue-400 hover:underline">Read more on Wikipedia</a>
            `;
        } catch (error) {
            console.error('Wikipedia search error:', error);
            this.wikiContent.innerHTML = '<p class="text-red-400">Failed to load Wikipedia content. Please try again.</p>';
        }
    }

    openCalculator() {
        showElement('calculatorModal');
        this.calculatorTitle.textContent = `${this.currentSubject} Calculator`;
        this.calculatorContent.innerHTML = this.getCalculatorContent();
    }

    closeCalculatorModal() {
        hideElement('calculatorModal');
    }

    getCalculatorContent() {
        if (['Mathematics', 'Physics', 'Chemistry'].includes(this.currentSubject)) {
            return `
                <div class="space-y-4">
                    <h3 class="text-lg md:text-base font-semibold">Basic Calculator</h3>
                    <input id="basicCalc" type="text" placeholder="e.g., 2 + 3 * 4" class="w-full p-2 bg-gray-700 rounded text-sm md:text-base">
                    <button id="evalBasic" class="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 w-full text-sm md:text-base">Calculate</button>
                    <p id="basicResult" class="text-sm md:text-base"></p>
                    ${this.currentSubject === 'Mathematics' ? `
                        <h3 class="text-lg md:text-base font-semibold">Quadratic Equation Solver (ax² + bx + c = 0)</h3>
                        <div class="grid grid-cols-3 gap-2">
                            <input id="quadA" type="number" placeholder="a" class="p-2 bg-gray-700 rounded text-sm">
                            <input id="quadB" type="number" placeholder="b" class="p-2 bg-gray-700 rounded text-sm">
                            <input id="quadC" type="number" placeholder="c" class="p-2 bg-gray-700 rounded text-sm">
                        </div>
                        <button id="solveQuad" class="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 w-full text-sm">Solve</button>
                        <p id="quadResult" class="text-sm md-text-base"></p>
                    ` : ''}
                </div>
                <script>
                    document.getElementById('evalBasic').addEventListener('click', () => {
                        try {
                            const expr = document.getElementById('basicCalc').value;
                            const result = eval(expr);
                            document.getElementById('basicResult').textContent = 'Result: ' + result;
                        } catch (e) {
                            document.getElementById('basicResult').textContent = 'Invalid expression';
                        }
                    });
                    ${this.currentSubject === 'Mathematics' ? `
                        document.getElementById('solveQuad').addEventListener('click', () => {
                            const a = parseFloat(document.getElementById('quadA').value);
                            const b = parseFloat(document.getElementById('quadB').value);
                            const c = parseFloat(document.getElementById('quadC').value);
                            if (isNaN(a) || isNaN(b) || isNaN(c))) {
                                document.getElementById('quadResult').textContent = 'Please enter valid numbers';
                                return;
                            }
                            const discriminant = b * b - 4 * a * c;
                            if (discriminant < 0) {
                                document.getElementById('quadResult').textContent = 'No real roots';
                            } else {
                                const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
                                const x2 = (-b - Math.sqrt(discriminant)) / (2 * a);
                                document.getElementById('quadResult').textContent = `Roots: x1.toFixed(2)}, x2 = ${x2.toFixed(2)}`;
                            }
                        });
                    ` : ''}
                </script>
            `;
        }
        return '<p class="text-sm md:text-base">No calculator available for this subject.</p>';
    }

    async showStudyPlan(subjectId) {
        this.currentStudySubject = subject;
        this.studySubjectTitle.textContent = subject;
        hideElement('dashboard');
        hideElement('quizSection');
        hideElement('reviewSection');
        hideElement('leaderboardSection');
        showElement('studyPlanSection');
        this.showTopicSelection();
    }

    showTopicSelection() {
        showElement('topicSelection');
        hideElement('studyContent');
        hideElement('wikiResults');
        this.topicsContainer.innerHTML = '';
        const topics = this.getSubjectTopics(this.currentStudySubject);
        topics.forEach(topic => {
            const button = document.createElement('button');
            button.className = 'bg-blue-600 p-4 rounded hover:bg-blue-700 transition transform hover:scale-105 flex items-center space-x-2 text-sm md:text-base';
            button.innerHTML = `<span>📚</span><span>${topic}</span>`;
            button.addEventListener('click', () => this.selectTopic(topic));
            this.topicsContainer.appendChild(button);
        });
    }

    selectTopic(topic) {
        this.currentTopic = topic;
        hideElement('topicSelection');
        showElement('studyContent');
        this.currentTopicTitle.textContent = topic;
        this.generateStudyPlan(topic);
    }

    getSubjectTopics(subject) {
        const topics = {
            'English': ['Comprehension Passages', 'Grammar and Syntax', 'Vocabulary'],
            'Mathematics': ['Algebra', 'Coordinate Geometry', 'Trigonometry'],
            'Biology': ['Cell Biology', 'Genetics', 'Ecology'],
            'Physics': ['Mechanics', 'Waves', 'Electricity'],
            'Chemistry': ['Atomic Structure', 'Chemical Bonding', 'Periodic Table'],
            'Economics': ['Microeconomics', 'Macroeconomics', 'Market Structures'],
            'Government': ['Constitutional Law', 'Politics', 'Governance'],
            'Literature': ['Poetry Analysis', 'Prose', 'Drama']
        };
        return topics[subject] || [];
    }

    async generateStudyPlan(topic) {
        this.studyPlanContent.innerHTML = '<div class="flex items-center justify-center py-4"><div class="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div><span class="ml-2">Generating study plan...</span></div>';
        try {
            const prompt = `Create a concise study plan for the topic "${topic}" in ${this.currentStudySubject} for the University of Ibadan POST UTME CBT. Include key concepts, descriptions, recommended resources, and 2 practice questions. Structure the response as a table with columns: Concept, Description, Resources, Practice Questions. Keep it clear, engaging, and under 300 words. No markdown formatting.`;
            const response = await fetch(`https://kaiz-apis.gleeze.com/api/gpt-4.1?ask=${encodeURIComponent(prompt)}&uid=1268&apikey=a0ebe80e-bf1a-4dbf-8d36-6935b1bfa5ea`);
            if (!response.ok) throw new Error('API failed');
            const data = await response.json();
            const content = this.cleanAIResponse(data.response);
            const rows = content.trim().split('\n').filter(row => row.includes('|')).map(row => row.split('|').map(cell => cell.trim()));
            this.studyPlanContent.innerHTML = `
                <table class="w-full border-collapse border border-gray-600 text-sm md:text-base">
                    <thead>
                        <tr class="bg-gray-700">
                            <th class="border border-gray-600 px-2 py-1 md:px-4 md:py-2">Concept</th>
                            <th class="border border-gray-600 px-2 py-1 md:px-4 md:py-2">Description</th>
                            <th class="border border-gray-600 px-2 py-1 md:px-4 md:py-2">Resources</th>
                            <th class="border border-gray-600 px-2 py-1 md:px-4 md:py-2">Practice Questions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rows.map(row => `
                            <tr>
                                <td class="border border-gray-600 px-2 py-2 md:px-2">${row[0] || ''}</td>
                                <td class="border border-gray-600 px-2 py-2 md:px-2 py-2">${row[1] || ''}</td>
                                <td class="border border-gray-600 px-2 py-2 md:px-2 py-2">${row[2] || ''}</td>
                                <td class="border border-gray-600 px-2 py-2 md:px-2 py-2">${row[3] || ''}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        } catch (error) {
            console.error('Error generating study plan:', error);
            this.studyPlanContent.innerHTML = `<p class="text-sm md:text-base">Study Plan for ${topic}: Review key concepts in your ${this.currentStudySubject} textbook. Practice related questions to solidify understanding.</p>
        }
        this.updateStudyProgress();
    }

    async markTopicAsStudied() {
        if (!this.studiedTopics[this.currentStudySubject]) {
            this.studiedTopics[this.currentStudySubject] = [];
        }
        if (!this.studiedTopics[this.currentStudySubject].includes(this.currentTopic)) {
            this.studiedTopics[this.currentStudySubject].push(this.currentTopic);
            try {
                await saveStudiedTopic({
                    nickname: this.profileName.textContent,
                    subject: this.currentStudySubject,
                    topic: this.currentTopic
                });
                localStorage.setItem('studiedTopics', JSON.stringify(this.studiedTopics));
            } catch (error) {
                console.error('Failed to save studied topic:', error);
            }
        }
        this.updateStudyProgress();
        alert('Topic marked as studied!');
    }

    updateStudyProgress() {
        const topics = this.getSubjectTopics(this.currentStudySubject);
        const studied = this.studiedTopics[this.currentStudySubject] || [];
        const progress = (studied.length / topics.length) * 100;
        this.studyProgress.textContent = `${Math.round(progress)}%`;
        this.studyProgressBar.style.width = `${progress}%`;
    }

    startTopicBasedQuiz() {
        this.isTopicBasedQuiz = true;
        this.currentTopicContext = this.currentTopic;
        this.startQuiz(this.currentStudySubject);
    }

    async showLeaderboardSection() {
        hideElement('dashboard');
        showElement('leaderboardSection');
        try {
            const leaderboard = await fetchLeaderboard();
            this.leaderboardContent.innerHTML = leaderboard.map((entry, index) => `
                <div class="flex justify-between py-2 ${index < leaderboard.length - 1 ? 'border-b border-gray-700' : ''}">
                    <span class="text-sm md:text-base">${index + 1}. ${entry.nickname}</span>
                    <span class="text-sm md:text-base">${entry.score}%</span>
                </div>
            `).join('');
        } catch (error) {
            console.error('Failed to load leaderboard:', error);
            this.leaderboardContent.innerHTML = '<p class="text-red-500 text-sm md:text-base">Failed to load leaderboard.</p>';
        }
    }
}