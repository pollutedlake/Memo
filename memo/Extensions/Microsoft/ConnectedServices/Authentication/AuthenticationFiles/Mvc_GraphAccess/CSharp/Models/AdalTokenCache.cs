using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Security;
using Microsoft.IdentityModel.Clients.ActiveDirectory;

namespace $RootNamespace$
{
    public class ADALTokenCache : TokenCache
    {
        private ApplicationDbContext db = new ApplicationDbContext();
        private string userId;
        private UserTokenCache Cache;

        public ADALTokenCache(string signedInUserId)
        {
            // $ServiceInstance.ADALTokenCacheCommentLine1$
            userId = signedInUserId;
            this.AfterAccess = AfterAccessNotification;
            this.BeforeAccess = BeforeAccessNotification;
            this.BeforeWrite = BeforeWriteNotification;
            // $ServiceInstance.ADALTokenCacheCommentLine2$
            Cache = db.UserTokenCacheList.FirstOrDefault(c => c.webUserUniqueId == userId);
            // $ServiceInstance.ADALTokenCacheCommentLine3$
            this.Deserialize((Cache == null) ? null : MachineKey.Unprotect(Cache.cacheBits,"ADALCache"));
        }

        // $ServiceInstance.ADALTokenCacheCommentLine4$
        public override void Clear()
        {
            base.Clear();
            var cacheEntry = db.UserTokenCacheList.FirstOrDefault(c => c.webUserUniqueId == userId);
            db.UserTokenCacheList.Remove(cacheEntry);
            db.SaveChanges();
        }

        // $ServiceInstance.ADALTokenCacheCommentLine5$
        // $ServiceInstance.ADALTokenCacheCommentLine6$
        void BeforeAccessNotification(TokenCacheNotificationArgs args)
        {
            if (Cache == null)
            {
                // $ServiceInstance.ADALTokenCacheCommentLine7$
                Cache = db.UserTokenCacheList.FirstOrDefault(c => c.webUserUniqueId == userId);
            }
            else
            {
                // $ServiceInstance.ADALTokenCacheCommentLine8$
                var status = from e in db.UserTokenCacheList
                             where (e.webUserUniqueId == userId)
                select new
                {
                    LastWrite = e.LastWrite
                };

                // $ServiceInstance.ADALTokenCacheCommentLine9$
                if (status.First().LastWrite > Cache.LastWrite)
                {
                    // $ServiceInstance.ADALTokenCacheCommentLine10$
                    Cache = db.UserTokenCacheList.FirstOrDefault(c => c.webUserUniqueId == userId);
                }
            }
            this.Deserialize((Cache == null) ? null : MachineKey.Unprotect(Cache.cacheBits, "ADALCache"));
        }

        // $ServiceInstance.ADALTokenCacheCommentLine11$
        // $ServiceInstance.ADALTokenCacheCommentLine12$
        void AfterAccessNotification(TokenCacheNotificationArgs args)
        {
            // $ServiceInstance.ADALTokenCacheCommentLine13$
            if (this.HasStateChanged)
            {
                Cache = new UserTokenCache
                {
                    webUserUniqueId = userId,
                    cacheBits = MachineKey.Protect(this.Serialize(), "ADALCache"),
                    LastWrite = DateTime.Now
                };
                // $ServiceInstance.ADALTokenCacheCommentLine14$
                db.Entry(Cache).State = Cache.UserTokenCacheId == 0 ? EntityState.Added : EntityState.Modified;
                db.SaveChanges();
                this.HasStateChanged = false;
            }
        }

        void BeforeWriteNotification(TokenCacheNotificationArgs args)
        {
            // $ServiceInstance.ADALTokenCacheCommentLine15$
        }

    public override void DeleteItem(TokenCacheItem item)
        {
            base.DeleteItem(item);
        }
    }
}
