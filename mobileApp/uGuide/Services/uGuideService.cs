using Newtonsoft.Json;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using uGuide.Data;
using uGuide.Data.Models;
using uGuide.Data.Models.Wrapper;
using uGuide.Services.Interfaces;

namespace uGuide.Services
{
    public class uGuideService : IuGuideService
    {
        private static uGuideService instance;
        private static RestClient myRestClient;
        private static string ServiceBaseUrl = "http://84.200.7.248:8000";
        private static string uGuideServiceUrl = ServiceBaseUrl + "/api";


        private uGuideService()
        {
            myRestClient = new RestClient(uGuideServiceUrl);
        }

        public static uGuideService Instance
        {
            get
            {
                if (instance == null)
                {
                    instance = new uGuideService();
                }
                return instance;
            }
        }


        public async Task<bool> Login(User user)
        {
            bool ret = false;
            try
            {
                //Get Challenge
                string challenge = await GetChallenge(user);
                //Get Token
                string token = await GetToken(user, challenge);
                //Set New user and Token
                user.accessToken = token;
                Database.Instance.CurrentUser = user;
                ret = true;
            }
            catch (Exception ex)
            {
            }
            return ret;
        }

        public async Task<Station> GetStation(string id)
        {
            RestRequest request = new RestRequest("/station/{id}", Method.GET);
            request.AddHeader("Content-Type", "application/x-www-form-urlencoded");
            request.AddHeader("x-access-token", Database.Instance.CurrentUser.accessToken);
            request.AddUrlSegment("id", id);
            //Execute async for perfomance
            var restResponse = await myRestClient.ExecuteTaskAsync(request);
            if (restResponse.StatusCode != System.Net.HttpStatusCode.OK)
            {
                throw new Exception();
            }
            else
            {
                NotifyServer(id);
                return JsonConvert.DeserializeObject<Station>(restResponse.Content);
            }
        }

        private async Task<string> GetChallenge(User user)
        {
            RestRequest request = new RestRequest("/challenge", Method.POST);
            request.AddHeader("Content-Type", "application/x-www-form-urlencoded");
            request.AddParameter("username", user.username, ParameterType.GetOrPost);
            //Execute async for perfomance
            var restResponse = await myRestClient.ExecuteTaskAsync(request);
            if (restResponse.StatusCode != System.Net.HttpStatusCode.OK)
            {
                throw new Exception();
            }
            else
            {
                var d = JsonConvert.DeserializeObject<ChallengeResponse>(restResponse.Content);
                return d.challenge;
            }
        }

        private async Task<string> GetToken(User user, string challenge)
        {
            RestRequest request = new RestRequest("/auth", Method.POST);
            request.AddHeader("Content-Type", "application/x-www-form-urlencoded");
            request.AddParameter("username", user.username, ParameterType.GetOrPost);
            request.AddParameter("password", AuthHelper.GenerateHash(user.password,challenge), ParameterType.GetOrPost);
            //Execute async for perfomance
            var restResponse = await myRestClient.ExecuteTaskAsync(request);
            if (restResponse.StatusCode != System.Net.HttpStatusCode.OK)
            {
                throw new Exception();
            }
            else
            {
                var d = JsonConvert.DeserializeObject<TokenResponse>(restResponse.Content);
                return d.token;
            }
        }

        public async void NotifyServer(string id)
        {
            RestRequest request = new RestRequest("/notification/{id}", Method.POST);
            request.AddHeader("Content-Type", "application/x-www-form-urlencoded");
            request.AddHeader("x-access-token", Database.Instance.CurrentUser.accessToken);
            request.AddUrlSegment("id", id);
            //Execute async for perfomance
            var val = await myRestClient.ExecuteTaskAsync(request);
        }
    }
}