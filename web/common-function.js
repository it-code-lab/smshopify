/*jshint strict:false, node:false */
/*exported run_tests, read_settings_from_cookie, beautify, submitIssue, copyText, selectAll, clearAll, changeToFileContent*/

/*
https://javascript-minifier.com/ 
*/
let the = {
    // use_codemirror: !window.location.href.match(/without-codemirror/),
    // beautifier_file: window.location.href.match(/debug/) ? 'beautifier' : './beautifier.min',
    // beautifier: null,
    // beautify_in_progress: false,
    // editor: null, // codemirror editor

    // codetext: null, // SM:Added
    // commentedCodePosArr: null, // SM:Added
    // codeLanguage: null, // SM:Added
    // codeLanguageRowId: null, // SM:Added
    // languageListPopulated: null, // SM:Added
    // selectedCodeId: null, // SM:Added
    // languageOverridden: null, //SM:Added
    // newProjectContent: [], //SM:Added
    uploadedFiles: null, //SM:Added
    //idOfProjectToUpdate: null, //SM:Added
    captcha: null, //SM:Added
    //LanguageHelpCodeAndIds_LclJson: null, //SM:Added
    //filelvlhelp: null,
    smusr: false,
    hosturl: '/bizzlistings',
    newImageName: '',


};

let itemImageIndex = 1;
let last_focused_div_id;

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

let ratingStars = '<div class="rateStar"> <input type="radio" id="star5" name="rate" value="5" /><label for="star5" title="text">5 stars</label> <input type="radio" id="star4" name="rate" value="4" /><label for="star4" title="text">4 stars</label> <input type="radio" id="star3" name="rate" value="3" /><label for="star3" title="text">3 stars</label> <input type="radio" id="star2" name="rate" value="2" /><label for="star2" title="text">2 stars</label> <input type="radio" id="star1" name="rate" value="1" /><label for="star1" title="text">1 star</label> </div>';

let nextShopTabBtnDiv = "<div class='nextShopTabBtnDiv'> <button class='button_type2 width_100px' onclick='gotoNextTab(this)'>Next</button></div>"
let allowTogglePreview = "<button class='togglePreviewBtn' onclick='toggleSecPreview(this)'> Toggle Preview </button>";
let showBannerOptionsBtn = "<button onclick='showBannerOptions(this)'> Design Options </button>";
let showColorAndImageOptionsBtn = "<button onclick='showColorAndImage(this)'> Customizations </button>";

let shopOpeningHr = '<section class="storeOpeninghours"><div class="storeOpeninghourscontent section" contenteditable="true">   <div class="header">    <h2>Opening hours</h2>   </div>    <table class="opening-hours-table">  <tr id="MondayStoreHrId"> <td>Monday</td><td>09:00 AM</td> <td>-</td><td>08:00 PM</td>   </tr>  <tr id="TuesdayStoreHrId"> <td>Tuesday</td><td>09:00 AM</td> <td>-</td><td>08:00 PM</td>   </tr>  <tr id="WednesdayStoreHrId"> <td>Wednesday</td><td>09:00 AM</td> <td>-</td><td>08:00 PM</td>   </tr>  <tr id="ThursdayStoreHrId"> <td>Thursday</td><td>09:00 AM</td> <td>-</td><td>08:00 PM</td>   </tr>  <tr id="FridayStoreHrId"> <td>Friday</td><td>09:00 AM</td> <td>-</td><td>08:00 PM</td>   </tr>  <tr id="SaturdayStoreHrId"> <td>Saturday</td><td>09:00 AM</td> <td>-</td><td>08:00 PM</td>   </tr>  <tr id="SundayStoreHrId"> <td>Sunday</td><td>10:00 AM</td> <td>-</td><td>05:00 PM</td>   </tr>   </table></div></section>';

let shopOpeningHrCheckBox = "<label class='informationBox fontsize_14px'>To display the store hours, select the options below. You can update the daily hours</label>"
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
    + '<div id="availabilityDivId" contenteditable="true" data-text="Enter Availability Details Here. (Max 200 characters)" class="storeAvail displayNone"></div>';

let shopLocationCheckBox = "<label class='informationBox fontsize_14px'>Provide your location information so that the interested shoppers can contact you.</label>"
    + '<div class="checkbox-wrapper-21">'
    + '<label class="control control--checkbox">'
    + 'Display Location on Map'
    + '<input class="showStoreLoc" type="checkbox" onclick="showStoreLocationDiv(this);"/>'
    + '<div class="control__indicator"></div>'
    + '</label>'
    + '</div>'
    + '<div id="storeMapDivId" class="storeOnMap displayNone"></div>'

    + '<div class="checkbox-wrapper-21 displayNone">'
    + '<label class="control control--checkbox ">'
    + 'Display Location From Address'
    + '<input class="showStoreAddr" type="checkbox" onclick="showStoreAddrDiv(this);"/>'
    + '<div class="control__indicator"></div>'
    + '</label>'
    + '</div>'
    + '<div id="storeAddrDivId" class="storeAddr">'
    + '<div class="addresscontainer" id="addresscontainerDiv"> <div class="addressform"> <label class="addressfield"> <span class="addressfield__label" for="shopaddressline1">Address</span>'
    + '<div contenteditable="true" class="addressfield__input"  id="shopaddressline1"> </div> </label>  <label class="addressfield"><span class="addressfield__label" for="shopcity">City/Town/Village</span> '
    + '<div contenteditable="true" class="addressfield__input"  id="shopcity"> </div> </label>  <label class="addressfield"><span class="addressfield__label" for="shopstate">State</span> '
    + '<div contenteditable="true" class="addressfield__input"  id="shopstate"> </div> </label>  <label class="addressfield"><span class="addressfield__label" for="shopcountry">Country</span> '
    + '<div contenteditable="true" class="addressfield__input"  id="shopcountry"> </div> </label>  <label class="addressfield"> <span class="addressfield__label" for="shoppostalcode">Postal code</span>'
    + '<div contenteditable="true" class="addressfield__input"  id="shoppostalcode"> </div> </label> </div>  </div>'
    + '</div>';


let shopItemTabOptions = '<div class="shopTab">'
    + '<button class="shopTablinks" onclick="openShopTab(event, ' + "'" + 'addImages' + "'" + ')">Add Images</button>'
    + '<button class="shopTablinks" onclick="openShopTab(event, ' + "'" + 'itmNameDiv' + "'" + ')">Name</button>'
    + '<button class="shopTablinks" onclick="openShopTab(event, ' + "'" + 'itmDescDiv' + "'" + ')">Description</button>'
    + '<button class="shopTablinks" onclick="openShopTab(event, ' + "'" + 'itemPrice' + "'" + ')">Price</button>'
    + '<button class="shopTablinks" onclick="openShopTab(event, ' + "'" + 'CloseItemCust' + "'" + ')">Close</button>'
    + '<button class="shopTablinks red_font" style="float:right" onclick="openShopTab(event, ' + "'" + 'deleteItem' + "'" + ')">Delete</button>'
    + '</div>';


let itemImagesDiv = '<div class="itemImageshow-container">'

    + '<div class="itmImgContainer">'

    + '<img class="myitemImages" style="display:block" src="/bizzlistings/images/addImages.png" >'

    + '</div>'

    + '<a class="prevItmImg navbtn" onclick="plusitemImages(-1, this)">❮</a>'
    + '<a class="nextItmImg navbtn" onclick="plusitemImages(1, this)">❯</a>'
    + '</div>';

let addItmImagesDiv = ""
    + "<div class='existingItmImages'> </div>"
    + "<input type='text' style='display:none; width:95%; margin:auto;'  value=''>"
    + "<br><img id='replace-img-banner' src= '" + the.hosturl + "/img/" + "' style='width: 400px; height: 200px; background-color: white;' onerror='this.style.display= " + '"none"' + "' alt='select image'  />"
    + "<div style='width: 100%'><br><label class='button_type2 width_150px margintop_10px'><input type='file' class='image-replace-banner displayNone' data-itemid='banner' data-fileelementid='image-replace-' data-uploadimgbtnid='replaceBannerImg' data-imageelementid='replace-img-' accept='image/png,  image/jpeg' onchange='addImageToItemList(event)'><i class='fa fa-cloud-upload'></i>Upload Image</label>"
    + "<br><label  style='color: #cc0000; font-size: 14px; min-height: 20px;'></label>"
    + "<input id='replaceBannerImg' class='saveItmImgChangesBtn button_type2 width_150px' type='button' value='Save' data-itemid='banner'  data-saveasnameelementid='image-' data-fileelementid='image-replace-'  onclick='saveItemImgChanges(event);'  > </div>";


let itemCustomizations = ''

let shopItemTabContentDivs = '<div id="addImages" class="shopTabcontent">'
    + addItmImagesDiv
    + nextShopTabBtnDiv
    + '</div>'

    + '<div id="itmNameDiv" class="shopTabcontent">'
    + '<div class="itemNameCls" contenteditable="true" data-text="Enter Item Name Here. (Max 200 characters)"></div>'
    + nextShopTabBtnDiv
    + '</div>'

    + '<div id="itmDescDiv" class="shopTabcontent">'
    + "<label class='informationBox fontsize_14px'>Enter the details of the item/service</label>"
    + '<div class="itemDescriptionCls" contenteditable="true" data-text="Enter Item Description Here. (Max 500 characters)"></div>'
    + nextShopTabBtnDiv
    + '</div>'

    + '<div id="itemPrice" class="shopTabcontent">'
    + '<div class="itemPriceCls" contenteditable="true" data-text="Enter Item Price. (Max 45 characters)"></div>'
    + nextShopTabBtnDiv
    + '</div>'

    + '<div id="CloseItemCust" class="shopTabcontent">'
    + '</div>'

    + '<div id="deleteItem" class="shopTabcontent">'
    + '</div>';

let colorList = ["#000000", "#ffffff","#00ffff", "#34568B", "#FF6F61", "#6B5B95", "#88B04B", "#F7CAC9", "#92A8D1", "#955251", "#B565A7", "#009B77", "#D65076", "#45B8AC", "#EFC050", "#5B5EA6", "#DFCFBE", "#55B4B0", "#98B4D4", "#C3447A", "#bb00bb", "#ff0000", "#888888", "#417203", "#934f4d", "#7E909A", "#A5D8DD", "#EA6A47", "#0091D5", "#B3C100", "#4CB5F5", "#6Ab187", "#DBAE58", "#488A99", "#934f4d"];

let revealSecColor = getSecColors();

function getItemButtons() {
    let tempHTML = "";
    tempHTML = tempHTML + "<div class='itemBtnsDiv'>";
    tempHTML = tempHTML + "<div class='itmbtn'  onclick='markFavourite(this)'><i class='fa fa-heart color_light_pink '></i></div>"; //color_red_heart, color_light_pink
    tempHTML = tempHTML + "<div class='itmbtn'  onclick='openItemChat(this)'><i class='fa fa-commenting font_size_24px'></i></div>";
    tempHTML = tempHTML + "<div class='itmbtn' onclick='provideReview(this)'><i class='fa fa-star color_yellow_star'></i></div>";
    tempHTML = tempHTML + "<div class='itmbtn' onclick='reportItem(this)'><i class='fa fa-warning color_brown'></i></div>";
    tempHTML = tempHTML + "</div>";
    return tempHTML;
}

function getSecColors() {
    let retHTML = "<label class='informationBox fontsize_14px'>If you want to change the color in the banner above, click on the color below</label> ";
    colorList.forEach((colorStr) => retHTML = retHTML + "<div class='colorPickerDiv hover_shadow2' data-clr='" + colorStr + "' style='background-color:" + colorStr + "' onclick='updateParentBGColor(this)' ></div>");
    return retHTML;
}
let textDivColorCtl = getTextColors();

function getTextColors() {
    let retHTML = "<label class='informationBox fontsize_14px'>If you want to change the color in the Banner above, click on the color below</label> ";
    colorList.forEach((colorStr) => retHTML = retHTML + "<div class='colorPickerDiv hover_shadow2' data-clr='" + colorStr + "' style='background-color:" + colorStr + "' onclick='updateTextDivColor(this)' ></div>");
    retHTML = retHTML + "<div class='width_100pc clear_both margintop_15px'>Transparency:</div>" + '<input type="range" min="0" max="100" value="100" oninput="changeTransparency()" onchange="changeTransparency()" class="transparencySliderCls" id="transparencySlider">'
    return retHTML;
}

let secTranition = "<select class='transitionSelect' onchange='updateParentTransition(this)' >"
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

let replaceBannerImg = "<label class='informationBox fontsize_14px'>If you want to change the image in the banner above, use the button below to replace image</label>"
    + "<input type='text'  style='display:none; width:95%; margin:auto;'  value=''>"
    + "<br><img id='replace-img-banner' src= '" + the.hosturl + "/img/" + "' style='width: 400px; height: 200px; background-color: white;' onerror='this.style.display= " + '"none"' + "' alt='select image'  />"
    + "<br><label class='button_type2 width_200px margintop_10px'><input type='file' class='image-replace-banner displayNone' data-itemid='banner' data-uploadimgbtnid='replaceBannerImg' data-imageelementid='replace-img-' accept='image/png,  image/jpeg' onchange='showImage(event)'><i class='fa fa-cloud-upload'></i>Upload Image</label>"
    + "<br><label  style='color: #cc0000; font-size: 14px; min-height: 20px;'></label>"
    + "<input id='replaceBannerImg' class='displayNone button_type2 width_200px' type='button' value='Replace Banner Image' data-itemid='banner'  data-saveasnameelementid='image-' data-fileelementid='image-replace-'  onclick='UploadAndReplaceBannerImg(event);'  >";


let mediaSection = "";

let addItemImg = "Add Images: <input type='text' name='txt' value='' onchange='updateParentBGImage(this)'>"
    + "<div class='selectedImg'></div>";


function any(a, b) {
    return a || b;
}

function setLastFocusedDivId(id) {
    last_focused_div_id = id;
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

    let currentFocus;

    inp
        .addEventListener(
            "input",
            function (e) {
                //document.getElementById("SVDReviewDiv").style.display = "none";
                let a, b, val = this.value;
                let strPos;
                /*close any already open lists of autocompleted values*/
                //closeAllLists();
                if (!val) {
                    closeAllLists();
                    return false;
                }

                let tf = JSON.parse(sessionStorage.getItem("itemsList"));

                //SM: DO NOT DELETE: options to 3 char
                if (val.length < 2) {
                    closeAllLists();
                    return false;
                }

                let elemnt = this;
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
                    for (let i = 0; i < arr.length; i++) {
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
                            let searchText = val.toUpperCase()
                            let rows = JSON.parse(tf);
                            rows = rows.filter(function (entry) {
                                return (entry.title.toUpperCase() === arr[i].toUpperCase() && entry.discontinue == "0") && (entry.title.toUpperCase().includes(searchText)
                                    || entry.category.toUpperCase().includes(searchText)
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
        let x = document.getElementById(this.id + "autocomplete-list");
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
        for (let i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }

    function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        let x = document.getElementsByClassName("autocomplete-items");

        for (let i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }

    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });

    document.getElementById('item-search-box').dataset.dropdownset = "y";

    //console.log("Autocomplete End Time = " + new Date());
}



function getItemsList() {

    let tags = sessionStorage.getItem("itemsList")
    if (tags != null) {
        if ((tags != "") && (tags != "null")) {

            setTimeout(() => {
                populateItemDropDown();
            }, 10);

            setTimeout(() => {
                populateitemsDropDownDisplay();
           }, 10);
            
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
            //let tags = JSON.parse(response);
            //sessionStorage.setItem("LanguageHelpCodeAndIds", JSON.stringify(response));
            //console.log(response);

            //the.LanguageHelpCodeAndIds_LclJson = response;

            sessionStorage.setItem("itemsList", JSON.stringify(response));
            setTimeout(() => {
                populateItemDropDown();
            }, 10);

            setTimeout(() => {
                populateitemsDropDownDisplay();
           }, 10);
        },
        error: function (xhr, status, error) {
            console.log(error);
            console.log(xhr);
        }
    });
}

function getCategoryList() {

    let tags = sessionStorage.getItem("categoryList")
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

    if ((document.getElementById("dropDownItmCatgListId").innerHTML).trim() != ""){
        return;
    }
    let tf = JSON.parse(sessionStorage.getItem("itemsList"));
    let rows = JSON.parse(tf);
    rows = rows.filter(function (entry) {
        return entry.discontinue == "0";
    });
    let innHTML = "";

    for (let i = 0; i < rows.length; i++) {
        if (i == 0) {
            innHTML = innHTML + "<a onclick='showcategoryAfterURLHistUpd(" + '"' + rows[i].category + '"' + "); return false; ' href= '" + the.hosturl + "/items/" + rows[i].category + "'>"+ rows[i].category +"</a>";
        }else if (rows[i].category != rows[i-1].category){
            innHTML = innHTML + "<a onclick='showcategoryAfterURLHistUpd(" + '"' + rows[i].category + '"' + "); return false; ' href= '" + the.hosturl + "/items/" + rows[i].category + "'>"+ rows[i].category +"</a>";
        } 
    }
    document.getElementById("dropDownItmCatgListId").innerHTML = innHTML;
}

function showcategoryAfterURLHistUpd(category){

    //let myUrl = window.location.protocol + "//" + window.location.host + "/items/" + category;

    let path = window.location.pathname;
    let myUrl = path.substring(0, path.indexOf('/', path.indexOf('bizzlistings')) + 1) + "items/" + category;


    const nextURL = myUrl;
    const nextTitle = 'Code Helper';
    const nextState = {
        additionalInformation: 'Updated the URL with JS'
    };

    // This will create a new entry in the browser's history, without reloading
    window.history.pushState(nextState, nextTitle, nextURL);

    showcategory(category);
}

function getEnvironmentSetUpDetails() {

    let tags = JSON.parse(sessionStorage.getItem("EnvironmentSetUpDetails"));
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
            //let tags = JSON.parse(response);
            sessionStorage.setItem("EnvironmentSetUpDetails", JSON.stringify(response));
        },
        error: function () {
            //alert("error");
        }
    });
}

function getHowToVideos() {

    let tags = JSON.parse(sessionStorage.getItem("HowToVideos"));
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

function hideDiv(divId) {
    document.getElementById(divId).style.display = "none";
}

function removeActiveClassFromNavLinks(){
    let navlinks = document.querySelectorAll(".navLink");

    for (let i = 0; i < navlinks.length; i++) {
        navlinks[i].classList.remove("active");
    }
}

function updateCommonDivsToDisplayNone(){
    document.getElementById("loginDivId").style.display = "none";
    document.getElementById("contactusDivId").style.display = "none";
    document.getElementById("howtoDivId").style.display = "none";
    document.getElementById("homeDivId").style.display = "none";

    document.getElementById("itemDivId").style.display = "none";
    document.getElementById("itemListDivId").style.display = "none";
    document.getElementById("itemEditDivId").style.display = "none";
}

function Show(pageName) {

    if (onMobileBrowser()) {
        let x = document.getElementById("myTopnav");
        x.className = "topnav";

    }

    updateCommonDivsToDisplayNone();

    //let myUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + "?target=" + pageName;

    let path = window.location.pathname;
    let myUrl = path.substring(0, path.indexOf('/', path.indexOf('bizzlistings')) + 1) + "?target=" + pageName;

    const nextURL = myUrl;
    const nextTitle = 'Code Helper';
    const nextState = {
        additionalInformation: 'Updated the URL with JS'
    };

    // This will create a new entry in the browser's history, without reloading
    window.history.pushState(nextState, nextTitle, nextURL);


    removeActiveClassFromNavLinks();

    //populateLanguages("helpTopics-lang-box");

    x = document.getElementById(pageName + "LinkId");
    x.className += " active";
   
    if (pageName == "item") {
        document.getElementById("itemDivId").style.display = "none";

        document.getElementById("itemListDivId").style.display = "block";
        document.getElementById("itemListDivId").style.width = "100%";
        populateItemsList();
        $(".cardsContainerDivClassPadd").css("height", "200px");

    } else if (pageName == "login") {

        document.getElementById("loginDivId").style.display = "block";

        document.getElementById("loginSecDivId").style.display = "block";
        document.getElementById("registerSecDivId").style.display = "none";
        document.getElementById("forgotPasswordSecDivId").style.display = "none";
        document.getElementById("accActivatedDivId").style.display = "none";
        document.getElementById("forgotPWDivId").style.display = "none";

        document.getElementById("loginerrormsg").innerHTML = "";

        //showHelpDivMessage("Login to add or make updates to the help scan codes");

    } else if (pageName == "contactus") {
        document.getElementById("contactusDivId").style.display = "block";
        document.getElementById("contactuserrormsg").innerHTML = "";


        refreshCaptcha();

    } else if (pageName == "howto") {
        document.getElementById("bgSVGId").style.display = "none";
        document.getElementById("contactusDivId").style.display = "none";
        document.getElementById("howtoDivId").style.display = "block";
        document.getElementById("howtoDivId").style.width = "95%";
        listVideos();


    } else if (pageName == "home") {
        document.getElementById("contactusDivId").style.display = "none";
        document.getElementById("howtoDivId").style.display = "none";
        document.getElementById("homeDivId").style.display = "block";
        document.getElementById("homeDivId").style.width = "100%";
        document.getElementById("bgSVGId").style.display = "block";
        //document.getElementById("mainContainer").style.width = "100%";
    } else if (pageName == "mystore") {
        myStore();
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

    let tf = JSON.parse(sessionStorage.getItem("HowToVideos"));

    if (tf == null) {
        return;
    }
    let rows = JSON.parse(tf);

    if (rows.length < 2) {
        return;
    }
    let innerHTML = '';

    innerHTML = innerHTML + "<div class='videoListContainer'>";

    innerHTML = innerHTML + '<div id="prjSelectionMsg" style=" padding: 5px; text-align: justify; text-justify: inter-word; border: 1px solid #ccc; color: #f1f1f1;background: rgba(9, 84, 132, 1); margin-Bottom: 0px">How to videos</div>';



    for (let i = 0; i < rows.length; i++) {
        let description = rows[i].description;
        let url = rows[i].url;

        innerHTML = innerHTML + "<div class='videoDescription'>" + description + "</div> <div class='videoIframeDiv'><iframe class='videoIframe' src= '" + url + "'> </iframe>"
    }
    innerHTML = innerHTML + "</div>";

    document.getElementById("howtoDivId").innerHTML = innerHTML;

}

function showAdditionalMenuItemsForLoggedIn(){
    document.getElementById("logoutLinkId").style.display = "block";
    document.getElementById("myfavoritesLinkId").style.display = "block";
    document.getElementById("mychatLinkId").style.display = "block";
}

function hideMenuItemsForLoggedOut(){
    document.getElementById("logoutLinkId").style.display = "none";
    document.getElementById("myfavoritesLinkId").style.display = "none";
    document.getElementById("mychatLinkId").style.display = "none";
}

function checkURL() {
    let LocationSearchStr = location.search;
    let find = '%20';
    let re = new RegExp(find, 'g');
    let pageName = "";
    let path = window.location.pathname;

    LocationSearchStr = LocationSearchStr.replace(re, ' ');

    if (LocationSearchStr.indexOf('passkey=') > 0) {
        let ar = LocationSearchStr.split('passkey=');
        let accountactivationkey = ar[1];
        activateAccount(accountactivationkey);
        return;
    }
    if (localStorage.getItem("cookieAccepted") == "y") {
        document.getElementById("cookie-div-id").style.display = "none"
    }

    let myCookie = getCookie("cookname");

    if (myCookie == null) {
        localStorage.setItem("userLoggedIn", "n");

        
        document.getElementById("loginLinkId").style.display = "block";

        hideMenuItemsForLoggedOut();

    } else {

        localStorage.setItem("userLoggedIn", "y");
        document.getElementById("loginLinkId").style.display = "none";

        showAdditionalMenuItemsForLoggedIn();

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

                    document.getElementById("loginLinkId").style.display = "block";

                    hideMenuItemsForLoggedOut();

                } else {
                    getFavoritesList();
                    getstoreinfo();
                }
            },
            error: function (xhr, status, error) {

            }
        });

    }



    if (path.indexOf('items/') > 0) {
        //let shoptitle = path.replaceAll("/antaksharee/lyrics/","");

        if (sessionStorage.getItem("itemsList") == null) {
            document.getElementById("loaderDivId").style.display = "block";
            setTimeout(function () {
                document.getElementById("loaderDivId").style.display = "none";
                checkURL();
            }, 500);
            return;
        }

        document.getElementById("loginDivId").style.display = "none";
        document.getElementById("contactusDivId").style.display = "none";
        document.getElementById("howtoDivId").style.display = "none";
        document.getElementById("homeDivId").style.display = "none";

        document.getElementById("itemDivId").style.display = "block";

        document.getElementById("itemEditDivId").style.display = "block";


        let itemstr = path.substring(path.indexOf("items/") + 6);

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
            fnGetItem(itemstr);
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
        let ar = LocationSearchStr.split('resetkey=');
        let passwordresetkey = ar[1];
        //resetPassword(passwordresetkey);
        sessionStorage.setItem("passwordresetkey", passwordresetkey);

        document.getElementById("contactusDivId").style.display = "none";
        document.getElementById("howtoDivId").style.display = "none";

        document.getElementById("loginDivId").style.display = "block";

        document.getElementById("loginerrormsg").innerHTML = "";

        //showHelpDivMessage("Login to add or make updates to the help scan codes");

        document.getElementById("loginSecDivId").style.display = "none";
        document.getElementById("forgotPWDivId").style.display = "block";
        return;
    }

    if (LocationSearchStr.indexOf('target=') > 0) {
        let ar = LocationSearchStr.split('target=');
        pageName = ar[1];
    }

    document.getElementById("contactusDivId").style.display = "none";
    document.getElementById("howtoDivId").style.display = "none";
    document.getElementById("homeDivId").style.display = "none";
    document.getElementById("itemDivId").style.display = "none";
    document.getElementById("itemListDivId").style.display = "none";
    document.getElementById("itemEditDivId").style.display = "none";

    try {
        let x = document.getElementById(pageName + "LinkId");
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

    } else if (pageName == "mystore") {

        if (localStorage.getItem("userLoggedIn") == "n") {

            sessionStorage.setItem("lastUrl", window.location.href);
            document.getElementById("loginDivId").style.display = "block";

            let x = document.getElementById("toastsnackbar");
            x.innerHTML = "Login to create or access your store";
            //x.className = "show";
            x.classList.add("show");
            setTimeout(function () { 
                //x.className = x.className.replace("show", ""); 
                x.classList.remove("show");
            }, 3000);

            return;
        } 
        myStore();
        return;
    }else if (pageName == "policy") {
        showPolicy();
        return;
    }else if (pageName == "projectscanner") {
        document.getElementById("bgSVGId").style.display = "none";
        populateStoredProjectList();
        if ((localStorage.getItem("userLoggedIn") == "y") && (localStorage.getItem("userLvl") == "9")) {
            document.getElementById("addNewProjBtnId").style.display = "block";
        }
        document.getElementById("projectscannerDivId").style.width = "100%";
        document.getElementById("helpDivMessage").innerHTML = '<i class="fa fa-info-circle" style="display:none; float: left;  position: absolute; top:35px; left: 10px; color:orange;" ></i>' + "Upload project files and click on the file to scan the code"
    } else if (pageName == "login") {
        document.getElementById("loginDivId").style.display = "block";

    } else if (pageName == "contactus") {

        document.getElementById("contactusDivId").style.display = "block";


        refreshCaptcha();

    } else if (pageName == "howto") {
        document.getElementById("bgSVGId").style.display = "none";

        document.getElementById("contactusDivId").style.display = "none";
        document.getElementById("howtoDivId").style.display = "block";
        document.getElementById("howtoDivId").style.width = "95%";
        listVideos();
    } else if (pageName == "item") {

        if (sessionStorage.getItem("itemsList") == null) {
            document.getElementById("loaderDivId").style.display = "block";
            setTimeout(function () {
                document.getElementById("loaderDivId").style.display = "none";
                checkURL();
            }, 500);
            return;
        }

        document.getElementById("contactusDivId").style.display = "none";
        document.getElementById("howtoDivId").style.display = "none";

        document.getElementById("itemDivId").style.display = "none";
        document.getElementById("itemEditDivId").style.display = "none";

        document.getElementById("itemListDivId").style.width = "100%";

        populateItemsList();

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

        document.getElementById("contactusDivId").style.display = "none";
        document.getElementById("howtoDivId").style.display = "none";
        //document.getElementById("itemDivId").style.width = "100%";
        document.getElementById("itemDivId").style.display = "none";
        document.getElementById("itemEditDivId").style.display = "none";

        document.getElementById("itemListDivId").style.width = "100%";

        //Likely request for store item display
        let storename = path.substring(path.indexOf(the.hosturl) + the.hosturl.length + 1);

        displayStore(storename);
        //populateItemsList();
        //document.getElementById("mainContainer").style.width = "100%";
        $(".cardsContainerDivClassPadd").css("height", "200px");
    } else if (pageName == "home") {
        document.getElementById("contactusDivId").style.display = "none";
        document.getElementById("howtoDivId").style.display = "none";
        document.getElementById("homeDivId").style.width = "100%";
        //document.getElementById("mainContainer").style.width = "100%";			
    }
}

function displayStore(storename) {

    let tf = JSON.parse(sessionStorage.getItem("itemsList"));
    let allRows = JSON.parse(tf);

    let storeRow = allRows.filter(function (entry) {
        let title = entry.title;
        let titleSpaceReplaced = title.replaceAll(' ', '-');
        return entry.discontinue == "0" && titleSpaceReplaced.toUpperCase() == storename.toUpperCase();
    });

    if (storeRow.length > 0) {
        document.getElementById("itemDivId").style.display = "block";
        fnGetItem(storeRow[0].category + "/" + storeRow[0].storename + "/" + storeRow[0].title);
    } else {
        document.getElementById("itemDivId").innerHTML = "Sorry. The requested page is not found.<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>"
        document.getElementById("itemDivId").style.display = "block";
    }
}

function fnGetItem(itemstr) {
    $.ajax({
        url: the.hosturl + '/php/process.php',
        type: 'POST',
        data: jQuery.param({
            usrfunction: "getItem",
            itemstr: itemstr
        }),
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        success: function (response) {

            document.getElementById("itemListDivId").style.display = "block";
            document.getElementById("itemEditDivId").style.display = "none";
            document.getElementById("itemDivId").style.display = "none";

            let tags = JSON.parse(response);
            if (tags[0].title == "Create My Store") {
                getCreateStore();
            } else if (tags[0].title != tags[0].storename) {
                getOneItemOfShop(tags);
                $(".cardsContainerDivClassPadd").css("width", "95%");
                $(".cardsContainerDivClassPadd").css("margin", "auto");
                $(".cardsContainerDivClassPadd").css("float", "none");
            } else {
                getFullShopDetails(tags, itemstr);
            }
        },
        error: function (xhr, status, error) {
            console.log("error");
            //console.log(xhr);
        }
    });
}

function getStoreURLMsg(){

    let storename = localStorage.getItem("storename");
    storename = storename.toLocaleLowerCase();
    storename = storename.replaceAll(" ", "-");
    let tempHTML = 'Store name is available. Your store site is going to be: <br><br>';
    tempHTML = tempHTML + window.location.protocol + "//" + window.location.host +
    window.location.pathname + storename ;
    tempHTML = tempHTML + '<br><br> If this looks good click on the button below create store banner. <br> <br>';
    tempHTML = tempHTML + '<button class="button_type1" onclick="showBanner()">Design Store banner</button>';
    
    return tempHTML;
}

function getCreateStore() {


    let title = "Create Store";
    let description = '<div id="div-shopName1-690541" contenteditable="true" data-bgcolor="#ccc" data-transition="zoom" data-autoanimate="" data-background="" data-backgroundiframe="" data-backgroundvideo="" class="secdiv" onmousedown="setLastFocusedDivId(this.id)"> <textarea class="secDivTextArea" onchange="updatePreviewDiv(this)">&lt;div class="storeNmChkDiv" contenteditable="false"&gt;&lt;input id="store-search-box" type="text" class="margin_5px" autocomplete="off" placeholder="Enter Your Store Name "&gt;'
    + '&lt;button  class="button_type1" onclick="searchStoreNameItem(); return false;"&gt;Check Availability&lt;/button&gt;'
    + '&lt;div class="storeNameNotAvailable displayNone scale-up-ver-top" style="animation-duration: 0.1"&gt;&lt;/div&gt;'
    + '&lt;div class="storeNameAvailable displayNone scale-up-ver-top" style="animation-duration: 0.1"&gt;Store name is available. &lt;button class="button_type1" onclick="showBanner()"&gt;Design Store banner&lt;/button&gt;&lt;/div&gt;'
    + '&lt;/div&gt;</textarea><div class="secPreview"><div contenteditable="true" class="revealDummy" style=" margin: 10px;"><div class="slides"><div class="storeNmChkDiv" contenteditable="false"><input id="store-search-box" type="text" class="margin_5px" autocomplete="off" placeholder="Enter Your Store Name ">'
    + '<button  class="button_type1" onclick="searchStoreNameItem(); return false;">Check Availability</button>'
    + '<div class="storeNameNotAvailable displayNone scale-up-ver-top" style="animation-duration: 0.1"></div>'
    + '<div class="storeNameAvailable displayNone scale-up-ver-top" style="animation-duration: 0.1">Store name is available. <button class="button_type1" onclick="showBanner()">Design Store banner</button></div>'
    + '</div></div></div></div><div class="hdMeDivCls" contenteditable="false"><button class="togglePreviewBtn" onclick="toggleSecPreview(this)"> Toggle Preview </button></div><button class="deleteDivInnImg" onclick="deleteCurrentComponent(this)"></button>  </div>';


    let newHTML = "";

    newHTML = newHTML + "<div classXX = 'shopContainer' >";

    //**********DO NOT DELETE********/
    // newHTML = newHTML +  '<a href ="' + itemUrl + '" class="itemTopLinkCls" ' + ' >' + "All Listings</a>" + " > " +
    //     '<a href ="' + categoryUrl + '" class="itemTopLinkCls"  >' + category + "</a>" + " > " +
    //     '<a href ="' + window.location.href + '" class="itemTopLinkCls"  >' + title + "</a>";
    // newHTML = newHTML + "<div classXX = 'shopContainerSub' > <h1 class='font_family_style1' > " + title + "</h1></div>";


    newHTML = newHTML + '<div classXX="shopDeltsNImg">';
    newHTML = newHTML + '<div classXX="shopDelts">' + "<div class = 'shopLyrics' >";

    newHTML = newHTML
        + '<div id="selectStoreTypeDivId"></div> <span id="storeSelectedDivId" class="displayNone newStoreTypeHdr slide-in-left fontsize_18px" style="animation-duration: 0.2">xyz</span> <div class="itemDescription displayNone">' + description + '</div>';

    newHTML = newHTML + "</div>" + "</div>";

    newHTML = newHTML + '<br><br><div class="bottomNavigationCls">' + "</div> <br> <br>";


    newHTML = newHTML + '<br><br><br><br><br><br><br><br><br>';
    document.getElementById("itemListDivId").style.display = "block";
    document.getElementById("itemListDivId").innerHTML = newHTML;

    let metaDesc = "Create your store and listings";

    let metaKey = "create, your store, yours page, listings";


    document.querySelector('meta[name="description"]').setAttribute("content", metaDesc);
    document.querySelector('meta[name="keywords"]').setAttribute("content", metaKey);
    //document.title = category + " " + subcategory + ". " + title ;
    document.title = "Create your store";

    sessionStorage.setItem("lastUrl", window.location.href);

    const structuredData = {
        "@context": "https://schema.org/",
        "@type": "WebSite",
        "name": title,
        "url": "https://bizzlistings.com/" ,
        "datePublished": "2022-07-10",
        "description": metaDesc,
        "thumbnailUrl": "https://bizzlistings.com/images/banner.png"
    };

    let jsonLdScript = document.querySelector('script[type="application/ld+json"]');
    jsonLdScript.innerHTML = JSON.stringify(structuredData);

    setTimeout(function () {
        populateStoreType("selectStoreTypeDivId");
    }, 10);



    $('html, body').animate({
        //scrollTop: $("#itemListDivId").offset().top - 40
        scrollTop: $("#itemListDivId").offset().top - 80
    }, 100);

}

function getOneItemOfShop(tags, itemstr) {

    let itemid = tags[0].itemid;
    let category = tags[0].category;
    let categoryseq = tags[0].categoryseq;
    let subcategory = tags[0].subcategory;
    let versionseq = tags[0].versionseq;
    let title = tags[0].title;
    let titleseq = tags[0].titleseq;
    //let shortdescription = tags[0].shortdescription;
    let description = tags[0].description;
    let city_state_country = tags[0].city_state_country;
    let keywords = tags[0].keywords;
    let discontinue = tags[0].discontinue;


    let path = window.location.pathname;
    let myUrl = path.substring(0, path.indexOf('/', path.indexOf('bizzlistings')) + 1)

    //START: Find the next item to be put at the bottom of the page

    let tf = JSON.parse(sessionStorage.getItem("itemsList"));

    let nextItemTitle = "";
    let nextItemTitleURL = "";
    let allRows = JSON.parse(tf);

    let rows = allRows.filter(function (entry) {
        return entry.discontinue == "0" && entry.category == category;
    });

    let categorySpaceReplaced = category.replaceAll(" ", "-");

    //let path = window.location.pathname;

    let storeRow = allRows.filter(function (entry) {
        return entry.discontinue == "0" && entry.title == tags[0].storename;
    });

    let itemStr = categorySpaceReplaced.toLowerCase() + "/" + storeRow[0].storename.replaceAll(" ", "-") + "/" + storeRow[0].title.replaceAll(" ", "-");
    let storeStr = categorySpaceReplaced.toLowerCase() + "/" + storeRow[0].storename.replaceAll(" ", "-") + "/" + storeRow[0].storename.replaceAll(" ", "-");

    let itemUrl = path.substring(0, path.indexOf('/', path.indexOf('bizzlistings')) + 1) + "?target=item";
    let categoryUrl = path.substring(0, path.indexOf('/', path.indexOf('bizzlistings')) + 1) + "items/" + categorySpaceReplaced;
    let storeUrl = path.substring(0, path.indexOf('/', path.indexOf('bizzlistings')) + 1) + storeRow[0].title.replaceAll(" ", "-");

    let newHTML = "<div classXX = 'shopContainer' ><div class='display_block marginbottom_12px'>" +
        '<a class="anchor_tag_btn1" onclick="Show('+ "'" + 'item' + "'" + '); return false;" href ="' + itemUrl + '" class="itemTopLinkCls" ' + ' >' + "All Listings</a>" + " ❯ " +
        '<a class="anchor_tag_btn1" onclick="showcategoryAfterURLHistUpd('+ "'" + category + "'" +'); return false;" href ="' + categoryUrl + '" class="itemTopLinkCls"  >' + category + "</a>" + " ❯ " +
        '<a class="anchor_tag_btn1" onclick="getItemAfterURLHistUpd('+ "'" + storeStr + "'" +'); return false;" href ="' + storeUrl + '" class="itemTopLinkCls"  >' + storeRow[0].title + "</a>" + " ❯ " +
        '<a class="anchor_tag_btn1" onclick="getItemAfterURLHistUpd('+ "'" + itemStr + "'" +'); return false;" href ="' + window.location.href + '" class="itemTopLinkCls"  >' + title + "</a></div>";
    //END - Navigation Links

    //newHTML = newHTML + "<div classXX = 'shopContainerSub' > <h1 classXX='shopContainerH1' > " + title + "</h1></div>";
    
    //***SM-DONOTDELETE-Maybe used later */
    //newHTML = newHTML + "<div classXX = 'shopContainerSub' >  <span class='newStoreTypeHdr slide-in-left display_block margintop_15px'>" + title + "</span></div>";
 
    //END - Item name Heading


    newHTML = newHTML + "<div class = 'shopLyrics' >" + "<div class = 'storeItemDivCls' >";

    newHTML = newHTML + getItemsHTML(tags);
    newHTML = newHTML + getShopLocationAndHours(storeRow);



    newHTML = newHTML + "</div></div></div>";
    //End1: storeItemDivCls
    //End2: shopLyrics
    //End3: shopContainer


    newHTML = newHTML + '<br><br><br><br><br><br><br><br><br>';

    document.getElementById("itemListDivId").innerHTML = newHTML;

    //refreshCaptcha();

    //showcategory(category);
    //showAllShopItemsInLeftPane(storeRow[0].title);
    document.getElementById("itemEditDivId").style.display = "none";

    //START: Change the background color of the active item link 
    //let elemId = "itemDiv-" + itemid;
    //document.getElementById(elemId).style.backgroundColor = "orange";
    //END: Change the background color of the active item link

    let metaDesc = title + ", " + tags[0].itemdescription ;

    let metaKey = category + "," + subcategory + "," + title + "," + keywords;


    document.querySelector('meta[name="description"]').setAttribute("content", metaDesc);
    document.querySelector('meta[name="keywords"]').setAttribute("content", metaKey);
    //document.title = category + " " + subcategory + ". " + title ;
    document.title = tags[0].storename + " - " + title;

    sessionStorage.setItem("lastUrl", window.location.href);
    // if (localStorage.getItem("cookieAccepted") == "y"){
    //     document.getElementById("cookie-div-id").style.display = "none"
    // }

    const structuredData = {
        "@context": "https://schema.org/",
        "@type": "WebSite",
        "name": title,
        "url": "https://bizzlistings.com/" + itemstr,
        "datePublished": "2022-07-10",
        "description": metaDesc,
        "thumbnailUrl": "https://bizzlistings.com/images/banner.png"
    };

    let jsonLdScript = document.querySelector('script[type="application/ld+json"]');
    jsonLdScript.innerHTML = JSON.stringify(structuredData);


    $('html, body').animate({
        //scrollTop: $("#itemListDivId").offset().top - 40
        scrollTop: $("#itemListDivId").offset().top - 80
    }, 100);


    setTimeout(function () {
        hideImageNavBtns();
    }, 0);

    setTimeout(function () {
        colorFavoriteItems();
    }, 10);

    setTimeout(function () {
        disableImageClickAction();
    }, 20);

    setTimeout(function () {

        let x = document.getElementsByClassName("storeOpeninghourscontent");
        for (let i = 0; i < x.length; i++) {
                x[i].setAttribute("contenteditable", false);
        }
        updateStatus();

    }, 50);
}

function getFullShopDetails(tags, itemstr) {

    let itemid = tags[0].itemid;
    let itemuid = tags[0].itemuid;
    let category = tags[0].category;
    let categoryseq = tags[0].categoryseq;
    let subcategory = tags[0].subcategory;
    let versionseq = tags[0].versionseq;
    let title = tags[0].title;
    let titleseq = tags[0].titleseq;
    let shortdescription = tags[0].shortdescription;
    let description = tags[0].description;
    let city_state_country = tags[0].city_state_country;
    let keywords = tags[0].keywords;
    let discontinue = tags[0].discontinue;


    let path = window.location.pathname;
    let myUrl = path.substring(0, path.indexOf('/', path.indexOf('bizzlistings')) + 1)

    //START: Find the next item to be put at the bottom of the page

    let tf = JSON.parse(sessionStorage.getItem("itemsList"));

    let nextItemTitle = "";
    let nextItemTitleURL = "";
    let allRows = JSON.parse(tf);

    let rows = allRows.filter(function (entry) {
        return entry.discontinue == "0" && entry.category == category;
    });

    //let path = window.location.pathname;

    let storeItems = allRows.filter(function (entry) {
        return entry.discontinue == "0" && entry.storename == tags[0].storename && entry.title != tags[0].storename;
    });


    let itemUrl = path.substring(0, path.indexOf('/', path.indexOf('bizzlistings')) + 1) + "?target=item";
    let categoryUrl = path.substring(0, path.indexOf('/', path.indexOf('bizzlistings')) + 1) + "items/" + category;

    let storeUrl = path.substring(0, path.indexOf('/', path.indexOf('bizzlistings')) + 1) + tags[0].storename.replaceAll(" ", "-");

    //let itemStr = category.replaceAll(" ", "-") + "/" + tags[0].storename.replaceAll(" ", "-") + "/" + title.replaceAll(" ", "-");
    let storeStr = category.replaceAll(" ", "-") + "/" + tags[0].storename.replaceAll(" ", "-") + "/" + tags[0].storename.replaceAll(" ", "-");

    let newHTML = "<div classXX = 'shopContainer' ><div class='display_block marginbottom_12px'>" +
        '<a class="anchor_tag_btn1" onclick="Show('+ "'" + 'item' + "'" + '); return false;" href ="' + itemUrl + '" class="itemTopLinkCls" ' + ' >' + "All Listings</a>" + " ❯ " +
        '<a class="anchor_tag_btn1" onclick="showcategoryAfterURLHistUpd('+ "'" + category + "'" +'); return false;" href ="' + categoryUrl + '" class="itemTopLinkCls"  >' + category + "</a>" + " ❯ " +
        '<a class="anchor_tag_btn1" onclick="getItemAfterURLHistUpd('+ "'" + storeStr + "'" +'); return false;" href ="' + storeUrl + '" class="itemTopLinkCls"  >' + title + "</a></div>";

    //END - Navigation Links

    //newHTML = newHTML + "<div classXX = 'shopContainerSub' > <h1 classXX='shopContainerH1' > " + title + "</h1></div>";

    //***SM-DONOTDELETE-Maybe used later */
    //newHTML = newHTML + "<div classXX = 'shopContainerSub' > <span class='newStoreTypeHdr slide-in-left display_block margintop_15px'>" + title + "</span></div>";

    //END - Item name Heading

    newHTML = newHTML + "<div class = 'shopLyrics' >" + "<div class = 'storeItemDivCls' >";

    //Start: div class="slides"
    if (tags[0].bannerhtml != undefined) {
        if (tags[0].bannerhtml != "") {
            newHTML = newHTML
                + '<div class="slides slide-in-left" style="animation-delay: 0.2s">' + tags[0].bannerhtml + '</div>';
        }
    }

    if (tags[0].description != undefined) {
        if (tags[0].description != "") {
            newHTML = newHTML
                + '<div class="shopDescriptionCls bgcolor_8 padding_50px color_white">' + tags[0].description + '</div>';
        }
    }

    //End: div class="slides"

    newHTML = newHTML + getShopLocationAndHours(tags);

    //newHTML = newHTML + '<div class="fullwidthdummydiv bottom_shadow">&nbsp;</div>';

    newHTML = newHTML + getItemsHTML(storeItems);

    newHTML = newHTML + "</div></div></div></div></div>";
    //End1: storeItemDivCls
    //End2: shopLyrics
    //End3: shopContainer

    newHTML = newHTML + '<br><br><br><br><br><br><br><br><br>';

    document.getElementById("itemListDivId").innerHTML = newHTML;
    refreshCaptcha();

    //START: Change the background color of the active item link 

    // showcategory(category);
    // let elemId = "itemDiv-" + itemid;
    // document.getElementById(elemId).style.backgroundColor = "orange";

    //END: Change the background color of the active item link

    let metaDesc = tags[0].storename + "," + description;

    let metaKey = category + "," + subcategory + "," + title + "," + keywords;


    document.querySelector('meta[name="description"]').setAttribute("content", metaDesc);
    document.querySelector('meta[name="keywords"]').setAttribute("content", metaKey);
    //document.title = category + " " + subcategory + ". " + title ;
    document.title = title;

    sessionStorage.setItem("lastUrl", window.location.href);
    // if (localStorage.getItem("cookieAccepted") == "y"){
    //     document.getElementById("cookie-div-id").style.display = "none"
    // }

    const structuredData = {
        "@context": "https://schema.org/",
        "@type": "WebSite",
        "name": title,
        "url": "https://bizzlistings.com/" + itemstr,
        "datePublished": "2022-07-10",
        "description": metaDesc,
        "thumbnailUrl": "https://bizzlistings.com/images/banner.png"
    };

    let jsonLdScript = document.querySelector('script[type="application/ld+json"]');
    jsonLdScript.innerHTML = JSON.stringify(structuredData);


    $('html, body').animate({
        //scrollTop: $("#itemListDivId").offset().top - 40
        scrollTop: $("#itemListDivId").offset().top - 80
    }, 100);

    setTimeout(function () {
        hideImageNavBtns();
    }, 0);

    setTimeout(function () {
        colorFavoriteItems();
    }, 10);

    setTimeout(function () {
        let x = document.getElementsByClassName("storeOpeninghourscontent");
        for (let i = 0; i < x.length; i++) {
                x[i].setAttribute("contenteditable", false);
        }
        updateStatus();
    }, 50);    
}

function getShopLocationAndHours(tags) {
    let newHTML = "";

    //Start: Have Info- Desc/Hours/Location under one parent div
    newHTML = newHTML + '<div class="flex_container_align_center">';
    //Start: max_2box_responsive
    newHTML = newHTML + '<div class="max_2box_responsive padding_10px"><div class="margin_auto maxwidth_300px">';

    if ((tags[0].uselocationfromaddress != undefined) && (tags[0].uselocationfromaddress != "")) {
        let addrfields = tags[0].uselocationfromaddress.split("~");
        let shopAddr = "<div class='shpAddrClass'>";
        for (let i = 0; i < addrfields.length; i++) {
            let tempval = addrfields[i].split("^");
            if (tempval[1].trim() != "") {
                if (shopAddr != "<div class='shpAddrClass'>") {
                    shopAddr = shopAddr + ", " + tempval[1];
                } else {
                    shopAddr = shopAddr + "Address: " + tempval[1];
                }

            }

        }
        newHTML = newHTML + shopAddr + '</div>';
    }

    if ((tags[0].coordinatesfromaddress != undefined) && (tags[0].coordinatesfromaddress != null) && (tags[0].coordinatesfromaddress != "") && (tags[0].coordinatesfromaddress != "null,null")) {

        let crd = tags[0].coordinatesfromaddress.split(",");
        
        newHTML = newHTML
            + '<div id="storeMapDivId" class="minheight_200px" >&nbsp; <br><br><br>' + '</div>Note: Location on the map is approximate';


        setTimeout(function () {
            let latitude = crd[0];
            let longitude = crd[1];
            const map = L.map("storeMapDivId").setView([latitude, longitude], 5);
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
            L.marker([latitude, longitude]).addTo(map);
        }, 10);

    }   else if ((tags[0].maplocationcoordinates != undefined) && (tags[0].maplocationcoordinates != null) && (tags[0].maplocationcoordinates != "") && (tags[0].maplocationcoordinates != "null,null")) {

            let crd = tags[0].maplocationcoordinates.split(",");
            
            newHTML = newHTML
                + '<div id="storeMapDivId" class="minheight_200px" >&nbsp; <br><br><br>' + '</div>Note: Location on the map is approximate';


            setTimeout(function () {
                let latitude = crd[0];
                let longitude = crd[1];
                const map = L.map("storeMapDivId").setView([latitude, longitude], 5);
                L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
                L.marker([latitude, longitude]).addTo(map);
            }, 10);
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

    return newHTML;

}

function getItemsHTML(storeItems) {
    let newHTML = "";

    let path = window.location.pathname;
    let myUrl = path.substring(0, path.indexOf('/', path.indexOf('bizzlistings')) + 1);

    for (let i = 0; i < storeItems.length; i++) {

        if (storeItems[i].title == undefined) {
            continue;

        } else {
            if (storeItems[i].title == "") {
                continue;
            }

        }
        let category = storeItems[i].category;
        let categorySpaceReplaced = category.replaceAll(" ", "-");
        let storeName = storeItems[i].storename;
        let storeNameSpaceReplaced = storeName.replaceAll(" ", "-");
        let itemName = storeItems[i].title;
        let itemNameSpaceReplaced = itemName.replaceAll(" ", "-");


        let itemTitleURL = myUrl + "items/" + categorySpaceReplaced.toLowerCase() + "/" + storeNameSpaceReplaced.toLowerCase() + "/" + itemNameSpaceReplaced.toLowerCase();
        //Start: Have Item image, Details under one parent div
        newHTML = newHTML + '<div class="animate_inview flex_container_align_center box_shadow5 bgcolor_1 marginbottom_50px itemContainerCls itemDetailsContainerCls" data-itemid="' + storeItems[i].itemid + '" data-itemuid="' + storeItems[i].itemuid + '">';

        //Start: max_2box_responsive
        newHTML = newHTML + '<div class="max_2box_responsive padding_10px"><div class="margin_auto text_align_center">';

        if (storeItems[i].itemimages != undefined) {
            if (storeItems[i].itemimages != "") {
                newHTML = newHTML + '<div class="itemImageshow-container cursor_pointer"  onclick="location.href=' + "'" + itemTitleURL + "'" + '"> ' + storeItems[i].itemimages + '</div>';
            }
        }
        //End: div class="itemImageshow-container"

        newHTML = newHTML + '</div></div>';
        //End: max_2box_responsive

        //Start: max_2box_responsive
        newHTML = newHTML + '<div class="max_2box_responsive padding_10px"><div class="margin_auto text_align_center">';

        newHTML = newHTML + getItemButtons();

        if (storeItems[i].title != undefined) {
            if (storeItems[i].title != "") {
                newHTML = newHTML
                    + '<div class="shopItemTitle ">' + storeItems[i].title + '</div>';
            }
        }

        if (storeItems[i].itemprice != undefined) {
            if (storeItems[i].itemprice != "") {
                newHTML = newHTML
                    + '<div class="shopItemPrice ">' + storeItems[i].itemprice + '</div>';
            }
        }

        if (storeItems[i].itemdescription != undefined) {
            if (storeItems[i].itemdescription != "") {
                newHTML = newHTML
                    + '<div class="shopItemDescription padding_20px">' + storeItems[i].itemdescription + '</div>';
            }
        }

        if (storeItems[i].lastupdatedate != undefined) {
            if (storeItems[i].lastupdatedate != "") {

                let dateStr = (storeItems[i].lastupdatedate).substring(0, 10); // yyyy-mm-dd format
                let date = new Date(dateStr); // convert string to Date object

                let month = date.toLocaleString('default', { month: 'short' }); // get short month name
                let day = date.getDate(); // get day of the month

                let formattedDate = `${month}-${day}`; // create formatted date string

                newHTML = newHTML + '<div class="shopItemLastupdatedate ">Updated: ' + formattedDate + '</div>';

                //newHTML = newHTML + '<div class="shopItemLastupdatedate ">Updated: ' + (storeItems[i].lastupdatedate).substring(0, 10) + '</div>';
            }
        }

        newHTML = newHTML + '</div></div>';
        //End: max_2box_responsive

        newHTML = newHTML + '</div>';
        //End: Have Item image, Details under one parent div
    }

    return newHTML;
}

function hideImageNavBtns() {
    let imgContainers = document.querySelectorAll(".itemImageshow-container");

    for (let i = 0; i < imgContainers.length; i++) {
        let images = imgContainers[i].querySelectorAll(".myitemImages");
        if (images.length < 2) {
            let btns = imgContainers[i].querySelectorAll(".navbtn");

            for (j = 0; j < btns.length; j++) {
                btns[j].style.display = "none";
            }
        }

    }

}

function disableImageClickAction(){
    let imgContainers = document.querySelectorAll(".itemImageshow-container");

    for (let i = 0; i < imgContainers.length; i++) {
        imgContainers[i].onclick = null;
    }
}


//REF:https://stackoverflow.com/questions/18883601/function-to-calculate-distance-between-two-coordinates
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    let R = 6371; // Radius of the earth in km
    let dLat = deg2rad(lat2 - lat1);  // deg2rad below
    let dLon = deg2rad(lon2 - lon1);
    let a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}

// function editItem(btn) {
//     let itemid = btn.dataset.itemid;
//     let category = btn.dataset.category;
//     let categoryseq = btn.dataset.categoryseq;
//     let subcategory = btn.dataset.subcategory;
//     let versionseq = btn.dataset.versionseq;
//     let title = btn.dataset.title;
//     let titleseq = btn.dataset.titleseq;
//     let shortdescription = btn.dataset.shortdescription;
//     let description = sessionStorage.getItem("data-description");
//     let city_state_country = btn.dataset.city_state_country;
//     let keywords = btn.dataset.keywords;
//     let discontinue = btn.dataset.discontinue;

//     $.ajax({
//         url: the.hosturl + '/php/process.php',
//         data: { usrfunction: "checksession" },
//         type: 'POST',
//         dataType: 'json',
//         success: function (retstatus) {
//             if (retstatus == "err") {
//                 //alert("Please relogin");
//                 goToLogin();
//             }
//         },
//         error: function (xhr, status, error) {
//             //console.log("")
//         }
//     });

//     let newHTML = "<div class = 'shopContainer' >";
//     newHTML = newHTML + " ";



//     newHTML = newHTML +
//         "<div class = 'editFieldHead'>Title: </div><br>"
//         +
//         "<input type='text'  id='title-" + itemid + "' style='width:95%; margin:auto;' value='" + title + "'>"
//         + "";

//     newHTML = newHTML +
//         "<br><br><div class = 'editFieldHead'>Title Sort Sequence: </div><br>" +
//         "<input type='text' id='titleseq-" + itemid + "' style='width:95%; margin:auto;' value='" + titleseq + "'>";

//     newHTML = newHTML + "<br><br><div class = 'editFieldHead'>category: </div><br>" +
//         "<input type='text' id='category-" + itemid + "' style='width:95%; margin:auto;'  value='" + category + "'>";

//     newHTML = newHTML +
//         "<br><br><div class = 'editFieldHead'>category Sort Sequence: </div><br>" +
//         "<input type='text' id='categoryseq-" + itemid + "' style='width:95%; margin:auto;' value='" + categoryseq + "'>";

//     newHTML = newHTML +
//         "<br><br><div class = 'editFieldHead'>Path(not in use): </div><br>" +
//         "<input type='text' id='subcategory-" + itemid + "' style='width:95%; margin:auto;' value='" + subcategory + "'>";

//     newHTML = newHTML +
//         "<br><br><div class = 'editFieldHead'>Path Sort Sequence(not in use): </div><br>" +
//         "<input type='text' id='versionseq-" + itemid + "' style='width:95%; margin:auto;' value='" + versionseq + "'>";



//     newHTML = newHTML +
//         "<br><br><div class = 'editFieldHead'>Short Description: </div><br>" +
//         "<textarea id='shortdescription-" + itemid + "' style='width:95%; margin:auto;' >" + shortdescription + "</textarea>";

//     let toolbarHTML = "";
//     //toolbarHTML =  "<button  type='button' class='itmToggledBtn btn btn-primary' onclick=toggleDescView('" + itemid + "') >Toggle View</button>" + "<br>" ;

//     toolbarHTML = toolbarHTML + "<div id='toolBarId' class = 'toolBar'><div>" +
//         "<button  title='toggle desc view' type='button' class='itmUpdBtnSmall btn btn-primary' onclick=toggleDescView('" + itemid + "') >TglDesc</button>" +
//         "<button  title='toggle hide' type='button' class='itmUpdBtnSmall btn btn-primary' onclick=toggleToolBarView() >TglHide</button>";

//     //Shop - Topbanner*********************

//     toolbarHTML = toolbarHTML + "<label class='toolBarlabel'>Div - shopTopBanner</label>"
//         + getShopTopBannersList(itemid);

//     //Shop - Items*********************

//     toolbarHTML = toolbarHTML + "<label class='toolBarlabel'>Div - shopItems</label>"
//         + "<button title='shopItem1' type='button' style='background: url(/bizzlistings/secimages/shopItem1.png); background-size: contain;' class='shopItem btn btn-primary' onclick=addComponent('" + itemid + "','shopItem1') ></button>";

//     //Shop - Items*********************

//     toolbarHTML = toolbarHTML + "<label class='toolBarlabel'>Div - Check Store Name Availability</label>"
//         + "<button title='shopName1' type='button' style='background: url(/bizzlistings/secimages/shopName1.png); background-size: contain;' class='shopName btn btn-primary' onclick=addComponent('" + itemid + "','shopName1') ></button>";

//     //Reveal Js Slide - Section - Divs*********************

//     toolbarHTML = toolbarHTML + "<label class='toolBarlabel'>Div - Sections - Titles</label>"
//         + "<button title='secTitlePlane1' type='button' style='background: url(/bizzlistings/secimages/secTitlePlane1.png); background-size: contain;' class='itmSecImg btn btn-primary' onclick=addComponent('" + itemid + "','secTitlePlane1') ></button>"

//         + "<button title='secTitleWithBG' type='button' style='background: url(/bizzlistings/secimages/secTitleWithBG.png); background-size: contain;' class='itmSecImg btn btn-primary' onclick=addComponent('" + itemid + "','secTitleWithBG') ></button>"

//         + "<button title='SemiTransBG' type='button' style='background: url(/bizzlistings/secimages/SemiTransBG.png); background-size: contain;' class='itmSecImg btn btn-primary' onclick=addComponent('" + itemid + "','SemiTransBG') ></button>"

//         + "<button title='SemiTransBG2' type='button' style='background: url(/bizzlistings/secimages/SemiTransBG2.png); background-size: contain;' class='itmSecImg btn btn-primary' onclick=addComponent('" + itemid + "','SemiTransBG2') ></button>"

//         + "<label class='toolBarlabel'>Div - Sections - Lists</label>"

//         + "<button title='secWithList1' type='button' style='background: url(/bizzlistings/secimages/secWithList1.png); background-size: contain;' class='itmSecImg btn btn-primary' onclick=addComponent('" + itemid + "','secWithList1') ></button>"

//         + "<button title='titleWithItems1' type='button' style='background: url(/bizzlistings/secimages/titleWithItems1.png); background-size: contain;' class='itmSecImg btn btn-primary' onclick=addComponent('" + itemid + "','titleWithItems1') ></button>"

//         + "<button title='titleWithItems2' type='button' style='background: url(/bizzlistings/secimages/titleWithItems2.png); background-size: contain;' class='itmSecImg btn btn-primary' onclick=addComponent('" + itemid + "','titleWithItems2') ></button>"

//         + "<button title='titleWithItems3' type='button' style='background: url(/bizzlistings/secimages/titleWithItems3.png); background-size: contain;' class='itmSecImg btn btn-primary' onclick=addComponent('" + itemid + "','titleWithItems3') ></button>"

//         + "<label class='toolBarlabel'>Div - Code Explaination</label>"
//         + "<button title='titleTextCode1' type='button' style='background: url(/bizzlistings/secimages/titleTextCode1.png); background-size: contain;' class='itmSecImg btn btn-primary' onclick=addComponent('" + itemid + "','titleTextCode1') ></button>"
//         + "<button title='titleTextCode2' type='button' style='background: url(/bizzlistings/secimages/titleTextCode2.png); background-size: contain;' class='itmSecImg btn btn-primary' onclick=addComponent('" + itemid + "','titleTextCode2') ></button>"

//         + "<label class='toolBarlabel'>Div - Quiz MCQ</label>"
//         + "<button title='quizMCQFullScreen' type='button' style='background: url(/bizzlistings/secimages/quizMCQFullScreen.png); background-size: contain;' class='itmSecImg btn btn-primary' onclick=addComponent('" + itemid + "','quizMCQFullScreen') ></button>"
//         + "<button title='quizMCQFullScreenLow' type='button' style='background: url(/bizzlistings/secimages/quizMCQFullScreenLow.png); background-size: contain;' class='itmSecImg btn btn-primary' onclick=addComponent('" + itemid + "','quizMCQFullScreenLow') ></button>"

//         + "<label class='toolBarlabel'>Images</label>"
//         + "<button title='zoomingImage1' type='button' style='background: url(/bizzlistings/secimages/zoomingImage1.png); background-size: contain;' class='itmSecImg btn btn-primary' onclick=addComponent('" + itemid + "','zoomingImage1') ></button>"
//         + "<hr>"
//         + "<label for='insertInner'>Insert component before active Div:</label>"
//         + "<input type='checkbox' id='insertInner' >";
//     //*************ANIMATION CLASSES************* */
//     toolbarHTML = toolbarHTML + "<label class='toolBarlabel'>Animation Classes </label>"
//         + "<div class='animList'> <b>CSS Style Format-</b> animation: 'property/AnimationName' 'duration' 'transitionTiming e.g. in cubic-bezier' 'optional:delay' 'optional:animation-iteration-count' 'optional:animation-fill-mode:both' 'optional:animation-direction: normal/reverse/alternate'"
//         + "<br><br>Ex. " + escape("<div style='margin:auto; padding-top: 100px; animation-name: roll-in-left; animation-duration: 4s; animation-delay: 1s; animation-iteration-count: 3'>text</div>")
//         + "<br><br> <b>To use with fragments add prefix fr-. Eg. animation-name:fr-bounce-right</b>"
//         + "<br><br>Ex. " + escape("<div class='fragment fr-rotate-in-center' style='margin:auto; padding-top: 100px;  animation-duration: 4s; animation-delay: 0s; animation-iteration-count: 1'>text</div>")
//         + "<br><br><b>ImageZooming:-</b> kenburns-top;  kenburns-left; kenburns-right; zoomingImg;"
//         + "<br><br><b>Entrances(Reveal):-</b> scale-in-ver-top; scale-in-hor-center; scale-in-hor-right; scale-up-ver-top; slide-left; slide-right"
//         + "<br><br><b>Entrances(Rotate):-</b> rotate-in-center; rotate-in-right; "
//         + "<br><br><b>Entrances(Bounce):-</b> bounce-in-top; bounce-in-right; bounce-in-bottom; bounce-in-left; bounce-in-fwd; "
//         + "<br><br><b>Entrances(Roll):-</b> roll-in-left; roll-in-top; roll-in-right; roll-in-bottom;  "
//         + "<br><br><b>Entrances(Tilt):-</b> tilt-in-top-1; tilt-in-top-2; tilt-in-fwd-tr  "
//         + "<br><br><b>Entrances(Swing):-</b> swing-in-top-fwd; swing-in-left-bck  "
//         + "<br><br><b>Entrances(Text-Expand/Contract):-</b> tracking-in-expand;tracking-in-expand-fwd;tracking-in-contract-bck;tracking-in-contract;text-pop-up-top  "
//         + "<br><br><b>Attention:-</b> shake-vertical; jello-diagonal-1; jello-horizontal;wobble-hor-bottom; wobble-hor-top; bounce-top; bounce-bottom; bounce-left; bounce-right  "
//         + "<br><br><b>Others:-</b> slidingUp10px; slidingUp600px; slidingDown10px; slidingDown600px; slidingleft10px; slidingleft600px; slidingright10px; slidingright600px;"
//         + "<br><br>slideFragmentUp10px;slideFragmentUp600px;slideFragmentDown10px;slideFragmentDown600px;slideFragmentLeft10px;slideFragmentLeft600px;slideFragmentRight10px; slideFragmentRight600px;"
//         + "<br><br> </div>";

//     //*************SOUNDS************* */
//     toolbarHTML = toolbarHTML + "<label class='toolBarlabel'>Sounds (Click to insert at Carot) </label>"

//         + "<button title='air-in-a-hit' type='button'  class='soundPreviewByTitle btn btn-primary' onmouseover='previewSound(this)' onclick=addComponent('" + itemid + "','air-in-a-hit') >air-in-a-hit</button>"
//         + "<button title='arrow-whoosh' type='button'  class='soundPreviewByTitle btn btn-primary' onmouseover='previewSound(this)' onclick=addComponent('" + itemid + "','arrow-whoosh') >arrow-whoosh</button>"
//         + "<button title='bell-ding-586' type='button'  class='soundPreviewByTitle btn btn-primary' onmouseover='previewSound(this)' onclick=addComponent('" + itemid + "','bell-ding-586') >bell-ding-586</button>"
//         + "<button title='fast-blow' type='button'  class='soundPreviewByTitle btn btn-primary' onmouseover='previewSound(this)' onclick=addComponent('" + itemid + "','fast-blow') >fast-blow</button>"
//         + "<button title='fast-sweep' type='button'  class='soundPreviewByTitle btn btn-primary' onmouseover='previewSound(this)' onclick=addComponent('" + itemid + "','fast-sweep') >fast-sweep</button>"
//         + "<button title='keyboard-key-presses' type='button'  class='soundPreviewByTitle btn btn-primary' onmouseover='previewSound(this)' onclick=addComponent('" + itemid + "','keyboard-key-presses') >keyboard-key-presses</button>"
//         + "<button title='page-flip-01a' type='button'  class='soundPreviewByTitle btn btn-primary' onmouseover='previewSound(this)' onclick=addComponent('" + itemid + "','page-flip-01a') >page-flip-01a</button>"
//         + "<button title='paper-slide' type='button'  class='soundPreviewByTitle btn btn-primary' onmouseover='previewSound(this)' onclick=addComponent('" + itemid + "','paper-slide') >paper-slide</button>"
//         + "<button title='pop' type='button'  class='soundPreviewByTitle btn btn-primary' onmouseover='previewSound(this)' onclick=addComponent('" + itemid + "','pop') >pop</button>"
//         + "<button title='sand-swish' type='button'  class='soundPreviewByTitle btn btn-primary' onmouseover='previewSound(this)' onclick=addComponent('" + itemid + "','sand-swish') >sand-swish</button>"
//         + "<button title='ui-zoom-in' type='button'  class='soundPreviewByTitle btn btn-primary' onmouseover='previewSound(this)' onclick=addComponent('" + itemid + "','ui-zoom-in') >ui-zoom-in</button>"
//         + "<button title='low-arrow-whoosh' type='button'  class='soundPreviewByTitle btn btn-primary' onmouseover='previewSound(this)' onclick=addComponent('" + itemid + "','low-arrow-whoosh') >low-arrow-whoosh</button>"
//         + "<button title='low-sand-swish' type='button'  class='soundPreviewByTitle btn btn-primary' onmouseover='previewSound(this)' onclick=addComponent('" + itemid + "','low-sand-swish') >low-sand-swish</button>"
//         + "<button title='low-bell-ding' type='button'  class='soundPreviewByTitle btn btn-primary' onmouseover='previewSound(this)' onclick=addComponent('" + itemid + "','low-bell-ding') >low-bell-ding</button>";

//     //*************BACKGROUND SOUNDS************* */
//     toolbarHTML = toolbarHTML + "<label class='toolBarlabel'>Background Sounds (Click to insert at Carot) </label>"

//         + "<button title='background1' type='button'  class='soundPreviewByTitle btn btn-primary' onmouseover='previewSound(this)' onclick=addComponent('" + itemid + "','background1') >background1</button>"
//         + "<button title='background2' type='button'  class='soundPreviewByTitle btn btn-primary' onmouseover='previewSound(this)' onclick=addComponent('" + itemid + "','background2') >background2</button>"
//         + "<button title='background3' type='button'  class='soundPreviewByTitle btn btn-primary' onmouseover='previewSound(this)' onclick=addComponent('" + itemid + "','background3') >background3</button>"
//         + "<button title='background4' type='button'  class='soundPreviewByTitle btn btn-primary' onmouseover='previewSound(this)' onclick=addComponent('" + itemid + "','background4') >background4</button>"
//         + "<button title='background5' type='button'  class='soundPreviewByTitle btn btn-primary' onmouseover='previewSound(this)' onclick=addComponent('" + itemid + "','background5') >background5</button>"
//         + "<button title='background6' type='button'  class='soundPreviewByTitle btn btn-primary' onmouseover='previewSound(this)' onclick=addComponent('" + itemid + "','background6') >background6</button>"

//         + "<hr>" + "Enable Preview: <input type='checkbox' id='enableSoundPreview' > Enable Loop: <input type='checkbox' id='enableSoundLoop' ><br>" + "<audio id='audioPreview' controls='controls'>  <source id='audioSourceIdMP3' src='' type='audio/mp3'><source id='audioSourceIdWAV' src='' type='audio/wav'></source>Not Supported</audio>";

//     //****************IMAGES****************/
//     toolbarHTML = toolbarHTML + "<label class='toolBarlabel'>Scripts</label>"
//         + "<button title='code-snippet' type='button'  class='soundPreviewByTitle btn btn-primary'  onclick=addComponent('" + itemid + "','code-snippet') >code-snippet</button>"

//     toolbarHTML = toolbarHTML + "<label class='toolBarlabel'>Upload Image</label>"
//         + "Upload Image:(e.g. myimage.png)" +
//         "<input type='text' id='image-" + itemid + "' style='width:95%; margin:auto;'  value=''>"
//         +
//         "<br><img id='image-src-replace-" + itemid + "' src= '" + the.hosturl + "/img/" + "' style='width: 200px; height: 200px; background-color: white;' alt='Image not available' />"

//         +
//         "<br><input type='file'  id='image-replace-" + itemid + "' data-itemid = '" + itemid + "'   data-imageelementid='image-src-replace-' onchange='showImage(event)'>"

//         +
//         "<br><label id='image-ererrormsg-" + itemid + "' style='color: #cc0000; font-size: 14px; min-height: 20px;'></label>"
//         +
//         "<input class='itmUpdBtnSmall' type='button' value='Upload And Insert At Carot' data-errormsgelementid='image-ererrormsg-' data-saveasnameelementid='image-' data-fileelementid='image-replace-' data-itemid = '" + itemid + "' onclick='uploadAndInsertFile(event);'  >"
//         +
//         "<input class='itmUpdBtnSmall' type='button' value='Insert At Carot' data-errormsgelementid='image-ererrormsg-' data-saveasnameelementid='image-' data-fileelementid='image-replace-' data-itemid = '" + itemid + "' onclick='insertImageAtCarot(event);'  >"
//         +
//         "<input class='itmUpdBtnSmall' type='button' value='Upload New Image' data-errormsgelementid='image-ererrormsg-' data-saveasnameelementid='image-' data-fileelementid='image-replace-' data-itemid = '" + itemid + "' onclick='uploadFile(event);'  ><br>"
//         + "<label class='toolBarlabel'>Search Images (Click to Save)</label>"
//         + "<input class = 'itmUpdBtnSmall' type='text' id='search-img' value=''> "
//         + "<button title='Image-Smallest' type='button' class='itmUpdBtnSmall btn btn-primary' onclick=loadUNSPLImg('" + itemid + "')>Search Unsplash</button>"
//         + "<button title='Image-Smallest' type='button' class='itmUpdBtnSmall btn btn-primary' onclick=loadPixabImg('" + itemid + "')>Search Pixabay</button>"
//         + "<button title='Image-Smallest' type='button' class='itmUpdBtnSmall btn btn-primary' onclick=loadPexImg('" + itemid + "')>Search Pexel</button><br>"
//         + "<div class='srchimages'></div>";

//     toolbarHTML = toolbarHTML + "<label class='toolBarlabel'>Paragraphs</label>" +
//         "<button title='paragraph1' type='button' class='itmUpdBtnSmall btn btn-primary' onclick=addComponent('" + itemid + "','paragraph1') >P1</button>" +
//         "<button title='paragraph2 white BG' type='button' class='itmUpdBtnSmall btn btn-primary' onclick=addComponent('" + itemid + "','paragraph2') >P2</button>" +
//         "<label class='toolBarlabel'>Ordered Lists</label>" +
//         "<button title='ordered-list' type='button' class='itmUpdBtnSmall btn btn-primary' onclick=addComponent('" + itemid + "','orderedlist') >OL1</button>" +
//         "<button title='sub-ordered-list' type='button' class='itmUpdBtnSmall btn btn-primary' onclick=addComponent('" + itemid + "','suborderedlist') >OL2</button>" +
//         "<label class='toolBarlabel'>Unordered Lists</label>" +
//         "<button title='un-ordered-list' type='button' class='itmUpdBtnSmall btn btn-primary' onclick=addComponent('" + itemid + "','unorderedlist') >UL1</button>" +
//         "<button title='sub-un-ordered-list' type='button' class='itmUpdBtnSmall btn btn-primary' onclick=addComponent('" + itemid + "','subunorderedlist') >UL2</button>" +
//         "<button title='sub2-un-ordered-list' type='button' class='itmUpdBtnSmall btn btn-primary' onclick=addComponent('" + itemid + "','sub2unorderedlist') >UL3</button>" +
//         "<label class='toolBarlabel'>Code Snippets</label>" +
//         "<button title='Code-Dark Intellij' type='button' class='itmUpdBtnSmall btn btn-primary' onclick=addComponent('" + itemid + "','codescript1') >Dark</button>" +
//         "<button title='Code-Light-VSCode' type='button' class='itmUpdBtnSmall btn btn-primary' onclick=addComponent('" + itemid + "','codescript2') >Light</button>" +
//         "<button title='Code-CommandLine'' type='button' class='itmUpdBtnSmall btn btn-primary' onclick=addComponent('" + itemid + "','codescript3') >Cmd</button>" +
//         "<label class='toolBarlabel'>Headers</label>" +
//         "<button title='header1' type='button' class='itmUpdBtnSmall btn btn-primary' onclick=addComponent('" + itemid + "','header1') >H1</button>" +
//         "<button title='header2' type='button' class='itmUpdBtnSmall btn btn-primary' onclick=addComponent('" + itemid + "','header2') >H2</button>" +
//         "<button title='header3-padding' type='button' class='itmUpdBtnSmall btn btn-primary' onclick=addComponent('" + itemid + "','header3') >H3</button>" +
//         "<button title='header3' type='button' class='itmUpdBtnSmall btn btn-primary' onclick=addComponent('" + itemid + "','header4') >H4</button>" +
//         "<label class='toolBarlabel'>Images</label>" +
//         "<button title='Image-Full-width' type='button' class='itmUpdBtnSmall btn btn-primary' onclick=addComponent('" + itemid + "','image1') >I1</button>" +
//         "<button title='Image-Smaller' type='button' class='itmUpdBtnSmall btn btn-primary' onclick=addComponent('" + itemid + "','image2') >I2</button>" +
//         "<button title='Image-Smallest' type='button' class='itmUpdBtnSmall btn btn-primary' onclick=addComponent('" + itemid + "','image3') >I3</button>" +
//         "<button title='Image-Smallest' type='button' class='itmUpdBtnSmall btn btn-primary' onclick=addComponent('" + itemid + "','image4') >I@Car</button>" +
//         "<label class='toolBarlabel'>Messages</label>" +
//         "<button title='Warning'' type='button' class='itmUpdBtnSmall btn btn-primary' onclick=addComponent('" + itemid + "','warning') >Warn</button>" +
//         "<button title='Error' type='button' class='itmUpdBtnSmall btn btn-primary' onclick=addComponent('" + itemid + "','error') >Err</button>" +
//         "<button title='Green-Success' type='button' class='itmUpdBtnSmall btn btn-primary' onclick=addComponent('" + itemid + "','greenmsg') >Succ</button>" +

//         "<label class='toolBarlabel'>Quiz</label>" +
//         "<button title='Quiz1'' type='button' class='itmUpdBtnSmall btn btn-primary' onclick=addComponent('" + itemid + "','qz1') >Q1</button>" +
//         "<button title='Quiz2' type='button' class='itmUpdBtnSmall btn btn-primary' onclick=addComponent('" + itemid + "','qz2') >Q2</button>" +
//         "<button title='Submit Quiz Button' type='button' class='itmUpdBtnSmall btn btn-primary' onclick=addComponent('" + itemid + "','sbmtqz') >SbmtQz</button>" +
//         "</div>";

//     //*************END OF TOOLBAR DIV */
//     toolbarHTML = toolbarHTML + "</div><br><br><br>";
//     //*************END OF TOOLBAR DIV */



//     newHTML = newHTML + "<br><br>" +
//         "<textarea id='descriptionTextId' class = ''   ></textarea>"
//         +
//         "<div class='editDescriptionDiv' contenteditable='true'  class='span2 fullWidth lyricsDiv' id='description-" + itemid + "'  >" + description + "</div>";


//     //newHTML = newHTML + "<br><br>" +
//     //"<textarea id='description-" + itemid + " class = 'fullWidth tiny ' rows='5'>" + description + "</textarea>";


//     newHTML = newHTML +
//         "<br><br><div class = 'editFieldHead'>city_state_country: </div><br>" +
//         "<input type='text' id='city_state_country-" + itemid + "' style='width:95%; margin:auto;' value='" + city_state_country + "'>";

//     newHTML = newHTML +
//         "<br><br><div class = 'editFieldHead'>Keywords (tags): </div><br>" +
//         "<textarea id='keywords-" + itemid + "' style='width:95%; margin:auto;' >" + keywords + "</textarea>";


//     newHTML = newHTML +
//         "<br><br><div class = 'editFieldHead'>Discontinue: </div> <br>" +
//         "<input type='text' id='discontinue-" + itemid + "' style='width:95%; margin:auto;' value='" + discontinue + "'>"

//         +
//         "<label id='updateitemerrormsg-" + itemid + "' style='color: #cc0000; font-size: 14px; min-height: 20px;'></label>";

//     newHTML = newHTML +
//         "<div class = 'saveChangesDivCls'>" +
//         "<button  type='button' class='itmUpdSaveBtn btn btn-primary' onclick=updateDescription('" + itemid + "','n') >Save Changes</button><br>" +
//         "<button   type='button' class='itmUpdSaveBtn btn btn-primary' onclick=updateDescription('" + itemid + "','y') >Save As New Item</button><br>" +
//         "<button   type='button' class='itmUpdSaveBtn btn btn-danger' onclick=refreshPage() >Cancel</button><br>" +
//         "</div>" +
//         "<br><br><br><br><br><br><br><br><br></div></div>";

//     newHTML = newHTML + "</div>";
//     newHTML = newHTML + "</div>";
//     newHTML = newHTML + "</div>";

//     document.getElementById("itemDivId").innerHTML = newHTML;
//     document.getElementById("itemEditDivId").innerHTML = toolbarHTML;


//     document.getElementById("itemEditDivId").style.display = "block";

//     document.getElementById("itemDivId").style.width = "100%";
//     document.getElementById("itemDivId").style.display = "block";
    
//     document.getElementById("mainContainer").style.width = "100%";
//     document.getElementById("itemEditDivId").style.width = "700px";
//     document.getElementById("itemListDivId").style.display = "none";

// }

function getShopTopBannersList(itemid) {

    return "<label class='informationBox fontsize_14px'>If you want to change the design of your store banner above, use the button below to change design</label>"
        + "<div  type='button'  class='shopTopBannerBtn max_4box_responsive hover_shadow1' onclick=addComponent('" + itemid + "','shopTopBanner1',this) ><img src='/bizzlistings/secimages/shopTopBanner1.png' alt='items' class='storeBannerImg'></div>"
        + "<div  type='button'  class='shopTopBannerBtn max_4box_responsive hover_shadow1' onclick=addComponent('" + itemid + "','shopTopBanner2',this) ><img src='/bizzlistings/secimages/shopTopBanner2.png' alt='items' class='storeBannerImg'></div>"
        + "<div  type='button'  class='shopTopBannerBtn max_4box_responsive hover_shadow1' onclick=addComponent('" + itemid + "','shopTopBanner3',this) ><img src='/bizzlistings/secimages/shopTopBanner3.png' alt='items' class='storeBannerImg'></div>"
        + "<div  type='button'  class='shopTopBannerBtn max_4box_responsive hover_shadow1' onclick=addComponent('" + itemid + "','shopTopBanner4',this) ><img src='/bizzlistings/secimages/shopTopBanner4.png' alt='items' class='storeBannerImg'></div>"
        + "<div  type='button'  class='shopTopBannerBtn max_4box_responsive hover_shadow1' onclick=addComponent('" + itemid + "','shopTopBanner3-A',this) ><img src='/bizzlistings/secimages/shopTopBanner3-A.png' alt='items' class='storeBannerImg'></div>"
        + "<div  type='button'  class='shopTopBannerBtn max_4box_responsive hover_shadow1' onclick=addComponent('" + itemid + "','shopTopBanner3-B',this) ><img src='/bizzlistings/secimages/shopTopBanner3-B.png' alt='items' class='storeBannerImg'></div>"
        + "<div  type='button'  class='shopTopBannerBtn max_4box_responsive hover_shadow1' onclick=addComponent('" + itemid + "','shopTopBanner3-C',this) ><img src='/bizzlistings/secimages/shopTopBanner3-C.png' alt='items' class='storeBannerImg'></div>"
        + "<div  type='button'  class='shopTopBannerBtn max_4box_responsive hover_shadow1' onclick=addComponent('" + itemid + "','shopTopBanner3-D',this) ><img src='/bizzlistings/secimages/shopTopBanner3-D.png' alt='items' class='storeBannerImg'></div>"
        + "<div  type='button'  class='shopTopBannerBtn max_4box_responsive hover_shadow1' onclick=addComponent('" + itemid + "','shopTopBanner3-E',this) ><img src='/bizzlistings/secimages/shopTopBanner3-E.png' alt='items' class='storeBannerImg'></div>"
        + "<div  type='button'  class='shopTopBannerBtn max_4box_responsive hover_shadow1' onclick=addComponent('" + itemid + "','shopTopBanner3-F',this) ><img src='/bizzlistings/secimages/shopTopBanner3-F.png' alt='items' class='storeBannerImg'></div>"
        + "<div  type='button'  class='shopTopBannerBtn max_4box_responsive hover_shadow1' onclick=addComponent('" + itemid + "','shopTopBanner3-G',this) ><img src='/bizzlistings/secimages/shopTopBanner3-G.png' alt='items' class='storeBannerImg'></div>"
        + "<div  type='button'  class='shopTopBannerBtn max_4box_responsive hover_shadow1' onclick=addComponent('" + itemid + "','shopTopBanner3-H',this) ><img src='/bizzlistings/secimages/shopTopBanner3-H.png' alt='items' class='storeBannerImg'></div>"

}

// function toggleToolBarView() {

//     if (document.getElementById("toolBarId").clientHeight > 50) {
//         document.getElementById("toolBarId").style.height = "50px";
//     } else {
//         document.getElementById("toolBarId").style.height = "600px";
//     }
// }

// function popolatenewImageName(itemid) {
//     let name = window.location.href.substring(window.location.href.lastIndexOf('/') + 1) + "-" + (Math.floor(Math.random() * 10000) + 1) + ".png";
//     name = name.replaceAll("#", "");
//     the.newImageName = name;
//     try {
//         document.getElementById("image-" + itemid).value = name;
//     } catch {

//     }

// }


// function deleteCurrentComponent(btn) {

//     btn.parentElement.remove();
//     //btn.parentElement.innerHTML = "";
// }

// function copyCurrentComponent(btn) {
//     let text = btn.parentElement.textContent;
//     text = text.substring(1, text.lastIndexOf('Copy'));

//     navigator.clipboard.writeText(text);
//     console.log(text);
// }

function showImage(event) {
    let elem = event.target;
    let itemid = elem.dataset.itemid;
    let imageelementid = elem.dataset.imageelementid;

    if (elem.dataset.uploadimgbtnid != null) {
        document.getElementById(elem.dataset.uploadimgbtnid).style.display = "block";
    }

    //popolatenewImageName(itemid);

    let output = document.getElementById(imageelementid + itemid);
    output.style.display = "block";
    output.src = URL.createObjectURL(event.target.files[0]);
    output.onload = function () {
        URL.revokeObjectURL(output.src)
    }
}

function addImageToItemList(event) {
    let elem = event.target;
    //elem.style.display = "block";

    let itemid = elem.dataset.itemid;
    let imageelementid = elem.dataset.imageelementid;
    let fileelementid = elem.dataset.fileelementid;

    let saveasname = localStorage.getItem("userdata") + "-" + (Math.floor(Math.random() * 100000000000) + 1) + ".png";
    saveasname = saveasname.replaceAll("#", "");
    saveasname = saveasname.trim();
    saveasname = saveasname.toLowerCase();

    let elemClassname = fileelementid + itemid;

    let files = elem.parentElement.querySelector("." + elemClassname).files;

    if (files.length > 0) {

        let formData = new FormData();

        resizeImage({
            file: files[0],
            maxSize: 500
        }).then(function (resizedImage) {

            formData.append("file", resizedImage);
            formData.append("saveasname", saveasname);
            formData.append("dir", "img");

            let xhttp = new XMLHttpRequest();

            xhttp.open("POST", the.hosturl + "/php/upload.php", true);

            // call on request changes state
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {

                    let parentDiv = elem.parentElement.parentElement.parentElement;
                    let existingHTML = parentDiv.querySelector('.existingItmImages').innerHTML;

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
    let elem = event.target;
    let parentDiv = elem.parentElement.parentElement.parentElement.parentElement;
    //let imagesHTML = parentDiv.querySelector('.existingItmImages').innerHTML;


    let img_list = parentDiv.querySelectorAll('.filteredItmImgCls'); // returns NodeList
    let img_array = [...img_list]; // converts NodeList to Array

    let newHTML = "";
    let oneDisplayed = 0;
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

    let elem = event.target;
    let fileelementid = elem.dataset.fileelementid;
    let saveasnameelementid = elem.dataset.saveasnameelementid;
    let itemid = elem.dataset.itemid;

    //let saveasname = document.getElementById(saveasnameelementid + itemid).value;

    // let saveasname = '';
    // try {
    //     saveasname = document.getElementById(saveasnameelementid + itemid).value;
    // } catch {
    //     saveasname = the.newImageName;
    // }

    let saveasname = localStorage.getItem("userdata") + "-" + (Math.floor(Math.random() * 100000000000) + 1) + ".png";


    saveasname = saveasname.trim();
    saveasname = saveasname.toLowerCase();

    //let errormsgelementid = elem.dataset.errormsgelementid;


    if (!saveasname.includes(".png")) {
        saveasname = saveasname + ".png";
    }

    //let files = document.getElementById(fileelementid + itemid).files;

    let elemClassname = fileelementid + itemid;

    let files = elem.parentElement.querySelector("." + elemClassname).files;

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
    let formData = new FormData();
    formData.append("file", file);
    formData.append("saveasname", saveasname);
    formData.append("dir", "img");

    let xhttp = new XMLHttpRequest();

    // Set POST method and ajax file path
    xhttp.open("POST", the.hosturl + "/php/upload.php", true);

    // call on request changes state
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let response = this.responseText;
            document.getElementById(errormsgelementid + itemid).innerHTML = "<font color = #0000>" + response + "</font> ";
        }
    };

    // Send request with data
    xhttp.send(formData);
}

function resizeImage(settings) {
    let file = settings.file;
    let maxSize = settings.maxSize;
    let reader = new FileReader();
    let image = new Image();
    let canvas = document.createElement('canvas');

    let dataURItoBlob = function (dataURL) {
        let BASE64_MARKER = ';base64,';
        if (dataURL.indexOf(BASE64_MARKER) == -1) {
            let parts = dataURL.split(',');
            let contentType = parts[0].split(':')[1];
            let raw = parts[1];

            return new Blob([raw], { type: contentType });
        }

        let parts = dataURL.split(BASE64_MARKER);
        let contentType = parts[0].split(':')[1];
        let raw = window.atob(parts[1]);
        let rawLength = raw.length;

        let uInt8Array = new Uint8Array(rawLength);

        for (let i = 0; i < rawLength; ++i) {
            uInt8Array[i] = raw.charCodeAt(i);
        }

        return new Blob([uInt8Array], { type: contentType });
    };


    let resize = function () {
        let width = image.width;
        let height = image.height;
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
        let dataUrl = canvas.toDataURL('image/jpeg', 0.9);
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

// function uploadAndInsertFile(event) {
//     if (localStorage.getItem("userLoggedIn") == "n") {

//         error_message = "Not authorized";
//         return;

//     } else if (localStorage.getItem("userLvl") != "9") {
//         error_message = "Not authorized";
//         return;
//     }
//     let elem = event.target;
//     let fileelementid = elem.dataset.fileelementid;
//     let saveasnameelementid = elem.dataset.saveasnameelementid;
//     let itemid = elem.dataset.itemid;

//     let saveasname = localStorage.getItem("userdata") + "-" + (Math.floor(Math.random() * 100000000000) + 1) + ".png";

//     saveasname = saveasname.trim();
//     saveasname = saveasname.toLowerCase();

//     let errormsgelementid = elem.dataset.errormsgelementid;

//     if (!saveasname.includes(".png")) {
//         saveasname = saveasname + ".png";
//     }

//     //let files = document.getElementById(fileelementid + itemid).files;

//     let elemClassname = fileelementid + itemid;

//     let files = elem.parentElement.querySelector("." + elemClassname).files;

//     if (files.length > 0) {



//         resizeImage({
//             file: files[0],
//             maxSize: 500
//         }).then(function (resizedImage) {
//             let formData = new FormData();
//             formData.append("file", resizedImage);
//             formData.append("saveasname", saveasname);
//             formData.append("dir", "img");

//             let xhttp = new XMLHttpRequest();

//             xhttp.open("POST", the.hosturl + "/php/upload.php", true);

//             // call on request changes state
//             xhttp.onreadystatechange = function () {
//                 if (this.readyState == 4 && this.status == 200) {

//                     let response = this.responseText;
//                     //console.log(response);

//                     document.getElementById(errormsgelementid + itemid).innerHTML = "<font color = #0000>" + response + "</font> ";
//                     let imagename = document.getElementById("image-" + itemid).value;
//                     let randomId = "div-" + Math.floor(Math.random() * 1000000);
//                     let Str = "<div id= '" + randomId + "' onmousedown=setLastFocusedDivId(this.id)  class = 'image1-desc'> " + "<img class='movieImageCls' alt ='' src= '" + the.hosturl + "/img/" + imagename + "'> " + " <button class='deleteDivInnImg' onclick=deleteCurrentComponent(this) ></button></div>";
//                     insertImageAtCaret(Str);
//                 }
//             };

//             xhttp.send(formData);

//         }).catch(function (err) {
//             console.error(err);
//         });

//     } else {
//         alert("Please select a file");
//     }

// }

// function SaveImageAndInsertAtCarot(event) {
//     if (localStorage.getItem("userLoggedIn") == "n") {

//         error_message = "Not authorized";
//         return;

//     } else if (localStorage.getItem("userLvl") != "9") {
//         error_message = "Not authorized";
//         return;
//     }
//     let elem = event.target;
//     let fileelementid = elem.dataset.fileelementid;
//     let saveasnameelementid = elem.dataset.saveasnameelementid;
//     let itemid = elem.dataset.itemid;
//     //popolatenewImageName(itemid);

//     let saveasname = document.getElementById(saveasnameelementid + itemid).value;
//     saveasname = saveasname.trim();
//     saveasname = saveasname.toLowerCase();

//     let errormsgelementid = elem.dataset.errormsgelementid;

//     if (!saveasname.includes(".png")) {
//         saveasname = saveasname + ".png";
//     }

//     const url = elem.dataset.imageurl;
//     const fileName = 'tempName.png';

//     fetch(url)
//         .then(async response => {
//             const contentType = response.headers.get('content-type')
//             const blob = await response.blob()
//             const filefromUrl = new File([blob], fileName, { contentType })
//             let formData = new FormData();
//             formData.append("file", filefromUrl);
//             formData.append("saveasname", saveasname);
//             formData.append("dir", "img");

//             let xhttp = new XMLHttpRequest();

//             xhttp.open("POST", the.hosturl + "/php/upload.php", true);

//             // call on request changes state
//             xhttp.onreadystatechange = function () {
//                 if (this.readyState == 4 && this.status == 200) {

//                     let response = this.responseText;
//                     //console.log(response);

//                     document.getElementById(errormsgelementid + itemid).innerHTML = "<font color = #0000>" + response + "</font> ";
//                     let imagename = document.getElementById("image-" + itemid).value;
//                     let randomId = "div-" + Math.floor(Math.random() * 1000000);
//                     let Str = "<div id= '" + randomId + "' onmousedown=setLastFocusedDivId(this.id)  class = 'image1-desc'> " + "<img class='movieImageCls' alt ='' src= '" + the.hosturl + "/img/" + imagename + "'> " + " <button class='deleteDivInnImg' onclick=deleteCurrentComponent(this) ></button></div>";
//                     insertImageAtCaret(Str);
//                 }
//             };

//             xhttp.send(formData);
//         })
// }

function UploadAndReplaceBannerImg(event) {

    let elem = event.target;
    let fileelementid = elem.dataset.fileelementid;
    let saveasnameelementid = elem.dataset.saveasnameelementid;
    let itemid = elem.dataset.itemid;
    //popolatenewImageName(itemid);

    // let saveasname = '';
    // try {
    //     saveasname = document.getElementById(saveasnameelementid + itemid).value;
    // } catch {
    //     saveasname = the.newImageName;
    // }

    let saveasname = localStorage.getItem("userdata") + "-" + (Math.floor(Math.random() * 100000000000) + 1) + ".png";


    saveasname = saveasname.trim();
    saveasname = saveasname.toLowerCase();

    let errormsgelementid = elem.dataset.errormsgelementid;

    if (!saveasname.includes(".png")) {
        saveasname = saveasname + ".png";
    }

    //let files = document.getElementById(fileelementid + itemid).files;

    let elemClassname = fileelementid + itemid;

    let files = elem.parentElement.querySelector("." + elemClassname).files;

    if (files.length > 0) {

        resizeImage({
            file: files[0],
            maxSize: 500
        }).then(function (resizedImage) {
            let formData = new FormData();
            formData.append("file", resizedImage);
            formData.append("saveasname", saveasname);
            formData.append("dir", "img");

            let xhttp = new XMLHttpRequest();

            // Set POST method and ajax file path
            xhttp.open("POST", the.hosturl + "/php/upload.php", true);

            // call on request changes state
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {

                    //let parentSecDiv = elem.parentElement.parentElement;
                    //let previewDiv = parentSecDiv.querySelector('.secPreview');
                    //let previewDiv = document.querySelector('.secPreview');

                    //Mar-26:Added one more parent for banner img
                    let parentSecDiv = elem.parentElement.parentElement.parentElement.parentElement;
                    let previewDiv = parentSecDiv.querySelector('.secPreview');

                    if (previewDiv.style.display != "none") {
                        let bannerDiv = previewDiv.querySelector('.shopTopBanner');
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

// function toggleDescView(itemid) {
//     let divId = 'description-' + itemid;

//     if (document.getElementById("descriptionTextId").style.display == "block") {
//         newHTML = document.getElementById("descriptionTextId").value;
//         //**SM - May need to be reverted* */
//         //newHTML = removeNewLine(newHTML);
//         document.getElementById(divId).innerHTML = newHTML;

//         document.getElementById(divId).style.display = "block";
//         document.getElementById("descriptionTextId").style.display = "none"
//     } else {
//         newHTML = document.getElementById(divId).innerHTML;
//         //**SM - May need to be reverted* */
//         //newHTML = addNewLineInText(newHTML);
//         document.getElementById("descriptionTextId").value = newHTML;

//         document.getElementById(divId).style.display = "none";
//         document.getElementById("descriptionTextId").style.display = "block"
//     }

// }

// function addNewLineInText(innerHTML) {
//     innerHTML = innerHTML.replaceAll("<div", "\r\n<div");
//     innerHTML = innerHTML.replaceAll("<h1", "\r\n<h1");
//     innerHTML = innerHTML.replaceAll("<h2", "\r\n<h2");
//     innerHTML = innerHTML.replaceAll("<h3", "\r\n<h3");
//     innerHTML = innerHTML.replaceAll("<ol", "\r\n<ol");
//     innerHTML = innerHTML.replaceAll("<ul", "\r\n<ul");
//     return innerHTML;
// }

// function removeNewLine(innerHTML) {
//     //innerHTML = innerHTML.replaceAll( "&#13;&#10;", "");
//     innerHTML = innerHTML.replace(/\r\n|\r|\n/g, "")
//     return innerHTML;
// }
function addComponent(itemid, type, elem = "dummy") {

    let componentid = 'description-' + itemid;
    let AllHTML = "";
    let partOneHTML = "";
    let partTwoHTML = "";

    if (itemid != "shopTopBanner") {
        AllHTML = document.getElementById(componentid).innerHTML;
        let checkBox = document.getElementById("insertInner");
        let findStr = '<div id="' + last_focused_div_id;
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



    let randomId = type + "-" + Math.floor(Math.random() * 1000000);
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
        let imagename = document.getElementById("image-" + itemid).value;
        document.getElementById(componentid).innerHTML = partOneHTML + "<div id= '" + randomId + "' onmousedown=setLastFocusedDivId(this.id)  class = 'image1-desc'> " + "<img class='movieImageCls' alt ='' src= '" + the.hosturl + "/img/" + imagename + "'> " + " <button class='deleteDiv' onclick=deleteCurrentComponent(this) ></button></div>" + partTwoHTML;

    } else if (type == "image2") {
        let imagename = document.getElementById("image-" + itemid).value;
        document.getElementById(componentid).innerHTML = partOneHTML + "<div id= '" + randomId + "' onmousedown=setLastFocusedDivId(this.id)  class = 'image2-desc'> " + "<img class='movieImageCls' alt ='' src= '" + the.hosturl + "/img/" + imagename + "'> " + "  <button class='deleteDiv' onclick=deleteCurrentComponent(this) ></button></div>" + partTwoHTML;

    } else if (type == "image3") {
        let imagename = document.getElementById("image-" + itemid).value;
        document.getElementById(componentid).innerHTML = partOneHTML + "<div id= '" + randomId + "' onmousedown=setLastFocusedDivId(this.id)  class = 'image3-desc'> " + "<img class='movieImageCls' alt ='' src= '" + the.hosturl + "/img/" + imagename + "'> " + " <button class='deleteDiv' onclick=deleteCurrentComponent(this) ></button></div>" + partTwoHTML;
    } else if (type == "image4") {
        let imagename = document.getElementById("image-" + itemid).value;
        let Str = "<div id= '" + randomId + "' onmousedown=setLastFocusedDivId(this.id)  class = 'image1-desc'> " + "<img class='movieImageCls' alt ='' src= '" + the.hosturl + "/img/" + imagename + "'> " + " <button class='deleteDivInnImg' onclick=deleteCurrentComponent(this) ></button></div>";
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
        let tempCompHTML = partOneHTML + "<div id= '" + randomId + "-qs' onmousedown=setLastFocusedDivId(this.id)  class = 'qz1-qs'> TODO Edit - Write Question <button class='deleteDiv' onclick=deleteCurrentComponent(this) ></button></div>"
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

        let htmlPartOrig = '<div class="slidingUp10px" style="margin:auto; padding-top: 100px">'
            + "\n" + 'My Tutorial'
            + "\n" + '</div>';

        htmlPart = escape(htmlPartOrig);

        let hdMeDiv = "<div class='hdMeDivCls' contenteditable='false'>"
            + revealSecColor
            + secTranition
            + mediaSection
            + "<button type='button' style='background: url(/bizzlistings/secimages/" + type + ".png); background-size: contain;' class='itmSecImg btn btn-primary' ></button>"
            + "</div>";

        document.getElementById(componentid).innerHTML = partOneHTML
            + "<div id= div-" + randomId + " contenteditable='true' data-bgcolor='#ccc' data-transition='zoom' data-autoanimate='' data-background='' data-backgroundiframe = '' data-backgroundvideo = '' class='secdiv' onmousedown=setLastFocusedDivId(this.id) > "
            + "<textarea class='secDivTextArea'  onchange='updatePreviewDiv(this)' >" + htmlPart + "</textarea><div class='secPreview'><div contenteditable='true' class='revealDummy' style=' margin: 10px;'><div class='slides'>" + htmlPartOrig + "</div></div></div>"
            + hdMeDiv
            + "<button class='deleteDivInnImg' onclick=deleteCurrentComponent(this) ></button>  </div>" + partTwoHTML;
    } else if (type == "shopName1") {

        let htmlPartOrig = '<div class="storeNmChkDiv" contenteditable="false"><input id="store-search-box" type="text" class="margin_5px" autocomplete="off" placeholder="Enter Your Store Name ">'
            + "\n" + '<button  class="button_type1" onclick="searchStoreNameItem(); return false;">Check Availability</button>'
            + "\n" + '<div class="storeNameNotAvailable displayNone scale-up-ver-top" style="animation-duration: 0.1"></div>'
            + "\n" + '<div class="storeNameAvailable displayNone scale-up-ver-top" style="animation-duration: 0.1">Store name is available. <button class="button_type1" onclick="showBanner()">Design Store banner</button></div>'
            + "\n" + '</div>';

        htmlPart = escape(htmlPartOrig);

        let hdMeDiv = "<div class='hdMeDivCls' contenteditable='false'>"
            + allowTogglePreview
            + "</div>";

        document.getElementById(componentid).innerHTML = partOneHTML
            + "<div id= div-" + randomId + " contenteditable='true' data-bgcolor='#ccc' data-transition='zoom' data-autoanimate='' data-background='' data-backgroundiframe = '' data-backgroundvideo = '' class='secdiv' onmousedown=setLastFocusedDivId(this.id) > "
            + "<textarea class='secDivTextArea'  onchange='updatePreviewDiv(this)' >" + htmlPart + "</textarea><div class='secPreview'><div contenteditable='true' class='revealDummy' style=' margin: 10px;'><div class='slides'>" + htmlPartOrig + "</div></div></div>"
            + hdMeDiv
            + "<button class='deleteDivInnImg' onclick=deleteCurrentComponent(this) ></button>  </div>" + partTwoHTML;

    } else if (type == "shopTopBanner1") {


        let htmlPartOrig = '<div class="shopTopBanner" style="margin:auto; padding-top: 100px;background-color: rgb(91, 94, 166); color: white;">'
            + "\n" + '<div style="font-size:30px" contenteditable="false" class="bannerStoreNameCls">My Store Name</div>'
            + "\n" + '</div>';


        htmlPart = escape(htmlPartOrig);

        let shopBannerTabOptions = '<div class="shopTab">'
            + '<button class="shopTablinks" onclick="openShopTab(event, ' + "'" + 'DesignOptions' + "'" + ')">Design Options</button>'
            + '<button class="shopTablinks" onclick="openShopTab(event, ' + "'" + 'Customizations' + "'" + ')">Customizations</button>'
            + '<button class="shopTablinks" onclick="openShopTab(event, ' + "'" + 'HoursDiv' + "'" + ')">Hours</button>'
            + '<button class="shopTablinks" onclick="openShopTab(event, ' + "'" + 'LocationDiv' + "'" + ')">Location</button>'
            + '<button class="shopTablinks" onclick="openShopTab(event, ' + "'" + 'AboutStoreDiv' + "'" + ')">About</button>'
            + '<button class="shopTablinks" onclick="openShopTab(event, ' + "'" + 'Close' + "'" + ')">Close</button>'
            + '</div>';

        let shopBannerTabContentDivs = '<div id="DesignOptions" class="shopTabcontent">'
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
            + '<div class="storeDescriptionCls" contenteditable="true" data-text="Write what is special about your store or the items/services you provide. (Max 1000 characters)"></div>'
            + nextShopTabBtnDiv
            + '</div>'

            + '<div id="Close" class="shopTabcontent">'
            + '</div>';


        let hdMeDiv = "<div class='hdMeDivCls' contenteditable='false'>"
            + allowTogglePreview
            + shopBannerTabOptions
            + shopBannerTabContentDivs
            + "</div>";

        let contentToAdd = "<div id= div-" + randomId + " class='shopTopBnrCls scale-in-center' style='animation-duration: 0.2' contenteditable='true' data-bgcolor='#ccc' data-transition='zoom' data-autoanimate='' data-background='' data-backgroundiframe = '' data-backgroundvideo = '' class='secdiv' onmousedown=setLastFocusedDivId(this.id) > "
            + "<textarea class='secDivTextArea'  onchange='updatePreviewDiv(this)' >" + htmlPart + "</textarea><div class='secPreview'><div contenteditable='true' class='revealDummy' style=' margin: 10px;'><div class='slides'>" + htmlPartOrig + "</div></div>"
            + hdMeDiv
            + "</div><button class='deleteDivInnImg' onclick=deleteCurrentComponent(this) ></button>  </div>";

        if (componentid == "description-shopTopBanner") {
            //document.querySelector('.secdiv').innerHTML = contentToAdd;
            if (elem == "addUndershopLyrics") {
                document.querySelector('.shopLyrics').innerHTML = document.querySelector('.shopLyrics').innerHTML + contentToAdd;

                setTimeout(function () {
                    let allItems = document.querySelectorAll(".shopTopBnrCls");
                    for (let i = 0; i < allItems.length; i++) {
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

        let htmlPartOrig = '<div class="shopTopBanner" style="margin:auto; background-image: url(&quot;/bizzlistings/img/loops-in-java-2175.png&quot;);">'
            + "\n" + '<div id="textDivId" style="padding-top: 100px; height:100%; padding:10px; text-align:left;  clip-path: polygon(0 0, 60% 0, 30% 100%, 0 100%); background-color: rgb(149, 82, 81); color: white;"><div style="font-size:30px" contenteditable="false" class="bannerStoreNameCls">My Store Name</div><div style="font-size:15px"></div></div>'
            + "\n" + '</div>';

        htmlPart = escape(htmlPartOrig);

        let shopBannerTabOptions = '<div class="shopTab">'
            + '<button class="shopTablinks" onclick="openShopTab(event, ' + "'" + 'DesignOptions' + "'" + ')">Design Options</button>'
            + '<button class="shopTablinks" onclick="openShopTab(event, ' + "'" + 'Customizations' + "'" + ')">Customizations</button>'
            + '<button class="shopTablinks" onclick="openShopTab(event, ' + "'" + 'HoursDiv' + "'" + ')">Hours</button>'
            + '<button class="shopTablinks" onclick="openShopTab(event, ' + "'" + 'LocationDiv' + "'" + ')">Location</button>'
            + '<button class="shopTablinks" onclick="openShopTab(event, ' + "'" + 'AboutStoreDiv' + "'" + ')">About</button>'
            + '<button class="shopTablinks" onclick="openShopTab(event, ' + "'" + 'Close' + "'" + ')">Close</button>'
            + '</div>';

        let shopBannerTabContentDivs = '<div id="DesignOptions" class="shopTabcontent">'
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
            + '<div class="storeDescriptionCls" contenteditable="true" data-text="Write what is special about your store or the items/services you provide. (Max 1000 characters)"></div>'
            + nextShopTabBtnDiv
            + '</div>'

            + '<div id="Close" class="shopTabcontent">'
            + '</div>';

        let hdMeDiv = "<div class='hdMeDivCls' contenteditable='false'>"
            + allowTogglePreview
            + shopBannerTabOptions
            + shopBannerTabContentDivs
            + "</div>";

        // document.getElementById(componentid).innerHTML = partOneHTML 
        //     + "<div id= div-" + randomId + " contenteditable='true' data-bgcolor='#ccc' data-transition='zoom' data-autoanimate='' data-background='' data-backgroundiframe = '' data-backgroundvideo = '' class='secdiv' onmousedown=setLastFocusedDivId(this.id) > "
        //     + "<textarea class='secDivTextArea'  onchange='updatePreviewDiv(this)' >" + htmlPart + "</textarea><div class='secPreview'><div contenteditable='true' class='revealDummy' style=' margin: 10px;'><div class='slides'>" + htmlPartOrig + "</div></div></div>"
        //     + hdMeDiv 
        //     + "<button class='deleteDivInnImg' onclick=deleteCurrentComponent(this) ></button>  </div>" + partTwoHTML;

        let contentToAdd = "<div id= div-" + randomId + " class='shopTopBnrCls scale-in-center' style='animation-duration: 0.2' contenteditable='true' data-bgcolor='#ccc' data-transition='zoom' data-autoanimate='' data-background='' data-backgroundiframe = '' data-backgroundvideo = '' class='secdiv' onmousedown=setLastFocusedDivId(this.id) > "
            + "<textarea class='secDivTextArea'  onchange='updatePreviewDiv(this)' >" + htmlPart + "</textarea><div class='secPreview'><div contenteditable='true' class='revealDummy' style=' margin: 10px;'><div class='slides'>" + htmlPartOrig + "</div></div>"
            + hdMeDiv
            + "</div><button class='deleteDivInnImg' onclick=deleteCurrentComponent(this) ></button>  </div>";

        if (componentid == "description-shopTopBanner") {
            //document.querySelector('.secdiv').innerHTML = contentToAdd;
            elem.parentElement.parentElement.parentElement.innerHTML = contentToAdd;
            setTimeout(function () {
                let allItems = document.querySelectorAll(".shopTopBnrCls");
                for (let i = 0; i < allItems.length; i++) {
                    allItems[i].classList.remove("scale-in-center");
                }
            }, 500);
        } else {
            document.getElementById(componentid).innerHTML = partOneHTML + contentToAdd + partTwoHTML;
        }

    } else if (type == "shopTopBanner3") {

        let htmlPartOrig = '<div class="shopTopBanner" style="margin:auto; background-image: url(&quot;/bizzlistings/img/loops-in-java-5681.png&quot;); ">'
            + "\n" + '<div id="textDivId" style="padding-top: 100px; height:100%; text-align:center;  clip-path: circle(30% at 50% 50%); background-color: rgb(223, 207, 190); color: black;"><div style="font-size:30px" contenteditable="false" class="bannerStoreNameCls">My Store Name</div><div style="font-size:15px"></div></div>'
            + "\n" + '</div>';       

        shopTopBanner3Updates(htmlPartOrig,componentid,AllHTML,partOneHTML,partTwoHTML, randomId, elem );

    } else if (type == "shopTopBanner3-A") {

        let htmlPartOrig = '<div class="shopTopBanner" style="margin:auto; background-image: url(&quot;/bizzlistings/img/loops-in-java-5681.png&quot;); ">'
            + "\n" + '<div id="textDivId" style="padding-top: 100px; height:100%; text-align:center;  clip-path: polygon(32% 0, 97% 0, 69% 100%, 5% 100%); background-color: rgb(151, 159, 209); color: black;"><div style="font-size:30px" contenteditable="false" class="bannerStoreNameCls">My Store Name</div><div style="font-size:15px"></div></div>'
            + "\n" + '</div>';       

        shopTopBanner3Updates(htmlPartOrig,componentid,AllHTML,partOneHTML,partTwoHTML, randomId, elem );

    }else if (type == "shopTopBanner3-B") {

        let htmlPartOrig = '<div class="shopTopBanner" style="margin:auto; background-image: url(&quot;/bizzlistings/img/loops-in-java-5681.png&quot;); ">'
            + "\n" + '<div id="textDivId" style="padding-top: 100px; height:100%; text-align:center;  clip-path: polygon(75% 0%, 87% 49%, 75% 100%, 13% 100%, 25% 50%, 15% 0); background-color: rgb(209, 151, 203); color: black;"><div style="font-size:30px" contenteditable="false" class="bannerStoreNameCls">My Store Name</div><div style="font-size:15px"></div></div>'
            + "\n" + '</div>';       

        shopTopBanner3Updates(htmlPartOrig,componentid,AllHTML,partOneHTML,partTwoHTML, randomId, elem );

    }else if (type == "shopTopBanner3-C") {

        let htmlPartOrig = '<div class="shopTopBanner" style="margin:auto; background-image: url(&quot;/bizzlistings/img/loops-in-java-5681.png&quot;); ">'
            + "\n" + '<div id="textDivId" style="padding-top: 100px; height:100%; text-align:center;  clip-path: polygon(50% 0%, 82% 49%, 50% 100%, 19% 50%); background-color: rgb(161, 209, 151); color: black;"><div style="font-size:30px" contenteditable="false" class="bannerStoreNameCls">My Store Name</div><div style="font-size:15px"></div></div>'
            + "\n" + '</div>';       

        shopTopBanner3Updates(htmlPartOrig,componentid,AllHTML,partOneHTML,partTwoHTML, randomId, elem );

    }else if (type == "shopTopBanner3-D") {

        let htmlPartOrig = '<div class="shopTopBanner" style="margin:auto; background-image: url(&quot;/bizzlistings/img/loops-in-java-5681.png&quot;); ">'
            + "\n" + '<div id="textDivId" style="padding-top: 100px; height:100%; text-align:center;  clip-path: polygon(26% 0, 75% 0%, 90% 50%, 75% 100%, 26% 100%); background-color: rgb(161, 209, 151); color: black;"><div style="font-size:30px" contenteditable="false" class="bannerStoreNameCls">My Store Name</div><div style="font-size:15px"></div></div>'
            + "\n" + '</div>';       

        shopTopBanner3Updates(htmlPartOrig,componentid,AllHTML,partOneHTML,partTwoHTML, randomId, elem );

    }else if (type == "shopTopBanner3-E") {

        let htmlPartOrig = '<div class="shopTopBanner" style="margin:auto; background-image: url(&quot;/bizzlistings/img/loops-in-java-5681.png&quot;); ">'
            + "\n" + '<div id="textDivId" style="padding-top: 100px; height:100%; text-align:center;  clip-path: polygon(25% 0%, 75% 0%, 87% 52%, 75% 100%, 25% 100%, 14% 51%); background-color: rgb(161, 209, 151); color: black;"><div style="font-size:30px" contenteditable="false" class="bannerStoreNameCls">My Store Name</div><div style="font-size:15px"></div></div>'
            + "\n" + '</div>';       

        shopTopBanner3Updates(htmlPartOrig,componentid,AllHTML,partOneHTML,partTwoHTML, randomId, elem );

    }else if (type == "shopTopBanner3-F") {

        let htmlPartOrig = '<div class="shopTopBanner" style="margin:auto; background-image: url(&quot;/bizzlistings/img/loops-in-java-5681.png&quot;); ">'
            + "\n" + '<div id="textDivId" style="padding-top: 100px; height:100%; text-align:center;  clip-path: polygon(33% 0, 68% 0, 87% 23%, 87% 82%, 70% 100%, 31% 100%, 13% 78%, 13% 23%); background-color: rgb(161, 209, 151); color: black;"><div style="font-size:30px" contenteditable="false" class="bannerStoreNameCls">My Store Name</div><div style="font-size:15px"></div></div>'
            + "\n" + '</div>';       

        shopTopBanner3Updates(htmlPartOrig,componentid,AllHTML,partOneHTML,partTwoHTML, randomId, elem );

    }else if (type == "shopTopBanner3-G") {

        let htmlPartOrig = '<div class="shopTopBanner" style="margin:auto; background-image: url(&quot;/bizzlistings/img/loops-in-java-5681.png&quot;); ">'
            + "\n" + '<div id="textDivId" style="padding-top: 100px; height:100%; text-align:center;  clip-path: circle(50% at 50% 50%); background-color: rgb(161, 209, 151); color: black;"><div style="font-size:30px" contenteditable="false" class="bannerStoreNameCls">My Store Name</div><div style="font-size:15px"></div></div>'
            + "\n" + '</div>';       

        shopTopBanner3Updates(htmlPartOrig,componentid,AllHTML,partOneHTML,partTwoHTML, randomId, elem );

    }else if (type == "shopTopBanner3-H") {

        let htmlPartOrig = '<div class="shopTopBanner" style="margin:auto; background-image: url(&quot;/bizzlistings/img/loops-in-java-5681.png&quot;); ">'
            + "\n" + '<div id="textDivId" style="padding-top: 100px; height:100%; text-align:center;  clip-path: inset(25% 15% 41% 15%); background-color: rgb(161, 209, 151); color: black;"><div style="font-size:30px" contenteditable="false" class="bannerStoreNameCls">My Store Name</div><div style="font-size:15px"></div></div>'
            + "\n" + '</div>';       

        shopTopBanner3Updates(htmlPartOrig,componentid,AllHTML,partOneHTML,partTwoHTML, randomId, elem );

    }else if (type == "shopTopBanner4") {

        let htmlPartOrig = '<div class="shopTopBanner" style="margin:auto; padding:10px; background-image: url(&quot;/bizzlistings/img/loops-in-java-5570.png&quot;); ">'
            + "\n" + '<div id="textDivId" class="semiTransparentBlackBG boxShadow5" style=" opacity: 0.7;  padding:20px; text-align:center; width:80%;  margin:40px auto ;  border-radius: 20px;"><div style="font-size:30px" contenteditable="false" class="bannerStoreNameCls">My Store Name</div><div style="font-size:15px"></div></div>'
            + "\n" + '</div>';

        htmlPart = escape(htmlPartOrig);

        let shopBannerTabOptions = '<div class="shopTab">'
            + '<button class="shopTablinks" onclick="openShopTab(event, ' + "'" + 'DesignOptions' + "'" + ')">Design Options</button>'
            + '<button class="shopTablinks" onclick="openShopTab(event, ' + "'" + 'Customizations' + "'" + ')">Customizations</button>'
            + '<button class="shopTablinks" onclick="openShopTab(event, ' + "'" + 'HoursDiv' + "'" + ')">Hours</button>'
            + '<button class="shopTablinks" onclick="openShopTab(event, ' + "'" + 'LocationDiv' + "'" + ')">Location</button>'
            + '<button class="shopTablinks" onclick="openShopTab(event, ' + "'" + 'AboutStoreDiv' + "'" + ')">About</button>'
            + '<button class="shopTablinks" onclick="openShopTab(event, ' + "'" + 'Close' + "'" + ')">Close</button>'
            + '</div>';

        let shopBannerTabContentDivs = '<div id="DesignOptions" class="shopTabcontent">'
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
            + '<div class="storeDescriptionCls" contenteditable="true" data-text="Write what is special about your store or the items/services you provide. (Max 1000 characters)"></div>'
            + nextShopTabBtnDiv
            + '</div>'

            + '<div id="Close" class="shopTabcontent">'
            + '</div>';

        let hdMeDiv = "<div class='hdMeDivCls' contenteditable='false'>"
            + allowTogglePreview
            + shopBannerTabOptions
            + shopBannerTabContentDivs
            + "</div>";

        let contentToAdd = "<div id= div-" + randomId + " class='shopTopBnrCls scale-in-center' style='animation-duration: 0.2' contenteditable='true' data-bgcolor='#ccc' data-transition='zoom' data-autoanimate='' data-background='' data-backgroundiframe = '' data-backgroundvideo = '' class='secdiv' onmousedown=setLastFocusedDivId(this.id) > "
            + "<textarea class='secDivTextArea'  onchange='updatePreviewDiv(this)' >" + htmlPart + "</textarea><div class='secPreview'><div contenteditable='true' class='revealDummy' style=' margin: 10px;'><div class='slides'>" + htmlPartOrig + "</div></div>"
            + hdMeDiv
            + "</div><button class='deleteDivInnImg' onclick=deleteCurrentComponent(this) ></button>  </div>";

        if (componentid == "description-shopTopBanner") {
            //document.querySelector('.secdiv').innerHTML = contentToAdd;
            elem.parentElement.parentElement.parentElement.innerHTML = contentToAdd;

            setTimeout(function () {
                let allItems = document.querySelectorAll(".shopTopBnrCls");
                for (let i = 0; i < allItems.length; i++) {
                    allItems[i].classList.remove("scale-in-center");
                }
            }, 500);

        } else {
            document.getElementById(componentid).innerHTML = partOneHTML + contentToAdd + partTwoHTML;
        }

    } else if (type == "shopItem1") {

        let htmlPartOrig = '<div class="shopItemCls1" >'
            + "\n" + itemImagesDiv
            + "\n" + '</div>';


        htmlPart = escape(htmlPartOrig);

        let hdMeDiv = "<div class='hdMeDivCls' contenteditable='false'>"
            + allowTogglePreview
            + shopItemTabOptions
            + shopItemTabContentDivs
            + "</div>";

        let contentToAdd = "<div id= div-" + randomId + " class='shopItemCls scale-in-center' style='animation-duration: 0.2' contenteditable='true' data-bgcolor='#ccc' data-transition='zoom' data-autoanimate='' data-background='' data-backgroundiframe = '' data-backgroundvideo = '' class='secdiv storeItemDivCls' onmousedown=setLastFocusedDivId(this.id) > "
            + "<textarea class='secDivTextArea'  onchange='updatePreviewDiv(this)' >" + htmlPart + "</textarea><div class='secPreview'><div contenteditable='true' class='revealDummy' style=' margin: 10px;'><div class='slides'>" + htmlPartOrig + "</div></div>"
            + hdMeDiv
            + "</div><button class='deleteDivInnImg' onclick=deleteCurrentComponent(this) ></button>  </div>";

        if (elem == "addUndershopLyrics") {
            document.querySelector('.shopLyrics').innerHTML = document.querySelector('.shopLyrics').innerHTML + contentToAdd;


            setTimeout(function () {
                let allItems = document.querySelectorAll(".shopItemCls");
                for (let i = 0; i < allItems.length; i++) {
                    allItems[i].classList.remove("scale-in-center");
                }
            }, 500);
        } else {
            document.getElementById(componentid).innerHTML = partOneHTML + contentToAdd + partTwoHTML;
        }


    } else if (type == "secTitleWithBG") {

        let htmlPartOrig = "<div class='slidingUp10px' style='background: #F6DA66; padding: 20px; border-radius: 20px; margin:auto; width:50%; margin-top: 100px'>"
            + "\n" + "Add Title "
            + "\n" + "</div>";

        htmlPart = escape(htmlPartOrig);

        let hdMeDiv = "<div class='hdMeDivCls' contenteditable='false'>"
            + revealSecColor
            + secTranition
            + mediaSection
            + "<button type='button' style='background: url(/bizzlistings/secimages/" + type + ".png); background-size: contain;' class='itmSecImg btn btn-primary' ></button>"
            + "</div>";

        document.getElementById(componentid).innerHTML = partOneHTML
            + "<div id= div-" + randomId + " contenteditable='true' data-bgcolor='#ccc' data-transition='zoom' data-autoanimate='' data-background='' data-backgroundiframe = '' data-backgroundvideo = '' class='secdiv' onmousedown=setLastFocusedDivId(this.id) > "
            + "<textarea class='secDivTextArea'  onchange='updatePreviewDiv(this)' >" + htmlPart + "</textarea><div class='secPreview'><div contenteditable='true' class='revealDummy' style=' margin: 10px;'><div class='slides'>" + htmlPartOrig + "</div></div></div>"
            + hdMeDiv
            + "<button class='deleteDivInnImg' onclick=deleteCurrentComponent(this) ></button>  </div>" + partTwoHTML;
    } else if (type == "SemiTransBG") {

        let htmlPartOrig = "<div class='slidingUp10px semiTransparentWhiteBG boxShadow5' style='opacity: 0.5; padding: 20px; border-radius: 20px; margin:auto; width:50%; margin-top: 100px'>"
            + "\n" + "Add Title "
            + "\n" + "</div>";

        htmlPart = escape(htmlPartOrig);

        let hdMeDiv = "<div class='hdMeDivCls' contenteditable='false'>"
            + revealSecColor
            + secTranition
            + mediaSection
            + "<button type='button' style='background: url(/bizzlistings/secimages/" + type + ".png); background-size: contain;' class='itmSecImg btn btn-primary' ></button>"
            + "</div>";

        document.getElementById(componentid).innerHTML = partOneHTML
            + "<div id= div-" + randomId + " contenteditable='true' data-bgcolor='#ccc' data-transition='zoom' data-autoanimate='' data-background='' data-backgroundiframe = '' data-backgroundvideo = '' class='secdiv' onmousedown=setLastFocusedDivId(this.id) > "
            + "<textarea class='secDivTextArea'  onchange='updatePreviewDiv(this)' >" + htmlPart + "</textarea><div class='secPreview'><div contenteditable='true' class='revealDummy' style=' margin: 10px;'><div class='slides'>" + htmlPartOrig + "</div></div></div>"
            + hdMeDiv
            + "<button class='deleteDivInnImg' onclick=deleteCurrentComponent(this) ></button>  </div>" + partTwoHTML;
    } else if (type == "SemiTransBG2") {

        let htmlPartOrig = "<div class='slidingUp10px semiTransparentBlackBG boxShadow5' style='opacity: 0.5; padding: 20px; border-radius: 20px; margin:auto; width:80%; margin-top: 10px'>"
            + "\n" + "Add Title "
            + "\n" + "</div>";

        htmlPart = escape(htmlPartOrig);

        let hdMeDiv = "<div class='hdMeDivCls' contenteditable='false'>"
            + revealSecColor
            + secTranition
            + mediaSection
            + "<button type='button' style='background: url(/bizzlistings/secimages/" + type + ".png); background-size: contain;' class='itmSecImg btn btn-primary' ></button>"
            + "</div>";

        document.getElementById(componentid).innerHTML = partOneHTML
            + "<div id= div-" + randomId + " contenteditable='true' data-bgcolor='#ccc' data-transition='zoom' data-autoanimate='' data-background='' data-backgroundiframe = '' data-backgroundvideo = '' class='secdiv' onmousedown=setLastFocusedDivId(this.id) > "
            + "<textarea class='secDivTextArea'  onchange='updatePreviewDiv(this)' >" + htmlPart + "</textarea><div class='secPreview'><div contenteditable='true' class='revealDummy' style=' margin: 10px;'><div class='slides'>" + htmlPartOrig + "</div></div></div>"
            + hdMeDiv
            + "<button class='deleteDivInnImg' onclick=deleteCurrentComponent(this) ></button>  </div>" + partTwoHTML;

    } else if (type == "secWithList1") {
        let htmlPartOrig = '<div class="fragment slideFragmentUp600px itemsWithBG" style=" background-color: #C3447A; color:#fff; margin-top:20px;">1. ABC</div>'
            + "\n" + '<div class="fragment slideFragmentUp600px itemsWithBG" style=" background-color: #C3447A; color:#fff;">2. ABC</div>'
            + "\n" + '<div class="fragment slideFragmentUp600px itemsWithBG" style=" background-color: #C3447A; color:#fff;">3. ABC</div>'
            + "\n" + '<div class="fragment slideFragmentUp600px itemsWithBG" style=" background-color: #C3447A; color:#fff;">4. ABC</div>'
            + "\n" + '<div class="fragment slideFragmentUp600px itemsWithBG" style=" background-color: #C3447A; color:#fff;">5. ABC</div>';
        htmlPart = escape(htmlPartOrig);

        let hdMeDiv = "<div class='hdMeDivCls' contenteditable='false'>"
            + revealSecColor
            + secTranition
            + mediaSection
            + "<button type='button' style='background: url(/bizzlistings/secimages/" + type + ".png); background-size: contain;' class='itmSecImg btn btn-primary' ></button>"
            + "</div>";

        document.getElementById(componentid).innerHTML = partOneHTML
            + "<div id= div-" + randomId + " contenteditable='true' data-bgcolor='#ccc' data-transition='zoom' data-autoanimate='' data-background='' data-backgroundiframe = '' data-backgroundvideo = '' class='secdiv' onmousedown=setLastFocusedDivId(this.id) > "
            + "<textarea class='secDivTextArea'  onchange='updatePreviewDiv(this)' >" + htmlPart + "</textarea><div class='secPreview'><div contenteditable='true' class='revealDummy' style=' margin: 10px;'><div class='slides'>" + htmlPartOrig + "</div></div></div>"
            + hdMeDiv
            + "<button class='deleteDivInnImg' onclick=deleteCurrentComponent(this) ></button>  </div>" + partTwoHTML;

    } else if (type == "titleWithItems1") {
        let htmlPartOrig = '<div style="top: 5px; display:block; background-color: #5B5EA6; margin: auto; padding: 20px;">'
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
        let hdMeDiv = "<div class='hdMeDivCls' contenteditable='false'>"
            + revealSecColor
            + secTranition
            + mediaSection
            + "<button type='button' style='background: url(/bizzlistings/secimages/" + type + ".png); background-size: contain;' class='itmSecImg btn btn-primary' ></button>"
            + "</div>";

        document.getElementById(componentid).innerHTML = partOneHTML
            + "<div id= div-" + randomId + " contenteditable='true' data-bgcolor='#ccc' data-transition='zoom' data-autoanimate='' data-background='' data-backgroundiframe = '' data-backgroundvideo = '' class='secdiv' onmousedown=setLastFocusedDivId(this.id) > "
            + "<textarea class='secDivTextArea'  onchange='updatePreviewDiv(this)' >" + htmlPart + "</textarea><div class='secPreview'><div contenteditable='true' class='revealDummy' style=' margin: 10px;'><div class='slides'>" + htmlPartOrig + "</div></div></div>"
            + hdMeDiv
            + "<button class='deleteDivInnImg' onclick=deleteCurrentComponent(this) ></button>  </div>" + partTwoHTML;

    } else if (type == "titleWithItems2") {
        let htmlPartOrig = '<div style="height: 900px;">'
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
        let hdMeDiv = "<div class='hdMeDivCls' contenteditable='false'>"
            + revealSecColor
            + secTranition
            + mediaSection
            + "<button type='button' style='background: url(/bizzlistings/secimages/" + type + ".png); background-size: contain;' class='itmSecImg btn btn-primary' ></button>"
            + "</div>";

        document.getElementById(componentid).innerHTML = partOneHTML
            + "<div id= div-" + randomId + " contenteditable='true' data-bgcolor='#ccc' data-transition='zoom' data-autoanimate='' data-background='' data-backgroundiframe = '' data-backgroundvideo = '' class='secdiv' onmousedown=setLastFocusedDivId(this.id) > "
            + "<textarea class='secDivTextArea'  onchange='updatePreviewDiv(this)' >" + htmlPart + "</textarea><div class='secPreview'><div contenteditable='true' class='revealDummy' style=' margin: 10px;'><div class='slides'>" + htmlPartOrig + "</div></div></div>"
            + hdMeDiv
            + "<button class='deleteDivInnImg' onclick=deleteCurrentComponent(this) ></button>  </div>" + partTwoHTML;

    } else if (type == "titleWithItems3") {
        let htmlPartOrig = '<div style="height: 900px;">'
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
        let hdMeDiv = "<div class='hdMeDivCls' contenteditable='false'>"
            + revealSecColor
            + secTranition
            + mediaSection
            + "<button type='button' style='background: url(/bizzlistings/secimages/" + type + ".png); background-size: contain;' class='itmSecImg btn btn-primary' ></button>"
            + "</div>";

        document.getElementById(componentid).innerHTML = partOneHTML
            + "<div id= div-" + randomId + " contenteditable='true' data-bgcolor='#ccc' data-transition='zoom' data-autoanimate='' data-background='' data-backgroundiframe = '' data-backgroundvideo = '' class='secdiv' onmousedown=setLastFocusedDivId(this.id) > "
            + "<textarea class='secDivTextArea'  onchange='updatePreviewDiv(this)' >" + htmlPart + "</textarea><div class='secPreview'><div contenteditable='true' class='revealDummy' style=' margin: 10px;'><div class='slides'>" + htmlPartOrig + "</div></div></div>"
            + hdMeDiv
            + "<button class='deleteDivInnImg' onclick=deleteCurrentComponent(this) ></button>  </div>" + partTwoHTML;


    } else if (type == "zoomingImage1") {
        let htmlPartOrig = '<img class="zoomingImg" style="animation-duration: 4s;" src="/bizzlistings/img/animaker-test9-1414.png">';
        htmlPart = escape(htmlPartOrig);
        let hdMeDiv = "<div class='hdMeDivCls' contenteditable='false'>"
            + revealSecColor
            + secTranition
            + mediaSection
            + "<button type='button' style='background: url(/bizzlistings/secimages/" + type + ".png); background-size: contain;' class='itmSecImg btn btn-primary' ></button>"
            + "</div>";

        document.getElementById(componentid).innerHTML = partOneHTML
            + "<div id= div-" + randomId + " contenteditable='true' data-bgcolor='#ccc' data-transition='zoom' data-autoanimate='' data-background='' data-backgroundiframe = '' data-backgroundvideo = '' class='secdiv' onmousedown=setLastFocusedDivId(this.id) > "
            + "<textarea class='secDivTextArea'  onchange='updatePreviewDiv(this)' >" + htmlPart + "</textarea><div class='secPreview'><div contenteditable='true' class='revealDummy' style=' margin: 10px;'><div class='slides'>" + htmlPartOrig + "</div></div></div>"
            + hdMeDiv
            + "<button class='deleteDivInnImg' onclick=deleteCurrentComponent(this) ></button>  </div>" + partTwoHTML;

    } else if (type == "titleTextCode1") {
        let htmlPartOrig = '<div style="height: 900px;">'
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
        let hdMeDiv = "<div class='hdMeDivCls' contenteditable='false'>"
            + revealSecColor
            + secTranition
            + mediaSection
            + "<button type='button' style='background: url(/bizzlistings/secimages/" + type + ".png); background-size: contain;' class='itmSecImg btn btn-primary' ></button>"
            + "</div>";

        document.getElementById(componentid).innerHTML = partOneHTML
            + "<div id= div-" + randomId + " contenteditable='true' data-bgcolor='#ccc' data-transition='zoom' data-autoanimate='' data-background='' data-backgroundiframe = '' data-backgroundvideo = '' class='secdiv' onmousedown=setLastFocusedDivId(this.id) > "
            + "<textarea class='secDivTextArea'  onchange='updatePreviewDiv(this)' >" + htmlPart + "</textarea><div class='secPreview'><div contenteditable='true' class='revealDummy' style=' margin: 10px;'><div class='slides'>" + htmlPartOrig + "</div></div></div>"
            + hdMeDiv
            + "<button class='deleteDivInnImg' onclick=deleteCurrentComponent(this) ></button>  </div>" + partTwoHTML;

    } else if (type == "titleTextCode2") {
        let htmlPartOrig = '<div class="fragment infoBox">Title</div>'
            + "\n" + '<div class="fragment fr-bounce-in-top codeBox5" style="animation-duration: 1s;">'
            + "\n" + 'int x = 10;'
            + "\n" + '</div>';
        //htmlPartOrig = "Test";
        htmlPart = escape(htmlPartOrig);
        let hdMeDiv = "<div class='hdMeDivCls' contenteditable='false'>"
            + revealSecColor
            + secTranition
            + mediaSection
            + "<button type='button' style='background: url(/bizzlistings/secimages/" + type + ".png); background-size: contain;' class='itmSecImg btn btn-primary' ></button>"
            + "</div>";

        document.getElementById(componentid).innerHTML = partOneHTML
            + "<div id= div-" + randomId + " contenteditable='true' data-bgcolor='#ccc' data-transition='zoom' data-autoanimate='' data-background='' data-backgroundiframe = '' data-backgroundvideo = '' class='secdiv' onmousedown=setLastFocusedDivId(this.id) > "
            + "<textarea class='secDivTextArea'  onchange='updatePreviewDiv(this)' >" + htmlPart + "</textarea><div class='secPreview'><div contenteditable='true' class='revealDummy' style=' margin: 10px;'><div class='slides'>" + htmlPartOrig + "</div></div></div>"
            + hdMeDiv
            + "<button class='deleteDivInnImg' onclick=deleteCurrentComponent(this) ></button>  </div>" + partTwoHTML;

    } else if (type == "quizMCQFullScreen") {
        let htmlPartOrig = '<div style="top: 0px; display:block; background-color: #5B5EA6; margin: auto; padding: 4%;">'
            + "\n" + '<div class="fragment slideFragmentUp10px" style="color:#fff; font-size: x-large; text-align:left">Heading</div>'
            + "\n" + '</div>'

            + "\n" + '<div class="fragment slideFragmentUp600px  boxShadow5 ansOption" style=" margin: auto; width:90%; margin-top:1%;  font-size: x-large;  background-color: #EA6A47; color:#fff; padding:1%;">2. ABC<audio><source data-src="/bizzlistings/sounds/arrow-whoosh.wav" type="audio/wav"><source data-src="/bizzlistings/sounds/arrow-whoosh.mp3" type="audio/mp3"></audio></div>'
            + "\n" + '<div class="fragment slideFragmentUp600px boxShadow5 ansOption" style=" margin: auto; width:90%; margin-top:1%;  font-size: x-large; background-color: #EA6A47; color:#fff; padding:1%;">3. ABC<audio><source data-src="/bizzlistings/sounds/arrow-whoosh.wav" type="audio/wav"><source data-src="/bizzlistings/sounds/arrow-whoosh.mp3" type="audio/mp3"></audio></div>'
            + "\n" + '<div class="fragment slideFragmentUp600px boxShadow5 ansOption" style=" margin: auto; width:90%; margin-top:1%;  font-size: x-large; background-color: #EA6A47; color:#fff; padding:1%;">4. ABC<audio><source data-src="/bizzlistings/sounds/arrow-whoosh.wav" type="audio/wav"><source data-src="/bizzlistings/sounds/arrow-whoosh.mp3" type="audio/mp3"></audio></div>'
            + "\n" + '<div class="fragment slideFragmentUp600px boxShadow5 ansOption" style=" margin: auto; width:90%; margin-top:1%;  font-size: x-large; background-color: #EA6A47; color:#fff; padding:1%;">5. ABC<audio><source data-src="/bizzlistings/sounds/arrow-whoosh.wav" type="audio/wav"><source data-src="/bizzlistings/sounds/arrow-whoosh.mp3" type="audio/mp3"></audio></div>'

            + "\n" + '<div  class="fragment countDown5" style="background:#000; color:#fff; opacity: 0.4 ; width: 4%; border-radius: 10px; position: absolute; top: 1%; right: 1%">5</div>'
            + "\n" + '<div  class="fragment showRightAns" data-ans="3. ABC"><audio><source data-src="/bizzlistings/sounds/bell-ding-586.wav" type="audio/wav"><source data-src="/bizzlistings/sounds/bell-ding-586.mp3" type="audio/mp3"></audio></div>';

        //htmlPartOrig = "Test";
        htmlPart = escape(htmlPartOrig);
        let hdMeDiv = "<div class='hdMeDivCls' contenteditable='false'>"
            + revealSecColor
            + secTranition
            + mediaSection
            + "<button type='button' style='background: url(/bizzlistings/secimages/" + type + ".png); background-size: contain;' class='itmSecImg btn btn-primary' ></button>"
            + "</div>";

        document.getElementById(componentid).innerHTML = partOneHTML
            + "<div id= div-" + randomId + " contenteditable='true' data-bgcolor='#ccc' data-transition='zoom' data-autoanimate='' data-background='' data-backgroundiframe = '' data-backgroundvideo = '' class='secdiv' onmousedown=setLastFocusedDivId(this.id) > "
            + "<textarea class='secDivTextArea'  onchange='updatePreviewDiv(this)' >" + htmlPart + "</textarea><div class='secPreview'><div contenteditable='true' class='revealDummy' style=' margin: 10px;'><div class='slides'>" + htmlPartOrig + "</div></div></div>"
            + hdMeDiv
            + "<button class='deleteDivInnImg' onclick=deleteCurrentComponent(this) ></button>  </div>" + partTwoHTML;

    } else if (type == "quizMCQFullScreenLow") {
        let htmlPartOrig = '<div style="top: 0px; display:block; background-color: #5B5EA6; margin: auto; padding: 4%;">'
            + "\n" + '<div class="fragment slideFragmentUp10px" style="color:#fff; font-size: x-large; text-align:left">Heading</div>'
            + "\n" + '</div>'

            + "\n" + '<div class="fragment slideFragmentUp600px  boxShadow5 ansOption" style=" margin: auto; width:90%; margin-top:1%;  font-size: x-large;  background-color: #EA6A47; color:#fff; padding:1%;">2. ABC<audio><source data-src="/bizzlistings/sounds/low-arrow-whoosh.wav" type="audio/wav"><source data-src="/bizzlistings/sounds/low-arrow-whoosh.mp3" type="audio/mp3"></audio></div>'
            + "\n" + '<div class="fragment slideFragmentUp600px boxShadow5 ansOption" style=" margin: auto; width:90%; margin-top:1%;  font-size: x-large; background-color: #EA6A47; color:#fff; padding:1%;">3. ABC<audio><source data-src="/bizzlistings/sounds/low-arrow-whoosh.wav" type="audio/wav"><source data-src="/bizzlistings/sounds/low-arrow-whoosh.mp3" type="audio/mp3"></audio></div>'
            + "\n" + '<div class="fragment slideFragmentUp600px boxShadow5 ansOption" style=" margin: auto; width:90%; margin-top:1%;  font-size: x-large; background-color: #EA6A47; color:#fff; padding:1%;">4. ABC<audio><source data-src="/bizzlistings/sounds/low-arrow-whoosh.wav" type="audio/wav"><source data-src="/bizzlistings/sounds/low-arrow-whoosh.mp3" type="audio/mp3"></audio></div>'
            + "\n" + '<div class="fragment slideFragmentUp600px boxShadow5 ansOption" style=" margin: auto; width:90%; margin-top:1%;  font-size: x-large; background-color: #EA6A47; color:#fff; padding:1%;">5. ABC<audio><source data-src="/bizzlistings/sounds/low-arrow-whoosh.wav" type="audio/wav"><source data-src="/bizzlistings/sounds/low-arrow-whoosh.mp3" type="audio/mp3"></audio></div>'

            + "\n" + '<div  class="fragment countDown5" style="background:#000; color:#fff; opacity: 0.4 ; width: 4%; border-radius: 10px; position: absolute; top: 1%; right: 1%">5</div>'
            + "\n" + '<div  class="fragment showRightAns" data-ans="3. ABC"><audio><source data-src="/bizzlistings/sounds/low-bell-ding.wav" type="audio/wav"><source data-src="/bizzlistings/sounds/low-bell-ding.mp3" type="audio/mp3"></audio></div>';

        //htmlPartOrig = "Test";
        htmlPart = escape(htmlPartOrig);
        let hdMeDiv = "<div class='hdMeDivCls' contenteditable='false'>"
            + revealSecColor
            + secTranition
            + mediaSection
            + "<button type='button' style='background: url(/bizzlistings/secimages/" + type + ".png); background-size: contain;' class='itmSecImg btn btn-primary' ></button>"
            + "</div>";

        document.getElementById(componentid).innerHTML = partOneHTML
            + "<div id= div-" + randomId + " contenteditable='true' data-bgcolor='#ccc' data-transition='zoom' data-autoanimate='' data-background='' data-backgroundiframe = '' data-backgroundvideo = '' class='secdiv' onmousedown=setLastFocusedDivId(this.id) > "
            + "<textarea class='secDivTextArea'  onchange='updatePreviewDiv(this)' >" + htmlPart + "</textarea><div class='secPreview'><div contenteditable='true' class='revealDummy' style=' margin: 10px;'><div class='slides'>" + htmlPartOrig + "</div></div></div>"
            + hdMeDiv
            + "<button class='deleteDivInnImg' onclick=deleteCurrentComponent(this) ></button>  </div>" + partTwoHTML;


    } else if (type == "zoomingImage1") {
        let htmlPartOrig = '<img class="zoomingImg" style="animation-duration: 4s;" src="/bizzlistings/img/animaker-test9-1414.png">';
        htmlPart = escape(htmlPartOrig);
        let hdMeDiv = "<div class='hdMeDivCls' contenteditable='false'>"
            + revealSecColor
            + secTranition
            + mediaSection
            + "<button type='button' style='background: url(/bizzlistings/secimages/" + type + ".png); background-size: contain;' class='itmSecImg btn btn-primary' ></button>"
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
        let htmlToInsert = "<audio>"
            + "<source data-src='/bizzlistings/sounds/" + type + ".wav' type='audio/wav'>"
            + "<source data-src='/bizzlistings/sounds/" + type + ".mp3' type='audio/mp3'>"
            + "</audio>";
        insertHTMLAtCaret(escape(htmlToInsert));
    } else if (type == "code-snippet") {
        let htmlToInsert = "<div class='quizCode'>"
            + "<pre><code data-trim data-noescape>"
            + "int i = 0;"
            + "</code></pre></div>";
        insertHTMLAtCaret(escape(htmlToInsert));
    } else if (type == "secDivText1") {
        let hdMeDiv = "<div class='hdMeDivCls' contenteditable='false'>"
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
        let htmlToInsert = "<div id= div-" + randomId + " contenteditable='true' class='sectxt' onmousedown=setLastFocusedDivId(this.id) > Text1 Inside SectionDiv " + hdMeDiv + "<button class='deleteDivInnImg' onclick=deleteCurrentComponent(this) ></button>  </div>";
        insertHTMLAtCaret(htmlToInsert);
    }

    // setTimeout(function() {
    //     showitemImages(itemImageIndex);
    // }, 1000);


}

function shopTopBanner3Updates(htmlPartOrig,componentid,AllHTML,partOneHTML,partTwoHTML, randomId, elem){
    
    htmlPart = escape(htmlPartOrig);

    let shopBannerTabOptions = '<div class="shopTab">'
        + '<button class="shopTablinks" onclick="openShopTab(event, ' + "'" + 'DesignOptions' + "'" + ')">Design Options</button>'
        + '<button class="shopTablinks" onclick="openShopTab(event, ' + "'" + 'Customizations' + "'" + ')">Customizations</button>'
        + '<button class="shopTablinks" onclick="openShopTab(event, ' + "'" + 'HoursDiv' + "'" + ')">Hours</button>'
        + '<button class="shopTablinks" onclick="openShopTab(event, ' + "'" + 'LocationDiv' + "'" + ')">Location</button>'
        + '<button class="shopTablinks" onclick="openShopTab(event, ' + "'" + 'AboutStoreDiv' + "'" + ')">About</button>'
        + '<button class="shopTablinks" onclick="openShopTab(event, ' + "'" + 'Close' + "'" + ')">Close</button>'
        + '</div>';

    let shopBannerTabContentDivs = '<div id="DesignOptions" class="shopTabcontent">'
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
        + '<div class="storeDescriptionCls" contenteditable="true" data-text="Write what is special about your store or the items/services you provide. (Max 1000 characters)"></div>'
        + nextShopTabBtnDiv
        + '</div>'

        + '<div id="Close" class="shopTabcontent">'
        + '</div>';


    let hdMeDiv = "<div class='hdMeDivCls' contenteditable='false'>"
        + allowTogglePreview
        + shopBannerTabOptions
        + shopBannerTabContentDivs
        + "</div>";

    let contentToAdd = "<div id= div-" + randomId + " class='shopTopBnrCls scale-in-center' style='animation-duration: 0.2' contenteditable='true' data-bgcolor='#ccc' data-transition='zoom' data-autoanimate='' data-background='' data-backgroundiframe = '' data-backgroundvideo = '' class='secdiv' onmousedown=setLastFocusedDivId(this.id) > "
        + "<textarea class='secDivTextArea'  onchange='updatePreviewDiv(this)' >" + htmlPart + "</textarea><div class='secPreview'><div contenteditable='true' class='revealDummy' style=' margin: 10px;'><div class='slides'>" + htmlPartOrig + "</div></div>"
        + hdMeDiv
        + "</div><button class='deleteDivInnImg' onclick=deleteCurrentComponent(this) ></button>  </div>";

    if (componentid == "description-shopTopBanner") {
        //document.querySelector('.secdiv').innerHTML = contentToAdd;
        elem.parentElement.parentElement.parentElement.innerHTML = contentToAdd;
        setTimeout(function () {
            let allItems = document.querySelectorAll(".shopTopBnrCls");
            for (let i = 0; i < allItems.length; i++) {
                allItems[i].classList.remove("scale-in-center");
            }
        }, 500);
    } else {
        document.getElementById(componentid).innerHTML = partOneHTML + contentToAdd + partTwoHTML;
    }
}


function myStore() {

    if (localStorage.getItem("userLoggedIn") == "n") {

        // let x = document.getElementById("toastsnackbar_center");
        // x.innerHTML = "Please <a class='loginLinkCls' href='javascript:goToLogin()'>LOG IN</a> to create or access your store <div class='float_right marginleft_5px hover_pointer' onclick='hideParentToastDiv(this)'><i class='fa fa-window-close'></i> </div>" ;
        // x.style.display = "block";
        // Show('login');

        let x = document.getElementById("toastsnackbar");
        x.innerHTML = "Login to create or access your store";
        x.classList.add("show");
        setTimeout(function () { 
            x.classList.remove("show");
        }, 3000);

        Show('login');

        //DONOTDELETE
        // setTimeout(() => {
        //     x.style.display = "none";
        // }, 5000);

        return;

    } else {
        $.ajax({
            url: the.hosturl + '/php/process.php',
            data: { usrfunction: "checklogin" },
            type: 'POST',
            dataType: 'json',
            success: function (retstatus) {
                if (retstatus == "err") {
                    //alert("Please relogin");
                    goToLogin();
                }else{
                    document.getElementById("loginDivId").style.display = "none";
                    document.getElementById("contactusDivId").style.display = "none";
                    document.getElementById("howtoDivId").style.display = "none";
                    document.getElementById("homeDivId").style.display = "none";
                
                
                    //document.getElementById("helpDisplayDivId").style.display = "none";
                
                    
                    document.getElementById("mainContainer").style.width = "100%";
                
                    document.getElementById("itemDivId").style.display = "none";
                    document.getElementById("itemListDivId").style.display = "none";
                    document.getElementById("itemEditDivId").style.display = "none";
                    
                    checkMyStores();

                    // let tags = localStorage.getItem("storeinfo")
                    // if ((tags != null) && (tags != undefined)) {
                    //     if ((tags != "") && (tags != "null")) {
                    //         if (tags == "n"){
                    //             getCreateStore();
                    //             return;
                    //         }
                    //     }
                    // }
                
                
                    // tags = localStorage.getItem("mystoreitemsList")
                
                    // if (tags != null) {
                    //     if ((tags != "") && (tags != "null")) {
                    //         populateMyStore(JSON.parse(tags));
                    //         return;
                    //     }
                    // }
                
                    // $.ajax({
                    //     url: the.hosturl + '/php/process.php',
                    //     type: 'POST',
                    //     data: jQuery.param({
                    //         usrfunction: "getmystorenitems"
                    //     }),
                    //     contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                    //     success: function (response) {
                    //         //localStorage.setItem("mystoreitemsList", JSON.stringify(response));
                    //         //localStorage.setItem("mystoreitemsList", response);
                    //         populateMyStore(JSON.parse(response));
                    //     },
                    //     error: function (xhr, status, error) {
                    //         // console.log(error);
                    //         // console.log(xhr);
                    //     }
                    // });
                
                }
            },
            error: function (xhr, status, error) {
                //console.log("")
            }
        });        
    }


}

function checkMyStores(){
    removeActiveClassFromNavLinks();
    let x = document.getElementById("mystoreLinkId");
    x.classList.add("active");

    $.ajax({
        url: the.hosturl + '/php/process.php',
        data: { usrfunction: "checkmystores" },
        type: 'POST',
        dataType: 'json',
        success: function (response) {
            //sessionStorage.setItem("itemsList", JSON.stringify(JSON.stringify(response)));
            // setTimeout(() => {
            //     populateItemDropDown();
            // }, 10);

            populateStoresList(response);
        },
        error: function (xhr, status, error) {
            //alert(xhr);
            console.log(error);
            console.log(xhr);
        }
    });

}

function populateStoresList(rows = "") {

    let innerHTML = "<div class='ContainerType_1'>";
    let path = window.location.pathname;

    for (let record of rows) {


        let category = record.category;
        let title = record.title;
        let city_state_country = record.city_state_country;
        let lastupdatedate = record.lastupdatedate;
        let itemstr = record.itemstr;
        let discontinue = record.discontinue;
        let bannerhtml = record.bannerhtml;
        let bannerimagediv = "";

        if (bannerhtml.includes("background-image")){
            bannerimagediv = bannerhtml.substring(0, bannerhtml.indexOf(">") + 1) + "</div>";
            //console.log("bannerimagediv = " + bannerimagediv)
            bannerimagediv = bannerimagediv.replace("shopTopBanner", "myShopTopBanner1");
        }


        //let chatIssue = issue.replace("^Chat reported^ -","");
        
        //let lastupdatedate = record.lastupdatedate;
        //let comment = record.comment;
        

        //let itemurl = path.substring(0, path.indexOf('/', path.indexOf('bizzlistings')) + 1) + "kisna/items/" + itemstr;

        innerHTML = innerHTML + '<div class="max_4box_responsive shopCategoryDisplay cursor_pointer" onclick="getStoreDetails('+ "'" + title + "'" +')"  > ';
        

        innerHTML = innerHTML + bannerimagediv;
        //innerHTML = innerHTML + '<img src="/bizzlistings/images/Car and bike repair.png" alt="items" class="storeCategoryImg">';
        innerHTML = innerHTML + '<div class="shopCategoryHeader1" >' + title + '<br><u>'+ category + '</u><br>' + city_state_country.replaceAll("~", ",") + '</div>';
        
        innerHTML = innerHTML + '</div>';
    }

    
    innerHTML = innerHTML + '<div class="max_4box_responsive shopCategoryDisplay cursor_pointer" onclick="getCreateStore()" > ';
    innerHTML = innerHTML + '<div class="myShopTopBanner1"> <img src="/bizzlistings/images/createstore.png" alt="items" class="storeCategoryImg"></div>';
    innerHTML = innerHTML + '<div class="shopCategoryHeader1 "  >'+ '' +'</div>';
    innerHTML = innerHTML + '</div>';

    innerHTML = innerHTML + '</div>';
    document.getElementById("homeDivId").style.display = "none";
    document.getElementById("loginDivId").style.display = "none";
    document.getElementById("contactusDivId").style.display = "none";

    document.getElementById("itemListDivId").style.display = "block";
    document.getElementById("itemListDivId").innerHTML = innerHTML + "<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>";
 
    document.getElementById("bgSVGId").style.display = "none";
    document.getElementById("itemDivId").style.display = "none";
}

function getStoreDetails(storename){
        $.ajax({
        url: the.hosturl + '/php/process.php',
        type: 'POST',
        data: jQuery.param({
            usrfunction: "getmystorenitems",
            storename: storename
        }),
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        success: function (response) {
            //localStorage.setItem("mystoreitemsList", JSON.stringify(response));
            //localStorage.setItem("mystoreitemsList", response);
            populateMyStore(JSON.parse(response));
        },
        error: function (xhr, status, error) {
            // console.log(error);
            // console.log(xhr);
        }
    });
}

function populateMyStore(tags) {
    let newHTML = "<div class='shopLyrics'>";

    for (let i = 0; i < tags.length; i++) {
        if (i == 0) {
            newHTML = newHTML + getShopBannerForUpd(tags[i].itemid, tags[i].bannerhtml, tags[i].description, tags[i].uselocationfromaddress, tags[i].hourshtml, tags[i].reviewed)
            localStorage.setItem("storename", tags[i].storename);
        } else {
            newHTML = newHTML + getItemForUpd(tags[i].itemid, tags[i].itemimages, tags[i].title, tags[i].itemdescription, tags[i].itemprice, tags[i].reviewed)

        }
    }

    document.getElementById("itemListDivId").style.display = "block";
    document.getElementById("itemListDivId").innerHTML = newHTML + '</div><div class="centerAlignBorderBox"><button class="button_type1 width_150px" onclick="addNewShopItem(); return false;">Add Item</button></div>';
}
function getShopBannerForUpd(itemid, bannerhtml, description, uselocationfromaddress, hourshtml, itemreviewed) {

    let randomId = "type" + "-" + Math.floor(Math.random() * 1000000);


    let htmlPartOrig = bannerhtml;
    htmlPart = escape(htmlPartOrig);

    let shopBannerTabOptions = '<div class="shopTab">'
        + '<button class="shopTablinks" onclick="openShopTab(event, ' + "'" + 'DesignOptions' + "'" + ')">Design Options</button>'
        + '<button class="shopTablinks" onclick="openShopTab(event, ' + "'" + 'Customizations' + "'" + ')">Customizations</button>'
        + '<button class="shopTablinks" onclick="openShopTab(event, ' + "'" + 'HoursDiv' + "'" + ')">Hours</button>'
        + '<button class="shopTablinks" onclick="openShopTab(event, ' + "'" + 'LocationDiv' + "'" + ')">Location</button>'
        + '<button class="shopTablinks" onclick="openShopTab(event, ' + "'" + 'AboutStoreDiv' + "'" + ')">About</button>'
        + '<button class="shopTablinks" onclick="openShopTab(event, ' + "'" + 'Close' + "'" + ')">Close</button>';

    if (itemreviewed == "0") {
        shopBannerTabOptions = shopBannerTabOptions + "<button class='shopTablinks pendingReviewCls'>Pending Review</button>";
    }

    shopBannerTabOptions = shopBannerTabOptions + '<button class="shopTablinks" style="float:right" onclick="saveItemChanges(event)">Save</button>';


    shopBannerTabOptions = shopBannerTabOptions + '</div>';



    let shopOpeningHr = hourshtml;

    let shopOpeningHrCheckBox = "<label class='informationBox fontsize_14px'>To display the store hours, select the options below. You can update the daily hours</label>"
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
        + '<div id="availabilityDivId" contenteditable="true" data-text="Enter Availability Details Here. (Max 200 characters)" class="storeAvail displayNone"></div>';


    let addr_line1 = "";
    let addr_city = "";
    let addr_State = "";
    let addr_Cntry = "";
    let addr_postalcode = "";

    if ((uselocationfromaddress != undefined) && (uselocationfromaddress != "")) {
        let addrfields = uselocationfromaddress.split("~");
        for (let i = 0; i < addrfields.length; i++) {
            let pair = addrfields[i].split("^");
            switch (i) {
                case 0:
                    addr_line1 = pair[1];
                    break;
                case 1:
                    addr_city = pair[1];
                    break;
                case 2:
                    addr_State = pair[1];
                    break;
                case 3:
                    addr_Cntry = pair[1];
                    break;
                case 4:
                    addr_postalcode = pair[1];
                    break;
            }
        }
    }

    let shopLocationCheckBox = "<label class='informationBox fontsize_14px'>Provide your location information so that the interested shoppers can contact you.</label>"
        + '<div class="checkbox-wrapper-21">'
        + '<label class="control control--checkbox">'
        + 'Display Location on Map'
        + '<input class="showStoreLoc" type="checkbox" onclick="showStoreLocationDiv(this);"/>'
        + '<div class="control__indicator"></div>'
        + '</label>'
        + '</div>'
        + '<div id="storeMapDivId" class="storeOnMap displayNone"></div>'

        + '<div class="checkbox-wrapper-21 displayNone">'
        + '<label class="control control--checkbox">'
        + 'Display Location From Address'
        + '<input class="showStoreAddr" type="checkbox" onclick="showStoreAddrDiv(this);"/>'
        + '<div class="control__indicator"></div>'
        + '</label>'
        + '</div>'
        + '<div id="storeAddrDivId" class="storeAddr">'
        + '<div class="addresscontainer" id="addresscontainerDiv"> <div class="addressform"> <label class="addressfield"> <span class="addressfield__label" for="shopaddressline1">Address</span>'
        + '<div contenteditable="true" class="addressfield__input"  id="shopaddressline1">' + addr_line1 + '</div> </label>  <label class="addressfield"><span class="addressfield__label" for="shopcity">City/Town/Village</span> '
        + '<div contenteditable="true" class="addressfield__input"  id="shopcity">' + addr_city + '</div> </label>  <label class="addressfield"><span class="addressfield__label" for="shopstate">State</span> '
        + '<div contenteditable="true" class="addressfield__input"  id="shopstate">' + addr_State + '</div> </label>  <label class="addressfield"><span class="addressfield__label" for="shopcountry">Country</span> '
        + '<div contenteditable="true" class="addressfield__input"  id="shopcountry">' + addr_Cntry + '</div> </label>  <label class="addressfield"> <span class="addressfield__label" for="shoppostalcode">Postal code</span>'
        + '<div contenteditable="true" class="addressfield__input"  id="shoppostalcode">' + addr_postalcode + '</div> </label> </div>  </div>'
        + '</div>';

    let shopBannerTabContentDivs = '<div id="DesignOptions" class="shopTabcontent">'
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
        + '<div class="storeDescriptionCls" contenteditable="true" data-text="Write what is special about your store or the items/services you provide. (Max 1000 characters)">' + description + '</div>'
        + nextShopTabBtnDiv
        + '</div>'

        + '<div id="Close" class="shopTabcontent">'
        + '</div>'

        + '<div id="saveItemChanges" class="shopTabcontent">'
        + '</div>';

    let hdMeDiv = "<div class='hdMeDivCls' contenteditable='false'>"
        + allowTogglePreview
        + shopBannerTabOptions
        + shopBannerTabContentDivs
        + "</div>";

    let contentToAdd = "<div id= div-" + randomId + " data-itemid='" + itemid + "' class='shopTopBnrCls scale-in-center' style='animation-duration: 0.2' contenteditable='true' data-bgcolor='#ccc' data-transition='zoom' data-autoanimate='' data-background='' data-backgroundiframe = '' data-backgroundvideo = '' class='secdiv' onmousedown=setLastFocusedDivId(this.id) > "
        + "<textarea class='secDivTextArea'  onchange='updatePreviewDiv(this)' >" + htmlPart + "</textarea><div class='secPreview'><div contenteditable='true' class='revealDummy' style=' margin: 10px;'><div class='slides'>" + htmlPartOrig + "</div></div>"
        + hdMeDiv
        + "</div><button class='deleteDivInnImg' onclick=deleteCurrentComponent(this) ></button>  </div>";


    //elem.parentElement.parentElement.parentElement.innerHTML = contentToAdd;
    setTimeout(function () {
        let allItems = document.querySelectorAll(".shopTopBnrCls");
        for (let i = 0; i < allItems.length; i++) {
            allItems[i].classList.remove("scale-in-center");
        }
    }, 500);

    return contentToAdd;
}

function addNewShopItem() {
    let htmlPartOrig = '<div class="shopItemCls1" >'
        + "\n" + itemImagesDiv
        + "\n" + '</div>';


    htmlPart = escape(htmlPartOrig);

    let shopItemTabOptions = '<div class="shopTab">'
        + '<button class="shopTablinks" onclick="openShopTab(event, ' + "'" + 'addImages' + "'" + ')">Add Images</button>'
        + '<button class="shopTablinks" onclick="openShopTab(event, ' + "'" + 'itmNameDiv' + "'" + ')">Name</button>'
        + '<button class="shopTablinks" onclick="openShopTab(event, ' + "'" + 'itmDescDiv' + "'" + ')">Description</button>'
        + '<button class="shopTablinks" onclick="openShopTab(event, ' + "'" + 'itemPrice' + "'" + ')">Price</button>'
        + '<button class="shopTablinks" onclick="openShopTab(event, ' + "'" + 'CloseItemCust' + "'" + ')">Close</button>';

    shopItemTabOptions = shopItemTabOptions + '<button class="shopTablinks" style="float:right" onclick="saveItemChanges(event)">Save Item</button>'
        + '<button class="shopTablinks red_font" style="float:right" onclick="openShopTab(event, ' + "'" + 'deleteItem' + "'" + ')">Delete</button>'
        + '</div>';


    let shopItemTabContentDivs = '<div id="addImages" class="shopTabcontent">'
        + addItmImagesDiv
        + nextShopTabBtnDiv
        + '</div>'

        + '<div id="itmNameDiv" class="shopTabcontent">'
        + '<div class="itemNameCls" contenteditable="true" data-text="Enter Item Name Here. (Max 200 characters)">' + '</div>'
        + nextShopTabBtnDiv
        + '</div>'

        + '<div id="itmDescDiv" class="shopTabcontent">'
        + "<label class='informationBox fontsize_14px'>Enter the details of the item/service</label>"
        + '<div class="itemDescriptionCls" contenteditable="true" data-text="Enter Item Description Here. (Max 500 characters)">' + '</div>'
        + nextShopTabBtnDiv
        + '</div>'

        + '<div id="itemPrice" class="shopTabcontent">'
        + '<div class="itemPriceCls" contenteditable="true" data-text="Enter Item Price. (Max 45 characters)">' + '</div>'
        + nextShopTabBtnDiv
        + '</div>'

        + '<div id="CloseItemCust" class="shopTabcontent">'
        + '</div>'

        + '<div id="deleteItem" class="shopTabcontent">'
        + '</div>'

        + '<div id="saveItemChanges" class="shopTabcontent">'
        + '</div>';

    let hdMeDiv = "<div class='hdMeDivCls' contenteditable='false'>"
        + allowTogglePreview
        + shopItemTabOptions
        + shopItemTabContentDivs
        + "</div>";

    let contentToAdd = "<div data-itemid='new' class='shopItemCls scale-in-center' style='animation-duration: 0.2' contenteditable='true' data-bgcolor='#ccc' data-transition='zoom' data-autoanimate='' data-background='' data-backgroundiframe = '' data-backgroundvideo = '' class='secdiv storeItemDivCls' onmousedown=setLastFocusedDivId(this.id) > "
        + "<textarea class='secDivTextArea'  onchange='updatePreviewDiv(this)' >" + htmlPart + "</textarea><div class='secPreview'><div contenteditable='true' class='revealDummy' style=' margin: 10px;'><div class='slides'>" + htmlPartOrig + "</div></div>"
        + hdMeDiv
        + "</div><button class='deleteDivInnImg' onclick=deleteCurrentComponent(this) ></button>  </div>";


    document.querySelector('.shopLyrics').innerHTML = document.querySelector('.shopLyrics').innerHTML + contentToAdd;


    setTimeout(function () {
        let allItems = document.querySelectorAll(".shopItemCls");
        for (let i = 0; i < allItems.length; i++) {
            allItems[i].classList.remove("scale-in-center");
        }
    }, 500);

}
function getItemForUpd(itemid, itmimageshtml, itemname, itemdescription, itemprice, itemreviewed) {
    let itemImagesDiv = '<div class="itemImageshow-container">'
        + itmimageshtml
        + '</div>';

    let htmlPartOrig = '<div class="shopItemCls1" >'
        + "\n" + itemImagesDiv
        + "\n" + '</div>';

    let randomId = "type" + "-" + Math.floor(Math.random() * 1000000);

    htmlPart = escape(htmlPartOrig);

    let shopItemTabOptions = '<div class="shopTab">'
        + '<button class="shopTablinks" onclick="openShopTab(event, ' + "'" + 'addImages' + "'" + ')">Add Images</button>'
        + '<button class="shopTablinks" onclick="openShopTab(event, ' + "'" + 'itmNameDiv' + "'" + ')">Name</button>'
        + '<button class="shopTablinks" onclick="openShopTab(event, ' + "'" + 'itmDescDiv' + "'" + ')">Description</button>'
        + '<button class="shopTablinks" onclick="openShopTab(event, ' + "'" + 'itemPrice' + "'" + ')">Price</button>'
        + '<button class="shopTablinks" onclick="openShopTab(event, ' + "'" + 'CloseItemCust' + "'" + ')">Close</button>';

    if (itemreviewed == "0") {
        shopItemTabOptions = shopItemTabOptions + "<button class='shopTablinks pendingReviewCls'>Pending Review</button>";
    }

    shopItemTabOptions = shopItemTabOptions + '<button class="shopTablinks" style="float:right" onclick="saveItemChanges(event)">Save Item</button>'
        + '<button class="shopTablinks red_font" style="float:right" onclick="discontinueItem(event)">Delete</button>'
        + '</div>';

    let shopItemTabContentDivs = '<div id="addImages" class="shopTabcontent">'
        + addItmImagesDiv
        + nextShopTabBtnDiv
        + '</div>'

        + '<div id="itmNameDiv" class="shopTabcontent">'
        + '<div class="itemNameCls" contenteditable="true" data-text="Enter Item Name Here. (Max 200 characters)">' + itemname + '</div>'
        + nextShopTabBtnDiv
        + '</div>'

        + '<div id="itmDescDiv" class="shopTabcontent">'
        + "<label class='informationBox fontsize_14px'>Enter the details of the item/service</label>"
        + '<div class="itemDescriptionCls" contenteditable="true" data-text="Enter Item Description Here. (Max 500 characters)">' + itemdescription + '</div>'
        + nextShopTabBtnDiv
        + '</div>'

        + '<div id="itemPrice" class="shopTabcontent">'
        + '<div class="itemPriceCls" contenteditable="true" data-text="Enter Item Price. (Max 45 characters)">' + itemprice + '</div>'
        + nextShopTabBtnDiv
        + '</div>'

        + '<div id="CloseItemCust" class="shopTabcontent">'
        + '</div>'

        + '<div id="deleteItem" class="shopTabcontent">'
        + '</div>'

        + '<div id="saveItemChanges" class="shopTabcontent">'
        + '</div>';


    let hdMeDiv = "<div class='hdMeDivCls' contenteditable='false'>"
        + allowTogglePreview
        + shopItemTabOptions
        + shopItemTabContentDivs
        + "</div>";

    let contentToAdd = "<div id= div-" + randomId + " data-itemid= '" + itemid + "' class='shopItemCls scale-in-center' style='animation-duration: 0.2' contenteditable='true' data-bgcolor='#ccc' data-transition='zoom' data-autoanimate='' data-background='' data-backgroundiframe = '' data-backgroundvideo = '' class='secdiv storeItemDivCls' onmousedown=setLastFocusedDivId(this.id) > "
        + "<textarea class='secDivTextArea'  onchange='updatePreviewDiv(this)' >" + htmlPart + "</textarea><div class='secPreview'><div contenteditable='true' class='revealDummy' style=' margin: 10px;'><div class='slides'>" + htmlPartOrig + "</div></div>"
        + hdMeDiv
        + "</div><button class='deleteDivInnImg' onclick=deleteCurrentComponent(this) ></button>  </div>";


    //document.querySelector('.shopLyrics').innerHTML = document.querySelector('.shopLyrics').innerHTML + contentToAdd;


    setTimeout(function () {
        let allItems = document.querySelectorAll(".shopItemCls");
        for (let i = 0; i < allItems.length; i++) {
            allItems[i].classList.remove("scale-in-center");
        }
    }, 500);

    return contentToAdd;
}



function refreshPage() {
    let path = window.location.pathname;
    window.location.href = path;
}



async function saveNewStore(itemid, createNewItem) {



    document.querySelector(".shopSmErr").style.display = "none";
    //document.getElementByClassName("shopSmErr").style.display = "none";
    //let usremail = localStorage.getItem("userEmail");


    let errorInfo = "";
    let storename = localStorage.getItem("storename");
    let bannerhtml = document.querySelector(".shopTopBanner").parentElement.innerHTML;
    let displayhoursflag = document.querySelector(".showStoreHr").checked ? '1' : '0';
    let hourshtml = document.querySelector(".storeHrDivCls").innerHTML;
    //let availabilityinfo = document.getElementById("availabilityDivId").innerHTML;
    let availabilityinfo = document.getElementById("availabilityDivId").textContent;

    if (document.querySelector(".showStoreAvail").checked) {
        if (availabilityinfo == "") {
            errorInfo = errorInfo + "Hours availability is checked but information is not provided." + "<br>";
        }
    }

    if (availabilityinfo.length > 200){
        errorInfo = errorInfo + "Please limit availability information to 200 characters." + "<br>";
    }

    if (storename.length > 200){
        errorInfo = errorInfo + "Please limit the store name to 200 characters." + "<br>";
    }

    let displaylocationflag = document.querySelector(".showStoreLoc").checked ? '1' : '0';
    let maplocationcoordinates = "";
    if (localStorage.getItem("latitude") != null){
        maplocationcoordinates = localStorage.getItem("latitude") + "," + localStorage.getItem("longitude");
    }
    //let uselocationfromaddress = document.getElementById("storeAddrDivId").innerHTML;
    let uselocationfromaddress = "shopaddressline1^" + document.getElementById("shopaddressline1").innerHTML + "~" +
        "shopcity^" + document.getElementById("shopcity").innerHTML + "~" +
        "shopstate^" + document.getElementById("shopstate").innerHTML + "~" +
        "shopcountry^" + document.getElementById("shopcountry").innerHTML + "~" +
        "shoppostalcode^" + document.getElementById("shoppostalcode").innerHTML;

    let city_state_country = document.getElementById("shopcity").innerHTML + "~" + document.getElementById("shopstate").innerHTML + "~" + document.getElementById("shopcountry").innerHTML ;

    if (document.querySelector(".showStoreAddr").checked) {
        if (uselocationfromaddress == "") {
            errorInfo = errorInfo + "Location address is checked but information is not provided." + "<br>";
        }
    }

    if (uselocationfromaddress.length > 500){
        errorInfo = errorInfo + "Address is too long. Please limit to 500 characters." + "<br>";
    }

    let allItems = document.querySelectorAll(".shopItemCls");
    for (let i = 0; i < allItems.length; i++) {
        //let itemName = allItems[i].querySelector('.itemNameCls').innerHTML;
        let itemName = allItems[i].querySelector('.itemNameCls').textContent;
        let itemDescription = allItems[i].querySelector('.itemDescriptionCls').innerHTML;
        //let itemprice = allItems[i].querySelector('.itemPriceCls').innerHTML;
        let itemprice = allItems[i].querySelector('.itemPriceCls').textContent;
        let itemimages = allItems[i].querySelector('.itemImageshow-container').innerHTML;

        if ( itemName == "") {
            errorInfo = errorInfo + "Name has not been provided for one or more items added." + "<br>";
            break;
        }
        if (itemName.length > 200){
            errorInfo = errorInfo + "Please limit the item name to 200 characters." + "<br>";
            break;
        }
        if (itemprice.length > 40){
            errorInfo = errorInfo + "Please limit the price information to 40 characters." + "<br>";
            break;
        }

        if (itemimages.length > 5000){
            errorInfo = errorInfo + "Too many images for one or more item. Please limit the number of images to 10." + "<br>";
            break;
        }
        if (itemDescription.length > 500){
            errorInfo = errorInfo + "Please limit the item description to 500 characters" + "<br>";
            break;
        }  

    }
    let description = document.querySelector(".storeDescriptionCls").innerHTML;

    if (description.length > 3000){
        errorInfo = errorInfo + "Please limit the shop description to 3000 characters." + "<br>";
    }

    if (errorInfo != "") {
        document.querySelector(".shopSmErr").style.display = "block";
        document.querySelector(".shopSmErr").innerHTML = errorInfo;
        return;
    }

    const confirm = await ui.userConfirmation('By this submission you are confirming that the details you have provided are accurate and legal. Invalid/unfair submissions will result in your account getting disabled.');

    if (!confirm) {
        return;
    }

    let category = localStorage.getItem("storetype");
    let categoryseq = localStorage.getItem("storecatsequence");
    let title = storename;
    let titleseq = 1;
    let subcategory = "";
    let versionseq = "1";
    let shortdescription = "";


    let discontinue = "0";

    let itemprice = "";
    let itemimages = "";
    let itemdescription = "";


    let StrFunction = "SubmitForReview";
    let keywords = storename + "," + document.getElementById("shopaddressline1").innerHTML + "," + document.getElementById("shopcity").innerHTML + "," + document.getElementById("shopstate").innerHTML



    $.ajax({
        url: the.hosturl + '/php/process.php',
        data: {
            itemid: itemid,
            title: title,
            titleseq: titleseq,
            category: category,
            categoryseq: categoryseq,
            subcategory: subcategory,
            versionseq: versionseq,
            shortdescription: shortdescription,
            description: description,
            city_state_country: city_state_country,
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

            let StrFunction = "updstoreinfo";


            $.ajax({
                url: the.hosturl + '/php/process.php',
                data: {
                    storename: storename   ,
                    city_state_country: city_state_country   
                },
                type: 'POST',
                dataType: 'json',
                success: function (retstatus) {
                    getstoreinfo();
                },
                error: function (xhr, status, error) {

                }

             });
            },
        error: function (xhr, status, error) {
            if (!itemid == "") {
                document.getElementById("updateitemerrormsg-" + itemid).innerHTML = "<font color = #cc0000>" + "Failed to update" + "</font> ";
            }
        }
    });

    //SM-Done-Uncomment below line

    if (allItems.length == 0) {
        document.querySelector(".bottomNavigationCls").innerHTML = '<div class="greenMsg scale-up-ver-top text_align_center" style="animation-duration: 0.1">Thank you for your submission. We will review and notify you after completion. <br> <br> <button class="button_type1" onclick="goToHome()">Go To Home</button></div>'
        return;
    }

    for (let i = 0; i < allItems.length; i++) {

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
        keywords = title + "," + storename + "," + document.getElementById("shopaddressline1").innerHTML + "," + document.getElementById("shopcity").innerHTML + "," + document.getElementById("shopstate").innerHTML

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
                versionseq: versionseq,
                shortdescription: shortdescription,
                description: "",
                city_state_country: city_state_country,
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

                    //SM-Done-Uncomment below line
                    document.querySelector(".bottomNavigationCls").innerHTML = '<div class="greenMsg scale-up-ver-top text_align_center" style="animation-duration: 0.1">Thank you for your submission. We will review and notify you after completion. <br> <br> <button class="button_type1" onclick="goToHome()">Go To Home</button></div>'


                }
            },
            error: function (xhr, status, error) {

                //SM-Done-Uncomment below line
                document.querySelector(".bottomNavigationCls").innerHTML = '<div class="redMsg scale-up-ver-top text_align_center" style="animation-duration: 0.1">Submission failed. Please try again after sometime. <br> <br> <button class="button_type1" onclick="goToHome()">Go To Home</button></div>'
                return;

            }
        });
    }


}

function saveItemChanges(evt) {

    let parentDiv = evt.currentTarget.parentElement.parentElement.parentElement.parentElement;
    let storename = localStorage.getItem("storename");
    let itemid = parentDiv.dataset.itemid;
    //let usremail = localStorage.getItem("userEmail");

    let tags = JSON.parse(localStorage.getItem("mystoreitemsList"));
    let category = tags[0].category;
    let categoryseq = tags[0].categoryseq;
    let subcategory = tags[0].subcategory;
    let errorInfo = "";
    let rows = "";
    let itemType = "";
    if (itemid == "new") {
        itemType = "new";
    } else {
        rows = tags.filter(function (entry) {
            return entry.itemid == itemid;
        });

        if (rows[0].title == rows[0].storename) {
            itemType = "store";
        } else {
            itemType = "item";
        }
    }


    let bannerhtml = "";
    let displayhoursflag = "0";
    let hourshtml = "";
    let availabilityinfo = "";
    let displaylocationflag = "0";
    let description = "";
    let uselocationfromaddress = "";

    let city_state_country = document.getElementById("shopcity").innerHTML + "~" + document.getElementById("shopstate").innerHTML + "~" + document.getElementById("shopcountry").innerHTML ;

    if (itemType == "store") {
        bannerhtml = document.querySelector(".shopTopBanner").parentElement.innerHTML;
        displayhoursflag = document.querySelector(".showStoreHr").checked ? '1' : '0';
        hourshtml = document.querySelector(".storeHrDivCls").innerHTML;
        //availabilityinfo = document.getElementById("availabilityDivId").innerHTML;
        availabilityinfo = document.getElementById("availabilityDivId").textContent;
        displaylocationflag = document.querySelector(".showStoreLoc").checked ? '1' : '0';
        description = document.querySelector(".storeDescriptionCls").innerHTML;

        uselocationfromaddress = "shopaddressline1^" + document.getElementById("shopaddressline1").innerHTML + "~" +
            "shopcity^" + document.getElementById("shopcity").innerHTML + "~" +
            "shopstate^" + document.getElementById("shopstate").innerHTML + "~" +
            "shopcountry^" + document.getElementById("shopcountry").innerHTML + "~" +
            "shoppostalcode^" + document.getElementById("shoppostalcode").innerHTML;
    }

    if (availabilityinfo.length > 200){
        errorInfo = errorInfo + "Please limit availability information to 200 characters." + "<br>";
    }



    let itemprice = "";
    let itemimages = "";
    let itemdescription = "";
    let title = storename;

    if ((itemType == "item") ||  (itemType == "new")) {
        //itemprice = parentDiv.querySelector('.itemPriceCls').innerHTML;
        itemprice = parentDiv.querySelector('.itemPriceCls').textContent;
        itemimages = parentDiv.querySelector('.itemImageshow-container').innerHTML;
        itemdescription = parentDiv.querySelector('.itemDescriptionCls').innerHTML;
        //title = parentDiv.querySelector('.itemNameCls').innerHTML;
        title = parentDiv.querySelector('.itemNameCls').textContent;
    }

    if (title.length > 200){
        errorInfo = errorInfo + "Please limit the item name to 200 characters." + "<br>";
    }

    if (itemprice.length > 40){
        errorInfo = errorInfo + "Please limit the price information to 40 characters." + "<br>";
    }

    if (itemimages.length > 5000){
        errorInfo = errorInfo + "Too many images for one or more item. Please limit the number of images to 10." + "<br>";
    }
    if (itemdescription.length > 500){
        errorInfo = errorInfo + "Please limit the item description to 500 characters" + "<br>";
    }     

    let createNewItem = "y";
    let StrFunction = "SubmitForReview";
    let keywords = title + "," + storename + "," + document.getElementById("shopaddressline1").innerHTML + "," + document.getElementById("shopcity").innerHTML + "," + document.getElementById("shopstate").innerHTML

    if (itemid == "new") {
        if (title == "") {
            errorInfo = errorInfo + "Please provide item name";
        }       

        if (errorInfo != ""){
            let x = document.getElementById("toastsnackbar");
            x.innerHTML = errorInfo;
            x.classList.add("show");
            setTimeout(function () { 
                x.classList.remove("show");
            }, 3000);
            return;
        }

        itemid = "";

        $.ajax({
            url: the.hosturl + '/php/process.php',
            data: {
                itemid: itemid,
                title: title,
                titleseq: "99",
                category: category,
                categoryseq: categoryseq,
                subcategory: subcategory,
                versionseq: "1",
                shortdescription: "",
                description: "",
                city_state_country: city_state_country,
                keywords: keywords,
                discontinue: "0",
                createNewItem: createNewItem,
                itemprice: itemprice,
                itemimages: itemimages,
                itemdescription: itemdescription,
                displaylocationflag: "0",
                maplocationcoordinates: "",
                address: "",
                uselocationfromaddress: "",
                coordinatesfromaddress: "",
                displayhoursflag: "0",
                hourshtml: "",
                availabilityinfo: "",
                storename: storename,
                bannerhtml: "",
                usrfunction: StrFunction

            },
            type: 'POST',
            dataType: 'json',
            success: function (retstatus) {
                let x = document.getElementById("toastsnackbar");
                x.innerHTML = "Item has been saved";
                x.classList.add("show");
                setTimeout(function () { 
                    x.classList.remove("show");
                }, 3000);
            
                $.ajax({
                    url: the.hosturl + '/php/process.php',
                    type: 'POST',
                    data: jQuery.param({
                        usrfunction: "getmystorenitems"
                    }),
                    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                    success: function (response) {
                        localStorage.setItem("mystoreitemsList", response);
                        //SM-TODO-Done*****Uncomment Below Line******
                        populateMyStore(JSON.parse(response));
                    },
                    error: function (xhr, status, error) {
                        // console.log(error);
                        // console.log(xhr);
                    }
                });
            },
            error: function (xhr, status, error) {
                console.log("failed");
            }
        });
    } else {        
        //Check item fields are changed 
        let maplocationcoordinates = "";

        if (localStorage.getItem("latitude") != null){
            maplocationcoordinates = localStorage.getItem("latitude") + "," + localStorage.getItem("longitude");
        }
        if ((rows[0].bannerhtml == bannerhtml)
            && (rows[0].description == description)
            && (rows[0].uselocationfromaddress == uselocationfromaddress)
            && (rows[0].hourshtml == hourshtml)
            && (rows[0].availabilityinfo == availabilityinfo)
            && (rows[0].displayhoursflag == displayhoursflag)
            && (rows[0].displaylocationflag == displaylocationflag)
            && (rows[0].maplocationcoordinates == maplocationcoordinates)
            && (rows[0].itemprice == itemprice)
            && (rows[0].itemimages == itemimages)
            && (rows[0].itemdescription == itemdescription)
            && (rows[0].title == title) ) {

            let x = document.getElementById("toastsnackbar");
            x.innerHTML = "No changes to save";
            x.classList.add("show");
            setTimeout(function () { 
                x.classList.remove("show");
            }, 3000);
            return;
        } 
        let changesDone = "";
        if (rows[0].bannerhtml != bannerhtml){
            changesDone = changesDone + "Banner HTML, ";
        }
        if (rows[0].description != description){
            changesDone = changesDone + "Shop Description, ";
        }
        if (rows[0].uselocationfromaddress != uselocationfromaddress){
            changesDone = changesDone + "Shop Address, ";
        }

        if (rows[0].maplocationcoordinates != maplocationcoordinates){
            if (maplocationcoordinates !=""){
                changesDone = changesDone + "Map Location Coordinates, ";
            }else {
                maplocationcoordinates = rows[0].maplocationcoordinates;
            }            
        }

        if (rows[0].hourshtml != hourshtml){
            changesDone = changesDone + "Hours HTML, ";
        }
        if (rows[0].availabilityinfo != availabilityinfo){
            changesDone = changesDone + "Availability Info, ";
        }
        if (rows[0].displayhoursflag != displayhoursflag){
            changesDone = changesDone + "displayhoursflag, ";
        }
        if (rows[0].displaylocationflag != displaylocationflag){
            changesDone = changesDone + "displaylocationflag, ";
        }
        if (rows[0].itemprice != itemprice){
            changesDone = changesDone + "itemprice, ";
        }
        if (rows[0].itemimages != itemimages){
            changesDone = changesDone + "itemimages, ";
        }
        if (rows[0].itemdescription != itemdescription){
            changesDone = changesDone + "itemdescription, ";
        }
        if (rows[0].title != title){
            changesDone = changesDone + "title, ";
        }


        if (description.length > 3000){
            errorInfo = errorInfo + "Please limit the shop description to 3000 characters." + "<br>";
        }

        
        if (errorInfo != ""){
            let x = document.getElementById("toastsnackbar");
            x.innerHTML = errorInfo;
            x.classList.add("show");
            setTimeout(function () { 
                x.classList.remove("show");
            }, 3000);
            return;
        }
        
        let versionseq = parseInt(rows[0].versionseq) + 1;

        keywords = title + "," + storename + "," + document.getElementById("shopaddressline1").innerHTML + "," + document.getElementById("shopcity").innerHTML + "," + document.getElementById("shopstate").innerHTML


        if (rows[0].reviewed == "0"){
            createNewItem = "n";
        }
            $.ajax({
                url: the.hosturl + '/php/process.php',
                data: {
                    itemid: itemid,
                    title: title,
                    titleseq: rows[0].titleseq,
                    category: category,
                    categoryseq: categoryseq,
                    subcategory: subcategory,
                    versionseq: versionseq,
                    shortdescription: changesDone,
                    description: description,
                    city_state_country: city_state_country,
                    keywords: keywords,
                    discontinue: "0",
                    createNewItem: createNewItem,
                    itemprice: itemprice,
                    itemimages: itemimages,
                    itemdescription: itemdescription,
                    displaylocationflag: displaylocationflag,
                    maplocationcoordinates: "",
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
                    let x = document.getElementById("toastsnackbar");
                    x.innerHTML = "Changes have been saved";
                    x.classList.add("show");
                    setTimeout(function () { 
                        x.classList.remove("show");
                    }, 3000);

                    $.ajax({
                        url: the.hosturl + '/php/process.php',
                        type: 'POST',
                        data: jQuery.param({
                            usrfunction: "getmystorenitems"
                        }),
                        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                        success: function (response) {
                            localStorage.setItem("mystoreitemsList", response);
                            //SM-Done -Uncomment below line*********
                            populateMyStore(JSON.parse(response));
                        },
                        error: function (xhr, status, error) {
                            // console.log(error);
                            // console.log(xhr);
                        }
                    });

                },
                error: function (xhr, status, error) {
                    console.log("failed");
                }
            }); 
    }

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
                document.getElementById("contactusDivId").style.display = "none";
                document.getElementById("howtoDivId").style.display = "none";


                document.getElementById("loginDivId").style.display = "block";
                //document.getElementById("loginDivId").style.width = "70%";
                document.getElementById("loginerrormsg").innerHTML = "";

                //showHelpDivMessage("Login to add or make updates to the help scan codes");

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


    let StrPass = document.getElementById("newpassword").value
    let StrPassRe = document.getElementById("newpasswordRe").value

    let StrFunction = "setPassword";

    let error_message = "";


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

    let resetkey = sessionStorage.getItem("passwordresetkey");

    let StrAddress = "";

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
    let ctx = captchaText.getContext("2d");
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
    let c = emptyArr.join('');
    ctx.fillText(emptyArr.join(''), captchaText.width / 10, captchaText.height / 1.8);
    the.captcha = c;
}

function refreshCaptchatwo() {

    let captchaText = document.querySelector('#captchatwo');
    let ctx = captchaText.getContext("2d");
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
    let c = emptyArr.join('');
    ctx.fillText(emptyArr.join(''), captchaText.width / 10, captchaText.height / 1.8);
    the.captcha = c;
}


function uploadFiles(evt) {
    let files = evt.files; // FileList object


    the.uploadedFiles = files;
}

function showcategory(tech) {

    let tf = JSON.parse(sessionStorage.getItem("itemsList"));
    let rows = JSON.parse(tf);
    let elementId = "menucardparent-" + tech
    elementId = elementId.replaceAll(" ", "");
    if (tech != "") {
        tech = tech.toUpperCase();
        rows = rows.filter(function (entry) {
            return entry.category.toUpperCase() == tech;
        });
    }

    populateItemsList(rows);

}


// function showAllShopItemsInLeftPane(storename) {

//     let tf = JSON.parse(sessionStorage.getItem("itemsList"));
//     let rows = JSON.parse(tf);
//     let elementId = "menucardparent-" + storename
//     elementId = elementId.replaceAll(" ", "");
//     if (storename != "") {
//         storename = storename.toUpperCase();
//         rows = rows.filter(function (entry) {
//             return (entry.storename != null) && (entry.storename.toUpperCase() == storename) && (entry.storename != entry.title);
//         });
//     }

//     populateStoreItemsList(rows);

//     document.getElementById(elementId).style.width = "95%";
//     document.getElementById(elementId).style.maxWidth = "1200px";
//     document.getElementById(elementId).style.float = "none";
//     document.getElementById(elementId).style.top = "20px";
//     document.getElementById(elementId).style.margin = "auto";

//     // document.getElementById(elementId).style.overflow = "expand";
// }

function searchItem() {


    let searchText = document.getElementById("item-search-box").value;

    let tf = JSON.parse(sessionStorage.getItem("itemsList"));
    let rows = JSON.parse(tf);

    if (searchText != "") {
        searchText = searchText.toUpperCase();
        rows = rows.filter(function (entry) {
            return entry.title.toUpperCase().includes(searchText) || entry.category.toUpperCase().includes(searchText) || entry.keywords.toUpperCase().includes(searchText);
        });
    }

    populateItemsList(rows);
    $(".cardsContainerDivClassPadd").css("width", "95%");
}


function searchStoreNameItem() {

    let origSearchText = document.getElementById("store-search-box").value;
    origSearchText = origSearchText.replaceAll("  ", " ");

    let searchText = origSearchText;

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
    let tf = JSON.parse(sessionStorage.getItem("itemsList"));
    let rows = JSON.parse(tf);

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
        localStorage.setItem("storename", origSearchText);
        document.querySelector('.storeNameNotAvailable').style.display = "none";
        document.querySelector('.storeNameAvailable').style.display = "block";
        document.querySelector('.storeNameAvailable').innerHTML = getStoreURLMsg();

    }

}

function showBanner() {
    let elems = document.querySelectorAll('.shopTopBanner');
    let elems_array = [...elems]; // converts NodeList to Array

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
            "<button   type='button' class='itmUpdSaveBtn btn btn-danger' onclick=cancelStoreCreation() >Cancel</button></div>";
         
    }, 100);
}

async function cancelStoreCreation() {
    const confirm = await ui.userConfirmation('Are you sure you want to cancel? Any updates you have made will be lost.');

    if (!confirm) {
        return;
    }
    refreshPage()
}
function addShopItem() {
    addComponent("shopTopBanner", "shopItem1", "addUndershopLyrics");
    let allItems = document.querySelectorAll(".secPreview");

    let elem = allItems[allItems.length - 1].querySelector(".itmImgContainer");

    //scrollElementToTopOfScreenInstantly(elem);
    scrollElementToTopWithOffset(elem, -200);
}
function populateItemDropDown(fieldId = "item-search-box") {

    if (document.getElementById('item-search-box').dataset.dropdownset == "y"){
        return;
    }
    let tf = JSON.parse(sessionStorage.getItem("itemsList"));
    let items = JSON.parse(tf);

    //let LHCAI = the.LanguageHelpCodeAndIds_LclJson;
    //console.log(LHCAI);
    //let codesWithHelpDetails = JSON.parse(LHCAI);

    let lookup = {};
    //let items = codesWithHelpDetails;
    let dropDownList = [];

    for (let item, i = 0; item = items[i++];) {
        let value = item.title;

        dropDownList.push(value);
    }

    //console.log(languages)
    autocomplete(document.getElementById(fieldId), dropDownList);
    //the.languageListPopulated = true;
}

function populateItemsList(rows = "") {


    //console.log(document.getElementById("cardsContainerDivId").innerHTML);

    let tf = JSON.parse(sessionStorage.getItem("itemsList"));


    if (rows == "") {
        rows = JSON.parse(tf);
    }



    //let innerHTML = "<input id='item-search-box' type='text'	name='item' autocomplete='off' placeholder='search'/>" +
    //"<button class='buttonCls' onclick='searchItem(); return false;' >Update</button>";
    let innerHTML = "";
    let itemName = "";
    let itemprice = "";
    let lastupdated = "";
    let itemimages = "";
    let storename = "";
    let itemlocationCity = "";

    let path = window.location.pathname;
    let myUrl = path.substring(0, path.indexOf('/', path.indexOf('bizzlistings')) + 1);
    let categorySqueezed = "";
    let categoryOrig = "";
    let categoryUrl = "";
    

    let storenameUrl = "";

    let defaultDisplayCount = 100;
    let categoryMaxCount = 0;
    let currDisplayCount = 0;

    for (let i = 0; i < rows.length; i++) {

        itemName = rows[i].title;
        itemName = itemName.replaceAll(" ", "-");

        subcategory = rows[i].subcategory;
        subcategory = subcategory.replaceAll(" ", "-");

        categoryOrig = rows[i].category;
        category = rows[i].category;
        storename = rows[i].storename;

        if (rows[i].title == storename){
            if (rows.length == 1){
                document.getElementById("homeDivId").style.display = "none";
                document.getElementById("loginDivId").style.display = "none";
                document.getElementById("contactusDivId").style.display = "none";            
                
                getFullShopDetails(rows, storename);
                document.getElementById("itemListDivId").style.display = "block";
                return;
            }
            continue;
        }
        let storeNameSpaceReplaced = storename.replaceAll(" ", "-");
        category = category.replaceAll(" ", "-");

        //itemTitleURL = myUrl + "items/" + category.toLowerCase() + "/" + subcategory.toLowerCase() + "/" + itemName.toLowerCase();
        
        let itemStr = category.toLowerCase() + "/" + storeNameSpaceReplaced.toLowerCase() + "/" + itemName.toLowerCase();

        itemTitleURL = myUrl + "items/" + itemStr;

        storenameUrl = myUrl + storename;

        categorySqueezed = rows[i].category;
        categorySqueezed = categorySqueezed.replaceAll(' ', '')

        categoryMaxCount = sessionStorage.getItem("max-count-" + categorySqueezed);


        innerHTML = innerHTML + '<div class="max_4box_responsive itemDisplay itemContainerCls itemListView-container" data-itemid="'+ rows[i].itemid +'" data-itemuid="'+ rows[i].itemuid +'" > ';

        //innerHTML = innerHTML + '<img src="' + the.hosturl + '/images/' + categoryOrig + '.png" alt="items" class="storeCategoryImg">' ;
        
        //SM-DONOTDELETE
        //innerHTML = innerHTML + '<div class="position_relative hoverBtnParent cursor_pointer" onclick="location.href=' + "'" + itemTitleURL + "'" + '">' + rows[i].itemimages ;
        //innerHTML = innerHTML + '<a class="position_absolute_center hoverShowBtn" href="' + itemTitleURL + '">Show More</a></div>';

        innerHTML = innerHTML + '<div class="position_relative hoverBtnParent cursor_pointer"><a  onclick="getItemAfterURLHistUpd('+ "'" + itemStr + "'" +'); return false;" href=' + "'" + itemTitleURL + "'" + '>' + rows[i].itemimages ;
        innerHTML = innerHTML + '<a class="position_absolute_center hoverShowBtn" onclick="getItemAfterURLHistUpd('+ "'" + itemStr + "'" +'); return false;" href="' + itemTitleURL + '">Show More</a></a></div>';


        //innerHTML = innerHTML + '<a class="wg-box-content"><a class="wg-box-content-image" href=' + "'" + itemTitleURL + "'" + '>' + rows[i].itemimages ;
        //innerHTML = innerHTML + '<div class="wg-box-content-overlay"></div><div class="wg-box-content-details wg-box-fadeIn-bottom"><h3 class="wg-box-content-title">This is a title</h3></div></a></a>';


        innerHTML = innerHTML + '<div class="itemListView-Header" >' ;


        innerHTML = innerHTML + "<div><div><div class='itmbtn float_left'  onclick='markFavourite(this)'><i class='fa fa-heart color_light_pink '></i></div></div></div>"; //color_red_heart, color_light_pink

        innerHTML = innerHTML + "<div><div><div class='itmbtn float_right'  onclick='openItemChat(this)'><i class='fa fa-commenting font_size_24px'></i></div></div></div>";

            if (rows[i].title != undefined) {
                if (rows[i].title != "") {
                    innerHTML = innerHTML
                        + '<div class="shopItemTitle ">' + rows[i].title + '</div>';
                }
            }
    
            if (rows[i].itemprice != undefined) {
                if (rows[i].itemprice != "") {
                    innerHTML = innerHTML
                        + '<div class="shopItemPrice ">' + rows[i].itemprice + '</div>';
                }
            }

            if (rows[i].city_state_country != undefined) {
                if (rows[i].city_state_country != "") {
                    let arr = rows[i].city_state_country.split("~");
                    innerHTML = innerHTML  + '<a class="anchor_tag_btn2" onclick="getItemAfterURLHistUpd('+ "'" + itemStr + "'" +'); return false;" href="' + itemTitleURL + '">' + arr[0] + '</a>';
                }
            }

            if (rows[i].lastupdatedate != undefined) {
                if (rows[i].lastupdatedate != "") {

                    let dateStr = (rows[i].lastupdatedate).substring(0, 10); // yyyy-mm-dd format
                    let date = new Date(dateStr); // convert string to Date object    
                    let month = date.toLocaleString('default', { month: 'short' }); // get short month name
                    let day = date.getDate(); // get day of the month    
                    let formattedDate = `${month}-${day}`; // create formatted date string    
                    innerHTML = innerHTML + '<div class="shopItemLastupdatedate ">Updated: ' + formattedDate + '</div>';   

                    //innerHTML = innerHTML + '<div class="shopItemLastupdatedate ">Updated: ' + (rows[i].lastupdatedate).substring(0, 10) + '</div>';
                }
            }

            innerHTML = innerHTML + '</div> </div>';

    }

    if (sessionStorage.getItem("max-count-" + categorySqueezed) > defaultDisplayCount) {
        sessionStorage.setItem("display-count-" + categorySqueezed, defaultDisplayCount);
        innerHTML = innerHTML + '<div id="itemDiv-' + rows[i].itemid + '" class="itemDiv categoryFooter ' + categorySqueezed + ' " >' +
            '<button id="showmore-"' + rows[i - 1].category + ' type="button" class="showmore-btn" onclick=showMoreitems("' + categorySqueezed + '") >Show More</button>' +
            '</div>';
    } else {
        sessionStorage.setItem("display-count-" + categorySqueezed, currDisplayCount);
    }


    document.getElementById("homeDivId").style.display = "none";
    document.getElementById("loginDivId").style.display = "none";
    document.getElementById("contactusDivId").style.display = "none";

    document.getElementById("itemListDivId").style.display = "block";
    document.getElementById("itemListDivId").innerHTML = innerHTML + "<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>";
    document.getElementById("itemDivId").style.display = "none";
    document.getElementById("bgSVGId").style.display = "none";
    
    setTimeout(function () {
        colorFavoriteItems();
    }, 10);

    setTimeout(() => {
        hideAllImageNavBtns();
    }, 20);
}

function getItemAfterURLHistUpd(itemStr){
    let path = window.location.pathname;
    let myUrl = path.substring(0, path.indexOf('/', path.indexOf('bizzlistings')) + 1) + "items/" + itemStr;


    const nextURL = myUrl;
    const nextTitle = 'Code Helper';
    const nextState = {
        additionalInformation: 'Updated the URL with JS'
    };

    // This will create a new entry in the browser's history, without reloading
    window.history.pushState(nextState, nextTitle, nextURL);

    fnGetItem(itemStr);
}


// function populateStoreItemsList(rows = "") {

//     //console.log(document.getElementById("cardsContainerDivId").innerHTML);
//     let tf = JSON.parse(sessionStorage.getItem("itemsList"));


//     if (rows == "") {
//         rows = JSON.parse(tf);
//     }

//     if (the.smusr) {
//     } else {
//         rows = rows.filter(function (entry) {
//             return entry.discontinue == "0";
//         });
//     }

//     //let innerHTML = "<input id='item-search-box' type='text'	name='item' autocomplete='off' placeholder='search'/>" +
//     //"<button class='buttonCls' onclick='searchItem(); return false;' >Update</button>";
//     let innerHTML = "";
//     let itemName = "";
//     let path = window.location.pathname;
//     let myUrl = path.substring(0, path.indexOf('/', path.indexOf('bizzlistings')) + 1);
//     let storenameSqueezed = "";
//     let storenameOrig = "";
//     let storename = "";
//     let storenameUrl = "";

//     let category = "";

//     let defaultDisplayCount = 1000;
//     let storenameMaxCount = 0;
//     let currDisplayCount = 0;

//     for (let i = 0; i < rows.length; i++) {

//         itemName = rows[i].title;
//         itemName = itemName.replaceAll(" ", "-");

//         storenameOrig = rows[i].storename;
//         storename = rows[i].storename;
//         category = rows[i].category;
//         storename = storename.replaceAll(" ", "-");

//         categorySpaceReplaced = category.replaceAll(" ", "-");

//         //itemTitleURL = myUrl + "items/" + storename.toLowerCase() + "/" + substorename.toLowerCase() + "/" + itemName.toLowerCase();
//         itemTitleURL = myUrl + "items/" + categorySpaceReplaced.toLowerCase() + "/" + storename.toLowerCase() + "/" + itemName.toLowerCase();

//         //storenameUrl = myUrl + "items/" + storenameOrig;
//         storenameUrl = myUrl + storenameOrig;

//         storenameSqueezed = rows[i].storename;
//         storenameSqueezed = storenameSqueezed.replaceAll(' ', '')

//         storenameMaxCount = sessionStorage.getItem("max-count-" + storenameSqueezed);

//         if (i == 0) {
//             innerHTML = innerHTML + '<div id="menucardparent-' + storenameSqueezed + '"  class=" cardsContainerDivClassPadd max_4box_responsive_withmargin" > <div class="storenameHeader" >';
//             // if (the.smusr) {
//             //     innerHTML = innerHTML + rows[i].storenameseq + '. ';
//             // }
//             innerHTML = innerHTML + rows[i].storename +

//                 //  '<label class="switch storenameToggleLbl"  ><input class="toggleInput"  type="checkbox" checked data-cat="'+ rows[i].storename + '"  onchange="handleShowToggle(this);" ><span class="slider round"></span></label>' +
//                 '<a class="goToTechLink" href ="' + storenameUrl.replaceAll(' ', '-') + '"> GO </a>' +

//                 '</div>';
//             startingCharURL = myUrl + "starting/bollywood-items-starting-with-" + rows[i].storename;

//         } else if (rows[i].storename != rows[i - 1].storename) {


//             if (sessionStorage.getItem("max-count-" + rows[i - 1].storename) > defaultDisplayCount) {
//                 sessionStorage.setItem("display-count-" + rows[i - 1].storename, defaultDisplayCount);
//                 innerHTML = innerHTML + '<div id="itemDiv-' + rows[i - 1].itemid + '" class="itemDiv storenameFooter ' + rows[i - 1].storename + ' " >' +
//                     '<button id="showmore-' + rows[i - 1].storename + '"  type="button" class="showmore-btn" onclick=showMoreitems("' + rows[i - 1].storename + '") >Show More</button>' +
//                     '</div>';
//             } else {
//                 sessionStorage.setItem("display-count-" + rows[i - 1].storename, currDisplayCount);
//             }

//             currDisplayCount = 0;

//             innerHTML = innerHTML + '</div><div id="menucardparent-' + storenameSqueezed + '"  class=" cardsContainerDivClassPadd max_4box_responsive_withmargin" ><div class="storenameHeader">';

//             innerHTML = innerHTML + rows[i].storename +
//                 //  '<label class="switch storenameToggleLbl"  ><input class="toggleInput"   type="checkbox" checked data-cat="'+ rows[i].storename + '"  onchange="handleShowToggle(this);" ><span class="slider round"></span></label>' +
//                 '<a class="goToTechLink" href ="' + storenameUrl.replaceAll(' ', '-') + '"> GO </a>' +
//                 '</div>';

//             startingCharURL = myUrl + "starting/bollywood-items-starting-with-" + rows[i].storename;
//         }

//         currDisplayCount = currDisplayCount + 1;

//         if (currDisplayCount >= defaultDisplayCount) {
//             continue;
//         }


//         let discontinuedFlgCls = "";

//         if (rows[i].discontinue == "1") {
//             discontinuedFlgCls = " discontinued ";
//         }

//         //It is not a new child item 
//         innerHTML = innerHTML + '<div id="itemDiv-' + rows[i].itemid + '" class="itemDiv ' + discontinuedFlgCls + storenameSqueezed + '" >';
//         innerHTML = innerHTML + '<a class="itemLink" href ="' + itemTitleURL + '"> <span class="itemTitleSpan"  > <h2 class="itemTitleH2" >';

//         if (the.smusr) {
//             innerHTML = innerHTML + rows[i].titleseq + '. ';
//         }

//         innerHTML = innerHTML + rows[i].title + ' </h2> </span> </a>';
//         innerHTML = innerHTML + '</div>';
//         // }


//         if (i == rows.length - 1) {
//             innerHTML = innerHTML + '</div>';
//         }
//     }

//     if (sessionStorage.getItem("max-count-" + storenameSqueezed) > defaultDisplayCount) {
//         sessionStorage.setItem("display-count-" + storenameSqueezed, defaultDisplayCount);
//         innerHTML = innerHTML + '<div id="itemDiv-' + rows[i].itemid + '" class="itemDiv storenameFooter ' + storenameSqueezed + ' " >' +
//             '<button id="showmore-"' + rows[i - 1].storename + ' type="button" class="showmore-btn" onclick=showMoreitems("' + storenameSqueezed + '") >Show More</button>' +
//             '</div>';
//     } else {
//         sessionStorage.setItem("display-count-" + storenameSqueezed, currDisplayCount);
//     }

//     innerHTML = innerHTML + '</div>';
//     //document.getElementById("itemDivId").innerHTML = innerHTML;
//     document.getElementById("itemListDivId").style.display = "block";
//     document.getElementById("itemListInnerDivId").innerHTML = innerHTML + "<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>";

// }

function hideAllImageNavBtns() {

    let btns = document.querySelectorAll(".navbtn");

    for (j = 0; j < btns.length; j++) {
        btns[j].style.display = "none";
    }

}


// function handleShowToggle(checkbox) {
//     let categorySqueezed = checkbox.dataset.cat;
//     categorySqueezed = categorySqueezed.replaceAll(' ', '');

//     let catCards = document.getElementsByClassName(categorySqueezed);

//     if (checkbox.checked == false) {
//         //document.getElementsByClassName('appBanner')[0].style.visibility = 'hidden';	

//         for (let i = 0; i < catCards.length; i++) {
//             //if (i > 1){
//             catCards[i].style.display = 'none';
//             //}
//         }
//     } else {
//         for (let i = 0; i < catCards.length; i++) {
//             //if (i > 1){
//             catCards[i].style.display = 'block';
//             //}
//         }
//     }
// }

function goToHome() {

    let path = window.location.pathname;
    let myUrl = path.substring(0, path.indexOf('/', path.indexOf('bizzlistings')) + 1)
    myUrl = myUrl + "?target=home";
    window.location.href = myUrl;
}

// function goToItem() {

//     let path = window.location.pathname;
//     let myUrl = path.substring(0, path.indexOf('/', path.indexOf('bizzlistings')) + 1)
//     myUrl = myUrl + "?target=item";
//     window.location.href = myUrl;
// }

// function goToHowToVideos() {

//     let path = window.location.pathname;
//     let myUrl = path.substring(0, path.indexOf('/', path.indexOf('bizzlistings')) + 1)
//     myUrl = myUrl + "?target=howto";
//     window.location.href = myUrl;
// }

// function goToContactUs() {

//     let path = window.location.pathname;
//     let myUrl = path.substring(0, path.indexOf('/', path.indexOf('bizzlistings')) + 1)
//     myUrl = myUrl + "?target=contactus";
//     window.location.href = myUrl;
// }

function goToLogin() {

    let path = window.location.pathname;
    sessionStorage.setItem("lastUrl", window.location.href);
    let myUrl = path.substring(0, path.indexOf('/', path.indexOf('bizzlistings')) + 1)
    myUrl = myUrl + "?target=login";
    window.location.href = myUrl;
}

// function toggleCollapse(el) {
//     //console.log("Div clicked");

//     el.classList.toggle("active");
//     let content = el.nextElementSibling;
//     if (content.style.display === "block") {
//         content.style.display = "none";
//     } else {
//         content.style.display = "block";
//     }

// }

function myTopNavFunction() {
    let x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
        x.className += " responsive";
    } else {
        x.className = "topnav";
    }
}

function login() {
    document.getElementById("loginerrormsg").innerHTML = "<font color = red>" + " " + "</font> ";
    let StrEmail = document.getElementById("emailid").value
    let StrPass = document.getElementById("password").value

    let StrRemember = "Y"

    let StrFunction = "login";

    let error_message = "";

    if (StrEmail.trim() == "") {
        error_message = "Please enter the email id";
        document.getElementById("loginerrormsg").innerHTML = "<font color = #cc0000>" + error_message + "</font> ";
        return;
    }

    let atpos = StrEmail.indexOf("@");
    let dotpos = StrEmail.lastIndexOf(".");

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

                //let loggedIn = "Y";
                document.getElementById("loginLinkId").style.display = "none";

                showAdditionalMenuItemsForLoggedIn();

                localStorage.setItem("userLoggedIn", "y");
                localStorage.setItem("userLvl", retstatus.substring(2, 3));
                localStorage.setItem("userdata", retstatus.substring(3));
                //localStorage.setItem("userEmail", StrEmail);
                //getStoredProjectList();

                let myUrl = window.location.protocol + "//" + window.location.host +
                    window.location.pathname;

                let lastUrl = sessionStorage.getItem("lastUrl");

                if ((lastUrl == null) || (lastUrl.includes("?target=login"))) {
                    lastUrl = myUrl + "?target=" + "home"
                }

                window.open(lastUrl, "_self");

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

// function loginWithoutRefresh() {
//     document.getElementById("Subloginerrormsg").innerHTML = "<font color = red>" + " " + "</font> ";
//     StrEmail = document.getElementById("Subemailid").value
//     StrPass = document.getElementById("Subpassword").value

//     let StrRemember = "Y"

//     let StrFunction = "login";

//     let error_message = "";

//     if (StrEmail.trim() == "") {
//         error_message = "Please enter the email id";
//         document.getElementById("Subloginerrormsg").innerHTML = "<font color = #cc0000>" + error_message + "</font> ";
//         return;
//     }

//     let atpos = StrEmail.indexOf("@");
//     let dotpos = StrEmail.lastIndexOf(".");

//     if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= StrEmail.length) {
//         error_message = "Email id is not valid";
//         document.getElementById("Subloginerrormsg").innerHTML = "<font color = #cc0000>" + error_message + "</font> ";
//         return;
//     }

//     if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(StrEmail))) {
//         error_message = "Email id is not valid";
//         document.getElementById("Subloginerrormsg").innerHTML = "<font color = #cc0000>" + error_message + "</font> ";
//         return;
//     }

//     if (StrPass.trim() == "") {
//         error_message = "Please provide password";
//         document.getElementById("Subloginerrormsg").innerHTML = "<font color = #cc0000>" + error_message + "</font> ";
//         return;
//     }

//     $.ajax({
//         url: the.hosturl + '/php/process.php',
//         data: { usremail: StrEmail, usrpassword: StrPass, usrremember: StrRemember, usrfunction: StrFunction },
//         type: 'POST',
//         dataType: 'json',
//         success: function (retstatus) {
//             //alert(substr(retstatus,4));
//             //alert("Inside login loginWithoutRefresh retstatus =" + retstatus);
//             //console.log( "Inside loginWithoutRefresh success retstatus =" + retstatus);
//             if (retstatus.substring(0, 2) == "6S") {
//                 //document.getElementById("Subloginerrormsg").innerHTML = "Login Successful"

//                 loggedIn = "Y";
//                 document.getElementById("loginLinkId").style.display = "none";
//                 document.getElementById("SubloginDivId").style.display = "none";

//                 showAdditionalMenuItemsForLoggedIn();
//                 // document.getElementById("logoutLinkId").style.display = "block";
//                 // document.getElementById("myfavoritesLinkId").style.display = "block";

//                 document.getElementById("helpAddUpdateMsg").innerHTML = "";
//                 //Show("projectscanner");

//                 localStorage.setItem("userLoggedIn", "y");
//                 localStorage.setItem("userLvl", retstatus.substring(2, 3));

//             }

//             else {
//                 document.getElementById("Subloginerrormsg").innerHTML = "<font color = orange>" + retstatus + "</font> ";
//             }
//         },
//         error: function (xhr, status, error) {
//             alert(xhr);
//             console.log(error);
//             console.log(xhr);
//         }
//     });
// }

// function SubshowCreateAccount() {
//     document.getElementById("SubloginSecDivId").style.display = "none"
//     document.getElementById("SubregisterSecDivId").style.display = "block"
// }

// function SubshowLogin() {
//     document.getElementById("SubregisterSecDivId").style.display = "none"
//     document.getElementById("SubloginSecDivId").style.display = "block"
// }

async function Logout() {

    const confirm = await ui.userConfirmation('Are you sure you want logout?');

    if (!confirm) {
        return;
    }

    let StrFunction = "logout";
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
                //if (!onMobileBrowser()) {
                //    document.getElementById("loginLinkId").style.display = "block";
                //}
                document.getElementById("loginLinkId").style.display = "block";

                hideMenuItemsForLoggedOut();
                //document.getElementById("logoutLinkId").style.display = "none";
                //document.getElementById("myfavoritesLinkId").style.display = "none";
                
                //document.getElementById("mystoreLinkId").style.display = "none";
                localStorage.setItem("userLoggedIn", "n");
                localStorage.setItem("favitems", "");
                //Show("projectscanner");

                //let myUrl = window.location.protocol + "//" + window.location.host +	window.location.pathname ;
                //window.open(myUrl + "?target=" + "projectscanner", "_self");	

                let path = window.location.pathname;
                let myUrl = path.substring(0, path.indexOf('/', path.indexOf('bizzlistings')) + 1) + "?target=home";

                window.open(myUrl, "_self");
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

    let StrEmail = document.getElementById("registeremailid").value
    let StrName = document.getElementById("registerusname").value
    let StrPass = document.getElementById("registerpassword").value
    let StrPassRe = document.getElementById("registerpasswordre").value

    let StrFunction = "register";

    let error_message = "";

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

    let atpos = StrEmail.indexOf("@");
    let dotpos = StrEmail.lastIndexOf(".");

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

    let StrAddress = "";

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

                //localStorage.setItem("userEmail", StrEmail);
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

function populateStoreType(divid) {

    let tags = sessionStorage.getItem("categoryList")

    if ((tags == null) ||(tags == "") || (tags == "null")) {
            $.ajax({
                url: the.hosturl + '/php/process.php',
                type: 'POST',
                data: jQuery.param({
                    usrfunction: "categories"
                }),
                contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                success: function (response) {
                    sessionStorage.setItem("categoryList", JSON.stringify(response));
                    populateStoreType(divid);
                },
                error: function (xhr, status, error) {
                    //console.log(error);
                    //console.log(xhr);
                }
            });
            return;        
    }

    let tf = JSON.parse(tags);

    let rows = JSON.parse(tf);

    let innerHTML = "";

    let categorySqueezed = "";
    let categoryOrig = "";

    for (let i = 0; i < rows.length; i++) {

        //subcategory = rows[i].subcategory;
        //subcategory = subcategory.replaceAll(" ", "-");

        categoryOrig = rows[i].category;
        category = rows[i].category;

        category = category.replaceAll(" ", "-");

        categorySqueezed = rows[i].category;
        categorySqueezed = categorySqueezed.replaceAll(' ', '');

        //categoryMaxCount = sessionStorage.getItem("max-count-" + categorySqueezed);

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
    //return innerHTML;
    document.getElementById(divid).innerHTML = '<label class="form_header_label1 scale-up-ver-top"> SELECT STORE TYPE </label><hr>' + innerHTML + "<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>";
    document.getElementById(divid).style.display = "block";
}

function categoryClicked(categoryNameOrig) {
    let tf = JSON.parse(sessionStorage.getItem("categoryList"));
    let rows = JSON.parse(tf);
    if (categoryNameOrig != "") {
        let categoryName = categoryNameOrig.toUpperCase();
        rows = rows.filter(function (entry) {
            return entry.category.toUpperCase() == categoryName;
        });
    }

    let categorySeq = rows[0].categoryseq;

    localStorage.setItem("storecatsequence", categorySeq);
    localStorage.setItem("storetype", categoryNameOrig);

    document.querySelector(".itemDescription").style.display = "block";
    document.querySelector("#storeSelectedDivId").innerHTML = categoryNameOrig;
    document.querySelector("#storeSelectedDivId").style.display = "block";
    document.querySelector("#selectStoreTypeDivId").style.display = "none";

    $('html, body').animate({
        //scrollTop: $("#itemDivId").offset().top - 40
        scrollTop: $("#itemDivId").offset().top - 80
    }, 100);

    setTimeout(function () {
        document.querySelector('#storeSelectedDivId').classList.remove("slide-in-left");
    }, 1000);
}


function setUpMyStore() {
    document.getElementById("registerSecDivId").style.display = "none";
    document.getElementById("providerSecDivId").style.display = "block";
}

function Subregister() {
    document.getElementById("Subregistererrormsg").innerHTML = "<font color = orange>" + " " + "</font> ";

    let StrEmail = document.getElementById("Subregisteremailid").value
    let StrName = document.getElementById("Subregisterusname").value
    let StrPass = document.getElementById("Subregisterpassword").value
    let StrPassRe = document.getElementById("Subregisterpasswordre").value

    let StrFunction = "register";

    let error_message = "";

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

    let atpos = StrEmail.indexOf("@");
    let dotpos = StrEmail.lastIndexOf(".");

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

    let StrAddress = "";

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

    let StrEmail = document.getElementById("forgotpwemailid").value

    let StrFunction = "forgotpw";

    let error_message = "";


    if (StrEmail.trim() == "") {
        error_message = "Please enter the email id";
        document.getElementById("forgotpwerrormsg").innerHTML = "<font color = #cc0000>" + error_message + "</font> ";
        return;
    }

    let atpos = StrEmail.indexOf("@");
    let dotpos = StrEmail.lastIndexOf(".");

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
    let StrEmail = document.querySelector(".contactusemailidCls").value
    //let StrEmail = document.getElementById("contactusemailid").value

    let StrName = document.querySelector(".contactusnameCls").value
    //let StrName = document.getElementById("contactusname").value

    let StrComment = document.getElementById("contactus_msg").value;
    //console.log(window.location.pathname);

    let StrFunction = "contactus";

    let error_message = "";

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

    let atpos = StrEmail.indexOf("@");
    let dotpos = StrEmail.lastIndexOf(".");

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

// function toggleHideLeftParent(elem) {
//     //elem.parentElement.classList.toggleClass("panel-hide-left");
//     $("#itemListDivId").toggle("slide")
// }


function onMobileBrowser() {

    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        // true for mobile device
        return true;
    } else {
        // false for not mobile device
        return false;
    }

}

// function providerSelected() {
//     document.getElementById("addresscontainerDiv").style.display = "block";
// }

function setProvAddr() {

    let error_message = "";

    let shipaddress = document.getElementById("shipaddress").value;
    let shipcountry = document.getElementById("shipcountry").value;
    let zipcode = document.getElementById("zipcode").value;
    zipcode = zipcode.replaceAll(' ', '');
    let shipcity = document.getElementById("shipcity").value;
    let shipstate = document.getElementById("shipstate").value;


    if ((shipaddress.trim() == "") || (shipcountry.trim() == "") || (zipcode.trim() == "") || (shipcity.trim() == "") || (shipstate.trim() == "")) {
        error_message += "<br>All address fields are required";
    }

    if (error_message != "") {
        document.getElementById("providerAddrErrorMsg").innerHTML = "<font color = #cc0000>" + error_message + "</font> ";
    }
}

function escape(s) {
    let escaped = {
        '<': '&lt;',
        '>': '&gt;',
    };
    return s.replace(/[<>]/g, function (m) {
        return escaped[m];
    });
}

// function updateParentBGVideo(element) {
//     element.parentElement.parentElement.dataset.backgroundvideo = element.value;
//     //element.parentElement.parentElement.style.background = url('/bizzlistings/video/' + element.value);

//     let selectedVid = element.parentElement.querySelector('.selectedVid');
//     selectedVid.innerHTML = element.value;
// }

function updateParentBGImage(element) {
    element.parentElement.parentElement.dataset.background = element.value;
    //element.parentElement.parentElement.style.backgroundImage  = "url('/bizzlistings/img/" + element.value + "')";

    //let parentSecDiv = element.parentElement.parentElement;
    //let previewDiv = parentSecDiv.querySelector('.secPreview');
    let previewDiv = document.querySelector('.secPreview');

    if (previewDiv.style.display != "none") {
        previewDiv.style.backgroundImage = "url('/bizzlistings/img/" + element.value + "')";
    }

    let selectedImg = element.parentElement.querySelector('.selectedImg');
    selectedImg.innerHTML = element.value;
}
// function updateParentAutoAnimate(element) {
//     element.parentElement.parentElement.dataset.autoanimate = element.value;
// }

function updateTextDivColor(element) {
    let rgbColor = hexToRgb(element.dataset.clr);
    //let rgbColor = element.style.backgroundColor;
    document.getElementById("textDivId").style.backgroundColor = element.style.backgroundColor;
    //element.style.backgroundColor = element.value;    

    let textColour = getFontColorForRGBbackGroundColor(rgbColor);
    document.getElementById("textDivId").style.color = textColour;
    document.getElementById("textDivId").style.opacity = document.getElementById("transparencySlider").value / 100;
}

function changeTransparency(){
    document.getElementById("textDivId").style.opacity = document.getElementById("transparencySlider").value / 100;
}

function updateParentBGColor(element) {


    let rgbColor = hexToRgb(element.dataset.clr);
    //let rgbColor = element.dataset.clr;
    let textColour = getFontColorForRGBbackGroundColor(rgbColor);

    let previewDiv = element.parentElement.parentElement.parentElement;
    //let previewDiv = parentSecDiv.querySelector('.secPreview');

    if (previewDiv.style.display != "none") {

        let bannerDiv = previewDiv.querySelector('.shopTopBanner');
        bannerDiv.style.backgroundColor = element.style.backgroundColor;;
        bannerDiv.style.color = textColour;
        
    }
}


function getFontColorForRGBbackGroundColor(rgbColor) {
    let brightness = Math.round(((parseInt(rgbColor.r) * 299) +
        (parseInt(rgbColor.g) * 587) +
        (parseInt(rgbColor.b) * 114)) / 1000);

    let textColour = (brightness > 125) ? 'black' : 'white';
    return textColour;
}

function hexToRgb(hex) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
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


function updatePreviewDiv(element) {
    let parentSecDiv = element.parentElement;
    let childTextArea = element;
    let secText = childTextArea.value;
    let previewDiv = parentSecDiv.querySelector('.secPreview');

    previewDiv.innerHTML = "<div contenteditable='true' class='revealDummy' style=' margin: 10px;'><div class='slides'>" + secText + "</div></div>";

    if (parentSecDiv.dataset.backgroundvideo == "") {
        if (parentSecDiv.dataset.background == "") {
            //Background color
            //secProps = secProps + " data-background = '" + parentSecDiv.dataset.bgcolor + "'";
            previewDiv.style.backgroundColor = parentSecDiv.dataset.bgcolor;
        } else {
            //Background image
            //secProps = secProps + " data-background-image = '/bizzlistings/img/" + parentSecDiv.dataset.background + "' ";
            previewDiv.style.backgroundImage = "url('/bizzlistings/img/" + parentSecDiv.dataset.background + "')";
        }
    } else {
        //Background video
        //secProps = secProps + " data-background-video = '/bizzlistings/video/" + parentSecDiv.dataset.backgroundvideo + "' ";
    }

}

function updatePreviewUsingDivs(componentid) {

    let elems = document.getElementsByClassName("secdiv");

    let tmprHTML = "<div class='reveal deck1' style=' margin: 10px;'><div class='slides'>";

    for (let i = 0; i < elems.length; i++) {

        let element = elems[i];
        //let childTextArea = element.querySelector('.secDivTextArea');
        //let secText = childTextArea.value;
        let slidesDiv = element.querySelector('.slides');
        let secText = slidesDiv.innerHTML

        let secProps = "";

        let transition = element.dataset.transition;
        secProps = secProps + " data-transition='" + transition + "'";

        if (element.dataset.backgroundvideo == "") {
            if (element.dataset.background == "") {
                //Background color
                secProps = secProps + " data-background = '" + element.dataset.bgcolor + "'";
            } else {
                //Background image
                secProps = secProps + " data-background-image = '/bizzlistings/img/" + element.dataset.background + "' ";
            }
        } else {
            //Background video
            secProps = secProps + " data-background-video = '/bizzlistings/video/" + element.dataset.backgroundvideo + "' ";
        }

        if (element.dataset.autoanimate == "Yes") {
            secProps = secProps + " data-auto-animate ";
        }


        //secText = secText.substring(0, secText.indexOf("#00ffff"));
        //tmprHTML = tmprHTML + "<section data-transition='" + transition + "'  data-background='" + background + "'  >" + secText + "</section>";
        tmprHTML = tmprHTML + "<section " + secProps + "  >" + secText + "</section>";

    }

    tmprHTML = tmprHTML + "</div></div>";


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
            let elem = event.fragment;
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

    let itemImages = document.getElementsByClassName("myitemImages");
    if (itemImages.length < 1) {
        return;
    }

    if (elem != "dummy") {
        let parent = elem.parentElement;
        //itemImages = parent.querySelectorAll(".myitemImages");
        itemImages = parent.getElementsByClassName("myitemImages");

        if (n > itemImages.length) { itemImageIndex = 1 }
        if (n < 1) { itemImageIndex = itemImages.length }
        for (let i = 0; i < itemImages.length; i++) {
            itemImages[i].style.display = "none";
        }
        itemImages[itemImageIndex - 1].style.display = "block";
    }

}

function toggleSecPreview(element) {
    let parentSecDiv = element.parentElement.parentElement;
    let childTextArea = parentSecDiv.querySelector('.secDivTextArea');

    let previewDiv = parentSecDiv.querySelector('.secPreview');
    let slidesDiv = previewDiv.querySelector('.slides');

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

    let parent = elem.parentElement.parentElement.parentElement;
    let tablinks = parent.querySelectorAll('.shopTablinks');
    let tabcontent = parent.querySelectorAll('.shopTabcontent');
    //let x = document.getElementById("toastsnackbar_center");

    for (let i = 0; i < tablinks.length; i++) {
        if (tablinks[i].classList.contains("active")) {

            if ((tablinks[i].innerHTML == "Add Images") || (tablinks[i].innerHTML == "Save Item")) {
                let imgContainer = tabcontent[i].parentElement.parentElement.querySelector(".itemImageshow-container");
                let containerHTML = imgContainer.innerHTML;
                let images = imgContainer.querySelectorAll(".myitemImages");
                let tempHTML = "";
                


                if (containerHTML.includes("addImages.png")){                    
                    tempHTML = "Please remove default image and add your images. Save the changes before going to next tab <div class='float_right marginleft_5px hover_pointer' onclick='hideParentToastDiv(this)'><i class='fa fa-window-close'></i> </div>" ;
                    document.getElementById("popupDivId").innerHTML = tempHTML;
                    placePopupAtPosFromBtn(elem, -100, -200);
                    //x.innerHTML = tempHTML;
                    //x.style.display = "block";
                    return;                    
                }else if (images.length < 1) {
                    tempHTML = "Please add your images. Save the changes before going to next tab <div class='float_right marginleft_5px hover_pointer' onclick='hideParentToastDiv(this)'><i class='fa fa-window-close'></i> </div>" ;
                    //x.innerHTML = tempHTML;
                    //x.style.display = "block";
                    document.getElementById("popupDivId").innerHTML = tempHTML;
                    placePopupAtPosFromBtn(elem, -100, -200);
                    return;    
                }
            }else if ((tablinks[i].innerHTML == "Name") || (tablinks[i].innerHTML == "Save Item")){
                let enteredName = tabcontent[i].parentElement.parentElement.querySelector(".itemNameCls").innerHTML
                if (enteredName == ""){
                    tempHTML = "Please enter the name <div class='float_right marginleft_5px hover_pointer' onclick='hideParentToastDiv(this)'><i class='fa fa-window-close'></i> </div>" ;
                    //x.innerHTML = tempHTML;
                    //x.style.display = "block";
                    document.getElementById("popupDivId").innerHTML = tempHTML;
                    placePopupAtPosFromBtn(elem, -100, -100);
                    return;
                }
            }else if ((tablinks[i].innerHTML == "Location") || (tablinks[i].innerHTML == "Save")){
                let shopcity = document.getElementById("shopcity").innerHTML;
                let shopstate  = document.getElementById("shopstate").innerHTML;
                let shopcountry = document.getElementById("shopcountry").innerHTML;

                if ((shopcity == "") ||(shopstate == "") || (shopcountry == "")){
                    tempHTML = "City/Town/Village, State and Country information is required <div class='float_right marginleft_5px hover_pointer' onclick='hideParentToastDiv(this)'><i class='fa fa-window-close'></i> </div>" ;
                    //x.innerHTML = tempHTML;
                    //x.style.display = "block";
                    document.getElementById("popupDivId").innerHTML = tempHTML;
                    placePopupAtPosFromBtn(elem, -100, -200);
                    return;                   
                }
            }

            tablinks[i].classList.remove("active");
            tabcontent[i].style.display = "none";
            tablinks[i + 1].classList.add("active");
            tabcontent[i + 1].style.display = "block";
            break;
        }

    }


}
function openShopTab(evt, shopTabId) {
    let tabcontent, tablinks;

    let elem = evt.currentTarget;
    parent = elem.parentElement.parentElement;

    //tabcontent = document.getElementsByClassName("shopTabcontent");
    tabcontent = parent.querySelectorAll('.shopTabcontent');
    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }



    //tablinks = document.getElementsByClassName("shopTablinks");
    tablinks = parent.querySelectorAll('.shopTablinks');
    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }



    //document.getElementById(shopTabId).style.display = "block";
    parent.querySelector("#" + shopTabId).style.display = "block";
    evt.currentTarget.className += " active";

    if (shopTabId == "addImages") {
        let parentDiv = evt.currentTarget.parentElement.parentElement.parentElement;
        let img_list = parentDiv.querySelectorAll('.myitemImages'); // returns NodeList
        let img_array = [...img_list]; // converts NodeList to Array

        let newHTML = "<label class='informationBox fontsize_14px'>Add/remove item images using the buttons below</label>";
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
        //let parentDiv = elem;

        elem.parentNode.removeChild(elem);

        //parentDiv.innHTML = "";
        //parentDiv.style.display = "none";
    }

}

async function discontinueItem(evt) {

    let parentDiv = evt.currentTarget.parentElement.parentElement.parentElement.parentElement;
    let itemid = parentDiv.dataset.itemid;

    const confirm = await ui.userConfirmation('Are you sure you want delete the item?');

    if (confirm) {
        $.ajax({
            url: the.hosturl + '/php/process.php',
            type: 'POST',
            data: jQuery.param({
                usrfunction: "discontinueitem",
                itemid: itemid
            }),
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            success: function (response) {
                parentDiv.parentNode.removeChild(parentDiv);

                let x = document.getElementById("toastsnackbar");
                x.innerHTML = "Item removed from your store";
                //x.className = "show";
                x.classList.add("show");
                setTimeout(function () { 
                    //x.className = x.className.replace("show", ""); 
                    x.classList.remove("show");
                }, 3000);
            },
            error: function (xhr, status, error) {
            }
        });
    }

}
function deselectOtherInputCheckBox(elem) {
    //elem.checked = false;

    parent = elem.parentElement.parentElement.parentElement;
    let allInputCheckBoxes = parent.querySelectorAll("input");
    for (let i = 0; i < allInputCheckBoxes.length; i++) {
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
    let c_value = document.cookie;
    let c_start = c_value.indexOf(" " + c_name + "=");
    if (c_start == -1) {
        c_start = c_value.indexOf(c_name + "=");
    }
    if (c_start == -1) {
        c_value = null;
    }
    else {
        c_start = c_value.indexOf("=", c_start) + 1;
        let c_end = c_value.indexOf(";", c_start);
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

function markFavourite(elem) {
    if (localStorage.getItem("userLoggedIn") == "n") {

        // let tempHTML = "<div><a class='loginLinkCls' href='javascript:goToLogin()'>LOG IN</a> to add this to your favourites"
        //     + '<button class="helper btnCenterAlign width_100px margintop_10px" onclick="closePopup();">Close</button>'
        //     + "</div>";

        let tempHTML = "<div><a class='loginLinkCls' href='javascript:goToLogin()'>LOG IN</a> to add this to your favourites"
        + "<div class='float_right marginleft_5px hover_pointer' onclick='closePopup()'><i class='fa fa-window-close'></i> </div>"
        + "</div>";

        document.getElementById("popupDivId").innerHTML = tempHTML;

        placePopupUnderClickedBtnParent(elem);
        setTimeout(() => {
            document.getElementById("popupDivId").style.display = "none";
        }, 5000);



    } else {

        let innerIcon = elem.querySelector(".fa");

        if (innerIcon.classList.contains('color_light_pink')) {
            innerIcon.classList.remove('color_light_pink');
            innerIcon.classList.add('color_red_heart');
            addToFavorites(elem);
            let tempHTML = "Added to your favourites"
            + "<div class='float_right marginleft_5px hover_pointer' onclick='closePopup()'><i class='fa fa-window-close'></i> </div>"
            + "</div>";

            document.getElementById("popupDivId").innerHTML = tempHTML;
            placePopupUnderClickedBtnParent(elem);
        } else {


            innerIcon.classList.remove('color_red_heart');
            innerIcon.classList.add('color_light_pink');
            removeFromFavorites(elem);
            let tempHTML = "Removed from your favourites"
            + "<div class='float_right marginleft_5px hover_pointer' onclick='closePopup()'><i class='fa fa-window-close'></i> </div>"
            + "</div>";

            document.getElementById("popupDivId").innerHTML = tempHTML;
            placePopupUnderClickedBtnParent(elem);
        }


    }
}

function openItemChat(elem) {
        if (localStorage.getItem("userLoggedIn") == "n") {
        // let tempHTML = "<div><a class='loginLinkCls' href='javascript:goToLogin()'>LOG IN</a> to contact the listing owner "
        //     + '<button class="helper btnCenterAlign width_100px margintop_10px" onclick="closePopup();">Close</button>'
        //     + "</div>";

        let tempHTML = "<div><a class='loginLinkCls' href='javascript:goToLogin()'>LOG IN</a> to contact the listing owner "
        + "<div class='float_right marginleft_5px hover_pointer' onclick='closePopup()'><i class='fa fa-window-close'></i> </div>"
        + "</div>";

        document.getElementById("popupDivId").innerHTML = tempHTML;

        placePopupUnderClickedBtnParent(elem);
        setTimeout(() => {
            document.getElementById("popupDivId").style.display = "none";
        }, 5000);        
    } else {

        let itemid = elem.parentElement.parentElement.parentElement.parentElement.dataset.itemid;
        let itemuid = elem.parentElement.parentElement.parentElement.parentElement.dataset.itemuid;

        $.ajax({
            url: the.hosturl + '/php/process.php',
            type: 'POST',
            data: jQuery.param({ itemid: itemid, itemuid: itemuid, usrfunction: "getconversationid" 
            }),
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            success: function (retstatus) {
                initChat();
                let obj = JSON.parse(retstatus);
                getConversation(obj.id);
            },
            error: function (xhr, status, error) {
                //alert(xhr);
                console.log("error");

            }
        });
        
    }
}

function provideReview(elem) {
    if (localStorage.getItem("userLoggedIn") == "n") {
        let tempHTML = "<div><a class='loginLinkCls' href='javascript:goToLogin()'>LOG IN</a> to submit review for this item "
        + "<div class='float_right marginleft_5px hover_pointer' onclick='closePopup()'><i class='fa fa-window-close'></i> </div>"
        + "</div>";

        document.getElementById("popupDivId").innerHTML = tempHTML;

        placePopupUnderClickedBtnParent(elem);

        setTimeout(() => {
            document.getElementById("popupDivId").style.display = "none";
        }, 5000);

    } else {
        let tempHTML = ratingStars
            + '<div class="reviewCommentDivCls" contenteditable="true" data-text="Select rating stars and enter review comments"></div>'
            + '<button class="helper width_100px margintop_10px float_left" onclick="submitReview(' + "'" + elem.parentElement.parentElement.parentElement.parentElement.dataset.itemid + "'" + ');">Submit</button>'

            + '<button class="helper width_100px margintop_10px float_right" onclick="closePopup();">Cancel</button>'
            + "</div>";

        document.getElementById("popupDivId").innerHTML = tempHTML;

        placePopupUnderClickedBtnParent(elem);

    }
}

function reportItem(elem) {
    if (localStorage.getItem("userLoggedIn") == "n") {
        let tempHTML = "<div><a class='loginLinkCls' href='javascript:goToLogin()'>LOG IN</a> to report issue with this item "
            + "<div class='float_right marginleft_5px hover_pointer' onclick='closePopup()'><i class='fa fa-window-close'></i> </div>"
            + "</div>";

        document.getElementById("popupDivId").innerHTML = tempHTML;

        placePopupUnderClickedBtnParent(elem);

        setTimeout(() => {
            document.getElementById("popupDivId").style.display = "none";
        }, 5000);

    } else {
        let tempHTML = '<div class="warningMsg width_250px">Please use this only to report inappropriate listing</div>'
            + '<div class="reviewCommentDivCls" contenteditable="true" data-text="Provide details of why this listing is inappropriate"></div>'
            + '<button class="helper width_100px margintop_10px float_left" onclick="reportIssue(' + "'" + elem.parentElement.parentElement.parentElement.parentElement.dataset.itemid + "'" + ');">Submit</button>'

            + '<button class="helper width_100px margintop_10px float_right" onclick="closePopup();">Cancel</button>'
            + "</div>";

        document.getElementById("popupDivId").innerHTML = tempHTML;

        placePopupUnderClickedBtnParent(elem);
    }
}



function placePopupUnderClickedBtnParent(elem) {
    $("#popupDivId").css({
        'position': 'absolute',
        'left': elem.parentElement.offsetLeft,
        'top': elem.offsetTop + elem.clientHeight + 50,
        'display': 'block'
    })
    //}).show("slow").delay(3000).hide("slow");
}

function placePopupUnderClickedBtn(elem) {
    $("#popupDivId").css({
        'position': 'absolute',
        'left': elem.offsetLeft,
        'top': elem.offsetTop + elem.clientHeight + 50,
        'display': 'block'
    })
    //}).show("slow").delay(3000).hide("slow");
}

function placePopupAtPosFromBtn(elem, xDir, yDir ) {

    let div = elem;
    let topOffset = 0;
    let leftOffset = div.offsetLeft;
    
    while (div) {
      topOffset += div.offsetTop;
    //   leftOffset += div.offsetLeft;
      div = div.offsetParent;
    }

    $("#popupDivId").css({
        'position': 'absolute',
        'left': leftOffset + xDir + "px",
        'top': topOffset + yDir + "px",
        'display': 'block'
    })
}
function placePopupAtPosFromBtnXOffset(elem, xDir, yDir ) {

    let div = elem;
    let topOffset = 0;
    let leftOffset = div.offsetLeft;
    
    while (div) {
      topOffset += div.offsetTop;
      leftOffset += div.offsetLeft;
      div = div.offsetParent;
    }

    $("#popupDivId").css({
        'position': 'absolute',
        'left': leftOffset + xDir + "px",
        'top': topOffset + yDir + "px",
        'display': 'block'
    })
}

function closePopup() {
    $("#popupDivId").css({
        'display': 'none'
    });
}

function removeFromFavorites(elem) {

    let itemid = elem.parentElement.parentElement.parentElement.parentElement.dataset.itemid;

    let tags = localStorage.getItem("favitems");

    let favitemsArr = [];


    if (tags != null) {
        if ((tags != "") && (tags != undefined) && (tags != [])) {
            favitemsArr = JSON.parse(tags);
        }
    }

    favitemsArr = favitemsArr.filter(e => e !== itemid);

    updateFavoriteItems(favitemsArr);

    localStorage.setItem("favitems", JSON.stringify(favitemsArr));
}

function addToFavorites(elem) {

    let itemid = elem.parentElement.parentElement.parentElement.parentElement.dataset.itemid;

    let tags = localStorage.getItem("favitems");

    let favitemsArr = [];


    if (tags != null) {
        if ((tags != "") && (tags != undefined) && (tags != [])) {
            favitemsArr = JSON.parse(tags);
        }
    }


    const elementIndex = favitemsArr.indexOf(itemid)

    if (!elementIndex != -1) {
        favitemsArr.push(itemid);
    }
    updateFavoriteItems(favitemsArr);
    localStorage.setItem("favitems", JSON.stringify(favitemsArr));
}

function updateFavoriteItems(favitemsArr) {

    $.ajax({
        url: the.hosturl + '/php/process.php',
        type: 'POST',
        data: jQuery.param({
            usrfunction: "updatefavorites",
            favitems: JSON.stringify(favitemsArr)
        }),
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        success: function (response) {
        },
        error: function (xhr, status, error) {
        }
    });
}

function getFavoritesList() {

    let tags = localStorage.getItem("favitems")
    if ((tags != null) && (tags != undefined)) {
        if ((tags != "") && (tags != "null")) {
            return;
        }
    }

    $.ajax({
        url: the.hosturl + '/php/process.php',
        type: 'POST',
        data: jQuery.param({
            usrfunction: "getfavorites"
        }),
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        success: function (response) {
            let tags = JSON.parse(response);
            // console.log(tags[0]);
            // console.log(tags[0].favoriteitems);

            // localStorage.setItem("favitems", JSON.stringify(tags[0].favoriteitems));
            // localStorage.setItem("favstores", JSON.stringify(tags[0].favoritestores));
            if (tags != ""){
                localStorage.setItem("favitems", tags[0].favoriteitems);
                localStorage.setItem("favstores", tags[0].favoritestores);
            }


            //localStorage.setItem("favsList", JSON.stringify(response));
        },
        error: function (xhr, status, error) {
            //  console.log(error);
            //  console.log(xhr);
        }
    });
}

function getstoreinfo(){
    let tags = localStorage.getItem("storeinfo")
    if ((tags != null) && (tags != undefined)) {
        if ((tags != "") && (tags != "null")) {
            if (tags == "y"){
                document.getElementById("mystoreLinkId").innerHTML = "MY STORE";
            }
            return;
        }
    }

    $.ajax({
        url: the.hosturl + '/php/process.php',
        type: 'POST',
        data: jQuery.param({
            usrfunction: "getstoreinfo"
        }),
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        success: function (response) {
            response = JSON.parse(response);
            // console.log(tags[0]);
            // console.log(tags[0].favoriteitems);

            // localStorage.setItem("favitems", JSON.stringify(tags[0].favoriteitems));
            // localStorage.setItem("favstores", JSON.stringify(tags[0].favoritestores));

            localStorage.setItem("storeinfo", response);

            if (response == "y"){
                document.getElementById("mystoreLinkId").innerHTML = "MY STORE";
            }

            //localStorage.setItem("favsList", JSON.stringify(response));
        },
        error: function (xhr, status, error) {
            //  console.log(error);
            //  console.log(xhr);
        }
    });
}


function colorFavoriteItems() {
    let itmContainers = document.querySelectorAll(".itemContainerCls");

    let tags = localStorage.getItem("favitems");

    let favitemsArr = [];


    if (tags != null) {
        if ((tags != "") && (tags != undefined) && (tags != [])) {
            favitemsArr = JSON.parse(tags);
        } else {
            return;
        }
    } else {
        return;
    }

    for (let i = 0; i < itmContainers.length; i++) {

        let itemid = itmContainers[i].dataset.itemid;
        let elementIndex = favitemsArr.indexOf(itemid);

        if (elementIndex != -1) {
            let innerIcon = itmContainers[i].querySelector(".fa");
            innerIcon.classList.remove('color_light_pink');
            innerIcon.classList.add('color_red_heart');
        }
    }

}

function submitReview(itemid) {

    let rating = "";
    let elem = document.querySelector('input[name="rate"]:checked');
    if (elem == null) {
        let x = document.getElementById("toastsnackbar");
        x.innerHTML = "Please select rating stars";
        //x.className = "show";
        x.classList.add("show");
        setTimeout(function () { 
            //x.className = x.className.replace("show", ""); 
            x.classList.remove("show");
        }, 3000);
        return;
    } else {
        rating = elem.value;
    }
    //let itemid = elem.parentElement.parentElement.parentElement.parentElement.dataset.itemid;
    let comment = document.querySelector('.reviewCommentDivCls').innerHTML;
    $.ajax({
        url: the.hosturl + '/php/process.php',
        type: 'POST',
        data: jQuery.param({
            usrfunction: "updateitemreviews",
            itemid: itemid,
            stars: rating,
            comment: comment
        }),
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        success: function (response) {
        },
        error: function (xhr, status, error) {
        }
    });

    let tempHTML = "Thank you for submitting your review."
        + '<button class="helper btnCenterAlign width_100px margintop_10px" onclick="closePopup();">Close</button>'
        + "</div>";

    document.getElementById("popupDivId").innerHTML = tempHTML;
    //placePopupUnderClickedBtnParent(elem);
}

function reportIssue(itemid) {

    let comment = document.querySelector('.reviewCommentDivCls').innerHTML;

    if (comment == "") {
        let x = document.getElementById("toastsnackbar");
        x.innerHTML = "Please enter the details in the box";
        //x.className = "show";
        x.classList.add("show");
        setTimeout(function () { 
            //x.className = x.className.replace("show", ""); 
            x.classList.remove("show");
        }, 3000);
        return;
    }

    $.ajax({
        url: the.hosturl + '/php/process.php',
        type: 'POST',
        data: jQuery.param({
            usrfunction: "reportissue",
            itemid: itemid,
            comment: comment
        }),
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        success: function (response) {
        },
        error: function (xhr, status, error) {
        }
    });

    let tempHTML = "Thank you for reporting the issue."
        + '<button class="helper btnCenterAlign width_100px margintop_10px" onclick="closePopup();">Close</button>'
        + "</div>";

    document.getElementById("popupDivId").innerHTML = tempHTML;
    //placePopupUnderClickedBtnParent(elem);
}

function reportChatIssue(convid){
    let comment = document.querySelector('.reviewCommentDivCls').innerHTML;

    if (comment == "") {
        let x = document.getElementById("toastsnackbar");
        x.innerHTML = "Please enter the details in the box";
        //x.className = "show";
        x.classList.add("show");
        setTimeout(function () { 
            //x.className = x.className.replace("show", ""); 
            x.classList.remove("show");
        }, 3000);
        return;
    }

    $.ajax({
        url: the.hosturl + '/php/process.php',
        type: 'POST',
        data: jQuery.param({
            usrfunction: "reportissue",
            itemid: convid,
            comment: "^Chat reported^ - " + comment
        }),
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        success: function (response) {
        },
        error: function (xhr, status, error) {
        }
    });

    let tempHTML = "Thank you for reporting the issue."
        + '<button class="helper btnCenterAlign width_100px margintop_10px" onclick="closePopup();">Close</button>'
        + "</div>";

    document.getElementById("popupDivId").innerHTML = tempHTML;
    //placePopupUnderClickedBtnParent(elem);
}

function makeElementDraggable(parentElmntId, headerElemId) {
    let parentElmnt = document.getElementById(parentElmntId);
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    let isMouseDown;
    let initX,initY,height = parentElmnt.offsetHeight,width = parentElmnt.offsetWidth;

    if (document.getElementById(headerElemId)) {
      /* if present, the header is where you move the DIV from:*/
      document.getElementById(headerElemId).onmousedown = dragMouseDownA;
      document.getElementById(headerElemId).onmouseup = endMouseDragB;


      document.addEventListener('mousemove', function(e) {
        if (isMouseDown) {
          var cx = e.clientX - initX,
              cy = e.clientY - initY;
          if (cx < 0) {
            cx = 0;
          }
          if (cy < 0) {
            cy = 0;
          }
          if (window.innerWidth - e.clientX + initX < width) {
            cx = window.innerWidth - width;
          }
          if (e.clientY > window.innerHeight - height+ initY) {
            cy = window.innerHeight - height;
          }
          parentElmnt.style.left = cx + 'px';
          parentElmnt.style.top = cy + 'px';
        }
        })

    } 
    function dragMouseDownA(e){
        isMouseDown = true;
        document.body.classList.add('no-select');
        initX = e.offsetX;
        initY = e.offsetY;
    }

    function endMouseDragB(e){
        isMouseDown = false;
        document.body.classList.remove('no-select');
    }

    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }
  
    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      parentElmnt.style.top = (parentElmnt.offsetTop - pos2) + "px";
      parentElmnt.style.left = (parentElmnt.offsetLeft - pos1) + "px";
    }
  
    function closeDragElement() {
      /* stop moving when mouse button is released:*/
      document.onmouseup = null;
      document.onmousemove = null;
    }
}

function hideParentToastDiv(elem){
    //elem.parentElement.classList.remove("show");
    elem.parentElement.style.display = "none";
}

function showpolicyAfterURLHistUpd(){

    //let myUrl = window.location.protocol + "//" + window.location.host + "/items/" + category;

    let path = window.location.pathname;
    let myUrl = path.substring(0, path.indexOf('/', path.indexOf('bizzlistings')) + 1) + "?target=policy";


    const nextURL = myUrl;
    const nextTitle = 'Code Helper';
    const nextState = {
        additionalInformation: 'Updated the URL with JS'
    };

    // This will create a new entry in the browser's history, without reloading
    window.history.pushState(nextState, nextTitle, nextURL);

    showPolicy();
}

function showPolicy(){
    //sessionStorage.setItem("lastUrl", window.location.href);

    document.getElementById("loginDivId").style.display = "none";
    document.getElementById("contactusDivId").style.display = "none";
    document.getElementById("howtoDivId").style.display = "none";
    document.getElementById("homeDivId").style.display = "none";

    let tempHTML = '<div class="header_1 slide-in-left"><label class="bannerLargeText">Usage Policy</label><br><hr></div>';
    tempHTML = tempHTML + "<p>The following Fair Usage Policy is designed to ensure that all users of our website can benefit from a fair and equal experience. By using our website, you agree to abide by this policy.</p> <ol>    <li>Prohibited Activities: You are not allowed to engage in any activities that could harm the website or its users, including, but not limited to:</li> </ol><p>a) Posting or uploading any inappropriate, offensive, or illegal content. b) Attempting to gain unauthorized access to other users&apos; accounts or personal information. c) Engaging in any fraudulent or deceptive practices. d) Harassing, threatening, or intimidating other users. e) Violating any applicable laws or regulations.</p> <ol start='2'>    <li>         <p>Limitations on Usage: We reserve the right to limit or restrict your usage of the website if we suspect that you are engaging in any activities that are not in compliance with this policy or our terms and conditions.</p>    </li>     <li>        <p>Account Suspension or Termination: We reserve the right to suspend or terminate your account if we determine that you have violated this policy or our terms and conditions. We may also suspend or terminate your account if we receive complaints from other users about your behavior on the website.</p>     </li>    <li>         <p>Monitoring: We may monitor your usage of the website to ensure compliance with this policy and our terms and conditions. This may include reviewing your account activity, messages, and posts.</p>    </li>     <li>        <p>Changes to Policy: We may change this Fair Usage Policy at any time without prior notice. Your continued use of the website after any changes to this policy will constitute your acceptance of the revised policy.</p>     </li></ol> <p>By using our website, you acknowledge that you have read, understood, and agree to abide by this Fair Usage Policy.</p>";
    tempHTML = tempHTML + '<br> <br> <button class="button_type1 btnCenterAlign width_200px" onclick="goToPrevURL()">Close</button><br><br><br>';
    document.getElementById("itemListDivId").style.display = "block";
    document.getElementById("itemListDivId").innerHTML = tempHTML;
    $('html, body').animate({
        scrollTop: $("#itemListDivId").offset().top - 80
    }, 100);
}

function goToPrevURL(){
    let myUrl = window.location.protocol + "//" + window.location.host +
    window.location.pathname;

    let lastUrl = sessionStorage.getItem("lastUrl");
    if ((lastUrl == null) || (lastUrl.includes("?target=login")) || (lastUrl.includes("?target=policy"))) {
        lastUrl = myUrl + "?target=" + "home"
    }
    window.open(lastUrl, "_self");
}

function myfavorites(){
    removeActiveClassFromNavLinks();
    let x = document.getElementById("myfavoritesLinkId");
    x.classList.add("active");


    document.getElementById("loginDivId").style.display = "none";
    document.getElementById("contactusDivId").style.display = "none";
    document.getElementById("howtoDivId").style.display = "none";
    document.getElementById("homeDivId").style.display = "none";


    let tf = JSON.parse(sessionStorage.getItem("itemsList"));
    let rows = JSON.parse(tf);
    
    let tags = localStorage.getItem("favitems");
    let favitemsArr = [];

    if (tags != null) {
        if ((tags != "") && (tags != undefined) && (tags != [])) {
            favitemsArr = JSON.parse(tags);
        } 
    } 

    if (favitemsArr.length == 0){
        document.getElementById("itemListDivId").style.display = "block";
        document.getElementById("itemListDivId").innerHTML = "You have not marked any item as favorite yet <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>";
        document.getElementById("itemDivId").style.display = "none";
        
        return;
    }else {
        rows = rows.filter(function (entry) {
            return favitemsArr.includes(entry.itemid) ;
        });
        populateItemsList(rows);
    }

}

function mychat(){
    document.querySelector('.chat-widget').style.display = 'flex';
    // Animate the chat widget
    document.querySelector('.chat-widget').getBoundingClientRect();
    document.querySelector('.chat-widget').classList.add('chatopen');
    // Close button OnClick event handler
    document.querySelector('.close-chat-widget-btn').onclick = event => {
        event.preventDefault();
        // Close the chat
        document.querySelector('.chat-widget').classList.remove('chatopen');
    };
 
    //document.querySelector('.chat-widget-login-tab .msg').innerHTML = 'Success!';

    fetch('/bizzlistings/php/chatconversations.php', { cache: 'no-store' }).then(response => response.text()).then(data => {
        // Update the status
        //status = 'Idle';
        // Update the conversations tab content

        //Check for no messages
        let tempData = data.replace('<div class="chat-widget-conversations">','');
        tempData = tempData.replace('</div>','');
        tempData = tempData.replace(' ','');
        tempData = tempData.replace(' ','');
        tempData = tempData.replace(/(?:\r\n|\r|\n)/g, '');
        if (tempData.trim() == ""){
            let x = document.getElementById("toastsnackbar");
            x.innerHTML = "No messages are found. To initiate the conversation, go to the product page and click on chat icon";

            x.classList.add("show");
            setTimeout(function () { 
                x.classList.remove("show");
            }, 6000);
            document.querySelector('.chat-widget').classList.remove('chatopen');
            return;
        }

        document.querySelector('.chat-widget-conversations-tab').innerHTML = data;
        // Execute the conversation handler function
        conversationHandler();
        // Transition to the conversations tab
        selectChatTab(1);

        setTimeout(() => {
            try{
                let elems = document.querySelectorAll(".shop-user-city") ;
                let elemsB = document.querySelectorAll("#reportChatUserDivId");

                for (let i = 0; i < elems.length; i++) {
                    elems[i].innerHTML = "";
                    elemsB[i].style.display = "none";  
                    //console.log("done2");
                    //document.getElementById("headerDragger").innerHTML = "";
                }
                //document.getElementById("reportChatUserDivId").style.display = "none";                
            }catch(e){
    
            }            
        }, 50);

    });

    makeElementDraggable("chat-window","chat-window-header");
}

function reportChatUser(elem){
    let convid = document.getElementById("convid").value;

    let tempHTML = '<div class="warningMsg width_250px">Please use this only to report inappropriate messages</div>'
    + '<div class="reviewCommentDivCls" contenteditable="true" data-text="Provide details of what was inappropriate in the message"></div>'
    + '<button class="helper width_100px margintop_10px float_left" onclick="reportChatIssue(' + "'" + convid + "'" + ');">Submit</button>'

    + '<button class="helper width_100px margintop_10px float_right" onclick="closePopup();">Cancel</button>'
    + "</div>";

    document.getElementById("popupDivId").innerHTML = tempHTML;

    //placePopupUnderClickedBtn(elem);
    //placePopupUnderClickedBtnParent(elem);
    placePopupAtPosFromBtn(elem, -300, -10);
    //placePopupAtPosFromBtnXOffset(elem, -300, -10);
}


function checkAnimation(){

    let $animationElements = $('.animate_inview');
    let $window = $(window);

    let windowHeight = $window.height();
    let windowTopPosition = $window.scrollTop();
    let windowBottomPosition = (windowTopPosition + windowHeight);

    $.each($animationElements, function () {

        let $element = $(this);
        let elementHeight = $element.outerHeight();
        let elementTopPosition = $element.offset().top;
        let elementBottomPosition = (elementTopPosition + elementHeight);
        if (! $element.hasClass('slide-in-right')){ 
            if ((elementBottomPosition >= windowTopPosition) &&
                (elementTopPosition <= windowBottomPosition)) {
                $element.addClass('slide-in-right');
            // } else {
            //     $element.removeClass('slide-in-right');//SM-Removed this to avoid multiple times animation
            }
         }
    });
}

