/**
* Object to controller the translate.
* @param index      The index of the project
*/
function Translator(){

    const cookieName = "langage_MicroAstro";

    // By default use the value of EN.json...
    this.dynamicText = {};

    var translator = this; // Useful for interact with this instance in the function

    $(document).ready(initLang);

    function sendAjaxRequest(url, then_function, fail_function){
        $.ajax({
            url: url,
            type:"GET",
            dataType: 'json',
            contentType: "application/json; charset=utf-8"
        }).done(function(data){
            then_function(data);
        }).fail(function(data){
            fail_function(data);
        });
    }

    /**
    * Initialise the language of the page
    */
    function initLang(){

        // Setting lang base on the URL
        var lang = window.location.href.includes("visual") ? "EN" : "FR";

        localStorage.setItem(cookieName, lang);

        // Update ui
        requestTranslate(lang);
        initSelectLang(lang);
    }

    /**
    * Initialise the select language
    */
    function initSelectLang(lang){
        // Get list of lang
        var listLang = getValidLang();

        // Update the select of the lang
        $("#chooseLang").empty();
        for(let langage of listLang){
            $("#chooseLang").append("<option value='" + langage + "'>" + langage + "</option>")
        }

        // Init the select value
        $("#chooseLang").val(lang);

        // Add listener
         $("#chooseLang").on("change", reactSelectLang);
    }

    /**
    * Initialise the select language
    */
    function reactSelectLang(){
        // Get lang
        let lang = $(this).val();

        lang = isValidLang(lang) ? lang : "FR";

        // Save languages
        localStorage.setItem(cookieName, lang);

        // Translate
        requestTranslate(lang);
    }

    /**
    * Define if the language is valid
    * @param lang    string of the language to validate
    * @return true if the language is EN or FR
    */
    function isValidLang(lang){
        return getValidLang().includes(lang);
    }

    // Set is valid lang public
    this.isValidLang = isValidLang;

    /**
    * Get the list of valid languages.
    * @return the list of the languages
    */
    function getValidLang(){
        return ["EN", "FR"]
    }

    /**
    * Request the language json file and use his data.
    * @param lang           string of the language to validate
    */
    function requestTranslate(lang){
        // Set the url path for the json file
        var url = "../frontend/json/" + lang + ".json";

        // Send request
        if(isValidLang(lang)){
            sendAjaxRequest(url, function(data){

                setDynamicText(data.dynamicText);

                // Translate static data
                translateStaticContent(data);

            }, function(){
                failJsonLoad();
            });
        }
    }

    /**
    * Management of fail json request
    * @param data       request fail data
    */
    function failJsonLoad(data){
        console.log(data)
        console.log(dynamicText["error-json-file"]);
    }

    // Set is valid lang public
    this.failJsonLoad = failJsonLoad;

    /**
    * Translate all of the static element
    *@param data    the data of the select language json file
    */
    function translateStaticContent(data){
        // Change all of the static text
        let staticText = data.staticText;
        for (let classes in staticText){
            $("."+classes).text(staticText[classes]);
        }

        translateLongStaticText(data);
    }

    /**
    * Translate all of the long static element
    *@param data    the data of the select language json file
    */
    function translateLongStaticText(data){
        // Change all of the long static text
        let staticLongText = data.staticLongText;
        for (let classes in staticLongText){
            var text = "";

            // Merge the text
            for (let part of staticLongText[classes]){
                text += part;
            }

            if(classes.indexOf("ul-") > -1){
                // begin the content with a li tag
                text = "<li>" + text;

                // remplace all \n for a close and open li
                text = replaceByInText(text, "\n", "</li><li>")

                // End the content with a close li tag
                text += "</li>";
            } else{
                // remplace all \n for a br tag
                text = replaceByInText(text, "\n", "<br><br>")
            }

            // Replace the content
            $("."+classes).html(text);
        }
    }

    function replaceByInText(text, find, replacement){
        while(text.indexOf(find) > -1){
            text = text.replace(find, replacement)
        }
        return text;
    }


    /**
    * Change the dynamic text content
    * @param newValue   The translated dynamic content
    */
    function setDynamicText(newValue){
        translator.dynamicText = newValue;
    }
}