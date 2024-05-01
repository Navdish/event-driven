const amqp = require('amqplib');
const Outbox = require('./models');
const exchangeName = 'exchange1';


class Consumer {
    channel;
 
    async createChannel() {
        try {
            const connection = await amqp.connect('amqp://localhost');
            this.channel = await connection.createChannel();   
        } catch (error) {
            console.log("channel not created", error);
        }
    }
    async consumeMsg(){
        try {
            if (!this.channel) {
                await this.createChannel()
            }
            await this.channel.assertExchange(exchangeName, 'fanout');
            const q = await this.channel.assertQueue('queue1',  {durable: true});


            this.channel.bindQueue(q.queue, exchangeName, ''); // routing key
            this.channel.consume(q.queue, async(message) => {
                console.log("queue name is ", q.queue);
                if(message.content) console.log(" the message is................: ", message?.content?.toString());
                    try {
                        const data = JSON.parse(message?.content?.toString());
                        // find the record, update it, save it
                        // const res = await Outbox.find();

                        this.channel.ack(message);
                        console.log("console after emitting the message")
                    } catch (error) {
                        console.log("authh",error.message);
                        this.channel.nack(message, false, false);
                    }
                
            }, {noAck: false});
        } catch (error) {
            console.log(error, "connection not created..");
        }
    }

}
module.exports = Consumer;