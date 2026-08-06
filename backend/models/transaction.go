package models

import "time"

type Transaction struct {
	ID          uint      `json:"id"`
	UserID      uint      `json:"userId"`
	Type        string    `json:"type"`
	Category    string    `json:"category"`
	Amount      float64   `json:"amount"`
	Description string    `json:"description"`
	Date        time.Time `json:"date"`
	Created     time.Time `json:"created"`
	UpdatedAt   time.Time `json:"updatedAt"`
}