var CustomActionBox = (function(CAB){
	var defaultActionConfig = {
		enabled: true,
		gridId: 'grid',
		permissionSystem: true,
		dropDownFieldName: "action",
		dropDownTitle: "Action (s)",
		dropDownOptionClickClass: "customDropDownOption",
		dropDownOptionAddClass: "miscTestClass",
		noOptionsClass: "noOptions"
	};
	var __columnsettings = [
		{key: "filterable",	value: false},
		{key: "sortable",	value: false},
		{key: "encoded",	value: false},
		{key: "template",	value: "<div class='dropDownSelectorDiv#:CustomActionBox.checkForOptions(kendo.toString(uid))#' data-record-id='#=uniqueId#' style='position:relative;'>Action:<span unselectable='on' class='pull-right k-icon k-i-arrow-s'></span></div>"}
	];

	CAB.init = function(customActionConfig, columnsettings){
		CAB.actionConfig = $.extend(true, {}, defaultActionConfig, customActionConfig);

		addConditionProperties();
		columnsettings = addPrivateColumnSettings(columnsettings);
		attachEventListeners();

		return columnsettings;
	};
	CAB.isOpen = false;

	function addConditionProperties(){
		$.each(CAB.actionConfig.dropOptions, function(index, value){
			CAB.actionConfig.dropOptions[index].condition = '#=kendo.toString('+value.field+')#';
		});
	}
	function createActionObject(){
		$.each(CAB.actionConfig.dropOptions, function(index, value){
			console.log('action.name');
			CAB.actionObject[value.action.name+''] = value.action;
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
		$(document).on('click', 'div.dropDownSelectorDiv', function(event){
			event.stopPropagation();
			if($(this).hasClass('openedDropDown')){
				$('div.openedDropDown').removeClass('openedDropDown');
				CAB.isOpen = false;
				$('#dropDownContainerDiv').remove();
			}else{
				generateDynamicOptions($(this));
				sizeAndPositionDropDown();
				markOpenedSelector($(this));
			}
		});
		$(document).on('click', function(event){
			//if(!$(this).hasClass('dropDownSelectorDiv') || !$(this).attr('id') === 'dropDownContainerDiv'){
			if(CAB.isOpen === true){
				$('div.openedDropDown').removeClass('openedDropDown');
				CAB.isOpen = false;
				$('#dropDownContainerDiv').remove();
			}
		})
		$(document).on('click', '.'+CAB.actionConfig.dropDownOptionClickClass, function(event){
			event.stopPropagation();
			var uid = $(event.target).closest('tr').attr('data-uid');
			var dataAction = $(this).attr('data-drop-action');

			CAB.actionConfig.dropOptions[Number(dataAction, 10)].action(uid);
		});
	}
	function markOpenedSelector(dropDownSelector){
		$('div.openedDropDown').removeClass('openedDropDown');
		dropDownSelector.addClass('openedDropDown');
		CAB.isOpen = true;
	}
	function sizeAndPositionDropDown(){
		var dropDownContainer = $('#dropDownContainerDiv');
		var dropDownSelectorHeight = dropDownContainer.parent().find('div.dropDownSelectorDiv').outerWidth();

		dropDownContainer.css({
			width: dropDownSelectorHeight+3,
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

		if($('#dropDownContainerDiv').length > 0){
			$('#dropDownContainerDiv').remove();
		}

		dropDownContainer = $('<div></div>', {
			id: 'dropDownContainerDiv',
			style: 'position:absolute;display:none;top:"0px";left:"0px";'
		});

		dropDownClasses = CAB.actionConfig.dropDownOptionClickClass;
		if(CAB.actionConfig.dropDownOptionAddClass.length > 0){
			dropDownClasses += ' '+CAB.actionConfig.dropDownOptionAddClass;
		}

		dataView = $('#'+CAB.actionConfig.gridId).data('kendoGrid').dataSource.view();

		$.each(dataView, function(index, value){
			if(value.hasOwnProperty('uid') && value.uid === uid){
				$.each(CAB.actionConfig.dropOptions, function(index2, value2){
					if(CAB.actionConfig.permissionSystem === true && value[value2.field].toString() === 'true'){
						dropDownOptionString += '<div class="'+dropDownClasses+'" data-drop-action="'+index2+'">'+value2.title+'</div>';
					}else if(CAB.actionConfig.permissionSystem === false){
						dropDownOptionString += '<div class="'+dropDownClasses+'" data-drop-action="'+index2+'">'+value2.title+'</div>';
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
	function addPrivateColumnSettings(columnsettings){
		var numPrivateSettings = __columnsettings.length;
		var i;
		var alreadyExists = false;

		//add the __columnsettings to the columnsettings element which has a field of customActionConfig.actionFieldName
		$.each(columnsettings, function(index, value){
			if(value.hasOwnProperty('field') && value.field === CAB.actionConfig.dropDownFieldName){
				alreadyExists = true;
				for(i = 0; i < numPrivateSettings; i += 1){
					value[__columnsettings[i].key] = __columnsettings[i].value;
				}
			}
		});
		//if the columnsettings does NOT already have a field with name: CAB.actionConfig.dropDownFieldName, then add it with some defaults
		if(alreadyExists === false){
			columnsettings.push({
				field: CAB.actionConfig.dropDownFieldName,
				title: CAB.actionConfig.dropDownTitle
			});
			for(i = 0; i < numPrivateSettings; i += 1){
				columnsettings[__columnsettings[i].key] = __columnsettings[i].value;
			}
		}
		return columnsettings;
	}

	return CAB;
}(CustomActionBox || {}));