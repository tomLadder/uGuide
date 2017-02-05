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
    using System.Globalization;
    using uGuide.Data.Models;
    using uGuide.Data.Models.Wrappers;
    using uGuide.Helpers;

    public partial class StationHistory : ContentPage
    {
        public StationHistory()
        {
            InitializeComponent();
            NavigationPage.SetHasNavigationBar(this, false);

            var toDoStationTemplate = new DataTemplate(() =>
            {
                var nameLabel = new Label { FontAttributes = FontAttributes.Bold , HorizontalTextAlignment = TextAlignment.Start, VerticalTextAlignment = TextAlignment.Center};
                nameLabel.SetBinding(Label.TextProperty, "Name");
                nameLabel.SetBinding(BackgroundColorProperty, new Binding("OccupationStatus", converter: new OccupationStatusValueConverter()));
                return new ViewCell { View = nameLabel };
            });

            var doneStationTemplate = new DataTemplate(() =>
                {
                    StackLayout wrapperLayout = new StackLayout();
                    wrapperLayout.Orientation = StackOrientation.Horizontal;
                    var nameLabel = new Label { FontAttributes = FontAttributes.Bold };
                    var dateLabel = new Label { FontAttributes = FontAttributes.Bold };
                    nameLabel.SetBinding(Label.TextProperty, "Name");
                    dateLabel.SetBinding(Label.TextProperty, "Time");
                    nameLabel.HorizontalOptions  = LayoutOptions.StartAndExpand;
                    dateLabel.HorizontalOptions = LayoutOptions.EndAndExpand;
                    nameLabel.VerticalOptions = LayoutOptions.CenterAndExpand;
                    dateLabel.VerticalOptions = LayoutOptions.CenterAndExpand;
                    wrapperLayout.Children.Add(nameLabel);
                    wrapperLayout.Children.Add(dateLabel);
                    return new ViewCell { View = wrapperLayout };
                });
            this.ToDoList.ItemTemplate = toDoStationTemplate;
            this.DoneList.ItemTemplate = doneStationTemplate;
        }

        protected override async void OnAppearing()
        {
            try
            {
                await uGuideService.Instance.GetHistory();
                await uGuideService.Instance.GetOccupancy();
                this.DoneList.ItemsSource = null;
                this.DoneList.ItemsSource = null;
                this.DoneList.ItemsSource = Database.Instance.DoneStations;
                this.ToDoList.ItemsSource = Database.Instance.ToDoStations;
            }
            catch (Exception ex)
            {
                await DisplayAlert("Fehler", "Historyabfrage war nicht erfolgreich! \nGrund: " + ex.ToString(), "OK");
            }
        }
        protected override bool OnBackButtonPressed()
        {
            return true;
        }
    }
}
