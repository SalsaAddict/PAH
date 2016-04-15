using System;
using System.Web.UI;

namespace PAH
{
    public partial class Index : System.Web.UI.Page
    {
        public string Locale()
        {
            if (Page.RouteData.Values["Locale"] == null) return Global.DefaultLocale;
            return Page.RouteData.Values["Locale"].ToString();
        }
        public string CDNJS(string Library, string Version, string Filename)
        {
            return string.Format("//cdnjs.cloudflare.com/ajax/libs/{0}/{1}/{2}", Library, Version, Filename);
        }
        public string AngularResource(string Filename)
        {
            return CDNJS("angular.js", Global.AngularVersion, Filename);
        }
        public string AngularLocaleScript()
        {
            return CDNJS("angular-i18n", Global.AngularVersion, string.Format("angular-locale_{0}.js", Locale()));
        }
        public string MaterialResource(string Filename)
        {
            return CDNJS("angular-material", Global.MaterialVersion, Filename);
        }
    }
}