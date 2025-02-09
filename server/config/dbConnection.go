package config

import (
	"my-fiber-app/model"
	"os"

	"gorm.io/driver/mysql"

	"fmt"

	"github.com/joho/godotenv"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Connect() *gorm.DB {
	godotenv.Load()
	host := os.Getenv("mysql_hostname")
	password := os.Getenv("mysql_password")
	username := os.Getenv("mysql_username")
	dbname := os.Getenv("mysql_dbname")
	dsn := fmt.Sprintf("%s:%s@tcp(%s)/%s?charset=utf8mb4&parseTime=True&loc=Local", username, password, host, dbname)
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("Database connection failed")

	}
	DB = db
	fmt.Println("Connection successfull")
	Automigrate(db)
	return db
}
func Automigrate(connection *gorm.DB) {
	connection.Debug().AutoMigrate(
		&model.User{},
		&model.Event{},
		&model.Booking{},
	)
}
