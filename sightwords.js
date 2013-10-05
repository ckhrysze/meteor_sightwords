
if (Meteor.isClient) {

  Template.kindergartenChecklist.wordlist = function() {
    var allwords = "a I to is you my like in and that of his from one by as have or had were every think first ride going walk well stop came why it the he was for on are with they go when an how if out your which their about many play please look ask may must best off tell into at be this but not what all we can said them then some would him two been long down her these find read right round say now story could jump there she do will up so make has see no day know very just much new give after man before let live under use away want soon call open eat who did get come little me our good am yes old boy put us work any three here again take family pretty funny ate saw help went where thank over".split(' ');

    var lists = [];
    for (var i=0; i<allwords.length; i++) {
      bucket = i%15;
      if (! lists[bucket])
        lists[bucket] = [];
      lists[bucket].push(allwords[i]);
    }

    return lists;
  };

  Template.checklists.checklistgroups = function() {
    var sets = [
      "the of and a to in is you that it he was for on are",
      "as with his they I at be this have from or had one by word",
      "but not what all were we when your can said there use an each which",
      "she do how their if will up other about out many then them these so",
      "some her would make like him into time has look two more write go see",
      "number no way could people my than first water been call who oil now find",
      "long down day did get come made may part over new sound take only little",
      "work know place year live me back give most very after thing our just name",
      "good sentence man think say great where help through much before line right too mean",
      "old any same tell boy follow came want show also around form three small set",
      "put end does another well large must big even such because turn here why ask",
      "went men read need land different home us move try kind hand picture again change",
      "off play spell air away animal house point page letter mother answer found study still"
    ];

    var groups = new Array();

    var perPage = 4;
    for (var i=0; i<sets.length/perPage; i++) {
      groups[i] = new Array();
      for (var j=0; j<perPage; j++) {
        var index = i*perPage + j;
        if (index < sets.length)
          groups[i].push({"number" : index+1, "words" : sets[index].split(" ")});
      }
    }

    return groups;
  };

  var selectWord = function(event) {
    var selected = Session.get("selected");
    selected[this] = event.target.checked == true;
    Session.set("selected", selected);
  };

  var getSelectedWords = function() {
    var selected = Session.get("selected");
    var words = [];

    $.each(selected, function(k,v) {
      if (v) {
        words.push(k);
      }
    });

    return words;
  };

  Template.wordSheets.sections = function() {
    var selectedWords = shuffle(getSelectedWords());
    var words = [];
    var numWords = selectedWords.length;

    var cols = 10;
    var wordsInSection = 50;
    var rowsInSection = wordsInSection / cols;
    var sections = Math.ceil(numWords / wordsInSection);

    for (var i=0; i<sections; i++) {
      words[i] = [];

      for (var j=0; j<rowsInSection; j++) {
        if (i*wordsInSection + j*cols >= numWords) { break; }
        words[i][j] = [];

        for (var k=0; k<cols; k++) {
          var index = i*50 + j*cols + k;
          if (index >= numWords) { break; }
          words[i][j].push(selectedWords[index]);
        }
      }
    }

    return words;
  };

  Template.flashCardsSheets.selectedWords = function() {
    var selectedWords = shuffle(getSelectedWords());
    var words = [];
    var numWords = selectedWords.length;

    var cols = 3;

    for (var j=0; j<Math.ceil(numWords/cols); j++) {
      words[j] = [];

      for (var k=0; k<cols; k++) {
        var index = j*cols + k;
        if (index >= numWords) { break; }
        words[j].push(selectedWords[index]);
      }
    }

    console.log(words);
    return words;
  };

  Template.checklists.rendered = function() {
    $(this.firstNode).find(".item").first().addClass("active");
  };

  Template.kindergartenChecklist.events = {
    change: selectWord
  };

  Template.checklistgroup.events = {
    "change .wordcheck": selectWord,
    "change .wordListTitle": function(event) {
      console.log(event);
      $(event.target).parents('.wordlist-container').find('input.wordcheck').click();
    }
  };

  Template.topbar.events = {
    "click #150words": function() {
      console.log("150 words clicked");
      swapBody(Meteor.render(function() {
        return Template.wordSheets();
      }));
    },

    "click #flashCards": function() {
      console.log("flash cards clicked");
      swapBody(Meteor.render(function() {
        return Template.flashCardsSheets();
      }));
    }
  };

  Meteor.startup(function() {
    Session.set("selected", {});

    var main = Meteor.render(function() {
      return Template.wordSelection();
    });
    document.body.appendChild(main);
  });

}
