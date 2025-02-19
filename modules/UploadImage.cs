using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FutsalAPI.modules
{
    public class UploadImage
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int id { get; set; }

        [Required]
        [Column(TypeName = "nvarchar(255)")]
        [StringLength(255, ErrorMessage = "File name cannot exceed 255 characters.")]
        public string fileName { get; set; } = "";

        [Required]
        [Column(TypeName = "nvarchar(500)")]
        [Url(ErrorMessage = "Please enter a valid URL.")]
        public string fileUrl { get; set; } = "";

        [Required]
        [Column(TypeName = "nvarchar(100)")]
        public string fileType { get; set; } = "";

        [Required]
        [Column(TypeName = "int")]
        public long fileSize { get; set; }

        [Column(TypeName = "nvarchar(100)")]
        public string uploadedBy { get; set; } = "";

        [Column(TypeName = "datetime")]
        public DateTime uploadDate { get; set; } = DateTime.Now;
    }
}
