package model

import "time"

type Event struct {
	Id          uint      `json:"id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	EventDate   time.Time `json:"event_date"`
	CreatedAt   time.Time `json:"created_at"`

	// Foreign key to User
	CreatedByID uint `json:"created_by_id"` // Foreign key ID field
	CreatedBy   User `json:"created_by"`    // Association to User struct
	Deleted     bool `json:"deleted" gorm:"default:false"`
}

type EventDeletion struct {
	Id        uint  `json:"id"`
	Eid       Event `json:"event_id"`
	DeletedBy User  `json:"user"`
}
