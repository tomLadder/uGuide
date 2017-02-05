using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace uGuide.Data.Models.Exceptions
{
    using uGuide.Data.Models.Enumerations;
    using uGuide.Data.Models.Wrappers;

    public class BackendServiceException : Exception
    {
        public  ErrorCodeWrapper errorCodeWrapper { get; set; }
        public BackendServiceException()
        {
        }

        public BackendServiceException(string message)
        : base(message)
        {
        }

        public BackendServiceException(string message, Exception inner)
        : base(message, inner)
        {
        }

        public BackendServiceException(ErrorCodeWrapper wrapper)
        {
            this.errorCodeWrapper = wrapper;
        }

        public override string ToString()
        {
            string ret = "Unbekanner Fehler";
            var codeWrapper = this.errorCodeWrapper;
            if (codeWrapper != null)
            {
                switch (codeWrapper.ErrorType)
                {
                    case BackendErrorEnum.ErrorUnknown:
                        ret = "Unbekanner Fehler";
                        break;
                    case BackendErrorEnum.ErrorAuthFailedTokenWrong:
                        ret = "Token nicht gültig, bitte versuchen sie es erneut!";
                        break;
                    case BackendErrorEnum.ErrorDatabase:
                        ret = "Datenbank Fehler!";
                        break;
                    case BackendErrorEnum.ErrorRequestChallengeFirst:
                        ret = "Bitte zuerst eine Challenge anfordern!";
                        break;
                    case BackendErrorEnum.ErrorAuthFailedUserNotFound:
                        ret = "Benutzer konnte nicht gefunden werden!";
                        break;
                    case BackendErrorEnum.ErrorSystemLockMode:
                        ret = "Dieser TdoT is gesperrt!";
                        break;
                    case BackendErrorEnum.ErrorNoTokenProvided:
                        ret = "Token nicht gültig, bitte versuchen sie es erneut!";
                        break;
                    case BackendErrorEnum.ErrorNoUsernameProvided:
                        ret = "Kein Username angegeben!";
                        break;
                    case BackendErrorEnum.ErrorNoVisitorFound:
                        ret = "Kein Besucher gefunden!";
                        break;
                    case BackendErrorEnum.ErrorVisitationAlreadyFinished:
                        ret = "Führung bereits beendet!";
                        break;
                    case BackendErrorEnum.ErrorStartpointAlreadySet:
                        ret = "Startpunkt bereits gescannt!";
                        break;
                    case BackendErrorEnum.ErrorEndpointAlreadySet:
                        ret = "Führung bereits beendet!";
                        break;
                    case BackendErrorEnum.ErrorStationNotFound:
                        ret = "Station nicht gefunden!";
                        break;
                    case BackendErrorEnum.ErrorCurrentTdotNotSet:
                        ret = "Aktueller Tdot nicht gesetzt!";
                        break;
                    case BackendErrorEnum.ErrorTdotNotFound:
                        ret = "Tdot nicht gefunden!";
                        break;
                    case BackendErrorEnum.ErrorDocGenerationFailed:
                        ret = "Dokumentations Generation fehlgeschlagen";
                        break;
                    case BackendErrorEnum.ErrorUserNotFound:
                        ret = "Besucher nicht gefunden";
                        break;
                    case BackendErrorEnum.ErrorVisitorNotFinished:
                        ret = "Führung nicht beendet!";
                        break;
                    case BackendErrorEnum.ErrorStartpointNotScanned:
                        ret = "Startpunkt noch nicht gescannt!";
                        break;
                    case BackendErrorEnum.ErrorNoPredefinedAnswersSaved:
                        ret = "Keine Antworten gespeichert, bitte loggen sie sich mit Internetzugriff ein!";
                        break;
                    case BackendErrorEnum.ErrorNoStationsSaved:
                        ret = "Keine Stationen gespeichert, bitte loggen sie sich mit Internetzugriff ein!";
                        break;
                    case BackendErrorEnum.ErrorNoUserSaved:
                        ret = "Kein User gespeichert, bitte loggen sie sich mit Internetzugriff ein!";
                        break;
                    case BackendErrorEnum.ErrorNotAuthorized:
                        ret = "Sie verfügen nicht über die benötigten Rechte, bitte loggen Sie sich mit einem Guide Account ein!";
                        break;
                    /*case BackendErrorEnum.ErrorNoPredefinedAnswersSaved:
                        ret = "Keine Antworten gespeichert, bitte loggen sie sich mit Internzugriff ein!";
                        break; 
                        */
                    default:
                        throw new ArgumentOutOfRangeException();
                }
            }

            return ret;
        }
    }
}
