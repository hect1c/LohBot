import Promise from 'bluebird';
import _ from 'lodash';

function cat(client, evt, suffix) {
  let count = 1;
  if (suffix && suffix.split(' ')[0] === 'bomb') {
    count = Number(suffix.split(' ')[1]) || 5;
    if (count > 15) count = 15;
    if (count < 0) count = 5;
  }

  //@todo use http://thecatapi.com/docs.html
  const catgifs = {
    url: 'http://thecatapi.com/api/images/get?format=src&type=gif',
    json: true
  };

  return Promise.resolve(catgifs.url);
}

function animals(client, evt, suffix, lang) {
  const split_suffix = suffix.split(' ');
  const cmd = split_suffix[0];
  split_suffix.shift();
  suffix = split_suffix.join(' ');

  if (cmd === 'cat') return cat(client, evt, suffix);
  // return helpText(client, evt, 'animals', lang);
}

export default {
  animal: animals,
  animals,
  cat,
  cats: cat,
  '\ud83d\udc31': cat
};
