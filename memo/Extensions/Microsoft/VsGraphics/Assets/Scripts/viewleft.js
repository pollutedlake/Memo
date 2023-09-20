﻿var coord = document.getCoordinateSystemMatrix();
var relPos = math.getRightVector(coord);

document.frameSelection(relPos[0], relPos[1], relPos[2], true);

var currentCamera = document.getCurrentCamera();
if (currentCamera.typeId == "Microsoft.VisualStudio.3D.OrthographicCamera") {
    var GridPlaneOrientationTopFront = 1;
    document.setGridOrientation(GridPlaneOrientationTopFront);
}
// SIG // Begin signature block
// SIG // MIIjhwYJKoZIhvcNAQcCoIIjeDCCI3QCAQExDzANBglg
// SIG // hkgBZQMEAgEFADB3BgorBgEEAYI3AgEEoGkwZzAyBgor
// SIG // BgEEAYI3AgEeMCQCAQEEEBDgyQbOONQRoqMAEEvTUJAC
// SIG // AQACAQACAQACAQACAQAwMTANBglghkgBZQMEAgEFAAQg
// SIG // whNrmdsDpiA4T+g2C9xPrQJ2SKfi5F0b0lJd6JYx+M+g
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
// SIG // ghVaMIIVVgIBATCBlTB+MQswCQYDVQQGEwJVUzETMBEG
// SIG // A1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9u
// SIG // ZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9u
// SIG // MSgwJgYDVQQDEx9NaWNyb3NvZnQgQ29kZSBTaWduaW5n
// SIG // IFBDQSAyMDExAhMzAAABUptAn1BWmXWIAAAAAAFSMA0G
// SIG // CWCGSAFlAwQCAQUAoIGuMBkGCSqGSIb3DQEJAzEMBgor
// SIG // BgEEAYI3AgEEMBwGCisGAQQBgjcCAQsxDjAMBgorBgEE
// SIG // AYI3AgEVMC8GCSqGSIb3DQEJBDEiBCAvA3U6SqF4PBGc
// SIG // YE57UQU9NTu6o9o6g1GKNLIY5giI2TBCBgorBgEEAYI3
// SIG // AgEMMTQwMqAUgBIATQBpAGMAcgBvAHMAbwBmAHShGoAY
// SIG // aHR0cDovL3d3dy5taWNyb3NvZnQuY29tMA0GCSqGSIb3
// SIG // DQEBAQUABIIBAHsadvjTsWtTnrKZqOC7g3NA5sZUcq2f
// SIG // 8eS95yO7Pz9Zfbu0qcvxw1hCLlaop/EEXIPtYqS9ztIY
// SIG // ySTRwZaMPCkJ/AJ2lB7w6GeLrgy//bzy+Lzb6/rne1V+
// SIG // Ki9w5GlAOz537ydfsPWXEOp7Hli5pU7RyxdpZC2lE0vY
// SIG // yzgVG3TRnkKng390vJyfxGqBgmzeIYJQZuADXK2tTfwl
// SIG // z05O3tAEhkjTevAfl50mZzm6LBrliM8xfXodyyhp5f/t
// SIG // iUrSxTkx1sVgs2WUUEZy9bXhy1PgCG7vmul1GSwRPBWK
// SIG // nYm+o7guwu4G0c1JmuLR3kSuuL1nYs5E7g1PQ3Z4tVN6
// SIG // 0SOhghLkMIIS4AYKKwYBBAGCNwMDATGCEtAwghLMBgkq
// SIG // hkiG9w0BBwKgghK9MIISuQIBAzEPMA0GCWCGSAFlAwQC
// SIG // AQUAMIIBUAYLKoZIhvcNAQkQAQSgggE/BIIBOzCCATcC
// SIG // AQEGCisGAQQBhFkKAwEwMTANBglghkgBZQMEAgEFAAQg
// SIG // qaPbBtjoTdd/u94TJUtAxYzcU1rViPMpCVnbz5ww/QQC
// SIG // Bl4qDAvG1xgSMjAyMDAxMjQyMTA0NDQuMDVaMASAAgH0
// SIG // oIHQpIHNMIHKMQswCQYDVQQGEwJVUzETMBEGA1UECBMK
// SIG // V2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwG
// SIG // A1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMSUwIwYD
// SIG // VQQLExxNaWNyb3NvZnQgQW1lcmljYSBPcGVyYXRpb25z
// SIG // MSYwJAYDVQQLEx1UaGFsZXMgVFNTIEVTTjpFQUNFLUUz
// SIG // MTYtQzkxRDElMCMGA1UEAxMcTWljcm9zb2Z0IFRpbWUt
// SIG // U3RhbXAgU2VydmljZaCCDjwwggTxMIID2aADAgECAhMz
// SIG // AAABGrGyX3zHCs0qAAAAAAEaMA0GCSqGSIb3DQEBCwUA
// SIG // MHwxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5n
// SIG // dG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVN
// SIG // aWNyb3NvZnQgQ29ycG9yYXRpb24xJjAkBgNVBAMTHU1p
// SIG // Y3Jvc29mdCBUaW1lLVN0YW1wIFBDQSAyMDEwMB4XDTE5
// SIG // MTExMzIxNDAzN1oXDTIxMDIxMTIxNDAzN1owgcoxCzAJ
// SIG // BgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAw
// SIG // DgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3Nv
// SIG // ZnQgQ29ycG9yYXRpb24xJTAjBgNVBAsTHE1pY3Jvc29m
// SIG // dCBBbWVyaWNhIE9wZXJhdGlvbnMxJjAkBgNVBAsTHVRo
// SIG // YWxlcyBUU1MgRVNOOkVBQ0UtRTMxNi1DOTFEMSUwIwYD
// SIG // VQQDExxNaWNyb3NvZnQgVGltZS1TdGFtcCBTZXJ2aWNl
// SIG // MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA
// SIG // nvl0EF1URiyXWLesOEE1ncMTtuYUCfHoZl16sVM94tiO
// SIG // OdgDWHSij6PDEOIqe7h5pMPkWs4Q9uztonPu4k3wRwlT
// SIG // dL/lTFaWm2ZEOCfEyf+FPgQquAnrJprg3sE/1dfO0K6s
// SIG // HhCeAQHAMoN/5RDhjMBYJbCJ8dDD+WmuTfAuIVM7tC91
// SIG // AeQ6GNyyuhQ9f4rENtVEatXpXbnlvZoeMSi+UM/M5X5D
// SIG // 24ok+r4yJuHTeppkJpLDm2PW+TXgjs1zMAEHrrxNeuRc
// SIG // eoPXnBIL2uhm1HcOAXsRvZ52/VtjwMVSB+mIbLX7Rcu3
// SIG // 1j8K2KvuJJXCW0hcqzwun+96k84mOYFHcQIDAQABo4IB
// SIG // GzCCARcwHQYDVR0OBBYEFOZ/F2lB7NiRlusURwRIHJ6z
// SIG // VDFqMB8GA1UdIwQYMBaAFNVjOlyKMZDzQ3t8RhvFM2ha
// SIG // hW1VMFYGA1UdHwRPME0wS6BJoEeGRWh0dHA6Ly9jcmwu
// SIG // bWljcm9zb2Z0LmNvbS9wa2kvY3JsL3Byb2R1Y3RzL01p
// SIG // Y1RpbVN0YVBDQV8yMDEwLTA3LTAxLmNybDBaBggrBgEF
// SIG // BQcBAQROMEwwSgYIKwYBBQUHMAKGPmh0dHA6Ly93d3cu
// SIG // bWljcm9zb2Z0LmNvbS9wa2kvY2VydHMvTWljVGltU3Rh
// SIG // UENBXzIwMTAtMDctMDEuY3J0MAwGA1UdEwEB/wQCMAAw
// SIG // EwYDVR0lBAwwCgYIKwYBBQUHAwgwDQYJKoZIhvcNAQEL
// SIG // BQADggEBAKeDmpN7bXANJNIKV6a00hhpL2w3UR97L6rM
// SIG // h/TFI9YmTmLTM0S30O4Sv+mZQ+y/ixs9UrrtbgtaFLRw
// SIG // ESXsdAzF0l/bFR0l6nEeht3sbqTv/YUpVNWsC5zeByG9
// SIG // 2MfOEpS+c2fjmioOv6ESo/iK6tJK3+z0JibbV56PJIQA
// SIG // ajTY2XBRTJkg17V+KI8v5sW+g/rBArondS36OrdJIWJb
// SIG // 1cohlCsgTESIs5R5UVAQ0vw9oJ5a7QwDx+5knIsTENoj
// SIG // pstto3bhnhQvj+hOp9xxOo5y3OoRM46BGgi1NH9Z74+T
// SIG // ZqKXu2MmxIAKtB3RqxZFaq855L/NfdWugR3+y3NhQKow
// SIG // ggZxMIIEWaADAgECAgphCYEqAAAAAAACMA0GCSqGSIb3
// SIG // DQEBCwUAMIGIMQswCQYDVQQGEwJVUzETMBEGA1UECBMK
// SIG // V2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwG
// SIG // A1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMTIwMAYD
// SIG // VQQDEylNaWNyb3NvZnQgUm9vdCBDZXJ0aWZpY2F0ZSBB
// SIG // dXRob3JpdHkgMjAxMDAeFw0xMDA3MDEyMTM2NTVaFw0y
// SIG // NTA3MDEyMTQ2NTVaMHwxCzAJBgNVBAYTAlVTMRMwEQYD
// SIG // VQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25k
// SIG // MR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24x
// SIG // JjAkBgNVBAMTHU1pY3Jvc29mdCBUaW1lLVN0YW1wIFBD
// SIG // QSAyMDEwMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIB
// SIG // CgKCAQEAqR0NvHcRijog7PwTl/X6f2mUa3RUENWlCgCC
// SIG // hfvtfGhLLF/Fw+Vhwna3PmYrW/AVUycEMR9BGxqVHc4J
// SIG // E458YTBZsTBED/FgiIRUQwzXTbg4CLNC3ZOs1nMwVyaC
// SIG // o0UN0Or1R4HNvyRgMlhgRvJYR4YyhB50YWeRX4FUsc+T
// SIG // TJLBxKZd0WETbijGGvmGgLvfYfxGwScdJGcSchohiq9L
// SIG // ZIlQYrFd/XcfPfBXday9ikJNQFHRD5wGPmd/9WbAA5ZE
// SIG // fu/QS/1u5ZrKsajyeioKMfDaTgaRtogINeh4HLDpmc08
// SIG // 5y9Euqf03GS9pAHBIAmTeM38vMDJRF1eFpwBBU8iTQID
// SIG // AQABo4IB5jCCAeIwEAYJKwYBBAGCNxUBBAMCAQAwHQYD
// SIG // VR0OBBYEFNVjOlyKMZDzQ3t8RhvFM2hahW1VMBkGCSsG
// SIG // AQQBgjcUAgQMHgoAUwB1AGIAQwBBMAsGA1UdDwQEAwIB
// SIG // hjAPBgNVHRMBAf8EBTADAQH/MB8GA1UdIwQYMBaAFNX2
// SIG // VsuP6KJcYmjRPZSQW9fOmhjEMFYGA1UdHwRPME0wS6BJ
// SIG // oEeGRWh0dHA6Ly9jcmwubWljcm9zb2Z0LmNvbS9wa2kv
// SIG // Y3JsL3Byb2R1Y3RzL01pY1Jvb0NlckF1dF8yMDEwLTA2
// SIG // LTIzLmNybDBaBggrBgEFBQcBAQROMEwwSgYIKwYBBQUH
// SIG // MAKGPmh0dHA6Ly93d3cubWljcm9zb2Z0LmNvbS9wa2kv
// SIG // Y2VydHMvTWljUm9vQ2VyQXV0XzIwMTAtMDYtMjMuY3J0
// SIG // MIGgBgNVHSABAf8EgZUwgZIwgY8GCSsGAQQBgjcuAzCB
// SIG // gTA9BggrBgEFBQcCARYxaHR0cDovL3d3dy5taWNyb3Nv
// SIG // ZnQuY29tL1BLSS9kb2NzL0NQUy9kZWZhdWx0Lmh0bTBA
// SIG // BggrBgEFBQcCAjA0HjIgHQBMAGUAZwBhAGwAXwBQAG8A
// SIG // bABpAGMAeQBfAFMAdABhAHQAZQBtAGUAbgB0AC4gHTAN
// SIG // BgkqhkiG9w0BAQsFAAOCAgEAB+aIUQ3ixuCYP4FxAz2d
// SIG // o6Ehb7Prpsz1Mb7PBeKp/vpXbRkws8LFZslq3/Xn8Hi9
// SIG // x6ieJeP5vO1rVFcIK1GCRBL7uVOMzPRgEop2zEBAQZvc
// SIG // XBf/XPleFzWYJFZLdO9CEMivv3/Gf/I3fVo/HPKZeUqR
// SIG // UgCvOA8X9S95gWXZqbVr5MfO9sp6AG9LMEQkIjzP7QOl
// SIG // lo9ZKby2/QThcJ8ySif9Va8v/rbljjO7Yl+a21dA6fHO
// SIG // mWaQjP9qYn/dxUoLkSbiOewZSnFjnXshbcOco6I8+n99
// SIG // lmqQeKZt0uGc+R38ONiU9MalCpaGpL2eGq4EQoO4tYCb
// SIG // IjggtSXlZOz39L9+Y1klD3ouOVd2onGqBooPiRa6YacR
// SIG // y5rYDkeagMXQzafQ732D8OE7cQnfXXSYIghh2rBQHm+9
// SIG // 8eEA3+cxB6STOvdlR3jo+KhIq/fecn5ha293qYHLpwms
// SIG // ObvsxsvYgrRyzR30uIUBHoD7G4kqVDmyW9rIDVWZeodz
// SIG // OwjmmC3qjeAzLhIp9cAvVCch98isTtoouLGp25ayp0Ki
// SIG // yc8ZQU3ghvkqmqMRZjDTu3QyS99je/WZii8bxyGvWbWu
// SIG // 3EQ8l1Bx16HSxVXjad5XwdHeMMD9zOZN+w2/XU/pnR4Z
// SIG // OC+8z1gFLu8NoFA12u8JJxzVs341Hgi62jbb01+P3nSI
// SIG // SRKhggLOMIICNwIBATCB+KGB0KSBzTCByjELMAkGA1UE
// SIG // BhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNV
// SIG // BAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBD
// SIG // b3Jwb3JhdGlvbjElMCMGA1UECxMcTWljcm9zb2Z0IEFt
// SIG // ZXJpY2EgT3BlcmF0aW9uczEmMCQGA1UECxMdVGhhbGVz
// SIG // IFRTUyBFU046RUFDRS1FMzE2LUM5MUQxJTAjBgNVBAMT
// SIG // HE1pY3Jvc29mdCBUaW1lLVN0YW1wIFNlcnZpY2WiIwoB
// SIG // ATAHBgUrDgMCGgMVAHaytBk+NAhkzfZwpwDdIsy+qdTJ
// SIG // oIGDMIGApH4wfDELMAkGA1UEBhMCVVMxEzARBgNVBAgT
// SIG // Cldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAc
// SIG // BgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEmMCQG
// SIG // A1UEAxMdTWljcm9zb2Z0IFRpbWUtU3RhbXAgUENBIDIw
// SIG // MTAwDQYJKoZIhvcNAQEFBQACBQDh1TNJMCIYDzIwMjAw
// SIG // MTI0MTcxMTM3WhgPMjAyMDAxMjUxNzExMzdaMHcwPQYK
// SIG // KwYBBAGEWQoEATEvMC0wCgIFAOHVM0kCAQAwCgIBAAIC
// SIG // F/wCAf8wBwIBAAICEecwCgIFAOHWhMkCAQAwNgYKKwYB
// SIG // BAGEWQoEAjEoMCYwDAYKKwYBBAGEWQoDAqAKMAgCAQAC
// SIG // AwehIKEKMAgCAQACAwGGoDANBgkqhkiG9w0BAQUFAAOB
// SIG // gQA8ZpXheC1G57h98pSIY5/49kvbbcrnZhtLNPoeMBQf
// SIG // pOS8W0hmHuBf2JLCDieuKGt8JJU4NymqIPFmGlQN1uLX
// SIG // 8uhpMw3jZ9gWUsxmZ0AG4owpUblQaqkLUkunWA0SMhpx
// SIG // Fs8W2CazEG7ZjU2N6ocIxdHOTge6Lm8IacNfE98TSDGC
// SIG // Aw0wggMJAgEBMIGTMHwxCzAJBgNVBAYTAlVTMRMwEQYD
// SIG // VQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25k
// SIG // MR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24x
// SIG // JjAkBgNVBAMTHU1pY3Jvc29mdCBUaW1lLVN0YW1wIFBD
// SIG // QSAyMDEwAhMzAAABGrGyX3zHCs0qAAAAAAEaMA0GCWCG
// SIG // SAFlAwQCAQUAoIIBSjAaBgkqhkiG9w0BCQMxDQYLKoZI
// SIG // hvcNAQkQAQQwLwYJKoZIhvcNAQkEMSIEINMtK/h3GUp+
// SIG // MSYk0uCo/DMwzYbmSeCFdzOiShQTN7NsMIH6BgsqhkiG
// SIG // 9w0BCRACLzGB6jCB5zCB5DCBvQQgsWii3MI3S0Xg9jT3
// SIG // 8i6tT06ID8Xjg92BvPGIjd1LZOEwgZgwgYCkfjB8MQsw
// SIG // CQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjEQ
// SIG // MA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9z
// SIG // b2Z0IENvcnBvcmF0aW9uMSYwJAYDVQQDEx1NaWNyb3Nv
// SIG // ZnQgVGltZS1TdGFtcCBQQ0EgMjAxMAITMwAAARqxsl98
// SIG // xwrNKgAAAAABGjAiBCDuN/6BeqJ9xoxcOU99mqdTp8p7
// SIG // ZLKnSugqpNdXiojHJTANBgkqhkiG9w0BAQsFAASCAQBG
// SIG // 81sbhtjMZ2Rj/xYVE5ECpI8LGV4ktJbxsfZmLr9J16BP
// SIG // pJ2UXFQ5CYxnpw3jD597qjQxgvW0BKmssEJgoAdnWjKE
// SIG // pui4vV4lRT/0jySu+Rikx7pZ6rrcSGhSLIA33pOs9LDN
// SIG // L6mPSFNRbmM1tALftWG3BB63a6XiJiZ/S80krzhNfdOJ
// SIG // uXqPL0u/rcuCvyvtdXK2VcCLK+chLvKKik72PTu/jJK4
// SIG // 7UUT3i3vPh9+aLa9KQOTDKsVN9nVg9LfTvJd8jyaD13s
// SIG // yc9TAHaEKHo+903hppKlZwWdaUDQI0PvJhpGg8rVGY74
// SIG // Df0jBsf2tjkupoLrUDeoOzlncmguSs1R
// SIG // End signature block
