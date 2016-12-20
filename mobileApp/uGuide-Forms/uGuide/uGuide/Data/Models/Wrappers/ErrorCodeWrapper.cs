namespace uGuide.Data.Models.Wrappers
{
    public class ErrorCodeWrapper
    {
        public int Code { get; set; }
        public string Error { get; set; }

        public ErrorCodeWrapper(int code, string error)
        {
            Code = code;
            Error = error;
        }
    }
}