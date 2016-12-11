﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using uGuide.Data;
using uGuide.Data.Models;
using uGuide.Helpers;
using Xamarin.Forms;
using ZXing.Net.Mobile.Forms;

namespace uGuide.Pages
{
    public partial class NewTourPage : ContentPage
    {
        private Gender selectedGender = Gender.Else;

        public NewTourPage()
        {
            InitializeComponent();
            NavigationPage.SetHasNavigationBar(this, false);
            NavigationPage.SetHasBackButton(this, false);
            this.lblFührung.FontSize = Device.GetNamedSize((NamedSize.Large), typeof(Label)) + 20;
        }

        public void MaleButtonClicked(object sender, EventArgs e)
        {
            this.btnFemale.IsEnabled = true;
            this.btnMale.IsEnabled = false;
            this.selectedGender = Gender.Male;
        }

        public void FemaleButtonClicked(object sender, EventArgs e)
        {
            this.btnFemale.IsEnabled = false;
            this.btnMale.IsEnabled = true;
            this.selectedGender = Gender.Female;
        }
        public async void StartTourButtonClicked(object sender, EventArgs e)
        {
            try
            {
                btnStartTour.IsEnabled = false;
                if (String.IsNullOrEmpty(txtPLZ.Text) || selectedGender == Gender.Else || txtPLZ.Text.Length != 4)
                {
                    await DisplayAlert("Fehler", "Bitte geben sie eine gültige PLZ (4 stellig) ein und wählen sie ein Geschlecht aus!","OK");
                    btnStartTour.IsEnabled = true;
                }
                else
                {
                    Database.Instance.CurrentVisitor = new Visitor(int.Parse(txtPLZ.Text), selectedGender);
                    //Call Backend and give new Visitor
                    ScanHelper.ScanCode(Navigation);
                    txtPLZ.Text = "";
                    btnFemale.IsEnabled = true;
                    btnMale.IsEnabled = true;
                    selectedGender = Gender.Else;
                    btnStartTour.IsEnabled = true;
                }
            }
            catch (Exception ex)
            {
                await DisplayAlert("Fehler", "Konnte keine neue Führung erstellen! Grund: " + ex.Message, "OK");
                btnStartTour.IsEnabled = true;
            }
        }
        public void LogoutButtonClicked(object sender, EventArgs e)
        {
            Database.Instance.CurrentUser = null;
            this.Navigation.PopToRootAsync();
        }
        
    }
}
