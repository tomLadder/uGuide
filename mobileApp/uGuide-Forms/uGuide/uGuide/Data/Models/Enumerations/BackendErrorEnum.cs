namespace uGuide.Data.Models.Enumerations
{
    public enum BackendErrorEnum
    {
        ErrorUnknown = -0x1,
        ErrorAuthFailedTokenWrong = 0x1,
        ErrorDatabase = 0x2,
        ErrorRequestChallengeFirst = 0x3,
        ErrorAuthFailedUserNotFound = 0x4,
        ErrorSystemLockMode = 0x5,
        ErrorNoTokenProvided = 0x6,
        ErrorNoUsernameProvided = 0x7,
        ErrorNoVisitorFound = 0x8,
        ErrorVisitationAlreadyFinished = 0x9,
        ErrorStartpointAlreadySet = 0x10,
        ErrorEndpointAlreadySet = 0x11,
        ErrorStationNotFound = 0x12,
        ErrorCurrentTdotNotSet = 0x13,
        ErrorTdotNotFound = 0x14,
        ErrorDocGenerationFailed = 0x15,
        ErrorUserNotFound = 0x16,
        ErrorVisitorNotFinished = 0x17,
        ErrorStartpointNotScanned = 0x18,
        ErrorNoPredefinedAnswersSaved = 0x19,
        ErrorNoStationsSaved = 0x20,
        ErrorNoUserSaved = 0x21,
        ErrorNotAuthorized = 0x22
    }
}
