var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
// Reference paths for scriptedhost and diag hub. Make sure you also change the plugin.js and diagnosticshub.js referenced
// in the VsGraphicsDebuggerPkg.csproj if you change these below.
/// <reference path="../../../../../../out/typescriptapis/bptoob/inc/1.8/Plugin.d.ts" />
/// <reference path="../../../../../../src/ExternalAPIs/DiagnosticsHub/bin/ret/x86/TypeScriptExports/ts-1.8.10/DiagnosticsHub.d.ts" />  
// 
// Copyright (C) Microsoft. All rights reserved.
//
var VsGraphics;
(function (VsGraphics) {
    var Common;
    (function (Common) {
        var Controls;
        (function (Controls) {
            "use strict";
            var ObservableViewModel = (function () {
                function ObservableViewModel() {
                    this._propertyChangedObservers = [];
                }
                ObservableViewModel.prototype.registerPropertyChanged = function (observer) {
                    this._propertyChangedObservers.push(observer);
                };
                ObservableViewModel.prototype.removePropertyChanged = function (observer) {
                    var index = this._propertyChangedObservers.indexOf(observer);
                    if (index >= 0) {
                        this._propertyChangedObservers = this._propertyChangedObservers.splice(index, 1);
                    }
                };
                ObservableViewModel.prototype.raisePropertyChanged = function (propertyName) {
                    /// <summary>
                    ///     NOTE: To be used only by the derived class. 
                    ///     Raise the propertyChanged event on the given property name.
                    /// </summary>
                    for (var i = 0; i < this._propertyChangedObservers.length; i++) {
                        this._propertyChangedObservers[i].onPropertyChanged(propertyName);
                    }
                };
                return ObservableViewModel;
            }());
            Controls.ObservableViewModel = ObservableViewModel;
            (function (NotifyCollectionChangedAction) {
                NotifyCollectionChangedAction[NotifyCollectionChangedAction["Add"] = 0] = "Add";
                NotifyCollectionChangedAction[NotifyCollectionChangedAction["Reset"] = 1] = "Reset";
                NotifyCollectionChangedAction[NotifyCollectionChangedAction["Replace"] = 2] = "Replace";
            })(Controls.NotifyCollectionChangedAction || (Controls.NotifyCollectionChangedAction = {}));
            var NotifyCollectionChangedAction = Controls.NotifyCollectionChangedAction;
            var NotifyCollectionChangedEventArgs = (function () {
                function NotifyCollectionChangedEventArgs(action, newItems, newStartingIndex, oldItems, oldStartingIndex) {
                    this._action = action;
                    this._newItems = newItems;
                    this._newStartingIndex = newStartingIndex;
                    this._oldItems = oldItems;
                    this._oldStartingIndex = oldStartingIndex;
                }
                Object.defineProperty(NotifyCollectionChangedEventArgs.prototype, "action", {
                    get: function () { return this._action; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(NotifyCollectionChangedEventArgs.prototype, "newItems", {
                    get: function () { return this._newItems; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(NotifyCollectionChangedEventArgs.prototype, "newStartingIndex", {
                    get: function () { return this._newStartingIndex; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(NotifyCollectionChangedEventArgs.prototype, "oldItems", {
                    get: function () { return this._oldItems; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(NotifyCollectionChangedEventArgs.prototype, "oldStartingIndex", {
                    get: function () { return this._oldStartingIndex; },
                    enumerable: true,
                    configurable: true
                });
                return NotifyCollectionChangedEventArgs;
            }());
            Controls.NotifyCollectionChangedEventArgs = NotifyCollectionChangedEventArgs;
            var ObservableCollection = (function () {
                function ObservableCollection() {
                    this._items = [];
                    this._collectionChangedObservers = [];
                }
                ObservableCollection.prototype.registerCollectionChanged = function (observer) {
                    this._collectionChangedObservers.push(observer);
                };
                ObservableCollection.prototype.removeCollectionChanged = function (observer) {
                    var index = this._collectionChangedObservers.indexOf(observer);
                    if (index >= 0) {
                        this._collectionChangedObservers = this._collectionChangedObservers.splice(index, 1);
                    }
                };
                ObservableCollection.prototype.add = function (item) {
                    this._items.push(item);
                    var args = new NotifyCollectionChangedEventArgs(NotifyCollectionChangedAction.Add, [item], this._items.length - 1, [], 0);
                    this.onCollectionChanged(args);
                };
                ObservableCollection.prototype.replace = function (index, newItem) {
                    if (index >= 0 && index < this._items.length) {
                        var oldItem = this._items[index];
                        this._items[index] = newItem;
                        var args = new NotifyCollectionChangedEventArgs(NotifyCollectionChangedAction.Replace, [newItem], index, [oldItem], index);
                        this.onCollectionChanged(args);
                    }
                };
                ObservableCollection.prototype.clear = function () {
                    var oldItems = this._items;
                    this._items = [];
                    var args = new NotifyCollectionChangedEventArgs(NotifyCollectionChangedAction.Reset, [], 0, oldItems, oldItems.length - 1);
                    this.onCollectionChanged(args);
                };
                ObservableCollection.prototype.getItem = function (index) {
                    return this._items[index];
                };
                Object.defineProperty(ObservableCollection.prototype, "length", {
                    get: function () {
                        return this._items.length;
                    },
                    enumerable: true,
                    configurable: true
                });
                ObservableCollection.prototype.onCollectionChanged = function (eventArgs) {
                    for (var i = 0; i < this._collectionChangedObservers.length; i++) {
                        this._collectionChangedObservers[i].onCollectionChanged(eventArgs);
                    }
                };
                return ObservableCollection;
            }());
            Controls.ObservableCollection = ObservableCollection;
        })(Controls = Common.Controls || (Common.Controls = {}));
    })(Common = VsGraphics.Common || (VsGraphics.Common = {}));
})(VsGraphics || (VsGraphics = {}));
// 
// Copyright (C) Microsoft. All rights reserved.
//
/// <reference path="..\Includes.ts" />
var VsGraphics;
(function (VsGraphics) {
    var Common;
    (function (Common) {
        var Controls;
        (function (Controls) {
            "use strict";
            // Create a new control with the given root HTMLElement. If the root is not
            // provided, a default <div> root is used.
            var Control = (function () {
                function Control(root) {
                    this._rootElement = root;
                    if (typeof this._rootElement === "undefined") {
                        // We must have a root element to start with, default to a div. 
                        // This can change at any time by setting the property rootElement.
                        this._rootElement = document.createElement("div");
                        this._rootElement.style.width = this._rootElement.style.height = "100%";
                    }
                    else if (this._rootElement === null) {
                        throw new Error(Microsoft.Plugin.Resources.getErrorString("JSPerf.1017"));
                    }
                }
                Control.prototype.appendChild = function (child) {
                    this._rootElement.appendChild(child.rootElement);
                    child.parent = this;
                };
                Control.prototype.removeChild = function (child) {
                    this._rootElement.removeChild(child.rootElement);
                    child.parent = null;
                };
                Object.defineProperty(Control.prototype, "rootElement", {
                    get: function () { return this._rootElement; },
                    set: function (newRoot) {
                        if (!newRoot) {
                            throw new Error(Microsoft.Plugin.Resources.getErrorString("JSPerf.1018"));
                        }
                        var oldRoot = this._rootElement;
                        this._rootElement = newRoot;
                        if (oldRoot && oldRoot.parentNode) {
                            oldRoot.parentNode.replaceChild(newRoot, oldRoot);
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Control.prototype, "parent", {
                    get: function () { return this._parent; },
                    set: function (newParent) {
                        if (this._parent !== newParent) {
                            this._parent = newParent;
                            if (this._parent && !this._parent.rootElement.contains(this._rootElement)) {
                                this._parent.appendChild(this);
                            }
                            this.onParentChanged();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                // overridable
                Control.prototype.onParentChanged = function () {
                };
                return Control;
            }());
            Controls.Control = Control;
        })(Controls = Common.Controls || (Common.Controls = {}));
    })(Common = VsGraphics.Common || (VsGraphics.Common = {}));
})(VsGraphics || (VsGraphics = {}));
// 
// Copyright (C) Microsoft. All rights reserved.
//
/// <reference path="control.ts" />
var VsGraphics;
(function (VsGraphics) {
    var Common;
    (function (Common) {
        var Controls;
        (function (Controls) {
            "use strict";
            // This TemplateControl initializes the control from a template.
            var TemplateControl = (function (_super) {
                __extends(TemplateControl, _super);
                function TemplateControl(templateName) {
                    _super.call(this);
                    // Assign the id postfix to use when fixing id's in the template
                    this._idPostfix = TemplateControl._globalIdPostfix++;
                    if (templateName) {
                        this.setTemplateFromName(templateName);
                    }
                }
                TemplateControl.prototype.setTemplateFromName = function (templateName) {
                    var root = this.getTemplateElementCopy(templateName);
                    this.adjustElementIds(root);
                    this.rootElement = root;
                };
                TemplateControl.prototype.setTemplateFromHTML = function (htmlContent) {
                    var root = this.getTemplateElementFromHTML(htmlContent);
                    this.adjustElementIds(root);
                    this.rootElement = root;
                };
                TemplateControl.prototype.findElement = function (id) {
                    var fullId = id + this._idPostfix;
                    return this.forAllSelfAndDescendants(this.rootElement, function (elem) {
                        if (elem.id && elem.id === fullId) {
                            return false;
                        }
                        return true;
                    });
                };
                TemplateControl.prototype.findElementsByClassName = function (className) {
                    var elements = [];
                    this.forAllSelfAndDescendants(this.rootElement, function (elem) {
                        if (elem.classList && elem.classList.contains(className)) {
                            elements.push(elem);
                        }
                        return true;
                    });
                    return elements;
                };
                TemplateControl.prototype.getTemplateElementCopy = function (templateName) {
                    var templateElement = document.getElementById(templateName);
                    if (!templateElement) {
                        throw new Error(Microsoft.Plugin.Resources.getErrorString("JSPerf.1023"));
                    }
                    if (templateElement.tagName.toLowerCase() !== "script") {
                        throw new Error(Microsoft.Plugin.Resources.getErrorString("JSPerf.1024"));
                    }
                    return this.getTemplateElementFromHTML(templateElement.innerHTML);
                };
                TemplateControl.prototype.getTemplateElementFromHTML = function (htmlContent) {
                    var root = this.getTemplateRootElement();
                    root.innerHTML = htmlContent;
                    // If the template contains one child, use that as the root instead
                    if (root.childElementCount === 1) {
                        root = root.firstElementChild;
                    }
                    return root;
                };
                TemplateControl.prototype.getTemplateRootElement = function () {
                    var div = document.createElement("div");
                    div.style.width = div.style.height = "100%";
                    return div;
                };
                TemplateControl.prototype.adjustElementIds = function (root) {
                    // Postfix all id's with the new id
                    var idPostfix = this._idPostfix;
                    this.forAllSelfAndDescendants(root, function (elem) {
                        if (elem.id) {
                            elem.id = elem.id + idPostfix;
                        }
                        return true;
                    });
                };
                TemplateControl.prototype.forAllSelfAndDescendants = function (root, func) {
                    // <summary>Executes the given delegate on all the node and all its decendant elements. The callback function needs to return false to break the loop.</summary>
                    // <returns>The element at which the loop exit at, or null otherwise.</returns>
                    var brokeAtElement = null;
                    if (!func(root)) {
                        brokeAtElement = root;
                    }
                    else {
                        if (root.children) {
                            var children = root.children;
                            var childrenLength = children.length;
                            for (var i = 0; i < childrenLength; i++) {
                                brokeAtElement = this.forAllSelfAndDescendants(children[i], func);
                                if (brokeAtElement) {
                                    break;
                                }
                            }
                        }
                    }
                    return brokeAtElement;
                };
                TemplateControl._globalIdPostfix = 1;
                return TemplateControl;
            }(Controls.Control));
            Controls.TemplateControl = TemplateControl;
        })(Controls = Common.Controls || (Common.Controls = {}));
    })(Common = VsGraphics.Common || (VsGraphics.Common = {}));
})(VsGraphics || (VsGraphics = {}));
// 
// Copyright (C) Microsoft. All rights reserved.
//
var VsGraphics;
(function (VsGraphics) {
    var Common;
    (function (Common) {
        "use strict";
        var Enum = (function () {
            function Enum() {
            }
            Enum.GetName = function (enumType, value) {
                var result;
                if (enumType) {
                    for (var enumKey in enumType) {
                        if (enumType.hasOwnProperty(enumKey)) {
                            var enumValue = enumType[enumKey];
                            if (enumValue === value) {
                                result = enumKey;
                                break;
                            }
                        }
                    }
                }
                if (!result) {
                    result = value.toString();
                }
                return result;
            };
            Enum.Parse = function (enumType, name, ignoreCase) {
                if (ignoreCase === void 0) { ignoreCase = true; }
                var result;
                if (enumType) {
                    if (ignoreCase) {
                        name = name.toLowerCase();
                    }
                    for (var enumKey in enumType) {
                        if (enumType.hasOwnProperty(enumKey)) {
                            var compareAginst = enumKey.toString();
                            if (ignoreCase) {
                                compareAginst = compareAginst.toLowerCase();
                            }
                            if (name === compareAginst) {
                                result = enumType[enumKey];
                                break;
                            }
                        }
                    }
                }
                return result;
            };
            Enum.GetValues = function (enumType) {
                var result = [];
                if (enumType) {
                    for (var enumKey in enumType) {
                        if (enumType.hasOwnProperty(enumKey)) {
                            var enumValue = enumType[enumKey];
                            if (typeof enumValue === "number") {
                                result.push(enumValue);
                            }
                        }
                    }
                }
                return result;
            };
            return Enum;
        }());
        Common.Enum = Enum;
    })(Common = VsGraphics.Common || (VsGraphics.Common = {}));
})(VsGraphics || (VsGraphics = {}));
// 
// Copyright (C) Microsoft. All rights reserved.
//
var VsGraphics;
(function (VsGraphics) {
    var Common;
    (function (Common) {
        "use strict";
        var ErrorFormatter = (function () {
            function ErrorFormatter() {
            }
            ErrorFormatter.format = function (error) {
                // Depending on the source, the error object will be different
                return (error.message || error.description);
            };
            return ErrorFormatter;
        }());
        Common.ErrorFormatter = ErrorFormatter;
    })(Common = VsGraphics.Common || (VsGraphics.Common = {}));
})(VsGraphics || (VsGraphics = {}));
// 
// Copyright (C) Microsoft. All rights reserved.
//
/// <reference path="../Includes.ts" />
var VsGraphics;
(function (VsGraphics) {
    var Common;
    (function (Common) {
        "use strict";
        var FormattingHelpers = (function () {
            function FormattingHelpers() {
            }
            FormattingHelpers.getPrettyPrintSize = function (bytes, includeSign) {
                if (includeSign === void 0) { includeSign = false; }
                var size = 0;
                var unitAbbreviation;
                if (Math.abs(bytes) > (1024 * 1024 * 1024)) {
                    size = bytes / (1024 * 1024 * 1024);
                    unitAbbreviation = Microsoft.Plugin.Resources.getString("GigabyteUnits");
                }
                else if (Math.abs(bytes) > (1024 * 1024)) {
                    size = bytes / (1024 * 1024);
                    unitAbbreviation = Microsoft.Plugin.Resources.getString("MegabyteUnits");
                }
                else if (Math.abs(bytes) > 1024) {
                    size = bytes / 1024;
                    unitAbbreviation = Microsoft.Plugin.Resources.getString("KilobyteUnits");
                }
                else {
                    size = bytes;
                    unitAbbreviation = Microsoft.Plugin.Resources.getString("ByteUnits");
                }
                return FormattingHelpers.getDecimalLocaleString(parseFloat(size.toFixed(2)), true, includeSign) + " " + unitAbbreviation;
            };
            FormattingHelpers.zeroPad = function (stringToPad, newLength, padLeft) {
                for (var i = stringToPad.length; i < newLength; i++) {
                    stringToPad = (padLeft ? ("0" + stringToPad) : (stringToPad + "0"));
                }
                return stringToPad;
            };
            FormattingHelpers.forceNumberSign = function (numberToConvert, positive) {
                var nf = Microsoft.Plugin.Culture.NumberFormat;
                if (!nf) {
                    nf = {
                        positiveSign: "+",
                        negativeSign: "-",
                    };
                }
                if (positive === true) {
                    return nf.positiveSign + numberToConvert;
                }
                return nf.negativeSign + numberToConvert;
            };
            // Trims a long string to the format {1-17}...{last 17} characters - mimicking Visual Studio tabs.
            FormattingHelpers.trimLongString = function (stringToConvert) {
                var substitutedString = stringToConvert;
                var maxStringLength = 38;
                if (stringToConvert.length > maxStringLength) {
                    var substrLength = (maxStringLength / 2) - 2;
                    substitutedString = stringToConvert.substr(0, substrLength) + "\u2026" + stringToConvert.substr(-(substrLength));
                }
                return substitutedString;
            };
            FormattingHelpers.getDecimalLocaleString = function (numberToConvert, includeGroupSeparators, includeSign) {
                if (includeSign === void 0) { includeSign = false; }
                var wasPositive = true;
                if (numberToConvert < 0) {
                    wasPositive = false;
                    numberToConvert = numberToConvert * -1;
                }
                var numberString = numberToConvert.toString();
                // Get any exponent
                var split = numberString.split(/e/i);
                numberString = split[0];
                var exponent = (split.length > 1 ? parseInt(split[1], 10) : 0);
                // Get any decimal place
                split = numberString.split('.');
                numberString = split[0];
                // Get whole value
                var right = split.length > 1 ? split[1] : "";
                if (exponent > 0) {
                    right = FormattingHelpers.zeroPad(right, exponent, false);
                    numberString += right.slice(0, exponent);
                    right = right.substr(exponent);
                }
                else if (exponent < 0) {
                    exponent = -exponent;
                    numberString = FormattingHelpers.zeroPad(numberString, exponent + 1, true);
                    right = numberString.slice(-exponent, numberString.length) + right;
                    numberString = numberString.slice(0, -exponent);
                }
                // Number format
                var nf = Microsoft.Plugin.Culture.NumberFormat;
                if (!nf) {
                    nf = { numberDecimalSeparator: ".", numberGroupSizes: [3], numberGroupSeparator: "," };
                }
                if (right.length > 0) {
                    right = nf.numberDecimalSeparator + right;
                }
                // Grouping (e.g. 10,000)
                if (includeGroupSeparators === true) {
                    var groupSizes = nf.numberGroupSizes, sep = nf.numberGroupSeparator, curSize = groupSizes[0], curGroupIndex = 1, stringIndex = numberString.length - 1, ret = "";
                    while (stringIndex >= 0) {
                        if (curSize === 0 || curSize > stringIndex) {
                            if (ret.length > 0) {
                                numberString = numberString.slice(0, stringIndex + 1) + sep + ret + right;
                            }
                            else {
                                numberString = numberString.slice(0, stringIndex + 1) + right;
                            }
                            if (includeSign) {
                                numberString = FormattingHelpers.forceNumberSign(numberString, wasPositive);
                            }
                            return numberString;
                        }
                        if (ret.length > 0) {
                            ret = numberString.slice(stringIndex - curSize + 1, stringIndex + 1) + sep + ret;
                        }
                        else {
                            ret = numberString.slice(stringIndex - curSize + 1, stringIndex + 1);
                        }
                        stringIndex -= curSize;
                        if (curGroupIndex < groupSizes.length) {
                            curSize = groupSizes[curGroupIndex];
                            curGroupIndex++;
                        }
                    }
                    numberString = numberString.slice(0, stringIndex + 1) + sep + ret + right;
                    if (includeSign) {
                        numberString = FormattingHelpers.forceNumberSign(numberString, wasPositive);
                    }
                    return numberString;
                }
                else {
                    numberString = numberString + right;
                    if (includeSign) {
                        numberString = FormattingHelpers.forceNumberSign(numberString, wasPositive);
                    }
                    return numberString;
                }
            };
            FormattingHelpers.forceNonBreakingSpaces = function (stringToConvert) {
                var substitutedString = stringToConvert.replace(/\s/g, function (match, pos, originalText) {
                    return "\u00a0";
                });
                return substitutedString;
            };
            FormattingHelpers.getNativeDigitLocaleString = function (stringToConvert) {
                var nf = Microsoft.Plugin.Culture.NumberFormat;
                if (!nf) {
                    nf = {
                        nativeDigits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
                    };
                }
                var substitutedString = stringToConvert.replace(/\d/g, function (match, pos, originalText) {
                    return (nf.nativeDigits[parseInt(match)]);
                });
                return substitutedString;
            };
            // Simple string formatter, replacing {0},{1}... tokens with passed strings
            FormattingHelpers.stringFormat = function (formatString, values) {
                var formattedString = formatString;
                for (var i = 0; i < values.length; i++) {
                    var formatToken = "{" + i + '}';
                    formattedString = formattedString.replace(formatToken, values[i]);
                }
                return formattedString;
            };
            return FormattingHelpers;
        }());
        Common.FormattingHelpers = FormattingHelpers;
    })(Common = VsGraphics.Common || (VsGraphics.Common = {}));
})(VsGraphics || (VsGraphics = {}));
//
// Copyright (C) Microsoft. All rights reserved.
//
/// <reference path="IFrame.d.ts" />
var VsGraphics;
(function (VsGraphics) {
    var Capture;
    (function (Capture) {
        "use strict";
        var Frame = (function () {
            function Frame(id) {
                this._id = id;
            }
            Object.defineProperty(Frame.prototype, "id", {
                get: function () {
                    return this._id;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Frame.prototype, "timestamp", {
                get: function () {
                    return this._timestamp;
                },
                set: function (time) {
                    this._timestamp = time;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Frame.prototype, "startTime", {
                get: function () {
                    return this._startTime;
                },
                set: function (time) {
                    this._startTime = time;
                    if (time > this._endTime) {
                        this._endTime = time;
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Frame.prototype, "endTime", {
                get: function () {
                    return this._endTime;
                },
                set: function (time) {
                    this._endTime = time;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Frame.prototype, "screenshotFile", {
                get: function () {
                    return this._screenshotFile;
                },
                set: function (filename) {
                    this._screenshotFile = filename;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Frame.prototype, "hasScreenshot", {
                get: function () {
                    return this._hasScreenshot;
                },
                enumerable: true,
                configurable: true
            });
            return Frame;
        }());
        Capture.Frame = Frame;
    })(Capture = VsGraphics.Capture || (VsGraphics.Capture = {}));
})(VsGraphics || (VsGraphics = {}));
//
// Copyright (C) Microsoft. All rights reserved.
//
/// <reference path="../../Common/Includes.ts" />
/// <reference path="../../Common/Controls/templateControl.ts" />
/// <reference path="../../Common/Util/formattingHelpers.ts" />
/// <reference path="../../Common/controls/componentModel.ts" />
/// <reference path="Frame.ts" />
var VsGraphics;
(function (VsGraphics) {
    var Capture;
    (function (Capture) {
        "use strict";
        var FrameTileViewModel = (function (_super) {
            __extends(FrameTileViewModel, _super);
            function FrameTileViewModel(summary) {
                _super.call(this);
                this._summary = summary;
            }
            Object.defineProperty(FrameTileViewModel.prototype, "summaryData", {
                get: function () {
                    return this._summary;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FrameTileViewModel.prototype, "timeTaken", {
                get: function () {
                    var date = new Date(this._summary.timestamp);
                    return "(" + date.toLocaleTimeString() + ")";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FrameTileViewModel.prototype, "enabled", {
                get: function () { return this._enabled; },
                set: function (v) {
                    this._enabled = v;
                    this.raisePropertyChanged("enabled");
                },
                enumerable: true,
                configurable: true
            });
            return FrameTileViewModel;
        }(VsGraphics.Common.Controls.ObservableViewModel));
        Capture.FrameTileViewModel = FrameTileViewModel;
        var FrameTileView = (function (_super) {
            __extends(FrameTileView, _super);
            function FrameTileView(controller, model) {
                _super.call(this, "FrameTileTemplate");
                this._controller = controller;
                this._model = model;
                this._frameTile = this.findElement("frameTile");
                this._onDetailsClickHandler = this.onDetailsClick.bind(this);
                this._model.registerPropertyChanged(this);
                this._tileHeader = this.findElement("frameTileHeader");
                this.findElement("seeFrameDetailsButton").innerText = Microsoft.Plugin.Resources.getString("FrameNumberFormat", this._model.summaryData.id);
                var frameImageNotAvailable = this.findElement("frameImageNotAvailable");
                if (this._model.summaryData.screenshotFile && this._model.summaryData.hasScreenshot) {
                    var imgHolder = this.findElement("frameTileImage");
                    imgHolder.addEventListener("dblclick", this._onDetailsClickHandler);
                    imgHolder.src = this._model.summaryData.screenshotFile;
                    frameImageNotAvailable.hidden = true;
                }
                else {
                    frameImageNotAvailable.hidden = false;
                    frameImageNotAvailable.innerText = Microsoft.Plugin.Resources.getString("ScreenshotNotAvailable");
                    frameImageNotAvailable.addEventListener("dblclick", this._onDetailsClickHandler);
                }
                this.findElement("frameTakenDate").innerText = this._model.timeTaken;
                this._detailsButton = this.findElement("seeFrameDetailsButton");
                this._detailsButton.addEventListener("click", this._onDetailsClickHandler);
                this._detailsButton.addEventListener("keypress", this._onDetailsClickHandler);
                this._detailsDisabled = this.findElement("frameTileTitleDisabled");
                if (this._detailsDisabled != null)
                    this._detailsDisabled.innerText = this._detailsButton.innerText;
            }
            FrameTileView.prototype.onPropertyChanged = function (propertyName) {
                switch (propertyName) {
                    case "enabled":
                        this.updateLinkState();
                        break;
                }
            };
            FrameTileView.prototype.setFocus = function () {
                this._tileHeader.focus();
            };
            FrameTileView.prototype.onDetailsClick = function (e) {
                this._controller.selectFrame(this._model.summaryData.id);
            };
            FrameTileView.prototype.updateLinkState = function () {
                this._detailsButton.disabled = !this._model.enabled;
                var remove;
                var add;
                remove = this._detailsButton.disabled ? this._detailsDisabled : this._detailsButton;
                add = this._detailsButton.disabled ? this._detailsButton : this._detailsDisabled;
                // Show/Hide the plain text instead of the html link
                if (remove != null) {
                    remove.classList.remove("frameTileHidden");
                }
                if (add != null) {
                    add.classList.add("frameTileHidden");
                }
            };
            return FrameTileView;
        }(VsGraphics.Common.Controls.TemplateControl));
        Capture.FrameTileView = FrameTileView;
    })(Capture = VsGraphics.Capture || (VsGraphics.Capture = {}));
})(VsGraphics || (VsGraphics = {}));
//
// Copyright (C) Microsoft. All rights reserved.
//
/// <reference path="../../common/controls/componentModel.ts" />
/// <reference path="../../common/controls/templateControl.ts" />
/// <reference path="IView.d.ts" />
var VsGraphics;
(function (VsGraphics) {
    var Capture;
    (function (Capture) {
        "use strict";
        var CaptureFrameTask = (function () {
            function CaptureFrameTask(controller, session) {
                this._controller = controller;
                this._session = session;
                this._startedCapture = false;
                this._canCapture = false;
                this._session.addFrameProcessingEventListener(this.onFrameResult.bind(this));
            }
            CaptureFrameTask.prototype.start = function () {
                var _this = this;
                return new Microsoft.Plugin.Promise(function (completed, error) {
                    if (_this._canCapture) {
                        if (!_this.captureFrameInternal()) {
                            if (error) {
                                error(new Error("Frame Not Currently Enabled"));
                            }
                        }
                        else {
                            _this._frameCompleted = completed;
                            _this._frameError = error;
                        }
                    }
                });
            };
            CaptureFrameTask.prototype.setReady = function () {
                this._canCapture = true;
                this._controller.appIsReadyToCapture();
            };
            CaptureFrameTask.prototype.isCompleted = function (message) {
                if (message) {
                    var obj = JSON.parse(message);
                    if (obj.eventName) {
                        if (obj.eventName === "frameData") {
                            if (this._controller.isViewBusy) {
                            }
                        }
                    }
                    else {
                        if (this._controller.isViewBusy) {
                            if (obj.frameResults) {
                                this.onFrameResult(obj);
                            }
                            else {
                                var response = obj;
                            }
                            return true;
                        }
                    }
                }
                return false;
            };
            CaptureFrameTask.prototype.captureFrameInternal = function () {
                if (this._controller.isViewBusy) {
                    return false;
                }
                this._startedCapture = true;
                this._controller.isCapturingFrame = true;
                this._session.startCapture();
                return true;
            };
            CaptureFrameTask.prototype.onFrameResult = function (result) {
                var _this = this;
                if (!result) {
                    throw new Error("<move to resources>: frameAsync ended with no response");
                }
                if (result.succeeded) {
                    result.frames.forEach(function (frame) {
                        _this._controller.addFrame(frame);
                        _this._controller.pendingCaptureCount = _this._controller.pendingCaptureCount == 0 ? 0 : _this._controller.pendingCaptureCount - 1;
                    });
                }
                // Turn off the progress bar
                if (this._controller.pendingCaptureCount == 0) {
                    this._controller.isCapturingFrame = false;
                    if (this._startedCapture) {
                        this._startedCapture = false;
                        this._controller.completedTask(this);
                    }
                }
            };
            return CaptureFrameTask;
        }());
        Capture.CaptureFrameTask = CaptureFrameTask;
        var GetFramesTask = (function () {
            function GetFramesTask(controller, session) {
                this._controller = controller;
                this._session = session;
                this._session.addFrameProcessingEventListener(this.onFrameResult.bind(this));
            }
            GetFramesTask.prototype.start = function () {
                var _this = this;
                return new Microsoft.Plugin.Promise(function (completed, error) {
                    if (!_this.getFramesInternal()) {
                        if (error) {
                            error(new Error("Frame Not Currently Enabled"));
                        }
                    }
                    else {
                        _this._frameCompleted = completed;
                        _this._frameError = error;
                    }
                });
            };
            GetFramesTask.prototype.isCompleted = function (message) {
                if (message) {
                    var obj = JSON.parse(message);
                    if (obj.eventName) {
                        if (obj.eventName === "frameData") {
                            if (this._controller.isViewBusy) {
                            }
                        }
                    }
                    else {
                        if (this._controller.isViewBusy) {
                            if (obj.frameResults) {
                                this.onFrameResult(obj);
                            }
                            else {
                                var response = obj;
                            }
                            return true;
                        }
                    }
                }
                return false;
            };
            GetFramesTask.prototype.getFramesInternal = function () {
                if (this._controller.isViewBusy) {
                    return false;
                }
                this._session.getFrames();
                return true;
            };
            GetFramesTask.prototype.onFrameResult = function (result) {
                var _this = this;
                if (!result) {
                    throw new Error("<move to resources>: frameAsync ended with no response");
                }
                if (result.succeeded) {
                    result.frames.forEach(function (frame) {
                        _this._controller.addFrame(frame);
                    });
                }
            };
            return GetFramesTask;
        }());
        Capture.GetFramesTask = GetFramesTask;
        var SelectFrameTask = (function () {
            function SelectFrameTask(controller, session) {
                this._frame = 0;
                this._controller = controller;
                this._session = session;
            }
            Object.defineProperty(SelectFrameTask.prototype, "frame", {
                get: function () {
                    return this._frame;
                },
                set: function (theFrame) {
                    this._frame = theFrame;
                },
                enumerable: true,
                configurable: true
            });
            SelectFrameTask.prototype.start = function () {
                var _this = this;
                return new Microsoft.Plugin.Promise(function (completed, error) {
                    _this.selectFrameInternal();
                    _this._controller.completedTask(_this);
                });
            };
            SelectFrameTask.prototype.isCompleted = function (message) {
                if (message) {
                    var obj = JSON.parse(message);
                    if (obj.eventName) {
                        if (obj.eventName === "frameData") {
                            if (this._controller.isViewBusy) {
                            }
                        }
                    }
                    else {
                        if (this._controller.isViewBusy) {
                            return true;
                        }
                    }
                }
                return false;
            };
            SelectFrameTask.prototype.selectFrameInternal = function () {
                if (this._controller.isViewBusy) {
                    return false;
                }
                this._session.selectFrame(this._frame);
                return true;
            };
            return SelectFrameTask;
        }());
        Capture.SelectFrameTask = SelectFrameTask;
    })(Capture = VsGraphics.Capture || (VsGraphics.Capture = {}));
})(VsGraphics || (VsGraphics = {}));
//
// Copyright (C) Microsoft. All rights reserved.
//
/// <reference path="../../Common/Includes.ts" />
/// <reference path="../../common/controls/componentModel.ts" />
/// <reference path="../../common/controls/templateControl.ts" />
/// <reference path="../../common/util/EnumHelper.ts" />
/// <reference path="../../common/util/errorFormatter.ts" />
/// <reference path="frameTileView.ts" />
/// <reference path="ViewTasks.ts" />
var VsGraphics;
(function (VsGraphics) {
    var Capture;
    (function (Capture) {
        "use strict";
        var ViewBaseController = (function () {
            function ViewBaseController(session, initializeView) {
                var _this = this;
                if (initializeView === void 0) { initializeView = true; }
                this._screenshotHeight = 150;
                this._screenshotKeepAspectRatio = true;
                this._screenshotWidth = 200;
                // This is the guid of GpuProfilingAgent
                this._agentGuid = new Microsoft.VisualStudio.DiagnosticsHub.Guid("9e5de5fb-d655-401a-86a8-5764c252744d");
                this._activeCollectionAgentTasks = [];
                this.model = new ViewModel();
                // Note: it's up to derived classes to initialize the view.
                var receiver = function (args) {
                    _this.onMessageReceived(args);
                };
                this._standardCollector = Microsoft.VisualStudio.DiagnosticsHub.Collectors.getStandardTransportService();
                if (this._standardCollector) {
                    this._standardCollector.addMessageListener(this._agentGuid, receiver);
                }
                this._selectFrameTask = new Capture.SelectFrameTask(this, session);
            }
            Object.defineProperty(ViewBaseController.prototype, "isCollectionAgentTaskActive", {
                get: function () {
                    return this._activeCollectionAgentTasks.length > 0;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ViewBaseController.prototype, "isViewBusy", {
                get: function () {
                    return this.model.isViewBusy;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ViewBaseController.prototype, "isCapturingFrame", {
                get: function () {
                    return this.model.isCapturingFrame;
                },
                set: function (val) {
                    this.model.isCapturingFrame = val;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ViewBaseController.prototype, "pendingCaptureCount", {
                get: function () {
                    return this.model.pendingCaptureCount;
                },
                set: function (val) {
                    this.model.pendingCaptureCount = val;
                },
                enumerable: true,
                configurable: true
            });
            ViewBaseController.prototype.addTask = function (task) {
                this._activeCollectionAgentTasks.push(task);
            };
            ViewBaseController.prototype.selectFrame = function (frame) {
                this._activeCollectionAgentTasks.push(this._selectFrameTask);
                this._selectFrameTask.frame = frame;
                return this._selectFrameTask.start();
            };
            ViewBaseController.prototype.addFrame = function (frame) {
                ViewBaseController._nextIdentifier++;
                this.model.frameSummaryCollection.add(frame);
            };
            ViewBaseController.prototype.reset = function () {
                ViewBaseController._nextIdentifier = 1;
                this.model.frameSummaryCollection.clear();
                Capture.s_ViewHost.onIdle();
            };
            ViewBaseController.prototype.sendStringToCollectionAgent = function (request) {
                return this._standardCollector.sendStringToCollectionAgent(this._agentGuid.toString(), request);
            };
            ViewBaseController.prototype.downloadFile = function (targetFilePath, localFilePath) {
                var transportService = Microsoft.VisualStudio.DiagnosticsHub.Collectors.getStandardTransportService();
                return transportService.downloadFile(targetFilePath, localFilePath);
            };
            ViewBaseController.prototype.onMessageReceived = function (message) {
                if (message) {
                    try {
                        var obj = JSON.parse(message);
                    }
                    catch (e) {
                        // If we get a non-JSON message here just ignore it
                        return;
                    }
                    if (obj.eventName) {
                        switch (obj.eventName) {
                            default:
                                break;
                        }
                    }
                }
                for (var i = this._activeCollectionAgentTasks.length - 1; i >= 0; i--) {
                    if (this._activeCollectionAgentTasks[i].isCompleted(message)) {
                        this._activeCollectionAgentTasks.splice(i, 1);
                    }
                }
            };
            ViewBaseController.prototype.completedTask = function (task) {
                var i = this._activeCollectionAgentTasks.indexOf(task);
                if (i >= 0)
                    this._activeCollectionAgentTasks.splice(i, 1);
            };
            ViewBaseController.prototype.sendMessage = function (message) {
                this._standardCollector.sendStringToCollectionAgent(this._agentGuid.toString(), message).done(function (response) {
                    if (response) {
                        var obj = JSON.parse(response);
                        if (!obj.succeeded) {
                            throw new Error(obj.errorMessage);
                        }
                    }
                });
            };
            ViewBaseController.prototype.appIsReadyToCapture = function () {
                this.view.appIsReadyToCapture();
            };
            ViewBaseController._frameChunkSize = 32768;
            ViewBaseController._nextIdentifier = 1;
            return ViewBaseController;
        }());
        Capture.ViewBaseController = ViewBaseController;
        var ViewModel = (function (_super) {
            __extends(ViewModel, _super);
            function ViewModel() {
                _super.call(this);
                this._warningMessage = "";
                this._latestFrameError = null;
                this._isCapturingFrame = false;
                this._pendingCaptureCount = 0;
                this._frameSummaryCollection = new VsGraphics.Common.Controls.ObservableCollection();
            }
            Object.defineProperty(ViewModel.prototype, "frameSummaryCollection", {
                get: function () { return this._frameSummaryCollection; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ViewModel.prototype, "warningMessage", {
                get: function () { return this._warningMessage; },
                set: function (v) {
                    if (this._warningMessage !== v) {
                        this._warningMessage = v;
                        this.raisePropertyChanged("warningMessage");
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ViewModel.prototype, "latestFrameError", {
                get: function () { return this._latestFrameError; },
                set: function (v) {
                    if (this._latestFrameError !== v) {
                        this._latestFrameError = v;
                        this.raisePropertyChanged("latestFrameError");
                        // Create the WER
                        Capture.s_ViewHost.reportError(v, "FrameCapturingFailure");
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ViewModel.prototype, "isCapturingFrame", {
                get: function () { return this._isCapturingFrame; },
                set: function (v) {
                    if (this._isCapturingFrame !== v) {
                        this._isCapturingFrame = v;
                        this.raisePropertyChanged("isCapturingFrame");
                        this.raisePropertyChanged("isViewBusy");
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ViewModel.prototype, "pendingCaptureCount", {
                get: function () {
                    return this._pendingCaptureCount;
                },
                set: function (val) {
                    if (this._pendingCaptureCount !== val) {
                        this._pendingCaptureCount = val;
                        this.raisePropertyChanged("pendingCaptureCount");
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ViewModel.prototype, "isViewBusy", {
                get: function () { return this._isCapturingFrame; },
                enumerable: true,
                configurable: true
            });
            return ViewModel;
        }(VsGraphics.Common.Controls.ObservableViewModel));
        Capture.ViewModel = ViewModel;
        var View = (function (_super) {
            __extends(View, _super);
            function View(controller, model, template) {
                _super.call(this, template);
                this.controller = controller;
                this.model = model;
                this.model.registerPropertyChanged(this);
                this.model.frameSummaryCollection.registerCollectionChanged(this);
                this._frameTileViewModelCollection = [];
                this.tilesContainer = this.findElement("tilesContainer");
                this._warningSection = this.findElement("warningSection");
            }
            Object.defineProperty(View.prototype, "frameTileViewModelCollection", {
                get: function () {
                    return this._frameTileViewModelCollection;
                },
                enumerable: true,
                configurable: true
            });
            View.prototype.onPropertyChanged = function (propertyName) {
                switch (propertyName) {
                    case "warningMessage":
                        this.showWarningMessage(this.model.warningMessage);
                        break;
                }
            };
            View.prototype.onCollectionChanged = function (eventArgs) {
                switch (eventArgs.action) {
                    case VsGraphics.Common.Controls.NotifyCollectionChangedAction.Add:
                        this.createTile(eventArgs.newItems[0]);
                        break;
                    case VsGraphics.Common.Controls.NotifyCollectionChangedAction.Reset:
                        this.removeFrameTiles();
                        break;
                }
            };
            View.prototype.removeFrameTiles = function () {
                this._frameTileViewModelCollection = [];
            };
            View.prototype.insertFrameTile = function (tile) {
                // Default is to just append
                this.tilesContainer.appendChild(tile.rootElement);
            };
            View.prototype.createTile = function (frameSummary) {
                // Create the model and the view
                var model = new Capture.FrameTileViewModel(frameSummary);
                var newTile = new Capture.FrameTileView(this.controller, model);
                this._frameTileViewModelCollection.push(model);
                // Turn off links if we are busy right now
                model.enabled = !this.model.isViewBusy;
                // Call our overload to insert the tile
                this.insertFrameTile(newTile);
            };
            View.prototype.showWarningMessage = function (warning) {
                if (!this._warningSection) {
                    return;
                }
                if (warning) {
                    this._warningSection.innerHTML = warning;
                    this._warningSection.style.display = "inline";
                }
                else {
                    this._warningSection.innerHTML = "";
                    this._warningSection.style.display = "none";
                }
            };
            View.prototype.appIsReadyToCapture = function () {
                // Implemented by the derived class.
            };
            return View;
        }(VsGraphics.Common.Controls.TemplateControl));
        Capture.View = View;
    })(Capture = VsGraphics.Capture || (VsGraphics.Capture = {}));
})(VsGraphics || (VsGraphics = {}));
//
// Copyright (C) Microsoft. All rights reserved.
//
/// <reference path="../../Common/Includes.ts" />
/// <reference path="IFrame.d.ts" />
var VsGraphics;
(function (VsGraphics) {
    var Capture;
    (function (Capture) {
        "use strict";
        //
        // HostSessionProxy provides access to the Session which is implemented in the host
        //
        var HostSessionProxy = (function () {
            function HostSessionProxy() {
                this._sessionProxy = Microsoft.Plugin.Utilities.JSONMarshaler.attachToPublishedObject("GpuCapture.GpuCaptureSession", {}, true);
            }
            HostSessionProxy.prototype.addViewTypeEventListener = function (callback) {
                this._sessionProxy.addEventListener("viewtypechange", callback);
            };
            HostSessionProxy.prototype.getSessionInfo = function () {
                return this._sessionProxy._call("getSessionInfo");
            };
            HostSessionProxy.prototype.openFrameDetails = function (frameIndex, targetView) {
                return this._sessionProxy._call("openFrameDetails", frameIndex, targetView);
            };
            HostSessionProxy.prototype.getTempFilename = function (baseName) {
                return this._sessionProxy._call("getTempFilename", baseName);
            };
            HostSessionProxy.prototype.save = function () {
                return this._sessionProxy._call("save");
            };
            HostSessionProxy.prototype.addFrameProcessingEventListener = function (callback) {
                this._sessionProxy.addEventListener("frameProcessingComplete", callback);
            };
            HostSessionProxy.prototype.getFrameProcessingResults = function () {
                return this._sessionProxy._call("getFrameProcessingResults");
            };
            HostSessionProxy.prototype.getSessionStartupTime = function () {
                return this._sessionProxy._call("getSessionStartupTime");
            };
            HostSessionProxy.prototype.logCommandUsage = function (commandName, invokeMethod, source) {
                return this._sessionProxy._call("logCommandUsage", commandName, invokeMethod, source);
            };
            HostSessionProxy.prototype.logBeginLoadFrames = function () {
                return this._sessionProxy._call("logBeginLoadFrames");
            };
            HostSessionProxy.prototype.logEndLoadFrames = function () {
                return this._sessionProxy._call("logEndLoadFrames");
            };
            HostSessionProxy.prototype.setScriptedContextId = function (scriptedContextId) {
                return this._sessionProxy._call("setScriptedContextId", scriptedContextId);
            };
            HostSessionProxy.prototype.updateDetailsViewSetting = function (settingName, newValue) {
                return this._sessionProxy._call("updateDetailsViewSetting", settingName, newValue);
            };
            HostSessionProxy.prototype.getMaxFramesToCapture = function () {
                return this._sessionProxy._call("getMaxFramesToCapture");
            };
            HostSessionProxy.prototype.setNumFramesToCapture = function (numFramesToCapture) {
                return this._sessionProxy._call("setNumFramesToCapture", numFramesToCapture);
            };
            HostSessionProxy.prototype.addNumFramesToCaptureChangedEventListener = function (callback) {
                this._sessionProxy.addEventListener("numFramesToCaptureChanged", callback);
            };
            HostSessionProxy.prototype.startCapture = function () {
                return this._sessionProxy._call("startCapture");
            };
            HostSessionProxy.prototype.scriptedSandboxReadyToCapture = function () {
                return this._sessionProxy._call("scriptedSandboxReadyToCapture");
            };
            HostSessionProxy.prototype.selectFrame = function (frame) {
                return this._sessionProxy._call("selectFrame", frame);
            };
            HostSessionProxy.prototype.getFrames = function () {
                return this._sessionProxy._call("getFrames");
            };
            HostSessionProxy.prototype.addFrameCaptureBeginEventListener = function (callback) {
                this._sessionProxy.addEventListener("frameCaptureBegin", callback);
            };
            HostSessionProxy.prototype.addReadyToCaptureEventListener = function (callback) {
                this._sessionProxy.addEventListener("readyToCapture", callback);
            };
            return HostSessionProxy;
        }());
        Capture.HostSessionProxy = HostSessionProxy;
    })(Capture = VsGraphics.Capture || (VsGraphics.Capture = {}));
})(VsGraphics || (VsGraphics = {}));
//
// Copyright (C) Microsoft. All rights reserved.
//
/// <reference path="../../Common/Includes.ts" />
/// <reference path="Session.ts" />
/// <reference path="../../Common/controls/control.ts" />
var VsGraphics;
(function (VsGraphics) {
    var Capture;
    (function (Capture) {
        "use strict";
        var ViewHostBase = (function () {
            function ViewHostBase() {
                this._openCodeMarkers = {};
                Capture.s_ViewHost = this;
            }
            Object.defineProperty(ViewHostBase.prototype, "session", {
                get: function () { return this._session; },
                enumerable: true,
                configurable: true
            });
            ViewHostBase.prototype.loadView = function () {
                var _this = this;
                Microsoft.Plugin.addEventListener("pluginready", function () {
                    var session;
                    Microsoft.Plugin.Tooltip.defaultTooltipContentToHTML = false;
                    session = new Capture.HostSessionProxy();
                    _this._session = session;
                    _this.initializeErrorReporting();
                    Microsoft.Plugin.addEventListener("close", _this.onClose);
                    session.getSessionInfo().done(function (sessionInfo) {
                        _this.initializeView(sessionInfo);
                        _this.onIdle();
                    });
                });
            };
            ViewHostBase.prototype.initializeErrorReporting = function () {
                var _this = this;
                // Stop reporting errors to the WER service
                window.onerror = function (message, url, line, column, error) {
                    _this.reportError(new Error(message), "Unhandled Error", url, line, column);
                    return true;
                };
            };
            ViewHostBase.prototype.onIdle = function () {
                //Plugin.VS.Internal.CodeMarkers.fire(CodeMarkerValues.perfBrowserTools_MemoryProfilerIdle);
            };
            ViewHostBase.prototype.reportError = function (error, additionalInfo, source, line, column) {
                // Depending on the source, the error object will be different
                var message = (error.message || error.description);
                var url = source || "VsGraphics.Capture";
                var lineNumber = line || 0;
                var columnNumber = column || 0;
                var errorInfo = "Error description:  " + message;
                if (error.number) {
                    errorInfo += "\r\nError number:  " + error.number;
                }
                if (source) {
                    errorInfo += "\r\nSource:  " + source;
                }
                if (error.stack) {
                    var stack = error.stack;
                    errorInfo += "\r\nError stack:  " + stack;
                    // Find message if we dont have one already
                    if (!message) {
                        var index = stack.indexOf("\n");
                        if (index > 0) {
                            index = Math.min(index, 50);
                            message = stack.substring(0, index);
                        }
                    }
                    // Find url
                    if (typeof source === "undefined") {
                        var matchInfo = stack.match(/(file|res):?([^)]+)\)/);
                        if (matchInfo && matchInfo.length > 2) {
                            url = matchInfo[2];
                        }
                    }
                    // Find line number
                    if (typeof line === "undefined") {
                        matchInfo = stack.match(/line ?(\d+)/);
                        if (!matchInfo || matchInfo.length <= 1) {
                            matchInfo = stack.match(/js:?(\d+):/);
                        }
                        if (matchInfo && matchInfo.length > 1) {
                            lineNumber = parseInt(matchInfo[1]);
                        }
                    }
                }
                if (additionalInfo) {
                    errorInfo += "\r\nAdditional Info:  " + additionalInfo;
                }
                Microsoft.Plugin.Diagnostics.reportError(message, url, lineNumber, errorInfo, columnNumber);
            };
            ViewHostBase.prototype.onClose = function () {
                //Plugin.VS.Internal.CodeMarkers.fire(CodeMarkerValues.perfBrowserTools_MemoryProfilerWindowClose);
            };
            ViewHostBase.prototype.initializeView = function (sessionInfo) {
                // Nothing here. The subclasses override it.
            };
            return ViewHostBase;
        }());
        Capture.ViewHostBase = ViewHostBase;
    })(Capture = VsGraphics.Capture || (VsGraphics.Capture = {}));
})(VsGraphics || (VsGraphics = {}));
//
// Copyright (C) Microsoft. All rights reserved.
//
/// <reference path="../../Common/Includes.ts" />
/// <reference path="../../common/controls/componentModel.ts" />
/// <reference path="../../common/controls/templateControl.ts" />
/// <reference path="../../common/util/EnumHelper.ts" />
/// <reference path="../../common/util/errorFormatter.ts" />
/// <reference path="frameTileView.ts" />
/// <reference path="ViewHostBase.ts" />
/// <reference path="ViewTasks.ts" />
/// <reference path="IView.d.ts" />
/// <reference path="ViewBase.ts" />
var VsGraphics;
(function (VsGraphics) {
    var Capture;
    (function (Capture) {
        "use strict";
        var AnalysisViewController = (function (_super) {
            __extends(AnalysisViewController, _super);
            function AnalysisViewController(session, initializeView) {
                if (initializeView === void 0) { initializeView = true; }
                _super.call(this, session, initializeView);
                if (initializeView) {
                    this.view = new AnalysisView(this, this.model);
                }
                // Kick off a task to gather the current list of frames
                var task = new Capture.GetFramesTask(this, session);
                _super.prototype.addTask.call(this, task);
                task.start();
            }
            return AnalysisViewController;
        }(Capture.ViewBaseController));
        Capture.AnalysisViewController = AnalysisViewController;
        var AnalysisView = (function (_super) {
            __extends(AnalysisView, _super);
            function AnalysisView(controller, model) {
                _super.call(this, controller, model, "AnalysisViewTemplate");
            }
            return AnalysisView;
        }(Capture.View));
        Capture.AnalysisView = AnalysisView;
    })(Capture = VsGraphics.Capture || (VsGraphics.Capture = {}));
})(VsGraphics || (VsGraphics = {}));
//
// Copyright (C) Microsoft. All rights reserved.
//
/// <reference path="../../Common/Includes.ts" />
/// <reference path="../../common/controls/componentModel.ts" />
/// <reference path="../../common/controls/templateControl.ts" />
/// <reference path="../../common/util/EnumHelper.ts" />
/// <reference path="../../common/util/errorFormatter.ts" />
/// <reference path="frameTileView.ts" />
/// <reference path="ViewHostBase.ts" />
/// <reference path="ViewTasks.ts" />
/// <reference path="IView.d.ts" />
/// <reference path="ViewBase.ts" />
var VsGraphics;
(function (VsGraphics) {
    var Capture;
    (function (Capture) {
        "use strict";
        var CollectionViewController = (function (_super) {
            __extends(CollectionViewController, _super);
            function CollectionViewController(session, initializeView) {
                if (initializeView === void 0) { initializeView = true; }
                _super.call(this, session, initializeView);
                this._session = session;
                if (initializeView) {
                    this.view = new CollectionView(this, this.model);
                }
                this._captureFrameTask = new Capture.CaptureFrameTask(this, session);
            }
            CollectionViewController.prototype.captureFrame = function () {
                _super.prototype.addTask.call(this, this._captureFrameTask);
                return this._captureFrameTask.start();
            };
            CollectionViewController.prototype.readyToCapture = function () {
                this._captureFrameTask.setReady();
            };
            CollectionViewController.prototype.getMaxFramesToCapture = function () {
                return this._session.getMaxFramesToCapture();
            };
            CollectionViewController.prototype.setNumFramestoCapture = function (numFramesToCapture) {
                this._session.setNumFramesToCapture(numFramesToCapture);
            };
            return CollectionViewController;
        }(Capture.ViewBaseController));
        Capture.CollectionViewController = CollectionViewController;
        var CollectionView = (function (_super) {
            __extends(CollectionView, _super);
            function CollectionView(controller, model) {
                var _this = this;
                _super.call(this, controller, model, "CollectionViewTemplate");
                this._controller = controller;
                this._onNumFramesToCaptureChangeHandler = this.onNumFramesToCaptureChange.bind(this);
                this._onFrameClickHandler = this.onFrameClick.bind(this);
                var numFramesToCaptureLabel = this.findElement("numFramesToCaptureLabel");
                numFramesToCaptureLabel.innerText = Microsoft.Plugin.Resources.getString("NumFramesToCaptureLabel");
                this._numFramesToCaptureCombo = this.findElement("framesToCaptureCombo");
                this._numFramesToCaptureCombo.setAttribute("aria-label", Microsoft.Plugin.Resources.getString("NumFramesToCaptureComboAutomationName"));
                this._captureFrameTile = this.findElement("captureFrameTile");
                this._toolbarCaptureButton = this.findElement("toolbarCaptureFrameButton");
                this._toolbarCaptureLabel = this.findElement("toolbarCaptureFrameLabel");
                this._toolbarCaptureLabel.innerText = Microsoft.Plugin.Resources.getString("CaptureFrame");
                this._frameProgress = this.findElement("captureFrameProgress");
                this._frameButton = this.findElement("captureFrameButton");
                this._frameLabel = this.findElement("captureFrameLabel");
                this._frameIcon = this.findElement("captureFrameIcon");
                this._frameLabel.innerText = Microsoft.Plugin.Resources.getString("CaptureFrame");
                this._frameProgress.innerText = Microsoft.Plugin.Resources.getString("Loading");
                this.toggleProgress(controller.isViewBusy);
                this.updateCaptureFrameButton();
                this._controller.getMaxFramesToCapture().done(function (maxFramesToCapture) {
                    for (var i = 1; i <= maxFramesToCapture; i++) {
                        var optionElement = document.createElement("option");
                        optionElement.innerText = i.toString();
                        _this._numFramesToCaptureCombo.appendChild(optionElement);
                    }
                });
                this._numFramesToCaptureCombo.addEventListener("change", this._onNumFramesToCaptureChangeHandler);
                this._toolbarCaptureButton.addEventListener("click", this._onFrameClickHandler);
                this._toolbarCaptureButton.addEventListener("keypress", this._onFrameClickHandler);
                this._captureFrameTile.addEventListener("click", this._onFrameClickHandler);
                this._captureFrameTile.addEventListener("keypress", this._onFrameClickHandler);
                this._captureFrameTile.hidden = true; // Hide until capture is ready, usable; otherwise, clicking it has no effect.
                // Support the "active" state. We can't use the :active pseudostate because it only works
                // on buttons
                this._captureFrameTile.onmousedown = function () {
                    this._captureFrameTile.classList.add("active");
                }.bind(this);
                this._captureFrameTile.onmouseup = function () {
                    this._captureFrameTile.classList.remove("active");
                }.bind(this);
                this._captureFrameTile.onmouseleave = function () {
                    this._captureFrameTile.classList.remove("active");
                }.bind(this);
            }
            CollectionView.prototype.UpdateNumFramesToCaptureSelection = function (numFramesToCapture) {
                if (this._numFramesToCaptureCombo != null) {
                    for (var i = 0; i < this._numFramesToCaptureCombo.length; i++) {
                        if (this._numFramesToCaptureCombo[i].innerText == numFramesToCapture.toString()) {
                            this._numFramesToCaptureCombo[i].selected = true;
                        }
                    }
                }
            };
            CollectionView.prototype.appIsReadyToCapture = function () {
                this._captureFrameTile.hidden = false;
            };
            CollectionView.prototype.onPropertyChanged = function (propertyName) {
                _super.prototype.onPropertyChanged.call(this, propertyName);
                switch (propertyName) {
                    case "isCapturingFrame":
                        this.toggleProgress(this.controller.isViewBusy);
                        this.updateCaptureFrameButton();
                        this.updateFrameAnalyzeButtons();
                        break;
                }
            };
            CollectionView.prototype.removeFrameTiles = function () {
                while (this.tilesContainer.hasChildNodes()) {
                    this.tilesContainer.removeChild(this.tilesContainer.firstChild);
                }
                this.tilesContainer.appendChild(this._captureFrameTile);
                _super.prototype.removeFrameTiles.call(this);
            };
            CollectionView.prototype.insertFrameTile = function (tile) {
                // For collection, we want to insert tiles before the capture frame tile
                this.tilesContainer.insertBefore(tile.rootElement, this._captureFrameTile);
                // Then make sure the capture frame tile stays visible
                this._captureFrameTile.scrollIntoView(true);
                // Give focus to the new tile so it leaves the capture frame tile
                tile.setFocus();
            };
            CollectionView.prototype.toggleProgress = function (show) {
                if (this._frameProgress) {
                    if (show) {
                        this._frameLabel.style.display = "none";
                        this._frameIcon.style.display = "none";
                        this._frameProgress.style.display = "block";
                        this._frameButton.style.display = "none";
                        this._frameButton.setAttribute("aria-label", Microsoft.Plugin.Resources.getString("Loading"));
                    }
                    else {
                        this._frameLabel.style.display = "";
                        this._frameIcon.style.display = "";
                        this._frameProgress.style.display = "none";
                        this._frameButton.style.display = "block";
                        this._frameButton.setAttribute("aria-label", Microsoft.Plugin.Resources.getString("CaptureFrame"));
                    }
                }
            };
            CollectionView.prototype.onNumFramesToCaptureChange = function (e) {
                var selectElement = e.srcElement;
                var numFramesToCapture = selectElement.options.item(selectElement.selectedIndex).innerText;
                this._controller.setNumFramestoCapture(parseInt(numFramesToCapture));
            };
            CollectionView.prototype.onFrameClick = function (e) {
                this._controller.captureFrame();
            };
            CollectionView.prototype.updateCaptureFrameButton = function () {
                if (this._frameButton) {
                    if (!this.model.isViewBusy) {
                        this._frameButton.classList.remove("disabled");
                        this._frameButton.disabled = false;
                    }
                    else {
                        this._frameButton.disabled = true;
                    }
                }
            };
            CollectionView.prototype.updateFrameAnalyzeButtons = function () {
                var _this = this;
                this.frameTileViewModelCollection.forEach(function (m) {
                    m.enabled = !_this.model.isViewBusy; // Should fire a property changed event that will cause the link to disable itself
                });
            };
            return CollectionView;
        }(Capture.View));
        Capture.CollectionView = CollectionView;
    })(Capture = VsGraphics.Capture || (VsGraphics.Capture = {}));
})(VsGraphics || (VsGraphics = {}));
//
// Copyright (C) Microsoft. All rights reserved.
//
/// <reference path="../../Common/Includes.ts" />
/// <reference path="Session.ts" />
/// <reference path="../../Common/controls/control.ts" />
/// <reference path="../../Common/controls/componentModel.ts" />
/// <reference path="ViewHostBase.ts" />
/// <reference path="AnalysisView.ts" />
var VsGraphics;
(function (VsGraphics) {
    var Capture;
    (function (Capture) {
        "use strict";
        var AnalysisViewHost = (function (_super) {
            __extends(AnalysisViewHost, _super);
            function AnalysisViewHost() {
                _super.call(this);
            }
            AnalysisViewHost.prototype.onPropertyChanged = function (propertyName) {
            };
            AnalysisViewHost.prototype.initializeView = function (sessionInfo) {
                this.viewController = new Capture.AnalysisViewController(this.session);
                var mainContainer = document.getElementById('mainContainer');
                mainContainer.appendChild(this.viewController.view.rootElement);
                this.viewController.model.registerPropertyChanged(this);
                this.initCommands();
            };
            AnalysisViewHost.prototype.initCommands = function () {
            };
            return AnalysisViewHost;
        }(Capture.ViewHostBase));
        Capture.AnalysisViewHost = AnalysisViewHost;
        Capture.AnalysisViewHostInstance = new AnalysisViewHost();
    })(Capture = VsGraphics.Capture || (VsGraphics.Capture = {}));
})(VsGraphics || (VsGraphics = {}));
//
// Copyright (C) Microsoft. All rights reserved.
//
/// <reference path="../../Common/Includes.ts" />
/// <reference path="../../Common/controls/componentModel.ts" />
/// <reference path="CollectionViewHost.ts" />
var VsGraphics;
(function (VsGraphics) {
    var Capture;
    (function (Capture) {
        "use strict";
    })(Capture = VsGraphics.Capture || (VsGraphics.Capture = {}));
})(VsGraphics || (VsGraphics = {}));
//
// Copyright (C) Microsoft. All rights reserved.
//
/// <reference path="../../Common/Includes.ts" />
/// <reference path="Session.ts" />
/// <reference path="../../Common/controls/control.ts" />
/// <reference path="../../Common/controls/componentModel.ts" />
/// <reference path="ViewHostBase.ts" />
/// <reference path="CollectionView.ts" />
/// <reference path="VsPluginCommandHelper.ts" />
var VsGraphics;
(function (VsGraphics) {
    var Capture;
    (function (Capture) {
        "use strict";
        var CollectionViewHost = (function (_super) {
            __extends(CollectionViewHost, _super);
            function CollectionViewHost() {
                _super.call(this);
            }
            CollectionViewHost.prototype.sessionStateChanged = function (eventArgs) {
                var currentState = eventArgs.currentState;
                switch (currentState) {
                    case 400 /* CollectionFinishing */:
                        //CollectionViewHost.CommandChain.onCollectionFinishing();
                        break;
                    case 500 /* CollectionFinished */:
                        Microsoft.VisualStudio.DiagnosticsHub.getCurrentSession().removeStateChangedEventListener(this.sessionStateChanged);
                        // Have session persist our session metadata now
                        var eventCompleteDeferral = eventArgs.getDeferral();
                        var onSaveCompleted = function (value) {
                            eventCompleteDeferral.complete();
                        };
                        this.session.save().done(onSaveCompleted);
                        break;
                }
            };
            CollectionViewHost.prototype.onPropertyChanged = function (propertyName) {
                //CollectionViewHost.CommandChain.onPropertyChanged(propertyName);
            };
            CollectionViewHost.prototype.initializeView = function (sessionInfo) {
                this.collectionViewController = new Capture.CollectionViewController(this.session);
                var mainContainer = document.getElementById('mainContainer');
                mainContainer.appendChild(this.collectionViewController.view.rootElement);
                this.collectionViewController.model.registerPropertyChanged(this);
                Microsoft.VisualStudio.DiagnosticsHub.getCurrentSession().addStateChangedEventListener(this.sessionStateChanged.bind(this));
                //Microsoft.Plugin.addEventListener("close", () => {
                //    CollectionViewHost.CommandChain.onClose();
                //});
                this.session.addNumFramesToCaptureChangedEventListener(this.onNumFramesToCaptureChanged.bind(this));
                this.session.addFrameCaptureBeginEventListener(this.onCaptureBegin.bind(this));
                // Add this message box to simulate a scripted sandbox being slower to initialize than the experiment/app.
                // window.alert("wait");
                this.session.addReadyToCaptureEventListener(this.onReadyToCapture.bind(this));
                this.session.scriptedSandboxReadyToCapture();
                this.appReadyToCapture = false;
                this.initCommands();
            };
            CollectionViewHost.prototype.initCommands = function () {
                //if (Microsoft.Plugin.VS && Microsoft.Plugin.VS.Commands) {
                //    var captureFrameCommand = new CaptureFrameCommand(this);
                //    CollectionViewHost.CommandChain = captureFrameCommand;
                //    var toolbar = new Microsoft.VisualStudio.DiagnosticsHub.Toolbar();
                //    toolbar.addToolbarItem(captureFrameCommand);
                //    var toolbarSection = document.getElementsByClassName('toolbarSection')[0];
                //    toolbarSection.appendChild(toolbar.container);
                //}
            };
            CollectionViewHost.prototype.onNumFramesToCaptureChanged = function (result) {
                if (!result) {
                    throw new Error("<move to resources>: onNumFramesToCaptureChanged ended with no response");
                }
                this.collectionViewController.view.UpdateNumFramesToCaptureSelection(result.numFramesToCapture);
            };
            CollectionViewHost.prototype.onCaptureBegin = function (result) {
                if (!result) {
                    throw new Error("<move to resources>: frameAsync ended with no response");
                }
                // Indicate we are capturing
                if (this.appReadyToCapture) {
                    this.collectionViewController.isCapturingFrame = true;
                    this.collectionViewController.pendingCaptureCount = result.numberOfFrames;
                }
            };
            CollectionViewHost.prototype.onReadyToCapture = function (result) {
                if (!result) {
                    throw new Error("<move to resources>: frameAsync ended with no response");
                }
                // Indicate we are ready to capture
                this.appReadyToCapture = true;
                this.collectionViewController.readyToCapture();
            };
            return CollectionViewHost;
        }(Capture.ViewHostBase));
        Capture.CollectionViewHost = CollectionViewHost;
        Capture.CollectionViewHostInstance = new CollectionViewHost();
    })(Capture = VsGraphics.Capture || (VsGraphics.Capture = {}));
})(VsGraphics || (VsGraphics = {}));
/// <reference path="..\Common\Includes.ts" />
var Microsoft;
(function (Microsoft) {
    var GpuProfiling;
    (function (GpuProfiling) {
        var GpuProfilingDetailsControl = (function () {
            function GpuProfilingDetailsControl(config) {
                // View activation
                this._isActive = false;
                // Data warehouse
                this._dataWarehouse = null;
                // Local fields
                this._loadingDetails = false;
                this._E_ACCESSDENIED = 0x80070005;
                this._E_OUTOFMEMORY = 0x8007000E;
                if (config && config.viewId) {
                    this._config = config;
                    this._viewId = config.viewId;
                }
                else {
                    throw new Error("Invalid Config.");
                }
                this._vsSession = Microsoft.Plugin.Utilities.JSONMarshaler.attachToPublishedObject("GpuProfiler.GpuProfilingSession", {}, true);
                this.setInitialControls();
                // Register our callback function for when VS has finished loading details data
                this._vsSession.addEventListener("gpudetailsloaded", this.onGpuDetailsLoaded.bind(this));
                // Register our callback function to handle test automation
                this._vsSession.addEventListener("testopendetails", this.onGpuDetailsOpenTest.bind(this));
                this._viewEventManager = Microsoft.VisualStudio.DiagnosticsHub.getViewEventManager();
                this._viewEventManager.selectionChanged.addEventListener(this.onRulerSelectionChanged.bind(this));
                // Set our timespan to zero to begin with
                this._timeSpan = new Microsoft.VisualStudio.DiagnosticsHub.JsonTimespan(new Microsoft.VisualStudio.DiagnosticsHub.BigNumber(0, 0), new Microsoft.VisualStudio.DiagnosticsHub.BigNumber(0, 0));
                // Load the DataWarehouse
                Microsoft.VisualStudio.DiagnosticsHub.DataWarehouse.loadDataWarehouse()
                    .then(function (dw) {
                    this._dataWarehouse = dw;
                    // Notify the hub that we have loaded our view
                    this._viewEventManager.detailsViewReady.raiseEvent({
                        Id: this._viewId
                    });
                    // When we first load up, query the analyzer to see if there were any errors during analysis
                    this.checkAnalysisErrors();
                }.bind(this));
            }
            GpuProfilingDetailsControl.prototype.onGpuDetailsLoaded = function (args) {
                this._loadingDetails = false;
                this.showLink();
            };
            GpuProfilingDetailsControl.prototype.onGpuDetailsOpenTest = function (args) {
                this.loadGpuDetailsDataFromTime(args.startTime, args.endTime);
            };
            GpuProfilingDetailsControl.prototype.checkAnalysisErrors = function () {
                // Request Error check data from our analyzer
                var customData = {
                    task: "ERRORCHECK"
                };
                var contextData = {
                    customDomain: customData,
                };
                var dataPromise = this._dataWarehouse.getFilteredData(contextData, "9187AE0A-6018-4ADA-BA36-43D4E9BE0834");
                dataPromise.then(function (result) {
                    var myResult = result.getResult("");
                    myResult.then(function (realResult) {
                        // Since JS Number values are unsigned do a quick convert here if needed
                        if (realResult.HRESULT < 0) {
                            this._analysisHResult = 0x100000000 + realResult.HRESULT;
                        }
                        else {
                            this._analysisHResult = realResult.HRESULT;
                        }
                        // Hide / Show the main controls or warnings based on analysis results from the infosource
                        // Good Result
                        if (this._analysisHResult == 0x0) {
                            var linkDiv = document.getElementById("Gpu-Details-Main");
                            linkDiv.style.visibility = "visible";
                        }
                        else if ((this._analysisHResult == this._E_ACCESSDENIED) || (this._analysisHResult == this._E_OUTOFMEMORY)) {
                            var warningDiv = document.getElementById("Analysis-Warnings-Container");
                            warningDiv.style.visibility = "visible";
                            var warningSpan = document.getElementById("Analysis-Warnings-Span");
                            warningSpan.innerText = Microsoft.Plugin.Resources.getString("ProfilingAnalysisMemoryError");
                        }
                        else {
                            var warningDiv = document.getElementById("Analysis-Warnings-Container");
                            warningDiv.style.visibility = "visible";
                            var warningSpan = document.getElementById("Analysis-Warnings-Span");
                            warningSpan.innerText = Microsoft.Plugin.Resources.getString("ProfilingAnalysisOtherError", this._analysisHResult.toString(16));
                        }
                    }.bind(this));
                }.bind(this));
            };
            // Grab data from our infosource and load it into shared memory
            // pass back to VS the location and details of that memory
            GpuProfilingDetailsControl.prototype.loadGpuDetailsData = function () {
                var startString = this._timeSpan.begin.value;
                var endString = this._timeSpan.end.value;
                this.loadGpuDetailsDataFromTime(startString, endString);
            };
            GpuProfilingDetailsControl.prototype.loadGpuDetailsDataFromTime = function (startTime, endTime) {
                // Prevent the user from loading another chunk until the first is loaded
                if (!this._loadingDetails) {
                    this._loadingDetails = true;
                    this.hideLink();
                    this._dataWarehouse.getContextService().getGlobalContext()
                        .then(function (context) {
                        this._context = context;
                        // After we have grabbed the global context, call into the data warehouse to get data
                        var dataPromise = this._dataWarehouse.getData(context.getContextId(), "9187AE0A-6018-4ADA-BA36-43D4E9BE0834");
                        dataPromise.then(function (result) {
                            var timespanString = startTime + ":" + endTime;
                            var myResult = result.getResult(timespanString);
                            myResult.then(function (realResult) {
                                this._vsSession._call("asyncOpenGpuDetails", realResult);
                            }.bind(this));
                        }.bind(this));
                    }.bind(this));
                }
            };
            GpuProfilingDetailsControl.prototype.setInitialControls = function () {
                var prefix1 = document.getElementById("detailsPrefix1");
                prefix1.innerText = Microsoft.Plugin.Resources.getString("ProfilingSelectMessagePrefix1");
                var prefix2 = document.getElementById("detailsPrefix2");
                prefix2.innerText = Microsoft.Plugin.Resources.getString("ProfilingSelectMessagePrefix2");
                var suffix = document.getElementById("detailsSuffix");
                suffix.innerText = Microsoft.Plugin.Resources.getString("ProfilingSelectMessageSuffix");
                this._detailsLink = document.getElementById("detailsLink");
                this._detailsLink.href = "javascript:void(null);";
                this._detailsLink.innerText = Microsoft.Plugin.Resources.getString("ProfilingSelectMessageLink");
                this._detailsLink.addEventListener("click", this.openDetailsPage.bind(this));
                // External Tools Controls
                var wpaLink = document.getElementById("wpaLink");
                wpaLink.href = "javascript:void(null);";
                wpaLink.addEventListener("click", this.openWpaLink.bind(this));
                wpaLink.style.visibility = "hidden";
                wpaLink.innerText = Microsoft.Plugin.Resources.getString("WpaLinkText");
                wpaLink.title = Microsoft.Plugin.Resources.getString("WpaLinkTitle");
                var gpuViewLink = document.getElementById("gpuViewLink");
                gpuViewLink.href = "javascript:void(null);";
                gpuViewLink.addEventListener("click", this.openGpuViewLink.bind(this));
                gpuViewLink.style.visibility = "hidden";
                gpuViewLink.innerText = Microsoft.Plugin.Resources.getString("GpuViewLinkText");
                gpuViewLink.title = Microsoft.Plugin.Resources.getString("GpuViewLinkTitle");
                this.checkWpaAvailable();
                this.checkGpuViewAvailable();
                var progressSpan = document.getElementById("inProgressSpan");
                progressSpan.innerText = Microsoft.Plugin.Resources.getString("ProfilingInProgressMessage");
                // Initially hide all controls (don't enable until we know our analysis was correct)
                var linkDiv = document.getElementById("Gpu-Details-Main");
                linkDiv.style.visibility = "hidden";
                var progressDiv = document.getElementById("Gpu-Details-Progress");
                progressDiv.style.visibility = "hidden";
                var warningDiv = document.getElementById("Analysis-Warnings-Container");
                warningDiv.style.visibility = "hidden";
            };
            // Show the open document link and hide the in progress link
            GpuProfilingDetailsControl.prototype.showLink = function () {
                var open = document.getElementById("Gpu-Details-Main");
                open.style.visibility = "visible";
                var progress = document.getElementById("Gpu-Details-Progress");
                progress.style.visibility = "hidden";
            };
            // Hide the open document link and show the in progress link
            GpuProfilingDetailsControl.prototype.hideLink = function () {
                var open = document.getElementById("Gpu-Details-Main");
                open.style.visibility = "hidden";
                var progress = document.getElementById("Gpu-Details-Progress");
                progress.style.visibility = "visible";
            };
            GpuProfilingDetailsControl.prototype.onRulerSelectionChanged = function (args) {
                // Only update when selection is complete, not during the selection event
                if (!args.isIntermittent) {
                    this._timeSpan = args.position;
                }
            };
            GpuProfilingDetailsControl.prototype.openWpaLink = function () {
                this.openWpa();
            };
            GpuProfilingDetailsControl.prototype.checkWpaAvailable = function () {
                this._vsSession._call("WPAIsAvailable").done(function (result) {
                    if (result) {
                        var wpaLink = document.getElementById("wpaLink");
                        wpaLink.style.visibility = "visible";
                    }
                });
            };
            GpuProfilingDetailsControl.prototype.openWpa = function () {
                this._vsSession._call("launchInWPA").done(function (result) {
                });
            };
            GpuProfilingDetailsControl.prototype.openGpuViewLink = function () {
                this.openGpuView();
            };
            GpuProfilingDetailsControl.prototype.checkGpuViewAvailable = function () {
                this._vsSession._call("GpuViewIsAvailable").done(function (result) {
                    if (result) {
                        var gpuViewLink = document.getElementById("gpuViewLink");
                        gpuViewLink.style.visibility = "visible";
                    }
                });
            };
            GpuProfilingDetailsControl.prototype.openGpuView = function () {
                this._vsSession._call("launchInGpuView").done(function (result) {
                });
            };
            GpuProfilingDetailsControl.prototype.openDetailsPage = function () {
                this.loadGpuDetailsData();
            };
            return GpuProfilingDetailsControl;
        }());
        GpuProfiling.GpuProfilingDetailsControl = GpuProfilingDetailsControl;
    })(GpuProfiling = Microsoft.GpuProfiling || (Microsoft.GpuProfiling = {}));
})(Microsoft || (Microsoft = {}));
var Microsoft;
(function (Microsoft) {
    var GpuProfiling;
    (function (GpuProfiling) {
        var GpuProfilingRuntimeControl = (function () {
            // Pass in a view configuration block from the control
            function GpuProfilingRuntimeControl(config) {
                this._agentGuid = new Microsoft.VisualStudio.DiagnosticsHub.Guid("9e5de5fb-d655-401a-86a8-5764c252744d");
                if (config && config.viewId) {
                    this._config = config;
                    this._viewId = config.viewId;
                }
                else {
                    throw new Error("Invalid Config.");
                }
                this.setInitialControls();
                this._vsSession = Microsoft.Plugin.Utilities.JSONMarshaler.attachToPublishedObject("GpuProfiler.GpuProfilingSession", {}, true);
                this._standardCollector = Microsoft.VisualStudio.DiagnosticsHub.Collectors.getStandardTransportService();
                this._standardCollector.addMessageListener(this._agentGuid, this.onMessageReceived.bind(this));
            }
            // Messaged from the collector come in here to be handled
            GpuProfilingRuntimeControl.prototype.onMessageReceived = function (message) {
                if (message) {
                    if (message == "Started") {
                        this.setControls(true);
                    }
                    else if (message == "NotStarted") {
                        this.setControls(false);
                    }
                    else {
                        this._vsSession._call("sendStringMessage", message);
                    }
                }
            };
            // The initial set of controls will be all hidden until the collector tells us if we need the "start profiling" link or not
            GpuProfilingRuntimeControl.prototype.setInitialControls = function () {
                this._startLink = document.getElementById("startLink");
                this._startSpan = document.getElementById("startSpan");
                this._stopLink = document.getElementById("stopLink");
                this._stopSpan = document.getElementById("stopSpan");
                this._stopLink.style.visibility = "hidden";
                this._stopSpan.style.visibility = "hidden";
                this._startLink.style.visibility = "hidden";
                this._startSpan.style.visibility = "hidden";
            };
            // Set up our various HTML controls
            GpuProfilingRuntimeControl.prototype.setControls = function (started) {
                this._startLink.innerText = Microsoft.Plugin.Resources.getString("ProfilingStartProfilingLink");
                this._startLink.href = "javascript:void(null);";
                this._startLink.addEventListener("click", this.startProfiling.bind(this));
                this._startLink.style.visibility = "visible";
                this._startSpan.innerText = Microsoft.Plugin.Resources.getString("ProfilingStartProfilingSpan");
                this._startSpan.style.visibility = "visible";
                this._stopLink.innerText = Microsoft.Plugin.Resources.getString("ProfilingStopProfilingLink");
                this._stopLink.href = "javascript:void(null);";
                this._stopLink.addEventListener("click", this.stopProfiling.bind(this));
                this._stopLink.style.visibility = "visible";
                this._stopSpan.innerText = Microsoft.Plugin.Resources.getString("ProfilingStopProfilingSpan");
                this._stopSpan.style.visibility = "visible";
                if (started) {
                    this._startLink.style.visibility = "hidden";
                    this._startSpan.style.visibility = "hidden";
                }
            };
            GpuProfilingRuntimeControl.prototype.stopProfiling = function () {
                // Hide the links to prevent an accidental second press
                // were closing down now, so we don't want a command to start or
                // a second stop command
                this._stopLink.style.visibility = "hidden";
                this._stopSpan.style.visibility = "hidden";
                this._startLink.style.visibility = "hidden";
                this._startSpan.style.visibility = "hidden";
                this._vsSession._call("closeSession");
            };
            GpuProfilingRuntimeControl.prototype.startProfiling = function () {
                // Hide the start link when we begin
                this._startLink.style.visibility = "hidden";
                this._startSpan.style.visibility = "hidden";
                var startString = "StartProfiling:" + Microsoft.Plugin.Resources.getString("ProfilingUserMark");
                // Send our message to start profiling to the collection agent
                this._standardCollector.sendStringToCollectionAgent(this._agentGuid.toString(), startString).done(function (response) {
                    if (response) {
                        var str = response;
                    }
                });
            };
            return GpuProfilingRuntimeControl;
        }());
        GpuProfiling.GpuProfilingRuntimeControl = GpuProfilingRuntimeControl;
    })(GpuProfiling = Microsoft.GpuProfiling || (Microsoft.GpuProfiling = {}));
})(Microsoft || (Microsoft = {}));
// 
// Copyright (C) Microsoft. All rights reserved.
//
/// <reference path="control.ts" />
var VsGraphics;
(function (VsGraphics) {
    var Common;
    (function (Common) {
        var Controls;
        (function (Controls) {
            "use strict";
            // This ContentControl is  a control that only allows a single child (content).
            var ContentControl = (function (_super) {
                __extends(ContentControl, _super);
                function ContentControl() {
                    _super.call(this);
                }
                Object.defineProperty(ContentControl.prototype, "content", {
                    get: function () { return this._content; },
                    set: function (newContent) {
                        if (this._content !== newContent) {
                            if (this._content) {
                                this.removeChild(this._content);
                            }
                            this._content = newContent;
                            this.appendChild(this._content);
                            this.onContentChanged();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                ContentControl.prototype.appendChild = function (child) {
                    if (this.rootElement.children.length != 0) {
                        throw new Error(Microsoft.Plugin.Resources.getErrorString("MemProf.1016"));
                    }
                    _super.prototype.appendChild.call(this, child);
                };
                // overridable
                ContentControl.prototype.onContentChanged = function () {
                };
                return ContentControl;
            }(Controls.Control));
            Controls.ContentControl = ContentControl;
        })(Controls = Common.Controls || (Common.Controls = {}));
    })(Common = VsGraphics.Common || (VsGraphics.Common = {}));
})(VsGraphics || (VsGraphics = {}));
// 
// Copyright (C) Microsoft. All rights reserved.
//
var VsGraphics;
(function (VsGraphics) {
    var Common;
    (function (Common) {
        "use strict";
        /**
        Use the Keys members to test against KeyboardEvent.key.
        This is preferred over testing KeyboardEvent.keyCode, which is deprecated.
        */
        var Keys = (function () {
            function Keys() {
            }
            Keys.c = "c";
            Keys.DEL = "Del";
            Keys.DOWN = "Down";
            Keys.END = "End";
            Keys.ENTER = "Enter";
            Keys.F10 = "F10";
            Keys.HOME = "Home";
            Keys.LEFT = "Left";
            Keys.RIGHT = "Right";
            Keys.SPACEBAR = "Spacebar";
            Keys.UP = "Up";
            return Keys;
        }());
        Common.Keys = Keys;
        /**
        Use the KeyCodes enumeration to test against KeyboardEvent.keyCode.
        This is deprecated in favor of testing KeyboardEvent.key.
        */
        (function (KeyCodes) {
            KeyCodes[KeyCodes["BACKSPACE"] = 8] = "BACKSPACE";
            KeyCodes[KeyCodes["TAB"] = 9] = "TAB";
            KeyCodes[KeyCodes["ENTER"] = 13] = "ENTER";
            KeyCodes[KeyCodes["SHIFT"] = 16] = "SHIFT";
            KeyCodes[KeyCodes["CONTROL"] = 17] = "CONTROL";
            KeyCodes[KeyCodes["ALT"] = 18] = "ALT";
            KeyCodes[KeyCodes["CAPS_LOCK"] = 20] = "CAPS_LOCK";
            KeyCodes[KeyCodes["ESCAPE"] = 27] = "ESCAPE";
            KeyCodes[KeyCodes["SPACE"] = 32] = "SPACE";
            KeyCodes[KeyCodes["PAGE_UP"] = 33] = "PAGE_UP";
            KeyCodes[KeyCodes["PAGE_DOWN"] = 34] = "PAGE_DOWN";
            KeyCodes[KeyCodes["END"] = 35] = "END";
            KeyCodes[KeyCodes["HOME"] = 36] = "HOME";
            KeyCodes[KeyCodes["ARROW_LEFT"] = 37] = "ARROW_LEFT";
            KeyCodes[KeyCodes["ARROW_FIRST"] = 37] = "ARROW_FIRST";
            KeyCodes[KeyCodes["ARROW_UP"] = 38] = "ARROW_UP";
            KeyCodes[KeyCodes["ARROW_RIGHT"] = 39] = "ARROW_RIGHT";
            KeyCodes[KeyCodes["ARROW_DOWN"] = 40] = "ARROW_DOWN";
            KeyCodes[KeyCodes["ARROW_LAST"] = 40] = "ARROW_LAST";
            KeyCodes[KeyCodes["INSERT"] = 45] = "INSERT";
            KeyCodes[KeyCodes["DELETE"] = 46] = "DELETE";
            KeyCodes[KeyCodes["A"] = 65] = "A";
            KeyCodes[KeyCodes["B"] = 66] = "B";
            KeyCodes[KeyCodes["C"] = 67] = "C";
            KeyCodes[KeyCodes["D"] = 68] = "D";
            KeyCodes[KeyCodes["E"] = 69] = "E";
            KeyCodes[KeyCodes["F"] = 70] = "F";
            KeyCodes[KeyCodes["G"] = 71] = "G";
            KeyCodes[KeyCodes["H"] = 72] = "H";
            KeyCodes[KeyCodes["I"] = 73] = "I";
            KeyCodes[KeyCodes["J"] = 74] = "J";
            KeyCodes[KeyCodes["K"] = 75] = "K";
            KeyCodes[KeyCodes["L"] = 76] = "L";
            KeyCodes[KeyCodes["M"] = 77] = "M";
            KeyCodes[KeyCodes["N"] = 78] = "N";
            KeyCodes[KeyCodes["O"] = 79] = "O";
            KeyCodes[KeyCodes["P"] = 80] = "P";
            KeyCodes[KeyCodes["Q"] = 81] = "Q";
            KeyCodes[KeyCodes["R"] = 82] = "R";
            KeyCodes[KeyCodes["S"] = 83] = "S";
            KeyCodes[KeyCodes["T"] = 84] = "T";
            KeyCodes[KeyCodes["U"] = 85] = "U";
            KeyCodes[KeyCodes["V"] = 86] = "V";
            KeyCodes[KeyCodes["W"] = 87] = "W";
            KeyCodes[KeyCodes["X"] = 88] = "X";
            KeyCodes[KeyCodes["Y"] = 89] = "Y";
            KeyCodes[KeyCodes["Z"] = 90] = "Z";
            KeyCodes[KeyCodes["CONTEXTMENU"] = 93] = "CONTEXTMENU";
            KeyCodes[KeyCodes["MULTIPLY"] = 106] = "MULTIPLY";
            KeyCodes[KeyCodes["PLUS"] = 107] = "PLUS";
            KeyCodes[KeyCodes["MINUS"] = 109] = "MINUS";
            KeyCodes[KeyCodes["F1"] = 112] = "F1";
            KeyCodes[KeyCodes["F2"] = 113] = "F2";
            KeyCodes[KeyCodes["F3"] = 114] = "F3";
            KeyCodes[KeyCodes["F4"] = 115] = "F4";
            KeyCodes[KeyCodes["F5"] = 116] = "F5";
            KeyCodes[KeyCodes["F6"] = 117] = "F6";
            KeyCodes[KeyCodes["F7"] = 118] = "F7";
            KeyCodes[KeyCodes["F8"] = 119] = "F8";
            KeyCodes[KeyCodes["F9"] = 120] = "F9";
            KeyCodes[KeyCodes["F10"] = 121] = "F10";
            KeyCodes[KeyCodes["F11"] = 122] = "F11";
            KeyCodes[KeyCodes["F12"] = 123] = "F12";
            KeyCodes[KeyCodes["COMMA"] = 188] = "COMMA";
            KeyCodes[KeyCodes["PERIOD"] = 190] = "PERIOD";
        })(Common.KeyCodes || (Common.KeyCodes = {}));
        var KeyCodes = Common.KeyCodes;
        (function (MouseButtons) {
            MouseButtons[MouseButtons["LEFT_BUTTON"] = 0] = "LEFT_BUTTON";
            MouseButtons[MouseButtons["MIDDLE_BUTTON"] = 1] = "MIDDLE_BUTTON";
            MouseButtons[MouseButtons["RIGHT_BUTTON"] = 2] = "RIGHT_BUTTON";
        })(Common.MouseButtons || (Common.MouseButtons = {}));
        var MouseButtons = Common.MouseButtons;
        // This maps to KeyFlags enum defined in 
        // $/devdiv/feature/VSClient_1/src/bpt/diagnostics/Host/Common/common.h
        (function (KeyFlags) {
            KeyFlags[KeyFlags["KeyFlags_None"] = 0] = "KeyFlags_None";
            KeyFlags[KeyFlags["KeyFlags_Shift"] = 1] = "KeyFlags_Shift";
            KeyFlags[KeyFlags["KeyFlags_Ctrl"] = 2] = "KeyFlags_Ctrl";
            KeyFlags[KeyFlags["KeyFlags_Alt"] = 4] = "KeyFlags_Alt";
        })(Common.KeyFlags || (Common.KeyFlags = {}));
        var KeyFlags = Common.KeyFlags;
        /**
           Add listeners to the document to prevent certain IE browser accelerator keys from
           triggering their default action in IE
         */
        function blockBrowserAccelerators() {
            // Prevent the default F5 refresh, default F6 address bar focus, and default SHIFT + F10 context menu
            document.addEventListener("keydown", function (e) {
                return preventIEKeys(e);
            });
            // Prevent the default context menu
            document.addEventListener("contextmenu", function (e) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            });
            // Prevent mouse wheel zoom
            window.addEventListener("mousewheel", function (e) {
                if (e.ctrlKey) {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                }
            });
        }
        Common.blockBrowserAccelerators = blockBrowserAccelerators;
        /**
           Checks to see if any of the ALT, SHIFT, or CTRL keys are pressed
           @param e The keyboard event to check
           @returns true if the event has any of the key flags toggled on
         */
        function HasAnyOfAltCtrlShiftKeyFlags(e) {
            return e.shiftKey || e.ctrlKey || e.altKey;
        }
        Common.HasAnyOfAltCtrlShiftKeyFlags = HasAnyOfAltCtrlShiftKeyFlags;
        /**
           Prevents IE from executing default behavior for certain shortcut keys
           This should be called from keydown handlers that do not already call preventDefault().
           Some shortcuts cannot be blocked via javascript (such as CTRL + P print dialog) so these
           are already blocked by the native hosting code and will not get sent to the key event handlers.
           @param e The keyboard event to check and prevent the action on
           @returns false to stop the default action- which matches the keydown/keyup handlers
         */
        function preventIEKeys(e) {
            // Check if a known key combo is pressed
            if (e.keyCode === Common.KeyCodes.F5 ||
                e.keyCode === Common.KeyCodes.F6 ||
                (e.keyCode === Common.KeyCodes.F10 && e.shiftKey) ||
                (e.keyCode === Common.KeyCodes.F && e.ctrlKey)) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
            return true;
        }
        Common.preventIEKeys = preventIEKeys;
    })(Common = VsGraphics.Common || (VsGraphics.Common = {}));
})(VsGraphics || (VsGraphics = {}));
// 
// Copyright (C) Microsoft. All rights reserved.
//
/// <reference path="../Includes.ts" />
/// <reference path="../Util/KeyCodes.ts" />
/// <reference path="control.ts" />
/// <reference path="templateControl.ts" />
var VsGraphics;
(function (VsGraphics) {
    var Common;
    (function (Common) {
        var Controls;
        (function (Controls) {
            "use strict";
            var MenuItem = (function () {
                function MenuItem(itemText, ownerControl, canToggle, initialState) {
                    if (canToggle === void 0) { canToggle = false; }
                    if (initialState === void 0) { initialState = false; }
                    this.element = document.createElement("li");
                    if (canToggle) {
                        this._toggleIcon = document.createElement("img");
                        this.element.appendChild(this._toggleIcon);
                        this._toggleIcon.className = "menuToggleIcon";
                        this._toggleIcon.src = Microsoft.Plugin.Theme.getValue("image-checkmark");
                        this.toggled = initialState;
                        this.element.addEventListener("DOMAttrModified", this.onAriaCheckedModified.bind(this));
                    }
                    var span = document.createElement("span");
                    this.element.appendChild(span);
                    span.innerText = itemText;
                }
                Object.defineProperty(MenuItem.prototype, "toggled", {
                    get: function () { return this._toggled; },
                    set: function (v) {
                        this._toggled = v;
                        if (this._toggled) {
                            this._toggleIcon.classList.remove("hiddenCheckMark");
                            this.element.setAttribute("aria-checked", "true");
                        }
                        else {
                            this._toggleIcon.classList.add("hiddenCheckMark");
                            this.element.setAttribute("aria-checked", "false");
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                MenuItem.prototype.onAriaCheckedModified = function (event) {
                    if (event.attrName === "aria-checked") {
                        var checked = event.newValue === "true";
                        if (this.toggled !== checked)
                            this.toggled = checked;
                    }
                };
                return MenuItem;
            }());
            Controls.MenuItem = MenuItem;
            var MenuControl = (function (_super) {
                __extends(MenuControl, _super);
                function MenuControl(target) {
                    var _this = this;
                    _super.call(this);
                    this._target = target;
                    this._isVisible = false;
                    this.setTemplateFromHTML("<ul id=\"menuControl\" class=\"menuControl\" role=\"menu\"></ul>");
                    this._listElement = this.findElement("menuControl");
                    this._listElement.setAttribute("aria-hidden", "true");
                    this._closeMenuFunction = this.closeMenu.bind(this);
                    document.body.addEventListener("keydown", function (e) {
                        if (e.keyCode === Common.KeyCodes.ESCAPE) {
                            _this.closeMenu();
                        }
                    });
                    target.onclick = this.showMenu.bind(this);
                    target.onkeydown = function (e) {
                        if (e.keyCode === Common.KeyCodes.ENTER || e.keyCode === Common.KeyCodes.SPACE) {
                            if (!_this._isVisible)
                                _this.showMenu();
                            else
                                _this.closeMenu();
                        }
                    };
                    target.appendChild(this._listElement);
                    target.setAttribute("role", "button");
                    target.setAttribute("aria-haspopup", "true");
                    target.setAttribute("aria-owns", this._listElement.id.toString());
                    target.addEventListener("keydown", function (e) {
                        if ((e.keyCode === Common.KeyCodes.ARROW_DOWN) && (_this._isVisible)) {
                            _this._listElement.firstElementChild.focus();
                        }
                    });
                }
                MenuControl.prototype.getMenuItem = function (index) {
                    if (index >= 0 && index < this._listElement.children.length) {
                        return this._listElement.children[index];
                    }
                    return null;
                };
                MenuControl.prototype.addToggleItem = function (itemText, itemCallback, initialState, tabIndex) {
                    if (initialState === void 0) { initialState = false; }
                    if (tabIndex === void 0) { tabIndex = 0; }
                    var menuItem = new MenuItem(itemText, this, true, initialState);
                    this._listElement.appendChild(menuItem.element);
                    menuItem.element.tabIndex = tabIndex;
                    menuItem.element.setAttribute("role", "menuitemcheckbox");
                    menuItem.element.onclick = (function (e) {
                        menuItem.toggled = itemCallback(e);
                        e.stopImmediatePropagation();
                    });
                    menuItem.element.onkeydown = function (e) {
                        if (e.keyCode === Common.KeyCodes.ENTER || e.keyCode === Common.KeyCodes.SPACE) {
                            menuItem.toggled = itemCallback(e);
                            e.stopImmediatePropagation();
                        }
                        else if (e.keyCode === Common.KeyCodes.ARROW_UP) {
                            if (menuItem.element.previousElementSibling) {
                                menuItem.element.previousElementSibling.focus();
                            }
                            e.stopImmediatePropagation();
                        }
                        else if (e.keyCode === Common.KeyCodes.ARROW_DOWN) {
                            if (menuItem.element.nextElementSibling) {
                                menuItem.element.nextElementSibling.focus();
                            }
                            e.stopImmediatePropagation();
                        }
                    };
                    this._target.disabled = false;
                };
                MenuControl.totalOffsetLeft = function (elem) {
                    var offsetLeft = 0;
                    do {
                        if (!isNaN(elem.offsetLeft)) {
                            offsetLeft += elem.offsetLeft;
                        }
                    } while (elem = elem.offsetParent);
                    return offsetLeft;
                };
                MenuControl.totalOffsetTop = function (elem) {
                    var offsetTop = 0;
                    do {
                        if (!isNaN(elem.offsetTop)) {
                            offsetTop += elem.offsetTop;
                        }
                    } while (elem = elem.offsetParent);
                    return offsetTop;
                };
                MenuControl.prototype.showMenu = function (e) {
                    var _this = this;
                    if (!this._isVisible) {
                        this._listElement.style.display = "block";
                        this._listElement.setAttribute("aria-hidden", "false");
                        this.setMenuPosition();
                        this._target.classList.add("menuControlActive");
                        window.setImmediate(function () {
                            document.body.addEventListener("click", _this._closeMenuFunction);
                            window.addEventListener("resize", _this._closeMenuFunction);
                        });
                        this._isVisible = true;
                    }
                };
                MenuControl.prototype.closeMenu = function () {
                    if (this._isVisible) {
                        this._listElement.style.display = "none";
                        this._listElement.setAttribute("aria-hidden", "true");
                        this._target.classList.remove("menuControlActive");
                        document.body.removeEventListener("click", this._closeMenuFunction);
                        window.removeEventListener("resize", this._closeMenuFunction);
                        this._isVisible = false;
                    }
                };
                MenuControl.prototype.setMenuPosition = function () {
                    this._listElement.style.left = "0px";
                    this._listElement.style.top = "0px";
                    // Get the coordinates of target based on the document
                    var targetTotalOffsetLeft = MenuControl.totalOffsetLeft(this._target);
                    var targetTotalOffsetTop = MenuControl.totalOffsetTop(this._target);
                    // Gets the offset position when listElement is at 0,0 to adjust later on this value.
                    // because 0,0 doesn't necessarly land on document 0,0 if there is a parent with absolute position.
                    var listElementZeroOffsetLeft = MenuControl.totalOffsetLeft(this._listElement);
                    var listElementZeroOffsetTop = MenuControl.totalOffsetTop(this._listElement);
                    // Calculate the left position 
                    var left = targetTotalOffsetLeft;
                    var right = left + this._listElement.offsetWidth;
                    if (right > window.innerWidth) {
                        var newRight = targetTotalOffsetLeft + this._target.offsetWidth;
                        var newLeft = newRight - this._listElement.offsetWidth;
                        if (newLeft >= 0) {
                            left = newLeft;
                            right = newRight;
                        }
                    }
                    this._listElement.style.left = left - listElementZeroOffsetLeft + "px";
                    // Calculate the top position
                    var top = targetTotalOffsetTop + this._target.offsetHeight;
                    var bottom = top + this._listElement.offsetHeight;
                    if (bottom > window.innerHeight) {
                        var newBottom = targetTotalOffsetTop;
                        var newTop = bottom - this._listElement.offsetHeight;
                        if (newTop >= 0) {
                            top = newTop;
                            bottom = newBottom;
                        }
                    }
                    this._listElement.style.top = top - listElementZeroOffsetTop + "px";
                };
                return MenuControl;
            }(Controls.TemplateControl));
            Controls.MenuControl = MenuControl;
        })(Controls = Common.Controls || (Common.Controls = {}));
    })(Common = VsGraphics.Common || (VsGraphics.Common = {}));
})(VsGraphics || (VsGraphics = {}));
// 
// Copyright (C) Microsoft. All rights reserved.
//
/// <reference path="../Util/keyCodes.ts" />
/// <reference path="Control.ts" />
/// <reference path="contentControl.ts" />
/// <reference path="tabControl.ts" />
var VsGraphics;
(function (VsGraphics) {
    var Common;
    (function (Common) {
        var Controls;
        (function (Controls) {
            "use strict";
            var TabItem = (function (_super) {
                __extends(TabItem, _super);
                function TabItem() {
                    _super.call(this);
                    var elem = document.createElement("li");
                    elem.setAttribute("role", "tab");
                    elem.setAttribute("aria-selected", "false");
                    this.header = new Controls.Control(elem);
                    this.header.rootElement.onclick = this.onHeaderClicked.bind(this);
                    this.header.rootElement.setAttribute("tabindex", "2");
                    this.header.rootElement.addEventListener("keydown", this.onKeyDown.bind(this));
                    this.rootElement.className = "tabItemContent";
                }
                Object.defineProperty(TabItem.prototype, "ownerTabControl", {
                    get: function () { return this._ownerTabControl; },
                    set: function (v) {
                        if (this._ownerTabControl !== v) {
                            if (this._ownerTabControl && v) {
                                throw new Error(Microsoft.Plugin.Resources.getErrorString("MemProf.1022"));
                            }
                            this._ownerTabControl = v;
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(TabItem.prototype, "active", {
                    get: function () { return this._active; },
                    set: function (v) {
                        if (this._active !== v) {
                            this._active = v;
                            this.header.rootElement.classList.toggle("active");
                            this.rootElement.classList.toggle("active");
                            this.header.rootElement.setAttribute("aria-selected", this._active ? "true" : "false");
                            this.onActiveChanged();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(TabItem.prototype, "title", {
                    get: function () { return this.header.rootElement.innerText; },
                    set: function (v) {
                        this.header.rootElement.innerText = v;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(TabItem.prototype, "tooltipString", {
                    get: function () { return this.header.rootElement.getAttribute("data-plugin-vs-tooltip"); },
                    set: function (v) {
                        var tooltip = { content: v };
                        this.header.rootElement.setAttribute("data-plugin-vs-tooltip", JSON.stringify(tooltip));
                    },
                    enumerable: true,
                    configurable: true
                });
                /* overridable */
                TabItem.prototype.onActiveChanged = function () {
                };
                TabItem.prototype.onHeaderClicked = function () {
                    if (this.ownerTabControl) {
                        this.ownerTabControl.selectedItem = this;
                    }
                    // MemoryProfilerViewHost.onIdle();
                };
                TabItem.prototype.onKeyDown = function (e) {
                    if (e.keyCode === Common.KeyCodes.ENTER || e.keyCode === Common.KeyCodes.SPACE) {
                        this.onHeaderClicked();
                    }
                };
                return TabItem;
            }(Controls.ContentControl));
            Controls.TabItem = TabItem;
        })(Controls = Common.Controls || (Common.Controls = {}));
    })(Common = VsGraphics.Common || (VsGraphics.Common = {}));
})(VsGraphics || (VsGraphics = {}));
// 
// Copyright (C) Microsoft. All rights reserved.
//
/// <reference path="control.ts" />
/// <reference path="templateControl.ts" />
/// <reference path="tabItem.ts" />
var VsGraphics;
(function (VsGraphics) {
    var Common;
    (function (Common) {
        var Controls;
        (function (Controls) {
            "use strict";
            var TabControl = (function (_super) {
                __extends(TabControl, _super);
                function TabControl() {
                    _super.call(this);
                    this._items = [];
                    this.setTemplateFromHTML('<div class="tabControl">' +
                        '   <div class="tabHeader">' +
                        '       <div id="beforeBarContainer" class="beforeBarContainer"></div>' +
                        '       <nav id="tabBarContainer" class="tabBarContainer">' +
                        '        <ul class="tabBar" role="tablist"></ul>' +
                        '       </nav>' +
                        '       <div id="afterBarContainer" class="afterBarContainer"></div>' +
                        '   </div>' +
                        '   <div class="tabContentPane"></div>' +
                        '</div>');
                    this._barPanel = new Controls.Control(this.rootElement.getElementsByClassName("tabBar")[0]);
                    this._contentPane = new Controls.Control(this.rootElement.getElementsByClassName("tabContentPane")[0]);
                    this.beforeBarContainer = new Controls.Control(this.rootElement.getElementsByClassName("beforeBarContainer")[0]);
                    this.afterBarContainer = new Controls.Control(this.rootElement.getElementsByClassName("afterBarContainer")[0]);
                    this._tabBarContainer = this.findElement("tabBarContainer");
                }
                Object.defineProperty(TabControl.prototype, "tabsLeftAligned", {
                    get: function () {
                        return this._tabBarContainer.classList.contains("tabBarContainerLeftAlign");
                    },
                    set: function (v) {
                        if (v) {
                            this._tabBarContainer.classList.add("tabBarContainerLeftAlign");
                        }
                        else {
                            this._tabBarContainer.classList.remove("tabBarContainerLeftAlign");
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                TabControl.prototype.addTab = function (tabItem) {
                    this._items.push(tabItem);
                    tabItem.ownerTabControl = this;
                    this._barPanel.appendChild(tabItem.header);
                    this._contentPane.appendChild(tabItem);
                    if (!this._selectedItem) {
                        this.selectedItem = tabItem;
                    }
                };
                TabControl.prototype.removeTab = function (tabItem) {
                    var indexOfItem = this._items.indexOf(tabItem);
                    if (indexOfItem < 0) {
                        return;
                    }
                    if (this.selectedItem === tabItem) {
                        this.selectedItem = null;
                    }
                    this._items.splice(indexOfItem, 1);
                    var newSelectedItemIndex = Math.min(this._items.length - 1, indexOfItem);
                    if (newSelectedItemIndex >= 0) {
                        this.selectedItem = this._items[newSelectedItemIndex];
                    }
                    this._barPanel.removeChild(tabItem.header);
                    this._contentPane.removeChild(tabItem);
                    tabItem.ownerTabControl = null;
                };
                TabControl.prototype.containsTab = function (tabItem) {
                    return this._items.indexOf(tabItem) >= 0;
                };
                TabControl.prototype.getTab = function (index) {
                    return this._items[index];
                };
                TabControl.prototype.length = function () {
                    return this._items.length;
                };
                Object.defineProperty(TabControl.prototype, "selectedItem", {
                    get: function () { return this._selectedItem; },
                    set: function (tabItem) {
                        if (this._selectedItem !== tabItem) {
                            if (!this.containsTab(tabItem)) {
                                return;
                            }
                            if (this._selectedItem) {
                                this._selectedItem.active = false;
                            }
                            this._selectedItem = tabItem;
                            if (this._selectedItem) {
                                this._selectedItem.active = true;
                            }
                            if (this.selectedItemChanged) {
                                this.selectedItemChanged();
                            }
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                TabControl.prototype.onTabItemSelected = function (item) {
                    this.selectedItem = item;
                };
                return TabControl;
            }(Controls.TemplateControl));
            Controls.TabControl = TabControl;
        })(Controls = Common.Controls || (Common.Controls = {}));
    })(Common = VsGraphics.Common || (VsGraphics.Common = {}));
})(VsGraphics || (VsGraphics = {}));
///<reference path="TemplateControl.ts"/>
var VsGraphics;
(function (VsGraphics) {
    var Common;
    (function (Common) {
        var Controls;
        (function (Controls) {
            var View = (function (_super) {
                __extends(View, _super);
                function View(containerId) {
                    _super.call(this, containerId);
                }
                /*overridable*/
                View.prototype.render = function () {
                };
                /*overridable*/
                View.prototype.onResize = function () {
                };
                return View;
            }(Controls.TemplateControl));
            Controls.View = View;
        })(Controls = Common.Controls || (Common.Controls = {}));
    })(Common = VsGraphics.Common || (VsGraphics.Common = {}));
})(VsGraphics || (VsGraphics = {}));
// 
// Copyright (C) Microsoft. All rights reserved.
//
var VsGraphics;
(function (VsGraphics) {
    var Constants = (function () {
        function Constants() {
        }
        Constants.MinGranularitySupportedInNs = 1;
        Constants.MEMORY_ANALYZER_CLASS_ID = "B821D548-5BA4-4C0E-8D23-CD46CE0C8E23";
        return Constants;
    }());
    VsGraphics.Constants = Constants;
})(VsGraphics || (VsGraphics = {}));
// 
// Copyright (C) Microsoft. All rights reserved.
//
var VsGraphics;
(function (VsGraphics) {
    var Common;
    (function (Common) {
        "use strict";
        var Publisher = (function () {
            function Publisher(events) {
                /// <summary>
                ///     constructor
                /// </summary>
                /// <param name="events">List of supported events.</param>
                /// <summary>
                /// Event publisher.
                /// </summary>
                /// <summary>
                /// List of supported events.
                /// </summary>
                this._events = {};
                /// <summary>
                /// List of all registered events.
                /// </summary>
                this._listeners = {};
                if (events && events.length > 0) {
                    for (var i = 0; i < events.length; i++) {
                        var type = events[i];
                        if (type) {
                            this._events[type] = type;
                        }
                    }
                }
                else {
                    throw Error("Events are null or empty.");
                }
            }
            Publisher.prototype.addEventListener = function (eventType, func) {
                /// <summary>
                ///     Add event Listener
                /// </summary>
                /// <param name="eventType">Event type.</param>
                /// <param name="func">Callback function.</param>
                if (eventType && func) {
                    var type = this._events[eventType];
                    if (type) {
                        var callbacks = this._listeners[type] ? this._listeners[type] : this._listeners[type] = [];
                        callbacks.push(func);
                    }
                }
            };
            Publisher.prototype.removeEventListener = function (eventType, func) {
                /// <summary>
                ///     Remove event Listener
                /// </summary>
                /// <param name="eventType">Event type.</param>
                /// <param name="func">Callback function.</param>
                if (eventType && func) {
                    var callbacks = this._listeners[eventType];
                    if (callbacks) {
                        for (var i = 0; i < callbacks.length; i++) {
                            if (func === callbacks[i]) {
                                callbacks.splice(i, 1);
                                break;
                            }
                        }
                    }
                }
            };
            Publisher.prototype.invokeListener = function (args) {
                /// <summary>
                ///     Invoke event Listener
                /// </summary>
                /// <param name="args">Event argument.</param>
                if (args.type) {
                    var callbacks = this._listeners[args.type];
                    if (callbacks) {
                        for (var i = 0; i < callbacks.length; i++) {
                            var func = callbacks[i];
                            if (func) {
                                func(args);
                            }
                        }
                    }
                }
            };
            return Publisher;
        }());
        Common.Publisher = Publisher;
    })(Common = VsGraphics.Common || (VsGraphics.Common = {}));
})(VsGraphics || (VsGraphics = {}));
// 
// Copyright (C) Microsoft. All rights reserved.
//
var VsGraphics;
(function (VsGraphics) {
    var Common;
    (function (Common) {
        "use strict";
        var Utilities = (function () {
            function Utilities() {
            }
            Utilities.htmlEncode = function (value) {
                Utilities.HtmlEncodeDiv.innerText = value;
                return Utilities.HtmlEncodeDiv.innerHTML;
            };
            Utilities.HtmlEncodeDiv = document.createElement("div");
            return Utilities;
        }());
        Common.Utilities = Utilities;
    })(Common = VsGraphics.Common || (VsGraphics.Common = {}));
})(VsGraphics || (VsGraphics = {}));
//# sourceMappingURL=VsGraphics.js.map
// SIG // Begin signature block
// SIG // MIIjiAYJKoZIhvcNAQcCoIIjeTCCI3UCAQExDzANBglg
// SIG // hkgBZQMEAgEFADB3BgorBgEEAYI3AgEEoGkwZzAyBgor
// SIG // BgEEAYI3AgEeMCQCAQEEEBDgyQbOONQRoqMAEEvTUJAC
// SIG // AQACAQACAQACAQACAQAwMTANBglghkgBZQMEAgEFAAQg
// SIG // 9YJLv8o/F/CNCreJESRFKLZZuFvjWYzAuYTK4c+9Mbug
// SIG // gg2FMIIGAzCCA+ugAwIBAgITMwAAAVKbQJ9QVpl1iAAA
// SIG // AAABUjANBgkqhkiG9w0BAQsFADB+MQswCQYDVQQGEwJV
// SIG // UzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMH
// SIG // UmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBv
// SIG // cmF0aW9uMSgwJgYDVQQDEx9NaWNyb3NvZnQgQ29kZSBT
// SIG // aWduaW5nIFBDQSAyMDExMB4XDTE5MDUwMjIxMzc0NloX
// SIG // DTIwMDUwMjIxMzc0NlowdDELMAkGA1UEBhMCVVMxEzAR
// SIG // BgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1v
// SIG // bmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlv
// SIG // bjEeMBwGA1UEAxMVTWljcm9zb2Z0IENvcnBvcmF0aW9u
// SIG // MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA
// SIG // saeJ0/an7vTtdIicnsGFx5TflhIe/TaKK/Z4TOnp1DWw
// SIG // m4V/b0vvHP93iFWs0mJ1QU6i81u8VjdWwnCLQ27BMyhB
// SIG // NgbMErp+yfcQmi8HBhyha/qllJc+4YfUXJo2EpDhjcmz
// SIG // n64I97JtA0raCvJY8BMlFXkXzB8fRP+wmvzhKtnFwU9y
// SIG // 9H1Z5RJH2pd9dBBQiw6NgaxN+TRkYxvv552YqiqhIeZV
// SIG // jZN9yVfPyNHyHFCqyxJlBq79AoAu8NnI5mwYQSCftCs0
// SIG // p0lop4F6Jf94lHQQcuEEDR++u5GBrpyXmNPEYxzCIIyQ
// SIG // nQKBDPtpl79aYWle4/jN3Tc2f3HbM96A3wIDAQABo4IB
// SIG // gjCCAX4wHwYDVR0lBBgwFgYKKwYBBAGCN0wIAQYIKwYB
// SIG // BQUHAwMwHQYDVR0OBBYEFN3/AMNbFu9lnCdm6P0EmBs1
// SIG // a0WHMFQGA1UdEQRNMEukSTBHMS0wKwYDVQQLEyRNaWNy
// SIG // b3NvZnQgSXJlbGFuZCBPcGVyYXRpb25zIExpbWl0ZWQx
// SIG // FjAUBgNVBAUTDTIzMDAxMis0NTQxMzYwHwYDVR0jBBgw
// SIG // FoAUSG5k5VAF04KqFzc3IrVtqMp1ApUwVAYDVR0fBE0w
// SIG // SzBJoEegRYZDaHR0cDovL3d3dy5taWNyb3NvZnQuY29t
// SIG // L3BraW9wcy9jcmwvTWljQ29kU2lnUENBMjAxMV8yMDEx
// SIG // LTA3LTA4LmNybDBhBggrBgEFBQcBAQRVMFMwUQYIKwYB
// SIG // BQUHMAKGRWh0dHA6Ly93d3cubWljcm9zb2Z0LmNvbS9w
// SIG // a2lvcHMvY2VydHMvTWljQ29kU2lnUENBMjAxMV8yMDEx
// SIG // LTA3LTA4LmNydDAMBgNVHRMBAf8EAjAAMA0GCSqGSIb3
// SIG // DQEBCwUAA4ICAQCU8ETmh76IF4IsVo8o7y34kYKiNkCv
// SIG // BqBtt3qgIDY1+1f1nVFgW7NGiAt5OPXHdM3aviSSJosX
// SIG // F+lDk6c9i2TxUodt5dPzKN+cBuyV1MYDtFPuXa20Ibec
// SIG // aDJdZ+/00OIinJgGEgD8U6uZRZ6FdvnwHpY1QOzuN7M4
// SIG // 7Oy0dPQ9MBR8M2XKP4hPB5WpJdt2U+xZweQH1NocH7/O
// SIG // 8t6t2uahYroEspCC6StP76p5RFQdCgHUFc2FC0P1OHhR
// SIG // I54rNybPVKwL7SISLNuuOOUY91D+lOBoDo4EKJ5UQPpg
// SIG // 5bIe/MBUhmwEiLyvn5DjVIb4/AfGRzZ+ExX53LfmtGbn
// SIG // mOH+mkT8a/G3jUlCp+0FvxUJp+NtmxOyn56lp3LB+72z
// SIG // YRvdvaa1Rz7GmuydtovcMh4+5tKAE1yfmI38qBALXefz
// SIG // ciGGhOFLtI9RIbmFKOVWiSZzGkxEdKl/Pv2GUVqxTf4X
// SIG // qbONVzVY4gGsKWwGtH1Gt0fUTQYz4gZzNILzT6KzOHbF
// SIG // dlSfBpbiEDqyZTr7gqzmAxoqxp2nTpkNtcDwaBhQlqSu
// SIG // ej8c5YirMuTTZgF3BMe0G/b1I2NVpWLa3cDl06cTeLJc
// SIG // yIbevQWmZSyIy1VsKiH7ja4RyjQzPSvr+74KyG3+5ef+
// SIG // uuYNII0AgwjekObMbrbUwBCrSXkv6ZKSPg22fzCCB3ow
// SIG // ggVioAMCAQICCmEOkNIAAAAAAAMwDQYJKoZIhvcNAQEL
// SIG // BQAwgYgxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNo
// SIG // aW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQK
// SIG // ExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xMjAwBgNVBAMT
// SIG // KU1pY3Jvc29mdCBSb290IENlcnRpZmljYXRlIEF1dGhv
// SIG // cml0eSAyMDExMB4XDTExMDcwODIwNTkwOVoXDTI2MDcw
// SIG // ODIxMDkwOVowfjELMAkGA1UEBhMCVVMxEzARBgNVBAgT
// SIG // Cldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAc
// SIG // BgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEoMCYG
// SIG // A1UEAxMfTWljcm9zb2Z0IENvZGUgU2lnbmluZyBQQ0Eg
// SIG // MjAxMTCCAiIwDQYJKoZIhvcNAQEBBQADggIPADCCAgoC
// SIG // ggIBAKvw+nIQHC6t2G6qghBNNLrytlghn0IbKmvpWlCq
// SIG // uAY4GgRJun/DDB7dN2vGEtgL8DjCmQawyDnVARQxQtOJ
// SIG // DXlkh36UYCRsr55JnOloXtLfm1OyCizDr9mpK656Ca/X
// SIG // llnKYBoF6WZ26DJSJhIv56sIUM+zRLdd2MQuA3WraPPL
// SIG // bfM6XKEW9Ea64DhkrG5kNXimoGMPLdNAk/jj3gcN1Vx5
// SIG // pUkp5w2+oBN3vpQ97/vjK1oQH01WKKJ6cuASOrdJXtjt
// SIG // 7UORg9l7snuGG9k+sYxd6IlPhBryoS9Z5JA7La4zWMW3
// SIG // Pv4y07MDPbGyr5I4ftKdgCz1TlaRITUlwzluZH9TupwP
// SIG // rRkjhMv0ugOGjfdf8NBSv4yUh7zAIXQlXxgotswnKDgl
// SIG // mDlKNs98sZKuHCOnqWbsYR9q4ShJnV+I4iVd0yFLPlLE
// SIG // tVc/JAPw0XpbL9Uj43BdD1FGd7P4AOG8rAKCX9vAFbO9
// SIG // G9RVS+c5oQ/pI0m8GLhEfEXkwcNyeuBy5yTfv0aZxe/C
// SIG // HFfbg43sTUkwp6uO3+xbn6/83bBm4sGXgXvt1u1L50kp
// SIG // pxMopqd9Z4DmimJ4X7IvhNdXnFy/dygo8e1twyiPLI9A
// SIG // N0/B4YVEicQJTMXUpUMvdJX3bvh4IFgsE11glZo+TzOE
// SIG // 2rCIF96eTvSWsLxGoGyY0uDWiIwLAgMBAAGjggHtMIIB
// SIG // 6TAQBgkrBgEEAYI3FQEEAwIBADAdBgNVHQ4EFgQUSG5k
// SIG // 5VAF04KqFzc3IrVtqMp1ApUwGQYJKwYBBAGCNxQCBAwe
// SIG // CgBTAHUAYgBDAEEwCwYDVR0PBAQDAgGGMA8GA1UdEwEB
// SIG // /wQFMAMBAf8wHwYDVR0jBBgwFoAUci06AjGQQ7kUBU7h
// SIG // 6qfHMdEjiTQwWgYDVR0fBFMwUTBPoE2gS4ZJaHR0cDov
// SIG // L2NybC5taWNyb3NvZnQuY29tL3BraS9jcmwvcHJvZHVj
// SIG // dHMvTWljUm9vQ2VyQXV0MjAxMV8yMDExXzAzXzIyLmNy
// SIG // bDBeBggrBgEFBQcBAQRSMFAwTgYIKwYBBQUHMAKGQmh0
// SIG // dHA6Ly93d3cubWljcm9zb2Z0LmNvbS9wa2kvY2VydHMv
// SIG // TWljUm9vQ2VyQXV0MjAxMV8yMDExXzAzXzIyLmNydDCB
// SIG // nwYDVR0gBIGXMIGUMIGRBgkrBgEEAYI3LgMwgYMwPwYI
// SIG // KwYBBQUHAgEWM2h0dHA6Ly93d3cubWljcm9zb2Z0LmNv
// SIG // bS9wa2lvcHMvZG9jcy9wcmltYXJ5Y3BzLmh0bTBABggr
// SIG // BgEFBQcCAjA0HjIgHQBMAGUAZwBhAGwAXwBwAG8AbABp
// SIG // AGMAeQBfAHMAdABhAHQAZQBtAGUAbgB0AC4gHTANBgkq
// SIG // hkiG9w0BAQsFAAOCAgEAZ/KGpZjgVHkaLtPYdGcimwuW
// SIG // EeFjkplCln3SeQyQwWVfLiw++MNy0W2D/r4/6ArKO79H
// SIG // qaPzadtjvyI1pZddZYSQfYtGUFXYDJJ80hpLHPM8QotS
// SIG // 0LD9a+M+By4pm+Y9G6XUtR13lDni6WTJRD14eiPzE32m
// SIG // kHSDjfTLJgJGKsKKELukqQUMm+1o+mgulaAqPyprWElj
// SIG // HwlpblqYluSD9MCP80Yr3vw70L01724lruWvJ+3Q3fMO
// SIG // r5kol5hNDj0L8giJ1h/DMhji8MUtzluetEk5CsYKwsat
// SIG // ruWy2dsViFFFWDgycScaf7H0J/jeLDogaZiyWYlobm+n
// SIG // t3TDQAUGpgEqKD6CPxNNZgvAs0314Y9/HG8VfUWnduVA
// SIG // KmWjw11SYobDHWM2l4bf2vP48hahmifhzaWX0O5dY0Hj
// SIG // Wwechz4GdwbRBrF1HxS+YWG18NzGGwS+30HHDiju3mUv
// SIG // 7Jf2oVyW2ADWoUa9WfOXpQlLSBCZgB/QACnFsZulP0V3
// SIG // HjXG0qKin3p6IvpIlR+r+0cjgPWe+L9rt0uX4ut1eBrs
// SIG // 6jeZeRhL/9azI2h15q/6/IvrC4DqaTuv/DDtBEyO3991
// SIG // bWORPdGdVk5Pv4BXIqF4ETIheu9BCrE/+6jMpF3BoYib
// SIG // V3FWTkhFwELJm3ZbCoBIa/15n8G9bW1qyVJzEw16UM0x
// SIG // ghVbMIIVVwIBATCBlTB+MQswCQYDVQQGEwJVUzETMBEG
// SIG // A1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9u
// SIG // ZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9u
// SIG // MSgwJgYDVQQDEx9NaWNyb3NvZnQgQ29kZSBTaWduaW5n
// SIG // IFBDQSAyMDExAhMzAAABUptAn1BWmXWIAAAAAAFSMA0G
// SIG // CWCGSAFlAwQCAQUAoIGuMBkGCSqGSIb3DQEJAzEMBgor
// SIG // BgEEAYI3AgEEMBwGCisGAQQBgjcCAQsxDjAMBgorBgEE
// SIG // AYI3AgEVMC8GCSqGSIb3DQEJBDEiBCBxjIjOEDToBZMj
// SIG // VYr5YRjh+A1ZeGh/yIC1iATJiruAkTBCBgorBgEEAYI3
// SIG // AgEMMTQwMqAUgBIATQBpAGMAcgBvAHMAbwBmAHShGoAY
// SIG // aHR0cDovL3d3dy5taWNyb3NvZnQuY29tMA0GCSqGSIb3
// SIG // DQEBAQUABIIBAJQGvKOOWoVoRxsuLiI5OtjYMKhs3k8p
// SIG // WBbEU3n5XrGZg79RysMDyOlhGQ/KxUJ4YjEa1MHjnFWG
// SIG // 9osBmsqOWsrpH3G8e4Gz779XPtsq4sqe7hl7bYJT8eCp
// SIG // jIbA5lpYLdq7nvhzvWgXBJPnjw7uR6SimN3FoHFQRdR3
// SIG // XjFvVpbeqrid8uXvVA76EjmoAiRvZq/jaC5pEadOximc
// SIG // RIZw184CYLSSoa6LBOWUpv/6JXcUuLHE+am7RFOZOgTk
// SIG // 50l7C+t6nKzsQtHh492VzJL82EyKoual3V8tYuA/4ASf
// SIG // 6qcvwZDUTqo6cC93zzO8hwnssuQ1M/fH1+Vee+5/5oe4
// SIG // 7dyhghLlMIIS4QYKKwYBBAGCNwMDATGCEtEwghLNBgkq
// SIG // hkiG9w0BBwKgghK+MIISugIBAzEPMA0GCWCGSAFlAwQC
// SIG // AQUAMIIBUQYLKoZIhvcNAQkQAQSgggFABIIBPDCCATgC
// SIG // AQEGCisGAQQBhFkKAwEwMTANBglghkgBZQMEAgEFAAQg
// SIG // MsepOCvltjKLxbc9P5WVECixVjuN0o4MsmgIe7pUt/EC
// SIG // Bl2ODyAxcRgTMjAxOTEwMTIwMDI0MDAuMTY0WjAEgAIB
// SIG // 9KCB0KSBzTCByjELMAkGA1UEBhMCVVMxEzARBgNVBAgT
// SIG // Cldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAc
// SIG // BgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjElMCMG
// SIG // A1UECxMcTWljcm9zb2Z0IEFtZXJpY2EgT3BlcmF0aW9u
// SIG // czEmMCQGA1UECxMdVGhhbGVzIFRTUyBFU046RDJDRC1F
// SIG // MzEwLTRBRjExJTAjBgNVBAMTHE1pY3Jvc29mdCBUaW1l
// SIG // LVN0YW1wIFNlcnZpY2Wggg48MIIE8TCCA9mgAwIBAgIT
// SIG // MwAAAPnTC7IZARrBLQAAAAAA+TANBgkqhkiG9w0BAQsF
// SIG // ADB8MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGlu
// SIG // Z3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMV
// SIG // TWljcm9zb2Z0IENvcnBvcmF0aW9uMSYwJAYDVQQDEx1N
// SIG // aWNyb3NvZnQgVGltZS1TdGFtcCBQQ0EgMjAxMDAeFw0x
// SIG // ODEwMjQyMTE0MjlaFw0yMDAxMTAyMTE0MjlaMIHKMQsw
// SIG // CQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjEQ
// SIG // MA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9z
// SIG // b2Z0IENvcnBvcmF0aW9uMSUwIwYDVQQLExxNaWNyb3Nv
// SIG // ZnQgQW1lcmljYSBPcGVyYXRpb25zMSYwJAYDVQQLEx1U
// SIG // aGFsZXMgVFNTIEVTTjpEMkNELUUzMTAtNEFGMTElMCMG
// SIG // A1UEAxMcTWljcm9zb2Z0IFRpbWUtU3RhbXAgU2Vydmlj
// SIG // ZTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEB
// SIG // AK3n0XhMKZko76d/0pnNeV1Plq10mtiK6F3MTlELua6h
// SIG // mK8vvoWS1YtyNDVebW6LVI/VKhQlZRKHyUytyFGJYAkZ
// SIG // G7lBi6oF6+98RbyIr8U13O7W+ewjlzFsCyg8GrBKPe4c
// SIG // wHpGHKi+2Xk+Cg/lWBiqT3piM3phqVIPN3NJ3XHFbGkc
// SIG // aUDrkAUsZDMV6c857ajqPvprigScrPPgRv/HYc2zqIdD
// SIG // NU8uT9oLSjUBBrewF9/AmkN+Fi01vCCnF6UZQwHXRJum
// SIG // UDqe/RC8TQ2CEnlfGqdGzLa2YgPMD8Kf3fD4qaesRkCC
// SIG // r6iFgIavYrwYYwqj5L00r4CsfgLlPLucSKECAwEAAaOC
// SIG // ARswggEXMB0GA1UdDgQWBBSOqtFLBiwq1lqeQU/Q+z6T
// SIG // +ibBAzAfBgNVHSMEGDAWgBTVYzpcijGQ80N7fEYbxTNo
// SIG // WoVtVTBWBgNVHR8ETzBNMEugSaBHhkVodHRwOi8vY3Js
// SIG // Lm1pY3Jvc29mdC5jb20vcGtpL2NybC9wcm9kdWN0cy9N
// SIG // aWNUaW1TdGFQQ0FfMjAxMC0wNy0wMS5jcmwwWgYIKwYB
// SIG // BQUHAQEETjBMMEoGCCsGAQUFBzAChj5odHRwOi8vd3d3
// SIG // Lm1pY3Jvc29mdC5jb20vcGtpL2NlcnRzL01pY1RpbVN0
// SIG // YVBDQV8yMDEwLTA3LTAxLmNydDAMBgNVHRMBAf8EAjAA
// SIG // MBMGA1UdJQQMMAoGCCsGAQUFBwMIMA0GCSqGSIb3DQEB
// SIG // CwUAA4IBAQBlppvulTubzs3nX7hPTUUQKVcoFOYvAKKF
// SIG // 66Xf6nMRLB7ndJSzd4c310Ws8/45vsONv6HJwpfOXWVO
// SIG // mO32dEpScBX43JF9mF4YOvi6ePKURCpg3q5k0JLPMsKH
// SIG // A4ziMvHh9tPgrzLBQoh9N89aPxb+Jjo17ea1qaqVkmP4
// SIG // N6S4CBR1RIBXQZuEO76p0HDP1p8k6GNMG0qPp+/Gab7i
// SIG // NqVkrpSxIXHbMXVpDbe38QPx0Cu5M7+wkQnR6fbkC43M
// SIG // fsmHi66U1ZugLILgPnpxobJGCCTzYinGI3fX5lUvLhrN
// SIG // m7//xCRZ8eoWF9lrSp3ZVoW5lTjc8dD4hSHwoI4PddtJ
// SIG // MIIGcTCCBFmgAwIBAgIKYQmBKgAAAAAAAjANBgkqhkiG
// SIG // 9w0BAQsFADCBiDELMAkGA1UEBhMCVVMxEzARBgNVBAgT
// SIG // Cldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAc
// SIG // BgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEyMDAG
// SIG // A1UEAxMpTWljcm9zb2Z0IFJvb3QgQ2VydGlmaWNhdGUg
// SIG // QXV0aG9yaXR5IDIwMTAwHhcNMTAwNzAxMjEzNjU1WhcN
// SIG // MjUwNzAxMjE0NjU1WjB8MQswCQYDVQQGEwJVUzETMBEG
// SIG // A1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9u
// SIG // ZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9u
// SIG // MSYwJAYDVQQDEx1NaWNyb3NvZnQgVGltZS1TdGFtcCBQ
// SIG // Q0EgMjAxMDCCASIwDQYJKoZIhvcNAQEBBQADggEPADCC
// SIG // AQoCggEBAKkdDbx3EYo6IOz8E5f1+n9plGt0VBDVpQoA
// SIG // goX77XxoSyxfxcPlYcJ2tz5mK1vwFVMnBDEfQRsalR3O
// SIG // CROOfGEwWbEwRA/xYIiEVEMM1024OAizQt2TrNZzMFcm
// SIG // gqNFDdDq9UeBzb8kYDJYYEbyWEeGMoQedGFnkV+BVLHP
// SIG // k0ySwcSmXdFhE24oxhr5hoC732H8RsEnHSRnEnIaIYqv
// SIG // S2SJUGKxXf13Hz3wV3WsvYpCTUBR0Q+cBj5nf/VmwAOW
// SIG // RH7v0Ev9buWayrGo8noqCjHw2k4GkbaICDXoeByw6ZnN
// SIG // POcvRLqn9NxkvaQBwSAJk3jN/LzAyURdXhacAQVPIk0C
// SIG // AwEAAaOCAeYwggHiMBAGCSsGAQQBgjcVAQQDAgEAMB0G
// SIG // A1UdDgQWBBTVYzpcijGQ80N7fEYbxTNoWoVtVTAZBgkr
// SIG // BgEEAYI3FAIEDB4KAFMAdQBiAEMAQTALBgNVHQ8EBAMC
// SIG // AYYwDwYDVR0TAQH/BAUwAwEB/zAfBgNVHSMEGDAWgBTV
// SIG // 9lbLj+iiXGJo0T2UkFvXzpoYxDBWBgNVHR8ETzBNMEug
// SIG // SaBHhkVodHRwOi8vY3JsLm1pY3Jvc29mdC5jb20vcGtp
// SIG // L2NybC9wcm9kdWN0cy9NaWNSb29DZXJBdXRfMjAxMC0w
// SIG // Ni0yMy5jcmwwWgYIKwYBBQUHAQEETjBMMEoGCCsGAQUF
// SIG // BzAChj5odHRwOi8vd3d3Lm1pY3Jvc29mdC5jb20vcGtp
// SIG // L2NlcnRzL01pY1Jvb0NlckF1dF8yMDEwLTA2LTIzLmNy
// SIG // dDCBoAYDVR0gAQH/BIGVMIGSMIGPBgkrBgEEAYI3LgMw
// SIG // gYEwPQYIKwYBBQUHAgEWMWh0dHA6Ly93d3cubWljcm9z
// SIG // b2Z0LmNvbS9QS0kvZG9jcy9DUFMvZGVmYXVsdC5odG0w
// SIG // QAYIKwYBBQUHAgIwNB4yIB0ATABlAGcAYQBsAF8AUABv
// SIG // AGwAaQBjAHkAXwBTAHQAYQB0AGUAbQBlAG4AdAAuIB0w
// SIG // DQYJKoZIhvcNAQELBQADggIBAAfmiFEN4sbgmD+BcQM9
// SIG // naOhIW+z66bM9TG+zwXiqf76V20ZMLPCxWbJat/15/B4
// SIG // vceoniXj+bzta1RXCCtRgkQS+7lTjMz0YBKKdsxAQEGb
// SIG // 3FwX/1z5Xhc1mCRWS3TvQhDIr79/xn/yN31aPxzymXlK
// SIG // kVIArzgPF/UveYFl2am1a+THzvbKegBvSzBEJCI8z+0D
// SIG // pZaPWSm8tv0E4XCfMkon/VWvL/625Y4zu2JfmttXQOnx
// SIG // zplmkIz/amJ/3cVKC5Em4jnsGUpxY517IW3DnKOiPPp/
// SIG // fZZqkHimbdLhnPkd/DjYlPTGpQqWhqS9nhquBEKDuLWA
// SIG // myI4ILUl5WTs9/S/fmNZJQ96LjlXdqJxqgaKD4kWumGn
// SIG // Ecua2A5HmoDF0M2n0O99g/DhO3EJ3110mCIIYdqwUB5v
// SIG // vfHhAN/nMQekkzr3ZUd46PioSKv33nJ+YWtvd6mBy6cJ
// SIG // rDm77MbL2IK0cs0d9LiFAR6A+xuJKlQ5slvayA1VmXqH
// SIG // czsI5pgt6o3gMy4SKfXAL1QnIffIrE7aKLixqduWsqdC
// SIG // osnPGUFN4Ib5KpqjEWYw07t0MkvfY3v1mYovG8chr1m1
// SIG // rtxEPJdQcdeh0sVV42neV8HR3jDA/czmTfsNv11P6Z0e
// SIG // GTgvvM9YBS7vDaBQNdrvCScc1bN+NR4Iuto229Nfj950
// SIG // iEkSoYICzjCCAjcCAQEwgfihgdCkgc0wgcoxCzAJBgNV
// SIG // BAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYD
// SIG // VQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQg
// SIG // Q29ycG9yYXRpb24xJTAjBgNVBAsTHE1pY3Jvc29mdCBB
// SIG // bWVyaWNhIE9wZXJhdGlvbnMxJjAkBgNVBAsTHVRoYWxl
// SIG // cyBUU1MgRVNOOkQyQ0QtRTMxMC00QUYxMSUwIwYDVQQD
// SIG // ExxNaWNyb3NvZnQgVGltZS1TdGFtcCBTZXJ2aWNloiMK
// SIG // AQEwBwYFKw4DAhoDFQABylk9bgCOQuIwWEs1T3MrwMXS
// SIG // PaCBgzCBgKR+MHwxCzAJBgNVBAYTAlVTMRMwEQYDVQQI
// SIG // EwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4w
// SIG // HAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xJjAk
// SIG // BgNVBAMTHU1pY3Jvc29mdCBUaW1lLVN0YW1wIFBDQSAy
// SIG // MDEwMA0GCSqGSIb3DQEBBQUAAgUA4UsCPzAiGA8yMDE5
// SIG // MTAxMTIxMjkzNVoYDzIwMTkxMDEyMjEyOTM1WjB3MD0G
// SIG // CisGAQQBhFkKBAExLzAtMAoCBQDhSwI/AgEAMAoCAQAC
// SIG // AjJxAgH/MAcCAQACAhGAMAoCBQDhTFO/AgEAMDYGCisG
// SIG // AQQBhFkKBAIxKDAmMAwGCisGAQQBhFkKAwKgCjAIAgEA
// SIG // AgMHoSChCjAIAgEAAgMBhqAwDQYJKoZIhvcNAQEFBQAD
// SIG // gYEAc4IlH9mYM68vsJ8ALPtHhse0v7CJfkbBzPGsp2By
// SIG // aBB/ZwzyDBdMt9Bp5f4T32prISB/RMaiaqV2gKSWsp0W
// SIG // RMdB9YX1fjZtg0stxfU5Wvl6QcaRxyPRkXLApExNGJqp
// SIG // Z2v3QbpYK1qPUy+LjHGplmkmYWZeFLRB4FefvQwkLKIx
// SIG // ggMNMIIDCQIBATCBkzB8MQswCQYDVQQGEwJVUzETMBEG
// SIG // A1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9u
// SIG // ZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9u
// SIG // MSYwJAYDVQQDEx1NaWNyb3NvZnQgVGltZS1TdGFtcCBQ
// SIG // Q0EgMjAxMAITMwAAAPnTC7IZARrBLQAAAAAA+TANBglg
// SIG // hkgBZQMEAgEFAKCCAUowGgYJKoZIhvcNAQkDMQ0GCyqG
// SIG // SIb3DQEJEAEEMC8GCSqGSIb3DQEJBDEiBCCBXzut8st2
// SIG // 9UuHNXQH+urvs97SeccpYVa6la7ywYx3VTCB+gYLKoZI
// SIG // hvcNAQkQAi8xgeowgecwgeQwgb0EIMajWXaezytNQFS2
// SIG // Sk8FbziY9SLKN60xDsIr22TuXP3fMIGYMIGApH4wfDEL
// SIG // MAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24x
// SIG // EDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jv
// SIG // c29mdCBDb3Jwb3JhdGlvbjEmMCQGA1UEAxMdTWljcm9z
// SIG // b2Z0IFRpbWUtU3RhbXAgUENBIDIwMTACEzMAAAD50wuy
// SIG // GQEawS0AAAAAAPkwIgQgKPgOekp5JgYpdTjEBpWb4OQo
// SIG // NuCMUzVGABDAzd6/mI8wDQYJKoZIhvcNAQELBQAEggEA
// SIG // mzdItZF/PStSxdHWs4grvcq/6jlH1IWyeCq4TKzQaFKY
// SIG // UJ8ZL1xKqnrhgQq/UKKhaKB3/JqZk6YX8IxjQ0U9rFED
// SIG // vdnmR+k/LbOSijD3fZkDgZOksa2dG36FVD5ZVUbm2HyB
// SIG // yrLcg1kuKhuIc3nFVQphomUKTE0XW17+VXKYoP+RMJgF
// SIG // kOeTdOc67tjEBCk+lBUdTW+6I/lYfcvsArYrwodx02xa
// SIG // E+l18EGubu//grNDh8CaP/6AoZ4QLBQI+FBdOcvXODw0
// SIG // ok/p/H00deT3JhDhbxu6CLc7ydBeyy1I1Nrh+9LAsYvh
// SIG // vf85jAlBvP5eWVcXEJXy71g5uTC6rdaRZw==
// SIG // End signature block
