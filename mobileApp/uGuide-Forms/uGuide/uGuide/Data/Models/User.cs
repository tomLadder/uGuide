using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;


namespace uGuide.Data
{
    public class User
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public string AccessToken { get; set; }

        public User(string username, string  password) {
            this.Username = username;
            this.Password = password;
        }
    }
}