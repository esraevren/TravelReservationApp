using System.Globalization;

namespace TravelProjectApi.Models
{
    public class Reservation
    {
        public int RecordID { get; set; }
        public string IdentificationNo { get; set; }
        public string CustomerName { get; set; }
        public string SeatInfo { get; set; }

        public string FlightID { get; set; }

    }
}

