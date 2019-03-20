using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;


namespace uGuide.Data
{
    public class User
    {
        public string username { get; set; }
        public string password { get; set; }
        public string accessToken { get; set; }

        public User(string username, string  password) {
            this.username = username;
            this.password = password;
        }
    }
}