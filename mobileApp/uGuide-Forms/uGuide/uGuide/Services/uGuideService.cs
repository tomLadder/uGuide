using Newtonsoft.Json;
using RestSharp;
using RestSharp.Portable;
using RestSharp.Portable.HttpClient;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Android.OS;
using Android.Test.Suitebuilder;
using Android.Views;
using Java.Net;
using Java.Nio.Channels;
using uGuide.Data;
using uGuide.Data.Models;
using uGuide.Data.Models.Exceptions;
using uGuide.Data.Models.Wrappers;

namespace uGuide.Services
{
    using Android.Database;
    using Android.Graphics;
    using Javax.Net.Ssl;
    using Newtonsoft.Json.Converters;
    using SQLite;
    using uGuide.Data.Models.Enumerations;
    using uGuide.Helpers;

    public class uGuideService
    {
        private static uGuideService instance;
        private static RestClient myRestClient;

        // Obsolete due to input field with ip
        //// private static string serviceBaseUrl = "http://84.200.7.248:8000";
        //// private static string uGuideServiceUrl = serviceBaseUrl + "/api/";


        private uGuideService()
        {
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


        /// <summary>
        /// Tries to login with the provided user and get a valid token from the backend for the provided user
        /// </summary>
        /// <param name="user"> User which tries to login </param>
        /// <returns>A task with the success boolean of the login</returns>
        public async Task<bool> Login(User user)
        {
            bool loginOutcome = false;
            bool online = true;
            try
            {

                // Backend send challenge for our username, we hash our password with the callenge and send it to get a token
                // If the password is not correc or the username doesn't exists the calls throw a backendExcpetion
                string challenge = await GetChallenge(user);
                TokenResponse res = await GetToken(user, challenge);

                // Check if user is allowed access to the app (3 -> guide)
                if (!res.user.Type.Equals("3"))
                {
                    throw new BackendServiceException(new ErrorCodeWrapper(400, "Wrong Credentials", BackendErrorEnum.ErrorNotAuthorized));
                }

                // Set new user and token
                user.AccessToken = res.Token;
                user.Id = res.user.Id;
                Database.Instance.CurrentUser = user;
            }
            catch (Exception e)
            {
                if (e is BackendServiceException)
                {
                    // Rethrow to handle outside
                    // Could be improved by stuffing the backendServiceException error msg in a generic expcetion to ease the handling in the upper layers
                    throw;
                }
                else if (e is SQLiteException || e is SQLException)
                {
                    throw;
                }
                else
                {
                    online = false;
                }
            }

            // TmpUser used for offline saved user
            OfflineUserItem oldOfflineUser = null;
            if (await OfflineDatabase.Instance.CountSavedUsers() > 0)
            {
                oldOfflineUser = await OfflineDatabase.Instance.GetUserAsync();
            }

            // Checks if the calls above were successful
            if (online)
            {
                // The calls were successful and a new user is available and has to be saved
                if (oldOfflineUser != null)
                {
                    // Delete the old user
                    await OfflineDatabase.Instance.DeleteUserAsync(oldOfflineUser);

                    // BUG? : Only set tourId if the old and new user are the same? 
                    user.TourId = oldOfflineUser.TourId;
                }

                // Creating the offlineItem and saving it
                OfflineUserItem newOfflineUser = new OfflineUserItem();
                newOfflineUser.IdDb = 0;
                newOfflineUser.Id = user.Id;
                newOfflineUser.AccessToken = user.AccessToken;
                newOfflineUser.Password = user.Password;
                newOfflineUser.Username = user.Username;
                newOfflineUser.TourId = user.TourId;
                await OfflineDatabase.Instance.SaveUserAsync(newOfflineUser);

                // Login was successful
                loginOutcome = true;
            }
            else
            {
                // Calls were not successful 
                if (oldOfflineUser != null)
                {
                    // Check if user is saved
                    if (user.Username == oldOfflineUser.Username && user.Password == oldOfflineUser.Password)
                    {
                        Database.Instance.CurrentUser = user;
                        Database.Instance.CurrentUser.Id = oldOfflineUser.Id;
                        Database.Instance.CurrentUser.TourId = oldOfflineUser.TourId;
                        Database.Instance.CurrentUser.AccessToken = oldOfflineUser.AccessToken;
                        loginOutcome = true;
                    }
                }
                else
                {
                    // We need at least 1 successful login to proceed, no user was ever saved in this case
                    throw new Exception("Kein Nutzer gespeichert, bitte loggen sie sich mit Internzugriff ein!");
                }
            }

            return loginOutcome;
        }


        /// <summary>
        /// Restores the backend token
        /// </summary>
        /// <returns>
        /// The <see cref="Task"/>.
        /// </returns>
        public async Task RenewToken()
        {
            try
            {
                User user = Database.Instance.CurrentUser;

                string challenge = await GetChallenge(user);
                TokenResponse res = await GetToken(user, challenge);

                // Set new user and token
                user.AccessToken = res.Token;
                user.Id = res.user.Id;
                Database.Instance.CurrentUser = user;
                await this.SaveUser();
            }
            catch (Exception ex)
            {
                // ignored
            }
        }

        /// <summary>
        /// Connects to the server of provided IP and port 
        /// </summary>
        /// <param name="host"> String with the IP and port of the backend like "192.168.200.1:8000" </param>
        public void ConnectToServer(string host)
        {
            try
            {
                // Initializes the client with the provided host address
                myRestClient = new RestClient("http://" + host + "/api/");

                // If enabled a unsuccessful call will throw an exception (HttpStatus: 500,400) 
                myRestClient.IgnoreResponseStatusCode = true;

                // Sets the timeout for a call to the backend, upon timeout an exception is thrown
                myRestClient.Timeout = new TimeSpan(0, 0, 2);
            }
            catch (Exception e)
            {
                // Possible handling if desired
                throw;
            }
        }

        /// <summary>
        /// Gets the station with the provided id from the list of the cached stations 
        /// </summary>
        /// <param name="id"> Id of the wanted station </param>
        /// <returns> The wanted station </returns>
        public Station GetPreloadedStation(string id)
        {
            // No station found returns null
            Station returnStation = null;
            try
            {
                // Check if we have cached stations
                if (Database.Instance.PreLoadedStations != null)
                {
                    // Search for the wanted station
                    Station station = Database.Instance.PreLoadedStations.Find(x => x.Id == id);
                    if (station != null)
                    {
                        returnStation = station;
                    }
                }
            }
            catch (Exception ex)
            {
                // ignored
            }
            return returnStation;
        }

        /// <summary>
        /// Gets the wanted station from the backend
        /// </summary>
        /// <param name="id"> Id of the wanted station </param>
        /// <returns> A task with the wanted station </returns>
        public async Task<Station> GetStation(string id)
        {
            // Return null if no station was found
            Station returnStation = null;
            bool online = true;

            try
            {
                // Try to get it from the server
                RestRequest request = new RestRequest("station/{id}", Method.GET);
                request.AddHeader("Content-Type", "application/x-www-form-urlencoded");
                request.AddHeader("x-access-token", Database.Instance.CurrentUser.AccessToken);
                request.AddUrlSegment("id", id);
                var restResponse = await myRestClient.Execute(request);

                if (restResponse.StatusCode != System.Net.HttpStatusCode.OK)
                {
                    // When the server returns an error throw it with our custom exception
                    ErrorCodeWrapper error = JsonConvert.DeserializeObject<ErrorCodeWrapper>(restResponse.Content);
                    throw new BackendServiceException(error);
                }
                else
                {
                    // When the server returns success, just deserialize the provided station
                    returnStation = JsonConvert.DeserializeObject<Station>(restResponse.Content);
                }
            }
            catch (Exception ex)
            {
                if (ex is BackendServiceException)
                {
                    // BUG: Should only be called when server returns error "TokenInvalid" or "NoTokenProvided" and not on every service call error
                    // Works but generates network traffic
                    await this.RenewToken();
                    throw;
                }
                else
                {
                    // Better to check if the exception is really the one which gets thrown on a service call timeout or fail
                    online = false;
                }
            }

            if (!online)
            {
                // When the service call fails, try to check if the station is already cached
                List<Station> preLoadedStations = Database.Instance.PreLoadedStations;
                if (preLoadedStations != null)
                {
                    Station station = preLoadedStations.Find(x => x.Id == id);
                    if (station != null)
                    {
                        returnStation = station;
                    }
                    else
                    {
                        // If the station is neither loaded from the backend nor already cached throw an new exception
                        throw new BackendServiceException(new ErrorCodeWrapper(400, "error", BackendErrorEnum.ErrorNoStationsSaved));
                    }
                }
                else
                {
                    // If the station is neither loaded from the backend nor already cached throw an new exception
                    throw new BackendServiceException(new ErrorCodeWrapper(400, "error", BackendErrorEnum.ErrorNoStationsSaved));
                }
            }

            return returnStation;
        }

        /// <summary>
        /// Returns a list of all stations 
        /// </summary>
        /// <returns> A task with a list of all stations </returns>
        public async Task<List<Station>> GetAllStations()
        {
            List<Station> returnStations = null;
            bool online = true;

            try
            {
                // Try to get them from the server
                RestRequest request = new RestRequest("station", Method.GET);
                request.AddHeader("Content-Type", "application/x-www-form-urlencoded");
                request.AddHeader("x-access-token", Database.Instance.CurrentUser.AccessToken);
                var restResponse = await myRestClient.Execute(request);

                if (restResponse.StatusCode != System.Net.HttpStatusCode.OK)
                {
                    // When the server returns an error throw it with our custom exception
                    ErrorCodeWrapper error = JsonConvert.DeserializeObject<ErrorCodeWrapper>(restResponse.Content);
                    throw new BackendServiceException(error);
                }
                else
                {
                    // Else just deserialize
                    returnStations = JsonConvert.DeserializeObject<List<Station>>(restResponse.Content);
                }
            }
            catch (Exception e)
            {
                if (e is BackendServiceException)
                {
                    // BUG: Should only be called when server returns error "TokenInvalid" or "NoTokenProvided" and not on every service call error
                    // Works but generates network traffic
                    await this.RenewToken();
                    throw;
                }
                else if (e is SQLiteException || e is SQLException)
                {
                    throw;
                }
                else
                {
                    online = false;
                }
            }

            List<OfflineStationItem> stationsOffline = new List<OfflineStationItem>();
            if (online)
            {
                // When the calls were successful delete all old stations and save the new ones 
                // Clear the cache 
                await OfflineDatabase.Instance.DeleteAllStationsAsync();
                foreach (Station s in returnStations)
                {
                    OfflineStationItem item = new OfflineStationItem();
                    item.Id = s.Id;
                    item.Description = s.Description;
                    item.Grade = s.Grade;
                    item.Name = s.Name;
                    item.Subject = s.Subject;
                    item.IdDb = 0;
                    stationsOffline.Add(item);
                }

                // Save the stations
                await OfflineDatabase.Instance.SaveStationsAsync(stationsOffline);
            }
            else
            {
                // Whe the calls failed, try to load cached data
                if (await OfflineDatabase.Instance.CountSavedStationsAsync() > 0)
                {
                    stationsOffline = await OfflineDatabase.Instance.GetStationsAsync();
                    if (stationsOffline != null && stationsOffline.Count > 0)
                    {
                        returnStations = new List<Station>();
                        foreach (OfflineStationItem s in stationsOffline)
                        {
                            Station item = new Station(s.Id, s.Name, s.Grade, s.Subject, s.Description);
                            returnStations.Add(item);
                        }
                    }
                }
                else
                {
                    // Should neither work, throw a new exception
                    throw new BackendServiceException(new ErrorCodeWrapper(400, "error", BackendErrorEnum.ErrorNoStationsSaved));
                }

            }
            return returnStations;
        }

        /// <summary>
        /// Notifies the server of the visit at the provided station id
        /// </summary>
        /// <param name="id"> Id of the visited station </param>
        /// <returns> A task for the completion of the method </returns>
        public async Task NotifyServer(string id)
        {
            try
            {
                // Gets all current notification
                List<Notification> notifications = Database.Instance.CurrentTour.Notifications;

                // Checks if either start or end point were scanned before
                bool startPointScanned = notifications.Contains(new Notification(DateTime.Now, Station.StartPoint));
                bool endPointScanned = notifications.Contains(new Notification(DateTime.Now, Station.EndPoint));

                // Checks if start or end point were scanned and current station is either start or end point
                if ((id == Station.StartPoint && !startPointScanned) || (id == Station.EndPoint && !endPointScanned) || (id != Station.EndPoint && id != Station.StartPoint))
                {
                    // Checks if station is not startPoint but startPoint was not scanned before
                    if (id != Station.StartPoint && !startPointScanned)
                    {
                        // Throw error in this case (Scanning anything else before the startPoint the startPoint was scanned isn't allowed)
                        throw new BackendServiceException(new ErrorCodeWrapper(400, "fehler", BackendErrorEnum.ErrorStartpointNotScanned));
                    }
                    else
                    {
                        // Bug: Possible TimeZone Mishap
                        // Bug: Currently there is a mishap concerning this application sending dates with a false timezone (1 hour advanced times)
                        if (id == Station.StartPoint)
                        {
                            // If the startPoint was scanned set the value for the startTime in the currentTour item to the milliseconds of the current time
                            Database.Instance.CurrentTour.Start =
                                Convert.ToInt64(
                                    DateTime.Now.ToUniversalTime()
                                        .Subtract(new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc))
                                        .TotalMilliseconds);
                            
                            // Add the notification to the tours notification list
                            Database.Instance.CurrentTour.Notifications.Add(new Notification(DateTime.Now, id));
                        }
                        else if (id == Station.EndPoint)
                        {
                            // If the endPoint was scanned set the value for the endTime in the currentTour item to the milliseconds of the current time
                            Database.Instance.CurrentTour.End =
                                Convert.ToInt64(
                                    DateTime.Now.ToUniversalTime()
                                        .Subtract(new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc))
                                        .TotalMilliseconds);

                            // Add the notification to the tours notification list
                            Database.Instance.CurrentTour.Notifications.Add(new Notification(DateTime.Now, id));
                        }
                        else
                        {
                            // Add the notification to the tours notification list
                            Database.Instance.CurrentTour.Notifications.Add(new Notification(DateTime.Now, id));
                        }

                        // Save the tour offline
                        await this.SaveTour();

                        // Always try to send notification for our realtime functionality (live map ect.) (best effort),  if it doesn't work we can't do anything about it
                        NotificationWrapper notification = new NotificationWrapper();
                        notification.Guide = Database.Instance.CurrentUser.Id;
                        notification.Station = id;

                        RestRequest request = new RestRequest("notification", Method.POST);
                        request.AddHeader("Content-Type", "application/json");
                        request.AddHeader("x-access-token", Database.Instance.CurrentUser.AccessToken);
                        request.AddBody(notification);
                        var restResponse = await myRestClient.Execute(request);
                    }
                }
                else
                {
                    // If either start and end point were scanned before and were scanned now throw exception for either
                    if (id == Station.StartPoint)
                    {
                        throw new BackendServiceException(new ErrorCodeWrapper(400, "fehler", BackendErrorEnum.ErrorStartpointAlreadySet));
                    }
                    else if (id == Station.EndPoint)
                    {
                        throw new BackendServiceException(new ErrorCodeWrapper(400, "fehler", BackendErrorEnum.ErrorEndpointAlreadySet));
                    }
                }
            }
            catch (Exception ex)
            {
                if (ex is BackendServiceException)
                {
                    // Should only throw if backendException is of type tokenInvalid ect.
                    await this.RenewToken();
                    throw;
                }
            }
        }

        /// <summary>
        /// Send the feedback of the current tour to the server
        /// </summary>
        /// <param name="feedback"> Feedback of the current tour </param>
        /// <returns> A task for the completion of the method </returns>
        public async Task SendFeedback(Feedback feedback)
        {
            try
            {
                // Sets the feedback to the current tour
                Database.Instance.CurrentTour.Feedback = feedback;

                // Saves the current tour with the new feedback
                await this.SaveTour();

                // Tour is completed so current user has no current tour
                Database.Instance.CurrentUser.TourId = 0;

                // Save user with no current tour
                await this.SaveUser();

                // Tries to send all offline tour items to the server (offline packets)
                // BUG: Confirmed but not reproduced bug with duplicate feedbacks
                // BUG: Either an error in the offline code, where a delete has been forgotten and the data was duplicated due to saving it again, or an error somewhere else
                await this.SynchronizeData();
            }
            catch (Exception ex)
            {
                if (ex is BackendServiceException)
                {
                    // Should check if renewToken really is needed (TokenInvalid ect.)
                    await this.RenewToken();
                    throw;
                }
            }
        }

        /// <summary>
        /// Gets the predefined answers from the server and sets them in the database
        /// </summary>
        /// <returns> A task for the completion of the method </returns>
        public async Task GetPredefinedAnswers()
        {
            bool online = true;

            try
            {
                // Try to get them from the server
                RestRequest request = new RestRequest("answer", Method.GET);
                request.AddHeader("Content-Type", "application/x-www-form-urlencoded");
                request.AddHeader("x-access-token", Database.Instance.CurrentUser.AccessToken);
                var restResponse = await myRestClient.Execute(request);

                if (restResponse.StatusCode != System.Net.HttpStatusCode.OK)
                {
                    // Should the server return an error, throw it up with our custom exception
                    ErrorCodeWrapper error = JsonConvert.DeserializeObject<ErrorCodeWrapper>(restResponse.Content);
                    throw new BackendServiceException(error);
                }
                else
                {
                    // Should the server return with success deserialize them and set them in the database
                    List<PredefinedAnswer> l = JsonConvert.DeserializeObject<List<PredefinedAnswer>>(restResponse.Content);
                    Database.Instance.PredefinedAnswers = l;
                }
            }
            catch (Exception e)
            {
                if (e is BackendServiceException)
                {
                    // Check if needed
                    await this.RenewToken();
                    throw;
                }
                else
                {
                    online = false;
                }
            }

            if (online)
            {
                // Should the call be successful save the new answers offline/local

                // Clear the old items from the offlineDatabase
                await OfflineDatabase.Instance.DeleteAllPredefinedAnswersAsync();


                List<OfflinePredefinedAnswerItem> answerItems = new List<OfflinePredefinedAnswerItem>();
                foreach (PredefinedAnswer aw in Database.Instance.PredefinedAnswers)
                {
                    OfflinePredefinedAnswerItem item = new OfflinePredefinedAnswerItem();
                    item.Answer = aw.Answer;
                    item.Id = aw.Id;
                    answerItems.Add(item);
                }

                // Save them offline
                await OfflineDatabase.Instance.SavePredefinedAnswers(answerItems);
            }
            else
            {
                // Should the call be unsuccessful try to get the answers from the offlineDatabase
                if (await OfflineDatabase.Instance.CountSavedPredefinedAnswers() > 0)
                {
                    List<OfflinePredefinedAnswerItem> offlinePredefinedAnswers = await OfflineDatabase.Instance.GetPredefinedAnswersAsync();
                    List<PredefinedAnswer> answerItems = new List<PredefinedAnswer>();
                    foreach (OfflinePredefinedAnswerItem aw in offlinePredefinedAnswers)
                    {
                        PredefinedAnswer item = new PredefinedAnswer();
                        item.Answer = aw.Answer;
                        item.Id = aw.Id;
                        answerItems.Add(item);
                    }

                    Database.Instance.PredefinedAnswers = answerItems;
                }
                else
                {
                    // Should neither work, throw an exception
                    throw new BackendServiceException(new ErrorCodeWrapper(400, "error", BackendErrorEnum.ErrorNoPredefinedAnswersSaved));
                }
            }
        }

        /// <summary>
        /// Determines the stations yet to be visited and the stations already visited and sets them in the database
        /// </summary>
        /// <returns> A task for the completion of the method </returns>
        public async Task GetHistory()
        {
            try
            {
                // Gets all saved stations
                List<OfflineStationItem> stationsOffline = await OfflineDatabase.Instance.GetStationsAsync();
                List<Station> stations = new List<Station>();

                if (stationsOffline != null && stationsOffline.Count > 0)
                {
                    // Convert the offlineStations to normal stations
                    foreach (OfflineStationItem s in stationsOffline)
                    {
                        Station item = new Station(s.Id, s.Name, s.Grade, s.Subject, s.Description);
                        stations.Add(item);
                    }

                    // Gets all current notifcations
                    List<Notification> notifications = Database.Instance.CurrentTour.Notifications;

                    List<ToDoStation> toDoStations = new List<ToDoStation>();
                    List<DoneStation> doneStations = new List<DoneStation>();

                    // Checks if the stations appear in any notifcation and add them to the doneStations, if not add them to the toDoStations
                    foreach (Station st in stations)
                    {
                        Notification n = notifications.Find(not => not.Id == st.Id);
                        if (n != null)
                        {
                            doneStations.Add(new DoneStation(st.Name, n.Time.ToString()));
                        }
                        else
                        {
                            toDoStations.Add(new ToDoStation(st.Id, st.Name));
                        }
                    }

                    // Set them in the database
                    Database.Instance.ToDoStations = toDoStations;
                    Database.Instance.DoneStations = doneStations;
                }
                else
                {
                    throw new BackendServiceException(new ErrorCodeWrapper(400, "error", BackendErrorEnum.ErrorNoStationsSaved));
                }
            }
            catch (Exception ex)
            {
                if (ex is BackendServiceException)
                {
                    // Check if renew needed (TokenInvalid)
                    await this.RenewToken();
                    throw;
                }
                else if (ex is SQLiteException || ex is SQLException)
                {
                    throw;
                }
            }
        }

        /// <summary>
        /// Sends all saved and finished tours to the server
        /// </summary>
        /// <returns> A task for the completion of the method </returns>
        public async Task SynchronizeData()
        {
            try
            {
                // Gets all saved tours
                List<OfflineTourItem> offlineTours = await OfflineDatabase.Instance.GetToursAsync();
                List<Tour> tours = new List<Tour>();

                // Convert the offlineTours to normal tours
                foreach (OfflineTourItem item in offlineTours)
                {
                    Tour t = new Tour();
                    t.Feedback = JsonConvert.DeserializeObject<Feedback>(item.FeedbackJson);

                    // Check if tour has feedback, which means it is finished !important!
                    if (t.Feedback != null)
                    {
                        t.User = JsonConvert.DeserializeObject<User>(item.UserJson);
                        t.Visitor = JsonConvert.DeserializeObject<Visitor>(item.VisitorJson);
                        t.Notifications = JsonConvert.DeserializeObject<List<Notification>>(item.NotificationsJson);
                        t.Notifications.Remove(new Notification(DateTime.Now, Station.StartPoint));
                        t.Notifications.Remove(new Notification(DateTime.Now, Station.EndPoint));
                        t.Start = item.Start;
                        t.End = item.End;
                        tours.Add(t);
                    }
                }

                // Only send data when we have data
                if (tours.Count != 0)
                {
                    RestRequest request = new RestRequest("offlinepackets", Method.POST);
                    request.AddHeader("Content-Type", "application/json");
                    request.AddHeader("x-access-token", Database.Instance.CurrentUser.AccessToken);
                    request.AddBody(tours);

                    var restResponse = await myRestClient.Execute(request);

                    if (restResponse.StatusCode != System.Net.HttpStatusCode.OK)
                    {
                        // Should the call be unsuccessful rethrow its error in our custom exception
                        ErrorCodeWrapper error = JsonConvert.DeserializeObject<ErrorCodeWrapper>(restResponse.Content);
                        throw new BackendServiceException(error);
                    }
                    else
                    {
                        // Should the call be successful means we have sent our saved tours and can delete them
                        // Delete all tours (important so we do not send duplicates)
                        // BUG: Somehow there is still a bug with duplicate tours in the backend, could not reproduce (Manuel Sammer)
                        // TODO: Thoroughly debug the sent tours and try to replicate
                        await OfflineDatabase.Instance.DeleteAllToursAsync();
                        Database.Instance.CurrentUser.TourId = 0;

                        // Save current tour
                        await this.SaveTour();
                    }
                }
#if DEBUG
                List<OfflineTourItem> test = await OfflineDatabase.Instance.GetToursAsync();
#endif
            }
            catch (Exception ex)
            {
                if (ex is BackendServiceException)
                {
                    // Check if needed (InvalidToken)
                    await this.RenewToken();
                    throw;
                }
                else if (ex is SQLiteException || ex is SQLException)
                {
                    throw;
                }
            }
        }

        /// <summary>
        /// Stops and deletes the current tour
        /// </summary>
        /// <returns> A task for the completion of the method </returns>
        public async Task CancelTour()
        {
            try
            {
                // Sets the id of the current tour in a new offline tour item 
                OfflineTourItem item = new OfflineTourItem();
                item.IdDb = Database.Instance.CurrentUser.TourId;

                // Delete the current tour in the offline database
                await OfflineDatabase.Instance.DeleteCurrentTourAsync(item);

                // Remove the current tour from the user
                Database.Instance.CurrentUser.TourId = 0;

                // Save the user with the removed tour
                await this.SaveUser();
            }
            catch (Exception ex)
            {
                if (ex is BackendServiceException)
                {

                    // Check if needed
                    await this.RenewToken();
                    throw;
                }
                else if (ex is SQLiteException || ex is SQLException)
                {
                    throw;
                }
            }
        }

        /// <summary>
        /// Sets the current tour from the offlineDatabase
        /// </summary>
        /// <returns> A task for the completion of the method </returns>
        public async Task ContinueTour()
        {
            try
            {
                // Gets the id of the current tour
                int tourId = Database.Instance.CurrentUser.TourId;

                // Gets the tour with the id of the current tour
                OfflineTourItem item = await OfflineDatabase.Instance.GetCurrentTourAsync(tourId);

                // Convert the offline tour into a normal tour
                Tour currentTour = new Tour();
                currentTour.User = JsonConvert.DeserializeObject<User>(item.UserJson);
                currentTour.Visitor = JsonConvert.DeserializeObject<Visitor>(item.VisitorJson);
                currentTour.Feedback = JsonConvert.DeserializeObject<Feedback>(item.FeedbackJson);
                currentTour.Notifications = JsonConvert.DeserializeObject<List<Notification>>(item.NotificationsJson);
                currentTour.Start = item.Start;
                currentTour.End = item.End;

                // Set the current tour in the database
                Database.Instance.CurrentTour = currentTour;
            }
            catch (Exception ex)
            {
                if (ex is BackendServiceException)
                {
                    // Check if needed
                    await this.RenewToken();
                    throw;
                }
                else if (ex is SQLiteException || ex is SQLException)
                {
                    throw;
                }
            }
        }

        /// <summary>
        /// Saves the current tour to the offlineDatabase
        /// </summary>
        /// <returns> A task for the completion of the method </returns>
        public async Task SaveTour()
        {
            try
            {
                OfflineTourItem currentTour = new OfflineTourItem();
                OfflineTourItem oldTour = null;

                int currentTourId = Database.Instance.CurrentUser.TourId;

                // Initialize the primary key with 0 for a new dataset
                currentTour.IdDb = 0;

                // Checks if tour is already saved
                if (currentTourId != 0)
                {
                    // If yes then set the prim key from the old tour to the new tour so it overwrites the old tour and is not saved as a duplicate
                    currentTour.IdDb = currentTourId;

                    // Get the old tour for its data
                    oldTour = await OfflineDatabase.Instance.GetCurrentTourAsync(currentTourId);
                }

                // Should the oldTour exist set it as the new tour (so we just need to change the new values from the current tour)
                if (oldTour != null)
                {
                    currentTour = oldTour;
                }

                // Get the current tour
                Tour tour = Database.Instance.CurrentTour;

                // Set the new values
                currentTour.UserJson = JsonConvert.SerializeObject(tour.User);
                currentTour.VisitorJson = JsonConvert.SerializeObject(tour.Visitor);

                // Check if we have notifactions (if null we get an error during serialization)
                if (tour.Notifications != null)
                {
                    currentTour.NotificationsJson = JsonConvert.SerializeObject(tour.Notifications);
                }
                else
                {
                    currentTour.NotificationsJson = string.Empty;
                }

                // Check if we have notifactions (if null we get an error during serialization)
                if (tour.Feedback != null)
                {
                    currentTour.FeedbackJson = JsonConvert.SerializeObject(tour.Feedback);

                }
                else
                {
                    currentTour.FeedbackJson = string.Empty;
                }

                // Set the rest of the new values
                currentTour.Start = tour.Start;
                currentTour.End = tour.End;

                // BUG: Possible error source for the duplicate feedback bug
                // Save the tour
                // If the IdDb (primary key) is 0 then a new tour will be saved, if it was anything else then the tour with the same primary key will be overwritten
                // Important so we dont save duplicates
                await OfflineDatabase.Instance.SaveTourAsync(currentTour);

                // We still need the Id from the new dataset if it was saved as a new tour
                int idLastInsert = await OfflineDatabase.Instance.GetLastInsertId();

                // Check is important because only if we had a prim key of 0 a new tour was saved, if it was anything else we get the primary key
                // of any other insert before, for example a saved user id 
                // TODO: Again search sqlite-net for a better solution to get the id of an insert :/ (Probalby just overlooked it :( )
                if (currentTourId == 0)
                {
                    // If a new tour was saved, this id is its primary key
                    Database.Instance.CurrentUser.TourId = idLastInsert;
                }
            }
            catch (Exception ex)
            {
                if (ex is BackendServiceException)
                {
                    // Check if needed
                    await this.RenewToken();
                    throw;
                }
                else if (ex is SQLiteException || ex is SQLException)
                {
                    throw;
                }
            }
        }

        /// <summary>
        /// Saves the current user to the offlineDatabase
        /// </summary>
        /// <returns> A task for the completion of the method </returns>
        public async Task SaveUser()
        {
            try
            {
                User currentUser = Database.Instance.CurrentUser;
                OfflineUserItem newUser = new OfflineUserItem();

                // Init with 0 to create a new user
                newUser.IdDb = 0;

                // Gets the old user
                OfflineUserItem oldUser = await OfflineDatabase.Instance.GetUserAsync();

                // Checks if oldUser was saved
                if (oldUser != null)
                {
                    // If it was saved we just set the prim key to the new user to overwrite the old
                    newUser.IdDb = oldUser.IdDb;
                }

                // Convert the currentUser to an offlineUser
                newUser.Id = currentUser.Id;
                newUser.AccessToken = currentUser.AccessToken;
                newUser.Password = currentUser.Password;
                newUser.Username = currentUser.Username;
                newUser.TourId = currentUser.TourId;

                // Save the newUser offline
                await OfflineDatabase.Instance.SaveUserAsync(newUser);
            }
            catch (Exception ex)
            {
                if (ex is BackendServiceException)
                {
                    // Check if needed
                    await this.RenewToken();
                    throw;
                }
                else if (ex is SQLiteException || ex is SQLException)
                {
                    throw;
                }
            }
        }

        /// <summary>
        /// Gets the list of busy stations and marks them as busy/occupied
        /// </summary>
        /// <returns> A task for the completion of the method </returns>
        public async Task GetOccupancy()
        {
            // A list of statiosn with occupation information in a wrapper
            List<OccupancyWrapper> stationsList = new List<OccupancyWrapper>();
            try
            {
                // Try to get them from the server
                RestRequest request = new RestRequest("station/busy", Method.GET);
                request.AddHeader("Content-Type", "application/x-www-form-urlencoded");
                request.AddHeader("x-access-token", Database.Instance.CurrentUser.AccessToken);

                var restResponse = await myRestClient.Execute(request);

                if (restResponse.StatusCode != System.Net.HttpStatusCode.OK)
                {
                    // Should the call be unsuccessful, throw the server error 
                    ErrorCodeWrapper error = JsonConvert.DeserializeObject<ErrorCodeWrapper>(restResponse.Content);
                    throw new BackendServiceException(error);
                }
                else
                {
                    // Should the call be successful deserialize the information 
                    stationsList = JsonConvert.DeserializeObject<List<OccupancyWrapper>>(restResponse.Content);

                    // Gets the stations not visited yet
                    List<ToDoStation> toDoStations = Database.Instance.ToDoStations;

                    // Check if stations are included in the busy stations list
                    foreach (OccupancyWrapper station in stationsList)
                    {
                        ToDoStation toDoStation = toDoStations.Find(st => st.Id.Equals(station.Id));
                        if (toDoStation != null)
                        {
                            // If the station is contained then set it busy
                            Database.Instance.ToDoStations[Database.Instance.ToDoStations.IndexOf(toDoStation)].OccupationStatus = true;
                        }
                    }
                }
            }
            catch (Exception e)
            {
                // ignored
            }
        }

        /// <summary>
        /// Gets the challenge from the backend for the provided user
        /// </summary>
        /// <param name="user"> User which tries to login </param>
        /// <returns> A task with the challenge string </returns>
        private async Task<string> GetChallenge(User user)
        {
            ChallengeResponse response = null;
            try
            {
                // Try to get the challenge for the provided username
                RestRequest request = new RestRequest("challenge", Method.POST);
                request.AddHeader("Content-Type", "application/x-www-form-urlencoded");
                request.AddParameter("username", user.Username, ParameterType.GetOrPost);

                var restResponse = await myRestClient.Execute(request);

                if (restResponse.StatusCode != System.Net.HttpStatusCode.OK)
                {
                    // Should the call be unsuccessful throw the server error
                    ErrorCodeWrapper error = JsonConvert.DeserializeObject<ErrorCodeWrapper>(restResponse.Content);
                    throw new BackendServiceException(error);
                }
                else
                {
                    // Should the call be successful deserialize
                    response = JsonConvert.DeserializeObject<ChallengeResponse>(restResponse.Content);
                }
            }
            catch (Exception ex)
            {
                if (ex is BackendServiceException)
                {
                    // Check if needed
                    await this.RenewToken();
                    throw;
                }
                else if (ex is SQLiteException || ex is SQLException)
                {
                    throw;
                }
            }

            // Check if response was received if not return empty challenge
            return response != null ? response.Challenge : string.Empty;
        }

        /// <summary>
        /// Gets the token for the provided user and challenge
        /// </summary>
        /// <param name="user"> User which tries to login </param>
        /// <param name="challenge"> The challenge from the backend </param>
        /// <returns> A task with the response in a wrapper </returns>
        private async Task<TokenResponse> GetToken(User user, string challenge)
        {
            // Response wrapped 
            TokenResponse wrappedResponse = null;
            try
            {
                // Try to get the token for the provided hash (password and challenge hashed)
                RestRequest request = new RestRequest("auth", Method.POST);
                request.AddHeader("Content-Type", "application/x-www-form-urlencoded");
                request.AddParameter("username", user.Username, ParameterType.GetOrPost);
                request.AddParameter("password", AuthHelper.GenerateHash(user.Password, challenge), ParameterType.GetOrPost);

                var restResponse = await myRestClient.Execute(request);

                if (restResponse.StatusCode != System.Net.HttpStatusCode.OK)
                {
                    // Should the call be unsuccessful throw the server error
                    ErrorCodeWrapper error = JsonConvert.DeserializeObject<ErrorCodeWrapper>(restResponse.Content);
                    throw new BackendServiceException(error);
                }
                else
                {
                    // Should the call be successful deserialize
                    wrappedResponse = JsonConvert.DeserializeObject<TokenResponse>(restResponse.Content);
                }
            }
            catch (Exception ex)
            {
                if (ex is BackendServiceException)
                {
                    // Check if needed
                    await this.RenewToken();
                    throw;
                }
                else if (ex is SQLiteException || ex is SQLException)
                {
                    throw;
                }
            }

            // Return the response
            return wrappedResponse;
        }
    }
}