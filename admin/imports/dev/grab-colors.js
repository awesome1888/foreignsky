/**
 * Usage:
 * phantomjs grab-colors.js
 *
 * Read:
 * http://phantomjs.org/
 */

var fs = require('fs');
// var system = require('system');
var page = require('webpage').create();

//var url = system.args[1];
var url = 'http://bootflat.github.io/color-picker.html';
var output = './output.txt';
var outputLess = './output-palette.txt';
var outputPrimitives = './output-primitives.txt';

////////////////////////////////
////////////////////////////////

var uCFirst = function(value) {
    return value.substr(0, 1).toUpperCase() + value.substr(1);
};

console.dir('Started for '+url);

page.onConsoleMessage = function(msg) {
    console.log(msg);
};
page.open(url, function(status) {
    console.log('Status: '+status);

    page.includeJs("http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js", function() {
        var result = page.evaluate(function(){

            var result = [];

            $('.color-picker').each(function(i, item) {
                var itemJq = $(item);
                
                var colorName = itemJq.find('.color-name').text().toUpperCase();
                var colorHex = itemJq.find('.hex-number').text();

                result.push({
                    name: colorName,
                    value: colorHex,
                });
            });

            return result;
        });

        var strResult = '';
        var strResultLess = '';
        var strResultLessPrimitives = '';
        for(var k = 0; k < result.length; k++) {
            var code = result[k].name.replace(/[\-\s+]/g, '_');
            var lessCode = code.replace(/_/g, '-').toLowerCase();

            var name = result[k].name.toLowerCase().split(' ');
            var newName = [];
            for(var m = 0; m < name.length; m++) {
                newName.push(uCFirst(name[m]));
            }
            newName = newName.join(' ');

            var hex = result[k].value.replace('#', '').toLowerCase().substr(0, 6);

            strResult += "{value: '"+newName+"', key: '"+code+"', hex: '"+hex+"'},\n";
            strResultLess += "@color_"+lessCode+": #"+hex+";\n";
            strResultLessPrimitives += ".b-color_"+lessCode+"() {\n\t._b-color(@color_"+lessCode+") !important;\n}\n\n";
        }

        fs.write(output, strResult, 'w');
        fs.write(outputLess, strResultLess, 'w');
        fs.write(outputPrimitives, strResultLessPrimitives, 'w');
        // system.stdout.writeLine('\nHello, system.stdout.writeLine!');

        phantom.exit();
    });
});
