using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using uGuide.Data.Models;
using uGuide.Pages;
using uGuide.Services;
using Xamarin.Forms;
using ZXing.Net.Mobile.Forms;

namespace uGuide.Helpers
{
    static class ScanHelper
    {/*
        public static async Task ScanCode(INavigation n)
        {
            try
            {
                string result = null;

                var scanPage = new ZXingScannerPage();
                NavigationPage.SetHasNavigationBar(scanPage, false);
                NavigationPage.SetHasBackButton(scanPage, false);
                scanPage.OnScanResult += (res) =>
                {
                    // Stop scanning
                    scanPage.IsScanning = false;
                    scanPage.IsAnalyzing = false;

                    // Pop the page and show the result
                    Device.BeginInvokeOnMainThread(async () =>
                    {
                        try
                        {
                            await n.PopAsync();
                            result = res.ToString();
                            if (result != null)
                            {
                                if (result == Station.StartPoint)
                                {
                                    await uGuideService.Instance.NotifyServer(result);
                                    await ScanCode(n);
                                }
                                else if (result == Station.EndPoint)
                                {
                                    await uGuideService.Instance.NotifyServer(Station.EndPoint);
                                    await n.PushAsync(new FeedbackPage());
                                }
                                else
                                {
                                    await uGuideService.Instance.NotifyServer(result);
                                    await n.PushAsync(new StationDetailsPage(result));
                                }
                            }
                            /*
                             * 
                             * See
                             * 
                             * 
                            if (n.NavigationStack?[2] != null)
                            {
                                if (n.NavigationStack[2].GetType() == typeof(StationDetailsPage))
                                {
                                    n.RemovePage(n.NavigationStack[2]);
                                } 
                            }
                        }
                        catch (Exception ex)
                        {
                            await scanPage.DisplayAlert("Fehler:", "Fehler beim scannen! \nGrund: " + ex.Message, "OK");
                            await ScanCode(n);
                        }
                    });
                };
                TimeSpan ts = new TimeSpan(0, 0, 0, 3, 0);
                Device.StartTimer(ts, () => {
                    if (scanPage.IsScanning)
                        scanPage.AutoFocus();
                    return true;
                });

                await n.PushAsync(scanPage);
            }
            catch (Exception)
            {
                throw;
            }
        }
    */
    }
}
