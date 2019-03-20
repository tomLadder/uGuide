namespace uGuide.Data.Models
{
    public class DoneStation
    {
        private string Name { get; set; }
        private string Time { get; set; }

        public DoneStation(string name, string time)
        {
            Name = name;
            Time = time;
        }

        public override string ToString()
        {
            return $"{nameof(Name)}: {Name}, {nameof(Time)}: {Time}";
        }
    }
}