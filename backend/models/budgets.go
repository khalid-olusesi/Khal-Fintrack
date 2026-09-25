package models

import "time"

type Budget struct {
	ID         uint      `json:"id"`
	UserID     uint      `json:"user_id"`
	CategoryID uint      `json:"category_id"`
	Category   Category  `json:"category"`
	Budgeted   float64   `json:"budgeted"`
	Spent      float64   `json:"spent"`
	CreatedAt  time.Time `json:"createdat"`
	UpdatedAt  time.Time `json:"updatedAt"`
}
