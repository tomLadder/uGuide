using System.ComponentModel;
using System.Runtime.CompilerServices;

namespace uGuide.Data.Models
{
    public class PredefinedAnswer
    {
        public string _Id { get; set; }
        public string Answer { get; set; }


        public PredefinedAnswer(string _id, string answer)
        {
            this._Id = _id;
            this.Answer = answer;
        }

        public PredefinedAnswer()
        {
        }

    }
}