using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using uGuide.Pages;
using Xamarin.Forms;
using ZXing.Net.Mobile.Forms;

namespace uGuide.Helpers
{
    static class ScanHelper
    {
        public static async void ScanCode(INavigation n)
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
                    Device.BeginInvokeOnMainThread(() =>
                    {
                       
                        n.PopAsync();
                        result = res.ToString();
                        if (result != null)
                        {
                            n.PushAsync(new StationDetailsPage(result));
                        }
                        if (n.NavigationStack[2].GetType() == typeof(StationDetailsPage))
                        {
                            n.RemovePage(n.NavigationStack[2]);
                        }
                    });
                };
                TimeSpan ts = new TimeSpan(0, 0, 0, 3, 0);
                Device.StartTimer(ts, () => {
                    if (scanPage.IsScanning)
                        scanPage.AutoFocus();
                    return true;
                });

                // Navigate to our scanner page
                await n.PushAsync(scanPage);
            }
            catch (Exception)
            {
                ScanCode(n);
            }
        }
    }
}
