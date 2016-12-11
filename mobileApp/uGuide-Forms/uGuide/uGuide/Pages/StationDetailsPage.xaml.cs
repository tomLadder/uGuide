using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Android.Content.Res;
using uGuide.Data;
using uGuide.Helpers;
using uGuide.Services;
using Xamarin.Forms;

namespace uGuide.Pages
{
    public partial class StationDetailsPage : ContentPage
    {
        public StationDetailsPage(string stationID)
        {
            InitializeComponent();
            NavigationPage.SetHasNavigationBar(this, false);
            this.lblSubject.FontSize = Device.GetNamedSize((NamedSize.Large), typeof(Label)) + 5;
            this.lblDescription.FontSize = Device.GetNamedSize((NamedSize.Large), typeof(Label)) + 5;
            this.lblName.FontSize = Device.GetNamedSize((NamedSize.Large), typeof(Label)) + 5;
            this.lblGrade.FontSize = Device.GetNamedSize((NamedSize.Large), typeof(Label)) + 5;
            //FillDetails(stationID);  use when service online
        }

        private async void FillDetails(string stationID)
        {
            try
            {
                Station station = await uGuideService.Instance.GetStation(stationID);
                txtName.Text = station.Name;
                txtGrade.Text = "Klasse: " + station.Grade;
                txtSubject.Text = station.Subject;
                txtDescription.Text = station.Description;
            }
            catch (Exception ex)
            {
                await DisplayAlert("Fehler", "Scan war nicht erfolgreich", "OK");
            }
        }

        private void ButtonBackClicked(object sender, EventArgs e)
        {
            ScanHelper.ScanCode(Navigation);
        }

        private void ButtonStopTourClicked(object sender, EventArgs e)
        {
            Navigation.PushAsync(new FeedbackPage());
        }
    }
}
