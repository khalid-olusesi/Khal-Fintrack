package initializers

import (
	"log"

	"github.com/joho/godotenv"
)

func LoadEnvVariables() {
	err := godotenv.Load() //this loads the env file
	if err != nil {
		log.Fatal("There was n error when loading teh .env file")
	} //error handling
}
