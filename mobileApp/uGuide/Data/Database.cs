using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using Android.App;
using Android.Content;
using Android.OS;
using Android.Runtime;
using Android.Views;
using Android.Widget;

namespace uGuide.Data
{
    class Database
    {
        /*
         * TEMP CLASS
         * Wird vielleicht verwendet werden
         * Als Zwischenspeicher für Daten gedacht
         */ 
        private static Database instance;
        public User CurrentUser { get; set; }

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