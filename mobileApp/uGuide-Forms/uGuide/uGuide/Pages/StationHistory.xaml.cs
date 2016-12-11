using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Xamarin.Forms;

namespace uGuide.Pages
{
    public partial class StationHistory : ContentPage
    {
        public StationHistory()
        {
            InitializeComponent();
            NavigationPage.SetHasNavigationBar(this, false);
            this.HistoryList.ItemsSource = new String[]
            {
                "uGuide  Besucht",
                "orderM8 Besucht",
                "holidayM8 ToDo"
            };
        }
    }
}
