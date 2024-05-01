const {Outbox} = require("./models");
const Producer = require('./producer.js');
const publisher = new Producer();

(async () =>{
    console.log("messages");
    const messages = await Outbox.findAll({where: {status: 'PENDING'}});
    console.log('messagesss: ', messages);


    for (let index = 0; index < messages.length; index++) {
        try {
            await publisher.sentMsg(messages[index]);
            messages[index].status = 'SUCCESS';
            // await messages.save();
        } catch (error) {
            console.log("error :-  Inside Outbox service", error)
        }
    }
})()