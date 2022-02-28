const translator = new Translator(0);
const backend_url = "http://localhost:8080";

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
    $('.img-generate-submit').on("click", sendParam);
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
                if ($("#step-" + category).children().length !== 2){
                    $("#step-" + category).find(".img_toSelect")[1].remove();
                }
                // Add the button for the group category
                $("#step-" + category).append(button);

                category = Math.abs(category - 1);

                if ($("#step-" + category).children().length !== 2 ){
                    openAccordion($("#parameter > button"));
                    $(".img-generate-submit").prop("disabled", false);
                }

                let info = img.src.split(";base64");

                const data = {
                    src: info[1],
                    format: info[0].substring("data:image/".length)
                }
                console.log(data)
                sendApiRequest("POST", event.target.parentNode.id.split("_toSelect")[0], data);
            }
        })
        reader.readAsDataURL(file);
    }
}

/**
 * Send API request
 * @param operation     GET/POST/PUT/DELETE
 * @param url           The url where to send the API request
 * @param data          optionnal data
 */
function sendApiRequest(operation, url, data) {
    let request = new XMLHttpRequest();
    request.open(operation, backend_url + "/" + url);
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.setRequestHeader('Access-Control-Allow-Origin', '*')
    request.send(JSON.stringify(data));
    return request;
}

function sendParam(){
    let param_id = ".MethodSelect [name=gen_";
    const param = {
        area: $(param_id + "area]").val(),
        iter: $(param_id + "iter]").val(),
        lr: $(param_id + "lr]").val(),
        content_weight: $(param_id + "content_weight]").val(),
        style_weight: $(param_id + "style_weight]").val(),
        avg_pool: $(param_id + "avg_pool]").val(),
        preserve_color: $(param_id + "preserve_color]").val(),
        use_adam: $(param_id + "use_adam]").val(),
    };
    sendApiRequest("POST", "parameter", param);
    $('.bg_loading').removeClass('hide');
}