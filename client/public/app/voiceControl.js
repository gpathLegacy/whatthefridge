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

        var scroll = function(position){
          if(position === "top"){
            $("html, body").animate({ scrollTop: 0 }, "slow")
          }
          if(position === "bottom"){
            $("html, body").animate({ scrollTop: $(document).height()-$(window).height() })
          }
          if(position === "down"){
            $('html, body').animate({scrollTop: '+=150px'}, 800)
          }
          if(position === "up"){
            $('html, body').animate({scrollTop: '-=150px'}, 800)
          }
        }
        
        var commands = {
          'go to *view': goTo,
          'scroll *position': scroll
        };

        // Add our commands to annyang
        annyang.addCommands(commands);

        // Start listening.
        annyang.start();
      }
