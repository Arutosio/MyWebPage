document.addEventListener('DOMContentLoaded', function(event) {
    //the event occurred
    
    //ElementRef ele = element(tag HTML)
    var eleVideoBG = document.getElementById("videoBG");
    // Sor = Sorce
    var eleSorceVideoBG = document.getElementById("sorceVideoBG");
    // Sec = section
    var eleSelections = document.getElementById("Selections");
    var eleSecHome = document.getElementById("home");
    var eleSecFeaturedon = document.getElementById("featuredon");
    var eleSecAboutMe = document.getElementById("aboutMe");
    var eleSecDev = document.getElementById("dev");
    // A = a
    var eleAHome = document.getElementById("aHome");
    var eleAFeaturedon = document.getElementById("aFeaturedon");
    var eleAAboutMe = document.getElementById("aAboutMe");
    var eleADev = document.getElementById("aDev");

    //#region EVENT LISTENERS
    //document.body.getElementById("Selections").addEventListener("click", ShowSelection(x));

    document.addEventListener('click', function( event ) 
    {
        if (eleSelections !== event.target && eleSelections.contains(event.target)) 
        {
            let nameSelection = event.target.getAttribute("href").substring(1);
            //Show and Hiden SelectionHome
            if(nameSelection == eleSecHome.getAttribute("id")) {
                eleSecHome.style.display = "flex";
                eleVideoBG.style.display = "inline-flex";
                eleSorceVideoBG.setAttribute('src', '../Media/video/Toaru-Kagaku-no-Accelerator.mp4');
                eleVideoBG.load();
                eleAHome.classList.add("active");
            } else { 
                eleSecHome.style.display = "none";
                eleAHome.classList.remove("active");
            }

            //Show and Hiden SelectionAboutMe
            if(nameSelection == eleSecAboutMe.getAttribute("id")) {
                eleSecAboutMe.style.display = "flex";
                eleVideoBG.style.display = "inline-flex";
                eleSorceVideoBG.setAttribute('src', '../Media/video/Toaru-Kagaku-no-Railgun.mp4');
                eleVideoBG.load();
                eleAAboutMe.classList.add("active");
            } else {
                eleSecAboutMe.style.display = "none";
                eleAAboutMe.classList.remove("active"); 
            }

            //Show and Hiden SelectionFeaturedon
            if(nameSelection == eleSecFeaturedon.getAttribute("id")) {
                eleSecFeaturedon.style.display = "flex";
                eleVideoBG.style.display = "inline-flex";
                eleSorceVideoBG.setAttribute('src', '../Media/video/Toaru-Majutsu-no-Index2.mp4');
                eleVideoBG.load();
                eleAFeaturedon.classList.add("active");
            } else { 
                eleSecFeaturedon.style.display = "none";
                eleAFeaturedon.classList.remove("active");
            }

            //Show and Hiden SelectionDev
            if(nameSelection == eleSecDev.getAttribute("id")) {
                eleSecDev.style.display = "flex";
                eleVideoBG.style.display = "inline-flex";
                eleSorceVideoBG.setAttribute('src', '../Media/video/Toaru-Majutsu-no-Index1.mp4');
                eleVideoBG.load();
                eleADev.classList.add("active");
            } else {
                eleSecDev.style.display = "none";
                eleADev.classList.remove("active");
            }
        }
    });
    //#endregion EVENT LISTENERS

    //#region Method
    function ShowSelection(event) {

    }
    //#endregion Method
    //Git logo contoller
    $('#logogit').click(function(){
        if(($(this).attr('src')!='Media/img/icons/GitHub-Mark-120px-plus.png')) {
            $(this).attr('class','Media/img/icons/GitHub-Mark-Light-120px-plus.png');
        }
    });
});
