package controller

import (
	"my-fiber-app/model"
	"time"

	"log"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func Events(c *fiber.Ctx, db *gorm.DB) error {
	var events []model.Event

	// Query to select all events
	if err := db.Where("deleted = ?", false).Find(&events).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "Failed to retrieve events",
		})
	}

	// Return the events as JSON
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"message": events,
	})
}

func EventCreation(c *fiber.Ctx, db *gorm.DB) error {
	type Event struct {
		Name        string `json:"name"`
		Description string `json:"description"`
		EventDate   string `json:"event_date"`
	}
	var event Event
	if err := c.BodyParser(&event); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "Invalid request body",
		})
	}
	layout := "2006-01-02" // Define the date format (adjust based on your input format)
	parsedDate, err := time.Parse(layout, event.EventDate)
	if err != nil {
		log.Printf("Error parsing EventDate: %v", err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "Invalid event_date format. Expected format: YYYY-MM-DD",
		})
	}
	newEvent := model.Event{
		Name:        event.Name,
		Description: event.Description,
		EventDate:   parsedDate,
		CreatedAt:   time.Now(),
	}
	if err := db.Create(&newEvent).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "Failed to create user",
		})
	}

	return c.Status(200).JSON(fiber.Map{
		"success": true,
		"message": newEvent,
	})
}

func eventDeletion(c *fiber.Ctx, db *gorm.DB) error {
	return c.Status(200).JSON(fiber.Map{
		"success": true,
		"message": "access granted to protected data",
	})
}
