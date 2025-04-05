import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';

const FEBBOX_UI_COOKIE = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NDI0OTcyNTQsIm5iZiI6MTc0MjQ5NzI1NCwiZXhwIjoxNzczNjAxMjc0LCJkYXRhIjp7InVpZCI6MTg5MTg3LCJ0b2tlbiI6ImJkYzNiNjY3NDdkNmY1NDNmMGY2YzhjZjA5MDhjNmEwIn19.6nljeQlQ-bqVdm8wMVooQdj1J6ljpUhCx_58ruuL6M4';

class FebboxAPI {
    constructor() {
        this.baseUrl = 'https://www.febbox.com';
        this.headers = this._getDefaultHeaders();
    }

    // Default headers used for all requests
    _getDefaultHeaders() {
        return {
            'x-requested-with': 'XMLHttpRequest',
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36',
            'cookie': `ui=${FEBBOX_UI_COOKIE}`,
        };
    }

    // Helper method to create the referer header for each request
    _setReferer(shareKey) {
        this.headers.referer = `https://www.febbox.com/share/${shareKey}`;
    }

    // Fetch JSON data from a URL
    async _fetchJson(url) {
        const response = await fetch(url, { headers: this.headers });
        if (!response.ok) throw new Error(`Error fetching data from ${url}: ${response.statusText}`);
        return response.json();
    }

    // Get the list of files from a shared folder
    async getFileList(shareKey, parentId = 0) {
        const url = `${this.baseUrl}/file/file_share_list?share_key=${shareKey}&pwd=&parent_id=${parentId}&is_html=0`;
        this._setReferer(shareKey);

        const data = await this._fetchJson(url);
        return data.data.file_list;
    }

    // Get video file qualities and links from a shared video
    async getLinks(shareKey, fid) {
        const url = `${this.baseUrl}/console/video_quality_list?fid=${fid}`;
        this._setReferer(shareKey);

        const data = await this._fetchJson(url);
        const htmlResponse = data.html;

        // Parse HTML response and extract file qualities
        const dom = new JSDOM(htmlResponse);
        const doc = dom.window.document;

        return this._extractFileQualities(doc);
    }

    // Extract file qualities from the parsed DOM
    _extractFileQualities(doc) {
        return Array.from(doc.querySelectorAll('.file_quality')).map(fileDiv => {
            const url = fileDiv.getAttribute('data-url');
            const quality = fileDiv.getAttribute('data-quality');
            const name = fileDiv.querySelector('.name')?.textContent.trim();
            const speed = fileDiv.querySelector('.speed span')?.textContent.trim();
            const size = fileDiv.querySelector('.size')?.textContent.trim();

            return { url, quality, name, speed, size };
        });
    }
}

export default FebboxAPI;
