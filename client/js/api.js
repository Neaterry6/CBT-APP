export async function saveUserProfile(profile) {
    const response = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
    });
    if (!response.ok) throw new Error('Failed to save profile');
    return response.json();
}

export async function saveQuizResult(result) {
    const response = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result)
    });
    if (!response.ok) throw new Error('Failed to save quiz result');
    return response.json();
}
