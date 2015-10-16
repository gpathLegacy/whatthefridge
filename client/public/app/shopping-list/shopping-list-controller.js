angular.module('wtf.shopping-list', [])
  .controller('ShoppingListController', ["$scope", "$window", "$location", "Recipes", "Fridge", "SavedLists", "UpcLookup", function($scope, $window, $location, Recipes, Fridge, SavedLists, UpcLookup) {

    $scope.lookupIngredient;
    $scope.lookupPrevPrice;
    $scope.lookupIndex;
    $scope.shoppingList = [];
    $scope.disabled = false;
    $scope.addModal = function() {
      $("#addItem").openModal();
    };

    $scope.addItem = function() {
      // check if item already exists in shopping list
      var alreadyExists = false;
      for (var i = 0; i < $scope.shoppingList.length; i++) {
        if ($scope.shoppingList[i].name === $scope.itemToAdd) {
          alreadyExists = true;
          break;
        }
      }
      if (alreadyExists) {
        Materialize.toast('Item already exists in shopping list!', 4000);
      }
      else {
        $scope.shoppingList.push({'name':$scope.itemToAdd, 'price':'0.00', 'qty':1});
      }
    };

    $scope.saveModal = function() {
      $("#saveList").openModal();
    };

    $scope.disableButtons = function(){
      if ($scope.disableQty || $scope.disablePrice){
        $('.saveButton').addClass('disabled');
        $('.fridgeButton').addClass('disabled');
        $scope.disabled = true;
      }
    };

    $scope.enableButtons = function(){
      if (!$scope.disableQty && !$scope.disablePrice){
        $('.saveButton').removeClass('disabled');
        $('.fridgeButton').removeClass('disabled');
        $scope.disabled = false;
      }
    };

    $scope.checkPrice = function(index) {
      var formName = "priceForm" + index;
      var formCheck = $scope.$$childHead;
      // walk through scope objects to find the one containing the form in question
      while (formScope === undefined) {
        if(formCheck[formName]) {
          var formScope = formCheck[formName];
        } else {
          formCheck = formCheck.$$nextSibling;
        }
      }

      // if the form is invalid (doesn't match pattern), tell user what the format is. Return false so
      // the price won't be saved as undefined in the savePrice function
      if(formScope.$invalid) {
        $scope.disablePrice = true; 
        $scope.disableButtons();
        Materialize.toast('Price must match format: 0.00', 4000);
        return false;
      }else{
        $scope.disablePrice = false;
        $scope.enableButtons();
        return true;
      }
    };

    $scope.populateList = function() {
      // When we initialize this page, set fridgeFlag to true, enabling the fridge button.
      // Also set notSavedFlag to true, enabling the save button
      $scope.fridgeFlag = true;
      $scope.notSavedFlag = true;
      $scope.totalPrice = 0;

      // If we're coming from a saved list, the ingredients will be in a different format,
      // accounting for user saved quantities
      if(Recipes.selectedRecipes[0].saved) {
        for (var i = 0; i < Recipes.selectedRecipes[0].ingredients.length; i++) {
          $scope.shoppingList.push({name:Recipes.selectedRecipes[0].ingredients[i][0], qty:Recipes.selectedRecipes[0].ingredients[i][1]});
        }
      } else {
        for (var i = 0; i < Recipes.selectedRecipes.length; i++) {
          for (var j = 0; j < Recipes.selectedRecipes[i].ingredients.length; j++) {

            // Look to see if ingredient already exists in shopping list
            var existingItem = $scope.shoppingList.filter(function(item) {
              return item.name === Recipes.selectedRecipes[i].ingredients[j]
            });

            // If item exists, increase its quantity and add the recipeID to its recipes array,
            // and add its price to the total price
            if (existingItem.length) {
              var index = $scope.shoppingList.indexOf(existingItem[0])
              $scope.shoppingList[index].qty++;
              $scope.shoppingList[index].recipes.push(Recipes.selectedRecipes[i].id);
            }

            // If item doesn't exist, add it to shopping list
            else {
              $scope.shoppingList.push({ name: Recipes.selectedRecipes[i].ingredients[j], qty:1,
               recipes:[Recipes.selectedRecipes[i].id] });
            
              // get and set price of most recently pushed ingredient object
              // (self calling function is required in order to update the correct index inside the promise)
              (function(index){
                Recipes.getIngredientPrice($scope.shoppingList[index]).then(function(price) {
                  $scope.shoppingList[index].price = price.data;

                  // Even though we just set the quantity to 1, this bit of code happens async,
                  // so by the time we get the price from the table, we've already updated the
                  // qty to reflect the total quantity of the list, so we just need to set the
                  // total price here
                  $scope.totalPrice += parseFloat(price.data) * $scope.shoppingList[index].qty;
                });
              })($scope.shoppingList.length-1)
            }
          }
        }
      }

      Recipes.selectedRecipes = [];
    };

    /* barcode feature begins */

    $scope.scanBarcode = function(ingredient, index) {
      console.log("Calls the controller barcode scanner function");
      // $scope.productUpc = ''; //save upc number as string later

      $(function() {
        var resultCollector = Quagga.ResultCollector.create({
          capture: true,
          capacity: 20,
          blacklist: [{code: "2167361334", format: "i2of5"}],
          filter: function(codeResult) {
              // only store results which match this constraint
              // e.g.: codeResult
            return true;
          }
        });
        var App = {
          //initialization function that sets up results collection, listeners and the video stream 
          init : function() {
            var self = this;

            Quagga.init({
              inputStream: {
              type : "LiveStream",
              constraints: {
                width: 640,
                height: 480,
                facing: "environment" // or user
              }
            },
            locator: {
              patchSize: "large",
              halfSample: true
            },
            numOfWorkers: 4,
            decoder: {
              readers : [ "upc_reader"]
            },
            locate: true
            }, function(err) {
              if (err) {
                return self.handleError(err);
              }
              Quagga.registerResultCollector(resultCollector);
              App.attachListeners();
              Quagga.start();
            });
          },
          handleError: function(err) {
            console.log(err);
          },
          attachListeners: function() {
            var self = this;
            $(".controls").on("click", "button.stop", function(e) {
              e.preventDefault();
              Quagga.stop();
              self._printCollectedResults();
            });
          },
          _printCollectedResults: function() {
            var results = resultCollector.getResults(),
                $ul = $("#result_strip ul.collector");

            //set scope var to the upc code to lookup price later
            results.forEach(function(result) {
              var $li = $('<li><div class="thumbnail"><div class="imgWrapper"><img /></div><div class="caption"><h4 class="code"></h4></div></div></li>');

              $li.find("img").attr("src", result.frame);
              $li.find("h4.code").html(result.codeResult.code + " (" + result.codeResult.format + ")");
              $ul.prepend($li);
            });
          },
          detachListeners: function() {
            $(".controls").off("click", "button.stop");
            $(".controls .reader-config-group").off("change", "input, select");
          },
          lastResult: null
        };

        App.init();

        Quagga.onProcessed(function(result) {
          var drawingCtx = Quagga.canvas.ctx.overlay,
            drawingCanvas = Quagga.canvas.dom.overlay;

          if (result) {
            if (result.boxes) {
              drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
              result.boxes.filter(function (box) {
                return box !== result.box;
              }).forEach(function (box) {
                Quagga.ImageDebug.drawPath(box, {x: 0, y: 1}, drawingCtx, {color: "green", lineWidth: 2});
              });
            }

            if (result.box) {
              Quagga.ImageDebug.drawPath(result.box, {x: 0, y: 1}, drawingCtx, {color: "#00F", lineWidth: 2});
            }

            if (result.codeResult && result.codeResult.code) {
              Quagga.ImageDebug.drawPath(result.line, {x: 'x', y: 'y'}, drawingCtx, {color: 'red', lineWidth: 3});
            }
          }
        });

        Quagga.onDetected(function(result) {
          var code = result.codeResult.code;
          console.log(code); 
          //add to scope
            $scope.productUpc = code.toString(); 
            console.log( "the scanned product is: ", $scope.productUpc);



          if (App.lastResult !== code) {
            App.lastResult = code;
            var $node = null, canvas = Quagga.canvas.dom.image;

            $node = $('<li><div class="thumbnail"><div class="imgWrapper"><img /></div><div class="caption"><h4 class="code"></h4></div></div></li>');
            $node.find("img").attr("src", canvas.toDataURL());
            $node.find("h4.code").html(code);
            $("#result_strip ul.thumbnails").prepend($node);
          }
        });

      });

    };

    $scope.scanModal = function(ingredient, prevPrice, index) {
      console.log("open modal call in controller");
      $("#scanBarcode").openModal();
      console.log(ingredient, prevPrice, index, " vars from html to scan modal")
      $scope.lookupIngredient = ingredient;
      $scope.lookupPrevPrice = prevPrice;
      $scope.lookupIndex = index;
      $scope.scanBarcode(ingredient, prevPrice, index);
    };

    $scope.stopScanner = function() {
      Quagga.stop();
    }

      //when UPC saved from the barcode scan, run (UPCa is our only use case) lookup on the server
      //get results from the model and populate the client price input field 
    $scope.lookupProduct = function() { // called after done. use only for stopping video
      Quagga.stop();
        //Call price lookup
      //test query
      // UpcLookup.productLookup();  
      // console.log($scope.productUpc, " upc in the client controller");
      UpcLookup.productLookup($scope.productUpc).then(function(data){
        //Update price field in scope
        console.log("the price fetched from the api is: ", data.data);
        $scope.lookupIngredient.price = data.data;
        var prevPrice = 0
        $scope.savePrice($scope.lookupIngredient, $scope.lookupPrevPrice, $scope.lookupIndex);
      })
    };

    /* barcode feature ends */

    $scope.savePrice = function(ingredient, prevPrice, index) {
      // for some reason this function is being called on page load, which is causing huge problems
      // such as unnecessary toasts and NaN problems. We just need to check if prevPrice is defined
      // to make sure the function isn't being run when it's not supposed to
      if(prevPrice) {
        if ($scope.checkPrice(index)) {
          $scope.totalPrice = parseFloat($scope.totalPrice) - parseFloat(prevPrice) + parseFloat(ingredient.price);
          Recipes.setIngredientPrice($scope.shoppingList[$scope.shoppingList.indexOf(ingredient)]);
        }
      }
    };

    $scope.addToFridge = function() {
      if ($scope.fridgeFlag) {
        Fridge.addList($scope.shoppingList).then(function(){
          // Show a message that confirms success and disable the button
          $('.fridgeButton').addClass('disabled');
          $scope.fridgeFlag = false;
        });
      }
    };

    $scope.saveList = function() {
      if ($scope.notSavedFlag) {
        SavedLists.saveList($scope.shoppingList, $scope.listName).then(function(){
          // Show a message that confirms success and disable the button
          $('.saveButton').addClass('disabled');
          $scope.notSavedFlag = false;
        });
        
      }
    };

    // When a quantity is changed, recalculate the price of that item
    $scope.updatePrice = function(index, prevPrice, prevQty) {
      var item = $scope.shoppingList[index];
      var price = item.price || prevPrice;
      var qty = parseFloat(item.qty);

      if (isNaN(qty)) {
        $scope.disableQty = true;
        $scope.disableButtons();
        Materialize.toast("Please enter a valid quantity", 4000);
      } else {
        $scope.totalPrice -= prevQty*price;
        $scope.totalPrice += qty*price;
        $scope.disableQty = false;
        $scope.enableButtons();
      }
    };

    $scope.populateList();
    
  }]);
