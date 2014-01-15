var KAPI = (function(KAPI){
	"use strict";

	//private vars
	var grids = [];

	//namespaced vars
	KAPI.colSettingsLoaded = false;
	KAPI.dataSourceLoaded = false;
	KAPI.checkResourcesLoaded = function(){
		if(KAPI.colSettingsLoaded === true && KAPI.dataSourceLoaded === true){
			KAPI.grid.get(0).gridConfig.columns = JSON.parse(columnsettings);
			PAPI.completePageLoad();
		}
	};
	KAPI.fetchDataSource = function(dataUrl, gridIndex){
		var data;

		$.ajax({
			url: dataUrl,
			type: 'GET',
			dataType: 'json',
			success: function(response){
				console.log('success');
				console.log(response);

				if(response.hasOwnProperty('status') && response.status === 'success'){
					if(response.hasOwnProperty('data')){
						data = PAPI.kapiConfig.dataParser(response.data, gridIndex);
						KAPI.grid.setData(gridIndex, data);
					}else{
						console.log('error 13558');
					}
					if(response.hasOwnProperty('userSettings')){
						grids[gridIndex].userSettings = response.userSettings;
					}

					$.event.trigger({
						type: 'dataSourceLoaded'
					});
				}else{
					PAPI.removeLoadingElement();
					$('#grid').append('<div class="text-center">No Records Found</div>');
				}
			},
			error: function(data){
				console.log('error');
				console.log(data);
				PAPI.removeLoadingElement();
				alert('There was a connection issue.');
			}
		});
	};
	KAPI.grid = {
		dataConfig: {
			data: [],
			schema: {
				model: {
					id: "uid",
					fields: {
					}
				}
			},
			sort: {
				field: "",
				dir: "desc"
			},
			pageSize: 50
		},
		gridConfig: {
			scrollable: true,
			reorderable: true,
			resizable: true,
			pageable: {
				refresh: true,
				pageSizes: [50,100,200]
			},
			columns: [],
			schema: {
				model: {
					fields: {
					}
				}
			},
			filterable: {
				extra: false,
				operators: {
					string: {
						contains: "Contains",
						startswith: "Starts with"
					},
					number: {
						lt: "Is less than",
						eq: "Is equal to",
						gt: "Is greater than"
					},
					date: {
						lt: "Is less than",
						eq: "Is equal to",
						gt: "Is greater than"
					}
				}
			},
			sortable: {
				mode: "single",
				allowUnsort: false
			},
			dataBound: PAPI.onDataBound,
			columnResize: function(e) {
				$('input[value="Save Settings"]').trigger('settingsNotificationAdded');
			},
			columnReorder: function(e) {
				$('input[value="Save Settings"]').trigger('settingsNotificationAdded');
			},
			columnHide: function(e) {
				$('input[value="Save Settings"]').trigger('settingsNotificationAdded');
			},
			columnShow: function(e) {
				$('input[value="Save Settings"]').trigger('settingsNotificationAdded');
			}
		},
		create: function(gridId, userGridConfig, userDataConfig, userSettings){
			var dataSource;

			if(userGridConfig === undefined || userGridConfig === null){userGridConfig = {};}
			if(userDataConfig === undefined || userDataConfig === null){userDataConfig = {};}
			if(userSettings === undefined || userSettings === null){userSettings = {};}
			if(gridId === undefined){gridId = "grid";}

			grids.push({
				gridConfig: $.extend(true, {}, KAPI.grid.gridConfig, userGridConfig),
				dataConfig: $.extend(true, {}, KAPI.grid.dataConfig, userDataConfig),
				dataSource: dataSource,
				userSettings: userSettings,
				elementId: gridId
			});

			return grids[grids.length-1];
		},
		get: function(index){
			var result;
			if(typeof index === 'number'){
				result = grids[index];
			}else if(typeof index === 'string'){
				$.each(grids, function(index2, value){
					if(value.elementId === index){
						result = grids[index2];
					}
				});
			}else {
				result = grids;
			}
			return result;
		},
		setData: function(gridIndex, userData, userConfig){//userConfig is array of data or kendo config object
			var dataSource;
			var config;

			if(userConfig === undefined || userConfig === 'undefined' || userConfig === null){
				userConfig = {};
			}


			config 		= $.extend(true, {}, KAPI.grid.dataConfig, grids[gridIndex].dataConfig, userConfig);//maybe there were defaults set during create
			config.data = userData;

			dataSource = new kendo.data.DataSource(config);

			grids[gridIndex].dataSource 			= dataSource;
			grids[gridIndex].gridConfig.dataSource 	= dataSource;//both of these reference same dataSource
		},
		filteredData: function(gridIndex){
			var grid = KAPI.grid.get(gridIndex);
			var dataSource =  grid.dataSource;
			var filters = dataSource.filter();
			var allData = dataSource.data();
			var query = new kendo.data.Query(allData);
			var data = query.filter(filters).data;

			//console.log('filtered data');
			//console.log(data);

			return data;
		},
		clearFilters: function(gridIndex){
			KAPI.grid.get(gridIndex).dataSource.filter([]);
		},
		render: function(gridIndex){
			var curGrid;
			var i;
			var numGrids = grids.length;

			if(gridIndex === undefined){
				for(i = 0; i < numGrids; i += 1){
					render(i);
				}
			}else{
				curGrid = grids[gridIndex];
				if($('#'+curGrid.elementId).data('kendoGrid')){
					$('#'+curGrid.elementId).data('kendoGrid').destroy();
					$('#'+curGrid.elementId).empty();
				}
				$('#'+curGrid.elementId).kendoGrid(curGrid.gridConfig);
			}
		}
	};

	return KAPI;
}(KAPI || {}));