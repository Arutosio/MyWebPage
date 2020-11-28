$(document).ready(function()
{
    //ElementRef
    var eleSelections = document.getElementById("Selections");
    var eleSecHome = document.getElementById("home");
    var eleSecFeaturedon = document.getElementById("featuredon");
    var eleSecGameAru = document.getElementById("gameAru");
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

            //Show and Hiden SelectionGameAru
            if(nameSelection == eleSecGameAru.getAttribute("id")) {
                console.log(nameSelection);
                eleSecGameAru.style.display = "flex";
            } else { eleSecGameAru.style.display = "none"; }

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

    // //Controller collapse sidebar
    // $('#sidebarCollapse').on('click', function () {
    //     $('#sidebar').toggleClass('active');
    //     $(this).toggleClass('active');
    // });

    // $("#sidebar").mCustomScrollbar({
    //     theme: "minimal"
    // });

    $('#sidebarCollapse').on('click', function () {
        $('#sidebar, #content').toggleClass('active');
        $('.collapse.in').toggleClass('in');
        $('a[aria-expanded=true]').attr('aria-expanded', 'false');
    });

    //Controller Selection

    // var elButt = document.getElementById('IdMainDiv');
    // $('#IdButtonAboutMe').click(function(){
    //     var newElement = document.createElement('table').textContent = "Repleace DONE";
    //     elButt.replaceChild(newElement,elButt.getElementById('IdResTabella'));
    // });
    // $('#IdButtonGallery').click(function(){

    // });
    // $('#IdButtonHref').click(function(){

    // });
    // //set to run POKEMON
    // $('#listButtonPokemon').hide();
    // $('#listPokemon').hide();
    // $('#addButtonPokemon').hide();
    // $('#idRemoveLast').hide();
    // $('INPUT[type=text]').change(function(){
    //     if($(this).val()=='')
    //         $(this).attr('class','casenull');
    //     else if($(this).val()!='')
    //         $(this).attr('class','casetrue');
    // });
    // $('INPUT[type=number]').change(function(){
    //     if($(this).val()==null||$(this).val()=='')
    //         $(this).attr('class','casenull');
    //     else if($(this).val()>=0)
    //         $(this).attr('class','casetrue');
    //     else if($(this).val()<0)
    //         $(this).attr('class','casefalse');
        
    // });
    // $('INPUT[type=number],INPUT[type=text]').change(function(){
    //     if($('#idPNameCase').hasClass('casetrue')&&$('#idPPriceCase').hasClass('casetrue'))
    //         $('#addButtonPokemon').show();
    //     else
    //         $('#addButtonPokemon').hide();
    // });
    // $('#idbudget').change(function(){
    //     var name = $(this).attr('name');
    //     teamPokemon[name]=$(this).val();
    //     if(teamPokemon.rest()!=teamPokemon.nameBudget)
    //         $('#rest').val(teamPokemon.rest())
    // else 
    //     $('#rest').val('');
    // });
    // $('#idPNameCase').blur(function(){
    //     if($(this).val()!='')
    //         for(var i=0;i<teamPokemon.toString().split('<br>').length;i++)
    //             if($(this).val().trim().toLowerCase()==teamPokemon.toString().split('<br>')[i].trim().toLowerCase())
    //                 {
    //                     $(this).attr('class','casefalse');
    //                     $('#idRemoveLast').show();
    //                     $('#addButtonPokemon').hide();
    //                 }
    //     if(($(this).attr('class')!='casefalse'))
    //     {
    //         $('#idRemoveLast').hide();
    //     }
    //     if(($(this).attr('class')=='casetrue')&&($('#PPriceCase').attr('class')=='casetrue'))
    //     {
    //         $('#addButtonPokemon').show();
    //     }
    // });
    // $('#addButtonPokemon').click(function(){
    //     teamPokemon.pokemonOnTeam.push({PNameCase:$('#idPNameCase').val(),PPriceCase:parseInt($('#idPPriceCase').val())})
    //     $('#idPNameCase').val('');
    //     $('#idPNameCase').attr('class','casenull');
    //     $('#idPPriceCase').val('');
    //     $('#idPPriceCase').attr('class','casenull');
    //     $('#listPokemon').html(teamPokemon.toString().split('<br>'));
    //     if(teamPokemon.rest()>0)
    //         $('#rest').val(teamPokemon.rest())
    //     else 
    //         $('#rest').val('');
    //     if(teamPokemon.pokemonOnTeam.length>=6)
    //         $('#addButtonPokemon').hide();
    //     else
    //         $('#addButtonPokemon').show();
    //     if(teamPokemon.pokemonOnTeam.length>0)
    //     {
    //         $('#listButtonPokemon').show();
    //     }
    //     else
    //     {
    //         $('#listButtonPokemon').hide();
    //         $('#idRemoveLast').hide();
    //     }
    // });
    // $('#idRemoveLast').click(function(){
    //     teamPokemon.pokemonOnTeam.pop();
    //     $('#idPNameCase').val('');
    //     $('#idPPriceCase').val('');
    //     $('#listPokemon').html(teamPokemon.toString().split('<br>'));
    //     if(teamPokemon.rest()>0)
    //         $('#rest').val(teamPokemon.rest())
    //     else 
    //         $('#rest').val('');
    //     if(teamPokemon.pokemonOnTeam.length>=6)
    //         $('#addButtonPokemon').hide();
    //     if(teamPokemon.pokemonOnTeam.length>0)
    //     {
    //         $('#idRemoveLast').show();
    //         $('#listButtonPokemon').show();
    //     }
    //     else
    //     {
    //         $('#listButtonPokemon').hide();
    //         $('#idRemoveLast').hide();
    //     }
    // });
    // $('#addButtonPokemon','#idRemoveLast').click(function(){
    //     //$('#rest').val(teamPokemon.rest()+'');
    // });
    // $('#listButtonPokemon').click(function(){
    //     $('#listPokemon').toggle('slow');
    // });
});

// var name = $(this).attr('name');
// teamPokemon[name]=$(this).val();
// update();