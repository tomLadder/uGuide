namespace uGuide.Data.Models.Wrappers
{
    public class HasTourResponse
    {
        public bool Tour { get; set; }

        public HasTourResponse(bool tour)
        {
            Tour = tour;
        }
    }
}