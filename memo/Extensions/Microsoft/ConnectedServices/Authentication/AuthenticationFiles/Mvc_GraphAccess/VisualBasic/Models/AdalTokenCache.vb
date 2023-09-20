Imports System.Data.Entity
Imports Microsoft.IdentityModel.Clients.ActiveDirectory

Public Class ADALTokenCache
    Inherits TokenCache
    Private db As New ApplicationDbContext()
    Private userId As String
    Private Cache As UserTokenCache

    Public Sub New(signedInUserId As String)
        ' $ServiceInstance.ADALTokenCacheCommentLine1$
        userId = signedInUserId
        Me.AfterAccess = AddressOf AfterAccessNotification
        Me.BeforeAccess = AddressOf BeforeAccessNotification
        Me.BeforeWrite = AddressOf BeforeWriteNotification
        ' $ServiceInstance.ADALTokenCacheCommentLine2$
        Cache = db.UserTokenCacheList.FirstOrDefault(Function(c) c.webUserUniqueId = userId)
        ' $ServiceInstance.ADALTokenCacheCommentLine3$
        Me.Deserialize(If((Cache Is Nothing), Nothing, MachineKey.Unprotect(Cache.cacheBits, "ADALCache")))
    End Sub

    ' $ServiceInstance.ADALTokenCacheCommentLine4$
    Public Overrides Sub Clear()
        MyBase.Clear()
        Dim cacheEntry = db.UserTokenCacheList.FirstOrDefault(Function(c) c.webUserUniqueId = userId)
        db.UserTokenCacheList.Remove(cacheEntry)
        db.SaveChanges()
    End Sub

    ' $ServiceInstance.ADALTokenCacheCommentLine5$
    ' $ServiceInstance.ADALTokenCacheCommentLine6$
    Private Sub BeforeAccessNotification(args As TokenCacheNotificationArgs)
        If Cache Is Nothing Then
            ' $ServiceInstance.ADALTokenCacheCommentLine7$
            Cache = db.UserTokenCacheList.FirstOrDefault(Function(c) c.webUserUniqueId = userId)
        Else
            ' $ServiceInstance.ADALTokenCacheCommentLine8$
            Dim status = From e In db.UserTokenCacheList
                         Where (e.webUserUniqueId = userId)
                         Select New With {
                                 .LastWrite = e.LastWrite
                             }

            ' $ServiceInstance.ADALTokenCacheCommentLine9$
            If status.First().LastWrite > Cache.LastWrite Then
                ' $ServiceInstance.ADALTokenCacheCommentLine10$
                Cache = db.UserTokenCacheList.FirstOrDefault(Function(c) c.webUserUniqueId = userId)
            End If
        End If

        Me.Deserialize(If((Cache Is Nothing), Nothing, MachineKey.Unprotect(Cache.cacheBits, "ADALCache")))
    End Sub

    ' $ServiceInstance.ADALTokenCacheCommentLine11$
    ' $ServiceInstance.ADALTokenCacheCommentLine12$
    Private Sub AfterAccessNotification(args As TokenCacheNotificationArgs)
        ' $ServiceInstance.ADALTokenCacheCommentLine13$
        If Me.HasStateChanged Then
            Cache = New UserTokenCache() With {
                    .webUserUniqueId = userId,
                    .cacheBits = MachineKey.Protect(Me.Serialize(), "ADALCache"),
                    .LastWrite = DateTime.Now
                }

            ' $ServiceInstance.ADALTokenCacheCommentLine14$
            db.Entry(Cache).State = If(Cache.UserTokenCacheId = 0, EntityState.Added, EntityState.Modified)
            db.SaveChanges()
            Me.HasStateChanged = False
        End If
    End Sub

    Private Sub BeforeWriteNotification(args As TokenCacheNotificationArgs)
        ' $ServiceInstance.ADALTokenCacheCommentLine15$
    End Sub

    Public Overrides Sub DeleteItem(item As TokenCacheItem)
        MyBase.DeleteItem(item)
    End Sub
End Class