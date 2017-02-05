namespace uGuide.Data.Models
{
    using System.Collections.Generic;

    public class Tour
    {
        public Tour()
        {
            this.Notifications = new List<Notification>();
        }

        public User User { get; set; }

        public Visitor Visitor { get; set; }
        
        public List<Notification> Notifications { get; set; }

        public Feedback Feedback { get; set; }

        public long Start { get; set; }

        public long End { get; set; }
    }
}