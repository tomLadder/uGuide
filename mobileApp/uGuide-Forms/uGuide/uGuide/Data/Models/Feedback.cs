using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace uGuide.Data.Models
{
    using Newtonsoft.Json;

    using uGuide.Data.Models.Enumerations;

    public class Feedback
    {
        [JsonConstructor]
        public Feedback(FeedbackType feedbackType, string[] predefinedAnswers, string optionalAnswer)
        {
            this.FeedbackType = feedbackType;
            this.PredefinedAnswers = predefinedAnswers;
            this.OptionalAnswer = optionalAnswer;
        }

        public Feedback(FeedbackType feedbackType)
        {
            this.FeedbackType = feedbackType;
        }

        public FeedbackType FeedbackType { get; set; }

        public string[] PredefinedAnswers { get; set; }

        public string OptionalAnswer { get; set; }
    }
}
