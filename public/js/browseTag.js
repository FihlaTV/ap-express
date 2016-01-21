(function() {

	angular.module('platform-browseTag', ['angular.filter'])

	.directive('navBar', [function() {
		return {
			restrict: 'E',
			templateUrl: "nav.html",
			// controlerAs:"nav", 
			controller: ['$scope', function($scope) {
				//pass links throught json
				$scope.links = {
					home: "index.html",
					other: "other.html",
					login: "login.html",
				}
			}],
		};
	}])

	.controller('BrowseTagCtrl', ['$scope', function($scope) {
		// get initial questions
		// $scope.tags=[];
		// $http.get('/browseTag.json').success(function(data) {
		// 	$scope.questions=data.tags; 
		// 	$scope.$apply();
		// })
		$scope.tags = [{
			name: "JavaScript",
			abstract: "JavaScript (not to be confused with Java) is a dynamic, weakly-typed language used for client-side as well as server-side...",
			link: "tag.html",
		}, {
			name: "Java",
			abstract: "JavaScript (not to be confused with Java) is a dynamic, weakly-typed language used for client-side as well as server-side...",
			link: "tag.html",
		}, {
			name: "C#",
			abstract: "JavaScript (not to be confused with Java) is a dynamic, weakly-typed language used for client-side as well as server-side...",
			link: "tag.html",
		}, {
			name: "Php",
			abstract: "JavaScript (not to be confused with Java) is a dynamic, weakly-typed language used for client-side as well as server-side...",
			link: "tag.html",
		}, {
			name: "Jquery",
			abstract: "JavaScript (not to be confused with Java) is a dynamic, weakly-typed language used for client-side as well as server-side...",
			link: "tag.html",
		}, {
			name: "python",
			abstract: "JavaScript (not to be confused with Java) is a dynamic, weakly-typed language used for client-side as well as server-side...",
			link: "tag.html",
		}]
	}])

})()