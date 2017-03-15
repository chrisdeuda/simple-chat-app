'use strict'

class ChatController {

  constructor (socket, request) {
    this.socket = socket;
    this.request = request;

    console.log("Connected socket id %s", socket.id)
  }

  onMessage ( message ){

    this.socket.toEveryone().emit('message', message)
  }

  disconnected(socket) {
    console.log('disconnected server ' , socket.id )
  }

}

module.exports = ChatController;
