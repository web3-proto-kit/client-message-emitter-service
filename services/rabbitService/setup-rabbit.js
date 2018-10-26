const amqp = require('amqplib');
const log = require('cf-nodejs-logging-support');

async function setupRabbit(sMessagingserviceUri) {
   let channel;

   try {
      channel = await connectToRabbitMQ(sMessagingserviceUri);

      channel.assertExchange('NewMessageExchange', 'fanout', { durable: true })

      channel.assertQueue('NewMessageQueue', {
         durable: true
      });

      channel.bindQueue('NewMessageQueue', 'NewMessageExchange', '');

      log.logMessage("info", "Connection to rabbitMQ Successful");
   } catch (err) {
      log.logMessage("error", "Error with connection to rabbitMQ");
   }

   return channel;
}

async function connectToRabbitMQ(sMessagingserviceUri) {
   try {
      var conn = await amqp.connect(sMessagingserviceUri);
      var oChannel = await conn.createChannel();
   } catch (err) {
      log.logMessage("error", "Error with connection to rabbitMQ");
   } finally {
      return oChannel;
   }
}

module.exports = { "setupRabbit": setupRabbit }