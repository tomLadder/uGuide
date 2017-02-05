using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;


namespace uGuide.Data
{
    using Newtonsoft.Json;

    public class User
    {
        [JsonConstructor]
        public User(string username, string password)
        {
            this.Username = username;
            this.Password = password;
        }

        public User(string id, string username, string password)
        {
            this.Id = id;
            this.Username = username;
            this.Password = password;
        }

        [JsonProperty("_id")]
        public string Id { get; set; }
        [JsonIgnore]
        public string Username { get; set; }

        [JsonIgnore]
        public string Password { get; set; }

        [JsonIgnore]
        public int TourId { get; set; }

        [JsonIgnore]
        public string AccessToken { get; set; }
    }
}