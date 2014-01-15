kendoCustomCombo
================

An alternative to the Kendo Dropdown List

####Dependencies:
Kendo UI, jQuery

# What is it for?
You may need a custom drop down box for your Kendo Grid.  This plugin allows you to provide a set of options within that drop down box.  Some of your Kendo Grid rows may need a set of options based on conditions within the data for each particular record.  This plugin has got you covered!

#To get started:
Make sure you've included jQuery and Kendo UI css/js.  CDN links listed in sample.html.

Simply instantiate the custom combo box by calling the init() and passing a config object.  You can keep it basic or you can pass in additional paramters to override the defaults.

```
	var customActionConfig = {
		dropOptions: [
			{
				title: "popup",
				field: "popupPermission",
				action: 'myPopFunction'
			},
			{
				title: "something else",
				field: "somethingElsePermission",
				action: 'myOtherFunction'
			}
		]
	};
	CustomActionBox.init(customActionConfig);
```

Then create your kendo grid and the drop down box should be good to go assuming you have fields in your Kendo Datasource which match those listed in the dropOptions object and are equal to true/false.  If you do not want to use the permission system, no problem!  Just turn it off by setting the permissionSystem to false:

```
	var customActionConfig = {
		permissionSystem: false,
		dropOptions: [
			{
				title: "popup",
				field: "popupPermission",
				action: 'myPopFunction'
			},
			{
				title: "something else",
				field: "somethingElsePermission",
				action: 'myOtherFunction'
			}
		]
	};
	CustomActionBox.init(customActionConfig);
```




####dropOptions: *(required)*
Must be included in your config object.  Each object within dropOptions is the definition of a new option in the dropdown box.


####title *(required)*
The text of the drop down option

####field *(required)*
The field which determines whether or not an option should be shown.  This is the field name within your Kendo Datasource and must be equal to true/false.  This is only necessary if you leave the default option of 'permissionSystem' as true.

####action *(required)*
This is the function that should be called when the option is selected.

####permissionSystem *(optional)*
By default this is set to true.  This is what allows you to present a potentially different list of options in each drop down box based on the kind of data within that particular record.  When this is set to true, you must have a field in your Kendo Datasource whose value must be equal to true/false.  When Kendo comes to a record where the field is true the corresponding option will be shown.  When a record's field is false, the option will not show.


The basic implementation does not come with style beyond the basic sizing/positioning which is handled at the time of clicking the drop down box.  You will need to provide those yourself.  The sample.html shows the two primary css selectors you will most likely want to use: .customDropDownOption & .dropDownSelector.



