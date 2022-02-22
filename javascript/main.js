const translator = new Translator(0);

$(document).ready(initPage);

/**
* Init the management of the page.
* This main role is to start the event listener and
* to change the content of the page.
*/
function initPage(){
    $(".accordion button, .accordion .arrow-container").on("click", toggleAccordion);
    $(".searchBt, .changeImageButton").on("click", activeSelect);
    $('.uploadBtn').on("change", addToSelection);
}

/****************************** Accordion section code ******************************/

/**
* Open the linked section of the Accordion.
* @param target     the target element is the title linked with the section
*/
function openAccordion(target){
    closeAccordion($(".open-accordion"));
    let parent = target.parent();
    let section = $("#"+ parent.attr("id") + "_section")

    parent.find(".arrow").addClass("rot90");

    target.attr("aria-expanded", true);
    section.attr("aria-expanded", true);
    target.addClass("open-accordion");
    section.removeClass("hide");
}

/**
* Close the linked section of the Accordion.
* @param target     the target element is the title linked with the section
*/
function closeAccordion(target){
    let parent =  target.parent();
    let section = $("#"+ parent.attr("id") + "_section")

    parent.find(".arrow").removeClass("rot90");

    target.attr("aria-expanded", false);
    section.attr("aria-expanded", false);
    target.removeClass("open-accordion");
    section.addClass("hide");
}

/**
* Manage the click event on the button of accordion.
* In another words, it open and close the accordion.
*/
function toggleAccordion(){

    if($(this).attr("aria-expanded") === "false"){
        openAccordion($(this));
    } else {
        closeAccordion($(this));
    }
}

/****************************** Navigation section ******************************/

/**
* Function for the management of the click event
* on the search button.
*/
function activeSelect(){
    // Show the search and the tip for the end of search
    $("#section-select").removeClass("hide");
}

/**
* Close the search section
*/
function closeSelect(){
    $("#section-select").addClass("hide");
}

/****************************** Unclassed function ******************************/

function addToSelection(event){
    let files = event.target.files;
    for (let file of files){
        let type = file.type.replace("image/", "");
        let name = file.name;
        if (!name.includes(type)){
            type = type.toUpperCase();
        }
        let describe = name.split("."+type)[0];

        const reader = new FileReader();
        reader.addEventListener('load', (ev) => {
            let img = new Image();
            img.src = ev.target.result;
            img.onload = function() {
                // Initialise the button for the group category
                var button = '<button class="img_toSelect resize">' + '<img class="image_category zoomIn" src="' 
                    + img.src + '" alt="' + describe + '" title="' + describe + '"'
                if (img.height > img.width){
                    button +='height="128"';
                }
                button += '></button>';

                let category = event.target.parentNode.getAttribute("data-cat-id");

                // Add the button for the group category
                $("#step-" + category).append(button);
            }
        })
        reader.readAsDataURL(file);
    }
}