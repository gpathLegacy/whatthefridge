"use strict";
if (annyang && window.location.href.split('/').pop() !== "") {
  // Let's define a command.
  var goTo = function(view) {
    var endPointStart = window.location.href.lastIndexOf('/');
    var basicPath = window.location.href.slice(0, endPointStart +1);

    window.location.href = basicPath + view;
  }

  var logout = function(){
    $("#logout").click();
    anyang.abort();
  }
  
  var scroll = function(position){
    if(position === "top"){
      $("html, body").animate({ scrollTop: 0 }, "slow");
    }
    if(position === "bottom"){
      $("html, body").animate({ scrollTop: $(document).height()-$(window).height() });
    }
    if(position === "down"){
      $('html, body').animate({scrollTop: '+=150px'}, 800);
    }
    if(position === "up"){
      $('html, body').animate({scrollTop: '-=150px'}, 800);
    }
  }
  
  //click activator for recipe card
  var show = function(recipe){
    console.log("show", recipe)
    console.log("typeof", typeof recipe)
    var idIfied = "#"+ recipe.split(' ').join('');
    $(idIfied).click();
  }

  var dismiss = function(recipe){
    console.log("recipe", recipe)
    var idIfied = "#dismiss" + recipe.split(' ').join('');
    $(idIfied).click();
  }

  var instructionsFor = function(recipe){
    console.log("instructions", recipe)
     console.log("typeof", typeof recipe)
    var idIfied = "#" + recipe.toLowerCase().split(' ').join('') + "Instructions";
    $(idIfied).click();
  };

  //recipes voice search
  var voiceSearchRecipes = function(item){
    console.log("search", item);
    console.log("typeof", typeof item)  
    $("#search").simulate("key-sequence", {sequence: item, delay: 100});
    // $("#search").trigger("input");
  }

  //clear searchbar
  var clearVoiceSearch = function(){
    $("#search").simulate("key-sequence", {sequence: "{selectall}{backspace}", delay: 100})
    $("#search").trigger("input");
  }

  var enter = function(){
    console.log('worked')
    $("#search").trigger("input");
  }

  var commands = {
    'go to *view': goTo,
    'scroll *position': scroll,
    'log out': logout,
    'show *recipe': show,
    'dismiss *recipe': dismiss,
    'instructions for *recipe': instructionsFor,
    'type *item': voiceSearchRecipes,
    'clear search': clearVoiceSearch,
    'search': enter
  };

  // Add our commands to annyang
  annyang.addCommands(commands);

  // Start listening.
  annyang.start();
}
