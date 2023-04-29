<?php
include_once("php/session.php");

$title = "Grow your business";
$description = "Platform for business owners, professionals and enterpreneurs to showcase
 their businesses and services on the internet for free";
$image_url = "Your Image URL";
$keywords = "Business, Free, Listings, business page, growth";

//SM-TODONE-Revert below
$page_url = $_SERVER["HTTP_HOST"] . $_SERVER["REQUEST_URI"];
//$page_url = $_SERVER["REQUEST_URI"];

$path = urldecode($_SERVER["REQUEST_URI"]);
$path = substr($path, 1);

if (strpos($path, 'items/') !== false) {
    $itemstr = substr($path, strpos($path, "items/") + 6);
    if (strpos($itemstr, '/') !== false) {
      if (isset($_SESSION['countrynm'])) {
         $title = $_SESSION['webTitle'];
         $description = $_SESSION['webDesc'] ;
         //$image_url = "https://bizzlistings.com".$_SESSION['image_url'];
         $image_url = "https://bizzlistings.com/getimage/".$_SESSION['image_nm'];
         $keywords = $_SESSION['webKeywords'];
      } else {
         $dummy = $database->getItem($itemstr);
         if ($dummy != "Err in DB call") {
            $title = $_SESSION['webTitle'];
            $description = $_SESSION['webDesc'] ;
            //$image_url = "https://bizzlistings.com".$_SESSION['image_url'];
            $image_url = "https://bizzlistings.com/getimage/".$_SESSION['image_nm'];
            $keywords = $_SESSION['webKeywords'];
         }
      }
    }
} elseif (strpos($path, '/') === false) {
   if (isset($_SESSION['countrynm'])) {
      $title = $_SESSION['webTitle'];
      $description = $_SESSION['webDesc'] ;
      //$image_url = "https://bizzlistings.com".$_SESSION['image_url'];
      $image_url = "https://bizzlistings.com/getimage/".$_SESSION['image_nm'];
      $keywords = $_SESSION['webKeywords'];
   } else {
      $dummy = $database->getStore($path);
      if ($dummy != "Err in DB call"){
         $title = $_SESSION['webTitle'];
         $description = $_SESSION['webDesc'] ;
         //$image_url = "https://bizzlistings.com".$_SESSION['image_url'];
         $image_url = "https://bizzlistings.com/getimage/".$_SESSION['image_nm'];
         $keywords = $_SESSION['webKeywords'];
      }
   }

}

?>

<!DOCTYPE html>
<html lang="en">

<head>
   <!-- Google tag (gtag.js) -->
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-MFYY85KF1M"></script>
   <script>
      window.dataLayer = window.dataLayer || [];
      function gtag() { dataLayer.push(arguments); }
      gtag('js', new Date());
      gtag('config', 'G-MFYY85KF1M');
   </script>

   <meta charset="utf-8" />
   <title><?php echo $title; ?></title>
    <meta name="description" content="<?php echo $description; ?>">
    <meta property="og:title" content="<?php echo $title; ?>">
    <meta property="og:description" content="<?php echo $description; ?>">
    <meta property="og:image" content="<?php echo $image_url; ?>">
    <meta property="og:url" content="<?php echo $page_url; ?>">
    <meta name="keywords" content="<?php echo $keywords; ?>">

   <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

   <!-- <meta name="keywords" content="Business, Free, Listings, business page, growth" /> -->
   <!-- <meta name="description" content="<?php echo $description; ?>" />
   <title>Grow your business</title> -->

   <meta name="author" content="Numerouno" />


   <!-- Favicon-->
   <link rel="icon" type="image/x-icon" href="/bizzlistings/assets/favicon.ico" />

   <link href="/bizzlistings/css/codescriber-v1.00.css" rel="stylesheet" />
   <link href="/bizzlistings/css/slidestyles.css" rel="stylesheet" />
   <link href="/bizzlistings/css/smshopi-v1.00.css" rel="stylesheet" />
   <link href="/bizzlistings/css/smstylegtlimit.css" rel="stylesheet" />
   <link href="/bizzlistings/css/smstyleltlimit.css" rel="stylesheet" />
   <link href="/bizzlistings/css/smtheme-v1.01.css" rel="stylesheet" />
   <link href="/bizzlistings/css/chatstyle.css" rel="stylesheet" type="text/css">
   <link href="/bizzlistings/web/common-style.css" rel="stylesheet">


   <!-- FONT AWESOME -->
   <script src="https://kit.fontawesome.com/2e937192fc.js" crossorigin="anonymous"></script>
   <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700" rel="stylesheet">
   <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.5.0/css/all.css"
      integrity="sha384-B4dIYHKNBt8Bc12p+WXckhzcICo0wtJAoU8YZTY5qE0Id1GSseTk6S+L3BlXeVIU" crossorigin="anonymous">



   <!-- <script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=default&flags=gated"></script>
   <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.48.4/codemirror.min.js"
      integrity="sha256-dPTL2a+npIonoK5i0Tyes0txCMUWZBf8cfKRfACRotc=" crossorigin="anonymous"></script>
   <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.48.4/mode/xml/xml.min.js"
      integrity="sha256-cphnEddX56MtGJsi1PoCPLds+dlnDj1QQkAlCWeJYDo=" crossorigin="anonymous"></script>
   <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.48.4/mode/javascript/javascript.min.js"
      integrity="sha256-7AjEsHnW7cpq2raC/uxnGCP2G4zIKmCdz7OAv6LN00o=" crossorigin="anonymous"></script>
   <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.48.4/mode/css/css.min.js"
      integrity="sha256-mjhvNBMExwa2AtP0mBlK9NkzJ7sgRSyZdgw9sPhhtb0=" crossorigin="anonymous"></script>
   <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.48.4/mode/htmlmixed/htmlmixed.min.js"
      integrity="sha256-qfS6ZUe6JhPU75/Sc1ftiWzC2N9IxGEjlRwpKB78Ico=" crossorigin="anonymous"></script>
   <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.48.4/addon/search/search.js"
      integrity="sha256-iUnNlgkrU5Jj8oKl2zBBCTmESI2xpXwZrTX+arxSEKc=" crossorigin="anonymous"></script>
   <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.48.4/addon/search/searchcursor.min.js"
      integrity="sha256-y7nxCQ9bT6p4fEq9ylGxWfMQBpL6ingXkav6Nr1AcZ8=" crossorigin="anonymous"></script>
   <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.48.4/addon/dialog/dialog.min.js"
      integrity="sha256-G+QhvxjUNi5P5cyQqjROwriSUy2lZtCFUQh+8W1o6I0=" crossorigin="anonymous"></script>
   <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.48.4/addon/dialog/dialog.css"
      integrity="sha256-XfaQ13HxIRg0hWLdKpAGBDOuLt7M0JCKvKpEgLHj5Gg=" crossorigin="anonymous" /> -->

   <!-- JQUERY    -->
   <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.js"></script>
   <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.css">
   <script src="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"></script>


   <!-- <script src="/bizzlistings/js/jquery-resizable-delit.js"></script> -->
   <!--REF: https://medium.com/@petehouston/remove-tinymce-warning-notification-on-cloud-api-key-70a4a352b8b0 -->
   <!-- <script src="https://cdnjs.cloudflare.com/ajax/libs/tinymce/4.9.2/tinymce.min.js" referrerpolicy="origin"></script> -->


   <!-- <link rel="stylesheet" href="/bizzlistings/css/default.min.css"> -->

   <!-- For Location Display on Map -->
   <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css"
      integrity="sha256-kLaT2GOSpHechhsozzB+flnD+zUyjE2LlfWPgU04xyI=" crossorigin="" />
   <script src="https://unpkg.com/leaflet@1.9.3/dist/leaflet.js"
      integrity="sha256-WBkoXOwTeyKclOHuWtc+i2uENFpDZ9YPdf5Hf+D7ewM=" crossorigin=""></script>




   <script src="https://cdnjs.cloudflare.com/ajax/libs/js-cookie/2.2.1/js.cookie.min.js"
      integrity="sha256-oE03O+I6Pzff4fiMqwEGHbdfcW7a3GRRxlL+U49L5sA=" crossorigin="anonymous"></script>

   <script src="/bizzlistings/web/common-function-v1.03.js"></script>
   <script src="/bizzlistings/web/chat-function.js"></script>

   <script type="application/ld+json">{
			"@context": "https://schema.org/",
			"@type":"WebSite","url":"https://bizzlistings.com/",
			"name": "BizzListings - Grow your business",
			"datePublished": "2023-04-17",
			"description": "Grow your business",
			"thumbnailUrl": "https://bizzlistings.com/images/banner.png"         
		 }
		 </script>

</head>

<body>
   <div class="d-flex" id="wrapper">
      <!-- Page content wrapper-->
      <div id="page-content-wrapper">
         <!-- Top navigation-->
         <div class="topnav" id="myTopnav">
            <a id="homeLinkId" class="navLink" href="/bizzlistings/target/home"
               onclick="Show('home'); return false; ">HOME</a>

            <a id="itemLinkId" class="navLink dropDownNav" href="/bizzlistings/target/item"
               onclick="Show('item'); return false; ">LISTINGS <i class="fa fa-caret-down"></i></a>
            <div id="dropDownItmCatgListId" class="dropdown-content">
            </div>


            <a id="howtoLinkId" class="navLink" href="/bizzlistings/target/howto"
               onclick="Show('howto'); return false; ">HOW TO VIDEOS</a>
            <a id="contactusLinkId" class="navLink" href="/bizzlistings/target/contactus"
               onclick="Show('contactus'); return false; ">CONTACT US</a>
            <a id="loginLinkId" class="navLink" href="/bizzlistings/target/login"
               onclick="Show('login'); return false; ">LOG IN</a>
            <a id="logoutLinkId" class="navLink" style="display:none" href="javascript:Logout()">LOGOUT</a>
            <a id="mystoreLinkId" class="navLink" href="/bizzlistings/target/mystore"
               onclick="Show('mystore'); return false;">CREATE MY STORE</a>

            <a id="myfavoritesLinkId" class="navLink" class="displayNone" href="/bizzlistings/target/myfavorites"
            onclick="Show('myfavorites'); return false;" >FAVORITES</a>

            <a id="mychatLinkId" class="displayNone" href="javascript:mychat()">
               <i class="fa fa-commenting font_size_24px" aria-hidden="true"></i>
               <span class="chatBadge displayNone">0</span>
               <audio id="audioPreview" controls="controls" class="displayNone">
                  <source id="audioSourceIdWAV" src="/bizzlistings/sounds/low-bell-ding.wav" type="audio/wav">
               </audio>
            </a>


            <a class="searchWrapper"><span id="itemsearchDivId">
                  <form autocomplete="off" class="dummyForm">
                     <input id='item-search-box' data-dropdownset='n' type='text' name='item' autocomplete='off'
                        placeholder='search' />
                     <button id="itemsearchBtnId" class='' onclick='searchItem(); return false;'><i
                           class="fas fa-search"></i></button>
                  </form>
               </span>
            </a>


            <a href="javascript:void(0);" class="icon" style="margin-right: 20px" onclick="myTopNavFunction()">
               <i class="fa fa-bars"></i>
            </a>
         </div>

         <!-- End of Top navigation-->
         <!-- Page content-->
         <div id="loaderDivId">

            <div class="loader">
               <i class="loaderDot"></i>
               <i class="loaderDot"></i>
               <i class="loaderDot"></i>
            </div>
         </div>

         <!-- REF: https://getwaves.io/ -->
         <div id="containerNHelpDivId">
            <svg id="bgSVGId" class="displayNone"></svg>
            <!-- <svg id="bgSVGId" class="bgSVG" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
               <path fill="#7559DA" fill-opacity="1"
                  d="M0,224L30,197.3C60,171,120,117,180,117.3C240,117,300,171,360,197.3C420,224,480,224,540,208C600,192,660,160,720,165.3C780,171,840,213,900,245.3C960,277,1020,299,1080,272C1140,245,1200,171,1260,165.3C1320,160,1380,224,1410,256L1440,288L1440,320L1410,320C1380,320,1320,320,1260,320C1200,320,1140,320,1080,320C1020,320,960,320,900,320C840,320,780,320,720,320C660,320,600,320,540,320C480,320,420,320,360,320C300,320,240,320,180,320C120,320,60,320,30,320L0,320Z">
               </path>
            </svg> -->
            <!-- <section id="bgSVGId" >
               <div class="wave"></div>
             </section> -->
            <div id="mainContainer" class="panel-container panel-left">

               <!--*************************************************************--->
               <!--***********************START - HOME DIV**********************--->
               <!--*************************************************************--->
               <div id="homeDivId">
                  <div class="bannerParent">
                     <div class="bannerContainer">
                        <div class="bannerContent">
                           <label class="bannerLargeText scale-in-center"
                              style="animation-delay: 0.8s; animation-duration: 0.5s;">BizzListings</label>
                           <br>
                           <hr class="slide-in-left" style="animation-delay: 0.2s">
                           <label class="bannerSmallText scale-in-center"
                              style="animation-delay: 1.2s; animation-duration: 1s;">Grow your business</label>
                        </div>
                     </div>
                     <div class="websiteDescriptionCls bgcolor_8 font_size_18px padding_50px color_white">
                        Welcome to BizzListings, the ultimate platform for business owners, professionals and
                        enterpreneurs to showcase their businesses and services on the internet for free! With our
                        easy-to-use website, you can create an attractive business page for your shop, business or
                        services in as little as just 30 minutes. Your business page will provide a permanent web
                        presence for your business, making it easy for potential customers to find you online and
                        connect.
                     </div>

                     <div
                        class="animate_inview websiteHomePgFlags flex_container_align_center box_shadow5 bgcolor_3 marginbottom_50px">
                        <div class="max_2box_responsive padding_10px">
                           <div class="margin_auto text_align_center">
                              <div class="itemImageshow-container cursor_pointer">
                                 <div class="itmImgContainer"><img class="homePageFlagImages" style="display:block"
                                       src="/bizzlistings/images/selectCategory.png"></div>
                              </div>
                           </div>
                        </div>
                        <div class="max_2box_responsive padding_10px">
                           <div class="margin_auto text_align_center">
                              <div class="shopItemDescription padding_20px">Find your perfect category on BizzListings!
                                 With over 30 and counting categories to choose from, we can accommodate any type of
                                 business. Whether you're a restaurant owner or a freelancer, we've got a category for
                                 you.</div>
                           </div>
                        </div>
                     </div>

                     <div
                        class="animate_inview websiteHomePgFlags flex_container_align_center box_shadow5 bgcolor_9 marginbottom_50px">
                        <div class="max_2box_responsive padding_10px">
                           <div class="margin_auto text_align_center">
                              <div class="itemImageshow-container cursor_pointer">
                                 <div class="itmImgContainer"><img class="homePageFlagImages" style="display:block"
                                       src="/bizzlistings/images/createPage.png"></div>
                              </div>
                           </div>
                        </div>
                        <div class="max_2box_responsive padding_10px">
                           <div class="margin_auto text_align_center">
                              <div class="shopItemDescription padding_20px">Creating your business page has never been
                                 easier! BizzListings offers sample business pages in several categories to help get you
                                 started. Simply upload related photos for your products or services and write some
                                 information about them. With our user-friendly platform, you can have your business
                                 page up and running in just 30 minutes. You can also make the changes easily</div>
                           </div>
                        </div>
                     </div>

                     <div
                        class="animate_inview  websiteHomePgFlags flex_container_align_center box_shadow5 bgcolor_6 marginbottom_50px">
                        <div class="max_2box_responsive padding_10px">
                           <div class="margin_auto text_align_center">
                              <div class="itemImageshow-container cursor_pointer">
                                 <div class="itmImgContainer"><img class="homePageFlagImages" style="display:block"
                                       src="/bizzlistings/images/findonMap.png"></div>
                              </div>
                           </div>
                        </div>
                        <div class="max_2box_responsive padding_10px">
                           <div class="margin_auto text_align_center">
                              <div class="shopItemDescription padding_20px">Make it easy for potential buyers to find
                                 and connect with your business! BizzListings allows buyers to easily search for your
                                 business and products on the internet. With our built-in chat feature, you can connect
                                 with potential customers and answer any questions they may have.</div>
                           </div>
                        </div>
                     </div>

                     <div class="websiteDescriptionCls bgcolor_7 font_size_18px padding_50px color_white">
                        Don't miss out on the opportunity to grow your business online. Join the BizzListings community
                        today and create your own business page to connect with potential customers! Our user-friendly
                        platform makes it simple and quick to get started. Let's grow your business together!
                     </div>

                     <div class="sampleBusPageLinkContainer">
                        <div class="sampleBustxtdiv">
                           Get inspired by our sample business pages! Check out our showcase of businesses from various
                           categories to get an idea of what your own business page could look like. Follow the links
                           below to explore our sample pages and start creating your own unique business page on
                           BizzListings.
                        </div>
                        <div>
                           <ul class="sapleBusPagesList">
                              <li><a class="anchor_tag_btn3" href="/bizzlistings/Beauty-Oasis-Sample">Beautician</a>
                              </li>
                              <li><a class="anchor_tag_btn3" href="/bizzlistings/Fix-My-Tech-Sample">Electronics
                                    Repair</a></li>
                              <li><a class="anchor_tag_btn3" href="/bizzlistings/Fresh-Choice-Market-Sample">Grocery
                                    Store</a></li>
                              <li><a class="anchor_tag_btn3" href="/bizzlistings/Happy-Hearts-Childcare-Sample">Day
                                    Care</a></li>
                              <li><a class="anchor_tag_btn3" href="/bizzlistings/Idli-Dosa-Joint-Sample">Food Joint</a>
                              </li>

                              <li><a class="anchor_tag_btn3" href="/bizzlistings/Rapid-Repairs-Sample">Car and Bike
                                    Repair</a></li>
                              <li><a class="anchor_tag_btn3"
                                    href="/bizzlistings/The-Stationery-Studio-Sample">Stationery Store</a></li>
                              <li><a class="anchor_tag_btn3" href="/bizzlistings/Thread-and-Needle-Sample">Tailoring and
                                    dressmaking shops</a></li>
                              <li><a class="anchor_tag_btn3" href="/bizzlistings/Wardrobe-Wonders-Sample">Clothes
                                    Shop</a></li>
                              <li><a class="anchor_tag_btn3" href="/bizzlistings/Shutter-Bliss-Photography">Photography
                                    Shop</a></li>
                           </ul>
                        </div>
                     </div>
                     <div class="videoContainer">
                        <div class='sampleBustxtdiv'>How to create free Business Listings</div>
                        <div class='shopVideoIframeDiv'>
                           <iframe src='https://www.youtube.com/embed/EmaA9rO2gwM'> </iframe>
                        </div>
                     </div>
                     <div class="displayNone"
                        style="background-color: rgba(9, 84, 132); width: 100%; margin: 0px; padding: 20px; ">
                        <label style="color: white"> Lots of programming languages supported. Some of them are listed
                           below. </label>
                        <hr style="color: #ccc">
                        <div style="display: flex; flex-direction: row; width: 100%; margin: auto; overflow: auto">
                           <!-- <img src="/bizzlistings/images/java.png" alt="Java" class="languageicon">
                           <img src="/bizzlistings/images/python.png" alt="python" class="languageicon">
                           <img src="/bizzlistings/images/javascript.png" alt="JavaScript" class="languageicon">
                           <img src="/bizzlistings/images/php.png" alt="php" class="languageicon">
                           <img src="/bizzlistings/images/html.png" alt="html" class="languageicon">
                           <img src="/bizzlistings/images/csharp.png" alt="c#" class="languageicon">
                           <img src="/bizzlistings/images/cobol.png" alt="cobol" class="languageicon"> -->
                        </div>
                     </div>
                  </div>
               </div>
               <!--*************************************************************--->
               <!--***********************END - HOME DIV**********************--->
               <!--*************************************************************--->

               <!--*************************************************************--->
               <!--***********************START - items LIST DIV************--->
               <!--*************************************************************--->


               <div id="itemListDivId">
                  <div id="distanceFilter" class="padding_10px  ">
                     Filter results by distance (<span id="selectedDist">50</span> Km)
                     <div class="distantFltrInner">
                        <i class="fa fa-map-marker locationMarker" style="font-size:36px"></i>
                        <input type="range" min="1" max="1000" value="50" oninput="updateSelectedval()" onchange="updateSelectedval()" class="distanceSliderCls" id="distanceSlider">                  
                        <button class="helper float_right width_100px" onclick="applyDistanceFilter();">Apply</button>
                     </div>
                  </div>

                  <div id="itemListInnerDivId"></div>

               </div>
               <div id="itemDivId">
               </div>

               <div id="itemEditDivId">
               </div>

               <!--*************************************************************--->
               <!--***********************END - items LIST DIV**************--->
               <!--*************************************************************--->



               <!--*************************************************************--->
               <!--**START - LOGIN, REGISTER, FORGOT PASSWORD, ACTIVATE ACC*****--->
               <!--*************************************************************--->

               <div id="loginDivId" class="login">
                  <div id="loginSecDivId" style="margin-top: 20px;">
                     <label class="form_header_label1 scale-up-ver-top"> LOGIN </label>
                     <hr>
                     <input class="un " id='emailid' type="text" align="center" placeholder="Login Email Id">
                     <input class="pass" id='password' type="password" align="center" placeholder="Password">
                     <br>
                     <label id="loginerrormsg" style="color: #cc0000; font-size: 14px;"></label>
                     <br>
                     <br>
                     <button class="helper btnCenterAlign width_200px" onclick="login();">Log in</button>
                     <br>
                     <br>
                     <a href="#!" style="color: #888;  " onMouseOver="this.style.color='#000'"
                        onMouseOut="this.style.color='#888'" onclick="showCreateAccount();">Not registered? Create
                        account</a>
                     <br>
                     <a href="#!" style="color: #888;  " onMouseOver="this.style.color='#000'"
                        onMouseOut="this.style.color='#888'" onclick="showForgotPassword();">Forgot Password? Reset</a>
                  </div>
                  <div id="registerSecDivId" class="displayNone" style="margin-top: 20px;">
                     <label class="form_header_label1 scale-up-ver-top"> REGISTER </label>
                     <hr>
                     <div id="registrationFieldsDiv">
                        <input class="un" id='registerusname' type="text" placeholder="Your full name">
                        <input class="un " id='registeremailid' type="text" align="center" placeholder="Login Email Id">
                        <input class="pass" id='registerpassword' type="password" align="center"
                           placeholder="Set Password">
                        <input class="pass" id='registerpasswordre' type="password" align="center"
                           placeholder="Re-enter Password">
                        <br>
                     </div>

                     <label id="registererrormsg" style="color: #cc0000; font-size: 14px"></label>
                     <br>
                     <br>
                     <button id="registerBtnId" class="helper btnCenterAlign width_200px"
                        onclick="register();">Register</button>
                     <button id="closeRegisterBtnId" style="display: none;" class="helper btnCenterAlign width_200px"
                        onclick="Show('home'); return false; ">Close</button>
                     <!---->
                     <!-- <button id="createMyStoreBtnId" class="helper btnCenterAlign " style="display: none; width: 300px"
                        onclick="setUpMyStore(); return false;">Set Up My Store &nbsp ❯</button> -->
                     <br>
                     <br>
                     <a href="#!" style="color: #888;  " onMouseOver="this.style.color='#000'"
                        onMouseOut="this.style.color='#888'" onclick="showLogin();">Go back to Login</a>
                     <br>

                  </div>


                  <div id="providerSecDivId" class="providerSec displayNone">
                     <label style="font-size: 14px; font-weight: 900; color: #333 "> ADDRESS </label>
                     <hr>

                     <div class="addresscontainer" id="addresscontainerDiv">
                        <div class="addressform">
                           <label class="addressfield">
                              <span class="addressfield__label" for="shipaddress">Address</span>
                              <input class="addressfield__input" type="text" id="shipaddress">
                           </label>

                           <label class="addressfield">
                              <span class="addressfield__label" for="shipcity">City/Town/Village</span>
                              <input class="addressfield__input" type="text" id="shipcity">
                           </label>
                           <label class="addressfield">
                              <span class="addressfield__label" for="shipstate">State</span>
                              <input class="addressfield__input" type="text" id="shipstate">
                           </label>
                           <label class="addressfield">
                              <span class="addressfield__label" for="shipcountry">Country</span>
                              <input class="addressfield__input" type="text" id="shipcountry">
                           </label>

                           <label class="addressfield">
                              <span class="addressfield__label" for="postalcode">Postal code</span>
                              <input class="addressfield__input" type="text" id="postalcode">
                           </label>
                        </div>
                     </div>

                     <label id="providerAddrErrorMsg" style="color: #cc0000; font-size: 14px"></label>
                     <br>
                     <br>
                     <button class="helper btnCenterAlign" style="width: 300px" onclick="setProvAddr();">Select Store
                        Type &nbsp ❯</button>
                     <!---->
                     <br>
                     <br>
                     <br>

                  </div>

                  <div id="forgotPasswordSecDivId" class="displayNone" style="margin-top: 20px; ">
                     <label class="form_header_label1 scale-up-ver-top"> FORGOT PASSWORD </label>
                     <hr>
                     <label>Enter your email address and we will email you instructions on password reset</label>
                     <br>
                     <br>
                     <input class="un " id='forgotpwemailid' type="text" align="center" placeholder="Login Email Id">
                     <br>
                     <label id="forgotpwerrormsg" style="color: #cc0000; font-size: 14px"></label>
                     <br>
                     <br>
                     <button class="helper btnCenterAlign width_200px" align="center"
                        onclick="forgotpw();">Send</button>
                     <!---->
                     <br>
                     <br>
                     <a href="#!" style="color: #888;  " onMouseOver="this.style.color='#000'"
                        onMouseOut="this.style.color='#888'" onclick="showLogin();">Go back to Login</a>
                  </div>
                  <div id="accActivatedDivId" class="displayNone" style=" margin-top: 20px;">
                     <label style="font-size: 14px; font-weight: 900; color: #333 "> ACCOUNT ACTIVATED </label>
                     <hr>
                     <label>Your account has been activated successfully. You can proceed to login</label>
                     <!---->
                     <br>
                     <br>
                     <a href="#!" style="color: #888;" onMouseOver="this.style.color='#000'"
                        onMouseOut="this.style.color='#888'" onclick="showLogin();">Login</a>
                  </div>
                  <div id="forgotPWDivId" class="displayNone" style="margin-top: 20px; ">
                     <label style="font-size: 14px; font-weight: 900; color: #333 "> SET PASSWORD </label>
                     <hr>
                     <!---->
                     <br>
                     <input class="pass" id='newpassword' type="password" align="center" placeholder="Set New Password">
                     <br>
                     <input class="pass" id='newpasswordRe' type="password" align="center"
                        placeholder="Re-enter New Password">
                     <br>
                     <label id="newpwerrormsg" style="color: #cc0000; font-size: 14px"></label>
                     <br>
                     <div id="setPwDivId">
                        <button class="helper btnCenterAlign width_200px" align="center" onclick="setPassword();">Set
                           Password</button>
                     </div>
                     <div id="setPwSuccessDivId" style="display: none">
                        <label style="color: #cc0000">Your account password has been set successfully. You can proceed
                           to
                           login</label>
                        <!---->
                        <br>
                        <br>
                        <a href="#!" style="color: #888;  " onMouseOver="this.style.color='#000'"
                           onMouseOut="this.style.color='#888'" onclick="showLogin();">Login</a>
                     </div>
                  </div>
               </div>
               <!--*************************************************************--->
               <!--****END - LOGIN, REGISTER, FORGOT PASSWORD, ACTIVATE ACC*****--->
               <!--*************************************************************--->

               <div id="contactusDivId">
                  <div id="contactusSecDivId" style="margin: 0 auto;   padding: 20px; ">
                     <label class="form_header_label1 scale-up-ver-top"> CONTACT US </label>

                     <div id="sndmsgdivid">
                        <hr>
                        <input class="un formInputText contactusnameCls" style='width: calc(100% - 8px);' type="text"
                           placeholder="Your full name">
                        <input class="un formInputText contactusemailidCls " style='width: calc(100% - 8px);'
                           type="text" placeholder="Email Id">
                        <textarea id="contactus_msg" class="fullWidth" style="border: 1px solid rgba(0, 0, 0, 0.3);"
                           placeholder="Your message" rows="3"></textarea>
                        <br>
                        <div style=" width: 220px; background-color: #C8C8C8; border-radius: 5px; ">
                           <ul class="captchaList" style="padding: 5px;">
                              <li style="margin: 5px;">
                                 <div class="captchaBackground" style="position: relative; ">
                                    <canvas id="captcha">captcha text</canvas>
                                    <i class="fa fa-refresh cursor_pointer" id="refreshButton"
                                       style="float: right;  position: absolute; top:1px; right: 1px; color:#c7168a; cursor: pointer"
                                       onclick="refreshCaptcha();"></i>
                                 </div>
                              </li>
                              <li style="margin: 5px;">
                                 <div><input class="enteredCaptchaTextCls" style="width: 188px; height:30px"
                                       placeholder="Enter displayed code" type="text" autocomplete="off" name="text">
                                 </div>
                              </li>
                           </ul>
                        </div>
                        <label id="contactuserrormsg" style="color: #cc0000; font-size: 14px"></label>
                        <br> <br>
                        <button class="helper btnCenterAlign width_200px" align="center"
                           onclick="contactus();">Submit</button>
                     </div>
                  </div>
               </div>
               <div id="onMobileMsgDivId" class="displayNone" style="margin:10px; padding:10px; text-align: justify">
                  Because the code upload and scanning limitations, the site has restricted functionality on mobile
                  device.
               </div>
               <div id="howtoDivId" class="displayNone" style="margin:auto;">
                  Coming soon
               </div>
            </div>
            <!-- *****END OF MAIN CONTAINER DIV -->
         </div>
         <!--**************START: HELP DISPLAY DIV**************-->
      </div>
   </div>
   <div class="footerDiv">
      <footer>
         <div class="footer-main">
            <div class="footer-col1">
               <ul>
                  <li>
                     <img src="/bizzlistings/assets/favicon-1.png" alt="Grow your business" class="languageicon">
                  </li>

               </ul>
            </div>

            <div class="footer-col2">
               <h3 class="footer-heading">
                  KEY LINKS
               </h3>
               <div class="footer-languages">
                  <a onclick="Show('home'); return false;" href="/bizzlistings/target/home">Home</a>
                  <a onclick="Show('item'); return false;" href="/bizzlistings/target/item">Listings</a>
                  <a onclick="Show('contactus'); return false;" href="/bizzlistings/target/contactus">Contact Us</a>
                  <a onclick="showpolicyAfterURLHistUpd(); return false;" href="/bizzlistings/target/policy">Usage
                     Policy</a>

               </div>
            </div>

            <div class="footer-col3">
               <h3 class="footer-heading">
                  FOLLOW US
               </h3>
               <div class="footer-social">
                  <a href="https://www.facebook.com/profile.php?id=100091857314109">
                     <i class="fa fa-facebook-square" style="font-size:48px;color:white"></i>
                  </a>

               </div>
            </div>
         </div>

         <p class="footer-terms">
            <a href="#">© 2023 BizzListings. All rights reserved</a>

         </p>
      </footer>
   </div>

   <div id="cookie-div-id" class="cookie-consent-banner">
      <div class="cookie-consent-banner__inner">
         <div class="cookie-consent-banner__copy">
            <div class="cookie-consent-banner__header">We USE COOKIES</div>
            <div class="cookie-consent-banner__description">We use cookies and other tracking technologies to improve
               your browsing experience on our website, to show you personalized content and targeted ads, to analyze
               our website traffic, and to understand where our visitors are coming from. You consent to our cookies if
               you continue to use our website.</div>
         </div>
         <div class="cookie-consent-banner__actions">
            <a href="#" onclick="cookieAccepted()" class="cookie-consent-banner__cta">
               Understood
            </a>
         </div>
      </div>
   </div>

   <div class="confirmBG">
      <div class="confirmBox">
         <div id="confirmMessage">Confirm text</div>
         <div class="confirmBoxBtns">
            <input id="confirmYes" class="confirmBtn" type="button" value="Yes" />
            <input id="confirmNo" class="confirmBtn" type="button" value="No" />
         </div>
      </div>
   </div>

   <div id="popupDivId" class="popupDivCls shadow_1 scale-in-ver-top"></div>
   <div id="toastsnackbar_center" class="shadow_3"></div>
   <div id="toastsnackbar" class="shadow_1"></div>

   <div id="myModal" class="modaldiv displayNone">
      <!-- Modal content -->
      <div class="modaldiv-content">
         <!-- <span class="modaldivclose" onclick="closeModal()">&times;</span> -->
         <div id="modalhtmlid"></div>
      </div>
   </div>

   <div id="chat-window" class="chat-widget">
      <div id="chat-window-header" class="chat-widget-header">
         <a href="javascript:goToPrev()" class="previous-chat-tab-btn">&lsaquo;</a>
         <div id="headerDragger" class="shop-user-city"></div>
         <div id="reportChatUserDivId" class="cursor_pointer float_right" onclick="reportChatUser(this)"><i
               class="fa fa-warning color_yellow_star" aria-hidden="true"></i></div>
         <a href="#" class="close-chat-widget-btn">&times;</a>
      </div>
      <div class="chat-widget-content">
         <div class="chat-widget-tabs">
            <div class="chat-widget-tab chat-widget-conversations-tab"></div>
            <div class="chat-widget-tab chat-widget-conversation-tab"></div>
         </div>
      </div>
   </div>

   <!-- Bootstrap core JS-->
   <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"></script>
   <!-- Core theme JS-->
   <script src="/bizzlistings/js/scripts.js"></script>
   <script>
      $(".panel-left").resizable({
         handleSelector: ".splitter",
         resizeHeight: false
      });



   </script>
   <script>

      setTimeout(() => {
         getInfo();
      }, 0);


      setTimeout(() => {
         getItemsList();
      }, 0);



      setTimeout(() => {
         getCategoryList();
      }, 0);


      checkURL();

      $(window).scroll(function () {
         checkAnimation();
      });
   </script>
   <script src="/bizzlistings/web/onload.js"></script>
   <!-- Go to www.addthis.com/dashboard to customize your tools -->
   <script type="text/javascript" src="//s7.addthis.com/js/300/addthis_widget.js#pubid=ra-63324d242f787b67"></script>


</body>

</html>