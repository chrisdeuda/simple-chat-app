
var Chat = {

    config : {
        messagebox: $( ".chat textarea" ),
        container: $( "<div class='container'></div>" ),
        chatName : $('.chat-name'),
        status : $('.chat-status .chat-status-message'),
        messages: $('.chat-messages'),
        typing :false,
        io :  ws(''),
        Client : io.channel('chat').connect( console.log),
        timeout : undefined,

    },
    init: function ( config ){
        if ( config && typeof(config) == 'object' ) {
            $.extend(Chat.config, config);
        }
        Chat.bindUIActions();

    },

    setup: function(){


    },

    bindUIActions: function(){
        Chat.config.messagebox.on('keydown', function(event){
            Chat.sendMessage(event);
        });

        Chat.config.Client.on('message',   function(message) {
            Chat.receiveMessage(message);
        });

        Chat.config.Client.on('typing',   function(message) {
            Chat.typingNotification(message);
        });

    },

    sendMessage: function(event){
        // Sending Typing status to recipient
        Chat.sendTypingNofitication();

        if ( event.which === 13 && event.shiftKey === false) {
            if ( Chat.config.messagebox.val().trim() != null && Chat.config.messagebox.val().trim() != "") {
                var Message = {
                    "name": Chat.config.chatName.val(),
                    "message": Chat.config.messagebox.val(),
                    "is_typing": false
                };
                Chat.config.Client.emit('message', JSON.stringify(Message));
                Chat.config.Client.emit('typing', JSON.stringify(Message) );
                console.log(Chat.config.messagebox.val());
                Chat.config.messagebox.val(null) ;

                Chat.displayMessage( Message);

                console.log("Send");

            }
        }
    },

    sendTypingNofitication: function () {
        if ( Chat.config.status.length ) {
            if(Chat.config.typing == false) {
                Chat.config.typing = true;
                var Message = {
                    "name": Chat.config.chatName.val(),
                    "message": "typing",
                    "is_typing"  : Chat.config.typing
                };

                Chat.config.Client.emit('typing', JSON.stringify(Message));
                Chat.config.timeout = setTimeout( Chat.typingTimeOut, 5000);
            } else {
                clearTimeout(Chat.config.timeout);
                Chat.config.timeout = setTimeout( Chat.typingTimeOut, 5000);
            }

            console.log( Chat.config.status.html());
        }


    },

    receiveMessage : function ( message) {
        var Message = JSON.parse(message);
        Chat.displayMessage( Message);
        Chat.config.typing = false;
        console.log("Receive message");

    },

    getFormattedMessage : function ( $the_message ) {
        var chat_message_position = "chat-message-sender";

        if ( Chat.config.chatName.val() ==  $the_message.name ) {
            chat_message_position = " chat-message-receiver";
        }
        
        return `<div class="chat-message  ${chat_message_position}  >"
            <span class='chat-name-alias '> ${$the_message.name} : </span>
            <span class='chat-actual-message'> ${$the_message.message}  </span>
            </div>`;

    },

    displayMessage: function ($the_message ) {
        Chat.config.messages.append( Chat.getFormattedMessage($the_message) );

    },

    typingNotification : function ( message ) {

        var Message = JSON.parse(message);
        var typing_status = "Idle";


        if (Message.is_typing == true) {
            typing_status = Message.name + " is " + Message.message;
        } else {
            typing_status = "Idle";
        }
        Chat.setStatus( typing_status);
    },

    setStatus : function ( status ) {
        Chat.config.status.html( status );
    },

    typingTimeOut : function() {
        Chat.config.typing = false;
        Chat.config.Client.emit("typing", JSON.stringify({ "is_typing": false}));


    }

};
