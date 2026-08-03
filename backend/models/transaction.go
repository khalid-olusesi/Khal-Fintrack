package models

import "time"

type Transaction struct {
	ID          uint
	UserID      uint
	Type        string //income or expense
	Category    string //wether food or electricity etc
	Amount      float64
	Description string
	Date        time.Time
	Created     time.Time
	UpdatedAt   time.Time
}
