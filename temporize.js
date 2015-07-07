'use strict';

var cache = {};

function temporize (options, done) {
  var store = cache[options.name];
  if (store === void 0) {
    store = cache[options.name] = {
      callbacks: [],
      expires: -Infinity
    };
  }
  store.callbacks.push(done);
  if (store.loading) {
    return;
  }
  var now = new Date();
  if (now > store.expires) {
    reload();
  } else {
    cached();
  }
  function reload () {
    store.loading = true;
    options.load(loaded);
  }
  function loaded () {
    var expires = new Date();
    expires.setSeconds(expires.getSeconds() + options.seconds);
    store.expires = expires;
    store.context = this;
    store.args = arguments;
    cached();
  }
  function cached () {
    store.loading = false;
    store.callbacks.forEach(callback);
    store.callbacks = [];
    function callback (fn) {
      setTimeout(go, 0);
      function go () {
        fn.apply(store.context, store.args);
      }
    }
  }
}

module.exports = temporize;
