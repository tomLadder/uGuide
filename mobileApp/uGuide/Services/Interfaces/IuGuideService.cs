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
using uGuide.Data;
using System.Threading.Tasks;

namespace uGuide.Services.Interfaces
{
    interface IuGuideService
    {
        Task<bool> Login(User u);

        Task<Station> GetStation(string id);

        void NotifyServer(string id);
    }
}