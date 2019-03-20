using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace uGuide.Data.Models
{
    public class Feedback
    {
        public FeedbackType FeedbackType { get; set; }
        public string[] PredefinedAnswers { get; set; }
        public string OptionalAnswer { get; set; }

        public Feedback(FeedbackType feedbackType, string[] predefinedAnswers, string optionalAnswer)
        {
            FeedbackType = feedbackType;
            PredefinedAnswers = predefinedAnswers;
            OptionalAnswer = optionalAnswer;
        }

        public Feedback(FeedbackType feedbackType)
        {
            FeedbackType = feedbackType;
        }
    }
}
