using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using uGuide.Data;
using uGuide.Data.Models;
using uGuide.Services;
using Xamarin.Forms;

namespace uGuide.Pages
{
    public partial class FeedbackPage : ContentPage
    {
        private Rating selectedRating = Rating.Nothing;
        public FeedbackPage()
        {
            InitializeComponent();
            this.lblFeedback.FontSize = Device.GetNamedSize((NamedSize.Large), typeof(Label)) + 20;
            NavigationPage.SetHasNavigationBar(this, false);
        }

        private void ButtonEndTourClicked(object sender, EventArgs e)
        {
            if (selectedRating != Rating.Nothing) // Instead of Nothing as Enum preselect a Button ? prob way better solution
            {
                uGuideService.Instance.SendFeedback(new Feedback(edFeedback.Text, selectedRating));
                Database.Instance.CurrentVisitor = null;
                Navigation.PopAsync();
                Navigation.PopAsync();
            }
            else
            {
                DisplayAlert("Fehler", "Bitte wählen sie ein pos. oder neg. Feedback!", "OK");
            }
        }

        private void ButtonNegClicked(object sender, EventArgs e)
        {
            this.btnPos.IsEnabled = true;
            this.btnNeg.IsEnabled = false;
            this.selectedRating = Rating.Negative;
        }

        private void BtnPosClicked(object sender, EventArgs e)
        {
            this.btnPos.IsEnabled = false;
            this.btnNeg.IsEnabled = true;
            this.selectedRating = Rating.Positive;
        }
    }
}
