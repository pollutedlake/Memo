Imports System.ComponentModel.DataAnnotations
Imports System.Data.Entity

Public Class ApplicationDbContext
    Inherits DbContext

    Public Sub New()
        MyBase.New("DefaultConnection")
    End Sub

    Public Property UserTokenCacheList As DbSet(Of UserTokenCache)
End Class

Public Class UserTokenCache
    <Key>
    Public Property UserTokenCacheId As Integer
    Public Property webUserUniqueId As String
    Public Property cacheBits() As Byte()
    Public Property LastWrite As DateTime
End Class