using Microsoft.AspNetCore.Mvc;

namespace FutsalNepalAPI.Controllers
{
    [ApiController]
    [Route("api/esewa")]
    public class EsewaController : ControllerBase
    {
        [HttpPost("pay")]
        public IActionResult Pay([FromBody] PaymentRequest request)
        {
            if (request.Amount <= 0 || string.IsNullOrEmpty(request.TransactionId))
            {
                return BadRequest(new { success = false, message = "Invalid payment data" });
            }

            return Ok(new
            {
                success = true,
                message = "Payment successful",
                transactionId = request.TransactionId,
                amount = request.Amount
            });
        }

        [HttpGet("status/{transactionId}")]
        public IActionResult CheckPaymentStatus(string transactionId)
        {
            if (transactionId == "TXN123456")
            {
                return Ok(new
                {
                    success = true,
                    message = "Payment verified",
                    transactionId = transactionId,
                    status = "Completed"
                });
            }

            return NotFound(new
            {
                success = false,
                message = "Transaction not found"
            });
        }
    }

    public class PaymentRequest
    {
        public decimal Amount { get; set; }
        public string TransactionId { get; set; }
    }
}
