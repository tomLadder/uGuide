using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using uGuide.Data;
using uGuide.Data.Models;
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
            FillDetails(stationID);
        }

        private async void FillDetails(string stationID)
        {
            try
            {
                Station station = await uGuideService.Instance.GetStation(stationID);
                txtName.Text = station.Name;
                txtGrade.Text = station.Grade.ToString();
                txtSubject.Text = station.Subject;
                txtDescription.Text = station.Description;
            }
            catch (Exception ex)
            {
                await DisplayAlert("Fehler", "Stationsabfrage war nicht erfolgreich! \nGrund: " + ex.Message, "OK");
                Navigation.InsertPageBefore(new ScanPage(), this);
                await Navigation.PopAsync();
            }
        }

        protected override bool OnBackButtonPressed()
        {
            return true;
        }

        private async void BtnStopTour_OnClicked(object sender, EventArgs e)
        {
            try
            {
                this.btnBack.IsEnabled = false;
                this.btnStopTour.IsEnabled = false;
                bool cancelTour =
                    await DisplayAlert("Bitte wählen Sie:", "Wollen Sie wirklich die Führung beenden?", "Ja", "Nein");
                if (cancelTour)
                {
                    await uGuideService.Instance.CancelTour();
                    Database.Instance.UGuideMainPage.Children.RemoveAt(1);
                    Navigation.InsertPageBefore(new NewTourPage(), this);
                    await Navigation.PopAsync();
                }
                else
                {
                    this.btnBack.IsEnabled = true;
                    this.btnStopTour.IsEnabled = true;
                }
            }
            catch (Exception ex)
            {
                this.btnBack.IsEnabled = true;
                this.btnStopTour.IsEnabled = true;
                await DisplayAlert("Fehler:", "Führung konnte nicht beendet werden! \nGrund: " + ex.Message, "OK");
            }
        }

        private async void BtnBack_OnClicked(object sender, EventArgs e)
        {
            this.btnBack.IsEnabled = false;
            this.btnStopTour.IsEnabled = false;
            Navigation.InsertPageBefore(new ScanPage(), this);
            await Navigation.PopAsync();
        }
    }
}
