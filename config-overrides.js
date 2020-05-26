/* eslint-disable prettier/prettier */
const path = require('path');
const {
    override,
    addBabelPlugin,
} = require('customize-cra');

// https://segmentfault.com/a/1190000020237817
// https://segmentfault.com/a/1190000020237790
// 没有用3 是因为打包出来比较大
module.exports = override(
    addBabelPlugin('@babel/plugin-proposal-optional-chaining'),
);