package models

import (
	"database/sql"
	"fmt"
	_ "github.com/lib/pq"
	"log"
	"time"

	"github.com/sg3t41/syomei_api/pkg/setting"
)

var db *sql.DB

// Model : DBレコードに共通するフィールド
type Model struct {
	ID        int `json:"id"`
	CreatedAt int `json:"created_at"`
	UpdatedAt int `json:"updated_at"`
	DeletedAt int `json:"deleted_at"`
}

// Setup : データベースのセットアップ関数
func Setup() {
	var err error
	dsn := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		setting.DatabaseSetting.Host,
		setting.DatabaseSetting.Port,
		setting.DatabaseSetting.User,
		setting.DatabaseSetting.Password,
		setting.DatabaseSetting.Name)

	db, err = sql.Open(setting.DatabaseSetting.Type, dsn)
	if err != nil {
		log.Fatalf("models.Setup err: %v", err)
	}

	db.SetMaxIdleConns(10)
	db.SetMaxOpenConns(100)

	//DBへの疎通確認
	err = db.Ping()
	if err != nil {
		log.Fatalf("db.Ping err: %v", err)
	}
}

// CloseDB : データベース接続を閉じる
func CloseDB() {
	if db != nil {
		db.Close()
	}
}

// CreateRecord : 新しいレコードを作成する関数
func CreateRecord(query string, args ...interface{}) (int64, error) {
	var lastInsertId int64
	nowTime := time.Now().Format("2006-01-02 15:04:05")
	args = append(args, nowTime, nowTime) // CreatedAtとUpdatedAt用
	err := db.QueryRow(query+" RETURNING id", args...).Scan(&lastInsertId)
	if err != nil {
		return 0, err
	}
	return lastInsertId, nil
}

// UpdateRecord : レコードを更新する関数
func UpdateRecord(query string, args ...interface{}) (int64, error) {
	nowTime := time.Now().Format("2006-01-02 15:04:05")
	args = append(args, nowTime) // UpdatedAt用
	result, err := db.Exec(query, args...)
	if err != nil {
		return 0, err
	}
	return result.RowsAffected()
}

// SoftDeleteRecord : レコードをソフトデリートする関数
func SoftDeleteRecord(query string, args ...interface{}) (int64, error) {
	nowTime := time.Now().Format("2006-01-02 15:04:05")
	args = append(args, nowTime) // DeletedAt用
	result, err := db.Exec(query, args...)
	if err != nil {
		return 0, err
	}
	return result.RowsAffected()
}

