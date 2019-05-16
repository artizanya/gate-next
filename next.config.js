// Hey Emacs, this is -*- coding: utf-8 -*-

const withTypescript = require('@zeit/next-typescript');
module.exports = withTypescript();

const withCSS = require('@zeit/next-css');
module.exports = withCSS(module.exports);
