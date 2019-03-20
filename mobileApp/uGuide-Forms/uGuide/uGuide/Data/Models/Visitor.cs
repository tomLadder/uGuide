namespace uGuide.Data.Models
{
    public class Visitor
    {
        public int ZipCode { get; set; }
        public Gender Gender { get; set; }


        public Visitor(int plz, Gender gender)
        {
            this.ZipCode = plz;
            this.Gender = gender;
        }

    }

   
}