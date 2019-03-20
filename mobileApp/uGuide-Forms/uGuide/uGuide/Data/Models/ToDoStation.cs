namespace uGuide.Data.Models
{
    public class ToDoStation
    {
        private string Name { get; set; }

        public ToDoStation(string name)
        {
            Name = name;
        }

        public override string ToString()
        {
            return $"{nameof(Name)}: {Name}";
        }
    }
}