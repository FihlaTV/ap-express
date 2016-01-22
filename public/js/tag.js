(function() {

	angular.module('platform-list', [])

	.directive('navBar', [function() {
		return {
			restrict: 'E',
			templateUrl: "../nav.html",
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

	.controller('TaginfoCtrl', ['$http','$scope', function($http, $scope) {

		var paths = location.pathname.split('/');

		$scope.data = {
			canEdit: false,
			tag: paths[ paths.length-1 ],
			abstract: "add abstract",
			intro: "add introduction"
		};

		$http.get('/getTag/'+paths[ paths.length-1 ]).success(function(data) {
			if (data) {
				console.log(data)
				$scope.data = data;
			};
		})

		$scope.startEdit = false;

		$scope.isActive = false;

		$scope.editText = "edit";

		$scope.saveText = "save";

		$scope.isSaved = false;

		$scope.enableEdit = function() {
			$scope.isActive = true;
			$scope.startEdit = true;
			$scope.editText = "editing";
		};

		$scope.save = function() {
			$scope.isSaved = true;

			var tagInfo = {
				tag: document.getElementById('tag-name').innerHTML,
				abstract: document.getElementById('tag-abstract').innerHTML,
				intro: document.getElementById('tag-intro').innerHTML,
			};

			// to be removed

			// var d = new Date();
			// $scope.saveText = "saved at " + d.getHours() + ":"+(d.getMinutes()<10?'0':"")+ d.getMinutes();

			// replaced with
			$http({
					method: 'POST',
					url: '/saveTag', 
					data: $.param(tagInfo), 
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					} 
				})
				.success(function(data) {
					if (!data.success) {
						$scope.saveText = "not saved";
					} else {
						var d = new Date();
						$scope.saveText = "saved at " + d.getHours() + ":" + (d.getMinutes()<10?'0':"")+ d.getMinutes();
					}
				});

		}

	}])

	.filter('unsafe', function($sce) {
		return $sce.trustAsHtml;
	})

})()

// not sure why those error messages on console, although it doesn't affect the way it works.
jQuery(document).ready(function($) {
	$('[data-toggle="tooltip"]').tooltip();
	$('#editing').one('click', function(event) {
		var editor = new Minislate.simpleEditor(document.getElementById('tag-intro'));
	});
});