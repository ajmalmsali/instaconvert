angular.module('instaConvert', ['ngCordova', 'ionic', 'ionic.service.core', 'ionic.service.analytics', 'instaConvert.controllers', 'instaConvert.services'])
.run(function($ionicPlatform, $ionicAnalytics) {
  $ionicPlatform.ready(function() {
    $ionicAnalytics.register();
  });
})
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})
.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:
  .state('tab.history', {
    url: '/history',
    views: {
      'tab-history': {
        templateUrl: 'templates/tab-history.html',
        controller: 'HistoryCtrl'
      }
    }
  })

  .state('tab.history-convert', {
    url: '/history-convert/:type/:id/:history',
    views: {
      'tab-history': {
        templateUrl: function ($stateParams){
          console.log($stateParams);
           return 'templates/' + $stateParams.type + '.html';
         },
        controller: 'ConvertCtrl'
      }
    }
  })

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('tab.convert', {
    url: '/convert/:type/:id/:history',
    views: {
      'tab-dash': {
        templateUrl: function ($stateParams){
          console.log($stateParams);
           return 'templates/' + $stateParams.type + '.html';
         },
        controller: 'ConvertCtrl'
      }
    }
  })

  .state('tab.settings', {
    url: '/settings',
    views: {
      'tab-settings': {
        templateUrl: 'templates/tab-settings.html',
        controller: 'SettingsCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/dash');
});