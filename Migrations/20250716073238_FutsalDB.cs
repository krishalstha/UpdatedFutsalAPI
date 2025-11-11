using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FutsalAPI.Migrations
{
    /// <inheritdoc />
    public partial class FutsalDB : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AcceptBookings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BookingId = table.Column<int>(type: "int", nullable: false),
                    DateTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AcceptBookings", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "BookingDetail",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    email = table.Column<string>(type: "nvarchar(100)", nullable: false),
                    price = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    selectDate = table.Column<DateTime>(type: "date", nullable: false),
                    selectTime = table.Column<TimeSpan>(type: "time", nullable: false),
                    selectDuration = table.Column<string>(type: "nvarchar(10)", nullable: false),
                    calcTime = table.Column<string>(type: "nvarchar(10)", nullable: false),
                    selectPaymentMethod = table.Column<string>(type: "nvarchar(10)", nullable: false),
                    contactNumber = table.Column<string>(type: "nvarchar(15)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BookingDetail", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "FutsalDetail",
                columns: table => new
                {
                    futsalId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    futsalName = table.Column<string>(type: "nvarchar(100)", nullable: false),
                    location = table.Column<string>(type: "nvarchar(200)", nullable: false),
                    contactNumber = table.Column<string>(type: "nvarchar(15)", nullable: false),
                    email = table.Column<string>(type: "nvarchar(100)", nullable: false),
                    description = table.Column<string>(type: "nvarchar(500)", nullable: false),
                    pricing = table.Column<string>(type: "nvarchar(15)", nullable: false),
                    operationHours = table.Column<string>(type: "nvarchar(15)", nullable: false),
                    image = table.Column<string>(type: "nvarchar(255)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FutsalDetail", x => x.futsalId);
                });

            migrationBuilder.CreateTable(
                name: "Login",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    password = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Login", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Registration",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    roleId = table.Column<int>(type: "int", nullable: false),
                    name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    password = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Registration", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "UploadImage",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    imageName = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    imageUrl = table.Column<string>(type: "nvarchar(500)", nullable: false),
                    imageType = table.Column<string>(type: "nvarchar(100)", nullable: false),
                    imageSize = table.Column<int>(type: "int", nullable: false),
                    uploadedBy = table.Column<string>(type: "nvarchar(100)", nullable: false),
                    uploadDate = table.Column<DateTime>(type: "datetime", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UploadImage", x => x.id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AcceptBookings");

            migrationBuilder.DropTable(
                name: "BookingDetail");

            migrationBuilder.DropTable(
                name: "FutsalDetail");

            migrationBuilder.DropTable(
                name: "Login");

            migrationBuilder.DropTable(
                name: "Registration");

            migrationBuilder.DropTable(
                name: "UploadImage");
        }
    }
}
