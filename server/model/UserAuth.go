package model

import "time"

type User struct {
	Id            uint      `json:"id"`
	username      string    `json:"id"`
	email         string    `json:"id"`
	password      string    `json:"id"`
	created_at    time.Time `json:"created_at"`
	last_login_at time.Time `json:"last_login_at"`
	is_admin      bool      `json:"is_admin"`
	is_staff      bool      `json:"is_staff"`
	is_user       bool      `json:"is_user"`
}
