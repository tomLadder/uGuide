namespace uGuide.Data.Models.Converters
{
    using System;

    using Newtonsoft.Json;
    using Newtonsoft.Json.Converters;

    public class MyDateTimeConverter : DateTimeConverterBase
    {
        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            DateTime dateTime = (DateTime)value;
            writer.WriteValue(Convert.ToInt64(dateTime.ToUniversalTime().Subtract(new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc)).TotalMilliseconds));
        }

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            return new DateTime(1970, 1, 1).AddMilliseconds((long)reader.Value);
        }
    }
}