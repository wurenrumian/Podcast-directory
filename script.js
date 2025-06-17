let podcasts = [];
let categories = [];

fetch('podcasts.json')
    .then(response => response.json())
    .then(data => {
        podcasts = data;
        categories = [...new Set(podcasts.map(podcast => podcast.category))];
        init();
    })
    .catch(error => {
        console.error('Error loading podcast data:', error);
        document.getElementById('podcastGrid').innerHTML = '<p>Error loading podcasts. Please try again later.</p>';
    });

function init() {
    createCategoryButtons();
    renderPodcasts(podcasts);
}

function createPodcastCard(podcast) {
    const card = document.createElement('div');
    card.className = 'podcast-card';
    const iconSrc = podcast.icon || 'placeholder.jpg'; // 使用默认图标
    card.innerHTML = `
        <img src="${iconSrc}" alt="${podcast.name}" class="podcast-icon">
        <h2>${podcast.name}</h2>
        <p class="podcast-category">${podcast.category}</p>
        <a href="${podcast.url}" target="_blank">访问播客</a>
    `;
    return card;
}

function renderPodcasts(podcastsToRender) {
    const grid = document.getElementById('podcastGrid');
    grid.innerHTML = '';
    podcastsToRender.forEach(podcast => {
        grid.appendChild(createPodcastCard(podcast));
    });
}

function filterPodcasts(searchTerm) {
    return podcasts.filter(podcast => 
        podcast.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        podcast.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
}

function createCategoryButtons() {
    const categoryFilter = document.getElementById('categoryFilter');
    categories.forEach(category => {
        const button = document.createElement('button');
        button.textContent = category;
        button.className = 'category-btn';
        button.addEventListener('click', () => filterByCategory(category));
        categoryFilter.appendChild(button);
    });
}

function filterByCategory(category) {
    const filteredPodcasts = podcasts.filter(podcast => podcast.category === category);
    renderPodcasts(filteredPodcasts);
    updateActiveCategory(category);
}

function updateActiveCategory(activeCategory) {
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.toggle('active', btn.textContent === activeCategory);
    });
}

document.getElementById('darkModeToggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

const backToTopButton = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopButton.style.display = 'block';
    } else {
        backToTopButton.style.display = 'none';
    }
});

backToTopButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// 移除这两行，因为它们现在在 init() 函数中调用
// createCategoryButtons();
// renderPodcasts(podcasts);

document.getElementById('searchInput').addEventListener('input', (e) => {
    const filteredPodcasts = filterPodcasts(e.target.value);
    renderPodcasts(filteredPodcasts);
});
