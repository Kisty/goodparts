'use strict';

var test = require('tape');
var eslint = require('eslint');
var allRules = require('eslint/conf/eslint-all.js').rules;

var testObject = require('./fixtures/');
var ourRules = require('../rules/');

var linter = eslint.linter;

function passesRule (rule, text) {
  var rules = {};

  rules[rule] = ourRules[rule];

  return linter.verify(text, { rules: rules }).length === 0;
}

function ruleNotSet (rule) {
  return [0, 'off'].indexOf(ourRules[rule]) > -1;
}

function ruleNotConfigured (rule) {
  return typeof ourRules[rule] === 'undefined';
}

test('Testing All Conifgurable Rules', function (t) {
  Object.keys(allRules).forEach(function check_rule (rule) {
    var fail_cases, pCases;

    if (ruleNotConfigured(rule)) {
      t.fail(rule + ' not configured');

      return;
    }

    if (testObject[rule] === null) {
      t.ok(ruleNotSet(rule), rule + ' not configured');

      return;
    }

    fail_cases = testObject[rule].fail;
    pCases = testObject[rule].pass;

    if (fail_cases) {
      fail_cases.forEach(function (text) {
        t.notOk(passesRule(rule, text), rule + ' fails');
      });
    }

    if (pCases) {
      pCases.forEach(function (text) {
        t.ok(passesRule(rule, text), rule + ' passes');
      });
    }
  });

  t.end();
});
