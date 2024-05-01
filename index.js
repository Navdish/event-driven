const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const {User} = require('./models');
const Consumer = require('./consumer');
const {Outbox} = require('./models');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/', async(req, res)=> {
    const {name} = req?.body;
    console.log(name);
    try {
        const result = await sequelize.transaction(async t => {
          const user_data = await User.create(
            {
              name:name,
            },
            { transaction: t },
          );
          const outbox_response = await Outbox.create(
            {
              name,
              status: 'PENDING'
            },
            { transaction: t },
          );
          return user_data;
        });
        return res.json(result);

      } catch (error) {
        
        console.log("Error in transaction", error);
        return error;
      }
})

const consumer = new Consumer();
consumer.consumeMsg();

app.listen(process.env.PORT, async function () {
    await sequelize.sync();
    console.log(`server running at ${process.env.PORT}`);
})