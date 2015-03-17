/**
 * Cloud9 Language Foundation
 *
 * @copyright 2011, Ajax.org B.V.
 * @license GPLv3 <http://www.gnu.org/licenses/gpl.txt>
 */
define(function(require, exports, module) {
    var util = require("plugins/c9.ide.language/worker_util");
    var baseLanguageHandler = require('plugins/c9.ide.language/base_handler');
    var htmlSnippets = require("./snippets");
    
    var completer = module.exports = Object.create(baseLanguageHandler);
    var omnisharpIsReady = true;
    
    completer.init = function init(callback) {
        completer.sender.on('serverIsReady', function(port) {
            // console.log('omnisharp is listening on ' + port);
            omnisharpIsReady = true;
        });
    
        callback();
    };
    
    completer.handlesLanguage = function(language) {
        return language === "csharp";
    };
    
    var JADE_REGEX = /.*?([a-zA-Z]*)([.#])([\w]+)/;
    var JADE_ID_REGEX = /[a-zA-Z_0-9\$\_.#]/;
    var latestCompltionTimeStamp = Date.now();
    completer.complete = function(doc, fullAst, pos, currentNode, callback) {
        
        var line = doc.getLine(pos.row);
        var prefix = util.getPrecedingIdentifier(line, pos.column);
        // var match = JADE_REGEX.exec(line.substring(0, pos.column));
        
        if(omnisharpIsReady) {
            latestCompltionTimeStamp = Date.now();
            completer.sender.on('autocomplete' + latestCompltionTimeStamp, 
            function(compltions) {
                callback(Object.keys(compltions.data).map(function (index) {
                    var complition = compltions.data[index];
                    return {
                            id: complition.CompletionText,
                            name: complition.CompletionText,
                            replaceText: complition.CompletionText,
                            doc: "<pre>" + complition.Description.replace("\^\^", "&#9251;").replace(/</g, "&lt;") + "</pre>",
                            icon: null,
                            meta: "omnisharp",
                            isContextual: true,
                            docHead: complition.DisplayText,
                            isFunction: !!complition.MethodHeader,
                            // identifierRegex: JADE_ID_REGEX,
                            priority: 2
                        };
                    }));
            });
            
            completer.sender.emit('autocomplete', {
                timstamp: latestCompltionTimeStamp,
                code: {
                    buffer: doc.getValue(),
                    line: pos.row + 1, 
                    column: pos.column + 1, 
                    filename: 'C:/projects/Cloud 9/c9sdk/plugins/c9.ide.language.csharp' + this.path,
                    wantReturnType: true,
                    wantSnippet: true,
                    wordToComplete: prefix
                }
            });
        } else {
            callback([]);
        }
        
        // if (match) {
        //     var replaceText;
        //     var snippet = htmlSnippets[match[1]];
        //     if (snippet) {
        //         replaceText = snippet.replace("<" + match[1] + ">",
        //             ["<", match[1], match[2] === "." ? " class=\"" : " id=\"",
        //                 match[3], "\">"].join(""));
        //     }
        //     else {
        //         replaceText = ["<", match[1] || "div",
        //             match[2] === "." ? " class=\"" : " id=\"", match[3],
        //             "\">^^", "</", match[1] || "div", ">"].join("");
        //     }
        //     callback([{
        //           name: match[1]+match[2]+match[3],
        //           replaceText: replaceText,
        //           doc: "<pre>" + replaceText.replace("\^\^", "&#9251;").replace(/</g, "&lt;") + "</pre>",
        //           icon: null,
        //           meta: "Jade-Haml",
        //           identifierRegex: JADE_ID_REGEX,
        //           priority: 100
        //     }]);
        // }
        // else {
        //     var identifier = completeUtil.retrievePrecedingIdentifier(line, pos.column);
        //     var allIdentifiers = Object.keys(htmlSnippets);
        //     var matches = completeUtil.findCompletions(identifier, allIdentifiers);
        //     callback(matches.map(function(m) {
        //         return {
        //           name: m,
        //           replaceText: htmlSnippets[m],
        //           doc: "<pre>" + htmlSnippets[m].replace("\^\^", "&#9251;").replace(/</g, "&lt;") + "</pre>",
        //           icon: null,
        //           meta: "snippet",
        //           priority: 2
        //         };
        //     }));
        // }
    };
});
