const log = require('cf-nodejs-logging-support');

async function startConsumer(channel, io) {
   if (channel)
      channel.consume("NewMessageQueue", async function (msg) {
      let message =  msg.content.toString();
      try {
         io.of('/messages').emit('message', message);
         log.logMessage("info", "Succesfully emitted message", { "X-correlation-id": message.uuid, "invoice_id": message.messageId });
      } catch (err) {
         console.log(err);
         log.logMessage("error", "Error making emitting messages to client(s)", { "X-correlation-id": message.uuid, "invoice_id": message.messageId });
      } finally {
      }
   }, { noAck: true });
   return channel;
};

module.exports = { "startConsumer": startConsumer }