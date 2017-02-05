namespace uGuide.Helpers
{
    using System;

    using Xamarin.Forms;

    public class OccupationStatusValueConverter : IValueConverter
    {
        public object Convert(object value, Type targetType, object parameter, System.Globalization.CultureInfo culture)
        {
            Color col;
            if ((bool)value)
            {
                col = Color.FromRgb(239, 83, 80);
            }
            else
            {
                col = Color.Transparent;
            }
            return col;
        }

        public object ConvertBack(
            object value,
            Type targetType,
            object parameter,
            System.Globalization.CultureInfo culture)
        {
            // You probably don't need this, this is used to convert the other way around
            // so from color to yes no or maybe
            return null;
        }
    }
}