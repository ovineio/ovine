export const codeVal = `
// 该代码编辑器为 微软开源vscode编辑器 核心编辑组件，支持上百种语言。功能强大，且支持各种自定义需求
/* to do
  支持文件不同版本diff视图
  去除不必要右键菜单展示
  封装项目所需的所有功能
*/
/*
  js demo 代码展示
*/

(function (global, undefined) {
	"use strict";
	undefinedVariable = {};
	undefinedVariable.prop = 5;

	function initializeProperties(target, members) {
		var keys = Object.keys(members);
		var properties;
		var i, len;
		for (i = 0, len = keys.length; i < len; i++) {
			var key = keys[i];
			var enumerable = key.charCodeAt(0) !== /*_*/95;
			var member = members[key];
			if (member && typeof member === 'object') {
				if (member.value !== undefined || typeof member.get === 'function' || typeof member.set === 'function') {
					if (member.enumerable === undefined) {
						member.enumerable = enumerable;
					}
					properties = properties || {};
					properties[key] = member;
					continue;
				}
			}
			if (!enumerable) {
				properties = properties || {};
				properties[key] = { value: member, enumerable: enumerable, configurable: true, writable: true }
				continue;
			}
			target[key] = member;
		}
		if (properties) {
			Object.defineProperties(target, properties);
		}
	}

	(function (rootNamespace) {

		// Create the rootNamespace in the global namespace
		if (!global[rootNamespace]) {
			global[rootNamespace] = Object.create(Object.prototype);
		}

		// Cache the rootNamespace we just created in a local variable
		var _rootNamespace = global[rootNamespace];
		if (!_rootNamespace.Namespace) {
			_rootNamespace.Namespace = Object.create(Object.prototype);
		}

		function defineWithParent(parentNamespace, name, members) {
			/// <summary locid="1">
			/// Defines a new namespace with the specified name, under the specified parent namespace.
			/// </summary>
			/// <param name="parentNamespace" type="Object" locid="2">
			/// The parent namespace which will contain the new namespace.
			/// </param>
			/// <param name="name" type="String" locid="3">
			/// Name of the new namespace.
			/// </param>
			/// <param name="members" type="Object" locid="4">
			/// Members in the new namespace.
			/// </param>
			/// <returns locid="5">
			/// The newly defined namespace.
			/// </returns>
			var currentNamespace = parentNamespace,
				namespaceFragments = name.split(".");

			for (var i = 0, len = namespaceFragments.length; i < len; i++) {
				var namespaceName = namespaceFragments[i];
				if (!currentNamespace[namespaceName]) {
					Object.defineProperty(currentNamespace, namespaceName,
						{ value: {}, writable: false, enumerable: true, configurable: true }
					);
				}
				currentNamespace = currentNamespace[namespaceName];
			}

			if (members) {
				initializeProperties(currentNamespace, members);
			}

			return currentNamespace;
		}

		function define(name, members) {
			/// <summary locid="6">
			/// Defines a new namespace with the specified name.
			/// </summary>
			/// <param name="name" type="String" locid="7">
			/// Name of the namespace.  This could be a dot-separated nested name.
			/// </param>
			/// <param name="members" type="Object" locid="4">
			/// Members in the new namespace.
			/// </param>
			/// <returns locid="5">
			/// The newly defined namespace.
			/// </returns>
			return defineWithParent(global, name, members);
		}

		// Establish members of the "WinJS.Namespace" namespace
		Object.defineProperties(_rootNamespace.Namespace, {

			defineWithParent: { value: defineWithParent, writable: true, enumerable: true },

			define: { value: define, writable: true, enumerable: true }

		});

	})("WinJS");

	(function (WinJS) {

		function define(constructor, instanceMembers, staticMembers) {
			/// <summary locid="8">
			/// Defines a class using the given constructor and with the specified instance members.
			/// </summary>
			/// <param name="constructor" type="Function" locid="9">
			/// A constructor function that will be used to instantiate this class.
			/// </param>
			/// <param name="instanceMembers" type="Object" locid="10">
			/// The set of instance fields, properties and methods to be made available on the class.
			/// </param>
			/// <param name="staticMembers" type="Object" locid="11">
			/// The set of static fields, properties and methods to be made available on the class.
			/// </param>
			/// <returns type="Function" locid="12">
			/// The newly defined class.
			/// </returns>
			constructor = constructor || function () { };
			if (instanceMembers) {
				initializeProperties(constructor.prototype, instanceMembers);
			}
			if (staticMembers) {
				initializeProperties(constructor, staticMembers);
			}
			return constructor;
		}

		function derive(baseClass, constructor, instanceMembers, staticMembers) {
			/// <summary locid="13">
			/// Uses prototypal inheritance to create a sub-class based on the supplied baseClass parameter.
			/// </summary>
			/// <param name="baseClass" type="Function" locid="14">
			/// The class to inherit from.
			/// </param>
			/// <param name="constructor" type="Function" locid="9">
			/// A constructor function that will be used to instantiate this class.
			/// </param>
			/// <param name="instanceMembers" type="Object" locid="10">
			/// The set of instance fields, properties and methods to be made available on the class.
			/// </param>
			/// <param name="staticMembers" type="Object" locid="11">
			/// The set of static fields, properties and methods to be made available on the class.
			/// </param>
			/// <returns type="Function" locid="12">
			/// The newly defined class.
			/// </returns>
			if (baseClass) {
				constructor = constructor || function () { };
				var basePrototype = baseClass.prototype;
				constructor.prototype = Object.create(basePrototype);
				Object.defineProperty(constructor.prototype, "_super", { value: basePrototype });
				Object.defineProperty(constructor.prototype, "constructor", { value: constructor });
				if (instanceMembers) {
					initializeProperties(constructor.prototype, instanceMembers);
				}
				if (staticMembers) {
					initializeProperties(constructor, staticMembers);
				}
				return constructor;
			} else {
				return define(constructor, instanceMembers, staticMembers);
			}
		}

		function mix(constructor) {
			/// <summary locid="15">
			/// Defines a class using the given constructor and the union of the set of instance members
			/// specified by all the mixin objects.  The mixin parameter list can be of variable length.
			/// </summary>
			/// <param name="constructor" locid="9">
			/// A constructor function that will be used to instantiate this class.
			/// </param>
			/// <returns locid="12">
			/// The newly defined class.
			/// </returns>
			constructor = constructor || function () { };
			var i, len;
			for (i = 0, len = arguments.length; i < len; i++) {
				initializeProperties(constructor.prototype, arguments[i]);
			}
			return constructor;
		}

		// Establish members of "WinJS.Class" namespace
		WinJS.Namespace.define("WinJS.Class", {
			define: define,
			derive: derive,
			mix: mix
		});

	})(WinJS);

})(this);
`;

export const mdVal = [
  '## tui-editor 功能强大的md编辑器',
  '> 非常方便自定义需求与功能',
  '### todo list',
  '* [x] 支持flow chart',
  '* [ ] 完善menubar图标显示问题',
  '* [ ] 完善编辑器全屏功能（toobar最后一个全屏功能，还没来得及换图标）',
  '* [ ]  增加导出PDF文件 功能',
  '',
  '| @cols=2:merged |',
  '| --- | --- |',
  '| table | table |',
  '```uml',
  'partition Conductor {',
  '  (*) --> "Climbs on Platform"',
  '  --> === S1 ===',
  '  --> Bows',
  '}',
  '',
  'partition Audience #LightSkyBlue {',
  '  === S1 === --> Applauds',
  '}',
  '',
  'partition Conductor {',
  '  Bows --> === S2 ===',
  '  --> WavesArmes',
  '  Applauds --> === S2 ===',
  '}',
  '',
  'partition Orchestra #CCCCEE {',
  '  WavesArmes --> Introduction',
  '  --> "Play music"',
  '}',
  '```',
  '```chart',
  ',category1,category2',
  'Jan,21,23',
  'Feb,31,17',
  '',
  'type: column',
  'title: Monthly Revenue',
  'x.title: Amount',
  'y.title: Month',
  'y.min: 1',
  'y.max: 40',
  'y.suffix: $',
  '```',
  '```flow',
  'st=>start: Start|past:>https://github.com/CareyToboo/rt-admin',
  'e=>end: End:>https://github.com/CareyToboo/rt-admin',
  'op1=>operation: My Operation',
  'op2=>operation: Stuff|current',
  'sub1=>subroutine: My Subroutine|invalid',
  'cond=>condition: Yes',
  'or No?|approved:>https://github.com/CareyToboo/rt-admin',
  'c2=>condition: Good idea|rejected',
  'io=>inputoutput: catch something...|request',
  'para=>parallel: parallel tasks',

  'st->op1(right)->cond',
  'cond(yes, right)->c2',
  'cond(no)->para',
  'c2(true)->io->e',
  'c2(false)->e',

  'para(path1, bottom)->sub1(left)->op1',
  'para(path2, right)->op2->e',

  // tslint:disable-next-line:max-line-length
  'st>op1>cond>c2>op2>e',
  '```'
].join('\n');

export const richVal = `
<p><span style="font-size: 18pt;">rt-admin 目的是构建一个中小型企业开箱即用的，基于table操作集合的admin系统解决方案。</span></p>
<p><span style="font-size: 12pt;">是ant-pro源码的ts重构版，支持TS，ES6同时编写代码。拥有antd-pro,antd,ract，
typescrtipt 组件和代码类型检查的优势。</span></p>
<p><span style="font-size: 12pt; color: #333399;">Table View 为该项目核心功组件</span></p>
<ul>
<li><span style="font-size: 12pt;">自动集成权限管理</span></li>
<li><span style="font-size: 12pt;">自动路由</span></li>
<li><span style="font-size: 12pt;">完全配置化</span></li>
</ul>
<p><span style="font-size: 12pt;">项目将集成 优秀第三方常用组件。</span></p>
<ul>
<li><span style="font-size: 12pt;">tinymce富文本编辑器【页面富文本展示页功能】</span></li>
<li><span style="font-size: 12pt;">tui-edior markdwon编辑器【文档编辑功能】</span></li>
<li><span style="font-size: 12pt;">monaco 代码编辑器【配置管理等功能】</span></li>
<li><span style="font-size: 12pt;">vodejs 视频播放器【各种格式的视频文件预览】<span style="color: #ff9900;">【doing】</span></span></li>
<li><span style="font-size: 12pt;">集成七牛文件上传<span style="color: #ff9900;">【to-do】</span></span></li>
<li><span style="font-size: 12pt;">集成自定义文件上传<span style="color: #ff9900;">【to-do】</span></span></li>
</ul>
<p>如果支持作者或者有人建议，请提issue或者邮件toboos@sina.com.&nbsp;</p>
<p>非常欢迎您的star支持，与代码贡献。十分感谢</p>
`;
