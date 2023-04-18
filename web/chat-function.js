// Place the JS code here
// Variables we will use in our app
let currentChatTab = 0;
let conversationId = null;
let status = 'Idle';

// OnClick event handler for our open chat button
// document.querySelector('.open-chat-widget').onclick = event => {
//     event.preventDefault();
//     // Execute the initialize chat function
//     initChat();
// };
// Intialize chat function - handle all aspects of the chat widget
function initChat (elem){
    // Add init code here
    // Show the chat widget
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

    fetch(the.hosturl + '/php/chatconversations.php', { cache: 'no-store' }).then(response => response.text()).then(data => {
        // Update the status
        //status = 'Idle';
        // Update the conversations tab content
        document.querySelector('.chat-widget-conversations-tab').innerHTML = data;
        // Execute the conversation handler function
        conversationHandler();
        // Transition to the conversations tab
        selectChatTab(2);
    });

    // // Login form submit event handler
    // document.querySelector('.chat-widget-login-tab form').onsubmit = event => {
    //     event.preventDefault();
    //     // Declare form related variables
    //     let formEle = document.querySelector('.chat-widget-login-tab form');
    //     let formData = new FormData(formEle);
    //     // Execute POST AJAX request and attempt to authenticate the user
    //     fetch(formEle.action, {
    //         cache: 'no-store',
    //         method: 'POST',
    //         body: formData
    //     }).then(response => response.text()).then(data => {
    //         // If the response includes the "operator" string
    //         if (data.includes('operator')) {
    //             // Show the password field
    //             document.querySelector('.chat-widget-login-tab .msg').insertAdjacentHTML('beforebegin', '<input type="password" name="password" placeholder="Your Password" required>');
    //         } else if (data.includes('success')) {
    //             // Authentication success! Execute AJAX request to retrieve the user's conversations

    //             //document.querySelector('.chat-widget-login-tab .msg').innerHTML = 'Success!';

    //             fetch('chatconversations.php', { cache: 'no-store' }).then(response => response.text()).then(data => {
    //                 // Update the status
    //                 status = 'Idle';
    //                 // Update the conversations tab content
    //                 document.querySelector('.chat-widget-conversations-tab').innerHTML = data;
    //                 // Execute the conversation handler function
    //                 conversationHandler();
    //                 // Transition to the conversations tab
    //                 selectChatTab(2);
    //             });

    //         } else {
    //             // Authentication failed! Show the error message on the form
    //             document.querySelector('.chat-widget-login-tab .msg').innerHTML = data;
    //         }
    //     });
    // };

    // Previous tab button OnClick event handler
    // document.querySelector('.previous-chat-tab-btn').onclick = event => {
    //     event.preventDefault();
    //     // Transition to the respective page
    //     selectChatTab(currentChatTab - 1);
    // };

    //**********SM-DONOTDELETE */
    //makeElementDraggable("chat-window");

    makeElementDraggable("chat-window","chat-window-header");
};

function goToPrev(){
    selectChatTab(currentChatTab - 1);
    //document.querySelector(".shop-user-city").innerHTML = "";
    setTimeout(() => {
        document.getElementById("headerDragger").innerHTML = "";
        document.getElementById("reportChatUserDivId").style.display = "none"; 
    }, 100);
    
}


// Select chat tab - it will be used to smoothly transition between tabs
function selectChatTab(value) {
    // Update the current tab variable
    currentChatTab = value;
    // Select all tab elements and add the CSS3 property transform
    document.querySelectorAll('.chat-widget-tab').forEach(element => element.style.transform = `translateX(-${(value - 1) * 100}%)`);
    // If the user is on the first tab, hide the prev tab button element
    document.querySelector('.previous-chat-tab-btn').style.display = value > 1 ? 'block' : 'none';
    // Update the conversation ID variable if the user is on the first or second tab
    //if (value == 1 || value == 2) {
    if (value == 1 ) {
        conversationId = null;
    }
    // If the user is on the login form tab (tab 1), remove the secret code cookie (logout)
    if (value == 1) {
        document.cookie = 'chat_secret=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }

    setTimeout(() => {
        try{
            document.querySelector(".shop-user-city").innerHTML = document.querySelector(".stickyhdr").innerHTML
            document.getElementById("reportChatUserDivId").style.display = "block";
        }catch(e){

        }
        
    }, 50);
    
};


// Conversation handler function - will add the event handlers to the conversations list and new chat button
const conversationHandler = () => {

    // // New chat button OnClick event handler
    // document.querySelector('.chat-widget-new-conversation').onclick = event => {
    //     event.preventDefault();
    //     // Update the status
    //     status = 'Waiting';
    //     // Notify the user
    //     document.querySelector('.chat-widget-conversation-tab').innerHTML = `
    //     <div class="chat-widget-messages">
    //         <div class="chat-widget-message">Please wait...</div>
    //     </div>
    //     `;
    //     // Transition to the conversation tab (tab 3)
    //     selectChatTab(3);
    // };

    // Iterate the conversations and add the OnClick event handler to each element
    document.querySelectorAll('.chat-widget-conversation').forEach(element => {
        element.onclick = event => {
            event.preventDefault();
            // Get the conversation
            // Execute the getConversation function here
            getConversation(element.dataset.id);
        };
    });
};

// // If the secret code cookie exists, attempt to automatically authenticate the user
// if (document.cookie.match(/^(.*;)?\s*chat_secret\s*=\s*[^;]+(.*)?$/)) {
//     // Execute GET AJAX request to retireve the conversations
//     fetch('chatconversations.php', { cache: 'no-store' }).then(response => response.text()).then(data => {
//         // If respone not equals error
//         if (data != 'error') {
//             // User is authenticated! Update the status and conversations tab content
//             status = 'Idle';
//             document.querySelector('.chat-widget-conversations-tab').innerHTML = data;
//             // Execute the conversation handler function
//             conversationHandler();
//             // Transition to the conversations tab
//             selectChatTab(2);
//         }
//     });
// }

// Previous tab button OnClick event handler
// document.querySelector('.previous-chat-tab-btn').onclick = event => {
//     event.preventDefault();
//     // Transition to the respective page
//     selectChatTab(currentChatTab - 1);
// };

// Get conversation function - execute an AJAX request that will retrieve the conversation based on the conversation ID column
function getConversation(id) {
    // Execute GET AJAX request
    fetch(`/${the.hostnm}/php/chatconversation.php?id=${id}`, { cache: 'no-store' }).then(response => response.text()).then(data => {
        // Update conversation ID variable
        conversationId = id;
        // Update the status
        //status = 'Occupied';
        // Update the converstaion tab content
        document.querySelector('.chat-widget-conversation-tab').innerHTML = data;
        // Transition to the conversation tab (tab 3)
        //selectChatTab(3);
        selectChatTab(2);
        // Retrieve the input message form element 
        let chatWidgetInputMsg = document.querySelector('.chat-widget-input-message');
        // If the element exists
        if (chatWidgetInputMsg) {
            // Scroll to the bottom of the messages container
            if (document.querySelector('.chat-widget-messages').lastElementChild) {
                document.querySelector('.chat-widget-messages').scrollTop = document.querySelector('.chat-widget-messages').lastElementChild.offsetTop;
            }
            // Message submit event handler
            chatWidgetInputMsg.onsubmit = event => {
                event.preventDefault();
                // Execute POST AJAX request that will send the captured message to the server and insert it into the database
                
                // fetch(chatWidgetInputMsg.action, {
                //     cache: 'no-store',
                //     method: 'POST',
                //     body: new FormData(chatWidgetInputMsg)
                // });


                //url: the.hosturl + '/php/process.php',

                $.ajax({
                    url: the.hosturl + '/php/process.php',
                    type: 'POST',
                    data: jQuery.param({
                        usrfunction: "insertmessage",
                        id: document.querySelector("#convid").value,
                        msg: document.querySelector("#inpmsg").value
                    }),
                    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                    success: function (response) {
                        console.log("")
                    },
                    error: function (xhr, status, error) {
                        console.log("")
                    }
                });

                // Create the new message element
                let chatWidgetMsg = document.createElement('div');
                chatWidgetMsg.classList.add('chat-widget-message');
                chatWidgetMsg.textContent = chatWidgetInputMsg.querySelector('input').value;
                // Add it to the messages container, right at the bottom
                document.querySelector('.chat-widget-messages').insertAdjacentElement('beforeend', chatWidgetMsg);
                // Reset the message element
                chatWidgetInputMsg.querySelector('input').value = '';
                // Scroll to the bottom of the messages container
                document.querySelector('.chat-widget-messages').scrollTop = chatWidgetMsg.offsetTop;
            };
        }
    });
};


// Update the conversations and messages in real-time
setInterval(() => {
    if (localStorage.getItem("userLoggedIn") != "y") {
        return;
    }
    //Irrespective of chatwindow is not open update the new message count on the menubar
    fetch(the.hosturl + '/php/chatconversations.php', { cache: 'no-store' }).then(response => response.text()).then(html => {
        let newConvCnt = html.split("msg color_blue").length - 1;
        let oldCount = document.querySelector(".chatBadge").innerHTML;
        if (newConvCnt > 0){
            document.querySelector(".chatBadge").style.display = "block";
            document.querySelector(".chatBadge").innerHTML = newConvCnt;
            if (newConvCnt > oldCount){
                var audio = document.getElementById('audioPreview');         
                audio.play();
            }            
        }else {
            document.querySelector(".chatBadge").style.display = "none";
        }
        //When converstations list is open
        // Use AJAX to update the conversations list
        if (currentChatTab == 1) {
            let doc = (new DOMParser()).parseFromString(html, 'text/html');
            document.querySelector('.chat-widget-conversations').innerHTML = doc.querySelector('.chat-widget-conversations').innerHTML;
            conversationHandler();
        }
    });

    
    if (currentChatTab == 2 && conversationId != null) {
        // If the current tab is 3 and the conversation ID variable is not NUll 
        // When individual converation is open
        // Use AJAX to update the conversation
        fetch(the.hosturl + '/php/chatconversation.php?id=' + conversationId, { cache: 'no-store' }).then(response => response.text()).then(html => {
            // The following variable will prevent the messages container from automatically scrolling to the bottom if the user previously scrolled up in the chat list
            let canScroll = true;
            if (document.querySelector('.chat-widget-messages').lastElementChild && document.querySelector('.chat-widget-messages').scrollHeight - document.querySelector('.chat-widget-messages').scrollTop != document.querySelector('.chat-widget-messages').clientHeight) {
                canScroll = false;
            }
            let doc = (new DOMParser()).parseFromString(html, 'text/html');
            // Update content
            document.querySelector('.chat-widget-messages').innerHTML = doc.querySelector('.chat-widget-messages').innerHTML;
            if (canScroll && document.querySelector('.chat-widget-messages').lastElementChild) {
                // Scroll to the bottom of the container
                document.querySelector('.chat-widget-messages').scrollTop = document.querySelector('.chat-widget-messages').lastElementChild.offsetTop;
            }
        });
        // If the current tab is 3 and the status is Waiting           
    } else if (currentChatTab == 3 && status == 'Waiting') {
        // Attempt to find a new conversation between the user and operator (or vice-versa)
        fetch(the.hosturl + '/php/find_conversation.php', { cache: 'no-store' }).then(response => response.text()).then(data => {
            if (data != 'error') {
                // Success! Two users are now connected! Retrieve the new conversation
                getConversation(data);
            }
        });
    }
}, 5000); // 5 seconds (5000ms) - the lower the number, the more demanding it is on your server.