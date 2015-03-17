/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4,
maxerr: 50, node: true */
/*global */

(function(module) {
    'use strict';

    var path = require('path');
    var request = require('request');
    var spawn = require('child_process').spawn;
    var net = require('net');

    module.exports = function(vfs, options, register) {

        var _port, _omnisharpProcess, __dirname = 'C:/projects/Cloud 9/c9sdk/plugins/c9.ide.language.csharp/omnisharp';
        function findFreePort(callback) {
            var server = net.createServer(),
                port = 0;

            server.on('listening', function() {
                port = server.address().port;
                server.close();
            });

            server.on('close', function() {
                callback(null, port);
            });

            server.listen(0, '127.0.0.1');
        }

        function getOmnisharpLocation() {
            return path.join(__dirname, '..', 'omnisharp', 'omnisharp.exe');
        }

        register(null, {
            log: function(text) {
                console.trace(text);
            },
            startOmnisharp: function(projectLocation, callback) {
                // console.info('launching omnisharp');

                findFreePort(function(err, port) {
                    if (err !== null) {
                        callback(err);
                    }

                    _port = port;

                    var location = getOmnisharpLocation(),
                        isMono = process.platform !== 'win32',
                        args = ['-p', _port, '-s', projectLocation],
                        executable;

                    if (isMono) {
                        executable = 'mono';
                        args.unshift(location);
                    }
                    else {
                        executable = location;
                    }

                    _omnisharpProcess = spawn(executable, args);

                    _omnisharpProcess.stdout.on('data', function(data) {
                        // console.info(data.toString());
                        var ready = (data.toString().match(/Solution has finished loading/) || 0).length > 0;

                        if (ready) {
                            // _domainManager.emitEvent(_domainName, 'omnisharpReady');
                        }
                    });

                    _omnisharpProcess.stderr.on('data', function(data) {
                        console.error(data.toString());
                        // _domainManager.emitEvent(_domainName, 'omnisharpError', data);
                    });

                    _omnisharpProcess.on('close', function(data) {
                        console.info(data);
                        // _domainManager.emitEvent(_domainName, 'omnisharpQuit', data);
                    });

                    callback(null, _port);
                });
            },
            stopOmnisharp: function() {
                if (_omnisharpProcess !== null) {
                    _omnisharpProcess.kill('SIGKILL');
                    _omnisharpProcess = null;
                }
            },
            callService: function(service, data, callback) {
                data.filename = path.resolve(data.filename);

                var url = 'http://localhost:' + _port + '/' + service;
                // console.info('making omnisharp request: ' + url);
                // console.info(data);
                request.post(url, {
                    json: data
                }, function(err, res, body) {
                    if (!err && res.statusCode === 200) {
                        callback(null, body);
                    }
                    else {
                        callback(err);
                    }
                });
            }
        });
    };
})(module);