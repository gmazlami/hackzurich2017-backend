const request = require('request');

exports.search = (req, res) => {
  var query = req.query.query;
  var queryText = encodeURIComponent(query);

  request('https://api.siroop.ch/product/search/?query=' + queryText +'&limit=20&apikey=8ccd66bb1265472cbf8bed4458af4b07',{ json: true }, (err, result, body) => {
    if (err) { 
      console.log(err); 
      return res.status(500);
    }
    console.log(body);
    return res.status(200).json(body)
  });

}
