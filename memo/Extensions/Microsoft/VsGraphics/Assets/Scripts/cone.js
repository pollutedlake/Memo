 
//
// create the mesh and add geometry using the geometry API
//

// enable in prop window
var flags = 0x8;

// create the mesh and scene node and place into documents list
var newMeshElement = document.createMesh(1105);
var mesh = newMeshElement.behavior;

var material = services.effects.createEffectInstance("Phong");

// set up the color traits
var diffuseColorTrait = material.getOrCreateTrait("MaterialDiffuse", "float4", flags);
diffuseColorTrait.value = [1, 1, 1, 1];

var ambientColorTrait = material.getOrCreateTrait("MaterialAmbient", "float4", flags);
ambientColorTrait.value = [1, 1, 1, 1]

// add to our materials collection
mesh.materials.append(material);

// get the geometry
var geom = newMeshElement.getTrait("Geometry").value;

var height = 5;
var radius = 1;
var halfHeight = height * 0.5;
var divisions = 20;

var delta = 2.0 * Math.PI / divisions;
var angle = 0.0;

var pointList = new Array();
for (var v = 0; v < divisions; v++) {

    var x = radius * Math.cos(angle);
    var y = -halfHeight;
    var z = radius * Math.sin(angle);

    angle += delta;
    pointList.push(x, y, z);
}

pointList.push(0, halfHeight, 0);
pointList.push(0, -halfHeight, 0);

// update the geometry
geom.addPoints(pointList, pointList.length / 3);
 
var polyPointCounts = new Array();
for (var i = 0; i < divisions * 2; i++) {
    polyPointCounts.push(3);
}

var indices = new Array();

// add the polygons
var topIndex = divisions;
var bottonIndex = (divisions + 1);
for (var i = 0; i < divisions; i++) {
    var next = i + 1;
    if (next == divisions) {
        next = 0;
    }
    indices.push(i, topIndex, next);
    indices.push(next, bottonIndex, i);
}

geom.addPolygons(0, indices, polyPointCounts, polyPointCounts.length);

var IndexingModePerPointOnPoly = 3;

// tex coord per cube side
var texCoords = new Array();
var u = 0;
var du = 1.0 / divisions;
for (var i = 0; i < divisions; i++) {
    
    var sn0 = 0.25 * Math.sin(u * Math.PI * 2) + 0.25;
    var sn1 = 0.25 * Math.sin((u + du) * Math.PI * 2) + 0.25;
    var cs0 = -0.25 * Math.cos(u * Math.PI * 2) + 0.25;
    var cs1 = -0.25 * Math.cos((u + du) * Math.PI * 2) + 0.25;

    texCoords.push(cs0, sn0);
    texCoords.push(0.25, 0.25);
    texCoords.push(cs1, sn1);

    sn0 = -0.25 * Math.sin(u * Math.PI * 2) + 0.25;
    sn1 = -0.25 * Math.sin((u + du) * Math.PI * 2) + 0.25;
    cs0 = -0.25 * Math.cos(u * Math.PI * 2) + 0.75;
    cs1 = -0.25 * Math.cos((u + du) * Math.PI * 2) + 0.75;

    texCoords.push(cs1, sn1);
    texCoords.push(0.75, 0.25);
    texCoords.push(cs0, sn0);

    u += du;
}



geom.addTextureCoordinates(texCoords, texCoords.length / 2);
geom.textureCoordinateIndexingMode = IndexingModePerPointOnPoly;

var coord = document.getCoordinateSystemMatrix();
geom.transform(coord);

newMeshElement.getTrait("SmoothingAngle").value = 180;
var mesh = newMeshElement.behavior;
mesh.computeNormals();

//
// create an undoable operation that creates the object on do and deletes the object on undo 
//

function UndoableItem(element, parent) {
    this._element = element;
    this._parentElement = parent;

    this.getName = function () {
        var IDS_MreUndoCreateCone = 160;
        return services.strings.getStringFromId(IDS_MreUndoCreateCone);
    }

    this.onDo = function () {
        this._element.parent = this._parentElement;
        document.elements.append(this._parentElement);
        document.elements.append(this._element);
        this._element.parent = this._parentElement;
        this._parentElement.parent = document.getSceneRoot();
    }

    this.onUndo = function () {
        document.deleteSceneElement(this._parentElement);
    }
}

undoableItem = new UndoableItem(newMeshElement, newMeshElement.parent);
services.undoService.addUndoableItem(undoableItem);
// SIG // Begin signature block
// SIG // MIIjiAYJKoZIhvcNAQcCoIIjeTCCI3UCAQExDzANBglg
// SIG // hkgBZQMEAgEFADB3BgorBgEEAYI3AgEEoGkwZzAyBgor
// SIG // BgEEAYI3AgEeMCQCAQEEEBDgyQbOONQRoqMAEEvTUJAC
// SIG // AQACAQACAQACAQACAQAwMTANBglghkgBZQMEAgEFAAQg
// SIG // cyx/GIEdVGTNH/yql/1twdJHXlTPfuiQCac4FG7GDwCg
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
// SIG // AYI3AgEVMC8GCSqGSIb3DQEJBDEiBCD+pl3xky+dXk3b
// SIG // JS9ZMGLOuaF3sgfgrAfMipUPYbv2xDBCBgorBgEEAYI3
// SIG // AgEMMTQwMqAUgBIATQBpAGMAcgBvAHMAbwBmAHShGoAY
// SIG // aHR0cDovL3d3dy5taWNyb3NvZnQuY29tMA0GCSqGSIb3
// SIG // DQEBAQUABIIBAEEMsaWLsmKI9vNB/Ijhu5rnlZSkdm/F
// SIG // sHpYAYEHrfz5JIt9hFIZxPzz91naQv7QGWXDUgU8jKkK
// SIG // qH8XEh/CXWVRaV/L/VDkhwP3PbLtDgrSH36gF/HuKsKu
// SIG // 5HOg3Dl+w8P6zjPXtO9kds2RE4NxfeWtXuyNYIWceJ86
// SIG // ed4I3kCtoRwlYUF9b6zgTmjVRt4JsKRwx7vZEYX/gzzA
// SIG // +kUvf2/WVrv/5KplNQcEd3ofmcT2oK0qb13iyCXVPiJg
// SIG // S+oYuJnok76EmtZM26Hzpx2zxw3cYBSTJWysmZa07cKV
// SIG // gFuY99X4CXRF99Y3XgKCFn8KuFhSccdRuLMz7a+WtV4n
// SIG // E86hghLlMIIS4QYKKwYBBAGCNwMDATGCEtEwghLNBgkq
// SIG // hkiG9w0BBwKgghK+MIISugIBAzEPMA0GCWCGSAFlAwQC
// SIG // AQUAMIIBUQYLKoZIhvcNAQkQAQSgggFABIIBPDCCATgC
// SIG // AQEGCisGAQQBhFkKAwEwMTANBglghkgBZQMEAgEFAAQg
// SIG // cy3tsNiW1oSaup/0DDoa9avuU0MwZEsGVKKUsyjkauMC
// SIG // Bl4p3TvRThgTMjAyMDAxMjQyMTA0NDMuODg1WjAEgAIB
// SIG // 9KCB0KSBzTCByjELMAkGA1UEBhMCVVMxEzARBgNVBAgT
// SIG // Cldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAc
// SIG // BgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjElMCMG
// SIG // A1UECxMcTWljcm9zb2Z0IEFtZXJpY2EgT3BlcmF0aW9u
// SIG // czEmMCQGA1UECxMdVGhhbGVzIFRTUyBFU046N0JGMS1F
// SIG // M0VBLUI4MDgxJTAjBgNVBAMTHE1pY3Jvc29mdCBUaW1l
// SIG // LVN0YW1wIFNlcnZpY2Wggg48MIIE8TCCA9mgAwIBAgIT
// SIG // MwAAAR9OJc2sCvS4HwAAAAABHzANBgkqhkiG9w0BAQsF
// SIG // ADB8MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGlu
// SIG // Z3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMV
// SIG // TWljcm9zb2Z0IENvcnBvcmF0aW9uMSYwJAYDVQQDEx1N
// SIG // aWNyb3NvZnQgVGltZS1TdGFtcCBQQ0EgMjAxMDAeFw0x
// SIG // OTExMTMyMTQwNDFaFw0yMTAyMTEyMTQwNDFaMIHKMQsw
// SIG // CQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjEQ
// SIG // MA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9z
// SIG // b2Z0IENvcnBvcmF0aW9uMSUwIwYDVQQLExxNaWNyb3Nv
// SIG // ZnQgQW1lcmljYSBPcGVyYXRpb25zMSYwJAYDVQQLEx1U
// SIG // aGFsZXMgVFNTIEVTTjo3QkYxLUUzRUEtQjgwODElMCMG
// SIG // A1UEAxMcTWljcm9zb2Z0IFRpbWUtU3RhbXAgU2Vydmlj
// SIG // ZTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEB
// SIG // AKVMD8xW9z8cjH9OOjC1hQrRcJQqc7tcD4tunKdEGMWt
// SIG // fcm2z5wxftcZY0NaeqV4/oTy00CILFf8SwJw6Cp0Rpqt
// SIG // +y+HklUl4DJgkw2mS2VMCYtw8rEIHQl/LsKPnJ5XxnxQ
// SIG // mdDs0yFYI7eMGtaFrapINHifv4eAnohn3Un68/Q7PaP8
// SIG // 5/FVqX87HFu7xxYwJk915AE5d2dVCFcYm0g4ThkvnzRG
// SIG // /LcHduEZ/qgaYrUalS2yRny2pCDI/XDkV14b2FhsgkH8
// SIG // rj5ljymkNfeImYqli/7P/Qlluft/NfvuzkWvWqrTpg8k
// SIG // Qk1Q7xrS0yGZ7AP1iA+0kFcV4KvLuWLbCLMCAwEAAaOC
// SIG // ARswggEXMB0GA1UdDgQWBBQVox8AOjATYwQ3ZSJbK8E2
// SIG // ifrgwDAfBgNVHSMEGDAWgBTVYzpcijGQ80N7fEYbxTNo
// SIG // WoVtVTBWBgNVHR8ETzBNMEugSaBHhkVodHRwOi8vY3Js
// SIG // Lm1pY3Jvc29mdC5jb20vcGtpL2NybC9wcm9kdWN0cy9N
// SIG // aWNUaW1TdGFQQ0FfMjAxMC0wNy0wMS5jcmwwWgYIKwYB
// SIG // BQUHAQEETjBMMEoGCCsGAQUFBzAChj5odHRwOi8vd3d3
// SIG // Lm1pY3Jvc29mdC5jb20vcGtpL2NlcnRzL01pY1RpbVN0
// SIG // YVBDQV8yMDEwLTA3LTAxLmNydDAMBgNVHRMBAf8EAjAA
// SIG // MBMGA1UdJQQMMAoGCCsGAQUFBwMIMA0GCSqGSIb3DQEB
// SIG // CwUAA4IBAQCY0UfA3GTiymKryc6Jz1HELAvZfz8LveDL
// SIG // /u5fF9QVtvsyhKgA0/aICQ9zqe3AIN8d8em2hC+qsOIc
// SIG // DglN3VlBJsQEuoTulnfBXYv6FGZTOKnrAol/dQ2eT/cV
// SIG // 4hA89VF0MW2ZGPyoHoCQCOAjskCLaS8pRoJpsefF9cuY
// SIG // GFFJpcxB2MAnt1GCwpugBNqjfv00OdYcpYpuwTUerNsK
// SIG // iBCYBSxstdWYEiToubUOQaizofsCLWEaq6GUdECDTU2d
// SIG // PildKspm2p2KiDInxm3OTPXzXPn9kTZxuDGbzAH7CFFZ
// SIG // av9zIa1jf5AyoL7e78dCyPzn4NZXBTxT48H7is2LamxE
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
// SIG // cyBUU1MgRVNOOjdCRjEtRTNFQS1CODA4MSUwIwYDVQQD
// SIG // ExxNaWNyb3NvZnQgVGltZS1TdGFtcCBTZXJ2aWNloiMK
// SIG // AQEwBwYFKw4DAhoDFQDUL0SWtlr8GKpK0dgWAw6LEl5J
// SIG // DKCBgzCBgKR+MHwxCzAJBgNVBAYTAlVTMRMwEQYDVQQI
// SIG // EwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4w
// SIG // HAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xJjAk
// SIG // BgNVBAMTHU1pY3Jvc29mdCBUaW1lLVN0YW1wIFBDQSAy
// SIG // MDEwMA0GCSqGSIb3DQEBBQUAAgUA4dWtODAiGA8yMDIw
// SIG // MDEyNTAxNTE1MloYDzIwMjAwMTI2MDE1MTUyWjB3MD0G
// SIG // CisGAQQBhFkKBAExLzAtMAoCBQDh1a04AgEAMAoCAQAC
// SIG // AiToAgH/MAcCAQACAhGtMAoCBQDh1v64AgEAMDYGCisG
// SIG // AQQBhFkKBAIxKDAmMAwGCisGAQQBhFkKAwKgCjAIAgEA
// SIG // AgMHoSChCjAIAgEAAgMBhqAwDQYJKoZIhvcNAQEFBQAD
// SIG // gYEAkVaroVmpQ1hAJ2rvXJUg+AwoUi7OzRiSta52yMP5
// SIG // I36Pn4aI3VPRoC7z24QQIfRD3EEj6LJ7292MWjfHIpkB
// SIG // ZYafkqCppijBOi3z672HYmgM8mIw3FrNR+NI7HkLOgWn
// SIG // drAT92iWRHEP5B8r3WWjasaxNJuiAWqKxILDjcHQFAwx
// SIG // ggMNMIIDCQIBATCBkzB8MQswCQYDVQQGEwJVUzETMBEG
// SIG // A1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9u
// SIG // ZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9u
// SIG // MSYwJAYDVQQDEx1NaWNyb3NvZnQgVGltZS1TdGFtcCBQ
// SIG // Q0EgMjAxMAITMwAAAR9OJc2sCvS4HwAAAAABHzANBglg
// SIG // hkgBZQMEAgEFAKCCAUowGgYJKoZIhvcNAQkDMQ0GCyqG
// SIG // SIb3DQEJEAEEMC8GCSqGSIb3DQEJBDEiBCAxAR6MQAEr
// SIG // VNnFxu9uLNEzl/yfoO0qv64cvnQbmR0rBjCB+gYLKoZI
// SIG // hvcNAQkQAi8xgeowgecwgeQwgb0EIKqlcPcAW3/5O//T
// SIG // cVjn49HhCC0nJgcjRNV+31bBPoOlMIGYMIGApH4wfDEL
// SIG // MAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24x
// SIG // EDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jv
// SIG // c29mdCBDb3Jwb3JhdGlvbjEmMCQGA1UEAxMdTWljcm9z
// SIG // b2Z0IFRpbWUtU3RhbXAgUENBIDIwMTACEzMAAAEfTiXN
// SIG // rAr0uB8AAAAAAR8wIgQgopyU+2DQ8MmoAU/mS48TEoG8
// SIG // gBYnGVKMTvbpMCKr2VQwDQYJKoZIhvcNAQELBQAEggEA
// SIG // eqtclevRXksiGojPiJljW3+H7+ubRUDfH+Qj9ENolHeR
// SIG // V45OzJNfJVMiIo025Boxj8dikqlCOCJkjHwdJYDXk+jF
// SIG // TGsK7gGHiRKhx2lUNcTfZsCGgeunlsFO4IRqghdq/S7I
// SIG // aVwZswLzUHuYZERcDl8re9xWe2jVI8vi8+llrouuiAVf
// SIG // 4w7GPGn0qMNoR6ulkuOwwsNgTSOPjiaERm5ph4YannAE
// SIG // QL3uTzibnuYr5yQYKrPmmhOHumbFYrg1VK1iwNmWGbuj
// SIG // /8gPnwYvdJbze8ZDfyeTgsp/aqMechBarjQZIyT/DB7E
// SIG // JPbAKJhasRXlS8+yhxw2fy2uA3WISxLLLw==
// SIG // End signature block
