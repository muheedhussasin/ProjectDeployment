const apiKey = 'c9579b7df47d4b58ad062cc203e09bf7';
const blogContainer = document.getElementById("blog-container");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-btn");
const categoryButtons = document.querySelectorAll(".category-btn");
const heroSlider = document.getElementById("hero-slider");

let currentSlide = 0;
let slideElements = [];

async function fetchTopHeadlines() {
    try {
        const apiUrl = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data.articles;
    } catch (error) {
        console.log("Error fetching top headlines:", error);
        return [];
    }
}

// ✅ Display news in Hero Section as slider
function displayHeroNews(articles) {
    heroSlider.innerHTML = "";

    if (!articles || !Array.isArray(articles) || articles.length === 0) {
        heroSlider.innerHTML = "<p>No hero articles available.</p>";
        return;
    }

    const topArticles = articles.slice(0, 6);

    topArticles.forEach((article, index) => {
        const slide = document.createElement("div");
        slide.classList.add("hero-slide");
        if (index === 0) slide.classList.add("active");

        const img = document.createElement("img");
        img.src = article.urlToImage ? article.urlToImage : "https://dummyimage.com/600x400/000/fff";
        img.onerror = () => {
            img.src = "https://dummyimage.com/600x400/000/fff"; // Fallback image
        };
        img.alt = article.title;

        const content = document.createElement("div");
        content.classList.add("hero-content");

        const title = document.createElement("h3");
        title.textContent = article.title.length > 50 ? article.title.slice(0, 50) + "..." : article.title;

        const desc = document.createElement("p");
        desc.textContent = article.description
            ? (article.description.length > 100 ? article.description.slice(0, 100) + "..." : article.description)
            : "No description available.";

        const readMoreBtn = document.createElement("a");
        readMoreBtn.textContent = "Read More";
        readMoreBtn.href = article.url;
        readMoreBtn.target = "_blank";
        readMoreBtn.classList.add("read-more-btn");

        content.appendChild(title);
        content.appendChild(desc);
        content.appendChild(readMoreBtn);

        slide.appendChild(img);
        slide.appendChild(content);

        slide.addEventListener("click", () => {
            window.open(article.url, "_blank");
        });

        heroSlider.appendChild(slide);
    });

    slideElements = document.querySelectorAll(".hero-slide");
    startHeroSlider();
}

// ✅ Start automatic sliding
function startHeroSlider() {
    setInterval(() => {
        if (slideElements.length === 0) return;

        slideElements[currentSlide].classList.remove("active");
        currentSlide = (currentSlide + 1) % slideElements.length;
        slideElements[currentSlide].classList.add("active");
    }, 4000); 
}


async function fetchNewsQuery(query) {
    try {
        const apiUrl = `https://newsapi.org/v2/everything?q=${query}&apiKey=${apiKey}`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data.articles;
    } catch (error) {
        console.log("Error fetching news by query", error);
        return [];
    }
}

function displayBlogs(articles) {
    blogContainer.innerHTML = "";

    if (!articles || !Array.isArray(articles) || articles.length === 0) {
        blogContainer.innerHTML = "<p>Failed to load articles.</p>";
        return;
    }

    articles.forEach((article) => {
        const blogCard = document.createElement("div");
        blogCard.classList.add("blog-card");

        const img = document.createElement("img");
        img.src = article.urlToImage ? article.urlToImage : "https://dummyimage.com/600x400/000/fff";
        img.alt = article.title;

        const title = document.createElement("h2");
        const truncatedTitle = article.title.length > 30 ? article.title.slice(0, 30) + "..." : article.title;
        title.textContent = truncatedTitle;

        const description = document.createElement("p");
        const truncatedDes = article.description && article.description.length > 120 
            ? article.description.slice(0, 120) + "..." 
            : "No description available.";
        description.textContent = truncatedDes;

        blogCard.appendChild(img);
        blogCard.appendChild(title);
        blogCard.appendChild(description);

        blogCard.addEventListener("click", () => {
            window.open(article.url, "_blank");
        });

        blogContainer.appendChild(blogCard);
    });
}

searchButton.addEventListener("click", async () => {
    const query = searchInput.value.trim();
    if (query !== "") {
        try {
            const articles = await fetchNewsQuery(query);
            displayBlogs(articles);
        } catch (error) {
            console.log("Error searching news", error);
        }
    }
});

categoryButtons.forEach((button) => {
    button.addEventListener("click", async () => {
        const category = button.getAttribute("data-category");
        try {
            const apiUrl = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}&category=${category}`;
            const response = await fetch(apiUrl);
            const data = await response.json();
            displayBlogs(data.articles);
        } catch (error) {
            console.log(`Error fetching news for category ${category}`, error);
        }
    });
});

// ✅ Initial load
(async () => {
    const articles = await fetchTopHeadlines();
    displayHeroNews(articles);
    displayBlogs(articles);
})();
