package main

import (
	"fmt"
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/websocket/v2"
)

func main() {
	// Create a new Fiber app
	app := fiber.New()
	app.Use(logger.New())
	// Define a basic route
	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendFile("./static/client_ws.html")
	})

	app.Use(cors.New(cors.Config{
		AllowOrigins: "*", // Allow all origins (for development)
		AllowMethods: "GET,POST,PUT,DELETE,OPTIONS",
		AllowHeaders: "Origin, Content-Type, Accept",
	}))

	app.Use("/ws", func(c *fiber.Ctx) error {
		log.Println("Websocket Connection is establishing...")
		if websocket.IsWebSocketUpgrade(c) {
			return c.Next()
		}
		return fiber.ErrUpgradeRequired
	})

	// WebSocket route
	app.Get("/ws", websocket.New(func(c *websocket.Conn) {
		defer c.Close()

		// Handle messages
		for {
			messageType, msg, err := c.ReadMessage()
			if err != nil {
				log.Println("Error reading message:", err)
				break
			}
			log.Printf("Received: %s\n", msg)

			// Echo the message back to the client
			if err = c.WriteMessage(messageType, []byte(fmt.Sprintf("Echo: %s", msg))); err != nil {
				log.Println("Error writing message:", err)
				break
			}
		}
	}))

	// Start the server on port 3000
	log.Fatal(app.Listen(":3000"))
}
