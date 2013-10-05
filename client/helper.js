this.shuffle = function(array) {
  var currentIndex = array.length
    , temporaryValue
    , randomIndex
    ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

this.swapBody = function(newNode) {
  var oldNode = document.body.firstElementChild;

  // prevent the issue discussed here: https://github.com/meteor/meteor/issues/392
  Spark.finalize(oldNode);

  document.body.replaceChild(newNode, oldNode);
};
