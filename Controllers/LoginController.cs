using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using FutsalAPI.Models;
using System.Threading.Tasks;
using FutsalAPI.modules;
using FutsalAPI.DataContext;
using Microsoft.EntityFrameworkCore;

namespace FutsalAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LoginController : ControllerBase
    {
        private readonly FutsalDbContext _context;

        public LoginController(FutsalDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> Login([FromBody] Login login)
        {
            if (login == null || string.IsNullOrEmpty(login.email) || string.IsNullOrEmpty(login.password))
            {
                return BadRequest(new { Message = "Email and Password are required." });
            }

            //if (string.IsNullOrEmpty(login.Email) || string.IsNullOrEmpty(login.Password))
            //{
            //    return BadRequest("Email and Password are required.");
            //}

            // Query the user from the database based on email
            var user = await _context.Registration
    .FirstOrDefaultAsync(u => u.email == login.email && u.password == login.password);


            if (user == null)
            {
                return Unauthorized(new { Message = "Invalid email or password." });
            }
            // Check user role (1 = Admin, 2 = User)
            var roleId = user.roleId;
            if (roleId == 1)
            {
                return Ok(new
                {
                    Message = "Admin login successful!",
                    RoleId = "Admin"
                });
            }
            else if (roleId == 2)
            {
                return Ok(new
                {
                    Message = "User login successful!",
                    RoleId = "User"
                });
            }

            // If role is invalid
            return Unauthorized(new { Message = "Invalid role. Please contact support." });

        }
    }
}
