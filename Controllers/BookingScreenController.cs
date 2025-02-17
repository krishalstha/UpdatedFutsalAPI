using FutsalAPI.DataContext;
using FutsalAPI.modules;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FutsalAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookingScreenController : ControllerBase
    {
        private readonly FutsalDbContext _context;

        public BookingScreenController(FutsalDbContext context)
        {
            _context = context;
        }


        [HttpGet]
        public async Task<ActionResult<IEnumerable<BookingDetail>>> GetBookingDetails()
        {
            return await _context.BookingDetail.ToListAsync();
        }

        // GET: api/BookingScreenDetail/{id}
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

        // PUT: api/BookingScreenDetail/{id}
        [HttpPut("{id}")]//put
        public async Task<IActionResult> UpdateBookingDetail(int id, BookingDetail BookingDetail)
        {

            if (id != BookingDetail.id)

            {
                return BadRequest("ID in the URL does not match the ID in the provided object.");
            }

            var existingBookingDetail = await _context.BookingDetail.FindAsync(id);
            if (existingBookingDetail == null)
            {
                return NotFound($"BookingDetail with ID {id} not found.");
            }

            // Update properties

            existingBookingDetail.email = BookingDetail.email;
            existingBookingDetail.selectDate = BookingDetail.selectDate;
            existingBookingDetail.selectTime = BookingDetail.selectTime;
            existingBookingDetail.selectDuration = BookingDetail.selectDuration;
            existingBookingDetail.selectCourt = BookingDetail.selectCourt;
            existingBookingDetail.selectPaymentMethod = BookingDetail.selectPaymentMethod;
            existingBookingDetail.contactNumber = BookingDetail.contactNumber;



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

        // POST: api/BookingScreenDetail
        [HttpPost]
        public async Task<ActionResult<BookingDetail>> PostBookingDetail(BookingDetail bookingDetail)
        {
            if (bookingDetail == null)
            {
                return BadRequest("BookingScreen details cannot be null.");
            }

            try
            {

                await _context.Database.ExecuteSqlRawAsync("SET IDENTITY_INSERT BookingDetail ON");

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
            finally
            {

                await _context.Database.ExecuteSqlRawAsync("SET IDENTITY_INSERT BookingDetail OFF");

            

            }
        }


        // DELETE: api/BookingScreenDetail/{id}
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