using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Security.Principal;
using PCLCrypto;

namespace uGuide.Helpers
{
    class AuthHelper
    {
        public static string GenerateHash(string password, string challenge)
        {
            return SHA256(password + challenge);
        }

        private static string SHA256(string message)
        {
            Org.BouncyCastle.Crypto.Digests.Sha256Digest myHash = new Org.BouncyCastle.Crypto.Digests.Sha256Digest();
            myHash.BlockUpdate(Encoding.UTF8.GetBytes(message), 0, Encoding.UTF8.GetByteCount(message));
            byte[] compArr = new byte[myHash.GetDigestSize()];
            myHash.DoFinal(compArr, 0);

            return BitConverter.ToString(compArr).Replace("-", "").ToLower();
        }
    }
}