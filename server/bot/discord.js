import Discord from 'discord.js';
import nconf from 'nconf';;
import moment from 'moment';
import Promise from 'bluebird';
import _ from 'lodash';

import './init-config';
import log from '../utils/Log'
import commands from './commands';

//Init
let client;
let guild;
let initialized = false;

const bootTime = new Date();

function login() {
  if(!nconf.get('TOKEN')) {
    log.error('Please setup TOKEN in config.js to use LoHBot');
    process.exit(1);
  }

  client.login( nconf.get('TOKEN') );
}

function forceFetchUsers() {
  log.info('Force fetching users');
  guild.fetchMembers();
}

function callCmd(cmd, name, client, evt, suffix) {
  log.cmd(name, suffix);
  function processEntry(entry) {
    console.log('processEntry [entry] **' , entry );
    // If string or number, send as a message
    if (_.isString(entry) || _.isNumber(entry)) evt.channel.send(entry)
      .catch((err, res) => {
        err.res = res;
      });
    // If buffer, send as a file, with a default name
    if (Buffer.isBuffer(entry)) evt.channel.uploadFile(entry, 'file.png')
      .catch((err, res) => {
        err.res = res;
      });
    // If it's an object that contains key 'upload', send file with an optional file name
    // This works for both uploading local files and buffers
    if (_.isObject(entry) && entry.upload) evt.channel.uploadFile(entry.upload, entry.filename)
      .catch((err, res) => {
        err.res = res;
      });
  }

  const user_id = evt.author.id;
  const start_time = new Date().getTime();
  const cmd_return = cmd(client, evt, suffix, 'en');

  // All command returns must be a bluebird promise.
  if (cmd_return instanceof Promise) {
    return cmd_return.then(res => {
      const execution_time = new Date().getTime() - start_time;
      // If null, don't do anything.
      if (!res) return log.warn(`Command ${name} didn't return anything. Suffix: ${suffix}`);
      // If it's an array, process each entry.
      if (_.isArray(res)) return _.forEach(processEntry, res);
      // Process single entry
      processEntry(res);
    })
    .catch(err => {
      evt.channel.send(`Error: ${err.message}`);
    });
  }
}

function onMessage(evt) {

  if( !evt.content ) return;
  if( client.user.id === evt.author.id ) return;

  // Checks for PREFIX
  if (evt.content[0] === nconf.get('PREFIX')) {
    const command = evt.content.toLowerCase().split(' ')[0].substring(1);
    const suffix = evt.content.substring(command.length + 2);
    const cmd = commands[0][command];

    console.log('onMessage [suffix]: ', suffix);

    if (cmd) callCmd(cmd, command, client, evt, suffix);
    return;
  }

  // Checks if bot was mentioned
  if (client.user.isMentioned(evt.message)) {
    const msg_split = evt.content.split(' ');

    // If bot was mentioned without a command, then skip.
    if (!msg_split[1]) return;

    const suffix = R.join(' ', R.slice(2, msg_split.length, msg_split));
    let cmd_name = msg_split[1].toLowerCase();
    if (cmd_name[0] === nconf.get('PREFIX')) cmd_name = cmd_name.slice(1);
    const cmd = commands[cmd_name];

    if (cmd) callCmd(cmd, cmd_name, client, evt, suffix);
    return;
  }

  // Check personal messages
  if (evt.channel.isPrivate) {
    // Handle invite links
    if (evt.content.indexOf('https://discord.gg/') > -1 || evt.content.indexOf('https://discordapp.com/invite/') > -1) {
      return commands.join(client, evt, evt.content);
    }

    const msg_split = evt.content.split(' ');
    const suffix = R.join(' ', R.slice(1, msg_split.length, msg_split));
    const cmd_name = msg_split[0].toLowerCase();
    const cmd = commands[cmd_name];

    if (cmd) callCmd(cmd, cmd_name, client, evt, suffix);
    return;
}
  // console.log('client.User.id', client.User.id);
}

export function start() {
  //instantiate discord client
  client = new Discord.Client();
  //listen for events on discord
  client.on('ready', () => {
    const startTime = new Date();
    guild = client.guilds.find('name', 'Legends of Heroes');

    log.info(`Started successfully. Connected to ${_.size(client.guilds)} servers in ${bootTime - startTime} ms.`);
    setTimeout(forceFetchUsers, 100);

    if( !initialized ) {
      initialized = true;

      client.on('message', onMessage );
      client.on('messageUpdate', onMessage )
    }
  });

  client.on('guildMemberAdd', member => {
    // Send the message to a designated channel on a server:
    const channel = member.guild.channels.find('name', 'Legends of Heroes');
    // Do nothing if the channel wasn't found on this server
    if (!channel) return;
    // Send the message, mentioning the member
    channel.send(`Welcome to the server, ${member}`);
  });

  login();
}
