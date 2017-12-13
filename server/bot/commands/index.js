import glob from 'glob';
import _ from 'lodash';

const glob_options = {
  realpath: true,
  nodir: true
};

export const command_files = _.uniq(_.flatten([
  glob.sync(`${__dirname}/*(!(index.js))`, glob_options),
  glob.sync(`${__dirname}/*/index.js`, glob_options),
  glob.sync(`${__dirname}/*/*/index.js`, glob_options),
  glob.sync(`${__dirname}/*(!(help))/*.js`, glob_options)
]));

// Merge all the commands objecs together and export.
const commands = _.merge(_.map(command_files, js_path => {
  return require(js_path).default;
}));

export default commands;
