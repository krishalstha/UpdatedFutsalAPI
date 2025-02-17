using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.RegularExpressions;

namespace FutsalAPI.modules
{
    public class FutsalDetail
    {
        // Nullable FutsalId for cases when it is auto-generated or not required in the request body
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]  // Auto-generate the ID on insert
        public int? futsalId { get; set; }  // Make it nullable

        [Required]
        [Column(TypeName = "nvarchar(100)")]
        public string futsalName { get; set; } = "";

        [Column(TypeName = "nvarchar(200)")]
        public string location { get; set; } = "";

        // ContactNumber: Ensure only numeric input and 10 digits
        [Column(TypeName = "nvarchar(15)")]
        [RegularExpression(@"^\d{10}$", ErrorMessage = "Contact Number must be exactly 10 digits and numeric.")]
        [Required(ErrorMessage = "Contact Number is required.")]
        public string contactNumber { get; set; } = "";

        [Column(TypeName = "nvarchar(100)")]
        [EmailAddress(ErrorMessage = "Please enter a valid email address.")]
        public string email { get; set; } = "";

        [Column(TypeName = "nvarchar(500)")]
        public string description { get; set; } = "";

        [Column(TypeName = "nvarchar(15)")]
        public string pricing { get; set; } = "";

        [Column(TypeName = "nvarchar(15)")]
        public string operationHours { get; set; } = "";

        //[Column(TypeName = "nvarchar(20)")]
        //public string court  { get; set; } = "";

    }
}
