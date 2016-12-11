using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;


namespace uGuide.Data
{
    public class Station
    {
        public string Name { get; set; }
        public int Grade { get; set; }
        public string Subject { get; set; }
        public string Description { get; set; }

        public Station(string name, int grade, string subject, string description)
        {
            this.Name = name;
            this.Grade = grade;
            this.Subject = subject;
            this.Description = description;
        }
    }
}