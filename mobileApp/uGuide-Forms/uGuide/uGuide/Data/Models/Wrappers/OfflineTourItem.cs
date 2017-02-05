namespace uGuide.Data.Models.Wrappers
{
    using Android;
    using Android.Graphics;

    using SQLite;

    public class OfflineTourItem
    {
        [PrimaryKey, AutoIncrement]
        public int IdDb { get; set; }

        public string UserJson { get; set; }

        public string VisitorJson { get; set; }

        public string NotificationsJson { get; set; }

        public string FeedbackJson { get; set; }

        public long Start { get; set; }

        public long End { get; set; }
    }
}