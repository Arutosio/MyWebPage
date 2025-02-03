import IndexManager from "./IndexManager.js";
import UtilityClass from "./UtilityClass.js";
import HtmlBuilder from "./HtmlBuilder.js";
import RequestJson from "./RequestJson.js";
import Fireworks from "./Effect/Fireworks.js";


// import Fancybox from "https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.esm.js";

var requestJson = new RequestJson(null, "https://data.mongodb-api.com/app/data-ivdyd/endpoint/data/beta", null);
var htmlBuilder = new HtmlBuilder("../Views");


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
var cryptoSelectOptions;
var addressInfos;
var popoverTriggerList;
var popoverList;
var embed;
// Variabili per Kanji Section
var kanjiListJson
var kanjiListSelectOptions;
var kanjiListAddedOnTrainGroup;
var buttonRemoveKanjiList;
var buttonAddKanjiList;
var buttonStartStopLearnKanji;
var buttonCheckKanji;
var checkboxKunYomi;
var checkboxOnYomi;
var divInputKunYomi;
var divInputOnYomi;
var inputKunYomi;
var inputOnYomi;
var spanButtonCountDid;
var spanButtonCountToDo;
var kanjiProgressBar;
var kanjiProgressBarProgress;
var kanjiAsk;
var kanjiToLearn = [];
// Var Kanji Exexise
var countKanjiAnswer = 0;

// Var Notifications
var toastLiveNotificationContainer;
var toastLiveNotification;
var toastLiveNotificationTitle;
var toastLiveNotificationMSG;
// Istanza dei fuochi d'artificio
var fireworks = new Fireworks();
//Mostra il toast dopo 1 secondi
setTimeout(ShowToast, 0);

var x = await RequestJson.RequestMongoDB();
document.addEventListener('DOMContentLoaded', function(event) {

    //var x = await requestJson.RequestMongoDB();
    //console.log(await requestJson.RequestMongoDB());

    //document.querySelector(window.location.hash).style.display.
    StartUp();
    // CreateVariables();
    // AppendEvents();
    // (Facoltativo) Ferma i fuochi d'artificio dopo un certo tempo

    // Avvia i fuochi d'artificio
    if (currentDate.getDate() === birthDate.getDate() && currentDate.getMonth() === birthDate.getMonth()) 
        {
            console.log("Oggi è il tuo compleanno! 🎉");
            fireworks.start();
            //fireworks.stop();
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

    let kanjiFileNames = ["Kanji_Numeri", "Kanji_NumeriOver", "Kanji_Prova"];
    kanjiListJson = await UtilityClass.GetJsonFilesFromFolder("Kanji_Json", kanjiFileNames);
    let htmlSectionsKanji = await htmlBuilder.CreateSectionKanjiView(kanjiListJson);
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
    //Crypto elements
    cryptoSelectOptions = document.querySelector('#cryptoSelectOptions');
    addressInfos = document.querySelectorAll(".chainList");
    //Kanji elements
    kanjiListSelectOptions = document.querySelector('#kanjiListSelectOptions');
    kanjiListAddedOnTrainGroup = document.querySelector('#kanjiListAddedOnTrainGroup');
    buttonRemoveKanjiList = document.querySelector('#buttonRemoveKanjiList');
    buttonAddKanjiList = document.querySelector('#buttonAddKanjiList');
    buttonStartStopLearnKanji = document.querySelector('#buttonStartStopLearnKanji');
    buttonCheckKanji = document.querySelector('#buttonCheckKanji');
    spanButtonCountDid = document.querySelector('#spanButtonCountDid');
    spanButtonCountToDo = document.querySelector('#spanButtonCountToDo');
    kanjiProgressBar = document.querySelector('#kanjiProgressBar');
    kanjiProgressBarProgress = document.querySelector('#kanjiProgressBarProgress');
    checkboxKunYomi = document.querySelector('#checkboxKunYomi');
    checkboxOnYomi = document.querySelector('#checkboxOnYomi');
    divInputKunYomi = document.querySelector('#divInputKunYomi');
    divInputOnYomi = document.querySelector('#divInputOnYomi');
    inputKunYomi = divInputKunYomi.querySelector('#inputKunYomi');
    inputOnYomi = divInputOnYomi.querySelector('#inputOnYomi');
    kanjiAsk = document.querySelector('#kanjiAsk');

    // NotificationCenter
    toastLiveNotificationContainer = document.querySelector('#toastLiveNotificationContainer');
    toastLiveNotification = toastLiveNotificationContainer.querySelector('#toastLiveNotification');
    toastLiveNotificationTitle = toastLiveNotification.querySelector('#toastLiveNotificationTitle');
    toastLiveNotificationMSG = toastLiveNotificationContainer.querySelector('#toastLiveNotificationMSG');


    //console.log(andressInfo);

    
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

    eleVideoBG.style.opacity = '1';

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

    cryptoSelectOptions.addEventListener("change", function(event) {
        for (let i = 0; i < addressInfos.length; i++) {
            let address = addressInfos[i];
            if (i == this.value) {
                address.style.display = "flex";
            }
            else {
                address.style.display = "none";
            }
        }
    });

    kanjiListSelectOptions.addEventListener("change", function(event) {
        // Stampa il valore selezionato nella console
        console.log('Valore selezionato:', kanjiListSelectOptions.value);
        // Puoi anche ottenere il testo dell'opzione selezionata
        const selectedText = kanjiListSelectOptions.options[kanjiListSelectOptions.selectedIndex].text;
        console.log('Testo selezionato:', selectedText);
    });

    // Aggiungi un evento al click del pulsante
    buttonAddKanjiList.addEventListener('click', AddKanjiListOnGroup);
    buttonRemoveKanjiList.addEventListener('click', RemoveKanjiListOnGroup);
    buttonStartStopLearnKanji.addEventListener('click', StartStopLearnKanji);
    buttonCheckKanji.addEventListener('click', AskNextKanji);
    checkboxKunYomi.addEventListener('change', HiddenShowInputKunYomi);
    checkboxOnYomi.addEventListener('change', HiddenShowInputOnYomi);
}

function ChnageVideoSetup(tabS) {
    tabs[4].tabS.style.display = "flex";
    eleVideoBG.style.display = "inline-flex";
    eleSorceVideoBG.setAttribute('src', '../Files/Videos_webm/Toaru-Kagaku-no-Accelerator.webm');
}


//CREAZIONE DI TUTTE LE VARIABILI NECESARIE UTILIZZATI DALLE FUNZIONI
function CreateVariables()
{
    //Delcare Costant
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
    cryptoSelectOptions = document.getElementById('#cryptoSelectOptions');
    andressInfo = document.querySelector("#addressInfo");
    //console.log(andressInfo);

    
    // embed = new Twitch.Embed("twitch-embed", {
    //     width: "90%",
    //     height: "60%",
    //     theme: "dark",
    //     // layout: "video",
    //     autoplay: false,
    //     channel: "arutosio",
    //     // Only needed if this page is going to be embedded on other websites
    //     parent: ["embed.example.com", "othersite.example.com"]
    // });
}

//CREAZIONI ASSOCIAGIONE AGLI EVENTI DEGLI ELEMENTI
function AppendEvents() {
    
    //#region EVENT LISTENERS
    //document.body.querySelector("#Selections").addEventListener("click", ShowSelection(x));
    document.addEventListener('click', function( event ) 
    {
        // console.log(tabScenaries[Object.keys(tabScenaries)]);
        if (event.target.getAttribute("class") != "nav-link active" && tabs.find(t => t.tabI == event.target)) 
        {
            switch(event.target) {
                case tabs[0].tabI:
                    tabs[0].tabS.style.display = "flex";
                    //eleVideoBG.style.display = "inline-flex";
                    eleSorceVideoBG.setAttribute('src', '../Files/Videos_webm/Toaru-Kagaku-no-Accelerator.webm');
                    eleVideoBG.load();
                    eleVideoBG.play();
                    tabs[0].tabI.classList.add("active");
                    break;
                case tabs[1].tabI:
                    tabs[1].tabS.style.display = "flex";
                    //eleVideoBG.style.display = "inline-flex";
                    eleSorceVideoBG.setAttribute('src', '../Files/Videos_webm/Toaru-Kagaku-no-Railgun.webm');
                    eleVideoBG.load();
                    eleVideoBG.play();
                    tabs[1].tabI.classList.add("active");
                    break;
                case tabs[2].tabI:
                    tabs[2].tabS.style.display = "flex";
                    //eleVideoBG.style.display = "inline-flex";
                    eleSorceVideoBG.setAttribute('src', '../Files/Videos_webm/Toaru-Majutsu-no-Index2.webm');
                    eleVideoBG.load();
                    eleVideoBG.play();
                    tabs[2].tabI.classList.add("active");
                    break;
                case tabs[3].tabI:
                    tabs[3].tabS.style.display = "flex";
                    //eleVideoBG.style.display = "inline-flex";
                    eleSorceVideoBG.setAttribute('src', '../Files/Videos_webm/Toaru-Majutsu-no-Index1.webm');
                    eleVideoBG.load();
                    eleVideoBG.play();
                    tabs[3].tabI.classList.add("active");
                    break;
                case tabs[4].tabI:
                    tabs[4].tabS.style.display = "flex";
                    //eleVideoBG.style.display = "inline-flex";
                    eleSorceVideoBG.setAttribute('src', '../Files/Videos_webm/Toaru-Kagaku-no-Accelerator.webm');
                    eleVideoBG.load();
                    eleVideoBG.play();
                    tabs[4].tabI.classList.add("active");
                    break;
                default:
                    console.log(`NON RICONOSCIUTO! - ${event.target}`);
            }

            current.tabS.style.display = "none";
            current.tabI.classList.remove("active");
            current = tabs.find(t => t.tabI == event.target);
            fetchGitHubRepoInfo("AnimeWorldDownloader")
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

    cryptoSelectOptions.addEventListener("select", ShowAddressInfo());
}

//METODI SECONDARI
function ShowAddressInfo() {
    cryptoSelectOptions
}

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

// #region Section-Kanji-Methods
function EnableDisableStartStopButton() {
    const listItems = kanjiListAddedOnTrainGroup.querySelectorAll('li'); // Seleziona tutti gli elementi <li>
    if (listItems.length >= 2) { // Verifica se ci sono almeno due elementi <li>
      buttonStartStopLearnKanji.disabled = false; // Abilita il pulsante
    } else {
        buttonStartStopLearnKanji.disabled = true; // Disabilita il pulsante
    }
}

function EnableAddRemoveButton(bool) {
    if (bool) {
        buttonAddKanjiList.disabled = false; 
        buttonRemoveKanjiList.disabled = false;
    } else {
        buttonAddKanjiList.disabled = true; 
        buttonRemoveKanjiList.disabled = true;
    }
}

function EnableYomiCheckbox(bool) {
    if (bool) {
        checkboxKunYomi.disabled = false; 
        checkboxOnYomi.disabled = false;
    } else {
        checkboxKunYomi.disabled = true; 
        checkboxOnYomi.disabled = true;
    }
}

async function AddKanjiListOnGroup() {
    // Codice da eseguire quando il pulsante viene cliccato
    console.log('Il pulsante buttonAddKanjiList è stato cliccato!');

    if (!kanjiListAddedOnTrainGroup.querySelector(`#added${kanjiListSelectOptions.value}`))
    {
        let htmlKanjiListTemplate = ""; // Variabile per memorizzare il template HTML
        // Itera attraverso l'array kanjiListJson
        for (let i = 0; i < kanjiListJson.length; i++) {
            const aKanjiListInfo = kanjiListJson[i]; // Ottieni l'elemento corrente
            // Confronta il fileName con il valore selezionato
            if (aKanjiListInfo.fileName === kanjiListSelectOptions.value) {
                htmlKanjiListTemplate = await htmlBuilder.CreateHtmlKanjiListInfoByJsonKanjiList(aKanjiListInfo); // Crea il template HTML
                break; // Esci dal ciclo una volta trovato l'elemento
            }
        }
        // Se il template è vuoto, significa che non è stato trovato alcun elemento corrispondente
        if (htmlKanjiListTemplate === "") {
            console.log(`${htmlKanjiListTemplate} non trovato!`);
        } else {
            // Aggiungi il template HTML al contenitore
            kanjiListAddedOnTrainGroup.insertAdjacentHTML('beforeend', htmlKanjiListTemplate);
        }
    } else { console.log(`I kanji: ${kanjiListSelectOptions.value} sono gia presenti nel gruppo.`); }
    EnableDisableStartStopButton(); // Aggiorna lo stato del pulsante.
}

async function RemoveKanjiListOnGroup() {
    // Codice da eseguire quando il pulsante viene cliccato
    console.log('Il pulsante buttonRemoveKanjiList è stato cliccato!');
    // 2. Trova l'elemento da rimuovere (esempio: usando una classe)
    let elementToRemove = kanjiListAddedOnTrainGroup.querySelector(`#added${kanjiListSelectOptions.value}`); // Selettore più specifico
    // 3. Rimuovi l'elemento
    if (elementToRemove) { // Verifica che l'elemento esista prima di rimuoverlo
        elementToRemove.remove();
    } else {
        console.log("Elemento da rimuovere non trovato.");
    }
    EnableDisableStartStopButton(); // Aggiorna lo stato del pulsante.
}

function HiddenShowInputKunYomi() {
    if (divInputKunYomi.style.display === "none") {
        divInputKunYomi.style.display = "block"; // Mostra l'input
    } else {
        divInputKunYomi.style.display = "none"; // Nasconde l'input
    }
}

function HiddenShowInputOnYomi() {
    if (divInputOnYomi.style.display === "none") {
        divInputOnYomi.style.display = "block"; // Mostra l'input
    } else {
        divInputOnYomi.style.display = "none"; // Nasconde l'input
    }
}

function UpdateKanjiAsk(kanji) {
    if (kanjiAsk) { // Importante: verifica che l'elemento esista!
        // Rimpiazza solo il testo:
        kanjiAsk.textContent = kanji.carattere;
    } else {
        console.error("Elemento con id 'kanjiAsk' non trovato!");
    }
}

function UpdateProgressBar() {
    const percent = (countKanjiAnswer / kanjiToLearn.length) * 100;
    const strProgressBar = `${percent}% ${countKanjiAnswer}/${kanjiToLearn.length}`;
    kanjiProgressBar.dataset.ariaValuenow = percent
    kanjiProgressBarProgress.dataset.style =`${percent}%`;
    kanjiProgressBarProgress.textContent = strProgressBar;
}

async function AddKanjiInLearnKanjiList() {
    // Codice da eseguire quando il pulsante viene cliccato
    console.log('Il pulsante buttonStartStopLearnKanji è stato cliccato!');
    kanjiToLearn = []; // Svuota l'array prima di aggiungere nuovi elementi
    
    const elementiAdded = kanjiListAddedOnTrainGroup.querySelectorAll('[id^="added"]');
    
    if (elementiAdded.length > 0) { // Verifica se ci sono elementi prima di iterare (più efficiente)
        for (const elemento of elementiAdded) { // Usa for...of per iterare sugli elementi (più moderno e leggibile)
            const nameKanjiList = elemento.dataset.nameKanjiList; // Ottieni il dataset una sola volta per elemento
            
            if (nameKanjiList) { // Verifica che l'attributo data-name-kanji-list esista (gestione errori)
                for (const kanjiList of kanjiListJson) { // Usa for...of per iterare su kanjiListJson
                    if (nameKanjiList === kanjiList.fileName) {
                        const kanjitoAdd = kanjiList.data.kanji;
                        
                        if (Array.isArray(kanjitoAdd)) { // Verifica se kanjitoAdd è un array (gestione errori)
                            for (const kanji of kanjitoAdd) {
                                const kanjiEsistente = kanjiToLearn.find(k => k.carattere === kanji.carattere);
                                if (!kanjiEsistente) {
                                    kanjiToLearn.push(kanji);
                                }
                            }
                        } else if (kanjitoAdd) { // Gestisci il caso in cui kanjitoAdd è un singolo oggetto kanji
                            const kanjiEsistente = kanjiToLearn.find(k => k.carattere === kanjitoAdd.carattere);
                            if (!kanjiEsistente) {
                                kanjiToLearn.push(kanjitoAdd);
                            }
                        } else {
                            console.warn(`Nessun kanji trovato per ${nameKanjiList}`); // Avviso se non ci sono kanji
                        }
                        break; // Esci dal ciclo interno dopo aver trovato la corrispondenza (ottimizzazione)
                    }
                }
            } else {
                console.warn(`L'elemento con id ${elemento.id} non ha l'attributo data-name-kanji-list.`);
            }
        }
    } else {
        console.log("Nessun elemento aggiunto al gruppo.");
    }
    console.log("Kanji da imparare:", kanjiToLearn); // Stampa l'array finale (utile per debug)
}

function IsKanjiAnswersCorrect() {
    let isCorrect = true
    // Codice da eseguire quando il pulsante CheckKanji viene cliccato
    console.log('Eseguo IsKanjiAnswersCorrect.');
    const kanji = kanjiToLearn[countKanjiAnswer];

    // Controllo KunYomi
    if(inputKunYomi.value) {
        const arrayKunYomi = inputKunYomi.value.split(',');
        if(arrayKunYomi.length == kanji.kun_yomi.length) {
            for (const i_kun_yomi of arrayKunYomi) {
                let trimei_kun_yomi = i_kun_yomi.trim();
                let found = false;
                for (const k_kun_yomi of kanji.kun_yomi) {
                    console.log(trimei_kun_yomi);
                    console.log(k_kun_yomi.hiragana);
                    console.log(k_kun_yomi.hiragana === trimei_kun_yomi);
                    if(k_kun_yomi.hiragana === trimei_kun_yomi) {
                        found = true;
                        break;
                    }
                }
                if(!found)
                {
                    isCorrect = false;
                    ShowToast("Kun Yomi",`${trimei_kun_yomi} bagliato.`)
                    break;
                }
            }
        } else {
            isCorrect = false;
            ShowToast("Kun Yomi",`(Inseriti)${arrayKunYomi.length}/${kanji.kun_yomi.length}(Effettivi)`)
        }
    } else {
        isCorrect = false;
        ShowToast("Kun Yomi","Il campo Kun Yomi è vuoto");
    }
    
    // TODO: controllare la risposta e restituire true se è corretta, false altrimenti
    return isCorrect;
}

function AskNextKanji() {

    if(countKanjiAnswer == -1 || IsKanjiAnswersCorrect())
    {
        countKanjiAnswer++;
        if(kanjiToLearn.length !== undefined) {
    
            if(countKanjiAnswer < kanjiToLearn.length) {
                spanButtonCountDid.textContent = countKanjiAnswer;
                UpdateKanjiAsk(kanjiToLearn[countKanjiAnswer]); //
            } else {
                ShowToast("Finish!", "Lista di kanji conclusa.");
                
            }
            UpdateProgressBar(); // Aggiorna la barra di progressione
        }
    }
    // else { ShowToast("Wrong", "The Answers is incorrect."); }
}

async function StartStopLearnKanji() {
    // Controlli

    EnableAddRemoveButton(false); //
    EnableYomiCheckbox(false)
    AddKanjiInLearnKanjiList();
    countKanjiAnswer = -1;
    spanButtonCountDid.textContent = 0;
    spanButtonCountToDo.textContent = kanjiToLearn.length; //
    AskNextKanji();
    buttonCheckKanji.disabled = false;
}
// #end region Section-Kanji-Methods