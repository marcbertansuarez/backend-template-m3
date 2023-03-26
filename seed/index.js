require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
mongoose.set('strictQuery', true);
const User = require('../models/User');
const LineUp = require('../models/LineUp');
const saltRounds = 10;

const users = [
  {
    email: 'user1@example.com',
    password: 'user1Password',
    username: 'user1',
    role: 'user'
  },
  {
    email: 'user2@example.com',
    password: 'user2Password',
    username: 'user2',
    role: 'user'
  }
];

const lineups = [
  {
    title: 'Brimstone lineup',
    agent: 'Brimstone',
    map: 'Bind',
    description: 'Best lineup of Brimstone',
    video: 'https://www.youtube.com/watch?v=txjSTa4eXQI&ab_channel=RikuZalaValorant'
  },
  {
    title: 'Astra lineup',
    agent: 'Astra',
    map: 'Ascent',
    description: 'Best lineup of Astra',
    video: 'https://www.youtube.com/watch?v=txjSTa4eXQI&ab_channel=RikuZalaValorant'
  } 
]

async function hashUserPasswords() {
  return Promise.all(
    users.map(async user => {
      const hashedPassword = await bcrypt.hash(user.password, saltRounds);
      return { ...user, hashedPassword };
    })
  );
}


mongoose.connect(process.env.MONGO_URL)
  .then(async x => {
    console.log(`Connected to ${x.connection.name}`);

    await User.deleteMany();
    await LineUp.deleteMany();
    const hashedUsers = await hashUserPasswords();
    const createdUsers = await User.create(hashedUsers); 

    const lineupsWithAuthor = lineups.map((lineup, index) => ({
      ...lineup,
      author: createdUsers[index]._id,
    }));

    return LineUp.create(lineupsWithAuthor);
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