package initializers

import (
	"fmt"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB //dont ever forget this
func ConnectToDB() {
	var err error //error handling
	host := os.Getenv("DB_HOST")
	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASSWORD")
	dbname := os.Getenv("DB_NAME")
	port := os.Getenv("DB_PORT")
	sslmode := os.Getenv("DB_SSLMODE")

	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=%s",
		host,
		user,
		password,
		dbname,
		port,
		sslmode,
	)

	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{}) //This opens the connection to Neon.

	if err != nil {
		panic("failed to connect DB")
	}
} //connecting to the database
