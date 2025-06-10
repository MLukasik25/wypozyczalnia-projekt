# Aplikacja webowa – Wypożyczalnia samochodów

Projekt inżynierski stworzony w ramach pracy dyplomowej.

## Struktura repozytorium

* `backend/` – API stworzone w *Node.js* + *Express* (z *JWT*, *MySQL*)
* `frontend/` – Interfejs użytkownika oparty na *React*
* `sql/` – Skrypt bazy danych `baza.sql` do zaimportowania w *MySQL*

## Wymagania

* *Node.js* v18+
* *MySQL* v8+
* *npm*

## Jak uruchomić projekt

### 1. Baza danych

Zaimportuj plik `sql/baza.sql` do swojego serwera *MySQL*, np.:

```bash
mysql -u root -p < sql/"Skrypt import.sql"
```

Lub użyj narzędzia typu *MySQL Workbench*, *phpMyAdmin* itp.

### 2. Backend

```bash
cd backend
npm install
npm start
```

Serwer uruchamia się domyślnie na `http://localhost:5000`
W celu korzystania z konta administratora, należy go dodać poprzez endpoint http://localhost:5000/api/auth/dodaj-admina

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend będzie dostępny na `http://localhost:5173`

## Funkcjonalności aplikacji

* Logowanie i rejestracja użytkowników z JWT
* Podział ról: klient, pracownik, administrator
* Zarządzanie samochodami, rezerwacjami, fakturami i naprawami
* Widoki i dostęp uzależniony od roli
* Frontend responsywny i estetyczny (React + CSS)

## 📅 Rok akademicki

2024/2025

## Autor

Michał Łukasik
WSB Merito Gdańsk
Kierunek: Informatyka
