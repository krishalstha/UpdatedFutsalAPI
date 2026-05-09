using Microsoft.AspNetCore.Mvc;

namespace FutsalAPI.Controllers
{
    public class Products : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
