//
//  Copyright (c) Microsoft Corporation. All rights reserved.
//
'use strict';
GettingStartedDispatchObject.addEventListener("initialize", function (args) {
    var head = document.head;
    var script = document.createElement('script');
    var inlineScript = document.createTextNode(args.Script);
    script.appendChild(inlineScript);
    head.appendChild(script);
    document.body.innerHTML = args.Content;
    var _loop_1 = function (i) {
        var link = document.links[i];
        link.onclick = function () {
            welcomePageUtils.onClick(link.id, link.href);
            return false;
        };
    };
    // on click telemetry handlers
    for (var i = 0; i < document.links.length; i++) {
        _loop_1(i);
    }
    if (isSharing) {
        document.getElementById('step-share').style.display = 'none';
        document.getElementById('step-joined-Debug').style.display = 'none';
        document.getElementById('step-joined-Edit').style.display = 'none';
        document.getElementById('step-sign-in').style.display = 'none';
        document.getElementById('step-sign-in-before-share').style.display = 'none';
        document.getElementById('join-uri-copy-button').onclick = function () { return welcomePageUtils.copyLink(); };
    }
    else if (isJoinedAnonymously) {
        document.getElementById('step-share').style.display = 'none';
        document.getElementById('step-invite').style.display = 'none';
        document.getElementById('step-collaborate').style.display = 'none';
        document.getElementById('step-sign-in-before-share').style.display = 'none';
        document.getElementById('sign-in-button').onclick = function () { return welcomePageUtils.onSignInClick(); };
    }
    else if (isJoined) {
        document.getElementById('step-share').style.display = 'none';
        document.getElementById('step-invite').style.display = 'none';
        document.getElementById('step-collaborate').style.display = 'none';
        document.getElementById('step-sign-in').style.display = 'none';
        document.getElementById('step-sign-in-before-share').style.display = 'none';
    }
    else if (isShareButtonClickedFirstTimeAnonymously) {
        document.getElementById('join-uri').style.display = 'none';
        document.getElementById('join-uri-copy-button').style.display = 'none';
        document.getElementById('join-uri-box').style.display = 'none';
        document.getElementById('share-with-yourself-link').style.display = 'none';
        document.getElementById('step-joined-Debug').style.display = 'none';
        document.getElementById('step-joined-Edit').style.display = 'none';
        document.getElementById('step-sign-in').style.display = 'none';
        document.getElementById('sign-in-button-before-share').onclick = function () { return welcomePageUtils.onSignInClickBeforeShare(); };
    }
    else {
        document.getElementById('join-uri').style.display = 'none';
        document.getElementById('join-uri-copy-button').style.display = 'none';
        document.getElementById('join-uri-box').style.display = 'none';
        document.getElementById('share-with-yourself-link').style.display = 'none';
        document.getElementById('step-joined-Debug').style.display = 'none';
        document.getElementById('step-joined-Edit').style.display = 'none';
        document.getElementById('step-sign-in').style.display = 'none';
        document.getElementById('step-sign-in-before-share').style.display = 'none';
    }
});
var Message = /** @class */ (function () {
    function Message(type, description, action) {
        if (description === void 0) { description = null; }
        if (action === void 0) { action = null; }
        this.type = type;
        this.description = description;
        this.action = action;
    }
    return Message;
}());
var WelcomePageUtils = /** @class */ (function () {
    function WelcomePageUtils() {
        this.windowExternal = window.external;
    }
    Object.defineProperty(WelcomePageUtils, "Instance", {
        get: function () {
            if (!WelcomePageUtils.singleton) {
                WelcomePageUtils.singleton = new WelcomePageUtils();
            }
            return WelcomePageUtils.singleton;
        },
        enumerable: true,
        configurable: true
    });
    WelcomePageUtils.prototype.copyLink = function () {
        var message = new Message('copyUrl');
        if (GettingStartedDispatchObject) {
            GettingStartedDispatchObject.RaiseGettingStartedEvent(JSON.stringify(message));
        }
    };
    WelcomePageUtils.prototype.onClick = function (text, action) {
        var message = new Message('onClick', text, action);
        if (GettingStartedDispatchObject) {
            GettingStartedDispatchObject.RaiseGettingStartedEvent(JSON.stringify(message));
        }
    };
    WelcomePageUtils.prototype.onSignInClick = function () {
        var message = new Message('onSignInClick');
        if (GettingStartedDispatchObject) {
            GettingStartedDispatchObject.RaiseGettingStartedEvent(JSON.stringify(message));
        }
    };
    WelcomePageUtils.prototype.onSignInClickBeforeShare = function () {
        var message = new Message('onSignInClickBeforeShare');
        if (GettingStartedDispatchObject) {
            GettingStartedDispatchObject.RaiseGettingStartedEvent(JSON.stringify(message));
        }
    };
    return WelcomePageUtils;
}());
var welcomePageUtils = WelcomePageUtils.Instance;
// disable right-click
document.oncontextmenu = function () { return false; };
//# sourceMappingURL=gettingStarted.js.map
// SIG // Begin signature block
// SIG // MIIjgQYJKoZIhvcNAQcCoIIjcjCCI24CAQExDzANBglg
// SIG // hkgBZQMEAgEFADB3BgorBgEEAYI3AgEEoGkwZzAyBgor
// SIG // BgEEAYI3AgEeMCQCAQEEEBDgyQbOONQRoqMAEEvTUJAC
// SIG // AQACAQACAQACAQACAQAwMTANBglghkgBZQMEAgEFAAQg
// SIG // fwSwrXvCiOdwYa+cVsC+gezMWoOXz4TzrtN2qIPEmoig
// SIG // gg2BMIIF/zCCA+egAwIBAgITMwAAAVGejY9AcaMOQQAA
// SIG // AAABUTANBgkqhkiG9w0BAQsFADB+MQswCQYDVQQGEwJV
// SIG // UzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMH
// SIG // UmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBv
// SIG // cmF0aW9uMSgwJgYDVQQDEx9NaWNyb3NvZnQgQ29kZSBT
// SIG // aWduaW5nIFBDQSAyMDExMB4XDTE5MDUwMjIxMzc0NloX
// SIG // DTIwMDUwMjIxMzc0NlowdDELMAkGA1UEBhMCVVMxEzAR
// SIG // BgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1v
// SIG // bmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlv
// SIG // bjEeMBwGA1UEAxMVTWljcm9zb2Z0IENvcnBvcmF0aW9u
// SIG // MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA
// SIG // lVrGhmlHHTQe8VXDZnX2YlQYWBRnJ/CjKsYDSLzmVjR/
// SIG // SWEC7oR4ZieUViEstaHst807sai25BwHZm3lPDRTKOPT
// SIG // 7+9TICEvSBvxLasDh+7qWp/pSKujTnMOXzujrPtdkdEN
// SIG // vDMxp/t8uxdpig56KVbtLBLn8uOd4Mc9ejPGwMOPkF7r
// SIG // +/n0fVs0SdgqVOtsECmIhUDH3sOlYeX7j6F5aDd5OvkJ
// SIG // c+84HE+GEZsc8e4zFaT/7ryurGXAcUN1oAf1pMlx4MWm
// SIG // NfSAMy6tkIj4l9mK8okeRLGAat+QT+1NeQ5WbaUrNsCG
// SIG // E5JAwcYTySAyYKMGbuRsoR3aq7Ldzo5EkQIDAQABo4IB
// SIG // fjCCAXowHwYDVR0lBBgwFgYKKwYBBAGCN0wIAQYIKwYB
// SIG // BQUHAwMwHQYDVR0OBBYEFFeCGq5Kue3rGoLuhVAW9u9G
// SIG // Yo3PMFAGA1UdEQRJMEekRTBDMSkwJwYDVQQLEyBNaWNy
// SIG // b3NvZnQgT3BlcmF0aW9ucyBQdWVydG8gUmljbzEWMBQG
// SIG // A1UEBRMNMjMwMDEyKzQ1NDEzNTAfBgNVHSMEGDAWgBRI
// SIG // bmTlUAXTgqoXNzcitW2oynUClTBUBgNVHR8ETTBLMEmg
// SIG // R6BFhkNodHRwOi8vd3d3Lm1pY3Jvc29mdC5jb20vcGtp
// SIG // b3BzL2NybC9NaWNDb2RTaWdQQ0EyMDExXzIwMTEtMDct
// SIG // MDguY3JsMGEGCCsGAQUFBwEBBFUwUzBRBggrBgEFBQcw
// SIG // AoZFaHR0cDovL3d3dy5taWNyb3NvZnQuY29tL3BraW9w
// SIG // cy9jZXJ0cy9NaWNDb2RTaWdQQ0EyMDExXzIwMTEtMDct
// SIG // MDguY3J0MAwGA1UdEwEB/wQCMAAwDQYJKoZIhvcNAQEL
// SIG // BQADggIBAFoPgK0uAJ6uyq6ILJSEJ6DB0l1D6/0ajiIS
// SIG // V/t9jm7mNzBb3ZURJW0rEica0cvzggmXUrHvn9gKkPhf
// SIG // 9mmMAQ5lEG3jAfJ9KWC2Zzj4n6nu/EQR9n1WbL18cn4s
// SIG // 2x7m1lqFHzVvxSZWZS18CZhdwaC/BNqdPSt4WoMM/6LX
// SIG // CrUNfkOPg2jmF1pXqiayVLJx7PVIi3K1RdJXi/0NVeW7
// SIG // IaG9jk5WatKs0nazAy1nYcq1DsZ2fqI2e1HU2OFZwrqI
// SIG // G2fWbPbMiW4O2VEvUlYGJKMEbFr+Y1eJW6kw/rRuBc4T
// SIG // sHEUMHW+gPM6djZ3frO1XQrmBbBoCONbnA/KMVX3ADIx
// SIG // fWF+TdrOJpbZKp1Ht/4bVa58SigwMEmJYmrsdi+4CsPm
// SIG // w9ZBGf+aMy0Zyd44w5KJk6z3LaJGPymmdarm9DVJ5jih
// SIG // /t8VCv6ZViSvATkGLlO4CmB+2MvVkijZT+6So+ouNe/t
// SIG // zWv36yJ45wZCkQif3mE7wR/rOYLns6X0FrVOGzaP4/EM
// SIG // Nr6U0PcO35YR+/EZsHd9ffmE5ob+03MQ21pcrXmo+ESt
// SIG // sJN6WNaEs9iTxOTzbjZnfRpn+qHj2YMuyIvSSy6vEp1C
// SIG // 1e2/iD9FF0WPavhnUYzNgBF+prGb7zwiKBtGmB0LvcGb
// SIG // ChCto6r1ovP8XXnnkiPRTeitcOKFUDODMIIHejCCBWKg
// SIG // AwIBAgIKYQ6Q0gAAAAAAAzANBgkqhkiG9w0BAQsFADCB
// SIG // iDELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0
// SIG // b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1p
// SIG // Y3Jvc29mdCBDb3Jwb3JhdGlvbjEyMDAGA1UEAxMpTWlj
// SIG // cm9zb2Z0IFJvb3QgQ2VydGlmaWNhdGUgQXV0aG9yaXR5
// SIG // IDIwMTEwHhcNMTEwNzA4MjA1OTA5WhcNMjYwNzA4MjEw
// SIG // OTA5WjB+MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2Fz
// SIG // aGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UE
// SIG // ChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMSgwJgYDVQQD
// SIG // Ex9NaWNyb3NvZnQgQ29kZSBTaWduaW5nIFBDQSAyMDEx
// SIG // MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEA
// SIG // q/D6chAcLq3YbqqCEE00uvK2WCGfQhsqa+laUKq4Bjga
// SIG // BEm6f8MMHt03a8YS2AvwOMKZBrDIOdUBFDFC04kNeWSH
// SIG // fpRgJGyvnkmc6Whe0t+bU7IKLMOv2akrrnoJr9eWWcpg
// SIG // GgXpZnboMlImEi/nqwhQz7NEt13YxC4Ddato88tt8zpc
// SIG // oRb0RrrgOGSsbmQ1eKagYw8t00CT+OPeBw3VXHmlSSnn
// SIG // Db6gE3e+lD3v++MrWhAfTVYoonpy4BI6t0le2O3tQ5GD
// SIG // 2Xuye4Yb2T6xjF3oiU+EGvKhL1nkkDstrjNYxbc+/jLT
// SIG // swM9sbKvkjh+0p2ALPVOVpEhNSXDOW5kf1O6nA+tGSOE
// SIG // y/S6A4aN91/w0FK/jJSHvMAhdCVfGCi2zCcoOCWYOUo2
// SIG // z3yxkq4cI6epZuxhH2rhKEmdX4jiJV3TIUs+UsS1Vz8k
// SIG // A/DRelsv1SPjcF0PUUZ3s/gA4bysAoJf28AVs70b1FVL
// SIG // 5zmhD+kjSbwYuER8ReTBw3J64HLnJN+/RpnF78IcV9uD
// SIG // jexNSTCnq47f7Fufr/zdsGbiwZeBe+3W7UvnSSmnEyim
// SIG // p31ngOaKYnhfsi+E11ecXL93KCjx7W3DKI8sj0A3T8Hh
// SIG // hUSJxAlMxdSlQy90lfdu+HggWCwTXWCVmj5PM4TasIgX
// SIG // 3p5O9JawvEagbJjS4NaIjAsCAwEAAaOCAe0wggHpMBAG
// SIG // CSsGAQQBgjcVAQQDAgEAMB0GA1UdDgQWBBRIbmTlUAXT
// SIG // gqoXNzcitW2oynUClTAZBgkrBgEEAYI3FAIEDB4KAFMA
// SIG // dQBiAEMAQTALBgNVHQ8EBAMCAYYwDwYDVR0TAQH/BAUw
// SIG // AwEB/zAfBgNVHSMEGDAWgBRyLToCMZBDuRQFTuHqp8cx
// SIG // 0SOJNDBaBgNVHR8EUzBRME+gTaBLhklodHRwOi8vY3Js
// SIG // Lm1pY3Jvc29mdC5jb20vcGtpL2NybC9wcm9kdWN0cy9N
// SIG // aWNSb29DZXJBdXQyMDExXzIwMTFfMDNfMjIuY3JsMF4G
// SIG // CCsGAQUFBwEBBFIwUDBOBggrBgEFBQcwAoZCaHR0cDov
// SIG // L3d3dy5taWNyb3NvZnQuY29tL3BraS9jZXJ0cy9NaWNS
// SIG // b29DZXJBdXQyMDExXzIwMTFfMDNfMjIuY3J0MIGfBgNV
// SIG // HSAEgZcwgZQwgZEGCSsGAQQBgjcuAzCBgzA/BggrBgEF
// SIG // BQcCARYzaHR0cDovL3d3dy5taWNyb3NvZnQuY29tL3Br
// SIG // aW9wcy9kb2NzL3ByaW1hcnljcHMuaHRtMEAGCCsGAQUF
// SIG // BwICMDQeMiAdAEwAZQBnAGEAbABfAHAAbwBsAGkAYwB5
// SIG // AF8AcwB0AGEAdABlAG0AZQBuAHQALiAdMA0GCSqGSIb3
// SIG // DQEBCwUAA4ICAQBn8oalmOBUeRou09h0ZyKbC5YR4WOS
// SIG // mUKWfdJ5DJDBZV8uLD74w3LRbYP+vj/oCso7v0epo/Np
// SIG // 22O/IjWll11lhJB9i0ZQVdgMknzSGksc8zxCi1LQsP1r
// SIG // 4z4HLimb5j0bpdS1HXeUOeLpZMlEPXh6I/MTfaaQdION
// SIG // 9MsmAkYqwooQu6SpBQyb7Wj6aC6VoCo/KmtYSWMfCWlu
// SIG // WpiW5IP0wI/zRive/DvQvTXvbiWu5a8n7dDd8w6vmSiX
// SIG // mE0OPQvyCInWH8MyGOLwxS3OW560STkKxgrCxq2u5bLZ
// SIG // 2xWIUUVYODJxJxp/sfQn+N4sOiBpmLJZiWhub6e3dMNA
// SIG // BQamASooPoI/E01mC8CzTfXhj38cbxV9Rad25UAqZaPD
// SIG // XVJihsMdYzaXht/a8/jyFqGaJ+HNpZfQ7l1jQeNbB5yH
// SIG // PgZ3BtEGsXUfFL5hYbXw3MYbBL7fQccOKO7eZS/sl/ah
// SIG // XJbYANahRr1Z85elCUtIEJmAH9AAKcWxm6U/RXceNcbS
// SIG // oqKfenoi+kiVH6v7RyOA9Z74v2u3S5fi63V4GuzqN5l5
// SIG // GEv/1rMjaHXmr/r8i+sLgOppO6/8MO0ETI7f33VtY5E9
// SIG // 0Z1WTk+/gFcioXgRMiF670EKsT/7qMykXcGhiJtXcVZO
// SIG // SEXAQsmbdlsKgEhr/Xmfwb1tbWrJUnMTDXpQzTGCFVgw
// SIG // ghVUAgEBMIGVMH4xCzAJBgNVBAYTAlVTMRMwEQYDVQQI
// SIG // EwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4w
// SIG // HAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xKDAm
// SIG // BgNVBAMTH01pY3Jvc29mdCBDb2RlIFNpZ25pbmcgUENB
// SIG // IDIwMTECEzMAAAFRno2PQHGjDkEAAAAAAVEwDQYJYIZI
// SIG // AWUDBAIBBQCgga4wGQYJKoZIhvcNAQkDMQwGCisGAQQB
// SIG // gjcCAQQwHAYKKwYBBAGCNwIBCzEOMAwGCisGAQQBgjcC
// SIG // ARUwLwYJKoZIhvcNAQkEMSIEIMpIJq6245V3OrMF1SMh
// SIG // puARZZDvj9S1OHniagAyQHfFMEIGCisGAQQBgjcCAQwx
// SIG // NDAyoBSAEgBNAGkAYwByAG8AcwBvAGYAdKEagBhodHRw
// SIG // Oi8vd3d3Lm1pY3Jvc29mdC5jb20wDQYJKoZIhvcNAQEB
// SIG // BQAEggEAAMS/YmZlg1/4gI8l/VL/DQPD0rdT8SArBnB5
// SIG // 8AkkPGD1gA5d+ZS365F3ADLsxG7ybC2tymAuJu0V8Dt8
// SIG // cOlqogMl2EPmlcAv1RREqG2HcNt+NXszJKg96NlDEEXP
// SIG // cPpA6aOd7UNF8dkVxvobawxPs+UKmdrZ8z4kUinTrkGk
// SIG // Cokj7NaAvahF1i3lp9qOa2+PEgSIe9Bz2U1acIrNRE4T
// SIG // 4dJCsRJAMLUsVW8LQyW8/R9a4FvbmyKB9bL4tY1Ri0ao
// SIG // SIBDYRoHvwHqZ9/+bthuSwgovT0y01NrkgNG0Wg9LfH/
// SIG // 7wlpkSX6e9ySNCJvvE5I03v5CLg4fTiDcRmebGOfm6GC
// SIG // EuIwghLeBgorBgEEAYI3AwMBMYISzjCCEsoGCSqGSIb3
// SIG // DQEHAqCCErswghK3AgEDMQ8wDQYJYIZIAWUDBAIBBQAw
// SIG // ggFRBgsqhkiG9w0BCRABBKCCAUAEggE8MIIBOAIBAQYK
// SIG // KwYBBAGEWQoDATAxMA0GCWCGSAFlAwQCAQUABCAJeIK/
// SIG // dbgIblsFgnPTI3oFqoECM34YNgVA2VazzM9fzgIGXdMu
// SIG // 7hdKGBMyMDE5MTIwNDAxNDMxMi43NzhaMASAAgH0oIHQ
// SIG // pIHNMIHKMQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2Fz
// SIG // aGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UE
// SIG // ChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMSUwIwYDVQQL
// SIG // ExxNaWNyb3NvZnQgQW1lcmljYSBPcGVyYXRpb25zMSYw
// SIG // JAYDVQQLEx1UaGFsZXMgVFNTIEVTTjpEMkNELUUzMTAt
// SIG // NEFGMTElMCMGA1UEAxMcTWljcm9zb2Z0IFRpbWUtU3Rh
// SIG // bXAgU2VydmljZaCCDjkwggTxMIID2aADAgECAhMzAAAB
// SIG // IhuPACYlzLHnAAAAAAEiMA0GCSqGSIb3DQEBCwUAMHwx
// SIG // CzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9u
// SIG // MRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNy
// SIG // b3NvZnQgQ29ycG9yYXRpb24xJjAkBgNVBAMTHU1pY3Jv
// SIG // c29mdCBUaW1lLVN0YW1wIFBDQSAyMDEwMB4XDTE5MTEx
// SIG // MzIxNDA0M1oXDTIxMDIxMTIxNDA0M1owgcoxCzAJBgNV
// SIG // BAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYD
// SIG // VQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQg
// SIG // Q29ycG9yYXRpb24xJTAjBgNVBAsTHE1pY3Jvc29mdCBB
// SIG // bWVyaWNhIE9wZXJhdGlvbnMxJjAkBgNVBAsTHVRoYWxl
// SIG // cyBUU1MgRVNOOkQyQ0QtRTMxMC00QUYxMSUwIwYDVQQD
// SIG // ExxNaWNyb3NvZnQgVGltZS1TdGFtcCBTZXJ2aWNlMIIB
// SIG // IjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA3xUD
// SIG // SGJBPsFy3A9lH5NrOJFClIU0Pefkf0Og1IXbjhnSybEi
// SIG // oaHFNSpfC9cxKpP5NZPuaFQogaeS/RTu8nEoe+/QfkPE
// SIG // 3ohESzPp2zHbAMVAmz40dLEOt5CUxaQ4Af+BzqXi1CzD
// SIG // 0OohJdI3xLNrqnbf4FiKuCsitGV6D/zqOku84Vs+Ao3M
// SIG // 5O4EtIpQH0re8QeZRIUISwrZKfa8zugiqjC1ubo2FcoZ
// SIG // hXH63ce+P2OhNhrPbtWDpPCrZ+GOHFv9hNnvuAXjLPQE
// SIG // vtF1m5PzWGNsYjx42apc6FWRChpXTidPT/pCIf457ad0
// SIG // 6aq9jU3g7fTo09alGNcsyXXUdKXCyQIDAQABo4IBGzCC
// SIG // ARcwHQYDVR0OBBYEFI42PVVqa8Avcdg44+E0vZ0XM7fI
// SIG // MB8GA1UdIwQYMBaAFNVjOlyKMZDzQ3t8RhvFM2hahW1V
// SIG // MFYGA1UdHwRPME0wS6BJoEeGRWh0dHA6Ly9jcmwubWlj
// SIG // cm9zb2Z0LmNvbS9wa2kvY3JsL3Byb2R1Y3RzL01pY1Rp
// SIG // bVN0YVBDQV8yMDEwLTA3LTAxLmNybDBaBggrBgEFBQcB
// SIG // AQROMEwwSgYIKwYBBQUHMAKGPmh0dHA6Ly93d3cubWlj
// SIG // cm9zb2Z0LmNvbS9wa2kvY2VydHMvTWljVGltU3RhUENB
// SIG // XzIwMTAtMDctMDEuY3J0MAwGA1UdEwEB/wQCMAAwEwYD
// SIG // VR0lBAwwCgYIKwYBBQUHAwgwDQYJKoZIhvcNAQELBQAD
// SIG // ggEBAIukR27DIv8GtoNyflU7nIScojWdH2ZalrooTiTr
// SIG // sTefULwneuh6dqQWkQheI38fsG6xhHjnSeZbk2SFA/PI
// SIG // SaH+EO0N+2V+/LJ2zHf4Ia9e+2dW3+7d8kTNnEN7x+o9
// SIG // tI1rZWnKFnhvwkbAl9FR8v+aPqicW/0n1QuVgfmmQXBf
// SIG // 4+3Hcx5bOwjHE6cw2qJ9vquSdJgfm1fyO5Bsi8eJCEDo
// SIG // L6MdcXl8sMbRToFXnwQimBy+fYS6EGbDlMK/JPJHfz/M
// SIG // FnJGg07lrf7kauNcM2MP53dwAs30x1Reg2PakBUFRBid
// SIG // EQOHBLOhCF/eLDf86VU51BvtDz3VwXIASlJIytswggZx
// SIG // MIIEWaADAgECAgphCYEqAAAAAAACMA0GCSqGSIb3DQEB
// SIG // CwUAMIGIMQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2Fz
// SIG // aGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UE
// SIG // ChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMTIwMAYDVQQD
// SIG // EylNaWNyb3NvZnQgUm9vdCBDZXJ0aWZpY2F0ZSBBdXRo
// SIG // b3JpdHkgMjAxMDAeFw0xMDA3MDEyMTM2NTVaFw0yNTA3
// SIG // MDEyMTQ2NTVaMHwxCzAJBgNVBAYTAlVTMRMwEQYDVQQI
// SIG // EwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4w
// SIG // HAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xJjAk
// SIG // BgNVBAMTHU1pY3Jvc29mdCBUaW1lLVN0YW1wIFBDQSAy
// SIG // MDEwMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKC
// SIG // AQEAqR0NvHcRijog7PwTl/X6f2mUa3RUENWlCgCChfvt
// SIG // fGhLLF/Fw+Vhwna3PmYrW/AVUycEMR9BGxqVHc4JE458
// SIG // YTBZsTBED/FgiIRUQwzXTbg4CLNC3ZOs1nMwVyaCo0UN
// SIG // 0Or1R4HNvyRgMlhgRvJYR4YyhB50YWeRX4FUsc+TTJLB
// SIG // xKZd0WETbijGGvmGgLvfYfxGwScdJGcSchohiq9LZIlQ
// SIG // YrFd/XcfPfBXday9ikJNQFHRD5wGPmd/9WbAA5ZEfu/Q
// SIG // S/1u5ZrKsajyeioKMfDaTgaRtogINeh4HLDpmc085y9E
// SIG // uqf03GS9pAHBIAmTeM38vMDJRF1eFpwBBU8iTQIDAQAB
// SIG // o4IB5jCCAeIwEAYJKwYBBAGCNxUBBAMCAQAwHQYDVR0O
// SIG // BBYEFNVjOlyKMZDzQ3t8RhvFM2hahW1VMBkGCSsGAQQB
// SIG // gjcUAgQMHgoAUwB1AGIAQwBBMAsGA1UdDwQEAwIBhjAP
// SIG // BgNVHRMBAf8EBTADAQH/MB8GA1UdIwQYMBaAFNX2VsuP
// SIG // 6KJcYmjRPZSQW9fOmhjEMFYGA1UdHwRPME0wS6BJoEeG
// SIG // RWh0dHA6Ly9jcmwubWljcm9zb2Z0LmNvbS9wa2kvY3Js
// SIG // L3Byb2R1Y3RzL01pY1Jvb0NlckF1dF8yMDEwLTA2LTIz
// SIG // LmNybDBaBggrBgEFBQcBAQROMEwwSgYIKwYBBQUHMAKG
// SIG // Pmh0dHA6Ly93d3cubWljcm9zb2Z0LmNvbS9wa2kvY2Vy
// SIG // dHMvTWljUm9vQ2VyQXV0XzIwMTAtMDYtMjMuY3J0MIGg
// SIG // BgNVHSABAf8EgZUwgZIwgY8GCSsGAQQBgjcuAzCBgTA9
// SIG // BggrBgEFBQcCARYxaHR0cDovL3d3dy5taWNyb3NvZnQu
// SIG // Y29tL1BLSS9kb2NzL0NQUy9kZWZhdWx0Lmh0bTBABggr
// SIG // BgEFBQcCAjA0HjIgHQBMAGUAZwBhAGwAXwBQAG8AbABp
// SIG // AGMAeQBfAFMAdABhAHQAZQBtAGUAbgB0AC4gHTANBgkq
// SIG // hkiG9w0BAQsFAAOCAgEAB+aIUQ3ixuCYP4FxAz2do6Eh
// SIG // b7Prpsz1Mb7PBeKp/vpXbRkws8LFZslq3/Xn8Hi9x6ie
// SIG // JeP5vO1rVFcIK1GCRBL7uVOMzPRgEop2zEBAQZvcXBf/
// SIG // XPleFzWYJFZLdO9CEMivv3/Gf/I3fVo/HPKZeUqRUgCv
// SIG // OA8X9S95gWXZqbVr5MfO9sp6AG9LMEQkIjzP7QOllo9Z
// SIG // Kby2/QThcJ8ySif9Va8v/rbljjO7Yl+a21dA6fHOmWaQ
// SIG // jP9qYn/dxUoLkSbiOewZSnFjnXshbcOco6I8+n99lmqQ
// SIG // eKZt0uGc+R38ONiU9MalCpaGpL2eGq4EQoO4tYCbIjgg
// SIG // tSXlZOz39L9+Y1klD3ouOVd2onGqBooPiRa6YacRy5rY
// SIG // DkeagMXQzafQ732D8OE7cQnfXXSYIghh2rBQHm+98eEA
// SIG // 3+cxB6STOvdlR3jo+KhIq/fecn5ha293qYHLpwmsObvs
// SIG // xsvYgrRyzR30uIUBHoD7G4kqVDmyW9rIDVWZeodzOwjm
// SIG // mC3qjeAzLhIp9cAvVCch98isTtoouLGp25ayp0Kiyc8Z
// SIG // QU3ghvkqmqMRZjDTu3QyS99je/WZii8bxyGvWbWu3EQ8
// SIG // l1Bx16HSxVXjad5XwdHeMMD9zOZN+w2/XU/pnR4ZOC+8
// SIG // z1gFLu8NoFA12u8JJxzVs341Hgi62jbb01+P3nSISRKh
// SIG // ggLLMIICNAIBATCB+KGB0KSBzTCByjELMAkGA1UEBhMC
// SIG // VVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcT
// SIG // B1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jw
// SIG // b3JhdGlvbjElMCMGA1UECxMcTWljcm9zb2Z0IEFtZXJp
// SIG // Y2EgT3BlcmF0aW9uczEmMCQGA1UECxMdVGhhbGVzIFRT
// SIG // UyBFU046RDJDRC1FMzEwLTRBRjExJTAjBgNVBAMTHE1p
// SIG // Y3Jvc29mdCBUaW1lLVN0YW1wIFNlcnZpY2WiIwoBATAH
// SIG // BgUrDgMCGgMVAFDsA/yXG6SlTF6RdlYe+zMlTZvZoIGD
// SIG // MIGApH4wfDELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldh
// SIG // c2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNV
// SIG // BAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEmMCQGA1UE
// SIG // AxMdTWljcm9zb2Z0IFRpbWUtU3RhbXAgUENBIDIwMTAw
// SIG // DQYJKoZIhvcNAQEFBQACBQDhkXPvMCIYDzIwMTkxMjA0
// SIG // MDc1MzE5WhgPMjAxOTEyMDUwNzUzMTlaMHQwOgYKKwYB
// SIG // BAGEWQoEATEsMCowCgIFAOGRc+8CAQAwBwIBAAICE6Iw
// SIG // BwIBAAICEbMwCgIFAOGSxW8CAQAwNgYKKwYBBAGEWQoE
// SIG // AjEoMCYwDAYKKwYBBAGEWQoDAqAKMAgCAQACAwehIKEK
// SIG // MAgCAQACAwGGoDANBgkqhkiG9w0BAQUFAAOBgQAXXHzR
// SIG // o3Wsdno8U0iinCDOLoce1R7+m7QF5mmhTJEPNDptdOOQ
// SIG // 4xkZ5pKA2YX7PSYOm5ymUZmR9rRGxidwSNyZWTjf0yLo
// SIG // KVifSfduvcpfnN9c8SdWLsqdepFx2xjjYIVH5dTEufX4
// SIG // Og79Pw1xqcBIUenMx+9+gRdA5gXyh7seDzGCAw0wggMJ
// SIG // AgEBMIGTMHwxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpX
// SIG // YXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYD
// SIG // VQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xJjAkBgNV
// SIG // BAMTHU1pY3Jvc29mdCBUaW1lLVN0YW1wIFBDQSAyMDEw
// SIG // AhMzAAABIhuPACYlzLHnAAAAAAEiMA0GCWCGSAFlAwQC
// SIG // AQUAoIIBSjAaBgkqhkiG9w0BCQMxDQYLKoZIhvcNAQkQ
// SIG // AQQwLwYJKoZIhvcNAQkEMSIEIHGnat0cUTvpx58Ad+Cd
// SIG // wRv5VxqfamNPPrDtojrVPM2yMIH6BgsqhkiG9w0BCRAC
// SIG // LzGB6jCB5zCB5DCBvQQgu/BgiV5iMs5qslkpcOW35aMP
// SIG // ckN4OL77N+KDUsJ4MQkwgZgwgYCkfjB8MQswCQYDVQQG
// SIG // EwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UE
// SIG // BxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENv
// SIG // cnBvcmF0aW9uMSYwJAYDVQQDEx1NaWNyb3NvZnQgVGlt
// SIG // ZS1TdGFtcCBQQ0EgMjAxMAITMwAAASIbjwAmJcyx5wAA
// SIG // AAABIjAiBCANZOua+w0I1do+EorweUfXh/PeYBd3E7cq
// SIG // 6IrnZSNOezANBgkqhkiG9w0BAQsFAASCAQDFqPGGONPH
// SIG // eIzoCBMY0/1adAXQ/kxZoD/qGpCc9LKLmOhyXDM2fYIg
// SIG // Grx9nlvQ42WJvqddh+FLUai6HnQcfKlRjMQ4MzsOaQPl
// SIG // sO4DoguqPBqd5cpGHxh1lLOFyZbDdjiQoUDxi2TitMgX
// SIG // zr0FeSPpRdj6eyQrd5OhZxQKdWuzMt+HFIAssMJ77EmX
// SIG // WP9P1PqtsibSc2pfRqBsqhztu52vwGsHmKMc8zUWGmzB
// SIG // PL/c1kT+aPeO3lrDkxznEyMyoJbpTFgHu8sYj0efZhH6
// SIG // +DryFvsaNBVASHFoPkWZnXTZOYxnhrUAkp16IGhB4NFh
// SIG // AUoQIsfgLeeJTGCnUVhjBj0e
// SIG // End signature block
