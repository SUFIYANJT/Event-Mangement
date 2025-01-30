package controller

import (
	"encoding/json"
	"fmt"

	"time"

	"my-fiber-app/model"

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

type RazorpayResponse struct {
	PaymentID string `json:"razorpay_payment_id"`
	OrderID   string `json:"razorpay_order_id"`
	Signature string `json:"razorpay_signature"`
}

type User struct {
	Id          uint      `json:"id"`
	Username    string    `json:"username"`
	Email       string    `json:"email"`
	Password    string    `json:"password"`
	CreatedAt   time.Time `json:"created_at"`
	LastLoginAt time.Time `json:"last_login_at"`
	IsAdmin     bool      `json:"is_admin"`
	IsStaff     bool      `json:"is_staff"`
	IsUser      bool      `json:"is_user"`
}

type Event struct {
	Id          int       `json:"id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	Slots       int       `json:"slots"`
	FilePath    string    `json:"file_path"`
	CreatedAt   time.Time `json:"created_at"`
	CreatedBy   User      `json:"created_by"`
	EventDate   time.Time `json:"eventdate"`
}

type BookingDetails struct {
	Increment   int      `json:"increment"`
	Names       []string `json:"names"`
	Ages        []int    `json:"ages"`
	Emails      []string `json:"emails"`
	PhoneNumber string   `json:"phoneNumber"`
}

type RazorpayRequest struct {
	Response       RazorpayResponse `json:"response"`
	User           User             `json:"user"`
	Event          Event            `json:"event"`
	BookingDetails BookingDetails   `json:"bookingdetails"`
}

func Booking(c *fiber.Ctx, db *gorm.DB) error {
	fmt.Println("Booking table insertion...")

	// Parse JSON request
	var razorpayReq struct {
		Response       RazorpayResponse `json:"response"`
		User           string           `json:"user"`
		Event          string           `json:"event"`
		BookingDetails string           `json:"bookingdetails"`
	}

	if err := c.BodyParser(&razorpayReq); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"success": false,
			"message": "Invalid request body: " + err.Error(),
		})
	}

	// Unmarshal the nested JSON fields
	var dataUser model.User
	if err := json.Unmarshal([]byte(razorpayReq.User), &dataUser); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"success": false,
			"message": "Error parsing user data: " + err.Error(),
		})
	}

	var event model.Event
	if err := json.Unmarshal([]byte(razorpayReq.Event), &event); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"success": false,
			"message": "Error parsing event data: " + err.Error(),
		})
	}

	var bookingDetails BookingDetails
	if err := json.Unmarshal([]byte(razorpayReq.BookingDetails), &bookingDetails); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"success": false,
			"message": "Error parsing booking details: " + err.Error(),
		})
	}

	// Debugging: Print parsed data
	fmt.Println("Parsed User:", dataUser)
	fmt.Println("Parsed Event:", event)
	fmt.Println("Parsed Booking Details:", bookingDetails)

	// 🔹 FIND EVENT IN DATABASE BEFORE INSERTING
	var existingEvent model.Event
	result := db.Where("id= ?", event.Id).First(&existingEvent)

	if result.Error != nil {
		// If the event doesn't exist, return an error
		return c.Status(400).JSON(fiber.Map{
			"success": false,
			"message": "Event not found. Please create the event first.",
		})
	}
	var orderID string
	if razorpayReq.Response.OrderID != "" {
		orderID = razorpayReq.Response.OrderID
	} else {
		orderID = razorpayReq.Response.PaymentID
	}

	// Insert into Booking Table
	newBooking := model.Booking{
		UserID:          dataUser.Id,
		User:            dataUser,
		EventID:         existingEvent.Id, // ✅ Use existing event ID
		Event:           existingEvent,
		TransactionID:   razorpayReq.Response.PaymentID,
		RazorpayOrderID: orderID,
		CreatedAt:       time.Now(),
		Ticket:          bookingDetails.Increment,
	}

	// Save booking in DB
	if err := db.Create(&newBooking).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"success": false,
			"message": "Failed to save booking: " + err.Error(),
		})
	}
	result2 := db.Model(&event).
		Where("id = ?", event.Id). // Ensure slots don't go negative
		UpdateColumn("slots", gorm.Expr("slots - ?", bookingDetails.Increment))

	if result2.Error != nil {
		// If the event doesn't exist, return an error
		return c.Status(400).JSON(fiber.Map{
			"success": false,
			"message": "Event not found. Please create the event first.",
		})
	}
	return c.Status(200).JSON(fiber.Map{
		"message": "Booking successful",
		"user":    dataUser,
		"event":   existingEvent,
		"details": bookingDetails,
	})
}
