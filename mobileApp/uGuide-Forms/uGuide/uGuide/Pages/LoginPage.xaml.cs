using System;
using System.Threading.Tasks;
using Android.App;
using uGuide.Data;
using uGuide.Helpers;
using uGuide.Services;
using Xamarin.Forms;
using ZXing.Net.Mobile.Forms;

namespace uGuide.Pages
{
    using System.Collections.Generic;

    using uGuide.Data.Models.Exceptions;
    using uGuide.Data.Models.Wrappers;

    public partial class LoginPage : ContentPage
    {
        public LoginPage()
        {
            InitializeComponent();
            NavigationPage.SetHasNavigationBar(this, false);
            this.btnExit.IsEnabled = false;
            this.btnExit.IsVisible = false;
            this.txtUsername.Text = string.Empty; //"sammer"; 
            this.txtPassword.Text = string.Empty; //"hello";  
            this.txtHostUrl.Text = "192.168.234.101:8000"; //"84.200.7.248:8000";
        }

        protected override bool OnBackButtonPressed()
        {
            return true;
        }

        private async void BtnLogin_OnClicked(object sender, EventArgs e)
        {
            try
            {
                this.btnLogin.IsEnabled = false;

                if (string.IsNullOrEmpty(txtUsername.Text))
                {
                    await DisplayAlert("Fehler", "Bitte geben Sie einen Benutzernamen ein!", "OK");
                }
                else if (string.IsNullOrEmpty(txtPassword.Text))
                {
                    await DisplayAlert("Fehler", "Bitte geben Sie ein Passwort ein!", "OK");
                }
                else if (string.IsNullOrEmpty(txtHostUrl.Text))
                {
                    await DisplayAlert("Fehler", "Bitte geben Sie eine IP + Port ein!", "OK");
                }
                else
                {
                    User user = new User(txtUsername.Text, txtPassword.Text);
                    uGuideService.Instance.ConnectToServer(txtHostUrl.Text);

                    if (await uGuideService.Instance.Login(user))
                    {
                        Database.Instance.PreLoadedStations = await uGuideService.Instance.GetAllStations();
                        await uGuideService.Instance.GetPredefinedAnswers();
                        int TourId = Database.Instance.CurrentUser.TourId;

                        if (TourId != null && TourId > 0)
                        {
                            bool continueTour = await DisplayAlert("Bitte wählen Sie:", "Sie führen bereits eine Tour, wollen Sie diese fortsetzten?", "Ja", "Nein");
                            if (!continueTour)
                            {
                                await uGuideService.Instance.CancelTour();
                                await Navigation.PushAsync(new NewTourPage());
                            }
                            else
                            {
                                await uGuideService.Instance.ContinueTour();
                                Database.Instance.UGuideMainPage.Children.Add(new StationHistory());
                                await Navigation.PushAsync(new ScanPage());
                            }
                        }
                        else
                        {
                            await Navigation.PushAsync(new NewTourPage());
                        }
                    }
                    else
                    {
                        await DisplayAlert("Fehler", "Anmelden war nicht erfolgreich!", "OK");
                        btnLogin.IsEnabled = true;
                    }
                }
                this.btnLogin.IsEnabled = true;
                this.txtPassword.Text = string.Empty;
                this.txtUsername.Text = string.Empty;
            }
            catch (Exception ex)
            {
                if (ex is BackendServiceException)
                {
                    await DisplayAlert("Fehler", "Anmelden war nicht erfolgreich! \nGrund: " + ex.ToString(), "OK");
                }
                else
                {
                    await DisplayAlert("Fehler", "Anmelden war nicht erfolgreich!", "OK");
                }
                this.btnLogin.IsEnabled = true;
            }
        }
    }
}
