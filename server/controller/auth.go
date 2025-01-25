package controller

import (
	"my-fiber-app/model"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"gorm.io/gorm"
)

var jwt_secret_auth = []byte("nQ4j0VgcysUJlBf8x8WngkyMeKTF4GVGf3yf46MrXaumHJY7pEuRo77e3ongtkp17lhU0U3a8YwYN4tCHjZEwokVr3qQDZrTggLk2mzHaUTMVyNxxrrFCE5i2dnftuRmLjcc6naqJzR5tuLWhaBkB5vKqeNgi9SXIO832fBvXsFYEjvAuFc4Hl49AT7D1QgtP50nKnRAH2tbkwSJHz1TRBcScQPiILgVl1V20W1jCVqIHiL2qm7flxe6ItvZQhao")

func Login(c *fiber.Ctx, db *gorm.DB) error {
	// Define the LoginRequest structure
	type LoginRequest struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	// Create a variable to hold the parsed JSON request
	var loginRequest LoginRequest

	// Parse the JSON body into the LoginRequest struct
	if err := c.BodyParser(&loginRequest); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "Invalid request body",
		})
	}

	// Validate the input (check if fields are empty)
	if loginRequest.Username == "" || loginRequest.Password == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Username and password are required",
		})
	}

	// Query the database for the user
	var user model.User
	if err := db.Where("Username = ?", loginRequest.Username).First(&user).Error; err != nil {
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

	// Check if the password matches (use a secure password hashing function like bcrypt)
	if user.Password != loginRequest.Password { // Replace with a password hashing check
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid username or password",
		})
	}

	// If the login is successful, return a success response
	return c.JSON(fiber.Map{
		"message": "Login successful",
		"user":    user,
	})
}

func GenerateJWT(username string) (string, error) {
	// Create a new token object, specifying the signing method and claims
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"username": username,
		"exp":      time.Now().Add(time.Hour * 24).Unix(), // Expires in 24 hours
	})

	// Sign and get the complete encoded token as a string
	return token.SignedString(jwt_secret_auth)
}
