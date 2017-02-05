namespace uGuide.Data.Models
{
    public class DoneStation
    {

        public DoneStation(string name, string time)
        {
            this.Name = name;
            this.Time = time;
        }

        public string Name { get; set; }

        public string Time { get; set; }

        public override string ToString()
        {
            return Name + "  " + Time;
        }
    }
}