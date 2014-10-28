NOTE: THIS PROJECT IS STILL IN PROGRESS

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
```

Finally, open `localhost:3000` in your browser.

## Build Process

```sh
gulp build
```

```sh
gulp watch
```

```sh
gulp serve
```

```sh
gulp compile
```

## Running the Server

The server can be started with the following command:

```sh
npm start [--dev] [--port=<port>]
```

If the `--dev` flag is included, the server will be started in development mode and will serve files generated by the `gulp build` which are in the `/build` directory by default. If the flag is not included, the server will start in production mode by default. Productions files are generated by the `gulp compile` command and are in the `/dist` directory by default.

If the `--port` flag is included with an argument, the server will be started on the specified port. Otherwise, it will start on the default port which is specified in the config section of `package.json`.

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

## Build Configuration

...

### Live Reload

`node-angular-starter` also includes [Live Reload](http://livereload.com/). Download the addon for your browser at the following locations:

- Chrome - [Chrome Webstore](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei)
- Firefox - [Download from Live Reload](http://download.livereload.com/2.0.8/LiveReload-2.0.8.xpi)
- Safari - [Download from Live Reload](http://download.livereload.com/2.0.9/LiveReload-2.0.9.safariextz)
- Internet Explorer - N/A

When you load your page, click the Live Reload icon in your toolbar and
everything should work.
