using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using uGuide.Data.Models;
using uGuide.Pages;

namespace uGuide.Data
{
    class Database
    {
        private static Database instance;
        public User CurrentUser { get; set; } 
        public Visitor CurrentVisitor { get; set; }
        public List<Station> HistoryStations { get; set; }
        public uGuideMainPage UGuideMainPage { get; set; }

        private Database() { }

        public static Database Instance
        {
            get
            {
                if (instance == null)
                {
                    instance = new Database();
                }
                return instance;
            }
        }
    }
}