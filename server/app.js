const Express = require('express');
const chalk = require('chalk');
const moment = require('moment');

const app = new Express();
const env = process.env.NODE_ENV || 'dev';

app.set('port', (process.env.PORT || 5000));

if (env === 'dev') {
  console.log(chalk.cyan(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] Booting using dev...`));
  require('babel-register');
  require('./bot/');
} else {
  console.log(chalk.cyan(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] Booting...`));
  //require('./dist');
}

//@todo handle routing for LOH website

// app.get('/', (request, response) => {
//   response.send('Hello from Express!');
// });
//
// app.listen(app.get('port'), () => {
//   const startTime = new Date();
//   log('LOH Node app started on port', app.get('port'), 'in', startTime -
//     bootTime, 'ms with NODE_ENV', env, '...');
// });
