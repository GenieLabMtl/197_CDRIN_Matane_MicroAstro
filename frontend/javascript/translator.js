/**
* Object to controller the translate.
* @param index      The index of the project
*/
function Translator(index){

    const cookieName = "langage_visualAi";

    // By default use the value of EN.json...
    this.dynamicText = {

        "sub-Template": {
          "text-cross": "cross",
          "text-linear-interpolation": "Linear interpolation",
          "text-hypersphere-interpolation": "Hypersphere interpolation",
          "text-change-bg": "Change background",
          "text-zoom": "zoom",
          "text-side-step": "side step",

          "category-plural": "categories",
          "category-singular": "category"
        },

        "pop-up-need-less-cat-dynamic":" to the maximum",
        "pop-up-need-more-cat-dynamic":" at least",

        "text-img-generate-by-x": "Generate image with {x}",

        "alert-max-selection-image": "It has too many images selected",
        "selection-image-text": "This category is selected",
        "desc-category-group": "image of the category group #{#}",

        "alt-selected-image": "choosed image of the category #{#}",
        "alt-shared-image": "Your creation named {_t_}",

        "history-selection-image-text-plural": "{#} images are selected",
        "history-selection-image-text-single": "{#} image is selected",

        "pop-up-need-less-cat-main-text": "You can only keep{?m} {#} for ({_m_}), click the ones you would like to continue use.",
        "pop-up-need-more-cat-main-text": "You must have{?m} {#} for ({_m_}).",

        "text-workshop": "Workshop name: {_n_}",

        "label-noise":"Noise",
        "label-categories":"Categories",
        "label-truncation":"Truncation",
        "label-closeness":"Closeness",
        "label-speed":"Speed",
        "label-duration":"Duration",
        "label-num-iter":"Number of iteration",
        "label-isGif":"Is a Gif",
        "label-loop":"Loop",

        "error-doesnt-have-param-x": "It doesn't have the param {x}.",
        "error-some-data-miss": "Some meta data are missed.",
        "error-json-file": "The json file is not found."
    };
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
        var lang = window.location.href.includes("visual");

        if (lang){
            lang = "EN";
        } else {
            lang = "FR";
        }

        localStorage.setItem(cookieName, lang);

        // Update ui
        requestTranslate(lang, true);
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
         $("#chooseLang").on("change",reactSelectLang);
    }

    /**
    * Initialise the select language
    * @param event      the event that start the function
    */
    function reactSelectLang(event){
        // Get lang
        let lang = $(this).val();

        lang = isValidLang(lang) ? lang : "FR";

        // Save languages
        localStorage.setItem(cookieName, lang);

        // Translate
        requestTranslate(lang, false);
        requestTranslateSnippet(lang);
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
    * @param isFirstCall    Indicate if this is the first call of the method.
    */
    function requestTranslate(lang, isFirstCall, isPrototype3){
        // Set the url path for the json file
        var url = "../frontend/json/" + lang + ".json";

        // Send request
        if(isValidLang(lang)){
            sendAjaxRequest(url, function(data){
                // Save the dynamic val
                let oldDynamicText = getDynamicText();
                setDynamicText(data.dynamicText);

                // Translate static data
                translateStaticContent(data);

                // Translate the dynamic content
                if(!isFirstCall){
                    translateDynamicContent(oldDynamicText)
                }
            }, function(){
                failJsonLoad();
            });
        }
    }

    /**
    * Request the snippet json file and use his data.
    * @param lang           string of the language to validate
    */
    function requestTranslateSnippet(lang){
        if(isValidLang(lang)){
            // Set the url path for the json file
            var url;
            url = "../json/snippet-"+lang+".json";

            // Send request
            sendAjaxRequest(url, changeSnippetText, failJsonLoad)
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

        // Change all of the static val
        let staticVal = data.staticVal;
        for (let classes in staticVal){
            $("."+classes).val(staticVal[classes]);
        }

        // Change all of the static alt
        let staticAlt = data.staticAlt;
        for (let classes in staticAlt){
            $("."+classes).attr("alt",staticAlt[classes]);
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
                while(text.indexOf("\n") > -1){
                    text = text.replace("\n", "</li><li>")
                }

                // End the content with a close li tag
                text += "</li>";
            } else{
                // remplace all \n for a br tag
                while(text.indexOf("\n") > -1){
                    text = text.replace("\n", "<br><br>")
                }
            }

            // Replace the content
            $("."+classes).html(text);
        }
    }

    /**
    * Translate all of the dynamic element
    *@param oldDynamicText  the previous dynamicText data.
    */
    function translateDynamicContent(oldDynamicText){

        // translate the dynamic content ... (T_T)
        var selector;

        // translate template dynamic text and basic dynamic text
        for (let classes in translator.dynamicText){
            selector = $("."+classes);
            if(classes !== "sub-Template"){
                 translateDynamicContentTemplate(oldDynamicText, classes, selector);
            }
        }

        // translate the sub template
        if($(".main-sub-template").length > 0){
            for (let classes in translator.dynamicText["sub-Template"]){
                selector = $(".main-sub-template."+classes);
                translateDynamicContentTemplate(oldDynamicText, classes, selector);
            }
        }
    }

    /**
    * Translate all of the dynamic element
    *@param data            the data of the select language json file
    *@param oldDynamicText  the previous dynamicText data.
    *@param classes         the actual class to translate
    *@param selector        the html component that use this class
    */
    function translateDynamicContentTemplate(oldDynamicText, classes, selector){
        var newSelector;
        var newText;
        var oldContent;

        for(var i = 0; i < selector.length; i++){
            newSelector = $("."+classes+":eq("+i+")");

            // Translate the text
            if(newSelector.hasClass("dynamicText-text")){
                oldContent = newSelector.text();
                newText = translateDynamicTemplate(newSelector, classes, oldContent, oldDynamicText);
                newSelector.text(newText);
            }

            // Translate the alt
            if(newSelector.hasClass("dynamicText-alt")){
                oldContent = newSelector.attr("alt");
                newText = translateDynamicTemplate(newSelector, classes, oldContent, oldDynamicText);
                newSelector.attr("alt",newText);
            }

            // Translate the title
            if(newSelector.hasClass("dynamicText-title")){
                oldContent = newSelector.attr("title");
                newText = translateDynamicTemplate(newSelector, classes, oldContent, oldDynamicText);
                newSelector.attr("title",newText);
            }
        }
    }

    /**
    * Search the variable in the old template and add them to the new template
    * !Doesn't translate the sub-dynamic text... For example the old template is "Hello {x}" and the old content is "Hello, my friend".
    *                       If the new template is "Allo, {x}", the result is "Allo, my friend"
    *@param newSelector     The container of the content
    *@param classes         The classes of the dynamicText. It's use for target the new and the old template.
    *@param oldContent      The old text.
    *@param oldDynamicText  The previous state of the dynamicText.
    *@return the new text generate by the new template and the old variable.
    */
    function translateDynamicTemplate(newSelector, classes, oldContent, oldDynamicText){
        // The return text
        var newText;

        // Keep the previous language
        var oldSymbol = [];
        var oldTemplate = oldDynamicText[classes].split("{");
        var varValue = [];
        var subOldTemplate;

        // The loop variable
        var templateFind = false;

        // Temporary variable for process the data
        var tempVal;
        var tempContent;
        var _checkedVal;

        // Remove the static text before the variable
        oldContent = oldContent.replace(oldTemplate[0], "");

        // Get all variable
        for(var x = 1; x < oldTemplate.length; x++){
            subOldTemplate = oldTemplate[x].split("}");
            oldSymbol.push("{" + subOldTemplate[0] + "}");

            // Remove the static text after the variable
            // Replace the variable of the new template by their old value
             // Check if the old value must be translate
            if(newSelector.hasClass("sub-Template")){
                for (let c in translator.dynamicText["sub-Template"]){

                    // Translate the old value
                    var _checkedVal = oldDynamicText["sub-Template"][c];
                    tempContent = oldContent;

                    // Check if the template is used
                    if(oldContent.indexOf(_checkedVal) === 0){
                        tempContent = oldContent.replace(_checkedVal, "");

                        // Valid the used template
                        if( subOldTemplate[1] !== "" && oldContent.indexOf(subOldTemplate[1]) === 0){

                            // Process the string
                            oldContent = oldContent.replace(_checkedVal, "");
                            oldContent = oldContent.replace(subOldTemplate[1], "");

                            // Set the value
                            tempVal = translator.dynamicText["sub-Template"][c];
                            varValue.push(tempVal);
                            templateFind = true;

                            break;
                        }

                    }

                }

                // If no template find
                if(!templateFind){
                    oldContent = genericTranslateDynamicTemplate(oldContent, subOldTemplate, varValue);
                }

            }  else{
                oldContent = genericTranslateDynamicTemplate(oldContent, subOldTemplate, varValue);
            }

            // Continue the loop
            templateFind = false;
        }

        // Get the new template
        newText = translator.dynamicText[classes];

        // Replace the variable of the new template by their old value
        for(var z = 0; z < oldSymbol.length; z++){

            // Check if the old value must be translate

            newText = newText.replace(oldSymbol[z], varValue[z]);
        }

        return newText;
    }

    /**
    * Manage a sub part of the dynamic text to translate
    * @param oldContent         The old text.
    * @param subOldTemplate     The part of the old template to process.
    * @param varValue           The list of the translate variable.
    * @return the oldContent without the process part.
    */
    function genericTranslateDynamicTemplate(oldContent, subOldTemplate, varValue){
        // Initialise the variable
        var indexNextPart = oldContent.indexOf(subOldTemplate[1]);
        var tempVal;

        // Get the tempVal
        if(indexNextPart > 0){
            tempVal = oldContent.slice(0, indexNextPart);
        } else{
            tempVal = oldContent;
        }

        // Add the temp value
        varValue.push(tempVal);

        // Remove the process data
        oldContent.replace(tempVal, "");
        if(subOldTemplate[1] !== ""){
            oldContent = oldContent.replace(subOldTemplate[1], "");
        }

        return oldContent;
    }

    /**
    * Change all methode description (snippet)
    *@param data    the data of the select language json file
    */
    function changeSnippetText(data){
        // Change all of snippet text
        var textContent;
        for (let classes in data){

            // Get the text content of the methode
            textContent = "";

            // Each element of the array is one line of content
            for (let text in data[classes]){
                textContent += text + "\n";
            }

            // Set the content of the snippet
            $(".snippet."+classes + " pre").html('<code class="lang-python">'+textContent+'</code>');
        }
    }

    /**
    * Get the dynamic text content
    */
    function getDynamicText(){
        return translator.dynamicText;
    }

    /**
    * Change the dynamic text content
    * @param newValue   The translated dynamic content
    */
    function setDynamicText(newValue){
        translator.dynamicText = newValue;
    }
}