using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using uGuide.Data.Models;
using uGuide.Services;
using Xamarin.Forms;
using ZXing.Net.Mobile.Forms;

namespace uGuide.Pages
{
    public partial class ScanPage : ContentPage
    {
        ZXingScannerView zxing;
        ZXingDefaultOverlay overlay;

        public ScanPage() : base ()
        {
            NavigationPage.SetHasNavigationBar(this, false);
            NavigationPage.SetHasBackButton(this, false);
            zxing = new ZXingScannerView
            {
                HorizontalOptions = LayoutOptions.FillAndExpand,
                VerticalOptions = LayoutOptions.FillAndExpand
            };
            zxing.OnScanResult += (res) =>
                Device.BeginInvokeOnMainThread(async () => {
                    try
                    {

                        // Stop analysis until we navigate away so we don't keep reading barcodes
                        zxing.IsAnalyzing = false;
                        string result = res.ToString();
                        if (result != null)
                        {
                            if (result == Station.StartPoint)
                            {
                                await uGuideService.Instance.NotifyServer(result);
                                await DisplayAlert("Erfolg", "Startpunkt wurde gescannt!", "OK");
                                zxing.IsAnalyzing = true;
                            }
                            else if (result == Station.EndPoint)
                            {
                                await uGuideService.Instance.NotifyServer(Station.EndPoint);
                                Navigation.InsertPageBefore(new FeedbackPage(), this);
                                await Navigation.PopAsync();
                            }
                            else
                            {
                                await uGuideService.Instance.NotifyServer(result);
                                Navigation.InsertPageBefore(new StationDetailsPage(result), this);
                                await Navigation.PopAsync();

                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        await DisplayAlert("Fehler", ex.Message, "OK");
                        zxing.IsAnalyzing = true;
                    }
                });

            overlay = new ZXingDefaultOverlay
            {
                TopText = "Hold your phone up to the barcode",
                BottomText = "Scanning will happen automatically",
                ShowFlashButton = zxing.HasTorch,
            };
            overlay.FlashButtonClicked += (sender, e) => {
                zxing.IsTorchOn = !zxing.IsTorchOn;
            };
            var grid = new Grid
            {
                VerticalOptions = LayoutOptions.FillAndExpand,
                HorizontalOptions = LayoutOptions.FillAndExpand,
            };
            grid.Children.Add(zxing);
            grid.Children.Add(overlay);
            // The root page of your application
            Content = grid;
        }

        protected override void OnAppearing()
        {
            base.OnAppearing();
            zxing.IsScanning = true;
            zxing.IsAnalyzing = true;
        }

        protected override void OnDisappearing()
        {
            zxing.IsScanning = false;
            zxing.IsAnalyzing = true;
            base.OnDisappearing();
        }
        protected override bool OnBackButtonPressed()
        {
            return true;
        }
    }
}
