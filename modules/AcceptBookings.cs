using FutsalAPI.Models;  // Update to correct namespace

namespace FutsalAPI.Models
{
    public class AcceptBookings
    {
        public int Id { get; set; }
        public int BookingId { get; set; }
        public DateTime DateTime { get; set; }
        public string Status { get; set; } = string.Empty;  // Default value

        public AcceptBookings()
        {
            // Optional: Default initialization in constructor if not set by the caller
           
            Status = string.Empty;
        }
    }
}
