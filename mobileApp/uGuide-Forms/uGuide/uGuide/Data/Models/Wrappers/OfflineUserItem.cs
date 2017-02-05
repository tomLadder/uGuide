using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace uGuide.Data.Models.Wrappers
{
    using SQLite;

    public class OfflineUserItem
    { 

        [PrimaryKey, AutoIncrement]
        public int IdDb { get; set; }

        public string Id { get; set; }

        public string Username { get; set; }

        public string Password { get; set; }

        public int TourId { get; set; }

        public string AccessToken { get; set; }
    }
}
