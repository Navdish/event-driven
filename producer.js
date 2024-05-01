const amqp = require('amqplib');
const exchangeName = 'exchange1';
const { v4: uuidv4 } = require('uuid');

class Producer {
    channel;
    async createChannel() {
        try {
            const connection = await amqp.connect('amqp://localhost');
            this.channel = await connection.createChannel();   
        } catch (error) {
            console.log("channel not created", error);
        }
    }
    async sentMsg(data){
        try {
            if (!this.channel) {
                await this.createChannel()
            }
            await this.channel.assertExchange(exchangeName, 'fanout');
            const user = data;
            const message = { uuid: uuidv4(), user: user, firedAt: new Date()}
            const res = await this.channel.publish(exchangeName, '', Buffer.from(JSON.stringify(message)));
            console.log("sent",res,  message);
        } catch (error) {
            console.log(error, "connection not created..");
        }
    }

}
module.exports = Producer;
