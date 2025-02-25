using FutsalAPI.DataContext;
using FutsalAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FutsalAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AcceptBookingsController : ControllerBase
    {
        private readonly FutsalDbContext _context;

        public AcceptBookingsController(FutsalDbContext context)
        {
            _context = context;
        }

        // GET: api/AcceptBookings/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<AcceptBookings>> GetBookingById(int id)
        {
            var booking = await _context.AcceptBookings.FindAsync(id);
            if (booking == null)
            {
                return NotFound(new { message = "Booking not found." });
            }
            return Ok(booking);
        }

        // GET: api/AcceptBookings
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AcceptBookings>>> GetBookings()
        {
            return await _context.AcceptBookings.ToListAsync();
        }

        // POST: api/AcceptBookings/accept
        [HttpPost("accept")]
        public async Task<IActionResult> AcceptBooking([FromBody] AcceptBookings acceptBooking)
        {
            if (acceptBooking == null || acceptBooking.BookingId <= 0)
            {
                return BadRequest(new { message = "Invalid booking data." });
            }

            var existingBooking = await _context.BookingDetail.FindAsync(acceptBooking.BookingId);
            if (existingBooking == null)
            {
                return BadRequest(new { message = "Referenced booking does not exist." });
            }

            if (acceptBooking.DateTime == default)
            {
                return BadRequest(new { message = "Invalid DateTime value." });
            }

            acceptBooking.Id = 0; // Ensure database generates a new ID
            acceptBooking.Status = "Accepted";

            try
            {
                _context.AcceptBookings.Add(acceptBooking);
                await _context.SaveChangesAsync();
                return Ok(new { message = "Booking accepted successfully", acceptBooking });
            }
            catch (DbUpdateException ex)
            {
                Console.WriteLine($"Database Error: {ex.InnerException?.Message}");
                return StatusCode(500, new { message = "Database error occurred." });
            }
        }

        // PUT: api/AcceptBookings/accept/{id}
        [HttpPut("accept/{id}")]
        public async Task<IActionResult> AcceptBooking(int id)
        {
            var booking = await _context.AcceptBookings.FindAsync(id);
            if (booking == null)
            {
                return NotFound(new { message = "Booking not found." });
            }

            booking.Status = "Accepted";

            try
            {
                _context.Entry(booking).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return Ok(new { message = "Booking accepted successfully", booking });
            }
            catch (DbUpdateException ex)
            {
                Console.WriteLine($"Database Error: {ex.InnerException?.Message}");
                return StatusCode(500, new { message = "Database update error occurred." });
            }
        }

        // DELETE: api/AcceptBookings/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBooking(int id)
        {
            var booking = await _context.AcceptBookings.FindAsync(id);
            if (booking == null)
            {
                return NotFound(new { message = "Booking not found." });
            }

            try
            {
                _context.AcceptBookings.Remove(booking);
                await _context.SaveChangesAsync();
                return Ok(new { message = "Booking deleted successfully." });
            }
            catch (DbUpdateException ex)
            {
                Console.WriteLine($"Database Error: {ex.InnerException?.Message}");
                return StatusCode(500, new { message = "Database deletion error occurred." });
            }
        }
    }
}
