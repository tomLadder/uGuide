using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using uGuide.Data;
using Xamarin.Forms;

namespace uGuide.Pages
{
    public partial class uGuideMainPage : TabbedPage
    {
        public uGuideMainPage()
        {
            InitializeComponent();
            NavigationPage p = (new NavigationPage(new LoginPage()) {Title = "Führung"});
            NavigationPage.SetHasBackButton(p, false);
            NavigationPage.SetHasNavigationBar(p, false);
            this.Children.Add(p);
            Database.Instance.UGuideMainPage = this;
        }
    }
}
