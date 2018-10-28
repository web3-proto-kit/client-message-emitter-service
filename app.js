const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const log = require('cf-nodejs-logging-support');

const RabbitService = {};
RabbitService.setupRabbit = require('./services/rabbitService/setup-rabbit').setupRabbit;
RabbitService.startConsumer = require('./services/rabbitService/start-consumer').startConsumer;

const env = require('dotenv').config(); // for local testing
const sMessagingserviceUri = process.env.RABBIT_MQ_LOCAL;

app.get('/', function (req, res) {
      res.send("hello user");
});

let channel;

const connect = async () => {
      try {
            channel = await RabbitService.setupRabbit(sMessagingserviceUri);
            if(channel)
                  channel = RabbitService.startConsumer(channel, io);
      } catch (err) {
      } finally {
            if (!channel)
                  setTimeout(connect, 2500);
      }
}

http.listen(3030, function () {
      console.log('listening on *:3030');
});

io.on('connection', function (socket) {
      console.log('a user connected');
});

connect();

// let message = JSON.stringify({
//       "senderId": "uuid",
//       "recieverId": "uuid",
//       "messageId": "uuid",
//       "messagePayload": "message as string here..."
// });

// try {
//       setInterval(() => {
//             io.of('/messages').emit('message', message);
//       }, 2000)
// } catch (err) {
//       console.log(err);
// } finally {
// }






// setImmediate(poller);
// server.listen(3030, () => console.log(`client-message-emitter-service listening on port 3030!`));
