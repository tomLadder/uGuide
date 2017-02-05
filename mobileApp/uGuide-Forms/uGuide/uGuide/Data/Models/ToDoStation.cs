namespace uGuide.Data.Models
{
    using Android.Graphics;

    public class ToDoStation
    {
        public ToDoStation(string id, string name)
        {
            this.Id = id;
            this.Name = name;
        }

        public ToDoStation(string id, string name, bool occupationStatus)
        {
            this.Id = id;
            this.Name = name;
            this.OccupationStatus = occupationStatus;
        }

        public string Id { get; set; }

        public string Name { get; set; }

        public bool OccupationStatus { get; set; }

        public override string ToString()
        {
            return Name;
        }
    }
}