package controller

import (
	"encoding/json"
	"fmt"
	"my-fiber-app/model"
	"time"

	"github.com/go-resty/resty/v2"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

// Razorpay credentials
const (
	RazorpayKeyID     = "rzp_test_B8eLvy5XIIbavj"
	RazorpayKeySecret = "C8ZsX3KDXFRSKwTxrYLReR3M"
)

func CreateOrder(c *fiber.Ctx) error {
	fmt.Println("Trying to pay with rayzor...")
	client := resty.New()

	orderData := map[string]interface{}{
		"amount":          50000, // Amount in paise (500.00 INR)
		"currency":        "INR",
		"receipt":         "order_rcptid_11",
		"payment_capture": 1,
	}

	resp, err := client.R().
		SetBasicAuth(RazorpayKeyID, RazorpayKeySecret).
		SetHeader("Content-Type", "application/json").
		SetBody(orderData).
		Post("https://api.razorpay.com/v1/orders")

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(200).Send(resp.Body())
}

type RazorpayRequest struct {
	User string `json:"user"`
	Res  string `json:"res"`
}

func Booking(c *fiber.Ctx, db *gorm.DB) error {
	fmt.Println("Booking table insertion...")

	var razorpayReq RazorpayRequest
	if err := c.BodyParser(&razorpayReq); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request body"})
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

	er := json.Unmarshal([]byte(razorpayReq.User), &dataUser)
	if er != nil {
		return c.Status(200).JSON(fiber.Map{
			"success": false,
			"message": "error in json converting",
		})
	}

	var user model.User
	if err := db.Where("Username = ?", dataUser.Username).First(&user).Error; err != nil {
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

	/*newBook:= book.Booking(
		UserID       : dataUser.Id
		User       :    user
		EventID       :
		Event         :
		TransactionID   :
		RazorpayOrderID :
		CreatedAt:      time.Now()
	)

	if err := db.Create(&book).Error; err != nil {
		return c.Status(200).JSON(fiber.Map{
			"success": false,
			"message": "Failed to create event",
		})
	}*/

	fmt.Printf("Received booking: User=%s, Res=%s\n", razorpayReq.User, razorpayReq.Res)

	return c.Status(200).JSON(fiber.Map{
		"message": "Booking received successfully",
		"user":    razorpayReq.User,
		"res":     razorpayReq.Res,
	})
}
