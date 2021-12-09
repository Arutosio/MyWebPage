document.addEventListener('DOMContentLoaded', function(event) {
    // Initialise Carousel
    //the event occurred
    //ElementRef ele = element(tag HTML)
    const eleVideoBG = document.querySelector("#videoBG");
    // Sor = Sorce
    const eleSorceVideoBG = document.querySelector("#sorceVideoBG");
    // Sec = section
    const eleSelections = document.querySelector("#Selections");
    const eleSecHome = document.querySelector("#sHome");
    const eleSecFeatures = document.querySelector("#sFeatures");
    const eleSecAboutMe = document.querySelector("#sAboutMe");
    const eleSecDev = document.querySelector("#sDev");
    // A = a
    const eleIHome = document.querySelector("#iHome");
    const eleIFeatures = document.querySelector("#iFeatures");
    const eleIAboutMe = document.querySelector("#iAboutMe");
    const eleIDev = document.querySelector("#iDev");

    const eleHrefNav = [eleIHome,eleIFeatures,eleIAboutMe,eleIDev]

    //#region EVENT LISTENERS
    //document.body.querySelector("#Selections").addEventListener("click", ShowSelection(x));

    document.addEventListener('click', function( event ) 
    {
        // if (eleSelections !== event.target && eleSelections.contains(event.target)) 
        // {
        //     let nameSelection = event.target.getAttribute("href").substring(1);

        // }
        if (event.target.getAttribute("class") != "nav-link active" && eleHrefNav.includes(event.target)) 
        {
            let nameSelection = event.target.getAttribute("href").substring(1);
            //Show and Hiden SelectionHome
            if(nameSelection == eleSecHome.getAttribute("id")) {
                eleSecHome.style.display = "flex";
                eleVideoBG.style.display = "inline-flex";
                eleSorceVideoBG.setAttribute('src', '../Media/Videos/Toaru-Kagaku-no-Accelerator.m4v');
                eleVideoBG.load();
                eleIHome.classList.add("active");
            } else { 
                eleSecHome.style.display = "none";
                eleIHome.classList.remove("active");
            }

            //Show and Hiden SelectionAboutMe
            if(nameSelection == eleSecAboutMe.getAttribute("id")) {
                eleSecAboutMe.style.display = "flex";
                eleVideoBG.style.display = "inline-flex";
                eleSorceVideoBG.setAttribute('src', '../Media/Videos/Toaru-Kagaku-no-Railgun.m4v');
                eleVideoBG.load();
                eleIAboutMe.classList.add("active");
            } else {
                eleSecAboutMe.style.display = "none";
                eleIAboutMe.classList.remove("active"); 
            }

            //Show and Hiden SelectionFeaturedon
            if(nameSelection == eleSecFeatures.getAttribute("id")) {
                eleSecFeatures.style.display = "flex";
                eleVideoBG.style.display = "inline-flex";
                eleSorceVideoBG.setAttribute('src', '../Media/Videos/Toaru-Majutsu-no-Index2.m4v');
                eleVideoBG.load();
                eleIFeatures.classList.add("active");
            } else { 
                eleSecFeatures.style.display = "none";
                eleIFeatures.classList.remove("active");
            }

            //Show and Hiden SelectionDev
            if(nameSelection == eleSecDev.getAttribute("id")) {
                eleSecDev.style.display = "flex";
                eleVideoBG.style.display = "inline-flex";
                eleSorceVideoBG.setAttribute('src', '../Media/Videos/Toaru-Majutsu-no-Index1.m4v');
                eleVideoBG.load();
                eleIDev.classList.add("active");
            } else {
                eleSecDev.style.display = "none";
                eleIDev.classList.remove("active");
            }
        }
    });
    //#endregion EVENT LISTENERS

    //#region Method
    function ShowSelection(event) {

    }
    //#endregion Method
    //Git logo contoller
    // $('#logogit').click(function(){
    //     if(($(this).attr('src')!='Media/img/icons/GitHub-Mark-120px-plus.png')) {
    //         $(this).attr('class','Media/img/icons/GitHub-Mark-Light-120px-plus.png');
    //     }
    // });
});
    