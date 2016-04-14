using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.Configuration;

namespace PAH
{
    public partial class index : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }
        public string LocaleId()
        {
            if (Page.RouteData.Values["LocaleId"] == null)
            {
                return WebConfigurationManager.AppSettings["DefaultLocaleId"];
            }
            return Page.RouteData.Values["LocaleId"].ToString();
        }
        public string CDNJS(string Library, string Version, string Filename)
        {
            return string.Format("//cdnjs.cloudflare.com/ajax/libs/{0}/{1}/{2}", Library, Version, Filename);
        }
        public string AngularResource(string Filename)
        {
            return CDNJS("angular.js", WebConfigurationManager.AppSettings["AngularVersion"], Filename);
        }
    }
}