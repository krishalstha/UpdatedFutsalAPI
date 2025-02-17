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
                name: "BookingDetail",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    email = table.Column<string>(type: "nvarchar(100)", nullable: false),
                    selectDate = table.Column<DateTime>(type: "date", nullable: false),
                    selectTime = table.Column<TimeSpan>(type: "time", nullable: false),
                    selectDuration = table.Column<string>(type: "nvarchar(10)", nullable: false),
                    calcTime = table.Column<string>(type: "nvarchar(10)", nullable: false),
                    selectCourt = table.Column<string>(type: "nvarchar(10)", nullable: false),
                    selectPaymentMethod = table.Column<string>(type: "nvarchar(10)", nullable: false),
                    contactNumber = table.Column<string>(type: "nvarchar(15)", nullable: false)
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
                    operationHours = table.Column<string>(type: "nvarchar(15)", nullable: false)
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
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BookingDetail");

            migrationBuilder.DropTable(
                name: "FutsalDetail");

            migrationBuilder.DropTable(
                name: "Login");

            migrationBuilder.DropTable(
                name: "Registration");
        }
    }
}
