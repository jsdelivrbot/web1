/*
This file is part of Ext JS 3.4

Copyright (c) 2011-2013 Sencha Inc

Contact:  http://www.sencha.com/contact

Commercial Usage
Licensees holding valid commercial licenses may use this file in accordance with the Commercial
Software License Agreement provided with the Software or, alternatively, in accordance with the
terms contained in a written agreement between you and Sencha.

If you are unsure which license is appropriate for your use, please contact the sales department
at http://www.sencha.com/contact.

Build date: 2013-04-03 15:07:25
*/
Ext.data.JsonP.Ext_AbstractManager({"alternateClassNames":[],"aliases":{},"enum":null,"parentMixins":[],"tagname":"class","subclasses":[],"extends":null,"uses":[],"html":"<div><pre class=\"hierarchy\"><h4>Files</h4><div class='dependency'><a href='source/AbstractManager.html#Ext-AbstractManager' target='_blank'>AbstractManager.js</a></div></pre><div class='doc-contents'><p>Base Manager class - extended by ComponentMgr and PluginMgr</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-property'>Properties</h3><div class='subsection'><div id='property-all' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Ext.AbstractManager'>Ext.AbstractManager</span><br/><a href='source/AbstractManager.html#Ext-AbstractManager-property-all' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Ext.AbstractManager-property-all' class='name not-expandable'>all</a><span> : <a href=\"#!/api/Ext.util.MixedCollection\" rel=\"Ext.util.MixedCollection\" class=\"docClass\">Ext.util.MixedCollection</a></span></div><div class='description'><div class='short'><p>Contains all of the items currently managed</p>\n</div><div class='long'><p>Contains all of the items currently managed</p>\n</div></div></div><div id='property-typeName' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Ext.AbstractManager'>Ext.AbstractManager</span><br/><a href='source/AbstractManager.html#Ext-AbstractManager-property-typeName' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Ext.AbstractManager-property-typeName' class='name expandable'>typeName</a><span> : <a href=\"#!/api/String\" rel=\"String\" class=\"docClass\">String</a></span><strong class='private signature' >private</strong></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>'type'</code></p></div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-constructor' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Ext.AbstractManager'>Ext.AbstractManager</span><br/><a href='source/AbstractManager.html#Ext-AbstractManager-method-constructor' target='_blank' class='view-source'>view source</a></div><strong class='new-keyword'>new</strong><a href='#!/api/Ext.AbstractManager-method-constructor' class='name expandable'>Ext.AbstractManager</a>( <span class='pre'>config</span> ) : <a href=\"#!/api/Ext.AbstractManager\" rel=\"Ext.AbstractManager\" class=\"docClass\">Ext.AbstractManager</a></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>config</span> : Object<div class='sub-desc'>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/Ext.AbstractManager\" rel=\"Ext.AbstractManager\" class=\"docClass\">Ext.AbstractManager</a></span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-create' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Ext.AbstractManager'>Ext.AbstractManager</span><br/><a href='source/AbstractManager.html#Ext-AbstractManager-method-create' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Ext.AbstractManager-method-create' class='name expandable'>create</a>( <span class='pre'>config, defaultType</span> ) : Mixed</div><div class='description'><div class='short'>Creates and returns an instance of whatever this manager manages, based on the supplied type and config object ...</div><div class='long'><p>Creates and returns an instance of whatever this manager manages, based on the supplied type and config object</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>config</span> : Object<div class='sub-desc'><p>The config object</p>\n</div></li><li><span class='pre'>defaultType</span> : <a href=\"#!/api/String\" rel=\"String\" class=\"docClass\">String</a><div class='sub-desc'><p>If no type is discovered in the config object, we fall back to this type</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Mixed</span><div class='sub-desc'><p>The instance of whatever this manager is managing</p>\n</div></li></ul></div></div></div><div id='method-get' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Ext.AbstractManager'>Ext.AbstractManager</span><br/><a href='source/AbstractManager.html#Ext-AbstractManager-method-get' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Ext.AbstractManager-method-get' class='name expandable'>get</a>( <span class='pre'>id</span> ) : Object</div><div class='description'><div class='short'>Returns a component by id. ...</div><div class='long'><p>Returns a component by <a href=\"#!/api/Ext.Component-cfg-id\" rel=\"Ext.Component-cfg-id\" class=\"docClass\">id</a>.\nFor additional details see <a href=\"#!/api/Ext.util.MixedCollection-method-get\" rel=\"Ext.util.MixedCollection-method-get\" class=\"docClass\">Ext.util.MixedCollection.get</a>.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>id</span> : <a href=\"#!/api/String\" rel=\"String\" class=\"docClass\">String</a><div class='sub-desc'><p>The component <a href=\"#!/api/Ext.Component-cfg-id\" rel=\"Ext.Component-cfg-id\" class=\"docClass\">id</a></p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Object</span><div class='sub-desc'><p><a href=\"#!/api/Ext.Component\" rel=\"Ext.Component\" class=\"docClass\">Ext.Component</a> The Component, <code>undefined</code> if not found, or <code>null</code> if a\nClass was found.</p>\n</div></li></ul></div></div></div><div id='method-isRegistered' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Ext.AbstractManager'>Ext.AbstractManager</span><br/><a href='source/AbstractManager.html#Ext-AbstractManager-method-isRegistered' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Ext.AbstractManager-method-isRegistered' class='name expandable'>isRegistered</a>( <span class='pre'>xtype</span> ) : Boolean</div><div class='description'><div class='short'>Checks if a Component type is registered. ...</div><div class='long'><p>Checks if a Component type is registered.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>xtype</span> : <a href=\"#!/api/Ext.Component\" rel=\"Ext.Component\" class=\"docClass\">Ext.Component</a><div class='sub-desc'><p>The mnemonic string by which the Component class may be looked up</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Boolean</span><div class='sub-desc'><p>Whether the type is registered.</p>\n</div></li></ul></div></div></div><div id='method-onAvailable' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Ext.AbstractManager'>Ext.AbstractManager</span><br/><a href='source/AbstractManager.html#Ext-AbstractManager-method-onAvailable' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Ext.AbstractManager-method-onAvailable' class='name expandable'>onAvailable</a>( <span class='pre'>id, fn, scope</span> )</div><div class='description'><div class='short'>Registers a function that will be called when a Component with the specified id is added to the manager. ...</div><div class='long'><p>Registers a function that will be called when a Component with the specified id is added to the manager. This will happen on instantiation.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>id</span> : <a href=\"#!/api/String\" rel=\"String\" class=\"docClass\">String</a><div class='sub-desc'><p>The component <a href=\"#!/api/Ext.Component-cfg-id\" rel=\"Ext.Component-cfg-id\" class=\"docClass\">id</a></p>\n</div></li><li><span class='pre'>fn</span> : <a href=\"#!/api/Function\" rel=\"Function\" class=\"docClass\">Function</a><div class='sub-desc'><p>The callback function</p>\n</div></li><li><span class='pre'>scope</span> : Object<div class='sub-desc'><p>The scope (<code>this</code> reference) in which the callback is executed. Defaults to the Component.</p>\n</div></li></ul></div></div></div><div id='method-register' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Ext.AbstractManager'>Ext.AbstractManager</span><br/><a href='source/AbstractManager.html#Ext-AbstractManager-method-register' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Ext.AbstractManager-method-register' class='name expandable'>register</a>( <span class='pre'>item</span> )</div><div class='description'><div class='short'>Registers an item to be managed ...</div><div class='long'><p>Registers an item to be managed</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>item</span> : Mixed<div class='sub-desc'><p>The item to register</p>\n</div></li></ul></div></div></div><div id='method-registerType' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Ext.AbstractManager'>Ext.AbstractManager</span><br/><a href='source/AbstractManager.html#Ext-AbstractManager-method-registerType' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Ext.AbstractManager-method-registerType' class='name expandable'>registerType</a>( <span class='pre'>xtype, cls</span> )</div><div class='description'><div class='short'>Registers a new Component constructor, keyed by a new\nExt.Component.xtype. ...</div><div class='long'><p>Registers a new Component constructor, keyed by a new\n<a href=\"#!/api/Ext.Component-cfg-xtype\" rel=\"Ext.Component-cfg-xtype\" class=\"docClass\">Ext.Component.xtype</a>.</p>\n\n\n<p>Use this method (or its alias <a href=\"#!/api/Ext-method-reg\" rel=\"Ext-method-reg\" class=\"docClass\">Ext.reg</a>) to register new\nsubclasses of <a href=\"#!/api/Ext.Component\" rel=\"Ext.Component\" class=\"docClass\">Ext.Component</a> so that lazy instantiation may be used when specifying\nchild Components.\nsee <a href=\"#!/api/Ext.Container-property-items\" rel=\"Ext.Container-property-items\" class=\"docClass\">Ext.Container.items</a></p>\n\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>xtype</span> : <a href=\"#!/api/String\" rel=\"String\" class=\"docClass\">String</a><div class='sub-desc'><p>The mnemonic string by which the Component class may be looked up.</p>\n</div></li><li><span class='pre'>cls</span> : Constructor<div class='sub-desc'><p>The new Component class.</p>\n</div></li></ul></div></div></div><div id='method-unregister' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Ext.AbstractManager'>Ext.AbstractManager</span><br/><a href='source/AbstractManager.html#Ext-AbstractManager-method-unregister' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Ext.AbstractManager-method-unregister' class='name expandable'>unregister</a>( <span class='pre'>item</span> )</div><div class='description'><div class='short'>Unregisters a component by removing it from this manager ...</div><div class='long'><p>Unregisters a component by removing it from this manager</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>item</span> : Mixed<div class='sub-desc'><p>The item to unregister</p>\n</div></li></ul></div></div></div></div></div></div></div>","superclasses":[],"meta":{},"requires":[],"html_meta":{},"statics":{"property":[],"cfg":[],"css_var":[],"method":[],"event":[],"css_mixin":[]},"files":[{"href":"AbstractManager.html#Ext-AbstractManager","filename":"AbstractManager.js"}],"linenr":1,"members":{"property":[{"tagname":"property","owner":"Ext.AbstractManager","meta":{},"name":"all","id":"property-all"},{"tagname":"property","owner":"Ext.AbstractManager","meta":{"private":true},"name":"typeName","id":"property-typeName"}],"cfg":[],"css_var":[],"method":[{"tagname":"method","owner":"Ext.AbstractManager","meta":{},"name":"constructor","id":"method-constructor"},{"tagname":"method","owner":"Ext.AbstractManager","meta":{},"name":"create","id":"method-create"},{"tagname":"method","owner":"Ext.AbstractManager","meta":{},"name":"get","id":"method-get"},{"tagname":"method","owner":"Ext.AbstractManager","meta":{},"name":"isRegistered","id":"method-isRegistered"},{"tagname":"method","owner":"Ext.AbstractManager","meta":{},"name":"onAvailable","id":"method-onAvailable"},{"tagname":"method","owner":"Ext.AbstractManager","meta":{},"name":"register","id":"method-register"},{"tagname":"method","owner":"Ext.AbstractManager","meta":{},"name":"registerType","id":"method-registerType"},{"tagname":"method","owner":"Ext.AbstractManager","meta":{},"name":"unregister","id":"method-unregister"}],"event":[],"css_mixin":[]},"inheritable":null,"private":null,"component":false,"name":"Ext.AbstractManager","singleton":false,"override":null,"inheritdoc":null,"id":"class-Ext.AbstractManager","mixins":[],"mixedInto":[]});