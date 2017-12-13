import bunyan from 'bunyan';
import chalk from 'chalk';
import moment from 'moment';
import nconf from 'nconf';
import _ from 'lodash';

const prod = (nconf.get('NODE_ENV') === 'prod');
const config = { name : 'lohbot'};
const logger = bunyan.createLogger(config);

function submitToLogger(type, msg) {
  if( _.isObject(msg)) return logger[type](msg, msg.message || '');
  return logger[type](msg);
}

function cmd(cmd, suffix) {
  if (prod) return logger.info({cmd, suffix}, 'cmd');
  console.log(chalk.cyan(`[${moment().format('YYYY-MM-DD HH:mm:ss')}]`), chalk.bold.green('[COMMAND]'), chalk.bold.green(cmd), suffix);
}

function info(msg) {
  if (prod) return submitToLogger('info', msg);
  console.log(chalk.cyan(`[${moment().format('YYYY-MM-DD HH:mm:ss')}]`), msg);
}

function warn(msg) {
  if (prod) return submitToLogger('warn', msg);
  console.log(chalk.cyan(`[${moment().format('YYYY-MM-DD HH:mm:ss')}]`), chalk.yellow(`[WARN] ${msg}`));
}

function error(msg) {
  if (prod) return submitToLogger('error', msg);
  console.log(chalk.cyan(`[${moment().format('YYYY-MM-DD HH:mm:ss')}]`), chalk.red(`[ERROR] ${msg}`));
}

export default {cmd, info, warn, error};
