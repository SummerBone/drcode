var method = NLCService.prototype;
var nlcAccount;
var primaryClassifierId = '8aff06x106-nlc-13854';
var icdClassifiers = ['8aff06x106-nlc-13858', 'f48968x109-nlc-5099', 'e82f62x108-nlc-5311', '004a12x110-nlc-3415', 'f48968x109-nlc-5098'];

var cList;
function NLCService(){
   login();
}

login = function(){
  //var fs  = require("fs");
  //var account = fs.readFileSync('./myCred.txt').toString().split('\n');

  var watson = require('watson-developer-cloud');
  nlcAccount = watson.natural_language_classifier({
     url: 'https://gateway.watsonplatform.net/natural-language-classifier/api',
     username: '185ab6a7-fe13-4340-a6c0-ebd9ac0a8b59',//account[0],
     password: 'thLctxcVRmwa',//account[1],
     version: 'v1'
  });
  console.log('NLC Service Logged-in.')
};

train = function(fileName, cName){
  var fs = require('fs');
  var trainSet = {
    language: 'en',
    name: cName,
    training_data: fs.createReadStream('./' + fileName)
  };

  console.log('NLC train data ready.')
  return trainSet;
};


getList = function(functionToDo){
   nclResult =  nlcAccount.list({}, function(err, response) {
   if (err){
      console.log('error while retrieving list of nlc:', err);
    }
    else{
      strJSON = JSON.stringify(response, null, 2);
      cList = JSON.parse(strJSON).classifiers;
      functionToDo(cList);
    }
  });

};

method.create = function(fileName, cName){
  var trainSet = train(fileName, cName);
  var nlc = nlcAccount.create(trainSet, function(err, response) {
  if (err)
    console.log('error while creating classifier: '+err);
  else
    console.log(JSON.stringify(response, null, 2));
  });
  console.log(nlc)
};

method.showList = function(){
   getList(priPrintList);
   console.log(cList);
};

priPrintList = function(cList){
  console.log('total ' + cList.length + ' calssifiers. \n')
  for (i=0; i<cList.length; i++){
    var cId = cList[i].classifier_id;
    var cDate = cList[i].created;
    var cName = cList[i].name;
    console.log(i+1 + ':\n' + 'classifier_id: ' + cId);
    console.log('name: ' + cName);
    console.log('created: ' + cDate + '\n');
  }
};

method.deleteAll = function(){
  getList(priDelete)
};

priDelete = function(cList){

  for (var i =0; i< cList.length; i++)
  {
    id = cList[i].classifier_id;
    nlcAccount.remove({
      classifier_id: id },
      function(err, response) {
        if (err)
          console.log('error:', err);
    });
  }
};

method.delete = function(id){
  priDelete(id);
};

method.ask = function(question, output, classifierIndex) {
  var classifier = primaryClassifierId;

  if (typeof classifierIndex !== 'undefined') {
    classifier = icdClassifiers[classifierIndex];
  }

  nlcAccount.classify({
  text: question,
  classifier_id: classifier },
  function(err, response) {
    if (err)
    {
      console.log('error:', err);
    }
    else
    {
      //console.log(primaryClassifierId);
      //console.log(JSON.stringify(response,null,2));
      output(response);
    }
  });
};

method.ask2Prev = function(question, output)
{

  nlcAccount.classify({
  text: question,
  classifier_id: "8aff06x106-nlc-7050" },
  function(err, response) {
    if (err)
    {
      console.log('error:', err);
    }
    else
    {
      var rList = response.classes;

      console.log('Old reponses:'+ '\n');
      // for now, print top three
      for (var i = 0; i<4; i++) {
          console.log(rList[i].class_name + '\n');
          console.log(rList[i].confidence + '\n\n');
      }
    }
});
};


module.exports = NLCService;
