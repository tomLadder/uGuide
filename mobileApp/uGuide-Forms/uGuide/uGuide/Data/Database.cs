using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using uGuide.Data.Models;
using uGuide.Pages;

namespace uGuide.Data
{
    public class Database
    {
        private Database()
        {
        }

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

        // ReSharper disable once StyleCop.SA1201
        private static Database instance;

        public User CurrentUser { get; set; }

        public Visitor CurrentVisitor { get; set; }

        public List<Station> HistoryStations { get; set; }

        public uGuideMainPage UGuideMainPage { get; set; }

        public List<PredefinedAnswer> PredefinedAnswers { get; set; }

        public List<DoneStation> DoneStations { get; set; }

        public List<ToDoStation> ToDoStations { get; set; }

        public List<Station> PreLoadedStations { get; set; }

        public List<Station> HardcodedStations { get; set; }

        public Tour CurrentTour { get; set; }

    }
}