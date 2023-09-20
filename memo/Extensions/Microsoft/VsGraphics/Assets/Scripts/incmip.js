﻿
// get the main canvas element
var canvasElement = document.elements.getElement("Microsoft.VisualStudio.Canvas");

// get total mip levels and current mip level
var totalLevels = canvasElement.getTrait("Total Mip Levels").value;
var currentLevel = canvasElement.getTrait("Current Mip Level").value;

// totalLevels better be 1 but just in case it is zero....
if (totalLevels == 0) totalLevels = 1;

// adjust current level, capping at 0
if (currentLevel > 0) {
    currentLevel--;
}
else {
    currentLevel = 0;
}

// save the new current level
document.setCurrentMipLevel(currentLevel);

// make sure to redraw
document.invalidateFrame();



// SIG // Begin signature block
// SIG // MIIjhwYJKoZIhvcNAQcCoIIjeDCCI3QCAQExDzANBglg
// SIG // hkgBZQMEAgEFADB3BgorBgEEAYI3AgEEoGkwZzAyBgor
// SIG // BgEEAYI3AgEeMCQCAQEEEBDgyQbOONQRoqMAEEvTUJAC
// SIG // AQACAQACAQACAQACAQAwMTANBglghkgBZQMEAgEFAAQg
// SIG // mvpvARZCM5jEPccyAip8ltmaKNSBnZlAhdD19oDlQQCg
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
// SIG // AYI3AgEVMC8GCSqGSIb3DQEJBDEiBCDfqiIvRb2OsTN2
// SIG // fEH9JEl9svp6sAxKUaiC3sml969bdTBCBgorBgEEAYI3
// SIG // AgEMMTQwMqAUgBIATQBpAGMAcgBvAHMAbwBmAHShGoAY
// SIG // aHR0cDovL3d3dy5taWNyb3NvZnQuY29tMA0GCSqGSIb3
// SIG // DQEBAQUABIIBAFzN1P7q9NoRxgOqZ8f1Yu8i3p6CQ67F
// SIG // 8AOGC/kO+cyn7SYBJ84YYVlt+RinDoGfDA2xFC67tPlv
// SIG // JK2zBWbD0uUH6oW4jJfGDjjhx/9w1YuWLeT1Mww/MbEY
// SIG // iz7ajsbdmxdngHqw2C/Z9MmpnB87OWXmRzKl+eNthlDL
// SIG // L9ZBMN+k98NSmb1OPHg7dgNb2AZsmMU88myBP4XHdUvd
// SIG // OgYe8Xkkix6vrSBonzGcgbDUmo9Fa8uSLj7MFzbqOuqr
// SIG // H3idc8W74MaWAm9VKLzQ8mhNvgvG8oCjObmM2GPlsCa3
// SIG // VDBvLPgHBXjywgzDp9xCUmWFcr9qovmacLEyQknkJNe9
// SIG // dSahghLkMIIS4AYKKwYBBAGCNwMDATGCEtAwghLMBgkq
// SIG // hkiG9w0BBwKgghK9MIISuQIBAzEPMA0GCWCGSAFlAwQC
// SIG // AQUAMIIBUAYLKoZIhvcNAQkQAQSgggE/BIIBOzCCATcC
// SIG // AQEGCisGAQQBhFkKAwEwMTANBglghkgBZQMEAgEFAAQg
// SIG // t0oclAmFkwwN/iflx+rNgVj5OJJ+mLSfAj88xk7fz/cC
// SIG // Bl4qDSI+OxgSMjAyMDAxMjQyMTA0NDMuNDJaMASAAgH0
// SIG // oIHQpIHNMIHKMQswCQYDVQQGEwJVUzETMBEGA1UECBMK
// SIG // V2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwG
// SIG // A1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMSUwIwYD
// SIG // VQQLExxNaWNyb3NvZnQgQW1lcmljYSBPcGVyYXRpb25z
// SIG // MSYwJAYDVQQLEx1UaGFsZXMgVFNTIEVTTjoxQThGLUUz
// SIG // QzMtRDY5RDElMCMGA1UEAxMcTWljcm9zb2Z0IFRpbWUt
// SIG // U3RhbXAgU2VydmljZaCCDjwwggTxMIID2aADAgECAhMz
// SIG // AAABG+IgzdyKr4vZAAAAAAEbMA0GCSqGSIb3DQEBCwUA
// SIG // MHwxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5n
// SIG // dG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVN
// SIG // aWNyb3NvZnQgQ29ycG9yYXRpb24xJjAkBgNVBAMTHU1p
// SIG // Y3Jvc29mdCBUaW1lLVN0YW1wIFBDQSAyMDEwMB4XDTE5
// SIG // MTExMzIxNDAzOFoXDTIxMDIxMTIxNDAzOFowgcoxCzAJ
// SIG // BgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAw
// SIG // DgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3Nv
// SIG // ZnQgQ29ycG9yYXRpb24xJTAjBgNVBAsTHE1pY3Jvc29m
// SIG // dCBBbWVyaWNhIE9wZXJhdGlvbnMxJjAkBgNVBAsTHVRo
// SIG // YWxlcyBUU1MgRVNOOjFBOEYtRTNDMy1ENjlEMSUwIwYD
// SIG // VQQDExxNaWNyb3NvZnQgVGltZS1TdGFtcCBTZXJ2aWNl
// SIG // MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA
// SIG // lYPnftgJcrLXnTYwYfN0LYMdLhjoGXYd8nHWa1rTxh8q
// SIG // zVlCrSHfByTm6G43p3uqdI2meGJrnizB1iMtWRnn+Y+g
// SIG // YMgAcUytVahJTrqlLTMf3y43rhcCa4oDtctg7ASraXaC
// SIG // lx27FMGylrJ1BOehlgv3kFmAWrjLQ8oRzLXs3HC5iP8B
// SIG // PXOjnANKbiZVooUBTktY4rN7xXdWvj/Icwgf5nxaDqOz
// SIG // bqTIlVVZr+XONbXMXkHEbrTtmp6li5iwg/2JjNgb3K9g
// SIG // +2gjnLY3W/j+NA4EDX4jrqISaIKiaEPUVTNPMuLj7JVB
// SIG // 7UXtLGwYGt26O1DZHeKDErd61VFMt1ManQIDAQABo4IB
// SIG // GzCCARcwHQYDVR0OBBYEFBrlk8pCa7yC3Ccd1pNo2Q8u
// SIG // wRr5MB8GA1UdIwQYMBaAFNVjOlyKMZDzQ3t8RhvFM2ha
// SIG // hW1VMFYGA1UdHwRPME0wS6BJoEeGRWh0dHA6Ly9jcmwu
// SIG // bWljcm9zb2Z0LmNvbS9wa2kvY3JsL3Byb2R1Y3RzL01p
// SIG // Y1RpbVN0YVBDQV8yMDEwLTA3LTAxLmNybDBaBggrBgEF
// SIG // BQcBAQROMEwwSgYIKwYBBQUHMAKGPmh0dHA6Ly93d3cu
// SIG // bWljcm9zb2Z0LmNvbS9wa2kvY2VydHMvTWljVGltU3Rh
// SIG // UENBXzIwMTAtMDctMDEuY3J0MAwGA1UdEwEB/wQCMAAw
// SIG // EwYDVR0lBAwwCgYIKwYBBQUHAwgwDQYJKoZIhvcNAQEL
// SIG // BQADggEBAFw19IRnpZACw6p+kcoxyfWZNQE/F1D4IZyI
// SIG // DCHvEPiTTRJgw+DZqMy9elGjQisWrXsT441XnAv3XXsu
// SIG // WcZObKSv5KO75aqRiCGrv8/IYYPzfcPbKixHDddScaCX
// SIG // awL0oW4AShZx3YLfU8TVkAkKQWz30Te/f+x3FdsE4rW/
// SIG // EYkQDLoux3W7lbcOJW4S4JsGBIFm5Qumml9m3buhgsUT
// SIG // fBfCYGEbtdU9Gf2l/KvW6vX3e39w694zQsRrXkTwSaHo
// SIG // A/uvfYhZq/31hUaY6bMYt+bdqdc+yQCGwECTf6WZi0z+
// SIG // 4UYlwDaPCGfnjx4P+y9m6Hst7LmCsIe4X/UbHs8v9www
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
// SIG // IFRTUyBFU046MUE4Ri1FM0MzLUQ2OUQxJTAjBgNVBAMT
// SIG // HE1pY3Jvc29mdCBUaW1lLVN0YW1wIFNlcnZpY2WiIwoB
// SIG // ATAHBgUrDgMCGgMVAJ4Pq+8iqLeMzXj4lUks5CQ7nFTG
// SIG // oIGDMIGApH4wfDELMAkGA1UEBhMCVVMxEzARBgNVBAgT
// SIG // Cldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAc
// SIG // BgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEmMCQG
// SIG // A1UEAxMdTWljcm9zb2Z0IFRpbWUtU3RhbXAgUENBIDIw
// SIG // MTAwDQYJKoZIhvcNAQEFBQACBQDh1TReMCIYDzIwMjAw
// SIG // MTI0MTcxNjE0WhgPMjAyMDAxMjUxNzE2MTRaMHcwPQYK
// SIG // KwYBBAGEWQoEATEvMC0wCgIFAOHVNF4CAQAwCgIBAAIC
// SIG // IjsCAf8wBwIBAAICEeowCgIFAOHWhd4CAQAwNgYKKwYB
// SIG // BAGEWQoEAjEoMCYwDAYKKwYBBAGEWQoDAqAKMAgCAQAC
// SIG // AwehIKEKMAgCAQACAwGGoDANBgkqhkiG9w0BAQUFAAOB
// SIG // gQBpPzgncZXQOQ0Ds7ckNQcfnwCTRZjD5iDBJs5OxXIj
// SIG // Bvd0I4n0zw6duMsGUg9cNoRHe+m283W8fitx75WLXMnE
// SIG // g0wfQD1CWyYovVndGUR5bOo8QFoSNfnGxD/uMiz7nHWS
// SIG // lheGKWH0gB2mLKvQaBeVqq5i+1xkkki7ChJa6rulnTGC
// SIG // Aw0wggMJAgEBMIGTMHwxCzAJBgNVBAYTAlVTMRMwEQYD
// SIG // VQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25k
// SIG // MR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24x
// SIG // JjAkBgNVBAMTHU1pY3Jvc29mdCBUaW1lLVN0YW1wIFBD
// SIG // QSAyMDEwAhMzAAABG+IgzdyKr4vZAAAAAAEbMA0GCWCG
// SIG // SAFlAwQCAQUAoIIBSjAaBgkqhkiG9w0BCQMxDQYLKoZI
// SIG // hvcNAQkQAQQwLwYJKoZIhvcNAQkEMSIEIFALFGmciHSi
// SIG // 6IO0+XVYKC9FZzSx5OxLXRThuZ2sugLaMIH6BgsqhkiG
// SIG // 9w0BCRACLzGB6jCB5zCB5DCBvQQg4JFt8aLEcWZTbJSv
// SIG // 9NN8rWqnlSn5A+2N9Bw2imkr23cwgZgwgYCkfjB8MQsw
// SIG // CQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjEQ
// SIG // MA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9z
// SIG // b2Z0IENvcnBvcmF0aW9uMSYwJAYDVQQDEx1NaWNyb3Nv
// SIG // ZnQgVGltZS1TdGFtcCBQQ0EgMjAxMAITMwAAARviIM3c
// SIG // iq+L2QAAAAABGzAiBCCx4uYuLFwf0T6aj4LwCntwlWX3
// SIG // AwcTaZ2QAS7t0nl8fzANBgkqhkiG9w0BAQsFAASCAQAe
// SIG // Vn8vuv9v+Mee7ySowgGmGxMO6OzmAXU9Pqm4IwDlrDAV
// SIG // cFzVv9KHUahKk8hTsxTbYa8yUIrmV7wDuBwa9CnahhBb
// SIG // zidrR/fYOlJjNGXCdNuO095SMUi/9sJCb+Mt4ovZ0uVv
// SIG // hYtRk9ytvk/OZwhNmUIZ6Yg8Drz9+2NDjoGZ0QrMOdDt
// SIG // WOqv4JT0XRJvu8MhPjHRIFdHxKQKcDGD1HpIAsV5Rz3v
// SIG // by4AhLzUAXq3ba7PIRL0OuEONqMlBiDds2MZkpfXLBjX
// SIG // w4jbOTWqIlHeShrHsGxghZ7vfIt5HNGThuiFFkARQfNX
// SIG // 2Mm6qdlBzzF/gbkFN7mmwjX3xKlcs3K8
// SIG // End signature block
