namespace FutsalAPI.modules
{
    public class ConflictCheckDto
    {
        public string FutsalName { get; set; } = string.Empty;
        public string SelectDate { get; set; } = string.Empty; // e.g., "2025-11-28"
        public string SelectTime { get; set; } = string.Empty; // e.g., "14:30"
        public string SelectDuration { get; set; } = string.Empty; // e.g., "1 hour"
    }
}
