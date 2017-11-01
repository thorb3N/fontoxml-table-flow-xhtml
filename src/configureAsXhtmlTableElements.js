define([
	'fontoxml-families/configureAsBlock',
	'fontoxml-families/configureAsFrameWithBlock',
	'fontoxml-families/configureAsRemoved',
	'fontoxml-families/configureAsStructure',
	'fontoxml-families/configureAsTable',
	'fontoxml-table-flow/TableValidator',
	'fontoxml-table-flow/tableStructureManager',

	'./templates/CellTemplate',
	'./templates/TableTemplate',

	'./tableStructure/XhtmlTableStructure'
], function (
	configureAsBlock,
	configureAsFrameWithBlock,
	configureAsRemoved,
	configureAsStructure,
	configureAsTable,
	TableValidator,
	tableStructureManager,

	CellTemplate,
	TableTemplate,

	XhtmlTableStructure
) {
	'use strict';

	/**
	 * Configure XHTML tables.
	 *
	 * @fontosdk
	 *
	 * @category add-on/fontoxml-table-flow-xhtml
	 *
	 * @param  {Object}  sxModule
	 * @param  {Object}  [options]
	 * @param  {number}  [options.priority]                Selector priority for all elements configured by this function
	 * @param  {Object}  [options.table]                   Options for the table element
	 * @param  {string}  [options.table.namespaceURI='']   The namespace URI for this table
	 * @param  {Object}  [options.td]                      Configuration options for the td element
	 * @param  {string}  [options.td.defaultTextContainer] The default text container for the td element
	 * @param  {Object}  [options.th]                      Configuration options for the th element
	 * @param  {string}  [options.th.defaultTextContainer] The default text container for the th element
	 */
	return function configureAsXhtmlTableElements (sxModule, options) {
		options = options || {};
		var tableStructure = new XhtmlTableStructure(options);
		tableStructureManager.addTableStructure(tableStructure);

		sxModule.configure('format')
			.addRestrictingValidator(new TableValidator(tableStructure));

		var priority = options.priority;

		// Table (table)
		var tableSelector = 'self::' + tableStructure.selectorParts.table;
		configureAsTable(sxModule, tableSelector, undefined, {});

		sxModule.configure('fontoxml-templated-views').stylesheet('content')
			.renderNodesMatching(tableSelector, priority)
				.withTemplate(new TableTemplate());

		// Title (caption)
		var captionSelector = 'self::' + tableStructure.selectorParts.caption;
		configureAsBlock(sxModule, captionSelector, undefined, {});

		// Column group (colgroup)
		var colgroupSelector = 'self::' + tableStructure.selectorParts.colgroup;
		configureAsRemoved(sxModule, colgroupSelector, undefined);

		// Column (col)
		var colSelector = 'self::' + tableStructure.selectorParts.col;
		configureAsRemoved(sxModule, colSelector, undefined);

		// Row (tr)
		var trSelector = 'self::' + tableStructure.selectorParts.tr;
		configureAsStructure(sxModule, trSelector, undefined, {});

		sxModule.configure('fontoxml-templated-views').stylesheet('content')
			.renderNodesMatching(trSelector, priority)
				.asSingleElement('tr');

		// Cell (td)
		var tdSelector = 'self::' + tableStructure.selectorParts.td;
		configureAsFrameWithBlock(sxModule, tdSelector, undefined, {
			defaultTextContainer: options.td && options.td.defaultTextContainer ?
				options.td.defaultTextContainer :
				null
		});

		sxModule.configure('fontoxml-templated-views').stylesheet('content')
			.renderNodesMatching(tdSelector, priority)
				.withTemplate(new CellTemplate());

		// Header Cell (th)
		var thSelector = 'self::' + tableStructure.selectorParts.th;
		configureAsFrameWithBlock(sxModule, thSelector, undefined, {
			defaultTextContainer: options.th && options.th.defaultTextContainer ?
				options.th.defaultTextContainer :
				null
		});

		sxModule.configure('fontoxml-templated-views').stylesheet('content')
			.renderNodesMatching(thSelector, priority)
				.withTemplate(new CellTemplate());

	};
});
