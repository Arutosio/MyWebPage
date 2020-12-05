document.addEventListener('DOMContentLoaded', function(event) {
    //the event occurred
    
    //ElementRef
    var eleSelections = document.getElementById("Selections");
    var eleSecHome = document.getElementById("home");
    var eleSecFeaturedon = document.getElementById("featuredon");
    var eleSecAboutMe = document.getElementById("aboutMe");
    var eleSecDev = document.getElementById("dev");

    //#region EVENT LISTENERS
    //document.body.getElementById("Selections").addEventListener("click", ShowSelection(x));

    document.addEventListener('click', function( event ) {
        if (eleSelections !== event.target && eleSelections.contains(event.target)) {
            let nameSelection = event.target.getAttribute("href").substring(1);
            //Show and Hiden SelectionHome
            if(nameSelection == eleSecHome.getAttribute("id")) {
                console.log(nameSelection);
                eleSecHome.style.display = "flex";
            } else { eleSecHome.style.display = "none"; }

            //Show and Hiden SelectionFeaturedon
            if(nameSelection == eleSecFeaturedon.getAttribute("id")) {
                console.log(nameSelection);
                eleSecFeaturedon.style.display = "flex";
            } else { eleSecFeaturedon.style.display = "none"; }

            //Show and Hiden SelectionAboutMe
            if(nameSelection == eleSecAboutMe.getAttribute("id")) {
                console.log(nameSelection);
                eleSecAboutMe.style.display = "flex";
            } else { eleSecAboutMe.style.display = "none"; }

            //Show and Hiden SelectionDev
            if(nameSelection == eleSecDev.getAttribute("id")) {
                console.log(nameSelection);
                eleSecDev.style.display = "flex";
            } else { eleSecDev.style.display = "none"; }
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
