using Newtonsoft.Json;

namespace uGuide.Data.Models
{
    using uGuide.Data.Models.Enumerations;

    public class Visitor
    {   
        [JsonConstructor]
        public Visitor()
        {
        }

        public Visitor(int zipCode, Gender gender)
        {
            this.ZipCode = zipCode;
            this.Gender = gender;
        }

        public int ZipCode { get; set; }

        public Gender Gender { get; set; }
    }
}