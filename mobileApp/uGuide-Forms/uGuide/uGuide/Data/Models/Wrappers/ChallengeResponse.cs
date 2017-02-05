using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace uGuide.Data.Models.Wrappers
{
    public class ChallengeResponse
    {
        public ChallengeResponse(string challenge, bool valid)
        {
            this.Challenge = challenge;
            this.Valid = valid;
        }

        public string Challenge { get; set; }

        public bool Valid { get; set; }
    }
}