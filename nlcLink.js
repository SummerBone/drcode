var watson = require('watson-developer-cloud');
watson.natural_language_classifier({
  url: 'https://gateway.watsonplatform.net/natural-language-classifier/api',
  username: '185ab6a7-fe13-4340-a6c0-ebd9ac0a8b59',
  password: 'thLctxcVRmwa',
  version: 'v1'
});


var params = {
  language: 'en',
  name: 'My Classifier',
  training_data: fs.createReadStream('./train.csv')
};

natural_language_classifier.create(params, function(err, response) {
  if (err)
    console.log(err);
  else
    console.log(JSON.stringify(response, null, 2));
});