require('dotenv').config();
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
const LineUp = require('../models/LineUp');

const lineups = [
  {
    title: 'Brimstone lineup',
    agent: 'Brimstone',
    map: 'Bind',
    description: 'Best lineup of Brimstone',
    video: 'https://www.youtube.com/watch?v=txjSTa4eXQI&ab_channel=RikuZalaValorant'
  }
]

// Place the array you want to seed

mongoose.connect(process.env.MONGO_URL)
  .then(x => console.log(`Connected to ${x.connection.name}`))
  .then(() => {
    return // Model.create(array)
  })
  .then(() => {
    console.log('Seed done 🌱');
  })
  .catch(e => console.log(e))
  .finally(() => {
    console.log('Closing connection');
    mongoose.connection.close();
  })

// Run npm run seed 