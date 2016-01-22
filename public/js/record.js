(function() {

	angular.module('platform-record', [])

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

	.controller('RecordCtrl', ['$http','$scope', function($http,$scope) {
		$scope.variables = [];
		$scope.classType = ["success", "primary", "warning"];
		$scope.counter = 0;

		$scope.removeVariable = function(index) {
			for (var i = 0; i < $scope.variables.length; i++) {
				if ($scope.variables[i].index == index) {
					$scope.variables.splice(i, 1);
				}
			};
			document.getElementById('variable-label' + index).remove();
		}

		$scope.insertVariable = function(isHidden) {
			document.getElementById('record-editor').focus();
			$scope.counter += 1;
			this.variables.push({
				type: 1,
				index: $scope.counter,
				val: "",
				isHidden: isHidden
			})
			if (isHidden!=1) {		
				replaceSelectionWithHtml("&nbsp;<span class='label label-success noselect' contenteditable='false' id='variable-label" + $scope.counter + "'>a" + $scope.counter + "</span>&nbsp;");		
			};
			//jquery involved
			$('.collapse').removeClass('in');
			setTimeout(function() {
				$('[data-variable]').unbind('click').click(function(event) {
					var labelClass = $scope.classType[parseInt($(this).attr('data-checked')) - 1];
					$('#variable-label' + $(this).attr('data-variable')).attr('class', 'label label-' + labelClass);
					index = parseInt($(this).attr('data-variable'));
					var a = $('#collapse' + index + " input").eq(2).val().replace(/\s/g, ""),
						b = $('#collapse' + index + " input").eq(3).val().replace(/\s/g, "");
					setTimeout(function() {
						if (a != "" && b != "") {
							if ($('#collapse' + index + " input").eq(0).parent().hasClass('active')) {
								$('#formula-line' + index).find('input').val("RandomPackage.randomNum(" + a + "," + b + ");");
							} else {
								$('#formula-line' + index).find('input').val("RandomPackage.randomFloat(" + a + "," + b + ");");
							}
						};
					}, 20);
				});
			}, 20);
		}

		$scope.updateFormula = function(index) {
			var inputs = document.getElementById('collapse' + index).getElementsByTagName('input'),
				a = inputs[2].value.replace(/\s/g, ""),
				b = inputs[3].value.replace(/\s/g, "");
			if (a != "" && b != "") {
				var variableType = inputs[0].value == "1" ? "Num" : "Float";
				document.getElementById('formula-line' + index).getElementsByTagName('input')[0].value = "RandomPackage.random" + variableType + "(" + a + "," + b + ");";
			};
		}

		$scope.editTitle = function() {
			document.getElementById('record-title-edit').focus();
		}

		$scope.tagConfirm = function() {
			tagsHtml = "", tags = document.getElementById('tag-input').value.split(";");
			for (var i = tags.length - 1; i >= 0; i--) {
				if (tags[i].trim() != "") {
					tagsHtml = '<a class="tag-link" href="#' + tags[i].trim() + '">' + tags[i].trim() + "</a>" + tagsHtml;
				};
			};
			document.getElementById('tag-container').innerHTML = tagsHtml;
		}

		$scope.deleteLabel = function() {
			//jquery involved
			$("#record-editor").on("input", function() {
				for (var i = 0; i < $('[data-panel-variable]').length; i++) {
					if ($('#variable-label' + $('[data-panel-variable]').eq(i).attr('data-panel-variable')).text() != "") {} else {
						$scope.variables.splice(i, 1);
						$scope.$apply();
					}
				};
			});
		}

		$scope.deleteLabel();
		
		$scope.addFormula = function () {		
			$('#add-formula').parent().before('<li><span></span><input type="text"></li>');		
		}		
				
		// $scope.addFormula2 = function () {		
		// 	$('#add-formula2').parent().before('<li><span></span><input type="text"></li>');		
		// }

		$scope.submit = function() {
			var doneVariables = [],
				generators = [],
				options = [];
			var editor=$('#record-editor').clone();
			editor.find('div').remove();
			for (var i = 0; i < $scope.variables.length; i++) {
				doneVariables.push(($scope.variables[i].type == 1 ? "integer" : "floating") + " a" + $scope.variables[i].index)
			};
			for (var i = 0; i < $('#formula-container1 li').length - 1; i++) {
				generators.push($('#formula-container1 li').eq(i).find('input').val());
			};
			for (var i = 0; i < $('#optionModal input').length; i++) {
				options.push($('#optionModal input').eq(i).val());
			};
			var recordData = {
				"TITLE": $('#record-title-edit').text(),
				"TAGS": $('#tag-input').val().split(";"),
				"PROBLEM": {
					"VARIABLE": doneVariables,
					"GENERATOR": generators,
					"BODY": editor.html().replace(/<[^>]*>/g, '$').replace(/&nbsp;/g,''),
					"ANSWER": $('#answer-textarea').val()
				},
				"ORIGINAL_PROBLEM": $('#origin-textarea').val(),
				"OPTION": options,
				"CODE": $('#codeModal textarea').val(),
				"TYPE": 1
			};
			console.log(recordData);
			// $http({
			// 		method: 'POST',
			// 		url: 'recordProcess', // to be changed
			// 		data: $.param(recordData), // pass in data as strings
			// 		headers: {
			// 			'Content-Type': 'application/x-www-form-urlencoded'
			// 		} // set the headers so angular passing info as form data (not request payload)
			// 	})
			// 	.success(function(data) {

			// 		// dosomething with the data?

			// 	});
		}

	}]);

})()

// utility functions
jQuery(document).ready(function($) {
	$('[data-toggle="tooltip"]').tooltip();
});

function replaceSelectionWithHtml(html) {
	var range, html;
	if (window.getSelection && window.getSelection().getRangeAt) {
		range = window.getSelection().getRangeAt(0);
		range.deleteContents();
		var div = document.createElement("div");
		div.innerHTML = html;
		var frag = document.createDocumentFragment(),
			child;
		while ((child = div.firstChild)) {
			frag.appendChild(child);
		}
		range.insertNode(frag);
	} else if (document.selection && document.selection.createRange) {
		range = document.selection.createRange();
		range.pasteHTML(html);
	}
}

function setSelectionRange(input, selectionStart, selectionEnd) {
	if (input.setSelectionRange) {
		input.focus();
		input.setSelectionRange(selectionStart, selectionEnd);
	} else if (input.createTextRange) {
		var range = input.createTextRange();
		range.collapse(true);
		range.moveEnd('character', selectionEnd);
		range.moveStart('character', selectionStart);
		range.select();
	} else if ('selectionStart' in this) {
		this.selectionStart = selectionStart;
		this.selectionEnd = selectionEnd;
	}
}