/**
 * Cloud9 Language Foundation
 *
 * @copyright 2011, Ajax.org B.V.
 * @license GPLv3 <http://www.gnu.org/licenses/gpl.txt>
 */
define(function(require, exports, module) {
    main.consumes = ['language', 'Plugin', 'ext'];
    main.provides = [];
    return main;

    function main(options, imports, register) {
        var language = imports.language;
        var ext = imports.ext;
        var Plugin = imports.Plugin; 
        var plugin = new Plugin("Your name", main.consumes);
        plugin.on('unload', function() {});
        language.registerLanguageHandler('plugins/c9.ide.language.csharp/csharp_completer',
            function csharpCompleterAfterInit(error, worker) {
            if (!error) {
                ext.loadRemotePlugin('omnisharp', { code: require('text!./csharp_completer_server.js'), }, 
                function afterServerLoaded(err, serverApi) {
                    if (err) {
                        
                    }
                    
                    if (serverApi) {
                        serverApi.log('serverIsReady');
                        serverApi.startOmnisharp('C:/projects/Cloud 9/c9sdk/plugins/c9.ide.language.csharp/', 
                        function(err, port) {
                            if (err) {
                                
                            }
                            worker.emit('serverIsReady', { data: port });
                            worker.on('autocomplete', function(request) {
                                serverApi.callService('autocomplete', request.data.code, 
                                function onCompletionResult(err, result) {
                                    if (err) {
                                        console.log(err);
                                    }
                                    
                                    worker.emit('autocomplete' + request.data.timstamp, { data: result });
                                });
                            });
                        });
                    }
                });
            }
        });
        register(null, { myPlugin: plugin });
    }
});