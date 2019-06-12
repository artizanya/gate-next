// Hey Emacs, this is -*- coding: utf-8 -*-

const withTypescript = require('@zeit/next-typescript');
const withCSS = require('@zeit/next-css');

module.exports = withTypescript();
module.exports = withCSS(module.exports);
