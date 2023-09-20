//
// Copyright (c) Microsoft Corporation.  All rights reserved.
//
//
// Use of this source code is subject to the terms of the Microsoft shared
// source or premium shared source license agreement under which you licensed
// this source code. If you did not accept the terms of the license agreement,
// you are not authorized to use this source code. For the terms of the license,
// please see the license agreement between you and Microsoft or, if applicable,
// see the SOURCE.RTF on your install media or the root of your tools installation.
// THE SOURCE CODE IS PROVIDED "AS IS", WITH NO WARRANTIES OR INDEMNITIES.
//

// services.debug.trace("Translating");

///////////////////////////////////////////////////////////////////////////////
//
// Helper functions 
//
///////////////////////////////////////////////////////////////////////////////
function getCameraElement() {
    var camera = document.elements.findElementByTypeId("Microsoft.VisualStudio.3D.PerspectiveCamera");
    return camera;
}

function getWorldMatrix(element) {
    return element.getTrait("WorldTransform").value;
}

function getFrustumHeightAtDepth(zDepth, fovy) {
    var angle = (fovy * 0.5) * 3.14 / 180.0;
    return 2.0 * zDepth * Math.tan(angle);
}

function getParentToLocal(element) {
    var localToWorldMatrix = getWorldMatrix(element);
    var worldToLocal = math.getInverse(localToWorldMatrix);

    var parent = element.parent;
    if (parent != null) {
        var parentToWorld = getWorldMatrix(parent);

        return math.multiplyMatrix(worldToLocal, parentToWorld);
    }
    else {
        return worldToLocal;
    }
}

function getFirstSelectedWithoutAncestorInSelection() {
    var count = services.selection.count;
    for (var i = 0; i < count; i++) {
        var currSelected = services.selection.getElement(i);

        //
        // don't operate on items whose parents (in scene) are ancestors
        // since this will double the amount of translation applied to those
        //
        var hasAncestor = false;
        for (var otherIndex = 0; otherIndex < count; otherIndex++) {
            if (otherIndex != i) {
                var ancestor = services.selection.getElement(otherIndex);
                if (currSelected.behavior.isAncestor(ancestor)) {
                    hasAncestor = true;
                    break;
                }
            }
        }

        if (!hasAncestor) {
            return currSelected;
        }
    }
    return null;
}

///////////////////////////////////////////////////////////////////////////////
//
// heper to get a designer property as a bool
//
///////////////////////////////////////////////////////////////////////////////
function getDesignerPropAsBool(tname) {
    if (document.designerProps.hasTrait(tname))
        return document.designerProps.getTrait(tname).value;

    return false;
}

function getSelectionMode() {
    if (getDesignerPropAsBool("usePivot"))
        return 0; // default to object mode when using pivot
    if (document.designerProps.hasTrait("SelectionMode"))
        return document.designerProps.getTrait("SelectionMode").value;
    return 0;
}

function getCommandState(commandName) {
    var commandData = services.commands.getCommandData(commandName);
    if (commandData != null) {
        var trait = commandData.getTrait("state");
        if (trait != null) {
            return trait.value;
        }
    }
    return -1;
}

///////////////////////////////////////////////////////////////////////////////
//
// Button state trait
//
///////////////////////////////////////////////////////////////////////////////

var state = command.getTrait("state");

///////////////////////////////////////////////////////////////////////////////
//
// Property window and tool settings 
//
///////////////////////////////////////////////////////////////////////////////
var enablePropertyWindow = 8;

var stepAmount = 5.0;

function StepAmountChanged(sender, args) {
    stepAmount = document.toolProps.getTrait("StepAmount").value;
}


var toolProps;
var toolPropCookie;
var snapCookie;
function createOptions() {

    var snapTrait = document.designerProps.getOrCreateTrait("snap", "bool", 0);
    snapCookie = snapTrait.addHandler("OnDataChanged", OnSnapEnabledTraitChanged);

    toolProps = document.createElement("toolProps", "type", "toolProps");
    toolProps.getOrCreateTrait("StepAmount", "float", enablePropertyWindow);
    document.toolProps = toolProps;

    toolProps.getTrait("StepAmount").value = stepAmount;

    // Set up the callback when the option traits are changed
    toolPropCookie = toolProps.getTrait("StepAmount").addHandler("OnDataChanged", StepAmountChanged);

    OnSnapEnabledTraitChanged(null, null);
}

function OnSnapEnabledTraitChanged(sender, args) {
    var snapTrait = document.designerProps.getOrCreateTrait("snap", "bool", 0);
    if (toolProps != null) {
        var stepAmountTrait = toolProps.getTrait("StepAmount");
        if (stepAmountTrait != null) {
            var newFlags = stepAmountTrait.flags;
            if (snapTrait.value) {
                newFlags |= enablePropertyWindow;
            }
            else {
                newFlags &= ~enablePropertyWindow;
            }
            stepAmountTrait.flags = newFlags;

            document.refreshPropertyWindow();
        }
    }
}

///////////////////////////////////////////////////////////////////////////////
//
// Manipulator registration and event handling
//
///////////////////////////////////////////////////////////////////////////////
var manipulatorData = services.manipulators.getManipulatorData("TranslationManipulator");
var manipulator = services.manipulators.getManipulator("TranslationManipulator");
var undoableItem;

function getTranslationTraitId() {
    var translationTraitId;
    if (getDesignerPropAsBool("usePivot")) {
        translationTraitId = "PivotTranslation";
    }
    else {
        translationTraitId = "Translation";
    }
    return translationTraitId;
}

// find the mesh child
function findFirstChildMesh(parent)
{
    // find the mesh child
    for (var i = 0; i < parent.childCount; i++) {

        // get child and its materials
        var child = parent.getChild(i);
        if (child.typeId == "Microsoft.VisualStudio.3D.Mesh") {
            return child;
        }
    }
    return null;
}

///////////////////////////////////////////////////////////////////////////////
//
// Translation logic
//
///////////////////////////////////////////////////////////////////////////////
function coreTranslate(dx, dy, dz) {

    var selectionMode = getSelectionMode();

    var selectedElement = getFirstSelectedWithoutAncestorInSelection();

    if (selectedElement == null) {
        return;
    }

    if (selectionMode == 0) {

        // object selection mode
        var translationTraitId = getTranslationTraitId();

        var t = selectedElement.getTrait(translationTraitId).value;

        var isSnapMode = getDesignerPropAsBool("snap");

        if (isSnapMode && stepAmount != 0) {
        
            var newX = t[0] + dx;
            var newY = t[1] + dy;
            var newZ = t[2] + dz;

            var tmpX = Math.round(newX / stepAmount) * stepAmount;
            var tmpY = Math.round(newY / stepAmount) * stepAmount;
            var tmpZ = Math.round(newZ / stepAmount) * stepAmount;

            var halfStep = stepAmount * 0.5;
            var stepPct = halfStep * 0.9;

            if (Math.abs(tmpX - newX) < stepPct) {
                t[0] = tmpX;
            }

            if (Math.abs(tmpY - newY) < stepPct) {
                t[1] = tmpY;
            }

            if (Math.abs(tmpZ - newZ) < stepPct) {
                t[2] = tmpZ;
            }
        }
        else {
            t[0] = t[0] + dx;
            t[1] = t[1] + dy;
            t[2] = t[2] + dz;
        }

        undoableItem._lastValue = t;
        undoableItem.onDo();
    }
    else if (selectionMode == 1 || selectionMode == 2 || selectionMode == 3) {

        // polygon or edge selection mode

        var pToL = getParentToLocal(selectedElement);
        var v = [dx, dy, dz];

        v = math.transformNormal(pToL, v);

        undoableItem._currentDelta[0] = v[0];
        undoableItem._currentDelta[1] = v[1];
        undoableItem._currentDelta[2] = v[2];

        undoableItem.onDo();
    }
}

///////////////////////////////////////////////////////////////////////////////
//
// Listens to manipulator position changes
//
///////////////////////////////////////////////////////////////////////////////
function onManipulatorXYZChangedHandler(sender, args) {

    var xyzDelta = manipulatorData.getTrait("ManipulatorTraitXYZ").value;
    var dx = xyzDelta[0];
    var dy = xyzDelta[1];
    var dz = xyzDelta[2];

    coreTranslate(dx, dy, dz);
}

///////////////////////////////////////////////////////////////////////////////
//
// Called when manipulator begins modifying the object (i.e. mouse down and begin drag)
// Begins the undoable block / marks the restore point
//
///////////////////////////////////////////////////////////////////////////////
function onBeginManipulation() {

    // services.debug.trace("Translate: onBeginManipulation()");    

    undoableItem = null;

    //
    // Check the selection mode
    //
    var selectionMode = getSelectionMode();
    if (selectionMode == 0) {
        //
        // object selection
        //

        // services.debug.trace("onBeginManipulation - object selection");

        var translationTraitId = getTranslationTraitId();

        function UndoableTranslation(trait, traitValues, initialValue) {
            this._traitArray = traitArray;
            this._traitValues = traitValues;
            this._initialValues = initialValue;
        }

        var traitArray = new Array();
        var traitValues = new Array();
        var initialValues = new Array();

        //
        // add the traits of selected items to the collections that we'll be operating on
        //
        var count = services.selection.count;
        for (i = 0; i < count; i++) {
            var currSelected = services.selection.getElement(i);

            //
            // don't operate on items whose parents (in scene) are ancestors
            // since this will double the amount of translation applied to those
            //
            var hasAncestor = false;
            for (var otherIndex = 0; otherIndex < count; otherIndex++) {
                if (otherIndex != i) {
                    var ancestor = services.selection.getElement(otherIndex);
                    if (currSelected.behavior.isAncestor(ancestor)) {
                        hasAncestor = true;
                        break;
                    }
                }
            }

            if (!hasAncestor) {

                var currTrait = currSelected.getTrait(translationTraitId);

                traitArray.push(currTrait);
                traitValues.push(currTrait.value);
                initialValues.push(currTrait.value);
            }
        }


        // create the undoable item
        undoableItem = new UndoableTranslation(traitArray, traitValues, initialValues);

        undoableItem.onDo = function () {

            var count = this._traitArray.length;

            // movement delta of all the selected is determined by delta of the first selected
            var delta = [0, 0, 0];
            if (count > 0) {
                delta[0] = this._lastValue[0] - this._initialValues[0][0];
                delta[1] = this._lastValue[1] - this._initialValues[0][1];
                delta[2] = this._lastValue[2] - this._initialValues[0][2];
            }

            for (i = 0; i < count; i++) {
                var currTrait = this._traitArray[i];
                this._traitValues[i][0] = this._initialValues[i][0] + delta[0];
                this._traitValues[i][1] = this._initialValues[i][1] + delta[1];
                this._traitValues[i][2] = this._initialValues[i][2] + delta[2];

                var theVal = this._traitArray[i].value;
                theVal[0] = this._traitValues[i][0];
                theVal[1] = this._traitValues[i][1];
                theVal[2] = this._traitValues[i][2];
                this._traitArray[i].value = theVal;
            }
        }

        undoableItem.onUndo = function () {
            var count = this._traitArray.length;
            for (i = 0; i < count; i++) {
                this._traitArray[i].value = this._initialValues[i];
            }
        }
    }
    else if (selectionMode == 1) {
        //
        // polygon selection mode
        //

        // services.debug.trace("onBeginManipulation - polygon selection");

        function UndoablePolyTranslation(elem) {
            // services.debug.trace("UndoablePolyTranslation construct");

            this._totalDelta = [0, 0, 0];
            this._currentDelta = [0, 0, 0];

            // find the mesh child
            this._meshElem = findFirstChildMesh(elem);
            if (this._meshElem == null) {
                return;
            }
            // services.debug.trace("UndoablePolyTranslation found mesh element");

            this._mesh = this._meshElem.behavior;

            // loop over the elements in the polygon collection
            var collElem = this._mesh.selectedObjects;
            if (collElem == null) {
                return;
            }

            this._polyCollectionElem = collElem.clone();

            // services.debug.trace("UndoablePolyTranslation found _polyCollectionElem element");

            // get the actual collection we can operate on
            this._polyCollection = this._polyCollectionElem.behavior;
            // services.debug.trace("assigned _polyCollection");

            this._geom = this._meshElem.getTrait("Geometry").value
        }

        //
        // do
        //
        UndoablePolyTranslation.prototype.onDo = function () {

            // array we will store indices in
            var polygonPoints = new Object();

            // loop over the point indices in the poly collection
            var polyCount = this._polyCollection.getPolygonCount();
            for (var i = 0; i < polyCount; i++) {
                var polyIndex = this._polyCollection.getPolygon(i);

                // get the point count and loop over polygon points
                var polygonPointCount = this._geom.getPolygonPointCount(polyIndex);
                for (var j = 0; j < polygonPointCount; j++) {

                    // get the point index
                    var pointIndex = this._geom.getPolygonPoint(polyIndex, j);
                    polygonPoints[pointIndex] = pointIndex;
                }
            }

            // loop over the unique set of indices and transform the associated point
            for (var key in polygonPoints) {
                var ptIdx = polygonPoints[key];
                var pt = this._geom.getPointAt(ptIdx);
                pt[0] += this._currentDelta[0];
                pt[1] += this._currentDelta[1];
                pt[2] += this._currentDelta[2];
                this._geom.setPointAt(ptIdx, pt);
            }

            this._totalDelta[0] += this._currentDelta[0];
            this._totalDelta[1] += this._currentDelta[1];
            this._totalDelta[2] += this._currentDelta[2];

            // invalidate the mesh collision
            this._mesh.recomputeCachedGeometry();
        }

        //
        // undo
        //
        UndoablePolyTranslation.prototype.onUndo = function () {

            // array we will store indices in
            var polygonPoints = new Object();

            // loop over the point indices in the poly collection
            var polyCount = this._polyCollection.getPolygonCount();
            for (var i = 0; i < polyCount; i++) {
                var polyIndex = this._polyCollection.getPolygon(i);

                // get the point count and loop over polygon points
                var polygonPointCount = this._geom.getPolygonPointCount(polyIndex);
                for (var j = 0; j < polygonPointCount; j++) {

                    // get the point index
                    var pointIndex = this._geom.getPolygonPoint(polyIndex, j);
                    polygonPoints[pointIndex] = pointIndex;
                }
            }

            // loop over the unique set of indices and transform the associated point
            for (var key in polygonPoints) {
                var ptIdx = polygonPoints[key];
                var pt = this._geom.getPointAt(ptIdx);
                pt[0] -= this._totalDelta[0];
                pt[1] -= this._totalDelta[1];
                pt[2] -= this._totalDelta[2];
                this._geom.setPointAt(ptIdx, pt);
            }

            this._currentDelta[0] = this._totalDelta[0];
            this._currentDelta[1] = this._totalDelta[1];
            this._currentDelta[2] = this._totalDelta[2];

            this._totalDelta[0] = 0;
            this._totalDelta[1] = 0;
            this._totalDelta[2] = 0;

            this._mesh.recomputeCachedGeometry();
        }

        // create the undoable item
        undoableItem = new UndoablePolyTranslation(document.selectedElement);
    }
    else if (selectionMode == 2) {
        //
        // edge selection
        //
        // services.debug.trace("onBeginManipulation - edge selection");

        function UndoableEdgeTranslation(elem) {
            // services.debug.trace("UndoableEdgeTranslation construct");

            this._totalDelta = [0, 0, 0];
            this._currentDelta = [0, 0, 0];

            // find the mesh child
            this._meshElem = findFirstChildMesh(elem);
            if (this._meshElem == null) {
                return;
            }
            // services.debug.trace("UndoableEdgeTranslation found mesh element");

            this._mesh = this._meshElem.behavior;

            // loop over the elements in the polygon collection
            var collElem = this._mesh.selectedObjects;
            if (collElem == null) {
                return;
            }

            this._collectionElem = collElem.clone();

            // services.debug.trace("UndoableEdgeTranslation found _collectionElem element");

            // get the actual collection we can operate on
            this._edgeCollection = this._collectionElem.behavior;
            // services.debug.trace("assigned _edgeCollection");

            this._geom = this._meshElem.getTrait("Geometry").value
        }

        //
        // do
        //
        UndoableEdgeTranslation.prototype.onDo = function () {

            // array we will store indices in
            var points = new Object();

            // loop over the edges
            var edgeCount = this._edgeCollection.getEdgeCount();
            for (var i = 0; i < edgeCount; i++) {
                var edge = this._edgeCollection.getEdge(i);

                points[edge[0]] = edge[0];
                points[edge[1]] = edge[1];
            }

            // loop over the unique set of indices and transform the associated point
            for (var key in points) {
                var ptIdx = points[key];
                var pt = this._geom.getPointAt(ptIdx);
                pt[0] += this._currentDelta[0];
                pt[1] += this._currentDelta[1];
                pt[2] += this._currentDelta[2];
                this._geom.setPointAt(ptIdx, pt);
            }

            this._totalDelta[0] += this._currentDelta[0];
            this._totalDelta[1] += this._currentDelta[1];
            this._totalDelta[2] += this._currentDelta[2];

            // invalidate the mesh collision
            this._mesh.recomputeCachedGeometry();
        }

        //
        // undo
        //
        UndoableEdgeTranslation.prototype.onUndo = function () {

            // array we will store indices in
            var points = new Object();

            // loop over the edges
            var edgeCount = this._edgeCollection.getEdgeCount();
            for (var i = 0; i < edgeCount; i++) {
                var edge = this._edgeCollection.getEdge(i);

                points[edge[0]] = edge[0];
                points[edge[1]] = edge[1];
            }

            // loop over the unique set of indices and transform the associated point
            for (var key in points) {
                var ptIdx = points[key];
                var pt = this._geom.getPointAt(ptIdx);
                pt[0] -= this._totalDelta[0];
                pt[1] -= this._totalDelta[1];
                pt[2] -= this._totalDelta[2];
                this._geom.setPointAt(ptIdx, pt);
            }

            this._currentDelta[0] = this._totalDelta[0];
            this._currentDelta[1] = this._totalDelta[1];
            this._currentDelta[2] = this._totalDelta[2];

            this._totalDelta[0] = 0;
            this._totalDelta[1] = 0;
            this._totalDelta[2] = 0;

            this._mesh.recomputeCachedGeometry();
        }

        // create the undoable item
        undoableItem = new UndoableEdgeTranslation(document.selectedElement);
    }
    else if (selectionMode == 3) {
        //
        // point selection
        //
        // services.debug.trace("onBeginManipulation - point selection");

        function UndoablePointTranslation(elem) {
            // services.debug.trace("UndoablePointTranslation construct");

            this._totalDelta = [0, 0, 0];
            this._currentDelta = [0, 0, 0];

            // find the mesh child
            this._meshElem = findFirstChildMesh(elem);
            if (this._meshElem == null) {
                return;
            }
            // services.debug.trace("UndoablePointTranslation found mesh element");

            this._mesh = this._meshElem.behavior;

            // loop over the elements in the polygon collection
            var collElem = this._mesh.selectedObjects;
            if (collElem == null) {
                return;
            }

            this._collectionElem = collElem.clone();

            // services.debug.trace("UndoablePointTranslation found _collectionElem element");

            // get the actual collection we can operate on
            this._pointCollection = this._collectionElem.behavior;
            // services.debug.trace("assigned _pointCollection");

            this._geom = this._meshElem.getTrait("Geometry").value
        }

        //
        // do
        //
        UndoablePointTranslation.prototype.onDo = function () {

            // array we will store indices in
            var points = new Object();

            // loop over the points
            var pointCount = this._pointCollection.getPointCount();
            for (var i = 0; i < pointCount; i++) {
                var pointIndex = this._pointCollection.getPoint(i);

                points[pointIndex] = pointIndex;
            }

            // loop over the unique set of indices and transform the associated point
            for (var key in points) {
                var ptIdx = points[key];
                var pt = this._geom.getPointAt(ptIdx);
                pt[0] += this._currentDelta[0];
                pt[1] += this._currentDelta[1];
                pt[2] += this._currentDelta[2];
                this._geom.setPointAt(ptIdx, pt);
            }

            this._totalDelta[0] += this._currentDelta[0];
            this._totalDelta[1] += this._currentDelta[1];
            this._totalDelta[2] += this._currentDelta[2];

            // invalidate the mesh collision
            this._mesh.recomputeCachedGeometry();
        }

        //
        // undo
        //
        UndoablePointTranslation.prototype.onUndo = function () {

            // array we will store indices in
            var points = new Object();

            // loop over the points
            var pointCount = this._pointCollection.getPointCount();
            for (var i = 0; i < pointCount; i++) {
                var pointIndex = this._pointCollection.getPoint(i);

                points[pointIndex] = pointIndex;
            }

            // loop over the unique set of indices and transform the associated point
            for (var key in points) {
                var ptIdx = points[key];
                var pt = this._geom.getPointAt(ptIdx);
                pt[0] -= this._totalDelta[0];
                pt[1] -= this._totalDelta[1];
                pt[2] -= this._totalDelta[2];
                this._geom.setPointAt(ptIdx, pt);
            }

            this._currentDelta[0] = this._totalDelta[0];
            this._currentDelta[1] = this._totalDelta[1];
            this._currentDelta[2] = this._totalDelta[2];

            this._totalDelta[0] = 0;
            this._totalDelta[1] = 0;
            this._totalDelta[2] = 0;

            this._mesh.recomputeCachedGeometry();
        }

        // create the undoable item
        undoableItem = new UndoablePointTranslation(document.selectedElement);
    }

    if (undoableItem != null) {
        undoableItem.getName = function () {
            var IDS_MreUndoTranslate = 143;
            return services.strings.getStringFromId(IDS_MreUndoTranslate);
        }
        services.undoService.addUndoableItem(undoableItem);
    }
}

///////////////////////////////////////////////////////////////////////////////
//
// onEndManipulation
//
///////////////////////////////////////////////////////////////////////////////
function onEndManipulation() {
}


///////////////////////////////////////////////////////////////////////////////
//
// Tool
//
///////////////////////////////////////////////////////////////////////////////
var tool = new Object();
// services.debug.trace("Translate: tool = new Object()");    

var onBeginManipulationHandler;
var onEndManipulationHandler;


///////////////////////////////////////////////////////////////////////////////
//
// Tool activate
//
///////////////////////////////////////////////////////////////////////////////
tool.activate = function () {
    // services.debug.trace("Translate: tool.activate()");    

    state.value = 2;

    createOptions();

    services.manipulators.activate("TranslationManipulator");

    onBeginManipulationHandler = manipulator.addHandler("OnBeginManipulation", onBeginManipulation);
    onEndManipulationHandler = manipulator.addHandler("OnEndManipulation", onEndManipulation);
    
    var mxyz = manipulatorData.getTrait("ManipulatorTraitXYZ");
    var ct = manipulatorData.getOrCreateTrait("cookie", "int", 0);
    ct.value = mxyz.addHandler("OnDataChanged", onManipulatorXYZChangedHandler);
}

///////////////////////////////////////////////////////////////////////////////
//
// Tool Deactive
//
///////////////////////////////////////////////////////////////////////////////
tool.deactivate = function () {
    // services.debug.trace("Translate: tool.deactivate()");    

    state.value = 0;

    var ct = manipulatorData.getTrait("cookie");
    manipulatorData.getTrait("ManipulatorTraitXYZ").removeHandler("OnDataChanged", ct.value);

    manipulator.removeHandler("OnBeginManipulation", onBeginManipulationHandler);
    manipulator.removeHandler("OnEndManipulation" , onEndManipulationHandler);

    services.manipulators.deactivate("TranslationManipulator");

    toolProps.getTrait("StepAmount").removeHandler("OnDataChanged", toolPropCookie);
    var snapTrait = document.designerProps.getOrCreateTrait("snap", "bool", 0);
    snapTrait.removeHandler("OnDataChanged", snapCookie);
}

///////////////////////////////////////////////////////////////////////////////
// Global code
///////////////////////////////////////////////////////////////////////////////

if (state.value != 2) {
    // services.debug.trace("Translate: setTool()");    
    document.setTool(tool);
}
// SIG // Begin signature block
// SIG // MIIkWgYJKoZIhvcNAQcCoIIkSzCCJEcCAQExDzANBglg
// SIG // hkgBZQMEAgEFADB3BgorBgEEAYI3AgEEoGkwZzAyBgor
// SIG // BgEEAYI3AgEeMCQCAQEEEBDgyQbOONQRoqMAEEvTUJAC
// SIG // AQACAQACAQACAQACAQAwMTANBglghkgBZQMEAgEFAAQg
// SIG // 0eYuOxb6M7D6xewduFYfjBObsRakPS0tQ0eppdN49vOg
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
// SIG // ghYtMIIWKQIBATCBlTB+MQswCQYDVQQGEwJVUzETMBEG
// SIG // A1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9u
// SIG // ZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9u
// SIG // MSgwJgYDVQQDEx9NaWNyb3NvZnQgQ29kZSBTaWduaW5n
// SIG // IFBDQSAyMDExAhMzAAABUptAn1BWmXWIAAAAAAFSMA0G
// SIG // CWCGSAFlAwQCAQUAoIGuMBkGCSqGSIb3DQEJAzEMBgor
// SIG // BgEEAYI3AgEEMBwGCisGAQQBgjcCAQsxDjAMBgorBgEE
// SIG // AYI3AgEVMC8GCSqGSIb3DQEJBDEiBCD0DnWrsryU9PZP
// SIG // c8gvUSDj2VDSVGZZ6Jrn137Mrc/CBjBCBgorBgEEAYI3
// SIG // AgEMMTQwMqAUgBIATQBpAGMAcgBvAHMAbwBmAHShGoAY
// SIG // aHR0cDovL3d3dy5taWNyb3NvZnQuY29tMA0GCSqGSIb3
// SIG // DQEBAQUABIIBAAMxOlDHILZ0thkmkZ22EEtJcF4LXTxO
// SIG // ZvzY15WUvgzrBPKRrCNXgbg/Bu72iP2fqDBKYWIrZmji
// SIG // E23ACz6XWOlLA+wXuAHGfBm9XtGeN1H40cLLtUYEToo1
// SIG // tEQ6RhtKqk4Fqy1DXuDcQSL3hdKBLbLtVKYQijOD14Cy
// SIG // CzqvPsJtcZ2q/accF+l73I9b2HVSLDoR3qtkRA2SNvGI
// SIG // 0iR/yoMFHOabB5BQ3LuQhjruyMQZ2EBzxKILdTEYxlpr
// SIG // 77vlo+IpJ3Rp59rtXak1Edxcb8GhmxfWdOlIB4NrSgxX
// SIG // d8DpBMUbY6+lrP+5XJaynj0MPhdX12gU1AKJ/E94qH/H
// SIG // BQihghO3MIITswYKKwYBBAGCNwMDATGCE6MwghOfBgkq
// SIG // hkiG9w0BBwKgghOQMIITjAIBAzEPMA0GCWCGSAFlAwQC
// SIG // AQUAMIIBWAYLKoZIhvcNAQkQAQSgggFHBIIBQzCCAT8C
// SIG // AQEGCisGAQQBhFkKAwEwMTANBglghkgBZQMEAgEFAAQg
// SIG // 4xzuvc2I/mo+AsHBxDqvkkqVUjKtzCc405Rgj98NOb0C
// SIG // Bl4l0ycBQRgTMjAyMDAxMjQyMTA0NDEuNDcyWjAHAgEB
// SIG // gAIB9KCB1KSB0TCBzjELMAkGA1UEBhMCVVMxEzARBgNV
// SIG // BAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQx
// SIG // HjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEp
// SIG // MCcGA1UECxMgTWljcm9zb2Z0IE9wZXJhdGlvbnMgUHVl
// SIG // cnRvIFJpY28xJjAkBgNVBAsTHVRoYWxlcyBUU1MgRVNO
// SIG // OjMxQzUtMzBCQS03QzkxMSUwIwYDVQQDExxNaWNyb3Nv
// SIG // ZnQgVGltZS1TdGFtcCBTZXJ2aWNloIIPHzCCBPUwggPd
// SIG // oAMCAQICEzMAAAD+AfC1Hv/p+a0AAAAAAP4wDQYJKoZI
// SIG // hvcNAQELBQAwfDELMAkGA1UEBhMCVVMxEzARBgNVBAgT
// SIG // Cldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAc
// SIG // BgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEmMCQG
// SIG // A1UEAxMdTWljcm9zb2Z0IFRpbWUtU3RhbXAgUENBIDIw
// SIG // MTAwHhcNMTkwOTA2MjA0MTA4WhcNMjAxMjA0MjA0MTA4
// SIG // WjCBzjELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hp
// SIG // bmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoT
// SIG // FU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEpMCcGA1UECxMg
// SIG // TWljcm9zb2Z0IE9wZXJhdGlvbnMgUHVlcnRvIFJpY28x
// SIG // JjAkBgNVBAsTHVRoYWxlcyBUU1MgRVNOOjMxQzUtMzBC
// SIG // QS03QzkxMSUwIwYDVQQDExxNaWNyb3NvZnQgVGltZS1T
// SIG // dGFtcCBTZXJ2aWNlMIIBIjANBgkqhkiG9w0BAQEFAAOC
// SIG // AQ8AMIIBCgKCAQEA2gP1ZNTNL3u8mfyXzOQyC+mDWoHe
// SIG // BzppZekpt8j9GOIkaUPL/qurorZfDpmahUv6cno5w1fD
// SIG // AK10KRYd+T+ofCLjvcYQeEOvKgKVgqNTjkPsC3ygivaQ
// SIG // 8GnQKK1y1TDF4y13HjNgZ2MTbJOFvFpoIEErrgOr2xqv
// SIG // 5sVmk6rGSr0OuqMWcs/YbBuwdUINWvBZf+WJl6W/tkjg
// SIG // 3jc7PSa9yzEINNyjrXlXpY8WgB1NiJu3/t55/Rym7QT/
// SIG // EBXdIllutccBee1pkDiMzdU+DPDEnczzUbrPGJ9H42/N
// SIG // Oi9mGp3beG1ftzkUy8jftpMDpjPkwPjIRHEKlEWGjgeK
// SIG // c0tvsQIDAQABo4IBGzCCARcwHQYDVR0OBBYEFPfjCzIg
// SIG // zOVkxFXF42cIIpW9lBLkMB8GA1UdIwQYMBaAFNVjOlyK
// SIG // MZDzQ3t8RhvFM2hahW1VMFYGA1UdHwRPME0wS6BJoEeG
// SIG // RWh0dHA6Ly9jcmwubWljcm9zb2Z0LmNvbS9wa2kvY3Js
// SIG // L3Byb2R1Y3RzL01pY1RpbVN0YVBDQV8yMDEwLTA3LTAx
// SIG // LmNybDBaBggrBgEFBQcBAQROMEwwSgYIKwYBBQUHMAKG
// SIG // Pmh0dHA6Ly93d3cubWljcm9zb2Z0LmNvbS9wa2kvY2Vy
// SIG // dHMvTWljVGltU3RhUENBXzIwMTAtMDctMDEuY3J0MAwG
// SIG // A1UdEwEB/wQCMAAwEwYDVR0lBAwwCgYIKwYBBQUHAwgw
// SIG // DQYJKoZIhvcNAQELBQADggEBAEQKpO4YpYr/zPAQZ2EN
// SIG // QP6TnKL1oFKpxCu2nwwObUF41jMUpq6/JF7B/WKgWxS/
// SIG // 3HswJwReNJ59mXx34T6TTVimVi65y6NjeFCU9tgPcTXf
// SIG // Z60lkJvLsVMU2/6YnGF7n/vd3lOgjy5Ks+/0m7o9TEKv
// SIG // dTQ1cDr9mywLTbtLWj7945X63EYnjjX7Om12eShyM9yw
// SIG // +37hpn7e6cJxd0vrll91LSOPQHb4+6H4TQH9QOuhjSC/
// SIG // XwALLRjZZpODbJ82gXSMdRZgYA2zfa5RbZ+QE+fIVXYJ
// SIG // q79LnLcvi1kWhiu55cCRPjc7WfaeniqyulAvAoRf8z7r
// SIG // A9jpOfikfjDkFfYwggZxMIIEWaADAgECAgphCYEqAAAA
// SIG // AAACMA0GCSqGSIb3DQEBCwUAMIGIMQswCQYDVQQGEwJV
// SIG // UzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMH
// SIG // UmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBv
// SIG // cmF0aW9uMTIwMAYDVQQDEylNaWNyb3NvZnQgUm9vdCBD
// SIG // ZXJ0aWZpY2F0ZSBBdXRob3JpdHkgMjAxMDAeFw0xMDA3
// SIG // MDEyMTM2NTVaFw0yNTA3MDEyMTQ2NTVaMHwxCzAJBgNV
// SIG // BAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYD
// SIG // VQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQg
// SIG // Q29ycG9yYXRpb24xJjAkBgNVBAMTHU1pY3Jvc29mdCBU
// SIG // aW1lLVN0YW1wIFBDQSAyMDEwMIIBIjANBgkqhkiG9w0B
// SIG // AQEFAAOCAQ8AMIIBCgKCAQEAqR0NvHcRijog7PwTl/X6
// SIG // f2mUa3RUENWlCgCChfvtfGhLLF/Fw+Vhwna3PmYrW/AV
// SIG // UycEMR9BGxqVHc4JE458YTBZsTBED/FgiIRUQwzXTbg4
// SIG // CLNC3ZOs1nMwVyaCo0UN0Or1R4HNvyRgMlhgRvJYR4Yy
// SIG // hB50YWeRX4FUsc+TTJLBxKZd0WETbijGGvmGgLvfYfxG
// SIG // wScdJGcSchohiq9LZIlQYrFd/XcfPfBXday9ikJNQFHR
// SIG // D5wGPmd/9WbAA5ZEfu/QS/1u5ZrKsajyeioKMfDaTgaR
// SIG // togINeh4HLDpmc085y9Euqf03GS9pAHBIAmTeM38vMDJ
// SIG // RF1eFpwBBU8iTQIDAQABo4IB5jCCAeIwEAYJKwYBBAGC
// SIG // NxUBBAMCAQAwHQYDVR0OBBYEFNVjOlyKMZDzQ3t8RhvF
// SIG // M2hahW1VMBkGCSsGAQQBgjcUAgQMHgoAUwB1AGIAQwBB
// SIG // MAsGA1UdDwQEAwIBhjAPBgNVHRMBAf8EBTADAQH/MB8G
// SIG // A1UdIwQYMBaAFNX2VsuP6KJcYmjRPZSQW9fOmhjEMFYG
// SIG // A1UdHwRPME0wS6BJoEeGRWh0dHA6Ly9jcmwubWljcm9z
// SIG // b2Z0LmNvbS9wa2kvY3JsL3Byb2R1Y3RzL01pY1Jvb0Nl
// SIG // ckF1dF8yMDEwLTA2LTIzLmNybDBaBggrBgEFBQcBAQRO
// SIG // MEwwSgYIKwYBBQUHMAKGPmh0dHA6Ly93d3cubWljcm9z
// SIG // b2Z0LmNvbS9wa2kvY2VydHMvTWljUm9vQ2VyQXV0XzIw
// SIG // MTAtMDYtMjMuY3J0MIGgBgNVHSABAf8EgZUwgZIwgY8G
// SIG // CSsGAQQBgjcuAzCBgTA9BggrBgEFBQcCARYxaHR0cDov
// SIG // L3d3dy5taWNyb3NvZnQuY29tL1BLSS9kb2NzL0NQUy9k
// SIG // ZWZhdWx0Lmh0bTBABggrBgEFBQcCAjA0HjIgHQBMAGUA
// SIG // ZwBhAGwAXwBQAG8AbABpAGMAeQBfAFMAdABhAHQAZQBt
// SIG // AGUAbgB0AC4gHTANBgkqhkiG9w0BAQsFAAOCAgEAB+aI
// SIG // UQ3ixuCYP4FxAz2do6Ehb7Prpsz1Mb7PBeKp/vpXbRkw
// SIG // s8LFZslq3/Xn8Hi9x6ieJeP5vO1rVFcIK1GCRBL7uVOM
// SIG // zPRgEop2zEBAQZvcXBf/XPleFzWYJFZLdO9CEMivv3/G
// SIG // f/I3fVo/HPKZeUqRUgCvOA8X9S95gWXZqbVr5MfO9sp6
// SIG // AG9LMEQkIjzP7QOllo9ZKby2/QThcJ8ySif9Va8v/rbl
// SIG // jjO7Yl+a21dA6fHOmWaQjP9qYn/dxUoLkSbiOewZSnFj
// SIG // nXshbcOco6I8+n99lmqQeKZt0uGc+R38ONiU9MalCpaG
// SIG // pL2eGq4EQoO4tYCbIjggtSXlZOz39L9+Y1klD3ouOVd2
// SIG // onGqBooPiRa6YacRy5rYDkeagMXQzafQ732D8OE7cQnf
// SIG // XXSYIghh2rBQHm+98eEA3+cxB6STOvdlR3jo+KhIq/fe
// SIG // cn5ha293qYHLpwmsObvsxsvYgrRyzR30uIUBHoD7G4kq
// SIG // VDmyW9rIDVWZeodzOwjmmC3qjeAzLhIp9cAvVCch98is
// SIG // TtoouLGp25ayp0Kiyc8ZQU3ghvkqmqMRZjDTu3QyS99j
// SIG // e/WZii8bxyGvWbWu3EQ8l1Bx16HSxVXjad5XwdHeMMD9
// SIG // zOZN+w2/XU/pnR4ZOC+8z1gFLu8NoFA12u8JJxzVs341
// SIG // Hgi62jbb01+P3nSISRKhggOtMIIClQIBATCB/qGB1KSB
// SIG // 0TCBzjELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hp
// SIG // bmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoT
// SIG // FU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEpMCcGA1UECxMg
// SIG // TWljcm9zb2Z0IE9wZXJhdGlvbnMgUHVlcnRvIFJpY28x
// SIG // JjAkBgNVBAsTHVRoYWxlcyBUU1MgRVNOOjMxQzUtMzBC
// SIG // QS03QzkxMSUwIwYDVQQDExxNaWNyb3NvZnQgVGltZS1T
// SIG // dGFtcCBTZXJ2aWNloiUKAQEwCQYFKw4DAhoFAAMVAAKj
// SIG // yE9W9pDotWMgducx6Wtz55wMoIHeMIHbpIHYMIHVMQsw
// SIG // CQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjEQ
// SIG // MA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9z
// SIG // b2Z0IENvcnBvcmF0aW9uMSkwJwYDVQQLEyBNaWNyb3Nv
// SIG // ZnQgT3BlcmF0aW9ucyBQdWVydG8gUmljbzEnMCUGA1UE
// SIG // CxMebkNpcGhlciBOVFMgRVNOOjRERTktMEM1RS0zRTA5
// SIG // MSswKQYDVQQDEyJNaWNyb3NvZnQgVGltZSBTb3VyY2Ug
// SIG // TWFzdGVyIENsb2NrMA0GCSqGSIb3DQEBBQUAAgUA4dUQ
// SIG // uDAiGA8yMDIwMDEyNDE0NDQwOFoYDzIwMjAwMTI1MTQ0
// SIG // NDA4WjB0MDoGCisGAQQBhFkKBAExLDAqMAoCBQDh1RC4
// SIG // AgEAMAcCAQACAiIzMAcCAQACAhs8MAoCBQDh1mI4AgEA
// SIG // MDYGCisGAQQBhFkKBAIxKDAmMAwGCisGAQQBhFkKAwGg
// SIG // CjAIAgEAAgMW42ChCjAIAgEAAgMHoSAwDQYJKoZIhvcN
// SIG // AQEFBQADggEBADWZBbnVGH3ffF87pKwNvtLCJ6TAdTbg
// SIG // 6tQICsvMJsnsz2Xf8fhY1nPtL7B3suiC+pq3lAH4wiA4
// SIG // oQkfAgKRf5/EDyls7wdDqdNCN57ujLEWFIWoBvCONR2r
// SIG // kv32NniQt7VGxgYN9rXCf4GNspsJfu0IRM9cRG/HbeWM
// SIG // CNQ9Y8pMjIvCGXEC0YUw6LcZ+k4ylIIUUsNHlEOmYl3A
// SIG // Jvz0ODRjYxHNEu3v0e8nWlLogD8AWy0JtkN8J47oKbFe
// SIG // ZNAf+DqDsrBFSMOdcQft+Qn1RYmNcKWR3h3LznDwke3q
// SIG // aiec88ivt9O+/YQqCmxr4FsKaWaQdghBuESUNJ4Jlztt
// SIG // NjIxggL1MIIC8QIBATCBkzB8MQswCQYDVQQGEwJVUzET
// SIG // MBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVk
// SIG // bW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0
// SIG // aW9uMSYwJAYDVQQDEx1NaWNyb3NvZnQgVGltZS1TdGFt
// SIG // cCBQQ0EgMjAxMAITMwAAAP4B8LUe/+n5rQAAAAAA/jAN
// SIG // BglghkgBZQMEAgEFAKCCATIwGgYJKoZIhvcNAQkDMQ0G
// SIG // CyqGSIb3DQEJEAEEMC8GCSqGSIb3DQEJBDEiBCCRorle
// SIG // BlTiG5y19voYHdhQpu45mCPhca2qPJFQ6nbeajCB4gYL
// SIG // KoZIhvcNAQkQAgwxgdIwgc8wgcwwgbEEFAKjyE9W9pDo
// SIG // tWMgducx6Wtz55wMMIGYMIGApH4wfDELMAkGA1UEBhMC
// SIG // VVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcT
// SIG // B1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jw
// SIG // b3JhdGlvbjEmMCQGA1UEAxMdTWljcm9zb2Z0IFRpbWUt
// SIG // U3RhbXAgUENBIDIwMTACEzMAAAD+AfC1Hv/p+a0AAAAA
// SIG // AP4wFgQUE4Xvvt69x8K7d+ittr2ck672W4AwDQYJKoZI
// SIG // hvcNAQELBQAEggEAQ39trFtziA9DXZlpvzlKQ339vEAF
// SIG // Tr6Q2x0DwkG4LXENhTua8rGj3brmmH89vMLC3BMTAmZY
// SIG // uy8PcbVl8oaXAWMgm29jl4fjlx+SC6G4rN9swUA05ibr
// SIG // zzZ7hjZ1JoI6HAZSz0MyzD+H+0sr1doqqwwnVSiB1VtF
// SIG // mxWoLQ12ycyaQtLP18SIa3E0AIHYcBnux661eczXOgn9
// SIG // XeFrysCybH2VG/OjlMaMW1iKjcnzZ88hxDA0lKdpx6SR
// SIG // 5QD76CtRjup8FoJ/GtRUQ83aLg4am2MVaiVhpPj8xeYf
// SIG // ZcVK3mJiBBY/HpC0gPTXIlIRWTOKAQkBpyKLzx6L2cfd
// SIG // nGwh8w==
// SIG // End signature block
