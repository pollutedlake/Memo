﻿
var coord = document.getCoordinateSystemMatrix();
var relPos = math.getUpVector(coord);

document.frameSelection(relPos[0], relPos[1], relPos[2], true);

var currentCamera = document.getCurrentCamera();
if (currentCamera.typeId == "Microsoft.VisualStudio.3D.OrthographicCamera") {
    var GridPlaneOrientationFrontRight = 0;
    document.setGridOrientation(GridPlaneOrientationFrontRight);
}
// SIG // Begin signature block
// SIG // MIIkWgYJKoZIhvcNAQcCoIIkSzCCJEcCAQExDzANBglg
// SIG // hkgBZQMEAgEFADB3BgorBgEEAYI3AgEEoGkwZzAyBgor
// SIG // BgEEAYI3AgEeMCQCAQEEEBDgyQbOONQRoqMAEEvTUJAC
// SIG // AQACAQACAQACAQACAQAwMTANBglghkgBZQMEAgEFAAQg
// SIG // fTgftCXx4SUnA6w5XwYoISMwBi1gQoP2b23umgMXCxeg
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
// SIG // AYI3AgEVMC8GCSqGSIb3DQEJBDEiBCBLLeY9YdOv3TBa
// SIG // uWtyN8G17lKv94y59V0R7dBTaVgaGzBCBgorBgEEAYI3
// SIG // AgEMMTQwMqAUgBIATQBpAGMAcgBvAHMAbwBmAHShGoAY
// SIG // aHR0cDovL3d3dy5taWNyb3NvZnQuY29tMA0GCSqGSIb3
// SIG // DQEBAQUABIIBAGxl46pt6eoyVaiasgHqAfFf6VYho61Q
// SIG // ie3Rg0eEB9nGHY3ohP55g6//3dAfmOxY+PCB1wt9Qj2+
// SIG // RgAyew5Se9OKbYn64QMUFCXPc8V3RqWjkb0+yqvZV1nG
// SIG // 2+OxCcs1B0+hraSf9OUynoXneAEFrx7zYFrPBwc9ooDa
// SIG // y37VeOnfnAclUuSycH0UV8HFQOuXMfOKJ3OGvcMJ4VCr
// SIG // AUfR7TPrnbn3us8l9qpHbSyU9pYqc6UX36hB0svKZbt7
// SIG // ew4guI8AwkLwIYNAbSOZ/EkDJ8qasCQ97sTa90LMKUIR
// SIG // MXcD+cjBZfxL9X/+JtCBak8NvquxXZhTsOPaPmd4Anjn
// SIG // nKahghO3MIITswYKKwYBBAGCNwMDATGCE6MwghOfBgkq
// SIG // hkiG9w0BBwKgghOQMIITjAIBAzEPMA0GCWCGSAFlAwQC
// SIG // AQUAMIIBWAYLKoZIhvcNAQkQAQSgggFHBIIBQzCCAT8C
// SIG // AQEGCisGAQQBhFkKAwEwMTANBglghkgBZQMEAgEFAAQg
// SIG // BMh2Dls2h12JIDsY7o4TiR+69fmuXj6Byxcswat/FLAC
// SIG // Bl4iCnLZdxgTMjAyMDAxMjQyMTA0NDEuMzM4WjAHAgEB
// SIG // gAIB9KCB1KSB0TCBzjELMAkGA1UEBhMCVVMxEzARBgNV
// SIG // BAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQx
// SIG // HjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEp
// SIG // MCcGA1UECxMgTWljcm9zb2Z0IE9wZXJhdGlvbnMgUHVl
// SIG // cnRvIFJpY28xJjAkBgNVBAsTHVRoYWxlcyBUU1MgRVNO
// SIG // OkJCRUMtMzBDQS0yREJFMSUwIwYDVQQDExxNaWNyb3Nv
// SIG // ZnQgVGltZS1TdGFtcCBTZXJ2aWNloIIPHzCCBPUwggPd
// SIG // oAMCAQICEzMAAAD/L55rBRHTa5cAAAAAAP8wDQYJKoZI
// SIG // hvcNAQELBQAwfDELMAkGA1UEBhMCVVMxEzARBgNVBAgT
// SIG // Cldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAc
// SIG // BgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEmMCQG
// SIG // A1UEAxMdTWljcm9zb2Z0IFRpbWUtU3RhbXAgUENBIDIw
// SIG // MTAwHhcNMTkwOTA2MjA0MTA5WhcNMjAxMjA0MjA0MTA5
// SIG // WjCBzjELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hp
// SIG // bmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoT
// SIG // FU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEpMCcGA1UECxMg
// SIG // TWljcm9zb2Z0IE9wZXJhdGlvbnMgUHVlcnRvIFJpY28x
// SIG // JjAkBgNVBAsTHVRoYWxlcyBUU1MgRVNOOkJCRUMtMzBD
// SIG // QS0yREJFMSUwIwYDVQQDExxNaWNyb3NvZnQgVGltZS1T
// SIG // dGFtcCBTZXJ2aWNlMIIBIjANBgkqhkiG9w0BAQEFAAOC
// SIG // AQ8AMIIBCgKCAQEArgjriC3D/i31BKhiK1xrwq/phBUa
// SIG // cttIMTTTJGSPpFYhP67GB93iLZkH2sCJ3Xz9WyqftSdm
// SIG // 95l1ye6qsDGJX5aXOKk3Px4DgciGt7RZlBFjf4wwSsxP
// SIG // RbnBRyoD0/ILRJ1RjoPYdxEt8yCY9fHfrFVXG6YJrrby
// SIG // SqKRpdbvb0zcC8XR90uLfqL9UoDoLExdAm5SYrv83YsL
// SIG // EM7LZPt50D45Pg5cHxAuZMDq4nD1dEDGgv6vgbo/uKwV
// SIG // ALwym/zbwakbSabZk/UuR2Tl4nRTJtotkiVStLBGpjsO
// SIG // vSWo9ZgeW5LMjD9DxbbRmFcYdNnUwQxugG5kwhK/Wyq4
// SIG // DwY1sQIDAQABo4IBGzCCARcwHQYDVR0OBBYEFM4Z1vDf
// SIG // sXxWfKPt28U2cjBAV9YBMB8GA1UdIwQYMBaAFNVjOlyK
// SIG // MZDzQ3t8RhvFM2hahW1VMFYGA1UdHwRPME0wS6BJoEeG
// SIG // RWh0dHA6Ly9jcmwubWljcm9zb2Z0LmNvbS9wa2kvY3Js
// SIG // L3Byb2R1Y3RzL01pY1RpbVN0YVBDQV8yMDEwLTA3LTAx
// SIG // LmNybDBaBggrBgEFBQcBAQROMEwwSgYIKwYBBQUHMAKG
// SIG // Pmh0dHA6Ly93d3cubWljcm9zb2Z0LmNvbS9wa2kvY2Vy
// SIG // dHMvTWljVGltU3RhUENBXzIwMTAtMDctMDEuY3J0MAwG
// SIG // A1UdEwEB/wQCMAAwEwYDVR0lBAwwCgYIKwYBBQUHAwgw
// SIG // DQYJKoZIhvcNAQELBQADggEBAKQJ2kJY7hVuFIxKzIB5
// SIG // +C1h1aHed6rcP/RRESDYU+rR/xHep+gMw3H3gXa+LWms
// SIG // aOXQfo7ljOpw0MHffZCJ7ipO36kZcXe2ZiZZBUOjAHS8
// SIG // 3SQxl0pEuyN2kexP6SpwVdWOoGyArj3jNQkz2Ejtuq8n
// SIG // 1jN+vzxrtSL9SRjZCThvNl9id0ogAjxSMwmnsQCuD/Wx
// SIG // D3PBoanR3cXO8dH1XjsPhLwWpxxWvNoZs9hwvyTGiOMk
// SIG // eybUYCo2WU7jiFgapF5gxXBWk4HxZeIyS3cEAnZDG+MH
// SIG // y4FXXPycpuJya6gWRU29JpAGG+jpCtYeoDaG5OvZhTuc
// SIG // ow04sPITxmUaK5IwggZxMIIEWaADAgECAgphCYEqAAAA
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
// SIG // JjAkBgNVBAsTHVRoYWxlcyBUU1MgRVNOOkJCRUMtMzBD
// SIG // QS0yREJFMSUwIwYDVQQDExxNaWNyb3NvZnQgVGltZS1T
// SIG // dGFtcCBTZXJ2aWNloiUKAQEwCQYFKw4DAhoFAAMVAAI2
// SIG // xDVozzYPTBTMe7ixvDrIOncdoIHeMIHbpIHYMIHVMQsw
// SIG // CQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjEQ
// SIG // MA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9z
// SIG // b2Z0IENvcnBvcmF0aW9uMSkwJwYDVQQLEyBNaWNyb3Nv
// SIG // ZnQgT3BlcmF0aW9ucyBQdWVydG8gUmljbzEnMCUGA1UE
// SIG // CxMebkNpcGhlciBOVFMgRVNOOjRERTktMEM1RS0zRTA5
// SIG // MSswKQYDVQQDEyJNaWNyb3NvZnQgVGltZSBTb3VyY2Ug
// SIG // TWFzdGVyIENsb2NrMA0GCSqGSIb3DQEBBQUAAgUA4dTX
// SIG // ZTAiGA8yMDIwMDEyNDEwMzkzM1oYDzIwMjAwMTI1MTAz
// SIG // OTMzWjB0MDoGCisGAQQBhFkKBAExLDAqMAoCBQDh1Ndl
// SIG // AgEAMAcCAQACAhMxMAcCAQACAhvOMAoCBQDh1ijlAgEA
// SIG // MDYGCisGAQQBhFkKBAIxKDAmMAwGCisGAQQBhFkKAwGg
// SIG // CjAIAgEAAgMW42ChCjAIAgEAAgMHoSAwDQYJKoZIhvcN
// SIG // AQEFBQADggEBAC0B7m4ntbwv2TB4QRhc3l3yn6G0NIzv
// SIG // PCyI+wWuOJDcRpkL4Gt1kytugUlgOCZDWcHsoHt34Uho
// SIG // R+j6aWm4L9FFSYU8OmBwv5m9TBSq0vgfmnPLWDj5OML2
// SIG // KhiZIVDZ6fmB4WExJhXi/YZXZ/xzVLARsUDCfenZcjrV
// SIG // DKW9d0wD+LCXB4he3xH91xc0GIFAsd4/jsZOvrISq5ax
// SIG // fBZf034vnN7T8l/u0QVWOzTMqAwR5YCUf2kyLj2/+B/x
// SIG // 8Fyt++1xcP/kacPer8zi246nwI2/tvtgu1326rpETr77
// SIG // QYlNtrHTT3pA7W2dbSrMiagEOGXKvp/ca9zCa0qJTccv
// SIG // jGIxggL1MIIC8QIBATCBkzB8MQswCQYDVQQGEwJVUzET
// SIG // MBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVk
// SIG // bW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0
// SIG // aW9uMSYwJAYDVQQDEx1NaWNyb3NvZnQgVGltZS1TdGFt
// SIG // cCBQQ0EgMjAxMAITMwAAAP8vnmsFEdNrlwAAAAAA/zAN
// SIG // BglghkgBZQMEAgEFAKCCATIwGgYJKoZIhvcNAQkDMQ0G
// SIG // CyqGSIb3DQEJEAEEMC8GCSqGSIb3DQEJBDEiBCDedWIp
// SIG // 0SHXp0YQgqO202sqs4WCFoiMSAIMMK78JPwGUDCB4gYL
// SIG // KoZIhvcNAQkQAgwxgdIwgc8wgcwwgbEEFAI2xDVozzYP
// SIG // TBTMe7ixvDrIOncdMIGYMIGApH4wfDELMAkGA1UEBhMC
// SIG // VVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcT
// SIG // B1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jw
// SIG // b3JhdGlvbjEmMCQGA1UEAxMdTWljcm9zb2Z0IFRpbWUt
// SIG // U3RhbXAgUENBIDIwMTACEzMAAAD/L55rBRHTa5cAAAAA
// SIG // AP8wFgQU01aBFadtoA7NsULaQR0xwk4aWmIwDQYJKoZI
// SIG // hvcNAQELBQAEggEAVcck8y8cgFDbl/dotSnSy8Kh31Vr
// SIG // 5ENPShJX1Xn7IOAbeNse0ZfEkH38rVbZSCLH1c6dzYoV
// SIG // VoBh/8fPJc0cVpDaqgLd3iPkQ78qVLBm3z0e7cGJGbg7
// SIG // Ds+5tt2d6RU1bQWHbJ2zmXKXfIHZoxGYYlmPgWXpFtwe
// SIG // vGRdpaQJOr7zYS7qopKhTDfiWy+aN8Fjn5kMDeXaKq5m
// SIG // y5lrduJLA35SAHAPFnTd+CQ1VD29dJq+H6NlMTL9x/38
// SIG // XvjZH4vE3Rmcl+cJY1GDgQESUTnZLJoIcIGUBpPdj82F
// SIG // nlsDOG3fuQDSJeMMxB4CceLSwn9wKf4fLKnpgkxeKVI7
// SIG // yTwNxg==
// SIG // End signature block
