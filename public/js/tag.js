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

	.controller('TaginfoCtrl', ['$http', '$scope', function($http, $scope) {

		var paths = location.pathname.split('/');

		$scope.data = {
			isNew: false,
			canEdit: false,
			tag: paths[paths.length - 1],
			abstract: "add abstract",
			intro: "add introduction"
		};

		$http.get('/getTag/' + paths[paths.length - 1]).success(function(data) {
			if (data) {
				console.log(data);
				$scope.data = data;
			};
		})

		$scope.startEdit = false;

		$scope.isActive = false;

		$scope.editText = "edit";

		$scope.saveText = "save";

		$scope.isSaved = false;

		$scope.enableEdit = function() {
			if (!$scope.startEdit) {
				$scope.isActive = true;
				$scope.startEdit = true;
				$scope.editText = "editing";
				var editor = new Minislate.simpleEditor(document.getElementById('tag-intro'));
			};
		};

		$scope.save = function() {
			if (document.getElementById('tag-name').innerHTML.trim() == "new") {
				alert("Please change the tag name before save;")
				return null;
			};

			$scope.isSaved = true;

			var tagInfo = {
				tag: $scope.data.isNew ? document.getElementById('tag-name').innerHTML : $scope.data.tag,
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
					},
					xhrFields: {
						withCredentials: true
					}
				})
				.success(function(data) {
					if (!data.success) {
						$scope.saveText = "not saved";
					} else {
						//dynamic change the title
						var url = window.location.href,
							nowPath = url.split("/"),
							newUrl = url.replace(nowPath[nowPath.length - 1], tagInfo.tag);
						history.pushState('', tagInfo.tag, newUrl);
						var d = new Date();
						$scope.saveText = "saved at " + d.getHours() + ":" + (d.getMinutes() < 10 ? '0' : "") + d.getMinutes();
					}
				});

		}

	}])

	.filter('unsafe', function($sce) {
		return $sce.trustAsHtml;
	});

})()