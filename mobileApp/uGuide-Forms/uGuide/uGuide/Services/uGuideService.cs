using Newtonsoft.Json;
using RestSharp;
using RestSharp.Portable;
using RestSharp.Portable.HttpClient;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Android.OS;
using Android.Test.Suitebuilder;
using Android.Views;
using Java.Nio.Channels;
using uGuide.Data;
using uGuide.Data.Models;
using uGuide.Data.Models.Wrappers;

namespace uGuide.Services
{
    public class uGuideService
    {
        private static uGuideService instance;
        private static RestClient myRestClient;
        private static string ServiceBaseUrl = "http://84.200.7.248:8000";
        private static string uGuideServiceUrl = ServiceBaseUrl + "/api/";


        private uGuideService()
        {
            myRestClient = new RestClient(uGuideServiceUrl);
            myRestClient.IgnoreResponseStatusCode = true;
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
                // await Test();
                //Get Challenge
                string challenge = await GetChallenge(user);
                //Get Token
                string token = await GetToken(user, challenge);
                //Set New user and Token
                user.AccessToken = token;
                Database.Instance.CurrentUser = user;
                ret = true;
            }
            catch (Exception)
            {
                throw;
            }
            return ret;
        }

        public async Task<Station> GetStation(string id)
        {
            RestRequest request = new RestRequest("station/{id}", Method.GET);
            request.AddHeader("Content-Type", "application/x-www-form-urlencoded");
            request.AddHeader("x-access-token", Database.Instance.CurrentUser.AccessToken);
            request.AddUrlSegment("id", id);
            var restResponse = await myRestClient.Execute(request);
            if (restResponse.StatusCode != System.Net.HttpStatusCode.OK)
            {
                ErrorCodeWrapper error = JsonConvert.DeserializeObject<ErrorCodeWrapper>(restResponse.Content);
                throw new Exception(error.Error);
            }
            else
            {
                return JsonConvert.DeserializeObject<Station>(restResponse.Content);
            }
        }

        private async Task<string> GetChallenge(User user)
        {
            RestRequest request = new RestRequest("challenge", Method.POST);
            request.AddHeader("Content-Type", "application/x-www-form-urlencoded");
            request.AddParameter("username", user.Username, ParameterType.GetOrPost);
            var restResponse = await myRestClient.Execute(request);
            if (restResponse.StatusCode != System.Net.HttpStatusCode.OK)
            {
                ErrorCodeWrapper error = JsonConvert.DeserializeObject<ErrorCodeWrapper>(restResponse.Content);
                throw new Exception(error.Error);
            }
            else
            {
                var d = JsonConvert.DeserializeObject<ChallengeResponse>(restResponse.Content);
                return d.Challenge;
            }
        }

        private async Task<string> GetToken(User user, string challenge)
        {
            RestRequest request = new RestRequest("auth", Method.POST);
            request.AddHeader("Content-Type", "application/x-www-form-urlencoded");
            request.AddParameter("username", user.Username, ParameterType.GetOrPost);
            request.AddParameter("password", AuthHelper.GenerateHash(user.Password, challenge), ParameterType.GetOrPost);
            var restResponse = await myRestClient.Execute(request);
            if (restResponse.StatusCode != System.Net.HttpStatusCode.OK)
            {
                ErrorCodeWrapper error = JsonConvert.DeserializeObject<ErrorCodeWrapper>(restResponse.Content);
                throw new Exception(error.Error);
            }
            else
            {
                var d = JsonConvert.DeserializeObject<TokenResponse>(restResponse.Content);
                return d.token;
            }
        }

        public async Task NotifyServer(string id)
        {
            RestRequest request = new RestRequest("notification/{id}", Method.POST);
            request.AddHeader("Content-Type", "application/json");
            request.AddHeader("x-access-token", Database.Instance.CurrentUser.AccessToken);
            request.AddUrlSegment("id", id);
            var restResponse = await myRestClient.Execute(request);
            if (restResponse.StatusCode != System.Net.HttpStatusCode.OK)
            {
                ErrorCodeWrapper error = JsonConvert.DeserializeObject<ErrorCodeWrapper>(restResponse.Content);
                throw new Exception(error.Error);
            }
        }

        public async Task SendVisitor()
        {
            RestRequest request = new RestRequest("visitor", Method.POST);
            request.AddHeader("Content-Type", "application/json");
            request.AddHeader("x-access-token", Database.Instance.CurrentUser.AccessToken);
            request.AddBody(Database.Instance.CurrentVisitor);
            var restResponse = await myRestClient.Execute(request);
            if (restResponse.StatusCode != System.Net.HttpStatusCode.OK)
            {
                ErrorCodeWrapper error = JsonConvert.DeserializeObject<ErrorCodeWrapper>(restResponse.Content);
                throw new Exception(error.Error);
            }
        }

        public async Task SendFeedback(Feedback feedback)
        {
            RestRequest request = new RestRequest("visitor/feedback", Method.POST);
            request.AddHeader("Content-Type", "application/json");
            request.AddHeader("x-access-token", Database.Instance.CurrentUser.AccessToken);
            request.AddBody(feedback);
            var restResponse = await myRestClient.Execute(request);
            if (restResponse.StatusCode != System.Net.HttpStatusCode.OK)
            {
                ErrorCodeWrapper error = JsonConvert.DeserializeObject<ErrorCodeWrapper>(restResponse.Content);
                throw new Exception(error.Error);
            }
        }

        public async Task GetPredefinedAnswers()
        {
            RestRequest request = new RestRequest("answer", Method.GET);
            request.AddHeader("Content-Type", "application/x-www-form-urlencoded");
            request.AddHeader("x-access-token", Database.Instance.CurrentUser.AccessToken);
            var restResponse = await myRestClient.Execute(request);
            if (restResponse.StatusCode != System.Net.HttpStatusCode.OK)
            {
                ErrorCodeWrapper error = JsonConvert.DeserializeObject<ErrorCodeWrapper>(restResponse.Content);
                throw new Exception(error.Error);
            }
            else
            {
                List<PredefinedAnswer> l = JsonConvert.DeserializeObject<List<PredefinedAnswer>>(restResponse.Content);
                Database.Instance.PredefinedAnswers = l;
            }
        }

        public async Task<HasTourResponse> IsUserConductingTour()
        {
            RestRequest request = new RestRequest("user/tour", Method.GET);
            request.AddHeader("Content-Type", "application/x-www-form-urlencoded");
            request.AddHeader("x-access-token", Database.Instance.CurrentUser.AccessToken);
            var restResponse = await myRestClient.Execute(request);
            if (restResponse.StatusCode != System.Net.HttpStatusCode.OK)
            {
                ErrorCodeWrapper error = JsonConvert.DeserializeObject<ErrorCodeWrapper>(restResponse.Content);
                throw new Exception(error.Error);
            }
            else
            {
                return JsonConvert.DeserializeObject<HasTourResponse>(restResponse.Content);
            }
        }

        public async Task CancelTour()
        {
            RestRequest request = new RestRequest("visitor/cancel", Method.POST);
            request.AddHeader("Content-Type", "application/json");
            request.AddHeader("x-access-token", Database.Instance.CurrentUser.AccessToken);
            var restResponse = await myRestClient.Execute(request);
            if (restResponse.StatusCode != System.Net.HttpStatusCode.OK)
            {
                ErrorCodeWrapper error = JsonConvert.DeserializeObject<ErrorCodeWrapper>(restResponse.Content);
                throw new Exception(error.Error);
            }
        }

        public async Task GetHistory()
        {
            await GetDoneStations();
            await GetToDoStations();
        }

        private async Task GetDoneStations()
        {
            RestRequest request = new RestRequest("visitor/done", Method.GET);
            request.AddHeader("Content-Type", "application/x-www-form-urlencoded");
            request.AddHeader("x-access-token", Database.Instance.CurrentUser.AccessToken);
            var restResponse = await myRestClient.Execute(request);
            if (restResponse.StatusCode != System.Net.HttpStatusCode.OK)
            {
                ErrorCodeWrapper error = JsonConvert.DeserializeObject<ErrorCodeWrapper>(restResponse.Content);
                throw new Exception(error.Error);
            }
            else
            {
                Database.Instance.DoneStations = JsonConvert.DeserializeObject<List<DoneStation>>(restResponse.Content);
            }
        }
        private async Task GetToDoStations()
        {
            RestRequest request = new RestRequest("visitor/todo", Method.GET);
            request.AddHeader("Content-Type", "application/x-www-form-urlencoded");
            request.AddHeader("x-access-token", Database.Instance.CurrentUser.AccessToken);
            var restResponse = await myRestClient.Execute(request);
            if (restResponse.StatusCode != System.Net.HttpStatusCode.OK)
            {
                ErrorCodeWrapper error = JsonConvert.DeserializeObject<ErrorCodeWrapper>(restResponse.Content);
                throw new Exception(error.Error);
            }
            else
            {
                Database.Instance.ToDoStations = JsonConvert.DeserializeObject<List<ToDoStation>>(restResponse.Content);
            }
        }
    }
}