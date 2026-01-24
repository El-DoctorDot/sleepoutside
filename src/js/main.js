import { loadHeaderFooter } from './utils.mjs';

import Alert from './alert.js';

loadHeaderFooter();

const alert = new Alert('./json/alerts.json');
alert.loadAndDisplayAlerts();
