const mongoose = require('mongoose');
const User = require('./schema/user.js');

const uri = 'mongodb+srv://roman:20051989@cluster0-vnual.mongodb.net/Sigma?retryWrites=true&w=majority';
mongoose.connect(uri, {useNewUrlParser: true});

const USER_NUMBER = 50;
const usersNames = [
  'John',
  'Joe',
  'Bob',
  'Mike',
  'Juan',
  'Jane',
  'Mike',
  'David',
  'Sarah',
  'James',
];
const usersSurnames = [
  'Smith',
  'Johnson',
  'Williams',
  'Brown',
  'Jones',
  'Clark',
  'Miller',
  'Davis',
  'Taylor',
  'Wilson',
];

async function fillDB(listNames, listSurnames) {
  for (let i = 0; i < USER_NUMBER; i++) {
    let user = new User({
      login: `user${i}`,
      password: `pass${i}`,
      name: listNames[Math.floor(Math.random() * (listNames.length))],
      surname: listSurnames[Math.floor(Math.random() * (listSurnames.length))],
      friendship: [],
      incomingReq: [],
      outgoingReq:[]
    });
    console.log(user);
    await user.save();
  }
  process.exit();
}

fillDB(usersNames, usersSurnames);
