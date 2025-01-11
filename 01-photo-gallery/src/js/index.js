import '../css/index.css';

// Fetch API URL and Access Key from environment variables
const apiUrl = import.meta.env.VITE_UNSPLASH_API_URL;
const accessKey = import.meta.env.VITE_ACCESS_KEY;

// Select DOM elements
const galleryEl = document.querySelector('.gallery');
const formEl = document.querySelector('form');

// Event listener for form submission
formEl.addEventListener('submit', (e) => {
  e.preventDefault();
  clearPreviousErrorMessage();

  const numberOfPhotos = +formEl.photoNumber.value;

  if (numberOfPhotos < 1 || numberOfPhotos > 10) {
    displayMaxNumberWarning();
  } else {
    fetchPhotos(numberOfPhotos);
  }
});

// Function to clear previous error message
const clearPreviousErrorMessage = () => {
  const errorMessageEl = document.querySelector('form p');
  if (errorMessageEl) {
    formEl.removeChild(errorMessageEl);
  }
};

// Function to display a warning message for invalid input
const displayMaxNumberWarning = () => {
  const errorMessageEl = document.createElement('p');
  errorMessageEl.textContent = 'Insert a Number between 1 and 10';
  formEl.appendChild(errorMessageEl);
};

// Function to fetch photos from the API
const fetchPhotos = async (numberOfPhotos) => {
  const urlWithQuery = `/.netlify/functions/fetchPhotos?count=${numberOfPhotos}`;
  try {
    setLoadingState(true);
    const response = await fetch(urlWithQuery);
    if (!response.ok) {
      throw new Error(
        `Server error: ${response.status} ${response.statusText}`
      );
    }
    const data = await response.json();
    if (data.error) {
      throw new Error(data.error);
    }
    displayPhotos(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    displayErrorMessage(error.message);
  } finally {
    setLoadingState(false);
  }
};

// Function to display error messages
const displayErrorMessage = (message) => {
  const errorMessageEl = document.createElement('p');
  errorMessageEl.textContent = message;
  formEl.appendChild(errorMessageEl);
};

// Function to set loading state
const setLoadingState = (isLoading) => {
  const loadingEl = document.querySelector('.loading');
  if (isLoading) {
    if (!loadingEl) {
      const loadingMessage = document.createElement('p');
      loadingMessage.className = 'loading';
      loadingMessage.textContent = 'Loading...';
      formEl.appendChild(loadingMessage);
    }
  } else {
    if (loadingEl) {
      formEl.removeChild(loadingEl);
    }
  }
};

// Function to display photos in the gallery
const displayPhotos = (data) => {
  const images = data.map((img) => {
    const imageEl = document.createElement('img');
    imageEl.src = img.urls.small;
    return imageEl;
  });
  galleryEl.innerHTML = '';
  images.forEach((img) => {
    galleryEl.appendChild(img);
  });
};
