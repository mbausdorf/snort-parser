var parser = require('snort-rule-parser');
var fs = require('fs');
var walk = require('walk');

var walker = walk.walk("./" + process.argv[2], { followLinks: false });
var rulesTotal = 0;

walker.on('file', function (root, stat, next) {
    console.log('parsing ' + stat.name);
    var rules = [];

    var fileContent = fs.readFileSync('rules/' + stat.name);
    var lines = fileContent.toString().split('\n');
    lines.forEach(function (element) {
        parser(element, true, function (err2, data2) {
            if (data2.length > 0) {
                rules.push(JSON.stringify(data2[0]));
            }
        });
    }, this);

    if(rules.length > 0)
    {
        rulesTotal += rules.length;
        var joined = "[" + rules.join(",") + "]";
        fs.writeFile("./"+ process.argv[3] + "/" + stat.name + ".json", joined, 'utf8');
    }

    next();
});

walker.on('end', function () {
    console.log("done");
    console.log("parsed: " + rulesTotal);
    process.exit();
});

