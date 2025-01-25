package main

import (
	"fmt"
	"my-fiber-app/config"
)

func main() {
	fmt.Println("Called main function")
	config.Connect()
}
