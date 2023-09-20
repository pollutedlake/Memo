@Imports Microsoft.Azure.ActiveDirectory.GraphClient
@Code
    ViewBag.Title = "User Profile"
End Code

<h2>@ViewBag.Title</h2>

<p>
    The token for accessing the Graph API has expired.
    Click @Html.ActionLink("here", "RefreshSession", "UserProfile", Nothing, Nothing) to sign-in and get a new access token.
</p>
