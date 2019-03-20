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
using System.Threading.Tasks;

namespace uGuide.Helpers
{
    class ScanHelper
    {
        public static async Task<string> ScanCode()
        {
            var scanner = new ZXing.Mobile.MobileBarcodeScanner();
            var result = await scanner.Scan();

            if (result == null)
            {
                throw new Exception();
            }
            return result.Text;
        }
    }
}