package model

import "time"

type Booking struct {
	Id              uint      `json:"id"`
	UserID          uint      `json:"user_id"`  // Foreign key to User
	User            User      `json:"user"`     // Association with User
	EventID         uint      `json:"event_id"` // Foreign key to Event
	Event           Event     `json:"event"`    // Association with Event
	TransactionID   string    `json:"transaction_id" gorm:"unique;not null"`
	RazorpayOrderID string    `json:"razorpay_order_id" gorm:"unique;not null"` // Unique Transaction ID
	CreatedAt       time.Time `json:"created_at"`                               // Timestamp for booking
	Ticket          int       `json:"ticket"`
}
