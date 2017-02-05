namespace uGuide.Data.Models.Wrappers
{
    using SQLite;

    public class OfflineStationItem
    {
        [PrimaryKey, AutoIncrement]
        public int IdDb {get; set; }

        public string Id { get; set; }

        public string Name { get; set; }

        public int Grade { get; set; }

        public string Subject { get; set; }

        public string Description { get; set; }
    }
}