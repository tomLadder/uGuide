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
using uGuide.Services;
using uGuide.Data;
using ZXing.Mobile;
using uGuide.Helpers;

namespace uGuide
{
    [Activity(Label = "ShowStation")]
    public class ShowStationActivity : Activity
    {
        TableLayout tableStation;
        TableRow tableRowName;
        TableRow tableRowGrade;
        TableRow tableRowSubject;
        TableRow tableRowDescription;
        TextView textName;
        TextView textGrade;
        TextView textSubject;
        TextView textDescription;
        Button btnBack;

        protected override void OnCreate(Bundle savedInstanceState)
        {
            base.OnCreate(savedInstanceState);
            SetContentView(Resource.Layout.ShowStationLayout);
            this.ActionBar.SetTitle(Resource.String.ShowStationLayoutTitle);
            FindAllViewsById();
            SetEventHandler();
            FillTable(Intent.GetStringExtra("StationId") ?? "Data not available");
        }

        private async void FillTable(string tableId)
        {
            try
            {
                Station station = await uGuideService.Instance.GetStation(tableId);
                textName.Text = station.name;
                textGrade.Text = "Klasse: " + station.grade;
                textSubject.Text = station.subject;
                textDescription.Text = station.description;
            }
            catch (Exception ex)
            {
                ShowAlertDialog("Error", "Scan was unsuccessfull", "OK");
            }
        }

        private void SetEventHandler()
        {
            btnBack.Click += BtnBack_Click;
        }

        private void BtnBack_Click(object sender, EventArgs e)
        {
            ScanCode();
        }

        private void FindAllViewsById()
        {
            tableStation = FindViewById<TableLayout>(Resource.Id.tableLayoutStation);
            tableRowName = FindViewById<TableRow>(Resource.Id.tableRowName);
            tableRowGrade = FindViewById<TableRow>(Resource.Id.tableRowGrade);
            tableRowSubject = FindViewById<TableRow>(Resource.Id.tableRowSubject);
            tableRowDescription = FindViewById<TableRow>(Resource.Id.tableRowDescription);
            textName = FindViewById<TextView>(Resource.Id.textName);
            textGrade = FindViewById<TextView>(Resource.Id.textGrade);
            textSubject = FindViewById<TextView>(Resource.Id.textSubject);
            textDescription = FindViewById<TextView>(Resource.Id.textDescription);
            btnBack = FindViewById<Button>(Resource.Id.buttonBack);
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

        private async void ScanCode()
        {
            try
            {
                string result = await ScanHelper.ScanCode();
                if (result != null)
                {
                    FillTable(result);
                }
            }
            catch (Exception ex)
            {

            }
        }

        public override void OnBackPressed()
        {
            ScanCode();
        }
    }
}