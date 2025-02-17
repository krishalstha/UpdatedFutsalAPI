using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using FutsalAPI.Models;
using System.Threading.Tasks;
using FutsalAPI.DataContext;
using Microsoft.EntityFrameworkCore;

namespace FutsalAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RegisterController : ControllerBase
    {
        private readonly FutsalDbContext _context;

        public RegisterController(FutsalDbContext context)

        {
            _context = context;
        }

        [HttpPost]
       
        public async Task<IActionResult> Register([FromBody] Register register)
        {
            // Validate input
            if (register == null)
            {   
                return BadRequest(new { Message = "Invalid registration data." });
            }

            if (string.IsNullOrWhiteSpace(register.name) ||
                string.IsNullOrWhiteSpace(register.email) ||
                string.IsNullOrWhiteSpace(register.password))
                //register.Roleid == 0)
            {
                return BadRequest(new { Message = "Name, Email, Password, and RoleId are required." });
            }

            try
            {
                // Check if email already exists
                var existingUser = await _context.Registration.FirstOrDefaultAsync(u => u.email == register.email);
                if (existingUser != null)
                {
                    return BadRequest(new { Message = "Email is already registered." });
                }

                // Create a new user
                var newUser = new Register
                {
                    roleId = register.roleId,
                    name = register.name,
                    email = register.email,
                    password = register.password // Store plain text password (not recommended for production)
                };

                // Add the user to the database
                _context.Registration.Add(newUser);
                await _context.SaveChangesAsync();

                // Return a success response
                return Ok(new { Message = "User registered successfully!", 
                User = new{
                    id = newUser.Id,
                    name = newUser.name,
                    email = newUser.email
                }
                    });
            }
            catch (DbUpdateException ex)
            {
                // Handle database update errors
                return StatusCode(500, new { Message = "An error occurred while saving the user.", Error = ex.Message });
            }
            catch (System.Exception ex)
            {
                // Handle general errors
                return StatusCode(500, new { Message = "An unexpected error occurred.", Error = ex.Message });
            }
        }
    }
}
