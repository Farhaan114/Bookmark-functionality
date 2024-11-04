import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import axios from 'axios';
import "./bookmarks.css";

const Bookmarks = () => {
  const userId = localStorage.getItem('userId');
  const [bookmarkedItems, setBookmarkedItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // State to hold the search query
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/bookmarks', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBookmarkedItems(response.data.bookmarks);
      } catch (error) {
        console.error("Error fetching bookmarks:", error);
        toast.error("Failed to fetch bookmarks.");
      }
    };
  
    if (userId) {
      fetchBookmarks();
    } else {
      toast.error("User not found.");
    }
  }, [userId]);

  const handleRemoveBookmark = async (itemId) => {
    try {
      await axios.delete('http://localhost:5000/api/bookmarks', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        data: { itemId },
      });

      const updatedBookmarks = bookmarkedItems.filter((item) => item.id !== itemId);
      setBookmarkedItems(updatedBookmarks);
      toast.info('Bookmark removed');
    } catch (error) {
      console.error("Error removing bookmark:", error);
      toast.error("Failed to remove bookmark.");
    }
  };

  // Filter bookmarks based on search query
  const filteredBookmarks = bookmarkedItems.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bookmarks-dashboard">
      <ToastContainer />
      <h2>Your Bookmarks</h2>
      
      {/* Search input field */}
      <input
        type="text"
        placeholder="Search by title or URL"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-input"
      />

      {filteredBookmarks.length > 0 ? (
        <div className="card-container">
          {filteredBookmarks.map((item) => (
            <div key={item.id} className="card">
              <h3>{item.title}</h3>
              <p>
                URL: <a href={`https://${item.url}`} target="_blank" rel="noopener noreferrer">{item.url}</a>
              </p>
              <button className="remove-bookmark-button" onClick={() => handleRemoveBookmark(item.id)}>
                Remove Bookmark
              </button>
              <button className="bookmark-icon" title="Item bookmarked">
                <FaStar color="#FFD700" />
                <span className="tooltip">Item bookmarked</span>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No bookmarks found.</p>
      )}
      <button className="nav-button" onClick={() => navigate('/items')}>Go to Items</button>
    </div>
  );
};

export default Bookmarks;
