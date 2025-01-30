package websocket

import "github.com/gofiber/websocket/v2"

var Clients = make(map[*websocket.Conn]bool)
