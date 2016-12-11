using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using uGuide.Data;
using System.Threading.Tasks;
using uGuide.Data.Models;

namespace uGuide.Services.Interfaces
{
    interface IuGuideService
    {
        Task<bool> Login(User u);

        Task<Station> GetStation(string id);

        void NotifyServer(string id);
    }
}