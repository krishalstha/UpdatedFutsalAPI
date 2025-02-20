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

    [HttpGet("/api/UploadImage")]
    public IActionResult GetImage([FromQuery] string imageName)
    {
        var imagePath = Path.Combine(_uploadPath, imageName);

        if (!System.IO.File.Exists(imagePath))
        {
            return NotFound("Image not found.");
        }

        var imageBytes = System.IO.File.ReadAllBytes(imagePath);
        var contentType = "application/octet-stream";
        return File(imageBytes, contentType, imageName);
    }

    [HttpPost("/api/UploadImage")]
    public async Task<IActionResult> UploadImage(IFormFile image)
    {
        if (image == null || image.Length == 0)
        {
            return BadRequest("No image uploaded.");
        }
        try
        {
            var imagePath = Path.Combine(_uploadPath, image.FileName);

            using (var stream = new FileStream(imagePath, FileMode.Create))
            {
                await image.CopyToAsync(stream);
            }

            return Ok(new { imagePath });
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    [HttpPut("/api/UploadImage")]
    public IActionResult EditImageName([FromQuery] string oldImageName, [FromQuery] string newImageName)
    {
        var oldImagePath = Path.Combine(_uploadPath, oldImageName);
        var newImagePath = Path.Combine(_uploadPath, newImageName);

        if (!System.IO.File.Exists(oldImagePath))
        {
            return NotFound("Image not found.");
        }

        if (System.IO.File.Exists(newImagePath))
        {
            return BadRequest("New image name already exists.");
        }

        System.IO.File.Move(oldImagePath, newImagePath);
        return Ok(new { oldImageName, newImageName });
    }

    [HttpDelete("/api/UploadImage")]
    public IActionResult DeleteImage([FromQuery] string imageName)
    {
        var imagePath = Path.Combine(_uploadPath, imageName);

        if (!System.IO.File.Exists(imagePath))
        {
            return NotFound("Image not found.");
        }

        System.IO.File.Delete(imagePath);
        return Ok("Image deleted successfully.");
    }
}
