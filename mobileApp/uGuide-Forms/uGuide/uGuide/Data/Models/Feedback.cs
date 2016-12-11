using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace uGuide.Data.Models
{
    public class Feedback
    {
        public Rating FeedbackType { get; set; }
        public string[] ObjectIds { get; set; }
        public string FeedbackText { get; set; }

        public Feedback(Rating feedbackType, string[] objectIds, string feedbackText)
        {
            FeedbackType = feedbackType;
            ObjectIds = objectIds;
            FeedbackText = feedbackText;
        }
    }
}
