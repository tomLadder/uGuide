using uGuide.Droid.PCLInterfaces;
using Xamarin.Forms;

[assembly: Dependency(typeof(FileHelper))]

namespace uGuide.Droid.PCLInterfaces
{
    using System;
    using System.IO;

    public class FileHelper : IFileHelper
    {
        public string DbConnection(string db)
        {
            var path = Path.Combine(System.Environment.GetFolderPath(System.Environment.SpecialFolder.Personal), db);
            return path;
        }
    }
}