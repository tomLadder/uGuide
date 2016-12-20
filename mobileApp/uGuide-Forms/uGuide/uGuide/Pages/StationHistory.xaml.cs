using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using uGuide.Data;
using uGuide.Services;
using Xamarin.Forms;

namespace uGuide.Pages
{
    public partial class StationHistory : ContentPage
    {
        public StationHistory()
        {
            InitializeComponent();
            NavigationPage.SetHasNavigationBar(this, false);
        }

        protected override async void OnAppearing()
        {
            try
            {
                if (Database.Instance.CurrentVisitor != null)
                {
                    await uGuideService.Instance.GetHistory();
                    this.DoneList.ItemsSource = null;
                    this.DoneList.ItemsSource = null;
                    this.DoneList.ItemsSource = Database.Instance.DoneStations;
                    this.ToDoList.ItemsSource = Database.Instance.ToDoStations;
                }
                else
                {
                   throw new Exception("No Visitor!");
                }
            }
            catch (Exception ex)
            {
                await DisplayAlert("Fehler", "Historyabfrage war nicht erfolgreich! \nGrund: " + ex.Message, "OK");
            }
        }
        protected override bool OnBackButtonPressed()
        {
            return true;
        }
    }
}
