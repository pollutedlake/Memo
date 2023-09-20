Imports System.Security.Claims
Imports System.Threading.Tasks
Imports Microsoft.Azure.ActiveDirectory.GraphClient
Imports Microsoft.IdentityModel.Clients.ActiveDirectory
Imports Microsoft.Owin.Security
Imports Microsoft.Owin.Security.OpenIdConnect

<Authorize>
Public Class UserProfileController
    Inherits Controller
    Private db As New ApplicationDbContext()
    Dim appSettings = ConfigurationManager.AppSettings
    Private clientId As String = appSettings("ida:ClientId")
    Private appKey As String = appSettings("ida:ClientSecret")
    Private aadInstance As String = appSettings("ida:AADInstance")
    Private graphResourceID As String = "$ServiceInstance.GraphResource$"

    ' $ServiceInstance.UserProfileControllerCommentLine1$
    Public Async Function Index() As Task(Of ActionResult)
        Dim tenantID As String = ClaimsPrincipal.Current.FindFirst("http://schemas.microsoft.com/identity/claims/tenantid").Value
        Dim userObjectID As String = ClaimsPrincipal.Current.FindFirst("http://schemas.microsoft.com/identity/claims/objectidentifier").Value
        Try
            Dim servicePointUri As New Uri(graphResourceID)
            Dim serviceRoot As New Uri(servicePointUri, tenantID)
            Dim activeDirectoryClient As New ActiveDirectoryClient(serviceRoot, Async Function() Await GetTokenForApplication())

            ' $ServiceInstance.UserProfileControllerCommentLine2$

            Dim result = Await activeDirectoryClient.Users.Where(Function(u) u.ObjectId.Equals(userObjectID)).ExecuteAsync()
            Dim user As IUser = result.CurrentPage.ToList().First()

            Return View(user)
        Catch generatedExceptionName As AdalException
            ' $ServiceInstance.UserProfileControllerCommentLine3$
            Return View("Error")
            ' $ServiceInstance.UserProfileControllerCommentLine4$
        Catch generatedExceptionName As Exception
            Return View("Relogin")
        End Try
    End Function

    Public Sub RefreshSession()
        Dim properties As New AuthenticationProperties
        properties.RedirectUri = "/UserProfile"
        HttpContext.GetOwinContext().Authentication.Challenge(properties, OpenIdConnectAuthenticationDefaults.AuthenticationType)
    End Sub

    Public Async Function GetTokenForApplication() As Task(Of String)
        Dim signedInUserID As String = ClaimsPrincipal.Current.FindFirst(ClaimTypes.NameIdentifier).Value
        Dim tenantID As String = ClaimsPrincipal.Current.FindFirst("http://schemas.microsoft.com/identity/claims/tenantid").Value
        Dim userObjectID As String = ClaimsPrincipal.Current.FindFirst("http://schemas.microsoft.com/identity/claims/objectidentifier").Value

        ' $ServiceInstance.UserProfileControllerCommentLine5$
        Dim clientcred As New ClientCredential(clientId, appKey)
        ' $ServiceInstance.UserProfileControllerCommentLine6$
        Dim authenticationContext As New AuthenticationContext(aadInstance + tenantID, New ADALTokenCache(signedInUserID))
        Dim authenticationResult = Await authenticationContext.AcquireTokenSilentAsync(graphResourceID, clientcred, New UserIdentifier(userObjectID, UserIdentifierType.UniqueId))
        Return authenticationResult.AccessToken
    End Function
End Class
