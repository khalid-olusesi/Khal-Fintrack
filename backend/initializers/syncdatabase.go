package initializers

import (
	"khal-fintrack/models"
	"log"
)

func SyncDatabase() {
	// Drop the old foreign key constraint so AutoMigrate can recreate it
	// with ON DELETE SET NULL. AutoMigrate won't modify existing constraints.
	if err := DB.Exec("ALTER TABLE transactions DROP CONSTRAINT IF EXISTS fk_transactions_category").Error; err != nil {
		log.Println("Warning: could not drop old FK constraint:", err)
	}

	// Make category_id nullable (needed for SET NULL to work)
	if err := DB.Exec("ALTER TABLE transactions ALTER COLUMN category_id DROP NOT NULL").Error; err != nil {
		log.Println("Warning: could not alter category_id column:", err)
	}

	err := DB.AutoMigrate(&models.User{}, &models.Transaction{}, &models.Category{}, &models.Budget{}) //"Create the users table if it doesn't exist. If it already exists, update it safely to match this model where possible. it does same for transactions too"

	if err != nil {
		panic("Failed to Migrate to the database")
	}


	if err := DB.Model(&models.User{}).
	Where("currency IS NULL OR currency = ?", "").
	Update("currency", "NGN").Error; err != nil {
	panic("Failed to set default currency")
}
}
