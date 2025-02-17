using FutsalAPI.DataContext;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure Entity Framework Core with SQL Server.
builder.Services.AddDbContext<FutsalDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("FutsalConnection"))
);

// Add CORS policy to allow all origins.
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins", policyBuilder =>
    {
        policyBuilder.AllowAnyOrigin()
                     .AllowAnyMethod()
                     .AllowAnyHeader();
    });
});

// Optional: Add Logging service (e.g., Serilog, built-in logging)
builder.Services.AddLogging();

// Optional: Add Authentication and Authorization services (if needed)
// Example: builder.Services.AddAuthentication().AddJwtBearer(...);

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    // Ensure secure headers are used in production.
    app.UseHsts();
}

// Force HTTPS for all requests.
app.UseHttpsRedirection();

// Enable CORS policy.
app.UseCors("AllowAllOrigins");

// Optional: Enable request logging.
app.Use(async (context, next) =>
{
    Console.WriteLine($"Request: {context.Request.Method} {context.Request.Path}");
    await next();
});

// Enable routing.
app.UseRouting();

// Optional: Add Authentication middleware (if applicable).
// app.UseAuthentication();

// Add Authorization middleware (if applicable).
app.UseAuthorization();

// Map controllers to handle API requests.
app.MapControllers();

// Redirect root URL to Swagger UI.
app.MapGet("/", context =>
{
    context.Response.Redirect("/swagger/index.html", permanent: false);
    return Task.CompletedTask;
});

app.Run();
