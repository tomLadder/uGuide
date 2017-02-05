using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace uGuide.Data.Models.Wrappers
{
    using Newtonsoft.Json;

    public class TokenResponse
    {
        public class User
        {
            [JsonProperty("_id")]
            public string Id { get; set; }

            public string Username { get; set; }

            public string Type { get; set; }
        } 

        public string Token { get; set; }

        public User user { get; set; }
        
    }
}