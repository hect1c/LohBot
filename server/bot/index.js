import { cpus } from 'os';
import nconf from 'nconf';
import './init-config';
import log from '../utils/Log';
import moment from 'moment';

import { start } from './discord';

//Init
start();
