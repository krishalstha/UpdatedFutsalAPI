using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FutsalAPI.modules
{
    public class BookingDetail
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]  
        public int? id { get; set; }


        [Required]
      
        [Column(TypeName = "nvarchar(100)")]
        [EmailAddress(ErrorMessage = "Please enter a valid email address.")]
        public string email { get; set; } = "";


        [Column(TypeName = "date")]
        [Required(ErrorMessage = "Date is required.")]
        public DateTime selectDate { get; set; }

        [Column(TypeName = "time")]
        [Required(ErrorMessage = "Time is required.")]
        public TimeSpan selectTime { get; set; }

        [Column(TypeName = "nvarchar(10)")]
        [Required(ErrorMessage = "Duration is required.")]
        public string selectDuration { get; set; } = "";



        [Column(TypeName = "nvarchar(10)")]
        [Required(ErrorMessage = "calc is required.")]
        public string calcTime { get; set; } = "";


        [Column(TypeName = "nvarchar(10)")]
        [Required(ErrorMessage = "Court selection is required.")]
        public string selectCourt { get; set; } = "";

    
        [Column(TypeName = "nvarchar(10)")]
        [Required(ErrorMessage = "Payment method is required.")]
        public string selectPaymentMethod { get; set; } = "";

        [Column(TypeName = "nvarchar(15)")]
        [RegularExpression(@"^\d{10}$", ErrorMessage = "Contact Number must be exactly 10 digits and numeric.")]
        [Required(ErrorMessage = "Contact Number is required.")]
        public string contactNumber { get; set; } = "";
    }
}
