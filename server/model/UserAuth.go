package model

import "time"

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
