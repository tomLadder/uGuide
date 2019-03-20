using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace uGuide.Data
{
    class AuthHelper
    {
        public static string GenerateHash(string password, string challenge)
        {
            return SHA256(password + challenge);
        }

        private static string SHA256(string message)
        {
            System.Security.Cryptography.SHA256Managed crypt = new System.Security.Cryptography.SHA256Managed();
            System.Text.StringBuilder hash = new System.Text.StringBuilder();
            byte[] crypto = crypt.ComputeHash(Encoding.UTF8.GetBytes(message), 0, Encoding.UTF8.GetByteCount(message));
            foreach (byte theByte in crypto)
            {
                hash.Append(theByte.ToString("x2"));
            }
            return hash.ToString();
        }
    }
}