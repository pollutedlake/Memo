﻿
//
// FlipPolygons.js
//

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

function getMeshOrChildMesh(parent) {
    if (parent.typeId == "Microsoft.VisualStudio.3D.Mesh") {
        return parent;
    }
    return findFirstChildMeshElement(parent);
}

//
// this is used for undoing polygon mode flipping
//
function UndoableItem(collElem, meshElem) {

    this._clonedColl = collElem.clone();
    this._polyCollection = this._clonedColl.behavior;
    this._meshElem = meshElem;
    this._mesh = meshElem.behavior;

    var geom = this._meshElem.getTrait("Geometry").value;
    this._restoreGeom = geom.clone();

    this.getName = function () {
        var IDS_MreUndoFlipPolygons = 164;
        return services.strings.getStringFromId(IDS_MreUndoFlipPolygons);
    }

    this.onDo = function () {

        var geom = this._meshElem.getTrait("Geometry").value;

        this._mesh.selectedObjects = this._clonedColl.clone();

        var polyCount = this._polyCollection.getPolygonCount();
        for (var i = 0; i < polyCount; i++) {
            var polyIndex = this._polyCollection.getPolygon(i);
            
            // services.debug.trace("[FlipPolygons] flipping poly: " + polyIndex);

            //
            // flip the polygon
            //
            geom.flipPolygon(polyIndex);
        }

        this._mesh.recomputeCachedGeometry();
    }

    this.onUndo = function () {
        var geom = this._meshElem.getTrait("Geometry").value;
        geom.copyFrom(this._restoreGeom);

        this._mesh.selectedObjects = this._clonedColl.clone();

        this._mesh.recomputeCachedGeometry();
    }
}

//
// used for undoing object mode flipping
//
function UndoableObjectSelectionFlip(meshElems) {

    // in the object here
    this._meshElems = meshElems;
    this._restoreGeoms = new Array();

    // clone geometry we will use for restoring from undo
    for (var i = 0; i < this._meshElems.length; i++) {
        var geom = this._meshElems[i].getTrait("Geometry").value;
        this._restoreGeoms.push(geom.clone());
    }

    // name function 
    this.getName = function () {
        var IDS_MreUndoFlipPolygons = 164;
        return services.strings.getStringFromId(IDS_MreUndoFlipPolygons);
    }

    // do callback
    this.onDo = function () {

        for (var i = 0; i < this._meshElems.length; i++) {
            var geom = this._meshElems[i].getTrait("Geometry").value;

            // flip all polygons in the geom
            var polyCount = geom.polygonCount;
            for (var j = 0; j < polyCount; j++) {
                geom.flipPolygon(j);
            }

            this._meshElems[i].behavior.recomputeCachedGeometry();
        }
    }

    // undo callback
    this.onUndo = function () {

        for (var i = 0; i < this._meshElems.length; i++) {
            var geom = this._meshElems[i].getTrait("Geometry").value;

            geom.copyFrom(this._restoreGeoms[i]);

            this._meshElems[i].behavior.recomputeCachedGeometry();
        }
    }
}

var selectionMode = getSelectionMode();

//
// create the undoable object based on selection mode
//

if (selectionMode == 1) {

    // polygon selection mode

    // get the poly collection
    var selectedElement = document.selectedElement;
    var polyCollection = null;
    var mesh = null;
    var meshElem = null;
    var collElem = null;

    if (selectedElement != null) {
        meshElem = findFirstChildMeshElement(selectedElement);
        if (meshElem != null) {
            mesh = meshElem.behavior;

            // polygon selection mode
            collElem = mesh.selectedObjects;
            if (collElem != null) {
                polyCollection = collElem.behavior;
                if (polyCollection != null && collElem.typeId == "PolygonCollection") {
                    var undoableItem = new UndoableItem(collElem, meshElem);
                    undoableItem.onDo();
                    services.undoService.addUndoableItem(undoableItem);
                }
            }
        }
    }
}
else if (selectionMode == 0) {
    
    // object selection mode

    var meshes = new Array();

    // get the meshes we will flip polys on
    var count = services.selection.count;
    for (var i = 0; i < count; i++) {
        var currSelected = services.selection.getElement(i);
        var mesh = getMeshOrChildMesh(currSelected);
        if (mesh != null) {
            meshes.push(mesh);
        }
    }

    // if we have meshes, then create undoable item
    if (meshes.length > 0) {
        var undoableItem = new UndoableObjectSelectionFlip(meshes);
        undoableItem.onDo();
        services.undoService.addUndoableItem(undoableItem);
    }
}
// SIG // Begin signature block
// SIG // MIIkWgYJKoZIhvcNAQcCoIIkSzCCJEcCAQExDzANBglg
// SIG // hkgBZQMEAgEFADB3BgorBgEEAYI3AgEEoGkwZzAyBgor
// SIG // BgEEAYI3AgEeMCQCAQEEEBDgyQbOONQRoqMAEEvTUJAC
// SIG // AQACAQACAQACAQACAQAwMTANBglghkgBZQMEAgEFAAQg
// SIG // Qn76216R4yQvnsnUTvXDBOVxjwFMUPtfwmzxcO4/0Meg
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
// SIG // AYI3AgEVMC8GCSqGSIb3DQEJBDEiBCATu4Mjrryvwiob
// SIG // NV9b22ESrDcB5JkY+nP8Y4kua72VhjBCBgorBgEEAYI3
// SIG // AgEMMTQwMqAUgBIATQBpAGMAcgBvAHMAbwBmAHShGoAY
// SIG // aHR0cDovL3d3dy5taWNyb3NvZnQuY29tMA0GCSqGSIb3
// SIG // DQEBAQUABIIBABmCtE8IMUnLx9n6q0OAAPgzXFxBh1E5
// SIG // 80Mqtjg6O8n8CVv3NCO0nKaQvUOwSy5TpbrndRf64uf4
// SIG // NSsY/+4cUv4bG3ztraf95QCJlg40ABf96iHxEqj4iEO9
// SIG // KAdyzdJjsZRkh01sC6d7Uxik8b5xTqtoj0GbD/x6RbcI
// SIG // qWq3xwJ+Mu7iV8aTbwfzT4gj5JhOBeBJ0NwFZCAuqTtP
// SIG // rrfoJQPPxyDlw3OXTfeChURIjXTZrAI4wtXsofnQAaet
// SIG // 4vclR93+rBe0XZUrSkLCSv/BCh4DLFnFlAnqHUCvMSE6
// SIG // A5++1+J3LoPVcoXvY88HJww7sr11CBYdQOiiGAOdzFl8
// SIG // 8behghO3MIITswYKKwYBBAGCNwMDATGCE6MwghOfBgkq
// SIG // hkiG9w0BBwKgghOQMIITjAIBAzEPMA0GCWCGSAFlAwQC
// SIG // AQUAMIIBWAYLKoZIhvcNAQkQAQSgggFHBIIBQzCCAT8C
// SIG // AQEGCisGAQQBhFkKAwEwMTANBglghkgBZQMEAgEFAAQg
// SIG // lu4wiMFXSGs3ItAlraU1PbNdgeFyrFNrnkgFDXZ0IkAC
// SIG // Bl4g8PTwcxgTMjAyMDAxMjQyMTA0NDEuNjY4WjAHAgEB
// SIG // gAIB9KCB1KSB0TCBzjELMAkGA1UEBhMCVVMxEzARBgNV
// SIG // BAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQx
// SIG // HjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEp
// SIG // MCcGA1UECxMgTWljcm9zb2Z0IE9wZXJhdGlvbnMgUHVl
// SIG // cnRvIFJpY28xJjAkBgNVBAsTHVRoYWxlcyBUU1MgRVNO
// SIG // OjU4NDctRjc2MS00RjcwMSUwIwYDVQQDExxNaWNyb3Nv
// SIG // ZnQgVGltZS1TdGFtcCBTZXJ2aWNloIIPHzCCBPUwggPd
// SIG // oAMCAQICEzMAAAEFBznqWfNVvyoAAAAAAQUwDQYJKoZI
// SIG // hvcNAQELBQAwfDELMAkGA1UEBhMCVVMxEzARBgNVBAgT
// SIG // Cldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAc
// SIG // BgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEmMCQG
// SIG // A1UEAxMdTWljcm9zb2Z0IFRpbWUtU3RhbXAgUENBIDIw
// SIG // MTAwHhcNMTkwOTA2MjA0MTE4WhcNMjAxMjA0MjA0MTE4
// SIG // WjCBzjELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hp
// SIG // bmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoT
// SIG // FU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEpMCcGA1UECxMg
// SIG // TWljcm9zb2Z0IE9wZXJhdGlvbnMgUHVlcnRvIFJpY28x
// SIG // JjAkBgNVBAsTHVRoYWxlcyBUU1MgRVNOOjU4NDctRjc2
// SIG // MS00RjcwMSUwIwYDVQQDExxNaWNyb3NvZnQgVGltZS1T
// SIG // dGFtcCBTZXJ2aWNlMIIBIjANBgkqhkiG9w0BAQEFAAOC
// SIG // AQ8AMIIBCgKCAQEAzCKWY1VIi1kBqgxSy2nhn4XPW8Qs
// SIG // IvB0MfoHGheWc9hqHYTO9aMo2perqp0TPEB8Y+PbihZm
// SIG // P0lhIZVfrKNyK5hB1S5rJHhEGoqOT8VYFFkZvrASCaUv
// SIG // Ro8Cqxj2drm+Ek9ifX7uRcW305icgdgC+lu1nElDjfLc
// SIG // rs9vzUQCCOmLqI3TGupo1V2pi9gEuzwaNRluD2uF2zYR
// SIG // EKAOP7IkuCRm3HwMFTBr/O24SmqQ6qVy2w6ui2xXSwL+
// SIG // 0O3lB4h0uHnHF0TRgJ6ZHYRziu7NTvRaqUWWLG8f1KZG
// SIG // qMqokHvyRUwPtZHmGbGYGkKoDzaRmA+dEgw8kGdr7Tce
// SIG // ylYF7QIDAQABo4IBGzCCARcwHQYDVR0OBBYEFD10G/66
// SIG // dyhMyug2DstxZ/0CMzciMB8GA1UdIwQYMBaAFNVjOlyK
// SIG // MZDzQ3t8RhvFM2hahW1VMFYGA1UdHwRPME0wS6BJoEeG
// SIG // RWh0dHA6Ly9jcmwubWljcm9zb2Z0LmNvbS9wa2kvY3Js
// SIG // L3Byb2R1Y3RzL01pY1RpbVN0YVBDQV8yMDEwLTA3LTAx
// SIG // LmNybDBaBggrBgEFBQcBAQROMEwwSgYIKwYBBQUHMAKG
// SIG // Pmh0dHA6Ly93d3cubWljcm9zb2Z0LmNvbS9wa2kvY2Vy
// SIG // dHMvTWljVGltU3RhUENBXzIwMTAtMDctMDEuY3J0MAwG
// SIG // A1UdEwEB/wQCMAAwEwYDVR0lBAwwCgYIKwYBBQUHAwgw
// SIG // DQYJKoZIhvcNAQELBQADggEBAKfOYXd7awFX5lQD5nDg
// SIG // KpzOO021gfUtMkhhv3jbyH4YGAtGIwixGYYokMjnkU8L
// SIG // NJSDlhr+7TOba+9ERszaNfwu0kGnakNnU+bFI+xmuixz
// SIG // tnsXHc0b1CMHXjmlbmo+FaYl54YzwUbtglTRlz3tXe2c
// SIG // 8O3YvMYdg+qKGQY4Ry4e8hn9mRYwYy3A1Y632i8HeGKn
// SIG // nyYIONrPBDFKF87E6T5UtCASlnl/kWwcnDlIV6Svapbx
// SIG // WwUBqeDfrixFeoWht96FTrVsK24buRdBOFA87BVGmfDg
// SIG // C8iq2kdXSKPmVPs46Z9zWuylJK0/9VBWHZ1mMKFA5vXv
// SIG // g5gYanYVJcSIUZ8wggZxMIIEWaADAgECAgphCYEqAAAA
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
// SIG // JjAkBgNVBAsTHVRoYWxlcyBUU1MgRVNOOjU4NDctRjc2
// SIG // MS00RjcwMSUwIwYDVQQDExxNaWNyb3NvZnQgVGltZS1T
// SIG // dGFtcCBTZXJ2aWNloiUKAQEwCQYFKw4DAhoFAAMVANJ5
// SIG // nOzIh9j69Md959d2YOEZVfaqoIHeMIHbpIHYMIHVMQsw
// SIG // CQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjEQ
// SIG // MA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9z
// SIG // b2Z0IENvcnBvcmF0aW9uMSkwJwYDVQQLEyBNaWNyb3Nv
// SIG // ZnQgT3BlcmF0aW9ucyBQdWVydG8gUmljbzEnMCUGA1UE
// SIG // CxMebkNpcGhlciBOVFMgRVNOOjRERTktMEM1RS0zRTA5
// SIG // MSswKQYDVQQDEyJNaWNyb3NvZnQgVGltZSBTb3VyY2Ug
// SIG // TWFzdGVyIENsb2NrMA0GCSqGSIb3DQEBBQUAAgUA4dWg
// SIG // aTAiGA8yMDIwMDEyNTAwNTcxM1oYDzIwMjAwMTI2MDA1
// SIG // NzEzWjB0MDoGCisGAQQBhFkKBAExLDAqMAoCBQDh1aBp
// SIG // AgEAMAcCAQACAgbSMAcCAQACAhfzMAoCBQDh1vHpAgEA
// SIG // MDYGCisGAQQBhFkKBAIxKDAmMAwGCisGAQQBhFkKAwGg
// SIG // CjAIAgEAAgMW42ChCjAIAgEAAgMHoSAwDQYJKoZIhvcN
// SIG // AQEFBQADggEBAK8S5Nfl0usZL2SOMjnqdsmJBt5yPfd2
// SIG // ozn+CzHUSt14YIrzIjr1OsfE3DCbLOS7MPbXkZofDlIC
// SIG // qt+pS7aAYXCflJvBlth+3UtN5wxk6XeVoz772wjLVuln
// SIG // yMdTIToUfiUWSMm9psxnOEJrnkiFOOqU4Sai5y5GoV19
// SIG // ySGqo9sPWYKFpb2VhLfo+222kh3npwcgtV0G9zhTGHlZ
// SIG // pUd5QmgkO4IyOsf/VbBt0Br4bLNDHE5QputtHItf5nne
// SIG // D49eqr46dJRDmeeP5/ch2tTsOrSSb7TqMs8FInbPpIlP
// SIG // MwHJo6z+cW9ap/1TBqR6s5NbY8eGNq5dMCgCiMO1+vLt
// SIG // k9kxggL1MIIC8QIBATCBkzB8MQswCQYDVQQGEwJVUzET
// SIG // MBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVk
// SIG // bW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0
// SIG // aW9uMSYwJAYDVQQDEx1NaWNyb3NvZnQgVGltZS1TdGFt
// SIG // cCBQQ0EgMjAxMAITMwAAAQUHOepZ81W/KgAAAAABBTAN
// SIG // BglghkgBZQMEAgEFAKCCATIwGgYJKoZIhvcNAQkDMQ0G
// SIG // CyqGSIb3DQEJEAEEMC8GCSqGSIb3DQEJBDEiBCDeGgXm
// SIG // YTNwCkYT6fxWlsP4NbrAMMwmZcmTbCIPt4I4SjCB4gYL
// SIG // KoZIhvcNAQkQAgwxgdIwgc8wgcwwgbEEFNJ5nOzIh9j6
// SIG // 9Md959d2YOEZVfaqMIGYMIGApH4wfDELMAkGA1UEBhMC
// SIG // VVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcT
// SIG // B1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jw
// SIG // b3JhdGlvbjEmMCQGA1UEAxMdTWljcm9zb2Z0IFRpbWUt
// SIG // U3RhbXAgUENBIDIwMTACEzMAAAEFBznqWfNVvyoAAAAA
// SIG // AQUwFgQUPRPlVKln+ws3v19tgg9hvLYhqIEwDQYJKoZI
// SIG // hvcNAQELBQAEggEATbrAr6PH0F6ydp/VdkUbKDx4FK/a
// SIG // 3UiCaBiGtXI4EnKE/YjcNCYXCOJaEk50ZtoFb8AgZlUU
// SIG // SDBXrbMARDLOf6ejmQ6RSHrCxGyMXkCG/qHKIj/qIfov
// SIG // B2J1DIJkDRBDhcbBOaRW80BBArRZcgzEG2f1yxN/WNxK
// SIG // tTT2ttklFm41uLnYLU9s7MVA8sdDJ9bspUgDzwtTmQ90
// SIG // suu0bku6RZD/cAJFvWXD9jS9i3Ex68I5Gtr2GA8aCqUZ
// SIG // tscmZTNhFiQfSYsWEEZ97Ytl7WziEGWiiHlTELJudet5
// SIG // +bRu6jwVD5VQD22SfxD/qvXCsztS6wu2//tTJaw/naWT
// SIG // J/eOew==
// SIG // End signature block
