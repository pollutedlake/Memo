﻿@Code
    If Request.IsAuthenticated Then

        @<text>
            <ul class="nav navbar-nav navbar-right">
                <li class="navbar-text">
                    Hello, @User.Identity.Name!
                </li>
                <li>
                    @Html.ActionLink("Sign out", "SignOut", "Account")
                </li>
            </ul>
        </text>

    Else

        @<ul Class="nav navbar-nav navbar-right">
            <li>@Html.ActionLink("Sign in", "SignIn", "Account", routeValues:=Nothing, htmlAttributes:=New With {.id = "loginLink"})</li>
        </ul>
    End If
End Code