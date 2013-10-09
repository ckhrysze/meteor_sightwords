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

  var groups = new Array();

  var perPage = 4;
  for (var i=0; i<first_grade_words.length/perPage; i++) {
    groups[i] = new Array();
    for (var j=0; j<perPage; j++) {
      var index = i*perPage + j;
      if (index < first_grade_words.length)
        groups[i].push({"display" : "Word List "+(index+1), "name" : index+1,
                        "words" : first_grade_words[index].split(" ")});
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

// {'display' : '', 'name' : '', 'words' : },
Template.requirementsSelection.requirementsLists = function() {
  var numbers1 = [];
  var numbers2 = [];
  for (var i=1; i<=50; i++) { numbers1.push(i); }
  for (var j=51; j<=100; j++) { numbers2.push(j); }

  var data = [
    {'display' : 'Upper Case', 'name' : 'upper', 'words' : upper_case_letters},
    {'display' : 'Lower Case', 'name' : 'lower', 'words' : lower_case_letters},
    {'display' : 'Numbers 1-50', 'name' : 'numbers1', 'words' : numbers1},
    {'display' : 'Numbers 51-100', 'name' : 'numbers2', 'words' : numbers2},
    {'display' : 'Kindergarten Overlap', 'name' : 'overlap', 'words' : kindergarten_non_overlap}
  ];

  return data;
};

Template.miscellaneousSelection.miscLists = function() {
  var data = [
    {'display' : 'Colors', 'name' : 'colors', 'words' : color_words},
    {'display' : 'Math Concepts', 'name' : 'math', 'words' : math_words},
    {'display' : 'Months', 'name' : 'months', 'words' : month_words},
    {'display' : 'Days', 'name' : 'days', 'words' : days_of_the_week}
  ];

  return data;
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
    $(event.target).parents('.wordlist-container')
      .find('input.wordcheck').each(function(i, input) {
        if (input.checked != event.target.checked) {
          input.click();
        }
      });
  }
};

Template.topbar.events = {
  "click #wordsheet": function() {
    Router.navigate("wordsheet", {trigger: true});
  },

  "click #flashCards": function() {
    Router.navigate("flashcards", {trigger: true});
  }
};

var SightwordRouter = Backbone.Router.extend({
  routes: {
    "": "main",
    "wordsheet": "wordsheet",
    "flashcards": "flashcards"
  },
  main: function () {
    Session.set("selected", {});

    swapBody(Meteor.render(function() {
      return Template.wordSelection();
    }));

  },
  wordsheet: function () {
    console.log("wordsheet");
    if (typeof(Session.get("selected")) == "undefined")
      Router.navigate("", {replace: true});
    swapBody(Meteor.render(function() {
      return Template.wordSheets();
    }));
  },
  flashcards: function () {
    console.log("flashcards");
    if (typeof(Session.get("selected")) == "undefined")
      Router.navigate("", {replace: true});
    swapBody(Meteor.render(function() {
      return Template.flashCardsSheets();
    }));
  }
});

Router = new SightwordRouter;

Meteor.startup(function() {
  var main = Meteor.render(function() {
    return Template.wordSelection();
  });
  document.body.appendChild(main);

  Backbone.history.start({pushState: true});
});
