package main

import (
	"my-fiber-app/config" // Assuming this is where your DB setup is
	"my-fiber-app/controller"
	Event "my-fiber-app/controller/private" // Assuming this is where your controller is
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

	// Start the server
	app.Listen(":3000")
}
