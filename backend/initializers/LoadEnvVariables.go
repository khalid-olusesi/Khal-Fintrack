package initializers

import (
	"log"

	"github.com/joho/godotenv"
)

func LoadEnvVariables() {
	err := godotenv.Load() //this loads the env file
	if err != nil {
		log.Println("There was an error when loading the .env file")
	} //error handling
}
