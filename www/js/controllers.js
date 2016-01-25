angular.module('instaConvert.controllers', ['ngStorage'])
.controller('HistoryCtrl', function($scope, $localStorage, $sessionStorage, $location, Conversions) {
  $scope.$storage = $localStorage.$default({
      history: [],
      settings_enableHistory: true
  });

  $scope.convert_from_history = function(conversion){
    Conversions.setCurrentConversion(conversion);
  };

  $scope.historyAvailable = function(){
    return ($scope.$storage.history !== undefined && $scope.$storage.history.length !==0);
  };

  $scope.historyEnabled = function(){
    return $scope.$storage.settings_enableHistory;
  };

})
.controller('DashCtrl', function($scope, Conversions) {
  $scope.conversions = Conversions.all();

  console.log("serrings loood");
  var deploy = new Ionic.Deploy();

  $scope.checkForUpdates = function(){
    //deploy.
    deploy.check().then(function(response) {
      if (response) {
        $scope.hasAppUpdate = true;
        // $scope.hasAppUpdateMsg = "Updates Available";
        $scope.downloadUpdate();
      }
      else{
        $scope.hasAppUpdate = false;
        // $scope.hasAppUpdateMsg = "No Updates Available";
      }
      console.log(response);
    }, function(error) {
      $scope.hasAppUpdate = false;
      // $scope.hasAppUpdateMsg = "Error Seeking Updates";
    });
  };

  $scope.downloadUpdate = function () {
    // Download the updates
    console.log("downloadingupdates");
    deploy.download().then(function() {
      // Extract the updates
      $scope.extractPackage();
      console.log("extracting pack")
    }, function(error) {
      // Error downloading the updates
    }, function(progress) {
      // Do something with the download progress
      console.log("Downloaded : "+progress+"%");
    });
  };

  $scope.extractPackage =function () {
    deploy.extract().then(function() {
      // Load the updated version
      //deploy.load();
      console.log("Loading..");
    }, function(error) {
      // Error extracting
    }, function(progress) {
      // Do something with the zip extraction progress
      console.log("Extracted : "+progress+"%");
    });
  };

})
.controller('ConvertCtrl', function($scope, $localStorage, $sessionStorage, $stateParams, Conversions, ConversionCalcs, Compute, $ionicAnalytics) {

  $scope.$storage = $localStorage.$default({
      history: [],
      settings_enableHistroy: true
  });

  $scope.init = function(){
    console.log("initing")
    console.log($stateParams);
    if($stateParams.history == "true"){
      console.log("from hist - true");
      $scope.conversion = Conversions.getCurrentConversion();
      $scope.recal = 0;
    }
    else{
      console.log("not from hist");
      $scope.conversion = Conversions.get($stateParams.id);
    }
  };

  $scope.prepare_form = function(attr, conv_unit){

    current_conv = $scope.conversion;
    current_conv_type = current_conv.id;
    current_conv_from = current_conv.from.id;
    current_conv_to = current_conv.to.id;

    conv_type_obj = ConversionCalcs.get(current_conv_type);
    conv_unit_obj = conv_type_obj[conv_unit];

    if(attr == 'min'){
      if(conv_unit_obj.min !== undefined)
        ret = conv_unit_obj.min
      else
        ret = 0;
    }
    else if(attr == 'max'){
      if(conv_unit_obj.max !== undefined)
        ret = conv_unit_obj.max
      else
        ret = 0;
    }
    else if(attr == 'step'){
      if(conv_unit_obj.step !== undefined)
        ret = conv_unit_obj.step
      else
        ret = 0;
    }
    else{
      ret = null;
    }
    return ret;
  }

  $scope.reCal = function(in_out) {

    // if(window.AdMob) {
    //   AdMob.showInterstitial();
    // }

    $scope.recal = 1;
    if($scope.conversion.type == "calibration"){
      $first = parseInt($scope.conversion.in.one);
      $two = parseInt($scope.conversion.in.two);

      $scope.conversion.out.one = $first;
      $scope.conversion.out.five = $two;

      var devt = (-1) * $first; //Compute.sign($first);
      var x = 0;
      var y = $two + devt;

      console.log("x0:"+$first+",y0:"+$two);
      console.log("x:"+x+",y:"+y);
      $scope.conversion.out.two = (.25 * (y-x)) + $first;
      $scope.conversion.out.three = (.50 * (y-x)) + $first;
      $scope.conversion.out.four = (.75 * (y-x)) + $first;
      
    }
    else{
      current_conversion_calc = ConversionCalcs.get($scope.conversion.id);

      if(in_out != 'out'){
        $scope.conversion.out = Compute.calc($scope.conversion, current_conversion_calc, 'in');
      }
      else{
        $scope.conversion.in = Compute.calc($scope.conversion, current_conversion_calc, 'out');
      }
    }

    $ionicAnalytics.track('Calc', $scope.conversion);

  };

  $scope.$on('$ionicView.beforeLeave', function(){ //save current conversion.
    conversion = angular.copy($scope.conversion);
    if(($stateParams.history != "true" || $scope.recal == 1) && $scope.$storage.settings_enableHistory && $scope.conversion.in !== undefined){
      $scope.$storage.history.push(conversion);
    }
  })

})
.controller('SettingsCtrl', function($scope, $localStorage, $sessionStorage, $stateParams, $ionicPopup, $cordovaInAppBrowser, $ionicAnalytics) {
  $scope.$storage = $localStorage.$default({
    history: [],
    settings_enableHistroy: true,
    update_autoUpdate: true,
    update_edgeUpdates: false,

  });

  console.log("serrings loood");
  var deploy = new Ionic.Deploy();

  // $scope.checkUpdateStatus = function(){

  // };

  $scope.checkForUpdates = function(){
    //deploy.
    deploy.check().then(function(response) {
      if (response) {
        $scope.hasAppUpdate = true;
        $scope.hasAppUpdateMsg = "Updates Available";
        $scope.downloadUpdate();
      }
      else{
        $scope.hasAppUpdate = false;
        $scope.hasAppUpdateMsg = "No Updates Available";
      }
    }, function(error) {
      $scope.hasAppUpdate = false;
      $scope.hasAppUpdateMsg = "Error Seeking Updates";
    });
  };

  $scope.downloadUpdate = function () {
    // Download the updates
    deploy.download().then(function() {
      // Extract the updates
      $scope.extractPackage();
      console.log("extracting pack")
    }, function(error) {
      // Error downloading the updates
    }, function(progress) {
      // Do something with the download progress
      //console.log("Downloaded : "+progress+"%");
    });
  };

  $scope.extractPackage =function () {
    deploy.extract().then(function() {
      // Load the updated version
      //deploy.load();
      //console.log("Loading..");
    }, function(error) {
      // Error extracting
    }, function(progress) {
      // Do something with the zip extraction progress
      //console.log("Extracted : "+progress+"%");
    });
  };

  // A confirm dialog
  $scope.showConfirmReceiveEarlyUpdates = function(enable_disable) {
    if(enable_disable == true){
      var confirmPopup = $ionicPopup.confirm({
        title: 'Clear History',
        template: 'Are you sure you want to receive early updates?'
      });
      confirmPopup.then(function(res) {
        if(res) {
          $ionicAnalytics.track('Early-Updaes', {
            action: res
          });
          $scope.$storage.update_edgeUpdates = true;
        }
        else{
          $ionicAnalytics.track('Early-Updaes', {
            action: res
          });
          $scope.$storage.update_edgeUpdates = false;
        }
      });
    }
    else{
      var confirmPopup = $ionicPopup.confirm({
        title: 'Clear History',
        template: 'Are you sure you want to disable early updates?'
      });
      confirmPopup.then(function(res) {
        if(res) {
          $ionicAnalytics.track('Early-Updaes', {
            action: res
          });
          $scope.$storage.update_edgeUpdates = false;
        }
        else{
          $ionicAnalytics.track('Early-Updaes', {
            action: res
          });
          $scope.$storage.update_edgeUpdates = true;
        }
      });
    }
  };

  // A confirm dialog
  $scope.showConfirmDeleteHistory = function() {
    var confirmPopup = $ionicPopup.confirm({
      title: 'Clear History',
      template: 'Are you sure you want to clear history?'
    });
    confirmPopup.then(function(res) {
      history_len = $scope.$storage.history.length;
      if(res) {
        $scope.$storage.history = [];
        $ionicAnalytics.track('Delete-History', {
          count: history_len,  
          action: res
        });
      }
      else{
        $ionicAnalytics.track('Delete-History', {
          count: history_len,  
          action: res
        });
      }
    });
  };

  $scope.openInBrowser = function(url, target){
    $cordovaInAppBrowser.open(url, target)
    .then(function(event) {
      // success
    })
    .catch(function(event) {
      // error
    });

    $ionicAnalytics.track('Open-External', {
      url: url
    });
  };

});
