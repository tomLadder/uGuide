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
using Android.Text;
using uGuide.Data;
using uGuide.Services;
using ZXing.Mobile;
using uGuide.Helpers;

namespace uGuide
{
    [Activity(MainLauncher = true, Icon = "@drawable/logo")]
    public class LoginActivity : Activity
    {
        Button btnLogin;
        Button btnLoginCancle;
        EditText txtUsername;
        EditText txtPassword;

        protected override void OnCreate(Bundle savedInstanceState)
        {
            MobileBarcodeScanner.Initialize(Application);
            base.OnCreate(savedInstanceState);
            SetContentView(Resource.Layout.LoginLayout);
            this.ActionBar.SetTitle(Resource.String.LoginLayoutTitle);
            FindAllViewsById();
            SetEventHandler();
        }

        private void FindAllViewsById()
        {
            btnLogin = FindViewById<Button>(Resource.Id.buttonLogin);
            btnLoginCancle = FindViewById<Button>(Resource.Id.buttonLoginCancle);
            txtUsername = FindViewById<EditText>(Resource.Id.editTextUsername);
            txtPassword = FindViewById<EditText>(Resource.Id.editTextPassword);
        }

        private void SetEventHandler() {
            btnLogin.Click += BtnLogin_Click;
            btnLoginCancle.Click += BtnLoginCancle_Click;
        }

        private void BtnLoginCancle_Click(object sender, EventArgs e)
        {
            txtPassword.Text = "";
            txtUsername.Text = "";
        }

        private async void BtnLogin_Click(object sender, EventArgs e)
        {
            btnLogin.Enabled = false;
            btnLoginCancle.Enabled = false;
            if (String.IsNullOrEmpty(txtPassword.Text) || String.IsNullOrEmpty(txtUsername.Text))
            {
                ShowAlertDialog("Error", "Please enter username and password!", "OK");
                btnLogin.Enabled = true;
                btnLoginCancle.Enabled = true;
            }
            else
            {
                User user = new User(txtUsername.Text, txtPassword.Text);
                if (await uGuideService.Instance.Login(user))
                {
                    ScanCode();
                }
                else
                {
                    ShowAlertDialog("Error", "Login was unsuccessful!", "OK");
                    btnLogin.Enabled = true;
                    btnLoginCancle.Enabled = true;
                }
            }
        }

        private async void ScanCode()
        {
            try
            {
                string result = await ScanHelper.ScanCode();

                if (result != null)
                {
                    var activity = new Intent(this, typeof(ShowStationActivity));
                    activity.PutExtra("StationId", result);
                    btnLogin.Enabled = true;
                    btnLoginCancle.Enabled = true;
                    StartActivity(activity);
                }
            }
            catch (Exception ex)
            {
                ShowAlertDialog("Error", "Scan was unsuccessful!", "OK");
            }
        }

        private void ShowAlertDialog(string title, string message, string posBtnMsg)
        {
            AlertDialog.Builder builder = new AlertDialog.Builder(this);
            builder.SetTitle(title);
            builder.SetMessage(message);
            builder.SetCancelable(false);
            builder.SetPositiveButton(posBtnMsg, delegate { });
            builder.Show();
        }
    }
}