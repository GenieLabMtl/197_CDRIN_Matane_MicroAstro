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
    $("#close-bt").on("click", closeSelect);
    $('.uploadBtn').on("change", addToSelection);
    $("body").on("click",".img_toSelect", ImageSelection);
    $("#select-complet").on("click", completSelectCategories);
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
            let id = $(".gallery").children().length - 1;
            img.onload = function() {
                // Initialise the button for the group category
                var button = '<button class="img_toSelect resize" data-cat-id="'+ id +'">'
                    + '<img class="image_category zoomIn" src="' + img.src + '" alt="' + describe + '" title="' + describe + '"'
                if (img.height > img.width){
                    button +='height="128"';
                }
                button += '></button>';

                // Add the button for the group category
                $(".gallery").append(button);
            }

        })
        reader.readAsDataURL(file);
    }
} 

/**
* Manage the selection of category in the search section.
*/
function ImageSelection(){
    let cat_id = parseInt($(this)[0].getAttribute("data-cat-id"));
    
    if ($(this).hasClass("select")) {
        ImageUnSelection($(this));
    }
    else if (cat_id != -1 ) {
        
        let imgSelect = $(".gallery > .select");
        if ( imgSelect.length >= 2){
            ImageUnSelection($(`[order-id="0"]`));
            imgSelect.length -= 1;
        }
        // Add the class
        $(this).addClass("select relative");
        $(this).attr("order-id", imgSelect.length)

        // Add the visual
        const checkSvg = '<svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">'
        +'<path d="M17.0002 0.333313C7.80016 0.333313 0.333496 7.79998 0.333496 17C0.333496 26.2 7.80016 33.6666 17.0002 '
        + '33.6666C26.2002 33.6666 33.6668 26.2 33.6668 17C33.6668 7.79998 26.2002 0.333313 17.0002 0.333313ZM12.4835 '
        + '24.15L6.50016 18.1666C5.85016 17.5166 5.85016 16.4666 6.50016 15.8166C7.15016 15.1666 8.20016 15.1666 8.85016 '
        +'15.8166L13.6668 20.6166L25.1335 9.14998C25.7835 8.49998 26.8335 8.49998 27.4835 9.14998C28.1335 9.79998 28.1335 10.85 '
        +'27.4835 11.5L14.8335 24.15C14.2002 24.8 13.1335 24.8 12.4835 24.15Z" fill="#736AE4"/>'
        +'</svg>';
        $(this).append("<div class='valide_select'>" + checkSvg + "</div>");

        if($(".nextSection").hasClass("hide")){
            $(".nextSection").removeClass("hide");
        }
    }
}

function ImageUnSelection(target){
    target.removeClass("select relative");
    target.find(".valide_select").remove();
    target.removeAttr("order-id");
    updateSelection();
}

function updateSelection(){
    let imgSelect = $(".gallery > .select");
    for (let img of imgSelect){
        let order_id = parseInt(img.getAttribute("order-id")) - 1;
        img.setAttribute("order-id", order_id);
    }
}

/**
* Function for the management of the click event
* on comfirmation of the selected category in the search
*/
function completSelectCategories(){
    
    // remove previous images
    $("#imgGenerateContainer").empty();
    $("#imgSelectContainer").empty();

    // Disabled the save and upload
    $(".save, #upload").prop("disabled", true);
    $(".save, #upload").prop("aria-disabled", true);

    let imgSelect = $(".gallery > .select");
    // Display the new categories selection
    for(let img of imgSelect){
        let elem = img.children[0].cloneNode();
        $("#imgSelectContainer").append(elem);
    }

    // Change the view
    $("#step-0").addClass("hide");
    $("#step-2").removeClass("hide");
    closeSelect();
    openAccordion($("#parameter > button"));
    $(".noMethodSelect ").addClass("hide");
    $(".MethodSelect").removeClass("hide");
}
