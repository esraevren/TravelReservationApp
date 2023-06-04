using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Data.SqlClient;
using System.Data;


namespace TravelProjectApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReservationController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        public ReservationController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet]
        public JsonResult Get()
        {
            string query = @"
                            select IdentificationNo, CustomerName, SeatInfo,FlightID  from
                            dbo.Reservation
                            "
            ;

            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("TravelAppCon");
            SqlDataReader myReader;
            using (SqlConnection myCon = new SqlConnection(sqlDataSource))
            {
                myCon.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myReader = myCommand.ExecuteReader();
                    table.Load(myReader);
                    myReader.Close();
                    myCon.Close();
                }
            }

            return new JsonResult(table);
        }

        [HttpPost]
        public JsonResult Post(Models.Reservation res)
        {
            string query = @"
                           INSERT INTO dbo.Reservation(IdentificationNo, CustomerName, SeatInfo, FlightID)
                           values (@IdentificationNo,@CustomerName,@SeatInfo, @FlightID)
                            ";

            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("TravelAppCon");
            SqlDataReader myReader;
            using (SqlConnection myCon = new SqlConnection(sqlDataSource))
            {
                myCon.Open();

                string checkQuery = "SELECT COUNT(*) FROM dbo.Reservation WHERE IdentificationNo = @IdentificationNo AND SeatInfo = @SeatInfo";

                using (SqlCommand checkCommand = new SqlCommand(checkQuery, myCon))
                {
                    checkCommand.Parameters.AddWithValue("@IdentificationNo", res.IdentificationNo);
                    checkCommand.Parameters.AddWithValue("@SeatInfo", res.SeatInfo);

                    int existingRecordsCount = (int)checkCommand.ExecuteScalar();

                    if (existingRecordsCount > 0)
                    {
                        // Daha önceden aynı IdentificationNo veya SeatInfo'ya sahip kayıtlar var
                        return new JsonResult("Duplicated IdentificationNo or SeatInfo");
                    }
                }
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myCommand.Parameters.AddWithValue("@IdentificationNo", res.IdentificationNo);
                    myCommand.Parameters.AddWithValue("@CustomerName", res.CustomerName);
                    myCommand.Parameters.AddWithValue("@SeatInfo", res.SeatInfo);
                    myCommand.Parameters.AddWithValue("@FlightID", res.FlightID);
                    myReader = myCommand.ExecuteReader();
                    table.Load(myReader);
                    myReader.Close();
                    myCon.Close();
                }
            }

            return new JsonResult("Added Successfully");
        }

    }
}
