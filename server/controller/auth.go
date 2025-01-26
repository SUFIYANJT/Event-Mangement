package controller

import (
	"fmt"
	"my-fiber-app/model"
	"strings"
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
	token, err := GenerateJWT(loginRequest.Username)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"success": false,
			"message": "couldn't create token",
		})
	}
	fmt.Println("User login updated...")
	if err := db.Model(&user).Update("LastLoginAt", time.Now()).Error; err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid username or password",
		})
	}

	// If the login is successful, return a success response
	return c.JSON(fiber.Map{
		"sucess": true,
		"message": fiber.Map{
			"token": token,
			"user":  user,
		},
	})
}

type SignupCred struct {
	Username string `json:"username"`
	Password string `json:"password"`
	Email    string `json:"email"`
}

func SignupHandler(c *fiber.Ctx, db *gorm.DB) error {
	// Parse the JSON body into the SignupCred struct
	var signupCred SignupCred
	if err := c.BodyParser(&signupCred); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "Invalid request body",
		})
	}
	fmt.Println(signupCred, len(signupCred.Username) > 5)
	if len(signupCred.Username) < 5 || !strings.Contains(signupCred.Email, "@gmail.com") || len(signupCred.Password) < 8 {
		return c.Status(200).JSON(fiber.Map{
			"success": false,
			"message": "some credential is missing",
		})
	}
	// Check if the username is already taken
	var user model.User
	if err := db.Where("username = ?", signupCred.Username).First(&user).Error; err == nil {
		// User exists with the given username
		return c.Status(200).JSON(fiber.Map{
			"success": false,
			"message": "Username is already taken",
		})
	} else if err != nil && err != gorm.ErrRecordNotFound {
		// Handle database errors
		return c.Status(200).JSON(fiber.Map{
			"success": false,
			"message": "Database error",
		})
	}

	// If username is not taken, create a new user
	newUser := model.User{
		Username:    signupCred.Username,
		Password:    signupCred.Password, // You should hash the password here
		Email:       signupCred.Email,
		CreatedAt:   time.Now(),
		LastLoginAt: time.Now(),
		IsUser:      true,
	}
	token, err := GenerateJWT(newUser.Username)
	if err != nil {
		return c.Status(200).JSON(fiber.Map{
			"success": false,
			"message": "couldn't create token",
		})
	}
	// Save the new user to the database
	if err := db.Create(&newUser).Error; err != nil {
		return c.Status(200).JSON(fiber.Map{
			"success": false,
			"message": "Failed to create user",
		})
	}

	// Respond with success
	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"success": true,
		"message": fiber.Map{
			"token": token,
			"user":  newUser,
		},
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
