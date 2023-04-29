function admshowAdditionalMenuItemsForLoggedIn() {
    document.getElementById("logoutLinkId").style.display = "block";
    document.getElementById("myfavoritesLinkId").style.display = "block";
    document.getElementById("mychatLinkId").style.display = "block";
    document.getElementById("admLinkId").style.display = "block";

    document.getElementById("itemsPendingReviewLinkId").style.display = "block";
    document.getElementById("reportsPendingReviewLinkId").style.display = "block";
    document.getElementById("accMgmtLinkId").style.display = "block";
    document.getElementById("messageLinkId").style.display = "block";
    document.getElementById("reviewsLinkId").style.display = "block";
    document.getElementById("loginLinkId").style.display = "none";
}

function admhideMenuItemsForLoggedOut() {
    document.getElementById("logoutLinkId").style.display = "none";
    document.getElementById("myfavoritesLinkId").style.display = "none";
    document.getElementById("mychatLinkId").style.display = "none";

    document.getElementById("itemsPendingReviewLinkId").style.display = "none";
    document.getElementById("admLinkId").style.display = "none";
    document.getElementById("reportsPendingReviewLinkId").style.display = "none";
    document.getElementById("accMgmtLinkId").style.display = "none";
    document.getElementById("messageLinkId").style.display = "none";
    document.getElementById("reviewsLinkId").style.display = "none";
    document.getElementById("loginLinkId").style.display = "block";
}

function admcheckURL() {

    let LocationSearchStr = location.search;
    let find = '%20';
    let re = new RegExp(find, 'g');
    let pageName = "";
    let path = window.location.pathname;

    LocationSearchStr = LocationSearchStr.replace(re, ' ');

    if (path.indexOf('/passkey/') > -1) {
        let ar = path.split('/passkey/');
        let accountactivationkey = ar[1];
        activateAccount(accountactivationkey);
        return;
    }
    if (localStorage.getItem("cookieAccepted") == "y") {
        document.getElementById("cookie-div-id").style.display = "none"
    }

    let myCookie = getCookie("cookname");

    document.getElementById("contactusDivId").style.display = "none";
    document.getElementById("howtoDivId").style.display = "none";
    document.getElementById("homeDivId").style.display = "none";
    document.getElementById("itemDivId").style.display = "none";
    document.getElementById("itemListDivId").style.display = "none";
    document.getElementById("itemEditDivId").style.display = "none";

    if (myCookie == null) {

        localStorage.setItem("userLoggedIn", "n");
        document.getElementById("loginLinkId").style.display = "block";

        admhideMenuItemsForLoggedOut();
        document.getElementById("loginDivId").style.display = "block";
        return;

    } else {

        localStorage.setItem("userLoggedIn", "y");
        document.getElementById("loginLinkId").style.display = "none";

        $.ajax({
            url: the.hosturl + '/php/process.php',
            data: { usrfunction: "checksession" },
            type: 'POST',
            dataType: 'json',
            success: function (retstatus) {
                if (retstatus == "err") {
                    localStorage.setItem("userLoggedIn", "n");
                    admhideMenuItemsForLoggedOut();
                    document.getElementById("loginDivId").style.display = "block";
                    return;
                } else {
                    admshowAdditionalMenuItemsForLoggedIn();

                    getFavoritesList();
                    getstoreinfo();
                    admproceedWithRequest();
                }
            },
            error: function (xhr, status, error) {

            }
        });

    }

}

function admproceedWithRequest() {
    let LocationSearchStr = location.search;
    let find = '%20';
    let re = new RegExp(find, 'g');
    let pageName = "";
    let path = window.location.pathname;

    LocationSearchStr = LocationSearchStr.replace(re, ' ');

    if (path.indexOf('items/') > 0) {
        //let shoptitle = path.replaceAll("/antaksharee/lyrics/","");

        if (sessionStorage.getItem("itemsList") == null) {
            document.getElementById("loaderDivId").style.display = "block";
            setTimeout(function () {
                document.getElementById("loaderDivId").style.display = "none";
                admcheckURL();
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

            document.getElementById("itemEditDivId").style.display = "none";
        } else {
            //populateItemsList();
        }

        if (itemstr.indexOf('/') > 0) {
            document.getElementById("mainContainer").style.width = "100%";
            document.getElementById("itemEditDivId").style.width = "20%";
            document.getElementById("itemEditDivId").innerHTML = "";
            admFnGetItem(itemstr);
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

    if (path.indexOf('/resetkey/') > -1) {
        let ar = path.split('/resetkey/');
        let passwordresetkey = ar[1];
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

    if (path.indexOf('/target/') > -1) {
        let ar = path.split('/target/');
        pageName = ar[1];
    }

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

            x.classList.add("show");
            setTimeout(function () {
                x.classList.remove("show");
            }, 3000);

            return;
        }
        myStore();
        return;
    } else if (pageName == "policy") {
        showPolicy();
        return;
    } else if (pageName == "projectscanner") {
        document.getElementById("bgSVGId").style.display = "none";
        populateStoredProjectList();
        if ((localStorage.getItem("userLoggedIn") == "y") && (localStorage.getItem("userLvl") == "9")) {
            document.getElementById("addNewProjBtnId").style.display = "block";
        }
        document.getElementById("projectscannerDivId").style.width = "100%";
        document.getElementById("helpDivMessage").innerHTML = '<i class="fa fa-info-circle" style="display:none; float: left;  position: absolute; top:35px; left: 10px; color:#cc0000;" ></i>' + "Upload project files and click on the file to scan the code"
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
                admcheckURL();
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
                admcheckURL();
            }, 500);
            return;
        }

        document.getElementById("contactusDivId").style.display = "none";
        document.getElementById("howtoDivId").style.display = "none";

        document.getElementById("itemDivId").style.display = "none";
        document.getElementById("itemEditDivId").style.display = "none";

        document.getElementById("itemListDivId").style.width = "100%";

        //Likely request for store item display
        let storename = path.substring(path.indexOf(the.hosturl) + the.hosturl.length + 1);

        admdisplayStore(storename);

        $(".cardsContainerDivClassPadd").css("height", "200px");
    } else if (pageName == "home") {

        document.getElementById("contactusDivId").style.display = "none";
        document.getElementById("howtoDivId").style.display = "none";
        document.getElementById("homeDivId").style.width = "100%";
        //document.getElementById("mainContainer").style.width = "100%";			
    }
}

function admdisplayStore(storename) {

    let tf = JSON.parse(sessionStorage.getItem("itemsList"));
    let allRows = JSON.parse(tf);

    let storeRow = allRows.filter(function (entry) {
        let title = entry.title;
        let titleSpaceReplaced = title.replaceAll(' ', '-');
        return entry.discontinue == "0" && titleSpaceReplaced.toUpperCase() == storename.toUpperCase();
    });

    if (storeRow.length > 0) {
        document.getElementById("itemDivId").style.display = "block";
        admFnGetItem(storeRow[0].category + "/" + storeRow[0].storename + "/" + storeRow[0].title);
    } else {
        if (storename == "") {
            Show('home');
        } else {
            document.getElementById("itemDivId").innerHTML = "Sorry. The requested page is not found.<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>"
            document.getElementById("itemDivId").style.display = "block";

        }
    }
}

function admFnGetItem(itemstr) {
    $.ajax({
        url: the.hosturl + '/php/process.php',
        type: 'POST',
        data: jQuery.param({
            usrfunction: "getItemadm",
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
                admgetOneItemOfShop(tags);
                $(".cardsContainerDivClassPadd").css("width", "95%");
                $(".cardsContainerDivClassPadd").css("margin", "auto");
                $(".cardsContainerDivClassPadd").css("float", "none");
            } else {
                admgetFullShopDetails(tags, itemstr);
            }
        },
        error: function (xhr, status, error) {
            //console.log(error);
            //console.log(xhr);
        }
    });
}

function admgetOneItemOfShop(tags) {

    let itemid = tags[0].itemid;
    let category = tags[0].category;
    let categoryseq = tags[0].categoryseq;
    let subcategory = tags[0].subcategory;
    let versionseq = tags[0].versionseq;
    let title = tags[0].title;
    let titleseq = tags[0].titleseq;
    //let shortdescription = tags[0].shortdescription;
    let description = tags[0].description;
    let city = tags[0].city;
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

    let itemUrl = path.substring(0, path.indexOf('/', path.indexOf('bizzlistings')) + 1) + "kisna/target/item";
    let categoryUrl = path.substring(0, path.indexOf('/', path.indexOf('bizzlistings')) + 1) + "kisna/items/" + categorySpaceReplaced;
    let storeUrl = path.substring(0, path.indexOf('/', path.indexOf('bizzlistings')) + 1) + "kisna/items/" + categorySpaceReplaced + "/" + storeRow[0].title.replaceAll(" ", "-") + "/" + storeRow[0].title.replaceAll(" ", "-");

    let newHTML = "<div classXX = 'shopContainer' ><div class='display_block marginbottom_12px line_height2 bgcolor_10 color_1'>" +
        '<a class="anchor_tag_btn1" onclick="Show(' + "'" + 'item' + "'" + '); return false;" href ="' + itemUrl + '" class="itemTopLinkCls" ' + ' >' + "All Listings</a>" + " ❯ " +
        '<a class="anchor_tag_btn1" onclick="showcategoryAfterURLHistUpd(' + "'" + category + "'" + '); return false;" href ="' + categoryUrl + '" class="itemTopLinkCls"  >' + category + "</a>" + " ❯ " +
        '<a class="anchor_tag_btn1" href ="' + storeUrl + '" class="itemTopLinkCls"  >' + storeRow[0].title + "</a>" + " ❯ " +
        '<a class="anchor_tag_btn1" href ="' + window.location.href + '" class="itemTopLinkCls"  >' + title + "</a></div>";
    //END - Navigation Links

    //newHTML = newHTML + "<div classXX = 'shopContainerSub' > <h1 classXX='shopContainerH1' > " + title + "</h1></div>";

    //***SM-DONOTDELETE-Maybe used later */
    //newHTML = newHTML + "<div classXX = 'shopContainerSub' >  <span class='newStoreTypeHdr slide-in-left display_block margintop_15px'>" + title + "</span></div>";

    //END - Item name Heading


    newHTML = newHTML + "<div class = 'shopLyrics' >" + "<div class = 'storeItemDivCls' >";

    newHTML = newHTML + adm_getItemsHTML(tags);
    newHTML = newHTML + adm_getShopLocationAndHours(storeRow[0]);



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
    //document.getElementById(elemId).style.backgroundColor = "#cc0000";
    //END: Change the background color of the active item link

    let metaDesc = title + ", " + tags[0].itemdescription;

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

}

function getItemsListadm() {

    //SM - For ADM - Always pull

    // let tags = sessionStorage.getItem("itemsList")
    // if (tags != null) {
    //     if ((tags != "") && (tags != "null")) {

    //         setTimeout(() => {
    //             populateItemDropDown();
    //         }, 10);

    //         setTimeout(() => {
    //             populateitemsDropDownDisplay();
    //        }, 10);

    //         return;
    //     }
    // }

    if (sessionStorage.getItem("locset") == null) {
        document.getElementById("loaderDivId").style.display = "block";
        setTimeout(function () {
            document.getElementById("loaderDivId").style.display = "none";
            getItemsListadm();
        }, 50);
        return;
    }

    $.ajax({
        url: the.hosturl + '/php/process.php',
        type: 'POST',
        data: jQuery.param({
            usrfunction: "itemsadm"
        }),
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        success: function (response) {
            let rows = JSON.parse(response);
            let updatedRows = rows;
            let info = localStorage.getItem("posinf");
            if ((info != undefined) && (info != null) && (info != "") && (info != "null") && (info != ",,")) {
                updatedRows = rows.map(row => {
                    return { ...row, distance: getDistance(row, info) };
                }
                );
            }

            //sessionStorage.setItem("itemsList", JSON.stringify(response));
            sessionStorage.setItem("itemsList", JSON.stringify(JSON.stringify(updatedRows)));
            setTimeout(() => {
                populateItemDropDown();
            }, 10);

            setTimeout(() => {
                populateitemsDropDownDisplay();
            }, 10);
        },
        error: function (xhr, status, error) {
            // console.log(error);
            // console.log(xhr);
        }
    });
}


function admgetFullShopDetails(tags, itemstr) {

    let itemid = tags[0].itemid;
    let category = tags[0].category;
    let subcategory = tags[0].subcategory;
    let title = tags[0].title;
    let description = tags[0].description;
    let keywords = tags[0].keywords;
    let discontinue = tags[0].discontinue;

    let path = window.location.pathname;
    let myUrl = path.substring(0, path.indexOf('/', path.indexOf('bizzlistings')) + 1)

    //START: Find the next item to be put at the bottom of the page

    //let tf = JSON.parse(sessionStorage.getItem("itemsList"));
    //let allRows = JSON.parse(tf);

    let allRows = tags;

    // let rows = allRows.filter(function (entry) {
    //     return entry.discontinue == "0" && entry.category == category;
    // });
    //let path = window.location.pathname;

    let storeItems = allRows.filter(function (entry) {
        return entry.storename == tags[0].storename && entry.title != tags[0].storename;
    });




    let itemUrl = path.substring(0, path.indexOf('/', path.indexOf('bizzlistings')) + 1) + "kisna/target/item";
    let categoryUrl = path.substring(0, path.indexOf('/', path.indexOf('bizzlistings')) + 1) + "kisna/items/" + category;

    let storeUrl = path.substring(0, path.indexOf('/', path.indexOf('bizzlistings')) + 1) + "kisna/items/" + category + "/" + tags[0].title.replaceAll(" ", "-") + "/" + tags[0].title.replaceAll(" ", "-");

    let newHTML = "<div classXX = 'shopContainer' ><div class='display_block marginbottom_12px line_height2 bgcolor_10 color_1'>" +
        '<a class="anchor_tag_btn1" onclick="Show(' + "'" + 'item' + "'" + '); return false;" href ="' + itemUrl + '" class="itemTopLinkCls" ' + ' >' + "All Listings</a>" + " ❯ " +
        '<a class="anchor_tag_btn1" onclick="showcategoryAfterURLHistUpd(' + "'" + category + "'" + '); return false;" href ="' + categoryUrl + '" class="itemTopLinkCls"  >' + category + "</a>" + " ❯ " +
        '<a class="anchor_tag_btn1" href ="' + storeUrl + '" class="itemTopLinkCls"  >' + title + "</a></div>";

    //END - Navigation Links

    //newHTML = newHTML + "<div classXX = 'shopContainerSub' > <h1 classXX='shopContainerH1' > " + title + "</h1></div>";

    //***SM-DONOTDELETE-Maybe used later */
    //newHTML = newHTML + "<div classXX = 'shopContainerSub' > <span class='newStoreTypeHdr slide-in-left display_block margintop_15px'>" + title + "</span></div>";

    //END - Item name Heading



    let storeHeads = allRows.filter(function (entry) {
        return entry.storename == tags[0].storename && entry.title == tags[0].storename;
    });

    for (let storehead of storeHeads) {
        let itemid = storehead.itemid;
        let category = storehead.category;
        let subcategory = storehead.subcategory;
        let title = storehead.title;
        let description = storehead.description;
        let keywords = storehead.keywords;
        let discontinue = storehead.discontinue;

        newHTML = newHTML + "<div class = 'shopLyrics' data-itemid= '" + itemid + "' data-titlename= '" + title + "' data-storename= '" + title + "' >" + "<div class = 'storeItemDivCls' >";

        //Start: div class="slides"
        if (storehead.bannerhtml != undefined) {
            if (storehead.bannerhtml != "") {
                newHTML = newHTML
                    + '<div class="slides">' + storehead.bannerhtml + '</div>';
            }
        }

        if (storehead.description != undefined) {
            if (storehead.description != "") {
                newHTML = newHTML
                    + '<div contenteditable="true" class="shopDescriptionCls bgcolor_8 padding_50px color_white ">' + storehead.description + '</div>';
            }
        }

        newHTML = newHTML + adm_getShopLocationAndHours(storehead);

    }

    newHTML = newHTML + adm_getItemsHTML(storeItems);

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
    // document.getElementById(elemId).style.backgroundColor = "#cc0000";

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

    // setTimeout(function () {
    //     disableImageClickAction();
    // }, 20);
}

function adm_getShopLocationAndHours(storehead) {
    let newHTML = "";

    //Start: Have Info- Desc/Hours/Location under one parent div
    newHTML = newHTML + '<div class="flex_container_align_center">';
    //Start: max_2box_responsive
    newHTML = newHTML + '<div class="max_2box_responsive padding_10px">';


    newHTML = newHTML + '<div title="Shop Address" contenteditable="true" class="title-tip shopaddress margin_auto maxwidth_300px">' + storehead.uselocationfromaddress + '</div>';
    newHTML = newHTML + '<div title="Lat,Long from Address" contenteditable="true" class="title-tip warningMsg1 shopaddresscoord margin_auto maxwidth_300px">' + storehead.coordinatesfromaddress + '</div>';
    newHTML = newHTML + '<div title="city" contenteditable="true" class="title-tip city margin_auto maxwidth_300px">' + storehead.city + '</div>';
    newHTML = newHTML + '<div title="state" contenteditable="true" class="title-tip state margin_auto maxwidth_300px">' + storehead.state + '</div>';
    newHTML = newHTML + '<div title="country" contenteditable="true" class="title-tip country margin_auto maxwidth_300px">' + storehead.country + '</div>';

    if ((storehead.coordinatesfromaddress != undefined) && (storehead.coordinatesfromaddress != null) && (storehead.coordinatesfromaddress != "") && (storehead.coordinatesfromaddress != "null,null")) {

        let crd = storehead.coordinatesfromaddress.split(",");

        newHTML = newHTML
            + '<div id="storeMapDivId" class="minheight_200px" >&nbsp; <br><br><br>' + '</div>Note: Location on the map is approximate';


        setTimeout(function () {
            //let latitude = 28.2683684;
            //let longitude = 78.6824194000001;
            let latitude = crd[0];
            let longitude = crd[1];
            const map = L.map("storeMapDivId").setView([latitude, longitude], 5);
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
            L.marker([latitude, longitude]).addTo(map);
        }, 10);

    } else if ((storehead.maplocationcoordinates != undefined) && (storehead.maplocationcoordinates != null) && (storehead.maplocationcoordinates != "") && (storehead.maplocationcoordinates != "null,null")) {

        let crd = storehead.maplocationcoordinates.split(",");

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
    newHTML = newHTML + '<div title="Lat,Long from Browser"  contenteditable="true" class="title-tip brwsrmapcoord margin_auto maxwidth_300px">' + storehead.maplocationcoordinates + '</div>';




    newHTML = newHTML + '</div>';
    //End: max_2box_responsive

    //Start: max_2box_responsive
    newHTML = newHTML + '<div class="max_2box_responsive padding_10px"><div class="margin_auto maxwidth_300px text_align_center">';

    if (storehead.hourshtml != undefined) {
        if (storehead.hourshtml != null) {
            newHTML = newHTML
                + '<div title="Shop Hours" contenteditable="true" class="title-tip shophrscls font_size_12px">' + storehead.hourshtml + '</div>';
        }
    }

    newHTML = newHTML + '<div title="Shop Availability Info" contenteditable="true" class="title-tip shopavailinfocls font_size_12px">' + storehead.availabilityinfo + '</div>';
    newHTML = newHTML + '</div></div>';
    //End: max_2box_responsive

    newHTML = newHTML + '</div>';
    //End: Have Info- Desc/Hours/Location under one parent div

    if (storehead.discontinue == "1") {
        newHTML = newHTML + '<div title="Discontinued" contenteditable="true" class="shopdiscontinuecls title-tip warningMsg font_size_12px">' + storehead.discontinue + '</div>';

    } else {
        newHTML = newHTML + '<div title="Discontinued"  contenteditable="true" class="title-tip shopdiscontinuecls font_size_12px">' + storehead.discontinue + '</div>';

    }
    if (storehead.reviewed == "0") {
        newHTML = newHTML + '<div title="Reviewed" contenteditable="true" class="title-tip warningMsg1 shopreviewedcls font_size_12px">' + storehead.reviewed + '</div>';

    } else {
        newHTML = newHTML + '<div title="Reviewed" contenteditable="true" class="title-tip shopreviewedcls font_size_12px">' + storehead.reviewed + '</div>';

    }
    newHTML = newHTML + '<span title="itemid" class="title-tip">' + storehead.itemid + '</span>';
    newHTML = newHTML + '<span title="versionseq" class="title-tip versionseqcls">' + storehead.versionseq + '</span>';

    newHTML = newHTML + '<button class="" style="" onclick="admsaveShopItemReview(event)">Save</button>';
    return newHTML;

}

function admsaveShopItemReview(evt) {
    let parentDiv = evt.currentTarget.parentElement.parentElement;
    let itemid = parentDiv.dataset.itemid;
    let title = parentDiv.dataset.titlename;
    let storename = parentDiv.dataset.storename;

    let description = parentDiv.querySelector(".shopDescriptionCls").innerHTML;
    let hourshtml = parentDiv.querySelector(".shophrscls").innerHTML;
    let uselocationfromaddress = parentDiv.querySelector(".shopaddress").textContent;

    let city = parentDiv.querySelector(".city").textContent;
    let state = parentDiv.querySelector(".state").textContent;
    let country = parentDiv.querySelector(".country").textContent;

    let coordinatesfromaddress = parentDiv.querySelector(".shopaddresscoord").textContent;
    let maplocationcoordinates = parentDiv.querySelector(".brwsrmapcoord").textContent;
    let availabilityinfo = parentDiv.querySelector(".shopavailinfocls").textContent;
    let discontinue = parentDiv.querySelector(".shopdiscontinuecls").textContent;
    let reviewed = parentDiv.querySelector(".shopreviewedcls").textContent;
    let versionseq = parentDiv.querySelector(".versionseqcls").textContent;

    $.ajax({
        url: the.hosturl + '/php/process.php',
        data: {
            itemid: itemid,
            description: description,
            hourshtml: hourshtml,
            uselocationfromaddress: uselocationfromaddress,
            city: city,
            state: state,
            country: country,
            coordinatesfromaddress: coordinatesfromaddress,
            maplocationcoordinates: maplocationcoordinates,
            availabilityinfo: availabilityinfo,
            discontinue: discontinue,
            reviewed: reviewed,
            versionseq: versionseq,
            title: title,
            storename: storename,
            usrfunction: "saveshopitemreview"
        },
        type: 'POST',
        dataType: 'json',
        success: function (retstatus) {
            let x = document.getElementById("toastsnackbar");
            if (retstatus) {
                x.innerHTML = "Updates saved";
            } else {
                x.innerHTML = "Updates failed";
            }
            x.classList.add("show");
            setTimeout(function () {
                x.classList.remove("show");
            }, 3000);
        },
        error: function (xhr, status, error) {
            //console.log("")

            let x = document.getElementById("toastsnackbar");
            x.innerHTML = "Updates failed";
            x.classList.add("show");
            setTimeout(function () {
                x.classList.remove("show");
            }, 3000);
        }
    });



}

function admsaveItemReview(evt) {
    let parentDiv = evt.currentTarget.parentElement.parentElement.parentElement;
    let itemid = parentDiv.dataset.itemid;
    let storename = parentDiv.dataset.storename;
    let origtitle = parentDiv.dataset.titlename;

    let title = parentDiv.querySelector('.shopItemTitle').textContent;
    let itemprice = parentDiv.querySelector('.shopItemPrice').textContent;
    let itemdescription = parentDiv.querySelector('.shopItemDescription').innerHTML;
    let discontinue = parentDiv.querySelector(".itemdiscontinuecls").textContent;
    let reviewed = parentDiv.querySelector(".itemreviewedcls").textContent;
    let versionseq = parentDiv.querySelector(".versionseqcls").textContent;

    $.ajax({
        url: the.hosturl + '/php/process.php',
        data: {
            itemid: itemid,
            title: title,
            itemprice: itemprice,
            itemdescription: itemdescription,
            discontinue: discontinue,
            reviewed: reviewed,
            versionseq: versionseq,
            origtitle: origtitle,
            storename: storename,
            usrfunction: "saveitemreview"
        },
        type: 'POST',
        dataType: 'json',
        success: function (retstatus) {
            let x = document.getElementById("toastsnackbar");
            if (retstatus) {
                x.innerHTML = "Updates saved";
            } else {
                x.innerHTML = "Updates failed";
            }
            x.classList.add("show");
            setTimeout(function () {
                x.classList.remove("show");
            }, 3000);
        },
        error: function (xhr, status, error) {
            //console.log("")

            let x = document.getElementById("toastsnackbar");
            x.innerHTML = "Updates failed";
            x.classList.add("show");
            setTimeout(function () {
                x.classList.remove("show");
            }, 3000);
        }
    });
}

function adm_getItemsHTML(storeItems) {
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
        newHTML = newHTML + '<div class="flex_container_align_center box_shadow5 bgcolor_1 marginbottom_50px itemContainerCls itemDetailsContainerCls" data-titlename="' + storeItems[i].title + '" data-storename="' + storeItems[i].storename + '" data-itemid="' + storeItems[i].itemid + '" data-itemuid="' + storeItems[i].itemuid + '">';

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


        newHTML = newHTML
            + '<div data-title="Item Name" contenteditable="true" class="shopItemTitle ">' + storeItems[i].title + '</div>';



        newHTML = newHTML
            + '<div data-title="Item Price" contenteditable="true" class="shopItemPrice ">' + storeItems[i].itemprice + '</div>';



        newHTML = newHTML
            + '<div data-title="Item Description" contenteditable="true" class="shopItemDescription padding_20px">' + storeItems[i].itemdescription + '</div>';


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

        if (storeItems[i].discontinue == "1") {
            newHTML = newHTML + '<div data-title="Discontinue" contenteditable="true" class="itemdiscontinuecls warningMsg font_size_12px">' + storeItems[i].discontinue + '</div>';
        } else {
            newHTML = newHTML + '<div data-title="Discontinue" contenteditable="true" class="itemdiscontinuecls font_size_12px">' + storeItems[i].discontinue + '</div>';
        }

        if (storeItems[i].reviewed != "1") {
            newHTML = newHTML + '<div data-title="Reviewed" contenteditable="true" class="itemreviewedcls warningMsg1 font_size_12px">' + storeItems[i].reviewed + '</div>';
        } else {
            newHTML = newHTML + '<div data-title="Reviewed" contenteditable="true" class="itemreviewedcls font_size_12px">' + storeItems[i].reviewed + '</div>';
        }
        newHTML = newHTML + '<span title="itemid" class="title-tip">' + storeItems[i].itemid + '</span>';
        newHTML = newHTML + '<span title="versionseq" class="title-tip versionseqcls">' + storeItems[i].versionseq + '</span>';

        newHTML = newHTML + '<button class="shopTablinks" style="float:right" onclick="admsaveItemReview(event)">Save</button>';


        newHTML = newHTML + '</div></div>';
        //End: max_2box_responsive

        newHTML = newHTML + '</div>';
        //End: Have Item image, Details under one parent div
    }

    return newHTML;
}

function admEditItem(btn) {
    let itemid = btn.dataset.itemid;
    let category = btn.dataset.category;
    let categoryseq = btn.dataset.categoryseq;
    let subcategory = btn.dataset.subcategory;
    let versionseq = btn.dataset.versionseq;
    let title = btn.dataset.title;
    let titleseq = btn.dataset.titleseq;
    let shortdescription = btn.dataset.shortdescription;
    let description = sessionStorage.getItem("data-description");
    let city = btn.dataset.city;
    let state = btn.dataset.state;
    let country = btn.dataset.country;
    let keywords = btn.dataset.keywords;
    let discontinue = btn.dataset.discontinue;

    $.ajax({
        url: the.hosturl + '/php/process.php',
        data: { usrfunction: "checksession" },
        type: 'POST',
        dataType: 'json',
        success: function (retstatus) {
            if (retstatus == "err") {
                //alert("Please relogin");
                admgoToLogin();
            }
        },
        error: function (xhr, status, error) {
            //console.log("")
        }
    });

    let newHTML = "<div class = 'shopContainer' >";
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
        "<input type='text' id='versionseq-" + itemid + "' style='width:95%; margin:auto;' value='" + versionseq + "'>";



    newHTML = newHTML +
        "<br><br><div class = 'editFieldHead'>Short Description: </div><br>" +
        "<textarea id='shortdescription-" + itemid + "' style='width:95%; margin:auto;' >" + shortdescription + "</textarea>";

    let toolbarHTML = "";
    //toolbarHTML =  "<button  type='button' class='itmToggledBtn btn btn-primary' onclick=toggleDescView('" + itemid + "') >Toggle View</button>" + "<br>" ;

    toolbarHTML = toolbarHTML + "<div id='toolBarId' class = 'toolBar'><div>" +
        "<button  title='toggle desc view' type='button' class='itmUpdBtnSmall btn btn-primary' onclick=toggleDescView('" + itemid + "') >TglDesc</button>" +
        "<button  title='toggle hide' type='button' class='itmUpdBtnSmall btn btn-primary' onclick=admtoggleToolBarView() >TglHide</button>";

    //Shop - Topbanner*********************

    toolbarHTML = toolbarHTML + "<label class='toolBarlabel'>Div - shopTopBanner</label>"
        + getShopTopBannersList(itemid);

    //Shop - Items*********************

    toolbarHTML = toolbarHTML + "<label class='toolBarlabel'>Div - shopItems</label>"
        + "<button title='shopItem1' type='button' style='background: url(" + the.hosturl + "/secimages/shopItem1.png); background-size: contain;' class='shopItem btn btn-primary' onclick=addComponent('" + itemid + "','shopItem1') ></button>";

    //Shop - Items*********************

    toolbarHTML = toolbarHTML + "<label class='toolBarlabel'>Div - Check Store Name Availability</label>"
        + "<button title='shopName1' type='button' style='background: url(" + the.hosturl + "/secimages/shopName1.png); background-size: contain;' class='shopName btn btn-primary' onclick=addComponent('" + itemid + "','shopName1') ></button>";

    //Reveal Js Slide - Section - Divs*********************

    toolbarHTML = toolbarHTML + "<label class='toolBarlabel'>Div - Sections - Titles</label>"
        + "<button title='secTitlePlane1' type='button' style='background: url(" + the.hosturl + "/secimages/secTitlePlane1.png); background-size: contain;' class='itmSecImg btn btn-primary' onclick=addComponent('" + itemid + "','secTitlePlane1') ></button>"

        + "<button title='secTitleWithBG' type='button' style='background: url(" + the.hosturl + "/secimages/secTitleWithBG.png); background-size: contain;' class='itmSecImg btn btn-primary' onclick=addComponent('" + itemid + "','secTitleWithBG') ></button>"

        + "<button title='SemiTransBG' type='button' style='background: url(" + the.hosturl + "/secimages/SemiTransBG.png); background-size: contain;' class='itmSecImg btn btn-primary' onclick=addComponent('" + itemid + "','SemiTransBG') ></button>"

        + "<button title='SemiTransBG2' type='button' style='background: url(" + the.hosturl + "/secimages/SemiTransBG2.png); background-size: contain;' class='itmSecImg btn btn-primary' onclick=addComponent('" + itemid + "','SemiTransBG2') ></button>"

        + "<label class='toolBarlabel'>Div - Sections - Lists</label>"

        + "<button title='secWithList1' type='button' style='background: url(" + the.hosturl + "/secimages/secWithList1.png); background-size: contain;' class='itmSecImg btn btn-primary' onclick=addComponent('" + itemid + "','secWithList1') ></button>"

        + "<button title='titleWithItems1' type='button' style='background: url(" + the.hosturl + "/secimages/titleWithItems1.png); background-size: contain;' class='itmSecImg btn btn-primary' onclick=addComponent('" + itemid + "','titleWithItems1') ></button>"

        + "<button title='titleWithItems2' type='button' style='background: url(" + the.hosturl + "/secimages/titleWithItems2.png); background-size: contain;' class='itmSecImg btn btn-primary' onclick=addComponent('" + itemid + "','titleWithItems2') ></button>"

        + "<button title='titleWithItems3' type='button' style='background: url(" + the.hosturl + "/secimages/titleWithItems3.png); background-size: contain;' class='itmSecImg btn btn-primary' onclick=addComponent('" + itemid + "','titleWithItems3') ></button>"

        + "<label class='toolBarlabel'>Div - Code Explaination</label>"
        + "<button title='titleTextCode1' type='button' style='background: url(" + the.hosturl + "/secimages/titleTextCode1.png); background-size: contain;' class='itmSecImg btn btn-primary' onclick=addComponent('" + itemid + "','titleTextCode1') ></button>"
        + "<button title='titleTextCode2' type='button' style='background: url(" + the.hosturl + "/secimages/titleTextCode2.png); background-size: contain;' class='itmSecImg btn btn-primary' onclick=addComponent('" + itemid + "','titleTextCode2') ></button>"

        + "<label class='toolBarlabel'>Div - Quiz MCQ</label>"
        + "<button title='quizMCQFullScreen' type='button' style='background: url(" + the.hosturl + "/secimages/quizMCQFullScreen.png); background-size: contain;' class='itmSecImg btn btn-primary' onclick=addComponent('" + itemid + "','quizMCQFullScreen') ></button>"
        + "<button title='quizMCQFullScreenLow' type='button' style='background: url(" + the.hosturl + "/secimages/quizMCQFullScreenLow.png); background-size: contain;' class='itmSecImg btn btn-primary' onclick=addComponent('" + itemid + "','quizMCQFullScreenLow') ></button>"

        + "<label class='toolBarlabel'>Images</label>"
        + "<button title='zoomingImage1' type='button' style='background: url(" + the.hosturl + "/secimages/zoomingImage1.png); background-size: contain;' class='itmSecImg btn btn-primary' onclick=addComponent('" + itemid + "','zoomingImage1') ></button>"
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
        "<input class='itmUpdBtnSmall' type='button' value='Upload And Insert At Carot' data-errormsgelementid='image-ererrormsg-' data-saveasnameelementid='image-' data-fileelementid='image-replace-' data-itemid = '" + itemid + "' onclick='admuploadAndInsertFile(event);'  >"
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
        "<br><br><div class = 'editFieldHead'>city: </div><br>" +
        "<input type='text' id='city-" + itemid + "' style='width:95%; margin:auto;' value='" + city + "'>";

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
    document.getElementById("itemDivId").style.display = "block";

    document.getElementById("mainContainer").style.width = "100%";
    document.getElementById("itemEditDivId").style.width = "700px";
    document.getElementById("itemListDivId").style.display = "none";

}

function admtoggleToolBarView() {
    //console.log(document.getElementById("toolBarId").clientHeight);

    if (document.getElementById("toolBarId").clientHeight > 50) {
        document.getElementById("toolBarId").style.height = "50px";
    } else {
        //document.getElementById("toolBarId").style.height = "100%";
        document.getElementById("toolBarId").style.height = "600px";
    }
}


function copyCurrentComponent(btn) {
    let text = btn.parentElement.textContent;
    text = text.substring(1, text.lastIndexOf('Copy'));

    navigator.clipboard.writeText(text);
    // console.log(text);
}

function admuploadAndInsertFile(event) {
    if (localStorage.getItem("userLoggedIn") == "n") {

        error_message = "Not authorized";
        return;

    } else if (localStorage.getItem("userLvl") != "9") {
        error_message = "Not authorized";
        return;
    }
    let elem = event.target;
    let fileelementid = elem.dataset.fileelementid;
    let saveasnameelementid = elem.dataset.saveasnameelementid;
    let itemid = elem.dataset.itemid;

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

            xhttp.open("POST", the.hosturl + "/php/upload.php", true);

            // call on request changes state
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {

                    let response = this.responseText;
                    //console.log(response);

                    document.getElementById(errormsgelementid + itemid).innerHTML = "<font color = #0000>" + response + "</font> ";
                    let imagename = document.getElementById("image-" + itemid).value;
                    let randomId = "div-" + Math.floor(Math.random() * 1000000);
                    let Str = "<div id= '" + randomId + "' onmousedown=setLastFocusedDivId(this.id)  class = 'image1-desc'> " + "<img class='movieImageCls' alt ='' src= '" + the.hosturl + "/img/" + imagename + "'> " + " <button class='deleteDivInnImg' onclick=deleteCurrentComponent(this) ></button></div>";
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

function admSaveImageAndInsertAtCarot(event) {
    if (localStorage.getItem("userLoggedIn") == "n") {

        error_message = "Not authorized";
        return;

    } else if (localStorage.getItem("userLvl") != "9") {
        error_message = "Not authorized";
        return;
    }
    let elem = event.target;
    let fileelementid = elem.dataset.fileelementid;
    let saveasnameelementid = elem.dataset.saveasnameelementid;
    let itemid = elem.dataset.itemid;
    //popolatenewImageName(itemid);

    let saveasname = document.getElementById(saveasnameelementid + itemid).value;
    saveasname = saveasname.trim();
    saveasname = saveasname.toLowerCase();

    let errormsgelementid = elem.dataset.errormsgelementid;

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
            let formData = new FormData();
            formData.append("file", filefromUrl);
            formData.append("saveasname", saveasname);
            formData.append("dir", "img");

            let xhttp = new XMLHttpRequest();

            xhttp.open("POST", the.hosturl + "/php/upload.php", true);

            // call on request changes state
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {

                    let response = this.responseText;
                    //console.log(response);

                    document.getElementById(errormsgelementid + itemid).innerHTML = "<font color = #0000>" + response + "</font> ";
                    let imagename = document.getElementById("image-" + itemid).value;
                    let randomId = "div-" + Math.floor(Math.random() * 1000000);
                    let Str = "<div id= '" + randomId + "' onmousedown=setLastFocusedDivId(this.id)  class = 'image1-desc'> " + "<img class='movieImageCls' alt ='' src= '" + the.hosturl + "/img/" + imagename + "'> " + " <button class='deleteDivInnImg' onclick=deleteCurrentComponent(this) ></button></div>";
                    insertImageAtCaret(Str);
                }
            };

            xhttp.send(formData);
        })
}


function toggleDescView(itemid) {
    let divId = 'description-' + itemid;

    if (document.getElementById("descriptionTextId").style.display == "block") {
        newHTML = document.getElementById("descriptionTextId").value;
        //**SM - May need to be reverted* */
        //newHTML = admremoveNewLine(newHTML);
        document.getElementById(divId).innerHTML = newHTML;

        document.getElementById(divId).style.display = "block";
        document.getElementById("descriptionTextId").style.display = "none"
    } else {
        newHTML = document.getElementById(divId).innerHTML;
        //**SM - May need to be reverted* */
        //newHTML = admaddNewLineInText(newHTML);
        document.getElementById("descriptionTextId").value = newHTML;

        document.getElementById(divId).style.display = "none";
        document.getElementById("descriptionTextId").style.display = "block"
    }

}

function admaddNewLineInText(innerHTML) {
    innerHTML = innerHTML.replaceAll("<div", "\r\n<div");
    innerHTML = innerHTML.replaceAll("<h1", "\r\n<h1");
    innerHTML = innerHTML.replaceAll("<h2", "\r\n<h2");
    innerHTML = innerHTML.replaceAll("<h3", "\r\n<h3");
    innerHTML = innerHTML.replaceAll("<ol", "\r\n<ol");
    innerHTML = innerHTML.replaceAll("<ul", "\r\n<ul");
    return innerHTML;
}

function admremoveNewLine(innerHTML) {
    //innerHTML = innerHTML.replaceAll( "&#13;&#10;", "");
    innerHTML = innerHTML.replace(/\r\n|\r|\n/g, "")
    return innerHTML;
}


function admgetItmPendingReview() {
    removeActiveClassFromNavLinks();
    // let x = document.getElementById("itemsPendingReviewLinkId");
    // x.classList.add("active");

    $.ajax({
        url: the.hosturl + '/php/process.php',
        data: { usrfunction: "getitmpendingreview" },
        type: 'POST',
        dataType: 'json',
        success: function (response) {
            admpopulateItemsStoresListForReview(response);
        },
        error: function (xhr, status, error) {
            //alert(xhr);
            // console.log(error);
            // console.log(xhr);
        }
    });

}

function admcheckStores() {
    removeActiveClassFromNavLinks();
    // let x = document.getElementById("itemsPendingReviewLinkId");
    // x.classList.add("active");

    $.ajax({
        url: the.hosturl + '/php/process.php',
        data: { usrfunction: "checkstores" },
        type: 'POST',
        dataType: 'json',
        success: function (response) {
            //sessionStorage.setItem("itemsList", JSON.stringify(JSON.stringify(response)));
            // setTimeout(() => {
            //     populateItemDropDown();
            // }, 10);

            admpopulateItemsStoresListForReview(response);
        },
        error: function (xhr, status, error) {
            //alert(xhr);
            // console.log(error);
            // console.log(xhr);
        }
    });

}

function admpopulateItemsStoresListForReview(rows = "") {

    let innerHTML = "";
    let path = window.location.pathname;

    for (let record of rows) {


        let category = record.category;
        let title = record.title;
        let city = record.city;
        let state = record.state;
        let country = record.country;
        let lastupdatedate = record.lastupdatedate;
        let itemstr = record.itemstr;
        let discontinue = record.discontinue;
        //let chatIssue = issue.replace("^Chat reported^ -","");

        //let lastupdatedate = record.lastupdatedate;
        //let comment = record.comment;


        let itemurl = path.substring(0, path.indexOf('/', path.indexOf('bizzlistings')) + 1) + "kisna/items/" + itemstr;

        innerHTML = innerHTML + '<div class="max_2box_responsive padding_20px shadow_3"  > ';


        innerHTML = innerHTML + '<div data-title="category" >' + category + '</div>';
        //innerHTML = innerHTML + '<div data-title="customerid" >' + customerid + '</div>';

        innerHTML = innerHTML + '<div  data-title="title"  >' + title + '</div>';

        innerHTML = innerHTML + '<div  data-title="city"  >' + city + '</div>';
        innerHTML = innerHTML + '<div  data-title="state"  >' + state + '</div>';
        innerHTML = innerHTML + '<div  data-title="country"  >' + country + '</div>';

        innerHTML = innerHTML + '<div data-title="Store" ><a  href ="' + itemurl + '"   >Store</a></div>';



        if (discontinue == "1") {
            innerHTML = innerHTML + '<div  data-title="discontinue" class="bgcolor_4 " >' + discontinue + '</div>';
        } else {
            innerHTML = innerHTML + '<div  data-title="discontinue" class="">' + discontinue + '</div>';
        }
        innerHTML = innerHTML + '<div data-title="lastupdatedate" >' + lastupdatedate + '</div>';
        innerHTML = innerHTML + '</div>';
    }

    document.getElementById("homeDivId").style.display = "none";
    document.getElementById("loginDivId").style.display = "none";
    document.getElementById("contactusDivId").style.display = "none";

    document.getElementById("itemListDivId").style.display = "block";
    document.getElementById("itemListDivId").innerHTML = innerHTML + "<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>";

    document.getElementById("bgSVGId").style.display = "none";
    document.getElementById("itemDivId").style.display = "none";
}

function admgetreportsPendingReview() {
    removeActiveClassFromNavLinks();
    let x = document.getElementById("reportsPendingReviewLinkId");
    x.classList.add("active");

    $.ajax({
        url: the.hosturl + '/php/process.php',
        data: { usrfunction: "getreportspendingreview" },
        type: 'POST',
        dataType: 'json',
        success: function (response) {
            admlistReports(response);
        },
        error: function (xhr, status, error) {
            //alert(xhr);
            // console.log(error);
            // console.log(xhr);
        }
    });

}

function admlistReports(rows = []) {

    let innerHTML = "";
    let path = window.location.pathname;

    for (let record of rows) {
        let datetime = record.lastupdatedate;
        let itemid = record.itemid;
        let usrn = record.userfullname;
        let issue = record.item_issue_reported;
        //let chatIssue = issue.replace("^Chat reported^ -","");
        let reviewed = record.smreviewed;
        let itemstr = record.itemstr;
        let itemurl = path.substring(0, path.indexOf('/', path.indexOf('bizzlistings')) + 1) + "kisna/items/" + itemstr;

        innerHTML = innerHTML + '<div class="max_2box_responsive padding_20px shadow_3" data-seqid="' + record.seqid + '" > ';


        innerHTML = innerHTML + '<div data-title="user" >' + usrn + '</div>';
        innerHTML = innerHTML + '<div data-title="issue" >' + issue + '</div>';

        if ((!issue.includes("^Chat reported^")) && (itemstr != null)) {
            innerHTML = innerHTML + '<a class="" href ="' + itemurl + '" class="itemTopLinkCls"  >Item</a>';
        } else {
            innerHTML = innerHTML + '<div data-title="get Chat" class="button_type2 " onclick="admgetChat(' + itemid + ')" >' + itemid + '</div>';
        }

        innerHTML = innerHTML + '<div data-title="datetime" >' + datetime + '</div>';

        if (reviewed != "1") {
            innerHTML = innerHTML + '<div contenteditable="true" data-title="reviewed" class="bgcolor_4 reportreviewedcls" >' + reviewed + '</div>';
        } else {
            innerHTML = innerHTML + '<div contenteditable="true" data-title="reviewed" class="reportreviewedcls">' + reviewed + '</div>';
        }

        innerHTML = innerHTML + '<button class="shopTablinks" style="float:right" onclick="admsaveReportUpdates(event)">Save</button>';
        innerHTML = innerHTML + '</div>';
    }

    document.getElementById("homeDivId").style.display = "none";
    document.getElementById("loginDivId").style.display = "none";
    document.getElementById("contactusDivId").style.display = "none";

    document.getElementById("itemListDivId").style.display = "block";
    document.getElementById("itemListDivId").innerHTML = innerHTML + "<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>";

    document.getElementById("bgSVGId").style.display = "none";
    document.getElementById("itemDivId").style.display = "none";

}


function admgetReviews() {
    removeActiveClassFromNavLinks();
    let x = document.getElementById("reviewsLinkId");
    x.classList.add("active");

    $.ajax({
        url: the.hosturl + '/php/process.php',
        data: { usrfunction: "getreviews" },
        type: 'POST',
        dataType: 'json',
        success: function (response) {
            admlistReviews(response);
        },
        error: function (xhr, status, error) {
            //alert(xhr);
            // console.log(error);
            // console.log(xhr);
        }
    });

}

function admlistReviews(rows = []) {

    let innerHTML = "";
    let path = window.location.pathname;

    for (let record of rows) {
        let customerid = record.customerid;
        let itemid = record.itemid;
        let userfullname = record.userfullname;
        let stars = record.stars;
        //let chatIssue = issue.replace("^Chat reported^ -","");
        let smreviewed = record.smreviewed;
        let lastupdatedate = record.lastupdatedate;
        let comment = record.comment;
        let itemstr = record.itemstr;

        let itemurl = path.substring(0, path.indexOf('/', path.indexOf('bizzlistings')) + 1) + "kisna/items/" + itemstr;

        innerHTML = innerHTML + '<div class="max_2box_responsive padding_20px shadow_3" data-itemid="' + itemid + '" data-customerid="' + customerid + '" > ';


        innerHTML = innerHTML + '<div data-title="userfullname" >' + userfullname + '</div>';
        //innerHTML = innerHTML + '<div data-title="customerid" >' + customerid + '</div>';

        innerHTML = innerHTML + '<div contenteditable="true" data-title="stars" class="starcls" >' + stars + '</div>';

        innerHTML = innerHTML + '<div contenteditable="true" data-title="comment" class="commentcls" >' + comment + '</div>';

        innerHTML = innerHTML + '<div data-title="item" ><a  href ="' + itemurl + '"   >Item</a></div>';

        innerHTML = innerHTML + '<div data-title="lastupdatedate" >' + lastupdatedate + '</div>';

        if (smreviewed != "1") {
            innerHTML = innerHTML + '<div contenteditable="true" data-title="smreviewed" class="bgcolor_4 reportreviewedcls" >' + smreviewed + '</div>';
        } else {
            innerHTML = innerHTML + '<div contenteditable="true" data-title="smreviewed" class="reportreviewedcls">' + smreviewed + '</div>';
        }

        innerHTML = innerHTML + '<button class="shopTablinks" style="float:right" onclick="admsaveReviewUpdates(event)">Save</button>';
        innerHTML = innerHTML + '</div>';
    }

    document.getElementById("homeDivId").style.display = "none";
    document.getElementById("loginDivId").style.display = "none";
    document.getElementById("contactusDivId").style.display = "none";

    document.getElementById("itemListDivId").style.display = "block";
    document.getElementById("itemListDivId").innerHTML = innerHTML + "<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>";

    document.getElementById("bgSVGId").style.display = "none";
    document.getElementById("itemDivId").style.display = "none";

}

function admgetaccMgMt() {
    removeActiveClassFromNavLinks();
    let x = document.getElementById("accMgmtLinkId");
    x.classList.add("active");

    $.ajax({
        url: the.hosturl + '/php/process.php',
        data: { usrfunction: "getaccforreview" },
        type: 'POST',
        dataType: 'json',
        success: function (response) {
            //sessionStorage.setItem("itemsList", JSON.stringify(JSON.stringify(response)));
            // setTimeout(() => {
            //     populateItemDropDown();
            // }, 10);

            admlistAccs(response);
        },
        error: function (xhr, status, error) {
            //alert(xhr);
            // console.log(error);
            // console.log(xhr);
        }
    });
}

function admlistAccs(rows = []) {

    let innerHTML = "";
    //let path = window.location.pathname;

    for (let record of rows) {
        let customerid = record.customerid;
        let userfullname = record.userfullname;
        let userstatus = record.userstatus;
        let userlevel = record.userlevel;
        let timestamp = record.timestamp;
        //let chatIssue = issue.replace("^Chat reported^ -","");
        let storename = record.storename;
        let additionalinfo = record.additionalinfo;

        let city = record.city;
        let state = record.state;
        let country = record.country;

        //let itemurl = path.substring(0, path.indexOf('/', path.indexOf('bizzlistings')) + 1) + "kisna/items/" + itemstr;

        innerHTML = innerHTML + '<div class="max_2box_responsive padding_20px shadow_3" data-seqid="' + record.seqid + '" > ';


        innerHTML = innerHTML + '<div data-title="userfullname" >' + userfullname + '</div>';
        innerHTML = innerHTML + '<div data-title="customerid" class="customeridcls" >' + customerid + '</div>';

        if (userstatus == "I") {
            innerHTML = innerHTML + '<div contenteditable="true" data-title="userstatus" class="bgcolor_4 userstatuscls" >' + userstatus + '</div>';
        } else {
            innerHTML = innerHTML + '<div contenteditable="true" data-title="userstatus"  class="userstatuscls" >' + userstatus + '</div>';
        }

        if (userlevel == "9") {
            innerHTML = innerHTML + '<div data-title="userlevel" class="red_bg" >' + userlevel + '</div>';
        } else {
            innerHTML = innerHTML + '<div data-title="userlevel"  >' + userlevel + '</div>';
        }


        innerHTML = innerHTML + '<div data-title="storename" >' + storename + '</div>';
        innerHTML = innerHTML + '<div data-title="city" >' + city + '</div>';
        innerHTML = innerHTML + '<div data-title="state" >' + state + '</div>';
        innerHTML = innerHTML + '<div data-title="country" >' + country + '</div>';

        innerHTML = innerHTML + '<div data-title="timestamp" >' + timestamp + '</div>';

        innerHTML = innerHTML + '<div  contenteditable="true" data-title="additionalinfo"  class="additionalinfocls" >' + additionalinfo + '</div>';

        innerHTML = innerHTML + '<button class="shopTablinks" style="float:right" onclick="admsaveUsrUpdates(event)">Save</button>';
        innerHTML = innerHTML + '</div>';
    }

    document.getElementById("homeDivId").style.display = "none";
    document.getElementById("loginDivId").style.display = "none";
    document.getElementById("contactusDivId").style.display = "none";

    document.getElementById("itemListDivId").style.display = "block";
    document.getElementById("itemListDivId").innerHTML = innerHTML + "<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>";

    document.getElementById("bgSVGId").style.display = "none";
    document.getElementById("itemDivId").style.display = "none";

}

function admgetChatMgt() {
    removeActiveClassFromNavLinks();
    let x = document.getElementById("messageLinkId");
    x.classList.add("active");

    $.ajax({
        url: the.hosturl + '/php/process.php',
        data: { usrfunction: "getchatmgmt" },
        type: 'POST',
        dataType: 'json',
        success: function (response) {
            //sessionStorage.setItem("itemsList", JSON.stringify(JSON.stringify(response)));
            // setTimeout(() => {
            //     populateItemDropDown();
            // }, 10);

            admlistChats(response);
        },
        error: function (xhr, status, error) {
            //alert(xhr);
            //console.log(error);
            //console.log(xhr);
        }
    });
}

function admlistChats(rows) {
    let innerHTML = "";
    //let path = window.location.pathname;

    for (let record of rows) {
        if (record.id == undefined) {
            continue;
        }
        let id = record.id;
        let user1_customerid = record.user1_customerid;
        let user2_customerid = record.user2_customerid;
        let submit_date = record.submit_date;
        //let chatIssue = issue.replace("^Chat reported^ -","");
        let user1_name = record.user1_name;
        let user2_name = record.user2_name;
        //let itemurl = path.substring(0, path.indexOf('/', path.indexOf('bizzlistings')) + 1) + "kisna/items/" + itemstr;

        innerHTML = innerHTML + '<div class="max_2box_responsive padding_20px shadow_3" data-seqid="' + record.seqid + '" > ';


        innerHTML = innerHTML + '<div data-title="user1_name" >' + user1_name + '</div>';
        innerHTML = innerHTML + '<div data-title="user1_customerid" >' + user1_customerid + '</div>';


        innerHTML = innerHTML + '<div data-title="get Chat" class="button_type2 " onclick="admgetChat(' + id + ')" >' + id + '</div>';

        innerHTML = innerHTML + '<div data-title="user2_name" >' + user2_name + '</div>';
        innerHTML = innerHTML + '<div data-title="user2_customerid" >' + user2_customerid + '</div>';

        innerHTML = innerHTML + '<div data-title="submit_date" >' + submit_date + '</div>';

        innerHTML = innerHTML + '</div>';
    }

    document.getElementById("homeDivId").style.display = "none";
    document.getElementById("loginDivId").style.display = "none";
    document.getElementById("contactusDivId").style.display = "none";

    document.getElementById("itemListDivId").style.display = "block";
    document.getElementById("itemListDivId").innerHTML = innerHTML + "<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>";

    document.getElementById("bgSVGId").style.display = "none";
    document.getElementById("itemDivId").style.display = "none";

}
function admsaveUsrUpdates(evt) {
    let parentDiv = evt.currentTarget.parentElement;

    let userstatus = parentDiv.querySelector(".userstatuscls").textContent;
    let additionalinfo = parentDiv.querySelector(".additionalinfocls").innerHTML;
    let customerid = parentDiv.querySelector(".customeridcls").textContent;

    $.ajax({
        url: the.hosturl + '/php/process.php',
        data: {
            customerid: customerid,
            userstatus: userstatus,
            additionalinfo: additionalinfo,
            usrfunction: "saveusrupdates"
        },
        type: 'POST',
        dataType: 'json',
        success: function (retstatus) {
            let x = document.getElementById("toastsnackbar");
            if (retstatus) {
                x.innerHTML = "Updates saved";
            } else {
                x.innerHTML = "Updates failed";
            }
            x.classList.add("show");
            setTimeout(function () {
                x.classList.remove("show");
            }, 3000);
        },
        error: function (xhr, status, error) {
            //console.log("")

            let x = document.getElementById("toastsnackbar");
            x.innerHTML = "Updates failed";
            x.classList.add("show");
            setTimeout(function () {
                x.classList.remove("show");
            }, 3000);
        }
    });
}

function admgetChat(chatid) {
    $.ajax({
        url: the.hosturl + '/php/process.php',
        data: { chatid: chatid, usrfunction: "getchat" },
        type: 'POST',
        dataType: 'json',
        success: function (response) {
            //sessionStorage.setItem("itemsList", JSON.stringify(JSON.stringify(response)));
            // setTimeout(() => {
            //     populateItemDropDown();
            // }, 10);

            admlistchat(response);
        },
        error: function (xhr, status, error) {
            //alert(xhr);
            // console.log(error);
            // console.log(xhr);
        }
    });
}

function admlistchat(rows) {
    let innerHTML = "";
    //let path = window.location.pathname;
    let flagx = true;

    innerHTML = innerHTML + '<div class="padding_20px shadow_3"   > ';

    for (let record of rows) {

        let user1_customerid = record.user1_customerid;

        if (user1_customerid == undefined) {
            continue;
        }
        let user2_customerid = record.user2_customerid;
        let user1_name = record.user1_name;
        let user2_name = record.user2_name;
        //let chatIssue = issue.replace("^Chat reported^ -","");
        let message = record.msg;
        let submit_date = record.submit_date;
        let seen_date = record.seen_date;
        let sender_name = record.sender_name;
        let sender_customerid = record.sender_customerid;

        if (flagx) {
            innerHTML = innerHTML + '<div data-title="user1" class="bgcolor_1">' + user1_customerid + "-" + user1_name + '</div>';
            innerHTML = innerHTML + '<div data-title="user2" class = "bgcolor_1">' + user2_customerid + "-" + user2_name + '</div>';

            innerHTML = innerHTML + "<table class='table1' >" + "<tr><td>" + "sender_customerid" + "</td><td>" + "sender_name" + "</td><td>" + "message" + "</td><td>" + "submit_date" + "</td><td>" + "seen_date" + "</td></tr>";
            flagx = false;
        }
        innerHTML = innerHTML + "<tr><td>" + sender_customerid + "</td><td>" + sender_name + "</td><td>" + message + "</td><td>" + submit_date + "</td><td>" + seen_date + "</td></tr>";

    }
    innerHTML = innerHTML + '</table></div>';

    document.getElementById("homeDivId").style.display = "none";
    document.getElementById("loginDivId").style.display = "none";
    document.getElementById("contactusDivId").style.display = "none";

    document.getElementById("itemListDivId").style.display = "block";
    document.getElementById("itemListDivId").innerHTML = innerHTML + "<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>";

    document.getElementById("bgSVGId").style.display = "none";
    document.getElementById("itemDivId").style.display = "none";
}

function admsaveReportUpdates(evt) {
    let parentDiv = evt.currentTarget.parentElement;
    let reviewed = parentDiv.querySelector(".reportreviewedcls").textContent;
    let seqid = parentDiv.dataset.seqid;

    $.ajax({
        url: the.hosturl + '/php/process.php',
        data: {
            seqid: seqid,
            reviewed: reviewed,
            usrfunction: "savereportupdates"
        },
        type: 'POST',
        dataType: 'json',
        success: function (retstatus) {
            let x = document.getElementById("toastsnackbar");
            if (retstatus) {
                x.innerHTML = "Updates saved";
            } else {
                x.innerHTML = "Updates failed";
            }
            x.classList.add("show");
            setTimeout(function () {
                x.classList.remove("show");
            }, 3000);
        },
        error: function (xhr, status, error) {
            //console.log("")

            let x = document.getElementById("toastsnackbar");
            x.innerHTML = "Updates failed";
            x.classList.add("show");
            setTimeout(function () {
                x.classList.remove("show");
            }, 3000);
        }
    });
}

function admsaveReviewUpdates(evt) {
    let parentDiv = evt.currentTarget.parentElement;
    let itemid = parentDiv.dataset.itemid;
    let customerid = parentDiv.dataset.customerid;

    let smreviewed = parentDiv.querySelector(".reportreviewedcls").textContent;
    let comment = parentDiv.querySelector(".commentcls").textContent;
    let stars = parentDiv.querySelector(".starcls").textContent;


    $.ajax({
        url: the.hosturl + '/php/process.php',
        data: {
            itemid: itemid,
            customerid: customerid,
            smreviewed: smreviewed,
            comment: comment,
            stars: stars,
            usrfunction: "savereviewupdates"
        },
        type: 'POST',
        dataType: 'json',
        success: function (retstatus) {
            let x = document.getElementById("toastsnackbar");
            if (retstatus) {
                x.innerHTML = "Updates saved";
            } else {
                x.innerHTML = "Updates failed";
            }
            x.classList.add("show");
            setTimeout(function () {
                x.classList.remove("show");
            }, 3000);
        },
        error: function (xhr, status, error) {
            //console.log("")

            let x = document.getElementById("toastsnackbar");
            x.innerHTML = "Updates failed";
            x.classList.add("show");
            setTimeout(function () {
                x.classList.remove("show");
            }, 3000);
        }
    });
}


function admgoToLogin() {

    let path = window.location.pathname;
    sessionStorage.setItem("lastUrl", window.location.href);
    let myUrl = path.substring(0, path.indexOf('/', path.indexOf('bizzlistings')) + 1)
    myUrl = myUrl + "target/login";
    window.location.href = myUrl;
}


function admlogin() {
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

                admshowAdditionalMenuItemsForLoggedIn();


                localStorage.setItem("userLoggedIn", "y");
                localStorage.setItem("userLvl", retstatus.substring(2, 3));
                localStorage.setItem("userdata", retstatus.substring(3));
                //localStorage.setItem("userEmail", StrEmail);
                //getStoredProjectList();

                let myUrl = window.location.protocol + "//" + window.location.host +
                    window.location.pathname;

                let lastUrl = sessionStorage.getItem("lastUrl");

                // if ((lastUrl == null) || (lastUrl.includes("target/login"))) {
                //     lastUrl = myUrl + "target/" + "home"
                // }
                lastUrl = myUrl;
                window.open(lastUrl, "_self");

            }

            else {
                document.getElementById("loginerrormsg").innerHTML = "<font color = #cc0000>" + retstatus + "</font> ";
            }
        },
        error: function (xhr, status, error) {
            //alert(xhr);
            // console.log(error);
            // console.log(xhr);
        }
    });
}


function updateParentBGVideo(element) {
    element.parentElement.parentElement.dataset.backgroundvideo = element.value;

    let selectedVid = element.parentElement.querySelector('.selectedVid');
    selectedVid.innerHTML = element.value;
}

