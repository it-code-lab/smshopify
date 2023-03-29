/*jshint strict:false, node:false */
/*exported run_tests, read_settings_from_cookie, beautify, submitIssue, copyText, selectAll, clearAll, changeToFileContent*/
/*
https://javascript-minifier.com/ 
*/
var the = {
    use_codemirror: !window.location.href.match(/without-codemirror/),
    beautifier_file: window.location.href.match(/debug/) ? 'beautifier' : './beautifier.min',
    beautifier: null,
    beautify_in_progress: false,
    editor: null, // codemirror editor

    codetext: null, // SM:Added
    commentedCodePosArr: null, // SM:Added
    codeLanguage: null, // SM:Added
    codeLanguageRowId: null, // SM:Added
    languageListPopulated: null, // SM:Added
    selectedCodeId: null, // SM:Added
    languageOverridden: null, //SM:Added
    newProjectContent: [], //SM:Added
    uploadedFiles: null, //SM:Added
    idOfProjectToUpdate: null, //SM:Added
    captcha: null, //SM:Added
    LanguageHelpCodeAndIds_LclJson: null, //SM:Added
    filelvlhelp: null,
    smusr: false,
    hosturl: '/smshopify',
    newImageName: '',


};

var itemImageIndex = 1;
var last_focused_div_id;

const ui = {
    userConfirmation: async (message) => createConfirm(message)
}

const createConfirm = (message) => {
    return new Promise((complete, failed) => {
        $('#confirmMessage').text(message)

        $('#confirmYes').off('click');
        $('#confirmNo').off('click');

        $('#confirmYes').on('click', () => { $('.confirmBG').hide(); complete(true); });
        $('#confirmNo').on('click', () => { $('.confirmBG').hide(); complete(false); });

        $('.confirmBG').show();
    });
}

var nextShopTabBtnDiv = "<div class='nextShopTabBtnDiv'> <button class='button_type2 width_100px' onclick='gotoNextTab(this)'>Next</button></div>"
var allowTogglePreview = "<button class='togglePreviewBtn' onclick='toggleSecPreview(this)'> Toggle Preview </button>";
var showBannerOptionsBtn = "<button onclick='showBannerOptions(this)'> Design Options </button>";
var showColorAndImageOptionsBtn = "<button onclick='showColorAndImage(this)'> Customizations </button>";

var shopOpeningHr = '<section class="storeOpeninghours"><div class="storeOpeninghourscontent section" contenteditable="true">   <div class="header">    <h2>Opening hours</h2>   </div>    <table class="opening-hours-table">  <tr id="MondayStoreHrId"> <td>Monday</td><td>09:00 AM</td> <td>-</td><td>08:00 PM</td>   </tr>  <tr id="TuesdayStoreHrId"> <td>Tuesday</td><td>09:00 AM</td> <td>-</td><td>08:00 PM</td>   </tr>  <tr id="WednesdayStoreHrId"> <td>Wednesday</td><td>09:00 AM</td> <td>-</td><td>08:00 PM</td>   </tr>  <tr id="ThursdayStoreHrId"> <td>Thursday</td><td>09:00 AM</td> <td>-</td><td>08:00 PM</td>   </tr>  <tr id="FridayStoreHrId"> <td>Friday</td><td>09:00 AM</td> <td>-</td><td>08:00 PM</td>   </tr>  <tr id="SaturdayStoreHrId"> <td>Saturday</td><td>09:00 AM</td> <td>-</td><td>08:00 PM</td>   </tr>  <tr id="SundayStoreHrId"> <td>Sunday</td><td>10:00 AM</td> <td>-</td><td>05:00 PM</td>   </tr>   </table></div></section>';

var shopOpeningHrCheckBox = "<label class='informationBox'>To display the store hours, select the options below. You can update the daily hours</label>"
    + '<div class="checkbox-wrapper-21">'
    + '<label class="control control--checkbox">'
    + 'Display Daily Hours'
    + '<input class="showStoreHr" type="checkbox" onclick="showStoreHrsDiv(this);"/>'
    + '<div class="control__indicator"></div>'
    + '</label>'
    + '</div>'
    + '<div class="storeHrDivCls displayNone">' + shopOpeningHr + '</div>'

    + '<div class="checkbox-wrapper-21">'
    + '<label class="control control--checkbox">'
    + 'Display Availability Information'
    + '<input class="showStoreAvail" type="checkbox" onclick="showStoreAvailDiv(this);"/>'
    + '<div class="control__indicator"></div>'
    + '</label>'
    + '</div>'
    + '<div id="availabilityDivId" contenteditable="true" data-text="Enter Availability Details Here" class="storeAvail displayNone"></div>';

var shopLocationCheckBox = "<label class='informationBox'>Provide your location information so that the interested shoppers can contact you.</label>"
    + '<div class="checkbox-wrapper-21">'
    + '<label class="control control--checkbox">'
    + 'Display Location on Map'
    + '<input class="showStoreLoc" type="checkbox" onclick="showStoreLocationDiv(this);"/>'
    + '<div class="control__indicator"></div>'
    + '</label>'
    + '</div>'
    + '<div id="storeMapDivId" class="storeOnMap displayNone"></div>'

    + '<div class="checkbox-wrapper-21">'
    + '<label class="control control--checkbox">'
    + 'Display Location From Address'
    + '<input class="showStoreAddr" type="checkbox" onclick="showStoreAddrDiv(this);"/>'
    + '<div class="control__indicator"></div>'
    + '</label>'
    + '</div>'
    + '<div id="storeAddrDivId" class="storeAddr displayNone">'
    + '<div class="addresscontainer" id="addresscontainerDiv"> <div class="addressform"> <label class="addressfield"> <span class="addressfield__label" for="shopaddressline1">Address</span>'
    + '<div contenteditable="true" class="addressfield__input"  id="shopaddressline1"> </div> </label>  <label class="addressfield"><span class="addressfield__label" for="shopcity">City/Town/Village</span> '
    + '<div contenteditable="true" class="addressfield__input"  id="shopcity"> </div> </label>  <label class="addressfield"><span class="addressfield__label" for="shopstate">State</span> '
    + '<div contenteditable="true" class="addressfield__input"  id="shopstate"> </div> </label>  <label class="addressfield"><span class="addressfield__label" for="shopcountry">Country</span> '
    + '<div contenteditable="true" class="addressfield__input"  id="shopcountry"> </div> </label>  <label class="addressfield"> <span class="addressfield__label" for="shoppostalcode">Postal code</span>'
    + '<div contenteditable="true" class="addressfield__input"  id="shoppostalcode"> </div> </label> </div>  </div>'
    + '</div>';


var shopItemTabOptions = '<div class="shopTab">'
    + '<button class="shopTablinks" onclick="openShopTab(event, ' + "'" + 'addImages' + "'" + ')">Add Images</button>'
    + '<button class="shopTablinks" onclick="openShopTab(event, ' + "'" + 'itmNameDiv' + "'" + ')">Name</button>'
    + '<button class="shopTablinks" onclick="openShopTab(event, ' + "'" + 'itmDescDiv' + "'" + ')">Description</button>'
    + '<button class="shopTablinks" onclick="openShopTab(event, ' + "'" + 'itemPrice' + "'" + ')">Price</button>'
    + '<button class="shopTablinks" onclick="openShopTab(event, ' + "'" + 'CloseItemCust' + "'" + ')">Close</button>'
    + '<button class="shopTablinks red_font" style="float:right" onclick="openShopTab(event, ' + "'" + 'deleteItem' + "'" + ')">Delete</button>'
    + '</div>';


var itemImagesDiv = '<div class="itemImageshow-container">'

    + '<div class="itmImgContainer">'

    + '<img class="myitemImages" style="display:block" src="https://www.w3schools.com/howto/img_nature_wide.jpg" >'
    + '<img class="myitemImages" style="display:none" src="https://www.w3schools.com/howto/img_snow_wide.jpg" >'
    + '<img class="myitemImages" style="display:none" src="https://www.w3schools.com/howto/img_mountains_wide.jpg" >'

    + '</div>'

    + '<a class="prevItmImg" onclick="plusitemImages(-1, this)">❮</a>'
    + '<a class="nextItmImg" onclick="plusitemImages(1, this)">❯</a>'
    + '</div>';

var addItmImagesDiv = ""
    + "<div class='existingItmImages'> </div>"
    + "<input type='text' style='display:none; width:95%; margin:auto;'  value=''>"
    + "<br><img id='replace-img-banner' src= '" + the.hosturl + "/img/" + "' style='width: 400px; height: 200px; background-color: white;' onerror='this.style.display= " + '"none"' + "' alt='select image'  />"
    + "<div style='width: 100%'><br><label class='button_type2 width_150px margintop_10px'><input type='file' class='image-replace-banner displayNone' data-itemid='banner' data-fileelementid='image-replace-' data-uploadimgbtnid='replaceBannerImg' data-imageelementid='replace-img-' accept='image/png,  image/jpeg' onchange='addImageToItemList(event)'><i class='fa fa-cloud-upload'></i>Upload Image</label>"
    + "<br><label  style='color: #cc0000; font-size: 14px; min-height: 20px;'></label>"
    + "<input id='replaceBannerImg' class='saveItmImgChangesBtn button_type2 width_150px' type='button' value='Save' data-itemid='banner'  data-saveasnameelementid='image-' data-fileelementid='image-replace-'  onclick='saveItemImgChanges(event);'  > </div>";


var itemCustomizations = ''

var shopItemTabContentDivs = '<div id="addImages" class="shopTabcontent">'
    + addItmImagesDiv
    + nextShopTabBtnDiv
    + '</div>'

    + '<div id="itmNameDiv" class="shopTabcontent">'
    + '<div class="itemNameCls" contenteditable="true" data-text="Enter Item Name Here"></div>'
    + nextShopTabBtnDiv
    + '</div>'

    + '<div id="itmDescDiv" class="shopTabcontent">'
    + "<label class='informationBox'>Enter the details of the item/service</label>"
    + '<div class="itemDescriptionCls" contenteditable="true" data-text="Enter Item Description Here"></div>'
    + nextShopTabBtnDiv
    + '</div>'

    + '<div id="itemPrice" class="shopTabcontent">'
    + '<div class="itemPriceCls" contenteditable="true" data-text="Enter Item Price"></div>'
    + nextShopTabBtnDiv
    + '</div>'

    + '<div id="CloseItemCust" class="shopTabcontent">'
    + '</div>'

    + '<div id="deleteItem" class="shopTabcontent">'
    + '</div>';

var colorList = ["#00ffff", "#34568B", "#FF6F61", "#6B5B95", "#88B04B", "#F7CAC9", "#92A8D1", "#955251", "#B565A7", "#009B77", "#D65076", "#45B8AC", "#EFC050", "#5B5EA6", "#DFCFBE", "#55B4B0", "#98B4D4", "#C3447A", "#bb00bb", "#ff0000", "#888888", "#417203", "#934f4d", "#7E909A", "#A5D8DD", "#EA6A47", "#0091D5", "#B3C100", "#4CB5F5", "#6Ab187", "#DBAE58", "#488A99", "#934f4d"];

var revealSecColor = getSecColors();

function getSecColors() {
    var retHTML = "<label class='informationBox'>If you want to change the color in the banner above, click on the color below</label> ";
    colorList.forEach((colorStr) => retHTML = retHTML + "<div class='colorPickerDiv hover_shadow2' data-clr='" + colorStr + "' style='background-color:" + colorStr + "' onclick='updateParentBGColor(this)' ></div>");
    return retHTML;
}
var textDivColorCtl = getTextColors();

function getTextColors() {
    var retHTML = "<label class='informationBox'>If you want to change the color in the Banner above, click on the color below</label> ";
    colorList.forEach((colorStr) => retHTML = retHTML + "<div class='colorPickerDiv hover_shadow2' data-clr='" + colorStr + "' style='background-color:" + colorStr + "' onclick='updateTextDivColor(this)' ></div>");
    return retHTML;
}

// textDivColorCtl = "<label class='informationBox'>If you want to change the color in the banner above, pick from the below list</label>"
//     + "<select class='colorSelect' onchange='updateTextDivColor(this)'>"
//     + "<option value='#00ffff' style='background-color: #00ffff' >#00ffff</option>"

//     + "<option value='#34568B' style='background-color: #34568B' >#34568B</option>"
//     + "<option value='#FF6F61' style='background-color: #FF6F61' >#FF6F61</option>"
//     + "<option value='#6B5B95' style='background-color: #6B5B95' >#6B5B95</option>"
//     + "<option value='#88B04B' style='background-color: #88B04B' >#88B04B</option>"
//     + "<option value='#F7CAC9' style='background-color: #F7CAC9' >#F7CAC9</option>"
//     + "<option value='#92A8D1' style='background-color: #92A8D1' >#92A8D1</option>"
//     + "<option value='#955251' style='background-color: #955251' >#955251</option>"

//     + "<option value='#B565A7' style='background-color: #B565A7' >#B565A7</option>"
//     + "<option value='#009B77' style='background-color: #009B77' >#009B77</option>"
//     + "<option value='#D65076' style='background-color: #D65076' >#D65076</option>"
//     + "<option value='#45B8AC' style='background-color: #45B8AC' >#45B8AC</option>"
//     + "<option value='#EFC050' style='background-color: #EFC050' >#EFC050</option>"

//     + "<option value='#5B5EA6' style='background-color: #5B5EA6' >#5B5EA6</option>"
//     + "<option value='#DFCFBE' style='background-color: #DFCFBE' >#DFCFBE</option>"
//     + "<option value='#55B4B0' style='background-color: #55B4B0' >#55B4B0</option>"
//     + "<option value='#98B4D4' style='background-color: #98B4D4' >#98B4D4</option>"
//     + "<option value='#C3447A' style='background-color: #C3447A' >#C3447A</option>"

//     + "<option value='#bb00bb' style='background-color: #bb00bb'>#bb00bb</option>"
//     + "<option value='#ff0000' style='background-color: #ff0000'>#ff0000</option>"
//     + "<option value='#888888' style='background-color: #888888'>#888888</option>"
//     + "<option value='#417203' style='background-color: #417203'>#417203</option>"
//     + "<option value='#934f4d' style='background-color: #934f4d'>#934f4d</option>"
//     + "<option value='#7E909A' style='background-color: #7E909A'>#7E909A</option>"
//     + "<option value='#A5D8DD' style='background-color: #934f4d'>#A5D8DD</option>"
//     + "<option value='#EA6A47' style='background-color: #EA6A47'>#EA6A47</option>"
//     + "<option value='#0091D5' style='background-color: #0091D5'>#0091D5</option>"
//     + "<option value='#B3C100' style='background-color: #B3C100'>#B3C100</option>"

//     + "<option value='#4CB5F5' style='background-color: #4CB5F5'>#4CB5F5</option>"
//     + "<option value='#6Ab187' style='background-color: #6Ab187'>#6Ab187</option>"
//     + "<option value='#DBAE58' style='background-color: #DBAE58'>#DBAE58</option>"
//     + "<option value='#488A99' style='background-color: #488A99'>#488A99</option>"
//     + "<option value='#934f4d' style='background-color: #934f4d'>#934f4d</option>"

//     + "<option value='salmon' style='background-color: salmon'>salmon</option> </select>";

var secTranition = "<select class='transitionSelect' onchange='updateParentTransition(this)' >"
    + "<option value='Zoom'>Zoom</option>"
    + "<option value='convex'>convex</option>"
    + "<option value='concave'>concave</option>"
    + "<option value='fade'>fade</option>"
    + "<option value='slide'>slide</option>"

    + "<option value='slide-in fade-out'>slide-in fade-out</option>"
    + "<option value='fade-in slide-out'>fade-in slide-out</option>"

    + "<option value='zoom-in fade-out'>zoom-in fade-out</option>"

    + "<option value='convex-in concave-out'>convex-in concave-out</option>"
    + "<option value='convex-in fade-out'>convex-in fade-out</option>"
    + "<option value='none'>none</option>"
    + "</select>";

var replaceBannerImg = "<label class='informationBox'>If you want to change the image in the banner above, use the button below to replace image</label>"
    + "<input type='text'  style='display:none; width:95%; margin:auto;'  value=''>"
    + "<br><img id='replace-img-banner' src= '" + the.hosturl + "/img/" + "' style='width: 400px; height: 200px; background-color: white;' onerror='this.style.display= " + '"none"' + "' alt='select image'  />"
    + "<br><label class='button_type2 width_200px margintop_10px'><input type='file' class='image-replace-banner displayNone' data-itemid='banner' data-uploadimgbtnid='replaceBannerImg' data-imageelementid='replace-img-' accept='image/png,  image/jpeg' onchange='showImage(event)'><i class='fa fa-cloud-upload'></i>Upload Image</label>"
    + "<br><label  style='color: #cc0000; font-size: 14px; min-height: 20px;'></label>"
    + "<input id='replaceBannerImg' class='displayNone button_type2 width_200px' type='button' value='Replace Banner Image' data-itemid='banner'  data-saveasnameelementid='image-' data-fileelementid='image-replace-'  onclick='UploadAndReplaceBannerImg(event);'  >";


var mediaSection = "";
//+ "BGImageURL: <input type='text' name='txt' value='' onchange='updateParentBGImage(this)'>" 
//+ "<div class='selectedImg'></div><div class='selectedVid'></div>" ;

var addItemImg = "Add Images: <input type='text' name='txt' value='' onchange='updateParentBGImage(this)'>"
    + "<div class='selectedImg'></div>";


function any(a, b) {
    return a || b;
}

function setLastFocusedDivId(id) {
    last_focused_div_id = id;
    //console.log(id);
}

function hideMe(elem) {
    //elem.style.display = "none";    
}
//https://stackoverflow.com/questions/6690752/insert-html-at-caret-in-a-contenteditable-div
function insertImageAtCaret(html) {
    if (html == "") {
        text = "<b>Dummy Text</b>";
    }

    var sel, range;
    if (window.getSelection) {
        // IE9 and non-IE
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            range = sel.getRangeAt(0);
            range.deleteContents();

            // Range.createContextualFragment() would be useful here but is
            // only relatively recently standardized and is not supported in
            // some browsers (IE9, for one)
            var el = document.createElement("div");
            el.innerHTML = html;
            var frag = document.createDocumentFragment(), node, lastNode;
            while ((node = el.firstChild)) {
                lastNode = frag.appendChild(node);
            }
            range.insertNode(frag);

            // Preserve the selection
            if (lastNode) {
                range = range.cloneRange();
                range.setStartAfter(lastNode);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
            }
        }
    } else if (document.selection && document.selection.type != "Control") {
        // IE < 9
        document.selection.createRange().pasteHTML(html);
    }
}

function set_editor_mode() {
    //logCommon("set_editor_mode called");

    if (the.editor) {
        var language = $('#language').val();
        var mode = 'javascript';
        if (language === 'js') {
            mode = 'javascript';
        } else if (language === 'html') {
            mode = 'htmlmixed';
        } else if (language === 'css') {
            mode = 'css';
        }
        //mode = "COBOL"
        the.editor.setOption("mode", mode);
    }
}

function run_tests() {
    logCommon("run_tests called");

    $.when($.getScript("js/test/sanitytest.js"),
        $.getScript("js/test/generated/beautify-javascript-tests.js"),
        $.getScript("js/test/generated/beautify-css-tests.js"),
        $.getScript("js/test/generated/beautify-html-tests.js"))
        .done(function () {
            var st = new SanityTest();
            run_javascript_tests(st, Urlencoded, the.beautifier.js, the.beautifier.html, the.beautifier.css);
            run_css_tests(st, Urlencoded, the.beautifier.js, the.beautifier.html, the.beautifier.css);
            run_html_tests(st, Urlencoded, the.beautifier.js, the.beautifier.html, the.beautifier.css);
            JavascriptObfuscator.run_tests(st);
            P_A_C_K_E_R.run_tests(st);
            Urlencoded.run_tests(st);
            MyObfuscate.run_tests(st);
            var results = st.results_raw()
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/ /g, '&nbsp;')
                .replace(/\r/g, '·')
                .replace(/\n/g, '<br>');
            $('#testresults').html(results).show();
        });
}

function read_settings_from_cookie() {
    //logCommon("read_settings_from_cookie called");

    $('#tabsize').val(any(Cookies.get('tabsize'), '4'));
    $('#brace-style').val(any(Cookies.get('brace-style'), 'collapse'));
    $('#detect-packers').prop('checked', Cookies.get('detect-packers') !== 'off');
    $('#max-preserve-newlines').val(any(Cookies.get('max-preserve-newlines'), '5'));
    $('#keep-array-indentation').prop('checked', Cookies.get('keep-array-indentation') === 'on');
    $('#break-chained-methods').prop('checked', Cookies.get('break-chained-methods') === 'on');
    $('#indent-scripts').val(any(Cookies.get('indent-scripts'), 'normal'));
    $('#additional-options').val(any(Cookies.get('additional-options'), '{}'));
    $('#space-before-conditional').prop('checked', Cookies.get('space-before-conditional') !== 'off');
    $('#wrap-line-length').val(any(Cookies.get('wrap-line-length'), '0'));
    $('#unescape-strings').prop('checked', Cookies.get('unescape-strings') === 'on');
    $('#jslint-happy').prop('checked', Cookies.get('jslint-happy') === 'on');
    $('#end-with-newline').prop('checked', Cookies.get('end-with-newline') === 'on');
    $('#indent-inner-html').prop('checked', Cookies.get('indent-inner-html') === 'on');
    $('#comma-first').prop('checked', Cookies.get('comma-first') === 'on');
    $('#e4x').prop('checked', Cookies.get('e4x') === 'on');
    $('#language').val(any(Cookies.get('language'), 'js'));
    $('#indent-empty-lines').prop('checked', Cookies.get('indent-empty-lines') === 'on');
}

function store_settings_to_cookie() {

    //logCommon("store_settings_to_cookie called");

    var opts = {
        expires: 360
    };
    Cookies.set('tabsize', $('#tabsize').val(), opts);
    Cookies.set('brace-style', $('#brace-style').val(), opts);
    Cookies.set('detect-packers', $('#detect-packers').prop('checked') ? 'on' : 'off', opts);
    Cookies.set('max-preserve-newlines', $('#max-preserve-newlines').val(), opts);
    Cookies.set('keep-array-indentation', $('#keep-array-indentation').prop('checked') ? 'on' : 'off', opts);
    Cookies.set('break-chained-methods', $('#break-chained-methods').prop('checked') ? 'on' : 'off', opts);
    Cookies.set('space-before-conditional', $('#space-before-conditional').prop('checked') ? 'on' : 'off',
        opts);
    Cookies.set('unescape-strings', $('#unescape-strings').prop('checked') ? 'on' : 'off', opts);
    Cookies.set('jslint-happy', $('#jslint-happy').prop('checked') ? 'on' : 'off', opts);
    Cookies.set('end-with-newline', $('#end-with-newline').prop('checked') ? 'on' : 'off', opts);
    Cookies.set('wrap-line-length', $('#wrap-line-length').val(), opts);
    Cookies.set('indent-scripts', $('#indent-scripts').val(), opts);
    Cookies.set('additional-options', $('#additional-options').val(), opts);
    Cookies.set('indent-inner-html', $('#indent-inner-html').prop('checked') ? 'on' : 'off', opts);
    Cookies.set('comma-first', $('#comma-first').prop('checked') ? 'on' : 'off', opts);
    Cookies.set('e4x', $('#e4x').prop('checked') ? 'on' : 'off', opts);
    Cookies.set('language', $('#language').val(), opts);
    Cookies.set('indent-empty-lines', $('#indent-empty-lines').prop('checked') ? 'on' : 'off', opts);

}

function unpacker_filter(source) {
    logCommon("unpacker_filter called");
    var leading_comments = '',
        comment = '',
        unpacked = '',
        found = false;

    // cuts leading comments
    do {
        found = false;
        if (/^\s*\/\*/.test(source)) {
            found = true;
            comment = source.substr(0, source.indexOf('*/') + 2);
            source = source.substr(comment.length);
            leading_comments += comment;
        } else if (/^\s*\/\//.test(source)) {
            found = true;
            comment = source.match(/^\s*\/\/.*/)[0];
            source = source.substr(comment.length);
            leading_comments += comment;
        }
    } while (found);
    leading_comments += '\n';
    source = source.replace(/^\s+/, '');

    var unpackers = [P_A_C_K_E_R, Urlencoded, JavascriptObfuscator /*, MyObfuscate*/];
    for (var i = 0; i < unpackers.length; i++) {
        if (unpackers[i].detect(source)) {
            unpacked = unpackers[i].unpack(source);
            if (unpacked !== source) {
                source = unpacker_filter(unpacked);
            }
        }
    }

    return leading_comments + source;
}


function beautify() {
    //logCommon("beautify called");

    if (the.beautify_in_progress) {
        return;
    }

    store_settings_to_cookie();

    the.beautify_in_progress = true;

    var source = the.editor ? the.editor.getValue() : $('#source').val(),
        output,
        opts = {};
    the.lastInput = source;

    var additional_options = $('#additional-options').val();

    var language = $('#language').val();
    the.language = $('#language option:selected').text();

    opts.indent_size = $('#tabsize').val();
    opts.indent_char = parseInt(opts.indent_size, 10) === 1 ? '\t' : ' ';
    opts.max_preserve_newlines = $('#max-preserve-newlines').val();
    opts.preserve_newlines = opts.max_preserve_newlines !== "-1";
    opts.keep_array_indentation = $('#keep-array-indentation').prop('checked');
    opts.break_chained_methods = $('#break-chained-methods').prop('checked');
    opts.indent_scripts = $('#indent-scripts').val();
    //opts.brace_style = $('#brace-style').val() + ($('#brace-preserve-inline').prop('checked') ? ",preserve-inline" : "");

    opts.brace_style = "collapse";

    opts.space_before_conditional = $('#space-before-conditional').prop('checked');
    opts.unescape_strings = $('#unescape-strings').prop('checked');
    opts.jslint_happy = $('#jslint-happy').prop('checked');
    opts.end_with_newline = $('#end-with-newline').prop('checked');
    opts.wrap_line_length = $('#wrap-line-length').val();
    opts.indent_inner_html = $('#indent-inner-html').prop('checked');
    opts.comma_first = $('#comma-first').prop('checked');
    opts.e4x = $('#e4x').prop('checked');
    opts.indent_empty_lines = $('#indent-empty-lines').prop('checked');



    $('#additional-options-error').hide();
    $('#open-issue').hide();

    if (additional_options && additional_options !== '{}') {
        try {
            additional_options = JSON.parse(additional_options);
            opts = mergeObjects(opts, additional_options);
        } catch (e) {
            $('#additional-options-error').show();
        }
    }

    var selectedOptions = JSON.stringify(opts, null, 2);
    $('#options-selected').val(selectedOptions);

    if (language === 'html') {
        output = the.beautifier.html(source, opts);
    } else if (language === 'css') {
        output = the.beautifier.css(source, opts);
    } else {
        if ($('#detect-packers').prop('checked')) {
            source = unpacker_filter(source);
        }
        output = the.beautifier.js(source, opts);
    }

    if (the.editor) {
        //logCommon("setting editor value to " + output);

        the.editor.setValue(output);
    } else {
        logCommon("setting source value to " + output);
        $('#source').val(output);
    }

    the.lastOutput = output;
    the.lastOpts = selectedOptions;

    $('#open-issue').show();
    set_editor_mode();

    the.beautify_in_progress = false;
}

function mergeObjects(allOptions, additionalOptions) {
    logCommon("mergeObjects called");
    var finalOpts = {};
    var name;

    for (name in allOptions) {
        finalOpts[name] = allOptions[name];
    }
    for (name in additionalOptions) {
        finalOpts[name] = additionalOptions[name];
    }
    return finalOpts;
}

function submitIssue() {
    var url = 'https://github.com/beautify-web/js-beautify/issues/new?';

    var encoded = encodeURIComponent(getSubmitIssueBody()).replace(/%20/g, "+");
    if (encoded.length > 7168) {
        var confirmText = [
            'The sample text is too long for automatic template creation.',
            '',
            'Click OK to continue and create an issue starting with template defaults.',
            'Click CANCEL to return to the beautifier and try beautifying a shorter sample.'
        ];

        if (!confirm(confirmText.join('\n'))) {
            $('#open-issue').hide();
            return;
        }
        encoded = encodeURIComponent(getSubmitIssueBody(true)).replace(/%20/g, "+");
    }
    url += 'body=' + encoded;

    logCommon(url);
    logCommon(url.length);

    window.open(url, '_blank').focus();
}

function getSubmitIssueBody(trucate) {
    var input = the.lastInput;
    var output = the.lastOutput;

    if (trucate) {
        input = '/* Your input text */';
        output = '/* Output text currently returned by the beautifier */';
    }

    var submit_body = [
        '# Description',
        '<!-- Describe your scenario here -->',
        '',
        '## Input',
        'The code looked like this before beautification:',
        '```',
        input,
        '```',
        '',
        '## Current Output',
        'The  code actually looked like this after beautification:',
        '```',
        output,
        '```',
        '',
        '## Expected Output',
        'The code should have looked like this after beautification:',
        '```',
        '/* Your desired output text */',
        '```',
        '',
        '# Environment',
        '',
        '## Browser User Agent:',
        navigator.userAgent,
        '',
        'Language Selected:',
        the.language,
        '',
        '## Settings',
        '```json',
        the.lastOpts,
        '```',
        ''
    ];
    return submit_body.join('\n');
}

function copyText() {
    if (the.editor) {
        the.editor.execCommand('selectAll');
        var currentText = the.editor.getValue();
        var copyArea = $('<textarea />')
            .text(currentText)
            .attr('readonly', '')
            .css({
                'position': 'absolute',
                'left': '-9999px'
            });

        $('body').append(copyArea);
        copyArea.select();
        document.execCommand('copy');
        copyArea.remove();
    } else {
        $('#source').select();
        document.execCommand('copy');
    }
}

function selectAll() {
    if (the.editor) {
        the.editor.execCommand('selectAll');
    } else {
        $('#source').select();
    }
}

function clearAll() {
    if (the.editor) {
        the.editor.setValue('');
    } else {
        $('#source').val('');
    }
}

function getLanguageForFileExtension(fileExtension) {
    //var newLanguage = "";


    var tf = JSON.parse(sessionStorage.getItem("LanguageForFileExtension"));

    var filteredRows = JSON.parse(tf).filter(function (entry) {
        var evalStr = entry.fileextension;
        return evalStr.toUpperCase() === fileExtension.toUpperCase();
    });


    if (filteredRows.length > 0) {
        the.filelvlhelp = filteredRows[0].filelvlhelp;
        return filteredRows[0].language;
    } else {
        return "";
    }

}

async function changeToFileContent(input) {

    logCommon("changeToFileContent called");
    var file = input.files[0];


    if (file) {
        var fileName = file.name;
        var arr = fileName.split(".");
        var fileExtension = arr[1];
        var newLanguage = getLanguageForFileExtension(fileExtension);

        document.getElementById("displayFileLoaderDivId").style.display = "block";


        var reader = new FileReader();



        reader.onload = function (event) {
            if (the.editor) {
                the.editor.setValue(event.target.result);
                the.codetext = the.editor.getValue();
            } else {
                $('#source').val(event.target.result);
                the.codetext = event.target.result;
            }
            document.getElementById("selectfile").innerHTML = "<i class='fas fa-folder-open' style='font-size:20px;color:purple'></i>&nbsp" + fileName;

            if (newLanguage != "") {
                the.codeLanguage = newLanguage;
                the.languageOverridden = true;


                document.getElementById("language-box").value = newLanguage;

                markHelpCodes();

                languageDeterminedThruExt("Code Language is " + newLanguage + " based on file extension" + ". If it looks incorrect, please override the language.");

                //document.querySelector('#scanEditbtnId').innerText = 'Edit';
                document.querySelector('#scanEditbtnId').innerHTML = '<i class="smalltip fa fa-edit" style="font-size:16px; color:blue"><span>Edit</span></i>';

                var gf = JSON.parse(sessionStorage.getItem("SpecialFiles"));

                var filteredRows = JSON.parse(gf).filter(function (entry) {
                    var evalStr = entry.filename;
                    return evalStr.toUpperCase() === fileName.toUpperCase();
                });


                if (filteredRows.length > 0) {
                    document.getElementById("filelvlhelpdivid").innerHTML = filteredRows[0].description;
                    document.getElementById("filelvlhelpdivid").style.display = "block";
                } else {
                    if (the.filelvlhelp != null) {
                        if (the.filelvlhelp != "") {
                            document.getElementById("filelvlhelpdivid").innerHTML = the.filelvlhelp;
                            document.getElementById("filelvlhelpdivid").style.display = "block";
                        }
                    }
                }



            } else {
                document.getElementById("sourceDiv").style.display = "block";
                document.getElementById("destinationDiv").style.display = "none";
                document.getElementById("source").value = the.codetext;
                //document.querySelector('#scanEditbtnId').innerText = 'Scan';
                document.querySelector('#scanEditbtnId').innerHTML = '<i class="smalltip fa fa-search" style="font-size:16px; color:blue"><span>Scan</span></i>';

                languageNotDeterminedMsg();

            }

        };
        reader.readAsText(file, "UTF-8");

        document.getElementById("displayFileLoaderDivId").style.display = "none";
        //document.querySelector('#scanEditbtnId').innerText = 'Scan';
        document.querySelector('#scanEditbtnId').innerHTML = '<i class="smalltip fa fa-search" style="font-size:16px; color:blue"><span>Scan</span></i>';
    }
}

function readFileAsync(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = res => {
            resolve(res.target.result);
        };
        reader.onerror = err => reject(err);

        reader.readAsText(file);
    });
}


//SM: Below are the added functions************************

function getCommentsCodesForLanguage(Language) {
    var tf = JSON.parse(sessionStorage.getItem("CodeCommentsConditions"));

    var filteredRows = JSON.parse(tf).filter(function (entry) {
        return entry.code_language === Language;
    });

    //logCommon(filteredRows);
    return filteredRows;

}

function getArrayOfCommentedCodeChars(codetext) {
    //SM:Note: try to call it only once for a CodeText
    //****This function returns the blocks that are comments for all possible language comments*********

    logCommon("Inside getArrayOfCommentedCodeChars");
    if (the.commentedCodePosArr != null) {
        return;
    }

    var tf = JSON.parse(sessionStorage.getItem("CommentsCombination"));
    var rows = JSON.parse(tf);

    var arr = [];

    for (var i = 0; i < rows.length; i++) {
        var r_comment_start = rows[i].comment_start;
        var r_comment_end = rows[i].comment_end;

        arr[i] = [];
        arr[i][0] = r_comment_start;
        arr[i][1] = r_comment_end;
        if (r_comment_end == null) {
            r_comment_end = '\n';
        }
        //console.log(r_comment_end)

        var commentedCodeArr = [];
        var searchStartPos = 0;
        var commentStart = 0;
        var commentEnd = 0;
        var seqNbr = 0;

        do {

            var commentStart = codetext.indexOf(r_comment_start, searchStartPos)
            if (commentStart < 0) {
                break;
            }
            commentedCodeArr[seqNbr] = [];

            commentedCodeArr[seqNbr][0] = commentStart;
            commentEnd = codetext.indexOf(r_comment_end, commentStart + 1);

            commentedCodeArr[seqNbr][1] = commentEnd;
            if (commentEnd < 0) {
                break;
            }

            searchStartPos = commentEnd + 1;
            seqNbr = seqNbr + 1;
        } while (commentStart > -1)

        arr[i][2] = commentedCodeArr;
    }


    the.commentedCodePosArr = arr;
}

function locations(substring, string) {
    var a = [],
        i = -1;
    while ((i = string.indexOf(substring, i + 1)) >= 0) a.push(i);
    return a;
}


function getCodeLanguages(codetext) {

    logCommon("Inside getCodeLanguages");

    var tf = JSON.parse(sessionStorage.getItem("IdentifyCodeLanguage"));
    var rows = JSON.parse(tf);

    getArrayOfCommentedCodeChars(codetext);

    if (rows != null) {
        if (rows != "") {
            //console.log(Object.keys(rows).length);

            loop1: // Loop through list of possible languages

            for (var i = 0; i < rows.length; i++) {

                var r_code_language = rows[i].code_language;

                var commentCodes = getCommentsCodesForLanguage(r_code_language)
                //console.log(commentCodes);

                var r_id_by_file_extension = rows[i].id_by_file_extension;
                var r_id_by_file_name = rows[i].id_by_file_name;
                var x = rows[i].id_by_file_content;
                //console.log("rows[i].id_by_file_content = " + x);

                if (x == null) {
                    continue;
                }

                var r_id_by_file_contents = x.split('^');

                loop2: // For each language there are multiple keywords/code  that can be used to identify the code language. Loop through each keywords/code.
                for (var j = 0; j < r_id_by_file_contents.length; j++) {
                    //console.log("Inside loop2");

                    if (r_id_by_file_contents[j] == "") {
                        continue;
                    }
                    var indices = locations(r_id_by_file_contents[j], codetext)

                    //console.log(indices);

                    if (indices.length == 0) {
                        continue;
                    }

                    loop3: //For each keyword position check if it is part of any comment type for the language
                    for (var m = 0; m < indices.length; m++) {

                        //console.log("Inside loop3");

                        var indiceIsPartOfComment = 0;


                        loop4: // For each keywords/code present in the script/code check if it is part of commented text
                        for (var k = 0; k < commentCodes.length; k++) {

                            //console.log("Inside loop4");

                            for (var l = 0; l < the.commentedCodePosArr.length; l++) {

                                if ((commentCodes[k].comment_start == the.commentedCodePosArr[l][0]) &&
                                    (commentCodes[k].comment_end == the.commentedCodePosArr[l][1])) {
                                    //console.log("match found")					


                                    if (the.commentedCodePosArr[l][2].length < 2) {
                                        continue;
                                    }


                                    for (var n = 0; n < the.commentedCodePosArr[l][2].length; n++) {

                                        if ((indices[m] >= the.commentedCodePosArr[l][2][n][0]) &&
                                            (indices[m] <= the.commentedCodePosArr[l][2][n][1])) {
                                            indiceIsPartOfComment = 1;
                                            //console.log(r_id_by_file_contents[j] + " is part of comment at index " + indices[m])
                                            break;
                                        }
                                    }

                                }


                            }
                        }

                        if (indiceIsPartOfComment == 0) {

                            /* ***TEMPORARY**SM-T002***Refer User Guide********_Reenabled for logged in users
                            */

                            if ((localStorage.getItem("userLoggedIn") == "y") && (localStorage.getItem("userLvl") == "9")) {
                                var msg = "Code Language is " + r_code_language + " based on '" + r_id_by_file_contents[j] + "' present at position " + indices[m] +
                                    ". If scan criteria looks incorrect, make the update and then scan the code again.";
                                the.codeLanguage = r_code_language;
                                the.codeLanguageRowId = rows[i].file_type_id;

                                document.getElementById("languageScanResultDivId").style.display = "block";
                                populateLanguages();

                                document.getElementById("languageDeterminedDivId").style.display = "block";
                                //document.getElementById("languageNotDeterminedDivId").style.display = "none";
                                document.getElementById("msgForLanguageDetermined").style.display = "none";

                                document.getElementById("helpDivMessage").style.display = "block";
                                document.getElementById("helpDivMessage").innerHTML = '<i class="fa fa-info-circle" style="display:none; float: left;  position: absolute; top:35px; left: 10px; color:orange;" ></i>' + cleanWord(msg, '');

                                document.getElementById("code_language").value = r_code_language;
                                document.getElementById("id_by_file_content").value = r_id_by_file_contents;
                                document.getElementById("id_by_file_extension").value = rows[i].id_by_file_extension;
                            } else {

                                var msg = "Code Language is " + r_code_language + " based on codes scanned" +
                                    ". If it looks incorrect, please override the language.";
                                //console.log(msg)
                                //document.getElementById("languageDeterminedDivId").style.display = "block";
                                document.getElementById("languageOverride").style.display = "block";
                                document.getElementById("overrideMsg").innerHTML = "";
                                document.getElementById("helpDivMessage").style.display = "block";
                                document.getElementById("helpDivMessage").innerHTML = '<i class="fa fa-info-circle" style="display:none; float: left;  position: absolute; top:35px; left: 10px; color:orange;" ></i>' + cleanWord(msg, '');
                                populateLanguages();
                                the.codeLanguage = r_code_language;
                                document.getElementById("languageScanResultDivId").style.display = "none";
                                document.getElementById("helpDetailsDivId").style.display = "none";
                                document.getElementById("sub-tech-div-id").style.display = "none";
                            }




                            break loop1;
                        }


                    }

                }

            }
        }
    }
}

//SM:**********Working***DO NOT DELETE
function scan() {
    logCommon("at scan");

    document.getElementById("filelvlhelpdivid").style.display = "none";
    the.languageOverridden = false;
    the.codeLanguage = null;
    document.getElementById("overrideMsg").innerHTML = "";
    document.getElementById("helpAddUpdateMsg").innerHTML = "";
    document.getElementById("language-box").value = "";
    var codetext;

    try {
        document.getElementById("helpDetailsDivId").style.display = "none";
    } catch (err) { }

    if (document.getElementById("destinationDiv").style.display == "none") {
        the.codetext = the.editor.getValue();
        document.getElementById("source").value = the.codetext;


    } else {
        document.getElementById("source").value = the.codetext;
        document.getElementById("sourceDiv").style.display = "block";



        if (the.use_codemirror && typeof CodeMirror !== 'undefined') {

            set_editor_mode();
            the.editor.focus();
            the.editor.setValue(the.codetext);
        }
        //document.querySelector('#scanEditbtnId').innerText = 'Scan';
        document.querySelector('#scanEditbtnId').innerHTML = '<i class="smalltip fa fa-search" style="font-size:16px; color:blue"><span>Scan</span></i>';
        document.getElementById("destinationDiv").style.display = "none";
        showHelpDivMessage("Enter the code in the text area on the left and click on the scan button.");


        return;
    }
    //var codetext = the.codetext;

    //return;
    //document.querySelector('#scanEditbtnId').innerText = 'Edit';
    document.querySelector('#scanEditbtnId').innerHTML = '<i class="smalltip fa fa-edit" style="font-size:16px; color:blue"><span>Edit</span></i>';
    getCodeLanguages(the.codetext);
    markHelpCodes();
    document.getElementById("helpDivMessage").style.display = "block";

}

function showHelpDivMessage(msg) {
    document.getElementById("helpDivMessage").style.display = "block";
    document.getElementById("helpDivMessage").innerHTML = '<i class="fa fa-info-circle" style="display:none; float: left;  position: absolute; top:35px; left: 10px; color:orange;" ></i>' + msg;
    document.getElementById("languageDeterminedDivId").style.display = "none";
    //document.getElementById("languageNotDeterminedDivId").style.display = "none";
    document.getElementById("languageOverride").style.display = "none";
}


function languageDeterminedThruExt(msg) {
    document.getElementById("languageOverride").style.display = "block";
    document.getElementById("helpDivMessage").style.display = "block";
    document.getElementById("helpDivMessage").innerHTML = '<i class="fa fa-info-circle" style="display:none; float: left;  position: absolute; top:35px; left: 10px; color:orange;" ></i>' + cleanWord(msg, '');
    document.getElementById("overrideMsg").innerHTML = "";
    populateLanguages();

    document.getElementById("languageScanResultDivId").style.display = "none";
    document.getElementById("helpDetailsDivId").style.display = "none";
    document.getElementById("sub-tech-div-id").style.display = "none";
    //document.querySelector('#scanEditbtnId').innerText = 'Edit';
    document.querySelector('#scanEditbtnId').innerHTML = '<i class="smalltip fa fa-edit" style="font-size:16px; color:blue"><span>Edit</span></i>';
}

function languageNotDeterminedMsg() {
    document.getElementById("language-box").value = "";
    var msg = "Code language could not be determined" +
        ". Please enter the correct language in the box below and click on override button.";
    //console.log(msg)
    //document.getElementById("languageDeterminedDivId").style.display = "block";
    document.getElementById("languageOverride").style.display = "block";
    document.getElementById("overrideMsg").innerHTML = "";
    document.getElementById("helpDivMessage").style.display = "block";
    document.getElementById("helpDivMessage").innerHTML = '<i class="fa fa-info-circle" style="display:none; float: left;  position: absolute; top:35px; left: 10px; color:orange;" ></i>' + cleanWord(msg, '');
    populateLanguages();

    document.getElementById("languageScanResultDivId").style.display = "none";
    document.getElementById("helpDetailsDivId").style.display = "none";
    document.getElementById("sub-tech-div-id").style.display = "none";
    //document.querySelector('#scanEditbtnId').innerText = 'Edit';
}

function markHelpCodes(displayLanguageBox = true) {
    //document.querySelector('#scanEditbtnId').innerText = 'Edit';
    document.querySelector('#scanEditbtnId').innerHTML = '<i class="smalltip fa fa-edit" style="font-size:16px; color:blue"><span>Edit</span></i>';
    //console.log("Inside markHelpCodes")
    document.getElementById("sourceDiv").style.display = "none";
    document.getElementById("destinationDiv").style.display = "block";

    //document.getElementById("helpDivMessage").style.display = "none";


    //console.log("Inside markHelpCodes");
    var codetext = the.codetext;

    document.getElementById("languageScanResultActionDivId").style.display = "block";

    if (displayLanguageBox) {
        if (the.codeLanguage == null) {
            //console.log("Unable to determine code language");

            languageNotDeterminedMsg();


        } else {

            if (!the.languageOverridden) {
                document.getElementById("languageDeterminedDivId").style.display = "block";
                //document.getElementById("languageNotDeterminedDivId").style.display = "none";

                document.getElementById('language-box').value = the.codeLanguage;
                document.getElementById("languageOverride").style.display = "block";
                document.getElementById("overrideMsg").innerHTML = "";
                document.getElementById('sub-tech-div-id').style.display = "none";
                populateLanguages();
            }
        }
    }

    codetext = codetext.replaceAll(/\r/g, '·')


    //***Working 
    //var wordsArr = codetext.split(/(\S+\s+)/).filter(function(n) {return n});
    var LHCAI = the.LanguageHelpCodeAndIds_LclJson;
    //console.log(LHCAI);

    var codesWithHelpDetails = JSON.parse(LHCAI).filter(function (entry) {
        return entry.code_language === the.codeLanguage;
    });

    //console.log(codesWithHelpDetails);

    var CCC = JSON.parse(sessionStorage.getItem("CodeCommentsConditions"));

    var commentsConditions = JSON.parse(CCC).filter(function (entry) {
        return entry.code_language === the.codeLanguage;
    });


    var lineArr = codetext.split(/\n/);

    //logCommon("lineArr.length = " + lineArr.length);

    var innerHTML = "";
    var isMultilineComment = false;
    var isSinglelineComment = false;
    var isCommentDetected = false;

    var r_comment_start = '';
    var r_comment_end = '';

    try {
        for (var i = 0; i < lineArr.length; i++) {

            isSinglelineComment = false;


            innerHTML = innerHTML + '<div style="position: relative;"><div class="CodeMirror-gutter-wrapper" style="left: -30px;"><div contenteditable="false" class="CodeMirror-linenumber CodeMirror-gutter-elt" style="left: 0px; width: 21px;">';
            innerHTML = innerHTML + (i + 1);
            innerHTML = innerHTML + '</div></div>';

            innerHTML = innerHTML + '<pre class=" CodeMirror-line " role="presentation"><span role="presentation" style="padding-right: 0.1px;">';

            var wordsArr = lineArr[i].split(/(\S+\s+)/).filter(function (n) {
                return n
            });

            var myword = "";
            var matchFoundForHelpCodeWithSpace = false;

            NextBlockInLineLoop:
            for (var j = 0; j < wordsArr.length; j++) {

                //SM: Check whether the word is a part of comment
                myword = wordsArr[j];

                if (!isCommentDetected) {
                    for (var k = 0; k < commentsConditions.length; k++) {
                        r_comment_start = commentsConditions[k].comment_start;
                        r_comment_end = commentsConditions[k].comment_end;

                        //If word is not already identified as part of comment - Comment is starting
                        if (wordsArr[j].indexOf(r_comment_start) > -1) {
                            innerHTML = innerHTML + '<span class="cm-comment">' + cleanWord(wordsArr[j], '') + "</span>";
                            isCommentDetected = true;
                            //console.log("CommentDetected at line " + i + " and word " + wordsArr[j]);		
                            continue NextBlockInLineLoop;
                        }

                    }
                } else if (isCommentDetected) {
                    //If the word was part of comment and end of comment is detected
                    if (r_comment_end == null) {
                        innerHTML = innerHTML + '<span class="cm-comment">' + cleanWord(wordsArr[j], '') + "</span>";
                        continue NextBlockInLineLoop;

                    } else {
                        if (wordsArr[j].indexOf(r_comment_end) > -1) {
                            innerHTML = innerHTML + '<span class="cm-comment">' + cleanWord(wordsArr[j], '') + "</span>";
                            //console.log("Comment ending at line " + i + " and word " + wordsArr[j]);	
                            isCommentDetected = false;
                            continue NextBlockInLineLoop;
                        } else {
                            innerHTML = innerHTML + '<span class="cm-comment">' + cleanWord(wordsArr[j], '') + "</span>";
                            continue NextBlockInLineLoop;
                        }
                    }
                }

                var helpCodeFound = 0;

                //SM: Continuing if the word is not part of the comment: Check if it is a code with help
                NextHelpCodeLoop:
                for (var l = 0; l < codesWithHelpDetails.length; l++) {
                    //SM:TODO - it could be "For("
                    var hlpCode = codesWithHelpDetails[l].help_code;
                    var hlpCdId = codesWithHelpDetails[l].code_id;

                    var spaceInHelpCode = false;
                    var countOfSpacesInHelpCode = 0;

                    // if help code includes one space
                    if (hlpCode.indexOf(" ") > -1) {
                        spaceInHelpCode = true;
                        var xyg = hlpCode.split(/(\S+\s+)/).filter(function (n) {
                            return n
                        });
                        countOfSpacesInHelpCode = xyg.length - 1
                    }


                    if (!spaceInHelpCode) {
                        if (helpCodeFound != 1) {
                            myword = wordsArr[j];
                        }


                        if (myword.indexOf(hlpCode) > -1) {
                            //console.log("Before update = " + myword);
                            var cdGrp = codesWithHelpDetails[l].help_code_group;
                            if (cdGrp == null) {
                                cdGrp = "";
                            }
                            //console.log(cdGrp);
                            //SM: For operators like ==, !=, even if the code is next to other character add link
                            var preMatch = new RegExp("[a-zA-Z]" + "randomdummycode837128371", 'i');
                            var postMatch = new RegExp("[a-zA-Z]" + "randomdummycode837128371", 'i');
                            try {
                                preMatch = new RegExp("[a-zA-Z]" + hlpCode, 'i');
                            } catch {
                            }
                            try {
                                postMatch = new RegExp(hlpCode + "[a-zA-Z]", 'i');
                            } catch {
                            }

                            if (cdGrp.match(/operator/i)) {

                                if (helpCodeFound != 1) {
                                    myword = cleanWord(myword, hlpCode);
                                }

                                myword = myword.replaceAll(hlpCode, '<a href ="#" class="helpCodeCls" onclick="c_L_C(' + hlpCdId + ');return false;" >' + hlpCode + "</a>");

                                helpCodeFound = 1;

                                continue NextHelpCodeLoop;
                            } else if (myword.match(preMatch)) {
                                //console.log("prematch found for " + hlpCode + " at line " + i);
                                continue
                            } else if (myword.match(postMatch)) {
                                //console.log("postmatch found for " + hlpCode + " at line " + i);
                                continue
                            } else {
                                if (helpCodeFound != 1) {
                                    myword = cleanWord(myword, hlpCode);
                                }
                                myword = myword.replaceAll(hlpCode, '<a href ="#" class="helpCodeCls" onclick="c_L_C(' + hlpCdId + ');return false;">' + hlpCode + "</a>");
                                helpCodeFound = 1;


                                continue NextHelpCodeLoop;
                            }

                        }
                    } else {

                        if (j < wordsArr.length - countOfSpacesInHelpCode) {
                            //When the help code contains space: Join two words		


                            if (helpCodeFound != 1) {
                                //myword = wordsArr[j].trim() + " " + wordsArr[j+1].trim();
                                myword = wordsArr[j].trim();
                                for (var t = 1; t < countOfSpacesInHelpCode + 1; t++) {
                                    myword = myword + " " + wordsArr[j + t].trim();
                                }


                            }

                            //if (twoPairsMatch(myword,hlpCode )){
                            if (myword.indexOf(hlpCode) > -1) {
                                //console.log("Before update = " + myword);
                                var cdGrp = codesWithHelpDetails[l].help_code_group;
                                if (cdGrp == null) {
                                    cdGrp = "";
                                }
                                //console.log(cdGrp);
                                //SM: For operators like ==, !=, even if the code is next to other character add link
                                var preMatch = new RegExp("[a-zA-Z]" + "randomdummycode837128371", 'i');
                                var postMatch = new RegExp("[a-zA-Z]" + "randomdummycode837128371", 'i');
                                try {
                                    preMatch = new RegExp("[a-zA-Z]" + hlpCode, 'i');
                                } catch {
                                }
                                try {
                                    postMatch = new RegExp(hlpCode + "[a-zA-Z]", 'i');
                                } catch {
                                }

                                if (cdGrp.match(/operator/i)) {

                                    if (helpCodeFound != 1) {
                                        myword = cleanWord(myword, hlpCode);
                                    }

                                    myword = myword.replaceAll(hlpCode, '<a href ="#" class="helpCodeCls" onclick="c_L_C(' + hlpCdId + ');return false;" >' + hlpCode + "</a>");

                                    helpCodeFound = 1;
                                    matchFoundForHelpCodeWithSpace = true;
                                    //continue NextHelpCodeLoop;
                                    break NextHelpCodeLoop;

                                } else if (myword.match(preMatch)) {
                                    //console.log("prematch found for " + hlpCode + " at line " + i);
                                    continue
                                } else if (myword.match(postMatch)) {
                                    //console.log("postmatch found for " + hlpCode + " at line " + i);
                                    continue
                                } else {
                                    if (helpCodeFound != 1) {
                                        myword = cleanWord(myword, hlpCode);
                                    }
                                    myword = myword.replaceAll(hlpCode, '<a href ="#" class="helpCodeCls" onclick="c_L_C(' + hlpCdId + ');return false;">' + hlpCode + "</a>");
                                    helpCodeFound = 1;
                                    matchFoundForHelpCodeWithSpace = true;
                                    //continue NextHelpCodeLoop;
                                    break NextHelpCodeLoop;

                                }

                            }


                        }


                    }
                }

                if (helpCodeFound == 1) {
                    innerHTML = innerHTML + '<span class="cm-variable">' + myword + "</span>";
                    if (matchFoundForHelpCodeWithSpace) {
                        //SM: Skip one word because help code used up two words
                        //j = j + 1;
                        j = j + countOfSpacesInHelpCode;
                    }
                    continue NextBlockInLineLoop;
                }
                //console.log("Word '" + wordsArr[j] + "' is not a part of comment and does not have a help code either");

                //Continuing if the word is neither a comment nor has any help code

                myword = cleanWord(wordsArr[j], '');
                //wordsArr[j] = wordsArr[j].replaceAll(" ", "&nbsp;");
                innerHTML = innerHTML + '<span class="cm-variable">' + myword + "</span>";

            }


            innerHTML = innerHTML + '</span></pre></div>';
            //innerHTML = innerHTML  +  "<br>";
            if ((isCommentDetected) && (r_comment_end == null)) {
                isCommentDetected = false;
                //console.log("Comment ending at line " + i + " due to end of line ");
            }
        }
    } catch (err) {
        console.log(err.message);
        //console.log(wordsArr[j]);
        //console.log(hlpCode);
        //console.log(preMatch);
        //console.log(postMatch);

    }

    document.getElementById("target").innerHTML = innerHTML;



}

function twoPairsMatch(pair1, pair2) {
    var fstvals = pair1.split(" ");
    var scndVals = pair2.split(" ");

    if ((fstvals[0].trim() == scndVals[0].trim()) && (fstvals[1].trim() == scndVals[1].trim())) {
        return true;
    } else {
        return false;
    }
}
function overrideLanguage() {
    document.getElementById("filelvlhelpdivid").style.display = "none";
    var newLanguage = document.getElementById("language-box").value
    if (newLanguage == "") {
        document.getElementById("overrideMsg").innerHTML = "Please enter language in the box"
        return;
    }

    if (newLanguage == the.codeLanguage) {
        document.getElementById("overrideMsg").innerHTML = "New language is same as existing"
        return;
    }

    the.codeLanguage = newLanguage;
    the.languageOverridden = true;

    document.getElementById("overrideMsg").innerHTML = "Language overridden"

    markHelpCodes();
}

//SM: codeLinkClicked renamed to c_L_C because the name had help codes (e.g. link, li)
function c_L_C(hlpCdId) {
    //console.log("hlpCdId " + hlpCdId + " clicked");

    if (document.getElementById("helpDisplayDivId").style.width < "30%") {
        document.getElementById("mainContainer").style.width = "70%";
        document.getElementById("helpDisplayDivId").style.width = "30%";
    }

    document.getElementById("helpAddUpdateMsg").innerHTML = "";

    the.selectedCodeId = hlpCdId;


    //Pull the details for the help code
    $.ajax({
        url: the.hosturl + '/php/process.php',
        type: 'POST',
        data: jQuery.param({
            usrfunction: "HelpDetails",
            helpId: hlpCdId
        }),
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        success: function (response) {


            document.getElementById("helpboxDivId").scrollTop = 0;

            populateLanguages();
            document.getElementById("languageScanResultActionDivId").style.display = "none";
            document.getElementById('language-box').value = the.codeLanguage;

            document.getElementById('sub-tech-div-id').style.display = "block";
            document.getElementById('helpDetailsDivId').style.display = "block";
            document.getElementById('languageDeterminedDivId').style.display = "none";

            document.getElementById("helpDivMessage").style.display = "block";
            document.getElementById("helpDivMessage").innerHTML = '<i class="fa fa-info-circle" style="display:none; float: left;  position: absolute; top:35px; left: 10px; color:orange;" ></i>' + "Below are the details available for the clicked code. Updates can be submitted using the button below. (Requires Login)";
            document.getElementById("languageOverride").style.display = "block";
            document.getElementById("overrideMsg").innerHTML = "";


            var x = JSON.parse(response);
            var helpDetails = x[0];
            //console.log(helpDetails);

            document.getElementById('language-box').value = helpDetails.code_language;
            populateSubCategory();
            document.getElementById('sub-tech-box').value = helpDetails.code_sub_category;
            document.getElementById('help_code').value = helpDetails.help_code;

            if (helpDetails.help_details == null) {
                tinymce.get('help_details').setContent("");
            } else {
                tinymce.get('help_details').setContent(helpDetails.help_details);
            }


            if (helpDetails.additional_info == null) {
                tinymce.get('additional_info').setContent("");
            } else {
                tinymce.get('additional_info').setContent(helpDetails.additional_info);
            }

            document.getElementById('help_code_group').value = helpDetails.help_code_group;
            document.getElementById('shared_help_content_key').value = helpDetails.shared_help_content_key;

            if (helpDetails.copyright_check == 1) {
                document.getElementById('copyright_check').checked = true;
            } else {
                document.getElementById('copyright_check').checked = false;
            }
            if (helpDetails.do_not_use_for_scan == 1) {
                document.getElementById('do_not_use_for_scan').checked = true;
            } else {
                document.getElementById('do_not_use_for_scan').checked = false;
            }
            //*****DO NOT DELETE*********
            //refreshCaptchatwo();

            if ((localStorage.getItem("userLoggedIn") == "n") || (localStorage.getItem("userLvl") != "9")) {
                document.getElementById("helpDisplayLoggedInOnly").style.display = "none";
            }


        },
        error: function () {
            //alert("error");
        }
    });

}

function addHelp() {

    if (document.getElementById("helpDisplayDivId").style.width < "30%") {
        document.getElementById("mainContainer").style.width = "70%";
        document.getElementById("helpDisplayDivId").style.width = "30%";
    }

    document.getElementById("filelvlhelpdivid").style.display = "none";

    document.getElementById("helpboxDivId").scrollTop = 0;
    document.getElementById("helpAddUpdateMsg").innerHTML = "";
    document.getElementById('languageOverride').style.display = "block";

    the.selectedCodeId = null;

    document.getElementById("helpDivMessage").style.display = "block";
    document.getElementById("helpDivMessage").innerHTML = '<i class="fa fa-info-circle" style="display:none; float: left;  position: absolute; top:35px; left: 10px; color:orange;" ></i>' + "Enter the details below to create help content for a code. (Requires Login)";


    if (onMobileBrowser()) {
        $('html, body').animate({
            scrollTop: $("#helpDisplayDivId").offset().top
        }, 1000);
    }
    populateLanguages();
    document.getElementById("languageScanResultActionDivId").style.display = "none";
    document.getElementById('language-box').value = the.codeLanguage;

    document.getElementById('sub-tech-div-id').style.display = "block";
    document.getElementById('helpDetailsDivId').style.display = "block";
    document.getElementById('languageDeterminedDivId').style.display = "none";


    document.getElementById('sub-tech-box').value = "";
    document.getElementById('help_code').value = "";

    tinymce.get('help_details').setContent("");
    tinymce.get('help_details').undoManager.clear();

    tinymce.get('additional_info').setContent("");
    tinymce.get('additional_info').undoManager.clear();
    document.getElementById('help_code_group').value = "";
    document.getElementById('shared_help_content_key').value = "";
    document.getElementById('copyright_check').checked = false;
    document.getElementById('do_not_use_for_scan').checked = false;

    if ((localStorage.getItem("userLoggedIn") == "n") || (localStorage.getItem("userLvl") != "9")) {
        document.getElementById("helpDisplayLoggedInOnly").style.display = "none";
    }

    //***********DO NOT DELETE**********	
    //refreshCaptchatwo();
    populateSubCategory();

}

function populateLanguages(fieldId = "language-box") {


}

function populateSubCategory() {

    if (document.getElementById('sub-tech-box') == null) {
        return;
    }

    //console.log(document.getElementById('sub-tech-box'));

    var selectedLanguage = document.getElementById('language-box').value


    var LHCAI = the.LanguageHelpCodeAndIds_LclJson;


    var codesWithHelpDetails = JSON.parse(LHCAI).filter(function (entry) {
        return entry.code_language === selectedLanguage;
    });



    //Auto popolate values in Sub Category Field
    var lookup = {};
    var items = codesWithHelpDetails;
    var subCategory = [];

    for (var item, i = 0; item = items[i++];) {
        var sub_cat = item.code_sub_category;

        if (!(sub_cat in lookup)) {
            lookup[sub_cat] = 1;
            if (sub_cat == undefined) {
                continue;
            }
            subCategory.push(sub_cat);
        }
    }

    autocomplete(document.getElementById("sub-tech-box"), subCategory);


    //Auto popolate values in Help Code Group Field
    lookup = {};
    var helpCodeGroup = [];

    for (var item, i = 0; item = items[i++];) {
        var new_item = item.help_code_group;

        if (!(new_item in lookup)) {
            lookup[new_item] = 1;
            if (new_item == undefined) {
                continue;
            }
            helpCodeGroup.push(new_item);
        }
    }



    autocomplete(document.getElementById("help_code_group"), helpCodeGroup);

    //Auto popolate values in Help Code Group Field
    lookup = {};
    var sharedHelpContent = [];

    for (var item, i = 0; item = items[i++];) {
        var new_item = item.shared_help_content_key;

        if (!(new_item in lookup)) {
            lookup[new_item] = 1;
            if (new_item == undefined) {
                continue;
            }
            sharedHelpContent.push(new_item);
        }
    }


    autocomplete(document.getElementById("shared_help_content_key"), sharedHelpContent);

}

function cleanWord(word, codeToExclude) {

    word = word.replace(codeToExclude, 'SM_SECRET');
    word = word.replaceAll(/&/g, '&amp;');
    word = word.replaceAll(/</g, '&lt;');
    word = word.replaceAll(/>/g, '&gt;');
    word = word.replaceAll(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;')
    word = word.replace('SM_SECRET', codeToExclude);

    return word;
}




function autocomplete(inp, arr) {

    var currentFocus;

    inp
        .addEventListener(
            "input",
            function (e) {
                //document.getElementById("SVDReviewDiv").style.display = "none";
                var a, b, i, val = this.value;
                var strPos;
                /*close any already open lists of autocompleted values*/
                //closeAllLists();
                if (!val) {
                    closeAllLists();
                    return false;
                }

                var tf = JSON.parse(sessionStorage.getItem("itemsList"));

                //SM: DO NOT DELETE: options to 3 char
                if (val.length < 2) {
                    closeAllLists();
                    return false;
                }

                var elemnt = this;
                //Start Async
                setTimeout(function () {
                    closeAllLists();
                    currentFocus = -1;
                    /*create a DIV element that will contain the items (values):*/
                    a = document.createElement("DIV");
                    a.setAttribute("id", elemnt.id + "autocomplete-list");
                    a.setAttribute("class", "autocomplete-items");
                    /*append the DIV element as a child of the autocomplete container:*/
                    elemnt.parentNode.appendChild(a);
                    /*for each item in the array...*/
                    for (i = 0; i < arr.length; i++) {
                        /*check if the item starts with the same letters as the text field value:*/
                        if (val != elemnt.value) {
                            closeAllLists();
                            break;
                        }
                        //if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                        strPos = arr[i].toUpperCase().indexOf(
                            val.toUpperCase());

                        //SM: DO NOT DELETE: options to 50

                        if (a.childElementCount > 50) {
                            break;
                        }

                        if (strPos > -1) {

                            /*create a DIV element for each matching element:*/
                            b = document.createElement("DIV");
                            /*make the matching letters bold:*/

                            b.innerHTML = arr[i].substr(0, strPos);
                            b.innerHTML += "<strong>" +
                                arr[i].substr(strPos, val.length) +
                                "</strong>";
                            b.innerHTML += arr[i].substr(strPos +
                                val.length);

                            /*insert a input field that will hold the current array item's value:*/
                            b.innerHTML += "<input type='hidden' value='" +
                                arr[i] + "'>";
                            /*execute a function when someone clicks on the item value (DIV element):*/
                            b
                                .addEventListener(
                                    "click",
                                    function (e) {
                                        /*insert the value for the autocomplete text field:*/
                                        inp.value = this
                                            .getElementsByTagName("input")[0].value;
                                        /*close the list of autocompleted values,
                                        (or any other open lists of autocompleted values:*/
                                        closeAllLists();
                                        if (inp.id == "item-search-box") {
                                            searchItem();
                                        } else {
                                            populateSubCategory();
                                        }

                                    });
                            a.appendChild(b);
                        } else {
                            var searchText = val.toUpperCase()
                            var rows = JSON.parse(tf);
                            rows = rows.filter(function (entry) {
                                return (entry.title.toUpperCase() === arr[i].toUpperCase() && entry.discontinue == "0") && (entry.title.toUpperCase().includes(searchText)
                                    || entry.category.toUpperCase().includes(searchText)
                                    || entry.shortdescription.toUpperCase().includes(searchText)
                                    || entry.keywords.toUpperCase().includes(searchText));
                            });

                            if (rows.length > 0) {
                                b = document.createElement("DIV");
                                b.innerHTML = arr[i];
                                b.innerHTML += "<input type='hidden' value='" +
                                    arr[i] + "'>";
                                b.addEventListener(
                                    "click",
                                    function (e) {
                                        /*insert the value for the autocomplete text field:*/
                                        inp.value = this.getElementsByTagName("input")[0].value;
                                        /*close the list of autocompleted values,
                                        (or any other open lists of autocompleted values:*/
                                        closeAllLists();
                                        if (inp.id == "item-search-box") {
                                            searchItem();
                                        } else {
                                            populateSubCategory();
                                        }

                                    });
                                a.appendChild(b);
                            }

                        }
                    }

                }, 0);
                // End Async

            });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function (e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x)
            x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/
            currentFocus++;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 38) { //up
            /*If the arrow UP key is pressed,
            decrease the currentFocus variable:*/
            currentFocus--;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault();
            if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x)
                    x[currentFocus].click();
            }
        }
    });

    function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x)
            return false;
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length)
            currentFocus = 0;
        if (currentFocus < 0)
            currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active");
    }

    function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }

    function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items");

        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }

    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });

    //console.log("Autocomplete End Time = " + new Date());
}


function getConditionsToIdentifyCodeLanguage() {

    var tags = JSON.parse(sessionStorage.getItem("IdentifyCodeLanguage"));
    if (tags != null) {
        if (tags != "") {
            return;
        }
    }

    $.ajax({
        url: the.hosturl + '/php/process.php',
        type: 'POST',
        data: jQuery.param({
            usrfunction: "IdentifyCodeLanguage"
        }),
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        success: function (response) {
            //alert(response);
            //var tags = JSON.parse(response);
            sessionStorage.setItem("IdentifyCodeLanguage", JSON.stringify(response));
        },
        error: function () {
            //alert("error");
        }
    });
}

function getDistinctCommentsCombination() {
    var tags = JSON.parse(sessionStorage.getItem("CommentsCombination"));
    if (tags != null) {
        if (tags != "") {
            return;
        }
    }

    $.ajax({
        url: the.hosturl + '/php/process.php',
        type: 'POST',
        data: jQuery.param({
            usrfunction: "CommentsCombination"
        }),
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        success: function (response) {
            //alert(response);
            //var tags = JSON.parse(response);
            sessionStorage.setItem("CommentsCombination", JSON.stringify(response));
        },
        error: function () {
            //alert("error");
        }
    });
}

function getLanguageHelpCodeAndIds() {

    //var tags = the.LanguageHelpCodeAndIds_LclJson;
    var tags = sessionStorage.getItem("LanguageHelpCodeAndIds");

    if (tags != null) {
        if (tags != "") {
            return;
        }
    }

    $.ajax({
        url: the.hosturl + '/php/process.php',
        type: 'POST',
        data: jQuery.param({
            usrfunction: "LanguageHelpCodeAndIds"
        }),
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        success: function (response) {
            //alert(response);
            //var tags = JSON.parse(response);
            sessionStorage.setItem("LanguageHelpCodeAndIds", JSON.stringify(response));
            //console.log(response);
            the.LanguageHelpCodeAndIds_LclJson = response;
        },
        error: function (xhr, status, error) {
            console.log(error);
            console.log(xhr);
        }
    });
}

function getItemsList() {

    var tags = sessionStorage.getItem("itemsList")
    if (tags != null) {
        if ((tags != "") && (tags != "null")) {
            populateitemsDropDownDisplay();
            return;
        }
    }

    $.ajax({
        url: the.hosturl + '/php/process.php',
        type: 'POST',
        data: jQuery.param({
            usrfunction: "items"
        }),
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        success: function (response) {
            //alert(response);
            //var tags = JSON.parse(response);
            //sessionStorage.setItem("LanguageHelpCodeAndIds", JSON.stringify(response));
            //console.log(response);

            //the.LanguageHelpCodeAndIds_LclJson = response;

            sessionStorage.setItem("itemsList", JSON.stringify(response));
            populateitemsDropDownDisplay();
        },
        error: function (xhr, status, error) {
            console.log(error);
            console.log(xhr);
        }
    });
}

function getCategoryList() {

    var tags = sessionStorage.getItem("categoryList")
    if (tags != null) {
        if ((tags != "") && (tags != "null")) {
            return;
        }
    }

    $.ajax({
        url: the.hosturl + '/php/process.php',
        type: 'POST',
        data: jQuery.param({
            usrfunction: "categories"
        }),
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        success: function (response) {
            sessionStorage.setItem("categoryList", JSON.stringify(response));
        },
        error: function (xhr, status, error) {
            console.log(error);
            console.log(xhr);
        }
    });
}

function populateitemsDropDownDisplay() {
    var tf = JSON.parse(sessionStorage.getItem("itemsList"));
    var rows = JSON.parse(tf);
    rows = rows.filter(function (entry) {
        return entry.discontinue == "0";
    });
    var innHTML = "";

    for (var i = 0; i < rows.length; i++) {
        if (i == 0) {
            innHTML = innHTML + "<a href= '" + the.hosturl + "/items/" + rows[i].category + "'>" + rows[i].category + "</a>";
        } else if (rows[i].category != rows[i - 1].category) {
            innHTML = innHTML + "<a href= '" + the.hosturl + "/items/" + rows[i].category + "'>" + rows[i].category + "</a>";
        }
        // if (i == 0) {
        //     innHTML = innHTML + "<a href='javascript:showcategory("+ '"' + rows[i].category + '"' + ")'>"+ rows[i].category +"</a>";
        // }else if (rows[i].category != rows[i-1].category){
        //     innHTML = innHTML + "<a href='javascript:showcategory("+ '"' + rows[i].category + '"' + ")'>"+ rows[i].category +"</a>";
        // }       
    }
    document.getElementById("dropDownTutListId").innerHTML = innHTML;

}
function getHelpDetails(codeId) {



    $.ajax({
        url: the.hosturl + '/php/process.php',
        type: 'POST',
        data: jQuery.param({
            usrfunction: "HelpDetails",
            helpId: codeId
        }),
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        success: function (response) {
            //alert(response);
            //var tags = JSON.parse(response);
            //sessionStorage.setItem("conditionsToIdentifyCodeLanguage", JSON.stringify(response));
        },
        error: function () {
            //alert("error");
        }
    });
}

function addOrUpdateHelpDetails() {
    //console.log("Inside updateHelpDetails");

    var myCodeId = the.selectedCodeId;
    var newCodeLanguage = document.getElementById("language-box").value;

    if (localStorage.getItem("userLoggedIn") == "n") {
        //myUrl = window.location.protocol + "//" + window.location.host +  window.location.pathname + "?target=login";

        document.getElementById("helpAddUpdateMsg").innerHTML = 'Please Login';
        document.getElementById("SubloginDivId").style.display = "block";
        return;
    }

    if (newCodeLanguage == "") {
        document.getElementById("helpAddUpdateMsg").innerHTML = "Please enter language";
        return;
    }
    newCodeLanguage = newCodeLanguage.replaceAll("'", "''");

    var newCodeSubTech = document.getElementById("sub-tech-box").value;
    newCodeSubTech = newCodeSubTech.replaceAll("'", "''");

    var newDoNotUseForScan = 0;
    if (document.getElementById("do_not_use_for_scan").checked) {
        newDoNotUseForScan = 1;
    }
    var newHelpCode = document.getElementById("help_code").value;
    newHelpCode = newHelpCode.trim();



    if (newHelpCode == "") {
        document.getElementById("helpAddUpdateMsg").innerHTML = "Please enter help code";
        return;
    }




    newHelpCode = newHelpCode.replaceAll("'", "''");

    var newHelpCodeGroup = document.getElementById("help_code_group").value;
    //var newHelpDetails = document.getElementById("help_details").value;
    newHelpCodeGroup = newHelpCodeGroup.replaceAll("'", "''");

    var newHelpDetails = tinyMCE.get('help_details').getContent()

    //console.log(newHelpDetails);

    if (newHelpDetails == "") {
        document.getElementById("helpAddUpdateMsg").innerHTML = "Please enter help details";
        return;
    }



    if (document.getElementById('terms_conditions').checked == false) {
        if ((localStorage.getItem("userLoggedIn") == "n") || (localStorage.getItem("userLvl") != "9")) {
            document.getElementById("helpAddUpdateMsg").innerHTML = "Please accept terms and conditions";
            return;
        }
    }


    newHelpDetails = newHelpDetails.replaceAll("'", "''");

    //var newAdditionalInfo  = document.getElementById("additional_info").value;
    var newAdditionalInfo = tinyMCE.get('additional_info').getContent()

    newAdditionalInfo = newAdditionalInfo.replaceAll("'", "''");

    var newSharedHelpContentKey = document.getElementById("shared_help_content_key").value;
    newSharedHelpContentKey = newSharedHelpContentKey.replaceAll("'", "''");

    var newCopyRightCheck = 0;
    if (document.getElementById("copyright_check").checked) {
        newCopyRightCheck = 1;
    }
    var newSearchTags = document.getElementById("help_search_tags").value;
    newSearchTags = newSearchTags.replaceAll("'", "''");

    document.getElementById("helpAddUpdateMsgLoaderDivId").style.display = "block";

    if (myCodeId != null) {
        //console.log("calling update help");


        $.ajax({
            url: the.hosturl + '/php/process.php',
            type: 'POST',
            data: jQuery.param({
                usrfunction: "UpdateHelpDetails",
                codeId: myCodeId,
                codeLanguage: newCodeLanguage,
                codeSubTech: newCodeSubTech,
                doNotUseForScan: newDoNotUseForScan,
                helpCode: newHelpCode,
                helpCodeGroup: newHelpCodeGroup,
                helpDetails: newHelpDetails,
                additionalInfo: newAdditionalInfo,
                sharedHelpContentKey: newSharedHelpContentKey,
                copyRightCheck: newCopyRightCheck,
                searchTags: newSearchTags,

            }),
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            success: function (response) {
                document.getElementById("helpAddUpdateMsgLoaderDivId").style.display = "none"
                //console.log("success");
                //console.log(response);
                if (response == "true") {
                    document.getElementById("helpAddUpdateMsg").innerHTML = "Saved successfully";

                } else if (response == "emailed") {
                    document.getElementById("helpAddUpdateMsg").innerHTML = "Thank you for your contribution. The updates have been sent for processing and will be recorded within 24 hours.";

                } else if (localStorage.getItem("userLoggedIn") == "n") {
                    document.getElementById("helpAddUpdateMsg").innerHTML = "Thank you for your contribution. The updates have been sent for processing.";

                }

                else {
                    document.getElementById("helpAddUpdateMsg").innerHTML = "Failed to update. Please contact support desk";
                }

            },
            error: function (xhr, status, error) {
                document.getElementById("helpAddUpdateMsgLoaderDivId").style.display = "none"
                //console.log("error-3232");
                console.log(error);
                console.log(xhr);
            }
        });

    } else {
        //console.log("calling add help");
        /**/
        $.ajax({
            url: the.hosturl + '/php/process.php',
            type: 'POST',
            data: jQuery.param({
                usrfunction: "AddNewHelp",
                codeId: myCodeId,
                codeLanguage: newCodeLanguage,
                codeSubTech: newCodeSubTech,
                doNotUseForScan: newDoNotUseForScan,
                helpCode: newHelpCode,
                helpCodeGroup: newHelpCodeGroup,
                helpDetails: newHelpDetails,
                additionalInfo: newAdditionalInfo,
                sharedHelpContentKey: newSharedHelpContentKey,
                copyRightCheck: newCopyRightCheck,
                searchTags: newSearchTags,

            }),
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            success: function (response) {
                //console.log("success");
                //console.log(response);
                document.getElementById("helpAddUpdateMsgLoaderDivId").style.display = "none"


                if (response == "true") {
                    document.getElementById("helpAddUpdateMsg").innerHTML = "Record created successfully";

                    //Refresh the help code list

                    $.ajax({
                        url: the.hosturl + '/php/process.php',
                        type: 'POST',
                        data: jQuery.param({
                            usrfunction: "LanguageHelpCodeAndIds"
                        }),
                        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                        success: function (response) {
                            //sessionStorage.setItem("LanguageHelpCodeAndIds", JSON.stringify(response));
                            the.LanguageHelpCodeAndIds_LclJson = response;
                            //alert(response);
                            //var tags = JSON.parse(response);

                            var filteredRows = JSON.parse(response).filter(function (entry) {
                                return entry.code_language === newCodeLanguage && entry.help_code === newHelpCode;
                            });
                            //console.log(filteredRows);
                            the.selectedCodeId = filteredRows[0].code_id
                            markHelpCodes(false);
                            document.getElementById("languageScanResultActionDivId").style.display = "none";

                        },
                        error: function () {
                            //alert("error");
                        }
                    });

                    //markHelpCodes();

                } else if (response == "false") {
                    document.getElementById("helpAddUpdateMsg").innerHTML = "Record already exists for the help code";
                } else {
                    document.getElementById("helpAddUpdateMsg").innerHTML = "Failed to process. Please try again later";
                }
            },
            error: function (xhr, status, error) {
                document.getElementById("helpAddUpdateMsgLoaderDivId").style.display = "none"
                //console.log("error");
                console.log(error);
                console.log(xhr);
            }
        });
    }

}

function getEnvironmentSetUpDetails() {

    var tags = JSON.parse(sessionStorage.getItem("EnvironmentSetUpDetails"));
    if (tags != null) {
        if (tags != "") {
            return;
        }
    }

    $.ajax({
        url: the.hosturl + '/php/process.php',
        type: 'POST',
        data: jQuery.param({
            usrfunction: "EnvironmentSetUpDetails"
        }),
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        success: function (response) {
            //alert(response);
            //var tags = JSON.parse(response);
            sessionStorage.setItem("EnvironmentSetUpDetails", JSON.stringify(response));
        },
        error: function () {
            //alert("error");
        }
    });
}

function getCodeCommentsConditions() {

    var tags = JSON.parse(sessionStorage.getItem("CodeCommentsConditions"));
    if (tags != null) {
        if (tags != "") {
            return;
        }
    }

    $.ajax({
        url: the.hosturl + '/php/process.php',
        type: 'POST',
        data: jQuery.param({
            usrfunction: "CodeCommentsConditions"
        }),
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        success: function (response) {
            //alert(response);
            //var tags = JSON.parse(response);
            sessionStorage.setItem("CodeCommentsConditions", JSON.stringify(response));
        },
        error: function () {
            //alert("error");
        }
    });
}

function getLaguagesSubCatgHelpCodeGroups() {

    var tags = JSON.parse(sessionStorage.getItem("LaguagesSubCatgHelpCodeGroups"));
    if (tags != null) {
        if (tags != "") {
            return;
        }
    }

    $.ajax({
        url: the.hosturl + '/php/process.php',
        type: 'POST',
        data: jQuery.param({
            usrfunction: "LaguagesSubCatgHelpCodeGroups"
        }),
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        success: function (response) {
            //alert(response);
            //var tags = JSON.parse(response);
            sessionStorage.setItem("LaguagesSubCatgHelpCodeGroups", JSON.stringify(response));
        },
        error: function () {
            //alert("error");
        }
    });
}

function getHelpCodeGroupDisplayOrder() {

    var tags = JSON.parse(sessionStorage.getItem("HelpCodeGroupDisplayOrder"));
    if (tags != null) {
        if (tags != "") {
            return;
        }
    }

    $.ajax({
        url: the.hosturl + '/php/process.php',
        type: 'POST',
        data: jQuery.param({
            usrfunction: "HelpCodeGroupDisplayOrder"
        }),
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        success: function (response) {
            //alert(response);
            //var tags = JSON.parse(response);
            sessionStorage.setItem("HelpCodeGroupDisplayOrder", JSON.stringify(response));
        },
        error: function () {
            //alert("error");
        }
    });
}

function getLangForFileExtension() {
    var tags = JSON.parse(sessionStorage.getItem("LanguageForFileExtension"));
    if (tags != null) {
        if (tags != "") {
            return;
        }
    }

    $.ajax({
        url: the.hosturl + '/php/process.php',
        type: 'POST',
        data: jQuery.param({
            usrfunction: "LanguageForFileExtension"
        }),
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        success: function (response) {
            sessionStorage.setItem("LanguageForFileExtension", JSON.stringify(response));

        },
        error: function () {
            //alert("error");
        }
    });
}

function getHowToVideos() {

    var tags = JSON.parse(sessionStorage.getItem("HowToVideos"));
    if (tags != null) {
        if (tags != "") {
            return;
        }
    }

    $.ajax({
        url: the.hosturl + '/php/process.php',
        type: 'POST',
        data: jQuery.param({
            usrfunction: "HowToVideos"
        }),
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        success: function (response) {
            //console.log(response);

            sessionStorage.setItem("HowToVideos", JSON.stringify(response));


        },
        error: function () {
            //alert("error");
        }
    });
}

function getSpecialFiles() {
    var tags = JSON.parse(sessionStorage.getItem("SpecialFiles"));
    if (tags != null) {
        if (tags != "") {
            return;
        }
    }

    $.ajax({
        url: the.hosturl + '/php/process.php',
        type: 'POST',
        data: jQuery.param({
            usrfunction: "SpecialFiles"
        }),
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        success: function (response) {
            //console.log(response);

            sessionStorage.setItem("SpecialFiles", JSON.stringify(response));


        },
        error: function () {
            //alert("error");
        }
    });
}

function getStoredProjectList() {

    var myCookie = getCookie("cookname");

    if (myCookie == null) {
        localStorage.setItem("userLoggedIn", "n");
        return;
    } else {
        if (myCookie == "") {
            localStorage.setItem("userLoggedIn", "n");
            localStorage.setItem("userLvl", "");
            return;
        } else {
            localStorage.setItem("userLoggedIn", "y");
            if (localStorage.getItem("userLvl") != "9") {
                return;
            }
        }
    }

    var tags = JSON.parse(sessionStorage.getItem("SavedProjectsList"));
    if (tags != null) {
        if (tags != "") {
            return;
        }
    }

    $.ajax({
        url: the.hosturl + '/php/process.php',
        type: 'POST',
        data: jQuery.param({
            usrfunction: "GetSavedProjects"
        }),
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        success: function (response) {
            sessionStorage.setItem("SavedProjectsList", JSON.stringify(response));


        },
        error: function () {
            //alert("error");
        }
    });


}



function overrideHelpTopicsLanguage() {
    var newLanguage = document.getElementById("helpTopics-lang-box").value
    if (newLanguage == "") {
        document.getElementById("helpLangoverrideMsg").innerHTML = "Please enter language in the box"
        return;
    }
    newLanguage = newLanguage.trim();
    //the.codeLanguage = newLanguage;

    sessionStorage.setItem("helpTopicsLanguage", newLanguage);


    populateHelpTopics();
}

function populateHelpTopics() {

    //REF: https://codepen.io/AdventureBear/pen/WbOpjW


    showHelpDivMessage("Select language to display the help content list available then click on the help code to view the help details");

    var LHCAI = the.LanguageHelpCodeAndIds_LclJson;

    var codeLanguage = sessionStorage.getItem("helpTopicsLanguage")
    //var codesWithHelpDetails = JSON.parse(LHCAI);
    if (codeLanguage == null) {
        return;
    } else if (document.getElementById("helpTopics-lang-box").value == "") {
        document.getElementById("helpTopics-lang-box").value = codeLanguage;
    }

    var codesWithHelpDetails = JSON.parse(LHCAI).filter(function (entry) {
        var evalStr = entry.code_language;
        if (evalStr == null) {
            return false
        } else {
            return evalStr.toUpperCase() === codeLanguage.toUpperCase();
        }
    });

    codesWithHelpDetails.sort(function (a, b) {

        return (a.help_code_group === null) - (b.help_code_group === null) || +(a.help_code_group > b.help_code_group) || -(a.help_code_group < b.help_code_group);

    });

    var innerHTML = '<div >';

    for (var l = 0; l < codesWithHelpDetails.length; l++) {

        var hlpCode = codesWithHelpDetails[l].help_code;
        var hlpCdId = codesWithHelpDetails[l].code_id;
        var hlpCdGrp = codesWithHelpDetails[l].help_code_group;

        //if ((hlpCdGrp == null) || (hlpCdGrp == "")) {
        if (hlpCdGrp == null) {
            hlpCdGrp = "Others";
        }

        if (hlpCdGrp == "") {
            hlpCdGrp = "Ungrouped";
        }

        if (l > 0) {
            if (codesWithHelpDetails[l].help_code_group != codesWithHelpDetails[l - 1].help_code_group) {
                //First item in the group****Need to close previous li and open li for the new group
                innerHTML = innerHTML + '</ul> </li>';
                innerHTML = innerHTML + '<li class="day">' + '<i style = "color: black; font-style: normal; ">' + hlpCdGrp + '</i>' + ' <ul class="bullet-list-round">';
                innerHTML = innerHTML + '<li>' + '<a href ="#" class="helpCodeCls" onclick="c_L_C(' + hlpCdId + ');return false;" >' + hlpCode + "</a>" + '</li>';
            } else {
                //another item in the previous group
                innerHTML = innerHTML + '<li>' + '<a href ="#" class="helpCodeCls" onclick="c_L_C(' + hlpCdId + ');return false;" >' + hlpCode + "</a>" + '</li>';
            }
        } else if (l == 0) {
            //First item in the list
            innerHTML = innerHTML + '<li class="day">' + '<i style = "color: black">' + hlpCdGrp + '</i>' + ' <ul class="bullet-list-round">' + '<li>' + '<a href ="#" class="helpCodeCls" onclick="c_L_C(' + hlpCdId + ');return false;" >' + hlpCode + "</a>" + '</li>';
        }

        //List is over
        if (l == codesWithHelpDetails.length - 1) {
            innerHTML = innerHTML + '</ul> </li></div>';
        }

    }
    document.getElementById("HelpTopicsList").innerHTML = innerHTML;

    //SM: Added logic for help topics display


    $('li > ul').each(function (i) {
        // Find this list's parent list item.
        var parentLi = $(this).parent('li');

        // Style the list item as folder.
        parentLi.addClass('folder');

        // Temporarily remove the list from the
        // parent list item, wrap the remaining
        // text in an anchor, then reattach it.
        var subUl = $(this).remove();
        parentLi.wrapInner('<a/>').find('a').click(function () {
            // Make the anchor toggle the leaf display.
            subUl.toggle();
        });
        parentLi.append(subUl);
    });

    // Hide all lists except the outermost.
    $('ul ul').hide();
}

function hideDiv(divId) {

    document.getElementById(divId).style.display = "none";
    if (divId == "HelpTopicsDivId") {
        document.getElementById("languageScanResultDivId").style.display = "none";
        document.getElementById("languageOverride").style.display = "none";
        document.getElementById("helpDetailsDivId").style.display = "none";
        document.getElementById("helpDivMessage").style.display = "block";

        document.getElementById("helpDivMessage").innerHTML = '<i class="fa fa-info-circle" style="display:none; float: left;  position: absolute; top:35px; left: 10px; color:orange;" ></i>' + "Please click on one of the option from top menu to proceed";
        document.getElementById("helpDisplayDivId").style.width = "100%";
        //document.getElementById("helpDisplayDivId").style.overflow = "hidden";
    }

    else if (divId == "projectscannerDivId") {
        if (document.getElementById("filescannerDivId").style.display == "block") {
            if (!onMobileBrowser()) {
                document.getElementById("filescannerDivId").style.width = "70%";
            }

        } else {
            document.getElementById("languageScanResultDivId").style.display = "none";
            document.getElementById("languageOverride").style.display = "none";
            document.getElementById("helpDetailsDivId").style.display = "none";
            document.getElementById("helpDivMessage").style.display = "block";
            document.getElementById("helpDivMessage").innerHTML = '<i class="fa fa-info-circle" style="display:none; float: left;  position: absolute; top:35px; left: 10px; color:orange;" ></i>' + "Please click on one of the option from top menu to proceed";
            document.getElementById("helpDisplayDivId").style.width = "100%";

        }
    }

    else if (divId == "filescannerDivId") {
        if (document.getElementById("projectscannerDivId").style.display == "block") {
            if (!onMobileBrowser()) {
                document.getElementById("projectscannerDivId").style.width = "100%";
            }

        } else {
            document.getElementById("languageScanResultDivId").style.display = "none";
            document.getElementById("languageOverride").style.display = "none";
            document.getElementById("helpDetailsDivId").style.display = "none";
            document.getElementById("helpDivMessage").style.display = "block";
            document.getElementById("helpDivMessage").innerHTML = '<i class="fa fa-info-circle" style="display:none; float: left;  position: absolute; top:35px; left: 10px; color:orange;" ></i>' + "Please click on one of the option from top menu to proceed";
            document.getElementById("helpDisplayDivId").style.width = "100%";
            //document.getElementById("helpDisplayDivId").style.overflow = "hidden";
        }
    } else if (divId == "helpDetailsDivId") {
        document.getElementById("helpDivMessage").style.display = "block";
        document.getElementById("languageOverride").style.display = "none";

    }
}

function expandContractFileDiv() {

    if (document.getElementById("projectscannerDivId").style.display == "block") {
        if (!onMobileBrowser()) {

            if (document.getElementById("filescannerDivId").style.width > '70%') {
                document.getElementById("filescannerDivId").style.width = "70%";
                document.getElementById("projectscannerDivId").style.width = "30%";
                document.getElementById("mainContainer").style.width = "70%";
                document.getElementById("helpDisplayDivId").style.width = "30%";
            } else {
                document.getElementById("filescannerDivId").style.width = "90%";
                document.getElementById("projectscannerDivId").style.width = "10%";
                document.getElementById("mainContainer").style.width = "90%";
                document.getElementById("helpDisplayDivId").style.width = "10%";
            }
        }

    } else {

        if (!onMobileBrowser()) {

            if (document.getElementById("mainContainer").style.width > '70%') {
                document.getElementById("mainContainer").style.width = "70%";
                document.getElementById("helpDisplayDivId").style.width = "30%";
            } else {
                document.getElementById("mainContainer").style.width = "90%";
                document.getElementById("helpDisplayDivId").style.width = "10%";
            }
        }
    }

}

function expandContractProjectDiv() {

    if (document.getElementById("filescannerDivId").style.display == "block") {
        if (!onMobileBrowser()) {

            if (document.getElementById("projectscannerDivId").style.width > '50%') {
                document.getElementById("filescannerDivId").style.width = "70%";
                document.getElementById("projectscannerDivId").style.width = "30%";
            } else {
                document.getElementById("filescannerDivId").style.width = "10%";
                document.getElementById("projectscannerDivId").style.width = "90%";
            }
        }
    }
}

function expandContractHelpDiv() {
    //console.log(document.getElementById("mainContainer").style.width);

    if (document.getElementById("projectscannerDivId").style.display == "block") {
        if (!onMobileBrowser()) {

            if (document.getElementById("helpDisplayDivId").style.width > '30%') {
                if (document.getElementById("filescannerDivId").style.display == "block") {
                    document.getElementById("filescannerDivId").style.width = "70%";
                    document.getElementById("projectscannerDivId").style.width = "30%";
                }
                document.getElementById("mainContainer").style.width = "70%";
                document.getElementById("helpDisplayDivId").style.width = "30%";
            } else {
                document.getElementById("mainContainer").style.width = "20%";
                document.getElementById("helpDisplayDivId").style.width = "80%";
                if (document.getElementById("filescannerDivId").style.display == "block") {
                    document.getElementById("filescannerDivId").style.width = "50%";
                    document.getElementById("projectscannerDivId").style.width = "50%";
                }

            }
        }

    } else {

        if (!onMobileBrowser()) {

            if (document.getElementById("helpDisplayDivId").style.width > '30%') {
                document.getElementById("mainContainer").style.width = "70%";
                document.getElementById("helpDisplayDivId").style.width = "30%";
            } else {
                document.getElementById("mainContainer").style.width = "20%";
                document.getElementById("helpDisplayDivId").style.width = "80%";
            }
        }
    }

}

function Show(pageName) {
    //console.log ("Show called for page " + pageName);

    document.getElementById("filelvlhelpdivid").style.display = "none";

    if (onMobileBrowser()) {

        var x = document.getElementById("myTopnav");
        x.className = "topnav";

    } else {

    }

    document.getElementById("helpDisplayDivId").style.display = "block";
    //Update url

    document.getElementById("languageScanResultDivId").style.display = "none";
    document.getElementById("languageOverride").style.display = "none";
    document.getElementById("helpDetailsDivId").style.display = "none";
    document.getElementById("loginDivId").style.display = "none";
    document.getElementById("contactusDivId").style.display = "none";
    document.getElementById("howtoDivId").style.display = "none";
    document.getElementById("homeDivId").style.display = "none";

    document.getElementById("itemDivId").style.display = "none";
    document.getElementById("itemListDivId").style.display = "none";
    document.getElementById("itemEditDivId").style.display = "none";

    myUrl = window.location.protocol + "//" + window.location.host +
        window.location.pathname + "?target=" + pageName;

    //window.open(myUrl + "?target=" + pageName, "_self");


    const nextURL = myUrl;
    const nextTitle = 'Code Helper';
    const nextState = {
        additionalInformation: 'Updated the URL with JS'
    };

    // This will create a new entry in the browser's history, without reloading
    window.history.pushState(nextState, nextTitle, nextURL);


    x = document.getElementById("filescannerLinkId");
    x.classList.remove("active");

    x = document.getElementById("projectscannerLinkId");
    x.classList.remove("active");

    x = document.getElementById("HelpTopicsLinkId");
    x.classList.remove("active");

    x = document.getElementById("loginLinkId");
    x.classList.remove("active");

    x = document.getElementById("logoutLinkId");
    x.classList.remove("active");

    x = document.getElementById("profileLinkId");
    x.classList.remove("active");

    x = document.getElementById("contactusLinkId");
    x.classList.remove("active");

    x = document.getElementById("howtoLinkId");
    x.classList.remove("active");

    x = document.getElementById("homeLinkId");
    x.classList.remove("active");

    x = document.getElementById("itemLinkId");
    x.classList.remove("active");

    populateLanguages("helpTopics-lang-box");

    x = document.getElementById(pageName + "LinkId");
    x.className += " active";

    //document.getElementById("mainContainer").style.width = "70%";

    if (pageName == "filescanner") {
        document.getElementById("bgSVGId").style.display = "none";

        document.getElementById("btnCloseFileScanner").style.display = "none";
        document.getElementById("HelpTopicsDivId").style.display = "none";
        document.getElementById("projectscannerDivId").style.display = "none"

        document.getElementById("filescannerDivId").style.display = "block"
        document.getElementById("filescannerDivId").style.width = "100%";




        document.getElementById("helpDivMessage").innerHTML = '<i class="fa fa-info-circle" style="display:none; float: left;  position: absolute; top:35px; left: 10px; color:orange;" ></i>' + "Enter the code in the text area on the left or select a file using 'Open File' button. <br> Click on the scan button to view the help codes available."

        /******************SM TODO********************/
        var default_text =
            "//Either paste the code here or select code file using 'Open File' button and click on Scan button.";
        var textArea = $('#source')[0];
        $('#source').val(default_text);

        if (the.use_codemirror && typeof CodeMirror !== 'undefined') {

            if (!the.editor) {
                the.editor = CodeMirror.fromTextArea(textArea, {
                    lineNumbers: true
                });
                set_editor_mode();
                the.editor.focus();
            }
            $('.CodeMirror').click(function () {
                //console.log("Area clicked 1");
                if (the.editor.getValue() === default_text) {
                    the.editor.setValue('');
                }
            });
        } else {
            $('#source').bind('click focus', function () {
                if ($(this).val() === default_text) {
                    $(this).val('');
                }
            }).bind('blur', function () {
                if (!$(this).val()) {
                    //console.log("bind blur 1");
                    $(this).val(default_text);
                }
            });
        }



    } else if (pageName == "projectscanner") {
        document.getElementById("bgSVGId").style.display = "none";
        if ((localStorage.getItem("userLoggedIn") == "y") && (localStorage.getItem("userLvl") == "9")) {
            document.getElementById("addNewProjBtnId").style.display = "block";
        } else {
            document.getElementById("addNewProjBtnId").style.display = "none";
        }

        if (document.getElementById("projectscannerDivId").style.display == "none") {
            document.getElementById("HelpTopicsDivId").style.display = "none";
            document.getElementById("projectscannerDivId").style.display = "block"


            document.getElementById("filescannerDivId").style.display = "none"
            document.getElementById("projectscannerDivId").style.width = "100%";

        }
        populateStoredProjectList();
        showHelpDivMessage("Upload project files and click on the file to scan the code");

    } else if (pageName == "HelpTopics") {
        document.getElementById("bgSVGId").style.display = "none";
        document.getElementById("filescannerDivId").style.display = "none";
        document.getElementById("projectscannerDivId").style.display = "none"

        document.getElementById("HelpTopicsDivId").style.display = "block";
        document.getElementById("HelpTopicsDivId").style.width = "100%";


        //document.getElementById("helpDivMessage").innerHTML = "Click on the help code to view the help details"
        showHelpDivMessage("Select language to display the help content list available then click on the help code to view the help details");
    } else if (pageName == "item") {
        document.getElementById("filescannerDivId").style.display = "none";
        document.getElementById("projectscannerDivId").style.display = "none"
        document.getElementById("HelpTopicsDivId").style.display = "none";
        document.getElementById("helpDisplayDivId").style.display = "none";
        document.getElementById("itemDivId").style.display = "none";
        //document.getElementById("itemDivId").style.display = "block";
        //document.getElementById("itemDivId").style.width = "100%";

        document.getElementById("itemListDivId").style.display = "block";
        document.getElementById("itemListDivId").style.width = "100%";
        populateItemsList();
        $(".cardsContainerDivClassPadd").css("height", "200px");

    } else if (pageName == "login") {
        document.getElementById("filescannerDivId").style.display = "none";
        document.getElementById("HelpTopicsDivId").style.display = "none";
        document.getElementById("projectscannerDivId").style.display = "none";

        document.getElementById("loginDivId").style.display = "block";

        document.getElementById("loginSecDivId").style.display = "block";
        document.getElementById("registerSecDivId").style.display = "none";
        document.getElementById("forgotPasswordSecDivId").style.display = "none";
        document.getElementById("accActivatedDivId").style.display = "none";
        document.getElementById("forgotPWDivId").style.display = "none";

        //document.getElementById("loginDivId").style.width = "70%";


        document.getElementById("loginerrormsg").innerHTML = "";

        //document.getElementById("helpDisplayDivId").style.width = "30%";


        showHelpDivMessage("Login to add or make updates to the help scan codes");
    } else if (pageName == "profile") {
        document.getElementById("bgSVGId").style.display = "none";
        showProfile();


    } else if (pageName == "contactus") {
        document.getElementById("filescannerDivId").style.display = "none";
        document.getElementById("HelpTopicsDivId").style.display = "none";
        document.getElementById("projectscannerDivId").style.display = "none";
        document.getElementById("contactusDivId").style.display = "block";
        //document.getElementById("contactusDivId").style.width = "70%";


        document.getElementById("contactuserrormsg").innerHTML = "";


        refreshCaptcha();

        //document.getElementById("helpDisplayDivId").style.width = "30%";
        document.getElementById("helpDisplayDivId").style.display = "none";
        //showHelpDivMessage("Contact us if you have any questions, feedback or are interested in purchasing the software. Some features have been disabled on the web version for security reasons. Full feature software can be used for software training/development, creating references, documentation for the software application and adding own customizations. <br><br> If you found the site helpful, you can support our work by buying me a coffee using the coffee button at the top.");

    } else if (pageName == "howto") {
        document.getElementById("bgSVGId").style.display = "none";
        document.getElementById("filescannerDivId").style.display = "none";
        document.getElementById("HelpTopicsDivId").style.display = "none";
        document.getElementById("projectscannerDivId").style.display = "none";
        document.getElementById("helpDisplayDivId").style.display = "none";
        document.getElementById("contactusDivId").style.display = "none";
        document.getElementById("howtoDivId").style.display = "block";
        document.getElementById("howtoDivId").style.width = "95%";
        //document.getElementById("mainContainer").style.width = "100%";
        listVideos();


    } else if (pageName == "home") {
        document.getElementById("filescannerDivId").style.display = "none";
        document.getElementById("HelpTopicsDivId").style.display = "none";
        document.getElementById("projectscannerDivId").style.display = "none";
        document.getElementById("helpDisplayDivId").style.display = "none";
        document.getElementById("contactusDivId").style.display = "none";
        document.getElementById("howtoDivId").style.display = "none";
        document.getElementById("homeDivId").style.display = "block";
        document.getElementById("homeDivId").style.width = "100%";
        //document.getElementById("mainContainer").style.width = "100%";
    }

    //Scroll to top
    $('html,body').scrollTop(0);
}

function showCreateAccount() {
    document.getElementById("loginSecDivId").style.display = "none";
    document.getElementById("registerSecDivId").style.display = "block";
}

function showLogin() {
    document.getElementById("loginSecDivId").style.display = "block";
    document.getElementById("registerSecDivId").style.display = "none";
    document.getElementById("forgotPasswordSecDivId").style.display = "none";
    document.getElementById("accActivatedDivId").style.display = "none";
    document.getElementById("forgotPWDivId").style.display = "none";
}

function showForgotPassword() {
    document.getElementById("loginSecDivId").style.display = "none";
    document.getElementById("forgotPasswordSecDivId").style.display = "block";
}


function listVideos() {

    var tf = JSON.parse(sessionStorage.getItem("HowToVideos"));

    if (tf == null) {
        return;
    }
    var rows = JSON.parse(tf);

    if (rows.length < 2) {
        return;
    }
    var innerHTML = '';

    innerHTML = innerHTML + "<div class='videoListContainer'>";

    innerHTML = innerHTML + '<div id="prjSelectionMsg" style=" padding: 5px; text-align: justify; text-justify: inter-word; border: 1px solid #ccc; color: #f1f1f1;background: rgba(9, 84, 132, 1); margin-Bottom: 0px">How to videos</div>';



    for (var i = 0; i < rows.length; i++) {
        var description = rows[i].description;
        var url = rows[i].url;

        innerHTML = innerHTML + "<div class='videoDescription'>" + description + "</div> <div class='videoIframeDiv'><iframe class='videoIframe' src= '" + url + "'> </iframe>"
    }
    innerHTML = innerHTML + "</div>";

    document.getElementById("howtoDivId").innerHTML = innerHTML;

}
function showMobileMenu(pageName) {
}


function checkURL() {
    //console.log("inside checkURL");



    var myUrl = window.location.protocol + "//" + window.location.host +
        window.location.pathname;

    var LocationSearchStr = location.search;
    var find = '%20';
    var re = new RegExp(find, 'g');
    var pageName = "";
    var path = window.location.pathname;

    LocationSearchStr = LocationSearchStr.replace(re, ' ');

    if (LocationSearchStr.indexOf('passkey=') > 0) {
        var ar = LocationSearchStr.split('passkey=');
        var accountactivationkey = ar[1];
        activateAccount(accountactivationkey);
        return;
    }
    if (localStorage.getItem("cookieAccepted") == "y") {
        document.getElementById("cookie-div-id").style.display = "none"
    }

    var myCookie = getCookie("cookname");

    if (myCookie == null) {
        localStorage.setItem("userLoggedIn", "n");
        if (!onMobileBrowser()) {
            document.getElementById("loginLinkId").style.display = "block";
        }
        document.getElementById("logoutLinkId").style.display = "none";
        document.getElementById("profileLinkId").style.display = "none";
        document.getElementById("HelpTopicsLinkId").style.display = "none";

    } else {

        localStorage.setItem("userLoggedIn", "y");
        document.getElementById("loginLinkId").style.display = "none";
        document.getElementById("logoutLinkId").style.display = "block";
        document.getElementById("profileLinkId").style.display = "block";
        if (localStorage.getItem("userLvl") == "9") {
            the.smusr = true;
        }

        $.ajax({
            url: the.hosturl + '/php/process.php',
            data: { usrfunction: "checklogin" },
            type: 'POST',
            dataType: 'json',
            success: function (retstatus) {
                if (retstatus == "err") {
                    localStorage.setItem("userLoggedIn", "n");
                    if (!onMobileBrowser()) {
                        document.getElementById("loginLinkId").style.display = "block";
                    }
                    document.getElementById("logoutLinkId").style.display = "none";
                    document.getElementById("profileLinkId").style.display = "none";
                }
            },
            error: function (xhr, status, error) {

            }
        });

    }



    if (path.indexOf('items/') > 0) {
        //var shoptitle = path.replaceAll("/antaksharee/lyrics/","");

        if (sessionStorage.getItem("itemsList") == null) {
            document.getElementById("loaderDivId").style.display = "block";
            setTimeout(function () {
                document.getElementById("loaderDivId").style.display = "none";
                checkURL();
            }, 500);
            return;
        }

        document.getElementById("languageScanResultDivId").style.display = "none";
        document.getElementById("languageOverride").style.display = "none";
        document.getElementById("helpDetailsDivId").style.display = "none";
        document.getElementById("loginDivId").style.display = "none";
        document.getElementById("contactusDivId").style.display = "none";
        document.getElementById("howtoDivId").style.display = "none";
        document.getElementById("homeDivId").style.display = "none";

        document.getElementById("filescannerDivId").style.display = "none";
        document.getElementById("projectscannerDivId").style.display = "none"

        document.getElementById("HelpTopicsDivId").style.display = "none";
        document.getElementById("helpDisplayDivId").style.display = "none";

        document.getElementById("itemDivId").style.display = "block";

        document.getElementById("itemEditDivId").style.display = "block";


        var itemstr = path.substring(path.indexOf("items/") + 6);

        if (screen.width < 700 || window.innerWidth < 700) {
            //document.getElementById("itemsearchDivId").style.display = "none";
            document.getElementById("itemEditDivId").style.display = "none";
        } else {
            //populateItemsList();
        }

        if (itemstr.indexOf('/') > 0) {
            document.getElementById("mainContainer").style.width = "100%";
            document.getElementById("itemEditDivId").style.width = "20%";
            document.getElementById("itemEditDivId").innerHTML = "";
            getItem(itemstr);
        } else {
            itemstr = decodeURI(itemstr);
            document.getElementById("itemDivId").style.display = "none";
            document.getElementById("itemEditDivId").style.display = "none";
            document.getElementById("itemListDivId").style.display = "block";
            document.getElementById("itemListDivId").style.width = "100%";
            //populateItemsList();
            showcategory(itemstr)
        }


        return;
    }

    if (LocationSearchStr.indexOf('resetkey=') > 0) {
        var ar = LocationSearchStr.split('resetkey=');
        var passwordresetkey = ar[1];
        //resetPassword(passwordresetkey);
        sessionStorage.setItem("passwordresetkey", passwordresetkey);

        document.getElementById("helpDisplayDivId").style.display = "block";
        //Update url

        document.getElementById("languageScanResultDivId").style.display = "none";
        document.getElementById("languageOverride").style.display = "none";
        document.getElementById("helpDetailsDivId").style.display = "none";
        document.getElementById("contactusDivId").style.display = "none";
        document.getElementById("howtoDivId").style.display = "none";

        document.getElementById("filescannerDivId").style.display = "none";
        document.getElementById("HelpTopicsDivId").style.display = "none";
        document.getElementById("projectscannerDivId").style.display = "none";
        document.getElementById("loginDivId").style.display = "block";
        //document.getElementById("loginDivId").style.width = "70%";



        document.getElementById("loginerrormsg").innerHTML = "";

        //document.getElementById("helpDisplayDivId").style.width = "30%";


        showHelpDivMessage("Login to add or make updates to the help scan codes");

        document.getElementById("loginSecDivId").style.display = "none";
        document.getElementById("forgotPWDivId").style.display = "block";
        return;
    }

    if (LocationSearchStr.indexOf('target=') > 0) {
        var ar = LocationSearchStr.split('target=');
        pageName = ar[1];
    }

    if (onMobileBrowser()) {
        //alert("On mobile")
        //showMobileMenu(pageName);

        //return;
    } else {

    }

    //  if (sessionStorage.getItem("LanguageHelpCodeAndIds") == null) {
    //     document.getElementById("loaderDivId").style.display = "block";
    //     setTimeout(function() {
    //         //console.log("LanguageHelpCodeAndIds is null. Will retry after 1 seconds");
    //         document.getElementById("loaderDivId").style.display = "none";
    //         checkURL();
    //     }, 1000);
    //     return;
    // } else {
    //     the.LanguageHelpCodeAndIds_LclJson = JSON.parse(sessionStorage.getItem("LanguageHelpCodeAndIds"));
    // }

    document.getElementById("filescannerDivId").style.display = "none";
    document.getElementById("HelpTopicsDivId").style.display = "none";
    document.getElementById("projectscannerDivId").style.display = "none";
    document.getElementById("loginDivId").style.display = "none";
    document.getElementById("contactusDivId").style.display = "none";
    document.getElementById("howtoDivId").style.display = "none";
    document.getElementById("homeDivId").style.display = "none";
    document.getElementById("itemDivId").style.display = "none";
    document.getElementById("itemListDivId").style.display = "none";
    document.getElementById("itemEditDivId").style.display = "none";



    populateLanguages("helpTopics-lang-box");
    try {
        x = document.getElementById(pageName + "LinkId");
        x.className += " active";
        document.getElementById(pageName + "DivId").style.display = "block";
    } catch {
    }

    if (pageName == "HelpTopics") {

        if ((localStorage.getItem("userLoggedIn") == "n") || (localStorage.getItem("userLvl") != "9")) {
            //pageName = "projectscanner";
            Show("projectscanner");
            return
        }

        populateHelpTopics();
        document.getElementById("HelpTopicsDivId").style.width = "100%";

    } else if (pageName == "projectscanner") {
        document.getElementById("bgSVGId").style.display = "none";
        populateStoredProjectList();
        if ((localStorage.getItem("userLoggedIn") == "y") && (localStorage.getItem("userLvl") == "9")) {
            document.getElementById("addNewProjBtnId").style.display = "block";
        }
        document.getElementById("projectscannerDivId").style.width = "100%";
        document.getElementById("helpDivMessage").innerHTML = '<i class="fa fa-info-circle" style="display:none; float: left;  position: absolute; top:35px; left: 10px; color:orange;" ></i>' + "Upload project files and click on the file to scan the code"
    } else if (pageName == "login") {
        document.getElementById("filescannerDivId").style.display = "none";
        document.getElementById("HelpTopicsDivId").style.display = "none";
        document.getElementById("projectscannerDivId").style.display = "none";
        document.getElementById("loginDivId").style.display = "block";
        document.getElementById("helpDisplayDivId").style.display = "none";

        //showHelpDivMessage("Login to add or make updates to the help scan codes");
    } else if (pageName == "contactus") {
        document.getElementById("filescannerDivId").style.display = "none";
        document.getElementById("HelpTopicsDivId").style.display = "none";
        document.getElementById("projectscannerDivId").style.display = "none";
        document.getElementById("contactusDivId").style.display = "block";


        refreshCaptcha();
        document.getElementById("helpDisplayDivId").style.display = "none";
        //showHelpDivMessage("Contact us if you have any questions, feedback or are interested in purchasing the software. Some features have been disabled on the web version for security reasons. Full feature software can be used for software training/development, creating references and documentation for the software application. <br><br> If you found the site helpful, you can support our work by buying me a coffee by clicking on the coffee button at the top.");

    } else if (pageName == "profile") {
        document.getElementById("bgSVGId").style.display = "none";
        showProfile();
    } else if (pageName == "howto") {
        document.getElementById("bgSVGId").style.display = "none";
        document.getElementById("filescannerDivId").style.display = "none";
        document.getElementById("HelpTopicsDivId").style.display = "none";
        document.getElementById("projectscannerDivId").style.display = "none";
        document.getElementById("helpDisplayDivId").style.display = "none";
        document.getElementById("contactusDivId").style.display = "none";
        document.getElementById("howtoDivId").style.display = "block";
        document.getElementById("howtoDivId").style.width = "95%";
        //document.getElementById("mainContainer").style.width = "100%";
        listVideos();
    } else if (pageName == "filescanner") {
        document.getElementById("bgSVGId").style.display = "none";
        document.getElementById("btnCloseFileScanner").style.display = "none";
        if (localStorage.getItem("newWindowFileName") != null) {
            loadFile();

            localStorage.setItem("newWindowFileName", null);
            localStorage.setItem("newWindowFileObj", null);
        }
        document.getElementById("filescannerDivId").style.width = "100%";
    } else if (pageName == "item") {

        if (sessionStorage.getItem("itemsList") == null) {
            document.getElementById("loaderDivId").style.display = "block";
            setTimeout(function () {
                document.getElementById("loaderDivId").style.display = "none";
                checkURL();
            }, 500);
            return;
        }

        document.getElementById("filescannerDivId").style.display = "none";
        document.getElementById("HelpTopicsDivId").style.display = "none";
        document.getElementById("projectscannerDivId").style.display = "none";
        document.getElementById("helpDisplayDivId").style.display = "none";
        document.getElementById("contactusDivId").style.display = "none";
        document.getElementById("howtoDivId").style.display = "none";
        //document.getElementById("itemDivId").style.width = "100%";
        document.getElementById("itemDivId").style.display = "none";
        document.getElementById("itemEditDivId").style.display = "none";

        document.getElementById("itemListDivId").style.width = "100%";

        populateItemsList();
        //document.getElementById("mainContainer").style.width = "100%";
        $(".cardsContainerDivClassPadd").css("height", "200px");
    } else if (pageName == "") {

        if (sessionStorage.getItem("itemsList") == null) {
            document.getElementById("loaderDivId").style.display = "block";
            setTimeout(function () {
                document.getElementById("loaderDivId").style.display = "none";
                checkURL();
            }, 500);
            return;
        }

        document.getElementById("filescannerDivId").style.display = "none";
        document.getElementById("HelpTopicsDivId").style.display = "none";
        document.getElementById("projectscannerDivId").style.display = "none";
        document.getElementById("helpDisplayDivId").style.display = "none";
        document.getElementById("contactusDivId").style.display = "none";
        document.getElementById("howtoDivId").style.display = "none";
        //document.getElementById("itemDivId").style.width = "100%";
        document.getElementById("itemDivId").style.display = "none";
        document.getElementById("itemEditDivId").style.display = "none";

        document.getElementById("itemListDivId").style.width = "100%";

        //Likely request for store item display
        var storename = path.substring(path.indexOf(the.hosturl) + the.hosturl.length + 1);

        displayStore(storename);
        //populateItemsList();
        //document.getElementById("mainContainer").style.width = "100%";
        $(".cardsContainerDivClassPadd").css("height", "200px");
    } else if (pageName == "home") {
        document.getElementById("filescannerDivId").style.display = "none";
        document.getElementById("HelpTopicsDivId").style.display = "none";
        document.getElementById("projectscannerDivId").style.display = "none";
        document.getElementById("helpDisplayDivId").style.display = "none";
        document.getElementById("contactusDivId").style.display = "none";
        document.getElementById("howtoDivId").style.display = "none";
        document.getElementById("homeDivId").style.width = "100%";
        //document.getElementById("mainContainer").style.width = "100%";			
    }
}

function displayStore(storename) {

    var tf = JSON.parse(sessionStorage.getItem("itemsList"));
    var allRows = JSON.parse(tf);

    var storeRow = allRows.filter(function (entry) {
        var title = entry.title;
        var titleSpaceReplaced = title.replaceAll(' ', '-');
        return entry.discontinue == "0" && titleSpaceReplaced.toUpperCase() == storename.toUpperCase();
    });

    if (storeRow.length > 0) {
        document.getElementById("itemDivId").style.display = "block";
        getItem(storeRow[0].category + "/" + storeRow[0].storename + "/" + storeRow[0].title);
    } else {
        document.getElementById("itemDivId").innerHTML = "Sorry. The requested page is not found.<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>"
        document.getElementById("itemDivId").style.display = "block";
    }

}
function getItem(itemstr) {
    $.ajax({
        url: the.hosturl + '/php/process.php',
        type: 'POST',
        data: jQuery.param({
            usrfunction: "getItem",
            itemstr: itemstr
        }),
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        success: function (response) {

            tags = JSON.parse(response);
            if (tags[0].title == "Create My Store") {
                document.getElementById("itemListDivId").style.display = "none";
                document.getElementById("itemEditDivId").style.display = "none";
                getCreateStore(tags);
            } else if (tags[0].title != tags[0].storename) {
                getOneItemOfShop(tags);
                $(".cardsContainerDivClassPadd").css("width", "95%");
                $(".cardsContainerDivClassPadd").css("margin", "auto");
                $(".cardsContainerDivClassPadd").css("float", "none");
            } else {
                document.getElementById("itemListDivId").style.display = "none";
                document.getElementById("itemEditDivId").style.display = "none";
                getFullShopDetails(tags, itemstr);
            }
        },
        error: function (xhr, status, error) {
            //console.log(error);
            //console.log(xhr);
        }
    });
}

function getCreateStore(tags, itemstr) {
    var itemid = tags[0].itemid;
    var category = tags[0].category;
    var categoryseq = tags[0].categoryseq;
    var subcategory = tags[0].subcategory;
    var subcategoryseq = tags[0].subcategoryseq;
    var title = tags[0].title;
    var titleseq = tags[0].titleseq;
    var shortdescription = tags[0].shortdescription;
    var description = tags[0].description;
    var writer = tags[0].writer;
    var keywords = tags[0].keywords;
    var discontinue = tags[0].discontinue;


    var path = window.location.pathname;
    var myUrl = path.substring(0, path.indexOf('/', path.indexOf('smshopify')) + 1)

    //START: Find the next item to be put at the bottom of the page

    var tf = JSON.parse(sessionStorage.getItem("itemsList"));

    var nextItemTitle = "";
    var nextItemTitleURL = "";
    var allRows = JSON.parse(tf);

    var rows = allRows.filter(function (entry) {
        return entry.discontinue == "0" && entry.category == category;
    });

    var path = window.location.pathname;

    var storeRow = allRows.filter(function (entry) {
        return entry.discontinue == "0" && entry.title == tags[0].storename;
    });

    var itemUrl = path.substring(0, path.indexOf('/', path.indexOf('smshopify')) + 1) + "?target=item";
    var categoryUrl = path.substring(0, path.indexOf('/', path.indexOf('smshopify')) + 1) + "items/" + category;

    var newHTML = "" ;

    newHTML = newHTML + "<div classXX = 'shopContainer' >" ;

    //**********DO NOT DELETE********/
    // newHTML = newHTML +  '<a href ="' + itemUrl + '" class="itemTopLinkCls" ' + ' >' + "All Listings</a>" + " > " +
    //     '<a href ="' + categoryUrl + '" class="itemTopLinkCls"  >' + category + "</a>" + " > " +
    //     '<a href ="' + window.location.href + '" class="itemTopLinkCls"  >' + title + "</a>";
    // newHTML = newHTML + "<div classXX = 'shopContainerSub' > <h1 class='font_family_style1' > " + title + "</h1></div>";

    if (localStorage.getItem("userLoggedIn") == "n") {

    } else if (localStorage.getItem("userLvl") == "9") {

        sessionStorage.setItem("data-description", description);

        //newHTML = newHTML + '<button class="btn" data-itemid= "' + itemid + '" data-technology= "' + technology + '" data-technologyseq= "' + technologyseq + '" data-subpath= "' + subpath + '" data-subpathseq= "' + subpathseq + '" data-title= "' + title + '" data-titleseq= "' + titleseq + '" data-shortdescription= "' + shortdescription + '"  data-writer= "' + writer + '" data-keywords= "' + keywords +  '" data-discontinue= "' + discontinue  + '" onclick="editItem(this)" >Edit</button>';
        newHTML = newHTML + '<button class="btn" data-itemid= "' + itemid + '" data-category= "' + category + '" data-categoryseq= "' + categoryseq + '" data-subcategory= "' + subcategory + '" data-subcategoryseq= "' + subcategoryseq + '" data-title= "' + title + '" data-titleseq= "' + titleseq + '" data-shortdescription= "' + shortdescription + '"  data-writer= "' + writer + '" data-keywords= "' + keywords + '" data-discontinue= "' + discontinue + '" onclick="editItem(this)" >Edit</button>';

        //newHTML = newHTML + '<button class="btn" data-itemid= "' + itemid + '" data-itemprice= "' + tags[0].itemprice + '" data-itemimages= "' + tags[0].itemimages + '" data-itemdescription= "' + tags[0].itemdescription + '" data-displaylocationflag= "' + tags[0].displaylocationflag + '" data-maplocationcoordinates= "' + tags[0].maplocationcoordinates + '" data-address= "' + tags[0].address + '" data-uselocationfromaddress= "' + tags[0].uselocationfromaddress + '" data-coordinatesfromaddress= "' + tags[0].coordinatesfromaddress + '" data-displayhoursflag= "' + tags[0].displayhoursflag + '" data-hourshtml= "' + tags[0].hourshtml + '" data-availabilityinfo= "' + tags[0].availabilityinfo + '" data-storename= "' + tags[0].storename + '" data-bannerhtml= "' + tags[0].bannerhtml + '" data-reviewed= "' + tags[0].reviewed   + '" data-category= "' + category + '" data-categoryseq= "' + categoryseq + '" data-subcategory= "' + subcategory + '" data-subcategoryseq= "' + subcategoryseq + '" data-title= "' + title + '" data-titleseq= "' + titleseq + '" data-shortdescription= "' + shortdescription + '"  data-writer= "' + writer + '" data-keywords= "' + keywords + '" data-discontinue= "' + discontinue + '" onclick="editItem(this)" >Edit</button>';
    }
    newHTML = newHTML + '<div classXX="shopDeltsNImg">';
    newHTML = newHTML + '<div classXX="shopDelts">' + "<div class = 'shopLyrics' >";



    if (tags[0].description != undefined) {
        if (tags[0].description != "") {
            newHTML = newHTML
                + '<div id="selectStoreTypeDivId"></div> <span id="storeSelectedDivId" class="displayNone angledEdge slide-in-left fontsize_18px" style="animation-duration: 0.2">xyz</span> <div class="itemDescription displayNone">' + tags[0].description + '</div>';
        }
    }


    newHTML = newHTML + "</div>" + "</div>";

    newHTML = newHTML + '<br><br><div class="bottomNavigationCls">' + "</div> <br> <br>";


    newHTML = newHTML + '<br><br><br><br><br><br><br><br><br><hr><b>Send a message</b>' + document.getElementById("sndmsgdivid").innerHTML;

    document.getElementById("itemDivId").innerHTML = newHTML;
    refreshCaptcha();
    //showcategory(category);
    //START: Change the background color of the active item link 


    //var elemId = "itemDiv-" + itemid;
    //document.getElementById(elemId).style.backgroundColor = "orange";
    //END: Change the background color of the active item link

    var metaDesc = shortdescription;

    var metaKey = category + "," + subcategory + "," + title + "," + keywords;


    document.querySelector('meta[name="description"]').setAttribute("content", metaDesc);
    document.querySelector('meta[name="keywords"]').setAttribute("content", metaKey);
    //document.title = category + " " + subcategory + ". " + title ;
    document.title = category + " - " + title;

    sessionStorage.setItem("lastUrl", window.location.href);
    // if (localStorage.getItem("cookieAccepted") == "y"){
    //     document.getElementById("cookie-div-id").style.display = "none"
    // }

    const structuredData = {
        "@context": "https://schema.org/",
        "@type": "WebSite",
        "name": title,
        "url": "https://smshopify.com/" + itemstr,
        "datePublished": "2022-07-10",
        "description": metaDesc,
        "thumbnailUrl": "https://smshopify.com/images/banner.png"
    };

    let jsonLdScript = document.querySelector('script[type="application/ld+json"]');
    jsonLdScript.innerHTML = JSON.stringify(structuredData);

    setTimeout(function () {
        populateStoreType("selectStoreTypeDivId");
    }, 10);



    $('html, body').animate({
        scrollTop: $("#itemDivId").offset().top - 40
    }, 100);

}

function getOneItemOfShop(tags, itemstr) {

    var itemid = tags[0].itemid;
    var category = tags[0].category;
    var categoryseq = tags[0].categoryseq;
    var subcategory = tags[0].subcategory;
    var subcategoryseq = tags[0].subcategoryseq;
    var title = tags[0].title;
    var titleseq = tags[0].titleseq;
    var shortdescription = tags[0].shortdescription;
    var description = tags[0].description;
    var writer = tags[0].writer;
    var keywords = tags[0].keywords;
    var discontinue = tags[0].discontinue;


    var path = window.location.pathname;
    var myUrl = path.substring(0, path.indexOf('/', path.indexOf('smshopify')) + 1)

    //START: Find the next item to be put at the bottom of the page

    var tf = JSON.parse(sessionStorage.getItem("itemsList"));

    var nextItemTitle = "";
    var nextItemTitleURL = "";
    var allRows = JSON.parse(tf);

    var rows = allRows.filter(function (entry) {
        return entry.discontinue == "0" && entry.category == category;
    });

    var path = window.location.pathname;

    var storeRow = allRows.filter(function (entry) {
        return entry.discontinue == "0" && entry.title == tags[0].storename;
    });

    var itemUrl = path.substring(0, path.indexOf('/', path.indexOf('smshopify')) + 1) + "?target=item";
    var categoryUrl = path.substring(0, path.indexOf('/', path.indexOf('smshopify')) + 1) + "items/" + category;
    var storeUrl = path.substring(0, path.indexOf('/', path.indexOf('smshopify')) + 1) + "items/" + category + "/" + storeRow[0].title;

    var newHTML = "<div classXX = 'shopContainer' >" +
        '<a href ="' + itemUrl + '" class="itemTopLinkCls" ' + ' >' + "All Listings</a>" + " > " +
        '<a href ="' + categoryUrl + '" class="itemTopLinkCls"  >' + category + "</a>" + " > " +
        '<a href ="' + storeUrl + '" class="itemTopLinkCls"  >' + storeRow[0].title + "</a>" + " > " +
        '<a href ="' + window.location.href + '" class="itemTopLinkCls"  >' + title + "</a>";
    //END - Navigation Links

    newHTML = newHTML + "<div classXX = 'shopContainerSub' > <h1 classXX='shopContainerH1' > " + title + "</h1></div>";
    //END - Item name Heading


    if (localStorage.getItem("userLoggedIn") == "n") {

    } else if (localStorage.getItem("userLvl") == "9") {

        sessionStorage.setItem("data-description", description);
        newHTML = newHTML + '<button class="btn" data-itemid= "' + itemid + '" data-category= "' + category + '" data-categoryseq= "' + categoryseq + '" data-subcategory= "' + subcategory + '" data-subcategoryseq= "' + subcategoryseq + '" data-title= "' + title + '" data-titleseq= "' + titleseq + '" data-shortdescription= "' + shortdescription + '"  data-writer= "' + writer + '" data-keywords= "' + keywords + '" data-discontinue= "' + discontinue + '" onclick="editItem(this)" >Edit</button>';
    }
    newHTML = newHTML + "<div class = 'shopLyrics' >" + "<div class = 'storeItemDivCls' >";


    //Start: div class="itemImageshow-container"
    if (tags[0].itemimages != undefined) {
        if (tags[0].itemimages != "") {
            newHTML = newHTML
                + '<div class="itemImageshow-container"><div class="itmImgContainer">' + tags[0].itemimages + '</div></div>';
        }
    }
    //End: div class="itemImageshow-container"

    //Start: max_2box_responsive
    newHTML = newHTML + '<div class="max_2box_responsive_withsidenav padding_10px"><div class="margin_auto maxwidth_300px">';

    if (tags[0].itemprice != undefined) {
        if (tags[0].itemprice != "") {
            newHTML = newHTML
                + '<div class="itemPrice ">' + tags[0].itemprice + '</div>';
        }
    }

    if (tags[0].itemdescription != undefined) {
        if (tags[0].itemdescription != "") {
            newHTML = newHTML
                + '<div class="itemDescription ">' + tags[0].itemdescription + '</div>';
        }
    }

    newHTML = newHTML + '</div></div>';
    //End: max_2box_responsive


    //Start: max_2box_responsive
    newHTML = newHTML + '<div class="max_2box_responsive_withsidenav padding_10px"><div class="margin_auto maxwidth_300px text_align_center">';

    if (storeRow[0].displaylocationflag != undefined) {
        if (storeRow[0].displaylocationflag != "xyx") {
            newHTML = newHTML
                + '<div id="storeMapDivId" class="minheight_200px"> &nbsp;<br><br><br></div>';


            setTimeout(function () {
                var latitude = 28.2683684;
                var longitude = 78.6824194000001;
                const map = L.map("storeMapDivId").setView([latitude, longitude], 5);
                L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
                L.marker([latitude, longitude]).addTo(map);
            }, 10);

        }
    }
    if (storeRow[0].displayhoursflag != undefined) {
        if (storeRow[0].displayhoursflag != "xyz") {
            newHTML = newHTML
                + '<div class="font_size_12px">' + storeRow[0].hourshtml + '</div>';
        }
    }
    newHTML = newHTML + '</div></div>';
    //End: max_2box_responsive


    newHTML = newHTML + "</div></div></div>";
    //End1: storeItemDivCls
    //End2: shopLyrics
    //End3: shopContainer

    // if (description == undefined) {
    //     newHTML = "<div class = 'shopContainer' >Page not found</div>";
    // }

    // if (nextItemTitle != "") {
    //     newHTML = newHTML + '<br><br><div class="bottomNavigationCls">' + 'Next: <a href ="' + nextItemTitleURL + '" class="itemTopLinkCls"  >' + nextItemTitle + "</a></div> <br> <br>";

    // }

    newHTML = newHTML + '<br><br><br><br><br><br><br><br><br><hr><b>Send a message</b>' + document.getElementById("sndmsgdivid").innerHTML;

    document.getElementById("itemDivId").innerHTML = newHTML;
    refreshCaptcha();

    showcategory(category);
    showAllShopItemsInLeftPane(storeRow[0].title);

    //START: Change the background color of the active item link 
    var elemId = "itemDiv-" + itemid;
    document.getElementById(elemId).style.backgroundColor = "orange";
    //END: Change the background color of the active item link

    var metaDesc = shortdescription;

    var metaKey = category + "," + subcategory + "," + title + "," + keywords;


    document.querySelector('meta[name="description"]').setAttribute("content", metaDesc);
    document.querySelector('meta[name="keywords"]').setAttribute("content", metaKey);
    //document.title = category + " " + subcategory + ". " + title ;
    document.title = category + " - " + title;

    sessionStorage.setItem("lastUrl", window.location.href);
    // if (localStorage.getItem("cookieAccepted") == "y"){
    //     document.getElementById("cookie-div-id").style.display = "none"
    // }

    const structuredData = {
        "@context": "https://schema.org/",
        "@type": "WebSite",
        "name": title,
        "url": "https://smshopify.com/" + itemstr,
        "datePublished": "2022-07-10",
        "description": metaDesc,
        "thumbnailUrl": "https://smshopify.com/images/banner.png"
    };

    let jsonLdScript = document.querySelector('script[type="application/ld+json"]');
    jsonLdScript.innerHTML = JSON.stringify(structuredData);


    $('html, body').animate({
        scrollTop: $("#itemDivId").offset().top - 40
    }, 100);


}

function getFullShopDetails(tags, itemstr) {

    var itemid = tags[0].itemid;
    var category = tags[0].category;
    var categoryseq = tags[0].categoryseq;
    var subcategory = tags[0].subcategory;
    var subcategoryseq = tags[0].subcategoryseq;
    var title = tags[0].title;
    var titleseq = tags[0].titleseq;
    var shortdescription = tags[0].shortdescription;
    var description = tags[0].description;
    var writer = tags[0].writer;
    var keywords = tags[0].keywords;
    var discontinue = tags[0].discontinue;


    var path = window.location.pathname;
    var myUrl = path.substring(0, path.indexOf('/', path.indexOf('smshopify')) + 1)

    //START: Find the next item to be put at the bottom of the page

    var tf = JSON.parse(sessionStorage.getItem("itemsList"));

    var nextItemTitle = "";
    var nextItemTitleURL = "";
    var allRows = JSON.parse(tf);

    var rows = allRows.filter(function (entry) {
        return entry.discontinue == "0" && entry.category == category;
    });

    var path = window.location.pathname;

    var storeItems = allRows.filter(function (entry) {
        return entry.discontinue == "0" && entry.storename == tags[0].storename && entry.title != tags[0].storename;
    });


    var itemUrl = path.substring(0, path.indexOf('/', path.indexOf('smshopify')) + 1) + "?target=item";
    var categoryUrl = path.substring(0, path.indexOf('/', path.indexOf('smshopify')) + 1) + "items/" + category;

    var newHTML = "<div classXX = 'shopContainer' >" +
        '<a href ="' + itemUrl + '" class="itemTopLinkCls" ' + ' >' + "All Listings</a>" + " > " +
        '<a href ="' + categoryUrl + '" class="itemTopLinkCls"  >' + category + "</a>" + " > " +
        '<a href ="' + window.location.href + '" class="itemTopLinkCls"  >' + title + "</a>";

    //END - Navigation Links

    newHTML = newHTML + "<div classXX = 'shopContainerSub' > <h1 classXX='shopContainerH1' > " + title + "</h1></div>";
    //END - Item name Heading

    if (localStorage.getItem("userLoggedIn") == "n") {

    } else if (localStorage.getItem("userLvl") == "9") {

        sessionStorage.setItem("data-description", description);

        newHTML = newHTML + '<button class="btn" data-itemid= "' + itemid + '" data-category= "' + category + '" data-categoryseq= "' + categoryseq + '" data-subcategory= "' + subcategory + '" data-subcategoryseq= "' + subcategoryseq + '" data-title= "' + title + '" data-titleseq= "' + titleseq + '" data-shortdescription= "' + shortdescription + '"  data-writer= "' + writer + '" data-keywords= "' + keywords + '" data-discontinue= "' + discontinue + '" onclick="editItem(this)" >Edit</button>';

    }
    newHTML = newHTML + "<div class = 'shopLyrics' >" + "<div class = 'storeItemDivCls' >";

    //Start: div class="slides"
    if (tags[0].bannerhtml != undefined) {
        if (tags[0].bannerhtml != "") {
            newHTML = newHTML
                + '<div class="slides">' + tags[0].bannerhtml + '</div>';
        }
    }

    if (tags[0].description != undefined) {
        if (tags[0].description != "") {
            newHTML = newHTML
                + '<div class="shopDescriptionCls bgcolor_2 padding_50px color_white margin_10px">' + tags[0].description + '</div>';
        }
    }

    //End: div class="slides"

    //Start: Have Info- Desc/Hours/Location under one parent div
    newHTML = newHTML + '<div class="flex_container_align_center">';
    //Start: max_2box_responsive
    newHTML = newHTML + '<div class="max_2box_responsive padding_10px"><div class="margin_auto maxwidth_300px">';

    if ((tags[0].uselocationfromaddress != undefined) && (tags[0].uselocationfromaddress != "")){
        var addrfields = tags[0].uselocationfromaddress.split("~");
        var shopAddr = "<div class='shpAddrClass'>";
        for (i = 0; i< addrfields.length; i++ ){
            tempval = addrfields[i].split("^");
            if (tempval[1].trim() != "") {
                if (shopAddr != "<div class='shpAddrClass'>"){
                    shopAddr = shopAddr + ", " + tempval[1] ;
                } else{
                    shopAddr = shopAddr + "Address: " +  tempval[1] ;
                }
                
            }
            
        }
        newHTML = newHTML + shopAddr + '</div>';
    }

    if (tags[0].displaylocationflag != undefined) {
        if (tags[0].displaylocationflag != "xyx") {
            newHTML = newHTML
                + '<div id="storeMapDivId" class="minheight_200px" >&nbsp; <br><br><br>' + '</div>Note: Location on the map is approximate';


            setTimeout(function () {
                var latitude = 28.2683684;
                var longitude = 78.6824194000001;
                const map = L.map("storeMapDivId").setView([latitude, longitude], 5);
                L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
                L.marker([latitude, longitude]).addTo(map);
            }, 10);

        }
    }




    newHTML = newHTML + '</div></div>';
    //End: max_2box_responsive

    //Start: max_2box_responsive
    newHTML = newHTML + '<div class="max_2box_responsive padding_10px"><div class="margin_auto maxwidth_300px text_align_center">';

    if (tags[0].displayhoursflag != undefined) {
        if (tags[0].displayhoursflag != "xyz") {
            newHTML = newHTML
                + '<div class="font_size_12px">' + tags[0].hourshtml + '</div>';
        }
    }

    newHTML = newHTML + '</div></div>';
    //End: max_2box_responsive

    newHTML = newHTML + '</div>';
    //End: Have Info- Desc/Hours/Location under one parent div


    //newHTML = newHTML + '<div class="fullwidthdummydiv bottom_shadow">&nbsp;</div>';

    for (i = 0; i < storeItems.length; i++) {

        //Start: Have Item image, Details under one parent div
        newHTML = newHTML + '<div class="flex_container_align_center box_shadow5 bgcolor_1 marginbottom_50px">';

        //Start: max_2box_responsive
        newHTML = newHTML + '<div class="max_2box_responsive padding_10px"><div class="margin_auto text_align_center">';

        if (storeItems[i].itemimages != undefined) {
            if (storeItems[i].itemimages != "") {
                newHTML = newHTML + '<div class="itemImageshow-container"><div class="itmImgContainer">' + storeItems[i].itemimages + '</div></div>';
            }
        }
        //End: div class="itemImageshow-container"

        newHTML = newHTML + '</div></div>';
        //End: max_2box_responsive

        //Start: max_2box_responsive
        newHTML = newHTML + '<div class="max_2box_responsive padding_10px"><div class="margin_auto text_align_center">';

        if (storeItems[i].itemprice != undefined) {
            if (storeItems[i].itemprice != "") {
                newHTML = newHTML
                    + '<div class="itemPrice ">' + storeItems[i].itemprice + '</div>';
            }
        }

        if (storeItems[i].itemdescription != undefined) {
            if (storeItems[i].itemdescription != "") {
                newHTML = newHTML
                    + '<div class="itemDescription ">' + storeItems[i].itemdescription + '</div>';
            }
        }

        newHTML = newHTML + '</div></div>';
        //End: max_2box_responsive

        newHTML = newHTML + '</div>';
        //End: Have Item image, Details under one parent div
    }

    //newHTML = newHTML + '<div class="fullwidthdummydiv height_300px"></div>';



    newHTML = newHTML + "</div></div></div></div></div>";
    //End1: storeItemDivCls
    //End2: shopLyrics
    //End3: shopContainer


    // if (description == undefined) {
    //     newHTML = "<div class = 'shopContainer' >Page not found</div>";
    // }

    // if (nextItemTitle != "") {
    //     newHTML = newHTML + '<br><br><div class="bottomNavigationCls">' + 'Next: <a href ="' + nextItemTitleURL + '" class="itemTopLinkCls"  >' + nextItemTitle + "</a></div> <br> <br>";

    // }

    newHTML = newHTML + '<br><br><br><br><br><br><br><br><br><hr><b>Send a message</b>' + document.getElementById("sndmsgdivid").innerHTML;



    document.getElementById("itemDivId").innerHTML = newHTML;
    refreshCaptcha();

    //START: Change the background color of the active item link 

    // showcategory(category);
    // var elemId = "itemDiv-" + itemid;
    // document.getElementById(elemId).style.backgroundColor = "orange";

    //END: Change the background color of the active item link

    var metaDesc = shortdescription;

    var metaKey = category + "," + subcategory + "," + title + "," + keywords;


    document.querySelector('meta[name="description"]').setAttribute("content", metaDesc);
    document.querySelector('meta[name="keywords"]').setAttribute("content", metaKey);
    //document.title = category + " " + subcategory + ". " + title ;
    document.title = category + " - " + title;

    sessionStorage.setItem("lastUrl", window.location.href);
    // if (localStorage.getItem("cookieAccepted") == "y"){
    //     document.getElementById("cookie-div-id").style.display = "none"
    // }

    const structuredData = {
        "@context": "https://schema.org/",
        "@type": "WebSite",
        "name": title,
        "url": "https://smshopify.com/" + itemstr,
        "datePublished": "2022-07-10",
        "description": metaDesc,
        "thumbnailUrl": "https://smshopify.com/images/banner.png"
    };

    let jsonLdScript = document.querySelector('script[type="application/ld+json"]');
    jsonLdScript.innerHTML = JSON.stringify(structuredData);


    $('html, body').animate({
        scrollTop: $("#itemDivId").offset().top - 40
    }, 100);


}

//REF:https://stackoverflow.com/questions/18883601/function-to-calculate-distance-between-two-coordinates
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}

function editItem(btn) {
    itemid = btn.dataset.itemid;
    category = btn.dataset.category;
    categoryseq = btn.dataset.categoryseq;
    subcategory = btn.dataset.subcategory;
    subcategoryseq = btn.dataset.subcategoryseq;
    title = btn.dataset.title;
    titleseq = btn.dataset.titleseq;
    shortdescription = btn.dataset.shortdescription;
    //description = btn.dataset.description;
    description = sessionStorage.getItem("data-description");
    writer = btn.dataset.writer;
    keywords = btn.dataset.keywords;
    discontinue = btn.dataset.discontinue;

    $.ajax({
        url: the.hosturl + '/php/process.php',
        data: { usrfunction: "checksession" },
        type: 'POST',
        dataType: 'json',
        success: function (retstatus) {
            if (retstatus == "err") {
                //alert("Please relogin");
                goToLogin();
            }
        },
        error: function (xhr, status, error) {
            //console.log("")
        }
    });

    var newHTML = "<div class = 'shopContainer' >";
    newHTML = newHTML + " ";



    newHTML = newHTML +
        "<div class = 'editFieldHead'>Title: </div><br>"
        +
        "<input type='text'  id='title-" + itemid + "' style='width:95%; margin:auto;' value='" + title + "'>"
        + "";

    newHTML = newHTML +
        "<br><br><div class = 'editFieldHead'>Title Sort Sequence: </div><br>" +
        "<input type='text' id='titleseq-" + itemid + "' style='width:95%; margin:auto;' value='" + titleseq + "'>";

    newHTML = newHTML + "<br><br><div class = 'editFieldHead'>category: </div><br>" +
        "<input type='text' id='category-" + itemid + "' style='width:95%; margin:auto;'  value='" + category + "'>";

    newHTML = newHTML +
        "<br><br><div class = 'editFieldHead'>category Sort Sequence: </div><br>" +
        "<input type='text' id='categoryseq-" + itemid + "' style='width:95%; margin:auto;' value='" + categoryseq + "'>";

    newHTML = newHTML +
        "<br><br><div class = 'editFieldHead'>Path(not in use): </div><br>" +
        "<input type='text' id='subcategory-" + itemid + "' style='width:95%; margin:auto;' value='" + subcategory + "'>";

    newHTML = newHTML +
        "<br><br><div class = 'editFieldHead'>Path Sort Sequence(not in use): </div><br>" +
        "<input type='text' id='subcategoryseq-" + itemid + "' style='width:95%; margin:auto;' value='" + subcategoryseq + "'>";



    newHTML = newHTML +
        "<br><br><div class = 'editFieldHead'>Short Description: </div><br>" +
        "<textarea id='shortdescription-" + itemid + "' style='width:95%; margin:auto;' >" + shortdescription + "</textarea>";

    toolbarHTML = "";
    //toolbarHTML =  "<button  type='button' class='itmToggledBtn btn btn-primary' onclick=toggleDescView('" + itemid + "') >Toggle View</button>" + "<br>" ;

    toolbarHTML = toolbarHTML + "<div id='toolBarId' class = 'toolBar'><div>" +
        "<button  title='toggle desc view' type='button' class='itmUpdBtnSmall btn btn-primary' onclick=toggleDescView('" + itemid + "') >TglDesc</button>" +
        "<button  title='toggle hide' type='button' class='itmUpdBtnSmall btn btn-primary' onclick=toggleToolBarView() >TglHide</button>";

    //Shop - Topbanner*********************

    toolbarHTML = toolbarHTML + "<label class='toolBarlabel'>Div - shopTopBanner</label>"
        + getShopTopBannersList(itemid);

    //Shop - Items*********************

    toolbarHTML = toolbarHTML + "<label class='toolBarlabel'>Div - shopItems</label>"
        + "<button title='shopItem1' type='button' style='background: url(/smshopify/secimages/shopItem1.png); background-size: contain;' class='shopItem btn btn-primary' onclick=addComponent('" + itemid + "','shopItem1') ></button>";

    //Shop - Items*********************

    toolbarHTML = toolbarHTML + "<label class='toolBarlabel'>Div - Check Store Name Availability</label>"
        + "<button title='shopName1' type='button' style='background: url(/smshopify/secimages/shopName1.png); background-size: contain;' class='shopName btn btn-primary' onclick=addComponent('" + itemid + "','shopName1') ></button>";

    //Reveal Js Slide - Section - Divs*********************

    toolbarHTML = toolbarHTML + "<label class='toolBarlabel'>Div - Sections - Titles</label>"
        + "<button title='secTitlePlane1' type='button' style='background: url(/smshopify/secimages/secTitlePlane1.png); background-size: contain;' class='itmSecImg btn btn-primary' onclick=addComponent('" + itemid + "','secTitlePlane1') ></button>"

        + "<button title='secTitleWithBG' type='button' style='background: url(/smshopify/secimages/secTitleWithBG.png); background-size: contain;' class='itmSecImg btn btn-primary' onclick=addComponent('" + itemid + "','secTitleWithBG') ></button>"

        + "<button title='SemiTransBG' type='button' style='background: url(/smshopify/secimages/SemiTransBG.png); background-size: contain;' class='itmSecImg btn btn-primary' onclick=addComponent('" + itemid + "','SemiTransBG') ></button>"

        + "<button title='SemiTransBG2' type='button' style='background: url(/smshopify/secimages/SemiTransBG2.png); background-size: contain;' class='itmSecImg btn btn-primary' onclick=addComponent('" + itemid + "','SemiTransBG2') ></button>"

        + "<label class='toolBarlabel'>Div - Sections - Lists</label>"

        + "<button title='secWithList1' type='button' style='background: url(/smshopify/secimages/secWithList1.png); background-size: contain;' class='itmSecImg btn btn-primary' onclick=addComponent('" + itemid + "','secWithList1') ></button>"

        + "<button title='titleWithItems1' type='button' style='background: url(/smshopify/secimages/titleWithItems1.png); background-size: contain;' class='itmSecImg btn btn-primary' onclick=addComponent('" + itemid + "','titleWithItems1') ></button>"

        + "<button title='titleWithItems2' type='button' style='background: url(/smshopify/secimages/titleWithItems2.png); background-size: contain;' class='itmSecImg btn btn-primary' onclick=addComponent('" + itemid + "','titleWithItems2') ></button>"

        + "<button title='titleWithItems3' type='button' style='background: url(/smshopify/secimages/titleWithItems3.png); background-size: contain;' class='itmSecImg btn btn-primary' onclick=addComponent('" + itemid + "','titleWithItems3') ></button>"

        + "<label class='toolBarlabel'>Div - Code Explaination</label>"
        + "<button title='titleTextCode1' type='button' style='background: url(/smshopify/secimages/titleTextCode1.png); background-size: contain;' class='itmSecImg btn btn-primary' onclick=addComponent('" + itemid + "','titleTextCode1') ></button>"
        + "<button title='titleTextCode2' type='button' style='background: url(/smshopify/secimages/titleTextCode2.png); background-size: contain;' class='itmSecImg btn btn-primary' onclick=addComponent('" + itemid + "','titleTextCode2') ></button>"

        + "<label class='toolBarlabel'>Div - Quiz MCQ</label>"
        + "<button title='quizMCQFullScreen' type='button' style='background: url(/smshopify/secimages/quizMCQFullScreen.png); background-size: contain;' class='itmSecImg btn btn-primary' onclick=addComponent('" + itemid + "','quizMCQFullScreen') ></button>"
        + "<button title='quizMCQFullScreenLow' type='button' style='background: url(/smshopify/secimages/quizMCQFullScreenLow.png); background-size: contain;' class='itmSecImg btn btn-primary' onclick=addComponent('" + itemid + "','quizMCQFullScreenLow') ></button>"

        + "<label class='toolBarlabel'>Images</label>"
        + "<button title='zoomingImage1' type='button' style='background: url(/smshopify/secimages/zoomingImage1.png); background-size: contain;' class='itmSecImg btn btn-primary' onclick=addComponent('" + itemid + "','zoomingImage1') ></button>"
        + "<hr>"
        + "<label for='insertInner'>Insert component before active Div:</label>"
        + "<input type='checkbox' id='insertInner' >";
    //*************ANIMATION CLASSES************* */
    toolbarHTML = toolbarHTML + "<label class='toolBarlabel'>Animation Classes </label>"
        + "<div class='animList'> <b>CSS Style Format-</b> animation: 'property/AnimationName' 'duration' 'transitionTiming e.g. in cubic-bezier' 'optional:delay' 'optional:animation-iteration-count' 'optional:animation-fill-mode:both' 'optional:animation-direction: normal/reverse/alternate'"
        + "<br><br>Ex. " + escape("<div style='margin:auto; padding-top: 100px; animation-name: roll-in-left; animation-duration: 4s; animation-delay: 1s; animation-iteration-count: 3'>text</div>")
        + "<br><br> <b>To use with fragments add prefix fr-. Eg. animation-name:fr-bounce-right</b>"
        + "<br><br>Ex. " + escape("<div class='fragment fr-rotate-in-center' style='margin:auto; padding-top: 100px;  animation-duration: 4s; animation-delay: 0s; animation-iteration-count: 1'>text</div>")
        + "<br><br><b>ImageZooming:-</b> kenburns-top;  kenburns-left; kenburns-right; zoomingImg;"
        + "<br><br><b>Entrances(Reveal):-</b> scale-in-ver-top; scale-in-hor-center; scale-in-hor-right; scale-up-ver-top; slide-left; slide-right"
        + "<br><br><b>Entrances(Rotate):-</b> rotate-in-center; rotate-in-right; "
        + "<br><br><b>Entrances(Bounce):-</b> bounce-in-top; bounce-in-right; bounce-in-bottom; bounce-in-left; bounce-in-fwd; "
        + "<br><br><b>Entrances(Roll):-</b> roll-in-left; roll-in-top; roll-in-right; roll-in-bottom;  "
        + "<br><br><b>Entrances(Tilt):-</b> tilt-in-top-1; tilt-in-top-2; tilt-in-fwd-tr  "
        + "<br><br><b>Entrances(Swing):-</b> swing-in-top-fwd; swing-in-left-bck  "
        + "<br><br><b>Entrances(Text-Expand/Contract):-</b> tracking-in-expand;tracking-in-expand-fwd;tracking-in-contract-bck;tracking-in-contract;text-pop-up-top  "
        + "<br><br><b>Attention:-</b> shake-vertical; jello-diagonal-1; jello-horizontal;wobble-hor-bottom; wobble-hor-top; bounce-top; bounce-bottom; bounce-left; bounce-right  "
        + "<br><br><b>Others:-</b> slidingUp10px; slidingUp600px; slidingDown10px; slidingDown600px; slidingleft10px; slidingleft600px; slidingright10px; slidingright600px;"
        + "<br><br>slideFragmentUp10px;slideFragmentUp600px;slideFragmentDown10px;slideFragmentDown600px;slideFragmentLeft10px;slideFragmentLeft600px;slideFragmentRight10px; slideFragmentRight600px;"
        + "<br><br> </div>";

    //*************SOUNDS************* */
    toolbarHTML = toolbarHTML + "<label class='toolBarlabel'>Sounds (Click to insert at Carot) </label>"

        + "<button title='air-in-a-hit' type='button'  class='soundPreviewByTitle btn btn-primary' onmouseover='previewSound(this)' onclick=addComponent('" + itemid + "','air-in-a-hit') >air-in-a-hit</button>"
        + "<button title='arrow-whoosh' type='button'  class='soundPreviewByTitle btn btn-primary' onmouseover='previewSound(this)' onclick=addComponent('" + itemid + "','arrow-whoosh') >arrow-whoosh</button>"
        + "<button title='bell-ding-586' type='button'  class='soundPreviewByTitle btn btn-primary' onmouseover='previewSound(this)' onclick=addComponent('" + itemid + "','bell-ding-586') >bell-ding-586</button>"
        + "<button title='fast-blow' type='button'  class='soundPreviewByTitle btn btn-primary' onmouseover='previewSound(this)' onclick=addComponent('" + itemid + "','fast-blow') >fast-blow</button>"
        + "<button title='fast-sweep' type='button'  class='soundPreviewByTitle btn btn-primary' onmouseover='previewSound(this)' onclick=addComponent('" + itemid + "','fast-sweep') >fast-sweep</button>"
        + "<button title='keyboard-key-presses' type='button'  class='soundPreviewByTitle btn btn-primary' onmouseover='previewSound(this)' onclick=addComponent('" + itemid + "','keyboard-key-presses') >keyboard-key-presses</button>"
        + "<button title='page-flip-01a' type='button'  class='soundPreviewByTitle btn btn-primary' onmouseover='previewSound(this)' onclick=addComponent('" + itemid + "','page-flip-01a') >page-flip-01a</button>"
        + "<button title='paper-slide' type='button'  class='soundPreviewByTitle btn btn-primary' onmouseover='previewSound(this)' onclick=addComponent('" + itemid + "','paper-slide') >paper-slide</button>"
        + "<button title='pop' type='button'  class='soundPreviewByTitle btn btn-primary' onmouseover='previewSound(this)' onclick=addComponent('" + itemid + "','pop') >pop</button>"
        + "<button title='sand-swish' type='button'  class='soundPreviewByTitle btn btn-primary' onmouseover='previewSound(this)' onclick=addComponent('" + itemid + "','sand-swish') >sand-swish</button>"
        + "<button title='ui-zoom-in' type='button'  class='soundPreviewByTitle btn btn-primary' onmouseover='previewSound(this)' onclick=addComponent('" + itemid + "','ui-zoom-in') >ui-zoom-in</button>"
        + "<button title='low-arrow-whoosh' type='button'  class='soundPreviewByTitle btn btn-primary' onmouseover='previewSound(this)' onclick=addComponent('" + itemid + "','low-arrow-whoosh') >low-arrow-whoosh</button>"
        + "<button title='low-sand-swish' type='button'  class='soundPreviewByTitle btn btn-primary' onmouseover='previewSound(this)' onclick=addComponent('" + itemid + "','low-sand-swish') >low-sand-swish</button>"
        + "<button title='low-bell-ding' type='button'  class='soundPreviewByTitle btn btn-primary' onmouseover='previewSound(this)' onclick=addComponent('" + itemid + "','low-bell-ding') >low-bell-ding</button>";

    //*************BACKGROUND SOUNDS************* */
    toolbarHTML = toolbarHTML + "<label class='toolBarlabel'>Background Sounds (Click to insert at Carot) </label>"

        + "<button title='background1' type='button'  class='soundPreviewByTitle btn btn-primary' onmouseover='previewSound(this)' onclick=addComponent('" + itemid + "','background1') >background1</button>"
        + "<button title='background2' type='button'  class='soundPreviewByTitle btn btn-primary' onmouseover='previewSound(this)' onclick=addComponent('" + itemid + "','background2') >background2</button>"
        + "<button title='background3' type='button'  class='soundPreviewByTitle btn btn-primary' onmouseover='previewSound(this)' onclick=addComponent('" + itemid + "','background3') >background3</button>"
        + "<button title='background4' type='button'  class='soundPreviewByTitle btn btn-primary' onmouseover='previewSound(this)' onclick=addComponent('" + itemid + "','background4') >background4</button>"
        + "<button title='background5' type='button'  class='soundPreviewByTitle btn btn-primary' onmouseover='previewSound(this)' onclick=addComponent('" + itemid + "','background5') >background5</button>"
        + "<button title='background6' type='button'  class='soundPreviewByTitle btn btn-primary' onmouseover='previewSound(this)' onclick=addComponent('" + itemid + "','background6') >background6</button>"

        + "<hr>" + "Enable Preview: <input type='checkbox' id='enableSoundPreview' > Enable Loop: <input type='checkbox' id='enableSoundLoop' ><br>" + "<audio id='audioPreview' controls='controls'>  <source id='audioSourceIdMP3' src='' type='audio/mp3'><source id='audioSourceIdWAV' src='' type='audio/wav'></source>Not Supported</audio>";

    //****************IMAGES****************/
    toolbarHTML = toolbarHTML + "<label class='toolBarlabel'>Scripts</label>"
        + "<button title='code-snippet' type='button'  class='soundPreviewByTitle btn btn-primary'  onclick=addComponent('" + itemid + "','code-snippet') >code-snippet</button>"

    toolbarHTML = toolbarHTML + "<label class='toolBarlabel'>Upload Image</label>"
        + "Upload Image:(e.g. myimage.png)" +
        "<input type='text' id='image-" + itemid + "' style='width:95%; margin:auto;'  value=''>"
        +
        "<br><img id='image-src-replace-" + itemid + "' src= '" + the.hosturl + "/img/" + "' style='width: 200px; height: 200px; background-color: white;' alt='Image not available' />"

        +
        "<br><input type='file'  id='image-replace-" + itemid + "' data-itemid = '" + itemid + "'   data-imageelementid='image-src-replace-' onchange='showImage(event)'>"

        +
        "<br><label id='image-ererrormsg-" + itemid + "' style='color: #cc0000; font-size: 14px; min-height: 20px;'></label>"
        +
        "<input class='itmUpdBtnSmall' type='button' value='Upload And Insert At Carot' data-errormsgelementid='image-ererrormsg-' data-saveasnameelementid='image-' data-fileelementid='image-replace-' data-itemid = '" + itemid + "' onclick='uploadAndInsertFile(event);'  >"
        +
        "<input class='itmUpdBtnSmall' type='button' value='Insert At Carot' data-errormsgelementid='image-ererrormsg-' data-saveasnameelementid='image-' data-fileelementid='image-replace-' data-itemid = '" + itemid + "' onclick='insertImageAtCarot(event);'  >"
        +
        "<input class='itmUpdBtnSmall' type='button' value='Upload New Image' data-errormsgelementid='image-ererrormsg-' data-saveasnameelementid='image-' data-fileelementid='image-replace-' data-itemid = '" + itemid + "' onclick='uploadFile(event);'  ><br>"
        + "<label class='toolBarlabel'>Search Images (Click to Save)</label>"
        + "<input class = 'itmUpdBtnSmall' type='text' id='search-img' value=''> "
        + "<button title='Image-Smallest' type='button' class='itmUpdBtnSmall btn btn-primary' onclick=loadUNSPLImg('" + itemid + "')>Search Unsplash</button>"
        + "<button title='Image-Smallest' type='button' class='itmUpdBtnSmall btn btn-primary' onclick=loadPixabImg('" + itemid + "')>Search Pixabay</button>"
        + "<button title='Image-Smallest' type='button' class='itmUpdBtnSmall btn btn-primary' onclick=loadPexImg('" + itemid + "')>Search Pexel</button><br>"
        + "<div class='srchimages'></div>";

    toolbarHTML = toolbarHTML + "<label class='toolBarlabel'>Paragraphs</label>" +
        "<button title='paragraph1' type='button' class='itmUpdBtnSmall btn btn-primary' onclick=addComponent('" + itemid + "','paragraph1') >P1</button>" +
        "<button title='paragraph2 white BG' type='button' class='itmUpdBtnSmall btn btn-primary' onclick=addComponent('" + itemid + "','paragraph2') >P2</button>" +
        "<label class='toolBarlabel'>Ordered Lists</label>" +
        "<button title='ordered-list' type='button' class='itmUpdBtnSmall btn btn-primary' onclick=addComponent('" + itemid + "','orderedlist') >OL1</button>" +
        "<button title='sub-ordered-list' type='button' class='itmUpdBtnSmall btn btn-primary' onclick=addComponent('" + itemid + "','suborderedlist') >OL2</button>" +
        "<label class='toolBarlabel'>Unordered Lists</label>" +
        "<button title='un-ordered-list' type='button' class='itmUpdBtnSmall btn btn-primary' onclick=addComponent('" + itemid + "','unorderedlist') >UL1</button>" +
        "<button title='sub-un-ordered-list' type='button' class='itmUpdBtnSmall btn btn-primary' onclick=addComponent('" + itemid + "','subunorderedlist') >UL2</button>" +
        "<button title='sub2-un-ordered-list' type='button' class='itmUpdBtnSmall btn btn-primary' onclick=addComponent('" + itemid + "','sub2unorderedlist') >UL3</button>" +
        "<label class='toolBarlabel'>Code Snippets</label>" +
        "<button title='Code-Dark Intellij' type='button' class='itmUpdBtnSmall btn btn-primary' onclick=addComponent('" + itemid + "','codescript1') >Dark</button>" +
        "<button title='Code-Light-VSCode' type='button' class='itmUpdBtnSmall btn btn-primary' onclick=addComponent('" + itemid + "','codescript2') >Light</button>" +
        "<button title='Code-CommandLine'' type='button' class='itmUpdBtnSmall btn btn-primary' onclick=addComponent('" + itemid + "','codescript3') >Cmd</button>" +
        "<label class='toolBarlabel'>Headers</label>" +
        "<button title='header1' type='button' class='itmUpdBtnSmall btn btn-primary' onclick=addComponent('" + itemid + "','header1') >H1</button>" +
        "<button title='header2' type='button' class='itmUpdBtnSmall btn btn-primary' onclick=addComponent('" + itemid + "','header2') >H2</button>" +
        "<button title='header3-padding' type='button' class='itmUpdBtnSmall btn btn-primary' onclick=addComponent('" + itemid + "','header3') >H3</button>" +
        "<button title='header3' type='button' class='itmUpdBtnSmall btn btn-primary' onclick=addComponent('" + itemid + "','header4') >H4</button>" +
        "<label class='toolBarlabel'>Images</label>" +
        "<button title='Image-Full-width' type='button' class='itmUpdBtnSmall btn btn-primary' onclick=addComponent('" + itemid + "','image1') >I1</button>" +
        "<button title='Image-Smaller' type='button' class='itmUpdBtnSmall btn btn-primary' onclick=addComponent('" + itemid + "','image2') >I2</button>" +
        "<button title='Image-Smallest' type='button' class='itmUpdBtnSmall btn btn-primary' onclick=addComponent('" + itemid + "','image3') >I3</button>" +
        "<button title='Image-Smallest' type='button' class='itmUpdBtnSmall btn btn-primary' onclick=addComponent('" + itemid + "','image4') >I@Car</button>" +
        "<label class='toolBarlabel'>Messages</label>" +
        "<button title='Warning'' type='button' class='itmUpdBtnSmall btn btn-primary' onclick=addComponent('" + itemid + "','warning') >Warn</button>" +
        "<button title='Error' type='button' class='itmUpdBtnSmall btn btn-primary' onclick=addComponent('" + itemid + "','error') >Err</button>" +
        "<button title='Green-Success' type='button' class='itmUpdBtnSmall btn btn-primary' onclick=addComponent('" + itemid + "','greenmsg') >Succ</button>" +

        "<label class='toolBarlabel'>Quiz</label>" +
        "<button title='Quiz1'' type='button' class='itmUpdBtnSmall btn btn-primary' onclick=addComponent('" + itemid + "','qz1') >Q1</button>" +
        "<button title='Quiz2' type='button' class='itmUpdBtnSmall btn btn-primary' onclick=addComponent('" + itemid + "','qz2') >Q2</button>" +
        "<button title='Submit Quiz Button' type='button' class='itmUpdBtnSmall btn btn-primary' onclick=addComponent('" + itemid + "','sbmtqz') >SbmtQz</button>" +
        "</div>";

    //*************END OF TOOLBAR DIV */
    toolbarHTML = toolbarHTML + "</div><br><br><br>";
    //*************END OF TOOLBAR DIV */



    newHTML = newHTML + "<br><br>" +
        "<textarea id='descriptionTextId' class = ''   ></textarea>"
        +
        "<div class='editDescriptionDiv' contenteditable='true'  class='span2 fullWidth lyricsDiv' id='description-" + itemid + "'  >" + description + "</div>";


    //newHTML = newHTML + "<br><br>" +
    //"<textarea id='description-" + itemid + " class = 'fullWidth tiny ' rows='5'>" + description + "</textarea>";


    newHTML = newHTML +
        "<br><br><div class = 'editFieldHead'>Writer: </div><br>" +
        "<input type='text' id='writer-" + itemid + "' style='width:95%; margin:auto;' value='" + writer + "'>";

    newHTML = newHTML +
        "<br><br><div class = 'editFieldHead'>Keywords (tags): </div><br>" +
        "<textarea id='keywords-" + itemid + "' style='width:95%; margin:auto;' >" + keywords + "</textarea>";


    newHTML = newHTML +
        "<br><br><div class = 'editFieldHead'>Discontinue: </div> <br>" +
        "<input type='text' id='discontinue-" + itemid + "' style='width:95%; margin:auto;' value='" + discontinue + "'>"

        +
        "<label id='updateitemerrormsg-" + itemid + "' style='color: #cc0000; font-size: 14px; min-height: 20px;'></label>";

    newHTML = newHTML +
        "<div class = 'saveChangesDivCls'>" +
        "<button  type='button' class='itmUpdSaveBtn btn btn-primary' onclick=updateDescription('" + itemid + "','n') >Save Changes</button><br>" +
        "<button   type='button' class='itmUpdSaveBtn btn btn-primary' onclick=updateDescription('" + itemid + "','y') >Save As New Item</button><br>" +
        "<button   type='button' class='itmUpdSaveBtn btn btn-danger' onclick=refreshPage() >Cancel</button><br>" +
        "</div>" +
        "<br><br><br><br><br><br><br><br><br></div></div>";

    newHTML = newHTML + "</div>";
    newHTML = newHTML + "</div>";
    newHTML = newHTML + "</div>";

    document.getElementById("itemDivId").innerHTML = newHTML;
    document.getElementById("itemEditDivId").innerHTML = toolbarHTML;


    document.getElementById("itemEditDivId").style.display = "block";

    document.getElementById("itemDivId").style.width = "100%";

    document.getElementById("mainContainer").style.width = "100%";
    document.getElementById("itemEditDivId").style.width = "700px";
    document.getElementById("itemListDivId").style.display = "none";

}

// function getShopTopBannersList_Old(itemid) {

//     return "<label class='informationBox'>If you want to change the design of your store banner above, use the button below to change design</label>"
//         + "<button title='shopTopBanner1' type='button' style='background: url(/smshopify/secimages/shopTopBanner1.png); background-size: contain;' class='shopTopBannerBtn btn btn-primary' onclick=addComponent('" + itemid + "','shopTopBanner1',this) ></button>"
//         + "<button title='shopTopBanner2' type='button' style='background: url(/smshopify/secimages/shopTopBanner2.png); background-size: contain;' class='shopTopBannerBtn btn btn-primary' onclick=addComponent('" + itemid + "','shopTopBanner2',this) ></button>"
//         + "<button title='shopTopBanner3' type='button' style='background: url(/smshopify/secimages/shopTopBanner3.png); background-size: contain;' class='shopTopBannerBtn btn btn-primary' onclick=addComponent('" + itemid + "','shopTopBanner3',this) ></button>"
//         + "<button title='shopTopBanner4' type='button' style='background: url(/smshopify/secimages/shopTopBanner4.png); background-size: contain;' class='shopTopBannerBtn btn btn-primary' onclick=addComponent('" + itemid + "','shopTopBanner4',this) ></button>";

// }

function getShopTopBannersList(itemid) {

    return "<label class='informationBox'>If you want to change the design of your store banner above, use the button below to change design</label>"
        + "<div title='shopTopBanner1' type='button'  class='shopTopBannerBtn max_4box_responsive hover_shadow1' onclick=addComponent('" + itemid + "','shopTopBanner1',this) ><img src='/smshopify/secimages/shopTopBanner1.png' alt='items' class='storeBannerImg'></div>"
        + "<div title='shopTopBanner2' type='button'  class='shopTopBannerBtn max_4box_responsive hover_shadow1' onclick=addComponent('" + itemid + "','shopTopBanner2',this) ><img src='/smshopify/secimages/shopTopBanner2.png' alt='items' class='storeBannerImg'></div>"
        + "<div title='shopTopBanner3' type='button'  class='shopTopBannerBtn max_4box_responsive hover_shadow1' onclick=addComponent('" + itemid + "','shopTopBanner3',this) ><img src='/smshopify/secimages/shopTopBanner3.png' alt='items' class='storeBannerImg'></div>"
        + "<div title='shopTopBanner4' type='button'  class='shopTopBannerBtn max_4box_responsive hover_shadow1' onclick=addComponent('" + itemid + "','shopTopBanner4',this) ><img src='/smshopify/secimages/shopTopBanner4.png' alt='items' class='storeBannerImg'></div>";

}

function toggleToolBarView() {
    //console.log(document.getElementById("toolBarId").clientHeight);

    if (document.getElementById("toolBarId").clientHeight > 50) {
        document.getElementById("toolBarId").style.height = "50px";
    } else {
        //document.getElementById("toolBarId").style.height = "100%";
        document.getElementById("toolBarId").style.height = "600px";
    }
}

function popolatenewImageName(itemid) {
    var name = window.location.href.substring(window.location.href.lastIndexOf('/') + 1) + "-" + (Math.floor(Math.random() * 10000) + 1) + ".png";
    name = name.replaceAll("#", "");
    the.newImageName = name;
    try {
        document.getElementById("image-" + itemid).value = name;
    } catch {

    }

}

function loadUNSPLImg(itemid) {
    popolatenewImageName(itemid);
    var imageName = document.getElementById("search-img").value;
    if (imageName == "") {
        //imageName = "coffee";
        return;
    }
    const url = "https://api.unsplash.com/search/photos?query=" + imageName + "&per_page=100&client_id=gK52De2Tm_dL5o1IXKa9FROBAJ-LIYqR41xBdlg3X2k";
    const imageDiv = document.querySelector('.srchimages');
    imageDiv.innerHTML = "";
    fetch(url)
        .then(response => {
            return response.json();
        })
        .then(data => {

            for (let i = 0; i < data.results.length; i++) {

                /* Fetch only image that you want by using id. Example : https://unsplash.com/photos/6VhPY27jdps, id = '6VhPY27jdps'   */
                //if (data.results[i].id == "6VhPY27jdps") {
                let imageElement = document.createElement('img');
                imageElement.src = data.results[i].urls.regular;
                //imageElement.src = data.results[i].urls.thumb;
                imageElement.setAttribute('onclick', 'SaveImageAndInsertAtCarot(event)');
                imageElement.setAttribute('data-errormsgelementid', 'image-ererrormsg-');
                imageElement.setAttribute('data-saveasnameelementid', 'image-');
                imageElement.setAttribute('data-fileelementid', 'image-replace-');
                imageElement.setAttribute('data-itemid', itemid);
                imageElement.setAttribute('data-imageurl', data.results[i].urls.regular);

                imageDiv.append(imageElement);
                //}
            }
        });
}

function loadPexImg(itemid) {
    popolatenewImageName(itemid)
    var imageName = document.getElementById("search-img").value;
    if (imageName == "") {
        //imageName = "coffee";
        return;
    }
    const imageDiv = document.querySelector('.srchimages');
    imageDiv.innerHTML = "";
    fetch("https://api.pexels.com/v1/search?per_page=80&query=" + imageName, {
        headers: {
            Authorization: "r133XPzHPTKK18x6bcaM5AInbsTp88RC4W4nemUhS4ktwBxMpnDpFT41"
        }
    })
        .then(response => {
            return response.json();
        })
        .then(data => {
            arr = data.photos;
            for (let i = 0; i < arr.length; i++) {
                let imageElement = document.createElement('img');
                //imageElement.src = arr[i].src.original;
                imageElement.src = arr[i].src.landscape;

                //imageElement.src = arr[i].src.small;
                imageElement.setAttribute('onclick', 'SaveImageAndInsertAtCarot(event)');
                imageElement.setAttribute('data-errormsgelementid', 'image-ererrormsg-');
                imageElement.setAttribute('data-saveasnameelementid', 'image-');
                imageElement.setAttribute('data-fileelementid', 'image-replace-');
                imageElement.setAttribute('data-itemid', itemid);
                imageElement.setAttribute('data-imageurl', arr[i].src.landscape);
                imageDiv.append(imageElement);
            }
        });
}

function loadPixabImg(itemid) {
    popolatenewImageName(itemid)
    var imageName = document.getElementById("search-img").value;
    if (imageName == "") {
        //imageName = "coffee";
        return;
    }
    const imageDiv = document.querySelector('.srchimages');
    var key = "33936925-b94dd0e302df74f271d1b84c5";
    const url = "https://pixabay.com/api/?key=" + key + "&per_page=100&q=" + imageName + "&image_type=photo";
    //const url = "https://pixabay.com/api/?key=33936925-b94dd0e302df74f271d1b84c5&q=yellow+flowers&image_type=photo&pretty=true&per_page=20";
    imageDiv.innerHTML = "";
    fetch(url)
        .then(response => {
            return response.json();
        })
        .then(data => {
            arr = data.hits;
            //console.log(arr);
            for (let i = 0; i < arr.length; i++) {
                let imageElement = document.createElement('img');
                imageElement.src = arr[i].largeImageURL;
                //imageElement.src = arr[i].previewURL;

                imageElement.setAttribute('onclick', 'SaveImageAndInsertAtCarot(event)');
                imageElement.setAttribute('data-errormsgelementid', 'image-ererrormsg-');
                imageElement.setAttribute('data-saveasnameelementid', 'image-');
                imageElement.setAttribute('data-fileelementid', 'image-replace-');
                imageElement.setAttribute('data-itemid', itemid);
                imageElement.setAttribute('data-imageurl', arr[i].largeImageURL);

                imageDiv.append(imageElement);
            }
        });
}
function deleteCurrentComponent(btn) {

    //console.log("document.activeElement.tagName = " + document.activeElement.tagName);
    //console.log("document.activeElement.innerHTML = " + document.activeElement.innerHTML);
    //console.log("document.activeElement.parentElement.innerHTML = " + document.activeElement.parentElement.innerHTML);

    //console.log("btn.tagName = " + btn.tagName);
    //console.log("btn.parentElement.innerHTML = " + btn.parentElement.innerHTML);
    btn.parentElement.remove();
    //btn.parentElement.innerHTML = "";
}

function copyCurrentComponent(btn) {
    var text = btn.parentElement.textContent;
    text = text.substring(1, text.lastIndexOf('Copy'));

    navigator.clipboard.writeText(text);
    console.log(text);
}

function showImage(event) {
    var elem = event.target;
    var itemid = elem.dataset.itemid;
    var imageelementid = elem.dataset.imageelementid;

    if (elem.dataset.uploadimgbtnid != null) {
        document.getElementById(elem.dataset.uploadimgbtnid).style.display = "block";
    }

    popolatenewImageName(itemid);

    var output = document.getElementById(imageelementid + itemid);
    output.style.display = "block";
    output.src = URL.createObjectURL(event.target.files[0]);
    output.onload = function () {
        URL.revokeObjectURL(output.src)
    }
}

function addImageToItemList(event) {
    var elem = event.target;
    //elem.style.display = "block";

    var itemid = elem.dataset.itemid;
    var imageelementid = elem.dataset.imageelementid;
    var fileelementid = elem.dataset.fileelementid;

    var saveasname = window.location.href.substring(window.location.href.lastIndexOf('/') + 1) + "-" + (Math.floor(Math.random() * 10000) + 1) + ".png";
    saveasname = saveasname.replaceAll("#", "");
    saveasname = saveasname.trim();
    saveasname = saveasname.toLowerCase();

    var elemClassname = fileelementid + itemid;

    var files = elem.parentElement.querySelector("." + elemClassname).files;

    if (files.length > 0) {

        var formData = new FormData();

        resizeImage({
            file: files[0],
            maxSize: 500
        }).then(function (resizedImage) {

            formData.append("file", resizedImage);
            formData.append("saveasname", saveasname);
            formData.append("dir", "img");

            var xhttp = new XMLHttpRequest();

            xhttp.open("POST", the.hosturl + "/php/upload.php", true);

            // call on request changes state
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {

                    var parentDiv = elem.parentElement.parentElement.parentElement;
                    var existingHTML = parentDiv.querySelector('.existingItmImages').innerHTML;

                    parentDiv.querySelector('.existingItmImages').innerHTML = existingHTML + '<div class="filteredItmImgContainerDiv"> <img class="filteredItmImgCls"  src="' + the.hosturl + '/img/' + saveasname + '">' + '<button class="deleteDiv" onclick="deleteCurrentComponent(this)"></button></div>';
                }
            };

            xhttp.send(formData);
        }).catch(function (err) {
            console.error(err);
        });




    } else {
        alert("Please select a file");
    }

}

function saveItemImgChanges(event) {
    var elem = event.target;
    var parentDiv = elem.parentElement.parentElement.parentElement.parentElement;
    //var imagesHTML = parentDiv.querySelector('.existingItmImages').innerHTML;


    var img_list = parentDiv.querySelectorAll('.filteredItmImgCls'); // returns NodeList
    var img_array = [...img_list]; // converts NodeList to Array

    var newHTML = "";
    var oneDisplayed = 0;
    img_array.forEach(img => {
        if (oneDisplayed == 0) {
            newHTML = newHTML + '<img class="myitemImages" style="display:block" src="' + img.src + '">';
            oneDisplayed = 1;
        } else {
            newHTML = newHTML + '<img class="myitemImages" style="display:none" src="' + img.src + '">';
        }

    });
    parentDiv.querySelector('.itmImgContainer').innerHTML = newHTML;
    //showitemImages(itemImageIndex);
}

function uploadFile(event) {
    // if (localStorage.getItem("userLoggedIn") == "n") {
    //     error_message = "Not authorized";
    //     return;

    // } else if (localStorage.getItem("userLvl") != "9") {
    //     error_message = "Not authorized";
    //     return;
    // }
    var elem = event.target;
    var fileelementid = elem.dataset.fileelementid;
    var saveasnameelementid = elem.dataset.saveasnameelementid;
    var itemid = elem.dataset.itemid;

    //var saveasname = document.getElementById(saveasnameelementid + itemid).value;

    var saveasname = '';
    try {
        saveasname = document.getElementById(saveasnameelementid + itemid).value;
    } catch {
        saveasname = the.newImageName;
    }

    saveasname = saveasname.trim();
    saveasname = saveasname.toLowerCase();

    var errormsgelementid = elem.dataset.errormsgelementid;


    if (!saveasname.includes(".png")) {
        saveasname = saveasname + ".png";
    }

    //var files = document.getElementById(fileelementid + itemid).files;

    var elemClassname = fileelementid + itemid;

    var files = elem.parentElement.querySelector("." + elemClassname).files;

    if (files.length > 0) {

        resizeImage({
            file: files[0],
            maxSize: 500
        }).then(function (resizedImage) {
            //console.log("upload resized image")
            uploadFileAsName(resizedImage, saveasname);

        }).catch(function (err) {
            console.error(err);
        });


    } else {
        alert("Please select a file");
    }

}

function uploadFileAsName(file, saveasname) {
    var formData = new FormData();
    formData.append("file", file);
    formData.append("saveasname", saveasname);
    formData.append("dir", "img");

    var xhttp = new XMLHttpRequest();

    // Set POST method and ajax file path
    xhttp.open("POST", the.hosturl + "/php/upload.php", true);

    // call on request changes state
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = this.responseText;
            document.getElementById(errormsgelementid + itemid).innerHTML = "<font color = #0000>" + response + "</font> ";
        }
    };

    // Send request with data
    xhttp.send(formData);
}

function resizeImage(settings) {
    var file = settings.file;
    var maxSize = settings.maxSize;
    var reader = new FileReader();
    var image = new Image();
    var canvas = document.createElement('canvas');

    var dataURItoBlob = function (dataURL) {
        var BASE64_MARKER = ';base64,';
        if (dataURL.indexOf(BASE64_MARKER) == -1) {
            var parts = dataURL.split(',');
            var contentType = parts[0].split(':')[1];
            var raw = parts[1];

            return new Blob([raw], { type: contentType });
        }

        var parts = dataURL.split(BASE64_MARKER);
        var contentType = parts[0].split(':')[1];
        var raw = window.atob(parts[1]);
        var rawLength = raw.length;

        var uInt8Array = new Uint8Array(rawLength);

        for (var i = 0; i < rawLength; ++i) {
            uInt8Array[i] = raw.charCodeAt(i);
        }

        return new Blob([uInt8Array], { type: contentType });
    };

    // var dataURItoBlob = function (dataURI) {
    //     var bytes = dataURI.split(',')[0].indexOf('base64') >= 0 ?
    //         atob(dataURI.split(',')[1]) :
    //         unescape(dataURI.split(',')[1]);
    //     var mime = dataURI.split(',')[0].split(':')[1].split(';')[0];
    //     var max = bytes.length;
    //     var ia = new Uint8Array(max);
    //     for (var i = 0; i < max; i++)
    //         ia[i] = bytes.charCodeAt(i);
    //     return new Blob([ia], { type: mime });
    // };
    var resize = function () {
        var width = image.width;
        var height = image.height;
        if (width > height) {
            if (width > maxSize) {
                height *= maxSize / width;
                width = maxSize;
            }
        } else {
            if (height > maxSize) {
                width *= maxSize / height;
                height = maxSize;
            }
        }
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(image, 0, 0, width, height);

        //0.9 is the quality
        var dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        return dataURItoBlob(dataUrl);
    };
    return new Promise(function (ok, no) {
        if (!file.type.match(/image.*/)) {
            no(new Error("Not an image"));
            return;
        }
        reader.onload = function (readerEvent) {
            image.onload = function () { return ok(resize()); };
            image.src = readerEvent.target.result;
        };
        reader.readAsDataURL(file);
    });
}

function uploadAndInsertFile(event) {
    if (localStorage.getItem("userLoggedIn") == "n") {

        error_message = "Not authorized";
        return;

    } else if (localStorage.getItem("userLvl") != "9") {
        error_message = "Not authorized";
        return;
    }
    var elem = event.target;
    var fileelementid = elem.dataset.fileelementid;
    var saveasnameelementid = elem.dataset.saveasnameelementid;
    var itemid = elem.dataset.itemid;

    //var saveasname = document.getElementById(saveasnameelementid + itemid).value;
    var saveasname = '';
    try {
        saveasname = document.getElementById(saveasnameelementid + itemid).value;
    } catch {
        saveasname = the.newImageName;
    }

    saveasname = saveasname.trim();
    saveasname = saveasname.toLowerCase();

    var errormsgelementid = elem.dataset.errormsgelementid;

    if (!saveasname.includes(".png")) {
        saveasname = saveasname + ".png";
    }

    //var files = document.getElementById(fileelementid + itemid).files;

    var elemClassname = fileelementid + itemid;

    var files = elem.parentElement.querySelector("." + elemClassname).files;

    if (files.length > 0) {



        resizeImage({
            file: files[0],
            maxSize: 500
        }).then(function (resizedImage) {
            var formData = new FormData();
            formData.append("file", resizedImage);
            formData.append("saveasname", saveasname);
            formData.append("dir", "img");

            var xhttp = new XMLHttpRequest();

            xhttp.open("POST", the.hosturl + "/php/upload.php", true);

            // call on request changes state
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {

                    var response = this.responseText;
                    //console.log(response);

                    document.getElementById(errormsgelementid + itemid).innerHTML = "<font color = #0000>" + response + "</font> ";
                    var imagename = document.getElementById("image-" + itemid).value;
                    var randomId = "div-" + Math.floor(Math.random() * 1000000);
                    var Str = "<div id= '" + randomId + "' onmousedown=setLastFocusedDivId(this.id)  class = 'image1-desc'> " + "<img class='movieImageCls' alt ='' src= '" + the.hosturl + "/img/" + imagename + "'> " + " <button class='deleteDivInnImg' onclick=deleteCurrentComponent(this) ></button></div>";
                    insertImageAtCaret(Str);
                }
            };

            xhttp.send(formData);

        }).catch(function (err) {
            console.error(err);
        });



    } else {
        alert("Please select a file");
    }

}

function SaveImageAndInsertAtCarot(event) {
    if (localStorage.getItem("userLoggedIn") == "n") {

        error_message = "Not authorized";
        return;

    } else if (localStorage.getItem("userLvl") != "9") {
        error_message = "Not authorized";
        return;
    }
    var elem = event.target;
    var fileelementid = elem.dataset.fileelementid;
    var saveasnameelementid = elem.dataset.saveasnameelementid;
    var itemid = elem.dataset.itemid;
    popolatenewImageName(itemid);

    var saveasname = document.getElementById(saveasnameelementid + itemid).value;
    saveasname = saveasname.trim();
    saveasname = saveasname.toLowerCase();

    var errormsgelementid = elem.dataset.errormsgelementid;

    if (!saveasname.includes(".png")) {
        saveasname = saveasname + ".png";
    }

    const url = elem.dataset.imageurl;
    const fileName = 'tempName.png';

    fetch(url)
        .then(async response => {
            const contentType = response.headers.get('content-type')
            const blob = await response.blob()
            const filefromUrl = new File([blob], fileName, { contentType })
            var formData = new FormData();
            formData.append("file", filefromUrl);
            formData.append("saveasname", saveasname);
            formData.append("dir", "img");

            var xhttp = new XMLHttpRequest();

            xhttp.open("POST", the.hosturl + "/php/upload.php", true);

            // call on request changes state
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {

                    var response = this.responseText;
                    //console.log(response);

                    document.getElementById(errormsgelementid + itemid).innerHTML = "<font color = #0000>" + response + "</font> ";
                    var imagename = document.getElementById("image-" + itemid).value;
                    var randomId = "div-" + Math.floor(Math.random() * 1000000);
                    var Str = "<div id= '" + randomId + "' onmousedown=setLastFocusedDivId(this.id)  class = 'image1-desc'> " + "<img class='movieImageCls' alt ='' src= '" + the.hosturl + "/img/" + imagename + "'> " + " <button class='deleteDivInnImg' onclick=deleteCurrentComponent(this) ></button></div>";
                    insertImageAtCaret(Str);
                }
            };

            xhttp.send(formData);
        })
}

function UploadAndReplaceBannerImg(event) {

    var elem = event.target;
    var fileelementid = elem.dataset.fileelementid;
    var saveasnameelementid = elem.dataset.saveasnameelementid;
    var itemid = elem.dataset.itemid;
    popolatenewImageName(itemid);

    var saveasname = '';
    try {
        saveasname = document.getElementById(saveasnameelementid + itemid).value;
    } catch {
        saveasname = the.newImageName;
    }

    saveasname = saveasname.trim();
    saveasname = saveasname.toLowerCase();

    var errormsgelementid = elem.dataset.errormsgelementid;

    if (!saveasname.includes(".png")) {
        saveasname = saveasname + ".png";
    }

    //var files = document.getElementById(fileelementid + itemid).files;

    var elemClassname = fileelementid + itemid;

    var files = elem.parentElement.querySelector("." + elemClassname).files;

    if (files.length > 0) {

        resizeImage({
            file: files[0],
            maxSize: 500
        }).then(function (resizedImage) {
            var formData = new FormData();
            formData.append("file", resizedImage);
            formData.append("saveasname", saveasname);
            formData.append("dir", "img");

            var xhttp = new XMLHttpRequest();

            // Set POST method and ajax file path
            xhttp.open("POST", the.hosturl + "/php/upload.php", true);

            // call on request changes state
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {

                    //var parentSecDiv = elem.parentElement.parentElement;
                    //var previewDiv = parentSecDiv.querySelector('.secPreview');
                    //var previewDiv = document.querySelector('.secPreview');

                    //Mar-26:Added one more parent for banner img
                    var parentSecDiv = elem.parentElement.parentElement.parentElement.parentElement;
                    var previewDiv = parentSecDiv.querySelector('.secPreview');

                    if (previewDiv.style.display != "none") {
                        var bannerDiv = previewDiv.querySelector('.shopTopBanner');
                        bannerDiv.style.backgroundImage = "url('" + the.hosturl + "/img/" + saveasname + "')";
                    }
                }
            };

            xhttp.send(formData);

        }).catch(function (err) {
            console.error(err);
        });

    } else {
        alert("Please select a file");
    }




}

function toggleDescView(itemid) {
    var divId = 'description-' + itemid;

    // newHTML = document.getElementById(divId).innerHTML;
    // newHTML = addNewLineInText(newHTML);
    // document.getElementById("descriptionTextId").value = newHTML;





    if (document.getElementById("descriptionTextId").style.display == "block") {
        newHTML = document.getElementById("descriptionTextId").value;
        //**SM - May need to be reverted* */
        //newHTML = removeNewLine(newHTML);
        document.getElementById(divId).innerHTML = newHTML;

        document.getElementById(divId).style.display = "block";
        document.getElementById("descriptionTextId").style.display = "none"
    } else {
        newHTML = document.getElementById(divId).innerHTML;
        //**SM - May need to be reverted* */
        //newHTML = addNewLineInText(newHTML);
        document.getElementById("descriptionTextId").value = newHTML;

        document.getElementById(divId).style.display = "none";
        document.getElementById("descriptionTextId").style.display = "block"
    }

}

function addNewLineInText(innerHTML) {
    innerHTML = innerHTML.replaceAll("<div", "\r\n<div");
    innerHTML = innerHTML.replaceAll("<h1", "\r\n<h1");
    innerHTML = innerHTML.replaceAll("<h2", "\r\n<h2");
    innerHTML = innerHTML.replaceAll("<h3", "\r\n<h3");
    innerHTML = innerHTML.replaceAll("<ol", "\r\n<ol");
    innerHTML = innerHTML.replaceAll("<ul", "\r\n<ul");
    return innerHTML;
}

function removeNewLine(innerHTML) {
    //innerHTML = innerHTML.replaceAll( "&#13;&#10;", "");
    innerHTML = innerHTML.replace(/\r\n|\r|\n/g, "")
    return innerHTML;
}
function addComponent(itemid, type, elem = "dummy") {

    var componentid = 'description-' + itemid;
    var AllHTML = "";
    var partOneHTML = "";
    var partTwoHTML = "";

    if (itemid != "shopTopBanner") {
        AllHTML = document.getElementById(componentid).innerHTML;
        var checkBox = document.getElementById("insertInner");
        var findStr = '<div id="' + last_focused_div_id;
        if (checkBox.checked == true) {
            partOneHTML = AllHTML.substring(0, AllHTML.indexOf(findStr));
            partTwoHTML = AllHTML.substring(AllHTML.indexOf(findStr));
        } else {
            partOneHTML = AllHTML;
        }
    } else {
        setTimeout(function () {
            document.querySelector('.bannerStoreNameCls').innerHTML = localStorage.getItem("storename");
        }, 800);
    }



    var randomId = type + "-" + Math.floor(Math.random() * 1000000);
    if (type == "codescript1") {
        document.getElementById(componentid).innerHTML = partOneHTML + "<div id= '" + randomId + "' onmousedown=setLastFocusedDivId(this.id)  class = 'codescript1-desc'> <pre> TODO Edit - Code Script Style1 </pre><button class='copyDiv' onclick=copyCurrentComponent(this) >Copy</button><button class='deleteDiv' onclick=deleteCurrentComponent(this) ></button></div>" + partTwoHTML;
    } else if (type == "codescript2") {
        document.getElementById(componentid).innerHTML = partOneHTML + "<div id= '" + randomId + "' onmousedown=setLastFocusedDivId(this.id)  class = 'codescript2-desc'> <pre> TODO Edit - Code Script Style2</pre><button class='copyDiv' onclick=copyCurrentComponent(this) >Copy</button> <button class='deleteDiv' onclick=deleteCurrentComponent(this) ></button></div>" + partTwoHTML;

    } else if (type == "codescript3") {
        document.getElementById(componentid).innerHTML = partOneHTML + "<div id= '" + randomId + "' onmousedown=setLastFocusedDivId(this.id)  class = 'codescript3-desc'> <pre> TODO Edit - Code Script Style3 </pre><button class='copyDiv' onclick=copyCurrentComponent(this) >Copy</button><button class='deleteDiv' onclick=deleteCurrentComponent(this) ></button></div>" + partTwoHTML;

    } else if (type == "header1") {
        document.getElementById(componentid).innerHTML = partOneHTML + "<div id= '" + randomId + "' onmousedown=setLastFocusedDivId(this.id)  ><h1 class = 'header1-desc'> TODO Edit - Header1 </h1><button class='deleteDiv' onclick=deleteCurrentComponent(this) ></button></div>" + partTwoHTML;

    } else if (type == "header2") {
        document.getElementById(componentid).innerHTML = partOneHTML + "<div id= '" + randomId + "' onmousedown=setLastFocusedDivId(this.id)  ><h2 class = 'header2-desc'> TODO Edit - Header2 </h2><button class='deleteDiv' onclick=deleteCurrentComponent(this) ></button></div>" + partTwoHTML;

    } else if (type == "header3") {
        document.getElementById(componentid).innerHTML = partOneHTML + "<div id= '" + randomId + "' onmousedown=setLastFocusedDivId(this.id)  ><h3 class = 'header3-desc'> TODO Edit - Header3 </h3><button class='deleteDiv' onclick=deleteCurrentComponent(this) ></button></div>" + partTwoHTML;
    } else if (type == "header4") {
        document.getElementById(componentid).innerHTML = partOneHTML + "<div id= '" + randomId + "' onmousedown=setLastFocusedDivId(this.id)  ><h3 class = 'header4-desc'> TODO Edit - Header4 </h4><button class='deleteDiv' onclick=deleteCurrentComponent(this) ></button></div>" + partTwoHTML;

    } else if (type == "image1") {
        var imagename = document.getElementById("image-" + itemid).value;
        document.getElementById(componentid).innerHTML = partOneHTML + "<div id= '" + randomId + "' onmousedown=setLastFocusedDivId(this.id)  class = 'image1-desc'> " + "<img class='movieImageCls' alt ='' src= '" + the.hosturl + "/img/" + imagename + "'> " + " <button class='deleteDiv' onclick=deleteCurrentComponent(this) ></button></div>" + partTwoHTML;

    } else if (type == "image2") {
        var imagename = document.getElementById("image-" + itemid).value;
        document.getElementById(componentid).innerHTML = partOneHTML + "<div id= '" + randomId + "' onmousedown=setLastFocusedDivId(this.id)  class = 'image2-desc'> " + "<img class='movieImageCls' alt ='' src= '" + the.hosturl + "/img/" + imagename + "'> " + "  <button class='deleteDiv' onclick=deleteCurrentComponent(this) ></button></div>" + partTwoHTML;

    } else if (type == "image3") {
        var imagename = document.getElementById("image-" + itemid).value;
        document.getElementById(componentid).innerHTML = partOneHTML + "<div id= '" + randomId + "' onmousedown=setLastFocusedDivId(this.id)  class = 'image3-desc'> " + "<img class='movieImageCls' alt ='' src= '" + the.hosturl + "/img/" + imagename + "'> " + " <button class='deleteDiv' onclick=deleteCurrentComponent(this) ></button></div>" + partTwoHTML;
    } else if (type == "image4") {
        var imagename = document.getElementById("image-" + itemid).value;
        var Str = "<div id= '" + randomId + "' onmousedown=setLastFocusedDivId(this.id)  class = 'image1-desc'> " + "<img class='movieImageCls' alt ='' src= '" + the.hosturl + "/img/" + imagename + "'> " + " <button class='deleteDivInnImg' onclick=deleteCurrentComponent(this) ></button></div>";
        insertImageAtCaret(Str);

    } else if (type == "warning") {
        document.getElementById(componentid).innerHTML = partOneHTML + "<div id= '" + randomId + "' onmousedown=setLastFocusedDivId(this.id)  class = 'warning-desc'> TODO Edit - warning <button class='deleteDiv' onclick=deleteCurrentComponent(this) ></button></div>" + partTwoHTML;

    } else if (type == "error") {
        document.getElementById(componentid).innerHTML = partOneHTML + "<div id= '" + randomId + "' onmousedown=setLastFocusedDivId(this.id)  class = 'error-desc'> TODO Edit - error <button class='deleteDiv' onclick=deleteCurrentComponent(this) ></button></div>" + partTwoHTML;

    } else if (type == "greenmsg") {
        document.getElementById(componentid).innerHTML = partOneHTML + "<div id= '" + randomId + "' onmousedown=setLastFocusedDivId(this.id)  class = 'greenmsg-desc'> TODO Edit - Success <button class='deleteDiv' onclick=deleteCurrentComponent(this) ></button></div>" + partTwoHTML;

    } else if (type == "paragraph1") {
        document.getElementById(componentid).innerHTML = partOneHTML + "<div id= '" + randomId + "' onmousedown=setLastFocusedDivId(this.id)  class = 'paragraph1-desc'> TODO Edit - paragraph1 <button class='deleteDiv' onclick=deleteCurrentComponent(this) ></button></div>" + partTwoHTML;

    } else if (type == "paragraph2") {
        document.getElementById(componentid).innerHTML = partOneHTML + "<div id= '" + randomId + "' onmousedown=setLastFocusedDivId(this.id)  class = 'paragraph2-desc'> TODO Edit - paragraph2 <button class='deleteDiv' onclick=deleteCurrentComponent(this) ></button></div>" + partTwoHTML;

    } else if (type == "orderedlist") {
        document.getElementById(componentid).innerHTML = partOneHTML + "<div id= '" + randomId + "' onmousedown=setLastFocusedDivId(this.id)  ><ol class = 'ordered-list-desc'> <li>TODO</li><li> Edit - list</li> </ol><button class='deleteDiv' onclick=deleteCurrentComponent(this) ></button></div>" + partTwoHTML;

    } else if (type == "suborderedlist") {
        document.getElementById(componentid).innerHTML = partOneHTML + "<div id= '" + randomId + "' onmousedown=setLastFocusedDivId(this.id)  ><ol class = 'subordered-list-desc'> <li>TODO</li><li> Edit - list</li> </ol><button class='deleteDiv' onclick=deleteCurrentComponent(this) ></button></div>" + partTwoHTML;

    } else if (type == "unorderedlist") {
        document.getElementById(componentid).innerHTML = partOneHTML + "<div id= '" + randomId + "' onmousedown=setLastFocusedDivId(this.id)  ><ul class = 'unordered-list-desc'> <li>TODO</li><li> Edit - list</li> </ul><button class='deleteDiv' onclick=deleteCurrentComponent(this) ></button></div>" + partTwoHTML;

    } else if (type == "subunorderedlist") {
        document.getElementById(componentid).innerHTML = partOneHTML + "<div id= '" + randomId + "' onmousedown=setLastFocusedDivId(this.id)  ><ul class = 'subunordered-list-desc'> <li>TODO</li><li> Edit - list</li> </ul><button class='deleteDiv' onclick=deleteCurrentComponent(this) ></button></div>" + partTwoHTML;

    } else if (type == "sub2unorderedlist") {
        document.getElementById(componentid).innerHTML = partOneHTML + "<div id= '" + randomId + "' onmousedown=setLastFocusedDivId(this.id)  ><ul class = 'sub2unordered-list-desc'> <li>TODO</li><li> Edit - list</li> </ul><button class='deleteDiv' onclick=deleteCurrentComponent(this) ></button></div>" + partTwoHTML;

    } else if (type == "qz1") {
        var tempCompHTML = partOneHTML + "<div id= '" + randomId + "-qs' onmousedown=setLastFocusedDivId(this.id)  class = 'qz1-qs'> TODO Edit - Write Question <button class='deleteDiv' onclick=deleteCurrentComponent(this) ></button></div>"
            //+ "<div id= '" + randomId + "-allans' onmousedown=setLastFocusedDivId(this.id)  class = 'qz1-allans'> "
            + "<div id= '" + randomId + "-ans1' onmousedown=setLastFocusedDivId(this.id)  class = 'qz1-ans'> <input class='dynamicradio' type ='radio' name ='" + randomId + "' value='x'/>Option1 <button class='deleteDiv' onclick=deleteCurrentComponent(this) ></button></div>"
            + "<div id= '" + randomId + "-ans2' onmousedown=setLastFocusedDivId(this.id)  class = 'qz1-ans'> <input class='dynamicradio' type ='radio' name ='" + randomId + "' value='q'/>Option2 <button class='deleteDiv' onclick=deleteCurrentComponent(this) ></button></div>"
            + "<div id= '" + randomId + "-ans3' onmousedown=setLastFocusedDivId(this.id)  class = 'qz1-ans'> <input class='dynamicradio' type ='radio' name ='" + randomId + "' value='e'/>Option3 <button class='deleteDiv' onclick=deleteCurrentComponent(this) ></button></div>"
            + "<div id= '" + randomId + "-ans4' onmousedown=setLastFocusedDivId(this.id)  class = 'qz1-ans'> <input class='dynamicradio' type ='radio' name ='" + randomId + "' value='t'/>Option4 <button class='deleteDiv' onclick=deleteCurrentComponent(this) ></button></div>";

        //+ " <button class='deleteDiv' onclick=deleteCurrentComponent(this) ></button></div>"
        if (the.smusr) {
            tempCompHTML = tempCompHTML + "<div id= '" + randomId + "-rtans' onmousedown=setLastFocusedDivId(this.id)  class = 'qz1-rtans'> TODO Edit - Correct Answer <button class='deleteDiv' onclick=deleteCurrentComponent(this) ></button></div>";
        }

        document.getElementById(componentid).innerHTML = tempCompHTML + partTwoHTML;
    } else if (type == "sbmtqz") {
        document.getElementById(componentid).innerHTML = partOneHTML
            + "<div id= 'qzmsg' onmousedown=setLastFocusedDivId(this.id)  class = 'qzerr-div'> <div id= 'qzerr'></div><div id= 'qzres'></div>  <button class='deleteDiv' onclick=deleteCurrentComponent(this) ></button></div>"
            + "<div id= 'sbmtqzdivid' onmousedown=setLastFocusedDivId(this.id)  class = 'sbmtqz-div' onclick='submitQuiz()'> Submit <button class='deleteDiv' onclick=deleteCurrentComponent(this) ></button></div>"
            + "<div id= 'retryqzdivid' onmousedown=setLastFocusedDivId(this.id)  class = 'sbmtqz-div' onclick='refreshPage()'> Retry <button class='deleteDiv' onclick=deleteCurrentComponent(this) ></button></div>" + partTwoHTML;

    } else if (type == "secTitlePlane1") {

        var htmlPartOrig = '<div class="slidingUp10px" style="margin:auto; padding-top: 100px">'
            + "\n" + 'My Tutorial'
            + "\n" + '</div>';

        htmlPart = escape(htmlPartOrig);

        var hdMeDiv = "<div class='hdMeDivCls' contenteditable='false'>"
            + revealSecColor
            + secTranition
            + mediaSection
            + "<button type='button' style='background: url(/smshopify/secimages/" + type + ".png); background-size: contain;' class='itmSecImg btn btn-primary' ></button>"
            + "</div>";

        document.getElementById(componentid).innerHTML = partOneHTML
            + "<div id= div-" + randomId + " contenteditable='true' data-bgcolor='#ccc' data-transition='zoom' data-autoanimate='' data-background='' data-backgroundiframe = '' data-backgroundvideo = '' class='secdiv' onmousedown=setLastFocusedDivId(this.id) > "
            + "<textarea class='secDivTextArea'  onchange='updatePreviewDiv(this)' >" + htmlPart + "</textarea><div class='secPreview'><div contenteditable='true' class='revealDummy' style=' margin: 10px;'><div class='slides'>" + htmlPartOrig + "</div></div></div>"
            + hdMeDiv
            + "<button class='deleteDivInnImg' onclick=deleteCurrentComponent(this) ></button>  </div>" + partTwoHTML;
    } else if (type == "shopName1") {

        var htmlPartOrig = '<div class="storeNmChkDiv" contenteditable="false"><input id="store-search-box" type="text" class="margin_5px" autocomplete="off" placeholder="Enter Your Store Name ">'
            + "\n" + '<button id="itemsearchBtnId" class="button_type1" onclick="searchStoreNameItem(); return false;">Check Availability</button>'
            + "\n" + '<div class="storeNameNotAvailable displayNone scale-up-ver-top" style="animation-duration: 0.1"></div>'
            + "\n" + '<div class="storeNameAvailable displayNone scale-up-ver-top" style="animation-duration: 0.1">Store name is available. <button class="button_type1" onclick="showBanner()">Design Store banner</button></div>'
            + "\n" + '</div>';

        htmlPart = escape(htmlPartOrig);

        var hdMeDiv = "<div class='hdMeDivCls' contenteditable='false'>"
            + allowTogglePreview
            + "</div>";

        document.getElementById(componentid).innerHTML = partOneHTML
            + "<div id= div-" + randomId + " contenteditable='true' data-bgcolor='#ccc' data-transition='zoom' data-autoanimate='' data-background='' data-backgroundiframe = '' data-backgroundvideo = '' class='secdiv' onmousedown=setLastFocusedDivId(this.id) > "
            + "<textarea class='secDivTextArea'  onchange='updatePreviewDiv(this)' >" + htmlPart + "</textarea><div class='secPreview'><div contenteditable='true' class='revealDummy' style=' margin: 10px;'><div class='slides'>" + htmlPartOrig + "</div></div></div>"
            + hdMeDiv
            + "<button class='deleteDivInnImg' onclick=deleteCurrentComponent(this) ></button>  </div>" + partTwoHTML;

    } else if (type == "shopTopBanner1") {


        var htmlPartOrig = '<div class="shopTopBanner" style="margin:auto; padding-top: 100px;background-color: rgb(91, 94, 166); color: white;">'
            + "\n" + '<div style="font-size:30px" contenteditable="false" class="bannerStoreNameCls">My Store Name</div><div contenteditable="true" style="font-size:15px" data-text="Any tagline"></div>'
            + "\n" + '</div>';


        htmlPart = escape(htmlPartOrig);

        var shopBannerTabOptions = '<div class="shopTab">'
            + '<button class="shopTablinks" onclick="openShopTab(event, ' + "'" + 'DesignOptions' + "'" + ')">Design Options</button>'
            + '<button class="shopTablinks" onclick="openShopTab(event, ' + "'" + 'Customizations' + "'" + ')">Customizations</button>'
            + '<button class="shopTablinks" onclick="openShopTab(event, ' + "'" + 'HoursDiv' + "'" + ')">Hours</button>'
            + '<button class="shopTablinks" onclick="openShopTab(event, ' + "'" + 'LocationDiv' + "'" + ')">Location</button>'
            + '<button class="shopTablinks" onclick="openShopTab(event, ' + "'" + 'AboutStoreDiv' + "'" + ')">About</button>'
            + '<button class="shopTablinks" onclick="openShopTab(event, ' + "'" + 'Close' + "'" + ')">Close</button>'
            + '</div>';

        var shopBannerTabContentDivs = '<div id="DesignOptions" class="shopTabcontent">'
            + getShopTopBannersList("shopTopBanner")
            + '</div>'

            + '<div id="Customizations" class="shopTabcontent">'
            + revealSecColor
            + nextShopTabBtnDiv
            + '</div>'

            + '<div id="HoursDiv" class="shopTabcontent">'
            + shopOpeningHrCheckBox
            + nextShopTabBtnDiv
            + '</div>'

            + '<div id="LocationDiv" class="shopTabcontent">'
            + shopLocationCheckBox
            + nextShopTabBtnDiv
            + '</div>'

            + '<div id="AboutStoreDiv" class="shopTabcontent">'
            + '<div class="storeDescriptionCls" contenteditable="true" data-text="Write what is special about your store or the items/services you provide"></div>'
            + nextShopTabBtnDiv
            + '</div>'

            + '<div id="Close" class="shopTabcontent">'
            + '</div>';


        var hdMeDiv = "<div class='hdMeDivCls' contenteditable='false'>"
            + allowTogglePreview
            + shopBannerTabOptions
            + shopBannerTabContentDivs
            + "</div>";

        var contentToAdd = "<div id= div-" + randomId + " class='shopTopBnrCls scale-in-center' style='animation-duration: 0.2' contenteditable='true' data-bgcolor='#ccc' data-transition='zoom' data-autoanimate='' data-background='' data-backgroundiframe = '' data-backgroundvideo = '' class='secdiv' onmousedown=setLastFocusedDivId(this.id) > "
            + "<textarea class='secDivTextArea'  onchange='updatePreviewDiv(this)' >" + htmlPart + "</textarea><div class='secPreview'><div contenteditable='true' class='revealDummy' style=' margin: 10px;'><div class='slides'>" + htmlPartOrig + "</div></div>"
            + hdMeDiv
            + "</div><button class='deleteDivInnImg' onclick=deleteCurrentComponent(this) ></button>  </div>";

        if (componentid == "description-shopTopBanner") {
            //document.querySelector('.secdiv').innerHTML = contentToAdd;
            if (elem == "addUndershopLyrics") {
                document.querySelector('.shopLyrics').innerHTML = document.querySelector('.shopLyrics').innerHTML + contentToAdd;

                setTimeout(function () {
                    var allItems = document.querySelectorAll(".shopTopBnrCls");
                    for (i = 0; i < allItems.length; i++) {
                        allItems[i].classList.remove("scale-in-center");
                    }
                }, 500);

            } else {
                elem.parentElement.parentElement.parentElement.innerHTML = contentToAdd;
            }

        } else {
            document.getElementById(componentid).innerHTML = partOneHTML + contentToAdd + partTwoHTML;
        }


    } else if (type == "shopTopBanner2") {

        var htmlPartOrig = '<div class="shopTopBanner" style="margin:auto; background-image: url(&quot;/smshopify/img/loops-in-java-2175.png&quot;);">'
            + "\n" + '<div id="textDivId" style="padding-top: 100px; height:100%; padding:10px; text-align:left;  clip-path: polygon(0 0, 60% 0, 30% 100%, 0 100%); background-color: rgb(149, 82, 81); color: white;"><div style="font-size:30px" contenteditable="false" class="bannerStoreNameCls">My Store Name</div><div style="font-size:15px">Serving since 1989</div></div>'
            + "\n" + '</div>';

        htmlPart = escape(htmlPartOrig);

        var shopBannerTabOptions = '<div class="shopTab">'
            + '<button class="shopTablinks" onclick="openShopTab(event, ' + "'" + 'DesignOptions' + "'" + ')">Design Options</button>'
            + '<button class="shopTablinks" onclick="openShopTab(event, ' + "'" + 'Customizations' + "'" + ')">Customizations</button>'
            + '<button class="shopTablinks" onclick="openShopTab(event, ' + "'" + 'HoursDiv' + "'" + ')">Hours</button>'
            + '<button class="shopTablinks" onclick="openShopTab(event, ' + "'" + 'LocationDiv' + "'" + ')">Location</button>'
            + '<button class="shopTablinks" onclick="openShopTab(event, ' + "'" + 'AboutStoreDiv' + "'" + ')">About</button>'
            + '<button class="shopTablinks" onclick="openShopTab(event, ' + "'" + 'Close' + "'" + ')">Close</button>'
            + '</div>';

        var shopBannerTabContentDivs = '<div id="DesignOptions" class="shopTabcontent">'
            + getShopTopBannersList("shopTopBanner")
            + '</div>'

            + '<div id="Customizations" class="shopTabcontent">'
            + textDivColorCtl
            + replaceBannerImg
            + nextShopTabBtnDiv
            + '</div>'

            + '<div id="HoursDiv" class="shopTabcontent">'
            + shopOpeningHrCheckBox
            + nextShopTabBtnDiv
            + '</div>'

            + '<div id="LocationDiv" class="shopTabcontent">'
            + shopLocationCheckBox
            + nextShopTabBtnDiv
            + '</div>'

            + '<div id="AboutStoreDiv" class="shopTabcontent">'
            + '<div class="storeDescriptionCls" contenteditable="true" data-text="Write what is special about your store or the items/services you provide"></div>'
            + nextShopTabBtnDiv
            + '</div>'

            + '<div id="Close" class="shopTabcontent">'
            + '</div>';

        var hdMeDiv = "<div class='hdMeDivCls' contenteditable='false'>"
            + allowTogglePreview
            + shopBannerTabOptions
            + shopBannerTabContentDivs
            + "</div>";

        // document.getElementById(componentid).innerHTML = partOneHTML 
        //     + "<div id= div-" + randomId + " contenteditable='true' data-bgcolor='#ccc' data-transition='zoom' data-autoanimate='' data-background='' data-backgroundiframe = '' data-backgroundvideo = '' class='secdiv' onmousedown=setLastFocusedDivId(this.id) > "
        //     + "<textarea class='secDivTextArea'  onchange='updatePreviewDiv(this)' >" + htmlPart + "</textarea><div class='secPreview'><div contenteditable='true' class='revealDummy' style=' margin: 10px;'><div class='slides'>" + htmlPartOrig + "</div></div></div>"
        //     + hdMeDiv 
        //     + "<button class='deleteDivInnImg' onclick=deleteCurrentComponent(this) ></button>  </div>" + partTwoHTML;

        var contentToAdd = "<div id= div-" + randomId + " class='shopTopBnrCls scale-in-center' style='animation-duration: 0.2' contenteditable='true' data-bgcolor='#ccc' data-transition='zoom' data-autoanimate='' data-background='' data-backgroundiframe = '' data-backgroundvideo = '' class='secdiv' onmousedown=setLastFocusedDivId(this.id) > "
            + "<textarea class='secDivTextArea'  onchange='updatePreviewDiv(this)' >" + htmlPart + "</textarea><div class='secPreview'><div contenteditable='true' class='revealDummy' style=' margin: 10px;'><div class='slides'>" + htmlPartOrig + "</div></div>"
            + hdMeDiv
            + "</div><button class='deleteDivInnImg' onclick=deleteCurrentComponent(this) ></button>  </div>";

        if (componentid == "description-shopTopBanner") {
            //document.querySelector('.secdiv').innerHTML = contentToAdd;
            elem.parentElement.parentElement.parentElement.innerHTML = contentToAdd;
            setTimeout(function () {
                var allItems = document.querySelectorAll(".shopTopBnrCls");
                for (i = 0; i < allItems.length; i++) {
                    allItems[i].classList.remove("scale-in-center");
                }
            }, 500);
        } else {
            document.getElementById(componentid).innerHTML = partOneHTML + contentToAdd + partTwoHTML;
        }

    } else if (type == "shopTopBanner3") {

        var htmlPartOrig = '<div class="shopTopBanner" style="margin:auto; background-image: url(&quot;/smshopify/img/loops-in-java-5681.png&quot;); ">'
            + "\n" + '<div id="textDivId" style="padding-top: 100px; height:100%; text-align:center;  clip-path: circle(30% at 50% 50%); background-color: rgb(223, 207, 190); color: black;"><div style="font-size:30px" contenteditable="false" class="bannerStoreNameCls">My Store Name</div><div style="font-size:15px">Serving since 1989</div></div>'
            + "\n" + '</div>';

        htmlPart = escape(htmlPartOrig);

        var shopBannerTabOptions = '<div class="shopTab">'
            + '<button class="shopTablinks" onclick="openShopTab(event, ' + "'" + 'DesignOptions' + "'" + ')">Design Options</button>'
            + '<button class="shopTablinks" onclick="openShopTab(event, ' + "'" + 'Customizations' + "'" + ')">Customizations</button>'
            + '<button class="shopTablinks" onclick="openShopTab(event, ' + "'" + 'HoursDiv' + "'" + ')">Hours</button>'
            + '<button class="shopTablinks" onclick="openShopTab(event, ' + "'" + 'LocationDiv' + "'" + ')">Location</button>'
            + '<button class="shopTablinks" onclick="openShopTab(event, ' + "'" + 'AboutStoreDiv' + "'" + ')">About</button>'
            + '<button class="shopTablinks" onclick="openShopTab(event, ' + "'" + 'Close' + "'" + ')">Close</button>'
            + '</div>';

        var shopBannerTabContentDivs = '<div id="DesignOptions" class="shopTabcontent">'
            + getShopTopBannersList("shopTopBanner")
            + '</div>'

            + '<div id="Customizations" class="shopTabcontent">'
            + textDivColorCtl
            + replaceBannerImg
            + nextShopTabBtnDiv
            + '</div>'

            + '<div id="HoursDiv" class="shopTabcontent">'
            + shopOpeningHrCheckBox
            + nextShopTabBtnDiv
            + '</div>'

            + '<div id="LocationDiv" class="shopTabcontent">'
            + shopLocationCheckBox
            + nextShopTabBtnDiv
            + '</div>'

            + '<div id="AboutStoreDiv" class="shopTabcontent">'
            + '<div class="storeDescriptionCls" contenteditable="true" data-text="Write what is special about your store or the items/services you provide"></div>'
            + nextShopTabBtnDiv
            + '</div>'

            + '<div id="Close" class="shopTabcontent">'
            + '</div>';


        var hdMeDiv = "<div class='hdMeDivCls' contenteditable='false'>"
            + allowTogglePreview
            + shopBannerTabOptions
            + shopBannerTabContentDivs
            + "</div>";

        // document.getElementById(componentid).innerHTML = partOneHTML 
        //     + "<div id= div-" + randomId + " contenteditable='true' data-bgcolor='#ccc' data-transition='zoom' data-autoanimate='' data-background='' data-backgroundiframe = '' data-backgroundvideo = '' class='secdiv' onmousedown=setLastFocusedDivId(this.id) > "
        //     + "<textarea class='secDivTextArea'  onchange='updatePreviewDiv(this)' >" + htmlPart + "</textarea><div class='secPreview'><div contenteditable='true' class='revealDummy' style=' margin: 10px;'><div class='slides'>" + htmlPartOrig + "</div></div></div>"
        //     + hdMeDiv 
        //     + "<button class='deleteDivInnImg' onclick=deleteCurrentComponent(this) ></button>  </div>" + partTwoHTML;

        var contentToAdd = "<div id= div-" + randomId + " class='shopTopBnrCls scale-in-center' style='animation-duration: 0.2' contenteditable='true' data-bgcolor='#ccc' data-transition='zoom' data-autoanimate='' data-background='' data-backgroundiframe = '' data-backgroundvideo = '' class='secdiv' onmousedown=setLastFocusedDivId(this.id) > "
            + "<textarea class='secDivTextArea'  onchange='updatePreviewDiv(this)' >" + htmlPart + "</textarea><div class='secPreview'><div contenteditable='true' class='revealDummy' style=' margin: 10px;'><div class='slides'>" + htmlPartOrig + "</div></div>"
            + hdMeDiv
            + "</div><button class='deleteDivInnImg' onclick=deleteCurrentComponent(this) ></button>  </div>";

        if (componentid == "description-shopTopBanner") {
            //document.querySelector('.secdiv').innerHTML = contentToAdd;
            elem.parentElement.parentElement.parentElement.innerHTML = contentToAdd;
            setTimeout(function () {
                var allItems = document.querySelectorAll(".shopTopBnrCls");
                for (i = 0; i < allItems.length; i++) {
                    allItems[i].classList.remove("scale-in-center");
                }
            }, 500);
        } else {
            document.getElementById(componentid).innerHTML = partOneHTML + contentToAdd + partTwoHTML;
        }

    } else if (type == "shopTopBanner4") {

        var htmlPartOrig = '<div class="shopTopBanner" style="margin:auto; padding:10px; background-image: url(&quot;/smshopify/img/loops-in-java-5570.png&quot;); ">'
            + "\n" + '<div id="textDivId" class="semiTransparentBlackBG boxShadow5" style=" opacity: 0.7;  padding:20px; text-align:center; width:80%;  margin:40px auto ;  border-radius: 20px;"><div style="font-size:30px" contenteditable="false" class="bannerStoreNameCls">My Store Name</div><div style="font-size:15px">Serving since 1989</div></div>'
            + "\n" + '</div>';

        htmlPart = escape(htmlPartOrig);

        var shopBannerTabOptions = '<div class="shopTab">'
            + '<button class="shopTablinks" onclick="openShopTab(event, ' + "'" + 'DesignOptions' + "'" + ')">Design Options</button>'
            + '<button class="shopTablinks" onclick="openShopTab(event, ' + "'" + 'Customizations' + "'" + ')">Customizations</button>'
            + '<button class="shopTablinks" onclick="openShopTab(event, ' + "'" + 'HoursDiv' + "'" + ')">Hours</button>'
            + '<button class="shopTablinks" onclick="openShopTab(event, ' + "'" + 'LocationDiv' + "'" + ')">Location</button>'
            + '<button class="shopTablinks" onclick="openShopTab(event, ' + "'" + 'AboutStoreDiv' + "'" + ')">About</button>'
            + '<button class="shopTablinks" onclick="openShopTab(event, ' + "'" + 'Close' + "'" + ')">Close</button>'
            + '</div>';

        var shopBannerTabContentDivs = '<div id="DesignOptions" class="shopTabcontent">'
            + getShopTopBannersList("shopTopBanner")
            + '</div>'

            + '<div id="Customizations" class="shopTabcontent">'
            + replaceBannerImg
            + nextShopTabBtnDiv
            + '</div>'

            + '<div id="HoursDiv" class="shopTabcontent">'
            + shopOpeningHrCheckBox
            + nextShopTabBtnDiv
            + '</div>'

            + '<div id="LocationDiv" class="shopTabcontent">'
            + shopLocationCheckBox
            + nextShopTabBtnDiv
            + '</div>'

            + '<div id="AboutStoreDiv" class="shopTabcontent">'
            + '<div class="storeDescriptionCls" contenteditable="true" data-text="Write what is special about your store or the items/services you provide"></div>'
            + nextShopTabBtnDiv
            + '</div>'

            + '<div id="Close" class="shopTabcontent">'
            + '</div>';

        var hdMeDiv = "<div class='hdMeDivCls' contenteditable='false'>"
            + allowTogglePreview
            + shopBannerTabOptions
            + shopBannerTabContentDivs
            + "</div>";

        // document.getElementById(componentid).innerHTML = partOneHTML 
        //     + "<div id= div-" + randomId + " contenteditable='true' data-bgcolor='#ccc' data-transition='zoom' data-autoanimate='' data-background='' data-backgroundiframe = '' data-backgroundvideo = '' class='secdiv' onmousedown=setLastFocusedDivId(this.id) > "
        //     + "<textarea class='secDivTextArea'  onchange='updatePreviewDiv(this)' >" + htmlPart + "</textarea><div class='secPreview'><div contenteditable='true' class='revealDummy' style=' margin: 10px;'><div class='slides'>" + htmlPartOrig + "</div></div></div>"
        //     + hdMeDiv 
        //     + "<button class='deleteDivInnImg' onclick=deleteCurrentComponent(this) ></button>  </div>" + partTwoHTML;

        var contentToAdd = "<div id= div-" + randomId + " class='shopTopBnrCls scale-in-center' style='animation-duration: 0.2' contenteditable='true' data-bgcolor='#ccc' data-transition='zoom' data-autoanimate='' data-background='' data-backgroundiframe = '' data-backgroundvideo = '' class='secdiv' onmousedown=setLastFocusedDivId(this.id) > "
            + "<textarea class='secDivTextArea'  onchange='updatePreviewDiv(this)' >" + htmlPart + "</textarea><div class='secPreview'><div contenteditable='true' class='revealDummy' style=' margin: 10px;'><div class='slides'>" + htmlPartOrig + "</div></div>"
            + hdMeDiv
            + "</div><button class='deleteDivInnImg' onclick=deleteCurrentComponent(this) ></button>  </div>";

        if (componentid == "description-shopTopBanner") {
            //document.querySelector('.secdiv').innerHTML = contentToAdd;
            elem.parentElement.parentElement.parentElement.innerHTML = contentToAdd;

            setTimeout(function () {
                var allItems = document.querySelectorAll(".shopTopBnrCls");
                for (i = 0; i < allItems.length; i++) {
                    allItems[i].classList.remove("scale-in-center");
                }
            }, 500);

        } else {
            document.getElementById(componentid).innerHTML = partOneHTML + contentToAdd + partTwoHTML;
        }

    } else if (type == "shopItem1") {

        var htmlPartOrig = '<div class="shopItemCls1" >'
            + "\n" + itemImagesDiv
            + "\n" + '</div>';


        htmlPart = escape(htmlPartOrig);

        var hdMeDiv = "<div class='hdMeDivCls' contenteditable='false'>"
            + allowTogglePreview
            + shopItemTabOptions
            + shopItemTabContentDivs
            + "</div>";

        var contentToAdd = "<div id= div-" + randomId + " class='shopItemCls scale-in-center' style='animation-duration: 0.2' contenteditable='true' data-bgcolor='#ccc' data-transition='zoom' data-autoanimate='' data-background='' data-backgroundiframe = '' data-backgroundvideo = '' class='secdiv storeItemDivCls' onmousedown=setLastFocusedDivId(this.id) > "
            + "<textarea class='secDivTextArea'  onchange='updatePreviewDiv(this)' >" + htmlPart + "</textarea><div class='secPreview'><div contenteditable='true' class='revealDummy' style=' margin: 10px;'><div class='slides'>" + htmlPartOrig + "</div></div>"
            + hdMeDiv
            + "</div><button class='deleteDivInnImg' onclick=deleteCurrentComponent(this) ></button>  </div>";

        if (elem == "addUndershopLyrics") {
            document.querySelector('.shopLyrics').innerHTML = document.querySelector('.shopLyrics').innerHTML + contentToAdd;


            setTimeout(function () {
                var allItems = document.querySelectorAll(".shopItemCls");
                for (i = 0; i < allItems.length; i++) {
                    allItems[i].classList.remove("scale-in-center");
                }
            }, 500);
        } else {
            document.getElementById(componentid).innerHTML = partOneHTML + contentToAdd + partTwoHTML;
        }


    } else if (type == "secTitleWithBG") {

        var htmlPartOrig = "<div class='slidingUp10px' style='background: #F6DA66; padding: 20px; border-radius: 20px; margin:auto; width:50%; margin-top: 100px'>"
            + "\n" + "Add Title "
            + "\n" + "</div>";

        htmlPart = escape(htmlPartOrig);

        var hdMeDiv = "<div class='hdMeDivCls' contenteditable='false'>"
            + revealSecColor
            + secTranition
            + mediaSection
            + "<button type='button' style='background: url(/smshopify/secimages/" + type + ".png); background-size: contain;' class='itmSecImg btn btn-primary' ></button>"
            + "</div>";

        document.getElementById(componentid).innerHTML = partOneHTML
            + "<div id= div-" + randomId + " contenteditable='true' data-bgcolor='#ccc' data-transition='zoom' data-autoanimate='' data-background='' data-backgroundiframe = '' data-backgroundvideo = '' class='secdiv' onmousedown=setLastFocusedDivId(this.id) > "
            + "<textarea class='secDivTextArea'  onchange='updatePreviewDiv(this)' >" + htmlPart + "</textarea><div class='secPreview'><div contenteditable='true' class='revealDummy' style=' margin: 10px;'><div class='slides'>" + htmlPartOrig + "</div></div></div>"
            + hdMeDiv
            + "<button class='deleteDivInnImg' onclick=deleteCurrentComponent(this) ></button>  </div>" + partTwoHTML;
    } else if (type == "SemiTransBG") {

        var htmlPartOrig = "<div class='slidingUp10px semiTransparentWhiteBG boxShadow5' style='opacity: 0.5; padding: 20px; border-radius: 20px; margin:auto; width:50%; margin-top: 100px'>"
            + "\n" + "Add Title "
            + "\n" + "</div>";

        htmlPart = escape(htmlPartOrig);

        var hdMeDiv = "<div class='hdMeDivCls' contenteditable='false'>"
            + revealSecColor
            + secTranition
            + mediaSection
            + "<button type='button' style='background: url(/smshopify/secimages/" + type + ".png); background-size: contain;' class='itmSecImg btn btn-primary' ></button>"
            + "</div>";

        document.getElementById(componentid).innerHTML = partOneHTML
            + "<div id= div-" + randomId + " contenteditable='true' data-bgcolor='#ccc' data-transition='zoom' data-autoanimate='' data-background='' data-backgroundiframe = '' data-backgroundvideo = '' class='secdiv' onmousedown=setLastFocusedDivId(this.id) > "
            + "<textarea class='secDivTextArea'  onchange='updatePreviewDiv(this)' >" + htmlPart + "</textarea><div class='secPreview'><div contenteditable='true' class='revealDummy' style=' margin: 10px;'><div class='slides'>" + htmlPartOrig + "</div></div></div>"
            + hdMeDiv
            + "<button class='deleteDivInnImg' onclick=deleteCurrentComponent(this) ></button>  </div>" + partTwoHTML;
    } else if (type == "SemiTransBG2") {

        var htmlPartOrig = "<div class='slidingUp10px semiTransparentBlackBG boxShadow5' style='opacity: 0.5; padding: 20px; border-radius: 20px; margin:auto; width:80%; margin-top: 10px'>"
            + "\n" + "Add Title "
            + "\n" + "</div>";

        htmlPart = escape(htmlPartOrig);

        var hdMeDiv = "<div class='hdMeDivCls' contenteditable='false'>"
            + revealSecColor
            + secTranition
            + mediaSection
            + "<button type='button' style='background: url(/smshopify/secimages/" + type + ".png); background-size: contain;' class='itmSecImg btn btn-primary' ></button>"
            + "</div>";

        document.getElementById(componentid).innerHTML = partOneHTML
            + "<div id= div-" + randomId + " contenteditable='true' data-bgcolor='#ccc' data-transition='zoom' data-autoanimate='' data-background='' data-backgroundiframe = '' data-backgroundvideo = '' class='secdiv' onmousedown=setLastFocusedDivId(this.id) > "
            + "<textarea class='secDivTextArea'  onchange='updatePreviewDiv(this)' >" + htmlPart + "</textarea><div class='secPreview'><div contenteditable='true' class='revealDummy' style=' margin: 10px;'><div class='slides'>" + htmlPartOrig + "</div></div></div>"
            + hdMeDiv
            + "<button class='deleteDivInnImg' onclick=deleteCurrentComponent(this) ></button>  </div>" + partTwoHTML;

    } else if (type == "secWithList1") {
        var htmlPartOrig = '<div class="fragment slideFragmentUp600px itemsWithBG" style=" background-color: #C3447A; color:#fff; margin-top:20px;">1. ABC</div>'
            + "\n" + '<div class="fragment slideFragmentUp600px itemsWithBG" style=" background-color: #C3447A; color:#fff;">2. ABC</div>'
            + "\n" + '<div class="fragment slideFragmentUp600px itemsWithBG" style=" background-color: #C3447A; color:#fff;">3. ABC</div>'
            + "\n" + '<div class="fragment slideFragmentUp600px itemsWithBG" style=" background-color: #C3447A; color:#fff;">4. ABC</div>'
            + "\n" + '<div class="fragment slideFragmentUp600px itemsWithBG" style=" background-color: #C3447A; color:#fff;">5. ABC</div>';
        htmlPart = escape(htmlPartOrig);

        var hdMeDiv = "<div class='hdMeDivCls' contenteditable='false'>"
            + revealSecColor
            + secTranition
            + mediaSection
            + "<button type='button' style='background: url(/smshopify/secimages/" + type + ".png); background-size: contain;' class='itmSecImg btn btn-primary' ></button>"
            + "</div>";

        document.getElementById(componentid).innerHTML = partOneHTML
            + "<div id= div-" + randomId + " contenteditable='true' data-bgcolor='#ccc' data-transition='zoom' data-autoanimate='' data-background='' data-backgroundiframe = '' data-backgroundvideo = '' class='secdiv' onmousedown=setLastFocusedDivId(this.id) > "
            + "<textarea class='secDivTextArea'  onchange='updatePreviewDiv(this)' >" + htmlPart + "</textarea><div class='secPreview'><div contenteditable='true' class='revealDummy' style=' margin: 10px;'><div class='slides'>" + htmlPartOrig + "</div></div></div>"
            + hdMeDiv
            + "<button class='deleteDivInnImg' onclick=deleteCurrentComponent(this) ></button>  </div>" + partTwoHTML;

    } else if (type == "titleWithItems1") {
        var htmlPartOrig = '<div style="top: 5px; display:block; background-color: #5B5EA6; margin: auto; padding: 20px;">'
            + "\n" + '<div class="fragment slideFragmentUp10px" style="color:#fff" >Heading</div>'
            + "\n" + '</div>'
            + "\n" + '<div>'
            + "\n" + '<div class="fragment slideFragmentUp600px  itemsWithBG" style=" background-color: #C3447A; color:#fff; margin-top:20px;">1. ABC</div>'
            + "\n" + '<div class="fragment slideFragmentUp600px itemsWithBG" style=" background-color: #C3447A; color:#fff;">2. ABC</div>'
            + "\n" + '<div class="fragment slideFragmentUp600px itemsWithBG" style=" background-color: #C3447A; color:#fff;">3. ABC</div>'
            + "\n" + '<div class="fragment slideFragmentUp600px itemsWithBG" style=" background-color: #C3447A; color:#fff;">4. ABC</div>'
            + "\n" + '<div class="fragment slideFragmentUp600px itemsWithBG" style=" background-color: #C3447A; color:#fff;">5. ABC</div>'
            + "\n" + '</div>';
        htmlPart = escape(htmlPartOrig);
        var hdMeDiv = "<div class='hdMeDivCls' contenteditable='false'>"
            + revealSecColor
            + secTranition
            + mediaSection
            + "<button type='button' style='background: url(/smshopify/secimages/" + type + ".png); background-size: contain;' class='itmSecImg btn btn-primary' ></button>"
            + "</div>";

        document.getElementById(componentid).innerHTML = partOneHTML
            + "<div id= div-" + randomId + " contenteditable='true' data-bgcolor='#ccc' data-transition='zoom' data-autoanimate='' data-background='' data-backgroundiframe = '' data-backgroundvideo = '' class='secdiv' onmousedown=setLastFocusedDivId(this.id) > "
            + "<textarea class='secDivTextArea'  onchange='updatePreviewDiv(this)' >" + htmlPart + "</textarea><div class='secPreview'><div contenteditable='true' class='revealDummy' style=' margin: 10px;'><div class='slides'>" + htmlPartOrig + "</div></div></div>"
            + hdMeDiv
            + "<button class='deleteDivInnImg' onclick=deleteCurrentComponent(this) ></button>  </div>" + partTwoHTML;

    } else if (type == "titleWithItems2") {
        var htmlPartOrig = '<div style="height: 900px;">'
            + "\n" + '<div style="float:left; width: 200px; height: 100%; top: 5px; display:block; background-color: #FF6F61; margin: auto; padding: 20px;">'
            + "\n" + '<div class="fragment slideFragmentUp10px" style="color:#fff; font-size: 30px; white-space: pre-wrap; word-wrap: break-word;" >Heading'
            + "\n" + '</div>'
            + "\n" + '</div>'
            + "\n" + '<div style="float:left; padding: 1%">'
            + "\n" + '<div class="fragment slideFragmentUp600px itemsWithBG" style="width:400px; background-color: #5B5EA6; color:#fff; margin-top:20px;">1. ABC</div>'
            + "\n" + '<div class="fragment slideFragmentUp600px itemsWithBG" style="width:400px; background-color: #5B5EA6; color:#fff;">2. ABC</div>'
            + "\n" + '<div class="fragment slideFragmentUp600px itemsWithBG" style="width:400px; background-color: #5B5EA6; color:#fff;">3. ABC</div>'
            + "\n" + '<div class="fragment slideFragmentUp600px itemsWithBG" style="width:400px; background-color: #5B5EA6; color:#fff;">4. ABC</div>'
            + "\n" + '<div class="fragment slideFragmentUp600px itemsWithBG" style="width:400px; background-color: #5B5EA6; color:#fff;">5. ABC</div>'
            + "\n" + '</div>'
            + "\n" + '</div>';
        htmlPart = escape(htmlPartOrig);
        var hdMeDiv = "<div class='hdMeDivCls' contenteditable='false'>"
            + revealSecColor
            + secTranition
            + mediaSection
            + "<button type='button' style='background: url(/smshopify/secimages/" + type + ".png); background-size: contain;' class='itmSecImg btn btn-primary' ></button>"
            + "</div>";

        document.getElementById(componentid).innerHTML = partOneHTML
            + "<div id= div-" + randomId + " contenteditable='true' data-bgcolor='#ccc' data-transition='zoom' data-autoanimate='' data-background='' data-backgroundiframe = '' data-backgroundvideo = '' class='secdiv' onmousedown=setLastFocusedDivId(this.id) > "
            + "<textarea class='secDivTextArea'  onchange='updatePreviewDiv(this)' >" + htmlPart + "</textarea><div class='secPreview'><div contenteditable='true' class='revealDummy' style=' margin: 10px;'><div class='slides'>" + htmlPartOrig + "</div></div></div>"
            + hdMeDiv
            + "<button class='deleteDivInnImg' onclick=deleteCurrentComponent(this) ></button>  </div>" + partTwoHTML;

    } else if (type == "titleWithItems3") {
        var htmlPartOrig = '<div style="height: 900px;">'
            + "\n" + '<div style="float:left; width: 200px; height: 100%; top: 5px; display:block; background-color: #955251; margin: auto; padding: 20px;">'
            + "\n" + '<div class="fragment slideFragmentUp10px" style="color:#fff; white-space: pre-wrap; word-wrap: break-word;" >Heading'
            + "\n" + '</div>'
            + "\n" + '</div>'
            + "\n" + '<div style="float:left; padding: 20px">'
            + "\n" + '<ul>'
            + "\n" + '<li class="fragment slideFragmentUp600px " style="  color:#fff; margin-top:20px;">1. ABC</li>'
            + "\n" + '<li class="fragment slideFragmentUp600px" style=" color:#fff;">2. ABC</li>'
            + "\n" + '<li class="fragment slideFragmentUp600px" style="  color:#fff;">3. ABC</li>'
            + "\n" + '<li class="fragment slideFragmentUp600px " style="  color:#fff;">4. ABC</li>'
            + "\n" + '<li class="fragment slideFragmentUp600px" style=" color:#fff;">5. ABC</li>'
            + "\n" + '</ul>'
            + "\n" + '</div>'
            + "\n" + '</div>';
        //htmlPartOrig = "Test";
        htmlPart = escape(htmlPartOrig);
        var hdMeDiv = "<div class='hdMeDivCls' contenteditable='false'>"
            + revealSecColor
            + secTranition
            + mediaSection
            + "<button type='button' style='background: url(/smshopify/secimages/" + type + ".png); background-size: contain;' class='itmSecImg btn btn-primary' ></button>"
            + "</div>";

        document.getElementById(componentid).innerHTML = partOneHTML
            + "<div id= div-" + randomId + " contenteditable='true' data-bgcolor='#ccc' data-transition='zoom' data-autoanimate='' data-background='' data-backgroundiframe = '' data-backgroundvideo = '' class='secdiv' onmousedown=setLastFocusedDivId(this.id) > "
            + "<textarea class='secDivTextArea'  onchange='updatePreviewDiv(this)' >" + htmlPart + "</textarea><div class='secPreview'><div contenteditable='true' class='revealDummy' style=' margin: 10px;'><div class='slides'>" + htmlPartOrig + "</div></div></div>"
            + hdMeDiv
            + "<button class='deleteDivInnImg' onclick=deleteCurrentComponent(this) ></button>  </div>" + partTwoHTML;


    } else if (type == "zoomingImage1") {
        var htmlPartOrig = '<img class="zoomingImg" style="animation-duration: 4s;" src="/smshopify/img/animaker-test9-1414.png">';
        htmlPart = escape(htmlPartOrig);
        var hdMeDiv = "<div class='hdMeDivCls' contenteditable='false'>"
            + revealSecColor
            + secTranition
            + mediaSection
            + "<button type='button' style='background: url(/smshopify/secimages/" + type + ".png); background-size: contain;' class='itmSecImg btn btn-primary' ></button>"
            + "</div>";

        document.getElementById(componentid).innerHTML = partOneHTML
            + "<div id= div-" + randomId + " contenteditable='true' data-bgcolor='#ccc' data-transition='zoom' data-autoanimate='' data-background='' data-backgroundiframe = '' data-backgroundvideo = '' class='secdiv' onmousedown=setLastFocusedDivId(this.id) > "
            + "<textarea class='secDivTextArea'  onchange='updatePreviewDiv(this)' >" + htmlPart + "</textarea><div class='secPreview'><div contenteditable='true' class='revealDummy' style=' margin: 10px;'><div class='slides'>" + htmlPartOrig + "</div></div></div>"
            + hdMeDiv
            + "<button class='deleteDivInnImg' onclick=deleteCurrentComponent(this) ></button>  </div>" + partTwoHTML;

    } else if (type == "titleTextCode1") {
        var htmlPartOrig = '<div style="height: 900px;">'
            + "\n" + '<div style="float:left; width: 200px; height: 100%; top: 5px; display:block; background-color: #FF6F61; margin: auto; padding: 20px;">'
            + "\n" + '<div class="fragment slideFragmentUp10px" style="color:#fff; white-space: pre-wrap; word-wrap: break-word;" >Heading'
            + "\n" + '</div>'
            + "\n" + '</div>'
            + "\n" + '<div style="float:left; padding: 1%">'
            + "\n" + '<div class="fragment infoBox">A statement is a single line of code that performs an action</div>'
            + "\n" + '<div class="fragment fr-bounce-in-top codeBox5" style="animation-duration: 1s;">'
            + "\n" + 'int x = 10;'
            + "\n" + '</div>'
            + "\n" + '</div>'
            + "\n" + '</div>';
        //htmlPartOrig = "Test";
        htmlPart = escape(htmlPartOrig);
        var hdMeDiv = "<div class='hdMeDivCls' contenteditable='false'>"
            + revealSecColor
            + secTranition
            + mediaSection
            + "<button type='button' style='background: url(/smshopify/secimages/" + type + ".png); background-size: contain;' class='itmSecImg btn btn-primary' ></button>"
            + "</div>";

        document.getElementById(componentid).innerHTML = partOneHTML
            + "<div id= div-" + randomId + " contenteditable='true' data-bgcolor='#ccc' data-transition='zoom' data-autoanimate='' data-background='' data-backgroundiframe = '' data-backgroundvideo = '' class='secdiv' onmousedown=setLastFocusedDivId(this.id) > "
            + "<textarea class='secDivTextArea'  onchange='updatePreviewDiv(this)' >" + htmlPart + "</textarea><div class='secPreview'><div contenteditable='true' class='revealDummy' style=' margin: 10px;'><div class='slides'>" + htmlPartOrig + "</div></div></div>"
            + hdMeDiv
            + "<button class='deleteDivInnImg' onclick=deleteCurrentComponent(this) ></button>  </div>" + partTwoHTML;

    } else if (type == "titleTextCode2") {
        var htmlPartOrig = '<div class="fragment infoBox">Title</div>'
            + "\n" + '<div class="fragment fr-bounce-in-top codeBox5" style="animation-duration: 1s;">'
            + "\n" + 'int x = 10;'
            + "\n" + '</div>';
        //htmlPartOrig = "Test";
        htmlPart = escape(htmlPartOrig);
        var hdMeDiv = "<div class='hdMeDivCls' contenteditable='false'>"
            + revealSecColor
            + secTranition
            + mediaSection
            + "<button type='button' style='background: url(/smshopify/secimages/" + type + ".png); background-size: contain;' class='itmSecImg btn btn-primary' ></button>"
            + "</div>";

        document.getElementById(componentid).innerHTML = partOneHTML
            + "<div id= div-" + randomId + " contenteditable='true' data-bgcolor='#ccc' data-transition='zoom' data-autoanimate='' data-background='' data-backgroundiframe = '' data-backgroundvideo = '' class='secdiv' onmousedown=setLastFocusedDivId(this.id) > "
            + "<textarea class='secDivTextArea'  onchange='updatePreviewDiv(this)' >" + htmlPart + "</textarea><div class='secPreview'><div contenteditable='true' class='revealDummy' style=' margin: 10px;'><div class='slides'>" + htmlPartOrig + "</div></div></div>"
            + hdMeDiv
            + "<button class='deleteDivInnImg' onclick=deleteCurrentComponent(this) ></button>  </div>" + partTwoHTML;

    } else if (type == "quizMCQFullScreen") {
        var htmlPartOrig = '<div style="top: 0px; display:block; background-color: #5B5EA6; margin: auto; padding: 4%;">'
            + "\n" + '<div class="fragment slideFragmentUp10px" style="color:#fff; font-size: x-large; text-align:left">Heading</div>'
            + "\n" + '</div>'

            + "\n" + '<div class="fragment slideFragmentUp600px  boxShadow5 ansOption" style=" margin: auto; width:90%; margin-top:1%;  font-size: x-large;  background-color: #EA6A47; color:#fff; padding:1%;">2. ABC<audio><source data-src="/smshopify/sounds/arrow-whoosh.wav" type="audio/wav"><source data-src="/smshopify/sounds/arrow-whoosh.mp3" type="audio/mp3"></audio></div>'
            + "\n" + '<div class="fragment slideFragmentUp600px boxShadow5 ansOption" style=" margin: auto; width:90%; margin-top:1%;  font-size: x-large; background-color: #EA6A47; color:#fff; padding:1%;">3. ABC<audio><source data-src="/smshopify/sounds/arrow-whoosh.wav" type="audio/wav"><source data-src="/smshopify/sounds/arrow-whoosh.mp3" type="audio/mp3"></audio></div>'
            + "\n" + '<div class="fragment slideFragmentUp600px boxShadow5 ansOption" style=" margin: auto; width:90%; margin-top:1%;  font-size: x-large; background-color: #EA6A47; color:#fff; padding:1%;">4. ABC<audio><source data-src="/smshopify/sounds/arrow-whoosh.wav" type="audio/wav"><source data-src="/smshopify/sounds/arrow-whoosh.mp3" type="audio/mp3"></audio></div>'
            + "\n" + '<div class="fragment slideFragmentUp600px boxShadow5 ansOption" style=" margin: auto; width:90%; margin-top:1%;  font-size: x-large; background-color: #EA6A47; color:#fff; padding:1%;">5. ABC<audio><source data-src="/smshopify/sounds/arrow-whoosh.wav" type="audio/wav"><source data-src="/smshopify/sounds/arrow-whoosh.mp3" type="audio/mp3"></audio></div>'

            + "\n" + '<div  class="fragment countDown5" style="background:#000; color:#fff; opacity: 0.4 ; width: 4%; border-radius: 10px; position: absolute; top: 1%; right: 1%">5</div>'
            + "\n" + '<div  class="fragment showRightAns" data-ans="3. ABC"><audio><source data-src="/smshopify/sounds/bell-ding-586.wav" type="audio/wav"><source data-src="/smshopify/sounds/bell-ding-586.mp3" type="audio/mp3"></audio></div>';

        //htmlPartOrig = "Test";
        htmlPart = escape(htmlPartOrig);
        var hdMeDiv = "<div class='hdMeDivCls' contenteditable='false'>"
            + revealSecColor
            + secTranition
            + mediaSection
            + "<button type='button' style='background: url(/smshopify/secimages/" + type + ".png); background-size: contain;' class='itmSecImg btn btn-primary' ></button>"
            + "</div>";

        document.getElementById(componentid).innerHTML = partOneHTML
            + "<div id= div-" + randomId + " contenteditable='true' data-bgcolor='#ccc' data-transition='zoom' data-autoanimate='' data-background='' data-backgroundiframe = '' data-backgroundvideo = '' class='secdiv' onmousedown=setLastFocusedDivId(this.id) > "
            + "<textarea class='secDivTextArea'  onchange='updatePreviewDiv(this)' >" + htmlPart + "</textarea><div class='secPreview'><div contenteditable='true' class='revealDummy' style=' margin: 10px;'><div class='slides'>" + htmlPartOrig + "</div></div></div>"
            + hdMeDiv
            + "<button class='deleteDivInnImg' onclick=deleteCurrentComponent(this) ></button>  </div>" + partTwoHTML;

    } else if (type == "quizMCQFullScreenLow") {
        var htmlPartOrig = '<div style="top: 0px; display:block; background-color: #5B5EA6; margin: auto; padding: 4%;">'
            + "\n" + '<div class="fragment slideFragmentUp10px" style="color:#fff; font-size: x-large; text-align:left">Heading</div>'
            + "\n" + '</div>'

            + "\n" + '<div class="fragment slideFragmentUp600px  boxShadow5 ansOption" style=" margin: auto; width:90%; margin-top:1%;  font-size: x-large;  background-color: #EA6A47; color:#fff; padding:1%;">2. ABC<audio><source data-src="/smshopify/sounds/low-arrow-whoosh.wav" type="audio/wav"><source data-src="/smshopify/sounds/low-arrow-whoosh.mp3" type="audio/mp3"></audio></div>'
            + "\n" + '<div class="fragment slideFragmentUp600px boxShadow5 ansOption" style=" margin: auto; width:90%; margin-top:1%;  font-size: x-large; background-color: #EA6A47; color:#fff; padding:1%;">3. ABC<audio><source data-src="/smshopify/sounds/low-arrow-whoosh.wav" type="audio/wav"><source data-src="/smshopify/sounds/low-arrow-whoosh.mp3" type="audio/mp3"></audio></div>'
            + "\n" + '<div class="fragment slideFragmentUp600px boxShadow5 ansOption" style=" margin: auto; width:90%; margin-top:1%;  font-size: x-large; background-color: #EA6A47; color:#fff; padding:1%;">4. ABC<audio><source data-src="/smshopify/sounds/low-arrow-whoosh.wav" type="audio/wav"><source data-src="/smshopify/sounds/low-arrow-whoosh.mp3" type="audio/mp3"></audio></div>'
            + "\n" + '<div class="fragment slideFragmentUp600px boxShadow5 ansOption" style=" margin: auto; width:90%; margin-top:1%;  font-size: x-large; background-color: #EA6A47; color:#fff; padding:1%;">5. ABC<audio><source data-src="/smshopify/sounds/low-arrow-whoosh.wav" type="audio/wav"><source data-src="/smshopify/sounds/low-arrow-whoosh.mp3" type="audio/mp3"></audio></div>'

            + "\n" + '<div  class="fragment countDown5" style="background:#000; color:#fff; opacity: 0.4 ; width: 4%; border-radius: 10px; position: absolute; top: 1%; right: 1%">5</div>'
            + "\n" + '<div  class="fragment showRightAns" data-ans="3. ABC"><audio><source data-src="/smshopify/sounds/low-bell-ding.wav" type="audio/wav"><source data-src="/smshopify/sounds/low-bell-ding.mp3" type="audio/mp3"></audio></div>';

        //htmlPartOrig = "Test";
        htmlPart = escape(htmlPartOrig);
        var hdMeDiv = "<div class='hdMeDivCls' contenteditable='false'>"
            + revealSecColor
            + secTranition
            + mediaSection
            + "<button type='button' style='background: url(/smshopify/secimages/" + type + ".png); background-size: contain;' class='itmSecImg btn btn-primary' ></button>"
            + "</div>";

        document.getElementById(componentid).innerHTML = partOneHTML
            + "<div id= div-" + randomId + " contenteditable='true' data-bgcolor='#ccc' data-transition='zoom' data-autoanimate='' data-background='' data-backgroundiframe = '' data-backgroundvideo = '' class='secdiv' onmousedown=setLastFocusedDivId(this.id) > "
            + "<textarea class='secDivTextArea'  onchange='updatePreviewDiv(this)' >" + htmlPart + "</textarea><div class='secPreview'><div contenteditable='true' class='revealDummy' style=' margin: 10px;'><div class='slides'>" + htmlPartOrig + "</div></div></div>"
            + hdMeDiv
            + "<button class='deleteDivInnImg' onclick=deleteCurrentComponent(this) ></button>  </div>" + partTwoHTML;


    } else if (type == "zoomingImage1") {
        var htmlPartOrig = '<img class="zoomingImg" style="animation-duration: 4s;" src="/smshopify/img/animaker-test9-1414.png">';
        htmlPart = escape(htmlPartOrig);
        var hdMeDiv = "<div class='hdMeDivCls' contenteditable='false'>"
            + revealSecColor
            + secTranition
            + mediaSection
            + "<button type='button' style='background: url(/smshopify/secimages/" + type + ".png); background-size: contain;' class='itmSecImg btn btn-primary' ></button>"
            + "</div>";

        document.getElementById(componentid).innerHTML = partOneHTML
            + "<div id= div-" + randomId + " contenteditable='true' data-bgcolor='#ccc' data-transition='zoom' data-autoanimate='' data-background='' data-backgroundiframe = '' data-backgroundvideo = '' class='secdiv' onmousedown=setLastFocusedDivId(this.id) > "
            + "<textarea class='secDivTextArea'  onchange='updatePreviewDiv(this)' >" + htmlPart + "</textarea><div class='secPreview'><div contenteditable='true' class='revealDummy' style=' margin: 10px;'><div class='slides'>" + htmlPartOrig + "</div></div></div>"
            + hdMeDiv
            + "<button class='deleteDivInnImg' onclick=deleteCurrentComponent(this) ></button>  </div>" + partTwoHTML;

    } else if ((type == "air-in-a-hit") || (type == "arrow-whoosh") || (type == "bell-ding-586") ||
        (type == "fast-blow") || (type == "fast-sweep") || (type == "keyboard-key-presses") ||
        (type == "page-flip-01a") || (type == "paper-slide") || (type == "pop") || (type == "low-bell-ding") ||
        (type == "low-arrow-whoosh") || (type == "low-sand-swish") ||
        (type == "sand-swish") || (type == "ui-zoom-in")) {
        var htmlToInsert = "<audio>"
            + "<source data-src='/smshopify/sounds/" + type + ".wav' type='audio/wav'>"
            + "<source data-src='/smshopify/sounds/" + type + ".mp3' type='audio/mp3'>"
            + "</audio>";
        insertHTMLAtCaret(escape(htmlToInsert));
    } else if (type == "code-snippet") {
        var htmlToInsert = "<div class='quizCode'>"
            + "<pre><code data-trim data-noescape>"
            + "int i = 0;"
            + "</code></pre></div>";
        insertHTMLAtCaret(escape(htmlToInsert));
    } else if (type == "secDivText1") {
        var hdMeDiv = "<div class='hdMeDivCls' contenteditable='false'>"
            + revealSecColor
            + secTranition
            + "<select class='colorSelect' onchange='updateParentFontColor(this)'>"
            + "<option value='#00ffff'>#00ffff</option>"
            + "<option value='#bb00bb'>#bb00bb</option>"
            + "<option value='#ff0000'>#ff0000</option>"
            + "<option value='#888888'>#888888</option>"
            + "<option value='#417203'>#417203</option>"
            + "<option value='#934f4d'>#934f4d</option>"
            + "<option value='salmon'>salmon</option>"
            + "</select>"
            + "</div>";
        var htmlToInsert = "<div id= div-" + randomId + " contenteditable='true' class='sectxt' onmousedown=setLastFocusedDivId(this.id) > Text1 Inside SectionDiv " + hdMeDiv + "<button class='deleteDivInnImg' onclick=deleteCurrentComponent(this) ></button>  </div>";
        insertHTMLAtCaret(htmlToInsert);
    }

    // setTimeout(function() {
    //     showitemImages(itemImageIndex);
    // }, 1000);


}

function submitQuiz() {
    var obj = JSON.parse(document.getElementById("hdmidivid").innerText);
    var keys = Object.keys(obj);
    var elems = document.getElementsByClassName("dynamicradio");
    var rtans = 0;
    var wans = 0;
    document.getElementById("qzerr").innerHTML = "";

    for (i = 0; i < elems.length; i++) {
        if (elems[i].checked) {
            if (elems[i].value == obj[elems[i].name]) {
                rtans = rtans + 1;
                elems[i].parentElement.style.backgroundColor = "#C1F1E0";
            } else {
                wans = wans + 1;
                elems[i].parentElement.style.backgroundColor = "#FDCFC0";
            }
        } else if (elems[i].value == obj[elems[i].name]) {
            elems[i].parentElement.style.backgroundColor = "#C1F1E0";
        } else {
            elems[i].parentElement.style.backgroundColor = "white";
        }
    }

    if (rtans + wans < keys.length) {
        for (i = 0; i < elems.length; i++) {
            elems[i].parentElement.style.backgroundColor = "white";
        }

        document.getElementById("qzerr").innerHTML = "Please provide a response to all the questions";
    } else {
        var percent = rtans * 100 / (rtans + wans);
        percent = percent.toFixed(2);
        if (localStorage.getItem("userLoggedIn") == "n") {
            document.getElementById("qzres").innerHTML = "You scored " + percent + "%. Click on the button below to retry.<br> Scores get saved for " + '<a href="' + the.hosturl + '/?target=login">logged in</a>' + " users.";
        } else {
            document.getElementById("qzres").innerHTML = "You scored " + percent + "%. Click on the button below to retry.<br> The score has been recorded on the profile.";
            var userdata = localStorage.getItem("userdata");
            var userObjs;
            var newscores = [];
            var date = new Date();
            let options = {
                weekday: "long", year: "numeric", month: "short",
                day: "numeric", hour: "2-digit", minute: "2-digit"
            };

            var newscore = { "quiz": document.URL, "percent": percent, "time": date.toLocaleTimeString("en-us", options) };

            if (userdata != "") {
                userObjs = JSON.parse(userdata);
                newscores = userObjs.scores;
                newscores.push(newscore);
                userObjs.scores = newscores;
            } else {
                newscores.push(newscore);
                userObjs = { scores: newscores };
            }


            var newdata = JSON.stringify(userObjs);

            localStorage.setItem("userdata", newdata);
            updateInfo(newdata);
        }
        document.getElementById("sbmtqzdivid").style.display = "none";
        document.getElementById("retryqzdivid").style.display = "block";

    }
}

function showProfile() {
    var userdata = localStorage.getItem("userdata");
    var userObjs;
    var scoresList;
    var newHTML = "";
    if ((userdata != null) && (userdata != "")) {
        userObjs = JSON.parse(userdata);
        scoresList = userObjs.scores;
        newHTML = newHTML + "<div class='scoresheader'>Quiz Scores</div>";
        newHTML = newHTML + "<table class ='scorestablecls' ><tr><th>Quiz</th><th>Score</th><th>Datetime</th></tr>";
        for (var key in scoresList) {
            var obj = scoresList[key];
            var qzURL = (obj.quiz).split("/items/");
            var link = qzURL[1];

            newHTML = newHTML + "<tr><td> <a class= 'itemLink' href='" + obj.quiz + "'> " + link + " </a></td><td>" + obj.percent + "% </td><td>" + obj.time + "</td></tr>"

        }
        newHTML = newHTML + "</table>";
    } else {
        newHTML = newHTML + "<div class='scoresheader'>Quiz Scores</div> No scores found";
    }

    document.getElementById("HelpTopicsDivId").style.display = "none";
    document.getElementById("accActivatedDivId").style.display = "none";
    document.getElementById("contactusDivId").style.display = "none";
    document.getElementById("filescannerDivId").style.display = "none";
    document.getElementById("forgotPWDivId").style.display = "none";
    document.getElementById("forgotPasswordSecDivId").style.display = "none";
    document.getElementById("helpDetailsDivId").style.display = "none";
    document.getElementById("homeDivId").style.display = "none";
    document.getElementById("howtoDivId").style.display = "none";
    document.getElementById("languageOverride").style.display = "none";
    document.getElementById("languageScanResultDivId").style.display = "none";
    document.getElementById("loginDivId").style.display = "none";
    document.getElementById("loginSecDivId").style.display = "none";
    document.getElementById("projectscannerDivId").style.display = "none";
    document.getElementById("registerSecDivId").style.display = "none";
    document.getElementById("itemDivId").style.display = "none";
    document.getElementById("itemEditDivId").style.display = "none";
    document.getElementById("itemListDivId").style.display = "none";
    document.getElementById("helpDisplayDivId").style.display = "none";


    document.getElementById("profileDivId").style.display = "block";
    document.getElementById("profileDivId").innerHTML = newHTML;
}

function refreshPage() {
    var path = window.location.pathname;
    window.location.href = path;
}

function updateDescription(itemid, createNewItem) {

    var usremail = localStorage.getItem("userEmail");

    var title = "(New) Please Edit";

    if (usremail == null) {
        error_message = "Not authorized";
        document.getElementById("updateitemerrormsg-" + itemid).innerHTML = "<font color = #cc0000>" + error_message + "</font> ";
        return;
    } else if (usremail == "Guest") {
        error_message = "Not authorized";
        document.getElementById("updateitemerrormsg-" + itemid).innerHTML = "<font color = #cc0000>" + error_message + "</font> ";
        return;
    }


    var ele = document.getElementsByClassName('dynamicradio');

    for (i = 0; i < ele.length; i++) {
        //if(ele[i].checked)
        //console.log(ele[i].parentElement.innerText);
        ele[i].value = ele[i].parentElement.innerText;


        //document.getElementById("result").innerHTML = "Gender: "+ele[i].value;
    }

    var elem = document.getElementsByClassName('qz1-rtans');
    var kys = {};
    var ki = "";
    var val = "";
    for (i = 0; i < elem.length; i++) {


        //ki = elem[i].id;
        //kys.ki = elem[i].innerText;

        ki = elem[i].id;
        ki = ki.replace("-rtans", "");

        val = elem[i].innerText;
        val = val.replace(/(\r\n|\n|\r)/gm, "");
        kys[ki] = val;

    }

    if (itemid == "" && createNewItem == "y") {
        if (localStorage.getItem("userLoggedIn") == "n") {

            error_message = "Not authorized";
            document.getElementById("updateitemerrormsg-" + itemid).innerHTML = "<font color = #cc0000>" + error_message + "</font> ";
            return;

        } else if (localStorage.getItem("userLvl") != "9") {
            error_message = "Not authorized";
            document.getElementById("updateitemerrormsg-" + itemid).innerHTML = "<font color = #cc0000>" + error_message + "</font> ";
            return;
        }


    } else {
        document.getElementById("updateitemerrormsg-" + itemid).innerHTML = "<font color = red>" + " " + "</font> ";

        title = document.getElementById("title-" + itemid).value;
        titleseq = document.getElementById("titleseq-" + itemid).value;
        category = document.getElementById("category-" + itemid).value;
        categoryseq = document.getElementById("categoryseq-" + itemid).value;
        subcategory = document.getElementById("subcategory-" + itemid).value;
        subcategoryseq = document.getElementById("subcategoryseq-" + itemid).value;
        shortdescription = document.getElementById("shortdescription-" + itemid).value;

        writer = document.getElementById("writer-" + itemid).value;
        keywords = document.getElementById("keywords-" + itemid).value;
        discontinue = document.getElementById("discontinue-" + itemid).value;


        description = document.getElementById("description-" + itemid).innerHTML;

        var keys = Object.keys(kys);

        if (keys.length > 0) {
            if (description.includes("hdmidivid")) {
                description = description.substring(0, description.indexOf("hdmidivid") - 9);
            }

            description = description + "<div id='hdmidivid' class='hdmicls'>" + JSON.stringify(kys) + "</div>";


        }
        discontinue = document.getElementById("discontinue-" + itemid).value;


        if (localStorage.getItem("userLoggedIn") == "n") {

            error_message = "Not authorized";
            document.getElementById("updateitemerrormsg-" + itemid).innerHTML = "<font color = #cc0000>" + error_message + "</font> ";
            return;

        } else if (localStorage.getItem("userLvl") != "9") {
            error_message = "Not authorized";
            document.getElementById("updateitemerrormsg-" + itemid).innerHTML = "<font color = #cc0000>" + error_message + "</font> ";
            return;
        }
    }
    var StrFunction = "UpdateDesc";

    title = title.replaceAll("'", "''");
    category = category.replaceAll("'", "''");
    subcategory = subcategory.replaceAll("'", "''");
    shortdescription = shortdescription.replace(/"/g, '\'');
    shortdescription = shortdescription.replaceAll("'", "''");
    description = description.replaceAll("'", "''");
    //let regex = /\\/g;
    description = description.replace(/\\/g, "\\\\");

    writer = writer.replaceAll("'", "''");
    keywords = keywords.replaceAll("'", "''");


    $.ajax({
        url: the.hosturl + '/php/process.php',
        data: {
            usremail: usremail,
            itemid: itemid,
            title: title,
            titleseq: titleseq,
            category: category,
            categoryseq: categoryseq,
            subcategory: subcategory,
            subcategoryseq: subcategoryseq,
            shortdescription: shortdescription,
            description: description,
            writer: writer,
            keywords: keywords,
            discontinue: discontinue,
            createNewItem: createNewItem,
            usrfunction: StrFunction
        },
        type: 'POST',
        dataType: 'json',
        success: function (retstatus) {
            //alert("Inside login success retstatus =" + retstatus);
            //console.log( "Inside updateItem success retstatus =" + retstatus);

            if (retstatus == "err") {
                //alert("Please relogin");
                goToLogin();
            }

            sessionStorage.setItem("itemsList", null);
            //sessionStorage.setItem("itemList", null);
            getItemsList();
            if (itemid == "") {
                //showMdaItems();

            } else {
                document.getElementById("updateitemerrormsg-" + itemid).innerHTML = "<font color = #cc0000>" + "Processed successfully" + "</font> ";
            }
            //displayCart();

        },
        error: function (xhr, status, error) {
            if (!itemid == "") {
                document.getElementById("updateitemerrormsg-" + itemid).innerHTML = "<font color = #cc0000>" + "Failed to update" + "</font> ";
            }
            //alert(xhr);

            //console.log(error);
            //console.log(xhr);
        }
    });
}

async function saveNewStore(itemid, createNewItem) {



    document.querySelector(".shopSmErr").style.display = "none";
    //document.getElementByClassName("shopSmErr").style.display = "none";
    var usremail = localStorage.getItem("userEmail");

    //var title = "(New) Please Edit";

    // if (usremail == null) {
    //     error_message = "Not authorized";
    //     document.getElementById("updateitemerrormsg-" + itemid).innerHTML = "<font color = #cc0000>" + error_message + "</font> ";
    //     return;
    // } else if (usremail == "Guest") {
    //     error_message = "Not authorized";
    //     document.getElementById("updateitemerrormsg-" + itemid).innerHTML = "<font color = #cc0000>" + error_message + "</font> ";
    //     return;
    // }


    // if (itemid == "" && createNewItem == "y") {
    //     if (localStorage.getItem("userLoggedIn") == "n") {

    //         error_message = "Not authorized";
    //         document.getElementById("updateitemerrormsg-" + itemid).innerHTML = "<font color = #cc0000>" + error_message + "</font> ";
    //         return;

    //     } else if (localStorage.getItem("userLvl") != "9") {
    //         error_message = "Not authorized";
    //         document.getElementById("updateitemerrormsg-" + itemid).innerHTML = "<font color = #cc0000>" + error_message + "</font> ";
    //         return;
    //     }


    // } else {

    var errorInfo = "";
    var storename = localStorage.getItem("storename");
    var bannerhtml = document.querySelector(".shopTopBanner").parentElement.innerHTML;
    var displayhoursflag = document.querySelector(".showStoreHr").checked ? '1' : '0';
    var hourshtml = document.querySelector(".storeHrDivCls").innerHTML;
    var availabilityinfo = document.getElementById("availabilityDivId").innerHTML;

    if (document.querySelector(".showStoreAvail").checked) {
        if (availabilityinfo == "") {
            errorInfo = errorInfo + "Hours availability is checked but information is not provided." + "<br>";
        }
    }

    var displaylocationflag = document.querySelector(".showStoreLoc").checked ? '1' : '0';
    var maplocationcoordinates = localStorage.getItem("latitude") + "," + localStorage.getItem("longitude");
    //var uselocationfromaddress = document.getElementById("storeAddrDivId").innerHTML;
    var uselocationfromaddress = "shopaddressline1^" + document.getElementById("shopaddressline1").innerHTML + "~" +
        "shopcity^" + document.getElementById("shopcity").innerHTML + "~" +
        "shopstate^" + document.getElementById("shopstate").innerHTML + "~" +
        "shopcountry^" + document.getElementById("shopcountry").innerHTML + "~" +
        "shoppostalcode^" + document.getElementById("shoppostalcode").innerHTML;

    if (document.querySelector(".showStoreAddr").checked) {
        if (uselocationfromaddress == "") {
            errorInfo = errorInfo + "Location address is checked but information is not provided." + "<br>";
        }
    }

    var allItems = document.querySelectorAll(".shopItemCls");
    for (i = 0; i < allItems.length; i++) {
        if (allItems[i].querySelector('.itemNameCls').innerHTML == "") {
            errorInfo = errorInfo + "Name has not been provided for one or more items added." + "<br>";
            break;
        }
    }

    if (errorInfo != "") {
        document.querySelector(".shopSmErr").style.display = "block";
        document.querySelector(".shopSmErr").innerHTML = errorInfo;

        //document.getElementByClassName("shopSmErr").style.display = "block";
        //document.getElementByClassName("shopSmErr").innerHTML = errorInfo;
        return;
    }

    const confirm = await ui.userConfirmation('By this submission you are confirming that the details you have provided are accurate and legal. Invalid/unfair submissions will result in your account getting disabled.');

    if (!confirm) {
        return;
    }

    var category = localStorage.getItem("storetype");
    var categoryseq = localStorage.getItem("storecatsequence");
    var title = storename;
    var titleseq = 1;
    var subcategory = "";
    var subcategoryseq = "1";
    var shortdescription = "";
    var description = document.querySelector(".storeDescriptionCls").innerHTML;
    var writer = "";
    var keywords = "";
    var discontinue = "0";

    var itemprice = "";
    var itemimages = "";
    var itemdescription = "";


    var StrFunction = "SubmitForReview";


    $.ajax({
        url: the.hosturl + '/php/process.php',
        data: {
            usremail: usremail,
            itemid: itemid,
            title: title,
            titleseq: titleseq,
            category: category,
            categoryseq: categoryseq,
            subcategory: subcategory,
            subcategoryseq: subcategoryseq,
            shortdescription: shortdescription,
            description: description,
            writer: writer,
            keywords: keywords,
            discontinue: discontinue,
            createNewItem: createNewItem,
            itemprice: itemprice,
            itemimages: itemimages,
            itemdescription: itemdescription,
            displaylocationflag: displaylocationflag,
            maplocationcoordinates: maplocationcoordinates,
            address: "",
            uselocationfromaddress: uselocationfromaddress,
            coordinatesfromaddress: "",
            displayhoursflag: displayhoursflag,
            hourshtml: hourshtml,
            availabilityinfo: availabilityinfo,
            storename: storename,
            bannerhtml: bannerhtml,
            usrfunction: StrFunction

        },
        type: 'POST',
        dataType: 'json',
        success: function (retstatus) {
        },
        error: function (xhr, status, error) {
            if (!itemid == "") {
                document.getElementById("updateitemerrormsg-" + itemid).innerHTML = "<font color = #cc0000>" + "Failed to update" + "</font> ";
            }
        }
    });

    if (allItems.length == 0){
        document.querySelector(".bottomNavigationCls").innerHTML = '<div class="greenMsg scale-up-ver-top text_align_center" style="animation-duration: 0.1">Thank you for your submission. We will review and notify you after completion. <br> <br> <button class="button_type1" onclick="goToHome()">Go To Home</button></div>'
        return;
    }

    for (i = 0; i < allItems.length; i++) {

        title = allItems[i].querySelector('.itemNameCls').innerHTML;
        titleseq = 2 + i;

        itemprice = allItems[i].querySelector('.itemPriceCls').innerHTML;
        itemimages = allItems[i].querySelector('.itemImageshow-container').innerHTML;
        itemdescription = allItems[i].querySelector('.itemDescriptionCls').innerHTML;

        hourshtml = "";
        availabilityinfo = "";
        maplocationcoordinates = "";
        uselocationfromaddress = "";
        bannerhtml = "";

        $.ajax({
            url: the.hosturl + '/php/process.php',
            data: {
                usremail: usremail,
                itemid: itemid,
                title: title,
                titleseq: titleseq,
                category: category,
                categoryseq: categoryseq,
                subcategory: subcategory,
                subcategoryseq: subcategoryseq,
                shortdescription: shortdescription,
                description: "",
                writer: writer,
                keywords: keywords,
                discontinue: discontinue,
                createNewItem: createNewItem,
                itemprice: itemprice,
                itemimages: itemimages,
                itemdescription: itemdescription,
                displaylocationflag: displaylocationflag,
                maplocationcoordinates: maplocationcoordinates,
                address: "",
                uselocationfromaddress: uselocationfromaddress,
                coordinatesfromaddress: "",
                displayhoursflag: displayhoursflag,
                hourshtml: hourshtml,
                availabilityinfo: availabilityinfo,
                storename: storename,
                bannerhtml: bannerhtml,
                usrfunction: StrFunction

            },
            type: 'POST',
            dataType: 'json',
            success: function (retstatus) {
                 if (i == allItems.length - 1) {
                    document.querySelector(".bottomNavigationCls").innerHTML = '<div class="greenMsg scale-up-ver-top text_align_center" style="animation-duration: 0.1">Thank you for your submission. We will review and notify you after completion. <br> <br> <button class="button_type1" onclick="goToHome()">Go To Home</button></div>'

                //     sessionStorage.setItem("itemsList", null);
                //     getItemsList();
                 }
            },
            error: function (xhr, status, error) {
                //if (!itemid == "") {
                    //document.getElementById("updateitemerrormsg-" + itemid).innerHTML = "<font color = #cc0000>" + "Failed to update" + "</font> ";
                    
                    document.querySelector(".bottomNavigationCls").innerHTML = '<div class="redMsg scale-up-ver-top text_align_center" style="animation-duration: 0.1">Submission failed. Please try again after sometime. <br> <br> <button class="button_type1" onclick="goToHome()">Go To Home</button></div>'
                    return;
                //}
            }
        });
    }


}

function updateInfo(data) {

    var StrFunction = "updateinfo"

    var usremail = localStorage.getItem("userEmail");

    if (usremail == null) {
        return;
    } else if (usremail == "Guest") {
        return;
    }

    $.ajax({
        url: the.hosturl + '/php/process.php',
        data: {
            usremail: usremail,
            data: data,
            usrfunction: StrFunction
        },
        type: 'POST',
        dataType: 'json',
        success: function (retstatus) {

        },
        error: function (xhr, status, error) {

        }
    });
}

function activateAccount(pass) {

    $.ajax({
        url: the.hosturl + '/php/process.php',
        type: 'POST',
        data: jQuery.param({
            usrfunction: "activateAcc",
            passkey: pass
        }),
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        success: function (response) {
            //console.log("success");
            //console.log(response);
            if (response == "s") {
                //console.log("Account activated");
                //Show('login');

                document.getElementById("helpDisplayDivId").style.display = "block";
                //Update url

                document.getElementById("languageScanResultDivId").style.display = "none";
                document.getElementById("languageOverride").style.display = "none";
                document.getElementById("helpDetailsDivId").style.display = "none";
                document.getElementById("contactusDivId").style.display = "none";
                document.getElementById("howtoDivId").style.display = "none";

                document.getElementById("filescannerDivId").style.display = "none";
                document.getElementById("HelpTopicsDivId").style.display = "none";
                document.getElementById("projectscannerDivId").style.display = "none";
                document.getElementById("loginDivId").style.display = "block";
                //document.getElementById("loginDivId").style.width = "70%";
                document.getElementById("loginerrormsg").innerHTML = "";

                //document.getElementById("helpDisplayDivId").style.width = "30%";



                showHelpDivMessage("Login to add or make updates to the help scan codes");

                document.getElementById("loginSecDivId").style.display = "none";
                document.getElementById("accActivatedDivId").style.display = "block";
                //markHelpCodes();

            } else {
                //console.log("Failed to activate account");
            }
        },
        error: function () {
            //console.log("Failed to activate account");
        }
    });
}

function setPassword() {

    document.getElementById("newpwerrormsg").innerHTML = "<font color = orange>" + " " + "</font> ";


    var StrPass = document.getElementById("newpassword").value
    var StrPassRe = document.getElementById("newpasswordRe").value

    var StrFunction = "setPassword";

    var error_message = "";


    if (StrPass.trim() == "") {
        error_message = "Please provide password with minimum 8 character length";
        document.getElementById("newpwerrormsg").innerHTML = "<font color = #cc0000>" + error_message + "</font> ";
        return;
    }

    if (StrPass.length < 8) {
        error_message = "Please provide password with minimum 8 character length";
        document.getElementById("newpwerrormsg").innerHTML = "<font color = #cc0000>" + error_message + "</font> ";
        return;
    }

    if (StrPass != StrPassRe) {
        error_message = "Entered passwords do not match";
        document.getElementById("newpwerrormsg").innerHTML = "<font color = orange>" + error_message + "</font> ";
        return;
    }

    var resetkey = sessionStorage.getItem("passwordresetkey");

    var StrAddress = "";

    $.ajax({
        url: the.hosturl + '/php/process.php',
        data: { usrpassword: StrPass, resetkey: resetkey, usrfunction: StrFunction },
        type: 'POST',
        dataType: 'JSON',
        success: function (retstatus) {
            //alert(msg);
            //console.log(retstatus);

            if (retstatus == "S") {
                //document.getElementById("newpwerrormsg").innerHTML = "Password has been set successfully.";
                document.getElementById("setPwDivId").style.display = "none";
                document.getElementById("setPwSuccessDivId").style.display = "block";
            }

            if (retstatus == "F") {
                document.getElementById("newpwerrormsg").innerHTML = "There was a problem in completing the request. Issue has been logged and will be resolved soon. Please try again later";

            }

            if ((retstatus != "S") && (retstatus != "F")) {
                document.getElementById("newpwerrormsg").innerHTML = "<font color = red>" + retstatus + "</font> ";

            }


        },
        error: function (xhr, status, error) {
            console.log(error);
            console.log(xhr);
            console.log(status);
            document.getElementById("newpwerrormsg").innerHTML = "There was a problem in completing the request. Issue has been logged and will be resolved soon. Please try again later";
        }
    });

}

function refreshCaptcha() {

    let captchaText = document.querySelector('#captcha');
    var ctx = captchaText.getContext("2d");
    ctx.font = "50px Roboto";
    ctx.fillStyle = "#000";

    ctx.clearRect(0, 0, captchaText.width, captchaText.height);


    let alphaNums = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '2', '3', '4', '5', '6', '7', '8', '9'];
    let emptyArr = [];

    // This loop generates a random string of 7 characters using alphaNums
    // Further this string is displayed as a CAPTCHA
    for (let i = 1; i <= 7; i++) {
        emptyArr.push(alphaNums[Math.floor(Math.random() * alphaNums.length)]);
    }
    var c = emptyArr.join('');
    ctx.fillText(emptyArr.join(''), captchaText.width / 10, captchaText.height / 1.8);
    the.captcha = c;
}

function refreshCaptchatwo() {

    let captchaText = document.querySelector('#captchatwo');
    var ctx = captchaText.getContext("2d");
    ctx.font = "50px Roboto";
    ctx.fillStyle = "#000";

    ctx.clearRect(0, 0, captchaText.width, captchaText.height);

    // alphaNums contains the characters with which you want to create the CAPTCHA
    let alphaNums = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '2', '3', '4', '5', '6', '7', '8', '9'];
    let emptyArr = [];

    // This loop generates a random string of 7 characters using alphaNums
    // Further this string is displayed as a CAPTCHA
    for (let i = 1; i <= 7; i++) {
        emptyArr.push(alphaNums[Math.floor(Math.random() * alphaNums.length)]);
    }
    var c = emptyArr.join('');
    ctx.fillText(emptyArr.join(''), captchaText.width / 10, captchaText.height / 1.8);
    the.captcha = c;
}


function uploadFiles(evt) {
    var files = evt.files; // FileList object


    the.uploadedFiles = files;
}

function handleFolderSelect(evt) {

    //console.log("handleFolderSelect called");

    var files = evt.files; // FileList object

    the.uploadedFiles = files;

    //Add the files list to newProjectContent variable
    //var subFolder = document.getElementById("project-sub-folder-box").value;

    for (var i = 0, f; f = files[i]; i++) {
        var str = f.webkitRelativePath;
        var pos = str.lastIndexOf("/")
        var subFolder = str.substr(0, pos);
        the.newProjectContent.push([subFolder, f.name]);
    }


    //Display the files in the output area

    var innerHTML = '<div >';

    for (var l = 0; l < the.newProjectContent.length; l++) {

        var hlpCode = the.newProjectContent[l][1];
        var hlpCdId = the.newProjectContent[l][1];
        var hlpCdGrp = the.newProjectContent[l][0];


        if (l > 0) {
            if (the.newProjectContent[l][0] != the.newProjectContent[l - 1][0]) {
                //first item in the group****Need to close previous li and open li for the new group
                innerHTML = innerHTML + '</ul> </li>';
                innerHTML = innerHTML + '<li class="day">' + '<i style = "color: black; font-style: normal; ">' + hlpCdGrp + '</i>' + ' <ul style="padding: 0; padding-left: 10px; list-style-type: none; margin: 0; ">';
                innerHTML = innerHTML + '<li>' + '<a href ="#" class="fileLink" onclick="fileClicked(' + "'" + hlpCdId + "'" + ');return false;" >' + hlpCode + "</a>" + '</li>';
            } else {
                //another item in the previous group
                innerHTML = innerHTML + '<li>' + '<a href ="#" class="fileLink" onclick="fileClicked(' + "'" + hlpCdId + "'" + ');return false;" >' + hlpCode + "</a>" + '</li>';
            }
        } else if (l == 0) {
            //First item in the list
            innerHTML = innerHTML + '<li class="day">' + '<i style = "color: black">' + hlpCdGrp + '</i>' + ' <ul style="padding: 0; padding-left: 10px; list-style-type: none; margin: 0; ">' + '<li>' + '<a href ="#" class="fileLink" onclick="fileClicked(' + "'" + hlpCdId + "'" + ');return false;" >' + hlpCode + "</a>" + '</li>';
        }

        //List is over
        if (l == the.newProjectContent.length - 1) {
            innerHTML = innerHTML + '</ul> </li></div>';
        }
    }
    document.getElementById("NewProjectStructureDisplayId").innerHTML = innerHTML;

    //SM: Added logic for help topics display


    $('li > ul').each(function (i) {
        // Find this list's parent list item.
        var parentLi = $(this).parent('li');

        // Style the list item as folder.
        parentLi.addClass('folder');

        // Temporarily remove the list from the
        // parent list item, wrap the remaining
        // text in an anchor, then reattach it.
        var subUl = $(this).remove();
        parentLi.wrapInner('<a/>').find('a').click(function () {
            // Make the anchor toggle the leaf display.
            subUl.toggle();
        });
        parentLi.append(subUl);
    });

    // Hide all lists except the outermost.
    $('ul ul').hide();

}

function handleFolderSelectTwo(evt) {

    //console.log("handleFolderSelect called");

    var files = evt.files; // FileList object

    the.uploadedFiles = files;
    the.newProjectContent = [];
    //Add the files list to newProjectContent variable
    //var subFolder = document.getElementById("project-sub-folder-box").value;

    for (var i = 0, f; f = files[i]; i++) {
        var str = f.webkitRelativePath;
        var pos = str.lastIndexOf("/")
        var subFolder = str.substr(0, pos);
        the.newProjectContent.push([subFolder, f.name]);
    }


    //Display the files in the output area

    var innerHTML = '<div style="overflow: hidden;">';

    for (var l = 0; l < the.newProjectContent.length; l++) {

        var hlpCode = the.newProjectContent[l][1];
        var hlpCdId = the.newProjectContent[l][1];
        var hlpCdGrp = the.newProjectContent[l][0];

        //if ((hlpCdGrp == null) ||(hlpCdGrp == "")){
        //	 hlpCdGrp = "Others";
        //}



        if (l > 0) {
            if (the.newProjectContent[l][0] != the.newProjectContent[l - 1][0]) {
                //first item in the group****Need to close previous li and open li for the new group
                innerHTML = innerHTML + '</ul> </li>';
                innerHTML = innerHTML + '<li class="day">' + '<i style = "color: black; font-style: normal; ">' + hlpCdGrp + '</i>' + ' <ul style="padding: 0; padding-left: 10px; list-style-type: none; margin: 0; ">';
                innerHTML = innerHTML + '<li>' + '<a href ="#" class="fileLink" onclick="fileClicked(' + "'" + hlpCdId + "'" + ');return false;" >' + hlpCode + "</a>" + '<button class="btnNewWindow" onclick="openFileInNewWindow(' + "'" + hlpCdId + "'" + ')" ></button>' + '</li>';
            } else {
                //another item in the previous group
                innerHTML = innerHTML + '<li>' + '<a href ="#" class="fileLink" onclick="fileClicked(' + "'" + hlpCdId + "'" + ');return false;" >' + hlpCode + "</a>" + '<button class="btnNewWindow" onclick="openFileInNewWindow(' + "'" + hlpCdId + "'" + ')" ></button>' + '</li>';
            }
        } else if (l == 0) {
            //First item in the list
            innerHTML = innerHTML + '<li class="day">' + '<i style = "color: black">' + hlpCdGrp + '</i>' + ' <ul style="padding: 0; padding-left: 10px; list-style-type: none; margin: 0; ">' + '<li>' + '<a href ="#" class="fileLink" onclick="fileClicked(' + "'" + hlpCdId + "'" + ');return false;" >' + hlpCode + "</a>" + '<button class="btnNewWindow" onclick="openFileInNewWindow(' + "'" + hlpCdId + "'" + ')" ></button>' + '</li>';
        }

        //List is over
        if (l == the.newProjectContent.length - 1) {
            innerHTML = innerHTML + '</ul> </li></div>';
        }
    }

    document.getElementById("NewProjectStructureDisplayIdTwo").innerHTML = innerHTML;

    //SM: Added logic for help topics display


    $('li > ul').each(function (i) {
        // Find this list's parent list item.
        var parentLi = $(this).parent('li');

        // Style the list item as folder.
        parentLi.addClass('folder');

        // Temporarily remove the list from the
        // parent list item, wrap the remaining
        // text in an anchor, then reattach it.
        var subUl = $(this).remove();
        parentLi.wrapInner('<a/>').find('a').click(function () {
            // Make the anchor toggle the leaf display.
            subUl.toggle();
        });
        parentLi.append(subUl);
    });

    // Hide all lists except the outermost.
    $('ul ul').hide();



}

function openFileInNewWindow(fileName) {
    //console.log(fileName + " is to be opened in new window");
    if (the.uploadedFiles == null) {
        return;
    }

    var files = the.uploadedFiles;

    for (var i = 0, f; f = files[i]; i++) {
        if (f.name == fileName) {
            localStorage.setItem("newWindowFileName", fileName);
            //localStorage.setItem("newWindowFileObj", JSON.stringify(f));
            //console.log(f);

            var reader = new FileReader();
            reader.onload = function (event) {
                localStorage.setItem("newWindowFileObj", event.target.result);
                myUrl = window.location.protocol + "//" + window.location.host +
                    window.location.pathname + "?target=" + "filescanner";

                window.open(myUrl);
            }
            reader.readAsText(f, "UTF-8");

            //return;
        }
    }


}

function loadFile() {
    try {
        var fileName = localStorage.getItem("newWindowFileName");
        //var f = JSON.parse(localStorage.getItem("newWindowFileObj"));
        var fileData = localStorage.getItem("newWindowFileObj");
        //console.log(f);
        //Display three
        document.getElementById("HelpTopicsDivId").style.display = "none";
        document.getElementById("helpDisplayDivId").style.display = "block";
        if (document.getElementById("filescannerDivId").style.display == "none") {
            document.getElementById("filescannerDivId").style.display = "block";
            document.getElementById("filescannerDivId").style.width = "50%";
            document.getElementById("projectscannerDivId").style.width = "20%";
        }
        //document.getElementById("helpDisplayDivId").style.width = "30%";


        //Show("filescanner");


        var arr = fileName.split(".");
        var fileExtension = arr[1];


        var newLanguage = getLanguageForFileExtension(fileExtension);


        //var reader = new FileReader();
        //var reader = new FileReader();


        //reader.onload = function(event) {

        document.getElementById("displayFileLoaderDivId").style.display = "none";
        //console.log("File loaded");
        if (the.editor) {
            the.editor.setValue(fileData);

            the.codetext = the.editor.getValue();
        } else {
            $('#source').val(fileData);
            the.codetext = fileData;
        }
        //the.codetext = event.target.result;
        document.getElementById("selectfile").innerHTML = "<i class='fas fa-folder-open' style='font-size:20px;color:purple'></i>&nbsp" + fileName;

        if (newLanguage != "") {
            the.codeLanguage = newLanguage;
            the.languageOverridden = true;
            //the.codetext = the.editor.getValue();
            //markHelpCodes();

            document.getElementById("language-box").value = newLanguage;


            markHelpCodes();

            var msg = "Code Language is " + newLanguage + " based on file extension" +
                ". If it looks incorrect, please enter the correct language in the box below and click on override button.";
            //console.log(msg)
            //document.getElementById("languageDeterminedDivId").style.display = "block";


            var gf = JSON.parse(sessionStorage.getItem("SpecialFiles"));

            var filteredRows = JSON.parse(gf).filter(function (entry) {
                var evalStr = entry.filename;
                return evalStr.toUpperCase() === fileName.toUpperCase();
            });


            if (filteredRows.length > 0) {
                document.getElementById("filelvlhelpdivid").innerHTML = filteredRows[0].description;
                document.getElementById("filelvlhelpdivid").style.display = "block";
            } else {
                if (the.filelvlhelp != null) {
                    if (the.filelvlhelp != "") {
                        document.getElementById("filelvlhelpdivid").innerHTML = the.filelvlhelp;
                        document.getElementById("filelvlhelpdivid").style.display = "block";
                    }
                }
            }




            document.getElementById("languageOverride").style.display = "block";
            document.getElementById("overrideMsg").innerHTML = "";
            document.getElementById("helpDivMessage").style.display = "block";
            document.getElementById("helpDivMessage").innerHTML = '<i class="fa fa-info-circle" style="display:none; float: left;  position: absolute; top:35px; left: 10px; color:orange;" ></i>' + cleanWord(msg, '');
            populateLanguages();

            document.getElementById("languageScanResultDivId").style.display = "none";
            document.getElementById("helpDetailsDivId").style.display = "none";
            document.getElementById("sub-tech-div-id").style.display = "none";


        } else {

            the.codeLanguage = newLanguage;
            markHelpCodes();

            document.getElementById("destinationDiv").style.display = "block";


            languageNotDeterminedMsg();


        }

    } catch (err) {
        console.log(err);
    }


}
function fileClicked(fileName) {

    if (document.getElementById("filescannerDivId").style.width < "50%") {
        document.getElementById("filescannerDivId").style.width = "70%";
        document.getElementById("projectscannerDivId").style.width = "30%";
    }

    document.getElementById("filelvlhelpdivid").style.display = "none";
    if (the.uploadedFiles == null) {
        return;
    }

    var files = the.uploadedFiles;

    for (var i = 0, f; f = files[i]; i++) {
        if (f.name == fileName) {

            //Display three
            document.getElementById("HelpTopicsDivId").style.display = "none";
            document.getElementById("helpDisplayDivId").style.display = "block";

            if (document.getElementById("filescannerDivId").style.display == "none") {

                document.getElementById("filescannerDivId").style.display = "block";
                document.getElementById("btnCloseFileScanner").style.display = "inline-block";
                if (!onMobileBrowser()) {
                    document.getElementById("filescannerDivId").style.width = "70%";
                    document.getElementById("projectscannerDivId").style.width = "30%";
                }
                //document.getElementById("filescannerDivId").style.width = "50%";
                //document.getElementById("projectscannerDivId").style.width = "20%";
            }
            //document.getElementById("helpDisplayDivId").style.width = "30%";


            //Show("filescanner");

            if (onMobileBrowser()) {
                $('html, body').animate({
                    scrollTop: $("#filescannerDivId").offset().top
                }, 1000);
            }

            var arr = fileName.split(".");
            var fileExtension = arr[1];


            var newLanguage = getLanguageForFileExtension(fileExtension);


            //var reader = new FileReader();
            var reader = new FileReader();


            reader.onload = function (event) {
                document.getElementById("displayFileLoaderDivId").style.display = "none";
                //console.log("File loaded");
                if (the.editor) {
                    the.editor.setValue(event.target.result);

                    the.codetext = the.editor.getValue();
                } else {
                    $('#source').val(event.target.result);
                    the.codetext = event.target.result;
                }
                //the.codetext = event.target.result;
                document.getElementById("selectfile").innerHTML = "<i class='fas fa-folder-open' style='font-size:20px;color:purple'></i>&nbsp" + fileName;

                if (newLanguage != "") {
                    the.codeLanguage = newLanguage;
                    the.languageOverridden = true;
                    //the.codetext = the.editor.getValue();
                    //markHelpCodes();

                    document.getElementById("language-box").value = newLanguage;


                    markHelpCodes();

                    var msg = "Code Language is " + newLanguage + " based on file extension" +
                        ". If it looks incorrect, please enter the correct language in the box below and click on override button.";
                    //console.log(msg)
                    //document.getElementById("languageDeterminedDivId").style.display = "block";



                    var gf = JSON.parse(sessionStorage.getItem("SpecialFiles"));

                    var filteredRows = JSON.parse(gf).filter(function (entry) {
                        var evalStr = entry.filename;
                        return evalStr.toUpperCase() === fileName.toUpperCase();
                    });


                    if (filteredRows.length > 0) {
                        document.getElementById("filelvlhelpdivid").innerHTML = filteredRows[0].description;
                        document.getElementById("filelvlhelpdivid").style.display = "block";
                    } else {
                        if (the.filelvlhelp != null) {
                            if (the.filelvlhelp != "") {
                                document.getElementById("filelvlhelpdivid").innerHTML = the.filelvlhelp;
                                document.getElementById("filelvlhelpdivid").style.display = "block";
                            }
                        }
                    }




                    document.getElementById("languageOverride").style.display = "block";
                    document.getElementById("overrideMsg").innerHTML = "";
                    document.getElementById("helpDivMessage").style.display = "block";
                    document.getElementById("helpDivMessage").innerHTML = '<i class="fa fa-info-circle" style="display:none; float: left;  position: absolute; top:35px; left: 10px; color:orange;" ></i>' + cleanWord(msg, '');
                    populateLanguages();

                    document.getElementById("languageScanResultDivId").style.display = "none";
                    document.getElementById("helpDetailsDivId").style.display = "none";
                    document.getElementById("sub-tech-div-id").style.display = "none";


                } else {

                    the.codeLanguage = newLanguage;
                    markHelpCodes();

                    document.getElementById("destinationDiv").style.display = "block";


                    languageNotDeterminedMsg();


                }
            };
            document.getElementById("displayFileLoaderDivId").style.display = "block";
            reader.readAsText(f, "UTF-8");
            return;



        }
    }
}

function resetProjectFiles() {
    the.uploadedFiles = null;
    document.getElementById("NewProjectStructureDisplayId").innerHTML = "";
}

function saveProject() {

    //console.log("called saveProject");

    var myLanguage = document.getElementById("project-language-box").value;
    var mycategory = document.getElementById("project-sub-tech-box").value;
    var myProjectName = document.getElementById("project-name-box").value;
    var myProjectPath = document.getElementById("project-path-box").value;
    var myProjectDetails = tinyMCE.get('project_details').getContent();

    var parts = myProjectDetails.split('\\');
    var myProjectDetails = parts.join('\\\\');

    if (myProjectName == "") {
        document.getElementById("saveProjectMsg").innerHTML = "Please provide project name";
        return;
    }

    if (myProjectPath == "") {
        document.getElementById("saveProjectMsg").innerHTML = "Please provide project path";
        return;
    }

    if (the.newProjectContent == null) {
        document.getElementById("saveProjectMsg").innerHTML = "Please provide project files";
        return;
    }

    var myProjectFiles = JSON.stringify(the.newProjectContent);

    if (myLanguage == "") {
        document.getElementById("saveProjectMsg").innerHTML = "Please enter language";
        return;
    }

    if (myProjectDetails == "") {
        document.getElementById("saveProjectMsg").innerHTML = "Please provide project details";
        return;
    }


    if (the.idOfProjectToUpdate == null) {
        /***Project does not exist*****/

        $.ajax({
            url: the.hosturl + '/php/process.php',
            type: 'POST',
            data: jQuery.param({
                usrfunction: "SaveNewProject",
                language: myLanguage,
                category: mycategory,
                project_name: myProjectName,
                project_details: myProjectDetails,
                project_path: myProjectPath,
                project_files: myProjectFiles

            }),
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            success: function (response) {
                //console.log("success");
                //console.log(response);
                if (response == "true") {
                    document.getElementById("saveProjectMsg").innerHTML = "Record created successfully";

                    //Refresh the saved projects list list

                    $.ajax({
                        url: the.hosturl + '/php/process.php',
                        type: 'POST',
                        data: jQuery.param({
                            usrfunction: "GetSavedProjects"
                        }),
                        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                        success: function (response) {
                            sessionStorage.setItem("SavedProjectsList", JSON.stringify(response));


                            var filteredRows = JSON.parse(response).filter(function (entry) {
                                return entry.language === myLanguage && entry.project_name === myProjectName;
                            });

                            the.idOfProjectToUpdate = filteredRows[0].project_id

                        },
                        error: function () {
                            //alert("error");
                        }
                    });

                    //markHelpCodes();

                } else { }
            },
            error: function () {
                //console.log("error-record creation failed");
            }
        });
    } else {
        $.ajax({
            url: the.hosturl + '/php/process.php',
            type: 'POST',
            data: jQuery.param({
                usrfunction: "UpdateProject",
                language: myLanguage,
                category: mycategory,
                project_name: myProjectName,
                project_details: myProjectDetails,
                project_path: myProjectPath,
                project_files: myProjectFiles,
                project_id: the.idOfProjectToUpdate

            }),
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            success: function (response) {
                //console.log("success");
                //console.log(response);
                if (response == "true") {
                    document.getElementById("saveProjectMsg").innerHTML = "Project details updated successfully";

                    //Refresh the saved projects list list

                    $.ajax({
                        url: the.hosturl + '/php/process.php',
                        type: 'POST',
                        data: jQuery.param({
                            usrfunction: "GetSavedProjects"
                        }),
                        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                        success: function (response) {
                            sessionStorage.setItem("SavedProjectsList", JSON.stringify(response));


                        },
                        error: function () {
                            //alert("error");
                        }
                    });

                    //markHelpCodes();

                } else { }
            },
            error: function () {
                //console.log("error - saving project");
            }
        });
    }
}

function addNewProject() {
    the.idOfProjectToUpdate = null;
    document.getElementById("StoredPrjDivId").style.display = "none";
    document.getElementById("AddNewProjectDivId").style.display = "block";
    document.getElementById("saveProjectMsg").innerHTML = "";

    document.getElementById("project-language-box").value = "";
    document.getElementById("project-sub-tech-box").value = "";
    document.getElementById("project-name-box").value = "";
    document.getElementById("project-path-box").value = "";
    tinyMCE.get('project_details').setContent("");

    the.newProjectContent = [];
    document.getElementById("NewProjectStructureDisplayId").innerHTML = "";

}

function cancelNewProjectAdd() {
    document.getElementById("StoredPrjDivId").style.display = "block";
    document.getElementById("AddNewProjectDivId").style.display = "none";
}

function showcategory(tech) {

    var tf = JSON.parse(sessionStorage.getItem("itemsList"));
    var rows = JSON.parse(tf);
    var elementId = "menucardparent-" + tech
    elementId = elementId.replaceAll(" ", "");
    if (tech != "") {
        tech = tech.toUpperCase();
        rows = rows.filter(function (entry) {
            return entry.category.toUpperCase() == tech;
        });
    }

    populateItemsList(rows);

    // document.getElementById(elementId).style.width = "95%";
    // document.getElementById(elementId).style.maxWidth = "1200px";
    // document.getElementById(elementId).style.float = "none";
    // document.getElementById(elementId).style.top = "20px";
    // document.getElementById(elementId).style.margin = "auto";

}


function showAllShopItemsInLeftPane(storename) {

    var tf = JSON.parse(sessionStorage.getItem("itemsList"));
    var rows = JSON.parse(tf);
    var elementId = "menucardparent-" + storename
    elementId = elementId.replaceAll(" ", "");
    if (storename != "") {
        storename = storename.toUpperCase();
        rows = rows.filter(function (entry) {
            return (entry.storename != null) && (entry.storename.toUpperCase() == storename) && (entry.storename != entry.title);
        });
    }

    populateStoreItemsList(rows);

    document.getElementById(elementId).style.width = "95%";
    document.getElementById(elementId).style.maxWidth = "1200px";
    document.getElementById(elementId).style.float = "none";
    document.getElementById(elementId).style.top = "20px";
    document.getElementById(elementId).style.margin = "auto";

    // document.getElementById(elementId).style.overflow = "expand";
}

function searchItem() {
    var searchText = document.getElementById("item-search-box").value;

    var tf = JSON.parse(sessionStorage.getItem("itemsList"));
    var rows = JSON.parse(tf);

    if (searchText != "") {
        searchText = searchText.toUpperCase();
        rows = rows.filter(function (entry) {
            return entry.title.toUpperCase().includes(searchText) || entry.category.toUpperCase().includes(searchText) || entry.shortdescription.toUpperCase().includes(searchText) || entry.keywords.toUpperCase().includes(searchText);
        });
    }

    populateItemsList(rows);
    $(".cardsContainerDivClassPadd").css("width", "95%");
}


function searchStoreNameItem() {

    var origSearchText = document.getElementById("store-search-box").value;
    origSearchText = origSearchText.replaceAll("  ", " ");

    var searchText = origSearchText;

    if (searchText == "") {
        document.querySelector('.storeNameNotAvailable').innerHTML = "Please enter your store name."
        document.querySelector('.storeNameNotAvailable').style.display = "block";
        document.querySelector('.storeNameAvailable').style.display = "none";
        return;
    }
    if (!searchText.match(/^[0-9a-zA-Z \b]+$/)) {
        document.querySelector('.storeNameNotAvailable').innerHTML = "Only characters and numbers are allowed."
        document.querySelector('.storeNameNotAvailable').style.display = "block";
        document.querySelector('.storeNameAvailable').style.display = "none";
        return;
    }
    var tf = JSON.parse(sessionStorage.getItem("itemsList"));
    var rows = JSON.parse(tf);

    if (searchText != "") {
        searchText = searchText.toUpperCase();
        rows = rows.filter(function (entry) {
            return entry.title.toUpperCase() == searchText;
        });
    }

    if (rows.length > 0) {
        document.querySelector('.storeNameNotAvailable').innerHTML = "Store name is already taken by someone else. Please try a different name."
        document.querySelector('.storeNameNotAvailable').style.display = "block";
        document.querySelector('.storeNameAvailable').style.display = "none";
        return;
    } else {
        document.querySelector('.storeNameNotAvailable').style.display = "none";
        document.querySelector('.storeNameAvailable').style.display = "block";
        localStorage.setItem("storename", origSearchText);
    }

}

function showBanner() {
    var elems = document.querySelectorAll('.shopTopBanner');
    var elems_array = [...elems]; // converts NodeList to Array

    if (elems_array.length > 0) {

        refreshStoreName();
        document.querySelector('.storeNameAvailable').style.display = "none";
        return;
    }

    addComponent("shopTopBanner", "shopTopBanner1", "addUndershopLyrics");
    document.querySelector('.storeNameAvailable').style.display = "none";
    refreshStoreName();


}

function refreshStoreName() {
    setTimeout(function () {
        document.querySelector('.bannerStoreNameCls').innerHTML = localStorage.getItem("storename");
        document.querySelector('.bottomNavigationCls').innerHTML = '<div class="centerAlignBorderBox"><button  class="button_type1 width_150px" onclick="addShopItem(); return false;">Add Item</button></div> <div class="shopSmErr displayNone redMsg"></div>' +
            "<div class='submitShopAppr'><button   type='button' class='itmUpdSaveBtn btn btn-primary' onclick=saveNewStore('','y') >Submit for Review</button>" +
            "<button   type='button' class='itmUpdSaveBtn btn btn-danger' onclick=refreshPage() >Cancel</button></div>";
        // var allItems = document.querySelectorAll(".shopTopBannerBtn");
        // for (i = 0; i < allItems.length; i++) {
        //     allItems[i].classList.add("max_4box_responsive");
        // }            
    }, 100);
}

function addShopItem() {
    addComponent("shopTopBanner", "shopItem1", "addUndershopLyrics");
    var allItems = document.querySelectorAll(".secPreview");

    var elem = allItems[allItems.length - 1].querySelector(".itmImgContainer");

    //scrollElementToTopOfScreenInstantly(elem);
    scrollElementToTopWithOffset(elem, -200);
}
function populateItemDropDown(fieldId = "item-search-box") {


    var tf = JSON.parse(sessionStorage.getItem("itemsList"));
    var items = JSON.parse(tf);

    //var LHCAI = the.LanguageHelpCodeAndIds_LclJson;
    //console.log(LHCAI);
    //var codesWithHelpDetails = JSON.parse(LHCAI);

    var lookup = {};
    //var items = codesWithHelpDetails;
    var dropDownList = [];

    for (var item, i = 0; item = items[i++];) {
        var value = item.title;

        dropDownList.push(value);
    }

    //console.log(languages)
    autocomplete(document.getElementById(fieldId), dropDownList);
    //the.languageListPopulated = true;
}

function populateItemsList(rows = "") {


    //console.log(document.getElementById("cardsContainerDivId").innerHTML);

    var tf = JSON.parse(sessionStorage.getItem("itemsList"));


    if (rows == "") {
        rows = JSON.parse(tf);
    }


    if (the.smusr) {
    } else {
        rows = rows.filter(function (entry) {
            return entry.discontinue == "0";
        });
    }


    //var innerHTML = "<input id='item-search-box' type='text'	name='item' autocomplete='off' placeholder='search'/>" +
    //"<button class='buttonCls' onclick='searchItem(); return false;' >Update</button>";
    var innerHTML = "";
    var itemName = "";
    var path = window.location.pathname;
    var myUrl = path.substring(0, path.indexOf('/', path.indexOf('smshopify')) + 1);
    var categorySqueezed = "";
    var categoryOrig = "";
    var categoryUrl = "";
    var storename = "";

    var storenameUrl = "";

    var defaultDisplayCount = 1000;
    var categoryMaxCount = 0;
    var currDisplayCount = 0;

    for (var i = 0; i < rows.length; i++) {

        itemName = rows[i].title;
        itemName = itemName.replaceAll(" ", "-");

        subcategory = rows[i].subcategory;
        subcategory = subcategory.replaceAll(" ", "-");

        categoryOrig = rows[i].category;
        category = rows[i].category;
        storename = rows[i].storename;

        var storeNameSpaceReplaced = storename.replaceAll(" ", "-");
        category = category.replaceAll(" ", "-");

        //itemTitleURL = myUrl + "items/" + category.toLowerCase() + "/" + subcategory.toLowerCase() + "/" + itemName.toLowerCase();
        itemTitleURL = myUrl + "items/" + category.toLowerCase() + "/" + storeNameSpaceReplaced.toLowerCase() + "/" + itemName.toLowerCase();

        storenameUrl = myUrl + storename;

        categorySqueezed = rows[i].category;
        categorySqueezed = categorySqueezed.replaceAll(' ', '')

        categoryMaxCount = sessionStorage.getItem("max-count-" + categorySqueezed);

        if (i == 0) {
            innerHTML = innerHTML + '<div id="menucardparent-' + categorySqueezed + '"  class="cardsContainerDivClassPadd max_4box_responsive_withmargin" > <div class="categoryHeader" >';
            if (the.smusr) {
                innerHTML = innerHTML + rows[i].categoryseq + '. ';
            }
            innerHTML = innerHTML + rows[i].storename +

                //  '<label class="switch categoryToggleLbl"  ><input class="toggleInput"  type="checkbox" checked data-cat="'+ rows[i].category + '"  onchange="handleShowToggle(this);" ><span class="slider round"></span></label>' +
                '<a class="goToTechLink" href ="' + storenameUrl.replaceAll(' ', '-') + '"> GO </a>' +

                '</div>';
            startingCharURL = myUrl + "starting/bollywood-items-starting-with-" + rows[i].category;

        } else if (rows[i].storename != rows[i - 1].storename) {


            if (sessionStorage.getItem("max-count-" + rows[i - 1].category) > defaultDisplayCount) {
                sessionStorage.setItem("display-count-" + rows[i - 1].category, defaultDisplayCount);
                innerHTML = innerHTML + '<div id="itemDiv-' + rows[i - 1].itemid + '" class="itemDiv categoryFooter ' + rows[i - 1].category + ' " >' +
                    '<button id="showmore-' + rows[i - 1].category + '"  type="button" class="showmore-btn" onclick=showMoreitems("' + rows[i - 1].category + '") >Show More</button>' +
                    '</div>';
            } else {
                sessionStorage.setItem("display-count-" + rows[i - 1].category, currDisplayCount);
            }

            currDisplayCount = 0;

            innerHTML = innerHTML + '</div><div id="menucardparent-' + categorySqueezed + '"  class="cardsContainerDivClassPadd max_4box_responsive_withmargin" ><div class="categoryHeader">';

            if (the.smusr) {
                innerHTML = innerHTML + rows[i].categoryseq + '. ';
            }

            innerHTML = innerHTML + rows[i].storename +
                //  '<label class="switch categoryToggleLbl"  ><input class="toggleInput"   type="checkbox" checked data-cat="'+ rows[i].category + '"  onchange="handleShowToggle(this);" ><span class="slider round"></span></label>' +
                '<a class="goToTechLink" href ="' + storenameUrl.replaceAll(' ', '-') + '"> GO </a>' +
                '</div>';

            startingCharURL = myUrl + "starting/bollywood-items-starting-with-" + rows[i].category;
        }

        currDisplayCount = currDisplayCount + 1;

        if (currDisplayCount >= defaultDisplayCount) {
            continue;
        }


        // if (i == 0) {
        //     previousSubpath = "";
        // } else {
        //     previousSubpath = rows[i - 1].subcategory;
        // }

        // currentSubpath = rows[i].subcategory;

        // if (i == rows.length - 1) {
        //     nextSubPath = "";
        // } else {
        //     nextSubPath = rows[i + 1].subcategory;
        // }

        var discontinuedFlgCls = "";

        if (rows[i].discontinue == "1") {
            discontinuedFlgCls = " discontinued ";
        }

        // if (previousSubpath == currentSubpath) {
        //     //It is a child item same as previous
        //     innerHTML = innerHTML + '<div id="itemDiv-' + rows[i].itemid + '" class="itemDiv itemChild ' + discontinuedFlgCls + categorySqueezed + '" >';
        //     innerHTML = innerHTML + '<a class="itemLink" href ="' + itemTitleURL + '"> <span class="itemTitleSpan"  > <h2 class="itemTitleH2" >';

        //     if (the.smusr) {
        //         innerHTML = innerHTML + rows[i].titleseq + '. ';
        //     }

        //     innerHTML = innerHTML + rows[i].title + ' </h2> </span> </a>';
        //     innerHTML = innerHTML + '</div>';
        // } else if (nextSubPath == currentSubpath) {
        //     //It is a new child item 

        //     innerHTML = innerHTML + '<div class="itemParent ' + categorySqueezed + '" >';
        //     innerHTML = innerHTML + currentSubpath;
        //     innerHTML = innerHTML + '</div>';

        //     innerHTML = innerHTML + '<div id="itemDiv-' + rows[i].itemid + '" class="itemDiv itemChild ' + discontinuedFlgCls + categorySqueezed + '" >';
        //     innerHTML = innerHTML + '<a class="itemLink" href ="' + itemTitleURL + '"> <span class="itemTitleSpan"  > <h2 class="itemTitleH2" >';

        //     if (the.smusr) {
        //         innerHTML = innerHTML + rows[i].titleseq + '. ';
        //     }

        //     innerHTML = innerHTML + rows[i].title + ' </h2> </span> </a>';
        //     innerHTML = innerHTML + '</div>';
        // } else {
        //It is not a new child item 
        innerHTML = innerHTML + '<div id="itemDiv-' + rows[i].itemid + '" class="itemDiv ' + discontinuedFlgCls + categorySqueezed + '" >';
        innerHTML = innerHTML + '<a class="itemLink" href ="' + itemTitleURL + '"> <span class="itemTitleSpan"  > <h2 class="itemTitleH2" >';

        if (the.smusr) {
            innerHTML = innerHTML + rows[i].titleseq + '. ';
        }

        innerHTML = innerHTML + rows[i].title + ' </h2> </span> </a>';
        innerHTML = innerHTML + '</div>';
        // }


        if (i == rows.length - 1) {
            innerHTML = innerHTML + '</div>';
        }
    }

    if (sessionStorage.getItem("max-count-" + categorySqueezed) > defaultDisplayCount) {
        sessionStorage.setItem("display-count-" + categorySqueezed, defaultDisplayCount);
        innerHTML = innerHTML + '<div id="itemDiv-' + rows[i].itemid + '" class="itemDiv categoryFooter ' + categorySqueezed + ' " >' +
            '<button id="showmore-"' + rows[i - 1].category + ' type="button" class="showmore-btn" onclick=showMoreitems("' + categorySqueezed + '") >Show More</button>' +
            '</div>';
    } else {
        sessionStorage.setItem("display-count-" + categorySqueezed, currDisplayCount);
    }

    innerHTML = innerHTML + '</div>';
    //document.getElementById("itemDivId").innerHTML = innerHTML;
    document.getElementById("itemListDivId").style.display = "block";
    document.getElementById("itemListInnerDivId").innerHTML = innerHTML + "<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>";
    populateItemDropDown();

}




function populateStoreItemsList(rows = "") {


    //console.log(document.getElementById("cardsContainerDivId").innerHTML);

    var tf = JSON.parse(sessionStorage.getItem("itemsList"));


    if (rows == "") {
        rows = JSON.parse(tf);
    }


    if (the.smusr) {
    } else {
        rows = rows.filter(function (entry) {
            return entry.discontinue == "0";
        });
    }


    //var innerHTML = "<input id='item-search-box' type='text'	name='item' autocomplete='off' placeholder='search'/>" +
    //"<button class='buttonCls' onclick='searchItem(); return false;' >Update</button>";
    var innerHTML = "";
    var itemName = "";
    var path = window.location.pathname;
    var myUrl = path.substring(0, path.indexOf('/', path.indexOf('smshopify')) + 1);
    var storenameSqueezed = "";
    var storenameOrig = "";
    var storename = "";
    var storenameUrl = "";

    var category = "";

    var defaultDisplayCount = 1000;
    var storenameMaxCount = 0;
    var currDisplayCount = 0;

    for (var i = 0; i < rows.length; i++) {

        itemName = rows[i].title;
        itemName = itemName.replaceAll(" ", "-");

        storenameOrig = rows[i].storename;
        storename = rows[i].storename;
        category = rows[i].category;
        storename = storename.replaceAll(" ", "-");

        categorySpaceReplaced = category.replaceAll(" ", "-");

        //itemTitleURL = myUrl + "items/" + storename.toLowerCase() + "/" + substorename.toLowerCase() + "/" + itemName.toLowerCase();
        itemTitleURL = myUrl + "items/" + categorySpaceReplaced.toLowerCase() + "/" + storename.toLowerCase() + "/" + itemName.toLowerCase();

        //storenameUrl = myUrl + "items/" + storenameOrig;
        storenameUrl = myUrl + storenameOrig;

        storenameSqueezed = rows[i].storename;
        storenameSqueezed = storenameSqueezed.replaceAll(' ', '')

        storenameMaxCount = sessionStorage.getItem("max-count-" + storenameSqueezed);

        if (i == 0) {
            innerHTML = innerHTML + '<div id="menucardparent-' + storenameSqueezed + '"  class=" cardsContainerDivClassPadd max_4box_responsive_withmargin" > <div class="storenameHeader" >';
            // if (the.smusr) {
            //     innerHTML = innerHTML + rows[i].storenameseq + '. ';
            // }
            innerHTML = innerHTML + rows[i].storename +

                //  '<label class="switch storenameToggleLbl"  ><input class="toggleInput"  type="checkbox" checked data-cat="'+ rows[i].storename + '"  onchange="handleShowToggle(this);" ><span class="slider round"></span></label>' +
                '<a class="goToTechLink" href ="' + storenameUrl.replaceAll(' ', '-') + '"> GO </a>' +

                '</div>';
            startingCharURL = myUrl + "starting/bollywood-items-starting-with-" + rows[i].storename;

        } else if (rows[i].storename != rows[i - 1].storename) {


            if (sessionStorage.getItem("max-count-" + rows[i - 1].storename) > defaultDisplayCount) {
                sessionStorage.setItem("display-count-" + rows[i - 1].storename, defaultDisplayCount);
                innerHTML = innerHTML + '<div id="itemDiv-' + rows[i - 1].itemid + '" class="itemDiv storenameFooter ' + rows[i - 1].storename + ' " >' +
                    '<button id="showmore-' + rows[i - 1].storename + '"  type="button" class="showmore-btn" onclick=showMoreitems("' + rows[i - 1].storename + '") >Show More</button>' +
                    '</div>';
            } else {
                sessionStorage.setItem("display-count-" + rows[i - 1].storename, currDisplayCount);
            }

            currDisplayCount = 0;

            innerHTML = innerHTML + '</div><div id="menucardparent-' + storenameSqueezed + '"  class=" cardsContainerDivClassPadd max_4box_responsive_withmargin" ><div class="storenameHeader">';

            // if (the.smusr) {
            //     innerHTML = innerHTML + rows[i].storenameseq + '. ';
            // }

            innerHTML = innerHTML + rows[i].storename +
                //  '<label class="switch storenameToggleLbl"  ><input class="toggleInput"   type="checkbox" checked data-cat="'+ rows[i].storename + '"  onchange="handleShowToggle(this);" ><span class="slider round"></span></label>' +
                '<a class="goToTechLink" href ="' + storenameUrl.replaceAll(' ', '-') + '"> GO </a>' +
                '</div>';

            startingCharURL = myUrl + "starting/bollywood-items-starting-with-" + rows[i].storename;
        }

        currDisplayCount = currDisplayCount + 1;

        if (currDisplayCount >= defaultDisplayCount) {
            continue;
        }


        // if (i == 0) {
        //     previousSubpath = "";
        // } else {
        //     previousSubpath = rows[i - 1].substorename;
        // }

        // currentSubpath = rows[i].substorename;

        // if (i == rows.length - 1) {
        //     nextSubPath = "";
        // } else {
        //     nextSubPath = rows[i + 1].substorename;
        // }

        var discontinuedFlgCls = "";

        if (rows[i].discontinue == "1") {
            discontinuedFlgCls = " discontinued ";
        }

        // if (previousSubpath == currentSubpath) {
        //     //It is a child item same as previous
        //     innerHTML = innerHTML + '<div id="itemDiv-' + rows[i].itemid + '" class="itemDiv itemChild ' + discontinuedFlgCls + storenameSqueezed + '" >';
        //     innerHTML = innerHTML + '<a class="itemLink" href ="' + itemTitleURL + '"> <span class="itemTitleSpan"  > <h2 class="itemTitleH2" >';

        //     if (the.smusr) {
        //         innerHTML = innerHTML + rows[i].titleseq + '. ';
        //     }

        //     innerHTML = innerHTML + rows[i].title + ' </h2> </span> </a>';
        //     innerHTML = innerHTML + '</div>';
        // } else if (nextSubPath == currentSubpath) {
        //     //It is a new child item 

        //     innerHTML = innerHTML + '<div class="itemParent ' + storenameSqueezed + '" >';
        //     innerHTML = innerHTML + currentSubpath;
        //     innerHTML = innerHTML + '</div>';

        //     innerHTML = innerHTML + '<div id="itemDiv-' + rows[i].itemid + '" class="itemDiv itemChild ' + discontinuedFlgCls + storenameSqueezed + '" >';
        //     innerHTML = innerHTML + '<a class="itemLink" href ="' + itemTitleURL + '"> <span class="itemTitleSpan"  > <h2 class="itemTitleH2" >';

        //     if (the.smusr) {
        //         innerHTML = innerHTML + rows[i].titleseq + '. ';
        //     }

        //     innerHTML = innerHTML + rows[i].title + ' </h2> </span> </a>';
        //     innerHTML = innerHTML + '</div>';
        // } else {
        //It is not a new child item 
        innerHTML = innerHTML + '<div id="itemDiv-' + rows[i].itemid + '" class="itemDiv ' + discontinuedFlgCls + storenameSqueezed + '" >';
        innerHTML = innerHTML + '<a class="itemLink" href ="' + itemTitleURL + '"> <span class="itemTitleSpan"  > <h2 class="itemTitleH2" >';

        if (the.smusr) {
            innerHTML = innerHTML + rows[i].titleseq + '. ';
        }

        innerHTML = innerHTML + rows[i].title + ' </h2> </span> </a>';
        innerHTML = innerHTML + '</div>';
        // }


        if (i == rows.length - 1) {
            innerHTML = innerHTML + '</div>';
        }
    }

    if (sessionStorage.getItem("max-count-" + storenameSqueezed) > defaultDisplayCount) {
        sessionStorage.setItem("display-count-" + storenameSqueezed, defaultDisplayCount);
        innerHTML = innerHTML + '<div id="itemDiv-' + rows[i].itemid + '" class="itemDiv storenameFooter ' + storenameSqueezed + ' " >' +
            '<button id="showmore-"' + rows[i - 1].storename + ' type="button" class="showmore-btn" onclick=showMoreitems("' + storenameSqueezed + '") >Show More</button>' +
            '</div>';
    } else {
        sessionStorage.setItem("display-count-" + storenameSqueezed, currDisplayCount);
    }

    innerHTML = innerHTML + '</div>';
    //document.getElementById("itemDivId").innerHTML = innerHTML;
    document.getElementById("itemListDivId").style.display = "block";
    document.getElementById("itemListInnerDivId").innerHTML = innerHTML + "<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>";
    populateItemDropDown();

}



function handleShowToggle(checkbox) {
    var categorySqueezed = checkbox.dataset.cat;
    categorySqueezed = categorySqueezed.replaceAll(' ', '');

    var catCards = document.getElementsByClassName(categorySqueezed);

    if (checkbox.checked == false) {
        //document.getElementsByClassName('appBanner')[0].style.visibility = 'hidden';	

        for (var i = 0; i < catCards.length; i++) {
            //if (i > 1){
            catCards[i].style.display = 'none';
            //}
        }
    } else {
        for (var i = 0; i < catCards.length; i++) {
            //if (i > 1){
            catCards[i].style.display = 'block';
            //}
        }
    }
}

function goToHome() {

    var path = window.location.pathname;
    var myUrl = path.substring(0, path.indexOf('/', path.indexOf('smshopify')) + 1)
    myUrl = myUrl + "?target=home";
    window.location.href = myUrl;
}

function goToItem() {

    var path = window.location.pathname;
    var myUrl = path.substring(0, path.indexOf('/', path.indexOf('smshopify')) + 1)
    myUrl = myUrl + "?target=item";
    window.location.href = myUrl;
}

function goToProjectscanner() {

    var path = window.location.pathname;
    var myUrl = path.substring(0, path.indexOf('/', path.indexOf('smshopify')) + 1)
    myUrl = myUrl + "?target=projectscanner";
    window.location.href = myUrl;
}

function goToFilescanner() {

    var path = window.location.pathname;
    var myUrl = path.substring(0, path.indexOf('/', path.indexOf('smshopify')) + 1)
    myUrl = myUrl + "?target=filescanner";
    window.location.href = myUrl;
}

function goToHowToVideos() {

    var path = window.location.pathname;
    var myUrl = path.substring(0, path.indexOf('/', path.indexOf('smshopify')) + 1)
    myUrl = myUrl + "?target=howto";
    window.location.href = myUrl;
}

function goToContactUs() {

    var path = window.location.pathname;
    var myUrl = path.substring(0, path.indexOf('/', path.indexOf('smshopify')) + 1)
    myUrl = myUrl + "?target=contactus";
    window.location.href = myUrl;
}

function goToLogin() {

    var path = window.location.pathname;
    sessionStorage.setItem("lastUrl", window.location.href);
    var myUrl = path.substring(0, path.indexOf('/', path.indexOf('smshopify')) + 1)
    myUrl = myUrl + "?target=login";
    window.location.href = myUrl;
}

function goToHelpTopics() {

    var path = window.location.pathname;
    var myUrl = path.substring(0, path.indexOf('/', path.indexOf('smshopify')) + 1)
    myUrl = myUrl + "?target=HelpTopics";
    window.location.href = myUrl;
}


function populateStoredProjectList() {

    /*
    REF: https://www.w3schools.com/howto/howto_js_collapsible.asp
    https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_collapsible
    */

    var innerHTML = '<div class="headerDivCls">Saved projects </div>';

    var tf = JSON.parse(sessionStorage.getItem("SavedProjectsList"));

    if (tf == null) {
        return;
    }
    var rows = JSON.parse(tf);
    var tempInnerHTML = document.getElementById("savedProjectList").innerHTML;
    tempInnerHTML = tempInnerHTML.trim();

    if (rows.length > 0 && tempInnerHTML != "") {
        //console.log(rows.length);
        //console.log(document.getElementById("savedProjectList").innerHTML);
        return;
    }


    var arr = [];

    for (var i = 0; i < rows.length; i++) {
        var myLanguage = rows[i].language;
        var mycategory = rows[i].category;
        var myProjectName = rows[i].project_name;
        var myProjectDetails = rows[i].project_details;
        var myProjectPath = rows[i].project_path;
        var myProjectFiles = JSON.parse(rows[i].project_files);
        var myProjectId = rows[i].project_id;


        var tf = JSON.parse(sessionStorage.getItem("LanguageForFileExtension"));



        var lookup = {};
        var uniqueExtensions = [];
        var extensionHTML = "";
        for (k = 0; k < myProjectFiles.length; k++) {
            var fileName = myProjectFiles[k][1];
            var a = fileName.split(".");
            var fileExtension = a[1];

            if (fileExtension == undefined) {
                continue;
            }

            var filteredRows = JSON.parse(tf).filter(function (entry) {
                var evalStr = entry.fileextension;
                return evalStr.toUpperCase() === fileExtension.toUpperCase();
            });

            if (filteredRows.length == 0) {
                //Go to next file
                continue;
            }
            if (!(fileExtension in lookup)) {
                lookup[fileExtension] = 1;
                if (fileExtension == undefined) {
                    continue;
                }
                uniqueExtensions.push(fileExtension);
                extensionHTML = extensionHTML + '<span class="dot">' + fileExtension + '</span>'
            }

        }

        innerHTML = innerHTML + '<div type="button" class="collapsible" style="height:auto; " onclick="toggleCollapse(this)"> <div class="projectNameNTech">' + myProjectName + '<hr> ' + myLanguage;
        if (mycategory != "") {
            innerHTML = innerHTML + ', ' + mycategory;
        }

        innerHTML = innerHTML + '</div>' + extensionHTML + "</div>";

        //Display the files in the output area

        var innerHTML = innerHTML + '<div class="content">' +
            '<button class="buttonCls" type="button" style="float: right" onclick="editProjectDetails(' + myProjectId + ')">Edit</button>' +
            '<div style="margin-top: 5px;">' +
            '<table class="ProjectPropertiesTable">' +
            '<tr class="ProjectPropertiesTR"><td style="background-color: #F1F1F1" >Language </td>' + '<td class="ProjectPropertiesTD"><text>' + myLanguage + '</text>' + '</td></tr>' +
            '<tr class="ProjectPropertiesTR"><td style="background-color: #F1F1F1">category</td>' + '<td class="ProjectPropertiesTD"><text>' + mycategory + '</text>' + '</td></tr>' +
            '<tr class="ProjectPropertiesTR"><td style="background-color: #F1F1F1">Project name</td>' + '<td class="ProjectPropertiesTD"><text>' + myProjectName + '</text>' + '</td></tr>' +
            '<tr class="ProjectPropertiesTR"><td style="background-color: #F1F1F1">Project path</td>' + '<td class="ProjectPropertiesTD"><text>' + myProjectPath + '</text>' + '</td></tr>' +
            '</table>' +
            '</div>' +
            '<br>' + 'Details:' + '<br>' +
            '<textarea id="projectDetailsId" class = "fullWidth tiny" rows="5">' + myProjectDetails + '</textarea>' +
            '<br><input id="picker" type="file" onchange="uploadFiles(this)" webkitdirectory multiple />' +
            ' <div  class="ProjectFilesListDiv">';

        for (var l = 0; l < myProjectFiles.length; l++) {

            var hlpCode = myProjectFiles[l][1];
            var hlpCdId = myProjectFiles[l][1];
            var hlpCdGrp = myProjectFiles[l][0];

            //if ((hlpCdGrp == null) ||(hlpCdGrp == "")){
            //	 hlpCdGrp = "Others";
            //}



            if (l > 0) {
                if (myProjectFiles[l][0] != myProjectFiles[l - 1][0]) {
                    //first item in the group****Need to close previous li and open li for the new group
                    innerHTML = innerHTML + '</ul> </li>';
                    innerHTML = innerHTML + '<li class="day">' + '<i style = "color: black; font-style: normal; ">' + hlpCdGrp + '</i>' + ' <ul style="padding: 0; padding-left: 10px; list-style-type: none; margin: 0; ">';
                    innerHTML = innerHTML + '<li>' + '<a href ="#" class="fileLink" onclick="fileClicked(' + "'" + hlpCdId + "'" + ');return false;" >' + hlpCode + "</a>" + '</li>';
                } else {
                    //another item in the previous group
                    innerHTML = innerHTML + '<li>' + '<a href ="#" class="fileLink" onclick="fileClicked(' + "'" + hlpCdId + "'" + ');return false;" >' + hlpCode + "</a>" + '</li>';
                }
            } else if (l == 0) {
                //First item in the list
                innerHTML = innerHTML + '<li class="day">' + '<i style = "color: black">' + hlpCdGrp + '</i>' + ' <ul style="padding: 0; padding-left: 10px; list-style-type: none; margin: 0; ">' + '<li>' + '<a href ="#" class="fileLink" onclick="fileClicked(' + "'" + hlpCdId + "'" + ');return false;" >' + hlpCode + "</a>" + '</li>';
            }

            //List is over
            if (l == myProjectFiles.length - 1) {
                innerHTML = innerHTML + '</ul> </li></div> </div>';
            }
        }

    }

    //document.getElementById("savedProjectList").innerHTML = innerHTML;

    $('li > ul').each(function (i) {
        // Find this list's parent list item.
        var parentLi = $(this).parent('li');

        // Style the list item as folder.
        parentLi.addClass('folder');

        // Temporarily remove the list from the
        // parent list item, wrap the remaining
        // text in an anchor, then reattach it.
        var subUl = $(this).remove();
        parentLi.wrapInner('<a/>').find('a').click(function () {
            // Make the anchor toggle the leaf display.
            subUl.toggle();
        });
        parentLi.append(subUl);
    });

    // Hide all lists except the outermost.
    $('ul ul').hide();

}

function editProjectDetails(projectId) {
    the.idOfProjectToUpdate = projectId;

    document.getElementById("StoredPrjDivId").style.display = "none";
    document.getElementById("AddNewProjectDivId").style.display = "block";
    document.getElementById("saveProjectMsg").innerHTML = "";
    var tf = JSON.parse(sessionStorage.getItem("SavedProjectsList"));
    var rows = JSON.parse(tf);

    var arr = [];
    var innerHTML = "<div>";

    for (var i = 0; i < rows.length; i++) {
        if (rows[i].project_id == projectId) {
            var myLanguage = rows[i].language;
            var mycategory = rows[i].category;
            var myProjectName = rows[i].project_name;
            var myProjectDetails = rows[i].project_details;
            var myProjectPath = rows[i].project_path;
            var myProjectFiles = JSON.parse(rows[i].project_files);

            document.getElementById("project-language-box").value = myLanguage;
            document.getElementById("project-sub-tech-box").value = mycategory;
            document.getElementById("project-name-box").value = myProjectName;
            document.getElementById("project-path-box").value = myProjectPath;
            //console.log("Setting project details" + myProjectDetails);
            //document.getElementById("project_details").value = myProjectDetails;
            tinyMCE.get('project_details').setContent(myProjectDetails);




            for (var l = 0; l < myProjectFiles.length; l++) {

                var hlpCode = myProjectFiles[l][1];
                var hlpCdId = myProjectFiles[l][1];
                var hlpCdGrp = myProjectFiles[l][0];

                //if ((hlpCdGrp == null) ||(hlpCdGrp == "")){
                //	 hlpCdGrp = "Others";
                //}



                if (l > 0) {
                    if (myProjectFiles[l][0] != myProjectFiles[l - 1][0]) {
                        //first item in the group****Need to close previous li and open li for the new group
                        innerHTML = innerHTML + '</ul> </li>';
                        innerHTML = innerHTML + '<li class="day">' + '<i style = "color: black; font-style: normal; ">' + hlpCdGrp + '</i>' + ' <ul style="padding: 0; padding-left: 10px; list-style-type: none; margin: 0; ">';
                        innerHTML = innerHTML + '<li>' + '<a href ="#" class="fileLink" onclick="fileClicked(' + "'" + hlpCdId + "'" + ');return false;" >' + hlpCode + "</a>" + '</li>';
                    } else {
                        //another item in the previous group
                        innerHTML = innerHTML + '<li>' + '<a href ="#" class="fileLink" onclick="fileClicked(' + "'" + hlpCdId + "'" + ');return false;" >' + hlpCode + "</a>" + '</li>';
                    }
                } else if (l == 0) {
                    //First item in the list
                    innerHTML = innerHTML + '<li class="day">' + '<i style = "color: black">' + hlpCdGrp + '</i>' + ' <ul style="padding: 0; padding-left: 10px; list-style-type: none; margin: 0; ">' + '<li>' + '<a href ="#" class="fileLink" onclick="fileClicked(' + "'" + hlpCdId + "'" + ');return false;" >' + hlpCode + "</a>" + '</li>';
                }

                //List is over
                if (l == myProjectFiles.length - 1) {
                    innerHTML = innerHTML + '</ul> </li></div>';
                }
            }


            the.newProjectContent = myProjectFiles;
            document.getElementById("NewProjectStructureDisplayId").innerHTML = innerHTML;

            $('li > ul').each(function (i) {
                // Find this list's parent list item.
                var parentLi = $(this).parent('li');

                // Style the list item as folder.
                parentLi.addClass('folder');

                // Temporarily remove the list from the
                // parent list item, wrap the remaining
                // text in an anchor, then reattach it.
                var subUl = $(this).remove();
                parentLi.wrapInner('<a/>').find('a').click(function () {
                    // Make the anchor toggle the leaf display.
                    subUl.toggle();
                });
                parentLi.append(subUl);
            });

            // Hide all lists except the outermost.
            $('ul ul').hide();

            return;
        }
    }

}

function toggleCollapse(el) {
    //console.log("Div clicked");

    el.classList.toggle("active");
    var content = el.nextElementSibling;
    if (content.style.display === "block") {
        content.style.display = "none";
    } else {
        content.style.display = "block";
    }

}

function myTopNavFunction() {
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
        x.className += " responsive";
    } else {
        x.className = "topnav";
    }
}

function login() {
    document.getElementById("loginerrormsg").innerHTML = "<font color = red>" + " " + "</font> ";
    StrEmail = document.getElementById("emailid").value
    StrPass = document.getElementById("password").value

    var StrRemember = "Y"

    var StrFunction = "login";

    var error_message = "";

    if (StrEmail.trim() == "") {
        error_message = "Please enter the email id";
        document.getElementById("loginerrormsg").innerHTML = "<font color = #cc0000>" + error_message + "</font> ";
        return;
    }

    var atpos = StrEmail.indexOf("@");
    var dotpos = StrEmail.lastIndexOf(".");

    if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= StrEmail.length) {
        error_message = "Email id is not valid";
        document.getElementById("loginerrormsg").innerHTML = "<font color = #cc0000>" + error_message + "</font> ";
        return;
    }

    if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(StrEmail))) {
        error_message = "Email id is not valid";
        document.getElementById("loginerrormsg").innerHTML = "<font color = #cc0000>" + error_message + "</font> ";
        return;
    }

    if (StrPass.trim() == "") {
        error_message = "Please provide password";
        document.getElementById("loginerrormsg").innerHTML = "<font color = #cc0000>" + error_message + "</font> ";
        return;
    }

    $.ajax({
        url: the.hosturl + '/php/process.php',
        data: { usremail: StrEmail, usrpassword: StrPass, usrremember: StrRemember, usrfunction: StrFunction },
        type: 'POST',
        dataType: 'json',
        success: function (retstatus) {
            //alert("Inside login success retstatus =" + retstatus);
            //console.log( "Inside login success retstatus =" + retstatus);

            if (retstatus.substring(0, 2) == "6S") {
                //document.getElementById("loginerrormsg").innerHTML = "Login Successful"

                loggedIn = "Y";
                document.getElementById("loginLinkId").style.display = "none";
                document.getElementById("logoutLinkId").style.display = "block";
                document.getElementById("profileLinkId").style.display = "block";
                //Show("projectscanner");

                localStorage.setItem("userLoggedIn", "y");
                localStorage.setItem("userLvl", retstatus.substring(2, 3));
                localStorage.setItem("userdata", retstatus.substring(3));
                localStorage.setItem("userEmail", StrEmail);
                getStoredProjectList();
                var myUrl = window.location.protocol + "//" + window.location.host +
                    window.location.pathname;

                var lastUrl = sessionStorage.getItem("lastUrl");

                if (lastUrl == null) {
                    lastUrl = myUrl + "?target=" + "home"
                }
                window.open(lastUrl, "_self");

                //window.open(myUrl + "?target=" + "projectscanner", "_self");


                //document.getElementById("addNewProjBtnId").style.display = "block";
                //localStorage.setItem("userLoggedIn", "y");

            }

            else {
                document.getElementById("loginerrormsg").innerHTML = "<font color = #cc0000>" + retstatus + "</font> ";
            }
        },
        error: function (xhr, status, error) {
            //alert(xhr);
            console.log(error);
            console.log(xhr);
        }
    });
}

function loginWithoutRefresh() {
    document.getElementById("Subloginerrormsg").innerHTML = "<font color = red>" + " " + "</font> ";
    StrEmail = document.getElementById("Subemailid").value
    StrPass = document.getElementById("Subpassword").value

    var StrRemember = "Y"

    var StrFunction = "login";

    var error_message = "";

    if (StrEmail.trim() == "") {
        error_message = "Please enter the email id";
        document.getElementById("Subloginerrormsg").innerHTML = "<font color = #cc0000>" + error_message + "</font> ";
        return;
    }

    var atpos = StrEmail.indexOf("@");
    var dotpos = StrEmail.lastIndexOf(".");

    if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= StrEmail.length) {
        error_message = "Email id is not valid";
        document.getElementById("Subloginerrormsg").innerHTML = "<font color = #cc0000>" + error_message + "</font> ";
        return;
    }

    if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(StrEmail))) {
        error_message = "Email id is not valid";
        document.getElementById("Subloginerrormsg").innerHTML = "<font color = #cc0000>" + error_message + "</font> ";
        return;
    }

    if (StrPass.trim() == "") {
        error_message = "Please provide password";
        document.getElementById("Subloginerrormsg").innerHTML = "<font color = #cc0000>" + error_message + "</font> ";
        return;
    }

    $.ajax({
        url: the.hosturl + '/php/process.php',
        data: { usremail: StrEmail, usrpassword: StrPass, usrremember: StrRemember, usrfunction: StrFunction },
        type: 'POST',
        dataType: 'json',
        success: function (retstatus) {
            //alert(substr(retstatus,4));
            //alert("Inside login loginWithoutRefresh retstatus =" + retstatus);
            //console.log( "Inside loginWithoutRefresh success retstatus =" + retstatus);
            if (retstatus.substring(0, 2) == "6S") {
                //document.getElementById("Subloginerrormsg").innerHTML = "Login Successful"

                loggedIn = "Y";
                document.getElementById("loginLinkId").style.display = "none";
                document.getElementById("SubloginDivId").style.display = "none";
                document.getElementById("logoutLinkId").style.display = "block";
                document.getElementById("profileLinkId").style.display = "block";
                document.getElementById("helpAddUpdateMsg").innerHTML = "";
                //Show("projectscanner");

                localStorage.setItem("userLoggedIn", "y");
                localStorage.setItem("userLvl", retstatus.substring(2, 3));

            }

            else {
                document.getElementById("Subloginerrormsg").innerHTML = "<font color = orange>" + retstatus + "</font> ";
            }
        },
        error: function (xhr, status, error) {
            alert(xhr);
            console.log(error);
            console.log(xhr);
        }
    });
}

function SubshowCreateAccount() {
    document.getElementById("SubloginSecDivId").style.display = "none"
    document.getElementById("SubregisterSecDivId").style.display = "block"
}

function SubshowLogin() {
    document.getElementById("SubregisterSecDivId").style.display = "none"
    document.getElementById("SubloginSecDivId").style.display = "block"
}

function Logout() {
    StrFunction = "logout";
    error_message = "";

    $.ajax({
        url: the.hosturl + '/php/process.php',
        data: { usrfunction: StrFunction },
        type: 'POST',
        dataType: 'json',
        success: function (retstatus) {
            //alert(substr(retstatus,4));

            if (retstatus == "S") {
                loggedIn = "N";
                if (!onMobileBrowser()) {
                    document.getElementById("loginLinkId").style.display = "block";
                }
                document.getElementById("logoutLinkId").style.display = "none";
                document.getElementById("profileLinkId").style.display = "none";
                localStorage.setItem("userLoggedIn", "n");
                sessionStorage.setItem("SavedProjectsList", null);
                //Show("projectscanner");

                //var myUrl = window.location.protocol + "//" + window.location.host +	window.location.pathname ;
                //window.open(myUrl + "?target=" + "projectscanner", "_self");	

                window.open(window.location.href, "_self");
            }

            else {
                //console.log(retstatus);	
            }
        },
        error: function (xhr, status, error) {
            console.log(error);
            console.log(xhr);
        }
    });
}

function cookieAccepted() {
    document.getElementById("cookie-div-id").style.display = "none"
    localStorage.setItem("cookieAccepted", "y");
}

function register() {

    document.getElementById("registererrormsg").innerHTML = "<font color = orange>" + " " + "</font> ";

    var StrEmail = document.getElementById("registeremailid").value
    var StrName = document.getElementById("registerusname").value
    var StrPass = document.getElementById("registerpassword").value
    var StrPassRe = document.getElementById("registerpasswordre").value

    var StrFunction = "register";

    var error_message = "";

    if (StrName.trim() == "") {
        error_message = "Please provide your name";
        document.getElementById("registererrormsg").innerHTML = "<font color = #cc0000>" + error_message + "</font> ";
        return;
    }

    if (StrEmail.trim() == "") {
        error_message = "Please enter the email id";
        document.getElementById("registererrormsg").innerHTML = "<font color = #cc0000>" + error_message + "</font> ";
        return;
    }

    var atpos = StrEmail.indexOf("@");
    var dotpos = StrEmail.lastIndexOf(".");

    if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= StrEmail.length) {
        error_message = "Email id is not valid";
        document.getElementById("registererrormsg").innerHTML = "<font color = #cc0000>" + error_message + "</font> ";
        return;
    }

    if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(StrEmail))) {
        error_message = "Email id is not valid";
        document.getElementById("registererrormsg").innerHTML = "<font color = #cc0000>" + error_message + "</font> ";
        return;
    }

    if (StrPass.trim() == "") {
        error_message = "Please provide password with minimum 8 character length";
        document.getElementById("registererrormsg").innerHTML = "<font color = #cc0000>" + error_message + "</font> ";
        return;
    }

    if (StrPass.length < 8) {
        error_message = "Please provide password with minimum 8 character length";
        document.getElementById("registererrormsg").innerHTML = "<font color = #cc0000>" + error_message + "</font> ";
        return;
    }

    if (StrPass != StrPassRe) {
        error_message = "Entered passwords do not match";
        document.getElementById("registererrormsg").innerHTML = "<font color = #cc0000>" + error_message + "</font> ";
        return;
    }

    var StrAddress = "";

    $.ajax({
        url: the.hosturl + '/php/process.php',
        data: { usremail: StrEmail, usrpassword: StrPass, usrfullname: StrName, usraddress: StrAddress, usrfunction: StrFunction },
        type: 'POST',
        dataType: 'JSON',
        success: function (retstatus) {
            //alert(msg);
            //console.log(retstatus);

            if (retstatus == "S") {
                document.getElementById("registererrormsg").innerHTML = "Registration completed successfully. Account activation email is sent to the provided email id.<br><br>If you would like to set up your own online store click on the button below";

                document.getElementById("registerBtnId").style.display = "none";

                document.getElementById("createMyStoreBtnId").style.display = "block";

                localStorage.setItem("userEmail", StrEmail);
            }

            if (retstatus == "F") {
                document.getElementById("registererrormsg").innerHTML = "There was a problem in completing registration. Issue has been logged and will be resolved soon. Please try again later";

            }

            if ((retstatus != "S") && (retstatus != "F")) {
                document.getElementById("registererrormsg").innerHTML = "<font color = orange>" + retstatus + "</font> ";

            }


        },
        error: function (xhr, status, error) {
            console.log(error);
            console.log(xhr);
            console.log(status);
            document.getElementById("registererrormsg").innerHTML = "There was a problem in completing registration. Issue has been logged and will be resolved soon. Please try again later";
        }
    });
}

function tempShowRegistered() {
    document.getElementById("registererrormsg").innerHTML = "Registration completed successfully. Account activation email is sent to the provided email id.<br><br>If you would like to set up your own online store click on the button below";

    document.getElementById("registerBtnId").style.display = "none";

    document.getElementById("createMyStoreBtnId").style.display = "block";
}

function tempSelectStoreType() {

    document.getElementById("registerSecDivId").style.display = "none";
    document.getElementById("loginSecDivId").style.display = "none";
    document.getElementById("providerSecDivId").style.display = "none";
    //document.getElementById("itemDivId").innerHTML = innerHTML;
    populateStoreType("selectStoreTypeDivId");

    // document.getElementById("selectStoreTypeDivId").style.display = "block";

    // document.getElementById("selectStoreTypeDivId").innerHTML = getStoreTypeList() + "<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>";

    // document.getElementById("selectStoreTypeDivId").style.display = "block";
}

function populateStoreType(divid) {
    document.getElementById(divid).innerHTML = '<label class="form_header_label1 scale-up-ver-top"> SELECT STORE TYPE </label><hr>' +  getStoreTypeList() + "<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>";
    document.getElementById(divid).style.display = "block";
}

function getStoreTypeList() {
    var tf = JSON.parse(sessionStorage.getItem("categoryList"));

    var rows = JSON.parse(tf);



    //var innerHTML = "<input id='item-search-box' type='text'	name='item' autocomplete='off' placeholder='search'/>" +
    //"<button class='buttonCls' onclick='searchItem(); return false;' >Update</button>";
    var innerHTML = "";
    var itemName = "";
    var path = window.location.pathname;
    var myUrl = path.substring(0, path.indexOf('/', path.indexOf('smshopify')) + 1);
    var categorySqueezed = "";
    var categoryOrig = "";
    var categoryUrl = "";

    var defaultDisplayCount = 1000;
    var categoryMaxCount = 0;
    var currDisplayCount = 0;

    for (var i = 0; i < rows.length; i++) {

        subcategory = rows[i].subcategory;
        subcategory = subcategory.replaceAll(" ", "-");

        categoryOrig = rows[i].category;
        category = rows[i].category;

        category = category.replaceAll(" ", "-");

        categorySqueezed = rows[i].category;
        categorySqueezed = categorySqueezed.replaceAll(' ', '');

        categoryMaxCount = sessionStorage.getItem("max-count-" + categorySqueezed);

        if (i == 0) {
            innerHTML = innerHTML + '<div id="menucardparent-' + categorySqueezed + '" class="max_4box_responsive shopCategoryDisplay cursor_pointer" onclick="categoryClicked(' + "'" + categoryOrig + "'" + ')" > ';

            innerHTML = innerHTML +
                '<img src="' + the.hosturl + '/images/' + categoryOrig + '.png" alt="items" class="storeCategoryImg">' +
                '<div class="shopCategoryHeader" >' +
                rows[i].category +
                '</div>';

        } else if (rows[i].category != rows[i - 1].category) {

            innerHTML = innerHTML + '</div><div id="menucardparent-' + categorySqueezed + '" class="max_4box_responsive shopCategoryDisplay cursor_pointer" onclick="categoryClicked(' + "'" + categoryOrig + "'" + ')" >';

            innerHTML = innerHTML +
                '<img src="' + the.hosturl + '/images/' + categoryOrig + '.png" alt="items" class="storeCategoryImg">' +
                '<div class="shopCategoryHeader">' +
                rows[i].category +
                '</div>';
        }

        if (i == rows.length - 1) {
            innerHTML = innerHTML + '</div>';
        }
    }


    innerHTML = innerHTML + '</div>';
    return innerHTML;

}

function categoryClicked(categoryNameOrig) {
    var tf = JSON.parse(sessionStorage.getItem("categoryList"));
    var rows = JSON.parse(tf);
    if (categoryNameOrig != "") {
        categoryName = categoryNameOrig.toUpperCase();
        rows = rows.filter(function (entry) {
            return entry.category.toUpperCase() == categoryName;
        });
    }

    var categorySeq = rows[0].categoryseq;

    localStorage.setItem("storecatsequence", categorySeq);
    localStorage.setItem("storetype", categoryNameOrig);

    var itemstr = categoryNameOrig + "/" + rows[0].title;
    itemstr = itemstr.replaceAll(" ", "-");
    //customizeShop(itemstr);
    document.querySelector(".itemDescription").style.display = "block";
    document.querySelector("#storeSelectedDivId").innerHTML = categoryNameOrig;
    document.querySelector("#storeSelectedDivId").style.display = "block";
    document.querySelector("#selectStoreTypeDivId").style.display = "none";

    setTimeout(function () {
        document.querySelector('#storeSelectedDivId').classList.remove("slide-in-left");
    }, 1000);
}


function customizeShop(itemstr) {
    document.getElementById("selectStoreTypeDivId").style.display = "none";
    document.getElementById("itemDivId").style.display = "block";
    document.getElementById("loginDivId").style.display = "none";
    document.getElementById("contactusDivId").style.display = "none";
    document.getElementById("itemEditDivId").style.display = "block";
    document.getElementById("mainContainer").style.width = "100%";
    document.getElementById("itemEditDivId").style.width = "40%";
    document.getElementById("itemEditDivId").innerHTML = "";

    $.ajax({
        url: the.hosturl + '/php/process.php',
        type: 'POST',
        data: jQuery.param({
            usrfunction: "getItem",
            itemstr: itemstr
        }),
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        success: function (response) {

            tags = JSON.parse(response);
            var itemid = tags[0].itemid;
            var category = tags[0].category;
            var categoryseq = tags[0].categoryseq;
            var subcategory = tags[0].subcategory;
            var subcategoryseq = tags[0].subcategoryseq;
            var title = tags[0].title;
            var titleseq = tags[0].titleseq;
            var shortdescription = tags[0].shortdescription;
            var description = tags[0].description;
            var writer = tags[0].writer;
            var keywords = tags[0].keywords;
            var discontinue = tags[0].discontinue;


            var path = window.location.pathname;
            var myUrl = path.substring(0, path.indexOf('/', path.indexOf('smshopify')) + 1)

            var itemUrl = path.substring(0, path.indexOf('/', path.indexOf('smshopify')) + 1) + "?target=item";
            var categoryUrl = path.substring(0, path.indexOf('/', path.indexOf('smshopify')) + 1) + "items/" + category;

            // var newHTML = "<div classXX = 'shopContainer' >" ; 
            // newHTML = newHTML + "<div classXX = 'shopContainerSub' > <h1 classXX='shopContainerH1' > " + title + "</h1></div>";

            // if (description != undefined){
            //     if (description != ""){
            //         newHTML = newHTML + "" +"<div class = 'shopLyrics' >" + description + "</div>";
            //     }
            // }
            // newHTML = newHTML + '<br><br><br><br><br><br><br><br><br>';
            // document.getElementById("itemDivId").innerHTML = newHTML;

            var newHTML = "<div class = 'shopContainer' >";

            newHTML = newHTML + "<input type='text'  id='title-" + itemid + "' style='width:95%; margin:auto;' value='" + title + "'>";

            newHTML = newHTML + "<div class = 'editFieldHead displayNone'>Title Sort Sequence: </div><br>" + "<input type='text' id='titleseq-" + itemid + "' style='display:none; width:95%; margin:auto;' value='" + titleseq + "'>";
            newHTML = newHTML + "<div class = 'editFieldHead displayNone'>category: </div><br>" + "<input type='text' id='category-" + itemid + "' style='display:none; width:95%; margin:auto;'  value='" + category + "'>";
            newHTML = newHTML + "<div class = 'editFieldHead displayNone'>category Sort Sequence: </div><br>" + "<input type='text' id='categoryseq-" + itemid + "' style='display:none; width:95%; margin:auto;' value='" + categoryseq + "'>";
            newHTML = newHTML + "<div class = 'editFieldHead displayNone'>Path(not in use): </div><br>" + "<input type='text' id='subcategory-" + itemid + "' style='display:none; width:95%; margin:auto;' value='" + subcategory + "'>";
            newHTML = newHTML + "<div class = 'editFieldHead displayNone'>Path Sort Sequence(not in use): </div><br>" + "<input type='text' id='subcategoryseq-" + itemid + "' style='display:none; width:95%; margin:auto;' value='" + subcategoryseq + "'>";
            newHTML = newHTML + "<div class = 'editFieldHead displayNone'>Short Description: </div><br>" + "<textarea id='shortdescription-" + itemid + "' style='display:none; width:95%; margin:auto;' >" + shortdescription + "</textarea>";

            toolbarHTML = "";
            //toolbarHTML =  "<button  type='button' class='itmToggledBtn btn btn-primary' onclick=toggleDescView('" + itemid + "') >Toggle View</button>" + "<br>" ;

            toolbarHTML = toolbarHTML + "<div id='toolBarId' class = 'toolBar'><div>" +
                "<button  title='toggle desc view' type='button' class='itmUpdBtnSmall btn btn-primary' onclick=toggleDescView('" + itemid + "') >TglDesc</button>" +
                "<button  title='toggle hide' type='button' class='itmUpdBtnSmall btn btn-primary' onclick=toggleToolBarView() >TglHide</button>";



            //Reveal Js Slide - Section - Divs*********************

            toolbarHTML = toolbarHTML + "<label class='toolBarlabel'>Div - Sections - Titles</label>"
                + "<button title='secTitlePlane1' type='button' style='background: url(/smshopify/secimages/secTitlePlane1.png); background-size: contain;' class='itmSecImg btn btn-primary' onclick=addComponent('" + itemid + "','secTitlePlane1') ></button>"

                + "<button title='secTitleWithBG' type='button' style='background: url(/smshopify/secimages/secTitleWithBG.png); background-size: contain;' class='itmSecImg btn btn-primary' onclick=addComponent('" + itemid + "','secTitleWithBG') ></button>"

                + "<button title='SemiTransBG' type='button' style='background: url(/smshopify/secimages/SemiTransBG.png); background-size: contain;' class='itmSecImg btn btn-primary' onclick=addComponent('" + itemid + "','SemiTransBG') ></button>"

                + "<button title='SemiTransBG2' type='button' style='background: url(/smshopify/secimages/SemiTransBG2.png); background-size: contain;' class='itmSecImg btn btn-primary' onclick=addComponent('" + itemid + "','SemiTransBG2') ></button>"

                + "<label class='toolBarlabel'>Div - Sections - Lists</label>"

                + "<button title='secWithList1' type='button' style='background: url(/smshopify/secimages/secWithList1.png); background-size: contain;' class='itmSecImg btn btn-primary' onclick=addComponent('" + itemid + "','secWithList1') ></button>"

                + "<button title='titleWithItems1' type='button' style='background: url(/smshopify/secimages/titleWithItems1.png); background-size: contain;' class='itmSecImg btn btn-primary' onclick=addComponent('" + itemid + "','titleWithItems1') ></button>"

                + "<button title='titleWithItems2' type='button' style='background: url(/smshopify/secimages/titleWithItems2.png); background-size: contain;' class='itmSecImg btn btn-primary' onclick=addComponent('" + itemid + "','titleWithItems2') ></button>"

                + "<button title='titleWithItems3' type='button' style='background: url(/smshopify/secimages/titleWithItems3.png); background-size: contain;' class='itmSecImg btn btn-primary' onclick=addComponent('" + itemid + "','titleWithItems3') ></button>"

                + "<label class='toolBarlabel'>Div - Code Explaination</label>"
                + "<button title='titleTextCode1' type='button' style='background: url(/smshopify/secimages/titleTextCode1.png); background-size: contain;' class='itmSecImg btn btn-primary' onclick=addComponent('" + itemid + "','titleTextCode1') ></button>"
                + "<button title='titleTextCode2' type='button' style='background: url(/smshopify/secimages/titleTextCode2.png); background-size: contain;' class='itmSecImg btn btn-primary' onclick=addComponent('" + itemid + "','titleTextCode2') ></button>"

                + "<label class='toolBarlabel'>Div - Quiz MCQ</label>"
                + "<button title='quizMCQFullScreen' type='button' style='background: url(/smshopify/secimages/quizMCQFullScreen.png); background-size: contain;' class='itmSecImg btn btn-primary' onclick=addComponent('" + itemid + "','quizMCQFullScreen') ></button>"
                + "<button title='quizMCQFullScreenLow' type='button' style='background: url(/smshopify/secimages/quizMCQFullScreenLow.png); background-size: contain;' class='itmSecImg btn btn-primary' onclick=addComponent('" + itemid + "','quizMCQFullScreenLow') ></button>"

                + "<label class='toolBarlabel'>Images</label>"
                + "<button title='zoomingImage1' type='button' style='background: url(/smshopify/secimages/zoomingImage1.png); background-size: contain;' class='itmSecImg btn btn-primary' onclick=addComponent('" + itemid + "','zoomingImage1') ></button>"
                + "<hr>"
                + "<label for='insertInner'>Insert component before active Div:</label>"
                + "<input type='checkbox' id='insertInner' >";
            //*************ANIMATION CLASSES************* */
            toolbarHTML = toolbarHTML + "<label class='toolBarlabel'>Animation Classes </label>"
                + "<div class='animList'> <b>CSS Style Format-</b> animation: 'property/AnimationName' 'duration' 'transitionTiming e.g. in cubic-bezier' 'optional:delay' 'optional:animation-iteration-count' 'optional:animation-fill-mode:both' 'optional:animation-direction: normal/reverse/alternate'"
                + "<br><br>Ex. " + escape("<div style='margin:auto; padding-top: 100px; animation-name: roll-in-left; animation-duration: 4s; animation-delay: 1s; animation-iteration-count: 3'>text</div>")
                + "<br><br> <b>To use with fragments add prefix fr-. Eg. animation-name:fr-bounce-right</b>"
                + "<br><br>Ex. " + escape("<div class='fragment fr-rotate-in-center' style='margin:auto; padding-top: 100px;  animation-duration: 4s; animation-delay: 0s; animation-iteration-count: 1'>text</div>")
                + "<br><br><b>ImageZooming:-</b> kenburns-top;  kenburns-left; kenburns-right; zoomingImg;"
                + "<br><br><b>Entrances(Reveal):-</b> scale-in-ver-top; scale-in-hor-center; scale-in-hor-right; scale-up-ver-top; slide-left; slide-right"
                + "<br><br><b>Entrances(Rotate):-</b> rotate-in-center; rotate-in-right; "
                + "<br><br><b>Entrances(Bounce):-</b> bounce-in-top; bounce-in-right; bounce-in-bottom; bounce-in-left; bounce-in-fwd; "
                + "<br><br><b>Entrances(Roll):-</b> roll-in-left; roll-in-top; roll-in-right; roll-in-bottom;  "
                + "<br><br><b>Entrances(Tilt):-</b> tilt-in-top-1; tilt-in-top-2; tilt-in-fwd-tr  "
                + "<br><br><b>Entrances(Swing):-</b> swing-in-top-fwd; swing-in-left-bck  "
                + "<br><br><b>Entrances(Text-Expand/Contract):-</b> tracking-in-expand;tracking-in-expand-fwd;tracking-in-contract-bck;tracking-in-contract;text-pop-up-top  "
                + "<br><br><b>Attention:-</b> shake-vertical; jello-diagonal-1; jello-horizontal;wobble-hor-bottom; wobble-hor-top; bounce-top; bounce-bottom; bounce-left; bounce-right  "
                + "<br><br><b>Others:-</b> slidingUp10px; slidingUp600px; slidingDown10px; slidingDown600px; slidingleft10px; slidingleft600px; slidingright10px; slidingright600px;"
                + "<br><br>slideFragmentUp10px;slideFragmentUp600px;slideFragmentDown10px;slideFragmentDown600px;slideFragmentLeft10px;slideFragmentLeft600px;slideFragmentRight10px; slideFragmentRight600px;"
                + "<br><br> </div>";

            //*************SOUNDS************* */
            toolbarHTML = toolbarHTML + "<label class='toolBarlabel'>Sounds (Click to insert at Carot) </label>"

                + "<button title='air-in-a-hit' type='button'  class='soundPreviewByTitle btn btn-primary' onmouseover='previewSound(this)' onclick=addComponent('" + itemid + "','air-in-a-hit') >air-in-a-hit</button>"
                + "<button title='arrow-whoosh' type='button'  class='soundPreviewByTitle btn btn-primary' onmouseover='previewSound(this)' onclick=addComponent('" + itemid + "','arrow-whoosh') >arrow-whoosh</button>"
                + "<button title='bell-ding-586' type='button'  class='soundPreviewByTitle btn btn-primary' onmouseover='previewSound(this)' onclick=addComponent('" + itemid + "','bell-ding-586') >bell-ding-586</button>"
                + "<button title='fast-blow' type='button'  class='soundPreviewByTitle btn btn-primary' onmouseover='previewSound(this)' onclick=addComponent('" + itemid + "','fast-blow') >fast-blow</button>"
                + "<button title='fast-sweep' type='button'  class='soundPreviewByTitle btn btn-primary' onmouseover='previewSound(this)' onclick=addComponent('" + itemid + "','fast-sweep') >fast-sweep</button>"
                + "<button title='keyboard-key-presses' type='button'  class='soundPreviewByTitle btn btn-primary' onmouseover='previewSound(this)' onclick=addComponent('" + itemid + "','keyboard-key-presses') >keyboard-key-presses</button>"
                + "<button title='page-flip-01a' type='button'  class='soundPreviewByTitle btn btn-primary' onmouseover='previewSound(this)' onclick=addComponent('" + itemid + "','page-flip-01a') >page-flip-01a</button>"
                + "<button title='paper-slide' type='button'  class='soundPreviewByTitle btn btn-primary' onmouseover='previewSound(this)' onclick=addComponent('" + itemid + "','paper-slide') >paper-slide</button>"
                + "<button title='pop' type='button'  class='soundPreviewByTitle btn btn-primary' onmouseover='previewSound(this)' onclick=addComponent('" + itemid + "','pop') >pop</button>"
                + "<button title='sand-swish' type='button'  class='soundPreviewByTitle btn btn-primary' onmouseover='previewSound(this)' onclick=addComponent('" + itemid + "','sand-swish') >sand-swish</button>"
                + "<button title='ui-zoom-in' type='button'  class='soundPreviewByTitle btn btn-primary' onmouseover='previewSound(this)' onclick=addComponent('" + itemid + "','ui-zoom-in') >ui-zoom-in</button>"
                + "<button title='low-arrow-whoosh' type='button'  class='soundPreviewByTitle btn btn-primary' onmouseover='previewSound(this)' onclick=addComponent('" + itemid + "','low-arrow-whoosh') >low-arrow-whoosh</button>"
                + "<button title='low-sand-swish' type='button'  class='soundPreviewByTitle btn btn-primary' onmouseover='previewSound(this)' onclick=addComponent('" + itemid + "','low-sand-swish') >low-sand-swish</button>"
                + "<button title='low-bell-ding' type='button'  class='soundPreviewByTitle btn btn-primary' onmouseover='previewSound(this)' onclick=addComponent('" + itemid + "','low-bell-ding') >low-bell-ding</button>";

            //*************BACKGROUND SOUNDS************* */
            toolbarHTML = toolbarHTML + "<label class='toolBarlabel'>Background Sounds (Click to insert at Carot) </label>"

                + "<button title='background1' type='button'  class='soundPreviewByTitle btn btn-primary' onmouseover='previewSound(this)' onclick=addComponent('" + itemid + "','background1') >background1</button>"
                + "<button title='background2' type='button'  class='soundPreviewByTitle btn btn-primary' onmouseover='previewSound(this)' onclick=addComponent('" + itemid + "','background2') >background2</button>"
                + "<button title='background3' type='button'  class='soundPreviewByTitle btn btn-primary' onmouseover='previewSound(this)' onclick=addComponent('" + itemid + "','background3') >background3</button>"
                + "<button title='background4' type='button'  class='soundPreviewByTitle btn btn-primary' onmouseover='previewSound(this)' onclick=addComponent('" + itemid + "','background4') >background4</button>"
                + "<button title='background5' type='button'  class='soundPreviewByTitle btn btn-primary' onmouseover='previewSound(this)' onclick=addComponent('" + itemid + "','background5') >background5</button>"
                + "<button title='background6' type='button'  class='soundPreviewByTitle btn btn-primary' onmouseover='previewSound(this)' onclick=addComponent('" + itemid + "','background6') >background6</button>"

                + "<hr>" + "Enable Preview: <input type='checkbox' id='enableSoundPreview' > Enable Loop: <input type='checkbox' id='enableSoundLoop' ><br>" + "<audio id='audioPreview' controls='controls'>  <source id='audioSourceIdMP3' src='' type='audio/mp3'><source id='audioSourceIdWAV' src='' type='audio/wav'></source>Not Supported</audio>";

            //****************IMAGES****************/
            toolbarHTML = toolbarHTML + "<label class='toolBarlabel'>Scripts</label>"
                + "<button title='code-snippet' type='button'  class='soundPreviewByTitle btn btn-primary'  onclick=addComponent('" + itemid + "','code-snippet') >code-snippet</button>"

            toolbarHTML = toolbarHTML + "<label class='toolBarlabel'>Upload Image</label>"
                + "Upload Image:(e.g. myimage.png)" +
                "<input type='text' id='image-" + itemid + "' style='width:95%; margin:auto;'  value=''>"
                +
                "<br><img id='image-src-replace-" + itemid + "' src= '" + the.hosturl + "/img/" + "' style='width: 200px; height: 200px; background-color: white;' alt='Image not available' />"

                +
                "<br><input type='file'  id='image-replace-" + itemid + "' data-itemid = '" + itemid + "'   data-imageelementid='image-src-replace-' onchange='showImage(event)'>"

                +
                "<br><label id='image-ererrormsg-" + itemid + "' style='color: #cc0000; font-size: 14px; min-height: 20px;'></label>"
                +
                "<input class='itmUpdBtnSmall' type='button' value='Upload And Insert At Carot' data-errormsgelementid='image-ererrormsg-' data-saveasnameelementid='image-' data-fileelementid='image-replace-' data-itemid = '" + itemid + "' onclick='uploadAndInsertFile(event);'  >"
                +
                "<input class='itmUpdBtnSmall' type='button' value='Insert At Carot' data-errormsgelementid='image-ererrormsg-' data-saveasnameelementid='image-' data-fileelementid='image-replace-' data-itemid = '" + itemid + "' onclick='insertImageAtCarot(event);'  >"
                +
                "<input class='itmUpdBtnSmall' type='button' value='Upload New Image' data-errormsgelementid='image-ererrormsg-' data-saveasnameelementid='image-' data-fileelementid='image-replace-' data-itemid = '" + itemid + "' onclick='uploadFile(event);'  ><br>"
                + "<label class='toolBarlabel'>Search Images (Click to Save)</label>"
                + "<input class = 'itmUpdBtnSmall' type='text' id='search-img' value=''> "
                + "<button title='Image-Smallest' type='button' class='itmUpdBtnSmall btn btn-primary' onclick=loadUNSPLImg('" + itemid + "')>Search Unsplash</button>"
                + "<button title='Image-Smallest' type='button' class='itmUpdBtnSmall btn btn-primary' onclick=loadPixabImg('" + itemid + "')>Search Pixabay</button>"
                + "<button title='Image-Smallest' type='button' class='itmUpdBtnSmall btn btn-primary' onclick=loadPexImg('" + itemid + "')>Search Pexel</button><br>"
                + "<div class='srchimages'></div>";

            toolbarHTML = toolbarHTML + "<label class='toolBarlabel'>Paragraphs</label>" +
                "<button title='paragraph1' type='button' class='itmUpdBtnSmall btn btn-primary' onclick=addComponent('" + itemid + "','paragraph1') >P1</button>" +
                "<button title='paragraph2 white BG' type='button' class='itmUpdBtnSmall btn btn-primary' onclick=addComponent('" + itemid + "','paragraph2') >P2</button>" +
                "<label class='toolBarlabel'>Ordered Lists</label>" +
                "<button title='ordered-list' type='button' class='itmUpdBtnSmall btn btn-primary' onclick=addComponent('" + itemid + "','orderedlist') >OL1</button>" +
                "<button title='sub-ordered-list' type='button' class='itmUpdBtnSmall btn btn-primary' onclick=addComponent('" + itemid + "','suborderedlist') >OL2</button>" +
                "<label class='toolBarlabel'>Unordered Lists</label>" +
                "<button title='un-ordered-list' type='button' class='itmUpdBtnSmall btn btn-primary' onclick=addComponent('" + itemid + "','unorderedlist') >UL1</button>" +
                "<button title='sub-un-ordered-list' type='button' class='itmUpdBtnSmall btn btn-primary' onclick=addComponent('" + itemid + "','subunorderedlist') >UL2</button>" +
                "<button title='sub2-un-ordered-list' type='button' class='itmUpdBtnSmall btn btn-primary' onclick=addComponent('" + itemid + "','sub2unorderedlist') >UL3</button>" +
                "<label class='toolBarlabel'>Code Snippets</label>" +
                "<button title='Code-Dark Intellij' type='button' class='itmUpdBtnSmall btn btn-primary' onclick=addComponent('" + itemid + "','codescript1') >Dark</button>" +
                "<button title='Code-Light-VSCode' type='button' class='itmUpdBtnSmall btn btn-primary' onclick=addComponent('" + itemid + "','codescript2') >Light</button>" +
                "<button title='Code-CommandLine'' type='button' class='itmUpdBtnSmall btn btn-primary' onclick=addComponent('" + itemid + "','codescript3') >Cmd</button>" +
                "<label class='toolBarlabel'>Headers</label>" +
                "<button title='header1' type='button' class='itmUpdBtnSmall btn btn-primary' onclick=addComponent('" + itemid + "','header1') >H1</button>" +
                "<button title='header2' type='button' class='itmUpdBtnSmall btn btn-primary' onclick=addComponent('" + itemid + "','header2') >H2</button>" +
                "<button title='header3-padding' type='button' class='itmUpdBtnSmall btn btn-primary' onclick=addComponent('" + itemid + "','header3') >H3</button>" +
                "<button title='header3' type='button' class='itmUpdBtnSmall btn btn-primary' onclick=addComponent('" + itemid + "','header4') >H4</button>" +
                "<label class='toolBarlabel'>Images</label>" +
                "<button title='Image-Full-width' type='button' class='itmUpdBtnSmall btn btn-primary' onclick=addComponent('" + itemid + "','image1') >I1</button>" +
                "<button title='Image-Smaller' type='button' class='itmUpdBtnSmall btn btn-primary' onclick=addComponent('" + itemid + "','image2') >I2</button>" +
                "<button title='Image-Smallest' type='button' class='itmUpdBtnSmall btn btn-primary' onclick=addComponent('" + itemid + "','image3') >I3</button>" +
                "<button title='Image-Smallest' type='button' class='itmUpdBtnSmall btn btn-primary' onclick=addComponent('" + itemid + "','image4') >I@Car</button>" +
                "<label class='toolBarlabel'>Messages</label>" +
                "<button title='Warning'' type='button' class='itmUpdBtnSmall btn btn-primary' onclick=addComponent('" + itemid + "','warning') >Warn</button>" +
                "<button title='Error' type='button' class='itmUpdBtnSmall btn btn-primary' onclick=addComponent('" + itemid + "','error') >Err</button>" +
                "<button title='Green-Success' type='button' class='itmUpdBtnSmall btn btn-primary' onclick=addComponent('" + itemid + "','greenmsg') >Succ</button>" +

                "<label class='toolBarlabel'>Quiz</label>" +
                "<button title='Quiz1'' type='button' class='itmUpdBtnSmall btn btn-primary' onclick=addComponent('" + itemid + "','qz1') >Q1</button>" +
                "<button title='Quiz2' type='button' class='itmUpdBtnSmall btn btn-primary' onclick=addComponent('" + itemid + "','qz2') >Q2</button>" +
                "<button title='Submit Quiz Button' type='button' class='itmUpdBtnSmall btn btn-primary' onclick=addComponent('" + itemid + "','sbmtqz') >SbmtQz</button>" +
                "</div>";

            //*************END OF TOOLBAR DIV */
            toolbarHTML = toolbarHTML + "</div><br><br><br>";
            //*************END OF TOOLBAR DIV */                 

            newHTML = newHTML + "<br><br>" +
                "<textarea id='descriptionTextId' class = ''   ></textarea>"
                +
                "<div class='editDescriptionDiv' contenteditable='true'  class='span2 fullWidth lyricsDiv' id='description-" + itemid + "'  >" + description + "</div>";

            //newHTML = newHTML +  "<br><br><div class = 'editFieldHead'>Writer: </div><br>" +  "<input type='text' id='writer-" + itemid + "' style='width:95%; margin:auto;' value='" + writer + "'>";
            //newHTML = newHTML +  "<br><br><div class = 'editFieldHead'>Keywords (tags): </div><br>" +  "<textarea id='keywords-" + itemid + "' style='width:95%; margin:auto;' >" + keywords + "</textarea>";
            //newHTML = newHTML + "<br><br><div class = 'editFieldHead'>Discontinue: </div> <br>" +  "<input type='text' id='discontinue-" + itemid + "' style='width:95%; margin:auto;' value='" + discontinue + "'>" ;

            newHTML = newHTML + "<label id='updateitemerrormsg-" + itemid + "' style='color: #cc0000; font-size: 14px; min-height: 20px;'></label>";

            newHTML = newHTML + "<div class = 'saveChangesDivCls'>";
            //"<button  type='button' class='itmUpdSaveBtn btn btn-primary' onclick=updateDescription('" + itemid + "','n') >Save Changes</button><br>" +
            newHTML = newHTML + "<button   type='button' class='itmUpdSaveBtn btn btn-primary' onclick=saveNewStore('" + itemid + "','y') >Submit for Review</button><br>" +
                "<button   type='button' class='itmUpdSaveBtn btn btn-danger' onclick=refreshPage() >Cancel</button><br>" +
                "</div>" +
                "<br><br><br><br><br><br><br><br><br></div></div>";

            newHTML = newHTML + "</div>";
            newHTML = newHTML + "</div>";
            newHTML = newHTML + "</div>";

            document.getElementById("itemDivId").innerHTML = newHTML;
            document.getElementById("itemEditDivId").innerHTML = toolbarHTML;


            document.getElementById("itemEditDivId").style.display = "block";

            document.getElementById("itemDivId").style.width = "100%";

            document.getElementById("mainContainer").style.width = "100%";
            document.getElementById("itemEditDivId").style.width = "700px";
            document.getElementById("itemListDivId").style.display = "none";



        },
        error: function (xhr, status, error) {
            //console.log(error);
            //console.log(xhr);
        }
    });
}




function setUpMyStore() {
    document.getElementById("registerSecDivId").style.display = "none";
    document.getElementById("providerSecDivId").style.display = "block";
}

function Subregister() {
    document.getElementById("Subregistererrormsg").innerHTML = "<font color = orange>" + " " + "</font> ";

    var StrEmail = document.getElementById("Subregisteremailid").value
    var StrName = document.getElementById("Subregisterusname").value
    var StrPass = document.getElementById("Subregisterpassword").value
    var StrPassRe = document.getElementById("Subregisterpasswordre").value

    var StrFunction = "register";

    var error_message = "";

    if (StrName.trim() == "") {
        error_message = "Please provide your name";
        document.getElementById("Subregistererrormsg").innerHTML = "<font color = #cc0000>" + error_message + "</font> ";
        return;
    }

    if (StrEmail.trim() == "") {
        error_message = "Please enter the email id";
        document.getElementById("Subregistererrormsg").innerHTML = "<font color = #cc0000>" + error_message + "</font> ";
        return;
    }

    var atpos = StrEmail.indexOf("@");
    var dotpos = StrEmail.lastIndexOf(".");

    if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= StrEmail.length) {
        error_message = "Email id is not valid";
        document.getElementById("Subregistererrormsg").innerHTML = "<font color = #cc0000>" + error_message + "</font> ";
        return;
    }

    if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(StrEmail))) {
        error_message = "Email id is not valid";
        document.getElementById("Subregistererrormsg").innerHTML = "<font color = #cc0000>" + error_message + "</font> ";
        return;
    }

    if (StrPass.trim() == "") {
        error_message = "Please provide password with minimum 8 character length";
        document.getElementById("Subregistererrormsg").innerHTML = "<font color = #cc0000>" + error_message + "</font> ";
        return;
    }

    if (StrPass.length < 8) {
        error_message = "Please provide password with minimum 8 character length";
        document.getElementById("Subregistererrormsg").innerHTML = "<font color = #cc0000>" + error_message + "</font> ";
        return;
    }

    if (StrPass != StrPassRe) {
        error_message = "Entered passwords do not match";
        document.getElementById("Subregistererrormsg").innerHTML = "<font color = #cc0000>" + error_message + "</font> ";
        return;
    }

    var StrAddress = "";

    $.ajax({
        url: the.hosturl + '/php/process.php',
        data: { usremail: StrEmail, usrpassword: StrPass, usrfullname: StrName, usraddress: StrAddress, usrfunction: StrFunction },
        type: 'POST',
        dataType: 'JSON',
        success: function (retstatus) {
            //alert(msg);
            //console.log(retstatus);

            if (retstatus == "S") {
                document.getElementById("Subregistererrormsg").innerHTML = "Registration completed successfully. Please check your email for account activation.";
            }

            if (retstatus == "F") {
                document.getElementById("Subregistererrormsg").innerHTML = "There was a problem in completing registration. Issue has been logged and will be resolved soon. Please try again later";

            }

            if ((retstatus != "S") && (retstatus != "F")) {
                document.getElementById("Subregistererrormsg").innerHTML = "<font color = #cc0000>" + retstatus + "</font> ";

            }


        },
        error: function (xhr, status, error) {
            console.log(error);
            console.log(xhr);
            console.log(status);
            document.getElementById("Subregistererrormsg").innerHTML = "There was a problem in completing registration. Issue has been logged and will be resolved soon. Please try again later";
        }
    });
}

function forgotpw() {
    document.getElementById("forgotpwerrormsg").innerHTML = "<font color = #cc0000>" + " " + "</font> ";

    var StrEmail = document.getElementById("forgotpwemailid").value

    var StrFunction = "forgotpw";

    var error_message = "";


    if (StrEmail.trim() == "") {
        error_message = "Please enter the email id";
        document.getElementById("forgotpwerrormsg").innerHTML = "<font color = #cc0000>" + error_message + "</font> ";
        return;
    }

    var atpos = StrEmail.indexOf("@");
    var dotpos = StrEmail.lastIndexOf(".");

    if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= StrEmail.length) {
        error_message = "Email id is not valid";
        document.getElementById("forgotpwerrormsg").innerHTML = "<font color = #cc0000>" + error_message + "</font> ";
        return;
    }

    if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(StrEmail))) {
        error_message = "Email id is not valid";
        document.getElementById("forgotpwerrormsg").innerHTML = "<font color = #cc0000>" + error_message + "</font> ";
        return;
    }


    $.ajax({
        url: the.hosturl + '/php/process.php',
        data: { usremail: StrEmail, usrfunction: StrFunction },
        type: 'POST',
        dataType: 'JSON',
        success: function (retstatus) {
            //alert(msg);
            //console.log(retstatus);

            if (retstatus == "S") {
                document.getElementById("forgotpwerrormsg").innerHTML = "Request processed. Please check your email for password reset link.";
            }

            if (retstatus == "F") {
                document.getElementById("forgotpwerrormsg").innerHTML = "Email id not found";

            }

            if ((retstatus != "S") && (retstatus != "F")) {
                document.getElementById("forgotpwerrormsg").innerHTML = "<font color = red>" + retstatus + "</font> ";

            }


        },
        error: function (xhr, status, error) {
            console.log(error);
            console.log(xhr);
            console.log(status);
            document.getElementById("forgotpwerrormsg").innerHTML = "There was a problem in completing the request. Issue has been logged and will be resolved soon. Please try again later";
        }
    });
}
function contactus() {
    document.getElementById("contactuserrormsg").innerHTML = "<font color = #cc0000>" + " " + "</font> ";
    var StrEmail = document.querySelector(".contactusemailidCls").value
    //var StrEmail = document.getElementById("contactusemailid").value

    var StrName = document.querySelector(".contactusnameCls").value
    //var StrName = document.getElementById("contactusname").value

    var StrComment = document.getElementById("contactus_msg").value;
    //console.log(window.location.pathname);

    var StrFunction = "contactus";

    var error_message = "";

    if (StrName.trim() == "") {
        error_message = "Please provide your name";
        document.getElementById("contactuserrormsg").innerHTML = "<font color = #cc0000>" + error_message + "</font> ";
        return;
    }

    if (StrEmail.trim() == "") {
        error_message = "Please enter the email id";
        document.getElementById("contactuserrormsg").innerHTML = "<font color = #cc0000>" + error_message + "</font> ";
        return;
    }

    var atpos = StrEmail.indexOf("@");
    var dotpos = StrEmail.lastIndexOf(".");

    if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= StrEmail.length) {
        error_message = "Email id is not valid";
        document.getElementById("contactuserrormsg").innerHTML = "<font color = #cc0000>" + error_message + "</font> ";
        return;
    }

    if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(StrEmail))) {
        error_message = "Email id is not valid";
        document.getElementById("contactuserrormsg").innerHTML = "<font color = #cc0000>" + error_message + "</font> ";
        return;
    }



    if (StrComment.trim() == "") {
        error_message = "Please provide message";
        document.getElementById("contactuserrormsg").innerHTML = "<font color = #cc0000>" + error_message + "</font> ";
        return;
    }
    StrComment = StrComment + "<br><br><br>" + window.location.pathname;

    if (the.captcha != document.getElementsByClassName("enteredCaptchaTextCls").value) {
        if ((localStorage.getItem("userLoggedIn") == "n") || (localStorage.getItem("userLvl") != "9")) {
            error_message = "Entered code is incorrect";
            document.getElementById("contactuserrormsg").innerHTML = "<font color = #cc0000>" + error_message + "</font> ";
            return;
        }
    }
    $.ajax({
        url: the.hosturl + '/php/process.php',
        data: { usrname: StrName, usremail: StrEmail, usrcomment: StrComment, usrfunction: StrFunction },
        type: 'POST',
        dataType: 'json',
        success: function (retstatus) {
            //alert(substr(retstatus,4));
            //console.log(retstatus);
            document.getElementById("contactuserrormsg").innerHTML = "<font color = #cc0000>" + "Thank you for your message. We will get back to you shortly" + "</font> ";

        },
        error: function (xhr, status, error) {
            //console.log(error);
            //console.log(xhr);
        }
    });
}

function toggleHideLeftParent(elem) {
    //elem.parentElement.classList.toggleClass("panel-hide-left");
    $("#itemListDivId").toggle("slide")
}
function onMobileBrowser() {

    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        // true for mobile device
        return true;
    } else {
        // false for not mobile device
        return false;
    }

}

function providerSelected() {
    document.getElementById("addresscontainerDiv").style.display = "block";
}

function setProvAddr() {

    var error_message = "";

    shipaddress = document.getElementById("shipaddress").value;
    shipcountry = document.getElementById("shipcountry").value;
    zipcode = document.getElementById("zipcode").value;
    zipcode = zipcode.replaceAll(' ', '');
    shipcity = document.getElementById("shipcity").value;
    shipstate = document.getElementById("shipstate").value;


    if ((shipaddress.trim() == "") || (shipcountry.trim() == "") || (zipcode.trim() == "") || (shipcity.trim() == "") || (shipstate.trim() == "")) {
        error_message += "<br>All address fields are required";
    }

    if (error_message != "") {
        document.getElementById("providerAddrErrorMsg").innerHTML = "<font color = #cc0000>" + error_message + "</font> ";
        return;
    }
}

function escape(s) {
    var escaped = {
        '<': '&lt;',
        '>': '&gt;',
    };
    return s.replace(/[<>]/g, function (m) {
        return escaped[m];
    });
}

function updateParentBGVideo(element) {
    element.parentElement.parentElement.dataset.backgroundvideo = element.value;
    //element.parentElement.parentElement.style.background = url('/smshopify/video/' + element.value);

    var selectedVid = element.parentElement.querySelector('.selectedVid');
    selectedVid.innerHTML = element.value;
}

function updateParentBGImage(element) {
    element.parentElement.parentElement.dataset.background = element.value;
    //element.parentElement.parentElement.style.backgroundImage  = "url('/smshopify/img/" + element.value + "')";

    //var parentSecDiv = element.parentElement.parentElement;
    //var previewDiv = parentSecDiv.querySelector('.secPreview');
    var previewDiv = document.querySelector('.secPreview');

    if (previewDiv.style.display != "none") {
        previewDiv.style.backgroundImage = "url('/smshopify/img/" + element.value + "')";
    }

    var selectedImg = element.parentElement.querySelector('.selectedImg');
    selectedImg.innerHTML = element.value;
}
function updateParentAutoAnimate(element) {
    element.parentElement.parentElement.dataset.autoanimate = element.value;
}

function updateTextDivColor(element) {
    var rgbColor = hexToRgb(element.dataset.clr);
    //var rgbColor = element.style.backgroundColor;
    document.getElementById("textDivId").style.backgroundColor = element.style.backgroundColor;
    //element.style.backgroundColor = element.value;    

    var textColour = getFontColorForRGBbackGroundColor(rgbColor);
    document.getElementById("textDivId").style.color = textColour;
}

function updateParentBGColor(element) {
    //element.parentElement.parentElement.dataset.bgcolor = element.value;

    //element.parentElement.parentElement.dataset.bgcolor = element.style.backgroundColor;

    //element.parentElement.parentElement.style.backgroundColor = element.value;
    //element.style.backgroundColor = element.value;

    var rgbColor = hexToRgb(element.dataset.clr);
    //var rgbColor = element.dataset.clr;
    var textColour = getFontColorForRGBbackGroundColor(rgbColor);

    //var parentSecDiv = element.parentElement.parentElement;
    //var previewDiv = parentSecDiv.querySelector('.secPreview');
    //var previewDiv = document.querySelector('.secPreview');

    //var parentSecDiv = element.parentElement.parentElement.parentElement;
    var previewDiv = element.parentElement.parentElement.parentElement;
    //var previewDiv = parentSecDiv.querySelector('.secPreview');

    if (previewDiv.style.display != "none") {

        var bannerDiv = previewDiv.querySelector('.shopTopBanner');
        bannerDiv.style.backgroundColor = element.style.backgroundColor;;
        bannerDiv.style.color = textColour;
    }
}

function getFontColorForRGBbackGroundColor(rgbColor) {
    var brightness = Math.round(((parseInt(rgbColor.r) * 299) +
        (parseInt(rgbColor.g) * 587) +
        (parseInt(rgbColor.b) * 114)) / 1000);

    var textColour = (brightness > 125) ? 'black' : 'white';
    return textColour;
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function updateParentTransition(element) {
    element.parentElement.parentElement.dataset.transition = element.value;
    //element.parentElement.parentElement.style.backgroundColor = element.value;
}

function updateParentFontColor(element) {
    element.parentElement.parentElement.style.color = element.value;
}

// function updatePreview(componentid){
//     var tmprHTML = "";
//     if (document.getElementById("descriptionTextId").style.display == "block"){
//         tmprHTML = document.getElementById("descriptionTextId").value;
//     } else {
//         tmprHTML = document.getElementById(componentid).innerHTML;
//     }
//     tmprHTML = tmprHTML.replaceAll("revealTemp", "reveal");
//     tmprHTML = tmprHTML.replaceAll("deck1Temp", "deck1");
//     document.getElementById("animoutDivId").innerHTML =  tmprHTML;

//     setTimeout(function() {
//         let deck1 = new Reveal( document.querySelector( '.deck1' ), {
//             embedded: true,
//             progress: false,
//             keyboardCondition: 'focused',
//             plugins: [ RevealZoom, RevealNotes, RevealSearch, RevealMarkdown, RevealHighlight ]
//         } );

//         deck1.on( 'fragmentshown', event => {
//             var elem = event.fragment;
//             if (elem.classList.contains("countDown5")){
//                 countDown5();
//             };
//             if (elem.classList.contains("showRightAns")){
//                 showRightAns(elem);
//             };
//         } );        
//         deck1.initialize({disableLayout: true});
//     }, 3000);
// }

function updatePreviewDiv(element) {
    var parentSecDiv = element.parentElement;
    var childTextArea = element;
    var secText = childTextArea.value;
    var previewDiv = parentSecDiv.querySelector('.secPreview');

    previewDiv.innerHTML = "<div contenteditable='true' class='revealDummy' style=' margin: 10px;'><div class='slides'>" + secText + "</div></div>";

    if (parentSecDiv.dataset.backgroundvideo == "") {
        if (parentSecDiv.dataset.background == "") {
            //Background color
            //secProps = secProps + " data-background = '" + parentSecDiv.dataset.bgcolor + "'";
            previewDiv.style.backgroundColor = parentSecDiv.dataset.bgcolor;
        } else {
            //Background image
            //secProps = secProps + " data-background-image = '/smshopify/img/" + parentSecDiv.dataset.background + "' ";
            previewDiv.style.backgroundImage = "url('/smshopify/img/" + parentSecDiv.dataset.background + "')";
        }
    } else {
        //Background video
        //secProps = secProps + " data-background-video = '/smshopify/video/" + parentSecDiv.dataset.backgroundvideo + "' ";
    }

}

function updatePreviewUsingDivs(componentid) {

    var elems = document.getElementsByClassName("secdiv");

    var tmprHTML = "<div class='reveal deck1' style=' margin: 10px;'><div class='slides'>";

    for (i = 0; i < elems.length; i++) {

        var element = elems[i];
        //var childTextArea = element.querySelector('.secDivTextArea');
        //var secText = childTextArea.value;
        var slidesDiv = element.querySelector('.slides');
        var secText = slidesDiv.innerHTML

        var secProps = "";

        var transition = element.dataset.transition;
        secProps = secProps + " data-transition='" + transition + "'";

        if (element.dataset.backgroundvideo == "") {
            if (element.dataset.background == "") {
                //Background color
                secProps = secProps + " data-background = '" + element.dataset.bgcolor + "'";
            } else {
                //Background image
                secProps = secProps + " data-background-image = '/smshopify/img/" + element.dataset.background + "' ";
            }
        } else {
            //Background video
            secProps = secProps + " data-background-video = '/smshopify/video/" + element.dataset.backgroundvideo + "' ";
        }

        if (element.dataset.autoanimate == "Yes") {
            secProps = secProps + " data-auto-animate ";
        }


        //secText = secText.substring(0, secText.indexOf("#00ffff"));
        //tmprHTML = tmprHTML + "<section data-transition='" + transition + "'  data-background='" + background + "'  >" + secText + "</section>";
        tmprHTML = tmprHTML + "<section " + secProps + "  >" + secText + "</section>";

    }

    tmprHTML = tmprHTML + "</div></div>";

    // if (document.getElementById("descriptionTextId").style.display == "block"){
    //     tmprHTML = document.getElementById("descriptionTextId").value;
    // } else {
    //     tmprHTML = document.getElementById(componentid).innerHTML;
    // }

    // tmprHTML = tmprHTML.replaceAll("revealTemp", "reveal");
    // tmprHTML = tmprHTML.replaceAll("deck1Temp", "deck1");

    document.getElementById("animoutDivId").innerHTML = tmprHTML;
    //document.getElementById("wrapper").innerHTML =  tmprHTML;

    setTimeout(function () {
        let deck1 = new Reveal(document.querySelector('.deck1'), {
            embedded: true,
            progress: false,
            keyboardCondition: 'focused',
            plugins: [RevealZoom, RevealNotes, RevealSearch, RevealMarkdown, RevealHighlight]
        });
        // deck1.on( 'slidechanged', () => {
        //     console.log( 'Deck 1 slide changed' );
        // } );

        deck1.on('fragmentshown', event => {
            var elem = event.fragment;
            if (elem.classList.contains("countDown5")) {
                countDown5(elem);
            };
            if (elem.classList.contains("showRightAns")) {
                showRightAns(elem);
            };

        });
        deck1.initialize({
            disableLayout: true,
            autoPlayMedia: false,
            autoSlide: 5000,
            //loop: true, 
            slideNumber: true,
        });
        deck1.addEventListener('fragmentshown', playCurrentFragment);
        deck1.addEventListener('fragmenthidden', playCurrentFragment);
    }, 3000);
}

function plusitemImages(n, elem) {
    showitemImages(itemImageIndex += n, elem);
}

function currentitemImage(n, elem) {
    showitemImages(itemImageIndex = n, elem);
}

function showitemImages(n, elem = "dummy") {
    var i;
    var itemImages = document.getElementsByClassName("myitemImages");
    if (itemImages.length < 1) {
        return;
    }

    if (elem != "dummy") {
        var parent = elem.parentElement;
        //itemImages = parent.querySelectorAll(".myitemImages");
        itemImages = parent.getElementsByClassName("myitemImages");

        if (n > itemImages.length) { itemImageIndex = 1 }
        if (n < 1) { itemImageIndex = itemImages.length }
        for (i = 0; i < itemImages.length; i++) {
            itemImages[i].style.display = "none";
        }
        itemImages[itemImageIndex - 1].style.display = "block";
    } else {

    }

}

function toggleSecPreview(element) {
    var parentSecDiv = element.parentElement.parentElement;
    var childTextArea = parentSecDiv.querySelector('.secDivTextArea');
    var secText = childTextArea.value;
    var previewDiv = parentSecDiv.querySelector('.secPreview');
    var slidesDiv = previewDiv.querySelector('.slides');

    if (previewDiv.style.display != "none") {

        childTextArea.style.display = "block";
        childTextArea.value = slidesDiv.innerHTML;
        previewDiv.style.display = "none";
        return;
    }
    previewDiv.style.display = "block";
    childTextArea.style.display = "none";
}

function gotoNextTab(elem) {

    var parent = elem.parentElement.parentElement.parentElement;
    var tablinks = parent.querySelectorAll('.shopTablinks');
    var tabcontent = parent.querySelectorAll('.shopTabcontent');

    for (i = 0; i < tablinks.length; i++) {
        if (tablinks[i].classList.contains("active")) {

            tablinks[i].classList.remove("active");
            tabcontent[i].style.display = "none";
            tablinks[i + 1].classList.add("active");
            tabcontent[i + 1].style.display = "block";
            break;
        }

    }


}
function openShopTab(evt, shopTabId) {
    var i, tabcontent, tablinks;

    elem = evt.currentTarget;
    parent = elem.parentElement.parentElement;

    //tabcontent = document.getElementsByClassName("shopTabcontent");
    tabcontent = parent.querySelectorAll('.shopTabcontent');
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }



    //tablinks = document.getElementsByClassName("shopTablinks");
    tablinks = parent.querySelectorAll('.shopTablinks');
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }



    //document.getElementById(shopTabId).style.display = "block";
    parent.querySelector("#" + shopTabId).style.display = "block";
    evt.currentTarget.className += " active";

    if (shopTabId == "addImages") {
        var parentDiv = evt.currentTarget.parentElement.parentElement.parentElement;
        var img_list = parentDiv.querySelectorAll('.myitemImages'); // returns NodeList
        var img_array = [...img_list]; // converts NodeList to Array

        var newHTML = "<label class='informationBox'>Add/remove item images using the buttons below</label>";
        img_array.forEach(img => {
            newHTML = newHTML + '<div class="filteredItmImgContainerDiv"> <img class="filteredItmImgCls"  src="' + img.src + '">  <button class="deleteDiv" onclick="deleteCurrentComponent(this)"></button></div>';

        });
        parentDiv.querySelector('.existingItmImages').innerHTML = newHTML;
    }

    if (shopTabId == "deleteItem") {

        deleteItem(evt.currentTarget.parentElement.parentElement.parentElement.parentElement);

    }

    scrollElementToTopOfScreenInstantly(evt.currentTarget.parentElement.parentElement.parentElement);

    // $('html, body').animate({
    //     scrollTop: evt.currentTarget.parentElement.offset().top - 40        
    // }, 100);
}

function scrollElementToTopOfScreenInstantly(elem) {
    elem.scrollIntoView({ behavior: "instant", block: "start" });
    //elem.scrollIntoView({ behavior: "instant", block: "start", inline: "nearest" });

}


function scrollElementToTopOfScreenSmoothly(elem) {
    elem.scrollIntoView({ behavior: "smooth", block: "start" });
    //elem.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });

}

function scrollElementAlignToTop(elem) {
    elem.scrollIntoView();
}

function scrollElementToTopWithOffset(elem, yOffset) {
    const y = elem.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: 'smooth' });
}

async function deleteItem(elem) {

    const confirm = await ui.userConfirmation('Are you sure you want delete the item?');

    if (confirm) {
        //var parentDiv = elem;

        elem.parentNode.removeChild(elem);

        //parentDiv.innHTML = "";
        //parentDiv.style.display = "none";
    }

}
function deselectOtherInputCheckBox(elem) {
    //elem.checked = false;

    parent = elem.parentElement.parentElement.parentElement;
    var allInputCheckBoxes = parent.querySelectorAll("input");
    for (i = 0; i < allInputCheckBoxes.length; i++) {
        if (allInputCheckBoxes[i] != elem) {
            allInputCheckBoxes[i].checked = false;
        }
    }
}
function showStoreAvailDiv(elem) {
    deselectOtherInputCheckBox(elem);
    parent = elem.parentElement.parentElement.parentElement;

    if (elem.checked) {
        parent.querySelector('.storeAvail').style.display = "block";
    } else {
        parent.querySelector('.storeAvail').style.display = "none";
    }
}

function showStoreHrsDiv(elem) {
    deselectOtherInputCheckBox(elem);
    parent = elem.parentElement.parentElement.parentElement;

    if (elem.checked) {
        parent.querySelector('.storeHrDivCls').style.display = "block";
    } else {
        parent.querySelector('.storeHrDivCls').style.display = "none";
    }
}

function showStoreAddrDiv(elem) {
    deselectOtherInputCheckBox(elem);
    parent = elem.parentElement.parentElement.parentElement;

    if (elem.checked) {
        parent.querySelector('.storeAddr').style.display = "block";
    } else {
        parent.querySelector('.storeAddr').style.display = "none";
        return;
    }
}

function showStoreLocationDiv(elem) {
    deselectOtherInputCheckBox(elem);
    parent = elem.parentElement.parentElement.parentElement;

    if (elem.checked) {
        parent.querySelector('.storeOnMap').style.display = "block";
    } else {
        parent.querySelector('.storeOnMap').style.display = "none";
        return;
    }

    (() => {

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(success, error);
        } else {
            alert("Geolocation is not supported by your browser");
        }

        function success(position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            getMap(latitude, longitude);
            localStorage.setItem("latitude", latitude);
            localStorage.setItem("longitude", longitude);
        }

        function error() {
            alert("Unable to retrieve location");
        }

        function getMap(latitude, longitude) {
            const map = L.map("storeMapDivId").setView([latitude, longitude], 5);
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
            L.marker([latitude, longitude]).addTo(map);
        }

    })();
}


function getCookie(c_name) {
    var c_value = document.cookie;
    var c_start = c_value.indexOf(" " + c_name + "=");
    if (c_start == -1) {
        c_start = c_value.indexOf(c_name + "=");
    }
    if (c_start == -1) {
        c_value = null;
    }
    else {
        c_start = c_value.indexOf("=", c_start) + 1;
        var c_end = c_value.indexOf(";", c_start);
        if (c_end == -1) {
            c_end = c_value.length;
        }
        c_value = unescape(c_value.substring(c_start, c_end));
    }
    return c_value;
}

function logCommon(msg) {
    //console.log("At " + new Date().toLocaleString() + " from common-functions.js " + msg )
}
