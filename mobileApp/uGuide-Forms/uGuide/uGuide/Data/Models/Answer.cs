namespace uGuide.Data.Models
{
    public class Answer
    {
        public int Id { get; set; }
        public string Text { get; set; }

        public Answer(int id, string text)
        {
            this.Id = id;
            this.Text = text;
        }

    }
}