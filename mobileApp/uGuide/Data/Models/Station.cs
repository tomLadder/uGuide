using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;


namespace uGuide.Data
{
    public class Station
    {
        public string name { get; set; }
        public int grade { get; set; }
        public string subject { get; set; }
        public string description { get; set; }

        public Station(string name, int grade, string subject, string description)
        {
            this.name = name;
            this.grade = grade;
            this.subject = subject;
            this.description = description;
        }
    }
}