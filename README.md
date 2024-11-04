# Bookmarks Dashboard

A React-based dashboard application for managing and viewing bookmarks. The dashboard allows users to view, search, and remove their saved bookmarks, with a visually appealing UI and responsive design.

## Features

- **View Bookmarks**: Lists all saved bookmarks with options to view details.
- **Search Functionality**: Filter bookmarks by title or URL.
- **Bookmark Management**: Remove bookmarks with a single click.
- **Responsive Design**: Adapts to various screen sizes for an optimal experience.
- **Authentication**: Uses token-based authentication for secure access.

## Technologies Used

- **Frontend**: React, React Router, Axios, React Icons, CSS
- **Backend**: Node.js, Express.js (for API)
- **Database**: MongoDB (for storing bookmarks and user data)
- **Styling**: Custom CSS, react-toastify for notifications

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v14+)
- npm or yarn
- MySQL or any other dbms software (if running the backend locally)

## Setup and Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/bookmarks-dashboard.git
   cd bookmarks-dashboard

   ```
2. **Install dependencies on the frontend and backend**
   ```bash
   npm install
   ```
   
4. **Configure Environment Variables**
   Create a .env file in the root directory and add your environment variables:
5. **Create a database and run the queries in the sql file provided**
   
6. **Run the Application on the front and back end**
   -- frontend : 
   ```bash
   npm run dev 
   ```
7. **Start the Backend Server**
   ```bash
   npm start
   ```
   --or
   ```bash
   nodemon index.js
   ```

## Screenshots 
- Login ![image](https://github.com/user-attachments/assets/0f365ce1-ebe0-4689-8300-6a31b226d58a)
- Items Page ![image](https://github.com/user-attachments/assets/f31ab0d5-6b8c-4c18-93f2-b14aec700654)
- Search filter ![image](https://github.com/user-attachments/assets/47b88a17-5966-4861-8396-4670213c730e)
- Remove a bookmark by clicking the star icon ![image](https://github.com/user-attachments/assets/5065d0e7-e17d-42fd-886a-a96dbb639b23)
- Add a Bookmark ![image](https://github.com/user-attachments/assets/4803d146-d126-4d86-a0c6-d76b0de89dce)

- Manage bookmarks ![image](https://github.com/user-attachments/assets/bb70dc1c-d3a8-44d1-8283-f835f01cafde)



    
## Usage
- View Bookmarks: Log in, and all bookmarks associated with your account will be displayed on the dashboard.
- Search Bookmarks: Use the search bar to filter bookmarks by title or URL.
- Remove Bookmarks: Click the "Remove Bookmark" button to delete a bookmark.
- Add Bookmarks: Navigate to the "Items" page and add items to your bookmarks.

## API Endpoints
The application interacts with a backend API to manage bookmarks. Below are the endpoints used:

- GET /api/bookmarks: Fetch all bookmarks for the logged-in user.
- DELETE /api/bookmarks: Remove a bookmark by item ID. Requires an item ID in the request body.
- POST /api/bookmarks: Add a new bookmark.

## License
This project is licensed under the MIT License.

Contact
For questions, please contact Farhaan114 (FraanKey).

Enjoy using Bookmarks Dashboard! 😊
