using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using RestSharp.Portable;
using RestSharp.Portable.HttpClient;
using uGuide.Data.Models.Wrappers;
using Xamarin.Forms;
using ZXing.Mobile;

namespace uGuide.Pages
{
    public partial class MainPage : TabbedPage
    {
        public MainPage()
        {
            InitializeComponent();
            this.Children.Add(new uGuideMainPage());
            this.Children.Add(new BetAtSchoolPage());
        }
        protected override bool OnBackButtonPressed()
        {
            return true;
        }

    }
}
