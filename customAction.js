

/*
////BEGIN ACTION COLUMN FUNCTIONS
//for action column
function getActionTemplate(config){
	var actionTemplateArray = [];
	var actionTemplateString = "";
	var extendActionObject;

	if(config.enabled){
		if(config.callingPage === 'orders'){
			actionTemplateArray.push("<div class='dropDownSelector' data-calling-page='orders' data-transid='#=kendo.toString(transId)#'");
			if(config.updatePO){
				actionTemplateArray.push(" #if(allowUpdatePO==true){# data-allowupdatepo='true' #}#");
			}
			if(config.viewPDF){
				actionTemplateArray.push(" #if(allowPdf==true){# data-viewpdf='true' #}#");
			}
			if(config.extendRental){
				actionTemplateArray.push(" #if(allowExtend==true){# data-allowextend='true' #}#");
			}
			if(config.stopRental){
				actionTemplateArray.push(" #if(allowPickup==true){# data-allowpickup='true' #}#");
			}
		}else if(config.callingPage === 'invoices'){
			actionTemplateArray.push("<div class='dropDownSelector' data-calling-page='invoices' data-seqId='#=kendo.toString(seqId)#' data-transid='#=kendo.toString(id)#'");
			if(config.viewPDF){
				actionTemplateArray.push(" #if(allowPdf==true){# data-viewpdf='true' #}#");
			}
			if(config.updatePO){
				actionTemplateArray.push(" #if(allowUpdatePO==true){# data-allowupdatepo='true' #}#");
			}
		}else if(config.callingPage === 'rentalhistory'){
			actionTemplateArray.push("<div class='dropDownSelector' data-calling-page='rentalhistory' data-seqId='#=kendo.toString(seqId)#' data-transid='#=kendo.toString(contractId)#'");
			if(config.viewPDF){
				actionTemplateArray.push(" #if(allowPdf==true){# data-viewpdf='true' #}#");
			}
		}
		actionTemplateArray.push(" >Action:<span unselectable='on' class='pull-right k-icon k-i-arrow-s'></span></div>");
		actionTemplateString = actionTemplateArray.join("");

		extendActionObject = {
			"encoded":true,
			"field": "action",
			"title": "Action(s)",
			"headerAttributes":{"class":"grid-center"},
			"filterable":false,
			"sortable":false,
			"width":"100px",
			"template": actionTemplateString,
			"objectName": "extendedActionObject"
		};
	}else{
		extendActionObject = false;
	}

	return extendActionObject;
}
////END ACTION COLUMN FUNCTIONS

/////BEGIN ACTION COLUMN DROP DOWN BOX HANDLERS
//handle action column drop down click
$(document).ready(function(){
	$(document).on('click', 'div.dropDownSelector', function(event){
		event.stopPropagation();
		var dropDownContainer 			= $('#dropDownContainer');
		var dropDownSelector 			= $(this);
		var uniqueRecordId				= $(this).attr('data-unique-id');
		var options 	 				= dropDownSelector.attr('data-allowextend');
		var dropDownSelectorHeight		= dropDownSelector.height();
		var dropDownSelectorWidth		= dropDownSelector.width();
		var numOptions;

		if(dropDownSelector.hasClass('waiting_for_action')){
			dropDownSelector.removeClass('waiting_for_action');
			dropDownContainer.addClass('hide');
			return false;
		}
		if(!dropDownContainer.length > 0){
			$('body').append('<div id="dropDownContainer" class="hide"></div>');
			dropDownContainer = $('#dropDownContainer');
		}

		dropDownContainer.html("");//clear old stuff
		$('.waiting_for_action').removeClass('waiting_for_action');
		$(this).addClass('waiting_for_action');

		if(allowExtend === 'true'){
			dropDownContainer.append('<div class="extendOption" data-action="openExtendModal">Extend Rental</div>');
		}
		if(allowPickup === 'true'){
			dropDownContainer.append('<div class="extendOption" data-action="openPickupModal">Request Pickup</div>');
		}
		if(viewPDF === 'true'){
			dropDownContainer.append('<div class="extendOption" data-action="openContractPdf">View PDF</div>');
		}
		if(allowUpdatePO === 'true'){
			dropDownContainer.append('<div class="extendOption" data-action="openUpdatePO">Update PO</div>');
		}

		dropDownContainer.removeClass('hide');

		numOptions = dropDownContainer.find('div').length;
		if(numOptions < 1){
			dropDownSelector.css('background-color', '#DBDBDE');
		}else{
			dropDownSelector.css('background-color', '#FFFFFF');
		}

		dropDownSelector.parent().append(dropDownContainer);

		if(dropDownSelectorWidth + 5 < 100){
			dropDownContainer.css({
				"height": (dropDownSelectorHeight + 6) * numOptions,
				"width": 100
			});
		}else{
			dropDownContainer.css({
				"height": (dropDownSelectorHeight + 6) * numOptions,
				"width": dropDownSelectorWidth + 5
			});
		}
		//"top": dropDownSelectorPosition.top + dropDownSelectorHeight + 5,
		//"left": dropDownSelectorPosition.left,

		dropDownContainer.find('div').css("height", dropDownSelectorHeight);
	});
	//handle selecting a drop down option
	$('#clientsDb').on('click', 'div.extendOption', function(event){
		event.stopPropagation();
		var actionType = $(this).attr('data-action');
		var transId = $('div.waiting_for_action').attr('data-transid');
		var callingPage = $('div.waiting_for_action').attr('data-calling-page');
		var seqId;
		if((callingPage === 'invoices') || (callingPage === 'rentalhistory')){
			seqId = $('div.waiting_for_action').attr('data-seqId');
		}

		if(actionType == "openExtendModal"){
			openExtendModal(transId);
		}else if(actionType == "openPickupModal"){
			openPickupModal(transId);
		}else if(actionType == "openContractPdf"){
			if((callingPage === 'invoices') || (callingPage === 'rentalhistory')){
				openContractPdf(transId, seqId);
			}else{
				openContractPdf(transId);
			}
		}else if(actionType == "openUpdatePO") {
			if(callingPage === 'invoices'){
				openUpdatePO(transId, seqId);
			}else{
				openUpdatePO(transId);
		}
		}
		$('div.dropDownSelector').removeClass('waiting_for_action');
		$('#dropDownContainer').addClass('hide');
	});
	//handle closing drop down when anything on screen is clicked
	$(document).on('mousedown', function(event){
		//we try to catch all mouse clicks except for those on our drop down box
		var target = $(event.target);

		if(!target.hasClass('dropDownSelector') && !target.hasClass('extendOption')){
			if($('div.dropDownSelector').hasClass('waiting_for_action')){
				$('#dropDownContainer').addClass('hide');
				$('div.dropDownSelector').removeClass('waiting_for_action');
			}
		}
	});
});

function setDisabledActionStyles(){
	//set the disabled color for action columns that have no options
	$('div.dropDownSelector').each(function(){
		var optionsExist = false;
		if(!(typeof $(this).attr('data-allowextend') === 'undefined' || $(this).attr('data-allowextend') === false)
			|| !(typeof $(this).attr('data-allowpickup') === 'undefined' || $(this).attr('data-allowpickup') === false)
			|| !(typeof $(this).attr('data-viewpdf') === 'undefined' || $(this).attr('data-viewpdf') === false)
			|| !(typeof $(this).attr('data-allowupdatepo') === 'undefined' || $(this).attr('data-allowupdatepo') === false)){
			optionsExist = true;
		}
		if(!optionsExist){
			$(this).css('background-color', '#DBDBDE');
		}
	});
}
/////END ACTION COLUMN DROP DOWN BOX HANDLERS

*/