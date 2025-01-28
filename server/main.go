package main

import (
	"fmt"
	"my-fiber-app/config" // Assuming this is where your DB setup is
	"my-fiber-app/controller"
	Event "my-fiber-app/controller/private" // Assuming this is where your controller is
	"my-fiber-app/middleware"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
	// Initialize database connection
	db := config.Connect()

	// Create a new Fiber instance
	app := fiber.New()
	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:5173",       // Change to your frontend's URL
		AllowMethods: "GET,POST,PUT,DELETE",         // HTTP methods you want to allow
		AllowHeaders: "Content-Type, Authorization", // Headers you want to allow
	}))

	// Set up the login route with a closure to pass the db instance
	app.Post("/login", func(c *fiber.Ctx) error {
		return controller.Login(c, db)
	})
	app.Post("/event", middleware.JWTMiddleware(), func(c *fiber.Ctx) error {
		return Event.Events(c, db)
	})
	app.Post("/eventCreation", middleware.JWTMiddleware(), func(c *fiber.Ctx) error {
		return Event.EventCreation(c, db)
	})
	app.Post("/eventDeletion", middleware.JWTMiddleware(), func(c *fiber.Ctx) error {
		return Event.EventCreation(c, db)
	})
	//ja
	app.Post("/signup", func(c *fiber.Ctx) error {
		return controller.SignupHandler(c, db)
	})

	app.Post("/check", middleware.JWTMiddleware(), func(c *fiber.Ctx) error {
		fmt.Println("Checking the validity of token...")
		return c.Status(200).JSON(fiber.Map{
			"success": true,
			"message": "Valid token ",
		})
	})

	// Start the server
	app.Listen(":3000")
}
