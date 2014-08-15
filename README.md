# Node Angular Starter

Description.

## Setting Up

Install Node.js then:

```sh
$ git clone git://github.com/kylepixel/node-angular-starter
$ cd node-angular-starter
$ sudo npm -g install bower gulp
$ npm install
$ bower install
$ gulp serve
```

Finally, open `localhost:3000` in your browser.

## Directory Structure

```
node-angular-start/
  |- src/
  |  |- app/
  |  |  |- <app logic>
  |  |- assets/
  |  |  |- <static files>
  |  |- common/
  |  |  |- <reusable code>
  |  |- less/
  |  |  |- main.less
  |- server/
  |  |- server.js
  |  |- api/
  |  |  |- ...
  |- .jshintrc
  |- bower.json
  |- build.config.js
  |- gulpfile.js
  |- package.json
```

### Live Reload

`node-angular-starter` also includes [Live Reload](http://livereload.com/). Download the addon for your browser at the following locations:

- Chrome - [Chrome Webstore](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei)
- Firefox - [Download from Live Reload](http://download.livereload.com/2.0.8/LiveReload-2.0.8.xpi)
- Safari - [Download from Live Reload](http://download.livereload.com/2.0.9/LiveReload-2.0.9.safariextz)
- Internet Explorer - N/A

When you load your page, click the Live Reload icon in your toolbar and
everything should work.
