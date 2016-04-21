using Newtonsoft.Json;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Web;
using System.Data;
using System.Data.SqlClient;
using System.Xml;
using System;

namespace PAH
{
    public class Execute : IHttpHandler
    {
        private class Procedure
        {
            [JsonProperty("name")]
            public string Name { get; set; }

            [JsonProperty("parameters")]
            public List<Parameter> Parameters { get; set; } = new List<Parameter>();

            [JsonProperty("nonQuery")]
            public bool NonQuery { get; set; } = true;

            public class Parameter
            {
                [JsonProperty("Name")]
                public string Name { get; set; }
            }

        }

        private class Response
        {
            [JsonProperty("success")]
            public bool Success { get; set; }

            [JsonProperty("data")]
            public object Data { get; set; }

            [JsonProperty("error")]
            public string Error { get; set; }

            public Response(object Data)
            {
                this.Success = true;
                this.Data = Data;
                this.Error = null;
            }

            public Response(string Error)
            {
                this.Success = false;
                this.Data = null;
                this.Error = Error;
            }
        }

        public void ProcessRequest(HttpContext Context)
        {
            Context.Response.ContentType = "application/json";
            Context.Response.ContentEncoding = Encoding.UTF8;
            try
            {
                using (StreamReader Reader = new StreamReader(Context.Request.InputStream, Encoding.UTF8))
                {
                    Procedure Procedure = JsonConvert.DeserializeObject<Procedure>(Reader.ReadToEnd());
                    using (SqlConnection Connection = new SqlConnection(Global.ConnectionString))
                    {
                        Connection.Open();
                        using (SqlTransaction Transaction = Connection.BeginTransaction(IsolationLevel.Serializable))
                        {
                            try
                            {
                                using (SqlCommand Command = new SqlCommand(Procedure.Name, Connection, Transaction))
                                {
                                    Command.CommandType = CommandType.StoredProcedure;
                                    if (Procedure.NonQuery)
                                    {
                                        Command.ExecuteNonQuery();
                                    }
                                    else
                                    {
                                        using (XmlReader XmlReader = Command.ExecuteXmlReader())
                                        {
                                            XmlDocument Document = new XmlDocument();
                                            Document.Load(XmlReader);
                                            XmlReader.Close();
                                            Response Response = new Response(JsonConvert.DeserializeObject(JsonConvert.SerializeXmlNode(Document, Newtonsoft.Json.Formatting.None, true)));
                                            Context.Response.Write(JsonConvert.SerializeObject(Response));
                                        }
                                    }
                                }
                                Transaction.Commit();
                            }
                            catch (Exception Ex)
                            {
                                Transaction.Rollback();
                                throw Ex;
                            }
                        }
                        Connection.Close();
                    }
                }
            }
            catch (Exception Ex)
            {
                Context.Response.Write(JsonConvert.SerializeObject(new Response(Ex.Message)));
            }
        }
        public bool IsReusable { get { return false; } }
    }
}