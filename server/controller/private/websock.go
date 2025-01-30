package controller

import (
	"encoding/json"
	"fmt"
	"log"

	web "my-fiber-app/websocket"

	"github.com/gofiber/websocket/v2"
	"gorm.io/gorm"
)

// Broadcast messages to all connected clients
func BroadcastMessage(db *gorm.DB) {
	var events []struct {
		Id    uint `json:"id"`
		Slots int  `json:"slots"`
	}

	// Ensure you are using the correct table name if necessary
	if err := db.Table("events").Select("id, slots").Find(&events).Error; err != nil {
		fmt.Println("Error in query:", err)
		// Handle the error
		return
	}

	// Marshal the events data into JSON format
	message, err := json.Marshal(events)
	if err != nil {
		log.Println("Error marshaling events:", err)
		return
	}

	// Broadcast the message to all connected clients
	for client := range web.Clients {
		err := client.WriteMessage(websocket.TextMessage, message)
		if err != nil {
			log.Println("Error sending message:", err)
			client.Close()
			delete(web.Clients, client)
		}
	}
}
