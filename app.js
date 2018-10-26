var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var router = express.Router();
var server = require('http').Server(app);
var io = require('socket.io')(server);
const RabbitService = {};
RabbitService.setupRabbit = require('./services/rabbitService/setup-rabbit').setupRabbit;

// Consume Messages and 'broadcast' over all open client connections
let messages = io.of('/messages');
let channel;
const sMessagingserviceUri = process.env.RABBIT_MQ_LOCAL;


app.listen(3030, () => console.log(`client-message-emitter-service listening on port 3030!`));

while (!channel) {
   startConsumer(channel);
}

async function startConsumer(channel){
   channel = await RabbitService.setupRabbit(sMessagingserviceUri);
   if (channel)
      channel.consume("InvoiceQueue", async function (msg) {
         let message = JSON.parse(msg.content.toString());
         message.uuid = uuid;
         messageId = message.messageId;

         try {
            messages.emit('messages', msg.content.toString());
            log.logMessage("info", "Succesfully emitted message", { "X-correlation-id": message.uuid, "invoice_id": messageId });
         } catch (err) {
            log.logMessage("error", "Error making emitting messages to client(s)", { "X-correlation-id": message.uuid, "invoice_id": messageId });
         } finally {
         }
      }, { noAck: true });
}


