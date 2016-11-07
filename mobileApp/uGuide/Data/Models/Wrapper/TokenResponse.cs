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

namespace uGuide.Data.Models.Wrapper
{
    class TokenResponse
    {
        public class User
        {
            public string _id;
            public string username;
            public string type;
        } 

        public string token;

        public User user;
        
    }
}