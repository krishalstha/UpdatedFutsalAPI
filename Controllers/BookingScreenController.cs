using FutsalAPI.DataContext;
using FutsalAPI.modules;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Globalization; 

namespace FutsalAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookingScreenController : ControllerBase
    {
        private readonly FutsalDbContext _context;

        private const decimal SaturdayDiscountRate = 0.10m;
        private bool IsOverlapping(DateTime newStart, DateTime newEnd, string futsalName, DateTime selectDate)
        {
            return _context.BookingDetail.Any(b =>
                b.FutsalName == futsalName &&
                b.selectDate == selectDate &&
                newStart < b.EndTime &&
                newEnd > b.StartTime
            );
        }



        public BookingScreenController(FutsalDbContext context)
        {
            _context = context;
        }

        private void ApplyServerDiscountLogic(BookingDetail bookingDetail)
        {
            // Start with the base price
            decimal calculatedPrice = bookingDetail.price;
            bookingDetail.isDiscountApplied = false; // Reset Saturday discount flag

            // 1. Apply Saturday Discount (Fixed 10%)
            // Assuming BookingDetail.selectDate is a DateTime object
            if (bookingDetail.selectDate.DayOfWeek == DayOfWeek.Saturday)
            {
                decimal saturdayDiscountAmount = calculatedPrice * SaturdayDiscountRate;
                calculatedPrice -= saturdayDiscountAmount;
                bookingDetail.isDiscountApplied = true;
            }

            // 2. Apply User-Provided Discount (Percentage or Fixed Amount)
            string discountInput = (bookingDetail.discount !=null ? bookingDetail.discount.ToString() : string.Empty).Trim();

            if (!string.IsNullOrEmpty(discountInput))
            {
                decimal userDiscountAmount = 0m;

                if (discountInput.EndsWith("%"))
                {
                    // Percentage Discount: e.g., "10%"
                    if (decimal.TryParse(discountInput.TrimEnd('%'), NumberStyles.Any, CultureInfo.InvariantCulture, out decimal percent) && percent > 0)
                    {
                        userDiscountAmount = calculatedPrice * (percent / 100m);
                    }
                }
                else
                {
                    // Fixed Amount Discount (Rs): e.g., "100"
                    if (decimal.TryParse(discountInput, NumberStyles.Any, CultureInfo.InvariantCulture, out decimal fixedAmount) && fixedAmount > 0)
                    {
                        userDiscountAmount = fixedAmount;
                    }
                }

                calculatedPrice -= userDiscountAmount;
            }

            // 3. Finalization: Ensure final price is not negative
            bookingDetail.finalPrice = Math.Max(0m, calculatedPrice);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<BookingDetail>>> GetBookingDetails()
        {
            return await _context.BookingDetail.ToListAsync();
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<BookingDetail>> GetBookingDetail(int id)
        {
            var BookingDetail = await _context.BookingDetail.FindAsync(id);
            if (BookingDetail == null)
            {
                return NotFound($"BookingDetail with ID {id} not found.");
            }

            return BookingDetail;
        }

        [HttpGet("filter")]
        public async Task<ActionResult<IEnumerable<BookingDetail>>> GetBookingsByFutsal([FromQuery] string futsalName)
        {
            if (string.IsNullOrEmpty(futsalName) || futsalName == "All Futsals")
            {
                // Return all bookings
                return await _context.BookingDetail.ToListAsync();
            }

            // Return only bookings for the specific futsal
            var bookings = await _context.BookingDetail
                .Where(b => b.FutsalName == futsalName)
                .ToListAsync();

            return bookings;
        }
        [HttpGet("by-name/{futsalName}")]
        public async Task<ActionResult<FutsalDetail>> GetFutsalByName(string futsalName)
        {
            var futsal = await _context.FutsalDetail
                .FirstOrDefaultAsync(f => f.futsalName == futsalName);

            if (futsal == null) return NotFound($"Futsal with name '{futsalName}' not found.");

            return futsal;
        }

        [HttpGet("by-email/{email}")] 
        public async Task<ActionResult<BookingDetail>> GetBookingByUserEmail(string email)
        {
            var BookingDetail = await _context.BookingDetail.FirstOrDefaultAsync(x => x.email == email);

            if (BookingDetail == null)
            {
                return NotFound($"BookingDetail with email {email} not found.");
            }

            return BookingDetail;
        }

      
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBookingDetail(int id, BookingDetail bookingDetail)
        {
            if (id != bookingDetail.id)
            {
                return BadRequest("ID in the URL does not match the ID in the provided object.");
            }

            var existingBookingDetail = await _context.BookingDetail.FindAsync(id);
            if (existingBookingDetail == null)
            {
                return NotFound($"BookingDetail with ID {id} not found.");
            }

            // Update all non-calculated properties from the incoming object
            existingBookingDetail.email = bookingDetail.email;
            existingBookingDetail.selectDate = bookingDetail.selectDate;
            existingBookingDetail.selectTime = bookingDetail.selectTime;
            existingBookingDetail.selectDuration = bookingDetail.selectDuration;
            existingBookingDetail.selectPaymentMethod = bookingDetail.selectPaymentMethod;
            existingBookingDetail.contactNumber = bookingDetail.contactNumber;
            existingBookingDetail.price = bookingDetail.price;
            existingBookingDetail.discount = bookingDetail.discount; // Update user-provided discount string

            // Server recalculates finalPrice and isDiscountApplied based on the updated data
            ApplyServerDiscountLogic(existingBookingDetail);

            _context.Entry(existingBookingDetail).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BookingDetailExists(id))
                {
                    return NotFound($"BookingDetail with ID {id} no longer exists.");
                }
                throw;
            }

            return NoContent();
        }

        [HttpPost]
        public async Task<ActionResult<BookingDetail>> PostBookingDetail(BookingDetail bookingDetail)
        {
            if (bookingDetail == null)
                return BadRequest("BookingScreen details cannot be null.");
            string durationStr = new string(bookingDetail.selectDuration
      .Where(char.IsDigit)
      .ToArray());

            if (!int.TryParse(durationStr, out int durationMinutes))
            {
                return BadRequest("Invalid duration format.");
            }

            // Convert select date + select time to DateTime
            DateTime startTime = bookingDetail.selectDate.Date + bookingDetail.selectTime;
            DateTime endTime = startTime.AddMinutes(durationMinutes);

            // ❗ Check for overlapping booking
            if (IsOverlapping(startTime, endTime, bookingDetail.FutsalName, bookingDetail.selectDate))
            {
                return Conflict(new { message = "This time slot is already booked. Please choose another time." });
            }

            // Save final start/end time to database
            bookingDetail.StartTime = startTime;
            bookingDetail.EndTime = endTime;

            // Pricing logic
            ApplyServerDiscountLogic(bookingDetail);

            try
            {
                _context.BookingDetail.Add(bookingDetail);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetBookingDetail), new { id = bookingDetail.id }, bookingDetail);
            }
            catch (DbUpdateException)
            {
                return StatusCode(500, "Database error occurred while adding futsal detail.");
            }
            catch (Exception)
            {
                return StatusCode(500, "An unexpected error occurred while processing the request.");
            }
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBookingDetail(int id)
        {
            var BookingDetail = await _context.BookingDetail.FindAsync(id);
            if (BookingDetail == null)
            {
                return NotFound($"BookingDetail with ID {id} not found.");
            }

            _context.BookingDetail.Remove(BookingDetail);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool BookingDetailExists(int id)
        {
            return _context.BookingDetail.Any(e => e.id == id);
        }
    }
}
