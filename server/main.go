package main

import (
	"my-fiber-app/config"     // Assuming this is where your DB setup is
	"my-fiber-app/controller" // Assuming this is where your controller is
	"my-fiber-app/middleware"

	"github.com/gofiber/fiber/v2"
)

func main() {
	// Initialize database connection
	db := config.Connect()

	// Create a new Fiber instance
	app := fiber.New()

	// Set up the login route with a closure to pass the db instance
	app.Post("/login", func(c *fiber.Ctx) error {
		return controller.Login(c, db)
	})
	app.Post("/event", middleware.JWTMiddleware(), func(c *fiber.Ctx) error {
		return c.Status(200).JSON(fiber.Map{
			"success": true,
			"message": "event is responsing meaning authenticaton is valid",
		})
	})

	// Start the server
	app.Listen(":3000")
}
