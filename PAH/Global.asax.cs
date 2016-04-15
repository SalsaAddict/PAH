using System;
using System.Web.Routing;
using System.Web.Configuration;

namespace PAH
{
    public class Global : System.Web.HttpApplication
    {
        protected void Application_Start(object sender, EventArgs e)
        {
            RegisterRoutes(RouteTable.Routes);
        }
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.MapPageRoute("Main", "main.aspx/{Locale}", "~/index.aspx", false,
                new RouteValueDictionary { { "Locale", DefaultLocale } });
        }
        public static string AngularVersion { get { return WebConfigurationManager.AppSettings["AngularVersion"]; } }
        public static string MaterialVersion { get { return WebConfigurationManager.AppSettings["MaterialVersion"]; } }
        public static string DefaultLocale { get { return WebConfigurationManager.AppSettings["DefaultLocale"]; } }
        public static string AngularDebug { get { return WebConfigurationManager.AppSettings["AngularDebug"]; } }
    }
}