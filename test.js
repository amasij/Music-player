(function () {
  "use strict";
 
  var walk = require('walk');
  var fs = require('fs');
  var path=require('path')
  var walker;
  var options;
  var pref=['.mp3','.m4a'];
 options = {
    followLinks: false
    // directories with these keys will be skipped
  , filters: ["Temp", "_Temp"]
  };
  walker = walk.walk("C:\\books\\electron\\player\\ex\\a", options);
 
  walker.on("file", function (root, fileStats, next) {
    fs.readFile(fileStats.name, function () {
      // doStuff
      if(pref.includes(path.extname(fileStats.name)))
      {
        if(root=="C:\\books\\electron\\player\\ex\\a")
          console.log(fileStats.name+'-----'+root+'---- true');
    else
      console.log(fileStats.name+'-----'+root);
      }
      
      next();
    });
  });
 
  walker.on("errors", function (root, nodeStatsArray, next) {
    next();
  });
 
  walker.on("end", function () {
    console.log("all done");
  });
}());