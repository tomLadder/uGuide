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
    public partial class LoginPage : ContentPage
    {
        public LoginPage()
        {
            InitializeComponent();
            NavigationPage.SetHasNavigationBar(this, false);
            this.btnExit.IsEnabled = false;
            this.btnExit.IsVisible = false;
        }


        private void BtnExit_OnClicked(object sender, EventArgs e)
        {
            //TODO: If requested add Application Exit feature with Dependency Service
            //Call Dependency Service Close Application 
            //->
            //var closer = DependencyService.Get<ICloseApplication>();
            //if (closer != null)
            //    closer.closeApplication();
        }

        private async void BtnLogin_OnClicked(object sender, EventArgs e)
        {
            try
            {
                this.btnLogin.IsEnabled = false;
                if (String.IsNullOrEmpty(txtPassword.Text) || String.IsNullOrEmpty(txtUsername.Text))
                {
                    await DisplayAlert("Fehler", "Bitte geben Sie einen Benutzernamen und ein Passwort ein!", "OK");
                }
                else
                { 
                    User user = new User(txtUsername.Text, txtPassword.Text);
                    if (await uGuideService.Instance.Login(user))
                    {
                        bool hasTour = (await uGuideService.Instance.IsUserConductingTour()).Tour;
                        if (hasTour)
                        {
                            bool continueTour = await DisplayAlert("Bitte wählen Sie:", "Sie führen bereits eine Tour, wollen Sie diese fortsetzten?", "Ja", "Nein");
                            if (!continueTour)
                            {
                                await uGuideService.Instance.CancelTour();
                                await ContineToTour();
                            }
                            else
                            {
                                Database.Instance.UGuideMainPage.Children.Add(new StationHistory());
                                await ContineToTour();
                                await ScanHelper.ScanCode(Navigation);
                            }
                        }
                        else
                        {
                            await ContineToTour();
                        }
                    }
                    else
                    {
                        await DisplayAlert("Fehler", "Anmelden war nicht erfolgreich!", "OK");
                        btnLogin.IsEnabled = true;
                    }
                }
                this.btnLogin.IsEnabled = true;
                this.txtPassword.Text = "";
                this.txtUsername.Text = "";
            }
            catch (Exception ex)
            {
                await DisplayAlert("Fehler", "Anmelden war nicht erfolgreich! \nGrund: " + ex.Message, "OK");
                this.btnLogin.IsEnabled = true;
            }
        }

        private async Task ContineToTour()
        {
            await Navigation.PushAsync(new NewTourPage());
        }
        protected override bool OnBackButtonPressed()
        {
            return true;
        }

        protected override async void OnAppearing()
        {
            if (Database.Instance.CurrentUser != null && Navigation.NavigationStack.Count == 1)
            {
                await Navigation.PushAsync(new NewTourPage());
            }
        }
    }
}
