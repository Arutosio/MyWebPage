import IndexManager from "./IndexManager.js";
import UtilityClass from "./UtilityClass.js";
import HtmlBuilder from "./HtmlBuilder.js";
import RequestJson from "./RequestJson.js";
import DonateCrypto from "./DonateCrypto.js";
import Kanji from "./Kanji.js";
import Fireworks from "./Effect/Fireworks.js";

// import Fancybox from "https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.esm.js";

// Variabili di Istanze
var requestJson;
var htmlBuilder;
var donateCrypto;
var kanji;
var fireworks;

var partPath = window.location.hash
console.log(partPath);

// console.log(UtilityClass.GetJsonFromFile("../Files/Json/test.json"));

let birthDate = new Date(1994, 3, 30); // Data di nascita: 30 aprile 1994
let currentDate = new Date(); // Data corrente
// Controllo se il compleanno è passato nell'anno corrente
let isBirthdayPassed = currentDate.getMonth() > birthDate.getMonth() || (currentDate.getMonth() === birthDate.getMonth() && currentDate.getDate() >= birthDate.getDate());
// Calcolo dell'età
let age = currentDate.getFullYear() - birthDate.getFullYear() - (isBirthdayPassed ? 0 : 1);

var jsonWalletDepositAddress;
var eleVideoBG;
var eleSorceVideoBG;
var tabs;
var current;
var popoverTriggerList;
var popoverList;
var embed;
var kanjiFileNames = ["Kanji_chikamichi_1", "Kanji_Number_Hiragana_pronunce", "Kanji_Numeri", "Kanji_NumeriOver", "Kanji_Prova", "testKanjiSoloKunYomi", "testKanjiSoloOnYomi"]

// Var Notifications
var toastLiveNotificationContainer;
var toastLiveNotification;
var toastLiveNotificationTitle;
var toastLiveNotificationMSG;

// var x = await RequestJson.RequestMongoDB();
document.addEventListener('DOMContentLoaded', async function(event) {

    //var x = await requestJson.RequestMongoDB();
    //console.log(await requestJson.RequestMongoDB());

    //document.querySelector(window.location.hash).style.display.

    // Istanziamento delle classi.
    requestJson = new RequestJson(null, "https://data.mongodb-api.com/app/data-ivdyd/endpoint/data/beta", null);
    htmlBuilder = new HtmlBuilder("../Views");
    donateCrypto = new DonateCrypto(htmlBuilder, ShowToast);
    kanji = new Kanji(htmlBuilder, ShowToast);
    fireworks = new Fireworks();

    await StartUp();
    await donateCrypto.Run();
    await kanji.Run();

    //Mostra il toast dopo 1 secondi
    //setTimeout(ShowToast, 0);

    // Avvia i fuochi d'artificio
    if (currentDate.getDate() === birthDate.getDate() && currentDate.getMonth() === birthDate.getMonth()) 
    {
        console.log("Oggi è il tuo compleanno! 🎉");
        fireworks.start();
        // fireworks.stop();
    } else { 
        console.log("Oggi NON è il tuo compleanno.");
    }
});

//CREAZIONE DI TUTTO IL CONTENUTO HTML
async function StartUp() {
    // Insert Navbar
    let htmlNavbar = await htmlBuilder.CreateNavbarView("");
    IndexManager.ReplaceHtmlContent("mainNavbar", htmlNavbar);

    let htmlSectionsHome = await htmlBuilder.CreateSectionView("");
    IndexManager.ReplaceHtmlContent("sHome", htmlSectionsHome);
    
    let htmlSectionsAboutMe = await htmlBuilder.CreateSectionViewById("sAboutMe");
    htmlSectionsAboutMe = HtmlBuilder.RepleaceAllKey(htmlSectionsAboutMe, "myAge", age);
    IndexManager.ReplaceHtmlContent("sAboutMe", htmlSectionsAboutMe);

    let htmlSectionsFeatures = await htmlBuilder.CreateSectionViewById("sFeatures");
    IndexManager.ReplaceHtmlContent("sFeatures", htmlSectionsFeatures);

    let htmlSectionsDev = await htmlBuilder.CreateSectionViewById("sDev");
    IndexManager.ReplaceHtmlContent("sDev", htmlSectionsDev);

    jsonWalletDepositAddress = await UtilityClass.GetJsonFromRootPage("WalletDepositAddress");
    let htmlSectionsDonate = await htmlBuilder.CreateSectionDonateView(jsonWalletDepositAddress);
    IndexManager.ReplaceHtmlContent("sDonate", htmlSectionsDonate);

    kanji.kanjiListJson = await UtilityClass.GetJsonFilesFromFolder("Kanji_Json", kanjiFileNames);
    let htmlSectionsKanji = await htmlBuilder.CreateSectionKanjiView(kanji.kanjiListJson);
    IndexManager.ReplaceHtmlContent("sKanji", htmlSectionsKanji);

    let htmlFooter = await htmlBuilder.CreateFooterViewById("iFooter");
    IndexManager.ReplaceHtmlContent("iFooter", htmlFooter);

    // CreateVariables
    eleVideoBG = document.querySelector("#videoBG");
    eleSorceVideoBG = document.querySelector("#sorceVideoBG");

    tabs = [
        { tabI: document.querySelector("#iHome"), tabS: document.querySelector("#sHome") },
        { tabI: document.querySelector("#iAboutMe"), tabS: document.querySelector("#sAboutMe") },
        { tabI: document.querySelector("#iFeatures"), tabS: document.querySelector("#sFeatures") },
        { tabI: document.querySelector("#iDev"), tabS: document.querySelector("#sDev") },
        { tabI: document.querySelector("#iDonate"), tabS: document.querySelector("#sDonate") },
        { tabI: document.querySelector("#iKanji"), tabS: document.querySelector("#sKanji") },
    ];
    current = tabs[0];

    // NotificationCenter
    toastLiveNotificationContainer = document.querySelector('#toastLiveNotificationContainer');
    toastLiveNotification = toastLiveNotificationContainer.querySelector('#toastLiveNotification');
    toastLiveNotificationTitle = toastLiveNotification.querySelector('#toastLiveNotificationTitle');
    toastLiveNotificationMSG = toastLiveNotificationContainer.querySelector('#toastLiveNotificationMSG');
    
    // embed = new Twitch.Embed("twitch-embed", {
    //     width: "90%",
    //     height: "600",
    //     theme: "dark",
    //     // layout: "video",
    //     autoplay: false,
    //     channel: "arutosio",
    //     // Only needed if this page is going to be embedded on other websites
    //     parent: ["embed.example.com", "othersite.example.com"]
    // });

    // EVENTI!!!!
    document.addEventListener('click', function(event) 
    {
        // console.log(tabScenaries[Object.keys(tabScenaries)]);
        if (event.target.getAttribute("class") != "nav-link active" && tabs.find(t => t.tabI == event.target)) 
        {
            eleVideoBG.style.opacity = '0';

            switch(event.target) {
                case tabs[0].tabI:
                    tabs[0].tabS.style.display = "flex";
                    eleVideoBG.style.display = "inline-flex";
                    eleSorceVideoBG.setAttribute('src', '../Files/Videos_webm/Toaru-Kagaku-no-Accelerator.webm');
                    setTimeout(function() {
                        eleVideoBG.load();
                    }, 500); // Ritardo di 500 millisecondi (0,5 secondi)
                    tabs[0].tabI.classList.add("active");
                    break;
                case tabs[1].tabI:
                    tabs[1].tabS.style.display = "flex";
                    eleVideoBG.style.display = "inline-flex";
                    eleSorceVideoBG.setAttribute('src', '../Files/Videos_webm/Toaru-Kagaku-no-Railgun.webm');
                    setTimeout(function() {
                        eleVideoBG.load();
                    }, 500); // Ritardo di 500 millisecondi (0,5 secondi)
                    tabs[1].tabI.classList.add("active");
                    break;
                case tabs[2].tabI:
                    tabs[2].tabS.style.display = "flex";
                    eleVideoBG.style.display = "inline-flex";
                    eleSorceVideoBG.setAttribute('src', '../Files/Videos_webm/Toaru-Majutsu-no-Index2.webm');
                    setTimeout(function() {
                        eleVideoBG.load();
                    }, 500); // Ritardo di 500 millisecondi (0,5 secondi)
                    tabs[2].tabI.classList.add("active");
                    break;
                case tabs[3].tabI:
                    tabs[3].tabS.style.display = "flex";
                    eleVideoBG.style.display = "inline-flex";
                    eleSorceVideoBG.setAttribute('src', '../Files/Videos_webm/Toaru-Majutsu-no-Index1.webm');
                    setTimeout(function() {
                        eleVideoBG.load();
                    }, 500); // Ritardo di 500 millisecondi (0,5 secondi)
                    tabs[3].tabI.classList.add("active");
                    break;
                case tabs[4].tabI:
                    tabs[4].tabS.style.display = "flex";
                    eleVideoBG.style.display = "inline-flex";
                    eleSorceVideoBG.setAttribute('src', '../Files/Videos_webm/Toaru-Kagaku-no-Accelerator.webm');
                    setTimeout(function() {
                        eleVideoBG.load();
                    }, 500); // Ritardo di 500 millisecondi (0,5 secondi)
                    tabs[4].tabI.classList.add("active");
                    break;
                case tabs[5].tabI:
                        tabs[5].tabS.style.display = "flex";
                        eleVideoBG.style.display = "inline-flex";
                        //eleSorceVideoBG.setAttribute('src', '../Files/Videos_webm/Toaru-Kagaku-no-Accelerator.webm');
                        setTimeout(function() {
                            eleVideoBG.load();
                        }, 500); // Ritardo di 500 millisecondi (0,5 secondi)
                        tabs[5].tabI.classList.add("active");
                        break;
                default:
                    console.log(`NON RICONOSCIUTO! - ${event.target}`);
            }

            setTimeout(function() {
                // Imposta l'opacità a 1 per far apparire gradualmente il video
                eleVideoBG.style.opacity = '1';
            }, 500); // Ritardo di 500 millisecondi (0,5 secondi)
            current.tabS.style.display = "none";
            current.tabI.classList.remove("active");
            current = tabs.find(t => t.tabI == event.target);
        }
    });

    // Example: Enable popovers everywhere
    popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl)
    });

    // embed.addEventListener(Twitch.Embed.VIDEO_READY, () => {
    //     var player = embed.getPlayer();
    //     player.play();
    // });
}

//METODI SECONDARI
// function ShowAddressInfo() {
//     cryptoSelectOptions
// }

const repoName = 'AnimeWorldDownloader'; // Sostituisci con il nome del tuo repository
const apiUrl = `https://api.github.com/repos/${repoName}`;

fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        const repoInfo = document.getElementById('repo-info');
        repoInfo.innerHTML = `
            <h2>${data.name}</h2>
            <p>Descrizione: ${data.description}</p>
            <p>Linguaggio: ${data.language}</p>
            <p>Stelle: ${data.stargazers_count}</p>
            <p>Fork: ${data.forks_count}</p>
            `;
            // <p>Ultimo aggiornamento: ${data.updated_at}</p>
    });

//Funzione per mostrare il toast automaticamente
function ShowToast(title, msg) {
    if(title) {
        toastLiveNotificationTitle.textContent = title;
    }
    if(msg) {
        toastLiveNotificationMSG.textContent = msg;
    }
    toastLiveNotification.classList.add('show'); // Apri il toast
    const toast = new bootstrap.Toast(toastLiveNotification);
    toast.show();
}