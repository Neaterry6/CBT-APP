async generateStudyPlan(topic) {
    this.studyPlanContent.innerHTML = '<div class="flex items-center justify-center py-8"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div><span class="ml-2">Generating comprehensive study plan...</span></div>';
    try {
        const prompt = `Create a concise study plan for the topic "${topic}" in ${this.currentStudySubject} for the University of Ibadan POST UTME CBT. Include key concepts, recommended resources, and 2-3 practice questions. Structure the response as a table with columns: Concept, Description, Resources, Practice Questions. Keep it clear, engaging, and under 300 words. No markdown formatting.`;
        const response = await fetch(`https://kaiz-apis.gleeze.com/api/gpt-4.1?ask=${encodeURIComponent(prompt)}&uid=1268&apikey=a0ebe80e-bf1a-4dbf-8d36-6935b1bfa5ea`);
        if (!response.ok) throw new Error('API failed');
        const data = await response.json();
        const content = this.cleanAIResponse(data.response);
        // Convert text to table (simplified parsing for demo)
        const rows = content.split('\n').map(row => row.split('|').map(cell => cell.trim()));
        this.studyPlanContent.innerHTML = `
            <table class="w-full border-collapse border border-gray-600">
                <thead>
                    <tr class="bg-gray-700">
                        <th class="border border-gray-600 p-2">Concept</th>
                        <th class="border border-gray-600 p-2">Description</th>
                        <th class="border border-gray-600 p-2">Resources</th>
                        <th class="border border-gray-600 p-2">Practice Questions</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows.map(row => `
                        <tr>
                            <td class="border border-gray-600 p-2">${row[0] || ''}</td>
                            <td class="border border-gray-600 p-2">${row[1] || ''}</td>
                            <td class="border border-gray-600 p-2">${row[2] || ''}</td>
                            <td class="border border-gray-600 p-2">${row[3] || ''}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        console.error('Error generating study plan:', error);
        this.studyPlanContent.innerHTML = `<p>Study Plan for ${topic}: Review key concepts in your ${this.currentStudySubject} textbook. Practice related questions to solidify understanding.</p>`;
    }
    this.updateStudyProgress();
}
