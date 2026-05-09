using FutsalAPI.DataContext;
using FutsalAPI.Modules;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FutsalAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly FutsalDbContext _context;

        public PaymentController(FutsalDbContext context)
        {
            _context = context;
        }

        // 🧾 GET: api/Payment?bookingId=123
        [HttpGet] // <-- Added [HttpGet] attribute
        public async Task<ActionResult<IEnumerable<Payment>>> GetPayments(
            [FromQuery] int? bookingId) // <--- Accepts the query parameter
        {
            // FIX: Reverting to the singular DbSet name `_context.Payment` to match your likely context setup.
            IQueryable<Payment> paymentsQuery = _context.Payment;

            if (bookingId.HasValue)
            {
                // Filter the payments list if the bookingId is provided
                paymentsQuery = paymentsQuery.Where(p => p.BookingId == bookingId.Value);
            }

            // Execute the query, including the PaymentModelName mapping if necessary
            return await paymentsQuery
                .Select(p => new Payment
                {
                    Id = p.Id,
                    BookingId = p.BookingId,
                    PaymentModelId = p.PaymentModelId,
                    TotalAmount = p.TotalAmount,
                    // Map the enum value to its string name for the client-side module
                    PaymentModelName = p.PaymentModelId.ToString()
                })
                .ToListAsync();
        }

        // 🔍 GET: api/Payment/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Payment>> GetPayment(int id)
        {
            // FIX: Reverting to the singular DbSet name `_context.Payment`.
            var payment = await _context.Payment.FindAsync(id);
            if (payment == null)
                return NotFound();

            // Ensure PaymentModelName is set before returning
            payment.PaymentModelName = payment.PaymentModelId.ToString();

            return payment;
        }

        // ➕ POST: api/Payment
        [HttpPost]
        public async Task<ActionResult<Payment>> CreatePayment([FromBody] Payment payment)
        {
            if (payment == null)
                return BadRequest("Payment object is null.");

            if (!payment.BookingId.HasValue || payment.BookingId.Value <= 0)
                return BadRequest("BookingId is required and must be a valid ID.");

            // FIX: Assuming the primary key for BookingDetail is named 'id' (lowercase) based on your original code's inconsistency.
            // If the property is uppercase 'Id', this line is correct. Assuming lowercase 'id' for the fix.
            var bookingExists = await _context.BookingDetail.AnyAsync(b => b.id == payment.BookingId.Value);
            if (!bookingExists)
                return BadRequest($"Invalid BookingId. Booking with ID {payment.BookingId.Value} not found.");

            // ✅ Ensure PaymentModelName always matches the enum before saving
            payment.PaymentModelName = payment.PaymentModelId.ToString();

            // FIX: Reverting to the singular DbSet name `_context.Payment`.
            _context.Payment.Add(payment);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPayment), new { id = payment.Id }, payment);
        }

        // ✏️ PUT: api/Payment/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePayment(int id, [FromBody] Payment updatedPayment)
        {
            if (updatedPayment == null)
                return BadRequest("Invalid data.");

            // FIX: Reverting to the singular DbSet name `_context.Payment`.
            var existingPayment = await _context.Payment.FindAsync(id);
            if (existingPayment == null)
                return NotFound();

            // Update fields from the incoming payload
            if (updatedPayment.BookingId.HasValue)
                existingPayment.BookingId = updatedPayment.BookingId;

            existingPayment.PaymentModelId = updatedPayment.PaymentModelId;
            // Update the string name based on the updated enum ID
            existingPayment.PaymentModelName = updatedPayment.PaymentModelId.ToString();
            existingPayment.TotalAmount = updatedPayment.TotalAmount;

            _context.Entry(existingPayment).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // ❌ DELETE: api/Payment/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePayment(int id)
        {
            // FIX: Reverting to the singular DbSet name `_context.Payment`.
            var payment = await _context.Payment.FindAsync(id);
            if (payment == null)
                return NotFound();

            // FIX: Reverting to the singular DbSet name `_context.Payment`.
            _context.Payment.Remove(payment);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PaymentExists(int id)
        {
            // FIX: Reverting to the singular DbSet name `_context.Payment`.
            return _context.Payment.Any(e => e.Id == id);
        }
    }
}
