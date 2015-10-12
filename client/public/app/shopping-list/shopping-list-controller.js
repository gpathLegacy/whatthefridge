angular.module('wtf.shopping-list', [])
  .controller('ShoppingListController', ["$scope", "$window", "$location", "Recipes", "Fridge", "SavedLists", function($scope, $window, $location, Recipes, Fridge, SavedLists) {

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

      Recipes.selectedRecipes = [];
    };

    /* barcode feature begins */

    $scope.scanBarcode = function() {
      console.log("Calls the controller barcode scanner function");
      //open model which makes a call to Quagga
      //goes back to the shopping list view

      //Quagga functions run onscan click
      $(function() {
        var App = {
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
          //initialization function that sets up results collection, listeners and the video stream 
          init : function() {
            var self = this;

            Quagga.init(this.state, function(err) {
              if (err) {
                return self.handleError(err);
              }
              Quagga.registerResultCollector(resultCollector);
              App.attachListeners();
              Quagga.start();
            });
          },
          handleError : function() {
            console.log(err);
          },
          attachListeners : function() {
            var self = this;

            $(".controls").on("click", "button.stop", function(e) {
              e.preventDefault();
              Quagga.stop();
              self._printCollectedResults();
            });

            $(".controls .reader-config-group").on("change", "input, select", function(e) {
              e.preventDefault();
              var $target = $(e.target),
                value = $target.attr("type") === "checkbox" ? $target.prop("checked") : $target.val(),
                name = $target.attr("name"),
                state = self._convertNameToState(name);

              console.log("Value of "+ state + " changed to " + value);
              self.setState(state, value);
            });
          },
          _printCollectedResults: function() {
            var results = resultCollector.getResults(),
              $ul = $("#result_strip ul.collector");

            results.forEach(function(result) {
              var $li = $('<li><div class="thumbnail"><div class="imgWrapper"><img /></div><div class="caption"><h4 class="code"></h4></div></div></li>');

              $li.find("img").attr("src", result.frame);
              $li.find("h4.code").html(result.codeResult.code + " (" + result.codeResult.format + ")");
              $ul.prepend($li);
            });
          },
          _accessByPath: function(obj, path, val) {
            var parts = path.split('.'),
              depth = parts.length,
              setter = (typeof val !== "undefined") ? true : false;

            return parts.reduce(function(o, key, i) {
              if (setter && (i + 1) === depth) {
                  o[key] = val;
              }
              return key in o ? o[key] : {};
            }, obj);
          },
          _convertNameToState: function(name) {
            return name.replace("_", ".").split("-").reduce(function(result, value) {
              return result + value.charAt(0).toUpperCase() + value.substring(1);
            });
          },
          detachListeners: function() {
            $(".controls").off("click", "button.stop");
            $(".controls .reader-config-group").off("change", "input, select");
          },
          setState: function(path, value) {
            var self = this;

            if (typeof self._accessByPath(self.inputMapper, path) === "function") {
              value = self._accessByPath(self.inputMapper, path)(value);
            }

            self._accessByPath(self.state, path, value);

            console.log(JSON.stringify(self.state));
            App.detachListeners();
            Quagga.stop();
            App.init();
          },
          inputMapper: {
            inputStream: {
              constraints: function(value){
                var values = value.split('x');
                return {
                  width: parseInt(values[0]),
                  height: parseInt(values[1]),
                  facing: "environment"
                }
              }
            },
            numOfWorkers: function(value) {
              return parseInt(value);
            },
            decoder: {
              readers: function(value) {
                  return [value + "_reader"];
              }
            }
          },
          state: {
              inputStream: {
                type : "LiveStream",
                constraints: {
                  width: 640,
                  height: 480,
                  facing: "environment" // or user
                }
              },
              locator: {
                patchSize: "medium",
                halfSample: true
              },
              numOfWorkers: 4,
              decoder: {
                readers : [ "code_128_reader"]
              },
              locate: true
          },
          lastResult: null

        };
        App.init();
      });

    };

    $scope.lookupProductDetails = function() {
      ///Quagga Process
      //when UPC saved from the barcode scan, run (UPCa is our only use case) lookup on the server

      //get results from the model and populate the client price input field 
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
