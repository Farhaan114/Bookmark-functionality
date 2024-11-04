import React, { useEffect, useState } from 'react';
import axiosInstance from '../services/axiosInstance'; // Import your configured axios instance
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaStar, FaRegStar } from 'react-icons/fa'; // Importing star icons from react-icons
import './items.css';

const Items = () => {
  const [items, setItems] = useState([]); // State to hold the items
  const [bookmarkedItems, setBookmarkedItems] = useState(new Set()); // State to track bookmarked items
  const [searchQuery, setSearchQuery] = useState(''); // State for the search query
  const nav = useNavigate();

  useEffect(() => {
    const getItems = async () => {
      try {
        const result = await axiosInstance.get('/api/items'); // Fetching items from the items endpoint
        setItems(result.data); // Set items data

        // Load user bookmarks from the server
        const token = localStorage.getItem('token'); // Assuming token is stored here
        const bookmarkResponse = await axiosInstance.get('/api/bookmarks', {
          headers: {
            Authorization: `Bearer ${token}`, // Add the token to the request
          },
        });

        const bookmarksSet = new Set(bookmarkResponse.data.bookmarks.map(item => item.id)); // Create a Set for bookmarked IDs
        setBookmarkedItems(bookmarksSet); // Set the state with bookmarked IDs
      } catch (error) {
        console.error(error);
        toast.error('Failed to fetch items. Please try again later.');
      }
    };

    getItems();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success('You have logged out successfully.');
    setTimeout(() => {
      nav('/');
    }, 2000);
  };

  const handleBookmark = async (itemId) => {
    const itemToBookmark = items.find(item => item.id === itemId);
    
    if (!itemToBookmark) {
      toast.error('Item not found.');
      return;
    }
  
    const isBookmarked = bookmarkedItems.has(itemId);
  
    try {
      if (isBookmarked) {
        // Remove bookmark from the database
        await axiosInstance.delete(`/api/bookmarks`, { data: { itemId } });
        setBookmarkedItems(prev => {
          const updatedBookmarks = new Set(prev);
          updatedBookmarks.delete(itemId); // Remove bookmark
          return updatedBookmarks;
        });
        toast.info('Bookmark removed');
      } else {
        // Add bookmark to the database
        await axiosInstance.post('/api/bookmarks', { itemId });
        setBookmarkedItems(prev => {
          const updatedBookmarks = new Set(prev);
          updatedBookmarks.add(itemId); // Add bookmark
          return updatedBookmarks;
        });
        toast.success('Item bookmarked');
      }
  
      // Update local storage
      const storedBookmarks = JSON.parse(localStorage.getItem('bookmarkedItems')) || [];
      if (!isBookmarked) {
        // If adding a bookmark
        if (!storedBookmarks.find(item => item.id === itemId)) {
          storedBookmarks.push(itemToBookmark); // Add item to bookmarks
        }
      } else {
        // If removing a bookmark
        const index = storedBookmarks.findIndex(item => item.id === itemId);
        if (index > -1) {
          storedBookmarks.splice(index, 1); // Remove item from bookmarks
        }
      }
      localStorage.setItem('bookmarkedItems', JSON.stringify(storedBookmarks));
    } catch (error) {
      console.error('Error updating bookmark:', error);
      toast.error('Failed to update bookmark.');
    }
  };

  // Filter items based on search query
  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      <h2>Items</h2>
      <h4>Here are the items you can browse and bookmark!</h4>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by title or URL..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-input"
      />
      <div className='button-box'>
      <button className="logout-button" onClick={() => nav('/bookmarks')}>Go to Bookmarks</button>
      <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>
      <div className="item-grid">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <div key={item.id} className="item-card">
              <h3>{item.title}</h3>
              <p>URL: <a href={`https://${item.url}`} target="_blank" rel="noopener noreferrer">{item.url}</a></p>
              <button className="bookmark-button" onClick={() => handleBookmark(item.id)}>
                {bookmarkedItems.has(item.id) ? (
                  <FaStar color="#FFD700" /> 
                ) : (
                  <FaRegStar color="#ccc" />
                )}
              </button>
            </div>
          ))
        ) : (
          <p>No items found.</p>
        )}
      </div>
      
      <ToastContainer />
    </div>
  );
};

export default Items;
