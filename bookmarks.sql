-- this query file will make you set up your database for using the bookmarks funcitonality

-- Step 1: Create a new database named 'bookmarks'
CREATE DATABASE bookmarks;

-- Switch to the 'bookmarks' database
USE bookmarks;

-- Step 2: Create the 'users' table to store user data
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,         -- Unique identifier for each user
    username VARCHAR(255) UNIQUE NOT NULL,     -- Username (must be unique)
    password VARCHAR(255) NOT NULL,            -- Password (hashed for security)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Timestamp of account creation
);

-- Step 3: Create the 'items' table to store information about bookmarkable items
CREATE TABLE items (
    id INT AUTO_INCREMENT PRIMARY KEY,         -- Unique identifier for each item
    title VARCHAR(255) NOT NULL,               -- Title of the item (e.g., website name)
    url TEXT NOT NULL,                         -- URL of the item
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Timestamp when item was added
);

-- Step 4: Create the 'bookmarks' table to manage bookmarked items by users
CREATE TABLE IF NOT EXISTS bookmarks (
    id INT AUTO_INCREMENT PRIMARY KEY,         -- Unique identifier for each bookmark
    user_id INT NOT NULL,                      -- References the user who created the bookmark
    item_id INT NOT NULL,                      -- References the item being bookmarked
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp of bookmark creation
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE, -- Cascade delete if user is removed
    FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE, -- Cascade delete if item is removed
    UNIQUE KEY unique_bookmark (user_id, item_id) -- Ensures a user can only bookmark an item once
);

-- Step 5: Insert a test user (username: 'test2', password: 'abc') into the 'users' table
INSERT INTO users(username, password) VALUES ('test2', 'abc');

-- Step 6: Insert an initial item into the 'items' table (title: 'Login page', url: 'cool.com')
INSERT INTO items(title, url) VALUES ('Login page', 'cool.com');

-- Step 7: Insert multiple sample items into the 'items' table for testing purposes
INSERT INTO items (title, url) VALUES 
('Google', 'google.com'),
('YouTube', 'youtube.com'),
('Facebook', 'facebook.com'),
('Twitter', 'twitter.com'),
('Instagram', 'instagram.com'),
('LinkedIn', 'linkedin.com'),
('Spotify', 'spotify.com'),
('Netflix', 'netflix.com'),
('Amazon', 'amazon.com'),
('Reddit', 'reddit.com'),
('Wikipedia', 'wikipedia.org'),
('Yahoo', 'yahoo.com'),
('Bing', 'bing.com'),
('GitHub', 'github.com'),
('Dropbox', 'dropbox.com'),
('Slack', 'slack.com'),
('Pinterest', 'pinterest.com'),
('WhatsApp Web', 'web.whatsapp.com'),
('Airbnb', 'airbnb.com'),
('Coursera', 'coursera.org'),
('Medium', 'medium.com'),
('Quora', 'quora.com'),
('GitLab', 'gitlab.com'),
('Trello', 'trello.com'),
('Asana', 'asana.com'),
('Zoom', 'zoom.us'),
('Salesforce', 'salesforce.com'),
('Twitch', 'twitch.tv'),
('Stack Overflow', 'stackoverflow.com'),
('Adobe', 'adobe.com');

-- Step 8: Bookmark an item (user_id: 1, item_id: 1) for testing purposes
INSERT INTO bookmarks(user_id, item_id) VALUES (1, 1);

-- Step 9: Run these queries to inspect the tables and verify data:
SELECT * FROM login_attempts; -- Check login attempts (if table exists)
SELECT * FROM users; -- View all users in the 'users' table
SELECT * FROM items; -- View all items in the 'items' table
SELECT * FROM bookmarks WHERE user_id = 3; -- View bookmarks for a specific user (user_id: 3)
SELECT * FROM bookmarks; -- View all bookmarks
