using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;
using System.Threading.Tasks;


public class UploadImageController : ControllerBase
{
    private readonly string _uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "Uploads");
    public UploadImageController()
    {
        if (!Directory.Exists(_uploadPath))
        {
            Directory.CreateDirectory(_uploadPath);
        }
    }

    [HttpPost("/api/UploadImage")]
    public async Task<IActionResult> UploadImage (IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest("No file uploaded.");
        }
        try
        {
            var filePath = Path.Combine(_uploadPath, file.FileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return Ok(new { filePath });
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

            [HttpPut("/api/UploadImage")]
    public IActionResult EditFileName([FromQuery] string oldFileName, [FromQuery] string newFileName)
    {
        var oldFilePath = Path.Combine(_uploadPath, oldFileName);
        var newFilePath = Path.Combine(_uploadPath, newFileName);

        if (!System.IO.File.Exists(oldFilePath))
        {
            return NotFound("File not found.");
        }

        if (System.IO.File.Exists(newFilePath))
        {
            return BadRequest("New file name already exists.");
        }

        System.IO.File.Move(oldFilePath, newFilePath);
        return Ok(new { oldFileName, newFileName });
    }

    [HttpDelete("/api/UploadImage")]
    public IActionResult DeleteFile([FromQuery] string fileName)
    {
        var filePath = Path.Combine(_uploadPath, fileName);

        if (!System.IO.File.Exists(filePath))
        {
            return NotFound("File not found.");
        }

        System.IO.File.Delete(filePath);
        return Ok("File deleted successfully.");
    }
}
