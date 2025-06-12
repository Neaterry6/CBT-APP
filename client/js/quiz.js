async searchWikipedia() {
    const query = this.wikiSearchInput.value.trim();
    if (!query) {
        alert('Please enter a search term');
        return;
    }
    this.wikiContent.innerHTML = '<div class="flex items-center justify-center py-4"><div class="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div><span class="ml-2">Searching...</span></div>';
    this.wikiResults.classList.remove('hidden');
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
