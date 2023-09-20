Imports System.IdentityModel.Claims
Imports System.Threading.Tasks
Imports Microsoft.IdentityModel.Clients.ActiveDirectory
Imports Microsoft.Owin.Security
Imports Microsoft.Owin.Security.Cookies
Imports Microsoft.Owin.Security.OpenIdConnect
Imports Owin

Partial Public Class Startup
    Private Shared clientId As String = ConfigurationManager.AppSettings("ida:ClientId")
    Private Shared appKey As String = ConfigurationManager.AppSettings("ida:ClientSecret")
    Private Shared aadInstance As String = ConfigurationManager.AppSettings("ida:AADInstance")
    Private Shared tenantId As String = ConfigurationManager.AppSettings("ida:TenantId")
    Private Shared postLogoutRedirectUri As String = ConfigurationManager.AppSettings("ida:PostLogoutRedirectUri")

    Public Shared ReadOnly Authority As String = aadInstance + tenantId

    ' $ServiceInstance.GraphStartupAuthCommentLine1$
    Private graphResourceId As String = "$ServiceInstance.GraphResource$"

    Public Sub ConfigureAuth(app As IAppBuilder)
        Dim db As New ApplicationDbContext()

        app.SetDefaultSignInAsAuthenticationType(CookieAuthenticationDefaults.AuthenticationType)

        app.UseCookieAuthentication(New CookieAuthenticationOptions())

        ' $ServiceInstance.GraphStartupAuthCommentLine2$
        app.UseOpenIdConnectAuthentication(New OpenIdConnectAuthenticationOptions() With {
                .clientId = clientId,
                .Authority = Authority,
                .postLogoutRedirectUri = postLogoutRedirectUri,
                .Notifications = New OpenIdConnectAuthenticationNotifications() With {
                .AuthorizationCodeReceived = Function(context)
                                                 Dim code = context.Code
                                                 Dim credential As New ClientCredential(clientId, appKey)
                                                 Dim signedInUserID As String = context.AuthenticationTicket.Identity.FindFirst(ClaimTypes.NameIdentifier).Value
                                                 Dim authContext As New AuthenticationContext(Authority, New ADALTokenCache(signedInUserID))
                                                 Return authContext.AcquireTokenByAuthorizationCodeAsync(code, New Uri(HttpContext.Current.Request.Url.GetLeftPart(UriPartial.Path)), credential, graphResourceId)

                                             End Function
                }
            })
    End Sub
End Class

