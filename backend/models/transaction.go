package models

import "time"

type Transaction struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	UserID      uint      `json:"userId" gorm:"index"`
	Type        string    `json:"type"`
	CategoryID  uint      `json:"categoryId" gorm:"index"`
	Category    Category  `json:"category" gorm:"foreignKey:CategoryID"`
	Amount      float64   `json:"amount"`
	Description string    `json:"description"`
	Date        time.Time `json:"date"`
	Created     time.Time `json:"created" gorm:"autoCreateTime"`
	UpdatedAt   time.Time `json:"updatedAt"`
}
