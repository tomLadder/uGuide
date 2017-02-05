using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace uGuide.Data.Models.Wrappers
{
    using Newtonsoft.Json;

    public class OccupancyWrapper
    {

        public OccupancyWrapper(string id)
        {
            this.Id = id;
        }

        [JsonProperty("_id")]
        public string Id { get; set; }
    }
}
