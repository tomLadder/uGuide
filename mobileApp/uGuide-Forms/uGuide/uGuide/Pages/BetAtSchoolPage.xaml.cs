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
            Browser.Source = "http://betatschool.htl-vil.local/";
        }

        protected override bool OnBackButtonPressed()
        {
            return true;
        }

        private async void BtnRefresh_OnClicked(object sender, EventArgs e)
        {
            try
            {
                var urlWebViewSource = this.Browser.Source as UrlWebViewSource;
                if (urlWebViewSource != null)
                {
                    this.Browser.Source = urlWebViewSource.Url;
                }
            }
            catch (Exception ex)
            {
                await DisplayAlert("Fehler", "Seite konnte nicht refreshed werden!\nGrund: " + ex.Message, "OK");
            }
        }
    }
}
