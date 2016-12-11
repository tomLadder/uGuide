using System;
using Android.App;
using uGuide.Data;
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
            this.btnExit.IsEnabled = false;//TODO: If requested add Application Exit feature with Dependency Service
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
            if (String.IsNullOrEmpty(txtPassword.Text) || String.IsNullOrEmpty(txtUsername.Text))
            {
                await DisplayAlert("Fehler", "Bitte geben Sie einen Benutzernamen und ein Passwort ein!", "OK");
            }
            else
            {
                this.txtPassword.Text = "";
                this.txtUsername.Text = "";
                await Navigation.PushAsync(new NewTourPage());
                /*
                 * Service not online !
                User user = new User(txtUsername.Text, txtPassword.Text);
                if (await uGuideService.Instance.Login(user))
                {
                    ScanCode();
                }
                else
                {
                    await DisplayAlert("Error", "Login was unsuccessful!", "OK");
                    btnLogin.IsEnabled = true;
                    btnCancle.IsEnabled = true;
                }
                */
            }
        }
    }
}
