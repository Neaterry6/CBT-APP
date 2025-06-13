const BASE_URL = process.env.SERVER_URL || 'http://localhost:5000'; // Set via environment variable in deployment

export async function saveUserProfile(profile) {
    const response = await fetch(`${BASE_URL}/api/user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
    });
    if (!response.ok) throw new Error('Failed to save profile');
    return response.json();
}

export async function saveQuizResult(result) {
    const response = await fetch(`${BASE_URL}/api/quiz`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result)
    });
    if (!response.ok) throw new Error('Failed to save quiz result');
    return response.json();
}

export async function saveStudiedTopic(topic) {
    const response = await fetch(`${BASE_URL}/api/topic`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(topic)
    });
    if (!response.ok) throw new Error('Failed to save studied topic');
    return response.json();
}

export async function fetchLeaderboard() {
    const response = await fetch(`${BASE_URL}/api/leaderboard`);
    if (!response.ok) throw new Error('Failed to fetch leaderboard');
    return response.json();
}