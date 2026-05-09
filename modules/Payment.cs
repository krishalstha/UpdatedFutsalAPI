using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FutsalAPI.Modules
{
    public class Payment
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [ForeignKey("Booking")]
        public int? BookingId { get; set; }

        public PaymentModel PaymentModelId { get; set; }  // ✅ Enum here

        public string? PaymentModelName { get; set; }

        public int? TotalAmount { get; set; }
    }
}
