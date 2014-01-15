var CustomActionBox = (function(CAB){
	var defaultActionConfig = {
		enabled: true,
		gridId: 'grid',
		permissionSystem: true,
		dropDownFieldName: "action",
		dropDownOptionClickClass: "customDropDownOption",
		dropDownOptionAddClass: "miscTestClass",
		noOptionsClass: "noOptions"
	};
	var __columnsettings = [
		{key: "filterable",	value: false},
		{key: "sortable",	value: false},
		{key: "encoded",	value: false},
		{key: "template",	value: "<div class='dropDownSelector#:CustomActionBox.checkForOptions(kendo.toString(uid))#' style='position:relative;'>Action:</div>"}
	];

	CAB.init = function(customActionConfig){
		CAB.actionConfig = $.extend(true, {}, defaultActionConfig, customActionConfig);

		addConditionProperties();
		addPrivateColumnSettings();
		attachEventListeners();
	};

	function addConditionProperties(){
		$.each(CAB.actionConfig.dropOptions, function(index, value){
			CAB.actionConfig.dropOptions[index].condition = '#=kendo.toString('+value.field+')#';
		});
	}

	CAB.checkForOptions = function(uid){
		var dataRecord;
		var numOptions = 0;
		var response;

		if(CAB.actionConfig.permissionSystem === true){
			dataRecord = $('#'+CAB.actionConfig.gridId).data('kendoGrid').dataSource.get(uid);

			$.each(CAB.actionConfig.dropOptions, function(key, value){
				if(dataRecord[value.field].toString() === 'true'){
					numOptions += 1;
				}
			});

			if(numOptions === 0){
				response = ' '+CAB.actionConfig.noOptionsClass;
			}else{
				response = "";
			}
		}else{
			response = "";
		}

		return response;
	};
	function attachEventListeners(){
		$(document).on('click', 'div.dropDownSelector', function(event){
			event.stopPropagation();
			generateDynamicOptions($(this));
			sizeAndPositionDropDown();
		});
		$(document).on('click', '.'+CAB.actionConfig.dropDownOptionClickClass, function(event){
			var uid = $(event.target).closest('tr').attr('data-uid');
			var dataAction = $(this).attr('data-action');

			window[dataAction](uid);
		});
	}
	function sizeAndPositionDropDown(){
		var dropDownContainer = $('#dropDownContainer');
		var dropDownSelectorHeight = dropDownContainer.parent().find('div.dropDownSelector').width();

		dropDownContainer.css({
			width: dropDownSelectorHeight,
			backgroundColor: 'white',
			zIndex:100
		});
		dropDownContainer.show();
	}
	function generateDynamicOptions(dropDownSelector){
		var dropDownContainer;
		var uid					= dropDownSelector.closest('tr').attr('data-uid');
		var dataView;
		var numOptions;

		var dropDownOptionString = "";
		var dropDownClasses;
		var dropDownContainer;

		if($('#dropDownContainer').length > 0){
			$('#dropDownContainer').remove();
		}

		dropDownContainer = $('<div></div>', {
			id: 'dropDownContainer',
			style: 'position:absolute;display:none;top:"0px";left:"0px";'
			});

		dropDownClasses = CAB.actionConfig.dropDownOptionClickClass;
		if(CAB.actionConfig.dropDownOptionAddClass.length > 0){
			dropDownClasses += ' '+CAB.actionConfig.dropDownOptionAddClass;
		}

		dataView = $('#'+CAB.actionConfig.gridId).data('kendoGrid').dataSource.view();

		$.each(dataView, function(index, value){
			if(value.hasOwnProperty('uid') && value.uid === uid){
				$.each(CAB.actionConfig.dropOptions, function(key, value2){
					if(CAB.actionConfig.permissionSystem === true && value[value2.field].toString() === 'true'){
						dropDownOptionString += '<div class="'+dropDownClasses+'" data-action="'+value2.action+'">'+value2.title+'</div>';
					}else if(value[value2.field].toString() === 'true'){
						dropDownOptionString += '<div class="'+dropDownClasses+'" data-action="'+value2.action+'">'+value2.title+'</div>';
					}
				});
			}
		});

		//if there are options then add them
		if(dropDownOptionString.length > 0){
			dropDownContainer.append(dropDownOptionString);
			dropDownSelector.parent().append(dropDownContainer);
		}
	}
	function addPrivateColumnSettings(){
		var numPrivateSettings = __columnsettings.length;
		var i;

		//add the __columnsettings to the columnsettings element which has a field of customActionConfig.actionFieldName
		//These properties must be added for the drop down box to work properly and cannot be over ridden.
		$.each(columnsettings, function(index, value){
			if(value.hasOwnProperty('field') && value.field === CAB.actionConfig.dropDownFieldName){
				for(i = 0; i < numPrivateSettings; i += 1){
					value[__columnsettings[i].key] = __columnsettings[i].value;
				}
			}
		});
	}

	return CAB;
}(CustomActionBox || {}));