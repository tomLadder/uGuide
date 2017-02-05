using System.ComponentModel;
using System.Runtime.CompilerServices;

namespace uGuide.Data.Models
{
    using Newtonsoft.Json;

    public class PredefinedAnswer
    {
        public PredefinedAnswer(string id, string answer)
        {
            this.Id = id;
            this.Answer = answer;
        }

        public PredefinedAnswer()
        {
        }

        [JsonProperty("_id")]
        public string Id { get; set; }

        public string Answer { get; set; }
    }
}