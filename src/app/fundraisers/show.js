'use strict';

angular.module('fundraisers').controller('FundraiserShowController', function ($scope, $routeParams, $location, $window, $api, $sanitize, $pageTitle) {
  // $sanitize but allow iframes (i.e. youtube videos)
  $scope.fundraiserPromise.then(function(fundraiser) {

    if (fundraiser.error) {
      // API returns error if you are not authorized to view it (it hasn't been published)
      // Just redirect to the index page
      $location.url('/fundraisers').replace();
    } else {
      $pageTitle.set(fundraiser.title, 'Fundraisers');

      if (fundraiser.trackers) {
        $scope.linked_tracker = fundraiser.trackers[0];
      }

      $scope.sanitized_description = "";
      if (fundraiser.description_html) {
        var html = fundraiser.description_html;
        var matches = html.match(/<iframe[^>]+><\/iframe>/g) || [];
        for (var i=0; i < matches.length; i++) {
          html = html.replace(matches[i], '{{iframe:'+i+'}}');
        }
        html = $sanitize(html);
        for (i=0; i < matches.length; i++) {
          html = html.replace('{{iframe:'+i+'}}', matches[i]);
        }
        $scope.sanitized_description = html;
      }

      $scope.fundraiser = fundraiser;
      return fundraiser;
    }
  });
});
