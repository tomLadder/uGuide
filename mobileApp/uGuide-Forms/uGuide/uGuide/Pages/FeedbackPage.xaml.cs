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
    using uGuide.Data.Models.Enumerations;
    using uGuide.Data.Models.Exceptions;

    public partial class FeedbackPage : ContentPage
    {
        private List<PredefinedAnswer> selectedAnswers;
        private SelectMultipleBasePage<PredefinedAnswer> multiPage;

        private FeedbackType selectedFeedbackType;

        public FeedbackPage()
        {
            InitializeComponent();
            this.lblFeedback.FontSize = Device.GetNamedSize(NamedSize.Large, typeof(Label)) + 20;
            NavigationPage.SetHasNavigationBar(this, false);

        }

        protected override void OnAppearing()
        {
            base.OnAppearing();

            if (multiPage != null)
            {
                selectedAnswers = multiPage.GetSelection();
            }
        }

        protected override bool OnBackButtonPressed()
        {
            return true;
        }

        private async void ButtonEndTourClicked(object sender, EventArgs e)
        {
            try
            {
                this.btnEndTour.IsEnabled = false;
                
                // If both buttons are active (nothing selected) 
                if (!(btnPos.IsEnabled && btnNeg.IsEnabled))
                {
                    string[] objectIds = new string[] { };
                    if (selectedAnswers != null)
                    {
                        objectIds = new string[selectedAnswers.Count];
                        for (int x = 0; x < selectedAnswers.Count; x++)
                        {
                            objectIds[x] = selectedAnswers[x].Id;
                        }
                    }

                    string optionalFeedback = edFeedback.Text;
                    if (string.IsNullOrEmpty(optionalFeedback))
                    {
                        optionalFeedback = "";
                    }

                    await uGuideService.Instance.SendFeedback(new Feedback(this.selectedFeedbackType, objectIds, optionalFeedback));
                    Database.Instance.CurrentVisitor = null;
                    Database.Instance.UGuideMainPage.Children.RemoveAt(1);


                    Navigation.InsertPageBefore(new NewTourPage(), this);
                    await Navigation.PopAsync();
                }
                else
                {
                    await DisplayAlert("Fehler", "Bitte wählen sie ein pos. oder neg. Feedback!", "OK");
                    this.btnEndTour.IsEnabled = true;
                }
            }
            catch (Exception ex)
            {
                await DisplayAlert("Fehler", "Feedback abgeben war nicht erfolgreich! \nGrund: " + ex.ToString(), "OK");
                this.btnEndTour.IsEnabled = true;
            }
        }

        private void ButtonNegClicked(object sender, EventArgs e)
        {
            this.btnPos.IsEnabled = true;
            this.btnNeg.IsEnabled = false;
            this.selectedFeedbackType = FeedbackType.Negative;
            this.btnNeg.BackgroundColor = Color.FromRgb(189, 189, 189);
            this.btnPos.BackgroundColor = Color.Transparent;
        }

        private void BtnPosClicked(object sender, EventArgs e)
        {
            this.btnPos.IsEnabled = false;
            this.btnNeg.IsEnabled = true;
            this.selectedFeedbackType = FeedbackType.Positive;
            this.btnPos.BackgroundColor = Color.FromRgb(189, 189, 189);
            this.btnNeg.BackgroundColor = Color.Transparent;
        }

        private async void BtnSelectAnswers_OnClicked(object sender, EventArgs e)
        {
            btnSelectAnswers.IsEnabled = false;
            try
            {
                await uGuideService.Instance.GetPredefinedAnswers();
                if (multiPage == null)
                {
                    multiPage = new SelectMultipleBasePage<PredefinedAnswer>(Database.Instance.PredefinedAnswers)
                    {
                        Title = "Antworten wählen:"
                    };
                }
                await Navigation.PushAsync(multiPage);
                btnSelectAnswers.IsEnabled = true;
            }
            catch (Exception ex)
            {
                btnSelectAnswers.IsEnabled = true;
                if (ex is BackendServiceException
                    && (((BackendServiceException)ex).errorCodeWrapper.ErrorType
                        == BackendErrorEnum.ErrorAuthFailedTokenWrong
                        || ((BackendServiceException)ex).errorCodeWrapper.ErrorType
                        == BackendErrorEnum.ErrorNoPredefinedAnswersSaved))
                {
                    await uGuideService.Instance.RenewToken();
                    await DisplayAlert("Fehler", "Fehler beim Antworten abfragen bitte versuchen Sie es erneut!", "OK");
                }
                else
                {
                    await DisplayAlert("Fehler", "Fehler beim Antworten abfragen! Grund: " + ex.ToString(), "OK");
                }
            }
        }
    }
}
