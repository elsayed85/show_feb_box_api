# Showbox & Febbox API Integration 📺 🎥

## 🚀 Overview

This repository provides an integration between two APIs: **Showbox** and **Febbox**. It allows developers to search for movies and TV shows, retrieve detailed information, and fetch files and download links associated with them via the **Febbox** platform.

---

## 🔧 Technologies Used

- **Node.js** (JavaScript runtime)
- **CryptoJS** (for encryption and decryption)
- **node-fetch** (for making HTTP requests)
- **JSDOM** (for parsing HTML responses)
- **nanoid** (for generating unique IDs)

---

## 📥 Installation

### 1. Clone the repository

```bash
git clone https://github.com/elsayed85/show_feb_box_api showbox
cd showbox

cp .env.example .env
```

### 2. Install Dependencies

Run the following command to install the required dependencies:

```bash
npm install
```

---

## 🛠️ API Overview

### **ShowboxAPI** 🎬

The **ShowboxAPI** class allows interaction with the **Showbox** platform to search for movies and TV shows, retrieve details, and fetch FebBox IDs associated with the content.

#### 🔑 Methods

- **`search(title, type, page, pagelimit)`**: Search for movies or TV shows by title.
- **`getMovieDetails(movieId)`**: Get detailed information for a movie by its ID.
- **`getShowDetails(showId)`**: Get detailed information for a TV show by its ID.
- **`getFebBoxId(id, type)`**: Retrieve the Febbox ID associated with a given movie or show.

#### 🛠️ Configuration

Ensure to configure the following constants in the `ShowboxAPI` class:

```js
// Set these constants
const CONFIG = {
    BASE_URL: 'https://mbpapi.shegu.net/api/api_client/index/', 
    APP_KEY: 'moviebox',
    APP_ID: 'com.tdo.showbox',
    IV: 'wEiphTn!',
    KEY: '123d6cedf626dy54233aa1w6',
};
```

---

### **FebboxAPI** 📂

The **FebboxAPI** class interacts with the **Febbox** platform to retrieve file lists and download links associated with Febbox share IDs.

#### 🔑 Methods

- **`getFileList(shareKey, parentId, isHtml)`**: Get a list of files for a specific share.
- **`getLinks(shareKey, fid)`**: Retrieve download links for a specific file.

#### 🛠️ Configuration

Ensure to set the **Febbox UI Cookie** for authentication:

```js
FEBBOX_UI_COOKIE='your_cookie_here'
```

## How to Get Your Febbox UI Token

Bring your own Febbox account to get the best streaming experience, including 4K quality, Dolby Atmos, and the fastest load times!

To get your **UI token**:

1. Visit [Febbox.com](https://www.febbox.com) and log in with Google (use a fresh account).
2. Open **DevTools** in your browser or inspect the page.
3. Go to the **Application** tab → **Cookies**.
4. Look for the cookie named **"ui"**.
5. Copy the **"ui"** cookie value.
6. Close the tab, but **do NOT log out** to keep your token valid.

**Important:**  
- **Do not share** your UI token with others as it is tied to your account. Treat it as a sensitive credential.

For more details on how to retrieve it, you can watch this guide:  
[Febbox UI Token Guide](https://vimeo.com/1059834885/c3ab398d42)


---

## ⚡ Example Usage

Here’s a full example of how to use both APIs in `main.js`:

```js
import ShowboxAPI from './ShowboxAPI.js';
import FebboxAPI from './FebboxAPI.js';

(async () => {
    const api = new ShowboxAPI();
    const febboxApi = new FebboxAPI();

    // Search for a movie
    const movieTitle = 'ratatouille';
    const results = await api.search(movieTitle, 'movie');
    const movie = results[0];
    console.log('🎬 Movie:', movie);

    // Fetch FebBox ID and file links for the movie
    let febBoxId = await api.getFebBoxId(movie.id, movie.box_type);
    if (febBoxId) {
        console.log('🔗 FebBox ID:', febBoxId);
        const files = await febboxApi.getFileList(febBoxId);
        console.log('📂 File List:', files);
        const file = files[1];
        const links = await febboxApi.getLinks(febBoxId, file.fid);
        console.log('🌐 Links:', links);
    }

    // Search for a TV show
    const showTitle = 'breaking bad';
    const showResults = await api.search(showTitle, 'tv');
    const show = showResults[0];
    console.log('📺 Show:', show);

    // Fetch show details and FebBox ID
    const showId = show.id;
    const showDetails = await api.getShowDetails(showId);
    console.log('📜 Show Details:', showDetails);

    febBoxId = await api.getFebBoxId(show.id, show.box_type);
    if (febBoxId) {
        const files = await febboxApi.getFileList(febBoxId);
        console.log('📂 File List:', files);
        const file = files[4];
        if (file.is_dir) {
            const seasonFiles = await febboxApi.getFileList(febBoxId, file.fid);
            console.log('📂 Season Files:', seasonFiles);
            const seasonFile = seasonFiles[0];
            const links = await febboxApi.getLinks(febBoxId, seasonFile.fid);
            console.log('🌐 Season Links:', links);
        } else {
            const links = await febboxApi.getLinks(febBoxId, file.fid);
            console.log('🌐 Links:', links);
        }
    }
})();
```

---

## 💡 Additional Features & Options

- **Search by Type**: Search for movies, TV shows, or other content types using the `type` parameter in the `search()` method.
- **File List**: Fetch the list of available files for a given share key. This is useful for accessing individual episodes, seasons, or other media content.
- **Download Links**: Retrieve direct download links for video files in multiple qualities (HD, SD, etc.).
- **Encryption**: All API requests to **Showbox** are encrypted for security using **TripleDES** and **MD5** hashing.

---

## 🛠️ Advanced Usage

### **Customizing Parameters**

You can customize parameters when calling the `search()` method for more specific results:

```js
const searchResults = await api.search('the godfather', 'movie', 2, 30);
```

- **title**: The movie or show title.
- **type**: Type of content (`movie`, `tv`, `all`).
- **page**: The page number (default: 1).
- **pagelimit**: Number of results per page (default: 20).

### **Handling File Links**

For each file retrieved, you can fetch its download links by calling `getLinks()`:

```js
const links = await febboxApi.getLinks(febBoxId, file.fid);
console.log('📡 File Links:', links);
```

---

## Docker Setup

### Build and Run

To build and start the application in detached mode, use:

```bash
docker-compose up -d --build
```
---

## API Documentation

This API provides access to the Showbox and Febbox services, allowing you to search for movies and TV shows, fetch detailed information, and get download links from Febbox.

### Base URL
```
http://localhost:3000/api
```

### Endpoints

#### 1. **Search Movies or TV Shows**
Search for movies or TV shows by title. You can specify the type (`movie`, `tv`, or `all`), and customize the pagination with `page` and `pagelimit`.

- **Endpoint:**
  ```
  GET /api/search/:type
  ```
  
- **Parameters:**
  - `type`: The type of content to search (`all`, `movie`, `tv`).
  - `title`: The title to search for.
  - `page`: The page number (default: 1).
  - `pagelimit`: The number of results per page (default: 20).

- **Example:**
  - Search for TV shows with title "Breaking Bad":
    ```
    http://localhost:3000/api/search/tv?title=breaking%20bad
    ```
  - Search for movies with title "Ratatouille":
    ```
    http://localhost:3000/api/search/movie?title=Ratatouille
    ```

#### 2. **Get Movie Details**
Fetch details for a specific movie.

- **Endpoint:**
  ```
  GET /api/movie/:id
  ```
  
- **Parameters:**
  - `id`: The ID of the movie.

- **Example:**
  - Get details for movie with ID `899`:
    ```
    http://localhost:3000/api/movie/899
    ```

#### 3. **Get Show Details**
Fetch details for a specific TV show.

- **Endpoint:**
  ```
  GET /api/show/:id
  ```

- **Parameters:**
  - `id`: The ID of the TV show.

- **Example:**
  - Get details for show with ID `125`:
    ```
    http://localhost:3000/api/show/125
    ```

#### 4. **Get Febbox ID**
Retrieve the Febbox ID for a specific movie or TV show.

- **Endpoint:**
  ```
  GET /api/febbox/id
  ```

- **Parameters:**
  - `id`: The ID of the movie or show.
  - `type`: The type of content (`1` for movie, `2` for TV show).

- **Example:**
  - Get FebBox ID for TV show with ID `125`:
    ```
    http://localhost:3000/api/febbox/id?id=125&type=2
    ```

#### 5. **Get File List from Febbox**
Fetch a list of files from a shared Febbox folder. Optionally, navigate subfolders using the `parent_id` parameter.

- **Endpoint:**
  ```
  GET /api/febbox/files/:shareKey
  ```

- **Parameters:**
  - `shareKey`: The share key of the Febbox folder.
  - `parent_id`: The ID of the parent folder (default: 0).

- **Example:**
  - Get file list from FebBox folder:
    ```
    http://localhost:3000/api/febbox/files/fNBTg8at
    ```
  - Navigate to subfolder (e.g., `season`):
    ```
    http://localhost:3000/api/febbox/files/fNBTg8at?parent_id=2636635
    ```

#### 6. **Get Download Links for a File**
Fetch download links for a specific file from Febbox.

- **Endpoint:**
  ```
  GET /api/febbox/links/:shareKey/:fid
  ```

- **Parameters:**
  - `shareKey`: The share key of the Febbox folder.
  - `fid`: The file ID.
  
- **Example:**
  - Get download links for file with ID `2636650`:
    ```
    http://localhost:3000/api/febbox/links/fNBTg8at/2636650
    ```

### Sample Requests

1. **Search for TV Shows:**
   - `http://localhost:3000/api/search/tv?title=breaking%20bad`

2. **Search for Movies:**
   - `http://localhost:3000/api/search/movie?title=Ratatouille`

3. **Get Movie Details:**
   - `http://localhost:3000/api/movie/899`

4. **Get Show Details:**
   - `http://localhost:3000/api/show/125`

5. **Get Febbox ID for TV Show:**
   - `http://localhost:3000/api/febbox/id?id=125&type=2`

6. **Get Febbox Files (Default Folder):**
   - `http://localhost:3000/api/febbox/files/fNBTg8at`

7. **Get Febbox Files (Subfolder Navigation):**
   - `http://localhost:3000/api/febbox/files/fNBTg8at?parent_id=2636635`

8. **Get Download Links from Febbox:**
   - `http://localhost:3000/api/febbox/links/fNBTg8at/2636650`

---


## 🤝 Contributing

We welcome contributions! If you'd like to add features, fix bugs, or improve the documentation, feel free to:

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Push to the branch and create a pull request.
