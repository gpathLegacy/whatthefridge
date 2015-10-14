if (annyang && window.location.href.split('/').pop() !== "") {
  // Let's define a command.
  var goTo = function(view) {

    //handle hyphenated paths
    //if (view==='saved lists'){
    //}
    //
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
    var idIfied = "#"+ recipe.toLowerCase();
    $(idIfied).click();
  }

  var dismiss = function(recipe){
    var idIfied = "#dismiss" + recipe.toLowerCase();
    $(idIfied).click();
  }

  var commands = {
    'go to *view': goTo,
    'scroll *position': scroll,
    'log out': logout,
    'show *recipe': show,
    'dismiss #recipe': dismiss
  };

  // Add our commands to annyang
  annyang.addCommands(commands);

  // Start listening.
  annyang.start();
}
