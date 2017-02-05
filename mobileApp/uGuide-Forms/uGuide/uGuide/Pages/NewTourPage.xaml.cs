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
using ZXing.Net.Mobile.Forms;

namespace uGuide.Pages
{
    using uGuide.Data.Models.Enumerations;

    public partial class NewTourPage : ContentPage
    {
        private Gender selectedGender;

        public NewTourPage()
        {
            InitializeComponent();
            NavigationPage.SetHasNavigationBar(this, false);
            NavigationPage.SetHasBackButton(this, false);
            this.lblFührung.FontSize = Device.GetNamedSize(NamedSize.Large, typeof(Label)) + 20;
        }

        public void MaleButtonClicked(object sender, EventArgs e)
        {
            this.btnFemale.IsEnabled = true;
            this.btnMale.IsEnabled = false;
            this.selectedGender = Gender.Male;
            this.btnFemale.BackgroundColor = Color.Transparent;
            this.btnMale.BackgroundColor = Color.FromRgb(189, 189, 189);
        }

        public void FemaleButtonClicked(object sender, EventArgs e)
        {
            this.btnFemale.IsEnabled = false;
            this.btnMale.IsEnabled = true;
            this.selectedGender = Gender.Female;
            this.btnFemale.BackgroundColor = Color.FromRgb(189, 189, 189);
            this.btnMale.BackgroundColor = Color.Transparent;
        }

        public async void StartTourButtonClicked(object sender, EventArgs e)
        {
            try
            {
                btnStartTour.IsEnabled = false;
                if (string.IsNullOrEmpty(txtPLZ.Text) || txtPLZ.Text.Length != 4)
                {
                    await DisplayAlert("Fehler", "Bitte geben Sie eine gültige PLZ (4 stellig) ein!", "OK");
                    btnStartTour.IsEnabled = true;
                }
                else if (this.btnFemale.IsEnabled && this.btnMale.IsEnabled)
                {
                    await DisplayAlert("Fehler", "Bitte wählen Sie ein Geschlecht!", "OK");
                    btnStartTour.IsEnabled = true;
                }
                else
                {
                    Database.Instance.CurrentTour = new Tour();
                    Database.Instance.CurrentTour.Visitor = new Visitor(int.Parse(txtPLZ.Text), selectedGender);
                    Database.Instance.CurrentTour.User = Database.Instance.CurrentUser;

                    await uGuideService.Instance.SaveTour();
                    await uGuideService.Instance.SaveUser();
                    Database.Instance.UGuideMainPage.Children.Add(new StationHistory());

                    txtPLZ.Text = string.Empty;
                    btnFemale.IsEnabled = true;
                    btnMale.IsEnabled = true;
                    btnStartTour.IsEnabled = true;

                    Navigation.InsertPageBefore(new ScanPage(), this);
                    await Navigation.PopAsync(true);
                }
            }
            catch (Exception ex)
            {
                await DisplayAlert("Fehler", "Konnte keine neue Führung erstellen! \nGrund: " + ex.ToString(), "OK");
                btnStartTour.IsEnabled = true;
            }
        }
        public void LogoutButtonClicked(object sender, EventArgs e)
        {
            Database.Instance.CurrentUser = null;
            this.Navigation.PopToRootAsync();
        }
        protected override bool OnBackButtonPressed()
        {
            return true;
        }
    }
}
