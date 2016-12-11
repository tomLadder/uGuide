namespace uGuide.Data.Models
{
    internal class Visitor
    {
        public int Plz { get; set; }
        public Gender Gender { get; set; }


        public Visitor(int plz, Gender gender)
        {
            this.Plz = plz;
            this.Gender = gender;
        }

    }

   
}