const open = require('open');
const { join, normalize } = require('path');

open(normalize(join('file://', __dirname, '..', 'coverage', 'lcov-report', 'index.html')));
