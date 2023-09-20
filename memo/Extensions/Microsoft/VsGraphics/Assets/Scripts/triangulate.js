

function UndoableItem() {
    this._geomToTriangulate = new Array();
    this._restoreGeom = new Array();
    this._mesh = new Array();

    var selectedElementCount = services.selection.count;

    // loop over selected
    for (var i = 0; i < selectedElementCount; i++) {

        // loop over immediate children of selected
        var selectedElement = services.selection.getElement(i);
        for (var j = 0; j < selectedElement.childCount; j++) {

            // get child and its materials
            var child = selectedElement.getChild(j);

            // is this a mesh?
            if (child.typeId == "Microsoft.VisualStudio.3D.Mesh") {
                var mesh = child.behavior;

                var geom = child.getTrait("Geometry").value;
                this._geomToTriangulate.push(geom);
                this._mesh.push(mesh);
            }
        }
    }

    this.getName = function () {
        var IDS_MreUndoTriangulate = 151;
        return services.strings.getStringFromId(IDS_MreUndoTriangulate);
    }

    this.onDo = function () {
        // services.debug.trace("[Triangulate.js] onDo()");
        
        this._restoreGeom = new Array();

        for (var i = 0; i < this._geomToTriangulate.length; i++) {
            var geom = this._geomToTriangulate[i];
            var cloned = geom.clone();
            this._restoreGeom.push(cloned);
            geom.triangulateInPlace();
        }

        for (var i = 0; i < this._mesh.length; i++) {
            var mesh = this._mesh[i];

            mesh.selectedObjects = null;

            mesh.recomputeCachedGeometry();
        }
    }

    this.onUndo = function () {
        // services.debug.trace("[Triangulate.js] onUndo()");

        for (var i = 0; i < this._restoreGeom.length; i++) {
            // services.debug.trace("[Triangulate.js] restoring item " + i);            
            this._geomToTriangulate[i].copyFrom(this._restoreGeom[i]);
        }

        for (var i = 0; i < this._mesh.length; i++) {
            var mesh = this._mesh[i];

            mesh.selectedObjects = null;

            mesh.recomputeCachedGeometry();
        }
    }
}

var undoableItem = new UndoableItem();
undoableItem.onDo();
services.undoService.addUndoableItem(undoableItem);

// SIG // Begin signature block
// SIG // MIIjiAYJKoZIhvcNAQcCoIIjeTCCI3UCAQExDzANBglg
// SIG // hkgBZQMEAgEFADB3BgorBgEEAYI3AgEEoGkwZzAyBgor
// SIG // BgEEAYI3AgEeMCQCAQEEEBDgyQbOONQRoqMAEEvTUJAC
// SIG // AQACAQACAQACAQACAQAwMTANBglghkgBZQMEAgEFAAQg
// SIG // pFQvJUTQhbt3khoIk/3wR69Bh63/1BuknvqG70o6kMmg
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
// SIG // AYI3AgEVMC8GCSqGSIb3DQEJBDEiBCAhMrNRO99SV/Fn
// SIG // 94G4mZxoO0XHu3VI+t8EkxBuCzTL6jBCBgorBgEEAYI3
// SIG // AgEMMTQwMqAUgBIATQBpAGMAcgBvAHMAbwBmAHShGoAY
// SIG // aHR0cDovL3d3dy5taWNyb3NvZnQuY29tMA0GCSqGSIb3
// SIG // DQEBAQUABIIBADyqHjk9eE/l61DorDS61F/wU6vbWehA
// SIG // OBLk0F9pBnq01rwJaiGdFLMGOGqoO0y2e4sBPvk2TGe8
// SIG // 4hWegahvYSPipt+p+ZXS3l8Gfyd2rLlXQLQgeSYj7SiP
// SIG // 4LJVu5MvA2UCqsyWMuBapSTrAoMT3PLAAe7vp04s17Ik
// SIG // Phf2W/CmHtdaPVwP7LYbe4foFt1D80o0I+cpekYJkjn9
// SIG // Xlej0zUv/zqFoUlIKloFy4MV0Aal8E2O55fO3V7Up/42
// SIG // u9RJA+Vk1kss/sEjUcnbCjJR1z2lHTJ+JWbhIwPUUcF7
// SIG // HnHCM4Ja4jkhZmrwg/6pA+hgAXqL6d6aIh1PlEnbOUIi
// SIG // IWahghLlMIIS4QYKKwYBBAGCNwMDATGCEtEwghLNBgkq
// SIG // hkiG9w0BBwKgghK+MIISugIBAzEPMA0GCWCGSAFlAwQC
// SIG // AQUAMIIBUQYLKoZIhvcNAQkQAQSgggFABIIBPDCCATgC
// SIG // AQEGCisGAQQBhFkKAwEwMTANBglghkgBZQMEAgEFAAQg
// SIG // 2eVxRh19tH6mmn2nqm5T/qr+w+XElmN0eNAOgma8lfsC
// SIG // Bl4qDAvG0xgTMjAyMDAxMjQyMTA0NDMuODU3WjAEgAIB
// SIG // 9KCB0KSBzTCByjELMAkGA1UEBhMCVVMxEzARBgNVBAgT
// SIG // Cldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAc
// SIG // BgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjElMCMG
// SIG // A1UECxMcTWljcm9zb2Z0IEFtZXJpY2EgT3BlcmF0aW9u
// SIG // czEmMCQGA1UECxMdVGhhbGVzIFRTUyBFU046RUFDRS1F
// SIG // MzE2LUM5MUQxJTAjBgNVBAMTHE1pY3Jvc29mdCBUaW1l
// SIG // LVN0YW1wIFNlcnZpY2Wggg48MIIE8TCCA9mgAwIBAgIT
// SIG // MwAAARqxsl98xwrNKgAAAAABGjANBgkqhkiG9w0BAQsF
// SIG // ADB8MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGlu
// SIG // Z3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMV
// SIG // TWljcm9zb2Z0IENvcnBvcmF0aW9uMSYwJAYDVQQDEx1N
// SIG // aWNyb3NvZnQgVGltZS1TdGFtcCBQQ0EgMjAxMDAeFw0x
// SIG // OTExMTMyMTQwMzdaFw0yMTAyMTEyMTQwMzdaMIHKMQsw
// SIG // CQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjEQ
// SIG // MA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9z
// SIG // b2Z0IENvcnBvcmF0aW9uMSUwIwYDVQQLExxNaWNyb3Nv
// SIG // ZnQgQW1lcmljYSBPcGVyYXRpb25zMSYwJAYDVQQLEx1U
// SIG // aGFsZXMgVFNTIEVTTjpFQUNFLUUzMTYtQzkxRDElMCMG
// SIG // A1UEAxMcTWljcm9zb2Z0IFRpbWUtU3RhbXAgU2Vydmlj
// SIG // ZTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEB
// SIG // AJ75dBBdVEYsl1i3rDhBNZ3DE7bmFAnx6GZderFTPeLY
// SIG // jjnYA1h0oo+jwxDiKnu4eaTD5FrOEPbs7aJz7uJN8EcJ
// SIG // U3S/5UxWlptmRDgnxMn/hT4EKrgJ6yaa4N7BP9XXztCu
// SIG // rB4QngEBwDKDf+UQ4YzAWCWwifHQw/lprk3wLiFTO7Qv
// SIG // dQHkOhjcsroUPX+KxDbVRGrV6V255b2aHjEovlDPzOV+
// SIG // Q9uKJPq+Mibh03qaZCaSw5tj1vk14I7NczABB668TXrk
// SIG // XHqD15wSC9roZtR3DgF7Eb2edv1bY8DFUgfpiGy1+0XL
// SIG // t9Y/Ctir7iSVwltIXKs8Lp/vepPOJjmBR3ECAwEAAaOC
// SIG // ARswggEXMB0GA1UdDgQWBBTmfxdpQezYkZbrFEcESBye
// SIG // s1QxajAfBgNVHSMEGDAWgBTVYzpcijGQ80N7fEYbxTNo
// SIG // WoVtVTBWBgNVHR8ETzBNMEugSaBHhkVodHRwOi8vY3Js
// SIG // Lm1pY3Jvc29mdC5jb20vcGtpL2NybC9wcm9kdWN0cy9N
// SIG // aWNUaW1TdGFQQ0FfMjAxMC0wNy0wMS5jcmwwWgYIKwYB
// SIG // BQUHAQEETjBMMEoGCCsGAQUFBzAChj5odHRwOi8vd3d3
// SIG // Lm1pY3Jvc29mdC5jb20vcGtpL2NlcnRzL01pY1RpbVN0
// SIG // YVBDQV8yMDEwLTA3LTAxLmNydDAMBgNVHRMBAf8EAjAA
// SIG // MBMGA1UdJQQMMAoGCCsGAQUFBwMIMA0GCSqGSIb3DQEB
// SIG // CwUAA4IBAQCng5qTe21wDSTSClemtNIYaS9sN1Efey+q
// SIG // zIf0xSPWJk5i0zNEt9DuEr/pmUPsv4sbPVK67W4LWhS0
// SIG // cBEl7HQMxdJf2xUdJepxHobd7G6k7/2FKVTVrAuc3gch
// SIG // vdjHzhKUvnNn45oqDr+hEqP4iurSSt/s9CYm21eejySE
// SIG // AGo02NlwUUyZINe1fiiPL+bFvoP6wQK6J3Ut+jq3SSFi
// SIG // W9XKIZQrIExEiLOUeVFQENL8PaCeWu0MA8fuZJyLExDa
// SIG // I6bLbaN24Z4UL4/oTqfccTqOctzqETOOgRoItTR/We+P
// SIG // k2ail7tjJsSACrQd0asWRWqvOeS/zX3VroEd/stzYUCq
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
// SIG // cyBUU1MgRVNOOkVBQ0UtRTMxNi1DOTFEMSUwIwYDVQQD
// SIG // ExxNaWNyb3NvZnQgVGltZS1TdGFtcCBTZXJ2aWNloiMK
// SIG // AQEwBwYFKw4DAhoDFQB2srQZPjQIZM32cKcA3SLMvqnU
// SIG // yaCBgzCBgKR+MHwxCzAJBgNVBAYTAlVTMRMwEQYDVQQI
// SIG // EwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4w
// SIG // HAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xJjAk
// SIG // BgNVBAMTHU1pY3Jvc29mdCBUaW1lLVN0YW1wIFBDQSAy
// SIG // MDEwMA0GCSqGSIb3DQEBBQUAAgUA4dUzSTAiGA8yMDIw
// SIG // MDEyNDE3MTEzN1oYDzIwMjAwMTI1MTcxMTM3WjB3MD0G
// SIG // CisGAQQBhFkKBAExLzAtMAoCBQDh1TNJAgEAMAoCAQAC
// SIG // Ahf8AgH/MAcCAQACAhHnMAoCBQDh1oTJAgEAMDYGCisG
// SIG // AQQBhFkKBAIxKDAmMAwGCisGAQQBhFkKAwKgCjAIAgEA
// SIG // AgMHoSChCjAIAgEAAgMBhqAwDQYJKoZIhvcNAQEFBQAD
// SIG // gYEAPGaV4XgtRue4ffKUiGOf+PZL223K52YbSzT6HjAU
// SIG // H6TkvFtIZh7gX9iSwg4nrihrfCSVODcpqiDxZhpUDdbi
// SIG // 1/LoaTMN42fYFlLMZmdABuKMKVG5UGqpC1JLp1gNEjIa
// SIG // cRbPFtgmsxBu2Y1NjeqHCMXRzk4Hui5vCGnDXxPfE0gx
// SIG // ggMNMIIDCQIBATCBkzB8MQswCQYDVQQGEwJVUzETMBEG
// SIG // A1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9u
// SIG // ZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9u
// SIG // MSYwJAYDVQQDEx1NaWNyb3NvZnQgVGltZS1TdGFtcCBQ
// SIG // Q0EgMjAxMAITMwAAARqxsl98xwrNKgAAAAABGjANBglg
// SIG // hkgBZQMEAgEFAKCCAUowGgYJKoZIhvcNAQkDMQ0GCyqG
// SIG // SIb3DQEJEAEEMC8GCSqGSIb3DQEJBDEiBCC5Rv2X2YeL
// SIG // kdEt7DOHwKhHFMHv0nwTs2372lTaQTYYfjCB+gYLKoZI
// SIG // hvcNAQkQAi8xgeowgecwgeQwgb0EILFootzCN0tF4PY0
// SIG // 9/IurU9OiA/F44PdgbzxiI3dS2ThMIGYMIGApH4wfDEL
// SIG // MAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24x
// SIG // EDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jv
// SIG // c29mdCBDb3Jwb3JhdGlvbjEmMCQGA1UEAxMdTWljcm9z
// SIG // b2Z0IFRpbWUtU3RhbXAgUENBIDIwMTACEzMAAAEasbJf
// SIG // fMcKzSoAAAAAARowIgQg7jf+gXqifcaMXDlPfZqnU6fK
// SIG // e2Syp0roKqTXV4qIxyUwDQYJKoZIhvcNAQELBQAEggEA
// SIG // NbLKBwJ6LLATVvhfrKC+6vhLzsX2Hm5qqEMR+0s+B2+i
// SIG // +ZmhUs+H2j9WzdQLBNOKqCr0YtNW0sEoFsFPN9prFqqk
// SIG // soPx6ucGaYBJ5em8pNzlX0k1A+W6v20WrVv6jpHWNTvc
// SIG // +/H0c12n98q6WxECDi7eruGTB4Ns3ZUCxlYZWOMe3rej
// SIG // EdYacU+YZu0Iw1xwK6dwxbCdBP9P5AdMjcxLAcHkSJhM
// SIG // YIUEXEXvfuVPFYMVE0ffmVInxcIU3bf5w+oBUEG8hTXU
// SIG // 31TrS304ElPLsfR1Mg3w5oUbyz7FPULKREoXK4sp2a41
// SIG // xSoC8f/TehP8qut/deGrQgu/cnnnRn2ttw==
// SIG // End signature block
