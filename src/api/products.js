const request = require('request');

var DEMO_PRODUCT_EAN = "5030930121822";
var DEMO_PRODUCT_SENTIMENT = "0.7";


var generateRandomSentiment = () => {
    var absoluteVal = Math.random();
    var multiplicator = Math.random() > 0.5 ? -1 : 1;
    return absoluteVal * multiplicator;
}

exports.search = (req, res) => {
  var query = req.query.query;
  var queryText = encodeURIComponent(query);

  request('https://api.siroop.ch/product/search/?query=' + queryText +'&limit=200&category=%2Fmedien-unterhaltung%2Fgames&apikey=8ccd66bb1265472cbf8bed4458af4b07',{ json: true }, (err, result, body) => {
    if (err) { 
      console.log(err); 
      return res.status(500);
    }
    console.log(body);
    for(var i = 0; i < body.length ; i++){
      if (body[i]["ean"] == DEMO_PRODUCT_EAN){
        body[i]["sentiment"] = DEMO_PRODUCT_SENTIMENT;
      }else{
        body[i]["sentiment"] = generateRandomSentiment();
      }
    }

    return res.status(200).json(body)
  });

}
