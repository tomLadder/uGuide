namespace uGuide.Data.Models.Wrappers
{
    using uGuide.Data.Models.Enumerations;

    public class ErrorCodeWrapper
    {
        public ErrorCodeWrapper(int code, string error, BackendErrorEnum errorType)
        {
            this.Code = code;
            this.Error = error;
            this.ErrorType = errorType;
        }

        public int Code { get; set; }

        public string Error { get; set; }

        public BackendErrorEnum ErrorType { get; set; }
    }
}