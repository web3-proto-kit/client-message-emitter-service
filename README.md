## client-message-emitter-service
Emmits messages to client applications via socket.io

```
MessageExchange outgoing message payload = {
  "senderId": "uuid",
  "recieverId": "uuid",
  "messageId": "uuid",
  "messagePayload: "message as string here..."
}
```

The client-message-emitter-service communicates with other microservices on the network via rabbit-mq. The protocol used to consume messages is amqp. socket-io is used to publish to client applications.

# Usage
View the quickstart repo for a step by step guide.

 
