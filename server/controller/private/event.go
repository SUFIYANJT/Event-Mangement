package controller

import (
	"encoding/json"
	"fmt"
	"log"
	"my-fiber-app/model"
	"path/filepath"
	"time"

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

func EventsOrganizer(c *fiber.Ctx, db *gorm.DB) error {
	fmt.Println("Fetching all the events...")
	var events []model.Event

	id := c.FormValue("id")
	fmt.Println(id)

	// Query to select all events
	if err := db.Where("deleted = ? and created_by_id = ?", false, id).Find(&events).Error; err != nil {
		return c.Status(200).JSON(fiber.Map{
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
	fmt.Println("Trying to create a new Event...")

	type Event struct {
		Name        string `json:"name"`
		Description string `json:"description"`
		EventDate   string `json:"eventdate"`
		User        string `json:"user"`
		Slots       int    `json:"slots"`
	}

	file, err := c.FormFile("file")
	if err != nil {
		return c.Status(200).SendString("Failed to retrieve the file")
	}
	ext := filepath.Ext(file.Filename)                 // Get the file extension
	timestamp := time.Now().Unix()                     // Current Unix timestamp
	newFileName := fmt.Sprintf("%d%s", timestamp, ext) // New unique file name

	// Create the destination path for saving the file
	destPath := filepath.Join("./uploads", newFileName)

	// Save the uploaded file to the uploads directory with the unique name
	err = c.SaveFile(file, destPath)
	if err != nil {
		return c.Status(200).SendString("Failed to save the file" + err.Error())
	}

	var event Event
	if err := c.BodyParser(&event); err != nil {
		return c.Status(200).JSON(fiber.Map{
			"success": false,
			"message": "Invalid request body",
		})
	}

	fmt.Println(event.User, event.Name, event.Description, event.EventDate, event.Slots)

	layout := "2006-01-02" // Correct layout for yyyy-mm-dd format
	parsedDate, err := time.Parse(layout, event.EventDate)
	fmt.Println(parsedDate, event.EventDate)

	if err != nil {
		log.Printf("Error parsing EventDate: %v", err)
		return c.Status(200).JSON(fiber.Map{
			"success": false,
			"message": "Invalid event_date format. Expected format: YYYY-MM-DD",
		})
	}

	type User struct {
		Id          uint      `json:"id"`
		Username    string    `json:"username"` // Exported field
		Email       string    `json:"email" gorm:"unique;not null"`
		Password    string    `json:"password"`      // Exported field
		CreatedAt   time.Time `json:"created_at"`    // Exported field
		LastLoginAt time.Time `json:"last_login_at"` // Exported field
		IsAdmin     bool      `json:"is_admin"`      // Exported field
		IsStaff     bool      `json:"is_staff"`      // Exported field
		IsUser      bool      `json:"is_user"`       // Exported field
	}

	var dataUser User

	er := json.Unmarshal([]byte(event.User), &dataUser)
	if er != nil {
		return c.Status(200).JSON(fiber.Map{
			"success": false,
			"message": "error in json converting",
		})
	}

	var user model.User
	if err := db.Where("Id = ?", dataUser.Id).First(&user).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Invalid username or password",
			})
		}
		// Handle other possible errors
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Database error",
		})
	}

	newEvent := model.Event{
		Name:        event.Name,
		Description: event.Description,
		EventDate:   parsedDate,
		CreatedAt:   time.Now(),
		Image:       "/uploads/" + newFileName,
		CreatedBy:   user,
		Slots:       event.Slots,
	}

	if err := db.Create(&newEvent).Error; err != nil {
		return c.Status(200).JSON(fiber.Map{
			"success": false,
			"message": "Failed to create event",
		})
	}

	return c.Status(200).JSON(fiber.Map{
		"success": true,
		"message": newEvent,
	})

}

func EventDeletion(c *fiber.Ctx, db *gorm.DB) error {

	type SignupCred struct {
		Username string `json:"username"`
		Password string `json:"password"`
		Email    string `json:"email"`
		Id       int    `json:"id"`
	}

	var signCred SignupCred
	if err := c.BodyParser(&signCred); err != nil {
		return c.Status(200).JSON(fiber.Map{
			"success": false,
			"message": "Invalid request body",
		})
	}

	var user model.User
	if err := db.Where("Id = ?", signCred.Id).First(&user).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Invalid username or password",
			})
		}
		// Handle other possible errors
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Database error",
		})
	}

	return c.Status(200).JSON(fiber.Map{
		"success": true,
		"message": "access granted to protected data",
	})
}
