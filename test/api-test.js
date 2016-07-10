'use strict';

const assert = require('assert');

const StreamPair = require('stream-pair');

const CommandSocket = require('../');

describe('gypkg-cmd-socket', () => {
  let pair;
  let left;
  let right;
  beforeEach(() => {
    pair = StreamPair.create();
    left = new CommandSocket(pair);
    right = new CommandSocket(pair.other);
  });

  afterEach(() => {
    pair = null;
    left = null;
    right = null;
  });

  it('should parse and send commands', (cb) => {
    left.send('hello', { ok: true });
    right.once('hello', (data) => {
      assert.deepEqual(data, { ok: true });
      cb();
    });
  });

  it('should parse and send errors', (cb) => {
    left.error('hello', new Error('gosh'));
    right.once('error', (err) => {
      assert(/gosh/.test(err));
      cb();
    });
  });
});
