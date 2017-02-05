using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace uGuide.Data
{
    using SQLite;

    using uGuide.Data.Models;
    using uGuide.Data.Models.Wrappers;
    using uGuide.Droid.PCLInterfaces;

    using Xamarin.Forms;

    public class OfflineDatabase
    {
        private static OfflineDatabase instance;
        private readonly SQLiteAsyncConnection database;

        public OfflineDatabase(string path)
        {
            this.database = new SQLiteAsyncConnection(path);
            this.database.CreateTableAsync<OfflineUserItem>().Wait();
            this.database.CreateTableAsync<OfflineStationItem>().Wait();
            this.database.CreateTableAsync<OfflineTourItem>().Wait();
            this.database.CreateTableAsync<OfflinePredefinedAnswerItem>().Wait();
        }

        public static OfflineDatabase Instance
        {
            get
            {
                return new OfflineDatabase(DependencyService.Get<IFileHelper>().DbConnection("uGuideDB.db3"));
            }
        }

        public Task<List<OfflineStationItem>> GetStationsAsync()
        {
            return this.database.Table<OfflineStationItem>().ToListAsync();
        }

        public Task<int> SaveStationsAsync(List<OfflineStationItem> items)
        {
            return this.database.InsertAllAsync(items);
        }

        public Task<int> DeleteAllStationsAsync()
        {
            return this.database.ExecuteAsync("Delete From [OfflineStationItem]");
        }

        public Task<OfflineUserItem> GetUserAsync()
        {
            return this.database.Table<OfflineUserItem>().FirstOrDefaultAsync();
        }

        public Task<int> CountSavedUsers()
        {
            return this.database.Table<OfflineUserItem>().CountAsync();
        }

        public Task<int> SaveUserAsync(OfflineUserItem item)
        {
            return item.IdDb != 0 ? this.database.UpdateAsync(item) : this.database.InsertAsync(item);
        }

        public Task<int> DeleteUserAsync(OfflineUserItem item)
        {
            return this.database.DeleteAsync(item);
        }

        public Task<int> CountSavedStationsAsync()
        {
            return this.database.Table<OfflineStationItem>().CountAsync();
        }

        public Task<OfflineTourItem> GetCurrentTourAsync(int currentUserTourId)
        {
            return this.database.Table<OfflineTourItem>().Where(i => i.IdDb == currentUserTourId).FirstOrDefaultAsync();
        }

        public Task<int> CountSavedToursAsync()
        {
            return this.database.Table<OfflineTourItem>().CountAsync();
        }

        public Task<int> DeleteCurrentTourAsync(OfflineTourItem item)
        {
            return this.database.DeleteAsync(item);
        }

        public Task<int> SaveTourAsync(OfflineTourItem item)
        {
            return item.IdDb != 0 ? this.database.UpdateAsync(item) : this.database.InsertAsync(item);
        }

        public Task<int> GetLastInsertId()
        {
            return this.database.ExecuteScalarAsync<int>("select last_insert_rowid()");
        }

        public Task<List<OfflineTourItem>> GetToursAsync()
        {
            return this.database.Table<OfflineTourItem>().ToListAsync();
        }

        public Task<int> DeleteAllToursAsync()
        {
            return this.database.ExecuteAsync("Delete From [OfflineTourItem]");
        }

        public Task<int> DeleteAllPredefinedAnswersAsync()
        {
            return this.database.ExecuteAsync("Delete From [OfflinePredefinedAnswerItem]");
        }

        public Task<int> SavePredefinedAnswers(List<OfflinePredefinedAnswerItem> items)
        {
            return this.database.InsertAllAsync(items);
        }

        public Task<List<OfflinePredefinedAnswerItem>> GetPredefinedAnswersAsync()
        {
            return this.database.Table<OfflinePredefinedAnswerItem>().ToListAsync();
        }

        public Task<int> CountSavedPredefinedAnswers()
        {
            return this.database.Table<OfflinePredefinedAnswerItem>().CountAsync();
        }
    }
}
