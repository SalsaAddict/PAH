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
            routes.MapPageRoute("Main", "main/{LocaleId}", "~/index.aspx", false,
                new RouteValueDictionary { { "LocaleId", WebConfigurationManager.AppSettings["DefaultLocaleId"] } });
        }
    }
}