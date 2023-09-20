Imports Owin
Imports Microsoft.Owin.Security
Imports Microsoft.Owin.Security.Cookies
Imports Microsoft.Owin.Security.OpenIdConnect

Partial Public Class $OwinClass$
    Private Shared clientId As String = ConfigurationManager.AppSettings("ida:ClientId")
    Private Shared aadInstance As String = ConfigurationManager.AppSettings("ida:AADInstance")
    Private Shared tenantId As String = ConfigurationManager.AppSettings("ida:TenantId")
    Private Shared postLogoutRedirectUri As String = ConfigurationManager.AppSettings("ida:PostLogoutRedirectUri")
    Private Shared authority As String = aadInstance + tenantId

    Public Sub ConfigureAuth(app As IAppBuilder)
        app.SetDefaultSignInAsAuthenticationType(CookieAuthenticationDefaults.AuthenticationType)

        app.UseCookieAuthentication(New CookieAuthenticationOptions())

        app.UseOpenIdConnectAuthentication(New OpenIdConnectAuthenticationOptions() With {
                .clientId = clientId,
                .authority = authority,
                .postLogoutRedirectUri = postLogoutRedirectUri
            })
    End Sub
End Class

