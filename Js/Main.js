import IndexManager from "./IndexManager.js";
import UtilityClass from "./UtilityClass.js";
import HtmlBuilder from "./HtmlBuilder.js";
import DonateCrypto from "./DonateCrypto.js";
import Fireworks from "./Effect/Fireworks.js";

var htmlBuilder;
var donateCrypto;
var fireworks;

let birthDate = new Date(1994, 3, 30);
let currentDate = new Date();
let isBirthdayPassed = currentDate.getMonth() > birthDate.getMonth() || (currentDate.getMonth() === birthDate.getMonth() && currentDate.getDate() >= birthDate.getDate());
let age = currentDate.getFullYear() - birthDate.getFullYear() - (isBirthdayPassed ? 0 : 1);

var jsonWalletDepositAddress;
var eleVideoBG;
var eleSorceVideoBG;
var tabs;
var current;

// Notifications
var toastLiveNotificationContainer;
var toastLiveNotification;
var toastLiveNotificationTitle;
var toastLiveNotificationMSG;

document.addEventListener('DOMContentLoaded', async function(event) {
    htmlBuilder = new HtmlBuilder("../Views");
    donateCrypto = new DonateCrypto(htmlBuilder, ShowToast);
    fireworks = new Fireworks();

    await StartUp();
    await donateCrypto.Run();

    // Birthday fireworks
    if (currentDate.getDate() === birthDate.getDate() && currentDate.getMonth() === birthDate.getMonth()) {
        fireworks.start();
    }
});

async function StartUp() {
    // Navbar
    let htmlNavbar = await htmlBuilder.CreateNavbarView("");
    IndexManager.ReplaceHtmlContent("mainNavbar", htmlNavbar);

    // Home
    let htmlSectionsHome = await htmlBuilder.CreateSectionView("");
    IndexManager.ReplaceHtmlContent("sHome", htmlSectionsHome);

    // AboutMe
    let htmlSectionsAboutMe = await htmlBuilder.CreateSectionViewById("sAboutMe");
    htmlSectionsAboutMe = HtmlBuilder.RepleaceAllKey(htmlSectionsAboutMe, "myAge", age);
    IndexManager.ReplaceHtmlContent("sAboutMe", htmlSectionsAboutMe);

    // Features
    let htmlSectionsFeatures = await htmlBuilder.CreateSectionViewById("sFeatures");
    IndexManager.ReplaceHtmlContent("sFeatures", htmlSectionsFeatures);

    // Donate
    jsonWalletDepositAddress = await UtilityClass.GetJsonFromRootPage("WalletDepositAddress");
    let htmlSectionsDonate = await htmlBuilder.CreateSectionDonateView(jsonWalletDepositAddress);
    IndexManager.ReplaceHtmlContent("sDonate", htmlSectionsDonate);

    // Footer
    let htmlFooter = await htmlBuilder.CreateFooterViewById("iFooter");
    htmlFooter = HtmlBuilder.RepleaceAllKey(htmlFooter, "currentYear", new Date().getFullYear());
    IndexManager.ReplaceHtmlContent("iFooter", htmlFooter);

    // Video background
    eleVideoBG = document.querySelector("#videoBG");
    eleSorceVideoBG = document.querySelector("#sorceVideoBG");

    // Tabs
    tabs = [
        { tabI: document.querySelector("#iHome"), tabS: document.querySelector("#sHome") },
        { tabI: document.querySelector("#iAboutMe"), tabS: document.querySelector("#sAboutMe") },
        { tabI: document.querySelector("#iFeatures"), tabS: document.querySelector("#sFeatures") },
        { tabI: document.querySelector("#iDonate"), tabS: document.querySelector("#sDonate") },
    ];
    current = tabs[0];

    // NotificationCenter
    toastLiveNotificationContainer = document.querySelector('#toastLiveNotificationContainer');
    toastLiveNotification = toastLiveNotificationContainer.querySelector('#toastLiveNotification');
    toastLiveNotificationTitle = toastLiveNotification.querySelector('#toastLiveNotificationTitle');
    toastLiveNotificationMSG = toastLiveNotificationContainer.querySelector('#toastLiveNotificationMSG');

    // Tab switching with video background
    const tabVideos = [
        '../Files/Videos_webm/Toaru-Kagaku-no-Accelerator.webm',
        '../Files/Videos_webm/Toaru-Kagaku-no-Railgun.webm',
        '../Files/Videos_webm/Toaru-Majutsu-no-Index2.webm',
        '../Files/Videos_webm/Toaru-Majutsu-no-Index1.webm',
    ];

    document.addEventListener('click', function(event) {
        if (event.target.getAttribute("class") != "nav-link active" && tabs.find(t => t.tabI == event.target)) {
            const tabIndex = tabs.findIndex(t => t.tabI == event.target);
            if (tabIndex === -1) return;

            eleVideoBG.style.opacity = '0';
            tabs[tabIndex].tabS.style.display = "flex";
            eleVideoBG.style.display = "inline-flex";
            eleSorceVideoBG.setAttribute('src', tabVideos[tabIndex]);
            setTimeout(function() {
                eleVideoBG.load();
            }, 500);
            tabs[tabIndex].tabI.classList.add("active");

            setTimeout(function() {
                eleVideoBG.style.opacity = '1';
            }, 500);
            current.tabS.style.display = "none";
            current.tabI.classList.remove("active");
            current = tabs[tabIndex];
        }
    });

    // Popovers
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });

    // Theme toggle
    initThemeToggle();

    // GitHub repos
    fetchAndRenderGitHubRepos();
}

// ============================================
// THEME TOGGLE
// ============================================
function initThemeToggle() {
    const toggle = document.querySelector('#themeToggle');
    const icon = document.querySelector('#themeIcon');
    if (!toggle) return;

    // Sync icon with current theme
    const currentTheme = document.body.getAttribute('data-theme') || 'dark';
    icon.innerHTML = currentTheme === 'dark' ? '&#9790;' : '&#9728;';

    toggle.addEventListener('click', function() {
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        const newTheme = isDark ? 'light' : 'dark';

        document.body.setAttribute('data-theme', newTheme);
        document.body.setAttribute('data-bs-theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
        document.documentElement.setAttribute('data-bs-theme', newTheme);

        icon.innerHTML = newTheme === 'dark' ? '&#9790;' : '&#9728;';
        localStorage.setItem('theme', newTheme);
    });
}

// ============================================
// GITHUB REPOS
// ============================================

const GITHUB_LANG_COLORS = {
    "JavaScript": "#f1e05a", "TypeScript": "#3178c6", "Python": "#3572A5",
    "C#": "#178600", "C++": "#f34b7d", "C": "#555555", "Java": "#b07219",
    "HTML": "#e34c26", "CSS": "#563d7c", "SCSS": "#c6538c", "Shell": "#89e051",
    "Ruby": "#701516", "Go": "#00ADD8", "Rust": "#dea584", "PHP": "#4F5D95",
    "Kotlin": "#A97BFF", "Swift": "#F05138", "Dart": "#00B4AB",
    "Vue": "#41b883", "Lua": "#000080", "PowerShell": "#012456",
    "Jupyter Notebook": "#DA5B0B", "Dockerfile": "#384d54",
};

function getRelativeTime(dateStr) {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now - date;
    const diffMin = Math.floor(diffMs / 60000);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);
    const diffMonth = Math.floor(diffDay / 30);
    const diffYear = Math.floor(diffDay / 365);

    if (diffYear > 0) return `${diffYear}y ago`;
    if (diffMonth > 0) return `${diffMonth}mo ago`;
    if (diffDay > 0) return `${diffDay}d ago`;
    if (diffHr > 0) return `${diffHr}h ago`;
    return `${diffMin}m ago`;
}

async function fetchCommitCount(repoName) {
    try {
        const res = await fetch(`https://api.github.com/repos/Arutosio/${repoName}/commits?per_page=1`);
        if (!res.ok) return null;
        const link = res.headers.get('Link');
        if (link) {
            const match = link.match(/page=(\d+)>; rel="last"/);
            if (match) return parseInt(match[1]);
        }
        const data = await res.json();
        return data.length;
    } catch { return null; }
}

async function fetchLanguages(repoName) {
    try {
        const res = await fetch(`https://api.github.com/repos/Arutosio/${repoName}/languages`);
        if (!res.ok) return {};
        return await res.json();
    } catch { return {}; }
}

function buildLangBarHTML(languages) {
    const total = Object.values(languages).reduce((a, b) => a + b, 0);
    if (total === 0) return { bar: '', labels: '' };

    let barParts = [];
    let labelParts = [];

    for (const [lang, bytes] of Object.entries(languages)) {
        const pct = ((bytes / total) * 100);
        if (pct < 1) continue;
        const color = GITHUB_LANG_COLORS[lang] || '#8b8b8b';
        barParts.push(`<span style="width:${pct.toFixed(1)}%;background:${color}" title="${lang} ${pct.toFixed(1)}%"></span>`);
        labelParts.push(`<span class="repo-lang-label"><span class="repo-lang-dot" style="background:${color}"></span>${lang} ${Math.round(pct)}%</span>`);
    }

    return { bar: barParts.join(''), labels: labelParts.join('') };
}

async function fetchAndRenderGitHubRepos() {
    const container = document.querySelector('#github-repos');
    const errorDiv = document.querySelector('#github-repos-error');
    if (!container) return;

    try {
        const response = await fetch('https://api.github.com/users/Arutosio/repos?sort=pushed&per_page=12', {
            headers: { 'Accept': 'application/vnd.github.mercy-preview+json' }
        });
        if (!response.ok) throw new Error('GitHub API error');
        const repos = await response.json();

        // Fetch commits + languages in parallel for all repos
        const extraData = await Promise.all(repos.map(async (repo) => {
            const [commitCount, languages] = await Promise.all([
                fetchCommitCount(repo.name),
                fetchLanguages(repo.name),
            ]);
            return { commitCount, languages };
        }));

        // Enrich repo data
        repos.forEach((repo, i) => {
            repo._commitCount = extraData[i].commitCount;
            repo._languages = extraData[i].languages;
            repo._updatedRelative = getRelativeTime(repo.pushed_at || repo.updated_at);
        });

        // Render cards
        let html = '';
        for (const repo of repos) {
            html += await htmlBuilder.CreateRepoCardView(repo);
        }
        container.innerHTML = html;

        // Inject language bars (after DOM is updated)
        repos.forEach((repo) => {
            const langData = buildLangBarHTML(repo._languages || {});
            const barEl = document.getElementById(`lang-bar-${repo.name}`);
            const labelsEl = document.getElementById(`lang-labels-${repo.name}`);
            if (barEl) barEl.innerHTML = langData.bar;
            if (labelsEl) labelsEl.innerHTML = langData.labels;
        });

    } catch (error) {
        console.error('Error fetching GitHub repos:', error);
        if (errorDiv) errorDiv.classList.remove('d-none');
    }
}

// ============================================
// TOAST NOTIFICATIONS
// ============================================
function ShowToast(title, msg) {
    if (title) {
        toastLiveNotificationTitle.textContent = title;
    }
    if (msg) {
        toastLiveNotificationMSG.textContent = msg;
    }
    toastLiveNotification.classList.add('show');
    const toast = new bootstrap.Toast(toastLiveNotification);
    toast.show();
}
