using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;


namespace uGuide.Data.Models
{
    public class Station
    {
        public const string StartPoint = "RsGCqBdf7OSFtCLT6C6e";
        public const string EndPoint = "G6Tv0M316bjZEKJ6bNGA";
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