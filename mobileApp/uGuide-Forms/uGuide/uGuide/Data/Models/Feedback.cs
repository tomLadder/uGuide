using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace uGuide.Data.Models
{
    public class Feedback
    {
        public string FeedbackText { get; set; }
        public Rating Rating { get; set; }

        public Feedback(string feedbackText, Rating rating)
        {
            FeedbackText = feedbackText;
            Rating = rating;
        }
    }
}
