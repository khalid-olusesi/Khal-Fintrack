package models

import "time"

type User struct {
	ID        uint
	Name      string
	Email     string `gorm:"unique"`
	Password  string
	AvatarURL string
	CreatedAt time.Time
	UpdatedAt time.Time
}
