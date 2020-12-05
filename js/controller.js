document.addEventListener('DOMContentLoaded', function(event) {
    //the event occurred
    
    //ElementRef ele = element(tag HTML)
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
                eleAHome.classList.add("active");
                console.log(eleSecHome.className);
            } else { 
                eleSecHome.style.display = "none";
                eleAHome.classList.remove("active");
                console.log(eleSecHome.className);
            }

            //Show and Hiden SelectionFeaturedon
            if(nameSelection == eleSecFeaturedon.getAttribute("id")) {
                eleSecFeaturedon.style.display = "flex";
                eleAFeaturedon.classList.add("active");
            } else { 
                eleSecFeaturedon.style.display = "none";
                eleAFeaturedon.classList.remove("active");
            }

            //Show and Hiden SelectionAboutMe
            if(nameSelection == eleSecAboutMe.getAttribute("id")) {
                eleSecAboutMe.style.display = "flex";
                eleAAboutMe.classList.add("active");
            } else {
                eleSecAboutMe.style.display = "none";
                eleAAboutMe.classList.remove("active"); 
            }

            //Show and Hiden SelectionDev
            if(nameSelection == eleSecDev.getAttribute("id")) {
                eleSecDev.style.display = "flex";
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
        if(($(this).attr('src')!='img/icons/GitHub-Mark-120px-plus.png')) {
            $(this).attr('class','img/icons/GitHub-Mark-Light-120px-plus.png');
        }
    });

    $('#sidebarCollapse').on('click', function () {
        $('#sidebar, #content').toggleClass('active');
        $('.collapse.in').toggleClass('in');
        $('a[aria-expanded=true]').attr('aria-expanded', 'false');
    });
});
