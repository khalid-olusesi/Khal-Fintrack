package initializers

import "khal-fintrack/models"

func SyncDatabase() {
	err := DB.AutoMigrate(&models.User{}) //"Create the users table if it doesn't exist. If it already exists, update it safely to match this model where possible."

	if err != nil {
		panic("Failed to Migrate to the database")
	}
}
