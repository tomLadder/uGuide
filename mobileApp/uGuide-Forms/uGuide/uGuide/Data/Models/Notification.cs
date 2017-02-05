using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace uGuide.Data.Models
{
    using Newtonsoft.Json;
    using Newtonsoft.Json.Converters;

    using uGuide.Data.Models.Converters;

    public class Notification
    {
        [JsonConstructor]
        public Notification(DateTime time, string id)
        {
            this.Time = time;
            this.Id = id;
        }

        public Notification(string id)
        {
            this.Id = id;
        }

        [JsonConverter(typeof(MyDateTimeConverter))]
        public DateTime Time { get; set; }

        public string Id { get; set; }

        public override bool Equals(object obj)
        {
            if (ReferenceEquals(null, obj)) return false;
            if (ReferenceEquals(this, obj)) return true;
            if (obj.GetType() != this.GetType()) return false;
            return Equals((Notification)obj);
        }

        public override int GetHashCode()
        {
            return (this.Id != null ? this.Id.GetHashCode() : 0);
        }

        protected bool Equals(Notification other)
        {
            return string.Equals(this.Id, other.Id);
        }
    }
}
