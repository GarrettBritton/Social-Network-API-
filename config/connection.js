const mongoose = require('mongoose');

const connectionString = 'mongodb://127.0.0.1:27017/socialNetworkDB';

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;


module.exports = connection;
