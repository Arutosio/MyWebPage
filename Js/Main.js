
import IndexManager from "./IndexManager.js";
import UtilityClass from "./UtilityClass.js";
import HtmlBuilder from "./HtmlBuilder.js";
import RequestJson from "./GetterJson.js"

var getterJson = new RequestJson("https://localhost:5001", null)
var htmlBuilder = new HtmlBuilder("../Views");

// console.log(UtilityClass.GetJsonFromFile("../Files/Json/test.json"));

document.addEventListener('DOMContentLoaded', function(event) {
    StartUp().then(LoadConstant);
});

async function StartUp() {
    //Insert Navbar
    let htmlNavbar = await htmlBuilder.CreateNavbarView("");
    IndexManager.ReplaceHtmlContent("mainNavbar", htmlNavbar);

    let htmlSectionsHome = await htmlBuilder.CreateSectionView("");
    IndexManager.ReplaceHtmlContent("sHome", htmlSectionsHome);

    let htmlSectionsAboutMe = await htmlBuilder.CreateSectionViewById("sAboutMe");
    IndexManager.ReplaceHtmlContent("sAboutMe", htmlSectionsAboutMe);

    let htmlSectionsFeatures = await htmlBuilder.CreateSectionViewById("sFeatures");
    IndexManager.ReplaceHtmlContent("sFeatures", htmlSectionsFeatures);

    let htmlSectionsDev = await htmlBuilder.CreateSectionViewById("sDev");
    IndexManager.ReplaceHtmlContent("sDev", htmlSectionsDev);

    let jsonWalletDepositAddress = await UtilityClass.GetJsonFromRootPage("WalletDepositAddress");
    let htmlSectionsDonate = await htmlBuilder.CreateSectionDonateView(jsonWalletDepositAddress);
    IndexManager.ReplaceHtmlContent("sDonate", htmlSectionsDonate);

    let htmlFooter = await htmlBuilder.CreateFooterViewById("iFooter");
    IndexManager.ReplaceHtmlContent("iFooter", htmlFooter);
}

function LoadConstant() {
    //Delcare Costant
    const eleVideoBG = document.querySelector("#videoBG");
    // Sor = Sorce
    const eleSorceVideoBG = document.querySelector("#sorceVideoBG");
    
    const tabs = [
        { tabI: document.querySelector("#iHome"), tabS: document.querySelector("#sHome") },
        { tabI: document.querySelector("#iAboutMe"), tabS: document.querySelector("#sAboutMe") },
        { tabI: document.querySelector("#iFeatures"), tabS: document.querySelector("#sFeatures") },
        { tabI: document.querySelector("#iDev"), tabS: document.querySelector("#sDev") },
        { tabI: document.querySelector("#iDonate"), tabS: document.querySelector("#sDonate") },
    ];
    var current = tabs[0];

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
                    eleSorceVideoBG.setAttribute('src', '../Files/Videos/Toaru-Kagaku-no-Accelerator.m4v');
                    eleVideoBG.load();
                    tabs[0].tabI.classList.add("active");
                    break;
                case tabs[1].tabI:
                    tabs[1].tabS.style.display = "flex";
                    //eleVideoBG.style.display = "inline-flex";
                    eleSorceVideoBG.setAttribute('src', '../Files/Videos/Toaru-Kagaku-no-Railgun.m4v');
                    eleVideoBG.load();
                    tabs[1].tabI.classList.add("active");
                    break;
                case tabs[2].tabI:
                    tabs[2].tabS.style.display = "flex";
                    //eleVideoBG.style.display = "inline-flex";
                    eleSorceVideoBG.setAttribute('src', '../Files/Videos/Toaru-Majutsu-no-Index2.m4v');
                    eleVideoBG.load();
                    tabs[2].tabI.classList.add("active");
                    break;
                case tabs[3].tabI:
                    tabs[3].tabS.style.display = "flex";
                    //eleVideoBG.style.display = "inline-flex";
                    eleSorceVideoBG.setAttribute('src', '../Files/Videos/Toaru-Majutsu-no-Index1.m4v');
                    eleVideoBG.load();
                    tabs[3].tabI.classList.add("active");
                    break;
                case tabs[4].tabI:
                    tabs[4].tabS.style.display = "flex";
                    //eleVideoBG.style.display = "inline-flex";
                    eleSorceVideoBG.setAttribute('src', '../Files/Videos/Toaru-Kagaku-no-Accelerator.m4v');
                    eleVideoBG.load();
                    tabs[4].tabI.classList.add("active");
                    break;
                default:
                    console.log(`NON RICONOSCIUTO! - ${event.target}`);
            }

            current.tabS.style.display = "none";
            current.tabI.classList.remove("active");
            current = tabs.find(t => t.tabI == event.target);
        }
    });

    // Example: Enable popovers everywhere
    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
    var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl)
    })
}