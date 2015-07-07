# temporize

> Cache things using a lock mechanism

# install

```shell
npm i temporize -S
```

# `temporize(options, done)`

This method is dual-purpose. On one hand it can be used to cache things and yield the exact same result every time. On the other hand, it can be used as _a lock mechanism_ so that multiple demands for the same resource only trigger _a single request_.

Here's a detailed view into the `options`.

Option    | Description
----------|---------------------------------------------------------------------------------------------
`name`    | The name of the resource you'll be caching. Best to use endpoints like `/foo/bar`
`load`    | The callback that will be used to **request** the resource. Results will be cached
`seconds` | How many seconds should we cache the results of `load`?

Again, let's emphasize that multiple subsequent calls to `temporize(options, done)` will result in a single call to `load`, as long as they all use the same `options.name`.

Example using it to store the results of an XHR call for 60 seconds. Regardless of how many times `sanely()` gets executed, `load` will be called only once. When `loaded` gets called for the first time, the cached response will be used for another `60` seconds, after which `load` will get used again.

```js
function sanely () {
  temporize({
    name: endpoint,
    load: load,
    seconds: 60
  }, loaded);
}

function load (done) {
  xhr(endpoint, done);
}

function loaded (err, data) {
  // use results
}
```

This method is particularly useful when fetching data that seldom changes, or as a way to ensure that the server isn't drowned in requests for the same bit of data. In the latter case, even setting a very low number of `seconds` can help, depending on your use case.

# license

MIT
