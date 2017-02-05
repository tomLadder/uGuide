namespace uGuide.Data.Models.Wrappers
{
    using SQLite;

    public class OfflinePredefinedAnswerItem
    {
        [PrimaryKey, AutoIncrement]
        public int IdDb { get; set; }

        public string Id { get; set; }

        public string Answer { get; set; }
    }
}