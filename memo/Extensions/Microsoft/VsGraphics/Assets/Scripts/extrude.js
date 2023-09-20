

//
// extrude.js
//

//
// distance and repeat tool properties
//
var extrudeDistance = 0;
var extrudeRepeat = 1;

//
// we store the tool properties on our command data element
//
var commandData = services.commands.getCommandData("Extrude");
var toolProps;

var hadDistance = commandData.hasTrait("ExtrudeDistance");
var distanceTrait = commandData.getOrCreateTrait("ExtrudeDistance", "float", 0);
if (!hadDistance) {
    // we need to set a default for distance
    distanceTrait.value = 1;
}

//
// special handling for first time access.. we init with default values
//
var hadRepeat = commandData.hasTrait("ExtrudeRepeat");
var repeatTrait = commandData.getOrCreateTrait("ExtrudeRepeat", "float", 0);
if (!hadRepeat) {
    // we didn't have the repeat trait, so set to default value of 1
    repeatTrait.value = 1;
}

//
// store the values from traits into locals
//
extrudeDistance = distanceTrait.value;
extrudeRepeat = repeatTrait.value;

// set the tool props
document.toolProps = commandData;
document.refreshToolPropertyWindow();

function extrude(distance, repeat, geom, polyIndex) {

    var polygonPointCount = geom.getPolygonPointCount(polyIndex);
    if (polygonPointCount < 3) {
        return;
    }

    if (repeat == 0) {
        return;
    }

    var extrudeDir = geom.computePolygonNormal(polyIndex);

    var materialIndex = geom.getPolygonMaterialIndex(polyIndex);

    // this is our starting index for new points
    var newPointStart = geom.pointCount;
    var currentPoint = newPointStart;

    // we gather all the point indices for use when creating polygons
    var pointIndices = new Array();
    for (var i = 0; i < polygonPointCount; i++) {
        var idx = geom.getPolygonPoint(polyIndex, i);
        pointIndices.push(idx);
    }

    // first duplicate the points in the geometry (without adding polygon)
    for (var j = 0; j < repeat; j++) {
        for (var i = 0; i < polygonPointCount; i++) {

            var point = geom.getPointOnPolygon(polyIndex, i);
            point[0] += distance * (j+1) * extrudeDir[0];
            point[1] += distance * (j+1) * extrudeDir[1];
            point[2] += distance * (j+1) * extrudeDir[2];

            geom.addPoints(point, 1);

            pointIndices.push(currentPoint);
            currentPoint++;
        }
    }

    // now create a new polygon
    var newPolyIndex = geom.polygonCount;
    geom.addPolygon(materialIndex);

    var IndexingModePerPointOnPolygon = 3;
    var addTextureCoords = false;

    if (geom.textureCoordinateIndexingMode == IndexingModePerPointOnPolygon)
    {
        addTextureCoords = true;
    }

    // add points to new polygon.
    var newPolyPointStart = newPointStart + (repeat - 1) * polygonPointCount;
    for (var i = 0; i < polygonPointCount; i++) {
        geom.addPolygonPoint(newPolyIndex, newPolyPointStart + i);

        if (addTextureCoords) {
            var texCoord = geom.getTextureCoordinateOnPolygon(polyIndex, i);
            geom.addTextureCoordinates(texCoord, 1);
        }
    }

    // for each segement (we repeat)
    for (var j = 0; j < repeat; j++) {

        // for each edge
        for (var i = 0; i < polygonPointCount; i++) {

            var p0 = i;
            var p1 = i + 1;
            if (p1 >= polygonPointCount) {
                p1 = 0;
            }

            // points i and i + 1 form an edge

            // add a poly containing this edge, edges from each point to the
            // newly duplicted points, and the new edge between the 2 associated duped points
            var thisPolyIndex = geom.polygonCount;
            geom.addPolygon(materialIndex);

            var poly0PointStart = j * polygonPointCount;
            var poly1PointStart = (j + 1) * polygonPointCount;

            var i0 = pointIndices[poly0PointStart + p0];
            var i1 = pointIndices[poly0PointStart + p1];
            var i2 = pointIndices[poly1PointStart + p1];
            var i3 = pointIndices[poly1PointStart + p0];

            geom.addPolygonPoint(thisPolyIndex, i0);
            geom.addPolygonPoint(thisPolyIndex, i1);
            geom.addPolygonPoint(thisPolyIndex, i2);
            geom.addPolygonPoint(thisPolyIndex, i3);

            if (addTextureCoords) {
                var texCoord0 = [0, 0, 1, 0, 1, 1, 0, 1];
                geom.addTextureCoordinates(texCoord0, 4);
            }
        }
    }

    return newPolyIndex;
}

///////////////////////////////////////////////////////////////////////////////
//
// helper to get a designer property as a bool
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


// find the mesh child
function findFirstChildMeshElement(parent)
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

function UndoableItem(dist, repeat, collElem, meshElem) {
    this._extrudeDistance = dist;
    this._extrudeRepeat = repeat;

    var clonedColl = collElem.clone();
    this._collectionElem = clonedColl;
    this._polyCollection = clonedColl.behavior;
    this._meshElem = meshElem;
    this._mesh = meshElem.behavior;

    var geom = this._meshElem.getTrait("Geometry").value;
    this._restoreGeom = geom.clone();

    this.getName = function () {
        var IDS_MreUndoExtrude = 146;
        return services.strings.getStringFromId(IDS_MreUndoExtrude);
    }

    this.onDo = function () {

        var geom = this._meshElem.getTrait("Geometry").value;

        var polysToDelete = new Array();
        var polysToSelect = new Array();

        // extrude
        var polyCount = this._polyCollection.getPolygonCount();
        for (var i = 0; i < polyCount; i++) {
            var polyIndex = this._polyCollection.getPolygon(i);
            var newPoly = extrude(this._extrudeDistance, this._extrudeRepeat, geom, polyIndex);

            // services.debug.trace("[Extrude] extruding poly index " + polyIndex);
            // services.debug.trace("[Extrude] adding poly index " + newPoly);

            polysToSelect.push(newPoly);
            polysToDelete.push(polyIndex);
        }

        function sortNumberDescending(a, b) {
            return b - a;
        }

        // delete the old selection
        polysToDelete.sort(sortNumberDescending);

        var numDeletedPolys = polysToDelete.length;

        for (var p = 0; p < polysToDelete.length; p++) {

            // services.debug.trace("[Extrude] removing poly index " + polyIndex);

            geom.removePolygon(polysToDelete[p]);
        }

        var newCollection = this._collectionElem.clone();
        var newPolyCollBeh = newCollection.behavior;

        newPolyCollBeh.clear();

        // shift polygon indices
        for (var p = 0; p < polysToSelect.length; p++) {
            var indexToSelect = polysToSelect[p] - numDeletedPolys;

            // services.debug.trace("[Extrude] selecting poly index " + indexToSelect);

            newPolyCollBeh.addPolygon(indexToSelect);
        }

        this._mesh.selectedObjects = newCollection;
        this._mesh.recomputeCachedGeometry();
    }

    this.onUndo = function () {
        var geom = this._meshElem.getTrait("Geometry").value;
        geom.copyFrom(this._restoreGeom);

        this._mesh.selectedObjects = this._collectionElem;

        this._mesh.recomputeCachedGeometry();
    }
}


if (extrudeRepeat != 0) {

    var selectedElement = document.selectedElement;
    var selectionMode = getSelectionMode();

    // get the poly collection
    var polyCollection = null;
    var mesh = null;
    var meshElem = null;
    var collElem = null;
    if (selectedElement != null) {
        if (selectionMode == 1) {
            meshElem = findFirstChildMeshElement(selectedElement);
            if (meshElem != null) {
                mesh = meshElem.behavior;

                // polygon selection mode
                collElem = mesh.selectedObjects;
                if (collElem != null) {
                    polyCollection = collElem.behavior;
                }
            }
        }
    }

    if (polyCollection != null && collElem.typeId == "PolygonCollection") {
        var undoableItem = new UndoableItem(extrudeDistance, extrudeRepeat, collElem, meshElem);
        undoableItem.onDo();
        services.undoService.addUndoableItem(undoableItem);
    }
}

// SIG // Begin signature block
// SIG // MIIkWQYJKoZIhvcNAQcCoIIkSjCCJEYCAQExDzANBglg
// SIG // hkgBZQMEAgEFADB3BgorBgEEAYI3AgEEoGkwZzAyBgor
// SIG // BgEEAYI3AgEeMCQCAQEEEBDgyQbOONQRoqMAEEvTUJAC
// SIG // AQACAQACAQACAQACAQAwMTANBglghkgBZQMEAgEFAAQg
// SIG // kz9XY8lqiFVbcL5uZ5PFVCKKJ4t4jMlzh48n5M8YHxqg
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
// SIG // ghYsMIIWKAIBATCBlTB+MQswCQYDVQQGEwJVUzETMBEG
// SIG // A1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9u
// SIG // ZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9u
// SIG // MSgwJgYDVQQDEx9NaWNyb3NvZnQgQ29kZSBTaWduaW5n
// SIG // IFBDQSAyMDExAhMzAAABUptAn1BWmXWIAAAAAAFSMA0G
// SIG // CWCGSAFlAwQCAQUAoIGuMBkGCSqGSIb3DQEJAzEMBgor
// SIG // BgEEAYI3AgEEMBwGCisGAQQBgjcCAQsxDjAMBgorBgEE
// SIG // AYI3AgEVMC8GCSqGSIb3DQEJBDEiBCBZTEg7jdDs/bdc
// SIG // 1CevgeJqTz7/iB5xFHkt9D1BcppOmjBCBgorBgEEAYI3
// SIG // AgEMMTQwMqAUgBIATQBpAGMAcgBvAHMAbwBmAHShGoAY
// SIG // aHR0cDovL3d3dy5taWNyb3NvZnQuY29tMA0GCSqGSIb3
// SIG // DQEBAQUABIIBALBYVzEnLqP7URcyBSRZH3t3JMDtfa/4
// SIG // XoaPla8vvaOFJrLrS+IzTCy07hx/Il0m0irUIk8MSW7c
// SIG // nZBWCkG+BNBt5WgEA+Ck6wpV6lHWqTkQGTnHnLI8xOSU
// SIG // FajOG2iFS5hVugjdcMcTsuqgqVUPtAuvtw4cnkCxHo5y
// SIG // IQiov5fBJDHhk8EkQrEYrhGEjGI/KLS2AaCMjwlmEltv
// SIG // rh3CVaznEeo2ZjTjaUJ992fAqcuEu+6ukNGaB2YfkZ7G
// SIG // +QwtFNyvi8U2fjr9zzv5ybWxoR+eMU0GwufqXUKsu4gW
// SIG // CRrpoDH/ba4MZrJ9u3VGcHythKjxAqe7p+kzHWATDsUy
// SIG // RqOhghO2MIITsgYKKwYBBAGCNwMDATGCE6IwghOeBgkq
// SIG // hkiG9w0BBwKgghOPMIITiwIBAzEPMA0GCWCGSAFlAwQC
// SIG // AQUAMIIBVwYLKoZIhvcNAQkQAQSgggFGBIIBQjCCAT4C
// SIG // AQEGCisGAQQBhFkKAwEwMTANBglghkgBZQMEAgEFAAQg
// SIG // sLsIlaW/ccU0OuWWKfVDLQWx8Byx/KOKC6Bk9XrjwAMC
// SIG // Bl4l0ycBaBgSMjAyMDAxMjQyMTA0NDUuMzlaMAcCAQGA
// SIG // AgH0oIHUpIHRMIHOMQswCQYDVQQGEwJVUzETMBEGA1UE
// SIG // CBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEe
// SIG // MBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMSkw
// SIG // JwYDVQQLEyBNaWNyb3NvZnQgT3BlcmF0aW9ucyBQdWVy
// SIG // dG8gUmljbzEmMCQGA1UECxMdVGhhbGVzIFRTUyBFU046
// SIG // MzFDNS0zMEJBLTdDOTExJTAjBgNVBAMTHE1pY3Jvc29m
// SIG // dCBUaW1lLVN0YW1wIFNlcnZpY2Wggg8fMIIE9TCCA92g
// SIG // AwIBAgITMwAAAP4B8LUe/+n5rQAAAAAA/jANBgkqhkiG
// SIG // 9w0BAQsFADB8MQswCQYDVQQGEwJVUzETMBEGA1UECBMK
// SIG // V2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwG
// SIG // A1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMSYwJAYD
// SIG // VQQDEx1NaWNyb3NvZnQgVGltZS1TdGFtcCBQQ0EgMjAx
// SIG // MDAeFw0xOTA5MDYyMDQxMDhaFw0yMDEyMDQyMDQxMDha
// SIG // MIHOMQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGlu
// SIG // Z3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMV
// SIG // TWljcm9zb2Z0IENvcnBvcmF0aW9uMSkwJwYDVQQLEyBN
// SIG // aWNyb3NvZnQgT3BlcmF0aW9ucyBQdWVydG8gUmljbzEm
// SIG // MCQGA1UECxMdVGhhbGVzIFRTUyBFU046MzFDNS0zMEJB
// SIG // LTdDOTExJTAjBgNVBAMTHE1pY3Jvc29mdCBUaW1lLVN0
// SIG // YW1wIFNlcnZpY2UwggEiMA0GCSqGSIb3DQEBAQUAA4IB
// SIG // DwAwggEKAoIBAQDaA/Vk1M0ve7yZ/JfM5DIL6YNagd4H
// SIG // Omll6Sm3yP0Y4iRpQ8v+q6uitl8OmZqFS/pyejnDV8MA
// SIG // rXQpFh35P6h8IuO9xhB4Q68qApWCo1OOQ+wLfKCK9pDw
// SIG // adAorXLVMMXjLXceM2BnYxNsk4W8WmggQSuuA6vbGq/m
// SIG // xWaTqsZKvQ66oxZyz9hsG7B1Qg1a8Fl/5YmXpb+2SODe
// SIG // Nzs9Jr3LMQg03KOteVeljxaAHU2Im7f+3nn9HKbtBP8Q
// SIG // Fd0iWW61xwF57WmQOIzN1T4M8MSdzPNRus8Yn0fjb806
// SIG // L2Yandt4bV+3ORTLyN+2kwOmM+TA+MhEcQqURYaOB4pz
// SIG // S2+xAgMBAAGjggEbMIIBFzAdBgNVHQ4EFgQU9+MLMiDM
// SIG // 5WTEVcXjZwgilb2UEuQwHwYDVR0jBBgwFoAU1WM6XIox
// SIG // kPNDe3xGG8UzaFqFbVUwVgYDVR0fBE8wTTBLoEmgR4ZF
// SIG // aHR0cDovL2NybC5taWNyb3NvZnQuY29tL3BraS9jcmwv
// SIG // cHJvZHVjdHMvTWljVGltU3RhUENBXzIwMTAtMDctMDEu
// SIG // Y3JsMFoGCCsGAQUFBwEBBE4wTDBKBggrBgEFBQcwAoY+
// SIG // aHR0cDovL3d3dy5taWNyb3NvZnQuY29tL3BraS9jZXJ0
// SIG // cy9NaWNUaW1TdGFQQ0FfMjAxMC0wNy0wMS5jcnQwDAYD
// SIG // VR0TAQH/BAIwADATBgNVHSUEDDAKBggrBgEFBQcDCDAN
// SIG // BgkqhkiG9w0BAQsFAAOCAQEARAqk7hiliv/M8BBnYQ1A
// SIG // /pOcovWgUqnEK7afDA5tQXjWMxSmrr8kXsH9YqBbFL/c
// SIG // ezAnBF40nn2ZfHfhPpNNWKZWLrnLo2N4UJT22A9xNd9n
// SIG // rSWQm8uxUxTb/picYXuf+93eU6CPLkqz7/Sbuj1MQq91
// SIG // NDVwOv2bLAtNu0taPv3jlfrcRieONfs6bXZ5KHIz3LD7
// SIG // fuGmft7pwnF3S+uWX3UtI49Advj7ofhNAf1A66GNIL9f
// SIG // AAstGNlmk4NsnzaBdIx1FmBgDbN9rlFtn5AT58hVdgmr
// SIG // v0ucty+LWRaGK7nlwJE+NztZ9p6eKrK6UC8ChF/zPusD
// SIG // 2Ok5+KR+MOQV9jCCBnEwggRZoAMCAQICCmEJgSoAAAAA
// SIG // AAIwDQYJKoZIhvcNAQELBQAwgYgxCzAJBgNVBAYTAlVT
// SIG // MRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdS
// SIG // ZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9y
// SIG // YXRpb24xMjAwBgNVBAMTKU1pY3Jvc29mdCBSb290IENl
// SIG // cnRpZmljYXRlIEF1dGhvcml0eSAyMDEwMB4XDTEwMDcw
// SIG // MTIxMzY1NVoXDTI1MDcwMTIxNDY1NVowfDELMAkGA1UE
// SIG // BhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNV
// SIG // BAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBD
// SIG // b3Jwb3JhdGlvbjEmMCQGA1UEAxMdTWljcm9zb2Z0IFRp
// SIG // bWUtU3RhbXAgUENBIDIwMTAwggEiMA0GCSqGSIb3DQEB
// SIG // AQUAA4IBDwAwggEKAoIBAQCpHQ28dxGKOiDs/BOX9fp/
// SIG // aZRrdFQQ1aUKAIKF++18aEssX8XD5WHCdrc+Zitb8BVT
// SIG // JwQxH0EbGpUdzgkTjnxhMFmxMEQP8WCIhFRDDNdNuDgI
// SIG // s0Ldk6zWczBXJoKjRQ3Q6vVHgc2/JGAyWGBG8lhHhjKE
// SIG // HnRhZ5FfgVSxz5NMksHEpl3RYRNuKMYa+YaAu99h/EbB
// SIG // Jx0kZxJyGiGKr0tkiVBisV39dx898Fd1rL2KQk1AUdEP
// SIG // nAY+Z3/1ZsADlkR+79BL/W7lmsqxqPJ6Kgox8NpOBpG2
// SIG // iAg16HgcsOmZzTznL0S6p/TcZL2kAcEgCZN4zfy8wMlE
// SIG // XV4WnAEFTyJNAgMBAAGjggHmMIIB4jAQBgkrBgEEAYI3
// SIG // FQEEAwIBADAdBgNVHQ4EFgQU1WM6XIoxkPNDe3xGG8Uz
// SIG // aFqFbVUwGQYJKwYBBAGCNxQCBAweCgBTAHUAYgBDAEEw
// SIG // CwYDVR0PBAQDAgGGMA8GA1UdEwEB/wQFMAMBAf8wHwYD
// SIG // VR0jBBgwFoAU1fZWy4/oolxiaNE9lJBb186aGMQwVgYD
// SIG // VR0fBE8wTTBLoEmgR4ZFaHR0cDovL2NybC5taWNyb3Nv
// SIG // ZnQuY29tL3BraS9jcmwvcHJvZHVjdHMvTWljUm9vQ2Vy
// SIG // QXV0XzIwMTAtMDYtMjMuY3JsMFoGCCsGAQUFBwEBBE4w
// SIG // TDBKBggrBgEFBQcwAoY+aHR0cDovL3d3dy5taWNyb3Nv
// SIG // ZnQuY29tL3BraS9jZXJ0cy9NaWNSb29DZXJBdXRfMjAx
// SIG // MC0wNi0yMy5jcnQwgaAGA1UdIAEB/wSBlTCBkjCBjwYJ
// SIG // KwYBBAGCNy4DMIGBMD0GCCsGAQUFBwIBFjFodHRwOi8v
// SIG // d3d3Lm1pY3Jvc29mdC5jb20vUEtJL2RvY3MvQ1BTL2Rl
// SIG // ZmF1bHQuaHRtMEAGCCsGAQUFBwICMDQeMiAdAEwAZQBn
// SIG // AGEAbABfAFAAbwBsAGkAYwB5AF8AUwB0AGEAdABlAG0A
// SIG // ZQBuAHQALiAdMA0GCSqGSIb3DQEBCwUAA4ICAQAH5ohR
// SIG // DeLG4Jg/gXEDPZ2joSFvs+umzPUxvs8F4qn++ldtGTCz
// SIG // wsVmyWrf9efweL3HqJ4l4/m87WtUVwgrUYJEEvu5U4zM
// SIG // 9GASinbMQEBBm9xcF/9c+V4XNZgkVkt070IQyK+/f8Z/
// SIG // 8jd9Wj8c8pl5SpFSAK84Dxf1L3mBZdmptWvkx872ynoA
// SIG // b0swRCQiPM/tA6WWj1kpvLb9BOFwnzJKJ/1Vry/+tuWO
// SIG // M7tiX5rbV0Dp8c6ZZpCM/2pif93FSguRJuI57BlKcWOd
// SIG // eyFtw5yjojz6f32WapB4pm3S4Zz5Hfw42JT0xqUKloak
// SIG // vZ4argRCg7i1gJsiOCC1JeVk7Pf0v35jWSUPei45V3ai
// SIG // caoGig+JFrphpxHLmtgOR5qAxdDNp9DvfYPw4TtxCd9d
// SIG // dJgiCGHasFAeb73x4QDf5zEHpJM692VHeOj4qEir995y
// SIG // fmFrb3epgcunCaw5u+zGy9iCtHLNHfS4hQEegPsbiSpU
// SIG // ObJb2sgNVZl6h3M7COaYLeqN4DMuEin1wC9UJyH3yKxO
// SIG // 2ii4sanblrKnQqLJzxlBTeCG+SqaoxFmMNO7dDJL32N7
// SIG // 9ZmKLxvHIa9Zta7cRDyXUHHXodLFVeNp3lfB0d4wwP3M
// SIG // 5k37Db9dT+mdHhk4L7zPWAUu7w2gUDXa7wknHNWzfjUe
// SIG // CLraNtvTX4/edIhJEqGCA60wggKVAgEBMIH+oYHUpIHR
// SIG // MIHOMQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGlu
// SIG // Z3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMV
// SIG // TWljcm9zb2Z0IENvcnBvcmF0aW9uMSkwJwYDVQQLEyBN
// SIG // aWNyb3NvZnQgT3BlcmF0aW9ucyBQdWVydG8gUmljbzEm
// SIG // MCQGA1UECxMdVGhhbGVzIFRTUyBFU046MzFDNS0zMEJB
// SIG // LTdDOTExJTAjBgNVBAMTHE1pY3Jvc29mdCBUaW1lLVN0
// SIG // YW1wIFNlcnZpY2WiJQoBATAJBgUrDgMCGgUAAxUAAqPI
// SIG // T1b2kOi1YyB25zHpa3PnnAyggd4wgdukgdgwgdUxCzAJ
// SIG // BgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAw
// SIG // DgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3Nv
// SIG // ZnQgQ29ycG9yYXRpb24xKTAnBgNVBAsTIE1pY3Jvc29m
// SIG // dCBPcGVyYXRpb25zIFB1ZXJ0byBSaWNvMScwJQYDVQQL
// SIG // Ex5uQ2lwaGVyIE5UUyBFU046NERFOS0wQzVFLTNFMDkx
// SIG // KzApBgNVBAMTIk1pY3Jvc29mdCBUaW1lIFNvdXJjZSBN
// SIG // YXN0ZXIgQ2xvY2swDQYJKoZIhvcNAQEFBQACBQDh1RC4
// SIG // MCIYDzIwMjAwMTI0MTQ0NDA4WhgPMjAyMDAxMjUxNDQ0
// SIG // MDhaMHQwOgYKKwYBBAGEWQoEATEsMCowCgIFAOHVELgC
// SIG // AQAwBwIBAAICIjMwBwIBAAICGzwwCgIFAOHWYjgCAQAw
// SIG // NgYKKwYBBAGEWQoEAjEoMCYwDAYKKwYBBAGEWQoDAaAK
// SIG // MAgCAQACAxbjYKEKMAgCAQACAwehIDANBgkqhkiG9w0B
// SIG // AQUFAAOCAQEANZkFudUYfd98XzukrA2+0sInpMB1NuDq
// SIG // 1AgKy8wmyezPZd/x+FjWc+0vsHey6IL6mreUAfjCIDih
// SIG // CR8CApF/n8QPKWzvB0Op00I3nu6MsRYUhagG8I41HauS
// SIG // /fY2eJC3tUbGBg32tcJ/gY2ymwl+7QhEz1xEb8dt5YwI
// SIG // 1D1jykyMi8IZcQLRhTDotxn6TjKUghRSw0eUQ6ZiXcAm
// SIG // /PQ4NGNjEc0S7e/R7ydaUuiAPwBbLQm2Q3wnjugpsV5k
// SIG // 0B/4OoOysEVIw51xB+35CfVFiY1wpZHeHcvOcPCR7epq
// SIG // J5zzyK+30779hCoKbGvgWwppZpB2CEG4RJQ0ngmXO202
// SIG // MjGCAvUwggLxAgEBMIGTMHwxCzAJBgNVBAYTAlVTMRMw
// SIG // EQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRt
// SIG // b25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRp
// SIG // b24xJjAkBgNVBAMTHU1pY3Jvc29mdCBUaW1lLVN0YW1w
// SIG // IFBDQSAyMDEwAhMzAAAA/gHwtR7/6fmtAAAAAAD+MA0G
// SIG // CWCGSAFlAwQCAQUAoIIBMjAaBgkqhkiG9w0BCQMxDQYL
// SIG // KoZIhvcNAQkQAQQwLwYJKoZIhvcNAQkEMSIEIBUe1Rpo
// SIG // ZRbQLUxJniXbGhLdCFY4GMwM/7epIl0ObjAlMIHiBgsq
// SIG // hkiG9w0BCRACDDGB0jCBzzCBzDCBsQQUAqPIT1b2kOi1
// SIG // YyB25zHpa3PnnAwwgZgwgYCkfjB8MQswCQYDVQQGEwJV
// SIG // UzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMH
// SIG // UmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBv
// SIG // cmF0aW9uMSYwJAYDVQQDEx1NaWNyb3NvZnQgVGltZS1T
// SIG // dGFtcCBQQ0EgMjAxMAITMwAAAP4B8LUe/+n5rQAAAAAA
// SIG // /jAWBBQThe++3r3Hwrt36K22vZyTrvZbgDANBgkqhkiG
// SIG // 9w0BAQsFAASCAQDU/7xjeLozBRGbOG4y5n7CmYJAAnmD
// SIG // zUqy5yrFUX75ggs4T1AmrxTV9tpHFqpDMfAQnhIP4tiL
// SIG // IL5ItFJdodX9TtxoRc35YXe1PBs2NDrI5v2466W6ycXg
// SIG // frVAEfRy5yYzZ70n0u8t8jYog3vosaThubBZohK+lW8F
// SIG // GasApyyAoN5yz5Z5xSsdS6qKx3gT7BjBYY3UIF9SJrhE
// SIG // BdK7PZEszeXih3QK5Jphw2Ukfrz9Uo2EkyxB+YFi/kba
// SIG // geOQYxPZ8DFD+Owf6u6xSsi5Ku9miajy5fNHM4EN6+ok
// SIG // RoZGGJ2Zp9B92jgJejiAL4xWmy6sTNwrDusUD0ZDLCom
// SIG // DTa7
// SIG // End signature block
