using Newtonsoft.Json;


namespace uGuide.Data.Models
{
    public class Station
    {
        public const string StartPoint = "RsGCqBdf7OSFtCLT6C6e";
        public const string EndPoint = "G6Tv0M316bjZEKJ6bNGA";
        public const string SyncPoint = "tELUfCVV5nlCJFZjO2zQ";


        public Station(string name, int grade, string subject, string description)
        {
            this.Name = name;
            this.Grade = grade;
            this.Subject = subject;
            this.Description = description;
        }

        [JsonConstructor]
        public Station(string id, string name, int grade, string subject, string description)
        {
            this.Id = id;
            this.Name = name;
            this.Grade = grade;
            this.Subject = subject;
            this.Description = description;
        }

        [JsonProperty("_id")]
        public string Id { get; set; }

        public string Name { get; set; }

        public int Grade { get; set; }

        public string Subject { get; set; }

        public string Description { get; set; }
    }
}