var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var router = express.Router();
var server = require('http').Server(app);
var io = require('socket.io')(server);
const log = require('cf-nodejs-logging-support');

const RabbitService = {};
RabbitService.setupRabbit = require('./services/rabbitService/setup-rabbit').setupRabbit;


// Consume Messages and 'broadcast' over all open client connections
let messageOut = io.of('/messages');
console.log(io.of('/messages'));

// let channel;
const env = require('dotenv').config(); // for local testing
const sMessagingserviceUri = process.env.RABBIT_MQ_LOCAL;


let channel;

const poller = async () => {
   try{
      channel = await RabbitService.setupRabbit(sMessagingserviceUri);
      startConsumer(channel);
   } catch(err){
   } finally{
      if(!channel)
         setTimeout(poller, 2500);
   }
}

async function startConsumer(channel) {
   channel = await RabbitService.setupRabbit(sMessagingserviceUri);
   if (channel)
      channel.consume("NewMessageQueue", async function (msg) {
         let message = JSON.parse(msg.content.toString());

         try {
            messageOut.emit('message', message);
            log.logMessage("info", "Succesfully emitted message", { "X-correlation-id": message.uuid, "invoice_id": message.messageId });
         } catch (err) {
               console.log(err);
            log.logMessage("error", "Error making emitting messages to client(s)", { "X-correlation-id": message.uuid, "invoice_id": message.messageId });
         } finally {
         }
      }, { noAck: true });
}

setImmediate(poller);
app.listen(3030, () => console.log(`client-message-emitter-service listening on port 3030!`));
