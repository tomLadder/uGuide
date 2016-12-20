using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace uGuide.Data.Models.Wrappers
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