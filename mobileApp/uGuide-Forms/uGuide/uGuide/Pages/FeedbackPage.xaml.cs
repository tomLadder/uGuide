using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Multiselect;
using uGuide.Data;
using uGuide.Data.Models;
using uGuide.Services;
using Xamarin.Forms;

namespace uGuide.Pages
{
    public partial class FeedbackPage : ContentPage
    {
        private List<PredefinedAnswer> selectedAnswers;
        private SelectMultipleBasePage<PredefinedAnswer> multiPage;
        private FeedbackType _selectedFeedbackType;
        public FeedbackPage()
        {
            InitializeComponent();
            this.lblFeedback.FontSize = Device.GetNamedSize((NamedSize.Large), typeof(Label)) + 20;
            NavigationPage.SetHasNavigationBar(this, false);
            LoadAnswers();
        }

        private async void ButtonEndTourClicked(object sender, EventArgs e)
        {
            try
            {
                if (!(btnPos.IsEnabled && btnNeg.IsEnabled)) //If both buttons are active (nothing selected) 
                {
                    string[] objectIds = new string[] {};
                    if (selectedAnswers != null)
                    {
                        objectIds = new string[selectedAnswers.Count];
                        for (int x = 0; x < selectedAnswers.Count-1; x++)
                        {
                            objectIds[x] = selectedAnswers[x]._Id;
                        }
                    }
                    await uGuideService.Instance.SendFeedback(new Feedback(_selectedFeedbackType, objectIds, edFeedback.Text));
                    Database.Instance.CurrentVisitor = null;
                    Database.Instance.UGuideMainPage.Children.RemoveAt(1);
                    await Navigation.PopToRootAsync();
                }
                else
                {
                    await DisplayAlert("Fehler", "Bitte wählen sie ein pos. oder neg. Feedback!", "OK");
                }
            }
            catch (Exception ex)
            {
                await DisplayAlert("Fehler", "Feedback abgeben war nicht erfolgreich! \nGrund: " + ex.Message, "OK");
            }
        }

        private async void LoadAnswers()
        {
            await uGuideService.Instance.GetPredefinedAnswers();
        }

        private void ButtonNegClicked(object sender, EventArgs e)
        {
            this.btnPos.IsEnabled = true;
            this.btnNeg.IsEnabled = false;
            this._selectedFeedbackType = FeedbackType.Negative;
        }

        private void BtnPosClicked(object sender, EventArgs e)
        {
            this.btnPos.IsEnabled = false;
            this.btnNeg.IsEnabled = true;
            this._selectedFeedbackType = FeedbackType.Positive;
        }
        protected override bool OnBackButtonPressed()
        {
            return true;
        }

        private async void BtnSelectAnswers_OnClicked(object sender, EventArgs e)
        {

            if (multiPage == null)
                multiPage = new SelectMultipleBasePage<PredefinedAnswer>(Database.Instance.PredefinedAnswers) { Title = "Antworten wählen:" };
            await Navigation.PushAsync(multiPage);
        }
        protected override void OnAppearing()
        {
            base.OnAppearing();

            if (multiPage != null)
            {
                selectedAnswers = multiPage.GetSelection();
            }
        }
    }
}
