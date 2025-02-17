using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FutsalAPI.DataContext;
using FutsalAPI.modules;

namespace FutsalAPI.Controllers
{   
    [Route("api/FutsalDetails")]
    [ApiController]
    public class FutsalDetailsController : ControllerBase
    {
        private readonly FutsalDbContext _context;

        public FutsalDetailsController(FutsalDbContext context)
        {
            _context = context;
        }

        // GET: api/FutsalDetails
        [HttpGet]
        public async Task<ActionResult<IEnumerable<FutsalDetail>>> GetFutsalDetails()
        {
            return await _context.FutsalDetail.ToListAsync();
        }

        // GET: api/FutsalDetails/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<FutsalDetail>> GetFutsalDetail(int id)
        {
            var futsalDetail = await _context.FutsalDetail.FindAsync(id);
            if (futsalDetail == null)
            {
                return NotFound($"FutsalDetail with ID {id} not found.");
            }

            return futsalDetail;
        }

        // PUT: api/FutsalDetails/{id}
        [HttpPut("{id}")]//put
        public async Task<IActionResult> UpdateFutsalDetail(int id, FutsalDetail FutsalDetail)
        {
            if (id != FutsalDetail.futsalId)
            {
                return BadRequest("ID in the URL does not match the ID in the provided object.");
            }

            var existingFutsalDetail = await _context.FutsalDetail.FindAsync(id);
            if (existingFutsalDetail == null)
            {
                return NotFound($"FutsalDetail with ID {id} not found.");
            }

            // Update properties
            existingFutsalDetail.futsalName = FutsalDetail.futsalName;
            existingFutsalDetail.email = FutsalDetail.email;
            existingFutsalDetail.location = FutsalDetail.location;
            existingFutsalDetail.contactNumber = FutsalDetail.contactNumber;
            existingFutsalDetail.pricing = FutsalDetail.pricing;
            existingFutsalDetail.description = FutsalDetail.description;
            existingFutsalDetail.operationHours = FutsalDetail.operationHours;
            //existingFutsalDetail.court = FutsalDetail.court;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FutsalDetailExists(id))
                {
                    return NotFound($"FutsalDetail with ID {id} no longer exists.");
                }
                throw;
            }

            return NoContent();
        }

        // POST: api/FutsalDetails
        [HttpPost]
        public async Task<ActionResult<FutsalDetail>> PostFutsalDetail(FutsalDetail futsalDetail)
        {
            if (futsalDetail == null)
            {
                return BadRequest("Futsal details cannot be null.");
            }

            try
            {
                await _context.Database.ExecuteSqlRawAsync("SET IDENTITY_INSERT FutsalDetail ON");

                _context.FutsalDetail.Add(futsalDetail);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetFutsalDetail), new { id = futsalDetail.futsalId }, futsalDetail);
            }
            catch (DbUpdateException ex)
            {
                return StatusCode(500, "Database error occurred while adding futsal detail.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An unexpected error occurred while processing the request.");
            }
            finally
            {
                await _context.Database.ExecuteSqlRawAsync("SET IDENTITY_INSERT FutsalDetail OFF");
            }
        }

        // DELETE: api/FutsalDetails/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFutsalDetail(int id)
        {
            var futsalDetail = await _context.FutsalDetail.FindAsync(id);
            if (futsalDetail == null)
            {
                return NotFound($"FutsalDetail with ID {id} not found.");
            }

            _context.FutsalDetail.Remove(futsalDetail);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool FutsalDetailExists(int id)
        {
            return _context.FutsalDetail.Any(e => e.futsalId == id);
        }
    }
}
