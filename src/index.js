const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config');

let server;
mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  console.log('Connected to Database');
  server = app.listen(config.port, () => {
    console.log(`Listening to port ${config.port}`);
    /* console.log(`API HOST ${config.api_host}`);
    console.log(`UI HOST ${config.ui_host}`); */
  });
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      console.log('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  console.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  console.log('SIGTERM received');
  if (server) {
    server.close();
  }
});
