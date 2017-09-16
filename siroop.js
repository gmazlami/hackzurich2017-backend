const request = require('request');


exports.getProducts = function(fulltex, callback){
    var queryText = encodeURIComponent(fulltex);
    request('https://api.siroop.ch/product/search/?query=' + queryText +'&limit=20&apikey=8ccd66bb1265472cbf8bed4458af4b07',{ json: true },callback);
}


// siroop.getProducts("iPhone", (err, res, body) => {
//     if (err) { return console.log(err); }
//     console.log(body);
//   });