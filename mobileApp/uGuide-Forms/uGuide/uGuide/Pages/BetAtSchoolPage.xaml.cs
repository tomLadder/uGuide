using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Xamarin.Forms;

namespace uGuide.Pages
{
    public partial class BetAtSchoolPage : ContentPage
    {
        public BetAtSchoolPage()
        {
            InitializeComponent();
            Browser.Source = "http://www.matreiosttirol.com/";
        }

        protected override bool OnBackButtonPressed()
        {
            return true;
        }
    }
}
