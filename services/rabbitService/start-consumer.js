async function startConsumer(channel) {
   if (channel)
      channel.consume("NewMessageQueue", async function (msg) {
         let message = JSON.parse(msg.content.toString());

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
}

module.exports = { "startConsumer": startConsumer }