/**
 * @deprecated 已废弃
 * 模块权限定义
 * 每个分组分为集团/公司/项目
 * @example [
 *  {
 *    Id: '与后台定义的Id保持一致'，
 *    Name: '一般作为Tab标签名',
 *    Type: '0 工程 1 交付',
 *    Title: '表标题先取Title，没有取Name',
 *    // 自定义其它字段，请在此处提示说明。并进行相关处理
 *  }
 * ]
 */
/* eslint-disable */

// 集团工程指标总览
var g0 = [];

// 集团交付指标总览
var g1 = [];

// 质量问题分析
var g2 = [
  {
    Id: 'BE2A066D-721D-41C4-9728-E02AF6FCA721',
    Type: 0,
  },
  {
    Id: '4FD514BD-A7CF-4799-80E4-B55EFC07D337',
    Type: 0,
  },
];

// 安全问题分析
var g3 = [
  {
    Id: '6749E50D-5156-4212-90ED-9744ECA26206',
    // Name: '安全问题分析',
    Type: 0,
  },
];

// 问题严重程度分析
var g4 = [
  {
    Id: 'F42BDDA7-B4C6-4BA7-A13D-89CDDD4C04B6',
    Name: '问题严重程度分析',
    Type: 0,
  },
];

// 交付情况分析
var g5 = [
  {
    Id: '49C2E7A1-9C32-4143-A5F0-E64858DBB48A',
    Type: 1,
  },
];

// 交付缺陷分析
var g6 = [
  {
    Id: '54B11E4D-C51A-4EF8-AC0A-B47897EAA342',
    Type: 0,
  },
  {
    Id: '49C2E7A1-9C32-4143-A5F0-E64858DBB48A',
    Type: 1,
  },
];

// 检查项问题数占比
var g7 = [
  {
    Id: '147792D3-FF4C-456B-B6C6-8AD572D464D4',
    Type: 0,
  },
];

// 验房缺陷分类排行
var g8 = [
  {
    Id: 'D305474A-0310-4510-867E-5A0E5F5DDFFB',
    Type: 0,
  },
];

// 项目信息
var g9 = [];

var exports = {};
for (var i = 0; i < 10; i += 1) {
  exports['g' + i] = eval('(g' + i +')');
}

export default exports;
