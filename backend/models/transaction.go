package models

import "time"

type Transaction struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	UserID      uint      `json:"userId"     gorm:"index:idx_user_date,priority:1"`
	Type        string    `json:"type"`
	CategoryID  *uint     `json:"categoryId" gorm:"index:idx_category_date,priority:1"`
	Category    *Category `json:"category" gorm:"foreignKey:CategoryID;constraint:OnDelete:SET NULL;"`
	Amount      float64   `json:"amount"`
	Description string    `json:"description"`
	Date        time.Time `json:"date" gorm:"index:idx_user_date,priority:2;index:idx_category_date,priority:2"`
	Created     time.Time `json:"created" gorm:"autoCreateTime"`
	UpdatedAt   time.Time `json:"updatedAt"`
}
