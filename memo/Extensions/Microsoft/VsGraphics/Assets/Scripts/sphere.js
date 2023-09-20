
//
// create a sphere in the scene
//

// enable in prop window
var flags = 0x8;

// create the mesh and scene node and place into documents list
var sphereElement = document.createMesh(1102);
var mesh = sphereElement.behavior;

var material = services.effects.createEffectInstance("Phong");

// set up the color traits
var diffuseColorTrait = material.getOrCreateTrait("MaterialDiffuse", "float4", flags);
diffuseColorTrait.value = [1, 1, 1, 1];

var ambientColorTrait = material.getOrCreateTrait("MaterialAmbient", "float4", flags);
ambientColorTrait.value = [1, 1, 1, 1]

// add to our materials collection
mesh.materials.append(material);

// get the geometry
var geom = sphereElement.getTrait("Geometry").value;

function generateSpherePoints(radius, hDiv, vDiv) {
    var pointList = new Array();

    // Points in between
    for (var v = 0; v <= vDiv; v ++)
    {
        for (var h = 0; h < hDiv; h++) {
            var hAngle = h * (2 * Math.PI) / vDiv;
            var vAngle = v * Math.PI / hDiv;

            var x = radius * Math.cos(hAngle) * Math.sin(vAngle);
            var y = radius * Math.cos(vAngle);
            var z = radius * Math.sin(hAngle) * Math.sin(vAngle);
            pointList.push(x,y,z);
        }
    }
    
    return pointList;
}

var hDivisions = 22;
var vDivisions = 22;

// Sphere points
var points = generateSpherePoints(1, hDivisions, vDivisions);
var pointCount = points.length / 3;

// update the geometry
geom.addPoints(points, pointCount);

var polygonPointCounts = new Array();
var polygonCount = (hDivisions) * (vDivisions);
for (var i = 0; i < polygonCount; i++)
{
    polygonPointCounts.push(4);
}

var polygonPointIndices = new Array();
for (var i = 0; i < vDivisions; i++) {
    for (var j = 0; j < hDivisions; j++) {
        var nextH = j + 1;
        if (nextH == hDivisions) {
            nextH = 0;
        }
        var row0 = i * hDivisions;
        var row1 = (i+1) * hDivisions;
        polygonPointIndices.push(row1 + nextH, row1 + j, row0 + j, row0 + nextH);
    }
}

// this uses material '0' 
geom.addPolygons(0, polygonPointIndices, polygonPointCounts, polygonCount);

function generateSphereUV(hDiv, vDiv) {
    var uvs = new Array();

    // Points in between
    for (var v = 0.0; v <= vDiv; v += 1.0) {
        for (var h = 0.0; h <= hDiv; h += 1.0) {

            var x = h / vDiv;
            var y = v / hDiv;

            var uv = new Object();
            uv.x = 1 - x;
            uv.y = 1 - y;
            uvs.push(uv);
        }
    }

    return uvs;
}

var uvs = generateSphereUV(hDivisions, vDivisions);
var IndexingModePerPointOnPoly = 3;

var splitUVs = new Array();
for (var i = 0; i < vDivisions; i++) {
    for (var j = 0; j < hDivisions; j++) {
        var nextH = j + 1;

        var row0 = i * (hDivisions+1);
        var row1 = (i + 1) * (hDivisions+1);
        splitUVs.push(uvs[row1 + nextH].x, uvs[row1 + nextH].y);
        splitUVs.push(uvs[row1 + j].x, uvs[row1 + j].y);
        splitUVs.push(uvs[row0 + j].x, uvs[row0 + j].y);
        splitUVs.push(uvs[row0 + nextH].x, uvs[row0 + nextH].y);
    }
}

geom.addTextureCoordinates(splitUVs, splitUVs.length / 2);
geom.textureCoordinateIndexingMode = IndexingModePerPointOnPoly;

var coord = document.getCoordinateSystemMatrix();
geom.transform(coord);

sphereElement.getTrait("SmoothingAngle").value = 45;
var mesh = sphereElement.behavior;
mesh.computeNormals();

//
// create an undoable operation that creates the object on do and deletes the object on undo
//
function UndoableItem(element, parent) {
    this._element = element;
    this._parentElement = parent;

    this.getName = function () {
        var IDS_MreUndoCreateSphere = 157;
        return services.strings.getStringFromId(IDS_MreUndoCreateSphere);
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

undoableItem = new UndoableItem(sphereElement, sphereElement.parent);
services.undoService.addUndoableItem(undoableItem);
// SIG // Begin signature block
// SIG // MIIkWQYJKoZIhvcNAQcCoIIkSjCCJEYCAQExDzANBglg
// SIG // hkgBZQMEAgEFADB3BgorBgEEAYI3AgEEoGkwZzAyBgor
// SIG // BgEEAYI3AgEeMCQCAQEEEBDgyQbOONQRoqMAEEvTUJAC
// SIG // AQACAQACAQACAQACAQAwMTANBglghkgBZQMEAgEFAAQg
// SIG // fkP4j+hGT8TDZ2McMlOXJmobgDiJjiYdweB/DxqZQ4ig
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
// SIG // AYI3AgEVMC8GCSqGSIb3DQEJBDEiBCBlrxBVcfWHkT+U
// SIG // thVIWpt7PGChSfQqwdawPT5V+xfdOzBCBgorBgEEAYI3
// SIG // AgEMMTQwMqAUgBIATQBpAGMAcgBvAHMAbwBmAHShGoAY
// SIG // aHR0cDovL3d3dy5taWNyb3NvZnQuY29tMA0GCSqGSIb3
// SIG // DQEBAQUABIIBAHgIy3IQzNkDvSk67SxPN2uChyXmT/yu
// SIG // AMs29/aJZ9zLCJDjMgEK79xnuoVn3xmEFpgU+it+4IoU
// SIG // tgnYVoaIDHs/l3ihbUNLx2/EGFqSL9KgbnfK99zdAFD6
// SIG // PwyakSRs99PxYvdpkgASO3nTW2jqLHtssn3cVgWCCFHs
// SIG // 6s/tlcTsA1jsuah4kO/cXiLsQgIe8ZRpGgvJx7l4flaC
// SIG // VvmlxPwOpKtg2FvI5e+iSPuxTvcr6AKotyGH3pbqzyii
// SIG // 21unpPfvepy49f/cNn6lCoZYlDbY7EGtzSqTlhOG3XBT
// SIG // xIZ4xGaaGM4lhbdURCbVa2BPt9e5FAzAUzWFeHUlJwKM
// SIG // 5T+hghO2MIITsgYKKwYBBAGCNwMDATGCE6IwghOeBgkq
// SIG // hkiG9w0BBwKgghOPMIITiwIBAzEPMA0GCWCGSAFlAwQC
// SIG // AQUAMIIBVwYLKoZIhvcNAQkQAQSgggFGBIIBQjCCAT4C
// SIG // AQEGCisGAQQBhFkKAwEwMTANBglghkgBZQMEAgEFAAQg
// SIG // 9zS3RydUAOKPxLatAc7yWFsFt3mOkOcQajCv5ni6E+kC
// SIG // Bl4g8PTwlRgSMjAyMDAxMjQyMTA0NDUuMTNaMAcCAQGA
// SIG // AgH0oIHUpIHRMIHOMQswCQYDVQQGEwJVUzETMBEGA1UE
// SIG // CBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEe
// SIG // MBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMSkw
// SIG // JwYDVQQLEyBNaWNyb3NvZnQgT3BlcmF0aW9ucyBQdWVy
// SIG // dG8gUmljbzEmMCQGA1UECxMdVGhhbGVzIFRTUyBFU046
// SIG // NTg0Ny1GNzYxLTRGNzAxJTAjBgNVBAMTHE1pY3Jvc29m
// SIG // dCBUaW1lLVN0YW1wIFNlcnZpY2Wggg8fMIIE9TCCA92g
// SIG // AwIBAgITMwAAAQUHOepZ81W/KgAAAAABBTANBgkqhkiG
// SIG // 9w0BAQsFADB8MQswCQYDVQQGEwJVUzETMBEGA1UECBMK
// SIG // V2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwG
// SIG // A1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMSYwJAYD
// SIG // VQQDEx1NaWNyb3NvZnQgVGltZS1TdGFtcCBQQ0EgMjAx
// SIG // MDAeFw0xOTA5MDYyMDQxMThaFw0yMDEyMDQyMDQxMTha
// SIG // MIHOMQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGlu
// SIG // Z3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMV
// SIG // TWljcm9zb2Z0IENvcnBvcmF0aW9uMSkwJwYDVQQLEyBN
// SIG // aWNyb3NvZnQgT3BlcmF0aW9ucyBQdWVydG8gUmljbzEm
// SIG // MCQGA1UECxMdVGhhbGVzIFRTUyBFU046NTg0Ny1GNzYx
// SIG // LTRGNzAxJTAjBgNVBAMTHE1pY3Jvc29mdCBUaW1lLVN0
// SIG // YW1wIFNlcnZpY2UwggEiMA0GCSqGSIb3DQEBAQUAA4IB
// SIG // DwAwggEKAoIBAQDMIpZjVUiLWQGqDFLLaeGfhc9bxCwi
// SIG // 8HQx+gcaF5Zz2GodhM71oyjal6uqnRM8QHxj49uKFmY/
// SIG // SWEhlV+so3IrmEHVLmskeEQaio5PxVgUWRm+sBIJpS9G
// SIG // jwKrGPZ2ub4ST2J9fu5FxbfTmJyB2AL6W7WcSUON8tyu
// SIG // z2/NRAII6YuojdMa6mjVXamL2AS7PBo1GW4Pa4XbNhEQ
// SIG // oA4/siS4JGbcfAwVMGv87bhKapDqpXLbDq6LbFdLAv7Q
// SIG // 7eUHiHS4eccXRNGAnpkdhHOK7s1O9FqpRZYsbx/Upkao
// SIG // yqiQe/JFTA+1keYZsZgaQqgPNpGYD50SDDyQZ2vtNx7K
// SIG // VgXtAgMBAAGjggEbMIIBFzAdBgNVHQ4EFgQUPXQb/rp3
// SIG // KEzK6DYOy3Fn/QIzNyIwHwYDVR0jBBgwFoAU1WM6XIox
// SIG // kPNDe3xGG8UzaFqFbVUwVgYDVR0fBE8wTTBLoEmgR4ZF
// SIG // aHR0cDovL2NybC5taWNyb3NvZnQuY29tL3BraS9jcmwv
// SIG // cHJvZHVjdHMvTWljVGltU3RhUENBXzIwMTAtMDctMDEu
// SIG // Y3JsMFoGCCsGAQUFBwEBBE4wTDBKBggrBgEFBQcwAoY+
// SIG // aHR0cDovL3d3dy5taWNyb3NvZnQuY29tL3BraS9jZXJ0
// SIG // cy9NaWNUaW1TdGFQQ0FfMjAxMC0wNy0wMS5jcnQwDAYD
// SIG // VR0TAQH/BAIwADATBgNVHSUEDDAKBggrBgEFBQcDCDAN
// SIG // BgkqhkiG9w0BAQsFAAOCAQEAp85hd3trAVfmVAPmcOAq
// SIG // nM47TbWB9S0ySGG/eNvIfhgYC0YjCLEZhiiQyOeRTws0
// SIG // lIOWGv7tM5tr70RGzNo1/C7SQadqQ2dT5sUj7Ga6LHO2
// SIG // excdzRvUIwdeOaVuaj4VpiXnhjPBRu2CVNGXPe1d7Zzw
// SIG // 7di8xh2D6ooZBjhHLh7yGf2ZFjBjLcDVjrfaLwd4Yqef
// SIG // Jgg42s8EMUoXzsTpPlS0IBKWeX+RbBycOUhXpK9qlvFb
// SIG // BQGp4N+uLEV6haG33oVOtWwrbhu5F0E4UDzsFUaZ8OAL
// SIG // yKraR1dIo+ZU+zjpn3Na7KUkrT/1UFYdnWYwoUDm9e+D
// SIG // mBhqdhUlxIhRnzCCBnEwggRZoAMCAQICCmEJgSoAAAAA
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
// SIG // MCQGA1UECxMdVGhhbGVzIFRTUyBFU046NTg0Ny1GNzYx
// SIG // LTRGNzAxJTAjBgNVBAMTHE1pY3Jvc29mdCBUaW1lLVN0
// SIG // YW1wIFNlcnZpY2WiJQoBATAJBgUrDgMCGgUAAxUA0nmc
// SIG // 7MiH2Pr0x33n13Zg4RlV9qqggd4wgdukgdgwgdUxCzAJ
// SIG // BgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAw
// SIG // DgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3Nv
// SIG // ZnQgQ29ycG9yYXRpb24xKTAnBgNVBAsTIE1pY3Jvc29m
// SIG // dCBPcGVyYXRpb25zIFB1ZXJ0byBSaWNvMScwJQYDVQQL
// SIG // Ex5uQ2lwaGVyIE5UUyBFU046NERFOS0wQzVFLTNFMDkx
// SIG // KzApBgNVBAMTIk1pY3Jvc29mdCBUaW1lIFNvdXJjZSBN
// SIG // YXN0ZXIgQ2xvY2swDQYJKoZIhvcNAQEFBQACBQDh1aBp
// SIG // MCIYDzIwMjAwMTI1MDA1NzEzWhgPMjAyMDAxMjYwMDU3
// SIG // MTNaMHQwOgYKKwYBBAGEWQoEATEsMCowCgIFAOHVoGkC
// SIG // AQAwBwIBAAICBtIwBwIBAAICF/MwCgIFAOHW8ekCAQAw
// SIG // NgYKKwYBBAGEWQoEAjEoMCYwDAYKKwYBBAGEWQoDAaAK
// SIG // MAgCAQACAxbjYKEKMAgCAQACAwehIDANBgkqhkiG9w0B
// SIG // AQUFAAOCAQEArxLk1+XS6xkvZI4yOep2yYkG3nI993aj
// SIG // Of4LMdRK3XhgivMiOvU6x8TcMJss5Lsw9teRmh8OUgKq
// SIG // 36lLtoBhcJ+Um8GW2H7dS03nDGTpd5WjPvvbCMtW6WfI
// SIG // x1MhOhR+JRZIyb2mzGc4QmueSIU46pThJqLnLkahXX3J
// SIG // Iaqj2w9ZgoWlvZWEt+j7bbaSHeenByC1XQb3OFMYeVml
// SIG // R3lCaCQ7gjI6x/9VsG3QGvhss0McTlCm620ci1/med4P
// SIG // j16qvjp0lEOZ54/n9yHa1Ow6tJJvtOoyzwUids+kiU8z
// SIG // AcmjrP5xb1qn/VMGpHqzk1tjx4Y2rl0wKAKIw7X68u2T
// SIG // 2TGCAvUwggLxAgEBMIGTMHwxCzAJBgNVBAYTAlVTMRMw
// SIG // EQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRt
// SIG // b25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRp
// SIG // b24xJjAkBgNVBAMTHU1pY3Jvc29mdCBUaW1lLVN0YW1w
// SIG // IFBDQSAyMDEwAhMzAAABBQc56lnzVb8qAAAAAAEFMA0G
// SIG // CWCGSAFlAwQCAQUAoIIBMjAaBgkqhkiG9w0BCQMxDQYL
// SIG // KoZIhvcNAQkQAQQwLwYJKoZIhvcNAQkEMSIEIL2fBjd6
// SIG // 8lC6cgBRGhKhnw9vRfYyBHKKkhs6pdzhVFQhMIHiBgsq
// SIG // hkiG9w0BCRACDDGB0jCBzzCBzDCBsQQU0nmc7MiH2Pr0
// SIG // x33n13Zg4RlV9qowgZgwgYCkfjB8MQswCQYDVQQGEwJV
// SIG // UzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMH
// SIG // UmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBv
// SIG // cmF0aW9uMSYwJAYDVQQDEx1NaWNyb3NvZnQgVGltZS1T
// SIG // dGFtcCBQQ0EgMjAxMAITMwAAAQUHOepZ81W/KgAAAAAB
// SIG // BTAWBBQ9E+VUqWf7Cze/X22CD2G8tiGogTANBgkqhkiG
// SIG // 9w0BAQsFAASCAQCHxiaZvy/9PvSzDypfMvzT0hBZGFw+
// SIG // 7NOL16cdYQYC1h1CyEOI+WmlnuLFCJ7JIFePhrf8qz0E
// SIG // RWfJRoMR9j1HsDg0bhMG0Uao05V9iRahPillDJ+M+Fbx
// SIG // Vy7ojKuQy3UYs/OoxPX+hkdCA60aicXFQgTIun6xLpof
// SIG // rWsfQX9cJe8WSne7AJykcToF+AG1XsiL8rwhTxsIvUz3
// SIG // cYpq75ryW2sBSkODH+WRzqPmPYLB3S1tjbwtTHzia0UI
// SIG // l5hIM5WqnTCZjz0homOjtURN3oRqaeDhV5r6bUZOqVpD
// SIG // yonw6TjLrdTWjCvh+WfrRUCddOlurWf0/R1I4HEG2Qie
// SIG // m7r3
// SIG // End signature block
